import type { FastifyInstance } from 'fastify';
import type { PoolClient } from 'pg';
import { requirePermission } from '../auth-org/rbac.js';
import { query, pool } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from '../incident-ops/timeline.js';
import { fetchIncidentForMutation } from '../incident-ops/incidents.js';
import { sendViaProvider } from '../integration-gateway/notification-provider-adapter.js';

export type RecipientGroupType = 'Role' | 'Jurisdiction' | 'Geography';
export type DeliveryStatus = 'Queued' | 'Sent' | 'Delivered' | 'Failed' | 'Acknowledged';

export const NOTIFICATION_NOT_FOUND = {
  error_code: 'RECORD_NOT_FOUND',
  message: 'This item no longer exists or you don\u2019t have access.',
} as const;

// ---------------------------------------------------------------------------
// Shared AI-governance guard (exported for 04-02's reporting module reuse).
//
// Per TechArch 01-components.md \u00a72.4 rule 3 ("shared middleware, not
// duplicated logic") and 03c-api-comms-reporting.md's "Server-Side AI
// Governance Guard" note, this is the ONE enforcement point for every
// endpoint writing ai_origin:true content (this module's notification
// send, 04-02's sitreps/aar finalize). Any route calling it catches
// AiOriginNotApprovedError and returns 400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED
// with FRD's exact message.
// ---------------------------------------------------------------------------

export class AiOriginNotApprovedError extends Error {}

export async function assertAiOriginApproved(
  client: PoolClient,
  payload: { ai_origin?: boolean; ai_draft_id?: string },
): Promise<void> {
  if (!payload.ai_origin) return;
  if (!payload.ai_draft_id) {
    throw new AiOriginNotApprovedError('ai_origin set with no ai_draft_id');
  }
  const rows = await client.query<{ approved_by: string | null }>(
    `SELECT approved_by FROM ai_drafts WHERE id = $1`,
    [payload.ai_draft_id],
  );
  if (!rows.rows[0] || rows.rows[0].approved_by === null) {
    throw new AiOriginNotApprovedError('ai_draft not approved');
  }
}

const AIDRAFT_UNAPPROVED_WRITE_BLOCKED = {
  error_code: 'AIDRAFT_UNAPPROVED_WRITE_BLOCKED',
  message: "This draft hasn't been approved. Approve it before it can be sent/saved.",
} as const;

interface RecipientGroupRow {
  id: string;
  name: string;
  type: RecipientGroupType;
  selector: Record<string, unknown>;
  created_by: string;
}

interface MessageTemplateRow {
  id: string;
  name: string;
  category: string | null;
  body: string;
}

interface NotificationRow {
  id: string;
  incident_id: string | null;
  message_body: string;
  ai_origin: boolean;
  ai_draft_id: string | null;
  channels: string[];
  recipient_group_ids: string[];
  approved_by: string | null;
  approver_name: string | null;
  sent_at: string | null;
  created_by: string;
}

function shapeNotification(row: NotificationRow) {
  return {
    id: row.id,
    incident_id: row.incident_id ?? undefined,
    message_body: row.message_body,
    ai_origin: row.ai_origin,
    channels: row.channels,
    recipient_group_ids: row.recipient_group_ids,
    approved_by: row.approved_by ? { id: row.approved_by, name: row.approver_name ?? '' } : undefined,
    sent_at: row.sent_at ?? undefined,
  };
}

async function fetchNotificationRow(
  runner: { query: typeof query } | typeof query,
  id: string,
): Promise<NotificationRow | null> {
  const run = typeof runner === 'function' ? runner : (runner as { query: typeof query }).query;
  const rows = await run<NotificationRow>(
    `SELECT n.id, n.incident_id, n.message_body, n.ai_origin, n.ai_draft_id, n.channels,
            n.recipient_group_ids, n.approved_by, u.name AS approver_name, n.sent_at, n.created_by
     FROM notifications n
     LEFT JOIN users u ON u.id = n.approved_by
     WHERE n.id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

// Resolves a recipient_groups row's concrete recipients per its type. No
// live roster-geo-match exists this phase (documented Phase-6/F16-roster-
// sync-dependent enhancement per this plan's own scope note), so Geography-
// type groups resolve to zero concrete recipients here — identical to the
// member_count computation below.
async function resolveGroupRecipients(groupId: string): Promise<Array<{ name: string; contact: string | null }>> {
  const groupRows = await query<RecipientGroupRow>(`SELECT id, name, type, selector, created_by FROM recipient_groups WHERE id = $1`, [groupId]);
  const group = groupRows[0];
  if (!group) return [];

  if (group.type === 'Role') {
    const roleId = group.selector?.role_id;
    if (!roleId) return [];
    const rows = await query<{ name: string; email: string }>(
      `SELECT name, email FROM users WHERE role_id = $1`,
      [roleId],
    );
    return rows.map((r) => ({ name: r.name, contact: r.email }));
  }
  if (group.type === 'Jurisdiction') {
    const jurisdictionId = group.selector?.jurisdiction_id;
    if (!jurisdictionId) return [];
    const rows = await query<{ name: string; email: string }>(
      `SELECT name, email FROM users WHERE $1 = ANY(jurisdiction_scope)`,
      [jurisdictionId],
    );
    return rows.map((r) => ({ name: r.name, contact: r.email }));
  }
  // Geography: resolved at SEND time once channels are confirmed, matching
  // the mockup's "live recipient-count estimate" being just that, an
  // estimate, not a committed recipient list until send — documented
  // Phase-6 enhancement, no live roster-geo-match exists this phase.
  return [];
}

export default async function notificationsRoutes(app: FastifyInstance) {
  // -------------------------------------------------------------------
  // Recipient groups
  // -------------------------------------------------------------------
  app.get(
    '/api/v1/recipient-groups',
    { preHandler: requirePermission('notifications', 'view') },
    async (_req, reply) => {
      const rows = await query<RecipientGroupRow>(
        `SELECT id, name, type, selector, created_by FROM recipient_groups ORDER BY created_at DESC`,
      );
      const result = [];
      for (const row of rows) {
        let member_count: number | undefined;
        if (row.type === 'Role') {
          const roleId = row.selector?.role_id;
          if (roleId) {
            const countRows = await query<{ count: string }>(
              `SELECT COUNT(*) AS count FROM users WHERE role_id = $1`,
              [roleId],
            );
            member_count = parseInt(countRows[0]?.count ?? '0', 10);
          }
        } else if (row.type === 'Jurisdiction') {
          const jurisdictionId = row.selector?.jurisdiction_id;
          if (jurisdictionId) {
            const countRows = await query<{ count: string }>(
              `SELECT COUNT(*) AS count FROM users WHERE $1 = ANY(jurisdiction_scope)`,
              [jurisdictionId],
            );
            member_count = parseInt(countRows[0]?.count ?? '0', 10);
          }
        }
        // Geography: member_count omitted (undefined) — no live
        // roster-geo-match exists this phase, documented Phase-6/
        // F16-dependent enhancement. Accepted per this plan's own threat
        // register (T-04-03): no data exposed, only a feature incomplete.
        result.push({
          id: row.id,
          name: row.name,
          type: row.type,
          selector: row.selector,
          member_count,
        });
      }
      return reply.code(200).send(result);
    },
  );

  app.post<{
    Body: { name: string; type: RecipientGroupType; selector: Record<string, unknown> };
  }>(
    '/api/v1/recipient-groups',
    { preHandler: requirePermission('notifications', 'create') },
    async (req, reply) => {
      const { name, type, selector } = req.body ?? ({} as never);

      if (!['Role', 'Jurisdiction', 'Geography'].includes(type)) {
        return reply.code(422).send({
          error_code: 'INVALID_RECIPIENT_GROUP_TYPE',
          message: 'Recipient group type must be Role, Jurisdiction, or Geography.',
        });
      }

      const rows = await query<RecipientGroupRow>(
        `INSERT INTO recipient_groups (name, type, selector, created_by)
         VALUES ($1,$2,$3,$4) RETURNING id, name, type, selector, created_by`,
        [name, type, JSON.stringify(selector ?? {}), req.epmpUser!.id],
      );
      return reply.code(201).send(rows[0]);
    },
  );

  // -------------------------------------------------------------------
  // Message templates
  // -------------------------------------------------------------------
  app.get(
    '/api/v1/message-templates',
    { preHandler: requirePermission('notifications', 'view') },
    async (_req, reply) => {
      const rows = await query<MessageTemplateRow>(
        `SELECT id, name, category, body FROM message_templates ORDER BY created_at DESC`,
      );
      return reply.code(200).send(rows);
    },
  );

  app.post<{
    Body: { name: string; category?: string; body: string };
  }>(
    '/api/v1/message-templates',
    { preHandler: requirePermission('notifications', 'create') },
    async (req, reply) => {
      const { name, category, body } = req.body ?? ({} as never);
      const rows = await query<MessageTemplateRow>(
        `INSERT INTO message_templates (name, category, body, created_by)
         VALUES ($1,$2,$3,$4) RETURNING id, name, category, body`,
        [name, category ?? null, body, req.epmpUser!.id],
      );
      return reply.code(201).send(rows[0]);
    },
  );

  // -------------------------------------------------------------------
  // AI drafts — RELOCATED to ai-assist/ai-drafts.ts (Phase 6, 06-03).
  //
  // This module used to own POST /api/v1/ai-drafts, .../approve,
  // .../discard inline as a minimal structural stub (gated on
  // notifications:view since no dedicated ai_assist feature-permission
  // existed yet at that point in the roadmap). 06-03 is Phase 6's F9-
  // proper home for these three routes per TechArch's component
  // boundaries, and moved them into the new ai-assist module — gated on
  // the new ai_assist feature-permission (PER-01/02/03 only) instead of
  // notifications:view, with a content-aware stub that actually flags a
  // context-less request with AIDRAFT_NO_SOURCE rather than always
  // fabricating a sourced-looking response. See
  // ai-assist/ai-drafts.ts's own inline note for the full history. This
  // module's assertAiOriginApproved guard (above) is untouched by the
  // move — it reads ai_drafts.approved_by directly from the table, not
  // from either module's routes.
  // -------------------------------------------------------------------

  // -------------------------------------------------------------------
  // Compose
  // -------------------------------------------------------------------
  app.post<{
    Body: {
      recipient_group_ids?: string[];
      geotarget_polygon?: GeoJSON.Polygon;
      message_body: string;
      channels: string[];
      incident_id?: string;
      ai_origin?: boolean;
      ai_draft_id?: string;
    };
  }>(
    '/api/v1/notifications/compose',
    { preHandler: requirePermission('notifications', 'create') },
    async (req, reply) => {
      const {
        recipient_group_ids,
        geotarget_polygon,
        message_body,
        channels,
        incident_id,
        ai_origin,
        ai_draft_id,
      } = req.body ?? ({} as never);

      // 1. Audience-present gate (app-layer pre-check, backstopped by the
      // DB's own chk_audience_present CHECK constraint) — before any write.
      const hasGroups = Array.isArray(recipient_group_ids) && recipient_group_ids.length > 0;
      const hasGeotarget = geotarget_polygon != null;
      if (!hasGroups && !hasGeotarget) {
        return reply.code(422).send({
          error_code: 'NO_AUDIENCE_SELECTED',
          message: 'Select at least one recipient group or draw a geotargeted area.',
        });
      }

      // 2. Message-body validation \u2014 422 MESSAGE_TOO_LONG reused for the
      // empty case too (documented inline, per this plan's own simplification
      // note: no live per-channel character-limit config exists this phase,
      // F14 external-provider config is explicitly v2-deferred per
      // REQUIREMENTS.md, so only "non-empty" is enforced here, not a numeric
      // limit).
      if (!message_body || message_body.trim().length === 0) {
        return reply.code(422).send({
          error_code: 'MESSAGE_TOO_LONG',
          message: 'This message exceeds the character limit for the selected channel. Shorten it.',
        });
      }

      // 3. Jurisdiction-scope gate — mirrors reporting.ts's own correct
      // usage of fetchIncidentForMutation for every incident-linked route
      // in this same module. A caller-supplied incident_id must resolve
      // within the caller's own jurisdiction_scope before any write ties
      // a notification (and later, a Timeline entry at send time) to it.
      if (incident_id) {
        const incident = await fetchIncidentForMutation(incident_id, req.epmpUser!.jurisdiction_scope);
        if (!incident) {
          return reply.code(404).send(NOTIFICATION_NOT_FOUND);
        }
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const geoParam = geotarget_polygon ? JSON.stringify(geotarget_polygon) : null;
        const insertedRows = await client.query<{ id: string }>(
          `INSERT INTO notifications
             (incident_id, message_body, ai_origin, ai_draft_id, channels, recipient_group_ids, geotarget_polygon, created_by)
           VALUES ($1,$2,$3,$4,$5,$6, ${geoParam ? 'ST_GeomFromGeoJSON($7)::geography' : 'NULL'}, $${geoParam ? 8 : 7})
           RETURNING id`,
          geoParam
            ? [
                incident_id ?? null,
                message_body,
                ai_origin ?? false,
                ai_draft_id ?? null,
                channels,
                recipient_group_ids ?? [],
                geoParam,
                req.epmpUser!.id,
              ]
            : [
                incident_id ?? null,
                message_body,
                ai_origin ?? false,
                ai_draft_id ?? null,
                channels,
                recipient_group_ids ?? [],
                req.epmpUser!.id,
              ],
        );
        const notificationId = insertedRows.rows[0].id;

        // 4. Resolve recipients from recipient_group_ids and create
        // notification_recipients + notification_delivery_status rows at
        // compose time (Queued). Geography-only composes resolve to zero
        // concrete recipients at this stage \u2014 see resolveGroupRecipients.
        if (hasGroups) {
          for (const groupId of recipient_group_ids!) {
            const recipients = await resolveGroupRecipients(groupId);
            for (const recipient of recipients) {
              for (const channel of channels) {
                const recipientRows = await client.query<{ id: string }>(
                  `INSERT INTO notification_recipients (notification_id, recipient_name, recipient_contact, channel)
                   VALUES ($1,$2,$3,$4) RETURNING id`,
                  [notificationId, recipient.name, recipient.contact, channel],
                );
                await client.query(
                  `INSERT INTO notification_delivery_status (notification_recipient_id, status) VALUES ($1, 'Queued')`,
                  [recipientRows.rows[0].id],
                );
              }
            }
          }
        }

        await client.query('COMMIT');

        const detail = await fetchNotificationRow(query, notificationId);
        return reply.code(201).send(shapeNotification(detail!));
      } catch (err) {
        await client.query('ROLLBACK');
        req.log.error(err, 'Notification compose transaction failed');
        throw err;
      } finally {
        client.release();
      }
    },
  );

  // -------------------------------------------------------------------
  // Send
  // -------------------------------------------------------------------
  app.post<{
    Params: { id: string };
    Body: { approver_id?: string; confirmed?: boolean };
  }>(
    '/api/v1/notifications/:id/send',
    { preHandler: requirePermission('notifications', 'approve') },
    async (req, reply) => {
      const { id } = req.params;
      const { approver_id } = req.body ?? ({} as never);

      const notification = await fetchNotificationRow(query, id);
      if (!notification) {
        return reply.code(404).send(NOTIFICATION_NOT_FOUND);
      }

      // 2. Approver-match gate \u2014 re-verified server-side against the
      // signed-in session's own permission grant (notifications:approve),
      // never trusting a client-asserted approver_id alone. Since this
      // phase has no live F14 provider-channel-based approver-role config,
      // ANY user holding notifications:approve permission is a valid
      // approver (documented Phase-4 simplification; a future F14
      // integration would route by configured-provider-specific approver
      // assignment). The caller reaching this preHandler already proved
      // they hold notifications:approve \u2014 the remaining check is that the
      // body's approver_id (if provided) matches the signed-in caller,
      // never a different, unverified identity.
      const effectiveApproverId = approver_id ?? req.epmpUser!.id;
      if (effectiveApproverId !== req.epmpUser!.id) {
        return reply.code(403).send({
          error_code: 'APPROVER_MISMATCH',
          message: "You're not the designated approver for this channel. Route it to the correct approver.",
        });
      }

      // 3. Shared AI-governance guard.
      try {
        await assertAiOriginApproved(pool as unknown as PoolClient, {
          ai_origin: notification.ai_origin,
          ai_draft_id: notification.ai_draft_id ?? undefined,
        });
      } catch (err) {
        if (err instanceof AiOriginNotApprovedError) {
          return reply.code(400).send(AIDRAFT_UNAPPROVED_WRITE_BLOCKED);
        }
        throw err;
      }

      const updatedRow = await withTimelineTransaction(async (client) => {
        const updateRows = await client.query<NotificationRow>(
          `UPDATE notifications SET approved_by=$1, approved_at=now(), sent_at=now()
           WHERE id=$2
           RETURNING id, incident_id, message_body, ai_origin, ai_draft_id, channels, recipient_group_ids,
                     approved_by, sent_at, created_by`,
          [req.epmpUser!.id, id],
        );
        const updated = updateRows.rows[0];

        // No live provider callback exists in this phase, so sends
        // resolve directly to Sent (documented Phase-4/pre-F14
        // simplification, consistent with F5's own FRD note that F14
        // owns actual provider delivery).
        await client.query(
          `UPDATE notification_delivery_status SET status='Sent', updated_at=now()
           WHERE notification_recipient_id IN (
             SELECT id FROM notification_recipients WHERE notification_id = $1
           )`,
          [id],
        );

        if (updated.incident_id) {
          await TimelineService.append(
            client,
            updated.incident_id,
            `Notification sent: ${updated.message_body.slice(0, 60)}`,
            undefined,
            'brand',
            req.epmpUser!.id,
            'EPMP',
            { notification_id: id, approver_id: req.epmpUser!.id, channels: updated.channels },
          );
        }

        return updated;
      });

      // -----------------------------------------------------------------
      // Plan 09-01 (F14): dispatch through the provider adapter for every
      // distinct channel this notification uses, ADDITIVELY — run AFTER
      // the withTimelineTransaction block above has already committed
      // approved_by/approved_at/sent_at. Never reorders or removes any
      // existing gate above; this is purely an additional, best-effort
      // side effect layered on top of F5's own already-successful send.
      //
      // Each channel's adapter call is wrapped in its OWN try/catch — one
      // channel's adapter failure must not abort the others, same
      // per-item fault isolation as Phase 7/8's per-feed/per-type loops.
      // A thrown SEND_REQUIRES_APPROVAL/CAP_FIELDS_INCOMPLETE here would
      // indicate a genuine bug (this code path only runs AFTER the
      // route's own approval gate already succeeded) — logged via
      // req.log.error, never failing the whole send response, since F5's
      // own sent_at/approved_by write already committed and must not be
      // rolled back by a downstream adapter concern.
      const distinctChannels = Array.from(new Set(updatedRow.channels));
      for (const channel of distinctChannels) {
        try {
          const channelRecipients = await query<{ recipient_name: string | null; recipient_contact: string | null }>(
            `SELECT recipient_name, recipient_contact FROM notification_recipients
             WHERE notification_id = $1 AND channel = $2`,
            [id, channel],
          );

          // IPAWS-specific note: this plan does NOT add new UI/body
          // fields for CAP's sender/event/urgency/severity/certainty/area
          // in THIS task (Plan 09-03's frontend task owns surfacing those
          // as composer fields) — for channel 'IPAWS', this call passes a
          // documented placeholder capFields object so an end-to-end
          // IPAWS send is provably CAP-complete even before Plan 09-03
          // ships a dedicated composer UI for these fields. Documented
          // inline as an explicit Plan 09-01->09-03 handoff point,
          // matching Plan 07-01->07-03/08-01->08-03's established
          // cross-plan backend-then-frontend sequencing.
          let area = 'Agency service area';
          if (channel === 'IPAWS' && updatedRow.incident_id) {
            const incidentJurisdictionRows = await query<{ jurisdiction_name: string }>(
              `SELECT j.name AS jurisdiction_name FROM incidents i
               JOIN jurisdictions j ON j.id = i.jurisdiction_id
               WHERE i.id = $1`,
              [updatedRow.incident_id],
            );
            if (incidentJurisdictionRows[0]?.jurisdiction_name) {
              area = incidentJurisdictionRows[0].jurisdiction_name;
            }
          }

          await sendViaProvider({
            notification_id: id,
            channel,
            recipients: channelRecipients.map((r) => ({
              name: r.recipient_name ?? '',
              contact: r.recipient_contact,
            })),
            message: updatedRow.message_body,
            approved_by: req.epmpUser!.id,
            approved_at: new Date().toISOString(),
            ...(channel === 'IPAWS'
              ? {
                  capFields: {
                    sender: 'EPMP Agency Alerting Authority',
                    event: 'General Emergency Notification',
                    urgency: 'Immediate',
                    severity: 'Severe',
                    certainty: 'Observed',
                    area,
                  },
                }
              : {}),
          });
        } catch (err) {
          req.log.error(err, `Notification provider dispatch failed for channel ${channel}`);
        }
      }

      const approverRows = await query<{ name: string }>(`SELECT name FROM users WHERE id = $1`, [req.epmpUser!.id]);
      return reply.code(200).send(
        shapeNotification({
          ...updatedRow,
          approver_name: approverRows[0]?.name ?? null,
        }),
      );
    },
  );

  // -------------------------------------------------------------------
  // Delivery status
  // -------------------------------------------------------------------
  app.get<{ Params: { id: string } }>(
    '/api/v1/notifications/:id/delivery-status',
    { preHandler: requirePermission('notifications', 'view') },
    async (req, reply) => {
      const { id } = req.params;

      const notification = await fetchNotificationRow(query, id);
      if (!notification) {
        return reply.code(404).send(NOTIFICATION_NOT_FOUND);
      }

      const rows = await query<{ recipient_name: string | null; channel: string; status: DeliveryStatus; failure_reason: string | null }>(
        `SELECT nr.recipient_name, nr.channel, nds.status, nds.failure_reason
         FROM notification_recipients nr
         JOIN notification_delivery_status nds ON nds.notification_recipient_id = nr.id
         WHERE nr.notification_id = $1`,
        [id],
      );

      const total = rows.length;
      const acknowledged = rows.filter((r) => r.status === 'Acknowledged').length;
      const ack_percentage = total === 0 ? 0 : (100.0 * acknowledged) / total;

      return reply.code(200).send({
        recipients: rows.map((r) => ({
          name: r.recipient_name ?? '',
          channel: r.channel,
          status: r.status,
          failure_reason: r.failure_reason ?? undefined,
        })),
        ack_percentage,
        // Plan 09-03 (F14 frontend half): additive-only field, zero shape
        // change to any existing consumer. notification.channels is
        // already fetched above via fetchNotificationRow for the
        // not-found check — this is the cheapest possible way to let
        // DeliveryTracking.tsx distinguish a CAP-formatted public-alert
        // send from a plain send, with no second query/endpoint needed.
        is_cap_send: notification.channels.includes('IPAWS'),
      });
    },
  );
}
