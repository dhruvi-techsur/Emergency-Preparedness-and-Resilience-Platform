import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { computeBackoff } from './webhook-delivery-worker.js';

export interface HrisPersonnelRecord {
  external_person_id: string;
  name: string;
  email: string | null;
  role_titles: string[];
  qualifications: string[];
  contact_info: Record<string, unknown>;
  jurisdiction?: string;
  source: string;
  as_of: string;
}

interface PersonnelRosterRow {
  id: string;
  external_person_id: string;
  matched_user_id: string | null;
  name: string;
  email: string | null;
  role_titles: string[] | null;
  qualifications: string[] | null;
  contact_info: Record<string, unknown> | null;
  source: string;
  as_of: string;
}

// No real Workday/PeopleSoft/agency-HRIS credential exists in this MVP
// sandbox (TechArch's adapter catalog names HR/IAM vendors as
// agency-specific, out-of-band configuration this phase does not have).
// This stub simulates the adapter's NORMALIZED OUTPUT SHAPE exactly as a
// real adapter would produce it — two personnel records from one agency
// HRIS vendor (one that matches a real seeded EPMP user by email, one that
// deliberately matches none) — so the rest of the system (email-only
// matching, structural read-only enforcement, integration-health wiring)
// is built and tested against the real contract, not a fake shortcut.
// Swapping in a real HRIS vendor call later means replacing only this
// function's body; every caller (runHrisRosterSync, hrisRosterRoutes
// below) is unaffected. Mirrors gis-adapter.ts's KNOWN_LAYER_ID /
// cad-adapter.ts's KNOWN_VENDOR doc-comment pattern precisely.
const KNOWN_HRIS_VENDOR = 'agency_hris';

// The ONE real seeded EPMP user's email this stub's success-path matched
// record deliberately carries, so the email-only-matching rule is
// provably exercisable end-to-end (commander@epmp.local, seeded since
// Phase 2's 02-05 plan as the incident_commander persona). Documented
// here explicitly rather than left implicit in the literal string below,
// since this plan's own integration test depends on this exact value.
const MATCHED_SEED_USER_EMAIL = 'commander@epmp.local';

/**
 * Stub HR/IAM roster fetch — matches F16-roster's `GET {adapter}/personnel?
 * since={timestamp}` poll contract. `since` is accepted for contract-shape
 * parity with the real poll endpoint but this stub always returns its
 * fixed set of records regardless of its value (no persisted event
 * history to filter against in this stub). `simulateFailure` is the
 * explicit test-injection trigger (same shape as cad-adapter.ts's/
 * facility-adapter.ts's own `simulateFailure` param, since this adapter —
 * like CAD/facility — has no per-call vendor-identifying param to
 * recognize against beyond the hardcoded KNOWN_HRIS_VENDOR itself).
 *
 * On success, returns exactly 2 normalized records: one whose `email`
 * matches MATCHED_SEED_USER_EMAIL (the real seeded commander@epmp.local
 * user — proves the matched-by-email path is exercisable), and one whose
 * `email` matches NO seeded user (the deliberate unmatched-record proof —
 * F16's "retained with matched_user_id NULL rather than force-matched,
 * guessed, or silently discarded" rule).
 */
export async function fetchHrisPersonnel(
  since?: string,
  simulateFailure?: boolean,
): Promise<HrisPersonnelRecord[]> {
  void since;

  // Any unrecognized vendor scenario (the explicit `simulateFailure` flag,
  // since this stub has exactly one configured vendor and no per-call
  // vendor-identifying param to recognize against) simulates an HRIS feed
  // outage — exercises the exact failure path a real unreachable
  // Workday/PeopleSoft/agency-HRIS endpoint would trigger.
  if (simulateFailure === true) {
    await recordHrisHealth('offline');
    throw new Error('HRIS_FEED_UNREACHABLE: agency_hris personnel feed unreachable');
  }

  const asOf = new Date().toISOString();

  const records: HrisPersonnelRecord[] = [
    {
      external_person_id: 'HRIS-PERSON-001',
      name: 'Alex Commander',
      email: MATCHED_SEED_USER_EMAIL,
      role_titles: ['Incident Commander', 'Shift Supervisor'],
      qualifications: ['ICS-300', 'NIMS-ICS-400'],
      contact_info: { phone: '555-0101', office: 'EOC Main' },
      source: KNOWN_HRIS_VENDOR,
      as_of: asOf,
    },
    {
      external_person_id: 'HRIS-PERSON-002',
      name: 'Jordan Reserve',
      email: 'jordan.reserve@agency-hris-external.example',
      role_titles: ['Logistics Specialist'],
      qualifications: ['ICS-100'],
      contact_info: { phone: '555-0102', office: 'Field Station 3' },
      source: KNOWN_HRIS_VENDOR,
      as_of: asOf,
    },
  ];

  // Provenance enforcement (F16's provenance-enforcement rule): reject
  // before this function even returns if source/as_of ever end up missing
  // on any record — structurally guaranteed here since both are always
  // set above, but the check is written explicitly so a future
  // real-vendor swap can't silently drop them. Same explicit-check-anyway
  // style as gis-adapter.ts/cad-adapter.ts/facility-adapter.ts's own
  // provenance checks.
  for (const record of records) {
    if (!record.source || !record.as_of) {
      await recordHrisHealth('offline');
      throw new Error('PROVENANCE_REQUIRED: HRIS personnel record missing source or as_of');
    }
  }

  await recordHrisHealth('online');
  return records;
}

/**
 * UPSERT into the shared integration_health table — `record_authority` is
 * hardcoded 'HRIS', NEVER 'EPMP' (matching Phase 1's own already-seeded
 * record_authority_registry row declaring {record_type: 'personnel_roster',
 * authoritative_system: 'HRIS'}). Mirrors cad-adapter.ts's
 * recordCadHealth / facility-adapter.ts's recordFacilityHealth bump/reset
 * error_count convention exactly.
 */
async function recordHrisHealth(status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ('HRIS', now(), 'inbound', 'HRIS', $1, $2)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'inbound',
       record_authority = 'HRIS',
       sync_status = $1,
       error_count = CASE WHEN $1 = 'online' THEN 0 ELSE integration_health.error_count + 1 END`,
    [status, status === 'offline' ? 1 : 0],
  );
}

/**
 * Scheduled sync job: fetches the current HRIS roster snapshot, upserts it
 * into `personnel_roster` (idempotent — ON CONFLICT (external_person_id,
 * source) DO UPDATE), then performs EMAIL-ONLY matching against `users` in
 * a SEPARATE, explicit step — this UPSERT writes ONLY personnel_roster's
 * own HR-sourced columns, NEVER matched_user_id in the same statement.
 *
 * Find-or-update bookkeeping against `background_jobs` is scoped
 * EXCLUSIVELY to job_type = 'report_generation' — one of Phase 1's
 * original reserved-but-unused CHECK-constraint values, confirmed
 * unclaimed in application code as of this plan's authoring/execution
 * (re-verified via `grep -rn "report_generation" backend/src` returning
 * zero matches before this file was written). Chosen over the other
 * remaining unclaimed reserved value ('signal_triage') because it is
 * earlier alphabetically and because an HR/IAM roster sync is
 * conceptually closer to a periodic reporting-style batch job than to the
 * other already-claimed categories ('feed_ingestion'/'cad_ingestion'/
 * 'facility_sync'/'sync_reconciliation'/'document_link_sync'/
 * 'webhook_delivery'/'notification_fanout'/'task_overdue_sweep').
 *
 * On a fetch failure, the EXISTING personnel_roster rows from a prior
 * successful sync are left completely untouched (never deleted, never
 * blanked) — this IS the "last-synced roster data remains available,
 * labeled with its own as_of age" outage-resilience rule, enforced
 * structurally by this function never issuing a DELETE/UPDATE-to-null
 * against personnel_roster on its failure path.
 */
export async function runHrisRosterSync(
  simulateFailure?: boolean,
): Promise<{ synced: number; matched: number; unmatched: number }> {
  try {
    const records = await fetchHrisPersonnel(undefined, simulateFailure);

    let matched = 0;
    let unmatched = 0;

    for (const record of records) {
      const upserted = await query<{ id: string }>(
        `INSERT INTO personnel_roster
           (external_person_id, name, email, role_titles, qualifications, contact_info, source, as_of)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (external_person_id, source) DO UPDATE SET
           name = EXCLUDED.name,
           email = EXCLUDED.email,
           role_titles = EXCLUDED.role_titles,
           qualifications = EXCLUDED.qualifications,
           contact_info = EXCLUDED.contact_info,
           as_of = EXCLUDED.as_of,
           updated_at = now()
         RETURNING id`,
        [
          record.external_person_id,
          record.name,
          record.email,
          record.role_titles,
          record.qualifications,
          JSON.stringify(record.contact_info),
          record.source,
          record.as_of,
        ],
      );
      const rosterId = upserted[0].id;

      // Email-only matching (the hard constraint): a pure READ against
      // `users` — never a write. If a match is found, UPDATE ONLY
      // personnel_roster.matched_user_id, never anything on the users row
      // itself. If no match, explicitly leave matched_user_id as whatever
      // it already was (NULL on first insert) — never guess, never
      // fuzzy-match on name, never force-match the nearest record.
      if (record.email) {
        const userMatch = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1`, [record.email]);
        if (userMatch[0]) {
          await query(`UPDATE personnel_roster SET matched_user_id = $1 WHERE id = $2`, [
            userMatch[0].id,
            rosterId,
          ]);
          matched += 1;
        } else {
          unmatched += 1;
        }
      } else {
        unmatched += 1;
      }
    }

    // Success path: find-or-update the report_generation background_jobs
    // row (job_type = 'report_generation', see this function's own doc
    // comment above for the full selection rationale).
    const existing = await query<{ id: string }>(
      `SELECT id FROM background_jobs WHERE job_type = 'report_generation' LIMIT 1`,
    );
    if (existing[0]) {
      await query(
        `UPDATE background_jobs SET status = 'idle', last_run_at = now(), failure_count = 0, next_retry_at = NULL
         WHERE id = $1`,
        [existing[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('report_generation', 'idle', now())`,
      );
    }

    return { synced: records.length, matched, unmatched };
  } catch (err) {
    // Failure path: bump failure_count, set next_retry_at via the SHARED
    // computeBackoff helper (webhook-delivery-worker.ts) — not a second
    // bespoke backoff implementation, matching every prior adapter's
    // pattern against this adapter's OWN 'report_generation'-scoped row.
    // The EXISTING personnel_roster rows from a prior successful sync are
    // left completely untouched (no DELETE/blanking UPDATE anywhere in
    // this catch block) — this is the "last-known data, labeled with its
    // own as_of age" rule, structurally guaranteed by this function never
    // touching personnel_roster on its failure path.
    const existing = await query<{ id: string; failure_count: number }>(
      `SELECT id, failure_count FROM background_jobs WHERE job_type = 'report_generation' LIMIT 1`,
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
         VALUES ('report_generation', 'backoff', $1, $2)`,
        [failureCount, nextRetryAt],
      );
    }

    // A sync-feed failure must not throw out of this function — matching
    // F16's "last-synced roster data remains available" rule. Return early
    // with a zeroed result rather than re-throwing.
    return { synced: 0, matched: 0, unmatched: 0 };
  }
}

/**
 * Mounts the HRIS roster adapter's two routes:
 *  - GET /api/v1/integrations/hris/personnel?since={ts}
 *  - GET /api/v1/integrations/hris/health
 *
 * STRICTLY read-only — no PATCH/PUT/DELETE route exists anywhere in this
 * file (or in any other file in this codebase) for personnel_roster. This
 * absence IS the enforcement mechanism per F16's "role/qualification
 * value can only change by resyncing... never a direct in-EPMP edit"
 * structural rule, mirroring Plan 07-02/08-02's identical CAD/facility
 * read-only structural guarantee.
 */
export async function hrisRosterRoutes(app: FastifyInstance) {
  // Reference data consumed by Command Role Assignment (F1) / Resource
  // Request matching (F4), matching Plan 07-02's CAD-dispatch-events
  // permission precedent — gated 'incidents'/'view', not 'admin'/'view',
  // so the command-staff roles who actually need this data (and hold no
  // admin:view grant) can reach it.
  app.get<{ Querystring: { since?: string } }>(
    '/api/v1/integrations/hris/personnel',
    { preHandler: requirePermission('incidents', 'view') },
    async (_req, reply) => {
      const rows = await query<PersonnelRosterRow>(
        `SELECT id, external_person_id, matched_user_id, name, email, role_titles, qualifications, contact_info, source, as_of
         FROM personnel_roster
         ORDER BY name`,
      );
      return reply.code(200).send({ items: rows });
    },
  );

  // Admin Integration Health view (F8 S8.6), matching every other admin
  // health route in this codebase.
  app.get(
    '/api/v1/integrations/hris/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health WHERE system_name = 'HRIS'`,
      );
      return reply.code(200).send({ items: rows });
    },
  );

  // Do NOT add any PATCH/PUT/DELETE route to this file, or to any OTHER
  // file in this codebase, for personnel_roster — the absence of such a
  // route IS the enforcement mechanism per F16's "role/qualification
  // value can only change by resyncing... never a direct in-EPMP edit"
  // rule, mirroring Plan 07-02's identical CAD read-only structural
  // guarantee.
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Same idempotent-against-double-start shape as every prior scheduler in
 * this module (hazard-feed/cad/facility) — 5-minute default, bare
 * setInterval body.
 */
export function startHrisRosterSyncScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runHrisRosterSync().catch((err) => console.error('[hris-roster-sync] failed', err));
  }, intervalMs);
}
