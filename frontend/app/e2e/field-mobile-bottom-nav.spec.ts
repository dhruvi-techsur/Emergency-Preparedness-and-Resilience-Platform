import { test, expect } from '@playwright/test';
import { signInAsFieldResponder } from './helpers/sign-in';

/**
 * Gap closure regression for 05-UAT.md gap refs 8 (blocker) and 1 (major) —
 * both rooted in the SAME nav-config rendering mechanism but manifesting on
 * different viewports. Proves, against the real backend and the real seeded
 * field_responder identity (whose actual permission set — broad Phase 1-4
 * view-only grants plus field_reports — is what originally triggered both
 * gaps), that:
 *   1. On a mobile-width viewport, the bottom bar shows the Field group's
 *      own 4 items, not the first 4 items of the full flattened nav list.
 *   2. On a desktop-width viewport, the Field group's 4th SideNav item is
 *      labeled "Field home" (not "Profile"), signaling it's the
 *      tasks+Report-button landing screen.
 */
test.describe('Field-mobile bottom-nav + desktop label (UAT gap refs 8, 1)', () => {
  test('1. Mobile viewport: bottom bar shows My Tasks / Report / Map / Field home, never the desktop groups', async ({
    page,
  }) => {
    // Mobile-width viewport, below AppShell's bp-md (767px) threshold —
    // forces the isBelowBpMd branch so the bottom-bar SideNav renders.
    await page.setViewportSize({ width: 390, height: 844 });

    await signInAsFieldResponder(page);

    const bottomBar = page.locator('nav[aria-label="Primary"].ep-sidenav--bottom-bar');
    await expect(bottomBar).toBeVisible({ timeout: 10_000 });

    const renderedLabels = await bottomBar
      .locator('.ep-sidenav__bottom-label')
      .allTextContents();

    // Exactly the Field group's own 4 items, in the backend's declared order.
    expect(renderedLabels.map((l) => l.trim())).toEqual(['My Tasks', 'Report', 'Map', 'Field home']);

    // The pre-fix defect's wrong labels must NOT appear anywhere in the bar.
    for (const wrongLabel of ['Plans & playbooks', 'Operating picture', 'Incidents', 'Tasks']) {
      await expect(bottomBar.getByText(wrongLabel, { exact: true })).toHaveCount(0);
    }
  });

  test('2. Desktop viewport: Field group\'s 4th item reads "Field home" (not "Profile") and routes to /field', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    await signInAsFieldResponder(page);

    const railNav = page.locator('nav[aria-label="Primary"].ep-sidenav--rail');
    await expect(railNav).toBeVisible({ timeout: 10_000 });

    // The old "Profile" label must be gone from the Field group entirely.
    await expect(railNav.getByText('Profile', { exact: true })).toHaveCount(0);

    const fieldHomeLink = railNav.getByRole('link', { name: 'Field home' });
    await expect(fieldHomeLink).toBeVisible();
    await expect(fieldHomeLink).toHaveAttribute('href', '/field');

    // Clicking it actually lands on the combined tasks+Report-button screen
    // (FieldHome.tsx), not the narrower My Tasks (MyTasksField.tsx) screen —
    // closes UAT-1's actual user-facing confusion, not just the label text.
    await fieldHomeLink.click();
    await expect(page.getByRole('heading', { name: 'Field home' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Report observation' })).toBeVisible();
  });
});
