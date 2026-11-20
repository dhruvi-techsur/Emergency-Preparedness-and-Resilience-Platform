import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { query } from '../../db/client.js';

interface RoleLandingConfigRow {
  default_landing_route: string;
  nav_groups: unknown;
  mobile_bottom_bar_items: unknown;
}

interface NavGroup {
  label: string;
  items: Array<{ id: string; label: string; icon: string; href: string }>;
}

interface BottomBarItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface LandingConfig {
  default_route: string;
  nav_groups: NavGroup[];
  mobile_bottom_bar_items: BottomBarItem[];
}

interface RoleUnmappedFallback extends LandingConfig {
  error_code: 'ROLE_VIEW_UNMAPPED';
  message: string;
}

/**
 * F18 — resolves the signed-in user's own persona-specific landing route and
 * SideNav configuration from `role_landing_config` (the table 01-01's
 * migration created but explicitly left unpopulated, scoped as Phase 6/F18
 * work — see that migration's own inline NOTE and 06-02's seed additions).
 *
 * Query is keyed EXCLUSIVELY on `req.epmpUser!.role_id` (the session-bound,
 * server-resolved role) — the route accepts no parameters, so a caller can
 * never request another role's landing config (see this plan's threat
 * register, T-06-04).
 *
 * Per the FRD's documented "Role with no mapped default view" case: a role
 * with NO row (e.g. a hypothetical future role never seeded here) gets a
 * 200 — never a 404/500 — carrying the exact ROLE_VIEW_UNMAPPED fallback
 * payload and message, satisfying F18's Validation rule ("fallback to a
 * generic dashboard with an explicit note to contact an admin, never a
 * blank page").
 */
export default async function landingConfigRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/me/landing-config',
    { preHandler: requirePermission('platform', 'view') },
    async (req, reply) => {
      const rows = await query<RoleLandingConfigRow>(
        `SELECT default_landing_route, nav_groups, mobile_bottom_bar_items FROM role_landing_config WHERE role_id = $1`,
        [req.epmpUser!.role_id],
      );
      const row = rows[0];

      if (!row) {
        const fallback: RoleUnmappedFallback = {
          default_route: '/dashboard-unmapped',
          nav_groups: [],
          mobile_bottom_bar_items: [],
          error_code: 'ROLE_VIEW_UNMAPPED',
          message: "Your role doesn't have a default view configured yet. Contact your administrator.",
        };
        return reply.code(200).send(fallback);
      }

      const config: LandingConfig = {
        default_route: row.default_landing_route,
        nav_groups: (row.nav_groups ?? []) as NavGroup[],
        mobile_bottom_bar_items: (row.mobile_bottom_bar_items ?? []) as BottomBarItem[],
      };
      return reply.code(200).send(config);
    },
  );
}
