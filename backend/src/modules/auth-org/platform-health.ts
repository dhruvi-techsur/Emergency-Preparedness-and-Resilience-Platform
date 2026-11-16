import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { query } from '../../db/client.js';

interface BackgroundJobAlertRow {
  job_type: string;
  status: string;
  failure_count: number;
}

/**
 * F8 S8.7 — platform-health aggregation consumed by the same Platform
 * Monitoring view 01-11's Background Job Monitor screen reads
 * (background_jobs-derived status is one of the four required fields).
 *
 * Phase 1 has no live session store beyond the stateless JWT, no
 * failed-login audit trail, and no historical uptime tracking — each
 * field below documents its Phase 1 approximation/gap inline rather than
 * silently faking a fuller implementation.
 */
export default async function platformHealthRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/platform-health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      // active_sessions: Phase 1 has no live session store beyond the
      // stateless 15-min JWT (01-03), so this approximates "active" as
      // "logged in within the last 15 minutes" via last_login_at.
      const activeSessionsRows = await query<{ count: string }>(
        `SELECT COUNT(DISTINCT id) AS count FROM users WHERE last_login_at > now() - interval '15 minutes'`,
      );
      const active_sessions = parseInt(activeSessionsRows[0]?.count ?? '0', 10);

      // failed_login_rate: Phase 1's audit_log only records successful
      // 'login' actions (sso.ts) — there is no 'login_failed' audited event
      // yet. TODO: wire failed-SSO-assertion audit entries once
      // handleSsoCallback starts recording `login_failed`; out of this
      // plan's scope, tracked as a known gap.
      const failed_login_rate = 0;

      const jobCountsRows = await query<{ total: string; failed: string }>(
        `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE status = 'failed') AS failed FROM background_jobs`,
      );
      const total = parseInt(jobCountsRows[0]?.total ?? '0', 10);
      const failed = parseInt(jobCountsRows[0]?.failed ?? '0', 10);
      const integration_error_rate = total > 0 ? failed / total : 0;

      // uptime_pct: no historical uptime tracking exists yet in Phase 1 —
      // real uptime monitoring is an infra/ops concern beyond this phase's
      // application code. Hardcoded as a known Phase-1-scope gap.
      const uptime_pct = 100;

      const alertRows = await query<BackgroundJobAlertRow>(
        `SELECT job_type, status, failure_count FROM background_jobs WHERE status IN ('failed', 'backoff')`,
      );
      const alerts = alertRows.map((r) => ({
        subsystem: r.job_type,
        message: `Job ${r.job_type} is ${r.status} (failure_count=${r.failure_count})`,
        since: new Date().toISOString(),
      }));

      return reply.code(200).send({
        active_sessions,
        failed_login_rate,
        integration_error_rate,
        uptime_pct,
        alerts,
      });
    },
  );
}
