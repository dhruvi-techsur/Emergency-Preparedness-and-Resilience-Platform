import { test, expect } from '@playwright/test';
import { signInThroughKeycloak } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 01-12's objective: the SSO Configuration test-
 * gate, Platform Monitoring's Stat row, API Clients' one-time secret
 * handling, and Federation Grants' immediate-effect revocation all work
 * correctly through the real UI against the live backend (success criteria
 * 2 and 4).
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs. Reuses
 * the shared sign-in helper factored out in 01-11's
 * e2e/helpers/sign-in.ts rather than duplicating it.
 */

test.describe.serial('Admin console — SSO config, Platform Monitoring, API Clients, Federation Grants', () => {
  test('1. SSO config Save is disabled until Test connection, stays disabled on a failing test', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('SSO Config', { exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/sso-config$/);

    const saveButton = page.getByRole('button', { name: 'Save configuration' });
    await expect(saveButton).toBeVisible({ timeout: 10_000 });
    await expect(saveButton).toBeDisabled();

    // Fill in a deliberately-unreachable metadata URL, then Test connection.
    const urlField = page.getByLabel('IdP metadata URL');
    await urlField.fill('http://localhost:1/nonexistent');

    await page.getByRole('button', { name: 'Test connection' }).click();

    const dangerAlert = page.locator('[role="alert"]').filter({ hasText: /./ });
    await expect(dangerAlert.first()).toBeVisible({ timeout: 10_000 });

    // Save must remain disabled — the test failed, so the fingerprint gate
    // never flips to true.
    await expect(saveButton).toBeDisabled();
  });

  test('2. Platform Monitoring renders a Stat row with 4 tiles', async ({ page }) => {
    await signInThroughKeycloak(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Platform Monitoring', { exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/platform-monitoring$/);

    await expect(page.getByText('Uptime', { exact: true })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Active sessions', { exact: true })).toBeVisible();
    await expect(page.getByText('Failed-login rate', { exact: true })).toBeVisible();
    await expect(page.getByText('Integration-error rate', { exact: true })).toBeVisible();
  });

  test('3. API client secret is shown once and never reappears after Done', async ({ page }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/api-clients');

    await page.getByRole('button', { name: 'Create API client' }).click();

    const createModal = page.getByRole('dialog', { name: 'Create API client' });
    await expect(createModal).toBeVisible({ timeout: 5_000 });

    const clientName = `Test Client ${Date.now()}`;
    await createModal.getByLabel('Client name').fill(clientName);
    await createModal.getByLabel('read:incidents').check();

    await createModal.getByRole('button', { name: 'Create client' }).click();

    const secretModal = page.getByRole('dialog', { name: 'Copy your client secret' });
    await expect(secretModal).toBeVisible({ timeout: 10_000 });
    await expect(secretModal.getByText('Copy this secret now')).toBeVisible();

    const secretText = await secretModal.locator('code').textContent();
    expect(secretText).toBeTruthy();
    expect(secretText!.length).toBeGreaterThan(10);

    await secretModal.getByRole('button', { name: 'Done' }).click();
    await expect(secretModal).not.toBeVisible({ timeout: 5_000 });

    // Reload and confirm the secret never appears anywhere in the rendered
    // DOM again — the backend never returns it on GET, and the client never
    // persists it past the modal's local state.
    await page.reload();
    await expect(page.getByText(clientName)).toBeVisible({ timeout: 10_000 });
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).not.toContain(secretText);
  });

  test('4. Federation grant revocation updates Status to Revoked without a page reload', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/federation-grants');

    await page.getByRole('button', { name: 'Grant access' }).click();

    const grantModal = page.getByRole('dialog', { name: 'Grant federation access' });
    await expect(grantModal).toBeVisible({ timeout: 5_000 });

    const partnerCombobox = grantModal.getByLabel('Partner jurisdiction');
    await partnerCombobox.click();
    await grantModal.getByRole('option').first().click();

    await grantModal.getByLabel('user_identity').check();

    // Track navigation events — a genuine reload would fire a 'load' event
    // again; we assert none occurs between the click and the Status update.
    let navigationCount = 0;
    page.on('load', () => {
      navigationCount += 1;
    });

    await grantModal.getByRole('button', { name: 'Grant access' }).click();
    await expect(grantModal).not.toBeVisible({ timeout: 10_000 });

    const activeBadge = page.getByText('Active', { exact: true }).first();
    await expect(activeBadge).toBeVisible({ timeout: 10_000 });

    const row = page.locator('tr', { has: activeBadge });
    await row.getByRole('button', { name: 'Revoke' }).click();

    const revokeModal = page.getByRole('alertdialog');
    await expect(revokeModal).toBeVisible({ timeout: 5_000 });
    await expect(revokeModal.getByRole('button', { name: 'Keep grant active' })).toBeVisible();
    await revokeModal.getByRole('button', { name: 'Revoke access' }).click();
    await expect(revokeModal).not.toBeVisible({ timeout: 10_000 });

    await expect(page.getByText('Revoked', { exact: true }).first()).toBeVisible({
      timeout: 10_000,
    });

    // No full-page navigation occurred during the revoke flow.
    expect(navigationCount).toBe(0);
  });
});
