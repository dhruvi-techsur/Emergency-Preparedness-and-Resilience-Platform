import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';

export type ConflictResolution = 'keep_mine' | 'keep_eoc';

interface SyncConflictRow {
  id: string;
  entity_type: string;
  entity_id: string;
  field_version: Record<string, unknown>;
  eoc_version: Record<string, unknown>;
  resolution: ConflictResolution | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

interface SyncConflictListRow extends SyncConflictRow {
  resolved_by_name: string | null;
}

export const SYNC_CONFLICT_NOT_FOUND = {
  error_code: 'SYNC_CONFLICT_NOT_FOUND',
  message: "This conflict no longer exists or you don't have access.",
} as const;

const SYNC_CONFLICT_ALREADY_RESOLVED = {
  error_code: 'SYNC_CONFLICT_ALREADY_RESOLVED',
  message: 'This conflict has already been resolved.',
} as const;

function shapeSyncConflictRow(row: SyncConflictRow) {
  return {
    id: row.id,
    entity_type: row.entity_type,
    entity_id: row.entity_id,
    field_version: row.field_version,
    eoc_version: row.eoc_version,
    resolution: row.resolution ?? undefined,
    resolved_by: row.resolved_by ?? undefined,
    resolved_at: row.resolved_at ?? undefined,
    created_at: row.created_at,
  };
}

export default async function syncConflictsRoutes(app: FastifyInstance) {
  // GET /api/v1/sync-conflicts -- lists unresolved conflicts (uses
  // idx_sync_conflicts_unresolved), joined to users for a readable
  // resolved_by summary (null for the unresolved rows this list returns).
  // This is what "surfaced to a named person" renders against.
  //
  // Jurisdiction-scope enforcement (F-05-01 fix, 05-SECURITY.md): every
  // list caller only ever sees conflicts whose underlying field_reports
  // row is incident-linked AND in their own jurisdiction_scope -- same
  // app-layer enforcement pattern tasks.ts/resource-requests.ts already
  // use (F-01 fix, 03-SECURITY.md). sync_conflicts has no jurisdiction_id
  // of its own, so the scope check joins sync_conflicts -> field_reports
  // -> incidents. A conflict whose field_reports row is standalone
  // (incident_id IS NULL, a documented valid resting state) carries no
  // jurisdiction data at all and is left unscoped, same convention as
  // tasks.ts's own `(t.incident_id IS NULL OR i.jurisdiction_id = ANY($N))`.
  app.get<{ Querystring: { page?: string; page_size?: string } }>(
    '/api/v1/sync-conflicts',
    { preHandler: requirePermission('field_reports', 'view') },
    async (req, reply) => {
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM sync_conflicts sc
         LEFT JOIN field_reports fr ON fr.id = sc.entity_id
         LEFT JOIN incidents i ON i.id = fr.incident_id
         WHERE sc.resolution IS NULL
           AND (fr.incident_id IS NULL OR i.jurisdiction_id = ANY($1))`,
        [req.epmpUser!.jurisdiction_scope],
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const rows = await query<SyncConflictListRow>(
        `SELECT sc.id, sc.entity_type, sc.entity_id, sc.field_version, sc.eoc_version,
                sc.resolution, sc.resolved_by, sc.resolved_at, sc.created_at,
                u.name AS resolved_by_name
         FROM sync_conflicts sc
         LEFT JOIN users u ON u.id = sc.resolved_by
         LEFT JOIN field_reports fr ON fr.id = sc.entity_id
         LEFT JOIN incidents i ON i.id = fr.incident_id
         WHERE sc.resolution IS NULL
           AND (fr.incident_id IS NULL OR i.jurisdiction_id = ANY($3))
         ORDER BY sc.created_at ASC
         LIMIT $1 OFFSET $2`,
        [page_size, offset, req.epmpUser!.jurisdiction_scope],
      );

      return reply.code(200).send({
        items: rows.map(shapeSyncConflictRow),
        total,
        page,
        page_size,
      });
    },
  );

  // GET /api/v1/sync-conflicts/{id} -- single-record lookup. 05-01 shipped
  // only the unresolved-list route above; this plan (05-04) adds this
  // small, clearly-scoped single-id route since Sync Conflict Resolution
  // needs to fetch exactly one conflict by its route param, and a
  // client-side `.find()` over the unresolved-only list would silently
  // 404 for an ALREADY-resolved conflict a user navigates back to (e.g.
  // via browser back-button) -- this route has no such restriction.
  // Jurisdiction-scope enforcement (F-05-01 fix, 05-SECURITY.md): same
  // join+filter as the list route above. A conflict outside the caller's
  // scope 404s with the existing SYNC_CONFLICT_NOT_FOUND code -- never a
  // 403 -- matching this codebase's not-found-not-403 convention for
  // scope violations (tasks.ts's fetchTaskRow does the same).
  app.get<{ Params: { id: string } }>(
    '/api/v1/sync-conflicts/:id',
    { preHandler: requirePermission('field_reports', 'view') },
    async (req, reply) => {
      const { id } = req.params;
      const rows = await query<SyncConflictListRow>(
        `SELECT sc.id, sc.entity_type, sc.entity_id, sc.field_version, sc.eoc_version,
                sc.resolution, sc.resolved_by, sc.resolved_at, sc.created_at,
                u.name AS resolved_by_name
         FROM sync_conflicts sc
         LEFT JOIN users u ON u.id = sc.resolved_by
         LEFT JOIN field_reports fr ON fr.id = sc.entity_id
         LEFT JOIN incidents i ON i.id = fr.incident_id
         WHERE sc.id = $1
           AND (fr.incident_id IS NULL OR i.jurisdiction_id = ANY($2))`,
        [id, req.epmpUser!.jurisdiction_scope],
      );
      const row = rows[0];
      if (!row) {
        return reply.code(404).send(SYNC_CONFLICT_NOT_FOUND);
      }
      return reply.code(200).send(shapeSyncConflictRow(row));
    },
  );

  // POST /api/v1/sync-conflicts/{id}/resolve -- a distinct action-level
  // ('resolve', not 'view') from the list route above -- mirrors Phase 3's
  // plans/resource_requests review/approve no-single-role segregation
  // pattern. Either outcome (keep_mine/keep_eoc) is ALWAYS visibly
  // recorded: the sync_conflicts row is updated with resolution/
  // resolved_by/resolved_at, and (when the underlying field_reports row is
  // incident-linked) a Timeline entry is appended -- never a silent
  // overwrite.
  app.post<{ Params: { id: string }; Body: { resolution: ConflictResolution } }>(
    '/api/v1/sync-conflicts/:id/resolve',
    { preHandler: requirePermission('field_reports', 'resolve') },
    async (req, reply) => {
      const { id } = req.params;
      const { resolution } = req.body ?? ({} as never);

      // Jurisdiction-scope enforcement (F-05-01 fix, 05-SECURITY.md): the
      // scope check runs on this initial row lookup, BEFORE any mutation
      // -- an out-of-scope id 404s here and never reaches the resolve
      // logic below, matching this codebase's not-found-not-403
      // convention (tasks.ts's fetchTaskRow does the same for its own
      // mutation routes).
      const rows = await query<SyncConflictRow>(
        `SELECT sc.*
         FROM sync_conflicts sc
         LEFT JOIN field_reports fr ON fr.id = sc.entity_id
         LEFT JOIN incidents i ON i.id = fr.incident_id
         WHERE sc.id = $1
           AND (fr.incident_id IS NULL OR i.jurisdiction_id = ANY($2))`,
        [id, req.epmpUser!.jurisdiction_scope],
      );
      const conflict = rows[0];
      if (!conflict) {
        return reply.code(404).send(SYNC_CONFLICT_NOT_FOUND);
      }
      if (conflict.resolution !== null) {
        return reply.code(409).send(SYNC_CONFLICT_ALREADY_RESOLVED);
      }

      // This plan implements the entity_type='field_report' case only; any
      // future entity_type extension (e.g. task_status sync-batch
      // reconciliation) must add its own resolution-application logic here,
      // documented as an explicit extension point.
      try {
        const resolved = await withTimelineTransaction(async (client) => {
          if (resolution === 'keep_mine') {
            // The conflict was the DETECTION, not a competing write -- the
            // field version's content is already the field_reports row
            // itself (inserted by sync-batch's conflict branch), so "keep
            // mine" is a status transition (conflict -> synced), not a
            // data merge/re-write of fields that were never actually
            // overwritten by anything.
            await client.query(
              `UPDATE field_reports SET sync_status='synced', synced_at=now() WHERE id=$1`,
              [conflict.entity_id],
            );
          } else {
            // keep_eoc: the field version is explicitly NOT applied -- the
            // EOC's existing state wins, and the field submission is
            // marked failed rather than silently vanishing, so the
            // responder can see it didn't take and resubmit if they
            // disagree with this outcome.
            await client.query(`UPDATE field_reports SET sync_status='failed' WHERE id=$1`, [conflict.entity_id]);
          }

          await client.query(
            `UPDATE sync_conflicts SET resolution=$1, resolved_by=$2, resolved_at=now() WHERE id=$3`,
            [resolution, req.epmpUser!.id, id],
          );

          // If the conflict's underlying field_reports row has a non-null
          // incident_id, the resolution is ALWAYS visibly recorded on that
          // incident's Timeline -- never silent.
          const fieldReportRows = await client.query<{ incident_id: string | null }>(
            `SELECT incident_id FROM field_reports WHERE id = $1`,
            [conflict.entity_id],
          );
          const incidentId = fieldReportRows.rows[0]?.incident_id;
          if (incidentId) {
            await TimelineService.append(
              client,
              incidentId,
              `Field sync conflict resolved: ${resolution}`,
              undefined,
              'warning',
              req.epmpUser!.id,
              'EPMP',
              { sync_conflict_id: id, entity_id: conflict.entity_id, resolution },
            );
          }

          const updatedRows = await client.query<SyncConflictRow>(`SELECT * FROM sync_conflicts WHERE id = $1`, [id]);
          return updatedRows.rows[0];
        });

        return reply.code(200).send(shapeSyncConflictRow(resolved));
      } catch (err) {
        req.log.error(err, `Sync conflict resolve transaction failed for id=${id}`);
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
