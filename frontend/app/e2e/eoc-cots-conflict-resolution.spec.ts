import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { signInThroughKeycloak } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of Plan 08-03's objective (F13): a user viewing
 * `/admin/integration-health` sees the EOC COTS (WebEOC) row's unresolved
 * conflict expand into a side-by-side EPMP-value/external-value
 * comparison, with literal "Keep EPMP value"/"Keep WebEOC value" actions
 * that are the ONLY mechanism permitted to resolve it — proven both
 * through the real UI and via a direct-API-bypass rejection proof.
 *
 * Follows `admin-platform-sso.spec.ts`'s exact pattern: direct Postgres
 * access for fixture seeding, `signInThroughKeycloak` for the admin
 * identity, `test.describe.serial`. Relies on `npm run seed`'s own
 * `runEocCotsSync()` call (Plan 08-01's seed extension) producing the
 * `'EOC-CONFLICT-001'` fixture conflict rather than re-seeding, matching
 * `operating-picture-hazard-layers.spec.ts`'s precedent.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/** Same `fetch`-through-the-page pattern field-mobile-sync-conflict.spec.ts
 * and operating-picture-resource-markers.spec.ts already establish —
 * reads the session token straight out of sessionStorage and issues a
 * real request through the same origin the page is already on. This is
 * the "direct API bypass" mechanism this spec's tests 3/4 use to prove
 * the backend guards hold independent of the UI. */
async function apiPostViaPage(
  page: Page,
  path: string,
  body: object,
): Promise<{ status: number; body: Record<string, unknown> }> {
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
      const json = await res.json().catch(() => ({}));
      return { status: res.status, body: json };
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
    return res.json();
  }, path);
}

interface EocCotsConflictRow {
  id: string;
  record_type: string;
  system_name: string;
}

/** Confirms at least one unresolved EOC COTS conflict exists before the
 * tests run. Plan 08-01's seed.ts already seeds and conflict-detects the
 * 'EOC-CONFLICT-001' fixture on every `npm run seed` — if somehow none is
 * found (a fresh database that hasn't been seeded yet), insert one
 * directly via the same config-row chain eoc-cots-adapter.ts's own
 * findOrCreateEocCotsConfig uses. */
async function ensureUnresolvedConflictExists(): Promise<string> {
  const existing = await pool.query<{ id: string }>(
    `SELECT id FROM eoc_cots_conflicts WHERE resolution IS NULL ORDER BY created_at ASC LIMIT 1`,
  );
  if (existing.rows[0]) {
    return existing.rows[0].id;
  }

  const configRows = await pool.query<{ id: string }>(
    `SELECT id FROM eoc_cots_config WHERE vendor = 'WebEOC' LIMIT 1`,
  );
  let configId = configRows.rows[0]?.id;
  if (!configId) {
    const inserted = await pool.query<{ id: string }>(
      `INSERT INTO eoc_cots_config (vendor, endpoint_url, auth_config)
       VALUES ('WebEOC', 'https://stub.webeoc.local/api', '{"stub":true}')
       RETURNING id`,
    );
    configId = inserted.rows[0].id;
  }

  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO eoc_cots_conflicts (config_id, record_type, epmp_record_id, epmp_value, external_value)
     VALUES ($1, 'incident', gen_random_uuid(), '{"status":"Monitoring","source":"EPMP"}', '{"status":"Active","source":"WebEOC"}')
     RETURNING id`,
    [configId],
  );
  return inserted.rows[0].id;
}

test.describe.serial('Integration Health — EOC COTS conflict resolution', () => {
  let conflictId: string;

  test.beforeAll(async () => {
    conflictId = await ensureUnresolvedConflictExists();
  });

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. Integration Health shows the EOC COTS conflict row and both values side by side', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/integration-health');

    const reviewToggle = page.getByRole('button', { name: /conflicts? — review/ }).first();
    await expect(reviewToggle).toBeVisible({ timeout: 10_000 });
    await reviewToggle.click();

    const panel = page.locator('text=Unresolved conflicts:').first();
    await expect(panel).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText('EPMP value', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('WebEOC value', { exact: true }).first()).toBeVisible();

    const epmpPre = page.locator('pre').first();
    await expect(epmpPre).toBeVisible();
    const epmpText = await epmpPre.textContent();
    expect(epmpText?.length).toBeGreaterThan(0);

    const keepEpmpButton = page.locator('.ep-eoc-conflict__keep-epmp').first();
    const keepExternalButton = page.locator('.ep-eoc-conflict__keep-external').first();
    await expect(keepEpmpButton).toBeVisible();
    await expect(keepExternalButton).toBeVisible();
    await expect(keepEpmpButton).toHaveText('Keep EPMP value');
    await expect(keepExternalButton).toHaveText('Keep WebEOC value');

    // Neither button has focus on panel-open — no default/pre-selected
    // choice.
    const activeElementClass = await page.evaluate(() => document.activeElement?.className ?? '');
    expect(activeElementClass).not.toContain('ep-eoc-conflict__keep-epmp');
    expect(activeElementClass).not.toContain('ep-eoc-conflict__keep-external');
  });

  test('2. Clicking Keep EPMP value resolves the conflict and it disappears from the list', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/integration-health');

    const reviewToggle = page.getByRole('button', { name: /conflicts? — review/ }).first();
    await expect(reviewToggle).toBeVisible({ timeout: 10_000 });
    await reviewToggle.click();

    const keepEpmpButton = page.locator('.ep-eoc-conflict__keep-epmp').first();
    await expect(keepEpmpButton).toBeVisible({ timeout: 10_000 });
    await keepEpmpButton.click();

    // The panel updates (query invalidation completes) — no page reload.
    let navigationCount = 0;
    page.on('load', () => {
      navigationCount += 1;
    });

    await expect(async () => {
      const conflicts = await apiGetViaPage<{ items: EocCotsConflictRow[] }>(
        page,
        '/api/v1/integrations/eoc-cots/conflicts',
      );
      const stillPresent = conflicts.items.some((c) => c.id === conflictId);
      expect(stillPresent).toBe(false);
    }).toPass({ timeout: 10_000 });

    expect(navigationCount).toBe(0);
  });

  test('3. A second resolve attempt on the same conflict is rejected, not silently re-accepted', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/integration-health');

    const userId = await page.evaluate(async () => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch('/api/v1/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const me = await res.json();
      return me.id as string;
    });

    const result = await apiPostViaPage(
      page,
      `/api/v1/integrations/eoc-cots/conflicts/${conflictId}/resolve`,
      { resolution: 'keep_epmp', resolved_by: userId },
    );

    expect(result.status).toBe(404);
    expect(result.body.error_code).toBe('EOC_CONFLICT_NOT_FOUND');
  });

  test('4. A direct API resolve attempt asserting a different resolved_by is rejected', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/integration-health');

    // Seed a FRESH unresolved conflict for this test — test 2 already
    // resolved the original one.
    const freshConflictId = await ensureUnresolvedConflictExists();
    const fabricatedUserId = '00000000-0000-0000-0000-000000000099';

    const result = await apiPostViaPage(
      page,
      `/api/v1/integrations/eoc-cots/conflicts/${freshConflictId}/resolve`,
      { resolution: 'keep_epmp', resolved_by: fabricatedUserId },
    );

    expect(result.status).toBe(403);
    expect(result.body.error_code).toBe('VERIFICATION_REQUIRES_NAMED_USER');
  });
});
