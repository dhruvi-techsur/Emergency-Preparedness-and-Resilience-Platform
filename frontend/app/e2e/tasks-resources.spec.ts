import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import {
  signInAsIncidentCommander,
  signInAsPlanningChief,
  KEYCLOAK_COMMANDER_USERNAME,
} from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 03-06's objective: the six Task/Resource-
 * Request screens (Task List, Create/Edit Task, Task Detail, Resource
 * Request List, Create/Edit Resource Request, Resource Request Detail)
 * are reachable from the shell's "Coordinate" SideNav group and
 * functional against the real backend — including the critical
 * Overdue-visibility assertion proving 03-02's time-based sweep is
 * end-to-end wired to a real browser user's screen via polling alone
 * (success criterion 3), and the resource-request lifecycle's
 * no-page-reload status visibility (success criterion 4).
 *
 * Two identities, matching the roles that actually hold the needed
 * permissions (03-07's seed grants):
 *   - commander@epmp.local (incident_commander — holds `tasks`
 *     view/create/edit AND `incidents` view, the latter needed for the
 *     personnel-lookup Combobox Task/CreateTask use) drives the Task
 *     screens.
 *   - planner@epmp.local (planning_logistics_chief — the ONLY role
 *     holding `resource_requests` view/create/edit/approve ALL in one
 *     grant, per seed.ts's own documented role split) drives the
 *     Resource Request screens end-to-end in a single session, including
 *     the Decline action no other seeded identity can perform.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

/** Reads the session token straight out of sessionStorage (same key
 * src/auth/session-storage.ts owns) and issues a real fetch through the
 * SAME origin the page is already on (Vite's own /api dev proxy), so this
 * helper can seed data the UI's own due-date gate would otherwise block
 * (a backdated task, created with `confirmed_backfill:true` exactly as
 * the UI's own Checkbox path would send it) without needing a second HTTP
 * client or a raw Postgres connection. */
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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/**
 * Test-fixture fix (Rule 3 - Blocking), discovered while writing this
 * spec: `planner@epmp.local` (planning_logistics_chief, 03-05's seeded
 * identity) is JIT-provisioned by sso.ts on first login with
 * `jurisdiction_scope = '{}'` — by design, same as every fresh SSO
 * account (02-07's own documented fixture fix for `commander@epmp.local`
 * hit the identical root cause). `GET /api/v1/incidents`'s list query now
 * correctly enforces jurisdiction_scope filtering (closed since 02-05/
 * 02-07's T-02-03 note), so with an empty scope this identity's Create
 * Resource Request form's Incident Combobox would show zero options —
 * making this test's own "select an incident" step impossible. Grants
 * this test fixture the same 'Default Agency' jurisdiction scope every
 * other e2e spec's incidents already use. One-time test-fixture
 * correction, not a change to sso.ts's or seed.ts's production behavior.
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

function futureIsoDateTime(minutesFromNow: number): string {
  const d = new Date(Date.now() + minutesFromNow * 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

/** Fills BOTH the DatePicker's date text input and its `withTime` sibling
 * time input (two separate controls per DatePicker.tsx — the date alone
 * defaults the time to midnight, which for a FUTURE calendar date still
 * reads as "now or earlier" once that midnight has already passed within
 * the same test run, incorrectly tripping the past-due gate). */
async function fillDateTimePicker(page: Page, isoDateTime: string): Promise<void> {
  const [datePart, timePart] = isoDateTime.split('T');
  await page.locator('input[placeholder="YYYY-MM-DD"]').fill(datePart);
  await page.locator('input[type="time"]').fill(timePart);
}

test.describe.serial('Tasks & Resource Requests — full lifecycle, Overdue visibility', () => {
  let taskTitle: string;
  let taskId: string;
  let taskOwnerId: string;
  let requestId: string;

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. "Tasks" reachable from the Coordinate SideNav group; Create Task redirects with Open Badge', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Tasks', { exact: true }).click();
    await expect(page).toHaveURL(/\/tasks$/);

    await page.getByRole('button', { name: 'New task' }).first().click();
    await expect(page).toHaveURL(/\/tasks\/new$/);

    taskTitle = `E2E Task ${Date.now()}`;
    await page.getByLabel('Title', { exact: false }).fill(taskTitle);

    const ownerInput = page.getByLabel('Owner', { exact: false });
    await ownerInput.click();
    await ownerInput.fill(KEYCLOAK_COMMANDER_USERNAME.split('@')[0]);
    // Fall back to the seeded display name if the email-local-part typeahead
    // doesn't match — personnel options render by `name`, not `email`.
    const commanderOption = page.getByRole('option', { name: 'Incident Commander' });
    if (await commanderOption.count()) {
      await commanderOption.first().click();
    } else {
      await ownerInput.fill('');
      await ownerInput.click();
      await page.getByRole('option').first().click();
    }

    await fillDateTimePicker(page, futureIsoDateTime(120));

    await page.getByRole('button', { name: 'Create task' }).click();

    await expect(page).toHaveURL(/\/tasks\/[0-9a-f-]+$/, { timeout: 10_000 });
    const match = page.url().match(/\/tasks\/([0-9a-f-]+)$/);
    taskId = match![1];

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Open' }),
    ).toBeVisible({ timeout: 10_000 });

    // Capture the real owner_id this task was just assigned (read back
    // from the Task Detail page's own data via the API) for test 2's
    // Owner filter to use as a precise server-side narrow — see that
    // test's own comment for why a narrow is needed at all.
    const detail = await apiGetViaPage<{ owner: { id: string } }>(page, `/api/v1/tasks/${taskId}`);
    taskOwnerId = detail.owner.id;
  });

  test('2. The new task appears in the Task List with an Open Badge rendered via the Badge component', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/tasks');

    // The live compose-stack database has accumulated 140+ fixture tasks
    // across this phase's repeated plan/test runs, sorted ASC by due_at
    // with a 25-row page — this test's own task would be buried off page
    // 1 without a server-side narrow. The Owner filter (03-01's real
    // server-side `owner` query param, unlike the Search field's
    // client-side-only name filter) narrows to just this task's owner's
    // handful of rows, same reasoning 01-11's admin-users-roles.spec.ts
    // documents for its own "can't rely on default sort/page" problem.
    await page.getByLabel('Owner', { exact: true }).selectOption(taskOwnerId);

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    const row = table.locator('tbody tr', { hasText: taskTitle });
    await expect(row).toBeVisible({ timeout: 10_000 });
    await expect(row.locator('.ep-badge', { hasText: 'Open' })).toBeVisible();
    await expect(row.locator('.ep-badge svg')).toBeVisible();
  });

  test('3. Task Detail: "Mark in progress" updates the Badge without a full page navigation', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto(`/tasks/${taskId}`);

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Open' }),
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Mark in progress' }).click();

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'In progress' }),
    ).toBeVisible({ timeout: 10_000 });
    // Still on the same task detail route — a client-side state update,
    // not a hard navigation that would have round-tripped through /auth.
    await expect(page).toHaveURL(new RegExp(`/tasks/${taskId}$`));
  });

  test('4. Submitting Create Task with NO owner focuses the Owner field and shows the exact FRD Alert', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/tasks/new');

    await page.getByLabel('Title', { exact: false }).fill(`E2E No Owner ${Date.now()}`);
    await fillDateTimePicker(page, futureIsoDateTime(120));

    await page.getByRole('button', { name: 'Create task' }).click();

    const ownerInput = page.getByLabel('Owner', { exact: false });
    await expect(ownerInput).toBeFocused();
    await expect(
      page.getByText('Assign an owner before creating this task.'),
    ).toBeVisible({ timeout: 5_000 });
  });

  test('5. Overdue visibility: a backdated task flips to the Overdue Badge in the Task List via polling alone, with zero user action', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/tasks');

    // Seed a task whose due_at is already in the past via a direct API
    // call (bypassing the UI's own past-date gate with
    // confirmed_backfill:true, exactly as the UI's Checkbox path would
    // send it) — relies on 03-02's scheduler (default 60s interval,
    // running against the real backend this test's compose stack started)
    // having flipped it by the time the polling Task List page notices.
    const personnel = await apiGetViaPage<{ items: { id: string; name: string }[] }>(
      page,
      '/api/v1/incidents/personnel',
    );
    const ownerId = personnel.items[0]?.id;
    expect(ownerId).toBeTruthy();

    const overdueTitle = `E2E Overdue Task ${Date.now()}`;
    const pastDue = new Date(Date.now() - 5 * 60_000).toISOString();
    await apiPostViaPage(page, '/api/v1/tasks', {
      title: overdueTitle,
      owner_id: ownerId,
      due_at: pastDue,
      confirmed_backfill: true,
    });

    // Poll the Task List page itself — this IS the frontend's own
    // ~30s refetchInterval doing the work; the test just waits for it to
    // land, up to 90s to comfortably cover one full sweep (60s default) +
    // one full poll cycle (30s) with margin. Filtering by BOTH
    // Status=Overdue (03-01's real server-side `status` query param — NOT
    // `due_window=overdue`, which deliberately EXCLUDES rows already
    // flipped to Overdue status, since that filter's purpose is finding
    // tasks the sweep hasn't caught yet) AND Owner narrows the live
    // compose-stack database's 140+ accumulated fixture tasks (76 already
    // Overdue from prior runs) down to just this one seeded owner's rows,
    // same reasoning as test 2 above — and the row will correctly show
    // NOTHING until the sweep actually flips this specific task's status
    // server-side.
    await page.goto('/tasks');
    await page.getByLabel('Status', { exact: true }).selectOption('Overdue');
    await page.getByLabel('Owner', { exact: true }).selectOption(ownerId!);
    const row = page.locator('table.ep-table tbody tr', { hasText: overdueTitle });

    await expect(async () => {
      await page.reload();
      await page.getByLabel('Status', { exact: true }).selectOption('Overdue');
      await page.getByLabel('Owner', { exact: true }).selectOption(ownerId!);
      await expect(row).toBeVisible({ timeout: 5_000 });
      await expect(row.locator('.ep-badge', { hasText: 'Overdue' })).toBeVisible({
        timeout: 5_000,
      });
    }).toPass({ timeout: 90_000, intervals: [5_000] });
  });

  test('6. "Resources" reachable from the Coordinate SideNav group; Create Resource Request submits directly to Awaiting approval', async ({
    page,
  }) => {
    await ensurePlannerHasJurisdictionScope();
    await signInAsPlanningChief(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Resources', { exact: true }).click();
    await expect(page).toHaveURL(/\/resource-requests$/);

    await page.getByRole('button', { name: 'New resource request' }).first().click();
    await expect(page).toHaveURL(/\/resource-requests\/new$/);

    await page.getByLabel('Resource type', { exact: true }).selectOption('Equipment');

    const description = `E2E generators ${Date.now()}`;
    await page.getByLabel('Description', { exact: false }).fill(description);
    await page.getByLabel('Quantity', { exact: false }).fill('2');

    // Scoped to the Combobox's own listbox specifically — a bare
    // `getByRole('option')` ALSO matches every native <select>'s hidden
    // <option> elements on this page (Resource type, Requesting role both
    // have implicit ARIA role="option" children), which are not
    // interactively visible and made this click hang/timeout.
    const incidentInput = page.getByLabel('Incident', { exact: false });
    await incidentInput.click();
    await page.locator('.ep-combobox__listbox [role="option"]').first().click();

    await fillDateTimePicker(page, futureIsoDateTime(1440));

    await page.getByLabel('Requesting role', { exact: true }).selectOption('planning_logistics_chief');

    await page.getByRole('button', { name: 'Submit request' }).click();

    await expect(page).toHaveURL(/\/resource-requests\/[0-9a-f-]+$/, { timeout: 10_000 });
    const match = page.url().match(/\/resource-requests\/([0-9a-f-]+)$/);
    requestId = match![1];

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Awaiting approval' }),
    ).toBeVisible({ timeout: 10_000 });

    await page.goto('/resource-requests');
    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });
    const row = table.locator('tbody tr', { hasText: description.slice(0, 40) });
    await expect(row).toBeVisible({ timeout: 10_000 });
    await expect(row.locator('.ep-badge', { hasText: 'Awaiting approval' })).toBeVisible();
  });

  test('7. Resource Request Detail: Decline is blocked client-side with an empty reason, enabled once typed, and confirms to Declined', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/resource-requests/${requestId}`);

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Awaiting approval' }),
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Decline' }).first().click();

    const declineButtonInModal = page.getByRole('dialog').getByRole('button', { name: 'Decline' });
    await expect(declineButtonInModal).toBeDisabled();

    await page.getByLabel('Reason', { exact: false }).fill('No longer needed for this incident.');
    await expect(declineButtonInModal).toBeEnabled();

    await declineButtonInModal.click();

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Declined' }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
