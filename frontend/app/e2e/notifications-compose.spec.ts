import { test, expect, type Page } from '@playwright/test';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 04-05's objective: the complete F5 4-step
 * compose-to-delivery flow — audience selection with its exact FRD
 * NO_AUDIENCE_SELECTED gate, the AI-draft approve-before-insert gate, the
 * fully read-only Review step, the permission-gated "Approve and send"
 * button, the danger confirmation modal, post-send delivery tracking, and
 * the incident Timeline write — functions end-to-end against the real
 * backend, proving 04-01's notifications API is observable to a real
 * browser user for the first time.
 *
 * Signs in as commander@epmp.local (incident_commander) — the ONE role
 * 04-04's seed grants `notifications:approve` to (PER-02's PIO-merge per
 * PERSONAS-EPMP.md), making this the real seeded notifications-approver
 * identity, not a test-fixture-only grant.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

/** Reads the session token straight out of sessionStorage (same key
 * src/auth/session-storage.ts owns) and issues a real fetch through the
 * SAME origin the page is already on — same pattern tasks-resources.spec.ts
 * and operating-picture-resource-markers.spec.ts both already establish,
 * used here to seed a test recipient group via direct API call (no
 * recipient groups exist in the seed fixture data this phase). */
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

test.describe.serial('Compose Notification — full compose-to-delivery flow with AI-origin gate', () => {
  let incidentId: string;
  let incidentName: string;
  let groupName: string;

  test('1. A test incident is created via the real UI create-incident flow, to link the notification to it', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/incidents/new');

    incidentName = `E2E Notification Incident ${Date.now()}`;
    await page.getByLabel('Name', { exact: false }).fill(incidentName);
    await page.getByLabel('Type', { exact: true }).selectOption('Flood');
    await page.getByLabel('Severity', { exact: true }).selectOption('Elevated');

    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    await page.getByRole('button', { name: 'Create incident' }).click();
    await page.waitForURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

    const match = page.url().match(/\/incidents\/([0-9a-f-]+)$/);
    incidentId = match![1];
    expect(incidentId).toBeTruthy();
  });

  test('2. A recipient group is seeded via direct API call (no fixture groups exist in the seed data)', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/notifications/groups');

    // Same test-fixture-via-direct-API-call convention prior phases'
    // Playwright specs already use (e.g. plan-to-task-materialization.spec.ts's
    // own documented reasoning). This group is a Jurisdiction-type group
    // over 'Default Agency' (sourced from GET /api/v1/jurisdictions,
    // incidents:view-gated — incident_commander holds incidents:view, not
    // admin:view, so GET /api/v1/admin/roles is 403 for this identity per
    // 02-01's seed decision; a Role-type group would have needed that
    // endpoint). member_count resolves to at least 1 real seeded user
    // (every fixture user shares 'Default Agency' jurisdiction_scope).
    const jurisdictionsResponse = await page.evaluate(async () => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/jurisdictions', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return res.json();
    });
    const defaultAgency = (
      jurisdictionsResponse as { items: Array<{ id: string; name: string }> }
    ).items.find((j) => j.name === 'Default Agency');
    expect(defaultAgency).toBeTruthy();

    groupName = `E2E Notification Group ${Date.now()}`;
    await apiPostViaPage(page, '/api/v1/recipient-groups', {
      name: groupName,
      type: 'Jurisdiction',
      selector: { jurisdiction_id: defaultAgency!.id },
    });

    await page.reload();
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await expect(table.locator('tbody tr', { hasText: groupName })).toBeVisible({ timeout: 10_000 });
  });

  test('3. Step 1 (Audience): attempting "Continue" with nothing selected shows the exact FRD message and does not advance', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/notifications/compose?incident=${incidentId}`);

    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(
      page.getByText('Select at least one recipient group or draw a geotargeted area.'),
    ).toBeVisible({ timeout: 10_000 });
    // Still on Step 1 — the step did NOT advance.
    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible();
  });

  test('4. Selecting the seeded recipient group advances to Step 2', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/notifications/compose?incident=${incidentId}`);

    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });
  });

  test('5. Step 2 (Message): "Draft with AI" shows an inert AIDraft panel until Approve copies it into the field', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/notifications/compose?incident=${incidentId}`);
    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });

    const messageField = page.getByRole('textbox', { name: 'Message' });
    const freeformMessage = `E2E freeform message ${Date.now()}`;
    await messageField.fill(freeformMessage);

    await page.getByRole('button', { name: 'Draft with AI' }).click();

    // The AIDraft-pattern panel appears with a "Not issued" Badge and
    // Provenance chip; the message field remains UNCHANGED (still the
    // freeform text, not the draft text) until Approve is clicked.
    await expect(page.getByText('Not issued')).toBeVisible({ timeout: 10_000 });
    await expect(messageField).toHaveValue(freeformMessage);

    await page.getByRole('button', { name: 'Approve' }).click();

    // The message field NOW contains the draft text (the stub's
    // deterministic prefix, per 04-01's documented AI-drafts stub).
    await expect(messageField).toHaveValue(/Drafted summary/, { timeout: 10_000 });

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 4: Review')).toBeVisible({ timeout: 10_000 });
  });

  test('6. Step 3 (Review) renders all fields read-only — no editable input/textarea anywhere in the review body', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/notifications/compose?incident=${incidentId}`);
    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });

    const messageField = page.getByRole('textbox', { name: 'Message' });
    await messageField.fill(`E2E review-step message ${Date.now()}`);
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Step 3 of 4: Review')).toBeVisible({ timeout: 10_000 });

    // No <input>/<textarea> is editable in the review body — the review
    // Card renders the message as plain <p> text, not inside a form
    // control. (PageHeader/Progress/etc. above may render their own
    // inputs elsewhere on the page, so this assertion is scoped to the
    // review Card specifically via its "Final message" heading's
    // sibling content.)
    const reviewCard = page.locator('.ep-card', { hasText: 'Step 3 — Review' });
    await expect(reviewCard.locator('input, textarea')).toHaveCount(0);

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 4: Approve and send')).toBeVisible({ timeout: 10_000 });
  });

  test('7. Step 4: "Approve and send" is enabled for incident_commander (holds notifications:approve); the danger Modal restates audience/channels; sending redirects to Delivery Tracking showing a Sent status', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/notifications/compose?incident=${incidentId}`);
    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('textbox', { name: 'Message' }).fill(`E2E send-flow message ${Date.now()}`);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 4: Review')).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 4: Approve and send')).toBeVisible({ timeout: 10_000 });

    const sendButton = page.getByRole('button', { name: 'Approve and send' });
    await expect(sendButton).toBeEnabled();
    await sendButton.click();

    // Danger Modal restates audience size + channel list verbatim.
    const modal = page.getByRole('alertdialog');
    await expect(modal).toBeVisible({ timeout: 10_000 });
    await expect(modal).toContainText('Send to');
    await expect(modal).toContainText('recipients via');

    await modal.getByRole('button', { name: 'Send now' }).click();

    await page.waitForURL(/\/notifications\/[0-9a-f-]+\/delivery$/, { timeout: 10_000 });

    // Delivery Tracking table renders at least one recipient row with a
    // Sent status Badge — 04-01's backend resolves sends directly to
    // Sent per its documented pre-F14 simplification.
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    await expect(table.locator('tbody tr .ep-badge', { hasText: 'Sent' }).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('8. The incident Timeline shows a "Notification sent: ..." entry — proving the cross-feature Timeline-write wiring works end-to-end through the real UI', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/incidents/${incidentId}`);

    await expect(page.getByRole('tab', { name: 'Timeline' })).toBeVisible({ timeout: 10_000 });
    await page.getByRole('tab', { name: 'Timeline' }).click();

    const timelinePanel = page.locator('#ep-tabpanel-timeline');
    await expect(timelinePanel).toBeVisible();
    await expect(timelinePanel.getByText(/Notification sent:/)).toBeVisible({ timeout: 10_000 });
  });
});
