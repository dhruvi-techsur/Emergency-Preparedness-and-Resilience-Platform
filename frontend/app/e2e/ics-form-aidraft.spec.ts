import { test, expect, type Page } from '@playwright/test';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 06-08's objective: the ICS Form Editor's
 * AIDraft embedding never pre-inserts draft text into the narrative
 * field, the approve flow correctly cascades through BOTH 06-03's
 * ai-drafts approve and 06-01's ics-forms-level approve from a SINGLE
 * click, and a direct API bypass of the UI's approve button is still
 * rejected server-side (success criteria 3 and 4, proven end-to-end
 * through a real, reachable page rather than just backend integration
 * tests).
 *
 * Signs in as commander@epmp.local (incident_commander) — 06-03's seed
 * grants this role the full ai_assist action set, and 06-01's seed grants
 * it incidents:approve.
 */

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

/** Reads the session token straight out of sessionStorage (same key
 * src/auth/session-storage.ts owns) and issues a real fetch through the
 * SAME origin the page is already on — same convention
 * notifications-compose.spec.ts already establishes for direct-API
 * test-fixture calls. */
async function apiFetchViaPage<T>(
  page: Page,
  path: string,
  init?: { method?: string; body?: object },
): Promise<{ status: number; body: T }> {
  return page.evaluate(
    async ({ path, method, body }) => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch(path, {
        method: method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      return { status: res.status, body: json };
    },
    { path, method: init?.method, body: init?.body },
  );
}

async function getCurrentUserId(page: Page): Promise<string> {
  const { body } = await apiFetchViaPage<{ id: string }>(page, '/api/v1/me');
  return body.id;
}

test.describe.serial('ICS Form Editor — AIDraft draft/approve/discard flow + server-side-rejection proof', () => {
  test('1-4. Draft with AI never pre-inserts; Discard leaves the field untouched; a single AIDraft Approve click cascades ai-drafts approve -> ics-forms create -> ics-forms approve, producing a Timeline entry', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    const incidentId = await createIncidentViaUi(page, 'E2E ICS Form AIDraft');

    // 1. Navigate to the Reports tab, click "Open ICS-201 form" — lands
    // on /incidents/{id}/forms/new.
    await page.getByRole('tab', { name: 'Reports' }).click();
    await page.getByRole('button', { name: 'Open ICS-201 form' }).click();
    await page.waitForURL(new RegExp(`/incidents/${incidentId}/forms/new$`), { timeout: 10_000 });

    const narrativeField = page.getByLabel('Narrative', { exact: false });
    const typedText = 'Flooding reported along the riverbank, evacuations underway.';
    await narrativeField.fill(typedText);

    // 2. Click "Draft with AI" — an AIDraft panel appears showing "Not
    // issued", and the narrative field's own value is UNCHANGED from what
    // was typed, proving the draft never pre-inserted itself.
    await page.getByRole('button', { name: 'Draft with AI' }).click();
    const aiDraftPanel = page.locator('.ep-ai-draft');
    await expect(aiDraftPanel).toBeVisible({ timeout: 10_000 });
    await expect(aiDraftPanel.locator('.ep-badge', { hasText: 'Not issued' })).toBeVisible();
    await expect(narrativeField).toHaveValue(typedText);

    // 3. Click "Discard" inside the AIDraft panel — the panel disappears
    // and the narrative field's value is STILL unchanged.
    await aiDraftPanel.getByRole('button', { name: 'Discard' }).click();
    await expect(aiDraftPanel).not.toBeVisible();
    await expect(narrativeField).toHaveValue(typedText);

    // 4. Click "Draft with AI" again, then click ONLY "Approve" inside the
    // AIDraft panel (never the separate "Approve form" button) — the
    // narrative field's value updates to the draft text, AND the
    // incident's Timeline shows a new "ICS form approved" entry, proving
    // handleApprove's full cascade ran from this single click.
    await page.getByRole('button', { name: 'Draft with AI' }).click();
    await expect(aiDraftPanel).toBeVisible({ timeout: 10_000 });
    const draftText = await aiDraftPanel.locator('.ep-ai-draft__text').innerText();
    expect(draftText.length).toBeGreaterThan(0);

    await aiDraftPanel.getByRole('button', { name: 'Approve' }).click();
    await expect(aiDraftPanel).not.toBeVisible({ timeout: 10_000 });
    await expect(narrativeField).toHaveValue(draftText);

    await page.goto(`/incidents/${incidentId}`);
    await page.getByRole('tab', { name: 'Timeline' }).click();
    await expect(page.getByText(/ICS form approved/)).toBeVisible({ timeout: 10_000 });

    // 5. Server-side-rejection proof: directly call the ics-forms approve
    // endpoint, bypassing the UI's own Approve button entirely, against a
    // FRESH ics_forms row whose ai_draft_id points at a never-approved
    // draft. The real server-side assertAiOriginApproved guard must still
    // reject this with 400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED.
    const userId = await getCurrentUserId(page);

    const unapprovedDraft = await apiFetchViaPage<{ id: string }>(page, '/api/v1/ai-drafts', {
      method: 'POST',
      body: {
        target_feature: 'ics_form',
        target_field: 'narrative',
        context: 'Never-approved bypass-proof draft',
        requesting_user_id: userId,
      },
    });
    expect(unapprovedDraft.status).toBe(200);
    const unapprovedDraftId = unapprovedDraft.body.id;

    const freshForm = await apiFetchViaPage<{ id: string }>(
      page,
      `/api/v1/incidents/${incidentId}/ics-forms`,
      {
        method: 'POST',
        body: {
          form_type: 'ICS-201',
          content: { narrative: 'Bypass attempt — never approved via ai-drafts' },
          ai_origin: true,
          ai_draft_id: unapprovedDraftId,
        },
      },
    );
    expect(freshForm.status).toBe(201);
    const freshFormId = freshForm.body.id;

    const bypassAttempt = await apiFetchViaPage<{ error_code: string }>(
      page,
      `/api/v1/incidents/${incidentId}/ics-forms/${freshFormId}/approve`,
      { method: 'POST', body: { approved_by: userId } },
    );
    expect(bypassAttempt.status).toBe(400);
    expect(bypassAttempt.body.error_code).toBe('AIDRAFT_UNAPPROVED_WRITE_BLOCKED');
  });
});
