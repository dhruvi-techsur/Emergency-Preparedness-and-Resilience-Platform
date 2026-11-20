import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { computeBackoff } from './webhook-delivery-worker.js';

export interface FacilityRecord {
  facility_id: string;
  name: string;
  location: { lat: number; lng: number };
  status: string;
  source: string;
  as_of: string;
}

interface FacilityRow {
  id: string;
  external_facility_id: string;
  name: string;
  status: string;
  source: string;
  as_of: string;
  lat: number;
  lng: number;
}

// No real agency ERP/facility-management vendor credential exists in this
// MVP sandbox (TechArch's adapter catalog names ERP/facility vendors as
// agency-specific, out-of-band configuration this phase does not have).
// This stub simulates the adapter's NORMALIZED OUTPUT SHAPE exactly as a
// real adapter would produce it — one or two facility status rows for one
// agency ERP vendor — so the rest of the system (provenance enforcement,
// field-discarding, integration-health wiring) is built and tested against
// the real contract, not a fake shortcut. Swapping in a real ERP vendor
// call later means replacing only this function's body; every caller
// (runFacilitySync, facilityRoutes below) is unaffected. Mirrors
// gis-adapter.ts's KNOWN_LAYER_ID / cad-adapter.ts's KNOWN_VENDOR
// doc-comment pattern precisely.
const KNOWN_VENDOR = 'agency_erp';

// A raw, UN-normalized internal shape simulating what a real ERP vendor's
// response might actually look like — DELIBERATELY includes
// inventory_count/maintenance_due_at/annual_cost, the exact fields F17's
// Validation rule says must be discarded at the adapter boundary. This type
// is used ONLY inside fetchFacilityStatus's private response-simulation
// step below; it is never exported, never returned, and never referenced
// by any caller outside this function.
interface RawVendorFacilityResponse {
  facility_id: string;
  name: string;
  lat: number;
  lng: number;
  status: string;
  // Forbidden fields (F17 Validation): "The facility adapter must never
  // request, store, or expose inventory, maintenance, or cost fields in
  // this MVP — any such fields present in a vendor response are discarded
  // at the adapter boundary, not merely hidden in the UI." These three
  // fields exist on this RAW type ONLY to prove the normalization step
  // below genuinely discards them, rather than merely never having been
  // asked for in the first place.
  inventory_count?: number;
  maintenance_due_at?: string;
  annual_cost?: number;
}

let cachedConfigId: string | undefined;

/**
 * Find-or-insert the single agency_erp facility_feed_config row. Idempotent
 * — safe to call on every fetchFacilityStatus invocation; cached in-memory
 * after the first successful lookup within this process's lifetime so every
 * subsequent call skips the round-trip. Mirrors cad-adapter.ts's
 * findOrCreateCadConfig exactly.
 */
async function findOrCreateFacilityFeedConfig(): Promise<string> {
  if (cachedConfigId) return cachedConfigId;

  const existing = await query<{ id: string }>(
    `SELECT id FROM facility_feed_config WHERE erp_vendor = $1 LIMIT 1`,
    [KNOWN_VENDOR],
  );
  if (existing[0]) {
    cachedConfigId = existing[0].id;
    return cachedConfigId;
  }

  const inserted = await query<{ id: string }>(
    `INSERT INTO facility_feed_config (erp_vendor, endpoint_config)
     VALUES ($1, $2)
     RETURNING id`,
    [KNOWN_VENDOR, JSON.stringify({ stub: true })],
  );
  cachedConfigId = inserted[0].id;
  return cachedConfigId;
}

/**
 * Stub facility/asset-status fetch — matches TechArch's literal
 * `GET {adapter}/facility-status?since={timestamp}` poll contract
 * (FRD F17). `since` is accepted for contract-shape parity with the real
 * poll endpoint but this stub always returns its fixed set of records
 * regardless of its value (no persisted event history to filter against in
 * this stub).
 *
 * Recognized-vs-unrecognized trigger (same shape as every prior adapter in
 * this module): this stub's own internal "configured vendor" check against
 * KNOWN_VENDOR is the trigger — findOrCreateFacilityFeedConfig() always
 * resolves/creates the one KNOWN_VENDOR row, so the only way to exercise
 * the failure path from a caller's perspective is the explicit
 * `simulateFailure` flag below (mirroring cad-adapter.ts's own explicit
 * test-injection shape, since — like CAD — this stub has no per-call
 * vendor-identifying param to recognize against).
 */
export async function fetchFacilityStatus(
  since?: string,
  simulateFailure?: boolean,
): Promise<FacilityRecord[]> {
  void since;

  if (simulateFailure === true) {
    // Any unrecognized/unreachable vendor scenario simulates a vendor
    // timeout — exercises the exact failure path a real unreachable ERP
    // endpoint would trigger. Kept distinct from gis-adapter.ts's
    // layer-id-based trigger and cad-adapter.ts's incident-number-based
    // trigger since facility-status has neither a layer_id nor an
    // incident-number-shaped param to recognize against.
    await recordFacilityHealth('offline');
    throw new Error('FACILITY_FEED_UNREACHABLE: agency_erp facility status feed unreachable');
  }

  await findOrCreateFacilityFeedConfig();

  // Simulate 2 raw vendor responses, each DELIBERATELY including the 3
  // forbidden fields (inventory_count/maintenance_due_at/annual_cost) to
  // prove the normalization step below genuinely drops them rather than
  // never having received them.
  const rawResponses: RawVendorFacilityResponse[] = [
    {
      facility_id: 'FAC-SHELTER-001',
      name: 'Main Street Shelter',
      lat: 38.9,
      lng: -77.03,
      status: 'operational',
      inventory_count: 4200,
      maintenance_due_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      annual_cost: 185000,
    },
    {
      facility_id: 'FAC-EOC-002',
      name: 'County EOC Building',
      lat: 38.92,
      lng: -77.01,
      status: 'operational',
      inventory_count: 900,
      maintenance_due_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      annual_cost: 42000,
    },
  ];

  const asOf = new Date().toISOString();

  // Normalization (F17 Validation: "discarded at the adapter boundary, not
  // merely hidden in the UI"): this explicit allow-list object-literal copy
  // IS the discarding mechanism — it is structurally impossible for
  // inventory_count/maintenance_due_at/annual_cost to reach the returned
  // FacilityRecord[] because this construction never references them, not
  // merely because it omits them by accident. A future real-vendor swap
  // that replaces rawResponses's source cannot accidentally leak a
  // forbidden field through this copy without someone deliberately adding
  // a new key to the object literal below.
  const records: FacilityRecord[] = rawResponses.map((raw) => ({
    facility_id: raw.facility_id,
    name: raw.name,
    location: { lat: raw.lat, lng: raw.lng },
    status: raw.status,
    source: KNOWN_VENDOR,
    as_of: asOf,
  }));

  // Provenance enforcement (F17 Validation / F10's provenance-enforcement
  // rule): reject before this function even returns if source/as_of ever
  // end up missing on any record — structurally guaranteed here since both
  // are always set above, but the check is written explicitly so a future
  // real-vendor swap can't silently drop them. Same explicit-check-anyway
  // style as gis-adapter.ts/cad-adapter.ts's own provenance checks.
  for (const record of records) {
    if (!record.source || !record.as_of) {
      await recordFacilityHealth('offline');
      throw new Error('PROVENANCE_REQUIRED: facility record missing source or as_of');
    }
  }

  await recordFacilityHealth('online');
  return records;
}

/**
 * UPSERT into the shared integration_health table — `record_authority` is
 * hardcoded 'agency_erp' (the ERP vendor), NEVER 'EPMP' — mirrors Plan
 * 07-02's cad-adapter.ts `record_authority` rule for read-only external
 * data: EPMP never claims authority over facility status, only displays it.
 */
async function recordFacilityHealth(status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ('Facility/Asset Feed', now(), 'inbound', 'agency_erp', $1, $2)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'inbound',
       record_authority = 'agency_erp',
       sync_status = $1,
       error_count = CASE WHEN $1 = 'online' THEN 0 ELSE integration_health.error_count + 1 END`,
    [status, status === 'offline' ? 1 : 0],
  );
}

/**
 * Scheduled sync job: fetches the current facility-status snapshot and
 * upserts it into `facilities` — idempotent (ON CONFLICT (external_facility_id,
 * source) DO UPDATE), matching the "last-known facility positions remain on
 * the map, labeled with their age" outage-resilience rule: a stale row
 * simply isn't updated on a failed sync, not deleted. Find-or-update
 * bookkeeping against `background_jobs` is scoped EXCLUSIVELY to
 * `job_type = 'facility_sync'` — the NEW, distinct CHECK-constraint value
 * this plan's own migration adds (see
 * 1700000000015_facility-document-schema.js) — deliberately NOT reusing
 * 'feed_ingestion' (Plan 07-01's hazard-feed adapter) or 'cad_ingestion'
 * (Plan 07-02's CAD adapter), so independently-scheduled adapters never
 * find-and-overwrite the SAME background_jobs row.
 *
 * `simulateFailure`, when true, is this job's own test-injection trigger —
 * forwarded straight to fetchFacilityStatus's own flag, same shape as
 * cad-adapter.ts's runCadIngestion(cadIncidentNumber) pattern.
 */
export async function runFacilitySync(simulateFailure?: boolean): Promise<void> {
  try {
    const records = await fetchFacilityStatus(undefined, simulateFailure);

    for (const record of records) {
      await query(
        `INSERT INTO facilities (external_facility_id, name, location, status, source, as_of)
         VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5, $6, $7)
         ON CONFLICT (external_facility_id, source) DO UPDATE SET
           name = EXCLUDED.name,
           location = EXCLUDED.location,
           status = EXCLUDED.status,
           as_of = EXCLUDED.as_of,
           updated_at = now()`,
        [
          record.facility_id,
          record.name,
          record.location.lng,
          record.location.lat,
          record.status,
          record.source,
          record.as_of,
        ],
      );
    }

    // Success path: find-or-update the facility_sync background_jobs row.
    const existing = await query<{ id: string }>(
      `SELECT id FROM background_jobs WHERE job_type = 'facility_sync' LIMIT 1`,
    );
    if (existing[0]) {
      await query(
        `UPDATE background_jobs SET status = 'idle', last_run_at = now(), failure_count = 0, next_retry_at = NULL
         WHERE id = $1`,
        [existing[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('facility_sync', 'idle', now())`,
      );
    }
  } catch (err) {
    // Failure path: bump failure_count, set next_retry_at via the SHARED
    // computeBackoff helper (webhook-delivery-worker.ts) — not a second
    // bespoke backoff implementation, matching Plan 07-01/07-02's pattern
    // against this adapter's OWN 'facility_sync'-scoped row. The already-
    // synced `facilities` rows from a prior successful run are left
    // untouched (no DELETE anywhere in this function) — this IS the
    // "last-known facility positions remain on the map, labeled with their
    // age" outage-resilience rule.
    const existing = await query<{ id: string; failure_count: number }>(
      `SELECT id, failure_count FROM background_jobs WHERE job_type = 'facility_sync' LIMIT 1`,
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
         VALUES ('facility_sync', 'backoff', $1, $2)`,
        [failureCount, nextRetryAt],
      );
    }
    throw err;
  }
}

/**
 * Mounts the facility adapter's three routes:
 *  - GET /api/v1/integrations/facilities/status?since={ts}
 *  - GET /api/v1/integrations/facilities/health
 *  - GET /api/v1/operating-picture/facilities (NEW — Plan 08-04's frontend
 *    consumer calls THIS route directly rather than this plan editing
 *    operating-picture.ts itself, avoiding a file-ownership collision with
 *    Plan 08-01/08-03's own integration-gateway edits in the same wave).
 */
export async function facilityRoutes(app: FastifyInstance) {
  // Situational data (facility status feeding the operating picture),
  // matching Plan 07-02's CAD-dispatch-events permission precedent —
  // gated 'incidents'/'view', not 'admin'/'view'. Returns the array
  // directly per TechArch's literal response shape — NOT wrapped in
  // {items: ...}.
  app.get<{ Querystring: { since?: string } }>(
    '/api/v1/integrations/facilities/status',
    { preHandler: requirePermission('incidents', 'view') },
    async (_req, reply) => {
      const rows = await query<FacilityRow>(
        `SELECT id, external_facility_id, name, status, source, as_of,
                ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng
         FROM facilities
         ORDER BY updated_at DESC`,
      );
      const items: FacilityRecord[] = rows.map((r) => ({
        facility_id: r.external_facility_id,
        name: r.name,
        location: { lat: r.lat, lng: r.lng },
        status: r.status,
        source: r.source,
        as_of: r.as_of,
      }));
      return reply.code(200).send(items);
    },
  );

  // Admin Integration Health view (F8 S8.6), matching every other
  // admin health route in this codebase.
  app.get(
    '/api/v1/integrations/facilities/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health WHERE system_name = 'Facility/Asset Feed'`,
      );
      return reply.code(200).send({ items: rows });
    },
  );

  // NEW route this plan adds since operating-picture.ts's existing markers
  // endpoint doesn't query `facilities` yet. Shapes each row into the
  // existing MapMarker discriminant union's 'facility' type (square shape,
  // already declared in operating-picture.ts's MapMarker interface since
  // Phase 2 but never populated until now).
  app.get(
    '/api/v1/operating-picture/facilities',
    { preHandler: requirePermission('incidents', 'view') },
    async (_req, reply) => {
      const rows = await query<FacilityRow>(
        `SELECT id, external_facility_id, name, status, source, as_of,
                ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng
         FROM facilities`,
      );
      const markers = rows.map((r) => ({
        id: r.id,
        type: 'facility' as const,
        shape: 'square' as const,
        tone: facilityStatusToTone(r.status),
        label: r.name,
        status: r.status,
        location: { lat: r.lat, lng: r.lng },
        source: r.source,
        as_of: r.as_of,
      }));
      return reply.code(200).send({ markers });
    },
  );
}

/**
 * Status-derived tone for the facility marker — mirrors
 * operating-picture.ts's own severityToTone/resourceStatusToTone
 * precedent: an 'operational' facility is a non-alerting 'success' state,
 * any other status is treated as a 'warning' signal worth noticing on the
 * map, since this stub has no richer status vocabulary to branch on yet.
 */
function facilityStatusToTone(status: string): 'success' | 'warning' {
  return status === 'operational' ? 'success' : 'warning';
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Same idempotent-against-double-start shape as every prior scheduler in
 * this module (hazard-feed/cad) — 5-minute default, bare setInterval body.
 */
export function startFacilitySyncScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runFacilitySync().catch((err) => console.error('[facility-sync] failed', err));
  }, intervalMs);
}
