import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { computeBackoff } from './webhook-delivery-worker.js';

export interface CadDispatchEvent {
  external_event_id: string;
  cad_incident_number?: string;
  status: string;
  unit_ids: string[];
  location?: { lat: number; lng: number };
  updated_at: string;
  source: string;
}

interface CadDispatchEventRow {
  id: string;
  config_id: string;
  external_event_id: string;
  cad_incident_number: string | null;
  linked_incident_id: string | null;
  status: string;
  unit_ids: string[] | null;
  source: string;
  updated_at: string;
}

// No real CAD vendor credential exists in this MVP sandbox (TechArch's
// adapter catalog names CAD vendors as agency-specific, out-of-band
// configuration this phase does not have). This stub simulates the
// adapter's NORMALIZED OUTPUT SHAPE exactly as a real adapter would produce
// it — one dispatch event for one agency CAD vendor — so the rest of the
// system (read-only enforcement, provenance, integration-health wiring) is
// built and tested against the real contract, not a fake shortcut. Swapping
// in a real CAD vendor call later means replacing only this function's
// body; every caller (incidents.ts, runCadIngestion below) is unaffected.
// Mirrors gis-adapter.ts's KNOWN_LAYER_ID doc-comment pattern precisely.
const KNOWN_VENDOR = 'agency_cad';

// The ONE cad_incident_number this stub's single success-path event
// carries — matched against existing incidents.name by runCadIngestion's
// "shared number" incident-matching step below. fetchCadDispatchEvents's
// own recognized-vs-unrecognized trigger is the explicit `simulateFailure`
// flag (its contract takes only `since`/`simulateFailure`, matching
// TechArch's literal `GET {adapter}/dispatch-events?since={timestamp}`
// poll shape — there is no vendor-side "incident number" query param in
// the real adapter contract to recognize against), exactly the same
// explicit-test-injection shape gis-adapter.ts's KNOWN_LAYER_ID documents.
const KNOWN_DISPATCH_NUMBER = 'CAD-UAT-001';

let cachedConfigId: string | undefined;

/**
 * Find-or-insert the single agency_cad cad_config row this stub adapter
 * needs a real config_id FK target for. gis-adapter.ts doesn't need this
 * (its config is hardcoded with no persisted config row), but
 * cad_dispatch_events.config_id is NOT NULL REFERENCES cad_config(id), so
 * this module needs a real row to point at. Idempotent — safe to call on
 * every fetchCadDispatchEvents/runCadIngestion invocation; cached in-memory
 * after the first successful lookup within this process's lifetime so
 * every subsequent call skips the round-trip.
 */
async function findOrCreateCadConfig(): Promise<string> {
  if (cachedConfigId) return cachedConfigId;

  const existing = await query<{ id: string }>(
    `SELECT id FROM cad_config WHERE vendor = $1 LIMIT 1`,
    [KNOWN_VENDOR],
  );
  if (existing[0]) {
    cachedConfigId = existing[0].id;
    return cachedConfigId;
  }

  const inserted = await query<{ id: string }>(
    `INSERT INTO cad_config (vendor, endpoint_config, incident_matching_strategy)
     VALUES ($1, $2, 'human_confirmed')
     RETURNING id`,
    [KNOWN_VENDOR, JSON.stringify({ stub: true })],
  );
  cachedConfigId = inserted[0].id;
  return cachedConfigId;
}

/**
 * Stub CAD/911 dispatch-event fetch — matches TechArch's literal
 * `GET {adapter}/dispatch-events?since={timestamp}` poll contract. Mirrors
 * fetchGisFeatures's exact success/failure shape: `simulateFailure === true`
 * (the explicit test-injection trigger — same recognized-vs-unrecognized
 * trigger shape as gis-adapter.ts's KNOWN_LAYER_ID, since this adapter has
 * no per-call vendor-identifying param to recognize against) simulates a
 * vendor outage — recordCadHealth('offline') then throw. Any other call
 * (including the scheduled ingestion job's own normal no-arg call) takes
 * the success path, returning the one fixed, recognized dispatch event.
 * `since` is accepted for contract-shape parity with the real poll
 * endpoint but this stub always returns its one synthetic event regardless
 * of its value (no persisted event history to filter against yet in this
 * stub — the actual time-filtering the contract wants is applied at the
 * cad_dispatch_events table level by the GET .../dispatch-events route).
 */
export async function fetchCadDispatchEvents(
  since?: string,
  simulateFailure?: boolean,
): Promise<CadDispatchEvent[]> {
  void since;

  if (simulateFailure === true) {
    // Explicit test-injection trigger simulates a vendor timeout —
    // exercises the exact failure path a real unreachable CAD endpoint
    // would trigger.
    await recordCadHealth('offline');
    throw new Error(`CAD_FEED_UNREACHABLE: dispatch event lookup unreachable`);
  }

  const event: CadDispatchEvent = {
    external_event_id: 'UAT-CAD-001',
    cad_incident_number: KNOWN_DISPATCH_NUMBER,
    status: 'On scene',
    unit_ids: ['Engine 12'],
    source: KNOWN_VENDOR,
    updated_at: new Date().toISOString(),
  };

  // Provenance enforcement (F15 Validation: "every displayed dispatch-
  // status fact must carry its CAD-system source and timestamp via
  // Provenance"): reject before this function even returns if source/
  // updated_at ever end up missing — structurally guaranteed here since
  // both are always set above, but the check is written explicitly so a
  // future real-vendor swap can't silently drop them. Same explicit-
  // check-anyway style as gis-adapter.ts's own provenance check.
  if (!event.source || !event.updated_at) {
    await recordCadHealth('offline');
    throw new Error('PROVENANCE_REQUIRED: CAD dispatch event missing source or updated_at');
  }

  await recordCadHealth('online');
  return [event];
}

/**
 * UPSERT into the shared integration_health table — `record_authority`
 * is hardcoded 'CAD/911', NEVER 'EPMP' (F15's core hard constraint: CAD
 * remains the system of record for dispatch data; EPMP only references
 * and displays it). Mirrors Plan 07-01's recordFeedHealth bump/reset
 * error_count convention exactly.
 */
async function recordCadHealth(status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ('CAD/911 Dispatch', now(), 'inbound', 'CAD/911', $1, $2)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'inbound',
       record_authority = 'CAD/911',
       sync_status = $1,
       error_count = CASE WHEN $1 = 'online' THEN 0 ELSE integration_health.error_count + 1 END`,
    [status, status === 'offline' ? 1 : 0],
  );
}

/**
 * Scheduled ingestion job: fetches the current dispatch-event snapshot,
 * upserts it into cad_dispatch_events (idempotent — this IS the one place
 * that legitimately writes this table, since it's populating the local
 * cache of an external read feed, not mutating an EPMP-owned record), and
 * attempts incident matching. find-or-update bookkeeping against
 * background_jobs is scoped EXCLUSIVELY to job_type = 'cad_ingestion' —
 * the NEW, distinct CHECK-constraint value this plan's own migration adds
 * (see 1700000000013_cad-dispatch-schema.js). Deliberately does NOT reuse
 * 'feed_ingestion' — that value is Plan 07-01's hazard-feed adapter's own
 * exclusive job_type; sharing one job_type value between two
 * independently-scheduled adapters would make their ticks find-and-
 * overwrite the IDENTICAL background_jobs row via the
 * `WHERE job_type = '...' LIMIT 1` idiom webhook-delivery-worker.ts
 * established for its own single-adapter case.
 *
 * `cadIncidentNumber`, when supplied, is this job's own test-injection
 * trigger: any value other than the stub's one recognized
 * `KNOWN_DISPATCH_NUMBER` forces the failure path deterministically (same
 * recognized-vs-unrecognized shape as fetchCadDispatchEvents's own
 * `simulateFailure` flag, surfaced here as the "a test-only
 * cad_incident_number that doesn't match the stub's recognized value"
 * trigger this plan's own Task 3 point 6 names). Calling with no argument
 * (the scheduled ingestion job's own normal call shape) takes the success
 * path.
 */
export async function runCadIngestion(cadIncidentNumber?: string): Promise<void> {
  const configId = await findOrCreateCadConfig();
  const simulateFailure = cadIncidentNumber !== undefined && cadIncidentNumber !== KNOWN_DISPATCH_NUMBER;

  try {
    const events = await fetchCadDispatchEvents(undefined, simulateFailure);

    for (const event of events) {
      // Incident matching: a deliberately simple "shared number" stand-in
      // — no real CAD vendor's incident-numbering scheme exists to match
      // against in this stub. If a cad_incident_number is present AND an
      // incidents row exists whose name contains that exact string, link
      // it; otherwise leave linked_incident_id NULL (unmatched — F15's
      // explicit "not force-attached to an unrelated incident" rule).
      let linkedIncidentId: string | null = null;
      if (event.cad_incident_number) {
        const matches = await query<{ id: string }>(
          `SELECT id FROM incidents WHERE name ILIKE '%' || $1 || '%' LIMIT 1`,
          [event.cad_incident_number],
        );
        linkedIncidentId = matches[0]?.id ?? null;
      }

      await query(
        `INSERT INTO cad_dispatch_events
           (config_id, external_event_id, cad_incident_number, linked_incident_id, status, unit_ids, location, source, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6,
           CASE WHEN $7::double precision IS NULL OR $8::double precision IS NULL THEN NULL
                ELSE ST_SetSRID(ST_MakePoint($7, $8), 4326)::geography END,
           $9, $10)
         ON CONFLICT (config_id, external_event_id) DO UPDATE SET
           status = EXCLUDED.status,
           unit_ids = EXCLUDED.unit_ids,
           location = EXCLUDED.location,
           linked_incident_id = COALESCE(cad_dispatch_events.linked_incident_id, EXCLUDED.linked_incident_id),
           updated_at = EXCLUDED.updated_at`,
        [
          configId,
          event.external_event_id,
          event.cad_incident_number ?? null,
          linkedIncidentId,
          event.status,
          event.unit_ids,
          event.location?.lng ?? null,
          event.location?.lat ?? null,
          event.source,
          event.updated_at,
        ],
      );
    }

    // Success path: find-or-update the cad_ingestion background_jobs row.
    const existing = await query<{ id: string }>(
      `SELECT id FROM background_jobs WHERE job_type = 'cad_ingestion' LIMIT 1`,
    );
    if (existing[0]) {
      await query(
        `UPDATE background_jobs SET status = 'idle', last_run_at = now(), failure_count = 0, next_retry_at = NULL
         WHERE id = $1`,
        [existing[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('cad_ingestion', 'idle', now())`,
      );
    }
  } catch (err) {
    // Failure path: bump failure_count, set next_retry_at via the SHARED
    // computeBackoff helper (webhook-delivery-worker.ts) — not a second
    // bespoke backoff implementation, matching Plan 07-01's own Task 1
    // pattern but against this adapter's OWN 'cad_ingestion'-scoped row.
    const existing = await query<{ id: string; failure_count: number }>(
      `SELECT id, failure_count FROM background_jobs WHERE job_type = 'cad_ingestion' LIMIT 1`,
    );
    const failureCount = (existing[0]?.failure_count ?? 0) + 1;
    const nextRetryAt = computeBackoff(failureCount);
    if (existing[0]) {
      await query(
        `UPDATE background_jobs SET status = 'backoff', failure_count = $1, next_retry_at = $2
         WHERE id = $3`,
        [failureCount, nextRetryAt, existing[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, failure_count, next_retry_at)
         VALUES ('cad_ingestion', 'backoff', $1, $2)`,
        [failureCount, nextRetryAt],
      );
    }
    throw err;
  }
}

/**
 * Mounts CAD/911 integration routes. STRICTLY read-only — no PATCH/PUT/
 * DELETE route exists anywhere in this file (or in incidents.ts) for
 * cad_dispatch_events. This absence IS the enforcement mechanism per F15's
 * "no PATCH/PUT/DELETE route exists... not merely disabled" structural
 * rule, not a runtime permission check.
 */
export async function cadRoutes(app: FastifyInstance) {
  // GET /api/v1/integrations/cad/dispatch-events?since={ts} — incident-
  // command situational data, not an admin-console concern, so gated on
  // 'incidents'/'view' (not 'admin'/'view'). Returns the array directly
  // per TechArch's literal CadDispatchEvent[] response shape — NOT wrapped
  // in {items: ...} like the {items: ...}-wrapped admin health routes.
  app.get<{ Querystring: { since?: string } }>(
    '/api/v1/integrations/cad/dispatch-events',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      const { since } = req.query;
      const rows = since
        ? await query<CadDispatchEventRow>(
            `SELECT * FROM cad_dispatch_events WHERE updated_at > $1 ORDER BY updated_at DESC`,
            [since],
          )
        : await query<CadDispatchEventRow>(`SELECT * FROM cad_dispatch_events ORDER BY updated_at DESC`);

      const items: CadDispatchEvent[] = rows.map((r) => ({
        external_event_id: r.external_event_id,
        cad_incident_number: r.cad_incident_number ?? undefined,
        status: r.status,
        unit_ids: r.unit_ids ?? [],
        updated_at: r.updated_at,
        source: r.source,
      }));

      return reply.code(200).send(items);
    },
  );

  // GET /api/v1/integrations/cad/health — admin Integration Health view
  // (F8 S8.6), matching every other admin Integration-Health-style route
  // in this codebase.
  app.get(
    '/api/v1/integrations/cad/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health WHERE system_name = 'CAD/911 Dispatch'`,
      );
      return reply.code(200).send({ items: rows });
    },
  );
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Same idempotent-against-double-start shape as Plan 07-01's
 * startHazardFeedIngestionScheduler / startOverdueSweepScheduler — 5-minute
 * default, bare setInterval body.
 */
export function startCadIngestionScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runCadIngestion().catch((err) => console.error('[cad-ingestion] failed', err));
  }, intervalMs);
}
