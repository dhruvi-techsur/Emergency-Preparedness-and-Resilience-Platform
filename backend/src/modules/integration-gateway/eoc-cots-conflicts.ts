import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { AuditService } from '../auth-org/audit.js';
import { query } from '../../db/client.js';

/**
 * Plan 08-03 — the sole resolution code path for `eoc_cots_conflicts`.
 * Deliberately kept in its own file, separate from Plan 08-01's
 * `eoc-cots-adapter.ts`, per that plan's own documented decision to keep
 * the resolve route isolated (eoc-cots-adapter.ts's doc comment on
 * `eocCotsRoutes` names this file explicitly as owning the resolve route).
 *
 * `backend/src/modules/` has EXACTLY ONE file that ever issues `SET
 * resolution` against `eoc_cots_conflicts` — this one. No scheduled sync,
 * seed script, or any other route may ever set it. This is F13's "never
 * auto-resolved" rule, enforced structurally (grep-provable), not just by
 * convention.
 */

const EOC_CONFLICT_NOT_FOUND = {
  error_code: 'EOC_CONFLICT_NOT_FOUND',
  message: 'This conflict no longer exists or has already been resolved.',
} as const;

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

export default async function eocCotsConflictsRoutes(app: FastifyInstance) {
  // POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve
  // Request: { resolution: 'keep_epmp' | 'keep_external', resolved_by: string }
  // (exact shape per project_specs/FRD/Y1d-api-integrations.md §EOC COTS)
  app.post<{
    Params: { id: string };
    Body: { resolution?: 'keep_epmp' | 'keep_external'; resolved_by?: string };
  }>(
    '/api/v1/integrations/eoc-cots/conflicts/:id/resolve',
    // Conflict resolution is an admin-console/IT-SecOps action per F13's
    // "typically PER-01 or PER-05 admin facet" framing. secops_admin
    // already holds the full ['view','create','edit','approve'] set on
    // 'admin' per the existing seed (confirmed via `grep -n
    // "secopsAdminId.*'admin'" backend/scripts/seed.ts`) — no seed change
    // needed.
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { resolution, resolved_by } = req.body ?? {};

      // Caller-identity equality (mirrors sync-conflicts.ts's and
      // hazard-feed-adapter.ts's established pattern exactly, NOT a
      // role-permission lookup on the asserted id): a caller can only ever
      // resolve a conflict AS THEMSELVES, never on behalf of another named
      // person, regardless of that other person's own permissions.
      if (!resolved_by || resolved_by !== req.epmpUser!.id) {
        return reply.code(403).send({
          error_code: 'VERIFICATION_REQUIRES_NAMED_USER',
          message: 'Resolve this conflict as yourself — you cannot resolve on behalf of another person.',
        });
      }

      if (resolution !== 'keep_epmp' && resolution !== 'keep_external') {
        return reply.code(400).send({
          error_code: 'EOC_CONFLICT_RESOLUTION_INVALID',
          message: "resolution must be 'keep_epmp' or 'keep_external'.",
        });
      }

      // Fetch the conflict row by id first. If not found, OR if it's
      // already resolved (someone else resolved it first, or a
      // double-submit), return the SAME 404-shaped response rather than
      // silently succeeding a second time — resolving twice is not
      // idempotent by design. F13's "never silently overwritten" rule
      // extends to the resolution action itself: a second click must not
      // look like it worked.
      const existingRows = await query<EocCotsConflictRow>(
        `SELECT * FROM eoc_cots_conflicts WHERE id = $1`,
        [id],
      );
      const existing = existingRows[0];
      if (!existing || existing.resolution !== null) {
        return reply.code(404).send(EOC_CONFLICT_NOT_FOUND);
      }

      // The `AND resolution IS NULL` guard is the race-safety mechanism —
      // a concurrent double-click resolves at most once, matching
      // activation.ts's row-lock-adjacent discipline though a lighter
      // WHERE-guard suffices here since there's no multi-statement
      // transaction to protect.
      const updatedRows = await query<EocCotsConflictRow>(
        `UPDATE eoc_cots_conflicts
         SET resolution = $1, resolved_by = $2, resolved_at = now()
         WHERE id = $3 AND resolution IS NULL
         RETURNING *`,
        [resolution, req.epmpUser!.id, id],
      );
      const updated = updatedRows[0];

      // If zero rows were affected (lost the race, or already resolved —
      // the AND resolution IS NULL guard caught it), return the SAME
      // 404-shaped EOC_CONFLICT_NOT_FOUND response.
      if (!updated) {
        return reply.code(404).send(EOC_CONFLICT_NOT_FOUND);
      }

      if (resolution === 'keep_epmp') {
        // F13's "written back through the adapter to the external system
        // if EPMP's value was kept" requirement, logged as the outbound
        // write (this stub does not make a live vendor call, matching
        // every other adapter's stub-depth convention — the log entry IS
        // the "written back" proof at this MVP depth).
        await query(
          `INSERT INTO eoc_cots_sync_log (config_id, record_type, epmp_record_id, direction, sync_status)
           VALUES ($1, $2, $3, 'outbound', 'ok')`,
          [updated.config_id, updated.record_type, updated.epmp_record_id],
        );
      } else {
        // keep_external: the external value is now accepted/applied
        // locally — logged as the inbound acceptance.
        await query(
          `INSERT INTO eoc_cots_sync_log (config_id, record_type, epmp_record_id, direction, sync_status)
           VALUES ($1, $2, $3, 'inbound', 'ok')`,
          [updated.config_id, updated.record_type, updated.epmp_record_id],
        );
      }

      // Matches record-authority.ts's established audit-on-sensitive-write
      // convention exactly — resolving an EOC COTS conflict is exactly
      // this kind of sensitive, auditable administrative action.
      await AuditService.record(req.epmpUser!.id, 'eoc_cots_conflict_resolve', 'eoc_cots_conflict', id, {
        resolution,
      });

      return reply.code(200).send({
        id: updated.id,
        record_type: updated.record_type,
        resolution: updated.resolution,
        resolved_by: updated.resolved_by,
        resolved_at: updated.resolved_at,
      });
    },
  );
}
