import { createHash } from 'node:crypto';
import { query } from '../../db/client.js';
import { getNatsConnection, codec, WEBHOOK_DELIVERY_DURABLE } from './nats-client.js';

interface WebhookSubscriptionRow {
  id: string;
  callback_url: string;
  event_types: string[];
  active: boolean;
}

interface DecodedEvent {
  event_type: string;
  payload: object;
  published_at: string;
}

/**
 * Exponential backoff with a 1-hour cap, used by the delivery worker's
 * background_jobs bookkeeping. Exported so any other background_jobs
 * consumer (future plans) can reuse the same convention rather than
 * reimplementing it — per Y2-errors.md's "base interval doubling per
 * consecutive failure, capped at 1 hour".
 */
export function computeBackoff(failureCount: number): Date {
  const baseMs = 60_000; // 1 minute
  const capMs = 60 * 60_000; // 1 hour
  const delayMs = Math.min(baseMs * 2 ** failureCount, capMs);
  return new Date(Date.now() + delayMs);
}

/**
 * Starts a JetStream pull consumer on the durable `webhook-delivery`
 * consumer of the EPMP_EVENTS stream (created in connectNats()), delivering
 * each event to every active webhook_subscriptions row whose event_types
 * includes the event's type. Dedup is enforced at the database layer via
 * `UNIQUE (subscription_id, idempotency_key)` + `ON CONFLICT DO NOTHING` —
 * not an application-level set, which could race under concurrent delivery.
 *
 * Uses the modern `consumers.get()` + `.consume()` API (continuous
 * auto-pulling async iterable) rather than the legacy `pullSubscribe`, which
 * requires manually re-issuing `.pull()` calls to keep messages flowing.
 *
 * Skips starting entirely if NATS isn't connected, matching the
 * graceful-degradation principle in nats-client.ts/server.ts: a NATS outage
 * at boot must not crash the server.
 */
export async function startWebhookDeliveryWorker(): Promise<void> {
  const nc = getNatsConnection();
  if (!nc) return;

  // Find-or-update rather than blind INSERT: background_jobs has no UNIQUE
  // constraint on job_type, and this function runs on every server boot
  // (server.ts calls it once per start()). A bare INSERT would accumulate a
  // duplicate 'webhook_delivery' row per restart, which both inflates
  // platform-health's alerts array with repeats of the same job and makes
  // bumpJobFailure's `WHERE job_type = 'webhook_delivery'` UPDATE touch every
  // duplicate row at once. Matches the find-or-insert idempotency pattern
  // established by scripts/seed.ts for tables without a natural UNIQUE key.
  const existing = await query<{ id: string }>(
    `SELECT id FROM background_jobs WHERE job_type = 'webhook_delivery' LIMIT 1`,
  );
  if (existing[0]) {
    await query(
      `UPDATE background_jobs SET status = 'running', last_run_at = now() WHERE id = $1`,
      [existing[0].id],
    );
  } else {
    await query(
      `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ($1, 'running', now())`,
      ['webhook_delivery'],
    );
  }

  const js = nc.jetstream();
  const consumer = await js.consumers.get('EPMP_EVENTS', WEBHOOK_DELIVERY_DURABLE);
  const messages = await consumer.consume();

  (async () => {
    for await (const msg of messages) {
      try {
        const decoded = codec.decode(msg.data) as DecodedEvent;
        const subs = await query<WebhookSubscriptionRow>(
          `SELECT id, callback_url, event_types, active FROM webhook_subscriptions WHERE active = true AND $1 = ANY(event_types)`,
          [decoded.event_type],
        );

        for (const subscription of subs) {
          const idempotencyKey = createHash('sha256')
            .update(`${subscription.id}:${msg.seq}`)
            .digest('hex');

          const inserted = await query<{ id: string }>(
            `INSERT INTO webhook_deliveries (subscription_id, idempotency_key, event_type, payload)
             VALUES ($1, $2, $3, $4) ON CONFLICT (subscription_id, idempotency_key) DO NOTHING RETURNING id`,
            [subscription.id, idempotencyKey, decoded.event_type, JSON.stringify(decoded.payload)],
          );

          if (inserted.length === 0) {
            // DUPLICATE_DELIVERY_IGNORED — already processed, silent no-op per Y2-errors.md.
            continue;
          }

          try {
            const res = await fetch(subscription.callback_url, {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                idempotency_key: idempotencyKey,
                event_type: decoded.event_type,
                payload: decoded.payload,
                delivered_at: new Date().toISOString(),
              }),
            });

            await query(
              `UPDATE webhook_deliveries SET delivery_status = $1, attempt_count = attempt_count + 1
               WHERE subscription_id = $2 AND idempotency_key = $3`,
              [res.ok ? 'delivered' : 'failed', subscription.id, idempotencyKey],
            );

            if (!res.ok) {
              await bumpJobFailure();
            }
          } catch {
            await query(
              `UPDATE webhook_deliveries SET delivery_status = 'failed', attempt_count = attempt_count + 1, next_retry_at = $1
               WHERE subscription_id = $2 AND idempotency_key = $3`,
              [computeBackoff(1), subscription.id, idempotencyKey],
            );
            await bumpJobFailure();
          }
        }

        msg.ack();
      } catch (err) {
        console.warn('webhook delivery worker: error processing message', err);
        msg.ack();
      }
    }
  })();
}

async function bumpJobFailure(): Promise<void> {
  const rows = await query<{ failure_count: number }>(
    `SELECT failure_count FROM background_jobs WHERE job_type = 'webhook_delivery' ORDER BY created_at DESC LIMIT 1`,
  );
  const failureCount = (rows[0]?.failure_count ?? 0) + 1;
  await query(
    `UPDATE background_jobs SET status = 'backoff', failure_count = $1, next_retry_at = $2
     WHERE job_type = 'webhook_delivery'`,
    [failureCount, computeBackoff(failureCount)],
  );
}
