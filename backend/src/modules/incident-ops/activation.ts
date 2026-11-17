import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';
import {
  fetchIncidentDetailShape,
  fetchIncidentForMutation,
  INCIDENT_NOT_FOUND,
  type ActivationLevel,
} from './incidents.js';

const ACTIVATION_LEVEL_RANK: Record<ActivationLevel, number> = {
  Monitoring: 0,
  Partial: 1,
  Full: 2,
};

interface CommanderCountRow {
  count: string;
}

/**
 * Mounts POST /api/v1/incidents/{id}/activation.
 *
 * Division of responsibility between this route and the frontend Modal
 * (per FRD F1 Validation): the FRD requires the Modal to explicitly name
 * the operational consequence of the SPECIFIC target level, including
 * when the jump skips an intermediate level (e.g. Monitoring -> Full
 * skipping Partial). The API has no concept of "the Modal's wording" and
 * cannot verify what text a human was shown — it only enforces the two
 * rules it CAN verify structurally: (1) that some valid target level was
 * explicitly confirmed via `confirmed:true` in the request body (closing
 * the gap where a direct API call could skip the Modal entirely — threat
 * T-02-04), and (2) that at least one Incident Commander is assigned
 * before activation can move above Monitoring. The frontend Modal (02-06)
 * remains responsible for the UX-level "name the specific consequence"
 * requirement; this endpoint is the actual security/business-rule
 * boundary for both rules it enforces.
 */
export default async function activationRoutes(app: FastifyInstance) {
  app.post<{
    Params: { id: string };
    Body: { activation_level: ActivationLevel; confirmed?: boolean };
  }>(
    '/api/v1/incidents/:id/activation',
    { preHandler: requirePermission('incidents', 'edit') },
    async (req, reply) => {
      const incidentId = req.params.id;
      const { activation_level, confirmed } = req.body ?? ({} as never);

      // 1. Confirmation gate — structural, not UI trust. This makes the
      // FRD's "Modal confirmation must be accepted before the change takes
      // effect" an API-enforced rule, not merely a frontend affordance a
      // direct API caller could skip (threat T-02-04).
      if (confirmed !== true) {
        return reply.code(400).send({
          error_code: 'ACTIVATION_CONFIRMATION_REQUIRED',
          message: 'Confirm the activation-level change before it takes effect.',
        });
      }

      // Jurisdiction-scope enforcement (W1 fix, TechArch 04-security.md
      // §5.2): a caller holding incidents:edit can only act on incidents
      // in their own jurisdiction_scope — this existence+scope check
      // doubles as the 404 for "doesn't exist" vs "exists elsewhere",
      // deliberately indistinguishable to the caller.
      const incident = await fetchIncidentForMutation(incidentId, req.epmpUser!.jurisdiction_scope);
      if (!incident) {
        return reply.code(404).send(INCIDENT_NOT_FOUND);
      }

      const priorLevel = incident.activation_level;

      // 2. No-op if the target level is the same as current — not a real
      // change, so no Timeline entry.
      if (activation_level === priorLevel) {
        const detail = await fetchIncidentDetailShape(incidentId, req.epmpUser!.jurisdiction_scope);
        return reply.code(200).send(detail);
      }

      // 3. Commander gate — only applies when moving ABOVE Monitoring.
      if (ACTIVATION_LEVEL_RANK[activation_level] > ACTIVATION_LEVEL_RANK.Monitoring) {
        const commanderRows = await query<CommanderCountRow>(
          `SELECT count(*) FROM incident_command_roles
           WHERE incident_id = $1 AND role_title = 'Incident Commander' AND unassigned_at IS NULL`,
          [incidentId],
        );
        const commanderCount = parseInt(commanderRows[0]?.count ?? '0', 10);
        if (commanderCount === 0) {
          // Do NOT change activation_level.
          return reply.code(422).send({
            error_code: 'NO_COMMANDER_ASSIGNED',
            message: 'Assign an Incident Commander before activating above Monitoring.',
          });
        }
      }

      try {
        await withTimelineTransaction(async (client) => {
          await client.query(
            `UPDATE incidents SET activation_level = $1, updated_at = now() WHERE id = $2`,
            [activation_level, incidentId],
          );

          // Escalation (moving to a higher level) is 'warning' tone;
          // de-escalation is 'brand'.
          const tone =
            ACTIVATION_LEVEL_RANK[activation_level] > ACTIVATION_LEVEL_RANK[priorLevel] ? 'warning' : 'brand';

          await TimelineService.append(
            client,
            incidentId,
            `Activation changed to ${activation_level}`,
            undefined,
            tone,
            req.epmpUser!.id,
            'EPMP',
            { from: priorLevel, to: activation_level },
          );
        });

        const detail = await fetchIncidentDetailShape(incidentId, req.epmpUser!.jurisdiction_scope);
        return reply.code(200).send(detail);
      } catch (err) {
        req.log.error(err, 'Activation-level change transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );
}
