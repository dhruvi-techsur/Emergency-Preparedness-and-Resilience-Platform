import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { simulateDocumentAccessRevocation } from '../integration-gateway/document-adapter.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 03-01's tasks.test.ts / 03-04's resource-requests.test.ts.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.
//
// A shared test role grants plans:{view,create,edit,review} to BOTH the
// author and reviewer test users — this test's RBAC setup only needs to
// prove the APPLICATION-layer self-approval gate works independent of
// role-level separation, since OPA already handles the coarser
// role-based gate elsewhere (a real deployment might separate 'review'
// to a narrower role via 03-07's seed).

let authorId: string;
let reviewerId: string;
let testRoleId: string;
let testJurisdictionId: string;
let authorToken: string;
let reviewerToken: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for plans.test.ts'],
  );
  return inserted[0].id;
}

async function findOrCreateJurisdiction(name: string): Promise<string> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = $1 AND type = $2`,
    [name, 'county'],
  );
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO jurisdictions (name, type) VALUES ($1, $2) RETURNING id`,
    [name, 'county'],
  );
  return inserted[0].id;
}

async function createTestIncident(token: string, jurisdictionId: string): Promise<{ id: string; opened_at: string }> {
  const openedAt = new Date().toISOString();
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Plans Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: openedAt,
    });
  expect(res.status).toBe(201);
  return { id: res.body.id, opened_at: openedAt };
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Plans Test Jurisdiction');
  testRoleId = await findOrCreateRole('plans_test_role', 'PER-03');

  const grants: Array<[string, string[]]> = [
    ['incidents', ['view', 'create', 'edit']],
    ['plans', ['view', 'create', 'edit', 'review']],
    ['tasks', ['view', 'create', 'edit']],
  ];
  for (const [feature, actions] of grants) {
    const existingPerm = await query<{ id: string }>(
      `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
      [testRoleId, feature],
    );
    if (!existingPerm[0]) {
      await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
        testRoleId,
        feature,
        actions,
      ]);
    } else {
      await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [actions, existingPerm[0].id]);
    }
  }

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const authorEmail = `plans-author-test-${Date.now()}@epmp.local`;
  const authorInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [authorEmail, 'Plans Test Author', testRoleId, [testJurisdictionId]],
  );
  authorId = authorInserted[0].id;

  const reviewerEmail = `plans-reviewer-test-${Date.now()}@epmp.local`;
  const reviewerInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [reviewerEmail, 'Plans Test Reviewer', testRoleId, [testJurisdictionId]],
  );
  reviewerId = reviewerInserted[0].id;

  authorToken = await mintSessionToken({
    id: authorId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
  reviewerToken = await mintSessionToken({
    id: reviewerId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('plans module — Draft -> Review -> Approved workflow, self-approval gate, link-tasks, materialization', () => {
  it('runs the full plan lifecycle end-to-end', async () => {
    // 2. Create a plan with 2 sections as the author.
    const createRes = await request(app.server)
      .post('/api/v1/plans')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        name: `Flood Response EOP ${Date.now()}`,
        type: 'EOP',
        jurisdiction_id: testJurisdictionId,
        content_sections: [
          { heading: 'Activation Criteria', body: 'When the river gauge exceeds flood stage.' },
          { heading: 'Pre-positioning', body: 'Pre-position generators and sandbags.' },
        ],
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('Draft');
    const planId = createRes.body.id;
    const sectionId = createRes.body.sections[1].id;

    // 3. Submit for review as the author.
    const submitRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/submit-review`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send();
    expect(submitRes.status).toBe(200);
    expect(submitRes.body.status).toBe('Review');

    const versionRows = await query<{ submitted_by: string; reviewed_by: string | null }>(
      `SELECT submitted_by, reviewed_by FROM plan_versions WHERE plan_id = $1 AND version_number = 1`,
      [planId],
    );
    expect(versionRows).toHaveLength(1);
    expect(versionRows[0].submitted_by).toBe(authorId);
    expect(versionRows[0].reviewed_by).toBeNull();

    // 4. Self-approval attempt by the SAME author: 403, plan stays in Review.
    const selfApproveRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/review`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ review_action: 'approve' });
    expect(selfApproveRes.status).toBe(403);
    expect(selfApproveRes.body.error_code).toBe('SELF_APPROVAL_BLOCKED');

    const stillReviewRes = await request(app.server)
      .get(`/api/v1/plans/${planId}`)
      .set('Authorization', `Bearer ${authorToken}`);
    expect(stillReviewRes.status).toBe(200);
    expect(stillReviewRes.body.status).toBe('Review');

    // 5. Approve as the DIFFERENT reviewer user: 200, Approved, version incremented.
    const approveRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/review`)
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ review_action: 'approve' });
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('Approved');
    expect(approveRes.body.version).toBe(2);

    const detailAfterApproveRes = await request(app.server)
      .get(`/api/v1/plans/${planId}`)
      .set('Authorization', `Bearer ${authorToken}`);
    expect(detailAfterApproveRes.status).toBe(200);
    const reviewedEntry = detailAfterApproveRes.body.version_history.find(
      (v: { version_number: number }) => v.version_number === 1,
    );
    expect(reviewedEntry.reviewed_by).toBe(reviewerId);
    expect(reviewedEntry.reviewed_at).toBeTruthy();

    // 6. Link a new task template to the now-Approved plan's section: 204,
    // NOT 409 — link-tasks succeeds on an Approved plan per this plan's
    // explicit status-gate decision.
    const linkRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/sections/${sectionId}/link-tasks`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        new_template: {
          default_title: 'Pre-position generators',
          default_owner_role: 'plans_test_role',
          default_due_offset_minutes: 120,
        },
      });
    expect(linkRes.status).toBe(204);

    const detailAfterLinkRes = await request(app.server)
      .get(`/api/v1/plans/${planId}`)
      .set('Authorization', `Bearer ${authorToken}`);
    expect(detailAfterLinkRes.status).toBe(200);
    const linkedSection = detailAfterLinkRes.body.sections.find((s: { id: string }) => s.id === sectionId);
    expect(linkedSection.linked_task_templates).toHaveLength(1);

    // 7. Create a test incident with a known opened_at; materialize tasks;
    // assert the cross-module TaskService.createFromTemplate call lands a
    // row 03-01's own GET /api/v1/tasks endpoint can read back.
    const incident = await createTestIncident(authorToken, testJurisdictionId);

    const materializeRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/materialize-tasks`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ incident_id: incident.id });
    expect(materializeRes.status).toBe(200);
    expect(materializeRes.body.created).toHaveLength(1);
    expect(materializeRes.body.created[0].title).toBe('Pre-position generators');

    const expectedDueAt = new Date(new Date(incident.opened_at).getTime() + 120 * 60_000);

    const tasksListRes = await request(app.server)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${authorToken}`)
      .query({ incident: incident.id });
    expect(tasksListRes.status).toBe(200);
    const materializedTask = tasksListRes.body.items.find(
      (t: { id: string }) => t.id === materializeRes.body.created[0].id,
    );
    expect(materializedTask).toBeTruthy();
    expect(materializedTask.due_at).toBe(expectedDueAt.toISOString());
  });

  it('attempting to approve a Draft-status plan directly returns 409 INVALID_STATUS_TRANSITION', async () => {
    const createRes = await request(app.server)
      .post('/api/v1/plans')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        name: `Direct Approve Attempt ${Date.now()}`,
        type: 'SOP',
        jurisdiction_id: testJurisdictionId,
        content_sections: [{ heading: 'Section A', body: 'Body text' }],
      });
    expect(createRes.status).toBe(201);
    const planId = createRes.body.id;

    const approveRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/review`)
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ review_action: 'approve' });
    expect(approveRes.status).toBe(409);
    expect(approveRes.body.error_code).toBe('INVALID_STATUS_TRANSITION');
  });

  it('submitting an empty plan for review returns 422 PLAN_EMPTY', async () => {
    const createRes = await request(app.server)
      .post('/api/v1/plans')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({
        name: `Empty Plan ${Date.now()}`,
        type: 'Annex',
        jurisdiction_id: testJurisdictionId,
      });
    expect(createRes.status).toBe(201);
    const planId = createRes.body.id;

    const submitRes = await request(app.server)
      .post(`/api/v1/plans/${planId}/submit-review`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send();
    expect(submitRes.status).toBe(422);
    expect(submitRes.body.error_code).toBe('PLAN_EMPTY');
  });

  // 08-06 (F17 final hard requirement): a "Link live" document's flagged
  // "source changed" state is visible in GET /api/v1/plans/{id}'s new
  // document_links array, and can ONLY be cleared via the dedicated
  // acknowledge PATCH route — never automatically.
  describe('document_links flagged-state surface + acknowledge route', () => {
    it('GET /api/v1/plans/{id} includes a document_links row with content_status=changed, and the acknowledge route clears it exactly once', async () => {
      const createRes = await request(app.server)
        .post('/api/v1/plans')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          name: `Live-Link Flag Test ${Date.now()}`,
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
          content_sections: [{ heading: 'Section A', body: 'Body text' }],
        });
      expect(createRes.status).toBe(201);
      const planId = createRes.body.id;

      // Directly insert a document_links row with content_status already
      // 'changed', simulating what runDocumentLinkSync() would have
      // produced on a real detection tick — this test proves the READ
      // surface and the acknowledge route, not the scheduled job itself
      // (that's document-adapter's own structural grep verification).
      const linkInserted = await query<{ id: string }>(
        `INSERT INTO document_links (plan_id, external_document_id, source_system, mode, imported_by, content_status, content_flagged_at)
         VALUES ($1, 'DOC-SOP-002', 'SharePoint', 'link_live', $2, 'changed', now())
         RETURNING id`,
        [planId, authorId],
      );
      const linkId = linkInserted[0].id;

      // 1. GET includes the row with content_status: 'changed'.
      const getRes = await request(app.server)
        .get(`/api/v1/plans/${planId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(getRes.status).toBe(200);
      const linkRow = getRes.body.document_links.find((d: { id: string }) => d.id === linkId);
      expect(linkRow).toBeTruthy();
      expect(linkRow.content_status).toBe('changed');

      // 2. Acknowledge as the author (holding plans:edit) returns 200, and
      // a follow-up GET shows content_status: 'current'.
      const ackRes = await request(app.server)
        .patch(`/api/v1/plans/${planId}/document-links/${linkId}/acknowledge`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send();
      expect(ackRes.status).toBe(200);

      const getAfterAckRes = await request(app.server)
        .get(`/api/v1/plans/${planId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(getAfterAckRes.status).toBe(200);
      const linkRowAfterAck = getAfterAckRes.body.document_links.find(
        (d: { id: string }) => d.id === linkId,
      );
      expect(linkRowAfterAck.content_status).toBe('current');

      const ackedRows = await query<{ acknowledged_by: string | null }>(
        `SELECT acknowledged_by FROM document_links WHERE id = $1`,
        [linkId],
      );
      expect(ackedRows[0].acknowledged_by).toBe(authorId);

      // 3. A second acknowledge attempt on the SAME (already-acknowledged)
      // link returns 409 DOCUMENT_LINK_NOT_FLAGGED.
      const secondAckRes = await request(app.server)
        .patch(`/api/v1/plans/${planId}/document-links/${linkId}/acknowledge`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send();
      expect(secondAckRes.status).toBe(409);
      expect(secondAckRes.body.error_code).toBe('DOCUMENT_LINK_NOT_FLAGGED');
    });
  });

  // REVIEW.md W1 fix: document-adapter.ts's simulateDocumentAccessRevocation
  // is the deterministic, test-reachable trigger for a source-side
  // permission downgrade — this test drives the REAL detection path (GET
  // /api/v1/plans/{id} -> fetchPlanDocumentLinks -> per-request
  // revalidateDocumentLinkPermission -> checkAndPersistPermission's
  // `stillGranted === false` branch), proving permission_status: 'revoked'
  // is genuinely reachable end-to-end, not dead code.
  describe('document_links permission revocation (F17)', () => {
    it("a link_live row whose importing user's access to the document is revoked shows permission_status: 'revoked' on the next GET", async () => {
      const createRes = await request(app.server)
        .post('/api/v1/plans')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          name: `Permission Revocation Test ${Date.now()}`,
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
          content_sections: [{ heading: 'Section A', body: 'Body text' }],
        });
      expect(createRes.status).toBe(201);
      const planId = createRes.body.id;

      // Link DOC-EOP-001 as the author via the REAL link route — this
      // lazily seeds authorId's simulated access set with the fixed
      // GRANTED_DOCUMENT_IDS split (same seeding trigger browseDocuments/
      // importDocument use).
      const linkRes = await request(app.server)
        .post('/api/v1/integrations/documents/DOC-EOP-001/link')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ plan_id: planId });
      expect(linkRes.status).toBe(201);
      const linkId = linkRes.body.id;

      // Sanity: before revocation, the row reads as 'valid'.
      const getBeforeRes = await request(app.server)
        .get(`/api/v1/plans/${planId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      const linkRowBefore = getBeforeRes.body.document_links.find(
        (d: { id: string }) => d.id === linkId,
      );
      expect(linkRowBefore.permission_status).toBe('valid');

      // Simulate the source-side permission downgrade.
      simulateDocumentAccessRevocation(authorId, 'DOC-EOP-001');

      // The next GET re-validates synchronously (F17's "at minimum, before
      // each render" rule) and must now show 'revoked'.
      const getAfterRes = await request(app.server)
        .get(`/api/v1/plans/${planId}`)
        .set('Authorization', `Bearer ${authorToken}`);
      expect(getAfterRes.status).toBe(200);
      const linkRowAfter = getAfterRes.body.document_links.find(
        (d: { id: string }) => d.id === linkId,
      );
      expect(linkRowAfter.permission_status).toBe('revoked');

      const persistedRows = await query<{ permission_status: string }>(
        `SELECT permission_status FROM document_links WHERE id = $1`,
        [linkId],
      );
      expect(persistedRows[0].permission_status).toBe('revoked');
    });
  });

  // 08-09 (gap closure, UAT ref 4): POST /api/v1/plans/import finally
  // "lands" an imported/linked document as a real Plan — closing the gap
  // where document_links rows were written with plan_id=NULL and no Plan
  // was ever created/attached.
  //
  // Deviation [Rule 1 - Bug, test-only]: uses a DEDICATED fixture user
  // (importTestToken/importTestId), not the file's shared authorToken/
  // authorId. document-adapter.ts's SIMULATED_USER_DOCUMENT_ACCESS map is
  // module-level, in-memory, and keyed by userId — the preceding
  // "document_links permission revocation" describe block above calls
  // simulateDocumentAccessRevocation(authorId, 'DOC-EOP-001'), which runs
  // earlier in this same file/process and would permanently revoke
  // authorId's DOC-EOP-001 access for the remainder of the suite,
  // producing a false-negative 403 on this describe block's own
  // DOC-EOP-001 import_copy test if it reused authorToken. A fresh user
  // gets its own lazily-seeded, unrevoked 2-of-3 access set.
  describe('POST /api/v1/plans/import — F17 gap closure (UAT ref 4)', () => {
    let importTestId: string;
    let importTestToken: string;

    beforeAll(async () => {
      const importTestEmail = `plans-import-test-${Date.now()}@epmp.local`;
      const importTestInserted = await query<{ id: string }>(
        `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
        [importTestEmail, 'Plans Import Test User', testRoleId, [testJurisdictionId]],
      );
      importTestId = importTestInserted[0].id;
      importTestToken = await mintSessionToken({
        id: importTestId,
        role_id: testRoleId,
        jurisdiction_scope: [testJurisdictionId],
      });
    });

    it('import_copy with no plan_id creates a new, GET-reachable Draft plan with source_document_ref persisted', async () => {
      const planName = `Imported EOP Test ${Date.now()}`;
      const importRes = await request(app.server)
        .post('/api/v1/plans/import')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          source_document_ref: 'DOC-EOP-001',
          mode: 'import_copy',
          name: planName,
          type: 'EOP',
          jurisdiction_id: testJurisdictionId,
        });
      expect(importRes.status).toBe(201);
      expect(importRes.body.status).toBe('Draft');
      expect(importRes.body.version).toBe(1);
      const planId = importRes.body.id;

      const getRes = await request(app.server)
        .get(`/api/v1/plans/${planId}`)
        .set('Authorization', `Bearer ${importTestToken}`);
      expect(getRes.status).toBe(200);

      const persistedRows = await query<{ source_document_ref: string | null }>(
        `SELECT source_document_ref FROM plans WHERE id = $1`,
        [planId],
      );
      expect(persistedRows[0].source_document_ref).toBe('DOC-EOP-001');
    });

    it('link_live with an existing plan_id attaches to THAT plan, not a new one', async () => {
      const createRes = await request(app.server)
        .post('/api/v1/plans')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          name: `Pre-existing Plan For Link ${Date.now()}`,
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
        });
      expect(createRes.status).toBe(201);
      const existingPlanId = createRes.body.id;

      const importRes = await request(app.server)
        .post('/api/v1/plans/import')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          source_document_ref: 'DOC-SOP-002',
          mode: 'link_live',
          plan_id: existingPlanId,
          name: 'unused',
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
        });
      expect(importRes.status).toBe(201);
      expect(importRes.body.id).toBe(existingPlanId);

      const linkRows = await query<{ id: string; plan_id: string; mode: string }>(
        `SELECT id, plan_id, mode FROM document_links WHERE plan_id = $1 AND mode = 'link_live'`,
        [existingPlanId],
      );
      expect(linkRows.length).toBeGreaterThan(0);
    });

    // REVIEW B1 (08-REVIEW.md iteration 1): the existing-plan-attach
    // branch previously ignored `mode` entirely and always called
    // linkDocument(), silently writing a 'link_live' row even when the
    // caller explicitly chose "Import copy." This is the previously-
    // untested combination (DOC-EOP-001 vs. the prior test's
    // DOC-SOP-002 avoids any cross-test access-set interference within
    // this same describe block's shared importTestId).
    it('import_copy with an existing plan_id attaches a import_copy row to THAT plan, not a new one', async () => {
      const createRes = await request(app.server)
        .post('/api/v1/plans')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          name: `Pre-existing Plan For Import Copy ${Date.now()}`,
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
        });
      expect(createRes.status).toBe(201);
      const existingPlanId = createRes.body.id;

      const importRes = await request(app.server)
        .post('/api/v1/plans/import')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          source_document_ref: 'DOC-EOP-001',
          mode: 'import_copy',
          plan_id: existingPlanId,
          name: 'unused',
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
        });
      expect(importRes.status).toBe(201);
      expect(importRes.body.id).toBe(existingPlanId);

      const linkRows = await query<{ id: string; plan_id: string; mode: string }>(
        `SELECT id, plan_id, mode FROM document_links WHERE plan_id = $1`,
        [existingPlanId],
      );
      expect(linkRows.length).toBeGreaterThan(0);
      expect(linkRows.every((row) => row.mode === 'import_copy')).toBe(true);
    });

    it('plan_id outside the caller jurisdiction_scope is rejected 404 PLAN_NOT_FOUND', async () => {
      const otherJurisdictionId = await findOrCreateJurisdiction('Plans Test Other Jurisdiction (08-09)');
      const outOfScopePlanInserted = await query<{ id: string }>(
        `INSERT INTO plans (name, type, jurisdiction_id, owner_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [`Out Of Scope Plan ${Date.now()}`, 'SOP', otherJurisdictionId, importTestId],
      );
      const outOfScopePlanId = outOfScopePlanInserted[0].id;

      const importRes = await request(app.server)
        .post('/api/v1/plans/import')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          source_document_ref: 'DOC-EOP-001',
          mode: 'link_live',
          plan_id: outOfScopePlanId,
          name: 'unused',
          type: 'SOP',
          jurisdiction_id: testJurisdictionId,
        });
      expect(importRes.status).toBe(404);
      expect(importRes.body.error_code).toBe('PLAN_NOT_FOUND');
    });

    it('an out-of-permission document is rejected 403 with NO orphaned plan created (both import_copy and link_live new-plan sub-paths)', async () => {
      const importCopyName = `Orphan Check Import Copy ${Date.now()}`;
      const importCopyRes = await request(app.server)
        .post('/api/v1/plans/import')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          source_document_ref: 'DOC-ANNEX-003',
          mode: 'import_copy',
          name: importCopyName,
          type: 'Annex',
          jurisdiction_id: testJurisdictionId,
        });
      expect(importCopyRes.status).toBe(403);
      expect(importCopyRes.body.error_code).toBe('IMPORT_PERMISSION_DENIED');

      const importCopyOrphanRows = await query<{ id: string }>(`SELECT id FROM plans WHERE name = $1`, [
        importCopyName,
      ]);
      expect(importCopyOrphanRows).toHaveLength(0);

      const linkLiveName = `Orphan Check Link Live ${Date.now()}`;
      const linkLiveRes = await request(app.server)
        .post('/api/v1/plans/import')
        .set('Authorization', `Bearer ${importTestToken}`)
        .send({
          source_document_ref: 'DOC-ANNEX-003',
          mode: 'link_live',
          name: linkLiveName,
          type: 'Annex',
          jurisdiction_id: testJurisdictionId,
        });
      expect(linkLiveRes.status).toBe(403);
      expect(linkLiveRes.body.error_code).toBe('IMPORT_PERMISSION_DENIED');

      const linkLiveOrphanRows = await query<{ id: string }>(`SELECT id FROM plans WHERE name = $1`, [
        linkLiveName,
      ]);
      expect(linkLiveOrphanRows).toHaveLength(0);
    });
  });
});
