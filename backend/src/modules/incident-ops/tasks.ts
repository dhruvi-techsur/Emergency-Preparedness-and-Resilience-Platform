import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';

export type TaskStatus = 'Open' | 'In progress' | 'Awaiting approval' | 'Done' | 'Overdue';

interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  owner_id: string;
  owner_name: string;
  incident_id: string | null;
  plan_section_id: string | null;
  due_at: string;
  requires_approval: boolean;
}

function shapeTaskRow(row: TaskRow) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    status: row.status,
    owner: { id: row.owner_id, name: row.owner_name },
    incident_id: row.incident_id ?? undefined,
    plan_section_id: row.plan_section_id ?? undefined,
    due_at: row.due_at,
  };
}

export const RECORD_NOT_FOUND = {
  error_code: 'RECORD_NOT_FOUND',
  message: "This item no longer exists or you don't have access.",
} as const;

// The fixed task state machine (FRD F4 Validation). 'Overdue' is NEVER a
// valid PATCH target -- it is system-computed only (03-02's time-based
// sweep and Phase 2's closure.ts cascade), enforced by rejecting it
// explicitly before consulting this table at all.
function isValidTransition(current: TaskStatus, next: TaskStatus, requiresApproval: boolean): boolean {
  if (next === 'Overdue') return false;
  switch (current) {
    case 'Open':
      return next === 'In progress';
    case 'In progress':
      if (next === 'Done') return requiresApproval === false;
      if (next === 'Awaiting approval') return requiresApproval === true;
      return false;
    case 'Awaiting approval':
      return next === 'Done';
    case 'Done':
      // "Reopen" per the Task Detail mockup's Task Detail action.
      return next === 'Open';
    case 'Overdue':
      // "Reopen (Done/Overdue)" per the mockup. Deliberate simplification:
      // reopening does NOT auto-update due_at -- the task remains
      // overdue-by-date until a separate edit changes due_at. The FRD
      // doesn't specify due-date-bump-on-reopen behavior.
      return next === 'Open';
    default:
      return false;
  }
}

async function fetchTaskRow(client: { query: typeof query } | typeof query, taskId: string): Promise<TaskRow | null> {
  const runner = typeof client === 'function' ? client : (client as { query: typeof query }).query;
  const rows = await runner<TaskRow>(
    `SELECT t.id, t.title, t.description, t.status, t.owner_id, u.name AS owner_name,
            t.incident_id, t.plan_section_id, t.due_at, t.requires_approval
     FROM tasks t
     JOIN users u ON u.id = t.owner_id
     WHERE t.id = $1`,
    [taskId],
  );
  return rows[0] ?? null;
}

// The single in-process entry point 03-03's `plans` module calls to
// materialize a task from a linked plan_task_template when an incident
// activates -- per TechArch 01-components.md's explicit cross-module rule
// ("plans emits the template list; incident-ops performs the actual task
// creation -- keeping task-creation logic in one place"). Accepts an
// already-open transaction client so the CALLER (plans module) can wrap
// its own template-resolution logic and this task-creation call in ONE
// transaction if it chooses to -- this function does NOT open its own
// transaction via withTimelineTransaction, unlike the HTTP POST handler,
// because it is designed to be called FROM WITHIN another module's
// transaction, not as a standalone entry point.
export const TaskService = {
  async createFromTemplate(
    client: PoolClient,
    params: {
      title: string;
      owner_id: string;
      due_at: string;
      incident_id: string;
      plan_section_id: string;
      requires_approval?: boolean;
      created_by: string;
    },
  ): Promise<{ id: string; title: string; status: string }> {
    const result = await client.query(
      `INSERT INTO tasks (title, owner_id, incident_id, plan_section_id, due_at, requires_approval, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, title, status`,
      [
        params.title,
        params.owner_id,
        params.incident_id,
        params.plan_section_id,
        params.due_at,
        params.requires_approval ?? false,
        params.created_by,
      ],
    );
    const task = result.rows[0];
    await client.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by) VALUES ($1, NULL, 'Open', $2)`,
      [task.id, params.created_by],
    );
    await TimelineService.append(
      client,
      params.incident_id,
      `Task created from plan template: ${task.title}`,
      undefined,
      'brand',
      params.created_by,
      'EPMP',
      { task_id: task.id, plan_section_id: params.plan_section_id },
    );
    return task;
  },
};

export default async function tasksRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: {
      owner?: string;
      status?: TaskStatus;
      incident?: string;
      due_window?: 'overdue' | 'today' | 'week';
      page?: string;
      page_size?: string;
    };
  }>(
    '/api/v1/tasks',
    { preHandler: requirePermission('tasks', 'view') },
    async (req, reply) => {
      const { owner, status, incident, due_window } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (owner) {
        conditions.push(`t.owner_id = $${idx++}`);
        params.push(owner);
      }
      if (status) {
        conditions.push(`t.status = $${idx++}`);
        params.push(status);
      }
      if (incident) {
        conditions.push(`t.incident_id = $${idx++}`);
        params.push(incident);
      }
      if (due_window === 'overdue') {
        conditions.push(`t.due_at < now() AND t.status NOT IN ('Done','Overdue')`);
      } else if (due_window === 'today') {
        conditions.push(
          `t.due_at >= date_trunc('day', now()) AND t.due_at < date_trunc('day', now()) + interval '1 day'`,
        );
      } else if (due_window === 'week') {
        conditions.push(`t.due_at >= now() AND t.due_at <= now() + interval '7 days'`);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM tasks t ${whereClause}`,
        params,
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const limitIdx = idx++;
      const offsetIdx = idx++;
      const rows = await query<TaskRow>(
        `SELECT t.id, t.title, t.description, t.status, t.owner_id, u.name AS owner_name,
                t.incident_id, t.plan_section_id, t.due_at, t.requires_approval
         FROM tasks t
         JOIN users u ON u.id = t.owner_id
         ${whereClause}
         ORDER BY t.due_at ASC
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        [...params, page_size, offset],
      );

      return reply.code(200).send({
        items: rows.map(shapeTaskRow),
        total,
        page,
        page_size,
      });
    },
  );

  app.post<{
    Body: {
      title: string;
      description?: string;
      owner_id?: string;
      due_at: string;
      incident_id?: string;
      plan_section_id?: string;
      requires_approval?: boolean;
      confirmed_backfill?: boolean;
    };
  }>(
    '/api/v1/tasks',
    { preHandler: requirePermission('tasks', 'create') },
    async (req, reply) => {
      const {
        title,
        description,
        owner_id,
        due_at,
        incident_id,
        plan_section_id,
        requires_approval,
        confirmed_backfill,
      } = req.body ?? ({} as never);

      // 1. Owner-required gate -- FRD F4 Validation: "A task cannot be
      // created without an owner." Checked before any DB write.
      if (!owner_id) {
        return reply.code(422).send({
          error_code: 'TASK_OWNER_REQUIRED',
          message: 'Assign an owner before creating this task.',
        });
      }

      // 2. Due-date-in-the-past gate -- same non-blocking-warning pattern
      // 02-01 established for INCIDENT_POSSIBLE_DUPLICATE: reject once,
      // client resubmits with confirmed_backfill:true to proceed.
      const dueAtDate = new Date(due_at);
      if (dueAtDate.getTime() <= Date.now() && confirmed_backfill !== true) {
        return reply.code(422).send({
          error_code: 'DUE_DATE_PAST',
          message: 'This due time has already passed. Confirm this is a retroactive entry.',
        });
      }

      try {
        const task = await withTimelineTransaction(async (client) => {
          const insertedRows = await client.query<TaskRow>(
            `INSERT INTO tasks (title, description, owner_id, incident_id, plan_section_id, due_at, requires_approval, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
             RETURNING id, title, description, status, owner_id, incident_id, plan_section_id, due_at, requires_approval`,
            [
              title,
              description ?? null,
              owner_id,
              incident_id ?? null,
              plan_section_id ?? null,
              due_at,
              requires_approval ?? false,
              req.epmpUser!.id,
            ],
          );
          const created = insertedRows.rows[0];

          await client.query(
            `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by) VALUES ($1, NULL, 'Open', $2)`,
            [created.id, req.epmpUser!.id],
          );

          // Only when incident_id is non-null: a standalone task has no
          // Timeline to write to, which is expected and not an error.
          if (incident_id) {
            await TimelineService.append(
              client,
              incident_id,
              `Task created: ${title}`,
              undefined,
              'brand',
              req.epmpUser!.id,
              'EPMP',
              { task_id: created.id, owner_id },
            );
          }

          return created;
        });

        const detail = await fetchTaskRow(query, task.id);
        return reply.code(201).send(shapeTaskRow(detail!));
      } catch (err) {
        req.log.error(err, 'Task creation transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );

  app.patch<{
    Params: { id: string };
    Body: { new_status: TaskStatus };
  }>(
    '/api/v1/tasks/:id/status',
    { preHandler: requirePermission('tasks', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { new_status } = req.body ?? ({} as never);

      const existing = await fetchTaskRow(query, id);
      if (!existing) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }

      if (!isValidTransition(existing.status, new_status, existing.requires_approval)) {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: `This task can't move to ${new_status} from its current state.`,
        });
      }

      try {
        await withTimelineTransaction(async (client) => {
          await client.query(`UPDATE tasks SET status=$1, updated_at=now() WHERE id=$2`, [new_status, id]);
          await client.query(
            `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by) VALUES ($1,$2,$3,$4)`,
            [id, existing.status, new_status, req.epmpUser!.id],
          );
          if (existing.incident_id) {
            await TimelineService.append(
              client,
              existing.incident_id,
              `Task "${existing.title}": ${existing.status} \u2192 ${new_status}`,
              undefined,
              new_status === 'Done' ? 'success' : 'brand',
              req.epmpUser!.id,
              'EPMP',
              { task_id: id, from_status: existing.status, to_status: new_status },
            );
          }
        });

        const detail = await fetchTaskRow(query, id);
        return reply.code(200).send(shapeTaskRow(detail!));
      } catch (err) {
        req.log.error(err, 'Task status-transition transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
