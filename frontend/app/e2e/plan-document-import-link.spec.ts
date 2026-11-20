import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
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
 *
 * 08-10 (UAT gap ref 4 closure): 08-09 shipped a NEW backend route,
 * POST /api/v1/plans/import, that lands an import/link as a real,
 * GET-reachable Plan — either a brand-new Draft/v1 plan or an attachment
 * to an existing in-scope plan the caller explicitly picks. This spec's
 * tests 2/4 are updated to drive the modal's new target-plan choice (the
 * modal now REQUIRES one before submitting) and assert the full visible
 * outcome: navigation to the resulting Plan Detail page, a real Draft
 * status Badge, and (test 5) the Plans & playbooks list reflecting the
 * new plan — directly closing the "doesn't take me anywhere... Plans &
 * playbooks list is unchanged" user report.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

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

/** planner@epmp.local's own jurisdiction_scope — used to fill the new-plan
 * jurisdiction Combobox by NAME, following
 * plan-live-link-flagged-review.spec.ts's own established "use the
 * signed-in user's own jurisdiction_scope" pattern rather than assuming a
 * specific seeded jurisdiction name. */
async function getOwnJurisdictionName(page: Page): Promise<string> {
  const me = await apiFetchViaPage<{ jurisdiction_scope: string[] }>(page, '/api/v1/me');
  const jurisdictionId = me.body.jurisdiction_scope[0];
  const jurisdictionsResult = await apiFetchViaPage<{ items: { id: string; name: string }[] }>(
    page,
    '/api/v1/jurisdictions',
  );
  const jurisdiction = jurisdictionsResult.body.items.find((j) => j.id === jurisdictionId);
  return jurisdiction!.name;
}

test.describe.serial('Plan Repository — Import from document system (F17)', () => {
  // Serial tests share state: test 2 creates a real plan via "Create a
  // new plan" (targetMode's default), and tests 4/5 reference it by id/name
  // directly rather than re-deriving it.
  let importedPlanId: string;
  let importedPlanName: string;

  test.afterAll(async () => {
    await pool.end();
  });

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

  test('2. Selecting a document and choosing Import copy creates a new plan and navigates there', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    const jurisdictionName = await getOwnJurisdictionName(page);

    await page.getByRole('button', { name: 'Import plan' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByText('Regional EOP')).toBeVisible({ timeout: 10_000 });

    await modal.getByText('Regional EOP').click();

    // targetMode defaults to 'new' — fill in the jurisdiction Combobox
    // (required) using the signed-in user's own jurisdiction_scope. The
    // plan name is pre-filled from the selected document's own name via a
    // post-selection effect; wait for it to land, then make it unique
    // (the field is documented as "editable", not just read-only
    // pre-fill) so repeated suite runs against this shared compose DB
    // never collide on a prior run's identically-named "Regional EOP"
    // plan when the Combobox/list lookups below filter by name.
    const planNameField = modal.getByLabel('Plan name', { exact: false });
    await expect(planNameField).toHaveValue('Regional EOP', { timeout: 10_000 });
    importedPlanName = `Regional EOP E2E ${Date.now()}`;
    await planNameField.fill(importedPlanName);

    const jurisdictionInput = modal.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill(jurisdictionName);
    await modal.getByRole('option', { name: jurisdictionName }).click();

    await page.getByRole('button', { name: 'Import copy' }).click();

    // Navigation to a real, NEW Plan Detail page — not a silent no-op.
    await expect(page).toHaveURL(/\/plans\/[0-9a-f-]+$/, { timeout: 10_000 });
    const match = page.url().match(/\/plans\/([0-9a-f-]+)$/);
    importedPlanId = match![1];

    // The resulting plan is Draft/v1 per the FRD's literal default flow.
    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Draft' }),
    ).toBeVisible({ timeout: 10_000 });

    // No lingering modal or error Alert.
    await expect(page.getByRole('dialog')).toHaveCount(0);
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

  test('4. Link live mode attaches to an existing plan and navigates to that same plan', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    await page.getByRole('button', { name: 'Import plan' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByText('Flood Response SOP')).toBeVisible({ timeout: 10_000 });

    await modal.getByText('Flood Response SOP').click();

    // Switch to "Attach to an existing plan" and pick the plan Test 2
    // created — a reliable, already-known target since these tests share
    // state via test.describe.serial.
    await modal.getByLabel('Where should this go?', { exact: false }).selectOption('existing');

    const existingPlanInput = modal.getByLabel('Existing plan', { exact: false });
    await existingPlanInput.click();
    await existingPlanInput.fill(importedPlanName);
    await modal.getByRole('option', { name: importedPlanName }).click();

    await page.getByRole('button', { name: 'Link live' }).click();

    // Navigation to THAT SAME plan's detail page (same id as Test 2's
    // result) — not a new, second plan.
    await expect(page).toHaveURL(new RegExp(`/plans/${importedPlanId}$`), { timeout: 10_000 });
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('.ep-alert--danger')).toHaveCount(0);

    // Direct Postgres confirmation: a mode='link_live' document_links row
    // now exists for DOC-SOP-002, attached to THAT plan's id — reusing
    // this file's own established direct-DB-confirmation convention
    // (operating-picture-facility-markers.spec.ts /
    // plan-live-link-flagged-review.spec.ts).
    const rows = await pool.query<{ mode: string; external_document_id: string; plan_id: string }>(
      `SELECT mode, external_document_id, plan_id FROM document_links
       WHERE plan_id = $1 AND external_document_id = 'DOC-SOP-002' AND mode = 'link_live'`,
      [importedPlanId],
    );
    expect(rows.rows).toHaveLength(1);
    expect(rows.rows[0].plan_id).toBe(importedPlanId);
  });

  test('5. The imported plan is immediately visible in the Plans & playbooks list', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/plans');

    // Directly closes the UAT-reported "Plans & playbooks list is
    // unchanged before and after" symptom — the new/updated plan from
    // Test 2 (now also carrying Test 4's link_live attachment) must be
    // visibly present in the list without any special filter or search.
    await expect(page.getByText(importedPlanName)).toBeVisible({ timeout: 10_000 });
  });
});
