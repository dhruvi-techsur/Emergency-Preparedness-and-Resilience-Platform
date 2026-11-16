import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { AuditService } from '../auth-org/audit.js';
import { query } from '../../db/client.js';
import { syncFederationGrantsToOpa } from './opa-federation-policy.js';

interface FederationGrantRow {
  id: string;
  partner_jurisdiction_id: string;
  scope: { record_types: string[]; incident_filters?: Record<string, unknown> };
  granted_by: string;
  expires_at: string | null;
  status: 'Active' | 'Revoked';
}

interface FederationGrantBody {
  partner_jurisdiction_id: string;
  scope: { record_types: string[]; incident_filters?: Record<string, unknown> };
  expires_at?: string;
}

export default async function federationGrantsRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/federation-grants',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<FederationGrantRow>(
        `SELECT id, partner_jurisdiction_id, scope, granted_by, expires_at, status
         FROM federation_grants ORDER BY created_at DESC`,
      );
      return reply.code(200).send(rows);
    },
  );

  app.post<{ Body: FederationGrantBody }>(
    '/api/v1/admin/federation-grants',
    { preHandler: requirePermission('admin', 'create') },
    async (req, reply) => {
      const { partner_jurisdiction_id, scope, expires_at } = req.body ?? {
        partner_jurisdiction_id: '',
        scope: { record_types: [] },
      };

      // Server-side validation BEFORE the INSERT — don't rely solely on the
      // DB's chk_scope_not_empty constraint. Return a clean 400 with a
      // specific message, not a raw constraint-violation error. A federation
      // grant with an empty or missing scope.record_types array must be
      // rejected at creation, never silently defaulted to "all data".
      if (!partner_jurisdiction_id || !scope || !Array.isArray(scope.record_types) || scope.record_types.length === 0) {
        return reply.code(400).send({
          error_code: 'FEDERATION_GRANT_SCOPE_EMPTY',
          message: 'scope.record_types must be a non-empty array — a federation grant cannot implicitly grant access to all data.',
        });
      }

      const rows = await query<FederationGrantRow>(
        `INSERT INTO federation_grants (partner_jurisdiction_id, scope, granted_by, expires_at)
         VALUES ($1, $2, $3, $4)
         RETURNING id, partner_jurisdiction_id, scope, granted_by, expires_at, status`,
        [partner_jurisdiction_id, JSON.stringify(scope), req.epmpUser!.id, expires_at ?? null],
      );
      const created = rows[0];

      await AuditService.record(req.epmpUser!.id, 'federation_grant_create', 'federation_grants', created.id, {
        partner_jurisdiction_id,
        scope,
        expires_at: expires_at ?? null,
      });

      // Synchronous resync BEFORE responding — closes the caching window.
      await syncFederationGrantsToOpa();

      return reply.code(201).send(created);
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/v1/admin/federation-grants/:id/revoke',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      await query(`UPDATE federation_grants SET status = 'Revoked', revoked_at = now() WHERE id = $1`, [id]);
      await AuditService.record(req.epmpUser!.id, 'federation_grant_revoke', 'federation_grants', id);

      // Synchronous resync BEFORE responding 204 — this ordering is what
      // makes revocation take effect "within the same request cycle": by
      // the time the client receives the 204, OPA's data is already
      // updated, so the very next request evaluated against OPA sees the
      // revoked state. No asynchronous/eventually-consistent window.
      await syncFederationGrantsToOpa();

      return reply.code(204).send();
    },
  );
}
