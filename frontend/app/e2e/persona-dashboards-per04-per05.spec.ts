import { test, expect } from '@playwright/test';
import { signInAsFieldResponder, signInThroughKeycloak } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of this plan's objective (F18 S18.4/S18.5):
 * PER-04 (field_responder) lands on a bottom-bar-only shell with NO
 * desktop SideNav rail at ANY viewport width, and PER-05 (secops_admin)
 * defaults to the admin facet, only switches to the executive-briefing
 * facet via an explicit FacetToggle click, and the facet never
 * persists/auto-restores across a reload.
 *
 * Both seeded identities already exist from prior phases —
 * field-responder@epmp.local (05-05) and admin@epmp.local (Phase 1) — so
 * this spec imports `signInAsFieldResponder`/`signInThroughKeycloak`
 * rather than defining new sign-in helpers (see this plan's own
 * SUMMARY.md for the full deviation record: the plan's "seed 2 new
 * Keycloak identities" instruction was based on a stale assumption,
 * mirroring 06-06's identical discovery for its own two identities).
 */

test.describe('Persona dashboards — Field Home (PER-04) bottom-bar-only + Executive facet (PER-05)', () => {
  test('1. field_responder lands on /field with bottom-bar-only navigation at a DESKTOP viewport — proving the override is role-driven, not viewport-driven', async ({
    page,
  }) => {
    // Desktop viewport size, set BEFORE sign-in — proves AppShell's
    // forcedBottomBar override (Task 2) fires regardless of viewport,
    // not just under the bp-md breakpoint every other role uses.
    await page.setViewportSize({ width: 1280, height: 800 });

    await signInAsFieldResponder(page);

    await expect(page).toHaveURL(/\/field$/, { timeout: 10_000 });

    const bottomBar = page.locator('nav[aria-label="Primary"].ep-sidenav--bottom-bar');
    await expect(bottomBar).toBeVisible({ timeout: 10_000 });

    // NO desktop rail anywhere in the DOM — not merely hidden via CSS.
    const railNav = page.locator('nav[aria-label="Primary"].ep-sidenav--rail');
    await expect(railNav).toHaveCount(0);

    // Exactly 4 bottom-bar items, per F18's "exactly 4 destinations" rule.
    const items = bottomBar.locator('.ep-sidenav__bottom-item-wrap');
    await expect(items).toHaveCount(4);
  });

  test('2. secops_admin lands on the admin facet by default — FacetToggle visible, Admin SideNav items shown, no Executive items', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);

    // Unchanged from Phase 1's existing default (06-02's seeded PER-05
    // default_landing_route) — this plan does not alter the admin facet's
    // landing route, only adds the toggle to switch away from it.
    await expect(page).toHaveURL(/\/admin\/platform-monitoring$/, { timeout: 10_000 });

    const facetToggle = page.getByLabel('Facet');
    await expect(facetToggle).toBeVisible({ timeout: 10_000 });
    await expect(facetToggle).toHaveValue('admin');

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav.getByText('Admin', { exact: true })).toBeVisible();
    await expect(sideNav.getByText('Executive dashboard', { exact: true })).toHaveCount(0);
    await expect(sideNav.getByText('Users', { exact: true })).toBeVisible();
  });

  test('3. Selecting Executive in the FacetToggle swaps the SideNav to exactly Executive dashboard / Reports, replacing Admin entirely, with no auto-navigation', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await expect(page).toHaveURL(/\/admin\/platform-monitoring$/, { timeout: 10_000 });

    const facetToggle = page.getByLabel('Facet');
    await expect(facetToggle).toBeVisible({ timeout: 10_000 });

    const urlBeforeToggle = page.url();
    await facetToggle.selectOption('executive');

    // Facet-switching alone does NOT navigate anywhere — the URL stays on
    // the admin facet's own route; navigating is the content area's own
    // responsibility (e.g. clicking the new SideNav link), not the
    // toggle's.
    await expect(page).toHaveURL(urlBeforeToggle);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav.getByText('Executive dashboard', { exact: true })).toBeVisible();
    await expect(sideNav.getByText('Reports', { exact: true })).toBeVisible();

    // The Admin group is replaced ENTIRELY, not merely supplemented.
    await expect(sideNav.getByText('Admin', { exact: true })).toHaveCount(0);
    await expect(sideNav.getByText('Users', { exact: true })).toHaveCount(0);
  });

  test('4. /executive renders exactly 3 display-scale KPI numbers and zero chart/SVG elements', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await expect(page).toHaveURL(/\/admin\/platform-monitoring$/, { timeout: 10_000 });

    await page.goto('/executive');
    await expect(page.getByRole('heading', { name: 'Executive dashboard' })).toBeVisible({
      timeout: 10_000,
    });

    // Exactly 3 `.display`-scale KPI numbers — the FRD's own hard cap,
    // proven structurally true here since KPIS is a literal 3-entry array.
    const displayNumbers = page.locator('.ep-executive-dashboard .display');
    await expect(displayNumbers).toHaveCount(3);

    // Zero chart-related SVG anywhere in the page's main content area —
    // the mockup's own "no charts" rule, proven directly rather than
    // merely asserting what IS present.
    const svgCount = await page.locator('.ep-executive-dashboard svg').count();
    expect(svgCount).toBe(0);
  });

  test('5. Reloading while on /executive resets the FacetToggle to Admin — the facet never persists/auto-restores across a fresh mount', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await expect(page).toHaveURL(/\/admin\/platform-monitoring$/, { timeout: 10_000 });

    const facetToggle = page.getByLabel('Facet');
    await expect(facetToggle).toBeVisible({ timeout: 10_000 });
    await facetToggle.selectOption('executive');

    await page.goto('/executive');
    await expect(page.getByRole('heading', { name: 'Executive dashboard' })).toBeVisible({
      timeout: 10_000,
    });

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Executive dashboard' })).toBeVisible({
      timeout: 10_000,
    });

    // AppShell re-mounts fresh on reload — `facet` re-initializes to
    // 'admin' per its own useState initializer, never read back from any
    // persisted source. The FacetToggle control itself reflects this.
    const facetToggleAfterReload = page.getByLabel('Facet');
    await expect(facetToggleAfterReload).toHaveValue('admin');
  });
});
