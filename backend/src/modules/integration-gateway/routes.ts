import type { FastifyInstance } from 'fastify';
import apiClientsRoutes from './api-clients.js';
import recordAuthorityRoutes from './record-authority.js';
import federationGrantsRoutes from './federation-grants.js';
import { gisHealthRoutes } from './gis-adapter.js';
import { hazardFeedRoutes } from './hazard-feed-adapter.js';
import { cadRoutes } from './cad-adapter.js';
import { eocCotsRoutes } from './eoc-cots-adapter.js';
import eocCotsConflictsRoutes from './eoc-cots-conflicts.js';
import { facilityRoutes } from './facility-adapter.js';
import { documentRoutes } from './document-adapter.js';
import { notificationProviderRoutes } from './notification-provider-adapter.js';
import { hrisRosterRoutes } from './hris-roster-adapter.js';

/**
 * Mounts the integration-gateway module's F10 registry/governance endpoints
 * as a Fastify plugin, registered independently of auth-org's routes per
 * TechArch's component boundaries (01-components.md).
 */
export default async function integrationGatewayRoutes(app: FastifyInstance) {
  await app.register(apiClientsRoutes);
  await app.register(recordAuthorityRoutes);
  await app.register(federationGrantsRoutes);
  await app.register(gisHealthRoutes);
  // 07-01 (F12): hazard-feed health + verify routes, appended per this
  // file's existing append-only registration convention.
  await app.register(hazardFeedRoutes);
  // F15 CAD/911 — read-only dispatch-events/health routes (Plan 07-02).
  await app.register(cadRoutes);
  // F13 EOC COTS — exchange-records/conflicts/health routes (Plan 08-01).
  await app.register(eocCotsRoutes);
  // F13 EOC COTS conflict-resolve route (Plan 08-03) — kept in its own
  // file, the sole code path permitted to set eoc_cots_conflicts.resolution.
  await app.register(eocCotsConflictsRoutes);
  // F17 (Plan 08-02): facility/asset-status adapter routes (status, health,
  // operating-picture/facilities) + document adapter routes (browse,
  // import, link, health) — two independent adapter contracts, both
  // appended per this file's existing append-only convention.
  await app.register(facilityRoutes);
  await app.register(documentRoutes);
  // F14 (Plan 09-01): Everbridge/AtHoc-class notification-provider adapter
  // + OASIS CAP envelope builder + retry-sweep scheduled job + send/
  // callback/health routes — appended per this file's existing
  // append-only registration convention.
  await app.register(notificationProviderRoutes);
  // F16-roster (Plan 09-02): HR/IAM personnel-roster read-sync routes —
  // strictly read-only (personnel-list, health), appended per this file's
  // existing append-only registration convention.
  await app.register(hrisRosterRoutes);
}
