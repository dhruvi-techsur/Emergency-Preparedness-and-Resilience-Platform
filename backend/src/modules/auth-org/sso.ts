import { createRemoteJWKSet, jwtVerify } from 'jose';
import { query } from '../../db/client.js';
import { mintSessionToken } from './session.js';
import { AuditService } from './audit.js';

/** Thrown on any assertion/validation failure — converted to 401 SSO_AUTH_FAILED by the route handler. */
export class SsoAuthError extends Error {}

/** Thrown when JIT provisioning finds no group_to_role_mapping match — converted to 403 ROLE_UNRESOLVED. */
export class RoleUnresolvedError extends Error {}

interface SsoConfigRow {
  id: string;
  attribute_mapping: { email_attr: string; name_attr: string; group_attr: string };
  group_to_role_mapping: Array<{ idp_group: string; role_id: string }>;
}

interface UserRow {
  id: string;
  email: string;
  name: string;
  role_id: string;
  jurisdiction_scope: string[];
  theme_preference: 'light' | 'dark' | 'contrast';
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
}

interface RoleRow {
  id: string;
  name: string;
  persona_id: string;
}

export interface SsoCallbackResult {
  session_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: { id: string; name: string; persona_id: string };
    jurisdiction_scope: string[];
    theme_preference: 'light' | 'dark' | 'contrast';
    status: 'Active' | 'Suspended';
    last_login_at: string | null;
  };
}

/**
 * Validates a Keycloak-issued OIDC ID token, resolves (or JIT-provisions) the
 * local user, mints a session JWT, and records the login in the audit log.
 * Matches TechArch 04-security.md §5.1's SSO sequence exactly.
 */
export async function handleSsoCallback(idToken: string): Promise<SsoCallbackResult> {
  const configRows = await query<SsoConfigRow>(
    `SELECT id, attribute_mapping, group_to_role_mapping FROM sso_config WHERE active = true LIMIT 1`,
  );
  const config = configRows[0];
  if (!config) {
    throw new SsoAuthError('No active SSO configuration');
  }

  const issuer = process.env.KEYCLOAK_ISSUER;
  if (!issuer) {
    throw new SsoAuthError('KEYCLOAK_ISSUER not configured');
  }

  let claims: Record<string, unknown>;
  try {
    const jwks = createRemoteJWKSet(new URL(`${issuer}/protocol/openid-connect/certs`));
    const { payload } = await jwtVerify(idToken, jwks);
    claims = payload as Record<string, unknown>;
  } catch {
    throw new SsoAuthError('ID token signature/claims validation failed');
  }

  const { email_attr, name_attr, group_attr } = config.attribute_mapping;
  const subject = claims.sub as string | undefined;
  const email = claims[email_attr] as string | undefined;
  const name = claims[name_attr] as string | undefined;
  const groups = (claims[group_attr] as string[] | undefined) ?? [];

  if (!subject || !email) {
    throw new SsoAuthError('ID token missing required claims (sub/email)');
  }

  const existingRows = await query<UserRow>(`SELECT * FROM users WHERE idp_subject = $1`, [subject]);
  let user = existingRows[0];

  if (!user) {
    // JIT provisioning: map the first matching IdP group to an EPMP role.
    let roleId: string | undefined;
    for (const mapping of config.group_to_role_mapping) {
      if (groups.includes(mapping.idp_group)) {
        roleId = mapping.role_id;
        break;
      }
    }
    if (!roleId) {
      throw new RoleUnresolvedError('No group_to_role_mapping matched this user\'s IdP groups');
    }

    const inserted = await query<UserRow>(
      `INSERT INTO users (email, name, role_id, jurisdiction_scope, idp_subject, last_login_at)
       VALUES ($1, $2, $3, '{}', $4, now())
       ON CONFLICT (email) DO UPDATE SET idp_subject = EXCLUDED.idp_subject, last_login_at = now()
       RETURNING *`,
      [email, name ?? email, roleId, subject],
    );
    user = inserted[0];
  } else {
    await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [user.id]);
    user.last_login_at = new Date().toISOString();
  }

  await AuditService.record(user.id, 'login');

  const roleRows = await query<RoleRow>(`SELECT id, name, persona_id FROM roles WHERE id = $1`, [user.role_id]);
  const role = roleRows[0];
  if (!role) {
    throw new SsoAuthError('Resolved user has no matching role record');
  }

  const session_token = await mintSessionToken({
    id: user.id,
    role_id: user.role_id,
    jurisdiction_scope: user.jurisdiction_scope,
  });

  return {
    session_token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: { id: role.id, name: role.name, persona_id: role.persona_id },
      jurisdiction_scope: user.jurisdiction_scope,
      theme_preference: user.theme_preference,
      status: user.status,
      last_login_at: user.last_login_at,
    },
  };
}
