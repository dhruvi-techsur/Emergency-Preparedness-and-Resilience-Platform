import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { query } from '../../db/client.js';

interface AuditLogRow {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  record_type: string | null;
  record_id: string | null;
  occurred_at: string;
  detail: Record<string, unknown> | null;
}

const IMMUTABLE_ERROR = {
  error_code: 'AUDIT_LOG_IMMUTABLE',
  message: "Audit log entries can't be edited or deleted.",
} as const;

/**
 * F8 S8.5 — read-only, append-only audit log view. GET is the only
 * meaningfully-registered route; PATCH/DELETE are registered explicitly so
 * the immutability contract is visible IN the API surface itself (an
 * explicit 403, not merely an absent route a client could mistake for a
 * transient 404). The actual data-layer enforcement is 01-01's
 * BEFORE UPDATE/DELETE trigger on audit_log — this is defense-in-depth at
 * the API layer, matching the FRD's exact error copy.
 */
export default async function adminAuditRoutes(fastify: FastifyInstance) {
  fastify.get<{
    Querystring: {
      date_range?: string; // "start,end" ISO
      actor_id?: string;
      action_type?: string;
      record_type?: string;
      page?: string;
      page_size?: string;
    };
  }>(
    '/api/v1/admin/audit-log',
    { preHandler: requirePermission('admin', 'view') },
    async (req, reply) => {
      const { date_range, actor_id, action_type, record_type } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (actor_id) {
        conditions.push(`al.actor_id = $${idx++}`);
        params.push(actor_id);
      }
      if (action_type) {
        conditions.push(`al.action = $${idx++}`);
        params.push(action_type);
      }
      if (record_type) {
        conditions.push(`al.record_type = $${idx++}`);
        params.push(record_type);
      }
      if (date_range) {
        const [start, end] = date_range.split(',');
        if (start) {
          conditions.push(`al.occurred_at >= $${idx++}`);
          params.push(start);
        }
        if (end) {
          conditions.push(`al.occurred_at <= $${idx++}`);
          params.push(end);
        }
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM audit_log al ${whereClause}`,
        params,
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const limitIdx = idx++;
      const offsetIdx = idx++;
      const rows = await query<AuditLogRow>(
        `SELECT al.id, al.actor_id, u.name AS actor_name, al.action, al.record_type, al.record_id, al.occurred_at, al.detail
         FROM audit_log al
         JOIN users u ON u.id = al.actor_id
         ${whereClause}
         ORDER BY al.occurred_at DESC
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        [...params, page_size, offset],
      );

      const items = rows.map((r) => ({
        id: r.id,
        actor: { id: r.actor_id, name: r.actor_name },
        action: r.action,
        record_type: r.record_type ?? undefined,
        record_id: r.record_id ?? undefined,
        occurred_at: r.occurred_at,
        detail: r.detail ?? undefined,
      }));

      return reply.code(200).send({ items, total, page, page_size });
    },
  );

  // Explicit structural rejection — no PATCH/DELETE for audit-log ever
  // succeeds, and this is visible in the API surface itself rather than
  // falling through to a generic 404.
  fastify.patch('/api/v1/admin/audit-log', { preHandler: requirePermission('admin', 'view') }, async (_req, reply) => {
    return reply.code(403).send(IMMUTABLE_ERROR);
  });

  fastify.delete<{ Params: { id: string } }>(
    '/api/v1/admin/audit-log/:id',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      return reply.code(403).send(IMMUTABLE_ERROR);
    },
  );
}
