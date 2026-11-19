import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { requirePermission, requireAnyPermission } from '../auth-org/rbac.js';
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
    requires_approval: row.requires_approval,
  };
}

interface TaskStatusHistoryRow {
  from_status: TaskStatus | null;
  to_status: TaskStatus;
  changed_at: string;
}

async function fetchTaskStatusHistory(taskId: string): Promise<TaskStatusHistoryRow[]> {
  return query<TaskStatusHistoryRow>(
    `SELECT from_status, to_status, changed_at FROM task_status_history
     WHERE task_id = $1 ORDER BY changed_at ASC`,
    [taskId],
  );
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

// `jurisdictionScope`, when passed, restricts the lookup to tasks whose
// linked incident's jurisdiction_id is in the caller's own
// jurisdiction_scope — same app-layer enforcement pattern as incidents.ts's
// fetchIncidentForMutation (F-01 fix, 03-SECURITY.md). tasks has no
// jurisdiction_id column of its own, so the scope check joins through
// incident_id -> incidents.jurisdiction_id (same join pattern
// operating-picture.ts's resource-marker query already uses). A standalone
// task (incident_id IS NULL, a documented valid resting state) carries no
// jurisdiction data at all and is left unscoped — there is no jurisdiction
// boundary to enforce against a task that isn't linked to any incident.
async function fetchTaskRow(
  client: { query: typeof query } | typeof query,
  taskId: string,
  jurisdictionScope?: string[],
): Promise<TaskRow | null> {
  const runner = typeof client === 'function' ? client : (client as { query: typeof query }).query;
  const params: unknown[] = [taskId];
  let scopeClause = '';
  if (jurisdictionScope) {
    params.push(jurisdictionScope);
    scopeClause = ` AND (t.incident_id IS NULL OR i.jurisdiction_id = ANY($${params.length}))`;
  }
  const rows = await runner<TaskRow>(
    `SELECT t.id, t.title, t.description, t.status, t.owner_id, u.name AS owner_name,
            t.incident_id, t.plan_section_id, t.due_at, t.requires_approval
     FROM tasks t
     JOIN users u ON u.id = t.owner_id
     LEFT JOIN incidents i ON i.id = t.incident_id
     WHERE t.id = $1${scopeClause}`,
    params,
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

      // Jurisdiction-scope enforcement (F-01 fix, 03-SECURITY.md): every
      // tasks-list caller only ever sees tasks whose linked incident is
      // in their own jurisdiction_scope; standalone tasks (incident_id
      // IS NULL) carry no jurisdiction data and are left unfiltered.
      const conditions: string[] = ['(t.incident_id IS NULL OR i.jurisdiction_id = ANY($1))'];
      const params: unknown[] = [req.epmpUser!.jurisdiction_scope];
      let idx = 2;

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
        `SELECT COUNT(*) AS count FROM tasks t LEFT JOIN incidents i ON i.id = t.incident_id ${whereClause}`,
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
         LEFT JOIN incidents i ON i.id = t.incident_id
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

  // GET /api/v1/tasks/{id} -- TechArch's literal endpoint table has no
  // single-task GET (only the list + PATCH-status), but Task Detail (S4.3,
  // 03-06) needs one: fetching the full list client-side and filtering by
  // id would mean every Task Detail view-load pulls every task in the
  // system, which is both wasteful and silently breaks once pagination
  // ever truncates the list. This is a thin, same-shape addition (reuses
  // fetchTaskRow + shapeTaskRow exactly as the other handlers do) rather
  // than a new concept -- same precedent as 03-03's GET /api/v1/plans/{id}.
  app.get<{ Params: { id: string } }>(
    '/api/v1/tasks/:id',
    { preHandler: requirePermission('tasks', 'view') },
    async (req, reply) => {
      // Jurisdiction-scope enforcement (F-01 fix, 03-SECURITY.md): a
      // caller can only read a task whose linked incident is in their
      // own jurisdiction_scope (standalone tasks are left unscoped).
      const detail = await fetchTaskRow(query, req.params.id, req.epmpUser!.jurisdiction_scope);
      if (!detail) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }
      // status_history: Task Detail's "Status history" Timeline section
      // (S4.3) needs the real task_status_history rows, not a simplified
      // inline list -- this single-task endpoint is the natural place to
      // embed it rather than adding yet another dedicated route.
      const history = await fetchTaskStatusHistory(req.params.id);
      return reply.code(200).send({ ...shapeTaskRow(detail), status_history: history });
    },
  );

  // PATCH /api/v1/tasks/{id}/owner -- a thin, metadata-only write (not a
  // status transition, no task_status_history row, same "metadata vs.
  // transition" distinction 03-04's resource-requests.ts fulfill endpoint
  // documents for assigned_to) needed by Task List's (S4.1) "Reassign"
  // bulk action. No literal endpoint exists for this in TechArch's table;
  // this is the minimal addition that makes the mockup's documented bulk
  // action actually work end-to-end.
  app.patch<{ Params: { id: string }; Body: { owner_id: string } }>(
    '/api/v1/tasks/:id/owner',
    { preHandler: requirePermission('tasks', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { owner_id } = req.body ?? ({} as never);
      if (!owner_id) {
        return reply.code(422).send({
          error_code: 'TASK_OWNER_REQUIRED',
          message: 'Assign an owner before creating this task.',
        });
      }
      // Jurisdiction-scope enforcement (F-01 fix, 03-SECURITY.md).
      const existing = await fetchTaskRow(query, id, req.epmpUser!.jurisdiction_scope);
      if (!existing) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }
      await query(`UPDATE tasks SET owner_id=$1, updated_at=now() WHERE id=$2`, [owner_id, id]);
      const detail = await fetchTaskRow(query, id);
      return reply.code(200).send(shapeTaskRow(detail!));
    },
  );

  // `requireAnyPermission` (not `requirePermission`) — accepts EITHER the
  // broad `edit` grant (command/logistics roles) OR the narrower `status`
  // action (field_responder, 05-05's seed). field_responder deliberately
  // does NOT hold `edit` on `tasks` (no owner-reassignment, no
  // title/description/due-date edits from the mobile UI) — only this one
  // narrow status-transition capability, matching My Tasks' one-tap
  // Start/Mark-done design (review finding B2).
  app.patch<{
    Params: { id: string };
    Body: { new_status: TaskStatus };
  }>(
    '/api/v1/tasks/:id/status',
    { preHandler: requireAnyPermission('tasks', ['edit', 'status']) },
    async (req, reply) => {
      const { id } = req.params;
      const { new_status } = req.body ?? ({} as never);

      // Jurisdiction-scope enforcement (F-01 fix, 03-SECURITY.md).
      const existing = await fetchTaskRow(query, id, req.epmpUser!.jurisdiction_scope);
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
