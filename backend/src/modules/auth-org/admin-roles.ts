import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { AuditService } from './audit.js';
import { syncRolePermissionsToOpa, type RolePermissionRow } from './opa-client.js';
import { query } from '../../db/client.js';

interface RoleRow {
  id: string;
  name: string;
  persona_id: string;
  description: string | null;
}

interface PermissionPair {
  feature: string;
  actions: string[];
}

async function rolePermissions(role_id: string): Promise<PermissionPair[]> {
  const rows = await query<RolePermissionRow>(
    `SELECT role_id, feature, actions FROM role_permissions WHERE role_id = $1 ORDER BY feature`,
    [role_id],
  );
  return rows.map((r) => ({ feature: r.feature, actions: r.actions }));
}

/**
 * F8 S8.3 — role permission-matrix editing. No DELETE route exists for
 * roles anywhere in this module: Phase 1 ships exactly 5 fixed persona
 * roles with no UI/API to create or remove roles (the FRD's S8.3 screen
 * only shows "Editing a role's permissions opens a form," not role
 * creation/deletion). F8's "a role cannot be deleted while assigned"
 * validation is therefore satisfied structurally — the 409 ROLE_IN_USE
 * deletion-conflict path can never be reached because the deletion path
 * itself does not exist in Phase 1's API surface.
 */
export default async function adminRolesRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/roles',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const roles = await query<RoleRow>(`SELECT id, name, persona_id, description FROM roles ORDER BY name`);
      const items = await Promise.all(
        roles.map(async (role) => ({
          id: role.id,
          name: role.name,
          persona_id: role.persona_id,
          description: role.description ?? undefined,
          permissions: await rolePermissions(role.id),
        })),
      );
      return reply.code(200).send(items);
    },
  );

  app.patch<{ Params: { id: string }; Body: { permissions: PermissionPair[] } }>(
    '/api/v1/admin/roles/:id',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { permissions } = req.body ?? ({ permissions: [] } as never);

      const roleRows = await query<RoleRow>(`SELECT id, name, persona_id, description FROM roles WHERE id = $1`, [id]);
      const role = roleRows[0];
      if (!role) {
        return reply.code(404).send({ error_code: 'ROLE_NOT_FOUND', message: 'Role not found.' });
      }

      const before = await rolePermissions(id);

      for (const { feature, actions } of permissions) {
        await query(
          `INSERT INTO role_permissions (role_id, feature, actions, updated_by)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (role_id, feature)
           DO UPDATE SET actions = EXCLUDED.actions, updated_by = EXCLUDED.updated_by, updated_at = now()`,
          [id, feature, actions, req.epmpUser!.id],
        );
      }

      // Re-sync the FULL current role_permissions table (not just the
      // changed rows) to OPA's data document, synchronously before
      // responding — a client polling immediately after this PATCH must
      // see the new permission enforced, with no caching window.
      const allPerms = await query<RolePermissionRow>(`SELECT role_id, feature, actions FROM role_permissions`);
      await syncRolePermissionsToOpa(allPerms);

      const after = await rolePermissions(id);

      await AuditService.record(req.epmpUser!.id, 'role_permission_edit', 'roles', id, { before, after });

      return reply.code(200).send({
        id: role.id,
        name: role.name,
        persona_id: role.persona_id,
        description: role.description ?? undefined,
        permissions: after,
      });
    },
  );
}
