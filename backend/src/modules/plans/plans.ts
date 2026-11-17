import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { requirePermission } from '../auth-org/rbac.js';
import { query, pool } from '../../db/client.js';
import { AuditService } from '../auth-org/audit.js';

export type PlanStatus = 'Draft' | 'Review' | 'Approved';
export type PlanType = 'EOP' | 'SOP' | 'Annex';
export type ReviewAction = 'approve' | 'request_changes';

export const PLAN_NOT_FOUND = {
  error_code: 'PLAN_NOT_FOUND',
  message: 'This plan no longer exists or you have access.',
} as const;

interface PlanRow {
  id: string;
  name: string;
  type: PlanType;
  status: PlanStatus;
  jurisdiction_id: string;
  jurisdiction_name: string;
  current_version: number;
  owner_id: string;
  owner_name: string;
  source_document_ref: string | null;
}

interface PlanSectionRow {
  id: string;
  plan_id: string;
  heading: string;
  body: string | null;
  sort_order: number;
}

interface PlanVersionRow {
  version_number: number;
  content_snapshot: unknown;
  submitted_by: string | null;
  reviewed_by: string | null;
  review_action: ReviewAction | null;
  reviewed_at: string | null;
}

function shapePlanListRow(row: PlanRow) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    status: row.status,
    jurisdiction_id: row.jurisdiction_id,
    version: row.current_version,
    owner: { id: row.owner_id, name: row.owner_name },
  };
}

async function fetchPlanRow(client: { query: typeof query } | typeof query, planId: string): Promise<PlanRow | null> {
  const runner = typeof client === 'function' ? client : (client as { query: typeof query }).query;
  const rows = await runner<PlanRow>(
    `SELECT p.id, p.name, p.type, p.status, p.jurisdiction_id, j.name AS jurisdiction_name,
            p.current_version, p.owner_id, u.name AS owner_name, p.source_document_ref
     FROM plans p
     JOIN jurisdictions j ON j.id = p.jurisdiction_id
     JOIN users u ON u.id = p.owner_id
     WHERE p.id = $1`,
    [planId],
  );
  return rows[0] ?? null;
}

async function fetchPlanSections(planId: string): Promise<PlanSectionRow[]> {
  return query<PlanSectionRow>(
    `SELECT id, plan_id, heading, body, sort_order FROM plan_sections WHERE plan_id = $1 ORDER BY sort_order ASC`,
    [planId],
  );
}

async function fetchLinkedTaskTemplateIds(sectionIds: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  if (sectionIds.length === 0) return map;
  const rows = await query<{ id: string; plan_section_id: string }>(
    `SELECT id, plan_section_id FROM plan_task_templates WHERE plan_section_id = ANY($1)`,
    [sectionIds],
  );
  for (const row of rows) {
    const existing = map.get(row.plan_section_id) ?? [];
    existing.push(row.id);
    map.set(row.plan_section_id, existing);
  }
  return map;
}

async function fetchVersionHistory(planId: string) {
  const rows = await query<PlanVersionRow>(
    `SELECT version_number, submitted_by, reviewed_by, review_action, reviewed_at
     FROM plan_versions WHERE plan_id = $1 ORDER BY version_number DESC`,
    [planId],
  );
  return rows.map((r) => ({
    version_number: r.version_number,
    reviewed_by: r.reviewed_by ?? undefined,
    review_action: r.review_action ?? undefined,
    reviewed_at: r.reviewed_at ?? undefined,
  }));
}

// Builds the full PlanDetail response shape per TechArch 03c's PlanDetail
// interface: base Plan fields + sections (each carrying its
// linked_task_templates ids, ready for one-click materialization) +
// version_history ordered newest-first.
async function fetchPlanDetail(planId: string) {
  const plan = await fetchPlanRow(query, planId);
  if (!plan) return null;

  const sections = await fetchPlanSections(planId);
  const templateMap = await fetchLinkedTaskTemplateIds(sections.map((s) => s.id));
  const version_history = await fetchVersionHistory(planId);

  return {
    ...shapePlanListRow(plan),
    sections: sections.map((s) => ({
      id: s.id,
      heading: s.heading,
      body: s.body ?? '',
      sort_order: s.sort_order,
      linked_task_templates: templateMap.get(s.id) ?? [],
    })),
    version_history,
  };
}

export default async function plansRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: {
      type?: PlanType;
      status?: PlanStatus;
      jurisdiction?: string;
      page?: string;
      page_size?: string;
    };
  }>(
    '/api/v1/plans',
    { preHandler: requirePermission('plans', 'view') },
    async (req, reply) => {
      const { type, status, jurisdiction } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (type) {
        conditions.push(`p.type = $${idx++}`);
        params.push(type);
      }
      if (status) {
        conditions.push(`p.status = $${idx++}`);
        params.push(status);
      }
      if (jurisdiction) {
        conditions.push(`p.jurisdiction_id = $${idx++}`);
        params.push(jurisdiction);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM plans p ${whereClause}`,
        params,
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const limitIdx = idx++;
      const offsetIdx = idx++;
      const rows = await query<PlanRow>(
        `SELECT p.id, p.name, p.type, p.status, p.jurisdiction_id, j.name AS jurisdiction_name,
                p.current_version, p.owner_id, u.name AS owner_name, p.source_document_ref
         FROM plans p
         JOIN jurisdictions j ON j.id = p.jurisdiction_id
         JOIN users u ON u.id = p.owner_id
         ${whereClause}
         ORDER BY p.updated_at DESC
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        [...params, page_size, offset],
      );

      return reply.code(200).send({
        items: rows.map(shapePlanListRow),
        total,
        page,
        page_size,
      });
    },
  );

  app.post<{
    Body: {
      name: string;
      type: PlanType;
      jurisdiction_id: string;
      content_sections?: Array<{ heading: string; body?: string }>;
    };
  }>(
    '/api/v1/plans',
    { preHandler: requirePermission('plans', 'create') },
    async (req, reply) => {
      const { name, type, jurisdiction_id, content_sections } = req.body ?? ({} as never);

      // FRD's "at least one section" rule gates SUBMIT-FOR-REVIEW only
      // (see PLAN_EMPTY below), not plan creation — a Draft with zero
      // sections is a valid, if incomplete, resting state. Do NOT reject
      // creation here even if content_sections is empty/omitted.
      const sections = content_sections ?? [];

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const insertedRows = await client.query<{ id: string }>(
          `INSERT INTO plans (name, type, jurisdiction_id, owner_id)
           VALUES ($1,$2,$3,$4) RETURNING id`,
          [name, type, jurisdiction_id, req.epmpUser!.id],
        );
        const planId = insertedRows.rows[0].id;

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];
          await client.query(
            `INSERT INTO plan_sections (plan_id, heading, body, sort_order) VALUES ($1,$2,$3,$4)`,
            [planId, section.heading, section.body ?? null, i],
          );
        }

        await client.query('COMMIT');

        const detail = await fetchPlanDetail(planId);
        return reply.code(201).send(detail);
      } catch (err) {
        await client.query('ROLLBACK');
        req.log.error(err, 'Plan creation transaction failed');
        throw err;
      } finally {
        client.release();
      }
    },
  );

  app.get<{ Params: { id: string } }>(
    '/api/v1/plans/:id',
    { preHandler: requirePermission('plans', 'view') },
    async (req, reply) => {
      const detail = await fetchPlanDetail(req.params.id);
      if (!detail) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }
      return reply.code(200).send(detail);
    },
  );

  app.patch<{
    Params: { id: string };
    Body: {
      name?: string;
      jurisdiction_id?: string;
      sections?: Array<{ id: string; heading?: string; body?: string }>;
    };
  }>(
    '/api/v1/plans/:id',
    { preHandler: requirePermission('plans', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { name, jurisdiction_id, sections } = req.body ?? ({} as never);

      const existing = await fetchPlanRow(query, id);
      if (!existing) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }

      // A plan in Review or Approved is read-only for direct content edits
      // — only Draft plans accept a generic PATCH. Task-template linkage
      // (see link-tasks below) is deliberately exempt from this gate since
      // it is section METADATA, not plan CONTENT.
      if (existing.status !== 'Draft') {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: `This plan can't be edited while in ${existing.status} status.`,
        });
      }

      const updates: string[] = [];
      const params: unknown[] = [];
      let idx = 1;
      if (name !== undefined) {
        updates.push(`name = $${idx++}`);
        params.push(name);
      }
      if (jurisdiction_id !== undefined) {
        updates.push(`jurisdiction_id = $${idx++}`);
        params.push(jurisdiction_id);
      }
      if (updates.length > 0) {
        params.push(id);
        await query(`UPDATE plans SET ${updates.join(', ')}, updated_at = now() WHERE id = $${idx}`, params);
      }

      if (sections) {
        for (const section of sections) {
          const sectionUpdates: string[] = [];
          const sectionParams: unknown[] = [];
          let sIdx = 1;
          if (section.heading !== undefined) {
            sectionUpdates.push(`heading = $${sIdx++}`);
            sectionParams.push(section.heading);
          }
          if (section.body !== undefined) {
            sectionUpdates.push(`body = $${sIdx++}`);
            sectionParams.push(section.body);
          }
          if (sectionUpdates.length > 0) {
            sectionParams.push(section.id, id);
            await query(
              `UPDATE plan_sections SET ${sectionUpdates.join(', ')}, updated_at = now() WHERE id = $${sIdx} AND plan_id = $${sIdx + 1}`,
              sectionParams,
            );
          }
        }
      }

      const detail = await fetchPlanDetail(id);
      return reply.code(200).send(detail);
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/v1/plans/:id/submit-review',
    { preHandler: requirePermission('plans', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const existing = await fetchPlanRow(query, id);
      if (!existing) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }

      // Submitting an already-Review/Approved plan is a no-op returning
      // the current state, not an error — only act when status is Draft.
      if (existing.status !== 'Draft') {
        const detail = await fetchPlanDetail(id);
        return reply.code(200).send(detail);
      }

      const sections = await fetchPlanSections(id);
      if (sections.length === 0) {
        return reply.code(422).send({
          error_code: 'PLAN_EMPTY',
          message: 'Add at least one section before submitting this plan for review.',
        });
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(`UPDATE plans SET status = 'Review', updated_at = now() WHERE id = $1`, [id]);

        // This is the FIRST plan_versions row for this version_number,
        // created at submit-time (not at approve-time). The content
        // snapshot is fixed NOW, before any reviewer could influence it —
        // this is what makes "immutable snapshot of sections at approval
        // time" true even though the SAME row's reviewed_by/review_action/
        // reviewed_at columns get filled in later by the review step. The
        // content_snapshot column itself is never UPDATEd by any code
        // path — only those three review-outcome columns are, on this
        // identical row.
        const contentSnapshot = sections.map((s) => ({
          id: s.id,
          heading: s.heading,
          body: s.body,
          sort_order: s.sort_order,
        }));
        await client.query(
          `INSERT INTO plan_versions (plan_id, version_number, content_snapshot, submitted_by)
           VALUES ($1,$2,$3,$4)`,
          [id, existing.current_version, JSON.stringify(contentSnapshot), req.epmpUser!.id],
        );

        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        req.log.error(err, 'Plan submit-review transaction failed');
        throw err;
      } finally {
        client.release();
      }

      const detail = await fetchPlanDetail(id);
      return reply.code(200).send(detail);
    },
  );

  app.post<{
    Params: { id: string };
    Body: { review_action: ReviewAction; comments?: string };
  }>(
    '/api/v1/plans/:id/review',
    // 'review' is a NEW action-level on the plans feature-permission,
    // distinct from 'edit' — not every plan editor should be a reviewer.
    // 03-07's seed grants 'review' only to the roles the FRD designates
    // (PER-01 or PER-03-with-review-permission).
    { preHandler: requirePermission('plans', 'review') },
    async (req, reply) => {
      const { id } = req.params;
      const { review_action, comments } = req.body ?? ({} as never);

      const existing = await fetchPlanRow(query, id);
      if (!existing) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }
      if (existing.status !== 'Review') {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: `This plan can't be reviewed from its current state.`,
        });
      }

      const versionRows = await query<{ id: string; submitted_by: string | null }>(
        `SELECT id, submitted_by FROM plan_versions
         WHERE plan_id = $1 AND version_number = $2 AND reviewed_by IS NULL`,
        [id, existing.current_version],
      );
      const planVersion = versionRows[0];

      // Self-approval gate (application layer). The chk_no_self_approval
      // DB CHECK constraint from this plan's own migration is the
      // structural backstop making this true even if a future code path
      // bypassed this check — no update is issued here on rejection, so
      // the plan's status remains Review.
      if (review_action === 'approve' && planVersion && planVersion.submitted_by === req.epmpUser!.id) {
        return reply.code(403).send({
          error_code: 'SELF_APPROVAL_BLOCKED',
          message: 'You submitted this plan for review. Ask another reviewer to approve it.',
        });
      }

      if (review_action === 'approve') {
        await query(
          `UPDATE plan_versions SET reviewed_by = $1, review_action = 'approve', reviewed_at = now() WHERE id = $2`,
          [req.epmpUser!.id, planVersion!.id],
        );
        // Incrementing current_version so the NEXT edit cycle, if any,
        // starts a fresh version number. Approved plans ARE editable
        // again via a follow-up PATCH, which per FRD's workflow would
        // need to flip status back to Draft first — this plan's scope
        // does not build an explicit "re-open for editing" transition
        // beyond what's described, since the FRD's Process section only
        // describes the one-way Draft->Review->Approved flow per
        // version. A future version-N+1 edit cycle is out of this
        // plan's literal scope — documented as a known simplification.
        await query(
          `UPDATE plans SET status = 'Approved', current_version = current_version + 1, updated_at = now() WHERE id = $1`,
          [id],
        );
        await AuditService.record(req.epmpUser!.id, 'plan_approve', 'plan', id, {
          version: existing.current_version,
        });
      } else {
        await query(
          `UPDATE plan_versions SET reviewed_by = $1, review_action = 'request_changes', reviewed_at = now() WHERE id = $2`,
          [req.epmpUser!.id, planVersion!.id],
        );
        await query(`UPDATE plans SET status = 'Draft', updated_at = now() WHERE id = $1`, [id]);
        // TechArch's plan_versions schema has no dedicated comments
        // column (a known gap — the literal DDL doesn't include one).
        // comments are accepted in the request body and written to the
        // audit trail here, satisfying the audit requirement even though
        // no dedicated UI-facing comments field exists on plan_versions.
        // A future phase extending this table with a `comments TEXT`
        // column would be the correct fix; out of this plan's scope to
        // add unprompted since it's not in the provided DDL.
        await AuditService.record(req.epmpUser!.id, 'plan_request_changes', 'plan', id, {
          version: existing.current_version,
          comments,
        });
      }

      const detail = await fetchPlanDetail(id);
      return reply.code(200).send(detail);
    },
  );

  app.post<{
    Params: { id: string; sectionId: string };
    Body: {
      task_template_ids?: string[];
      new_template?: { default_title: string; default_owner_role?: string; default_due_offset_minutes?: number };
    };
  }>(
    '/api/v1/plans/:id/sections/:sectionId/link-tasks',
    // Explicit status-gate decision (no ambiguity for downstream plans to
    // guess at): this endpoint is INTENTIONALLY NOT restricted to
    // status='Draft', unlike the generic PATCH /api/v1/plans/{id}
    // handler above. plan_task_templates rows are section-scoped
    // METADATA (a task-generation rule), not plan CONTENT — they do not
    // participate in the plan_versions.content_snapshot immutability
    // guarantee, and linking a new template to an Approved plan's
    // section does not retroactively alter any already-Approved
    // version's snapshot (the snapshot was taken at submit-review time
    // and never includes plan_task_templates data). A planning user
    // should be able to add a task template to an already-Approved
    // plan's section without reopening the whole approval workflow,
    // since doing so doesn't change what was approved.
    { preHandler: requirePermission('plans', 'edit') },
    async (req, reply) => {
      const { id, sectionId } = req.params;
      const { task_template_ids, new_template } = req.body ?? ({} as never);

      const plan = await fetchPlanRow(query, id);
      if (!plan) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }

      const sectionRows = await query<{ id: string }>(
        `SELECT id FROM plan_sections WHERE id = $1 AND plan_id = $2`,
        [sectionId, id],
      );
      if (!sectionRows[0]) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }

      if (new_template) {
        await query(
          `INSERT INTO plan_task_templates (plan_section_id, default_title, default_owner_role, default_due_offset_minutes)
           VALUES ($1,$2,$3,$4)`,
          [
            sectionId,
            new_template.default_title,
            new_template.default_owner_role ?? null,
            new_template.default_due_offset_minutes ?? null,
          ],
        );
      }

      // task_template_ids in practice only matters for re-confirming
      // already-linked templates in this schema design — a template is
      // created already-scoped to a section (plan_task_templates.
      // plan_section_id is NOT NULL and fixed at creation), so "linking"
      // an EXISTING template id from a DIFFERENT section is not a
      // supported operation per this schema shape. The primary flow is
      // new_template creation above.
      void task_template_ids;

      return reply.code(204).send();
    },
  );
}
