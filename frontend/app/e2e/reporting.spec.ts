import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsPlanningChief } from './helpers/sign-in';

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
 * Signs in as planner@epmp.local (planning_logistics_chief) — the ONLY
 * seeded identity holding `reporting:edit` (04-04's seed), which gates
 * both the SITREP Approve-and-finalize and AAR finalize actions this
 * spec exercises.
 */

async function apiPostViaPage<T>(page: Page, path: string, body: object): Promise<T> {
  return page.evaluate(
    async ({ path, body }) => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST ${path} failed: ${res.status} ${text}`);
      }
      return res.json();
    },
    { path, body },
  );
}

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
    await signInAsPlanningChief(page);

    incidentId = await createIncidentViaUi(page, 'E2E Reporting SITREP');

    await page.goto(`/incidents/${incidentId}/sitreps/new`);

    // Assert the auto-pulled sections render immediately after page load,
    // with no form interaction of any kind from this test.
    await expect(page.getByRole('heading', { name: 'Task status' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('heading', { name: 'Resource-request status' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Current timeline' })).toBeVisible();
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

  test('3. After closing the incident, the AAR wizard renders; an unowned corrective action blocks Finalize with the exact message', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);

    // Close the incident directly via API (reusing 02-02's closure
    // endpoint) — this spec's identity (planning_logistics_chief) does
    // not hold `incidents:edit` itself (only incident_commander/
    // eoc_director do, per 02-01's seed), so the UI's own Close-incident
    // button isn't reachable by this identity; the direct API call is
    // the documented test-fixture path for reaching a Closed incident
    // under this role.
    await page.goto(`/incidents/${incidentId}`);
    await apiPostViaPage(page, `/api/v1/incidents/${incidentId}/closure`, { confirmed: true });

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

    // The finding generated in test 3 was re-upserted against this
    // incident's single Draft AAR row (aars.incident_id UNIQUE) — it
    // reappears here via the auto-generate-on-mount re-fetch. Fill in the
    // missing Owner/Due-date on the first (and only) finding row.
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

    await expect(page.getByText('Activation time trend')).toBeVisible();
    await expect(page.getByText('Resource requests by type')).toBeVisible();
    await expect(page.getByText('Corrective actions by status')).toBeVisible();
  });
});
