import { test, expect, type Page } from '@playwright/test';
import { signInAsIncidentCommander, signInAsFieldResponder } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 05-04's hardest success criterion: a sync
 * conflict can be seen side-by-side (field version vs. EOC version), with
 * NO default/pre-selected choice, and explicitly resolved by a named
 * person — with the outcome verifiably committed server-side, never a
 * silent auto-resolve.
 *
 * Seeding a conflict purely through UI interaction is awkward to
 * orchestrate (it needs a real offline-sync race between a report's
 * `captured_at` and an incident's `updated_at` bump) — this spec's
 * `beforeAll`-equivalent setup instead drives the REAL backend directly
 * through `POST /api/v1/field-reports/sync-batch`, the EXACT same setup
 * `field-reports.test.ts`'s own "detects a conflict" integration test
 * case uses (bump the incident's `updated_at`, then submit a report whose
 * `captured_at` predates that bump) — reused here at the browser/API
 * boundary via `fetch`-through-the-page, for consistency with that
 * backend test's own proven mechanism rather than inventing a second one.
 *
 * TWO identities, matching the real seed grants (05-05's
 * backend/scripts/seed.ts):
 *   - commander@epmp.local (incident_commander) holds `incidents`
 *     create/edit (02-01) — needed to create the test incident and bump
 *     its `updated_at` via a normal PATCH-adjacent write path. Does NOT
 *     hold `field_reports` create, so cannot itself seed the conflict.
 *   - field-responder@epmp.local (field_responder, 05-05's real seeded
 *     identity) holds `field_reports` view/create/resolve — it both
 *     seeds the conflict (via sync-batch) AND resolves it, matching the
 *     mockup's "field responder resolves their own conflict on-device"
 *     design (05-05's own documented decision).
 * Each identity switch is a SEPARATE `test()` — a second `signInAsX(page)`
 * call on an already-signed-in page hits the Keycloak SSO
 * session-carryover bug other Phase 4/5 specs already document (the
 * login form never reappears for the second identity). A fresh
 * Playwright `test()` gets a fresh browser context, the supported way to
 * change identity.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

/** Same `fetch`-through-the-page pattern tasks-resources.spec.ts/
 * operating-picture-resource-markers.spec.ts already establish — reads
 * the session token straight out of sessionStorage and issues a real
 * request through the same origin the page is already on. */
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

interface CreatedIncident {
  id: string;
  name: string;
}

test.describe.serial('Field Mobile — Sync Conflict Resolution', () => {
  let incident: CreatedIncident;
  let conflictId: string;

  test('setup. incident_commander creates a test incident and bumps its updated_at', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/incidents');

    const jurisdictions = await apiGetViaPage<{ items: { id: string; name: string }[] }>(
      page,
      '/api/v1/jurisdictions',
    );
    const jurisdictionId = jurisdictions.items[0]?.id;
    expect(jurisdictionId, 'At least one seeded jurisdiction must exist').toBeTruthy();

    const incidentName = `E2E SyncConflict ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const created = await apiPostViaPage<{ id: string }>(page, '/api/v1/incidents', {
      name: incidentName,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
    incident = { id: created.id, name: incidentName };

    // Bump updated_at to NOW via the generic PATCH route (name/type/
    // description only per 02-01's scope — incidents.ts's PATCH handler
    // unconditionally sets `updated_at = now()` on any successful write,
    // per its own `updates.push('updated_at = now()')` line) — same
    // "bump the incident" mechanism field-reports.test.ts's own
    // sync-batch conflict test uses, just reached through the real API
    // instead of a direct SQL UPDATE.
    await page.evaluate(
      async ({ path }) => {
        const token = window.sessionStorage.getItem('epmp_session_token');
        await fetch(path, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ description: 'Bumped for sync-conflict e2e setup' }),
        });
      },
      { path: `/api/v1/incidents/${incident.id}` },
    );
  });

  test('1-6. field_responder seeds a conflict via sync-batch, sees both versions with no default selection, resolves it, and the outcome commits server-side', async ({
    page,
  }) => {
    // 1. Sign in as the real seeded field responder identity.
    await signInAsFieldResponder(page);
    await page.goto('/field');

    // Seed step: submit a report whose captured_at PREDATES the
    // incident's just-bumped updated_at — field-reports.ts's sync-batch
    // conflict-detection rule (incident.updated_at > report.captured_at)
    // fires, producing a real sync_conflicts row with BOTH versions
    // preserved exactly as submitted/as-found.
    const beforeBump = new Date(Date.now() - 60_000).toISOString();
    const batchResult = await apiPostViaPage<{
      results: Array<{ client_report_id: string; status: string; conflict_id?: string }>;
    }>(page, '/api/v1/field-reports/sync-batch', {
      reports: [
        {
          client_report_id: `e2e-sync-conflict-${Date.now()}-${Math.random()}`,
          incident_id: incident.id,
          observation_type: 'Damage assessment',
          description: 'E2E seeded conflict — roof damage observed',
          captured_at: beforeBump,
        },
      ],
    });
    expect(batchResult.results[0].status).toBe('conflict');
    conflictId = batchResult.results[0].conflict_id!;
    expect(conflictId).toBeTruthy();

    // 2. Navigate to Sync Conflict Resolution for this specific conflict.
    await page.goto(`/field/conflicts/${conflictId}`);
    await expect(page.getByRole('heading', { name: 'Resolve conflict' })).toBeVisible();

    // 3. Assert BOTH "Your version" and "Current EOC version" sections
    // render with their respective content.
    await expect(page.getByRole('heading', { name: 'Your version' })).toBeVisible();
    await expect(page.getByText('Damage assessment')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Current EOC version' })).toBeVisible();
    await expect(page.getByText(incident.name)).toBeVisible();

    // 4. Assert NEITHER button is focused/pre-selected on page load.
    const keepMineButton = page.getByRole('button', { name: 'Keep my version' });
    const keepEocButton = page.getByRole('button', { name: 'Keep EOC version' });
    await expect(keepMineButton).not.toBeFocused();
    await expect(keepEocButton).not.toBeFocused();

    // 5. Click "Keep my version"; assert navigation to /field/queued.
    await keepMineButton.click();
    await page.waitForURL((url) => url.pathname === '/field/queued', { timeout: 15_000 });

    // 6. Query the backend directly to assert the conflict's resolution
    // is now 'keep_mine' and resolved_by is set — proving the resolution
    // was actually committed server-side, not just a client-side
    // navigation.
    const resolved = await apiGetViaPage<{
      resolution?: string;
      resolved_by?: string;
      resolved_at?: string;
    }>(page, `/api/v1/sync-conflicts/${conflictId}`);
    expect(resolved.resolution).toBe('keep_mine');
    expect(resolved.resolved_by).toBeTruthy();
    expect(resolved.resolved_at).toBeTruthy();
  });
});
