import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { checkRecordAuthority } from './record-authority.js';
import { computeBackoff } from './webhook-delivery-worker.js';

export type EocCotsRecordType = 'incident' | 'resource_request' | 'status' | 'activity_log';

const RECORD_TYPES: EocCotsRecordType[] = ['incident', 'resource_request', 'status', 'activity_log'];

export interface ExchangeRecord {
  external_id: string;
  type: EocCotsRecordType;
  payload: Record<string, unknown>;
  external_system: string;
  last_modified_external: string;
}

// No real WebEOC/Veoci/DisasterLAN credential exists in this MVP sandbox
// (TechArch's adapter catalog names EOC COTS vendors as agency-specific,
// out-of-band configuration this phase does not have). This stub simulates
// the adapter's NORMALIZED EXCHANGE-RECORD output shape exactly as a real
// adapter would produce it — so record-authority enforcement, conflict
// detection, and integration-health wiring are built and tested against the
// real contract, not a fake shortcut. Swapping in a real vendor call later
// means replacing only fetchExchangeRecords's body; every caller
// (runEocCotsSync, eocCotsRoutes below) is unaffected. Mirrors
// gis-adapter.ts's KNOWN_LAYER_ID / hazard-feed-adapter.ts's
// KNOWN_LIVE_FEED / cad-adapter.ts's KNOWN_VENDOR doc-comment pattern
// precisely.
const KNOWN_VENDOR = 'WebEOC';

// The ONE hardcoded external_id this stub's 'incident'-type fetch always
// includes on its success path — the literal, deterministic conflict
// trigger runEocCotsSync's own conflict-detection rule (below) and this
// plan's own integration test both depend on. Without this id actually
// being returned by fetchExchangeRecords, no conflict could ever be
// detected downstream.
const KNOWN_CONFLICT_EXTERNAL_ID = 'EOC-CONFLICT-001';

let cachedConfigId: string | undefined;

/**
 * Find-or-insert the single WebEOC eoc_cots_config row this stub adapter
 * needs a real config_id FK target for — eoc_cots_sync_log.config_id and
 * eoc_cots_conflicts.config_id are both NOT NULL REFERENCES
 * eoc_cots_config(id). Idempotent, same lazy find-or-insert + in-process
 * cache idiom cad-adapter.ts's findOrCreateCadConfig uses for its own
 * cad_config row.
 */
export async function findOrCreateEocCotsConfig(): Promise<string> {
  if (cachedConfigId) return cachedConfigId;

  const existing = await query<{ id: string }>(
    `SELECT id FROM eoc_cots_config WHERE vendor = $1 LIMIT 1`,
    [KNOWN_VENDOR],
  );
  if (existing[0]) {
    cachedConfigId = existing[0].id;
    return cachedConfigId;
  }

  const inserted = await query<{ id: string }>(
    `INSERT INTO eoc_cots_config (vendor, endpoint_url, auth_config)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [KNOWN_VENDOR, 'https://stub.webeoc.local/api', JSON.stringify({ stub: true })],
  );
  cachedConfigId = inserted[0].id;
  return cachedConfigId;
}

/**
 * Stub inbound exchange-records fetch — matches TechArch's literal
 * `GET {adapter}/exchange-records?type={...}&since={timestamp}` contract.
 * Recognizes exactly KNOWN_VENDOR ('WebEOC') as a live, reachable vendor;
 * any other configured vendor OR the explicit test-injection trigger
 * (`since === 'FORCE_AUTH_FAILURE'`, same recognized-vs-unrecognized shape
 * as cad-adapter.ts's own `simulateFailure` param doc comment — this
 * adapter's contract has no vendor-identifying call param beyond `type`/
 * `since`, so the test-injection trigger rides on `since` instead) records
 * the failure and throws EOC_ADAPTER_AUTH_FAILED. The success path returns
 * 1-2 normalized ExchangeRecords for the given type.
 */
export async function fetchExchangeRecords(
  type: EocCotsRecordType,
  since?: string,
): Promise<ExchangeRecord[]> {
  await findOrCreateEocCotsConfig();

  const configuredVendor = KNOWN_VENDOR; // this stub has exactly one configured vendor row
  if (configuredVendor !== KNOWN_VENDOR || since === 'FORCE_AUTH_FAILURE') {
    await recordEocCotsHealth('offline');
    throw new Error(`EOC_ADAPTER_AUTH_FAILED: connection to ${configuredVendor} failed`);
  }

  const nowIso = new Date().toISOString();
  const records: ExchangeRecord[] =
    type === 'incident'
      ? [
          {
            // The literal, deterministic conflict-trigger record — see
            // KNOWN_CONFLICT_EXTERNAL_ID's own doc comment above.
            external_id: KNOWN_CONFLICT_EXTERNAL_ID,
            type,
            payload: { status: 'Active', severity: 'Elevated', source_note: 'WebEOC stub conflict fixture' },
            external_system: KNOWN_VENDOR,
            last_modified_external: nowIso,
          },
          {
            external_id: 'EOC-INCIDENT-002',
            type,
            payload: { status: 'Active', severity: 'Monitoring' },
            external_system: KNOWN_VENDOR,
            last_modified_external: nowIso,
          },
        ]
      : [
          {
            external_id: `EOC-${type.toUpperCase()}-001`,
            type,
            payload: { status: 'Active' },
            external_system: KNOWN_VENDOR,
            last_modified_external: nowIso,
          },
        ];

  // Provenance enforcement (same explicit-check-anyway style as
  // gis-adapter.ts/hazard-feed-adapter.ts/cad-adapter.ts's own provenance
  // checks): reject before this function even returns if external_system/
  // last_modified_external would ever be missing on any record —
  // structurally guaranteed here since both are always set above, but the
  // check is written explicitly so a future real-vendor swap can't
  // silently drop them.
  for (const record of records) {
    if (!record.external_system || !record.last_modified_external) {
      await recordEocCotsHealth('offline');
      throw new Error('PROVENANCE_REQUIRED: EOC COTS exchange record missing external_system or last_modified_external');
    }
  }

  await recordEocCotsHealth('online');
  return records;
}

/**
 * UPSERTs into the shared integration_health table — system_name = 'WebEOC'
 * (the vendor name itself, per F13's "System name" column, matching
 * S13.1's literal "System name" header). direction = 'bidirectional' since
 * F13's adapter both reads AND writes per its approved contract, distinct
 * from Plan 07-01/07-02's 'inbound'-only hazard-feed/CAD adapters.
 * record_authority is set to the simple string 'WebEOC' — this single
 * integration_health row has exactly one record_authority column (not one
 * per exchanged record type), so it documents which record types this
 * vendor is EVER authoritative-capable for at a glance; the authoritative
 * resolution PER record type is what isRecordTypeDeclared/
 * checkRecordAuthority (via record_authority_registry) decide, not this
 * column. Bump/reset error_count exactly like Plan 07-01/07-02's
 * recordFeedHealth/recordCadHealth.
 */
async function recordEocCotsHealth(status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ('WebEOC', now(), 'bidirectional', 'WebEOC', $1, $2)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'bidirectional',
       record_authority = 'WebEOC',
       sync_status = $1,
       error_count = CASE WHEN $1 = 'online' THEN 0 ELSE integration_health.error_count + 1 END`,
    [status, status === 'offline' ? 1 : 0],
  );
}

/**
 * Direct existence check against record_authority_registry — the
 * STRUCTURAL fix for the collapsed-default problem: checkRecordAuthority()
 * (record-authority.ts, already existing, NEVER MODIFIED by this plan)
 * returns the literal string 'EPMP' in TWO genuinely different cases — "a
 * row exists and explicitly names EPMP as authoritative" and "no row
 * exists at all (undeclared)" — and callers that only branch on that
 * string cannot tell those two cases apart. isRecordTypeDeclared() is what
 * lets runEocCotsSync() and the outbound route below both ask the
 * EXISTENCE question first, independently of what checkRecordAuthority()
 * would separately report.
 */
export async function isRecordTypeDeclared(recordType: string): Promise<boolean> {
  const rows = await query<{ exists_flag: number }>(
    `SELECT 1 AS exists_flag FROM record_authority_registry WHERE record_type = $1 LIMIT 1`,
    [recordType],
  );
  return rows.length > 0;
}

/**
 * Scheduled job, run once per the four approved record types. For each
 * type, isRecordTypeDeclared(type) is called FIRST: if false (undeclared),
 * this type is skipped ENTIRELY — no fetchExchangeRecords call, no
 * eoc_cots_sync_log write, no conflict check. This is the literal
 * "undeclared record types are not synced" FRD rule, now structurally
 * impossible to bypass.
 *
 * Only for a DECLARED type does this proceed to fetchExchangeRecords
 * (inside a per-type try/catch — one type's failure must not abort the
 * others, same per-item fault isolation as Phase 7's per-feed/per-event
 * loop) and checkRecordAuthority(type). Since this point is only reached
 * for a type already confirmed to have a registry row, `authority` here
 * reliably means "the row's actual declared value," never the collapsed
 * undeclared-default.
 *
 * - authority === 'EPMP': the inbound value is a CANDIDATE — checked for
 *   conflict against a deterministic test-reproducible stand-in "EPMP
 *   current value" rule (this MVP stub has no literal field-level diff
 *   target — see the inline conflict-detection comment below). On
 *   conflict: INSERT eoc_cots_conflicts (resolution left NULL, never
 *   auto-resolved — F13's hard constraint). On no conflict: log to
 *   eoc_cots_sync_log as a normal inbound sync.
 * - authority !== 'EPMP' (external system authoritative): accept and log
 *   the inbound value directly into eoc_cots_sync_log (direction:
 *   'inbound', sync_status: 'ok') with provenance noting the external
 *   source — no application-side write to an EPMP-owned table happens in
 *   THIS MVP-depth stub (eoc_cots_sync_log IS the sync-cycle's own audit
 *   record; this plan does not additionally mutate incidents/
 *   resource_requests rows, since the FRD's MVP depth scopes the exchange
 *   to the four logged record types with no literal field-level
 *   incident-table write path specified — documented scope boundary,
 *   matching 02-01/03-09's own precedent of documenting MVP-depth
 *   simplifications inline rather than over-building).
 *
 * background_jobs bookkeeping is scoped EXCLUSIVELY to
 * job_type = 'sync_reconciliation' — confirmed via
 * `grep -rn "sync_reconciliation" backend/src` returning nothing before
 * this task claimed it; it already exists in Phase 1's original CHECK
 * constraint list, unused by any other adapter, making it the correct,
 * already-available value rather than requiring a new migration ALTER
 * like Plan 07-02's 'cad_ingestion' needed. On any DECLARED type's failure
 * this run, status = 'backoff' + failure_count bumped + next_retry_at via
 * computeBackoff(failureCount) (imported from webhook-delivery-worker.ts,
 * never reimplemented); on all-declared-types-success, status = 'idle' +
 * last_run_at = now(). An undeclared, skipped type is neither a success
 * nor a failure for this bookkeeping — it simply never participates.
 */
export async function runEocCotsSync(): Promise<{ synced: number; conflicts: number }> {
  const configId = await findOrCreateEocCotsConfig();

  let synced = 0;
  let conflicts = 0;
  let anyFailure = false;
  let anyDeclaredTypeParticipated = false;

  for (const type of RECORD_TYPES) {
    // eslint-disable-next-line no-await-in-loop -- sequential per-type
    // checks are intentional here (mirrors hazard-feed-adapter.ts's own
    // per-feed loop): one type's failure must not abort the others, but
    // there is no reason to fan these out concurrently against a stub
    // adapter with only four fixed iterations.
    const declared = await isRecordTypeDeclared(type);
    if (!declared) {
      // Undeclared record types are not synced — skipped ENTIRELY, per
      // F13's Validation rule, now structurally enforced: no fetch, no
      // log, no conflict check for this type.
      continue;
    }

    anyDeclaredTypeParticipated = true;

    try {
      const records = await fetchExchangeRecords(type);
      const authority = await checkRecordAuthority(type);

      for (const record of records) {
        if (authority === 'EPMP') {
          // EPMP is authoritative for this declared type — the inbound
          // value is a CANDIDATE, checked for conflict rather than applied
          // directly.
          //
          // Conflict-detection rule (deterministic, test-reproducible):
          // this MVP stub has no literal field-level EPMP-side "current
          // value" to diff against, so the recognized trigger is the
          // record's own external_id matching the literal seeded test
          // marker KNOWN_CONFLICT_EXTERNAL_ID ('EOC-CONFLICT-001') — the
          // exact id fetchExchangeRecords's own 'incident'-type success
          // path wires in above. Any OTHER external_id for an
          // EPMP-authoritative type never conflicts in this stub.
          if (record.external_id === KNOWN_CONFLICT_EXTERNAL_ID) {
            // Dedup guard (fixes a brand-new duplicate conflict row being
            // inserted on every 5-minute tick for the same external
            // record): skip the INSERT entirely if a conflict row already
            // exists for this (config_id, record_type) with this exact
            // external_value — whether that row is still unresolved (a
            // prior tick already raised it, admin hasn't acted yet) OR
            // already resolved for this same external state (admin
            // already decided; this stub's deterministic fetch returning
            // the identical value again must not relitigate a settled
            // decision). A genuinely NEW/changed external_value for this
            // record_type still inserts a fresh conflict row, same as
            // before.
            const externalValueJson = JSON.stringify(record.payload);
            const existingConflict = await query<{ id: string }>(
              `SELECT id FROM eoc_cots_conflicts
               WHERE config_id = $1 AND record_type = $2 AND external_value = $3::jsonb
               LIMIT 1`,
              [configId, type, externalValueJson],
            );
            if (!existingConflict[0]) {
              await query(
                `INSERT INTO eoc_cots_conflicts (config_id, record_type, epmp_record_id, epmp_value, external_value)
                 VALUES ($1, $2, gen_random_uuid(), $3, $4)`,
                [
                  configId,
                  type,
                  JSON.stringify({ status: 'Monitoring', severity: 'Elevated', source: 'EPMP' }),
                  externalValueJson,
                ],
              );
              conflicts += 1;
            }
          } else {
            await query(
              `INSERT INTO eoc_cots_sync_log (config_id, record_type, external_id, direction, sync_status)
               VALUES ($1, $2, $3, 'inbound', 'ok')`,
              [configId, type, record.external_id],
            );
            synced += 1;
          }
        } else {
          // External system is authoritative for this declared type —
          // accept and log the inbound value directly; no
          // application-side write to an EPMP-owned table in this
          // MVP-depth stub (see the function-level doc comment above).
          await query(
            `INSERT INTO eoc_cots_sync_log (config_id, record_type, external_id, direction, sync_status)
             VALUES ($1, $2, $3, 'inbound', 'ok')`,
            [configId, type, record.external_id],
          );
          synced += 1;
        }
      }
    } catch {
      // fetchExchangeRecords already recorded the failure via its own
      // recordEocCotsHealth('offline') call above — nothing further to do
      // here beyond tracking that THIS run had a failure, for the
      // background_jobs bookkeeping below.
      anyFailure = true;
    }
  }

  // Find-or-update bookkeeping scoped EXCLUSIVELY to
  // job_type = 'sync_reconciliation' — see the function-level doc comment
  // above for why this value is correct/available/unclaimed.
  const existingJob = await query<{ id: string; failure_count: number }>(
    `SELECT id, failure_count FROM background_jobs WHERE job_type = 'sync_reconciliation' LIMIT 1`,
  );

  if (anyFailure) {
    const failureCount = (existingJob[0]?.failure_count ?? 0) + 1;
    const nextRetryAt = computeBackoff(failureCount);
    if (existingJob[0]) {
      await query(
        `UPDATE background_jobs SET status = 'backoff', failure_count = $1, next_retry_at = $2, last_run_at = now()
         WHERE id = $3`,
        [failureCount, nextRetryAt, existingJob[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, failure_count, next_retry_at, last_run_at)
         VALUES ('sync_reconciliation', 'backoff', $1, $2, now())`,
        [failureCount, nextRetryAt],
      );
    }
  } else if (anyDeclaredTypeParticipated) {
    if (existingJob[0]) {
      await query(
        `UPDATE background_jobs SET status = 'idle', last_run_at = now(), failure_count = 0, next_retry_at = NULL
         WHERE id = $1`,
        [existingJob[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('sync_reconciliation', 'idle', now())`,
      );
    }
  }
  // If no declared type participated at all (every type undeclared), the
  // bookkeeping row is left untouched this run — neither a success nor a
  // failure occurred for this adapter.

  return { synced, conflicts };
}

interface EocCotsConflictRow {
  id: string;
  config_id: string;
  record_type: string;
  epmp_record_id: string;
  epmp_value: Record<string, unknown>;
  external_value: Record<string, unknown>;
  resolution: 'keep_epmp' | 'keep_external' | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
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
 * Mounts F13's EOC COTS routes:
 *  - GET /api/v1/integrations/eoc-cots/exchange-records?type=&since=
 *  - POST /api/v1/integrations/eoc-cots/exchange-records (outbound)
 *  - GET /api/v1/integrations/eoc-cots/conflicts
 *  - GET /api/v1/integrations/eoc-cots/health
 *
 * Does NOT add a conflict-resolve route — POST
 * /api/v1/integrations/eoc-cots/conflicts/{id}/resolve is Plan 08-03's own
 * route (depends on this plan's eoc_cots_conflicts table), kept in its own
 * file per this phase's genuinely-new-pattern note.
 */
export async function eocCotsRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { type?: EocCotsRecordType; since?: string } }>(
    '/api/v1/integrations/eoc-cots/exchange-records',
    { preHandler: requirePermission('admin', 'view') },
    async (req, reply) => {
      const { type, since } = req.query;
      if (!type || !RECORD_TYPES.includes(type)) {
        return reply.code(400).send({
          error_code: 'EOC_RECORD_TYPE_UNSUPPORTED',
          message: "This record type isn't part of the approved exchange set with WebEOC.",
        });
      }

      try {
        const records = await fetchExchangeRecords(type, since);
        return reply.code(200).send(records);
      } catch (err) {
        return reply.code(401).send({
          error_code: 'EOC_ADAPTER_AUTH_FAILED',
          message: `Connection to ${KNOWN_VENDOR} failed. Check the integration credentials.`,
          detail: (err as Error).message,
        });
      }
    },
  );

  app.post<{ Body: { type?: string; payload?: Record<string, unknown>; external_id?: string } }>(
    '/api/v1/integrations/eoc-cots/exchange-records',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { type, payload, external_id } = req.body ?? {};

      if (!type || !RECORD_TYPES.includes(type as EocCotsRecordType)) {
        return reply.code(400).send({
          error_code: 'EOC_RECORD_TYPE_UNSUPPORTED',
          message: "This record type isn't part of the approved exchange set with WebEOC.",
        });
      }

      // isRecordTypeDeclared called BEFORE checkRecordAuthority — an
      // undeclared type (no registry row at all) is unsupported for
      // outbound sync for the identical reason it's skipped on inbound
      // sync: there's no registered authority to check an EPMP-originated
      // write against.
      const declared = await isRecordTypeDeclared(type);
      if (!declared) {
        return reply.code(400).send({
          error_code: 'EOC_RECORD_TYPE_UNSUPPORTED',
          message: "This record type isn't part of the approved exchange set with WebEOC.",
        });
      }

      // Only once declaration is confirmed does this call
      // checkRecordAuthority — reaching a non-'EPMP' branch here means a
      // row exists and names some OTHER system as authoritative, not the
      // ambiguous undeclared-default, since declaration was already
      // confirmed above.
      const authority = await checkRecordAuthority(type);
      if (authority !== 'EPMP') {
        return reply.code(400).send({
          error_code: 'EOC_RECORD_TYPE_UNSUPPORTED',
          message: 'Outbound sync is only permitted for record types EPMP is authoritative for.',
        });
      }

      const configId = await findOrCreateEocCotsConfig();
      await query(
        `INSERT INTO eoc_cots_sync_log (config_id, record_type, external_id, direction, sync_status)
         VALUES ($1, $2, $3, 'outbound', 'ok')`,
        [configId, type, external_id ?? null],
      );
      void payload;

      return reply.code(200).send({ status: 'ok' });
    },
  );

  app.get(
    '/api/v1/integrations/eoc-cots/conflicts',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<EocCotsConflictRow>(
        `SELECT * FROM eoc_cots_conflicts WHERE resolution IS NULL ORDER BY created_at ASC`,
      );
      // Plan 08-03 cross-plan touch-up: this stub adapter has exactly one
      // configured vendor (KNOWN_VENDOR = 'WebEOC'), so every conflict row
      // is attributable to it — added here so IntegrationHealth.tsx's
      // conflict-row expansion (08-03) can join conflicts to the
      // integration-health row by system_name without inventing a second
      // lookup. A genuinely multi-vendor adapter would derive this from
      // eoc_cots_config.vendor via config_id instead of a hardcoded literal.
      return reply.code(200).send({ items: rows.map((row) => ({ ...row, system_name: KNOWN_VENDOR })) });
    },
  );

  app.get(
    '/api/v1/integrations/eoc-cots/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<IntegrationHealthRow>(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health WHERE system_name = 'WebEOC'`,
      );
      return reply.code(200).send({ items: rows });
    },
  );
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Same idempotent-against-double-start shape as Phase 7's scheduler
 * functions (startHazardFeedIngestionScheduler / startCadIngestionScheduler).
 */
export function startEocCotsSyncScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runEocCotsSync().catch((err) => console.error('[eoc-cots-adapter] sync failed', err));
  }, intervalMs);
}
