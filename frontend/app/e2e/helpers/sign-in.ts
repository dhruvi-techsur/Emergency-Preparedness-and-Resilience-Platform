import { expect, type Page } from '@playwright/test';

/**
 * Shared Keycloak sign-in flow, factored out of 01-10's app-shell.spec.ts
 * so 01-11's admin-users-roles.spec.ts doesn't duplicate it. Uses the
 * admin@epmp.local / devpass123 credentials seeded into Keycloak's `epmp`
 * realm (backend/keycloak/epmp-realm.json) — member of the `/epmp-admins`
 * group, JIT-provisioned to the `secops_admin` role by sso.ts's
 * group_to_role_mapping, which is the only role with `admin` feature
 * permissions (GET /api/v1/me/nav-config's hasAdmin check).
 */
export const KEYCLOAK_USERNAME = 'admin@epmp.local';
export const KEYCLOAK_PASSWORD = 'devpass123';

/**
 * Second seeded identity (02-05, backend/keycloak/epmp-realm.json's
 * "epmp-incident-commanders" group + backend/scripts/seed.ts's matching
 * group_to_role_mapping entry) — JIT-provisioned to the `incident_commander`
 * role, which is one of the two roles 02-01's seed actually grants
 * `incidents` permissions to. admin@epmp.local's `secops_admin` role
 * deliberately does NOT hold `incidents` permissions (seed.ts's own
 * documented decision), so incident-command e2e coverage needs this
 * separate identity rather than reusing the admin sign-in helper below.
 */
export const KEYCLOAK_COMMANDER_USERNAME = 'commander@epmp.local';
export const KEYCLOAK_COMMANDER_PASSWORD = 'devpass123';

async function signInAs(page: Page, username: string, password: string): Promise<void> {
  await page.goto('/');

  // RouteGuard sees no session token, redirects the whole browser to
  // Keycloak's authorization endpoint (oidc-config.ts's signIn()).
  await page.waitForURL(/\/realms\/epmp\/protocol\/openid-connect\/auth/, {
    timeout: 15_000,
  });
  expect(page.url()).toContain('/realms/epmp/protocol/openid-connect/auth');

  // Keycloak's default login theme form field ids.
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#kc-login');

  // Keycloak redirects back to /auth/callback, which (after the id_token
  // exchange with the backend) navigates to '/' — assert we land on a URL
  // that is NOT /auth/callback, proving the callback actually completed
  // and forwarded onward rather than hanging on the exchange.
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/callback'), {
    timeout: 15_000,
  });
  expect(page.url()).not.toContain('/auth/callback');
}

export async function signInThroughKeycloak(page: Page): Promise<void> {
  await signInAs(page, KEYCLOAK_USERNAME, KEYCLOAK_PASSWORD);
}

/** Signs in as the incident_commander-role seeded user (see doc comment above). */
export async function signInAsIncidentCommander(page: Page): Promise<void> {
  await signInAs(page, KEYCLOAK_COMMANDER_USERNAME, KEYCLOAK_COMMANDER_PASSWORD);
}
