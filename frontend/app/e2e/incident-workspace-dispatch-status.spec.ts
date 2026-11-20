import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander, signInThroughKeycloak } from './helpers/sign-in';
import { fetchCadDispatchEvents } from '../../../backend/src/modules/integration-gateway/cad-adapter';

/**
 * F15 (Plan 07-04) — frontend half of the read-only CAD/911 dispatch-status
 * panel in the Incident Workspace, plus confirmation that the admin
 * Integration Health view (01-11, unmodified by this plan beyond a copy
 * tweak) surfaces both Plan 07-01's hazard-feed and Plan 07-02's CAD rows.
 *
 * Signs in as commander@epmp.local (incident_commander) for workspace
 * tests — same identity incident-workspace.spec.ts uses, since
 * admin@epmp.local's secops_admin role holds no `incidents` permissions —
 * and as admin@epmp.local (via signInThroughKeycloak) for the
 * integration-health admin view, which IS gated on `admin`/`view`.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

async function createIncidentViaUi(page: import('@playwright/test').Page, namePrefix: string): Promise<string> {
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

/**
 * Finds the incident `cad_dispatch_events` is CURRENTLY linked to, rather
 * than assuming by name that it's still `UAT-ESCALATE-READY`. 07-02's own
 * SUMMARY documents this exact adapter limitation directly: the stub emits
 * one single, fixed `external_event_id` ('UAT-CAD-001'), and
 * `runCadIngestion`'s matching step re-evaluates `linked_incident_id` on
 * EVERY tick (no sticky/COALESCE behavior, per that plan's own Rule-1
 * fix) — so a backend integration-test run that exercises
 * `runCadIngestion('CAD-UAT-001')` against its own test-fixture incident
 * (whose name also contains the shared `CAD-UAT-001` number) re-links the
 * one row away from the seed's `UAT-ESCALATE-READY` demo incident. Reading
 * the actual current link directly is the only way this spec is correct
 * regardless of what already ran against this shared dev database before it.
 */
async function findCadLinkedIncidentId(): Promise<string> {
  const { rows } = await pool.query<{ linked_incident_id: string | null }>(
    `SELECT linked_incident_id FROM cad_dispatch_events WHERE external_event_id = 'UAT-CAD-001' LIMIT 1`,
  );
  const linkedId = rows[0]?.linked_incident_id;
  if (!linkedId) {
    throw new Error(
      'No cad_dispatch_events row is linked to any incident — run `npm run seed` or `runCadIngestion()` first.',
    );
  }
  return linkedId;
}

test.describe('Incident Workspace — Dispatch status (F15)', () => {
  test('1. Dispatch status Card renders with Provenance, no edit control, on the seeded CAD-linked incident', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    const incidentId = await findCadLinkedIncidentId();
    await page.goto(`/incidents/${incidentId}`);

    const dispatchCard = page.locator('.ep-card', { has: page.locator('.ep-card__title', { hasText: 'Dispatch status' }) });
    await expect(dispatchCard).toBeVisible({ timeout: 10_000 });

    // Provenance's verified-true (non-dashed) branch renders — the real
    // `.ep-provenance` class, never `.ep-provenance--unverified`.
    const provenanceChip = dispatchCard.locator('.ep-provenance');
    await expect(provenanceChip).toBeVisible();
    await expect(dispatchCard.locator('.ep-provenance--unverified')).toHaveCount(0);

    // No interactive control anywhere inside this Card's own subtree.
    await expect(dispatchCard.locator('button')).toHaveCount(0);
  });

  test('2. An incident with no linked CAD event shows the unmatched empty state', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await createIncidentViaUi(page, 'E2E Dispatch Unmatched');

    const dispatchCard = page.locator('.ep-card', { has: page.locator('.ep-card__title', { hasText: 'Dispatch status' }) });
    await expect(dispatchCard).toBeVisible({ timeout: 10_000 });
    await expect(dispatchCard.getByText('No dispatch data linked')).toBeVisible({ timeout: 10_000 });
    await expect(dispatchCard.locator('button')).toHaveCount(0);
  });

  test('3. Integration health admin view shows the hazard-feed and CAD rows after seeding', async ({ page }) => {
    await signInThroughKeycloak(page);
    await page.goto('/admin/integration-health');

    const table = page.locator('table.ep-table');
    await expect(table).toBeVisible({ timeout: 10_000 });

    const cadRow = table.locator('tbody tr', { hasText: 'CAD/911' });
    await expect(cadRow).toHaveCount(1);

    const hazardFeedRows = table.locator('tbody tr', { hasText: 'Hazard Feed' });
    await expect(hazardFeedRows.first()).toBeVisible();
  });

  test('4. Dispatch status Card shows last-known data (not an error) after a forced CAD outage', async ({ page }) => {
    // Force the deterministic CAD adapter outage path directly against the
    // raw adapter function (same pattern operating-picture.spec.ts
    // establishes for the GIS adapter's own forced-failure proof) — this
    // only exercises fetchCadDispatchEvents's own failure branch, it never
    // calls runCadIngestion(), so the seed-populated cad_dispatch_events
    // row for UAT-ESCALATE-READY is untouched by this call.
    await expect(fetchCadDispatchEvents(undefined, true)).rejects.toThrow(/CAD_FEED_UNREACHABLE/);

    await signInAsIncidentCommander(page);
    const incidentId = await findCadLinkedIncidentId();
    await page.goto(`/incidents/${incidentId}`);

    const dispatchCard = page.locator('.ep-card', { has: page.locator('.ep-card__title', { hasText: 'Dispatch status' }) });
    await expect(dispatchCard).toBeVisible({ timeout: 10_000 });

    // Still shows the previously-ingested status + Provenance — not an
    // error state, not a blank Card, not the unmatched EmptyState.
    await expect(dispatchCard.getByText(/^Status: /)).toBeVisible({ timeout: 10_000 });
    await expect(dispatchCard.locator('.ep-provenance')).toBeVisible();
    await expect(dispatchCard.getByText('No dispatch data linked')).toHaveCount(0);
  });
});
