import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';

interface DashboardSummary {
  active_incidents: number;
  open_tasks: number;
  pending_resource_requests: number;
  notifications_pending_ack: number;
}

/**
 * Mounts GET /api/v1/dashboard/summary — the read endpoint PER-01's EOC
 * Dashboard (06-05) needs. `jurisdiction_scope` is accepted as a query
 * param but — same documented Phase 2 pattern operating-picture.ts
 * established — enforced only against the authenticated user's OWN
 * jurisdiction_scope, never a client-asserted override.
 */
export default async function dashboardRoutes(app: FastifyInstance) {
  app.get<{ Querystring: { jurisdiction_scope?: string } }>(
    '/api/v1/dashboard/summary',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM incidents WHERE status = 'Open' AND jurisdiction_id = ANY($1)`,
        [req.epmpUser!.jurisdiction_scope],
      );
      const active_incidents = parseInt(countRows[0]?.count ?? '0', 10);

      // Phase 3's `tasks`/`resource_requests` tables actually DO exist in
      // this codebase (03-01/03-04 shipped them) — real COUNT queries,
      // scoped through the same incident_id -> incidents.jurisdiction_id
      // join pattern every other incident-ops route in this module uses
      // for tables with no jurisdiction_id column of their own.
      const openTasksRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM tasks t
         LEFT JOIN incidents i ON i.id = t.incident_id
         WHERE t.status IN ('Open','In progress','Awaiting approval')
           AND (t.incident_id IS NULL OR i.jurisdiction_id = ANY($1))`,
        [req.epmpUser!.jurisdiction_scope],
      );
      const open_tasks = parseInt(openTasksRows[0]?.count ?? '0', 10);

      const pendingResourceRequestsRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count
         FROM resource_requests r
         JOIN incidents i ON i.id = r.incident_id
         WHERE r.status = 'Awaiting approval' AND i.jurisdiction_id = ANY($1)`,
        [req.epmpUser!.jurisdiction_scope],
      );
      const pending_resource_requests = parseInt(pendingResourceRequestsRows[0]?.count ?? '0', 10);

      // Phase 4's `notifications`/`notification_delivery_status` tables
      // exist (04-01 shipped them), but "pending_ack" has no literal
      // meaning in this schema's delivery_status enum
      // (Queued/Sent/Delivered/Failed/Acknowledged) scoped to THIS user as
      // an individual recipient — notification_recipients carries no
      // user_id, only free-text recipient_name/contact, since F5's
      // recipient model is name/contact-based, not an EPMP-user-id-based
      // per-recipient acknowledgment model. Documented structural zero
      // (same convention this field's sibling fields use below) rather
      // than a guess at a query this schema cannot actually answer.
      const notifications_pending_ack = 0;

      const summary: DashboardSummary = {
        active_incidents,
        open_tasks,
        pending_resource_requests,
        notifications_pending_ack,
      };

      return reply.code(200).send(summary);
    },
  );
}
