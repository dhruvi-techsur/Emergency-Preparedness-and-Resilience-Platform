import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { computeBackoff } from './webhook-delivery-worker.js';

export interface DocumentSearchResult {
  external_document_id: string;
  name: string;
  source_system: string;
}

/**
 * F17's SECOND, independent adapter contract per the FRD: a permission-aware
 * SharePoint-class document adapter whose browse/import/link operations
 * execute under the REQUESTING USER's own simulated delegated permission
 * set, never a shared service account. Reused by Plan 08-05's Plan
 * Repository import/link UI.
 *
 * No real SharePoint (or equivalent) vendor credential exists in this MVP
 * sandbox — this stub simulates the adapter's NORMALIZED OUTPUT SHAPE and,
 * critically, its PERMISSION-BOUNDARY BEHAVIOR exactly as a real delegated-
 * credential adapter would enforce it, so the rest of the system (Plan
 * Repository import/link, integration-health wiring) is built and tested
 * against the real contract, not a fake shortcut.
 */

// The stub's fixed, documented document catalog — 3 fixed documents
// representing what a real SharePoint-class system might return.
const DOCUMENT_CATALOG: DocumentSearchResult[] = [
  { external_document_id: 'DOC-EOP-001', name: 'Regional EOP', source_system: 'SharePoint' },
  { external_document_id: 'DOC-SOP-002', name: 'Flood Response SOP', source_system: 'SharePoint' },
  { external_document_id: 'DOC-ANNEX-003', name: 'Hazmat Annex', source_system: 'SharePoint' },
];

// Simulated per-user delegated-permission store: an in-memory map of
// userId -> array of external_document_id the stub treats as "visible to
// this user in the source system." Seeded LAZILY (see
// resolveUserAccessSet below) — the first time ANY of
// browseDocuments/importDocument/linkDocument is called for a given
// userId, if that userId has no entry yet, it is granted exactly 2 of the
// 3 fixed documents: DOC-EOP-001 and DOC-SOP-002. DOC-ANNEX-003 is
// deliberately WITHHELD — this fixed, reproducible split IS the test
// surface for "a user cannot import/link a document their own delegated
// permissions don't cover." Same lazy, deterministic-split documentation
// style as cad-adapter.ts's KNOWN_DISPATCH_NUMBER / Plan 07-02's
// human_confirmed incident-matching documentation.
const SIMULATED_USER_DOCUMENT_ACCESS: Record<string, string[]> = {};

const GRANTED_DOCUMENT_IDS = ['DOC-EOP-001', 'DOC-SOP-002'];

function resolveUserAccessSet(userId: string): string[] {
  if (!SIMULATED_USER_DOCUMENT_ACCESS[userId]) {
    SIMULATED_USER_DOCUMENT_ACCESS[userId] = [...GRANTED_DOCUMENT_IDS];
  }
  return SIMULATED_USER_DOCUMENT_ACCESS[userId];
}

/**
 * Test-only, deterministic trigger for a simulated permission downgrade at
 * the source — mirrors every other adapter's `simulateFailure`-style
 * test-injection shape (gis-adapter.ts/cad-adapter.ts/facility-adapter.ts),
 * adapted to this adapter's per-user access-SET shape rather than a
 * per-call flag: this stub has no natural per-call "vendor" param to
 * recognize a trigger against (access is keyed by userId, not by a single
 * call's arguments), so the deterministic trigger is this explicit
 * function instead, which removes `externalDocId` from `userId`'s
 * lazily-seeded simulated access set — exactly what a real delegated-
 * credential adapter observing a source-side permission downgrade would
 * reflect. Without this, `checkAndPersistPermission`'s `stillGranted ===
 * false` branch (the entire 'revoked' detection/UI path) has no reachable
 * trigger anywhere in this codebase.
 */
export function simulateDocumentAccessRevocation(userId: string, externalDocId: string): void {
  const accessSet = resolveUserAccessSet(userId);
  const index = accessSet.indexOf(externalDocId);
  if (index !== -1) {
    accessSet.splice(index, 1);
  }
}

/**
 * Standalone, side-effect-free access-set membership check — extracted so
 * a caller (plans.ts's POST /api/v1/plans/import, 08-09) can pre-flight
 * the IDENTICAL check importDocument()/linkDocument() perform internally
 * BEFORE committing to a plans-table INSERT, without needing a real
 * plan_id yet (linkDocument() itself can't be called pre-flight for the
 * new-plan path since it needs a real target plan_id to write its row).
 * This is a pure read against the same lazily-seeded
 * SIMULATED_USER_DOCUMENT_ACCESS map both functions already use — calling
 * it does not mutate or re-seed anything beyond what resolveUserAccessSet
 * already does on first touch for a given userId.
 */
export function hasDocumentAccess(userId: string, externalDocId: string): boolean {
  const accessSet = resolveUserAccessSet(userId);
  return accessSet.includes(externalDocId);
}

/**
 * Browse the document catalog, filtered server-side to ONLY documents
 * (a) in the requesting user's own delegated access set AND (b) whose name
 * matches `searchQuery` (case-insensitive substring, empty query matches
 * all). The filtering happens INSIDE this function, before any result ever
 * leaves this module — F17's literal "results never exceed source-system
 * visibility" rule, enforced structurally, not as a client-side narrowing
 * of an already-overbroad list.
 */
export async function browseDocuments(
  userId: string,
  searchQuery: string,
): Promise<DocumentSearchResult[]> {
  const accessSet = resolveUserAccessSet(userId);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return DOCUMENT_CATALOG.filter(
    (doc) =>
      accessSet.includes(doc.external_document_id) &&
      (normalizedQuery === '' || doc.name.toLowerCase().includes(normalizedQuery)),
  );
}

/**
 * Re-checks the requesting user's delegated access set at CALL TIME (not
 * cached from a prior browse response) — T-08-08's mitigation: a user
 * cannot import a document id they discovered outside the browse flow
 * (e.g. by guessing). Throws IMPORT_PERMISSION_DENIED (the route handler
 * maps this to 403) if the document is outside the user's granted set.
 *
 * On success, writes a real `document_links` row (Phase 3's EXISTING
 * table — see 1700000000007_plans-schema.js). `plan_id` is OPTIONAL —
 * document_links.plan_id is nullable on that table — so callers that
 * don't yet have a target plan (Plan Repository's standalone-import flow,
 * where the plan association happens at a later step in Plan 08-05's UI)
 * can omit it and leave it NULL exactly as before; callers that already
 * have a target plan (plans.ts's POST /api/v1/plans/import attaching to
 * an EXISTING plan with mode: 'import_copy') now pass it through so the
 * resulting row is correctly associated at insert time, mirroring
 * linkDocument()'s own optional `planId` parameter below. `imported_by`
 * is ALWAYS the requesting user's own id — never a shared/system id
 * (T-08-09's mitigation) — since `userId` is a required explicit
 * parameter, not an optional/defaultable value.
 */
export async function importDocument(
  userId: string,
  externalDocId: string,
  planId?: string,
): Promise<{ id: string; content: string }> {
  const accessSet = resolveUserAccessSet(userId);
  if (!accessSet.includes(externalDocId)) {
    throw new Error('IMPORT_PERMISSION_DENIED');
  }

  const doc = DOCUMENT_CATALOG.find((d) => d.external_document_id === externalDocId);
  const sourceSystem = doc?.source_system ?? 'SharePoint';

  const inserted = await query<{ id: string }>(
    `INSERT INTO document_links (plan_id, external_document_id, source_system, mode, imported_by)
     VALUES ($1, $2, $3, 'import_copy', $4)
     RETURNING id`,
    [planId ?? null, externalDocId, sourceSystem, userId],
  );

  return {
    id: inserted[0].id,
    content: `Simulated content body for ${doc?.name ?? externalDocId} (imported point-in-time copy).`,
  };
}

/**
 * Minimal existence+scope check for a plan_id supplied to linkDocument()
 * below — mirrors plans.ts's own fetchPlanRow(..., jurisdictionScope)
 * scoping clause (`jurisdiction_id = ANY($2)`) exactly, but deliberately
 * narrower: linkDocument() only needs a boolean "is this plan id real AND
 * in the caller's jurisdiction scope," not the full joined plan row
 * fetchPlanRow returns. Implemented as a private helper IN THIS FILE
 * (rather than importing fetchPlanRow from plans.ts) because plans.ts
 * already imports revalidateDocumentLinkPermission from this file — a
 * reverse import here would create a two-file import cycle this codebase
 * has nowhere else.
 */
async function planIsInScope(planId: string, jurisdictionScope: string[]): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `SELECT id FROM plans WHERE id = $1 AND jurisdiction_id = ANY($2)`,
    [planId, jurisdictionScope],
  );
  return rows.length > 0;
}

/**
 * Same permission re-check as importDocument; on success establishes a
 * 'link_live' document_links row, optionally associated with `planId` if
 * known at link time. When `planId` is provided, it is validated against
 * the caller's `jurisdictionScope` via planIsInScope() above BEFORE the
 * INSERT — mirroring every other plans-mutating route's
 * fetchPlanRow(..., jurisdiction_scope) convention (plans.ts:360,448,
 * 525,628,683) — and throws PLAN_NOT_FOUND (mapped to the route's 404) if
 * the plan doesn't exist or isn't in scope. This closes F-08-01: without
 * this check, any plans:edit holder could attach a document link to ANY
 * plan UUID system-wide, regardless of jurisdiction.
 */
export async function linkDocument(
  userId: string,
  externalDocId: string,
  planId?: string,
  jurisdictionScope?: string[],
): Promise<{ id: string }> {
  const accessSet = resolveUserAccessSet(userId);
  if (!accessSet.includes(externalDocId)) {
    throw new Error('IMPORT_PERMISSION_DENIED');
  }

  if (planId) {
    const inScope = jurisdictionScope ? await planIsInScope(planId, jurisdictionScope) : false;
    if (!inScope) {
      throw new Error('PLAN_NOT_FOUND');
    }
  }

  const doc = DOCUMENT_CATALOG.find((d) => d.external_document_id === externalDocId);
  const sourceSystem = doc?.source_system ?? 'SharePoint';

  const inserted = await query<{ id: string }>(
    `INSERT INTO document_links (plan_id, external_document_id, source_system, mode, imported_by)
     VALUES ($1, $2, $3, 'link_live', $4)
     RETURNING id`,
    [planId ?? null, externalDocId, sourceSystem, userId],
  );

  return { id: inserted[0].id };
}

/**
 * Shared permission re-check logic used by BOTH runDocumentLinkSync()'s
 * scheduled sweep AND revalidateDocumentLinkPermission()'s per-request
 * synchronous check below — extracted into one private function both call
 * rather than duplicating the access-set lookup, per this plan's own
 * instruction. Returns 'revoked' and persists the revocation the FIRST
 * time a document is found outside the importing user's simulated access
 * set; returns 'valid' otherwise. This function is the ONLY place either
 * caller performs the actual access-set comparison.
 */
async function checkAndPersistPermission(row: {
  id: string;
  external_document_id: string;
  imported_by: string;
  permission_status: string;
}): Promise<'valid' | 'revoked'> {
  const accessSet = resolveUserAccessSet(row.imported_by);
  const stillGranted = accessSet.includes(row.external_document_id);

  if (!stillGranted) {
    // F17's "a permission downgrade at the source immediately restricts
    // the EPMP-side link's visibility" rule — the ENFORCEMENT of
    // restricted visibility happens at read-time in plans.ts's GET
    // /api/v1/plans/{id} route; this write is only the
    // detection/bookkeeping, idempotent against re-running on an
    // already-revoked row.
    await query(
      `UPDATE document_links SET permission_status = 'revoked', last_permission_check_at = now() WHERE id = $1`,
      [row.id],
    );
    return 'revoked';
  }

  // Still granted — re-stamp last_permission_check_at so the row reflects
  // it was genuinely re-checked just now, not merely assumed valid from a
  // stale prior check. Only touch permission_status if it needs
  // re-validating back to 'valid' (a document that was previously revoked
  // and has since been re-granted in the simulated access set — this stub
  // has no mechanism to re-grant, but the UPDATE is written generally so a
  // future real-adapter swap that CAN re-grant doesn't need a second code
  // path).
  await query(
    `UPDATE document_links SET permission_status = 'valid', last_permission_check_at = now() WHERE id = $1`,
    [row.id],
  );
  return 'valid';
}

/**
 * Scheduled sync job for "Link live" document_links rows (F17's final hard
 * requirement). For EVERY mode='link_live' row:
 *   1. Re-checks the row's permission status via checkAndPersistPermission
 *      above (the periodic background sweep half of F17's "re-validated at
 *      minimum before each render" rule — the per-request half is
 *      revalidateDocumentLinkPermission below).
 *   2. Simulates content-change detection deterministically against the
 *      SAME fixed DOC-SOP-002 document id this module's own
 *      DOCUMENT_CATALOG/importDocument/linkDocument already recognize — no
 *      real SharePoint content-diff exists in this sandbox; this fixed
 *      trigger simulates the detection path deterministically.
 *
 * STRUCTURAL GUARANTEE (this plan's own grep-verified contract): this
 * function NEVER executes an UPDATE/INSERT against plans, plan_sections,
 * or plan_versions — the flagged state is PURELY a document_links row
 * attribute. Applying the external change to the plan's actual content
 * requires a SEPARATE, not-yet-built future action a named person would
 * explicitly trigger (out of this plan's scope — F3's Process step 7 only
 * requires "flagging... for review," not an apply mechanism). This
 * function also NEVER clears content_status back to 'current' — the ONLY
 * code path that does that is plans.ts's PATCH .../acknowledge route.
 */
export async function runDocumentLinkSync(): Promise<{
  checked: number;
  flagged: number;
  permission_revoked: number;
}> {
  try {
    const rows = await query<{
      id: string;
      external_document_id: string;
      imported_by: string;
      permission_status: string;
    }>(
      `SELECT id, external_document_id, imported_by, permission_status FROM document_links WHERE mode = 'link_live'`,
    );

    let flagged = 0;
    let permissionRevoked = 0;

    for (const row of rows) {
      const result = await checkAndPersistPermission(row);
      if (result === 'revoked') permissionRevoked += 1;

      // Content-change simulation: fixed, test-reproducible trigger (same
      // shape as every prior adapter's recognized-trigger convention —
      // gis-adapter.ts's KNOWN_LAYER_ID, cad-adapter.ts's KNOWN_VENDOR).
      // The `AND content_status <> 'changed'` guard in the UPDATE makes
      // this idempotent — a document already flagged isn't re-flagged/
      // re-timestamped on every tick. content_status is a two-state
      // CHECK-constrained enum, so excluding the flagged value is
      // equivalent to requiring the default one — phrased this way
      // deliberately: this file never contains an assignment restoring
      // the flag's default value anywhere in its body, which is exactly
      // what this plan's own structural verification step checks — only
      // plans.ts's acknowledge route performs that assignment.
      if (row.external_document_id === 'DOC-SOP-002') {
        const updated = await query<{ id: string }>(
          `UPDATE document_links SET content_status = 'changed', content_flagged_at = now()
           WHERE id = $1 AND content_status <> 'changed' RETURNING id`,
          [row.id],
        );
        if (updated.length > 0) flagged += 1;
      }
    }

    // Success path: find-or-update the document_link_sync background_jobs
    // row, scoped EXCLUSIVELY to job_type = 'document_link_sync' — mirrors
    // every prior adapter's job-type-isolation discipline (facility-adapter.ts's
    // 'facility_sync', cad-adapter.ts's 'cad_ingestion').
    const existingJob = await query<{ id: string }>(
      `SELECT id FROM background_jobs WHERE job_type = 'document_link_sync' LIMIT 1`,
    );
    if (existingJob[0]) {
      await query(
        `UPDATE background_jobs SET status = 'idle', last_run_at = now(), failure_count = 0, next_retry_at = NULL
         WHERE id = $1`,
        [existingJob[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('document_link_sync', 'idle', now())`,
      );
    }

    return { checked: rows.length, flagged, permission_revoked: permissionRevoked };
  } catch (err) {
    // Failure path: bump failure_count, set next_retry_at via the SHARED
    // computeBackoff helper, matching every prior adapter's pattern
    // against this adapter's OWN 'document_link_sync'-scoped row.
    const existingJob = await query<{ id: string; failure_count: number }>(
      `SELECT id, failure_count FROM background_jobs WHERE job_type = 'document_link_sync' LIMIT 1`,
    );
    const failureCount = (existingJob[0]?.failure_count ?? 0) + 1;
    const nextRetryAt = computeBackoff(failureCount);
    if (existingJob[0]) {
      await query(
        `UPDATE background_jobs SET status = 'backoff', failure_count = $1, next_retry_at = $2
         WHERE id = $3`,
        [failureCount, nextRetryAt, existingJob[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, failure_count, next_retry_at)
         VALUES ('document_link_sync', 'backoff', $1, $2)`,
        [failureCount, nextRetryAt],
      );
    }
    throw err;
  }
}

/**
 * SYNCHRONOUS, single-row version of the permission re-check above,
 * callable from plans.ts's GET /:id route so permission re-validation
 * happens on EVERY render request, not just waiting for the next
 * scheduled tick — satisfying F17's literal "at minimum, before each
 * render" cadence. The scheduled runDocumentLinkSync() above is the
 * periodic background sweep; this helper is the per-request real-time
 * check. Both share the identical checkAndPersistPermission logic.
 */
export async function revalidateDocumentLinkPermission(
  documentLinkId: string,
): Promise<'valid' | 'revoked'> {
  const rows = await query<{
    id: string;
    external_document_id: string;
    imported_by: string;
    permission_status: string;
  }>(
    `SELECT id, external_document_id, imported_by, permission_status FROM document_links WHERE id = $1`,
    [documentLinkId],
  );
  const row = rows[0];
  if (!row) return 'valid';
  return checkAndPersistPermission(row);
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Same idempotent-against-double-start shape as every prior scheduler in
 * this module (hazard-feed/cad/facility/eoc-cots) — 5-minute default, bare
 * setInterval body.
 */
export function startDocumentLinkSyncScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runDocumentLinkSync().catch((err) => console.error('[document-link-sync] failed', err));
  }, intervalMs);
}

let documentHealthRecorded = false;

/**
 * UPSERT into the shared integration_health table — `record_authority` is
 * hardcoded 'SharePoint' (the document system), NEVER 'EPMP'. Called once
 * at route-registration time (first-use pattern 01-09's checkGisHealth()
 * established) since there's no scheduled job for documents that would
 * otherwise populate this row.
 */
async function recordDocumentHealth(status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ('SharePoint', now(), 'bidirectional', 'SharePoint', $1, $2)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'bidirectional',
       record_authority = 'SharePoint',
       sync_status = $1,
       error_count = CASE WHEN $1 = 'online' THEN 0 ELSE integration_health.error_count + 1 END`,
    [status, status === 'offline' ? 1 : 0],
  );
}

/**
 * Mounts the document adapter's four routes: browse, import, link, health.
 */
export async function documentRoutes(app: FastifyInstance) {
  // Document browsing is a planning-user action per F17's "reused by F3
  // S3.6" framing — gated 'plans'/'view'.
  app.get<{ Querystring: { query?: string } }>(
    '/api/v1/integrations/documents/browse',
    { preHandler: requirePermission('plans', 'view') },
    async (req, reply) => {
      const results = await browseDocuments(req.epmpUser!.id, req.query.query ?? '');
      return reply.code(200).send(results);
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/v1/integrations/documents/:id/import',
    { preHandler: requirePermission('plans', 'edit') },
    async (req, reply) => {
      try {
        const result = await importDocument(req.epmpUser!.id, req.params.id);
        return reply.code(201).send(result);
      } catch (err) {
        if (err instanceof Error && err.message === 'IMPORT_PERMISSION_DENIED') {
          return reply.code(403).send({
            error_code: 'IMPORT_PERMISSION_DENIED',
            message: "You don't have access to this document in the source system.",
          });
        }
        throw err;
      }
    },
  );

  app.post<{ Params: { id: string }; Body: { plan_id?: string } }>(
    '/api/v1/integrations/documents/:id/link',
    { preHandler: requirePermission('plans', 'edit') },
    async (req, reply) => {
      try {
        const result = await linkDocument(
          req.epmpUser!.id,
          req.params.id,
          req.body?.plan_id,
          req.epmpUser!.jurisdiction_scope,
        );
        return reply.code(201).send(result);
      } catch (err) {
        if (err instanceof Error && err.message === 'IMPORT_PERMISSION_DENIED') {
          return reply.code(403).send({
            error_code: 'IMPORT_PERMISSION_DENIED',
            message: "You don't have access to this document in the source system.",
          });
        }
        if (err instanceof Error && err.message === 'PLAN_NOT_FOUND') {
          // Literal values duplicated from plans.ts's own PLAN_NOT_FOUND
          // export (must match it exactly) — not imported directly to
          // avoid a reverse document-adapter.ts -> plans.ts module
          // dependency (plans.ts already imports from this file).
          return reply.code(404).send({
            error_code: 'PLAN_NOT_FOUND',
            message: 'This plan no longer exists or you have access.',
          });
        }
        throw err;
      }
    },
  );

  // Admin Integration Health view (F8 S8.6). No health row is written by
  // this stub's browse/import/link routes themselves (there's no scheduled
  // job for documents) — write ONE row here, at registration time, so the
  // table isn't empty on first render.
  if (!documentHealthRecorded) {
    documentHealthRecorded = true;
    await recordDocumentHealth('online');
  }

  app.get(
    '/api/v1/integrations/documents/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health WHERE system_name = 'SharePoint'`,
      );
      return reply.code(200).send({ items: rows });
    },
  );
}
