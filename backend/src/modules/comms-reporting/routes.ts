import type { FastifyInstance } from 'fastify';
import notificationsRoutes from './notifications.js';

/**
 * Mounts the comms-reporting module's F5 (Notifications) endpoints as a
 * Fastify plugin — this is a NEW module per TechArch's 01-components.md
 * boundary list, registered independently of auth-org/incident-ops/plans/
 * integration-gateway's routes. 04-02 (Reporting, F7) registers its own
 * routes file alongside this one, appended to this same plugin function
 * once it lands (Wave 2, depends_on 04-01).
 */
export default async function commsReportingRoutes(app: FastifyInstance) {
  await app.register(notificationsRoutes);
}
