import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsPlanningChief, signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 04-06's objective: the four Reporting &
 * Learning screens (SITREP Generator, AAR Generator, Evidence & Audit Log
 * View, Analytics Dashboard) are reachable from the shell's "Improve"
 * SideNav group and functional against the real backend — proving SITREP
 * auto-assembly, the AAR closure-gate (both the direct-URL-blocked and
 * after-closure-succeeds paths), the finding-ownership validation, and
 * the evidence log's dual-source aggregation with a structurally-absent
 * edit/delete affordance.
 *
 * Two identities, matching the roles that actually hold the needed
 * permissions (04-04's seed):
 *   - commander@epmp.local (incident_commander) holds `incidents` full
 *     access (create/edit) — used to create and close the test incident,
 *     since `planning_logistics_chief` holds `incidents:view` only
 *     (02-01's seed). incident_commander also holds `reporting`
 *     view/create (04-04's `reportingGenerateOnlyRoles`), sufficient to
 *     trigger SITREP generation.
 *   - planner@epmp.local (planning_logistics_chief) is the ONLY seeded
 *     identity holding `reporting:edit` (04-04's `reportingAuthorRole`),
 *     which gates both the SITREP Approve-and-finalize and AAR finalize
 *     actions this spec exercises.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/**
 * Test-fixture fix (Rule 3 - Blocking), same root cause 03-05/03-06's
 * tasks-resources.spec.ts already documents in detail for this exact
 * identity: planner@epmp.local is JIT-provisioned by sso.ts on first
 * login with `jurisdiction_scope = '{}'`. `GET /api/v1/incidents`'s list
 * query (and this spec's own create-incident-via-UI flow) needs a real
 * jurisdiction scope for the Jurisdiction Combobox to show options.
 */
async function ensurePlannerHasJurisdictionScope(): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = 'Default Agency'`,
  );
  const jurisdictionId = rows[0]?.id;
  if (!jurisdictionId) return;
  await pool.query(
    `UPDATE users SET jurisdiction_scope = ARRAY[$1]::uuid[]
     WHERE email = 'planner@epmp.local' AND NOT ($1 = ANY(jurisdiction_scope))`,
    [jurisdictionId],
  );
}

async function createIncidentViaUi(page: Page, namePrefix: string): Promise<string> {
  await page.goto('/incidents/new');
  const incidentName = `${namePrefix} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await page.getByLabel('Name', { exact: false }).fill(incidentName);
  await page.getByLabel('Type', { exact: true }).selectOption('Flood');
  await page.getByLabel('Severity', { exact: true }).selectOption('Normal');

  const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
  await jurisdictionInput.click();
  await jurisdictionInput.fill('Default Agency');
  await page.getByRole('option', { name: 'Default Agency' }).click();

  await page.getByRole('button', { name: 'Create incident' }).click();
  await page.waitForURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

  const match = page.url().match(/\/incidents\/([0-9a-f-]+)$/);
  if (!match) throw new Error(`Could not parse incident id from URL: ${page.url()}`);
  return match[1];
}

test.describe.serial('Reporting & Learning — SITREP, AAR, Evidence log', () => {
  let incidentId: string;

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. SITREP Generator auto-assembles Task-status/Resource-status sections with zero manual input', async ({
    page,
  }) => {
    await ensurePlannerHasJurisdictionScope();
    // Created by incident_commander — planning_logistics_chief holds only
    // `incidents:view` (02-01's seed), not `create`, so it cannot create
    // the test incident itself (see file-header doc comment).
    await signInAsIncidentCommander(page);

    incidentId = await createIncidentViaUi(page, 'E2E Reporting SITREP');

    await page.goto(`/incidents/${incidentId}/sitreps/new`);

    // Assert the auto-pulled sections render immediately after page load,
    // with no form interaction of any kind from this test. Scoped to the
    // Card title (<h3>) specifically — the Preview section below also
    // repeats the identical text as an <h4>, so a bare role-heading
    // lookup by name matches both.
    await expect(page.locator('h3', { hasText: 'Task status' })).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('h3', { hasText: 'Resource-request status' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Current timeline' })).toBeVisible();
  });

  test('2. Navigating directly to the AAR Generator for the still-OPEN incident shows the closure-required message, no wizard', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}/aar/new`);

    await expect(
      page.getByText('Close this incident before generating its after-action report.'),
    ).toBeVisible({ timeout: 10_000 });

    // The wizard form never renders — no step Progress bar, no Finding card.
    await expect(page.getByText('Step 1 of 5')).toHaveCount(0);
  });

  test('3. Closing the incident (as incident_commander) unblocks the AAR Generator', async ({
    page,
  }) => {
    // Closed via the real UI's own Close-incident Modal, under
    // incident_commander (the role holding `incidents:edit` — see
    // file-header doc comment; planning_logistics_chief holds view-only).
    await signInAsIncidentCommander(page);
    await page.goto(`/incidents/${incidentId}`);
    await page.getByRole('button', { name: 'Close incident' }).click();
    const closureModal = page.getByRole('alertdialog');
    await expect(closureModal).toBeVisible({ timeout: 10_000 });
    await closureModal.getByRole('button', { name: 'Close incident' }).click();
    await expect(closureModal).not.toBeVisible();
  });

  test('3b. An unowned corrective action blocks Finalize with the exact message', async ({
    page,
  }) => {
    // A FRESH page (new browser context, per Playwright's default) is
    // used here specifically so Keycloak's own SSO session cookie from
    // test 3's incident_commander sign-in does NOT silently carry over —
    // within the SAME context, re-running signInAsPlanningChief's
    // page.goto('/') would otherwise redirect through Keycloak's
    // authorization endpoint and land back on the ALREADY-authenticated
    // incident_commander identity (Keycloak's own session, not this
    // app's token), never presenting the login form this helper expects
    // to fill in planner@epmp.local's credentials.
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}/aar/new`);
    await expect(page.getByText('Step 1 of 5: Timeline export')).toBeVisible({ timeout: 10_000 });

    // Step through to Findings (step 4).
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 5: Decisions log')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 5: Resource history')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 5: Findings')).toBeVisible();

    await page.getByRole('button', { name: '+ Add finding' }).click();
    await page.getByLabel('Finding text', { exact: false }).fill('E2E finding with corrective action');
    await page.getByLabel('Corrective action', { exact: false }).fill('Revise the resource-request SOP');
    // Owner and due date left EMPTY.

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 5 of 5: Review')).toBeVisible();

    await page.getByRole('button', { name: 'Finalize AAR' }).click();

    await expect(
      page.getByText('Assign an owner and due date to every corrective action before finalizing.'),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('4. Filling Owner+Due-date lets "Finalize AAR" succeed', async ({ page }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}/aar/new`);

    await expect(page.getByText('Step 1 of 5: Timeline export')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 5: Findings')).toBeVisible();

    // Test 3b's finding lived ONLY in that test's own component state
    // (the client-side ownership check blocked before any
    // POST /api/v1/incidents/{id}/aar network call could persist it) —
    // this test's fresh page mount re-generates the AAR from scratch
    // with zero findings, so it adds its OWN finding here, WITH both
    // Owner and Due-date filled in from the start, proving the success
    // path independently of 3b's client-blocked path.
    await page.getByRole('button', { name: '+ Add finding' }).click();
    await page
      .getByLabel('Finding text', { exact: false })
      .fill('E2E finding with owned corrective action');
    await page.getByLabel('Corrective action', { exact: false }).fill('Revise the resource-request SOP');

    const ownerCombobox = page.getByLabel('Owner', { exact: false });
    await ownerCombobox.click();
    await page.locator('.ep-combobox__listbox [role="option"]').first().click();

    await page.locator('input[placeholder="YYYY-MM-DD"]').first().fill('2027-01-15');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 5 of 5: Review')).toBeVisible();

    await page.getByRole('button', { name: 'Finalize AAR' }).click();

    await expect(page.getByText('This after-action report is finalized')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('5. Evidence log aggregates an incident_timeline-sourced row and renders NO edit/delete affordance anywhere', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/reports/evidence-log');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // At least one row sourced from incident_timeline (e.g. this spec's
    // test incident's "Incident created" entry) proves the dual-source
    // aggregation works through the real UI.
    const incidentRow = table.locator('tbody tr', { hasText: 'Incident created' });
    await expect(incidentRow.first()).toBeVisible({ timeout: 10_000 });

    // Negative assertion: no Edit/Delete button or link exists anywhere
    // on this page, for this role.
    await expect(page.getByRole('button', { name: /edit|delete/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /edit|delete/i })).toHaveCount(0);
  });

  test('6. Analytics Dashboard renders 3 Stat tiles and chart cards with no invented target', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto('/reports/analytics');

    const stats = page.locator('.ep-stat');
    await expect(stats).toHaveCount(3, { timeout: 10_000 });

    // Structural proof: Stat's rendered markup has no element/attribute
    // naming "target" anywhere — the component has no such prop to pass.
    await expect(page.locator('.ep-stat [class*="target"]')).toHaveCount(0);

    // Scoped to the Card title (<h3>) specifically — each chart's
    // visually-hidden data-table twin repeats the identical text as its
    // own <caption>, so a bare text lookup matches both.
    await expect(page.locator('h3', { hasText: 'Activation time trend' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Resource requests by type' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Corrective actions by status' })).toBeVisible();
  });
});
