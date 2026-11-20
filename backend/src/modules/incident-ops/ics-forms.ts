import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { requirePermission } from '../auth-org/rbac.js';
import { query, pool } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';
import { fetchIncidentForMutation, INCIDENT_NOT_FOUND } from './incidents.js';
import { assertAiOriginApproved, AiOriginNotApprovedError } from '../ai-assist/governance.js';

export type IcsFormStatus = 'Draft' | 'Approved';

interface IcsFormRow {
  id: string;
  incident_id: string;
  form_type: string;
  status: IcsFormStatus;
  content: Record<string, unknown>;
  ai_origin: boolean;
  ai_draft_id: string | null;
  approved_by_id: string | null;
  approved_by_name: string | null;
  approved_at: string | null;
}

function shapeIcsFormRow(row: IcsFormRow) {
  return {
    id: row.id,
    incident_id: row.incident_id,
    form_type: row.form_type,
    status: row.status,
    content: row.content,
    ai_origin: row.ai_origin,
    approved_by: row.approved_by_id ? { id: row.approved_by_id, name: row.approved_by_name } : undefined,
    approved_at: row.approved_at ?? undefined,
  };
}

export const ICS_FORM_NOT_FOUND = {
  error_code: 'ICS_FORM_NOT_FOUND',
  message: "This ICS form no longer exists or you don't have access.",
} as const;

const APPROVAL_REQUIRES_NAMED_USER = {
  error_code: 'APPROVAL_REQUIRES_NAMED_USER',
  message: 'Approval must be made by a signed-in person, not an automated process.',
} as const;

const AIDRAFT_UNAPPROVED_WRITE_BLOCKED = {
  error_code: 'AIDRAFT_UNAPPROVED_WRITE_BLOCKED',
  message: "This draft hasn't been approved. Approve it before it can be sent/saved.",
} as const;

// `jurisdictionScope`, when passed, restricts the lookup to ICS forms whose
// linked incident is in the caller's own jurisdiction_scope — same
// app-layer enforcement pattern as every other incident-scoped route in
// this module (resource-requests.ts's fetchResourceRequestRow, tasks.ts's
// fetchTaskRow).
async function fetchIcsFormRow(
  id: string,
  jurisdictionScope?: string[],
): Promise<IcsFormRow | null> {
  const params: unknown[] = [id];
  let scopeClause = '';
  if (jurisdictionScope) {
    params.push(jurisdictionScope);
    scopeClause = ` AND i.jurisdiction_id = ANY($${params.length})`;
  }
  const rows = await query<IcsFormRow>(
    `SELECT f.id, f.incident_id, f.form_type, f.status, f.content, f.ai_origin, f.ai_draft_id,
            f.approved_by AS approved_by_id, u.name AS approved_by_name, f.approved_at
     FROM ics_forms f
     JOIN incidents i ON i.id = f.incident_id
     LEFT JOIN users u ON u.id = f.approved_by
     WHERE f.id = $1${scopeClause}`,
    params,
  );
  return rows[0] ?? null;
}

/**
 * Mounts GET/POST /api/v1/incidents/{id}/ics-forms and
 * POST /api/v1/incidents/{id}/ics-forms/{formId}/approve.
 *
 * `ics_forms` is F1-owned per TechArch, so this reuses the existing
 * `incidents` feature-permission (no new permission string needed) — ICS
 * forms are incident-scoped content, same as command-roles/activation.
 */
export default async function icsFormsRoutes(app: FastifyInstance) {
  app.get<{ Params: { id: string } }>(
    '/api/v1/incidents/:id/ics-forms',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      const incident = await fetchIncidentForMutation(req.params.id, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }

      const rows = await query<IcsFormRow>(
        `SELECT f.id, f.incident_id, f.form_type, f.status, f.content, f.ai_origin, f.ai_draft_id,
                f.approved_by AS approved_by_id, u.name AS approved_by_name, f.approved_at
         FROM ics_forms f
         LEFT JOIN users u ON u.id = f.approved_by
         WHERE f.incident_id = $1
         ORDER BY f.created_at`,
        [req.params.id],
      );
      return reply.code(200).send(rows.map(shapeIcsFormRow));
    },
  );

  app.post<{
    Params: { id: string };
    Body: { form_type: string; content: Record<string, unknown>; ai_origin?: boolean; ai_draft_id?: string };
  }>(
    '/api/v1/incidents/:id/ics-forms',
    { preHandler: requirePermission('incidents', 'edit') },
    async (req, reply) => {
      const incident = await fetchIncidentForMutation(req.params.id, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }

      const { form_type, content, ai_origin, ai_draft_id } = req.body ?? ({} as never);

      // Draft-state writes don't count as state-changing actions (same
      // convention this module already established for plain incident
      // metadata PATCHes) — no Timeline entry on create.
      const insertedRows = await query<IcsFormRow>(
        `INSERT INTO ics_forms (incident_id, form_type, content, ai_origin, ai_draft_id, created_by)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id, incident_id, form_type, status, content, ai_origin, ai_draft_id,
                   approved_by AS approved_by_id, NULL AS approved_by_name, approved_at`,
        [req.params.id, form_type, JSON.stringify(content), ai_origin ?? false, ai_draft_id ?? null, req.epmpUser!.id],
      );

      return reply.code(201).send(shapeIcsFormRow(insertedRows[0]));
    },
  );

  app.post<{ Params: { id: string; formId: string }; Body: { approved_by: string } }>(
    '/api/v1/incidents/:id/ics-forms/:formId/approve',
    { preHandler: requirePermission('incidents', 'approve') },
    async (req, reply) => {
      const incident = await fetchIncidentForMutation(req.params.id, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }

      const { approved_by } = req.body ?? ({} as never);

      // Approval must be made by a signed-in person — `approved_by` is
      // re-verified server-side against req.epmpUser!.id, never trusted as
      // a bare client-asserted string (T-06-01: a caller cannot approve on
      // another named person's behalf).
      if (!approved_by || approved_by !== req.epmpUser!.id) {
        return reply.code(403).send(APPROVAL_REQUIRES_NAMED_USER);
      }

      const existing = await fetchIcsFormRow(req.params.formId, req.epmpUser!.jurisdiction_scope);
      if (!existing || existing.incident_id !== req.params.id) {
        return reply.code(404).send(ICS_FORM_NOT_FOUND);
      }

      // The ONE enforcement point for every endpoint writing ai_origin:true
      // content to an official record (T-06-02) — runs inside the same
      // transaction as the approve UPDATE below.
      try {
        await assertAiOriginApproved(pool as unknown as PoolClient, {
          ai_origin: existing.ai_origin,
          ai_draft_id: existing.ai_draft_id ?? undefined,
        });
      } catch (err) {
        if (err instanceof AiOriginNotApprovedError) {
          return reply.code(400).send(AIDRAFT_UNAPPROVED_WRITE_BLOCKED);
        }
        throw err;
      }

      try {
        await withTimelineTransaction(async (client) => {
          await client.query(
            `UPDATE ics_forms SET status='Approved', approved_by=$1, approved_at=now(), updated_at=now() WHERE id=$2`,
            [req.epmpUser!.id, req.params.formId],
          );
          await TimelineService.append(
            client,
            req.params.id,
            `ICS form approved: ${existing.form_type}`,
            undefined,
            'brand',
            req.epmpUser!.id,
            'EPMP',
            { ics_form_id: req.params.formId, ai_origin: existing.ai_origin },
          );
        });

        const detail = await fetchIcsFormRow(req.params.formId, req.epmpUser!.jurisdiction_scope);
        return reply.code(200).send(shapeIcsFormRow(detail!));
      } catch (err) {
        req.log.error(err, 'ICS form approve transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
