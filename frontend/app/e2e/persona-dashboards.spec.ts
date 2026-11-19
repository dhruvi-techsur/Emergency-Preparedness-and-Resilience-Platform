import { test, expect } from '@playwright/test';
import { signInAsEocDirector, signInAsPlanningChief } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of this plan's objective (F18 S18.1/S18.3):
 * PER-01 (eoc_director) lands on /dashboard with real Stat-tile data, and
 * PER-03 (planning_logistics_chief) lands on /my-work with its 3 named
 * primary actions — both via RouteGuard's landing-config-driven redirect
 * (06-02's GET /api/v1/me/landing-config) rather than a generic page. Also
 * proves the RBAC-driven nav-visibility pattern (Monitor group's new
 * "Signals" item, gated on `ai_assist`) this plan establishes for 06-07's
 * remaining personas to reuse.
 *
 * Reuses `signInAsEocDirector`/`signInAsPlanningChief` from
 * e2e/helpers/sign-in.ts (03-05's canonical helpers for these exact two
 * seeded identities — eocdirector@epmp.local/planner@epmp.local — which
 * already hold the `incidents`/`ai_assist` role_permissions and
 * jurisdiction_scope this plan's dashboards depend on) rather than
 * defining new ones: this plan's own backend/scripts/seed.ts audit found
 * these identities already seeded by 03-05 with exactly the eoc_director/
 * planning_logistics_chief roles this plan needs, so no new Keycloak
 * identity or seed.ts change was required (see this plan's own SUMMARY.md
 * for the full deviation record).
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, all already running
 * per this plan's execution environment.
 */

test.describe('Persona dashboards — EOC Dashboard (PER-01) and My Work (PER-03)', () => {
  test('1. eoc_director lands on /dashboard with 4 real Stat tiles', async ({ page }) => {
    await signInAsEocDirector(page);

    // RouteGuard's one-time landing-config redirect fires on the bare '/'
    // post-sign-in landing — assert we end up on /dashboard, not stuck on
    // '/' or any other path.
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();

    for (const label of [
      'Active incidents',
      'Open tasks',
      'Pending resource requests',
      'Notifications pending ack',
    ]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible({ timeout: 10_000 });
    }
  });

  test('2. planning_logistics_chief lands on /my-work with its 3 named primary actions', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);

    await expect(page).toHaveURL(/\/my-work$/, { timeout: 10_000 });

    const header = page.locator('.ep-page-header');
    await expect(header.getByRole('button', { name: 'Generate SITREP' })).toBeVisible({
      timeout: 10_000,
    });
    await expect(header.getByRole('button', { name: 'Review resource requests' })).toBeVisible();
    await expect(header.getByRole('button', { name: 'Review plan' })).toBeVisible();
  });

  test('3. planning_logistics_chief\u2019s SideNav shows Signals but not Admin', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await expect(page).toHaveURL(/\/my-work$/, { timeout: 10_000 });

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });

    // planning_logistics_chief holds `ai_assist` per 06-03's seed (granted
    // to PER-01/02/03) — Signals must be visible in the Monitor group.
    await expect(sideNav.getByText('Signals', { exact: true })).toBeVisible();

    // planning_logistics_chief holds no `admin` permission (02-01's own
    // seed decision, unchanged by this plan) — the whole Admin group must
    // be absent, not merely its items.
    await expect(sideNav.getByText('Admin', { exact: true })).toHaveCount(0);
  });

  test('4. eoc_director\u2019s rendered SideNav exactly matches a fresh GET /api/v1/me/nav-config fetch', async ({
    page,
  }) => {
    await signInAsEocDirector(page);
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });

    // Same proof pattern as 01-10's app-shell.spec.ts test 2: fetch
    // nav-config fresh using the session token already in storage, and
    // compare the exact label set against what's actually rendered — a
    // user never sees a SideNav group or action their role doesn't permit.
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

    const renderedLabels = await sideNav.locator('.ep-sidenav__item-label').allTextContents();

    expect(renderedLabels.map((l) => l.trim()).sort()).toEqual(expectedLabels);

    // Direct proof that Signals is actually among the matched set (not
    // just that both sides happen to agree on an empty/wrong set).
    expect(expectedLabels).toContain('Signals');
  });
});
