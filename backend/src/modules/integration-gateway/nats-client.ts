import { connect, type NatsConnection, JSONCodec, AckPolicy } from 'nats';

let nc: NatsConnection | undefined;
export const codec = JSONCodec();

/** Durable consumer name shared between stream setup and the delivery worker. */
export const WEBHOOK_DELIVERY_DURABLE = 'webhook-delivery';

/**
 * Connects to NATS JetStream, ensures the EPMP_EVENTS stream exists, and
 * ensures the durable `webhook-delivery` pull consumer exists on it (so the
 * delivery worker can attach via the modern `consumers.get()` + `.consume()`
 * API rather than the legacy `pullSubscribe`, which requires pre-creating
 * the consumer through the exact same JetStreamManager call anyway).
 *
 * Per DEPLOY-01's "app starts without external services" principle, extended
 * here: a NATS outage at boot must NOT crash the server. Callers (server.ts)
 * wrap this in try/catch — routes that only need DB access (e.g. webhook
 * subscription registration) keep working; only the delivery worker and
 * publishEvent() need a live connection, and both degrade gracefully when
 * absent (publishEvent throws, callers catch and log — see sso.ts).
 */
export async function connectNats(): Promise<void> {
  nc = await connect({ servers: process.env.NATS_URL ?? 'nats://localhost:4222' });
  const jsm = await nc.jetstreamManager();
  await jsm.streams.add({ name: 'EPMP_EVENTS', subjects: ['epmp.events.>'] }).catch(() => {
    // Stream already exists — add() is not idempotent across restarts, this is expected.
  });
  await jsm.consumers
    .add('EPMP_EVENTS', {
      durable_name: WEBHOOK_DELIVERY_DURABLE,
      ack_policy: AckPolicy.Explicit,
    })
    .catch(() => {
      // Consumer already exists — same idempotency note as the stream above.
    });
}

/**
 * Durably publishes an event to the EPMP_EVENTS JetStream stream. Throws if
 * NATS isn't connected — callers that must not block on event-bus outages
 * (e.g. the login flow in sso.ts) catch and log rather than propagate.
 */
export async function publishEvent(eventType: string, payload: object): Promise<void> {
  if (!nc) throw new Error('NATS not connected');
  const js = nc.jetstream();
  await js.publish(
    `epmp.events.${eventType}`,
    codec.encode({ event_type: eventType, payload, published_at: new Date().toISOString() }),
  );
}

export function getNatsConnection(): NatsConnection | undefined {
  return nc;
}
