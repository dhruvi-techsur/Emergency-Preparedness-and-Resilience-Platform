import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from 'fastify';
import { checkPermission } from './opa-client.js';
import { verifySessionToken } from './session.js';
import { query } from '../../db/client.js';

declare module 'fastify' {
  interface FastifyRequest {
    epmpUser?: {
      id: string;
      role_id: string;
      jurisdiction_scope: string[];
    };
  }
}

interface UserStatusRow {
  status: string;
  role_id: string;
  jurisdiction_scope: string[];
}

const SESSION_EXPIRED = {
  error_code: 'SESSION_EXPIRED',
  message: 'Your session has ended. Sign in again to continue.',
} as const;

const ROLE_UNRESOLVED = {
  error_code: 'ROLE_UNRESOLVED',
  message: "Your account isn't assigned a role yet. Contact your administrator.",
} as const;

/**
 * Fastify preHandler factory enforcing RBAC for a given feature/action pair.
 * Re-fetches `users.status` from the database on EVERY request — this is
 * what makes a suspension take effect immediately rather than waiting for
 * the 15-min session token to expire (TechArch 04-security.md §5.1).
 */
export function requirePermission(feature: string, action: string): preHandlerHookHandler {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return reply.code(401).send(SESSION_EXPIRED);
    }

    let claims;
    try {
      claims = await verifySessionToken(auth.slice(7));
    } catch {
      return reply.code(401).send(SESSION_EXPIRED);
    }

    // Re-fetch user status fresh on EVERY request — see docstring above.
    const rows = await query<UserStatusRow>(
      `SELECT status, role_id, jurisdiction_scope FROM users WHERE id = $1`,
      [claims.sub],
    );
    const user = rows[0];
    if (!user || user.status !== 'Active') {
      return reply.code(401).send(SESSION_EXPIRED);
    }

    const allowed = await checkPermission({ role_id: user.role_id, feature, action });
    if (!allowed) {
      return reply.code(403).send(ROLE_UNRESOLVED);
    }

    req.epmpUser = { id: claims.sub, role_id: user.role_id, jurisdiction_scope: user.jurisdiction_scope };
  };
}
