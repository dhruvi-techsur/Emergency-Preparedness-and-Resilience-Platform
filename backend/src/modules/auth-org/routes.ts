import type { FastifyInstance } from 'fastify';
import { handleSsoCallback, SsoAuthError, RoleUnresolvedError } from './sso.js';
import { requirePermission } from './rbac.js';
import { query } from '../../db/client.js';
import adminUsersRoutes from './admin-users.js';
import adminRolesRoutes from './admin-roles.js';
import adminSsoConfigRoutes from './admin-sso-config.js';
import adminAuditRoutes from './admin-audit.js';

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

interface RolePermissionRow {
  feature: string;
  actions: string[];
}

/**
 * Feature → nav item metadata for Phase 1's admin-only nav surface. Full
 * lifecycle-ordered (Prepare→Monitor→Activate→Coordinate→Recover→Improve)
 * navigation requires F1–F9 routes that don't exist until Phase 2+; this
 * derives only what Phase 1 actually has to offer. role_landing_config
 * (F18, schema already migrated) is intentionally NOT populated/read here —
 * full persona dashboard routing is Phase 6 scope.
 */
const ADMIN_NAV_ITEMS = [
  { id: 'users', label: 'Users', icon: 'users', href: '/admin/users' },
  { id: 'roles', label: 'Roles & Permissions', icon: 'shield', href: '/admin/roles' },
  { id: 'audit-log', label: 'Audit Log', icon: 'file-text', href: '/admin/audit-log' },
  { id: 'sso-config', label: 'SSO Config', icon: 'key', href: '/admin/sso-config' },
  { id: 'integration-health', label: 'Integration Health', icon: 'activity', href: '/admin/integration-health' },
  { id: 'platform-monitoring', label: 'Platform Monitoring', icon: 'gauge', href: '/admin/platform-monitoring' },
  { id: 'api-clients', label: 'API Clients', icon: 'plug', href: '/admin/api-clients' },
  { id: 'record-authority', label: 'Record Authority', icon: 'database', href: '/admin/record-authority' },
  { id: 'federation-grants', label: 'Federation Grants', icon: 'link', href: '/admin/federation-grants' },
];

async function fetchUserShape(userId: string) {
  const rows = await query<UserRow>(`SELECT * FROM users WHERE id = $1`, [userId]);
  const user = rows[0];
  if (!user) return null;
  const roleRows = await query<RoleRow>(`SELECT id, name, persona_id FROM roles WHERE id = $1`, [user.role_id]);
  const role = roleRows[0];
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: role ? { id: role.id, name: role.name, persona_id: role.persona_id } : null,
    jurisdiction_scope: user.jurisdiction_scope,
    theme_preference: user.theme_preference,
    status: user.status,
    last_login_at: user.last_login_at,
  };
}

export default async function authOrgRoutes(app: FastifyInstance) {
  app.post<{ Body: { id_token: string } }>('/api/v1/auth/sso/callback', async (req, reply) => {
    const { id_token } = req.body ?? {};
    if (!id_token) {
      return reply.code(401).send({
        error_code: 'SSO_AUTH_FAILED',
        message: 'Sign-in with your organization account failed. Contact your administrator if this continues.',
      });
    }
    try {
      const result = await handleSsoCallback(id_token);
      return reply.code(200).send(result);
    } catch (err) {
      if (err instanceof RoleUnresolvedError) {
        return reply.code(403).send({
          error_code: 'ROLE_UNRESOLVED',
          message: "Your account isn't assigned a role yet. Contact your administrator.",
        });
      }
      if (err instanceof SsoAuthError) {
        return reply.code(401).send({
          error_code: 'SSO_AUTH_FAILED',
          message: 'Sign-in with your organization account failed. Contact your administrator if this continues.',
        });
      }
      req.log.error(err, 'Unexpected error in SSO callback');
      return reply.code(401).send({
        error_code: 'SSO_AUTH_FAILED',
        message: 'Sign-in with your organization account failed. Contact your administrator if this continues.',
      });
    }
  });

  app.get(
    '/api/v1/me',
    {
      preHandler: requirePermission('platform', 'view'),
      schema: {
        tags: ['platform'],
        summary: 'Returns the current authenticated user',
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              name: { type: 'string' },
              role: {
                type: 'object',
                nullable: true,
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  persona_id: { type: 'string' },
                },
              },
              jurisdiction_scope: { type: 'array', items: { type: 'string' } },
              theme_preference: { type: 'string', enum: ['light', 'dark', 'contrast'] },
              status: { type: 'string', enum: ['Active', 'Suspended'] },
              last_login_at: { type: 'string', nullable: true },
            },
          },
          401: {
            type: 'object',
            properties: {
              error_code: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const user = await fetchUserShape(req.epmpUser!.id);
      if (!user) {
        return reply.code(401).send({
          error_code: 'SESSION_EXPIRED',
          message: 'Your session has ended. Sign in again to continue.',
        });
      }
      return reply.code(200).send(user);
    },
  );

  app.patch<{ Body: { theme_preference: 'light' | 'dark' | 'contrast' } }>(
    '/api/v1/me/preferences',
    { preHandler: requirePermission('platform', 'view') },
    async (req, reply) => {
      const { theme_preference } = req.body ?? {};
      try {
        await query(`UPDATE users SET theme_preference = $1 WHERE id = $2`, [
          theme_preference,
          req.epmpUser!.id,
        ]);
      } catch (err) {
        req.log.error(err, 'Failed to save theme preference');
        return reply.code(500).send({ error_code: 'THEME_SAVE_FAILED', message: 'Could not save your preference. Try again.' });
      }
      return reply.code(200).send({ theme_preference });
    },
  );

  app.get(
    '/api/v1/me/nav-config',
    { preHandler: requirePermission('platform', 'view') },
    async (req, reply) => {
      const permRows = await query<RolePermissionRow>(
        `SELECT feature, actions FROM role_permissions WHERE role_id = $1`,
        [req.epmpUser!.role_id],
      );
      const hasAdmin = permRows.some((r) => r.feature === 'admin' && r.actions.length > 0);
      // Phase 2 (F1): any role with ANY 'incidents' permission (view or
      // above — 02-01's seed grants view-only to planning_logistics_chief/
      // field_responder and full access to incident_commander/eoc_director)
      // sees the "Activate" SideNav group's "Incidents" item, per the UX
      // mockup's Navigation Map. Reuses the same role_permissions-driven
      // derivation 01-03 established for the Admin group — this is the
      // single cross-cutting fix reconciling 02-01's newly-seeded
      // `incidents` permissions with the nav the shell actually renders.
      const hasIncidents = permRows.some((r) => r.feature === 'incidents' && r.actions.length > 0);

      const nav_groups = [
        ...(hasIncidents
          ? [
              {
                label: 'Activate',
                items: [{ id: 'incidents', label: 'Incidents', icon: 'flag', href: '/incidents' }],
              },
            ]
          : []),
        ...(hasAdmin ? [{ label: 'Admin', items: ADMIN_NAV_ITEMS }] : []),
      ];

      return reply.code(200).send({ nav_groups });
    },
  );

  // F8 admin console backend surface (S8.2-S8.5): users, roles, SSO
  // config, audit log — each route guarded by its own
  // requirePermission('admin', <action>) preHandler.
  await app.register(adminUsersRoutes);
  await app.register(adminRolesRoutes);
  await app.register(adminSsoConfigRoutes);
  await app.register(adminAuditRoutes);
}
