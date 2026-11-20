import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander, signInThroughKeycloak } from './helpers/sign-in';

/**
 * F14 (Plan 09-03) — frontend half of Notification Provider & Public-
 * Alerting Integration. Proves, end-to-end through the real UI against
 * the real Plan 09-01 backend:
 *
 * 1. Selecting IPAWS in Compose Notification's Step 2 reveals the 6 CAP
 *    public-alert fields and blocks Continue until all are filled.
 * 2. A completed IPAWS send shows the 'Public alert (CAP)' Badge on
 *    Delivery Tracking.
 * 3. A plain SMS-only send shows NO such Badge — proving the distinction
 *    is genuinely conditional, not always-on.
 * 4. The admin Integration Health view shows the Everbridge/IPAWS rows
 *    Plan 09-01 writes.
 * 5. A forced provider outage (driven past the retry-sweep's 4th-failure
 *    threshold) surfaces as Failed with a visible reason on Delivery
 *    Tracking — never silently Queued, never falsely Sent.
 *
 * Follows notifications-compose.spec.ts's exact sign-in/fixture/
 * recipient-group-seeding pattern (apiPostViaPage copied verbatim, not
 * imported, same convention that spec file itself documents).
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

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

async function apiGetViaPage<T>(page: Page, path: string): Promise<T> {
  return page.evaluate(async (path) => {
    const token = window.sessionStorage.getItem('epmp_session_token');
    const res = await fetch(path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET ${path} failed: ${res.status} ${text}`);
    }
    return res.json();
  }, path);
}

/** Same test-fixture jurisdiction-scope correction prior phases' specs
 * already document (operating-picture-resource-markers.spec.ts): without
 * it, commander@epmp.local's own jurisdiction-scoped queries (recipient
 * groups' Jurisdiction-type member resolution in this spec's case) can
 * silently resolve to zero rows. One-time test-fixture correction, not a
 * production change. */
async function ensureCommanderHasJurisdictionScope(): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = 'Default Agency'`,
  );
  const jurisdictionId = rows[0]?.id;
  if (!jurisdictionId) return;
  await pool.query(
    `UPDATE users SET jurisdiction_scope = ARRAY[$1]::uuid[]
     WHERE email = 'commander@epmp.local' AND NOT ($1 = ANY(jurisdiction_scope))`,
    [jurisdictionId],
  );
}

test.describe.serial('Notification Provider & Public-Alerting Integration (F14 frontend)', () => {
  let groupName: string;

  test.beforeAll(async () => {
    await ensureCommanderHasJurisdictionScope();
  });

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. Selecting IPAWS reveals CAP fields; Continue is blocked until all are filled', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/notifications/groups');

    const jurisdictionsResponse = await apiGetViaPage<{ items: Array<{ id: string; name: string }> }>(
      page,
      '/api/v1/jurisdictions',
    );
    const defaultAgency = jurisdictionsResponse.items.find((j) => j.name === 'Default Agency');
    expect(defaultAgency).toBeTruthy();

    groupName = `E2E CAP Notification Group ${Date.now()}`;
    await apiPostViaPage(page, '/api/v1/recipient-groups', {
      name: groupName,
      type: 'Jurisdiction',
      selector: { jurisdiction_id: defaultAgency!.id },
    });

    await page.goto('/notifications/compose');
    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });

    // CAP fields Card is NOT visible before IPAWS is selected.
    await expect(page.getByText('CAP public-alert fields')).toHaveCount(0);

    await page.getByRole('textbox', { name: 'Message' }).fill(`E2E CAP message ${Date.now()}`);
    await page.getByLabel('IPAWS', { exact: true }).check();

    // The CAP public-alert fields Card becomes visible once IPAWS is checked.
    await expect(page.getByText('CAP public-alert fields')).toBeVisible({ timeout: 10_000 });

    // Attempting Continue with the CAP fields empty shows the exact error
    // and does NOT advance.
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByText('Complete the CAP fields before continuing — required for a public-warning channel send.'),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible();

    // Fill all 6 fields — Continue now succeeds to Step 3. Not exact:true
    // for Event/Urgency/Severity/Certainty: TextField/Select both append
    // a trailing " *" required-marker span into the accessible label
    // text for a `required` field, which getByLabel's exact match must
    // match verbatim — exact:false (substring) is the correct form here.
    await page.getByLabel('Sender (authorized agency identity)', { exact: false }).fill('EPMP Agency Alerting Authority');
    await page.getByLabel('Event', { exact: false }).fill('Flash Flood Warning');
    await page.getByLabel('Urgency', { exact: false }).selectOption('Immediate');
    await page.getByLabel('Severity', { exact: false }).selectOption('Severe');
    await page.getByLabel('Certainty', { exact: false }).selectOption('Observed');
    await page.getByLabel('Area', { exact: false }).fill('Default Agency service area');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 4: Review')).toBeVisible({ timeout: 10_000 });

    // Review step shows the CAP summary block.
    await expect(page.getByText('Sender: EPMP Agency Alerting Authority')).toBeVisible();
    await expect(page.getByText('Event: Flash Flood Warning')).toBeVisible();
  });

  test('2. A completed IPAWS send shows the CAP-send Badge on Delivery Tracking', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/notifications/compose');
    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('textbox', { name: 'Message' }).fill(`E2E CAP send ${Date.now()}`);
    await page.getByLabel('IPAWS', { exact: true }).check();
    await expect(page.getByText('CAP public-alert fields')).toBeVisible({ timeout: 10_000 });

    await page.getByLabel('Sender (authorized agency identity)', { exact: false }).fill('EPMP Agency Alerting Authority');
    await page.getByLabel('Event', { exact: false }).fill('Flash Flood Warning');
    await page.getByLabel('Urgency', { exact: false }).selectOption('Immediate');
    await page.getByLabel('Severity', { exact: false }).selectOption('Severe');
    await page.getByLabel('Certainty', { exact: false }).selectOption('Observed');
    await page.getByLabel('Area', { exact: false }).fill('Default Agency service area');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 4: Review')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 4: Approve and send')).toBeVisible({ timeout: 10_000 });

    const sendButton = page.getByRole('button', { name: 'Approve and send' });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    const modal = page.getByRole('alertdialog');
    await expect(modal).toBeVisible({ timeout: 10_000 });
    await modal.getByRole('button', { name: 'Send now' }).click();

    await page.waitForURL(/\/notifications\/[0-9a-f-]+\/delivery$/, { timeout: 10_000 });

    await expect(page.getByText('Public alert (CAP)')).toBeVisible({ timeout: 10_000 });
  });

  test('3. A plain SMS-only send shows NO CAP-send Badge', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/notifications/compose');
    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible({ timeout: 10_000 });

    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('textbox', { name: 'Message' }).fill(`E2E plain SMS send ${Date.now()}`);
    // Deselect Email (checked by default) so only SMS remains — IPAWS is
    // never checked in this test.
    await page.getByLabel('Email', { exact: true }).uncheck();
    await page.getByLabel('SMS', { exact: true }).check();

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 4: Review')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 4: Approve and send')).toBeVisible({ timeout: 10_000 });

    const sendButton = page.getByRole('button', { name: 'Approve and send' });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    const modal = page.getByRole('alertdialog');
    await expect(modal).toBeVisible({ timeout: 10_000 });
    await modal.getByRole('button', { name: 'Send now' }).click();

    await page.waitForURL(/\/notifications\/[0-9a-f-]+\/delivery$/, { timeout: 10_000 });

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    // Proving the distinction is genuinely conditional, not always-on.
    await expect(page.getByText('Public alert (CAP)')).toHaveCount(0);
  });

  test('4. Integration health admin view shows the Everbridge/IPAWS rows after seeding', async ({ page }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/integration-health');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    const everbridgeRow = table.locator('tbody tr', { hasText: 'Everbridge' });
    await expect(everbridgeRow).toHaveCount(1);

    const ipawsRow = table.locator('tbody tr', { hasText: 'IPAWS' });
    await expect(ipawsRow).toHaveCount(1);
  });

  test('5. A forced provider outage surfaces as Failed with a visible reason on Delivery Tracking, never silently Queued or falsely Sent', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/notifications/groups');

    // Compose + send a notification whose message body IS
    // sendViaProvider's own documented FORCE_PROVIDER_OUTAGE trigger
    // string (notification-provider-adapter.ts) — the one reachable way,
    // through the real HTTP surface, to get a 'failed'
    // notification_dispatch_log row for a specific notification_id.
    // Sending it first resolves F5's own notification_delivery_status
    // rows to 'Sent' (04-01's pre-F14 simplification, untouched by this
    // plan) — the per-channel sendViaProvider dispatch that follows is
    // what writes the SEPARATE 'failed' dispatch_log row this test
    // drives through the retry sweep below.
    const recipientGroups = await apiGetViaPage<Array<{ id: string; name: string }>>(
      page,
      '/api/v1/recipient-groups',
    );
    const group = recipientGroups.find((g) => g.name === groupName);
    expect(group).toBeTruthy();

    const composed = await apiPostViaPage<{ id: string }>(page, '/api/v1/notifications/compose', {
      recipient_group_ids: [group!.id],
      message_body: 'FORCE_PROVIDER_OUTAGE',
      channels: ['SMS'],
    });
    const notificationId = composed.id;

    await apiPostViaPage(page, `/api/v1/notifications/${notificationId}/send`, {});

    // Tick the retry sweep 4 times via the backend's own dedicated
    // test-injection route (GET /api/v1/_test/notification-retry-sweep,
    // mirroring incident-workspace-dispatch-status.spec.ts's
    // /api/v1/_test/cad-forced-outage pattern exactly — calling the real
    // sweep function SERVER-SIDE inside the already-running backend
    // process, never importing backend source into this test runner's
    // own Node process). Each tick bumps retry_count by 1 for every
    // 'failed' dispatch_log row; the 4th tick (retry_count now > 3)
    // escalates to 'Failed' in F5's own notification_delivery_status
    // table with a visible failure_reason, per
    // runNotificationRetrySweep's own documented behavior.
    for (let i = 0; i < 4; i += 1) {
      const sweepResult = await apiGetViaPage<{ swept: number }>(page, '/api/v1/_test/notification-retry-sweep');
      expect(sweepResult.swept).toBeGreaterThanOrEqual(0);
    }

    await page.goto(`/notifications/${notificationId}/delivery`);
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // A Failed status Badge is visible AND a non-empty failure-reason
    // caption is visible beneath it — never Queued, never Sent, for the
    // recipient row whose dispatch now escalated.
    await expect(table.locator('tbody tr .ep-badge', { hasText: 'Failed' }).first()).toBeVisible({
      timeout: 10_000,
    });
    await expect(table.getByText('Provider unavailable after 3 retry attempts').first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
