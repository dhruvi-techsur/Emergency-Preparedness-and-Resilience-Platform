import { test, expect } from '@playwright/test';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 02-06's objective: the Incident Workspace
 * (S1.3), the Command Role Assignment Modal (S1.4), and the Activation
 * Level Change Modal (S1.5) are all reachable, functional, and correctly
 * surface the server-side-enforced commander/confirmation gates (success
 * criteria 2 and 3).
 *
 * Signs in as commander@epmp.local (incident_commander role) — same
 * identity 02-05's incident-list-create.spec.ts uses, since
 * admin@epmp.local's secops_admin role deliberately holds no `incidents`
 * permissions.
 *
 * Each test creates its own fresh incident via the UI create form so
 * every assertion starts from a known, zero-command-roles state,
 * regardless of what earlier test runs against this persistent-volume
 * database left behind.
 */

async function createIncidentViaUi(page: import('@playwright/test').Page, namePrefix: string): Promise<string> {
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

test.describe.serial('Incident Workspace', () => {
  test('1. Workspace renders fixed structure: severity Badge, 4 tabs in order, 6 roles "Unassigned"', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await createIncidentViaUi(page, 'E2E Workspace Structure');

    // PageHeader shows the severity Badge.
    await expect(page.locator('.ep-page-header .ep-badge', { hasText: 'Critical' })).toBeVisible();

    // The four tabs render in this exact order.
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveText(/Timeline/);
    await expect(tabs.nth(1)).toHaveText(/Tasks/);
    await expect(tabs.nth(2)).toHaveText(/Resources/);
    await expect(tabs.nth(3)).toHaveText(/Reports/);

    // Command-role panel shows "Unassigned" for all 6 FRD role titles.
    const unassignedRows = page.locator('.ep-incident-workspace__role-row', { hasText: 'Unassigned' });
    await expect(unassignedRows).toHaveCount(6);
  });

  test('2. Assigning Incident Commander closes the Modal and the Timeline tab shows the new entry', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await createIncidentViaUi(page, 'E2E Workspace Assign');

    const commanderRow = page.locator('.ep-incident-workspace__role-row', {
      hasText: 'Incident Commander',
    });
    await commanderRow.getByRole('button', { name: 'Assign' }).click();

    const modal = page.getByRole('dialog', { name: /Assign Incident Commander/ });
    await expect(modal).toBeVisible();

    const personnelInput = modal.getByLabel('Search personnel');
    await personnelInput.click();
    await personnelInput.fill('Commander');
    await page.getByRole('option', { name: /Commander/ }).first().click();
    await modal.getByRole('button', { name: 'Assign role' }).click();

    // Modal closes.
    await expect(modal).not.toBeVisible();

    // Command-role panel now shows that person's name for Incident Commander —
    // no page reload (React Query refetch via onAssigned, same SPA session).
    await expect(
      page.locator('.ep-incident-workspace__role-row', { hasText: 'Incident Commander' }),
    ).not.toContainText('Unassigned');

    // Click the Timeline tab (already active by default, but switch away and
    // back to force a real tab interaction) and confirm the new entry shows.
    await page.getByRole('tab', { name: 'Tasks' }).click();
    await page.getByRole('tab', { name: 'Timeline' }).click();
    await expect(page.getByText(/Incident Commander assigned to/)).toBeVisible({ timeout: 10_000 });
  });

  test('3. Escalating above Monitoring with no commander assigned shows inline 422, activation level unchanged', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await createIncidentViaUi(page, 'E2E Workspace No Commander');

    await expect(page.getByRole('button', { name: /Activation: Monitoring/ })).toBeVisible();
    await page.getByRole('button', { name: /Activation: Monitoring/ }).click();

    const modal = page.getByRole('alertdialog');
    await expect(modal).toBeVisible();

    // Default target on a fresh Monitoring incident is the next-higher
    // level (Partial) — select Full explicitly to exercise the
    // above-Monitoring commander gate.
    await modal.getByLabel('New activation level').selectOption('Full');
    await modal.getByRole('button', { name: /Escalate to Full/ }).click();

    await expect(page.getByText('Assign an Incident Commander before activating above Monitoring.')).toBeVisible({
      timeout: 10_000,
    });

    // Close the modal — the activation-level display is unchanged.
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: /Activation: Monitoring/ })).toBeVisible();
  });

  test('4. Escalating with a commander assigned succeeds: outcome-named button, PageHeader + Timeline update', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    const incidentId = await createIncidentViaUi(page, 'E2E Workspace Escalate');

    // Assign the Incident Commander first (required before escalating above Monitoring).
    const commanderRow = page.locator('.ep-incident-workspace__role-row', {
      hasText: 'Incident Commander',
    });
    await commanderRow.getByRole('button', { name: 'Assign' }).click();
    const assignModal = page.getByRole('dialog', { name: /Assign Incident Commander/ });
    const personnelInput = assignModal.getByLabel('Search personnel');
    await personnelInput.click();
    await personnelInput.fill('Commander');
    await page.getByRole('option', { name: /Commander/ }).first().click();
    await assignModal.getByRole('button', { name: 'Assign role' }).click();
    await expect(assignModal).not.toBeVisible();

    // Escalate to Full.
    await page.getByRole('button', { name: /Activation: Monitoring/ }).click();
    const activationModal = page.getByRole('alertdialog');
    await expect(activationModal).toBeVisible();

    await activationModal.getByLabel('New activation level').selectOption('Full');
    await expect(activationModal).toContainText(/Escalate .* to Full activation\?/);
    const confirmButton = activationModal.getByRole('button', { name: /Escalate to Full/ });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    await expect(activationModal).not.toBeVisible();

    // PageHeader/activation display now shows Full.
    await expect(page.getByRole('button', { name: /Activation: Full/ })).toBeVisible({ timeout: 10_000 });

    // Timeline tab shows an "Activation changed to Full" entry.
    await page.getByRole('tab', { name: 'Timeline' }).click();
    await expect(page.getByText('Activation changed to Full')).toBeVisible({ timeout: 10_000 });

    // Sanity: still on the same incident's workspace URL.
    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}$`));
  });
});
