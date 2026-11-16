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

export async function signInThroughKeycloak(page: Page): Promise<void> {
  await page.goto('/');

  // RouteGuard sees no session token, redirects the whole browser to
  // Keycloak's authorization endpoint (oidc-config.ts's signIn()).
  await page.waitForURL(/\/realms\/epmp\/protocol\/openid-connect\/auth/, {
    timeout: 15_000,
  });
  expect(page.url()).toContain('/realms/epmp/protocol/openid-connect/auth');

  // Keycloak's default login theme form field ids.
  await page.fill('#username', KEYCLOAK_USERNAME);
  await page.fill('#password', KEYCLOAK_PASSWORD);
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
