import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { signInThroughKeycloak } from './helpers/sign-in';

/**
 * Closes UAT gap ref 4 ("WCAG contrast compliance across all three
 * themes"). Per the gap's own re-derivation: tokens.css defines complete
 * light/dark/contrast palettes and 23 unit tests confirm correct per-theme
 * CSS custom-property cascading, but no rendered-pixel contrast-ratio tool
 * was installed in this project to independently verify WCAG AA
 * compliance. This spec is that tool — a permanent regression asset,
 * re-run automatically by every future phase's test gates, not an
 * ephemeral one-off check.
 *
 * One test per theme (light/dark/contrast). Each test signs in through the
 * real Keycloak flow (reusing 01-10/11's shared helper rather than
 * duplicating it), switches theme via the REAL ThemeSwitcher Select
 * interaction (not a synthetic page.evaluate DOM mutation — the point is
 * to prove the actual switching path produces compliant contrast), then
 * runs @axe-core/playwright's color-contrast rule against both the signed-
 * in AppShell and /admin/audit-log (a DatePicker-bearing page — the exact
 * component/token pairing this gap's Task 1 fixed `--ink-disabled`
 * against, consumed by DatePicker.css's `.ep-datepicker__day--outside`
 * rule and mounted on AuditLogView.tsx/FederationGrants.tsx).
 *
 * The `.ep-datepicker__day--outside` cells (the only DOM elements that
 * render `--ink-disabled`) only exist while DatePicker's popover is open
 * (`DatePicker.tsx` conditionally renders `.ep-datepicker__popover` only
 * when its internal `open` state is true). So before scanning
 * /admin/audit-log, each test clicks the "Open calendar" IconButton (the
 * DatePicker's accessible trigger — see `DatePicker.tsx`) to mount the
 * popover and its calendar grid, otherwise axe-core never sees the
 * elements this token actually renders on.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + backend
 * dev server + this app's own Vite dev server — the same full-stack
 * dependency as every other *.spec.ts file in this directory. workers: 1
 * is already set in playwright.config.ts; not overridden here.
 */

type ThemeName = 'light' | 'dark' | 'contrast';

async function switchTheme(page: import('@playwright/test').Page, theme: ThemeName): Promise<void> {
  // Open the profile menu, then use ThemeSwitcher's real Select — the same
  // interaction pattern as app-shell.spec.ts test 3.
  const profileButton = page.getByRole('button', { name: /profile menu/i });
  const isMenuOpen = await page.getByLabel('Theme').isVisible().catch(() => false);
  if (!isMenuOpen) {
    await profileButton.click();
  }

  const themeSelect = page.getByLabel('Theme');
  await expect(themeSelect).toBeVisible();
  await themeSelect.selectOption(theme);

  await expect(page.locator('html')).toHaveAttribute('data-theme', theme, {
    timeout: 1_000,
  });
}

async function scanForColorContrastViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .include('.ep-shell')
    .analyze();

  return results.violations.filter((v) => v.id === 'color-contrast');
}

test.describe('WCAG contrast audit', () => {
  for (const theme of ['light', 'dark', 'contrast'] as ThemeName[]) {
    test(`${theme} theme — AppShell and /admin/audit-log have zero color-contrast violations`, async ({
      page,
    }) => {
      await signInThroughKeycloak(page);

      const sideNav = page.locator('nav[aria-label="Primary"]');
      await expect(sideNav).toBeVisible({ timeout: 10_000 });

      await switchTheme(page, theme);

      // 1. Scan the signed-in AppShell (SideNav + header + content area) in
      //    this theme.
      const shellViolations = await scanForColorContrastViolations(page);
      expect(
        shellViolations,
        `AppShell color-contrast violations in ${theme} theme:\n${JSON.stringify(shellViolations, null, 2)}`,
      ).toEqual([]);

      // 2. Navigate to the DatePicker-bearing admin page, in the SAME
      //    theme, and repeat — this is the exact component/token pairing
      //    this gap's Task 1 fixed --ink-disabled against
      //    (DatePicker.css's .ep-datepicker__day--outside rule).
      await page.goto('/admin/audit-log');
      await expect(page.locator('table.ep-table')).toBeVisible({ timeout: 10_000 });
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

      // Open the first DatePicker's calendar popover so the outside-month
      // day cells (the .ep-datepicker__day--outside rule that consumes
      // --ink-disabled) are actually mounted in the DOM when axe scans —
      // the popover is conditionally rendered only while open (see
      // DatePicker.tsx), so without this click the scan below would never
      // see the token's real render context.
      await page.getByRole('button', { name: 'Open calendar' }).first().click();
      await expect(page.locator('.ep-datepicker__popover')).toBeVisible({ timeout: 5_000 });

      const auditLogViolations = await scanForColorContrastViolations(page);
      expect(
        auditLogViolations,
        `/admin/audit-log color-contrast violations in ${theme} theme:\n${JSON.stringify(auditLogViolations, null, 2)}`,
      ).toEqual([]);

      // 3. The plan also named /admin/federation-grants as a second
      //    DatePicker-mounting screen (it shares the same DatePicker
      //    component/token as audit-log, but checking it directly covers
      //    the plan's full stated scope rather than relying on inference).
      //    Only exercised in dark theme — the theme this review's B1
      //    finding was specifically about — to avoid tripling runtime for
      //    a screen that shares the same component/token already proven
      //    compliant above.
      if (theme === 'dark') {
        await page.goto('/admin/federation-grants');
        await expect(page.getByRole('button', { name: 'Grant access' })).toBeVisible({
          timeout: 10_000,
        });
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        await page.getByRole('button', { name: 'Grant access' }).click();
        await page.getByRole('button', { name: 'Open calendar' }).first().click();
        await expect(page.locator('.ep-datepicker__popover')).toBeVisible({ timeout: 5_000 });

        const federationGrantsViolations = await scanForColorContrastViolations(page);
        expect(
          federationGrantsViolations,
          `/admin/federation-grants color-contrast violations in ${theme} theme:\n${JSON.stringify(federationGrantsViolations, null, 2)}`,
        ).toEqual([]);
      }
    });
  }
});
