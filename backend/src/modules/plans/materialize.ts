import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query, pool } from '../../db/client.js';
import { TaskService } from '../incident-ops/tasks.js';
import { PLAN_NOT_FOUND } from './plans.js';

// Separate from plans.ts per this plan's own "Claude's discretion" note —
// plans.ts had already grown past this plan's 2-3-task budget comfort, so
// the materialization endpoint (added per FRD's Process step 5, NOT in
// TechArch's literal endpoint table — see this plan's objective) gets its
// own file.

interface PlanStatusRow {
  status: string;
}

interface TemplateRow {
  id: string;
  plan_section_id: string;
  default_title: string;
  default_owner_role: string | null;
  default_due_offset_minutes: number | null;
}

interface IncidentOpenedAtRow {
  opened_at: string;
}

export default async function materializeRoutes(app: FastifyInstance) {
  app.post<{
    Params: { id: string };
    Body: { incident_id: string; section_ids?: string[] };
  }>(
    '/api/v1/plans/:id/materialize-tasks',
    { preHandler: requirePermission('plans', 'edit') },
    async (req, reply) => {
      const { id: planId } = req.params;
      const { incident_id, section_ids } = req.body ?? ({} as never);

      const planRows = await query<PlanStatusRow>(`SELECT status FROM plans WHERE id = $1`, [planId]);
      const plan = planRows[0];
      if (!plan) {
        return reply.code(404).send(PLAN_NOT_FOUND);
      }

      // Only an Approved plan's templates should be offered for
      // materialization — an un-approved Draft/Review plan's templates
      // are not yet the operational version.
      if (plan.status !== 'Approved') {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: 'Only an Approved plan\'s task templates can be materialized into tasks.',
        });
      }

      const incidentRows = await query<IncidentOpenedAtRow>(
        `SELECT opened_at FROM incidents WHERE id = $1`,
        [incident_id],
      );
      const incident = incidentRows[0];
      if (!incident) {
        return reply.code(404).send({
          error_code: 'RECORD_NOT_FOUND',
          message: "This item no longer exists or you don't have access.",
        });
      }

      const conditions = ['ps.plan_id = $1'];
      const params: unknown[] = [planId];
      if (section_ids && section_ids.length > 0) {
        conditions.push(`ptt.plan_section_id = ANY($2)`);
        params.push(section_ids);
      }

      const templates = await query<TemplateRow>(
        `SELECT ptt.id, ptt.plan_section_id, ptt.default_title, ptt.default_owner_role, ptt.default_due_offset_minutes
         FROM plan_task_templates ptt
         JOIN plan_sections ps ON ps.id = ptt.plan_section_id
         WHERE ${conditions.join(' AND ')}`,
        params,
      );

      const created: Array<{ id: string; title: string; status: string }> = [];
      const skipped: Array<{ template_id: string; reason: string }> = [];

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        for (const template of templates) {
          // default_owner_role is a ROLE NAME, not a user id — resolve to
          // a concrete owner_id by picking the most-recently-active user
          // holding that role as a reasonable MVP default assignee. This
          // is Claude's discretion resolving an FRD/TechArch gap — the
          // FRD describes role-based default ownership but F4's actual
          // Task schema requires a concrete owner_id; a more complete
          // future phase might prompt the user to confirm/override the
          // resolved owner before creating each task, but this MVP-scope
          // endpoint auto-resolves and reports skips rather than
          // blocking the one-click flow on a confirmation step the FRD
          // doesn't describe.
          if (!template.default_owner_role) {
            skipped.push({ template_id: template.id, reason: 'NO_USER_FOR_ROLE' });
            continue;
          }

          const ownerRows = await client.query<{ id: string }>(
            `SELECT u.id FROM users u
             JOIN roles r ON r.id = u.role_id
             WHERE r.name = $1
             ORDER BY u.last_login_at DESC NULLS LAST
             LIMIT 1`,
            [template.default_owner_role],
          );
          const owner = ownerRows.rows[0];
          if (!owner) {
            skipped.push({ template_id: template.id, reason: 'NO_USER_FOR_ROLE' });
            continue;
          }

          // due_at resolution: incident.opened_at + default_due_offset_minutes.
          // If default_due_offset_minutes is null, default to 24 hours from
          // now — a reasonable fallback for templates that don't specify an
          // offset.
          let dueAt: Date;
          if (template.default_due_offset_minutes != null) {
            dueAt = new Date(
              new Date(incident.opened_at).getTime() + template.default_due_offset_minutes * 60_000,
            );
          } else {
            dueAt = new Date(Date.now() + 24 * 60 * 60_000);
          }

          const task = await TaskService.createFromTemplate(client, {
            title: template.default_title,
            owner_id: owner.id,
            due_at: dueAt.toISOString(),
            incident_id,
            plan_section_id: template.plan_section_id,
            created_by: req.epmpUser!.id,
          });
          created.push(task);
        }

        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        req.log.error(err, 'Plan task materialization transaction failed');
        throw err;
      } finally {
        client.release();
      }

      return reply.code(200).send({ created, skipped });
    },
  );
}
