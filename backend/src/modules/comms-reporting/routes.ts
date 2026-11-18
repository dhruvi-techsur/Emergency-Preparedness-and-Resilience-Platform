import type { FastifyInstance } from 'fastify';
import notificationsRoutes from './notifications.js';
import reportingRoutes from './reporting.js';

/**
 * Mounts the comms-reporting module's F5 (Notifications) and F7
 * (Reporting & Learning) endpoints as a single Fastify plugin — this is a
 * NEW module per TechArch's 01-components.md boundary list, registered
 * independently of auth-org/incident-ops/plans/integration-gateway's
 * routes. 04-02 (Reporting, F7) appends its own route files here
 * (reporting.ts, then evidence-log.ts/analytics.ts in Task 3), rather than
 * adding a second top-level server.ts registration, per this plan's own
 * sequencing note.
 */
export default async function commsReportingRoutes(app: FastifyInstance) {
  await app.register(notificationsRoutes);
  await app.register(reportingRoutes);
}
