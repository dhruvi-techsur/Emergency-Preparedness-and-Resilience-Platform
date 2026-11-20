import type { FastifyInstance } from 'fastify';
import aiDraftsRoutes from './ai-drafts.js';
import signalsRoutes from './signals.js';

export default async function aiAssistRoutes(app: FastifyInstance) {
  await app.register(aiDraftsRoutes);
  // 06-04 F9 signal triage queue — appended into this SAME plugin
  // registration (not a second server.ts line), per this plan's own
  // depends_on: ["06-03"] sequencing note.
  await app.register(signalsRoutes);
}
