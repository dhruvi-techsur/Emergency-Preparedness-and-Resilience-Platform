import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import type { OpenAPIV3_1 } from 'openapi-types';

/**
 * Fastify plugin registering @fastify/swagger against the app and mounting
 * GET /api/v1/openapi.json, returning the generated OpenAPI 3.1 document.
 * The document is auto-assembled from every registered route's declared
 * JSON-schema (`schema: {response: {...}}` on each fastify.get/post/patch) —
 * see routes.ts (GET /api/v1/me) and admin-users.ts (GET
 * /api/v1/admin/users) for the minimal response schemas added so the
 * document is non-trivial, not just an empty paths object.
 */
async function openApiRoutesPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'EPMP API', version: '1.0.0' },
      servers: [{ url: '/api/v1' }],
    },
  });

  app.get('/api/v1/openapi.json', { schema: { hide: true } }, async () => buildOpenApiSpec(app));
}

/**
 * Wrapped with fastify-plugin so this registers directly on the ROOT
 * instance rather than a new encapsulated child context. This matters
 * because @fastify/swagger's document-assembly hook (onRoute) only observes
 * routes added within its own encapsulation context and descendants — if
 * this plugin created a child context, sibling route plugins (authOrgRoutes,
 * platformHealthRoutes, etc., registered directly on root in server.ts)
 * would be invisible to it, and the generated document would come back
 * empty regardless of how many routes declare a `schema`.
 */
export default fp(openApiRoutesPlugin);

/**
 * Returns the current OpenAPI 3.1 document, assembled by @fastify/swagger
 * from every route's declared schema. `hide: true` on the generator route
 * itself keeps it out of its own document.
 */
export function buildOpenApiSpec(app: FastifyInstance): OpenAPIV3_1.Document {
  return app.swagger() as OpenAPIV3_1.Document;
}
