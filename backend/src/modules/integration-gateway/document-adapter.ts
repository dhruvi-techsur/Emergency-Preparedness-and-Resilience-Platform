import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';

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
 * table — see 1700000000007_plans-schema.js) with `plan_id` left NULL:
 * document_links.plan_id is nullable on that table, matching Plan
 * Repository's standalone-import flow where the plan association happens
 * at a later step in Plan 08-05's UI (confirmed via that migration's exact
 * column list before writing this INSERT). `imported_by` is ALWAYS the
 * requesting user's own id — never a shared/system id (T-08-09's
 * mitigation) — since `userId` is a required explicit parameter, not an
 * optional/defaultable value.
 */
export async function importDocument(
  userId: string,
  externalDocId: string,
): Promise<{ id: string; content: string }> {
  const accessSet = resolveUserAccessSet(userId);
  if (!accessSet.includes(externalDocId)) {
    throw new Error('IMPORT_PERMISSION_DENIED');
  }

  const doc = DOCUMENT_CATALOG.find((d) => d.external_document_id === externalDocId);
  const sourceSystem = doc?.source_system ?? 'SharePoint';

  const inserted = await query<{ id: string }>(
    `INSERT INTO document_links (external_document_id, source_system, mode, imported_by)
     VALUES ($1, $2, 'import_copy', $3)
     RETURNING id`,
    [externalDocId, sourceSystem, userId],
  );

  return {
    id: inserted[0].id,
    content: `Simulated content body for ${doc?.name ?? externalDocId} (imported point-in-time copy).`,
  };
}

/**
 * Same permission re-check as importDocument; on success establishes a
 * 'link_live' document_links row, optionally associated with `planId` if
 * known at link time.
 */
export async function linkDocument(
  userId: string,
  externalDocId: string,
  planId?: string,
): Promise<{ id: string }> {
  const accessSet = resolveUserAccessSet(userId);
  if (!accessSet.includes(externalDocId)) {
    throw new Error('IMPORT_PERMISSION_DENIED');
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
        const result = await linkDocument(req.epmpUser!.id, req.params.id, req.body?.plan_id);
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
