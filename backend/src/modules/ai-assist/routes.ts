import type { FastifyInstance } from 'fastify';
import aiDraftsRoutes from './ai-drafts.js';

export default async function aiAssistRoutes(app: FastifyInstance) {
  await app.register(aiDraftsRoutes);
}
