import type { FastifyInstance } from 'fastify';
import apiClientsRoutes from './api-clients.js';
import recordAuthorityRoutes from './record-authority.js';
import federationGrantsRoutes from './federation-grants.js';

/**
 * Mounts the integration-gateway module's F10 registry/governance endpoints
 * as a Fastify plugin, registered independently of auth-org's routes per
 * TechArch's component boundaries (01-components.md).
 */
export default async function integrationGatewayRoutes(app: FastifyInstance) {
  await app.register(apiClientsRoutes);
  await app.register(recordAuthorityRoutes);
  await app.register(federationGrantsRoutes);
}
