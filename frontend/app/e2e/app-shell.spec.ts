import { test, expect } from '@playwright/test';

/**
 * Full-stack e2e coverage of 01-10's objective: a real user signs in via
 * Keycloak OIDC SSO and lands in a role-scoped app shell with working theme
 * switching — not a generic landing page (success criterion 1).
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, all started by the
 * plan's documented <verify> pre-steps before this spec file runs. Uses the
 * admin@epmp.local / devpass123 credentials seeded into Keycloak's `epmp`
 * realm (backend/keycloak/epmp-realm.json) — that user is a member of the
 * `/epmp-admins` group, which sso.ts's group_to_role_mapping (seeded by
 * backend/scripts/seed.ts) JIT-provisions to the `secops_admin` role, which
 * in turn is the only role with `admin` feature permissions
 * (GET /api/v1/me/nav-config's hasAdmin check).
 */

const KEYCLOAK_USERNAME = 'admin@epmp.local';
const KEYCLOAK_PASSWORD = 'devpass123';

async function signInThroughKeycloak(page: import('@playwright/test').Page) {
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

test.describe('App shell — sign-in, role-scoped nav, theme', () => {
  test('1. Sign-in flow lands in a role-scoped shell, not a generic landing page', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);

    // SideNav visible with at least one Admin group item — proves the
    // shell resolved the SSO'd user's role (secops_admin) and rendered the
    // role-scoped nav, not a blank/generic screen.
    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await expect(sideNav.getByText('Admin', { exact: true })).toBeVisible();
    await expect(sideNav.getByText('Users', { exact: true })).toBeVisible();
  });

  test('2. Role-scoped nav items match GET /api/v1/me/nav-config exactly', async ({ page }) => {
    await signInThroughKeycloak(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });

    // Fetch nav-config directly using the same session token the app
    // stored in sessionStorage, then compare the exact label set against
    // what's actually rendered in the SideNav.
    const navConfig = await page.evaluate(async () => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/me/nav-config', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json() as Promise<{
        nav_groups: Array<{ label?: string; items: Array<{ label: string }> }>;
      }>;
    });

    const expectedLabels = navConfig.nav_groups.flatMap((g) => g.items.map((i) => i.label)).sort();

    const renderedLabels = await sideNav
      .locator('.ep-sidenav__item-label')
      .allTextContents();

    expect(renderedLabels.map((l) => l.trim()).sort()).toEqual(expectedLabels);
  });

  test('3. Theme switch applies instantly and persists across reload', async ({ page }) => {
    await signInThroughKeycloak(page);

    // Open the profile menu, then the ThemeSwitcher's Select.
    await page.getByRole('button', { name: /profile menu/i }).click();
    const themeSelect = page.getByLabel('Theme');
    await expect(themeSelect).toBeVisible();

    await themeSelect.selectOption('dark');

    // Instant: poll with a short timeout to prove this is synchronous, not
    // waiting on the background PATCH network round-trip.
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark', {
      timeout: 200,
    });

    // Persistent: reload, and the saved preference (fetched fresh via
    // GET /api/v1/me on the reloaded RouteGuard mount) must still be dark —
    // proving the background PATCH actually succeeded and was read back.
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark', {
      timeout: 10_000,
    });
  });

  test('4. Skip-to-content link is the first Tab stop', async ({ page }) => {
    await signInThroughKeycloak(page);

    // A fresh navigation leaves no element focused — pressing Tab once
    // immediately exercises "first focusable element in DOM order" without
    // any prior click (a click anywhere inside the rendered shell risks
    // landing on a real element — e.g. SideNav occupies the page's whole
    // left edge — and stealing focus before Tab is ever pressed).
    await page.reload();
    await page.waitForSelector('nav[aria-label="Primary"]');
    await page.keyboard.press('Tab');

    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBe('Skip to content');
  });
});
