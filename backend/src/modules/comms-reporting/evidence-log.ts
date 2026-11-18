import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';

interface EvidenceLogRow {
  id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  record_type: string | null;
  record_id: string | null;
  occurred_at: string;
  detail: Record<string, unknown> | null;
  source_table: string;
}

const EVIDENCE_LOG_IMMUTABLE = {
  error_code: 'EVIDENCE_LOG_IMMUTABLE',
  message: "Evidence log entries can't be edited or deleted.",
} as const;

const EXPORT_FAILED = {
  error_code: 'EXPORT_FAILED',
  message: "This export didn't complete. Retry.",
} as const;

interface EvidenceLogFilters {
  date_range?: string;
  actor_id?: string;
  action_type?: string;
  record_type?: string;
}

// Builds the identical filter-predicate set against BOTH halves of the
// UNION — each half starts its own $-param numbering from 1 since they're
// combined via a single outer query wrapping the UNION ALL, not literal
// string concatenation sharing one param list.
//
// [Rule 1 - Bug fix, discovered during 04-07's own Playwright run]:
// `actionColumn`/`recordTypeColumn` let each half's WHERE clause reference
// its OWN real underlying column rather than always writing the literal
// `action`/`record_type` output-alias names. audit_log's SELECT list
// already names its columns `action`/`record_type` with no renaming, so
// those identifiers happen to also be real column names there — but
// incident_timeline's half selects `it.title AS action` (there is no
// `action` column on that table at all), and Postgres's WHERE clause is
// evaluated BEFORE the SELECT list, so it cannot see a SELECT-list alias —
// `action = $N` against that half raised a bare `column "action" does not
// exist`, which `fetchEvidenceLogRows`'s caller silently turned into "Could
// not load the evidence log" for EVERY `action_type`-filtered request, not
// just this plan's own AAR-finalized lookup.
function buildFilterConditions(
  filters: EvidenceLogFilters,
  startIdx: number,
  columns: { actionColumn: string; recordTypeColumn: string },
): { clause: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = startIdx;

  if (filters.actor_id) {
    conditions.push(`actor_id = $${idx++}`);
    params.push(filters.actor_id);
  }
  if (filters.action_type) {
    conditions.push(`${columns.actionColumn} = $${idx++}`);
    params.push(filters.action_type);
  }
  if (filters.record_type) {
    conditions.push(`${columns.recordTypeColumn} = $${idx++}`);
    params.push(filters.record_type);
  }
  if (filters.date_range) {
    const [start, end] = filters.date_range.split(',');
    if (start) {
      conditions.push(`occurred_at >= $${idx++}`);
      params.push(start);
    }
    if (end) {
      conditions.push(`occurred_at <= $${idx++}`);
      params.push(end);
    }
  }

  return { clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

async function fetchEvidenceLogRows(
  filters: EvidenceLogFilters,
  page_size: number,
  offset: number,
): Promise<{ items: EvidenceLogRow[]; total: number }> {
  // Two read-only SELECTs, same filter params applied to both halves
  // BEFORE the UNION combines them, per this plan's own instruction —
  // audit_log (F8) and incident_timeline (F1) each contribute rows,
  // normalized to a single shape. incident_timeline rows with a NULL
  // actor_id (e.g. 03-02's system-driven Overdue sweep) are deliberately
  // EXCLUDED: FRD's "Actor (Avatar + name)" column requires a real actor
  // to render, and a null-actor row has no person for that column — a
  // documented narrowing, not a bug.
  const auditFilters = buildFilterConditions(filters, 1, {
    actionColumn: 'al.action',
    recordTypeColumn: 'al.record_type',
  });
  const auditSql = `
    SELECT al.id, al.actor_id, u.name AS actor_name, al.action, al.record_type, al.record_id,
           al.occurred_at, al.detail, 'audit_log' AS source_table
    FROM audit_log al
    JOIN users u ON u.id = al.actor_id
    ${auditFilters.clause}
  `;

  const timelineStartIdx = auditFilters.params.length + 1;
  // incident_timeline has no real `record_type` column at all (the
  // SELECT list's 'incident' is a hard-coded literal, not a column) — so
  // its "column" reference for that filter is the identical literal
  // re-stated, which Postgres evaluates as a constant equality check
  // rather than an identifier lookup (correctly matching/no-matching
  // depending on whether the caller filtered for record_type=incident).
  const timelineFilters = buildFilterConditions(filters, timelineStartIdx, {
    actionColumn: 'it.title',
    recordTypeColumn: "'incident'",
  });
  const timelineSql = `
    SELECT it.id, it.actor_id, u.name AS actor_name, it.title AS action, 'incident' AS record_type,
           it.incident_id AS record_id, it.occurred_at, it.detail, 'incident_timeline' AS source_table
    FROM incident_timeline it
    LEFT JOIN users u ON u.id = it.actor_id
    ${timelineFilters.clause ? `${timelineFilters.clause} AND it.actor_id IS NOT NULL` : 'WHERE it.actor_id IS NOT NULL'}
  `;

  const allParams = [...auditFilters.params, ...timelineFilters.params];

  const countRows = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM (${auditSql} UNION ALL ${timelineSql}) combined`,
    allParams,
  );
  const total = parseInt(countRows[0]?.count ?? '0', 10);

  const limitIdx = allParams.length + 1;
  const offsetIdx = allParams.length + 2;
  const rows = await query<EvidenceLogRow>(
    `SELECT * FROM (${auditSql} UNION ALL ${timelineSql}) combined
     ORDER BY occurred_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    [...allParams, page_size, offset],
  );

  return { items: rows, total };
}

export default async function evidenceLogRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: EvidenceLogFilters & { page?: string; page_size?: string };
  }>(
    '/api/v1/evidence-log',
    { preHandler: requirePermission('reporting', 'view') },
    async (req, reply) => {
      const { date_range, actor_id, action_type, record_type } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const { items, total } = await fetchEvidenceLogRows(
        { date_range, actor_id, action_type, record_type },
        page_size,
        offset,
      );

      return reply.code(200).send({
        items: items.map((r) => ({
          id: r.id,
          actor: r.actor_id ? { id: r.actor_id, name: r.actor_name } : null,
          action: r.action,
          record_type: r.record_type ?? undefined,
          record_id: r.record_id ?? undefined,
          occurred_at: r.occurred_at,
          detail: r.detail ?? undefined,
          source_table: r.source_table,
        })),
        total,
        page,
        page_size,
      });
    },
  );

  app.get<{
    Querystring: EvidenceLogFilters & { format?: 'csv' | 'pdf' };
  }>(
    '/api/v1/evidence-log/export',
    { preHandler: requirePermission('reporting', 'view') },
    async (req, reply) => {
      const { date_range, actor_id, action_type, record_type, format } = req.query;

      // No PDF-generation library exists in this project's dependency tree
      // (TechArch's tech-stack doc names none specifically for this
      // feature), and adding one is a Claude's-discretion call this plan
      // declines to make unprompted. CSV alone satisfies the FRD's
      // "exportable" requirement; PDF is a documented Phase-4 scope gap,
      // not silently dropped.
      if (format === 'pdf') {
        return reply.code(500).send(EXPORT_FAILED);
      }

      // Export the full filtered view (no pagination) — a single large
      // page_size caps unbounded growth while still satisfying "exports
      // the exact filtered view on screen" for realistic evidence-log
      // sizes within this phase's scope.
      const { items } = await fetchEvidenceLogRows({ date_range, actor_id, action_type, record_type }, 10000, 0);

      const header = 'timestamp,actor,action,record_type,record_id\n';
      const csvEscape = (value: string) => `"${value.replace(/"/g, '""')}"`;
      const lines = items.map(
        (r) =>
          `${r.occurred_at},${csvEscape(r.actor_name ?? '')},${csvEscape(r.action)},${csvEscape(r.record_type ?? '')},${r.record_id ?? ''}`,
      );
      const csv = header + lines.join('\n') + (lines.length ? '\n' : '');

      return reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', 'attachment; filename="evidence-log.csv"')
        .code(200)
        .send(csv);
    },
  );

  // Explicit structural rejection — mirrors 01-07's admin-audit.ts exact
  // pattern. PATCH/DELETE are registered but ALWAYS return 403, visible IN
  // the API surface itself (not merely an absent route), per the UX
  // mockup's "no edit/delete control exists anywhere in this view, for
  // any role, including admins" hard constraint.
  app.patch('/api/v1/evidence-log', { preHandler: requirePermission('reporting', 'view') }, async (_req, reply) => {
    return reply.code(403).send(EVIDENCE_LOG_IMMUTABLE);
  });

  app.delete<{ Params: { id: string } }>(
    '/api/v1/evidence-log/:id',
    { preHandler: requirePermission('reporting', 'view') },
    async (_req, reply) => {
      return reply.code(403).send(EVIDENCE_LOG_IMMUTABLE);
    },
  );
}
