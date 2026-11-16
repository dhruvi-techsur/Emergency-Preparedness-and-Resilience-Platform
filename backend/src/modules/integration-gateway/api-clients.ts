import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { AuditService } from '../auth-org/audit.js';
import { query } from '../../db/client.js';

const scrypt = promisify(scryptCallback);

/**
 * Hashes a client secret with a per-secret random salt (scrypt, Node's
 * built-in KDF — no extra dependency needed). Stored format is
 * `${saltHex}:${derivedKeyHex}`, never the plaintext. A future phase's
 * API-client bearer-token authentication middleware would re-derive the key
 * with the stored salt and compare in constant time before trusting a
 * request as coming from that client — not built in Phase 1 (see the
 * contract note on the revoke handler below).
 */
async function hashClientSecret(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(plain, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

interface ApiClientRow {
  id: string;
  client_name: string;
  scopes: string[];
  revoked: boolean;
  created_at: string;
}

interface ApiClientDbRow extends ApiClientRow {
  client_secret_hash: string;
}

export default async function apiClientsRoutes(app: FastifyInstance) {
  // GET never selects client_secret_hash — only the summary shape per
  // ApiClient in 03a-api-auth-admin.md. No derivable secret ever leaves here.
  app.get(
    '/api/v1/admin/api-clients',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<ApiClientRow>(
        `SELECT id, client_name, scopes, revoked, created_at FROM api_clients ORDER BY created_at DESC`,
      );
      return reply.code(200).send(rows);
    },
  );

  app.post<{ Body: { client_name: string; scopes: string[] } }>(
    '/api/v1/admin/api-clients',
    { preHandler: requirePermission('admin', 'create') },
    async (req, reply) => {
      const { client_name, scopes } = req.body ?? { client_name: '', scopes: [] };
      if (!client_name || !Array.isArray(scopes)) {
        return reply.code(400).send({
          error_code: 'API_CLIENT_INVALID',
          message: 'client_name and scopes[] are required.',
        });
      }

      // Generate the plaintext secret. This variable is never logged and
      // never stored — only its scrypt hash (client_secret_hash) persists.
      const plaintextSecret = randomBytes(32).toString('base64url');
      const clientSecretHash = await hashClientSecret(plaintextSecret);

      const rows = await query<ApiClientDbRow>(
        `INSERT INTO api_clients (client_name, client_secret_hash, scopes)
         VALUES ($1, $2, $3)
         RETURNING id, client_name, scopes, revoked, created_at, client_secret_hash`,
        [client_name, clientSecretHash, scopes],
      );
      const created = rows[0];

      await AuditService.record(req.epmpUser!.id, 'api_client_create', 'api_clients', created.id, {
        client_name,
        scopes,
      });

      // This is the ONLY place client_secret plaintext ever exists outside
      // the request that generated it — it is never stored, logged, or
      // returned again. Every subsequent GET on this resource omits it.
      return reply.code(201).send({
        id: created.id,
        client_name: created.client_name,
        scopes: created.scopes,
        revoked: created.revoked,
        created_at: created.created_at,
        client_secret: plaintextSecret,
      });
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/v1/admin/api-clients/:id/revoke',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { id } = req.params;
      await query(`UPDATE api_clients SET revoked = true, revoked_at = now() WHERE id = $1`, [id]);
      await AuditService.record(req.epmpUser!.id, 'api_client_revoke', 'api_clients', id);

      // CONTRACT FOR FUTURE PHASES: no code path in Phase 1 authenticates an
      // incoming request AS this api_client (no external partner API
      // consumer exists yet — that lands with Phase 2+'s actual
      // API-client-authenticated routes). When one is built, it MUST check
      // `revoked = false` by querying the database on every single request —
      // never cache the check in memory or in the bearer token's claims —
      // mirroring requirePermission's per-request users.status re-check in
      // auth-org/rbac.ts. This revoke handler's job ends at setting
      // revoked=true with an audit entry; enforcement is deferred by design.
      return reply.code(204).send();
    },
  );
}
