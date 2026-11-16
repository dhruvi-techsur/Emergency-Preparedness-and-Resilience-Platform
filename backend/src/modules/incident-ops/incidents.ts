import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';

export type IncidentType = 'Flood' | 'Wildfire' | 'Severe Weather' | 'HazMat' | 'Public Health' | 'Other';
export type Severity = 'Critical' | 'Elevated' | 'Watch' | 'Normal';
export type ActivationLevel = 'Monitoring' | 'Partial' | 'Full';
export type CommandRoleTitle =
  | 'Incident Commander'
  | 'Planning'
  | 'Logistics'
  | 'Operations'
  | 'Finance/Admin'
  | 'Public Information';

interface IncidentListRow {
  id: string;
  name: string;
  type: IncidentType;
  severity: Severity;
  jurisdiction_id: string;
  jurisdiction_name: string;
  activation_level: ActivationLevel;
  status: 'Open' | 'Closed';
  opened_at: string;
  commander_id: string | null;
  commander_name: string | null;
}

interface IncidentRow {
  id: string;
  name: string;
  type: IncidentType;
  severity: Severity;
  jurisdiction_id: string;
  description: string | null;
  activation_level: ActivationLevel;
  status: 'Open' | 'Closed';
  opened_at: string;
  closed_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface CommandRoleRow {
  role_title: CommandRoleTitle;
  person_id: string;
  person_name: string;
  assigned_at: string;
}

interface TimelineRow {
  id: string;
  occurred_at: string;
  title: string;
  meta: string | null;
  tone: 'brand' | 'success' | 'warning' | 'danger';
  actor_id: string | null;
  actor_name: string | null;
  source: string;
  detail: Record<string, unknown> | null;
}

function shapeIncidentListRow(row: IncidentListRow) {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    severity: row.severity,
    jurisdiction: { id: row.jurisdiction_id, name: row.jurisdiction_name },
    activation_level: row.activation_level,
    status: row.status,
    opened_at: row.opened_at,
    commander: row.commander_id ? { id: row.commander_id, name: row.commander_name } : null,
  };
}

async function fetchCommandRoles(incidentId: string) {
  const rows = await query<CommandRoleRow>(
    `SELECT icr.role_title, icr.person_id, u.name AS person_name, icr.assigned_at
     FROM incident_command_roles icr
     JOIN users u ON u.id = icr.person_id
     WHERE icr.incident_id = $1 AND icr.unassigned_at IS NULL
     ORDER BY icr.assigned_at`,
    [incidentId],
  );
  return rows.map((r) => ({
    role_title: r.role_title,
    person: { id: r.person_id, name: r.person_name },
    assigned_at: r.assigned_at,
  }));
}

async function fetchIncidentListShape(incidentId: string) {
  const rows = await query<IncidentListRow>(
    `SELECT i.id, i.name, i.type, i.severity, i.jurisdiction_id, j.name AS jurisdiction_name,
            i.activation_level, i.status, i.opened_at,
            icr.person_id AS commander_id, u.name AS commander_name
     FROM incidents i
     JOIN jurisdictions j ON j.id = i.jurisdiction_id
     LEFT JOIN incident_command_roles icr
       ON icr.incident_id = i.id AND icr.role_title = 'Incident Commander' AND icr.unassigned_at IS NULL
     LEFT JOIN users u ON u.id = icr.person_id
     WHERE i.id = $1`,
    [incidentId],
  );
  const row = rows[0];
  return row ? shapeIncidentListRow(row) : null;
}

export async function fetchIncidentDetailShape(incidentId: string) {
  const listShape = await fetchIncidentListShape(incidentId);
  if (!listShape) return null;

  const detailRows = await query<IncidentRow>(`SELECT * FROM incidents WHERE id = $1`, [incidentId]);
  const detail = detailRows[0];
  if (!detail) return null;

  const command_roles = await fetchCommandRoles(incidentId);

  return {
    ...listShape,
    description: detail.description ?? undefined,
    closed_at: detail.closed_at,
    command_roles,
  };
}

export const INCIDENT_NOT_FOUND = {
  error_code: 'INCIDENT_NOT_FOUND',
  message: 'This incident no longer exists or you don\u2019t have access.',
} as const;

interface JurisdictionRow {
  id: string;
  name: string;
}

export default async function incidentsRoutes(app: FastifyInstance) {
  // GET /api/v1/jurisdictions — no dedicated jurisdictions-list endpoint
  // exists anywhere in Phase 1's or 02-01/02-02's API surface (01-11's
  // UserDetail.tsx worked around the same gap by deriving jurisdiction ids
  // from already-fetched user rows). Every incident-creation flow needs a
  // real jurisdiction picker, and no other plan owns this route, so it's
  // added here, gated by the same 'incidents'/'view' permission every
  // other read route in this module uses.
  app.get(
    '/api/v1/jurisdictions',
    { preHandler: requirePermission('incidents', 'view') },
    async (_req, reply) => {
      const rows = await query<JurisdictionRow>(`SELECT id, name FROM jurisdictions ORDER BY name`);
      return reply.code(200).send({ items: rows });
    },
  );

  app.get<{
    Querystring: {
      severity?: Severity;
      activation_level?: ActivationLevel;
      jurisdiction?: string;
      status?: 'Open' | 'Closed';
      page?: string;
      page_size?: string;
    };
  }>(
    '/api/v1/incidents',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      const { severity, activation_level, jurisdiction, status } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (severity) {
        conditions.push(`i.severity = $${idx++}`);
        params.push(severity);
      }
      if (activation_level) {
        conditions.push(`i.activation_level = $${idx++}`);
        params.push(activation_level);
      }
      if (jurisdiction) {
        conditions.push(`i.jurisdiction_id = $${idx++}`);
        params.push(jurisdiction);
      }
      if (status) {
        conditions.push(`i.status = $${idx++}`);
        params.push(status);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM incidents i ${whereClause}`,
        params,
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const limitIdx = idx++;
      const offsetIdx = idx++;
      const rows = await query<IncidentListRow>(
        `SELECT i.id, i.name, i.type, i.severity, i.jurisdiction_id, j.name AS jurisdiction_name,
                i.activation_level, i.status, i.opened_at,
                icr.person_id AS commander_id, u.name AS commander_name
         FROM incidents i
         JOIN jurisdictions j ON j.id = i.jurisdiction_id
         LEFT JOIN incident_command_roles icr
           ON icr.incident_id = i.id AND icr.role_title = 'Incident Commander' AND icr.unassigned_at IS NULL
         LEFT JOIN users u ON u.id = icr.person_id
         ${whereClause}
         ORDER BY i.opened_at DESC
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        [...params, page_size, offset],
      );

      return reply.code(200).send({
        items: rows.map(shapeIncidentListRow),
        total,
        page,
        page_size,
      });
    },
  );

  app.post<{
    Body: {
      name: string;
      type: IncidentType;
      severity: Severity;
      jurisdiction_id: string;
      description?: string;
      opened_at: string;
      confirmed_duplicate?: boolean;
    };
  }>(
    '/api/v1/incidents',
    { preHandler: requirePermission('incidents', 'create') },
    async (req, reply) => {
      const { name, type, severity, jurisdiction_id, description, opened_at, confirmed_duplicate } =
        req.body ?? ({} as never);

      // Possible-duplicate check — FRD F1 Validation: "warn, not block, if a
      // similar name exists within 24 hours". The candidate's id/opened_at
      // ride in `details` so the client can show/compare before resubmitting
      // with confirmed_duplicate:true.
      const duplicateRows = await query<{ id: string; name: string; opened_at: string }>(
        `SELECT id, name, opened_at FROM incidents
         WHERE jurisdiction_id = $1 AND name = $2 AND opened_at > now() - interval '24 hours' AND status = 'Open'`,
        [jurisdiction_id, name],
      );
      const duplicate = duplicateRows[0];
      if (duplicate && confirmed_duplicate !== true) {
        return reply.code(409).send({
          error_code: 'INCIDENT_POSSIBLE_DUPLICATE',
          message: `An incident named '${name}' was opened in the last 24 hours. Confirm this is a new incident.`,
          details: { id: duplicate.id, opened_at: duplicate.opened_at },
        });
      }

      try {
        const incident = await withTimelineTransaction(async (client) => {
          const insertedRows = await client.query<IncidentRow>(
            `INSERT INTO incidents (name, type, severity, jurisdiction_id, description, opened_at, created_by)
             VALUES ($1,$2,$3,$4,$5,$6,$7)
             RETURNING *`,
            [name, type, severity, jurisdiction_id, description ?? null, opened_at, req.epmpUser!.id],
          );
          const created = insertedRows.rows[0];

          await TimelineService.append(
            client,
            created.id,
            'Incident created',
            undefined,
            'brand',
            req.epmpUser!.id,
            'EPMP',
          );

          return created;
        });

        const detailShape = await fetchIncidentDetailShape(incident.id);
        return reply.code(201).send(detailShape);
      } catch (err) {
        req.log.error(err, 'Incident creation transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );

  app.get<{ Params: { id: string } }>(
    '/api/v1/incidents/:id',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      const detail = await fetchIncidentDetailShape(req.params.id);
      if (!detail) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }
      return reply.code(200).send(detail);
    },
  );

  // Generic metadata edit only (name/type/description). severity/
  // activation_level/status have their own dedicated endpoints in later
  // 02-* plans — kept out of this PATCH to avoid bypassing their own
  // validation rules (NO_COMMANDER_ASSIGNED, closure confirmation, etc).
  // Per FRD's Validation list, only "create, reassign, activation change,
  // closure" are state-changing actions requiring a Timeline entry — a
  // plain metadata edit does not write one.
  app.patch<{
    Params: { id: string };
    Body: { name?: string; type?: IncidentType; description?: string };
  }>(
    '/api/v1/incidents/:id',
    { preHandler: requirePermission('incidents', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { name, type, description } = req.body ?? ({} as never);

      const existingRows = await query<IncidentRow>(`SELECT * FROM incidents WHERE id = $1`, [id]);
      if (!existingRows[0]) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }

      const updates: string[] = [];
      const params: unknown[] = [];
      let idx = 1;
      if (name !== undefined) {
        updates.push(`name = $${idx++}`);
        params.push(name);
      }
      if (type !== undefined) {
        updates.push(`type = $${idx++}`);
        params.push(type);
      }
      if (description !== undefined) {
        updates.push(`description = $${idx++}`);
        params.push(description);
      }
      updates.push(`updated_at = now()`);

      params.push(id);
      await query(`UPDATE incidents SET ${updates.join(', ')} WHERE id = $${idx}`, params);

      const detail = await fetchIncidentDetailShape(id);
      return reply.code(200).send(detail);
    },
  );

  app.get<{
    Params: { id: string };
    Querystring: { page?: string; page_size?: string };
  }>(
    '/api/v1/incidents/:id/timeline',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      const { id } = req.params;

      const incidentRows = await query<{ id: string }>(`SELECT id FROM incidents WHERE id = $1`, [id]);
      if (!incidentRows[0]) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }

      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM incident_timeline WHERE incident_id = $1`,
        [id],
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const rows = await query<TimelineRow>(
        `SELECT t.id, t.occurred_at, t.title, t.meta, t.tone, t.actor_id, u.name AS actor_name, t.source, t.detail
         FROM incident_timeline t
         LEFT JOIN users u ON u.id = t.actor_id
         WHERE t.incident_id = $1
         ORDER BY t.occurred_at DESC
         LIMIT $2 OFFSET $3`,
        [id, page_size, offset],
      );

      const items = rows.map((r) => ({
        id: r.id,
        occurred_at: r.occurred_at,
        title: r.title,
        meta: r.meta ?? undefined,
        tone: r.tone,
        actor: r.actor_id ? { id: r.actor_id, name: r.actor_name } : null,
        source: r.source,
        detail: r.detail ?? undefined,
      }));

      return reply.code(200).send({ items, total, page, page_size });
    },
  );
}
