import { test, expect, type Page } from '@playwright/test';
import { signInThroughKeycloak, signInAsIncidentCommander, signInAsPlanningChief } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of Plan 09-04's objective: F16-roster's frontend
 * half — the read-only Personnel Roster admin screen (Provenance,
 * matched/unmatched Badges, zero edit affordance, SideNav reachability),
 * and the roster-as-reference-data wiring into Command Role Assignment
 * (F1) and Resource Request assignment (F4) — all against the real
 * Plan 09-02 backend (`GET /api/v1/integrations/hris/personnel`) and its
 * deterministic 2-record seed fixture (one matched to commander@epmp.local
 * with qualifications ICS-300/NIMS-ICS-400, one deliberately unmatched).
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
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

async function createIncidentViaUi(page: Page, namePrefix: string): Promise<string> {
  await page.goto('/incidents/new');
  const incidentName = `${namePrefix} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await page.getByLabel('Name', { exact: false }).fill(incidentName);
  await page.getByLabel('Type', { exact: true }).selectOption('Flood');
  await page.getByLabel('Severity', { exact: true }).selectOption('Critical');

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

test.describe.serial('Personnel Roster — reference data (F16-roster frontend)', () => {
  test('1. Personnel Roster is reachable from the Admin Console SideNav and renders matched/unmatched rows with Provenance', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Personnel roster', { exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/personnel-roster$/);
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // `hasText` is a case-insensitive SUBSTRING match — "No matched user"
    // itself contains the substring "matched", so a plain `hasText:
    // 'Matched'` filter also catches the unmatched rows. Match the exact
    // Badge text instead to tell the two states apart.
    const matchedRows = table.locator('tbody tr', {
      has: page.locator('.ep-badge', { hasText: /^Matched$/ }),
    });
    await expect(matchedRows).toHaveCount(1, { timeout: 10_000 });
    const unmatchedRows = table.locator('tbody tr', {
      has: page.locator('.ep-badge', { hasText: 'No matched user' }),
    });
    await expect(unmatchedRows.first()).toBeVisible({ timeout: 10_000 });

    // A real Provenance chip is visible — verified (non-dashed) branch,
    // never `.ep-provenance--unverified`.
    const provenanceChip = table.locator('.ep-provenance').first();
    await expect(provenanceChip).toBeVisible();
    await expect(table.locator('.ep-provenance--unverified')).toHaveCount(0);
  });

  test('2. No edit control exists anywhere on the Personnel Roster page', async ({ page }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/personnel-roster');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // Scoped to the Table container specifically (Plan 07-04's precedent) —
    // not the whole page, which legitimately has SideNav/PageHeader chrome
    // with navigation buttons/links that aren't roster-mutation affordances.
    const tableContainer = page.locator('.ep-card', { has: table });
    await expect(tableContainer.locator('button')).toHaveCount(0);
    await expect(tableContainer.locator('input')).toHaveCount(0);
    await expect(tableContainer.locator('textarea')).toHaveCount(0);
    await expect(tableContainer.locator('select')).toHaveCount(0);
  });

  test('3. Command Role Assignment\'s personnel Combobox shows a qualification hint for a roster-matched person', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await createIncidentViaUi(page, 'E2E Roster Hint');

    const commanderRow = page.locator('.ep-incident-workspace__role-row', {
      hasText: 'Incident Commander',
    });
    await commanderRow.getByRole('button', { name: 'Assign' }).click();

    const modal = page.getByRole('dialog', { name: /Assign Incident Commander/ });
    await expect(modal).toBeVisible();

    const personnelInput = modal.getByLabel('Search personnel');
    await personnelInput.click();
    await personnelInput.fill('Commander');

    // commander@epmp.local's seeded roster match carries qualifications
    // ICS-300/NIMS-ICS-400 (Plan 09-02's hris-roster-adapter.ts fixture) —
    // the hint text must contain at least one of them.
    await expect(page.locator('.ep-combobox__option-hint', { hasText: 'ICS-300' })).toBeVisible({
      timeout: 10_000,
    });

    await page.keyboard.press('Escape');
  });

  test('4. Resource Request\'s Assign modal offers a roster quick-pick Combobox that populates the Assigned-to field', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);

    // Create + approve a resource request via direct API calls (mirrors
    // tasks-resources.spec.ts's own setup pattern), reusing an existing
    // seeded incident so this test needs no incident-creation UI round
    // trip.
    const incidents = await page.evaluate(async () => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/incidents?page_size=1', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.json() as Promise<{ items: Array<{ id: string }> }>;
    });
    const incidentId = incidents.items[0]?.id;
    expect(incidentId).toBeTruthy();

    const created = await apiPostViaPage<{ id: string }>(page, '/api/v1/resource-requests', {
      resource_type: 'Personnel',
      description: `E2E roster quick-pick ${Date.now()}`,
      quantity: 1,
      incident_id: incidentId,
      needed_by: new Date(Date.now() + 86_400_000).toISOString(),
      requesting_role: 'planning_logistics_chief',
    });
    const requestId = created.id;

    await apiPostViaPage(page, `/api/v1/resource-requests/${requestId}/approve`, {});

    await page.goto(`/resource-requests/${requestId}`);
    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Assign' }).click();
    const assignModal = page.getByRole('dialog', { name: /Assign this resource request/ });
    await expect(assignModal).toBeVisible();

    const rosterPicker = assignModal.getByLabel('Or pick from roster');
    await rosterPicker.click();
    await rosterPicker.fill('Alex Commander');
    await page.getByRole('option', { name: /Alex Commander/ }).click();

    await expect(assignModal.getByLabel('Assigned to')).toHaveValue('Alex Commander');
  });
});
