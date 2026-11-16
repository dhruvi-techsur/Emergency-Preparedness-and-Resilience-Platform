import { test, expect } from '@playwright/test';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 02-05's objective: the Incident List (S1.1)
 * and Create Incident (S1.2) screens are reachable from the shell's
 * "Activate" SideNav group and functional against the real backend,
 * including the non-blocking duplicate-warning flow (success criterion 1).
 *
 * Signs in as commander@epmp.local (incident_commander role) rather than
 * the admin@epmp.local used by 01-10/01-11's suites — admin's secops_admin
 * role deliberately holds no `incidents` permissions (backend/scripts/
 * seed.ts's own documented decision), so it never sees the Activate nav
 * group and cannot create incidents.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

test.describe.serial('Incident List & Create Incident', () => {
  test('1. "Incidents" reachable from the Activate SideNav group; list renders (empty or populated)', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Incidents', { exact: true }).click();

    await expect(page).toHaveURL(/\/incidents$/);

    // Either the Table renders (incidents already exist from a prior test
    // run against this persistent-volume database) or the first-use
    // EmptyState with its "Create incident" action does — both are valid
    // starting states for this live-stack test, same reasoning 01-11's
    // admin-users-roles.spec.ts documents for its own "at least one row"
    // assertion rather than an exact count.
    const table = page.locator('table.ep-table');
    const emptyState = page.getByText('No incidents yet');
    await expect(table.or(emptyState)).toBeVisible({ timeout: 10_000 });
  });

  test('2. Creating an incident redirects to its workspace route, then appears in the list with a Badge severity', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/incidents');

    await page.getByRole('button', { name: 'Create incident' }).first().click();
    await expect(page).toHaveURL(/\/incidents\/new$/);

    const incidentName = `E2E Incident ${Date.now()}`;
    // Required fields render their accessible name as "Label *" (a
    // visually-hidden-but-not-aria-hidden required marker appended by
    // TextField/Combobox/DatePicker), so getByLabel needs exact:false
    // for Name/Jurisdiction/Opened at — Type/Severity aren't required and
    // match exactly.
    await page.getByLabel('Name', { exact: false }).fill(incidentName);
    await page.getByLabel('Type', { exact: true }).selectOption('Flood');
    await page.getByLabel('Severity', { exact: true }).selectOption('Critical');

    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    // Opened-at DatePicker defaults to "now" — leave as-is, just confirm
    // the date input has a value before submitting.
    await expect(page.locator('input[placeholder="YYYY-MM-DD"]')).not.toHaveValue('');

    await page.getByRole('button', { name: 'Create incident' }).click();

    // Redirect to /incidents/{id} (the Incident Workspace route from
    // 02-06) — a URL matching that pattern, not back to /incidents/new or
    // bare /incidents. 02-06 may not have run yet in execution order
    // (Wave 3 parallelism), so the destination page itself may 404 — only
    // the URL shape is asserted here, per this plan's own documented note.
    await expect(page).toHaveURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

    await page.goto('/incidents');
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    const row = table.locator('tbody tr', { hasText: incidentName });
    await expect(row).toBeVisible({ timeout: 10_000 });
    // Severity rendered via Table.StatusCell -> Badge: an icon (svg) plus
    // the word "Critical" inside a span with the ep-badge class, never a
    // bare colored span.
    await expect(row.locator('.ep-badge', { hasText: 'Critical' })).toBeVisible();
    await expect(row.locator('.ep-badge svg')).toBeVisible();
  });

  test('3. Duplicate name within 24h shows a non-blocking warning Alert; resubmit creates a second incident', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/incidents/new');

    const duplicateName = `E2E Duplicate ${Date.now()}`;

    const fillForm = async () => {
      await page.getByLabel('Name', { exact: false }).fill(duplicateName);
      await page.getByLabel('Type', { exact: true }).selectOption('Wildfire');
      await page.getByLabel('Severity', { exact: true }).selectOption('Elevated');
      const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
      await jurisdictionInput.click();
      await jurisdictionInput.fill('Default Agency');
      await page.getByRole('option', { name: 'Default Agency' }).click();
    };

    // First creation — succeeds, redirects away from /incidents/new.
    await fillForm();
    await page.getByRole('button', { name: 'Create incident' }).click();
    await expect(page).toHaveURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

    // Second creation — same name/type/jurisdiction, within the same test
    // run (well within the 24h window).
    await page.goto('/incidents/new');
    await fillForm();
    await page.getByRole('button', { name: 'Create incident' }).click();

    const warningAlert = page.getByText(/last 24 hours/i);
    await expect(warningAlert).toBeVisible({ timeout: 10_000 });

    // Still on the create form — the warning did not navigate away, and
    // entered values are intact (not block, per the FRD rule).
    await expect(page).toHaveURL(/\/incidents\/new$/);
    await expect(page.getByLabel('Name', { exact: false })).toHaveValue(duplicateName);

    // Resubmitting without re-entering anything sends confirmed_duplicate
    // and creates the second incident.
    await page.getByRole('button', { name: 'Create incident' }).click();
    await expect(page).toHaveURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

    await page.goto('/incidents');
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    const matchingRows = table.locator('tbody tr', { hasText: duplicateName });
    await expect(matchingRows).toHaveCount(2, { timeout: 10_000 });
  });

  test('5. Empty Name on submit focuses the Name field and shows a summary Alert', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/incidents/new');

    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    // Name left empty — submit.
    await page.getByRole('button', { name: 'Create incident' }).click();

    const nameInput = page.getByLabel('Name', { exact: false });
    await expect(nameInput).toBeFocused();
    await expect(page.getByText('Fix the following before continuing')).toBeVisible({
      timeout: 5_000,
    });
  });
});
