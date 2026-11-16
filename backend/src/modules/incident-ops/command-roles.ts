import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';

type CommandRoleTitle =
  | 'Incident Commander'
  | 'Planning'
  | 'Logistics'
  | 'Operations'
  | 'Finance/Admin'
  | 'Public Information';

interface ActiveRoleRow {
  id: string;
  person_id: string;
}

interface PersonRow {
  id: string;
  name: string;
}

interface InsertedRoleRow {
  id: string;
  incident_id: string;
  role_title: CommandRoleTitle;
  person_id: string;
  assigned_at: string;
  assigned_by: string;
  unassigned_at: string | null;
}

/**
 * Mounts POST /api/v1/incidents/{id}/command-roles — assignment and
 * reassignment of a named ICS command role, per FRD F1's "named-person
 * accountability" requirement and TechArch 03b's
 * `IncidentDetail['command_roles'][0]` response shape.
 */
export default async function commandRolesRoutes(app: FastifyInstance) {
  app.post<{
    Params: { id: string };
    Body: { role_title: CommandRoleTitle; person_id: string };
  }>(
    '/api/v1/incidents/:id/command-roles',
    { preHandler: requirePermission('incidents', 'edit') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { role_title, person_id } = req.body ?? ({} as never);

      try {
        const result = await withTimelineTransaction(async (client) => {
          // 1. Lock any existing active assignment for this role on this
          // incident — FOR UPDATE prevents a race where two concurrent
          // reassignment requests could both believe they're "first" and
          // create two simultaneously-active rows for the same role
          // (threat T-02-05).
          const activeRows = await client.query<ActiveRoleRow>(
            `SELECT id, person_id FROM incident_command_roles
             WHERE incident_id = $1 AND role_title = $2 AND unassigned_at IS NULL
             FOR UPDATE`,
            [incidentId, role_title],
          );
          const existing = activeRows.rows[0];

          // Fetch the incoming person's name up front — the Timeline title
          // must be human-readable ("Incident Commander assigned to Jane
          // Doe"), not just an id.
          const personRows = await client.query<PersonRow>(`SELECT id, name FROM users WHERE id = $1`, [
            person_id,
          ]);
          const person = personRows.rows[0];
          if (!person) {
            throw Object.assign(new Error('Person not found'), { code: 'PERSON_NOT_FOUND' });
          }

          let priorName: string | undefined;

          if (existing && existing.person_id === person_id) {
            // 3. Idempotent re-assignment of the same person — no-op, not an
            // error and not a duplicate Timeline entry.
            const currentRows = await client.query<InsertedRoleRow>(
              `SELECT id, incident_id, role_title, person_id, assigned_at, assigned_by, unassigned_at
               FROM incident_command_roles WHERE id = $1`,
              [existing.id],
            );
            return { row: currentRows.rows[0], person, priorName: undefined, wroteTimeline: false };
          }

          if (existing) {
            // 2. Reassignment — the prior row becomes historical, never
            // deleted, per the FRD's named-person-accountability requirement
            // needing a durable assignment history.
            const priorRows = await client.query<PersonRow>(`SELECT id, name FROM users WHERE id = $1`, [
              existing.person_id,
            ]);
            priorName = priorRows.rows[0]?.name;

            await client.query(`UPDATE incident_command_roles SET unassigned_at = now() WHERE id = $1`, [
              existing.id,
            ]);
          }

          // 4. Insert the new active assignment (first-time or post-reassignment).
          const insertedRows = await client.query<InsertedRoleRow>(
            `INSERT INTO incident_command_roles (incident_id, role_title, person_id, assigned_by)
             VALUES ($1,$2,$3,$4)
             RETURNING id, incident_id, role_title, person_id, assigned_at, assigned_by, unassigned_at`,
            [incidentId, role_title, person_id, req.epmpUser!.id],
          );
          const inserted = insertedRows.rows[0];

          // 5. Timeline entry — title is the same wording whether this is a
          // first-time assignment or a reassignment; `meta` carries the
          // "Reassigned from [prior name]" context when applicable.
          const title = `${role_title} assigned to ${person.name}`;
          const meta = priorName ? `Reassigned from ${priorName}` : undefined;
          await TimelineService.append(
            client,
            incidentId,
            title,
            meta,
            'brand',
            req.epmpUser!.id,
            'EPMP',
            { role_title, person_id, prior_person_id: existing?.person_id ?? undefined },
          );

          return { row: inserted, person, priorName, wroteTimeline: true };
        });

        const { row, person } = result;
        return reply.code(201).send({
          role_title: row.role_title,
          person: { id: row.person_id, name: person.name },
          assigned_at: row.assigned_at,
        });
      } catch (err: unknown) {
        if (err instanceof Error && (err as { code?: string }).code === 'PERSON_NOT_FOUND') {
          return reply.code(404).send({
            error_code: 'RECORD_NOT_FOUND',
            message: "This item no longer exists or you don't have access.",
          });
        }
        req.log.error(err, 'Command-role assignment transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
