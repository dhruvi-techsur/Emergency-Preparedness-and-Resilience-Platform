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
      // Phase 3 (F3): any role holding ANY 'plans' permission (03-07's
      // seed grants view-only to incident_commander/field_responder,
      // create/edit to planning_logistics_chief, and view+review to
      // eoc_director) sees the "Prepare" SideNav group's "Plans &
      // playbooks" item, per the UX mockup's Navigation Map
      // (`SideNav → Prepare: "Plans & playbooks"`). Same
      // role_permissions-driven derivation pattern as `hasIncidents`/
      // `hasAdmin` above.
      const hasPlans = permRows.some((r) => r.feature === 'plans' && r.actions.length > 0);
      // Phase 3 (F4, 03-06): any role holding ANY 'tasks' permission
      // (03-07's seed grants view-only to field_responder, full
      // create/edit to incident_commander/eoc_director/
      // planning_logistics_chief) sees the "Coordinate" SideNav group's
      // "Tasks" item; any role holding ANY 'resource_requests' permission
      // sees "Resources" in the SAME group, per the UX mockup's Navigation
      // Map (`SideNav → Coordinate: "Tasks"` / `SideNav → Coordinate:
      // "Resources"`). Same role_permissions-driven derivation pattern as
      // hasPlans/hasIncidents/hasAdmin above. A role might hold one
      // permission without the other (e.g. a hypothetical view-only-tasks-
      // but-no-resource-requests role), so each item is independently
      // gated and the group itself only renders if at least one item
      // would appear in it.
      const hasTasks = permRows.some((r) => r.feature === 'tasks' && r.actions.length > 0);
      const hasResourceRequests = permRows.some(
        (r) => r.feature === 'resource_requests' && r.actions.length > 0,
      );
      // Phase 4 (F5, 04-05): any role holding ANY 'notifications' permission
      // (04-04's seed grants view-only to field_responder, view+create to
      // eoc_director/planning_logistics_chief, and the full view+create+
      // approve set to incident_commander alone, per PER-02's PIO-merge
      // approval authority) sees "Notifications" in the SAME "Coordinate"
      // SideNav group 03-06 created — same role_permissions-driven
      // derivation pattern as hasTasks/hasResourceRequests above. This
      // plan's Task 3 appends to the EXISTING "Coordinate" group rather
      // than creating a duplicate key, per this plan's own documented
      // append-not-overwrite convention (shared with 04-06, same wave).
      const hasNotifications = permRows.some(
        (r) => r.feature === 'notifications' && r.actions.length > 0,
      );
      // Phase 4 (F7, 04-06): any role holding ANY 'reporting' permission
      // (04-04's seed grants the full view/create/edit set to
      // planning_logistics_chief, view+create to incident_commander/
      // eoc_director, and view-only to field_responder) sees a NEW
      // "Improve" SideNav group with "Evidence log" and "Analytics" items
      // — per the UX mockup's Navigation Map
      // (`SideNav → Improve: "Reports" → sub-tab "Analytics"`, and the
      // Evidence Log living under its OWN F7-aggregate route per this
      // plan's own documented distinction from 01-11's existing
      // `/admin/audit-log`). This is a brand-new group key (not an
      // append to an existing one), so no collision with 04-05 (same
      // wave)'s "Coordinate" append is possible — each plan's Task 3
      // appends only to the groups/keys it actually owns.
      const hasReporting = permRows.some((r) => r.feature === 'reporting' && r.actions.length > 0);
      // Phase 5 (F6, 05-04): any role holding ANY 'field_reports'
      // permission (05-05's seed grants view/create/resolve to
      // field_responder, view+resolve to incident_commander/eoc_director,
      // and view-only to planning_logistics_chief) sees the field-mobile
      // 4-item bottom bar, per the UX mockup's Navigation Map. This is
      // the FIRST plan to actually populate/read role_landing_config's
      // intended field-mobile destination set — the schema has existed
      // since Phase 1's migration (01-01) but nothing consumed it until
      // now. Same role_permissions-driven derivation pattern as
      // hasIncidents/hasAdmin/hasReporting above.
      const hasFieldReports = permRows.some(
        (r) => r.feature === 'field_reports' && r.actions.length > 0,
      );

      const nav_groups = [
        ...(hasPlans
          ? [
              {
                id: 'prepare',
                label: 'Prepare',
                items: [{ id: 'plans', label: 'Plans & playbooks', icon: 'file', href: '/plans' }],
              },
            ]
          : []),
        // Phase 2 (F2/F11, 02-07): the operating picture reads incident
        // data and is gated server-side by the SAME 'incidents'/'view'
        // permission as the markers/layers endpoints
        // (backend/src/modules/incident-ops/operating-picture.ts) — the
        // FRD doesn't name a separate "operating-picture" feature
        // permission string, so this reuses `hasIncidents` rather than
        // inventing a new one. Per the UX mockup's Navigation Map
        // ("Reached from: SideNav → Monitor: 'Operating picture'"), this
        // is its own "Monitor" group, distinct from "Activate".
        ...(hasIncidents
          ? [
              {
                id: 'monitor',
                label: 'Monitor',
                items: [
                  { id: 'operating-picture', label: 'Operating picture', icon: 'map', href: '/operating-picture' },
                ],
              },
            ]
          : []),
        ...(hasIncidents
          ? [
              {
                id: 'activate',
                label: 'Activate',
                items: [{ id: 'incidents', label: 'Incidents', icon: 'flag', href: '/incidents' }],
              },
            ]
          : []),
        ...(hasTasks || hasResourceRequests || hasNotifications
          ? [
              {
                id: 'coordinate',
                label: 'Coordinate',
                items: [
                  ...(hasTasks
                    ? [{ id: 'tasks', label: 'Tasks', icon: 'check', href: '/tasks' }]
                    : []),
                  ...(hasResourceRequests
                    ? [{ id: 'resource-requests', label: 'Resources', icon: 'truck', href: '/resource-requests' }]
                    : []),
                  // 04-08 (gap closure): 'Notifications' now points at a
                  // dedicated landing page (`NotificationsLanding.tsx`)
                  // whose own primary action reaches Compose; 'Message
                  // templates' remains its own direct sub-item. This
                  // satisfies the UX mockup's Navigation Map
                  // OR-requirement for Compose's two independent
                  // reach-paths (landing page primary action / Incident
                  // Workspace action, 04-07) — 04-05 had wired only the
                  // Groups/Templates sub-screens here with no standalone
                  // landing route at all.
                  ...(hasNotifications
                    ? [
                        {
                          id: 'notification-groups',
                          label: 'Notifications',
                          icon: 'bell',
                          href: '/notifications',
                        },
                        {
                          id: 'message-templates',
                          label: 'Message templates',
                          // 'file-text' is used by 01-03's pre-existing
                          // ADMIN_NAV_ITEMS above but isn't actually a
                          // member of the design system's ICON_NAMES set
                          // (confirmed against Icon.tsx) — a pre-existing
                          // gap out of this plan's scope to fix. Using
                          // 'file' (a real icon) here avoids repeating
                          // that same mismatch in a newly-added item.
                          icon: 'file',
                          href: '/notifications/templates',
                        },
                      ]
                    : []),
                ],
              },
            ]
          : []),
        // Phase 4 (F7, 04-06): new "Improve" group, independent of
        // 04-05's "Coordinate" append above — SITREP/AAR generation is
        // reached from the Incident Workspace's own Reports-tab actions
        // (04-07 wires that entry point), not a top-level nav item, per
        // the mockup's Navigation Map.
        ...(hasReporting
          ? [
              {
                id: 'improve',
                label: 'Improve',
                items: [
                  {
                    id: 'evidence-log',
                    label: 'Evidence log',
                    icon: 'file',
                    href: '/reports/evidence-log',
                  },
                  {
                    id: 'analytics',
                    label: 'Analytics',
                    icon: 'layers',
                    href: '/reports/analytics',
                  },
                ],
              },
            ]
          : []),
        // Phase 5 (F6, 05-04): the field-mobile bottom bar's 4 fixed
        // destinations, per the mockup's Field Home screen layout
        // (`[Tasks][Report][Map][Profile]`).
        //
        // review finding B3 (fixed): "Tasks" maps to `/field/tasks` (My
        // Tasks, field view), NOT `/field` (Field Home) — re-reading the
        // mockup's Navigation Map row-by-row: Field Home's own row reads
        // "Reached from: App shell (sign-in default for PER-04) | Nav
        // element: Bottom bar: 'Tasks' (landing)" — the "(landing)"
        // qualifier there describes Field Home's OWN reach path (you
        // land there once, straight out of sign-in, not via a nav tap),
        // not a claim that the bottom bar's "Tasks" item points AT
        // Field Home. My Tasks' own very next row is explicit and
        // unqualified: "Reached from: Field Home bottom bar | Nav
        // element: Bottom bar: 'Tasks'" — i.e. the bottom bar's "Tasks"
        // item is My Tasks' (not Field Home's) reach path. Field Home
        // itself has NO bottom-bar nav element at all (it's the sign-in
        // landing screen you start on, the same way AppShell's admin
        // nav doesn't need a nav item pointing at itself) — getting this
        // backwards made `/field/tasks` a real, built, routed screen
        // with zero nav reach, an orphan reachable only by typing the
        // URL directly (the exact condition 05-04's own must-have truth
        // rules out).
        //
        // review finding (post-B3 regression): the desktop Coordinate
        // group's pre-existing `{id:'tasks', label:'Tasks', href:'/tasks'}`
        // (03-06) and this Field group's `{id:'field-tasks', href:
        // '/field/tasks'}` both rendered the exact label "Tasks" for any
        // role holding BOTH `tasks` and `field_reports` permissions (e.g.
        // incident_commander), producing two ambiguous identically-
        // labeled SideNav links to two different screens. The mockup
        // itself only ever names this screen "My Tasks (field view)" /
        // component `MyTasksField` — its own Navigation Map and screen
        // heading never call it bare "Tasks" outside the bottom-bar's
        // space-constrained 4-icon mobile mockup glyph, which this
        // desktop-rendered SideNav item isn't bound to reproduce
        // verbatim. Relabeling to "My Tasks" (matching the screen's own
        // documented name everywhere else) disambiguates the two items
        // without touching either href — `/field/tasks` remains reachable
        // (B3 stays fixed) and `/tasks` is untouched.
        //
        // UAT round 1 (gap ref UAT-1, major) found this 4th item's "Profile"
        // label ambiguous: it routes to `/field` (Field Home — the screen
        // combining today's task list WITH the sticky Report button), but a
        // user scanning the 4 Field-group labels naturally clicked "My
        // Tasks" first (the narrower, Report-button-less `/field/tasks`)
        // looking for exactly that combined view, and never discovered that
        // the unrelated-sounding "Profile" label was the actual landing
        // screen they wanted. Relabeling to "Field home" (and swapping the
        // icon from the people-glyph `'users'` to `'home'`) signals what the
        // destination actually is without touching the item's `id` or
        // `href` — nothing else keys off either, and the real profile menu
        // remains reachable via AppShell's own header Avatar/
        // profileMenuOpen toggle (visible at every breakpoint, including
        // below bp-md) exactly as before this fix.
        ...(hasFieldReports
          ? [
              {
                id: 'field',
                label: 'Field',
                items: [
                  { id: 'field-tasks', label: 'My Tasks', icon: 'flag', href: '/field/tasks' },
                  { id: 'field-report', label: 'Report', icon: 'send', href: '/field/report' },
                  { id: 'field-map-nav', label: 'Map', icon: 'map', href: '/field/map' },
                  { id: 'field-profile', label: 'Field home', icon: 'home', href: '/field' },
                ],
              },
            ]
          : []),
        ...(hasAdmin ? [{ id: 'admin', label: 'Admin', items: ADMIN_NAV_ITEMS }] : []),
      ];

      // `permissions`: the signed-in user's full feature->actions map,
      // piggybacked on this already-fetched role_permissions query. 04-05's
      // ComposeNotification.tsx reads this (via the same react-query cache
      // key this page's own AppShell.tsx query already populates) to
      // proactively disable "Approve and send" for a non-approver BEFORE
      // any API round-trip, rather than inventing a second dedicated
      // endpoint for what is, functionally, the same role_permissions read
      // this route already performs for nav derivation.
      const permissions: Record<string, string[]> = {};
      for (const row of permRows) {
        permissions[row.feature] = row.actions;
      }

      return reply.code(200).send({ nav_groups, permissions });
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
