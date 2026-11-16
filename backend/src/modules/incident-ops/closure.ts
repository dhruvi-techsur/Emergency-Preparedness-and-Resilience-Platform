import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';
import { fetchIncidentDetailShape, INCIDENT_NOT_FOUND } from './incidents.js';

interface ClosedIncidentRow {
  id: string;
}

/**
 * Mounts POST /api/v1/incidents/{id}/closure.
 *
 * Reuses the same structural confirmation-gate error code
 * (ACTIVATION_CONFIRMATION_REQUIRED) that activation.ts uses — this is
 * EPMP's general "destructive-action confirmation" convention (any
 * state-changing action gated by a Modal must also be gated server-side
 * by confirmed:true), not an activation-specific rule. A future plan
 * introducing a third confirmed-gated action should reuse the same code
 * rather than inventing a per-action variant.
 */
export default async function closureRoutes(app: FastifyInstance) {
  app.post<{
    Params: { id: string };
    Body: { confirmed?: boolean };
  }>(
    '/api/v1/incidents/:id/closure',
    { preHandler: requirePermission('incidents', 'edit') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { confirmed } = req.body ?? ({} as never);

      if (confirmed !== true) {
        return reply.code(400).send({
          error_code: 'ACTIVATION_CONFIRMATION_REQUIRED',
          message: 'Confirm the activation-level change before it takes effect.',
        });
      }

      try {
        const closed = await withTimelineTransaction(async (client) => {
          // 1. Close the incident — only if currently Open. If no row
          // updated, it's either already closed or doesn't exist.
          const updatedRows = await client.query<ClosedIncidentRow>(
            `UPDATE incidents SET status = 'Closed', closed_at = now(), updated_at = now()
             WHERE id = $1 AND status = 'Open'
             RETURNING id`,
            [incidentId],
          );
          const updated = updatedRows.rows[0];

          if (!updated) {
            throw Object.assign(new Error('Incident not closable'), { code: 'NOT_CLOSABLE' });
          }

          // 2. Cascade open tasks to Overdue. Phase 2 has no `tasks` table
          // yet (F4 ships in Phase 3) — this query is written
          // forward-compatibly against a table that may not exist. A
          // "relation does not exist" error is treated as "0 tasks
          // cascaded", not a failure. A SAVEPOINT wraps this specific
          // statement because Postgres aborts the ENTIRE transaction on
          // any error inside it — without the savepoint, the subsequent
          // Timeline write (and the whole closure) would fail even though
          // only this forward-compatible, expected-to-fail-today query
          // errored. KNOWN SIMPLIFICATION (threat T-02-06, owned by Phase
          // 3's task-schema plan): this matches on the error MESSAGE
          // string rather than Postgres error code 42P01, so once `tasks`
          // exists a genuinely different SQL error whose message happens
          // to contain this substring could be masked. Phase 3 must
          // narrow this to checking `err.code === '42P01'` specifically.
          await client.query(`SAVEPOINT tasks_cascade`);
          try {
            await client.query(
              `UPDATE tasks SET status = 'Overdue', updated_at = now()
               WHERE incident_id = $1 AND status NOT IN ('Done','Overdue')
               RETURNING id`,
              [incidentId],
            );
            await client.query(`RELEASE SAVEPOINT tasks_cascade`);
          } catch (taskErr) {
            const message = taskErr instanceof Error ? taskErr.message : String(taskErr);
            if (!/relation "tasks" does not exist/.test(message)) {
              throw taskErr;
            }
            // tasks table doesn't exist yet in Phase 2 — forward-compatible
            // no-op. Roll back to the savepoint so the aborted statement
            // doesn't poison the rest of this transaction.
            await client.query(`ROLLBACK TO SAVEPOINT tasks_cascade`);
          }

          // 3. Timeline entry for the closure itself.
          await TimelineService.append(
            client,
            incidentId,
            'Incident closed',
            undefined,
            'brand',
            req.epmpUser!.id,
            'EPMP',
          );

          return updated;
        });

        const detail = await fetchIncidentDetailShape(closed.id);
        return reply.code(200).send(detail);
      } catch (err: unknown) {
        if (err instanceof Error && (err as { code?: string }).code === 'NOT_CLOSABLE') {
          const detail = await fetchIncidentDetailShape(incidentId);
          if (!detail) {
            return reply.code(404).send(INCIDENT_NOT_FOUND);
          }
          return reply.code(409).send({
            error_code: 'INCIDENT_ALREADY_CLOSED',
            message: 'This incident is already closed.',
          });
        }
        req.log.error(err, 'Incident closure transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
