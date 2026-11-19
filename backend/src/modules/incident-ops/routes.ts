import type { FastifyInstance } from 'fastify';
import incidentsRoutes from './incidents.js';
import commandRolesRoutes from './command-roles.js';
import activationRoutes from './activation.js';
import closureRoutes from './closure.js';
import operatingPictureRoutes from './operating-picture.js';
import taskRoutes from './tasks.js';
import resourceRequestRoutes from './resource-requests.js';
import fieldReportsRoutes from './field-reports.js';
import syncConflictsRoutes from './sync-conflicts.js';

/**
 * Mounts the incident-ops module's F1/F2/F4 endpoints as a Fastify plugin,
 * registered independently of auth-org's routes per TechArch's component
 * boundaries (01-components.md).
 */
export default async function incidentOpsRoutes(app: FastifyInstance) {
  await app.register(incidentsRoutes);
  await app.register(commandRolesRoutes);
  await app.register(activationRoutes);
  await app.register(closureRoutes);
  await app.register(operatingPictureRoutes);
  // 03-01 F4 task routes (register.*task)
  await app.register(taskRoutes);
  // 03-04 F4 resource-request routes
  await app.register(resourceRequestRoutes);
  // 05-01 F6 mobile field-operations routes (offline-sync field reports +
  // conflict resolution) — appended after resourceRequestRoutes per this
  // file's append-only convention.
  await app.register(fieldReportsRoutes);
  await app.register(syncConflictsRoutes);
}
