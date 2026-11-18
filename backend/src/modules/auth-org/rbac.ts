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

// Distinct from ROLE_UNRESOLVED above: this is for a user whose role DID
// resolve (users.role_id is NOT NULL REFERENCES roles(id) — always true once
// a users row exists at all) but who simply lacks the specific feature/action
// grant being checked. ROLE_UNRESOLVED's "isn't assigned a role yet" wording
// is accurate ONLY for the genuinely-unresolved-role case, which can occur
// solely during SSO JIT provisioning (sso.ts's RoleUnresolvedError, caught in
// routes.ts's SSO callback) — never here, since this preHandler only runs
// after a role_id has already been successfully read from the DB.
const PERMISSION_DENIED = {
  error_code: 'PERMISSION_DENIED',
  message: "Your role doesn't include this action. Contact your administrator if you need access.",
} as const;

/**
 * Fastify preHandler factory enforcing RBAC for a given feature/action pair.
 * Re-fetches `users.status` from the database on EVERY request — this is
 * what makes a suspension take effect immediately rather than waiting for
 * the 15-min session token to expire (TechArch 04-security.md §5.1).
 */
export function requirePermission(feature: string, action: string): preHandlerHookHandler {
  return requireAnyPermission(feature, [action]);
}

/**
 * Same session/status resolution as `requirePermission` above, but passes
 * if the role holds ANY ONE of the given actions on `feature` — the
 * `tasks`/status-transition route uses this to accept EITHER the
 * broad `edit` grant (command/logistics roles, who can also reassign
 * owners via the separate `/owner` route) OR the narrower `status` grant
 * (field_responder — status-transitions ONLY, deliberately still denied
 * `edit` so a field responder can never reassign a task's owner or
 * edit its title/description/due date, just move it through the
 * Start/Mark-done state machine from the mobile UI). Keeping this as a
 * genuinely separate, narrower action string (rather than just adding
 * `edit` to field_responder's tasks grant) is what makes "field_responder
 * cannot edit tasks" still a true, enforced statement after this fix.
 */
export function requireAnyPermission(feature: string, actions: string[]): preHandlerHookHandler {
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

    let allowed = false;
    for (const action of actions) {
      // eslint-disable-next-line no-await-in-loop -- sequential, short-circuiting on
      // the first allow is intentional: avoids firing every OPA query when the
      // first action already grants access (the common case for single-action
      // callers via requirePermission above).
      if (await checkPermission({ role_id: user.role_id, feature, action })) {
        allowed = true;
        break;
      }
    }
    if (!allowed) {
      return reply.code(403).send(PERMISSION_DENIED);
    }

    req.epmpUser = { id: claims.sub, role_id: user.role_id, jurisdiction_scope: user.jurisdiction_scope };
  };
}
