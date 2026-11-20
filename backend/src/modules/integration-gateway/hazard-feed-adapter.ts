import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { computeBackoff } from './webhook-delivery-worker.js';

interface HazardFeedEvent {
  id: string;
  type: string;
  severity?: string;
  geometry: GeoJSON.Geometry;
  confidence: 'High' | 'Medium' | 'Low';
  source: string;
  issued_at: string;
  expires_at?: string;
}

interface HazardFeedAdapterResponse {
  feed: string;
  events: HazardFeedEvent[];
}

// No real NOAA/NWS/USGS vendor credential exists in this sandbox (F12 is a
// deterministic adapter stub per this plan's objective, following F11's
// gis-adapter.ts precedent exactly). This stub recognizes exactly ONE
// feed_name as a live, successfully-reachable vendor — every other
// feed_name deterministically simulates a vendor timeout, exercising the
// exact failure path a real unreachable NWS/USGS endpoint would trigger.
// Swapping in a real vendor call later means replacing only this function's
// body; every caller (operating-picture.ts, runHazardFeedIngestion below)
// is unaffected.
const KNOWN_LIVE_FEED = 'NOAA';

/**
 * Fetches hazard-feed events for a single configured feed. Recognizes
 * exactly 'NOAA' as a live feed (returns synthetic, provenance-complete
 * events); any other feed_name ('NWS', 'USGS', or anything unrecognized)
 * deterministically throws HAZARD_FEED_UNREACHABLE, mirroring
 * gis-adapter.ts's fetchGisFeatures unrecognized-layer-id timeout branch.
 */
export async function fetchHazardFeedEvents(
  feedName: string,
  since?: string,
): Promise<HazardFeedAdapterResponse> {
  if (feedName !== KNOWN_LIVE_FEED) {
    // Any feed this stub doesn't recognize simulates a vendor timeout —
    // exercises the exact failure path a real unreachable NWS/USGS endpoint
    // would trigger.
    await recordFeedHealth(feedName, 'offline');
    throw new Error(`HAZARD_FEED_UNREACHABLE: feed '${feedName}' unreachable`);
  }

  const nowIso = new Date().toISOString();
  const response: HazardFeedAdapterResponse = {
    feed: feedName,
    events: [
      {
        id: `noaa-stub-${Date.now()}-1`,
        type: 'Coastal Flood Watch',
        severity: 'Elevated',
        geometry: { type: 'Point', coordinates: [-77.02, 38.89] },
        confidence: 'High',
        source: 'NOAA',
        issued_at: nowIso,
      },
      {
        id: `noaa-stub-${Date.now()}-2`,
        type: 'High Wind Warning',
        severity: 'Watch',
        geometry: { type: 'Point', coordinates: [-77.03, 38.9] },
        confidence: 'High',
        source: 'NOAA',
        issued_at: nowIso,
      },
    ],
  };

  // Provenance enforcement (F12, same explicit-check-anyway style as
  // gis-adapter.ts's own provenance check): reject before this function
  // even returns if source/issued_at would ever be missing on any event —
  // structurally guaranteed here since both are always set above, but the
  // check is written explicitly so a future real-vendor swap can't
  // silently drop them.
  for (const event of response.events) {
    if (!event.source || !event.issued_at) {
      await recordFeedHealth(feedName, 'offline');
      throw new Error('PROVENANCE_REQUIRED: hazard feed event missing source or issued_at');
    }
  }

  await recordFeedHealth(feedName, 'online');
  return response;
}

/**
 * UPSERTs into the EXISTING integration_health table (migrated in
 * 01-01), matching `system_name` as the natural key per its own UNIQUE
 * constraint. This is the FIRST adapter in this codebase to write into
 * integration_health directly (confirmed via
 * `grep -rn "INSERT INTO integration_health" backend/src` returning
 * nothing before this task) — gis-adapter.ts's own gis_feed_status table
 * never wrote here.
 */
async function recordFeedHealth(feedName: string, status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ($1, now(), 'inbound', $2, $3, $4)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'inbound',
       record_authority = $2,
       sync_status = $3,
       error_count = CASE WHEN $3 = 'offline' THEN integration_health.error_count + 1 ELSE 0 END`,
    [`${feedName} Hazard Feed`, feedName, status === 'online' ? 'online' : 'offline', status === 'offline' ? 1 : 0],
  );
}

/**
 * Scheduled background job per F12's FRD: polls every configured, active
 * hazard feed (NOAA/NWS/USGS, per hazard_feed_config), recording per-feed
 * health via fetchHazardFeedEvents's own recordFeedHealth call regardless
 * of outcome. One feed's failure must not abort the others — same per-item
 * fault isolation as overdue-sweep.ts's per-task transaction loop.
 *
 * Tracks this adapter's OWN bookkeeping row in background_jobs, scoped
 * EXCLUSIVELY to job_type = 'feed_ingestion' (an allowed CHECK value since
 * Phase 1's original migration). Plan 07-02's CAD adapter deliberately does
 * NOT reuse this job_type — it adds its own distinct 'cad_ingestion' value
 * via its own migration ALTER, so the two independently-scheduled adapters
 * never find-and-overwrite the SAME background_jobs row.
 */
export async function runHazardFeedIngestion(): Promise<{ feeds_attempted: number }> {
  const feedRows = await query<{ feed_name: string }>(
    `SELECT feed_name FROM hazard_feed_config WHERE active = true`,
  );

  let anyFailure = false;
  for (const { feed_name } of feedRows) {
    try {
      // eslint-disable-next-line no-await-in-loop -- sequential polling is
      // intentional here (mirrors overdue-sweep.ts's per-item loop): one
      // feed's failure must not abort the others, but there is no reason
      // to fan these out concurrently against a stub adapter.
      await fetchHazardFeedEvents(feed_name);
    } catch {
      // fetchHazardFeedEvents already recorded the failure via its own
      // recordFeedHealth('offline') call above — nothing further to do
      // here beyond tracking that THIS run had a failure, for the
      // background_jobs bookkeeping below.
      anyFailure = true;
    }
  }

  const existing = await query<{ id: string; failure_count: number }>(
    `SELECT id, failure_count FROM background_jobs WHERE job_type = 'feed_ingestion' LIMIT 1`,
  );

  if (anyFailure) {
    const failureCount = (existing[0]?.failure_count ?? 0) + 1;
    const nextRetryAt = computeBackoff(failureCount);
    if (existing[0]) {
      await query(
        `UPDATE background_jobs SET status = 'backoff', failure_count = $1, next_retry_at = $2, last_run_at = now() WHERE id = $3`,
        [failureCount, nextRetryAt, existing[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, failure_count, next_retry_at, last_run_at) VALUES ('feed_ingestion', 'backoff', $1, $2, now())`,
        [failureCount, nextRetryAt],
      );
    }
  } else if (existing[0]) {
    await query(
      `UPDATE background_jobs SET status = 'idle', last_run_at = now() WHERE id = $1`,
      [existing[0].id],
    );
  } else {
    await query(
      `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('feed_ingestion', 'idle', now())`,
    );
  }

  return { feeds_attempted: feedRows.length };
}

/**
 * Idempotent promotion: every hazard_feed_events row (whether from this
 * plan's own stub ingestion or Phase 6's already-seeded fixtures) gets
 * exactly one hazard_layers row, defaulting verified = false. Safe to call
 * on every GET /layers request — a no-op after the first promotion.
 */
export async function syncHazardLayersFromEvents(): Promise<void> {
  await query(
    `INSERT INTO hazard_layers (hazard_feed_event_id, label)
     SELECT id, type || ' (' || source || ')'
     FROM hazard_feed_events hfe
     WHERE NOT EXISTS (SELECT 1 FROM hazard_layers hl WHERE hl.hazard_feed_event_id = hfe.id)`,
  );
}

interface IntegrationHealthRow {
  id: string;
  system_name: string;
  last_sync_at: string | null;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  record_authority: string;
  sync_status: 'online' | 'syncing' | 'offline' | 'conflict';
  error_count: number;
  updated_at: string;
}

/**
 * Mounts the hazard-feed module's two F12 routes:
 *  - GET /api/v1/integrations/hazard-feeds/health (admin Integration Health
 *    diagnostic, matching gisHealthRoutes's exact response shape)
 *  - POST /api/v1/hazard-layers/:id/verify (named-person verification,
 *    gated on incidents:edit per F12's Process step 4)
 */
export async function hazardFeedRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/integrations/hazard-feeds/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<IntegrationHealthRow>(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health
         WHERE system_name LIKE '%Hazard Feed'
         ORDER BY system_name`,
      );
      return reply.code(200).send({ items: rows });
    },
  );

  app.post<{
    Params: { id: string };
    Body: { verified_by?: string };
  }>(
    '/api/v1/hazard-layers/:id/verify',
    // Hazard-layer verification is an incident-command/planning action per
    // F12's Process step 4 ("typically PER-01 or PER-03"), not an admin-
    // console action — gated on incidents:edit, not admin:*.
    { preHandler: requirePermission('incidents', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { verified_by } = req.body ?? ({} as never);

      // Caller-identity equality — mirrors notifications.ts's
      // APPROVER_MISMATCH pattern exactly, not a role-permission lookup on
      // the asserted id: the caller must verify as THEMSELVES, never
      // assert an arbitrary person's id.
      if (!verified_by || verified_by !== req.epmpUser!.id) {
        return reply.code(403).send({
          error_code: 'VERIFICATION_REQUIRES_NAMED_USER',
          message: 'You can only verify a hazard layer as yourself, not on behalf of another person.',
        });
      }

      // Existence guard — same fetchIncidentForMutation-style convention as
      // incidents.ts: confirm the row exists before mutating, so a
      // mistyped/stale/already-deleted id doesn't silently 204 with no row
      // actually changed.
      const existing = await query<{ id: string }>(`SELECT id FROM hazard_layers WHERE id = $1`, [id]);
      if (existing.length === 0) {
        return reply.code(404).send({
          error_code: 'HAZARD_LAYER_NOT_FOUND',
          message: 'This hazard layer no longer exists.',
        });
      }

      await query(
        `UPDATE hazard_layers SET verified = true, verified_by = $1, verified_at = now() WHERE id = $2`,
        [verified_by, id],
      );
      return reply.code(204).send();
    },
  );
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Starts the hazard-feed ingestion poll on a 5-minute default interval, per
 * TechArch's hazard_feed_config.poll_interval_seconds default (300s). Same
 * idempotent-against-double-start guard and bare setInterval body as
 * startOverdueSweepScheduler.
 */
export function startHazardFeedIngestionScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return; // idempotent against double-start (e.g. hot reload)
  intervalHandle = setInterval(() => {
    runHazardFeedIngestion().catch((err) => console.error('[hazard-feed-adapter] ingestion failed', err));
  }, intervalMs);
}
