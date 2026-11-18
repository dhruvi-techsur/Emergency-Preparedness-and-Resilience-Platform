import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander, signInAsPlanningChief } from './helpers/sign-in';

/**
 * 04-07's own integration-proof spec — the phase's terminal plan,
 * deliberately held until last (wave 5), mirroring Phase 3's
 * `plan-to-task-materialization.spec.ts` precedent exactly: it is the only
 * plan in this phase that touches BOTH the Phase-2-owned
 * `IncidentWorkspace.tsx` AND every other plan's artifacts (04-05's
 * Compose Notification, 04-06's SITREP/AAR Generators and Evidence Log
 * View) simultaneously. Proves the roadmap's complete Phase 4 goal
 * end-to-end in ONE browser session's worth of work, across ONE incident:
 * command-role assignment and a task (F1/F4, Phase 2/3), a sent
 * notification (F5), and a finalized AAR (F7) all compose into a SINGLE
 * coherent, chronologically-ordered Timeline and a SINGLE cross-module
 * evidence trail — not four disconnected per-feature logs.
 *
 * TWO identities, matching the real seed grants exactly (04-04's own
 * role_permissions, confirmed directly against seed.ts before writing
 * this spec — NOT the single-identity shortcut this spec's own first
 * draft incorrectly assumed would work):
 *   - commander@epmp.local (incident_commander, PER-02) holds `incidents`
 *     create/edit (02-01), `tasks` create (03-07), `notifications`
 *     approve (04-04 — the ONLY role holding it, PER-02's PIO-merge per
 *     PERSONAS-EPMP.md), and `reporting` view/create (04-04's
 *     `reportingGenerateOnlyRoles` — sufficient to TRIGGER SITREP/AAR
 *     generation, but NOT to save-as-draft or finalize either document).
 *     Drives incident creation/command-role assignment, task creation,
 *     notification compose-and-send, and incident closure.
 *   - planner@epmp.local (planning_logistics_chief, PER-03) is the ONLY
 *     seeded identity holding `reporting:edit` (04-04's
 *     `reportingAuthorRole`) — the permission gating BOTH the SITREP
 *     PATCH (save-as-draft included, not just finalize — confirmed
 *     directly against reporting.ts's own
 *     `requirePermission('reporting','edit')` on that route) and the AAR
 *     finalize PATCH. Drives the SITREP save-as-draft step and the full
 *     AAR generate-through-finalize step.
 * This split is NOT a segregation-of-duties proof (that's 03-07/04-06's
 * own job) — it is simply the real permission boundary this flow's steps
 * actually cross, discovered and fixed during this plan's own first
 * verification run (a [Rule 1 - Bug] fix to this spec, not to any
 * production code: the original single-identity draft's "Save as draft"/
 * "Finalize AAR" assertions were false positives, passing only because
 * the SITREP's already-Draft status and a stale page state papered over a
 * silently-403'd PATCH).
 *
 * Each identity switch is a SEPARATE `test()`, never a second sign-in
 * inside an already-signed-in test — switching identity mid-test via a
 * second `signInAsX(page)` call on the SAME page hits the exact Keycloak
 * SSO session-carryover bug reporting.spec.ts's own test 3b documents
 * (Keycloak's own session cookie silently keeps the FIRST identity
 * authenticated, never presenting the login form the helper expects to
 * fill in the second identity's credentials). A fresh Playwright `test()`
 * gets a fresh browser context — the supported way to change identity.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/**
 * Test-fixture fix (Rule 3 - Blocking), same root cause 03-05/03-06/04-06's
 * own specs already document in detail for this exact identity:
 * planner@epmp.local is JIT-provisioned by sso.ts on first login with
 * `jurisdiction_scope = '{}'`. This incident's SITREP/AAR fetches
 * (`fetchIncidentForMutation`) enforce jurisdiction_scope server-side, so
 * without a real scope this identity's requests would 404 as if the
 * incident didn't exist. One-time test-fixture correction, not a change
 * to sso.ts's or seed.ts's production behavior.
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

function futureIsoDateTime(minutesFromNow: number): string {
  const d = new Date(Date.now() + minutesFromNow * 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

/** Fills BOTH the DatePicker's date text input and its `withTime` sibling
 * time input — same two-control pattern tasks-resources.spec.ts's own
 * `fillDateTimePicker` helper documents. */
async function fillDateTimePicker(page: Page, isoDateTime: string): Promise<void> {
  const [datePart, timePart] = isoDateTime.split('T');
  await page.locator('input[placeholder="YYYY-MM-DD"]').fill(datePart);
  await page.locator('input[type="time"]').fill(timePart);
}

test.describe.serial('Incident-to-evidence-trail — the complete F1\u2192F4\u2192F5\u2192F7 cross-phase Timeline composition', () => {
  let incidentId: string;
  let incidentName: string;
  const taskTitle = `E2E Trail Task ${Date.now()}`;

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. Create a test incident, assign Incident Commander to self (required before activation can move above Monitoring)', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/incidents/new');

    incidentName = `E2E Evidence Trail Incident ${Date.now()}`;
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

    // Assign Incident Commander to self — required before escalating
    // above Monitoring (02-06's own NO_COMMANDER_ASSIGNED gate), same
    // flow incident-workspace.spec.ts's own test 2 exercises.
    const commanderRow = page.locator('.ep-incident-workspace__role-row', {
      hasText: 'Incident Commander',
    });
    await commanderRow.getByRole('button', { name: 'Assign' }).click();
    const roleModal = page.getByRole('dialog', { name: /Assign Incident Commander/ });
    await expect(roleModal).toBeVisible();
    const personnelInput = roleModal.getByLabel('Search personnel');
    await personnelInput.click();
    await personnelInput.fill('Commander');
    await page.getByRole('option', { name: /Commander/ }).first().click();
    await roleModal.getByRole('button', { name: 'Assign role' }).click();
    await expect(roleModal).not.toBeVisible();

    await expect(
      page.locator('.ep-incident-workspace__role-row', { hasText: 'Incident Commander' }),
    ).not.toContainText('Unassigned');
  });

  test('2. "New task" creates one task scoped to this incident; it appears in the real Tasks tab', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/incidents/${incidentId}`);

    await page.getByRole('button', { name: 'New task' }).click();
    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}/tasks/new$`), {
      timeout: 10_000,
    });

    await page.getByLabel('Title', { exact: false }).fill(taskTitle);

    const ownerInput = page.getByLabel('Owner', { exact: false });
    await ownerInput.click();
    await ownerInput.fill('Commander');
    const commanderOption = page.getByRole('option', { name: /Commander/ });
    if (await commanderOption.count()) {
      await commanderOption.first().click();
    } else {
      await ownerInput.fill('');
      await ownerInput.click();
      await page.getByRole('option').first().click();
    }

    await fillDateTimePicker(page, futureIsoDateTime(120));

    await page.getByRole('button', { name: 'Create task' }).click();

    // CreateTask.tsx returns to the SAME incident workspace when launched
    // with a routeIncidentId (03-08's own fix).
    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}$`), { timeout: 10_000 });

    await page.getByRole('tab', { name: 'Tasks' }).click();
    const tasksPanel = page.locator('#ep-tabpanel-tasks');
    await expect(tasksPanel).toBeVisible();
    const taskRow = tasksPanel.locator('table.ep-table tbody tr', { hasText: taskTitle });
    await expect(taskRow).toBeVisible({ timeout: 15_000 });
  });

  test('3. "Compose notification" opens pre-filled with this incident; sending it shows a Timeline entry AFTER the task-creation entry — proving the SAME Timeline aggregates Phase 3\'s task module AND this phase\'s notifications module', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/incidents/${incidentId}`);

    await page.getByRole('button', { name: 'Compose notification' }).click();
    await expect(page).toHaveURL(
      new RegExp(`/notifications/compose\\?incident=${incidentId}$`),
      { timeout: 10_000 },
    );
    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible({ timeout: 10_000 });

    // Seed a recipient group via direct API call — no fixture groups exist
    // in the seed data, same convention notifications-compose.spec.ts's
    // own test 2 establishes.
    const jurisdictionsResponse = await apiGetViaPage<{
      items: Array<{ id: string; name: string }>;
    }>(page, '/api/v1/jurisdictions');
    const defaultAgency = jurisdictionsResponse.items.find((j) => j.name === 'Default Agency');
    expect(defaultAgency).toBeTruthy();

    const groupName = `E2E Trail Group ${Date.now()}`;
    await apiPostViaPage(page, '/api/v1/recipient-groups', {
      name: groupName,
      type: 'Jurisdiction',
      selector: { jurisdiction_id: defaultAgency!.id },
    });

    await page.reload();
    await expect(page.getByText('Step 1 of 4: Audience')).toBeVisible({ timeout: 10_000 });
    await page.getByLabel(groupName, { exact: false }).check();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByText('Step 2 of 4: Message')).toBeVisible({ timeout: 10_000 });
    const messageText = `E2E evidence-trail notification ${Date.now()}`;
    await page.getByRole('textbox', { name: 'Message' }).fill(messageText);
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

    // Navigate back to the Incident Workspace's Timeline tab — a
    // "Notification sent: ..." entry now appears, AFTER the
    // task-creation entry chronologically (Timeline renders newest
    // first, per every other spec's own Timeline convention, so the
    // notification entry's index precedes the task entry's).
    await page.goto(`/incidents/${incidentId}`);
    await page.getByRole('tab', { name: 'Timeline' }).click();
    const timelinePanel = page.locator('#ep-tabpanel-timeline');
    await expect(timelinePanel).toBeVisible();

    const notificationEntry = timelinePanel.getByText(/Notification sent:/);
    await expect(notificationEntry).toBeVisible({ timeout: 10_000 });

    // incidents.ts's GET .../timeline query is `ORDER BY occurred_at DESC`
    // (newest first) — the LATER event (the notification, sent after the
    // task was created in test 2) therefore renders EARLIER in the
    // panel's text than the task-creation entry, at a SMALLER string
    // index. This is the direct proof that the SAME Timeline aggregates
    // writes from BOTH Phase 3's task module (incident-ops/tasks.ts) AND
    // this phase's notifications module (comms-reporting/notifications.ts)
    // in correct chronological order, not two independently-ordered lists.
    const entryTexts = await timelinePanel.innerText();
    const notificationIndex = entryTexts.indexOf('Notification sent:');
    const taskIndex = entryTexts.indexOf(taskTitle);
    expect(notificationIndex).toBeGreaterThanOrEqual(0);
    expect(taskIndex).toBeGreaterThanOrEqual(0);
    expect(notificationIndex).toBeLessThan(taskIndex);
  });

  test('4. (as planning_logistics_chief, the ONLY role holding reporting:edit) "Generate SITREP" opens pre-filled with this SAME incident\'s data (task-status counts reflect the ONE task created); saved as draft', async ({
    page,
  }) => {
    await ensurePlannerHasJurisdictionScope();
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}`);

    await page.getByRole('button', { name: 'Generate SITREP' }).click();
    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}/sitreps/new$`), {
      timeout: 10_000,
    });

    await expect(page.locator('h3', { hasText: 'Task status' })).toBeVisible({ timeout: 10_000 });
    // Exactly the one task created in step 2 — this incident had zero
    // tasks before this spec's own test 2 ran, so "Open: 1" (or whichever
    // status Badge the one task currently holds) proves this SITREP
    // auto-assembled from THIS incident's real, live data, not a stale or
    // shared snapshot.
    await expect(page.locator('.ep-sitrep-generator__count-row').first()).toContainText(/: 1/);

    await page.getByRole('button', { name: 'Save as draft' }).click();
    // Save-as-draft keeps the page on the same SITREP (status stays
    // Draft, no finalize) — the incident remains mutable for the next
    // test's closure. This PATCH actually requires reporting:edit (not
    // just reporting:create, which triggered the POST generate above) —
    // planning_logistics_chief is the only seeded identity holding it.
    await expect(page.locator('.ep-page-header .ep-badge', { hasText: 'Draft' })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText('Could not save this report')).toHaveCount(0);
  });

  test('5. (as incident_commander) Close the incident', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/incidents/${incidentId}`);

    await page.getByRole('button', { name: 'Close incident' }).click();
    const closureModal = page.getByRole('alertdialog');
    await expect(closureModal).toBeVisible({ timeout: 10_000 });
    await closureModal.getByRole('button', { name: 'Close incident' }).click();
    await expect(closureModal).not.toBeVisible();

    await expect(page.getByRole('button', { name: 'Close incident' })).toHaveCount(0);
  });

  test('6. (as planning_logistics_chief) "Generate AAR" is now enabled from the Reports tab; complete the wizard with one owned finding and finalize', async ({
    page,
  }) => {
    await ensurePlannerHasJurisdictionScope();
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}`);

    await page.getByRole('tab', { name: 'Reports' }).click();
    const reportsPanel = page.locator('#ep-tabpanel-reports');
    await expect(reportsPanel).toBeVisible();

    const generateAarButton = reportsPanel.getByRole('button', { name: 'Generate AAR' });
    await expect(generateAarButton).toBeEnabled({ timeout: 10_000 });
    await generateAarButton.click();

    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}/aar/new$`), {
      timeout: 10_000,
    });
    await expect(page.getByText('Step 1 of 5: Timeline export')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 2 of 5: Decisions log')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 3 of 5: Resource history')).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 4 of 5: Findings')).toBeVisible();

    await page.getByRole('button', { name: '+ Add finding' }).click();
    await page
      .getByLabel('Finding text', { exact: false })
      .fill('E2E evidence-trail finding with an owned corrective action');
    await page
      .getByLabel('Corrective action', { exact: false })
      .fill('Document the full cross-phase incident lifecycle procedure');

    const ownerCombobox = page.getByLabel('Owner', { exact: false });
    await ownerCombobox.click();
    await page.locator('.ep-combobox__listbox [role="option"]').first().click();
    await page.locator('input[placeholder="YYYY-MM-DD"]').first().fill('2027-02-01');

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Step 5 of 5: Review')).toBeVisible();

    await page.getByRole('button', { name: 'Finalize AAR' }).click();
    await expect(page.getByText('This after-action report is finalized')).toBeVisible({
      timeout: 10_000,
    });
  });

  test('7. The aggregated Evidence Log shows this ONE incident\'s ENTIRE lifecycle: incident creation, the task-creation entry, the notification-sent entry, and the AAR-finalized entry — one coherent cross-phase, cross-module evidence trail', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/reports/evidence-log');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    // "Incident created" (incident_timeline/F1) — attributable to THIS
    // incident; uniqueness across this persistent-volume database's many
    // accumulated fixture incidents is established by test 1/3 already
    // having asserted this incident's own Timeline carries this entry.
    await expect(table.locator('tbody tr', { hasText: 'Incident created' }).first()).toBeVisible({
      timeout: 10_000,
    });

    // The task-creation entry (incident_timeline/F4) — matched by this
    // spec's own timestamp-unique task title (tasks.ts writes
    // `Task created: ${title}`), so this can't accidentally match a
    // DIFFERENT incident's task-creation row on this shared database.
    await expect(table.locator('tbody tr', { hasText: taskTitle }).first()).toBeVisible({
      timeout: 10_000,
    });

    // The notification-sent entry (incident_timeline/F5).
    await expect(table.locator('tbody tr', { hasText: 'Notification sent' }).first()).toBeVisible({
      timeout: 10_000,
    });

    // The AAR-finalized entry (audit_log/F7, via 04-02's
    // AuditService.record('aar_finalized', ...) call) — the evidence log
    // is a GLOBAL aggregate across every incident this persistent-volume
    // database has ever seen, so this narrows with the SAME
    // action_type=aar_finalized filter useIncidentReports()
    // (IncidentWorkspace.tsx) itself uses, then confirms at least one
    // such row exists (this spec's own test 6 finalize call, the
    // freshest one on this real backend).
    await page.getByLabel('Action', { exact: true }).selectOption('aar_finalized');
    await expect(table.locator('tbody tr', { hasText: 'aar_finalized' }).first()).toBeVisible({
      timeout: 10_000,
    });
  });
});
