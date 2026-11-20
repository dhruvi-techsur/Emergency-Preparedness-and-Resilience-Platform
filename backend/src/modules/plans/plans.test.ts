import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

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
});
