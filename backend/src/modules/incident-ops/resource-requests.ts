import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';
import { publishEvent } from '../integration-gateway/nats-client.js';
import { RECORD_NOT_FOUND } from './tasks.js';

export type ResourceRequestStatus = 'Draft' | 'Awaiting approval' | 'Approved' | 'Fulfilled' | 'Declined';
export type ResourceType = 'Personnel' | 'Equipment' | 'Supplies';

interface ResourceRequestRow {
  id: string;
  resource_type: ResourceType;
  description: string;
  quantity: number;
  status: ResourceRequestStatus;
  incident_id: string;
  task_id: string | null;
  requesting_role: string;
  needed_by: string;
  requested_by_id: string;
  requested_by_name: string;
  decline_reason: string | null;
  assigned_to: string | null;
}

function shapeResourceRequestRow(row: ResourceRequestRow) {
  return {
    id: row.id,
    resource_type: row.resource_type,
    description: row.description,
    quantity: row.quantity,
    status: row.status,
    incident_id: row.incident_id,
    task_id: row.task_id ?? undefined,
    requesting_role: row.requesting_role,
    needed_by: row.needed_by,
    requested_by: { id: row.requested_by_id, name: row.requested_by_name },
    decline_reason: row.decline_reason ?? undefined,
    assigned_to: row.assigned_to ?? undefined,
  };
}

async function fetchResourceRequestRow(
  client: { query: typeof query } | typeof query,
  id: string,
): Promise<ResourceRequestRow | null> {
  const runner = typeof client === 'function' ? client : (client as { query: typeof query }).query;
  const rows = await runner<ResourceRequestRow>(
    `SELECT r.id, r.resource_type, r.description, r.quantity, r.status, r.incident_id, r.task_id,
            r.requesting_role, r.needed_by, r.requested_by AS requested_by_id, u.name AS requested_by_name,
            r.decline_reason, r.assigned_to
     FROM resource_requests r
     JOIN users u ON u.id = r.requested_by
     WHERE r.id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

// Never blocks the HTTP response on an event-bus outage — same
// fire-and-forget pattern 01-09 established for user.login (see
// nats-client.ts's publishEvent docstring: throws if NATS isn't
// connected, callers that must not block on event-bus outages catch and
// log rather than propagate).
function publishResourceRequestStatusChanged(
  req: { log?: { warn: (err: unknown, msg: string) => void } },
  payload: { id: string; status: ResourceRequestStatus; incident_id: string },
): void {
  publishEvent('resource_request.status_changed', payload).catch((err) => {
    req.log?.warn(err, 'resource_request.status_changed publish failed');
  });
}

export default async function resourceRequestRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: {
      status?: ResourceRequestStatus;
      type?: ResourceType;
      incident?: string;
      page?: string;
      page_size?: string;
    };
  }>(
    '/api/v1/resource-requests',
    { preHandler: requirePermission('resource_requests', 'view') },
    async (req, reply) => {
      const { status, type, incident } = req.query;
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10) || 1);
      const page_size = Math.max(1, parseInt(req.query.page_size ?? '25', 10) || 25);
      const offset = (page - 1) * page_size;

      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (status) {
        conditions.push(`r.status = $${idx++}`);
        params.push(status);
      }
      if (type) {
        conditions.push(`r.resource_type = $${idx++}`);
        params.push(type);
      }
      if (incident) {
        conditions.push(`r.incident_id = $${idx++}`);
        params.push(incident);
      }

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM resource_requests r ${whereClause}`,
        params,
      );
      const total = parseInt(countRows[0]?.count ?? '0', 10);

      const limitIdx = idx++;
      const offsetIdx = idx++;
      const rows = await query<ResourceRequestRow>(
        `SELECT r.id, r.resource_type, r.description, r.quantity, r.status, r.incident_id, r.task_id,
                r.requesting_role, r.needed_by, r.requested_by AS requested_by_id, u.name AS requested_by_name,
                r.decline_reason, r.assigned_to
         FROM resource_requests r
         JOIN users u ON u.id = r.requested_by
         ${whereClause}
         ORDER BY r.created_at DESC
         LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
        [...params, page_size, offset],
      );

      return reply.code(200).send({
        items: rows.map(shapeResourceRequestRow),
        total,
        page,
        page_size,
      });
    },
  );

  app.post<{
    Body: {
      resource_type: ResourceType;
      description: string;
      quantity: number;
      incident_id: string;
      task_id?: string;
      needed_by: string;
      requesting_role: string;
      save_as_draft?: boolean;
    };
  }>(
    '/api/v1/resource-requests',
    { preHandler: requirePermission('resource_requests', 'create') },
    async (req, reply) => {
      const {
        resource_type,
        description,
        quantity,
        incident_id,
        task_id,
        needed_by,
        requesting_role,
        save_as_draft,
      } = req.body ?? ({} as never);

      // Clean 422 before hitting the DB CHECK constraint — the FRD's
      // Validation section requires "quantity must be a positive integer",
      // and the chk constraint only fires on write (worse error surface).
      if (!Number.isInteger(quantity) || quantity < 1) {
        return reply.code(422).send({
          error_code: 'RESOURCE_REQUEST_QUANTITY_INVALID',
          message: 'Quantity must be at least 1.',
        });
      }

      try {
        const result = await withTimelineTransaction(async (client) => {
          const insertedRows = await client.query<{ id: string }>(
            `INSERT INTO resource_requests
               (resource_type, description, quantity, incident_id, task_id, requesting_role, needed_by, requested_by, status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'Draft')
             RETURNING id`,
            [
              resource_type,
              description,
              quantity,
              incident_id,
              task_id ?? null,
              requesting_role,
              needed_by,
              req.epmpUser!.id,
            ],
          );
          const id = insertedRows.rows[0].id;

          await client.query(
            `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
             VALUES ($1, NULL, 'Draft', $2)`,
            [id, req.epmpUser!.id],
          );

          // Per the UX mockup's Create/Edit Resource Request form, submitting
          // the form immediately moves Draft -> Awaiting approval in one
          // step (no separate "save as draft" action shown in the mockup).
          // save_as_draft:true is a reasonable extension for the rare case
          // a caller wants to persist without submitting, since the
          // schema's Draft status needs SOME path to be reachable as a
          // resting state, not just a transient one-tick value.
          let finalStatus: ResourceRequestStatus = 'Draft';
          if (save_as_draft !== true) {
            await client.query(`UPDATE resource_requests SET status='Awaiting approval', updated_at=now() WHERE id=$1`, [
              id,
            ]);
            await client.query(
              `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
               VALUES ($1, 'Draft', 'Awaiting approval', $2)`,
              [id, req.epmpUser!.id],
            );
            finalStatus = 'Awaiting approval';
          }

          await TimelineService.append(
            client,
            incident_id,
            `Resource request: ${resource_type} (${description})`,
            undefined,
            'brand',
            req.epmpUser!.id,
            'EPMP',
            { resource_request_id: id, quantity },
          );

          return { id, finalStatus };
        });

        const detail = await fetchResourceRequestRow(query, result.id);
        publishResourceRequestStatusChanged(req, {
          id: result.id,
          status: result.finalStatus,
          incident_id,
        });
        return reply.code(201).send(shapeResourceRequestRow(detail!));
      } catch (err) {
        req.log.error(err, 'Resource request creation transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/v1/resource-requests/:id/approve',
    { preHandler: requirePermission('resource_requests', 'approve') },
    async (req, reply) => {
      const { id } = req.params;
      const existing = await fetchResourceRequestRow(query, id);
      if (!existing) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }
      if (existing.status !== 'Awaiting approval') {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: `This request can't move to Approved from its current state.`,
        });
      }

      try {
        await withTimelineTransaction(async (client) => {
          await client.query(
            `UPDATE resource_requests SET status='Approved', approved_by=$1, updated_at=now() WHERE id=$2`,
            [req.epmpUser!.id, id],
          );
          await client.query(
            `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
             VALUES ($1,$2,'Approved',$3)`,
            [id, existing.status, req.epmpUser!.id],
          );
          await TimelineService.append(
            client,
            existing.incident_id,
            `Resource request approved: ${existing.resource_type} (${existing.description})`,
            undefined,
            'success',
            req.epmpUser!.id,
            'EPMP',
            { resource_request_id: id },
          );
        });

        publishResourceRequestStatusChanged(req, {
          id,
          status: 'Approved',
          incident_id: existing.incident_id,
        });

        const detail = await fetchResourceRequestRow(query, id);
        return reply.code(200).send(shapeResourceRequestRow(detail!));
      } catch (err) {
        req.log.error(err, 'Resource request approve transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );

  // Declining is itself an approval-adjacent decision requiring the same
  // permission level as approving ('approve' action), not a lesser 'edit'.
  app.post<{ Params: { id: string }; Body: { reason?: string } }>(
    '/api/v1/resource-requests/:id/decline',
    { preHandler: requirePermission('resource_requests', 'approve') },
    async (req, reply) => {
      const { id } = req.params;
      const { reason } = req.body ?? ({} as never);

      if (!reason || reason.trim().length === 0) {
        return reply.code(422).send({
          error_code: 'DECLINE_REASON_REQUIRED',
          message: 'State why this request is declined.',
        });
      }

      const existing = await fetchResourceRequestRow(query, id);
      if (!existing) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }
      if (existing.status !== 'Awaiting approval') {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: `This request can't move to Declined from its current state.`,
        });
      }

      try {
        await withTimelineTransaction(async (client) => {
          // The chk_decline_requires_reason DB constraint (03-01's
          // migration) is the structural backstop here — same
          // defense-in-depth pattern as 03-03's self-approval gate. This
          // application-layer check above runs first so the error surface
          // is a clean 422, not a raw constraint-violation 500.
          await client.query(
            `UPDATE resource_requests SET status='Declined', decline_reason=$1, updated_at=now() WHERE id=$2`,
            [reason, id],
          );
          await client.query(
            `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
             VALUES ($1,$2,'Declined',$3)`,
            [id, existing.status, req.epmpUser!.id],
          );
          await TimelineService.append(
            client,
            existing.incident_id,
            `Resource request declined: ${existing.resource_type} (${existing.description}) — ${reason}`,
            undefined,
            'danger',
            req.epmpUser!.id,
            'EPMP',
            { resource_request_id: id, reason },
          );
        });

        publishResourceRequestStatusChanged(req, {
          id,
          status: 'Declined',
          incident_id: existing.incident_id,
        });

        const detail = await fetchResourceRequestRow(query, id);
        return reply.code(200).send(shapeResourceRequestRow(detail!));
      } catch (err) {
        req.log.error(err, 'Resource request decline transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );

  // Two-phase per the UX mockup's "Mark fulfilled action becomes
  // available... only available once assigned": the schema has no
  // separate "Assigned" status value (only Draft/Awaiting
  // approval/Approved/Fulfilled/Declined), so "Assigned" is a SUB-STATE
  // of Approved distinguished by assigned_to IS NOT NULL, not a distinct
  // enum value. The first call to this endpoint (assigned_to not yet set
  // on the row) ASSIGNS ONLY — no status change, no status-history row,
  // since assignment is metadata, not a status transition. The second
  // call (assigned_to already set) FULFILLS — status -> Fulfilled,
  // status-history + Timeline + event publish.
  app.post<{ Params: { id: string }; Body: { assigned_to?: string } }>(
    '/api/v1/resource-requests/:id/fulfill',
    { preHandler: requirePermission('resource_requests', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      const { assigned_to } = req.body ?? ({} as never);

      const existing = await fetchResourceRequestRow(query, id);
      if (!existing) {
        return reply.code(404).send(RECORD_NOT_FOUND);
      }
      if (existing.status !== 'Approved') {
        return reply.code(409).send({
          error_code: 'INVALID_STATUS_TRANSITION',
          message: `This request can't move to Fulfilled from its current state.`,
        });
      }

      const isFirstAssignCall = !existing.assigned_to;

      if (isFirstAssignCall) {
        // Assign-only: no status transition, no status-history row, no
        // Timeline entry, no event publish — assignment is metadata.
        await query(`UPDATE resource_requests SET assigned_to=$1, updated_at=now() WHERE id=$2`, [
          assigned_to ?? null,
          id,
        ]);

        const detail = await fetchResourceRequestRow(query, id);
        return reply.code(200).send(shapeResourceRequestRow(detail!));
      }

      // Second call: a true fulfill. assigned_to may be re-supplied
      // (same value) or omitted; the existing assignment is kept either
      // way since this call's job is the Approved -> Fulfilled transition.
      try {
        await withTimelineTransaction(async (client) => {
          if (assigned_to) {
            await client.query(`UPDATE resource_requests SET assigned_to=$1 WHERE id=$2`, [assigned_to, id]);
          }
          await client.query(
            `UPDATE resource_requests SET status='Fulfilled', fulfilled_at=now(), updated_at=now() WHERE id=$1`,
            [id],
          );
          await client.query(
            `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
             VALUES ($1,$2,'Fulfilled',$3)`,
            [id, existing.status, req.epmpUser!.id],
          );
          await TimelineService.append(
            client,
            existing.incident_id,
            `Resource request fulfilled: ${existing.resource_type} (${existing.description})`,
            undefined,
            'success',
            req.epmpUser!.id,
            'EPMP',
            { resource_request_id: id, assigned_to: assigned_to ?? existing.assigned_to },
          );
        });

        publishResourceRequestStatusChanged(req, {
          id,
          status: 'Fulfilled',
          incident_id: existing.incident_id,
        });

        const detail = await fetchResourceRequestRow(query, id);
        return reply.code(200).send(shapeResourceRequestRow(detail!));
      } catch (err) {
        req.log.error(err, 'Resource request fulfill transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
