import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { AuditService } from './audit.js';
import { query } from '../../db/client.js';

interface AdminUserSummaryRow {
  id: string;
  name: string;
  email: string;
  role: string;
  jurisdiction_scope: string[];
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  role_id: string;
  jurisdiction_scope: string[];
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
  updated_at: string;
}

/**
 * F8 S8.2 — admin user management. Every mutating handler writes a
 * before/after-shaped AuditService.record entry per F08-security-
 * administration.md's "logged with the before/after... not just 'X
 * changed'" validation rule. No session-revocation API call is made on
 * suspend: 01-03's requirePermission re-queries users.status on every
 * single request, so this PATCH's write alone is what takes effect on the
 * suspended user's very next request (documented Phase 1 deviation from
 * TechArch §5.1's "Keycloak admin API session-revocation call" — Keycloak
 * is only the IdP broker for initial auth in this architecture, not the
 * source of truth for subsequent request authorization).
 */
export default async function adminUsersRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: { role?: string; jurisdiction?: string; status?: string; page?: string; page_size?: string };
  }>(
    '/api/v1/admin/users',
    { preHandler: requirePermission('admin', 'view') },
    async (req, reply) => {
      const { role, jurisdiction, status } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (role) {
        conditions.push(`r.name = $${idx++}`);
        params.push(role);
      }
      if (status) {
        conditions.push(`u.status = $${idx++}`);
        params.push(status);
      }
      if (jurisdiction) {
        conditions.push(`$${idx++} = ANY(u.jurisdiction_scope)`);
        params.push(jurisdiction);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM users u JOIN roles r ON r.id = u.role_id ${whereClause}`,
        params,
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const limitIdx = idx++;
      const offsetIdx = idx++;
      const rows = await query<AdminUserSummaryRow>(
        `SELECT u.id, u.name, u.email, r.name AS role, u.jurisdiction_scope, u.status, u.last_login_at
         FROM users u JOIN roles r ON r.id = u.role_id
         ${whereClause}
         ORDER BY u.name
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        [...params, page_size, offset],
      );

      return reply.code(200).send({ items: rows, total, page, page_size });
    },
  );

  app.post<{ Body: { email: string; name: string; role_id: string; jurisdiction_scope?: string[] } }>(
    '/api/v1/admin/users',
    { preHandler: requirePermission('admin', 'create') },
    async (req, reply) => {
      const { email, name, role_id, jurisdiction_scope } = req.body ?? ({} as never);

      const inserted = await query<UserRow>(
        `INSERT INTO users (email, name, role_id, jurisdiction_scope)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, name, role_id, jurisdiction_scope, status, last_login_at`,
        [email, name, role_id, jurisdiction_scope ?? []],
      );
      const newUser = inserted[0];

      await AuditService.record(req.epmpUser!.id, 'user_create', 'users', newUser.id, { email, role_id });

      const roleRows = await query<{ name: string }>(`SELECT name FROM roles WHERE id = $1`, [role_id]);

      return reply.code(201).send({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: roleRows[0]?.name ?? '',
        jurisdiction_scope: newUser.jurisdiction_scope,
        status: newUser.status,
        last_login_at: newUser.last_login_at,
      });
    },
  );

  app.patch<{
    Params: { id: string };
    Body: { role_id?: string; jurisdiction_scope?: string[]; status?: 'Active' | 'Suspended' };
  }>(
    '/api/v1/admin/users/:id',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { role_id, jurisdiction_scope, status } = req.body ?? ({} as never);

      // Before-snapshot — required so the audit detail carries both sides
      // of the change, not just the fact that a change occurred.
      const beforeRows = await query<UserRow>(`SELECT * FROM users WHERE id = $1`, [id]);
      const before = beforeRows[0];
      if (!before) {
        return reply.code(404).send({ error_code: 'USER_NOT_FOUND', message: 'User not found.' });
      }

      const updates: string[] = [];
      const params: unknown[] = [];
      let idx = 1;
      if (role_id !== undefined) {
        updates.push(`role_id = $${idx++}`);
        params.push(role_id);
      }
      if (jurisdiction_scope !== undefined) {
        updates.push(`jurisdiction_scope = $${idx++}`);
        params.push(jurisdiction_scope);
      }
      if (status !== undefined) {
        updates.push(`status = $${idx++}`);
        params.push(status);
      }
      updates.push(`updated_at = now()`);

      params.push(id);
      const updatedRows = await query<UserRow>(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
        params,
      );
      const after = updatedRows[0];

      const statusChanged = status !== undefined && status !== before.status;
      const action = statusChanged ? (status === 'Suspended' ? 'user_suspend' : 'user_reactivate') : 'user_edit';

      // detail carries {before, after} snapshots, never just "status changed".
      await AuditService.record(req.epmpUser!.id, action, 'users', id, {
        before: { role_id: before.role_id, jurisdiction_scope: before.jurisdiction_scope, status: before.status },
        after: { role_id: after.role_id, jurisdiction_scope: after.jurisdiction_scope, status: after.status },
      });

      const roleRows = await query<{ name: string }>(`SELECT name FROM roles WHERE id = $1`, [after.role_id]);

      return reply.code(200).send({
        id: after.id,
        name: after.name,
        email: after.email,
        role: roleRows[0]?.name ?? '',
        jurisdiction_scope: after.jurisdiction_scope,
        status: after.status,
        last_login_at: after.last_login_at,
      });
    },
  );
}
