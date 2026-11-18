import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { pool } from '../../db/client.js';

const ANALYTICS_TIMEOUT = {
  error_code: 'ANALYTICS_TIMEOUT',
  message: 'This date range is taking too long to load. Narrow it and retry.',
} as const;

interface KpiResult {
  name: string;
  value: number;
  definition: string;
  baseline?: number;
  // target is OMITTED ENTIRELY (not null, not 0) — see inline note below.
  target?: number;
  owner: string;
  review_cadence: string;
  period: string;
  source: string;
}

// This endpoint computes exactly 3 KPIs server-side from existing tables —
// no invented numeric targets (FRD's hard rule). `target` is OMITTED
// ENTIRELY from every KPI's JSON response (never null, never 0) per
// TechArch's literal interface comment "omitted entirely (not zero/null)
// when undefined" and FRD's "never invented targets" validation rule. This
// is the single most security/trust-relevant line in this endpoint: no
// separate kpi_definitions/kpi_config table exists anywhere in TechArch's
// schema for this phase, so a `target` key would have to be fabricated —
// and fabricating a compliance/performance target is exactly what the FRD
// forbids.
export default async function analyticsRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: { date_range: string };
  }>(
    '/api/v1/analytics/kpis',
    { preHandler: requirePermission('reporting', 'view') },
    async (req, reply) => {
      // jurisdiction_scope is read from the authenticated session's own
      // req.epmpUser.jurisdiction_scope — NEVER a client-supplied query
      // parameter (T-04-06). A caller cannot widen their own analytics
      // visibility by passing an arbitrary jurisdiction id in the query
      // string.
      const jurisdiction_scope = req.epmpUser!.jurisdiction_scope;
      const { date_range } = req.query;
      const [start, end] = (date_range ?? '').split(',');
      const rangeStart = start || '1970-01-01';
      const rangeEnd = end || new Date().toISOString();

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // Bounds every analytics query in this transaction — a Postgres
        // statement-timeout error (code 57014) is caught below and mapped
        // to 504 ANALYTICS_TIMEOUT.
        await client.query(`SET LOCAL statement_timeout = '10s'`);

        // PERCENTILE_CONT over an interval returns an interval; pg's
        // driver hands this back as a string like "01:23:45" unless cast
        // — cast to seconds explicitly via EXTRACT for a plain number.
        const activationSecondsRows = await client.query<{ median_seconds: number | null }>(
          `SELECT EXTRACT(EPOCH FROM PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY first_activation.occurred_at - i.opened_at)) AS median_seconds
           FROM incidents i
           JOIN LATERAL (
             SELECT occurred_at FROM incident_timeline
             WHERE incident_id = i.id AND title LIKE 'Activation changed to%'
             ORDER BY occurred_at ASC LIMIT 1
           ) first_activation ON true
           WHERE i.jurisdiction_id = ANY($1) AND i.opened_at BETWEEN $2 AND $3`,
          [jurisdiction_scope, rangeStart, rangeEnd],
        );

        const fulfillmentRows = await client.query<{ median_seconds: number | null }>(
          `SELECT EXTRACT(EPOCH FROM PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY r.fulfilled_at - r.created_at)) AS median_seconds
           FROM resource_requests r
           JOIN incidents i ON i.id = r.incident_id
           WHERE r.status = 'Fulfilled' AND i.jurisdiction_id = ANY($1) AND r.created_at BETWEEN $2 AND $3`,
          [jurisdiction_scope, rangeStart, rangeEnd],
        );

        const closureRows = await client.query<{ closed_count: string; total_count: string }>(
          `SELECT
             COUNT(*) FILTER (WHERE af.closure_status = 'Closed')::int AS closed_count,
             COUNT(*)::int AS total_count
           FROM aar_findings af
           JOIN aars a ON a.id = af.aar_id
           JOIN incidents i ON i.id = a.incident_id
           WHERE i.jurisdiction_id = ANY($1) AND af.created_at BETWEEN $2 AND $3`,
          [jurisdiction_scope, rangeStart, rangeEnd],
        );

        await client.query('COMMIT');

        const medianActivationSeconds = activationSecondsRows.rows[0]?.median_seconds ?? null;
        const medianFulfillmentSeconds = fulfillmentRows.rows[0]?.median_seconds ?? null;
        const closedCount = Number(closureRows.rows[0]?.closed_count ?? 0);
        const totalCount = Number(closureRows.rows[0]?.total_count ?? 0);
        const closureRate = totalCount > 0 ? (closedCount / totalCount) * 100 : 0;

        // Each KpiResult's definition/owner/review_cadence/period/source
        // are honest, documented Phase-4 placeholder text — no separate
        // kpi_definitions/kpi_config table exists anywhere in TechArch's
        // schema for this phase. `target` is OMITTED ENTIRELY (not
        // included as a key at all) on every one of the 3 KPIs below —
        // never invented.
        const kpis: KpiResult[] = [
          {
            name: 'median_activation_time',
            value: medianActivationSeconds ?? 0,
            definition: 'Time from incident open to first activation-level escalation',
            owner: 'Planning section chief',
            review_cadence: 'Monthly',
            period: `${rangeStart} to ${rangeEnd}`,
            source: 'incident_timeline',
          },
          {
            name: 'resource_request_fulfillment_time',
            value: medianFulfillmentSeconds ?? 0,
            definition: 'Median time from resource request creation to fulfillment',
            owner: 'Logistics section chief',
            review_cadence: 'Monthly',
            period: `${rangeStart} to ${rangeEnd}`,
            source: 'resource_requests',
          },
          {
            name: 'corrective_action_closure_rate',
            value: closureRate,
            definition: 'Percentage of AAR corrective actions marked Closed',
            owner: 'Planning section chief',
            review_cadence: 'Quarterly',
            period: `${rangeStart} to ${rangeEnd}`,
            source: 'aar_findings',
          },
        ];

        return reply.code(200).send({ kpis });
      } catch (err: unknown) {
        await client.query('ROLLBACK').catch(() => undefined);
        const pgErr = err as { code?: string };
        if (pgErr?.code === '57014') {
          return reply.code(504).send(ANALYTICS_TIMEOUT);
        }
        throw err;
      } finally {
        client.release();
      }
    },
  );
}
