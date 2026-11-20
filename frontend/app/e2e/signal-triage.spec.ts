import { test, expect, type Page } from '@playwright/test';
import { signInAsEocDirector } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 06-09's objective (F9, success criterion 5's
 * user-facing half): the Signal Triage Queue/Detail screens never
 * auto-promote a signal into an active incident — Promote only ever
 * navigates to the pre-filled Create Incident FORM, and the human's own
 * explicit form submission is what actually creates the record.
 *
 * Signs in as eocdirector@epmp.local (eoc_director) — holds `ai_assist`
 * per 06-03's seed (granted to PER-01/02/03), one of the FRD's named
 * "typically PER-01 or PER-03" signal-triage reviewers.
 *
 * Seeded signals come from backend/scripts/seed.ts's own
 * clusterHazardFeedEvents() call against its sample NOAA/NWS/USGS
 * hazard-feed fixture events (06-04's seed extension) — at least 2 rows
 * (one High-confidence corroborated cluster, one Medium-confidence
 * isolated event) exist on a freshly-seeded database.
 */

async function apiFetchViaPage<T>(page: Page, path: string): Promise<T> {
  return page.evaluate(async (p) => {
    const token = window.sessionStorage.getItem('epmp_session_token');
    const res = await fetch(p, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return res.json();
  }, path);
}

test.describe.serial('Signal Triage Queue + Signal Detail — Promote never creates an incident directly', () => {
  test('1. /signals renders at least 2 rows with qualitative confidence text, never a bare percentage', async ({
    page,
  }) => {
    await signInAsEocDirector(page);
    await page.goto('/signals');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    const rows = table.locator('tbody tr');
    await expect(rows.first()).toBeVisible({ timeout: 10_000 });
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThanOrEqual(2);

    for (let i = 0; i < rowCount; i++) {
      const rowText = await rows.nth(i).innerText();
      expect(rowText).toMatch(/High|Medium|Low/);
      // No bare percentage anywhere in the row's Confidence cell.
      expect(rowText).not.toMatch(/\b\d+%\b/);
    }
  });

  test('2. Dismiss opens a Modal whose confirm button is disabled until a reason is typed; dismissing updates Status to Dismissed', async ({
    page,
  }) => {
    await signInAsEocDirector(page);
    await page.goto('/signals');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // Find a New-status row (Dismiss/Promote are disabled otherwise).
    const newRow = table.locator('tbody tr', { has: page.locator('.ep-badge', { hasText: 'New' }) }).first();
    await expect(newRow).toBeVisible({ timeout: 10_000 });

    await newRow.getByRole('button', { name: 'Dismiss' }).click();

    const modal = page.locator('.ep-modal', { hasText: 'Dismiss this signal?' });
    await expect(modal).toBeVisible({ timeout: 5_000 });

    const confirmButton = modal.getByRole('button', { name: 'Dismiss signal' });
    await expect(confirmButton).toBeDisabled();

    await modal.getByLabel('Reason', { exact: false }).fill('False positive — confirmed via manual review.');

    // Gap closure 06-13 (UAT ref 8, cosmetic) regression guard: the
    // multiline Reason textarea must render fully inside the Modal's own
    // bounding box, not overflow its right edge (the exact reported defect
    // — root cause was AppShell.tsx missing the `.ep` box-sizing:border-box
    // reset class, fixed in this same plan's Task 1).
    const modalBox = await modal.boundingBox();
    const reasonField = modal.getByLabel('Reason', { exact: false });
    const reasonBox = await reasonField.boundingBox();
    expect(modalBox).toBeTruthy();
    expect(reasonBox).toBeTruthy();
    if (modalBox && reasonBox) {
      expect(reasonBox.x).toBeGreaterThanOrEqual(modalBox.x);
      expect(reasonBox.x + reasonBox.width).toBeLessThanOrEqual(modalBox.x + modalBox.width + 1);
    }

    await expect(confirmButton).toBeEnabled();

    await confirmButton.click();
    await expect(modal).not.toBeVisible({ timeout: 10_000 });

    // The dismissed row's Status badge updates — re-locate by the exact
    // same row's summary text since the table re-renders after refetch.
    await expect(table.locator('.ep-badge', { hasText: 'Dismissed' }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('2b. Dismiss Modal\u2019s Reason textarea stays inside the Modal bounds at a narrow (390px) viewport too (UAT gap ref 8 regression)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signInAsEocDirector(page);
    await page.goto('/signals');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    const newRow = table.locator('tbody tr', { has: page.locator('.ep-badge', { hasText: 'New' }) }).first();
    await expect(newRow).toBeVisible({ timeout: 10_000 });

    await newRow.getByRole('button', { name: 'Dismiss' }).click();

    const modal = page.locator('.ep-modal', { hasText: 'Dismiss this signal?' });
    await expect(modal).toBeVisible({ timeout: 5_000 });

    const modalBox = await modal.boundingBox();
    const reasonField = modal.getByLabel('Reason', { exact: false });
    const reasonBox = await reasonField.boundingBox();
    expect(modalBox).toBeTruthy();
    expect(reasonBox).toBeTruthy();
    if (modalBox && reasonBox) {
      expect(reasonBox.x).toBeGreaterThanOrEqual(modalBox.x);
      expect(reasonBox.x + reasonBox.width).toBeLessThanOrEqual(modalBox.x + modalBox.width + 1);
    }

    // Close without dismissing — this test only verifies layout, and
    // leaving the signal in 'New' status preserves the fixture pool for
    // every other test in this serial block that still needs one.
    await modal.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).not.toBeVisible({ timeout: 5_000 });
  });

  test('3-5. Promote navigates to the pre-filled Create Incident form WITHOUT creating an incident; only the human\u2019s own submit does', async ({
    page,
  }) => {
    await signInAsEocDirector(page);
    await page.goto('/signals');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    const newRow = table.locator('tbody tr', { has: page.locator('.ep-badge', { hasText: 'New' }) }).first();
    await expect(newRow).toBeVisible({ timeout: 10_000 });

    // Capture the signal's suggested name (the row's own summary link
    // text) to assert it round-trips into the pre-filled form.
    const signalSummary = (await newRow.locator('td').first().innerText()).trim();

    // 4. BEFORE snapshot of the incidents count.
    const beforeIncidents = await apiFetchViaPage<{ total: number }>(page, '/api/v1/incidents');

    await newRow.getByRole('button', { name: 'Promote to incident' }).click();

    // 3. Navigates to /incidents/new (NOT directly to an incident detail
    // page, which would imply one was already created).
    await expect(page).toHaveURL(/\/incidents\/new$/, { timeout: 10_000 });

    const nameField = page.getByLabel('Name', { exact: false });
    await expect(nameField).not.toHaveValue('', { timeout: 10_000 });
    const prefilledName = await nameField.inputValue();
    expect(prefilledName).toBe(signalSummary);

    // Severity Select is pre-set to the signal's suggested severity
    // (High confidence -> Elevated per signals.ts's own deterministic
    // heuristic; anything else -> Watch).
    const severitySelect = page.getByLabel('Severity', { exact: true });
    const severityValue = await severitySelect.inputValue();
    expect(['Critical', 'Elevated', 'Watch', 'Normal']).toContain(severityValue);

    // 4. AFTER landing on /incidents/new — count is UNCHANGED, proving no
    // incident was created merely by navigating to the pre-filled form.
    const afterNavigateIncidents = await apiFetchViaPage<{ total: number }>(page, '/api/v1/incidents');
    expect(afterNavigateIncidents.total).toBe(beforeIncidents.total);

    // 5. Complete and submit the pre-filled form (Jurisdiction is the
    // only remaining required field) — NOW the count increments by 1,
    // proving the human's own explicit submission (not the Promote
    // click) is what creates the record.
    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    await page.getByRole('button', { name: 'Create incident' }).click();
    await expect(page).toHaveURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

    const afterSubmitIncidents = await apiFetchViaPage<{ total: number }>(page, '/api/v1/incidents');
    expect(afterSubmitIncidents.total).toBe(beforeIncidents.total + 1);

    const createdId = page.url().match(/\/incidents\/([0-9a-f-]+)$/)?.[1];
    expect(createdId).toBeTruthy();
    const created = await apiFetchViaPage<{ name: string }>(page, `/api/v1/incidents/${createdId}`);
    expect(created.name).toBe(prefilledName);
  });

  test('6. Clicking a signal\u2019s linked summary navigates to Signal Detail and renders at least one Provenance chip', async ({
    page,
  }) => {
    await signInAsEocDirector(page);
    await page.goto('/signals');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    const firstRow = table.locator('tbody tr').first();
    const summaryLink = firstRow.locator('a.ep-signal-triage__summary-link');
    await expect(summaryLink).toBeVisible({ timeout: 10_000 });
    await summaryLink.click();

    await expect(page).toHaveURL(/\/signals\/[0-9a-f-]+$/, { timeout: 10_000 });
    await expect(page.locator('.ep-provenance').first()).toBeVisible({ timeout: 10_000 });
  });
});
