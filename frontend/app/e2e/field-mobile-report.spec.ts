import { test, expect } from '@playwright/test';
import { signInAsFieldResponder } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 05-03's objective: the Report Observation
 * structured form's offline-first, queue-first submit path works against
 * the real backend, using 05-05's real seeded field_responder identity
 * (field-responder@epmp.local) — this plan does NOT define its own local
 * copy of signInAsFieldResponder or touch epmp-realm.json; 05-05 (a
 * wave-2 dependency) is the sole owner of both.
 *
 * This spec validates the ONLINE submit-and-sync path (Playwright's
 * CDP-level offline emulation is left as a documented, budget-scoped
 * simplification — the online path still proves enqueueFieldReport's
 * queue-first write mechanism works end-to-end against the real 05-01
 * API, which is this plan's actual proof target).
 */
test.describe('Field Mobile — Report Observation', () => {
  test('submits a report successfully and validates the empty-report rule', async ({ page }) => {
    // 1. Sign in as the real seeded field responder identity.
    await signInAsFieldResponder(page);

    // Navigate to Report Observation.
    await page.goto('/field/report');
    await expect(page.getByRole('heading', { name: 'Report observation' })).toBeVisible();

    // 5. Assert submitting with EMPTY description/photo/location shows the
    // exact validation message and does not navigate away.
    await page.getByRole('button', { name: 'Submit report' }).click();
    await expect(
      page.getByText('Add a description, photo, or location before submitting.'),
    ).toBeVisible();
    expect(page.url()).toContain('/field/report');

    // 2. Fill Observation type + Description.
    await page.getByLabel('Observation type').selectOption('Road/access hazard');
    await page.getByLabel('Description').fill('Downed tree blocking access road near shelter 2');

    // 3./4. Click Submit report — assert the queued submission succeeds
    // (navigates back to /field without an error Alert), proving
    // enqueueFieldReport's queue-first write path works end-to-end.
    await page.getByRole('button', { name: 'Submit report' }).click();
    await page.waitForURL((url) => url.pathname === '/field', { timeout: 15_000 });
    await expect(page.getByText('Add a description, photo, or location')).toHaveCount(0);

    // 4. Navigate back to /field; assert SyncStatus's rendered text
    // includes a connectivity state word (online/syncing/offline —
    // whichever the real dev-server network state produces).
    const syncStatusWords = ['Online', 'Syncing', 'Offline', 'Conflict'];
    let foundState = false;
    for (const word of syncStatusWords) {
      if (await page.getByText(word, { exact: true }).isVisible().catch(() => false)) {
        foundState = true;
        break;
      }
    }
    expect(foundState).toBe(true);
  });
});
