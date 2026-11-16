import type { FastifyInstance } from 'fastify';
import { query } from '../../db/client.js';
import { requirePermission } from '../auth-org/rbac.js';
import { AuditService } from '../auth-org/audit.js';

interface WebhookSubscriptionRow {
  id: string;
  api_client_id: string;
  callback_url: string;
  event_types: string[];
  active: boolean;
  created_at: string;
}

/**
 * Hashes a webhook subscriber secret before storage. Uses the Node builtin
 * `crypto` scrypt — matches the "never store secrets in plaintext" pattern
 * established by api-clients.ts's client_secret_hash (01-08), with no extra
 * dependency added for this single call site.
 */
async function hashSecret(secret: string): Promise<string> {
  const { scryptSync, randomBytes } = await import('node:crypto');
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(secret, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export default async function webhookSubscriptionRoutes(app: FastifyInstance) {
  app.post<{ Body: { callback_url: string; event_types: string[]; secret: string; api_client_id?: string } }>(
    '/api/v1/admin/webhook-subscriptions',
    { preHandler: requirePermission('admin', 'create') },
    async (req, reply) => {
      const { callback_url, event_types, secret, api_client_id } = req.body ?? {};

      if (!callback_url || !Array.isArray(event_types) || event_types.length === 0 || !secret) {
        return reply.code(422).send({
          error_code: 'WEBHOOK_SUBSCRIPTION_INVALID',
          message: 'callback_url, a non-empty event_types array, and secret are required.',
        });
      }

      let resolvedClientId = api_client_id;
      if (!resolvedClientId) {
        // Phase 1 simplification (documented in the plan): webhook-subscription
        // creation in this chunk's FRD text doesn't require a pre-existing API
        // client, but api_clients.id is a NOT NULL FK on webhook_subscriptions.
        // Auto-create a placeholder client scoped to this subscription alone
        // rather than forcing every webhook consumer through the full
        // API-client management flow (01-08) in this phase.
        const placeholderSecretHash = await hashSecret(crypto.randomUUID());
        const inserted = await query<{ id: string }>(
          `INSERT INTO api_clients (client_name, client_secret_hash, scopes) VALUES ($1, $2, $3) RETURNING id`,
          [`webhook-subscriber-${crypto.randomUUID()}`, placeholderSecretHash, []],
        );
        resolvedClientId = inserted[0].id;
      }

      const secretHash = await hashSecret(secret);

      const inserted = await query<WebhookSubscriptionRow>(
        `INSERT INTO webhook_subscriptions (api_client_id, callback_url, event_types, secret_hash)
         VALUES ($1, $2, $3, $4) RETURNING id, api_client_id, callback_url, event_types, active, created_at`,
        [resolvedClientId, callback_url, event_types, secretHash],
      );
      const subscription = inserted[0];

      await AuditService.record(
        req.epmpUser!.id,
        'webhook_subscription_create',
        'webhook_subscription',
        subscription.id,
        { callback_url, event_types },
      );

      return reply.code(201).send(subscription);
    },
  );
}
