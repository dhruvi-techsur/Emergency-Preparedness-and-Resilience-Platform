import type { FastifyInstance } from 'fastify';
import notificationsRoutes from './notifications.js';
import reportingRoutes from './reporting.js';
import evidenceLogRoutes from './evidence-log.js';
import analyticsRoutes from './analytics.js';

/**
 * Mounts the comms-reporting module's F5 (Notifications) and F7
 * (Reporting & Learning) endpoints as a single Fastify plugin — this is a
 * NEW module per TechArch's 01-components.md boundary list, registered
 * independently of auth-org/incident-ops/plans/integration-gateway's
 * routes. 04-02 (Reporting, F7) appends its own route files here
 * (reporting.ts, evidence-log.ts, analytics.ts) rather than adding a
 * second top-level server.ts registration, per this plan's own
 * sequencing note.
 */
export default async function commsReportingRoutes(app: FastifyInstance) {
  await app.register(notificationsRoutes);
  await app.register(reportingRoutes);
  await app.register(evidenceLogRoutes);
  await app.register(analyticsRoutes);
}
