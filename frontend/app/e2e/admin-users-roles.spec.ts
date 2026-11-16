import { test, expect } from '@playwright/test';
import { signInThroughKeycloak } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 01-11's objective: the Users/Roles/Audit Log
 * admin screens are reachable from the shell's Admin SideNav group,
 * functional against the real backend, and structurally read-only where
 * the FRD requires it (success criterion 2).
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

test.describe.serial('Admin console — Users, Roles & Permissions, Audit Log', () => {
  test('1. Users table renders with at least one row (the seeded admin)', async ({ page }) => {
    await signInThroughKeycloak(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Users', { exact: true }).click();

    await expect(page).toHaveURL(/\/admin\/users$/);
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    // "At least one row" rather than exactly one: this suite (like 01-07's
    // admin.test.ts) runs against a persistent-volume database that
    // accumulates fixture/test users across repeated runs (77+ rows
    // observed) — the exact count is not the thing being proven here, just
    // that the Table renders real rows from the live backend. The seeded
    // admin's actual presence/identity is proven deterministically in test
    // 2 below via a direct API lookup (the default page_size=25 list view
    // does not guarantee "EPMP Admin" sorts into the first page once 25+
    // fixture users exist — ORDER BY u.name gives no such guarantee).
    const rowCount = await table.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThanOrEqual(1);
  });

  test('2. Changing a user role via detail Select persists across reload', async ({ page }) => {
    await signInThroughKeycloak(page);

    // Look up the seeded admin's id directly via the API (same pattern as
    // test 3's role lookup below) rather than relying on table pagination
    // to surface "EPMP Admin" — the default page_size=25 list view does not
    // guarantee that row is present once 25+ fixture users exist from
    // repeated plan/test runs.
    const adminUserId = await page.evaluate(async () => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/admin/users?page_size=1000', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await res.json()) as { items: Array<{ id: string; name: string }> };
      return body.items.find((u) => u.name === 'EPMP Admin')?.id;
    });
    expect(adminUserId).toBeTruthy();

    await page.goto(`/admin/users/${adminUserId}`);
    await expect(page).toHaveURL(/\/admin\/users\/.+/);
    const roleSelect = page.getByLabel('Role');
    await expect(roleSelect).toBeVisible({ timeout: 10_000 });

    // The seeded admin is already secops_admin — pick whatever OTHER
    // option exists (if any) and record it, otherwise fall back to
    // re-selecting the same value (still exercises the PATCH round-trip,
    // just without a visible value change). Prefer an actual change when
    // more than one role option is available (true once 01-01's 5 seeded
    // persona roles are all present).
    const optionValues = await roleSelect.locator('option').evaluateAll((opts) =>
      (opts as HTMLOptionElement[]).map((o) => o.value),
    );
    const currentValue = await roleSelect.inputValue();
    const otherValue = optionValues.find((v) => v !== currentValue) ?? currentValue;

    await roleSelect.selectOption(otherValue);
    // Give the PATCH a moment to land before reloading.
    await page.waitForTimeout(500);

    await page.reload();
    const roleSelectAfterReload = page.getByLabel('Role');
    await expect(roleSelectAfterReload).toBeVisible({ timeout: 10_000 });
    await expect(roleSelectAfterReload).toHaveValue(otherValue);

    // Restore the original value so later tests/re-runs of this suite
    // start from the same seeded state (idempotent re-run, same pattern
    // 01-07's admin.test.ts documents for its own suite).
    if (otherValue !== currentValue) {
      await roleSelectAfterReload.selectOption(currentValue);
      await page.waitForTimeout(500);
    }
  });

  test('3. Suspend requires Modal confirmation with outcome-named buttons, updates Badge without reload', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/users');

    // Create a second test user via the "Add user" Modal, since suspending
    // the only seeded admin would lock the rest of this suite out.
    await page.getByRole('button', { name: 'Add user' }).click();
    const addModal = page.getByRole('dialog', { name: 'Add user' });
    await expect(addModal).toBeVisible({ timeout: 5_000 });

    const uniqueEmail = `suspend-test-${Date.now()}@epmp.local`;
    await addModal.getByLabel('Email').fill(uniqueEmail);
    await addModal.getByLabel('Name').fill('Suspend Test User');

    // Role ID: read the secops_admin role's id via the live
    // GET /api/v1/admin/roles response (same one RolesPermissions reads),
    // rather than hardcoding a UUID this test has no other way to know.
    const rolesResponse = await page.evaluate(async () => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/admin/roles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json() as Promise<Array<{ id: string; name: string }>>;
    });
    const secopsAdminRole = rolesResponse.find((r) => r.name === 'secops_admin');
    expect(secopsAdminRole).toBeTruthy();
    await addModal.getByLabel('Role ID').fill(secopsAdminRole!.id);

    await addModal.getByRole('button', { name: 'Add user' }).click();
    await expect(addModal).not.toBeVisible({ timeout: 10_000 });

    // Navigate directly to the new user's detail by id, looked up via the
    // unique email just used — the Users table's default page_size=25 does
    // NOT guarantee a just-created row (ORDER BY u.name, 77+ fixture users
    // already present from repeated plan/test runs) sorts into view, same
    // reasoning as test 2's direct-id lookup above.
    const newUserId = await page.evaluate(async (email) => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/admin/users?page_size=1000', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = (await res.json()) as { items: Array<{ id: string; email: string }> };
      return body.items.find((u) => u.email === email)?.id;
    }, uniqueEmail);
    expect(newUserId).toBeTruthy();

    await page.goto(`/admin/users/${newUserId}`);
    await expect(page).toHaveURL(/\/admin\/users\/.+/);

    await page.getByRole('button', { name: 'Suspend access' }).click();

    const modal = page.getByRole('alertdialog');
    await expect(modal).toBeVisible({ timeout: 5_000 });
    // Title is `Suspend ${name}'s access?` (UserDetail.tsx) — match the
    // fixed suffix rather than the full string, since `name` here is the
    // just-created "Suspend Test User" fixture.
    await expect(modal.getByText(/access\?$/)).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Keep active' })).toBeVisible();
    const confirmButton = modal.getByRole('button', { name: 'Suspend access' });
    await expect(confirmButton).toBeVisible();
    // Never "Yes"/"OK" anywhere in this modal.
    await expect(modal.getByRole('button', { name: /^(Yes|OK)$/ })).toHaveCount(0);

    await confirmButton.click();
    await expect(modal).not.toBeVisible({ timeout: 10_000 });

    // Status Badge updates to "Suspended" without a page reload.
    await expect(page.getByText('Suspended', { exact: true }).first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test('4. Role permission edit through confirmation Modal creates an audit entry visible at the top of Audit Log', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/roles');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await table.getByText('secops_admin').click();

    const editModal = page.getByRole('dialog', { name: /Edit permissions/ });
    await expect(editModal).toBeVisible({ timeout: 5_000 });

    // Toggle the "approve" action checkbox under the "admin" fieldset.
    const adminFieldset = editModal.locator('fieldset', { has: page.getByText('admin', { exact: true }) });
    const approveCheckbox = adminFieldset.getByLabel('approve');
    const wasChecked = await approveCheckbox.isChecked();
    await approveCheckbox.click();

    await editModal.getByRole('button', { name: 'Save changes' }).click();

    const confirmModal = page.getByRole('dialog', { name: /Update permissions/ });
    await expect(confirmModal).toBeVisible({ timeout: 5_000 });
    await confirmModal.getByRole('button', { name: 'Save changes' }).click();
    await expect(confirmModal).not.toBeVisible({ timeout: 10_000 });

    // Navigate to Audit Log; the newest entry (time-sorted DESC) should be
    // this role_permission_edit.
    await page.goto('/admin/audit-log');
    const auditTable = page.locator('table.ep-table');
    await expect(auditTable).toBeVisible({ timeout: 10_000 });
    const firstRow = auditTable.locator('tbody tr').first();
    await expect(firstRow.getByText('role_permission_edit')).toBeVisible({ timeout: 10_000 });

    // Restore the original checkbox state so repeated runs stay idempotent.
    await page.goto('/admin/roles');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await table.getByText('secops_admin').click();
    await expect(editModal).toBeVisible({ timeout: 5_000 });
    const approveCheckboxAgain = adminFieldset.getByLabel('approve');
    if ((await approveCheckboxAgain.isChecked()) !== wasChecked) {
      await approveCheckboxAgain.click();
      await editModal.getByRole('button', { name: 'Save changes' }).click();
      await confirmModal.getByRole('button', { name: 'Save changes' }).click();
      await expect(confirmModal).not.toBeVisible({ timeout: 10_000 });
    } else {
      await editModal.getByRole('button', { name: 'Cancel' }).click();
    }
  });

  test('5. Audit Log page has no Edit/Delete button or link anywhere in the table', async ({ page }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/audit-log');

    const auditTable = page.locator('table.ep-table');
    await expect(auditTable).toBeVisible({ timeout: 10_000 });

    await expect(auditTable.getByRole('button', { name: /^Edit$/ })).toHaveCount(0);
    await expect(auditTable.getByRole('button', { name: /^Delete$/ })).toHaveCount(0);
    await expect(auditTable.getByRole('link', { name: /^Edit$/ })).toHaveCount(0);
    await expect(auditTable.getByRole('link', { name: /^Delete$/ })).toHaveCount(0);
  });
});
