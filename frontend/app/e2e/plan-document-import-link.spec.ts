import { test, expect, type Page } from '@playwright/test';
import { signInAsPlanningChief } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 08-05's objective: the Plan Repository's
 * "Import plan" action is a real, enabled entry point opening
 * ImportDocumentModal, consuming Plan 08-02's permission-aware document
 * adapter — a user browses/searches the simulated SharePoint-class
 * catalog and sees ONLY the documents their own delegated permissions
 * cover (the withheld third document is genuinely absent from the DOM,
 * not merely hidden), then imports a point-in-time copy or establishes a
 * live link. A direct API bypass of the browse UI for the withheld
 * document is still rejected server-side with a real 403, proving the
 * enforcement is not merely a UI omission (T-08-18/T-08-19's proof).
 *
 * Signs in as planner@epmp.local (planning_logistics_chief role) — 03-07's
 * seed grants this role `plans` view/create/edit, which document-adapter.ts's
 * routes gate on ('plans'/'view' for browse, 'plans'/'edit' for
 * import/link). No new sign-in helper needed; this plan reuses
 * signInAsPlanningChief exactly as 03-05/plans.spec.ts already does.
 *
 * Plan 08-02's document-adapter.ts lazily seeds EACH caller's own
 * simulated per-user access set the first time ANY of its three routes is
 * called for that userId — granting DOC-EOP-001/DOC-SOP-002 and
 * withholding DOC-ANNEX-003, deterministically, for every user. This test
 * relies on that fixed, documented split exactly as 08-02-SUMMARY.md
 * describes it.
 */

/** Reads the session token straight out of sessionStorage (same key
 * src/auth/session-storage.ts owns) and issues a real fetch through the
 * SAME origin the page is already on — same convention ics-form-aidraft.spec.ts
 * and notifications-compose.spec.ts already establish for direct-API
 * test-fixture/bypass calls. */
async function apiFetchViaPage<T>(
  page: Page,
  path: string,
  init?: { method?: string; body?: object },
): Promise<{ status: number; body: T }> {
  return page.evaluate(
    async ({ path, method, body }) => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch(path, {
        method: method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      return { status: res.status, body: json };
    },
    { path, method: init?.method, body: init?.body },
  );
}

test.describe.serial('Plan Repository — Import from document system (F17)', () => {
  test('1. Import plan opens the document browse modal and shows only permitted documents', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    await page.getByRole('button', { name: 'Import plan' }).click();
    await expect(
      page.getByRole('heading', { name: 'Import from document system' }),
    ).toBeVisible({ timeout: 10_000 });

    // Leave the search field empty — browseDocuments() with an empty query
    // matches all documents WITHIN the user's own access set.
    const modal = page.getByRole('dialog');
    await expect(modal.getByText('Regional EOP')).toBeVisible({ timeout: 10_000 });
    await expect(modal.getByText('Flood Response SOP')).toBeVisible();

    // The withheld third document must be genuinely ABSENT from the DOM
    // anywhere within the modal — not grayed out, not shown-then-blocked.
    await expect(modal.getByText('Hazmat Annex')).toHaveCount(0);
  });

  test('2. Selecting a document and choosing Import copy succeeds', async ({ page }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    await page.getByRole('button', { name: 'Import plan' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByText('Regional EOP')).toBeVisible({ timeout: 10_000 });

    await modal.getByText('Regional EOP').click();
    await page.getByRole('button', { name: 'Import copy' }).click();

    // Modal closes, no error Alert remains.
    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator('.ep-alert--danger')).toHaveCount(0);
  });

  test('3. A direct API import attempt for an out-of-permission document is rejected server-side', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    // DOC-ANNEX-003 is NEVER shown in this user's browse results (Test 1) —
    // calling the import route directly, bypassing the browse UI entirely,
    // proves the server re-checks permission at call time rather than
    // relying solely on the UI never offering it.
    const result = await apiFetchViaPage<{ error_code: string; message: string }>(
      page,
      '/api/v1/integrations/documents/DOC-ANNEX-003/import',
      { method: 'POST', body: {} },
    );

    expect(result.status).toBe(403);
    expect(result.body.error_code).toBe('IMPORT_PERMISSION_DENIED');
  });

  test('4. Link live mode succeeds for a permitted document', async ({ page }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    await page.getByRole('button', { name: 'Import plan' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByText('Flood Response SOP')).toBeVisible({ timeout: 10_000 });

    await modal.getByText('Flood Response SOP').click();
    await page.getByRole('button', { name: 'Link live' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator('.ep-alert--danger')).toHaveCount(0);
  });
});
