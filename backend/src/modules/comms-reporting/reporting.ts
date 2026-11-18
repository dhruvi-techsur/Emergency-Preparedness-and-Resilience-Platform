import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { requirePermission } from '../auth-org/rbac.js';
import { query, pool } from '../../db/client.js';
import { fetchIncidentForMutation } from '../incident-ops/incidents.js';
import { AuditService } from '../auth-org/audit.js';
import { assertAiOriginApproved, AiOriginNotApprovedError } from './notifications.js';

export const RECORD_NOT_FOUND = {
  error_code: 'RECORD_NOT_FOUND',
  message: "This item no longer exists or you don't have access.",
} as const;

const DOCUMENT_IMMUTABLE = {
  error_code: 'DOCUMENT_IMMUTABLE',
  message: "This report is finalized and can't be edited. Create an addendum instead.",
} as const;

const AIDRAFT_UNAPPROVED_WRITE_BLOCKED = {
  error_code: 'AIDRAFT_UNAPPROVED_WRITE_BLOCKED',
  message: "This draft hasn't been approved. Approve it before it can be sent/saved.",
} as const;

const CORRECTIVE_ACTION_UNOWNED = {
  error_code: 'CORRECTIVE_ACTION_UNOWNED',
  message: 'Assign an owner and due date to every corrective action before finalizing.',
} as const;

const INCIDENT_NOT_CLOSED = {
  error_code: 'INCIDENT_NOT_CLOSED',
  message: 'Close this incident before generating its after-action report.',
} as const;

// -----------------------------------------------------------------------
// SITREP
// -----------------------------------------------------------------------

interface SitrepRow {
  id: string;
  incident_id: string;
  status: 'Draft' | 'Approved';
  content: Record<string, unknown>;
  ai_origin: boolean;
  ai_draft_id: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_by: string;
}

function shapeSitrep(row: SitrepRow) {
  return {
    id: row.id,
    incident_id: row.incident_id,
    status: row.status,
    content: row.content,
    ai_origin: row.ai_origin,
  };
}

async function fetchSitrepRow(id: string, incidentId: string): Promise<SitrepRow | null> {
  const rows = await query<SitrepRow>(
    `SELECT id, incident_id, status, content, ai_origin, ai_draft_id, approved_by, approved_at, created_by
     FROM sitreps WHERE id = $1 AND incident_id = $2`,
    [id, incidentId],
  );
  return rows[0] ?? null;
}

// Auto-assembles a SITREP's content with NO manual re-entry required beyond
// incident_id: the caller supplies only incident_id (+ optional
// include_ai_draft). tasks/resource_requests are 03-01/03-04's own tables —
// this module reads them read-only via plain SELECT, never writes to them,
// consistent with TechArch 01-components.md's module-boundary rule that
// comms-reporting has no owned FK into incident-ops's tables, only read
// access.
async function assembleSitrepContent(incidentId: string): Promise<Record<string, unknown>> {
  // "Current Timeline" — last 50 entries, newest first. TechArch doesn't
  // pin an exact N; 50 is a documented, generous-enough window for a
  // situation-report snapshot without unbounded growth on a long-running
  // incident.
  const timelineRows = await query<{
    id: string;
    occurred_at: string;
    title: string;
    tone: string;
    source: string;
  }>(
    `SELECT id, occurred_at, title, tone, source FROM incident_timeline
     WHERE incident_id = $1 ORDER BY occurred_at DESC LIMIT 50`,
    [incidentId],
  );

  const taskCountRows = await query<{ status: string; count: string }>(
    `SELECT status, COUNT(*)::int AS count FROM tasks WHERE incident_id = $1 GROUP BY status`,
    [incidentId],
  );
  const task_status_counts: Record<string, number> = {};
  for (const row of taskCountRows) {
    task_status_counts[row.status] = Number(row.count);
  }

  const resourceCountRows = await query<{ status: string; count: string }>(
    `SELECT status, COUNT(*)::int AS count FROM resource_requests WHERE incident_id = $1 GROUP BY status`,
    [incidentId],
  );
  const resource_request_status_counts: Record<string, number> = {};
  for (const row of resourceCountRows) {
    resource_request_status_counts[row.status] = Number(row.count);
  }

  return {
    timeline: timelineRows,
    task_status_counts,
    resource_request_status_counts,
    narrative: '',
  };
}

// -----------------------------------------------------------------------
// AAR
// -----------------------------------------------------------------------

interface AarRow {
  id: string;
  incident_id: string;
  timeline_export: unknown;
  decisions_log: unknown;
  resource_history: unknown;
  status: 'Draft' | 'Finalized';
  finalized_by: string | null;
  finalized_at: string | null;
  created_by: string;
}

interface AarFindingRow {
  id: string;
  aar_id: string;
  finding_text: string;
  category: string | null;
  corrective_action: string | null;
  owner_id: string | null;
  due_date: string | null;
  closure_status: 'Open' | 'Closed';
}

interface AarFindingInput {
  text: string;
  category?: string;
  corrective_action?: string;
  owner_id?: string;
  due_date?: string;
}

function shapeAar(row: AarRow, findings: AarFindingRow[]) {
  return {
    id: row.id,
    incident_id: row.incident_id,
    timeline_export: row.timeline_export,
    decisions_log: row.decisions_log,
    resource_history: row.resource_history,
    status: row.status,
    findings: findings.map((f) => ({
      id: f.id,
      text: f.finding_text,
      category: f.category ?? undefined,
      corrective_action: f.corrective_action ?? undefined,
      owner_id: f.owner_id ?? undefined,
      due_date: f.due_date ?? undefined,
      closure_status: f.closure_status,
    })),
  };
}

async function fetchAarRow(id: string, incidentId: string): Promise<AarRow | null> {
  const rows = await query<AarRow>(
    `SELECT id, incident_id, timeline_export, decisions_log, resource_history, status, finalized_by, finalized_at, created_by
     FROM aars WHERE id = $1 AND incident_id = $2`,
    [id, incidentId],
  );
  return rows[0] ?? null;
}

async function fetchAarFindings(aarId: string): Promise<AarFindingRow[]> {
  return query<AarFindingRow>(
    `SELECT id, aar_id, finding_text, category, corrective_action, owner_id, due_date, closure_status
     FROM aar_findings WHERE aar_id = $1 ORDER BY created_at`,
    [aarId],
  );
}

// Validates the WHOLE findings array before any write — fails atomically
// rather than partially inserting some findings and rejecting a later one
// in the same array.
function validateFindingsOwnership(findings: AarFindingInput[]): boolean {
  for (const f of findings) {
    if (f.corrective_action && f.corrective_action.trim().length > 0) {
      if (!f.owner_id || !f.due_date) return false;
    }
  }
  return true;
}

// Decision-tagging heuristic (documented Phase-4 approximation — see Task 2
// action note): Phase 1-3 never added a literal `is_decision` boolean
// column to the append-only incident_timeline table, and retrofitting one
// is out of this plan's scope. Entries are treated as decision-tagged when
// they are EPMP-sourced AND either carry a warning/danger tone OR match one
// of the known decision-producing title patterns written by
// activation.ts/command-roles.ts/closure.ts.
const DECISION_TITLE_PATTERN = /Activation changed to|assigned to|Incident closed/;

async function assembleAarAssembly(incidentId: string) {
  const timelineRows = await query<Record<string, unknown>>(
    `SELECT id, occurred_at, title, meta, tone, actor_id, source, detail
     FROM incident_timeline WHERE incident_id = $1 ORDER BY occurred_at ASC`,
    [incidentId],
  );

  const decisions_log = timelineRows.filter((row) => {
    const source = row.source as string;
    const tone = row.tone as string;
    const title = row.title as string;
    if (source !== 'EPMP') return false;
    if (tone === 'warning' || tone === 'danger') return true;
    return DECISION_TITLE_PATTERN.test(title);
  });

  const resourceRequests = await query<Record<string, unknown>>(
    `SELECT * FROM resource_requests WHERE incident_id = $1`,
    [incidentId],
  );
  const resourceHistory = await query<Record<string, unknown>>(
    `SELECT h.* FROM resource_request_status_history h
     JOIN resource_requests r ON r.id = h.resource_request_id
     WHERE r.incident_id = $1`,
    [incidentId],
  );

  return {
    timeline_export: timelineRows,
    decisions_log,
    resource_history: { requests: resourceRequests, status_history: resourceHistory },
  };
}

export default async function reportingRoutes(app: FastifyInstance) {
  // -------------------------------------------------------------------
  // SITREP — generate (auto-assembled, zero manual re-entry beyond
  // incident_id)
  // -------------------------------------------------------------------
  app.post<{
    Params: { id: string };
    Body: { include_ai_draft?: boolean };
  }>(
    '/api/v1/incidents/:id/sitreps',
    { preHandler: requirePermission('reporting', 'create') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { include_ai_draft } = req.body ?? ({} as never);

      const incident = await fetchIncidentForMutation(incidentId, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      const content = await assembleSitrepContent(incidentId);

      let ai_origin = false;
      let ai_draft_id: string | null = null;
      if (include_ai_draft) {
        // Narrative-draft stub mirroring 04-01's POST /api/v1/ai-drafts
        // handler (notifications.ts). That handler is an inline route
        // closure, not an exported helper, so it can't be literally
        // imported — this re-stubs the SAME deterministic no-live-gateway
        // pattern locally (same INSERT shape, same jsonb_build_* sources
        // literal) rather than duplicating a reusable function that
        // doesn't exist yet. A future refactor extracting a shared
        // `createAiDraftStub()` helper into notifications.ts would let
        // both call sites share one implementation — out of this plan's
        // budget.
        const draftRows = await query<{ id: string }>(
          `INSERT INTO ai_drafts (target_feature, target_field, draft_text, sources, confidence_label, requesting_user_id)
           VALUES ('sitrep', 'narrative',
                   'Drafted summary (stub \u2014 no live AI gateway in this environment).',
                   jsonb_build_array(jsonb_build_object('source', 'stub', 'time', now()::text, 'confidence', 'Medium')),
                   'Medium', $1)
           RETURNING id`,
          [req.epmpUser!.id],
        );
        ai_draft_id = draftRows[0].id;
        ai_origin = true;
        // content.narrative stays '' until a human approves the draft via
        // the SAME assertAiOriginApproved gate the finalize path below
        // enforces — the draft id rides on the content so the client can
        // surface it, but the draft is NOT yet approved.
        content.ai_origin_narrative_draft_id = ai_draft_id;
      }

      const insertedRows = await query<SitrepRow>(
        `INSERT INTO sitreps (incident_id, content, created_by, ai_origin, ai_draft_id)
         VALUES ($1,$2,$3,$4,$5)
         RETURNING id, incident_id, status, content, ai_origin, ai_draft_id, approved_by, approved_at, created_by`,
        [incidentId, JSON.stringify(content), req.epmpUser!.id, ai_origin, ai_draft_id],
      );
      return reply.code(201).send(shapeSitrep(insertedRows[0]));
    },
  );

  // -------------------------------------------------------------------
  // SITREP — edit / finalize ("Approve and finalize" per S7.2). Draft
  // SITREPs remain freely editable per FRD's "remains available throughout
  // incident lifecycle" note; only Approved ones are immutable.
  // -------------------------------------------------------------------
  app.patch<{
    Params: { id: string; sitrepId: string };
    Body: { content?: Record<string, unknown>; finalize?: boolean };
  }>(
    '/api/v1/incidents/:id/sitreps/:sitrepId',
    { preHandler: requirePermission('reporting', 'edit') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { content, finalize } = req.body ?? ({} as never);

      const incident = await fetchIncidentForMutation(incidentId, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      const sitrep = await fetchSitrepRow(req.params.sitrepId, incidentId);
      if (!sitrep) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      // Already-Approved sitreps reject ANY further edit attempt,
      // finalize or not — this IS the literal "edit attempted on a
      // finalized document" case the FRD's error table names.
      if (sitrep.status === 'Approved') {
        return reply.code(403).send(DOCUMENT_IMMUTABLE);
      }

      if (finalize) {
        try {
          await assertAiOriginApproved(pool as unknown as PoolClient, {
            ai_origin: sitrep.ai_origin,
            ai_draft_id: sitrep.ai_draft_id ?? undefined,
          });
        } catch (err) {
          if (err instanceof AiOriginNotApprovedError) {
            return reply.code(400).send(AIDRAFT_UNAPPROVED_WRITE_BLOCKED);
          }
          throw err;
        }

        const nextContent = content ?? sitrep.content;
        const updatedRows = await query<SitrepRow>(
          `UPDATE sitreps SET status='Approved', approved_by=$1, approved_at=now(), content=$2
           WHERE id=$3
           RETURNING id, incident_id, status, content, ai_origin, ai_draft_id, approved_by, approved_at, created_by`,
          [req.epmpUser!.id, JSON.stringify(nextContent), sitrep.id],
        );
        return reply.code(200).send(shapeSitrep(updatedRows[0]));
      }

      // Not finalizing — a plain Draft content edit.
      const nextContent = content ?? sitrep.content;
      const updatedRows = await query<SitrepRow>(
        `UPDATE sitreps SET content=$1 WHERE id=$2
         RETURNING id, incident_id, status, content, ai_origin, ai_draft_id, approved_by, approved_at, created_by`,
        [JSON.stringify(nextContent), sitrep.id],
      );
      return reply.code(200).send(shapeSitrep(updatedRows[0]));
    },
  );

  // -------------------------------------------------------------------
  // AAR — generate (auto-assembled from Timeline/resource-request
  // history). Blocked until the incident is Closed; one AAR per incident
  // (aars.incident_id UNIQUE) — a re-POST against an existing Draft AAR
  // upserts timeline_export/decisions_log/resource_history in place
  // (refreshing the snapshot) rather than erroring; a re-POST against an
  // already-Finalized AAR is rejected as DOCUMENT_IMMUTABLE.
  // -------------------------------------------------------------------
  app.post<{
    Params: { id: string };
    Body: { findings?: AarFindingInput[] };
  }>(
    '/api/v1/incidents/:id/aar',
    { preHandler: requirePermission('reporting', 'create') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { findings } = req.body ?? ({} as never);

      const incident = await fetchIncidentForMutation(incidentId, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      // Checked BEFORE any write — an open incident never reaches the
      // upsert below.
      if (incident.status !== 'Closed') {
        return reply.code(409).send(INCIDENT_NOT_CLOSED);
      }

      // Validate the WHOLE findings array atomically before any insert.
      const findingsList = findings ?? [];
      if (!validateFindingsOwnership(findingsList)) {
        return reply.code(422).send(CORRECTIVE_ACTION_UNOWNED);
      }

      const assembly = await assembleAarAssembly(incidentId);

      const upsertedRows = await query<AarRow>(
        `INSERT INTO aars (incident_id, timeline_export, decisions_log, resource_history, created_by)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (incident_id) DO UPDATE SET
           timeline_export = EXCLUDED.timeline_export,
           decisions_log = EXCLUDED.decisions_log,
           resource_history = EXCLUDED.resource_history
         WHERE aars.status != 'Finalized'
         RETURNING id, incident_id, timeline_export, decisions_log, resource_history, status, finalized_by, finalized_at, created_by`,
        [
          incidentId,
          JSON.stringify(assembly.timeline_export),
          JSON.stringify(assembly.decisions_log),
          JSON.stringify(assembly.resource_history),
          req.epmpUser!.id,
        ],
      );

      // The WHERE clause excluded the conflicting row (it's already
      // Finalized) — RETURNING yields no row. Rather than silently
      // no-op'ing, surface the real reason.
      const aar = upsertedRows[0];
      if (!aar) {
        return reply.code(403).send(DOCUMENT_IMMUTABLE);
      }

      for (const finding of findingsList) {
        await query(
          `INSERT INTO aar_findings (aar_id, finding_text, category, corrective_action, owner_id, due_date)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            aar.id,
            finding.text,
            finding.category ?? null,
            finding.corrective_action ?? null,
            finding.owner_id ?? null,
            finding.due_date ?? null,
          ],
        );
      }

      const insertedFindings = await fetchAarFindings(aar.id);
      return reply.code(201).send(shapeAar(aar, insertedFindings));
    },
  );

  // -------------------------------------------------------------------
  // AAR — finalize. Immutable thereafter.
  // -------------------------------------------------------------------
  app.patch<{
    Params: { id: string; aarId: string };
  }>(
    '/api/v1/incidents/:id/aar/:aarId/finalize',
    { preHandler: requirePermission('reporting', 'edit') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { aarId } = req.params;

      const incident = await fetchIncidentForMutation(incidentId, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      const aar = await fetchAarRow(aarId, incidentId);
      if (!aar) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      // Subsequent finalize attempts after the first are the literal
      // "edit attempted on finalized document" case.
      if (aar.status === 'Finalized') {
        return reply.code(403).send(DOCUMENT_IMMUTABLE);
      }

      // Defensive re-check at finalize time against the AAR's CURRENT
      // aar_findings rows — a finding could have been added without an
      // owner via a separate hypothetical edit path since creation.
      const currentFindings = await fetchAarFindings(aarId);
      const findingsAsInput: AarFindingInput[] = currentFindings.map((f) => ({
        text: f.finding_text,
        corrective_action: f.corrective_action ?? undefined,
        owner_id: f.owner_id ?? undefined,
        due_date: f.due_date ?? undefined,
      }));
      if (!validateFindingsOwnership(findingsAsInput)) {
        return reply.code(422).send(CORRECTIVE_ACTION_UNOWNED);
      }

      const updatedRows = await query<AarRow>(
        `UPDATE aars SET status='Finalized', finalized_by=$1, finalized_at=now()
         WHERE id=$2
         RETURNING id, incident_id, timeline_export, decisions_log, resource_history, status, finalized_by, finalized_at, created_by`,
        [req.epmpUser!.id, aarId],
      );
      const updated = updatedRows[0];

      // Writes an evidence-log-visible event — evidence-log.ts's
      // aggregated view surfaces this via audit_log. Same single-writer
      // pattern every other module uses for audit-visible cross-cutting
      // events (TechArch 01-components.md's "AuditService.record() called
      // by every other module" rule).
      await AuditService.record(req.epmpUser!.id, 'aar_finalized', 'aar', aarId, { incident_id: incidentId });

      return reply.code(200).send(shapeAar(updated, currentFindings));
    },
  );
}
