import { pool } from '../src/db/client.js';
import { clusterHazardFeedEvents } from '../src/modules/ai-assist/signal-clustering.js';
import { syncHazardLayersFromEvents, runHazardFeedIngestion } from '../src/modules/integration-gateway/hazard-feed-adapter.js';
import { runEocCotsSync } from '../src/modules/integration-gateway/eoc-cots-adapter.js';
import { runFacilitySync } from '../src/modules/integration-gateway/facility-adapter.js';
import { linkDocument, runDocumentLinkSync } from '../src/modules/integration-gateway/document-adapter.js';
import { sendViaProvider } from '../src/modules/integration-gateway/notification-provider-adapter.js';
import { runHrisRosterSync } from '../src/modules/integration-gateway/hris-roster-adapter.js';

interface FindOrInsertResult {
  id: string;
  inserted: boolean;
}

/**
 * Idempotent find-or-insert: looks up an existing row by `matchCols` (the
 * natural-unique identity of the entity per the seed spec), and inserts
 * only if none is found. This works uniformly whether or not the target
 * table declares a real UNIQUE constraint on those columns — some of
 * TechArch's auth-org tables do (roles.name, users.email,
 * role_permissions(role_id, feature), record_authority_registry.record_type)
 * and some don't (jurisdictions has no UNIQUE(name, type); sso_config has
 * no UNIQUE(protocol)). Since the migration's DDL must match TechArch
 * verbatim, idempotency here is implemented in the seed script rather than
 * by adding constraints the schema doesn't specify.
 *
 * Running this script twice is guaranteed to leave exactly one row per
 * seeded entity: the second run's SELECT finds the first run's INSERT and
 * skips re-inserting.
 */
async function findOrInsert(
  table: string,
  matchCols: string[],
  matchValues: unknown[],
  insertCols: string[],
  insertValues: unknown[],
): Promise<FindOrInsertResult> {
  const whereClause = matchCols.map((c, i) => `${c} = $${i + 1}`).join(' AND ');
  const existing = await pool.query(
    `SELECT id FROM ${table} WHERE ${whereClause} LIMIT 1`,
    matchValues,
  );
  if (existing.rows.length > 0) {
    return { id: (existing.rows[0] as { id: string }).id, inserted: false };
  }

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(', ');
  const inserted = await pool.query(
    `INSERT INTO ${table} (${insertCols.join(', ')}) VALUES (${placeholders}) RETURNING id`,
    insertValues,
  );
  return { id: (inserted.rows[0] as { id: string }).id, inserted: true };
}

async function main() {
  const summary: Record<string, { inserted: number; existing: number }> = {};

  function record(table: string, result: FindOrInsertResult) {
    summary[table] ??= { inserted: 0, existing: 0 };
    if (result.inserted) summary[table].inserted += 1;
    else summary[table].existing += 1;
  }

  // 1 jurisdiction: Default Agency (natural key: name + type)
  const jurisdiction = await findOrInsert(
    'jurisdictions',
    ['name', 'type'],
    ['Default Agency', 'county'],
    ['name', 'type'],
    ['Default Agency', 'county'],
  );
  record('jurisdictions', jurisdiction);

  // 5 persona roles (natural key: name, which IS unique in the schema)
  const roleDefs = [
    { name: 'eoc_director', persona_id: 'PER-01', description: 'EOC Director' },
    { name: 'incident_commander', persona_id: 'PER-02', description: 'Incident Commander' },
    { name: 'planning_logistics_chief', persona_id: 'PER-03', description: 'Planning/Logistics Chief' },
    { name: 'field_responder', persona_id: 'PER-04', description: 'Field Responder' },
    { name: 'secops_admin', persona_id: 'PER-05', description: 'Security & Operations Admin' },
  ] as const;

  const roleIds: Record<string, string> = {};
  for (const r of roleDefs) {
    const result = await findOrInsert(
      'roles',
      ['name'],
      [r.name],
      ['name', 'persona_id', 'description'],
      [r.name, r.persona_id, r.description],
    );
    roleIds[r.name] = result.id;
    record('roles', result);
  }

  // role_permissions: secops_admin gets full admin access; everyone gets platform access
  const secopsAdminId = roleIds['secops_admin'];

  const permAdmin = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [secopsAdminId, 'admin'],
    ['role_id', 'feature', 'actions'],
    [secopsAdminId, 'admin', ['view', 'create', 'edit', 'approve']],
  );
  record('role_permissions', permAdmin);

  for (const r of roleDefs) {
    const actions = r.name === 'secops_admin' ? ['view', 'edit'] : ['view'];
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[r.name], 'platform'],
      ['role_id', 'feature', 'actions'],
      [roleIds[r.name], 'platform', actions],
    );
    record('role_permissions', result);
  }

  // incidents feature (Phase 2, F1): incident_commander and eoc_director are
  // the FRD's "typically PER-01 or PER-02" creators/commanders of incidents,
  // so they get view/create/edit. planning_logistics_chief and
  // field_responder get read-only view access for situational awareness —
  // Phase 2's RBAC model grants no incident-mutation rights to either role.
  //
  // [Rule 2 - Missing Critical, 06-07] secops_admin ORIGINALLY got no
  // explicit 'incidents' row at all (admin/platform access is scoped to
  // the admin console, not incident-command operations) — correct for
  // Phases 1-5, since nothing secops_admin-facing ever read incident data.
  // That changed with THIS plan's S18.5 executive-briefing facet
  // (ExecutiveDashboard.tsx, PER-05's own screen): it reads
  // GET /api/v1/dashboard/summary (active_incidents) and
  // GET /api/v1/incidents (closed-incident count), both gated
  // requirePermission('incidents','view') — without this grant the ONLY
  // role that ever reaches this screen would 403 immediately on its own
  // landing view, not a cosmetic gap but a broken core dashboard. Adding
  // `view`-only (read-only situational awareness, same narrow grant
  // planning_logistics_chief/field_responder already hold below) is the
  // minimal fix; no mutation rights are added, preserving the "admin
  // console only" boundary for create/edit/approve.
  const incidentsFullAccessRoles = ['incident_commander', 'eoc_director'] as const;
  const incidentsViewOnlyRoles = [
    'planning_logistics_chief',
    'field_responder',
    'secops_admin',
  ] as const;

  // Phase 6 (06-01, F9): 'approve' added to incident_commander/
  // eoc_director's existing grant — the ICS-form approve route
  // (ics-forms.ts's POST .../ics-forms/{formId}/approve) is the FIRST
  // thing in this codebase that needs incidents:approve, since Phase 2 had
  // no approve-gated incident action of its own to grant it for.
  // findOrInsert only INSERTs when no matching (role_id, feature) row
  // exists yet — it does NOT update an existing row's actions column — so
  // a database where Phase 2's seed has ALREADY run once (leaving the OLD
  // 3-action row in place) needs the explicit re-assert UPDATE immediately
  // below, same "re-assert idempotently via UPDATE" pattern sso_config's
  // group_to_role_mapping block already uses elsewhere in this file.
  // planning_logistics_chief/field_responder's incidentsViewOnlyRoles loop
  // below is deliberately UNTOUCHED — they correctly keep ['view'] only.
  for (const roleName of incidentsFullAccessRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'incidents'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'incidents', ['view', 'create', 'edit', 'approve']],
    );
    record('role_permissions', result);
    await pool.query(`UPDATE role_permissions SET actions = $1 WHERE role_id = $2 AND feature = 'incidents'`, [
      ['view', 'create', 'edit', 'approve'],
      roleIds[roleName],
    ]);
  }

  for (const roleName of incidentsViewOnlyRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'incidents'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'incidents', ['view']],
    );
    record('role_permissions', result);
  }

  // tasks feature (Phase 3, F4): command-staff/logistics roles get full
  // create/edit per F4's Process step ("typically PER-02 or PER-03");
  // field_responder is view-only since task CREATION/reassignment is a
  // command/logistics action per F6's documented mobile scope (read/
  // update-your-own-status only, not full task administration).
  // secops_admin deliberately gets NO explicit 'tasks' row here — same
  // reasoning as the 'incidents' omission documented above: it already has
  // blanket admin/platform access scoped to the admin console, not
  // incident-command operations, and this is intentional, not an oversight.
  const tasksFullAccessRoles = ['incident_commander', 'eoc_director', 'planning_logistics_chief'] as const;

  for (const roleName of tasksFullAccessRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'tasks'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'tasks', ['view', 'create', 'edit']],
    );
    record('role_permissions', result);
  }

  // field_responder: `view` (read-only task visibility, as above) PLUS a
  // narrow `status` action — NOT `edit` — gating ONLY the
  // PATCH /api/v1/tasks/:id/status one-tap Start/Mark-done transition My
  // Tasks (field view) needs (05-03's F6 S6.2 screen). `edit` itself
  // (owner reassignment, title/description/due-date changes) remains
  // withheld from field_responder — this is a deliberately NARROWER grant
  // than the full command/logistics `edit` action above, not a relaxation
  // of it (review finding B2: the one-tap status button 403'd for every
  // real field_responder because no actions beyond `view` existed on this
  // row at all; adding `status` closes that gap without opening the wider
  // `edit` surface a field responder was never meant to have).
  //
  // findOrInsert alone would never widen an ALREADY-seeded row's actions
  // on a second run (its match is on (role_id, feature), which already
  // exists from this exact block's own prior run before this fix) — the
  // explicit UPDATE below is what makes the actions array actually change
  // for anyone who seeded before this fix shipped, while still being a
  // no-op (UPDATE sets the same already-correct array) on every run after.
  const tasksFieldResponderActions = ['view', 'status'];
  const existingTasksFieldResponderPerm = await pool.query<{ id: string; actions: string[] }>(
    `SELECT id, actions FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [roleIds['field_responder'], 'tasks'],
  );
  if (existingTasksFieldResponderPerm.rows.length === 0) {
    await pool.query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
      roleIds['field_responder'],
      'tasks',
      tasksFieldResponderActions,
    ]);
    record('role_permissions', { id: '', inserted: true });
  } else {
    const row = existingTasksFieldResponderPerm.rows[0];
    const current = row.actions;
    const alreadyCorrect =
      current.length === tasksFieldResponderActions.length &&
      tasksFieldResponderActions.every((a) => current.includes(a));
    if (!alreadyCorrect) {
      await pool.query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [
        tasksFieldResponderActions,
        row.id,
      ]);
    }
    record('role_permissions', { id: row.id, inserted: false });
  }

  // resource_requests feature (Phase 3, F4): planning_logistics_chief is the
  // FRD's explicitly-named "typically PER-03, logistics function" approver
  // AND the natural creator/tracker of requests, so it gets the full
  // view/create/edit/approve set (the `edit` action gates
  // POST .../fulfill — see resource-requests.ts's requirePermission('resource_requests','edit')
  // on that route). incident_commander/eoc_director can CREATE a request
  // ("I need 2 generators") but do NOT get the separate `approve`
  // action-level — per the FRD's role split, approval is logistics' call,
  // not command staff's, even though command staff can originate a
  // request. field_responder is view-only.
  //
  // The `approve` action-string here matches 03-04's actual choice exactly
  // (confirmed via resource-requests.ts: requirePermission('resource_requests','approve')
  // gates both POST .../approve and POST .../decline — declining is itself
  // an approval-adjacent decision per 03-04's own inline documentation).
  const resourceRequestsCommandCreateRoles = ['incident_commander', 'eoc_director'] as const;

  for (const roleName of resourceRequestsCommandCreateRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'resource_requests'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'resource_requests', ['view', 'create']],
    );
    record('role_permissions', result);
  }

  const logisticsResourceRequestsPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['planning_logistics_chief'], 'resource_requests'],
    ['role_id', 'feature', 'actions'],
    [
      roleIds['planning_logistics_chief'],
      'resource_requests',
      ['view', 'create', 'edit', 'approve'],
    ],
  );
  record('role_permissions', logisticsResourceRequestsPerm);

  const resourceRequestsViewOnlyPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['field_responder'], 'resource_requests'],
    ['role_id', 'feature', 'actions'],
    [roleIds['field_responder'], 'resource_requests', ['view']],
  );
  record('role_permissions', resourceRequestsViewOnlyPerm);

  // plans feature (Phase 3, F3): planning_logistics_chief is the FRD's
  // explicit named author role ("A planning user (PER-03)") — gets
  // view/create/edit. The separate `review` action-level (gating
  // POST .../review per 03-03's plans.ts) is granted to eoc_director
  // SPECIFICALLY, not to planning_logistics_chief — per the FRD's
  // "typically PER-01 or PER-03 with review permission," PER-01 and PER-03
  // must be DIFFERENT people for the no-self-approval rule to ever be
  // satisfiable in practice with the seeded role set. Granting `review` to
  // eoc_director (PER-01), separate from planning_logistics_chief's (PER-03)
  // authoring grant, is what makes the no-self-approval workflow usable
  // end-to-end with real seeded accounts — this is deliberate, not an
  // oversight: getting it wrong would make 03-05/03-08's cross-reviewer
  // Playwright tests impossible to satisfy against the seeded role set,
  // since a role holding BOTH create/edit and review on the same feature
  // could never prove segregation-of-duties with a single seeded identity
  // per role.
  const planningChiefPlansPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['planning_logistics_chief'], 'plans'],
    ['role_id', 'feature', 'actions'],
    [roleIds['planning_logistics_chief'], 'plans', ['view', 'create', 'edit']],
  );
  record('role_permissions', planningChiefPlansPerm);

  const eocDirectorPlansReviewPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['eoc_director'], 'plans'],
    ['role_id', 'feature', 'actions'],
    [roleIds['eoc_director'], 'plans', ['view', 'review']],
  );
  record('role_permissions', eocDirectorPlansReviewPerm);

  // Read-only situational-awareness access per F3's Process step 5: an
  // incident commander should be able to SEE the plans referenced by their
  // incident without being able to author/approve them. field_responder
  // gets the same view-only access for the same reason.
  const plansViewOnlyRoles = ['incident_commander', 'field_responder'] as const;

  for (const roleName of plansViewOnlyRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'plans'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'plans', ['view']],
    );
    record('role_permissions', result);
  }

  // secops_admin deliberately gets NO explicit 'plans' grant either, for the
  // identical reason documented above for 'incidents'/'tasks': blanket
  // admin/platform access from the grants earlier in this file is scoped to
  // the admin console, not plan authoring/review — intentional, not an
  // oversight.

  // notifications feature (Phase 4, F5): PERSONAS-EPMP.md's PER-02 merge is
  // explicit — "James represents both the Incident Commander... and the
  // Public Information Officer function, the Command Staff role responsible
  // for drafting and approving the incident's official public
  // communications... wearing the PIO hat — approving the messages that go
  // out to the public, partner agencies, and media." incident_commander
  // (PER-02) is therefore the ONE role holding the `approve` action-level
  // for notifications, matching F5's "named-person approval required before
  // any external send" rule with a realistic seeded identity — no other
  // role gets `approve` here, so the send route's approver-match gate is
  // actually satisfiable end-to-end with exactly one seeded identity per
  // role, mirroring 03-07's identical no-self-approval design for
  // plans/resource_requests. eoc_director and planning_logistics_chief
  // (PER-01/PER-03) can DRAFT/COMPOSE notifications (view/create) but the
  // actual approve-and-send authority belongs specifically to PER-02's PIO
  // function per PERSONAS-EPMP.md, not to command/planning staff generally.
  // field_responder (PER-04) gets view-only — read-only situational
  // awareness of notifications sent, consistent with F6's mobile scope.
  const notificationsApproverRoles = ['incident_commander'] as const;
  const notificationsDraftOnlyRoles = ['eoc_director', 'planning_logistics_chief'] as const;

  for (const roleName of notificationsApproverRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'notifications'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'notifications', ['view', 'create', 'approve']],
    );
    record('role_permissions', result);
  }

  for (const roleName of notificationsDraftOnlyRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'notifications'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'notifications', ['view', 'create']],
    );
    record('role_permissions', result);
  }

  const notificationsViewOnlyPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['field_responder'], 'notifications'],
    ['role_id', 'feature', 'actions'],
    [roleIds['field_responder'], 'notifications', ['view']],
  );
  record('role_permissions', notificationsViewOnlyPerm);

  // secops_admin deliberately gets NO explicit 'notifications' grant, for
  // the identical reason documented above for 'incidents'/'tasks'/'plans':
  // blanket admin/platform access from the grants earlier in this file is
  // scoped to the admin console, not incident-communications operations —
  // intentional, not an oversight, same reasoning every prior phase
  // documented for its own new feature-permission strings.

  // reporting feature (Phase 4, F7): PERSONAS-EPMP.md's "PER-02 (Incident
  // Commander) tasks the section chief to produce SITREPs/ICS forms" and
  // the FRD's explicit "Planning staff (PER-03) generate a SITREP" process
  // step both name planning_logistics_chief (PER-03) as the SITREP/AAR
  // author role — it gets the full view/create/edit set, where `edit`
  // gates both the SITREP finalize PATCH and the AAR finalize PATCH per
  // reporting.ts's own requirePermission('reporting','edit') routes.
  // incident_commander/eoc_director (PER-01/PER-02) can also TRIGGER
  // SITREP/AAR generation (view/create) per the FRD's Reports-tab
  // "Generate SITREP"/"Generate AAR" buttons being PageHeader-level actions
  // on the Incident Workspace, not gated to PER-03 alone — but `edit`/
  // finalize authority, including the AAR's finding-ownership and finalize
  // action, belongs to PER-03 specifically, matching the no-single-role-
  // holds-everything segregation pattern 03-07 established for plans'
  // review/approve split. field_responder gets view-only.
  const reportingAuthorRole = 'planning_logistics_chief' as const;
  const reportingGenerateOnlyRoles = ['incident_commander', 'eoc_director'] as const;

  const reportingAuthorPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds[reportingAuthorRole], 'reporting'],
    ['role_id', 'feature', 'actions'],
    [roleIds[reportingAuthorRole], 'reporting', ['view', 'create', 'edit']],
  );
  record('role_permissions', reportingAuthorPerm);

  for (const roleName of reportingGenerateOnlyRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'reporting'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'reporting', ['view', 'create']],
    );
    record('role_permissions', result);
  }

  const reportingViewOnlyPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['field_responder'], 'reporting'],
    ['role_id', 'feature', 'actions'],
    [roleIds['field_responder'], 'reporting', ['view']],
  );
  record('role_permissions', reportingViewOnlyPerm);

  // secops_admin deliberately gets NO explicit 'reporting' grant, for the
  // identical reason documented above for every other feature in this
  // file: blanket admin/platform access is scoped to the admin console,
  // not incident-reporting operations — intentional, not an oversight.

  // field_reports feature (Phase 5, F6): the FRD's named field-submission
  // role is field_responder (PER-04) — it gets view/create for submitting
  // its own reports offline/online. The initial instinct was to withhold
  // `resolve` from field_responder (treating Sync Conflict Resolution as
  // an EOC-side-only action), but re-reading the mockup's own Navigation
  // Map corrects that: the Sync Conflict Resolution screen is explicitly
  // "Reached from: Queued Submissions View conflict row" — i.e. the FIELD
  // RESPONDER resolves THEIR OWN conflict on their own device via "Keep my
  // version"/"Keep EOC version". So field_responder DOES need `resolve`,
  // not just view/create — granting only view/create here would make
  // 05-04's own Sync Conflict Resolution screen unusable by the exact role
  // the FRD designed it for. incident_commander/eoc_director (PER-02/
  // PER-01) also need view+resolve — EOC-side command staff reviewing the
  // operating picture should see field submissions too and be able to
  // resolve conflicts from the EOC side, per the FRD's "surfaced to a
  // named person for resolution" being role-agnostic about WHICH named
  // person as long as it's never automatic. planning_logistics_chief
  // (PER-03) gets view-only — situational read access, consistent with
  // every other feature's read-access-for-planning-staff pattern 03-07/
  // 04-04 established. secops_admin deliberately gets NO explicit
  // 'field_reports' row here, for the identical reason documented above
  // for every other feature in this file: blanket admin/platform access
  // is scoped to the admin console, not field-operations, and does not
  // need explicit field_reports grants for this phase's RBAC model.
  const fieldResponderFieldReportsPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['field_responder'], 'field_reports'],
    ['role_id', 'feature', 'actions'],
    [roleIds['field_responder'], 'field_reports', ['view', 'create', 'resolve']],
  );
  record('role_permissions', fieldResponderFieldReportsPerm);

  // incident_commander/eoc_director get view+resolve (NOT create) — EOC-side
  // command staff review and resolve conflicts surfaced from the field, but
  // field-report AUTHORSHIP itself belongs to field_responder per the FRD's
  // mobile-first submission flow.
  const fieldReportsEocResolverRoles = ['incident_commander', 'eoc_director'] as const;

  for (const roleName of fieldReportsEocResolverRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'field_reports'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'field_reports', ['view', 'resolve']],
    );
    record('role_permissions', result);
  }

  const fieldReportsViewOnlyPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['planning_logistics_chief'], 'field_reports'],
    ['role_id', 'feature', 'actions'],
    [roleIds['planning_logistics_chief'], 'field_reports', ['view']],
  );
  record('role_permissions', fieldReportsViewOnlyPerm);

  // No explicit call to syncRolePermissionsToOpa here: unlike this plan's
  // earlier concern, OPA's data document is re-synced fresh from
  // role_permissions at every server.ts startup (see server.ts's `start()`),
  // so `npm run migrate && npm run seed` followed by a normal app boot is
  // sufficient — the newly-seeded rows reach OPA on the next server start
  // with no separate sync step needed from this script. Confirmed by
  // reading server.ts's start() function directly (same verification 02-01
  // performed for the identical question about 'incidents'): it calls
  // syncRolePermissionsToOpa(allPerms) unconditionally at boot, reading the
  // FULL current role_permissions table fresh from Postgres — so these new
  // 'plans'/'tasks'/'resource_requests' rows reach OPA automatically on the
  // next server start with zero changes needed to server.ts or opa-client.ts.

  // 1 admin user (natural key: email, which IS unique in the schema)
  const adminUser = await findOrInsert(
    'users',
    ['email'],
    ['admin@epmp.local'],
    ['email', 'name', 'role_id', 'jurisdiction_scope'],
    ['admin@epmp.local', 'EPMP Admin', secopsAdminId, [jurisdiction.id]],
  );
  record('users', adminUser);

  // sso_config (natural key: protocol — no UNIQUE constraint in the schema,
  // but this seed only ever creates one OIDC config, so protocol='OIDC' is
  // the natural identity for this row)
  const groupToRoleMapping = [
    { idp_group: '/epmp-admins', role_id: secopsAdminId },
    // Phase 2 (F1): a second seeded Keycloak group/user so this phase's
    // Playwright suite can sign in as a role that actually holds
    // `incidents` permissions (admin@epmp.local's secops_admin role
    // deliberately does NOT, per this file's own documented decision
    // above) — see backend/keycloak/epmp-realm.json's
    // "epmp-incident-commanders" group + "commander@epmp.local" user.
    { idp_group: '/epmp-incident-commanders', role_id: roleIds['incident_commander'] },
    // Phase 3 (F3, 03-05): two more seeded Keycloak groups/users so this
    // phase's Playwright suite can sign in as the author
    // (planning_logistics_chief) and the reviewer (eoc_director) roles —
    // the DISTINCT roles 03-07's seed deliberately grants `plans`
    // create/edit vs `plans` review to, so the no-self-approval Plan
    // Repository/Approval Workflow flow (03-05) and the cross-feature
    // plan-to-task-materialization flow (03-08) can both be exercised
    // end-to-end with real, distinct identities — see
    // backend/keycloak/epmp-realm.json's "epmp-planning-logistics-chiefs"/
    // "epmp-eoc-directors" groups + "planner@epmp.local"/
    // "eocdirector@epmp.local" users.
    { idp_group: '/epmp-planning-logistics-chiefs', role_id: roleIds['planning_logistics_chief'] },
    { idp_group: '/epmp-eoc-directors', role_id: roleIds['eoc_director'] },
    // Phase 5 (F6, 05-05): a fourth seeded Keycloak group/user so every
    // Phase 5 Playwright suite (05-03, 05-04) can sign in as a REAL,
    // SSO-provisioned field_responder identity from the start — see
    // backend/keycloak/epmp-realm.json's "epmp-field-responders" group +
    // "field-responder@epmp.local" user, and
    // frontend/app/e2e/helpers/sign-in.ts's signInAsFieldResponder.
    { idp_group: '/epmp-field-responders', role_id: roleIds['field_responder'] },
  ];
  const ssoConfig = await findOrInsert(
    'sso_config',
    ['protocol'],
    ['OIDC'],
    ['protocol', 'idp_metadata_url', 'attribute_mapping', 'group_to_role_mapping', 'active', 'tested_at'],
    [
      'OIDC',
      'http://keycloak:8080/realms/epmp/.well-known/openid-configuration',
      JSON.stringify({ email_attr: 'email', name_attr: 'name', group_attr: 'groups' }),
      JSON.stringify(groupToRoleMapping),
      true,
      new Date().toISOString(),
    ],
  );
  record('sso_config', ssoConfig);
  // The row may already exist from an earlier plan's seed run (persisted
  // compose volume) without this phase's new mapping entry — findOrInsert
  // only inserts on first-ever creation, so re-assert the full mapping
  // idempotently on every run rather than leaving a stale array behind.
  await pool.query(`UPDATE sso_config SET group_to_role_mapping = $1 WHERE protocol = 'OIDC'`, [
    JSON.stringify(groupToRoleMapping),
  ]);

  // Phase 2 (F1): commander@epmp.local, pre-provisioned with the
  // 'Default Agency' jurisdiction_scope up front — mirrors admin@epmp.local's
  // identical treatment three lines above. This closes a documented gap
  // (02-07-SUMMARY.md Deviation #1): a first-ever Keycloak login JIT-
  // provisions this identity via sso.ts with jurisdiction_scope = '{}'
  // (correct production behavior for a truly unknown identity with no
  // seed row), which left `operating-picture.ts`'s jurisdiction_scope-
  // filtered markers query unable to return a single row for this user.
  // sso.ts's JIT INSERT uses `ON CONFLICT (email) DO UPDATE SET
  // idp_subject = ..., last_login_at = ...` — it only ever touches those
  // two columns on an existing email match, so pre-seeding this row here
  // with the real scope makes every subsequent real OIDC login preserve
  // it untouched. This is a seed.ts fix, not a change to sso.ts's JIT
  // behavior: a genuinely new identity with no seed row still
  // JIT-provisions with an empty scope exactly as before. 02-07's own
  // Playwright spec previously worked around this with a one-time direct-
  // Postgres grant in the test fixture itself
  // (ensureCommanderHasJurisdictionScope in operating-picture.spec.ts);
  // that fixture is now redundant (a no-op UPDATE) but left in place since
  // removing it is out of this task's scope.
  const commanderUser = await findOrInsert(
    'users',
    ['email'],
    ['commander@epmp.local'],
    ['email', 'name', 'role_id', 'jurisdiction_scope'],
    ['commander@epmp.local', 'Incident Commander', roleIds['incident_commander'], [jurisdiction.id]],
  );
  record('users', commanderUser);
  // Self-healing re-assertion for a row that already existed (e.g. a real
  // prior login via Keycloak on a pre-fix compose volume, or a fresh
  // insert above that already has it) — appends rather than overwrites,
  // per the "extend, never mutate" seeding rule, so any OTHER jurisdiction
  // an admin may have since granted this user via the admin console is
  // never clobbered.
  await pool.query(
    `UPDATE users SET jurisdiction_scope = jurisdiction_scope || $1
     WHERE email = 'commander@epmp.local' AND NOT ($2 = ANY(jurisdiction_scope))`,
    [[jurisdiction.id], jurisdiction.id],
  );

  // Phase 2 (F1/F2) UAT fixtures: two 'Default Agency' incidents so a
  // human tester's UI walkthrough of Create/Assign/Escalate/Operating-
  // Picture never starts from an empty incidents list, and so the
  // Assign-role and Escalate-activation tests (which need mutually
  // exclusive starting states — see activation.ts's NO_COMMANDER_ASSIGNED
  // rule) each have their own dedicated, independent target:
  //  - UAT-ASSIGN-ROLE: Open, Monitoring, NO command role assigned yet —
  //    the live target for "2. Assign a Command Role".
  //  - UAT-ESCALATE-READY: Open, Monitoring, Incident Commander ALREADY
  //    assigned — the live target for "3. Activation Level Change",
  //    decoupled from whatever test 2 does to its own incident.
  // Both carry a real `location` (DC-area point, the same reference point
  // 02-03/02-07's own tests and e2e spec use) so they also satisfy tests
  // 4/5 (Operating Picture markers + the forced-GIS-failure fallback).
  const incidentsToSeed = [
    {
      name: 'UAT-ASSIGN-ROLE Default Agency Flood',
      type: 'Flood',
      severity: 'Elevated',
      lng: -77.02,
      lat: 38.89,
      assignCommander: false,
    },
    {
      name: 'UAT-ESCALATE-READY Default Agency Wildfire',
      type: 'Wildfire',
      severity: 'Critical',
      lng: -77.05,
      lat: 38.93,
      assignCommander: true,
    },
  ] as const;

  // Captured during the loop below so the UAT Overdue-task fixture
  // (Phase 3, F4 success criterion 3) can reference a real incident_id
  // without a second lookup pass.
  const incidentIdsByName: Record<string, string> = {};

  for (const inc of incidentsToSeed) {
    const incidentResult = await findOrInsert(
      'incidents',
      ['name', 'jurisdiction_id'],
      [inc.name, jurisdiction.id],
      ['name', 'type', 'severity', 'jurisdiction_id', 'opened_at', 'created_by'],
      [inc.name, inc.type, inc.severity, jurisdiction.id, new Date().toISOString(), commanderUser.id],
    );
    record('incidents', incidentResult);
    incidentIdsByName[inc.name] = incidentResult.id;

    // `location` is nullable (see 1700000000002's own documented
    // deviation) and isn't part of findOrInsert's generic insert-column
    // list above — set it idempotently in its own statement, same
    // "re-assert idempotently" shape as sso_config's UPDATE above.
    await pool.query(
      `UPDATE incidents SET location = ST_SetSRID(ST_MakePoint($2, $3), 4326)
       WHERE id = $1 AND location IS NULL`,
      [incidentResult.id, inc.lng, inc.lat],
    );

    if (incidentResult.inserted) {
      await pool.query(
        `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source)
         VALUES ($1, 'Incident created', 'brand', $2, 'EPMP')`,
        [incidentResult.id, commanderUser.id],
      );
    }

    if (inc.assignCommander) {
      // Mirrors command-roles.ts's own "at most one ACTIVE assignment per
      // role per incident" invariant (unassigned_at IS NULL) — a plain
      // findOrInsert equality match on (incident_id, role_title,
      // person_id) would incorrectly treat a historical (unassigned) row
      // as "already present" and skip creating a live one.
      const activeRows = await pool.query<{ id: string }>(
        `SELECT id FROM incident_command_roles
         WHERE incident_id = $1 AND role_title = 'Incident Commander' AND unassigned_at IS NULL`,
        [incidentResult.id],
      );
      if (activeRows.rows.length === 0) {
        await pool.query(
          `INSERT INTO incident_command_roles (incident_id, role_title, person_id, assigned_by)
           VALUES ($1, 'Incident Commander', $2, $2)`,
          [incidentResult.id, commanderUser.id],
        );
        await pool.query(
          `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail)
           VALUES ($1, 'Incident Commander assigned to Incident Commander', 'brand', $2, 'EPMP', $3)`,
          [
            incidentResult.id,
            commanderUser.id,
            JSON.stringify({ role_title: 'Incident Commander', person_id: commanderUser.id }),
          ],
        );
        record('incident_command_roles', { id: incidentResult.id, inserted: true });
      } else {
        record('incident_command_roles', { id: activeRows.rows[0].id, inserted: false });
      }
    }
  }

  // Phase 7 (F15, 07-02) UAT fixture: a cad_config find-or-insert +
  // ONE cad_dispatch_events fixture row linked to the UAT-ESCALATE-READY
  // incident above, so the Incident Workspace (Plan 07-04) has a real,
  // immediately-visible dispatch-status panel on a known demo incident
  // right after `npm run seed`, without requiring the scheduler's first
  // tick or a manual runCadIngestion() call.
  const uatCadConfig = await findOrInsert(
    'cad_config',
    ['vendor'],
    ['agency_cad'],
    ['vendor', 'endpoint_config', 'incident_matching_strategy'],
    ['agency_cad', JSON.stringify({ stub: true }), 'human_confirmed'],
  );
  record('cad_config', uatCadConfig);

  const uatEscalateReadyIncidentId = incidentIdsByName['UAT-ESCALATE-READY Default Agency Wildfire'];
  const uatCadDispatchEvent = await findOrInsert(
    'cad_dispatch_events',
    ['config_id', 'external_event_id'],
    [uatCadConfig.id, 'UAT-CAD-001'],
    [
      'config_id',
      'external_event_id',
      'cad_incident_number',
      'linked_incident_id',
      'status',
      'unit_ids',
      'source',
      'updated_at',
    ],
    [
      uatCadConfig.id,
      'UAT-CAD-001',
      'CAD-UAT-001',
      uatEscalateReadyIncidentId,
      'On scene',
      ['Engine 12'],
      'agency_cad',
      new Date().toISOString(),
    ],
  );
  record('cad_dispatch_events', uatCadDispatchEvent);

  // Phase 3 (F3, 03-08) UAT fixture: planner@epmp.local and
  // eocdirector@epmp.local, pre-provisioned with the 'Default Agency'
  // jurisdiction_scope up front — identical rationale/pattern to
  // commander@epmp.local's treatment above (02-07's documented gap fix):
  // sso.ts's JIT provisioning on first-ever Keycloak login sets
  // jurisdiction_scope = '{}', which would otherwise leave these two
  // identities unable to see the 'Default Agency' plan/incident data this
  // seed creates below for them. idp_subject is intentionally left NULL
  // here — sso.ts's `ON CONFLICT (email) DO UPDATE SET idp_subject = ...`
  // only ever touches idp_subject/last_login_at on an existing email
  // match, so a real first login still JIT-resolves the subject exactly
  // as it would for a genuinely new row; pre-seeding here only fixes the
  // jurisdiction_scope gap, nothing else.
  const plannerUser = await findOrInsert(
    'users',
    ['email'],
    ['planner@epmp.local'],
    ['email', 'name', 'role_id', 'jurisdiction_scope'],
    ['planner@epmp.local', 'Planning Chief', roleIds['planning_logistics_chief'], [jurisdiction.id]],
  );
  record('users', plannerUser);
  await pool.query(
    `UPDATE users SET jurisdiction_scope = jurisdiction_scope || $1
     WHERE email = 'planner@epmp.local' AND NOT ($2 = ANY(jurisdiction_scope))`,
    [[jurisdiction.id], jurisdiction.id],
  );

  const eocDirectorUser = await findOrInsert(
    'users',
    ['email'],
    ['eocdirector@epmp.local'],
    ['email', 'name', 'role_id', 'jurisdiction_scope'],
    ['eocdirector@epmp.local', 'EOC Director', roleIds['eoc_director'], [jurisdiction.id]],
  );
  record('users', eocDirectorUser);
  await pool.query(
    `UPDATE users SET jurisdiction_scope = jurisdiction_scope || $1
     WHERE email = 'eocdirector@epmp.local' AND NOT ($2 = ANY(jurisdiction_scope))`,
    [[jurisdiction.id], jurisdiction.id],
  );

  // Phase 5 (F6, 05-05) UAT fixture: field-responder@epmp.local,
  // pre-provisioned with the 'Default Agency' jurisdiction_scope up front —
  // identical rationale/pattern to commander@epmp.local's treatment above
  // (02-07's documented gap fix): sso.ts's JIT provisioning on first-ever
  // Keycloak login sets jurisdiction_scope = '{}', which would otherwise
  // leave this identity unable to see any jurisdiction-scoped field-report
  // data. idp_subject is intentionally left NULL here for the same reason
  // documented above for planner@epmp.local/eocDirectorUser.
  const fieldResponderUser = await findOrInsert(
    'users',
    ['email'],
    ['field-responder@epmp.local'],
    ['email', 'name', 'role_id', 'jurisdiction_scope'],
    ['field-responder@epmp.local', 'Field Responder', roleIds['field_responder'], [jurisdiction.id]],
  );
  record('users', fieldResponderUser);
  await pool.query(
    `UPDATE users SET jurisdiction_scope = jurisdiction_scope || $1
     WHERE email = 'field-responder@epmp.local' AND NOT ($2 = ANY(jurisdiction_scope))`,
    [[jurisdiction.id], jurisdiction.id],
  );

  // UAT data-doctor fixture (Phase 5/6 UAT pass, field-mobile tests 1-2):
  // two tasks actually OWNED by field-responder@epmp.local, so Field
  // Home (/field) and My Tasks (/field/tasks) show real rows instead of
  // their EmptyState on a fresh UAT pass — tasks.ts's `GET
  // /api/v1/tasks?owner=<id>` filter (both screens' real query) is an
  // exact owner_id match, so these MUST be owned by fieldResponderUser,
  // not merely visible through jurisdiction scope like the
  // UAT-OVERDUE/commander-owned fixture above.
  //
  // One 'Open' task (so MyTasksField.tsx's nextStatusFor() shows the
  // "Start" one-tap button — test 2's first tap target) and one
  // 'In progress' task due soon (so the "Mark done" one-tap button is
  // ALSO reachable without the tester having to tap through the first
  // task first, and FieldHome.tsx's "near-due" badge state has a real
  // row to render). Natural key (title, owner_id), same pattern as the
  // UAT-OVERDUE fixture.
  //
  // due_at is intentionally far out (30 days), not "due soon" — a
  // near-term relative due_at computed once at seed time is a ticking
  // time bomb: findOrInsert() never updates an EXISTING row, so the very
  // first seed run bakes in a due_at that the Phase-3 overdue-sweep will
  // correctly flip to 'Overdue' hours later, on every subsequent UAT
  // round against the same sandbox — at which point MyTasksField.tsx
  // correctly renders NO action button for either seeded task (Overdue
  // has no nextStatusFor() transition by design), silently breaking
  // test 2 for every tester after the first. (Observed directly: a human
  // UAT pass ~14h after the original seed run found both tasks already
  // Overdue with no Start/Mark-done buttons.) 30 days is a committed-code
  // fix, not a one-time instance patch — it must survive every fresh
  // sandbox this seed runs in, not just the one it was first observed in.
  const uatFieldResponderOpenTask = await findOrInsert(
    'tasks',
    ['title', 'owner_id'],
    ['UAT-FIELD-OPEN Check shelter generator fuel', fieldResponderUser.id],
    [
      'title',
      'description',
      'status',
      'owner_id',
      'incident_id',
      'due_at',
      'requires_approval',
      'created_by',
    ],
    [
      'UAT-FIELD-OPEN Check shelter generator fuel',
      'Walk the shelter perimeter and confirm backup generator fuel levels.',
      'Open',
      fieldResponderUser.id,
      incidentIdsByName['UAT-ASSIGN-ROLE Default Agency Flood'],
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // due in 30 days — never goes stale/Overdue
      false,
      commanderUser.id,
    ],
  );
  record('tasks', uatFieldResponderOpenTask);
  if (uatFieldResponderOpenTask.inserted) {
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by)
       VALUES ($1, NULL, 'Open', $2)`,
      [uatFieldResponderOpenTask.id, commanderUser.id],
    );
  }

  const uatFieldResponderInProgressTask = await findOrInsert(
    'tasks',
    ['title', 'owner_id'],
    ['UAT-FIELD-INPROGRESS Report road hazard status', fieldResponderUser.id],
    [
      'title',
      'description',
      'status',
      'owner_id',
      'incident_id',
      'due_at',
      'requires_approval',
      'created_by',
    ],
    [
      'UAT-FIELD-INPROGRESS Report road hazard status',
      'Confirm whether the Main St debris hazard has been cleared.',
      'In progress',
      fieldResponderUser.id,
      incidentIdsByName['UAT-ASSIGN-ROLE Default Agency Flood'],
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // due in 30 days — never goes stale/Overdue (see comment above)
      false,
      commanderUser.id,
    ],
  );
  record('tasks', uatFieldResponderInProgressTask);
  if (uatFieldResponderInProgressTask.inserted) {
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by)
       VALUES ($1, NULL, 'Open', $2)`,
      [uatFieldResponderInProgressTask.id, commanderUser.id],
    );
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by)
       VALUES ($1, 'Open', 'In progress', $2)`,
      [uatFieldResponderInProgressTask.id, fieldResponderUser.id],
    );
  }

  // Self-heal for a sandbox that already ran an OLDER version of this
  // seed (before the 30-day due_at fix above): findOrInsert() never
  // updates an existing row, so a sandbox seeded under the old "due in
  // 2h"/"due in 30 min" values would otherwise carry a stale due_at (and
  // whatever status the Phase-3 overdue-sweep already flipped it to)
  // forever, even after this file is corrected and re-run. Idempotent and
  // narrowly scoped to exactly these two fixture rows by id — never
  // touches a real, non-fixture task.
  await pool.query(
    `UPDATE tasks SET status = 'Open', due_at = now() + interval '30 days'
     WHERE id = $1 AND due_at < now() + interval '7 days'`,
    [uatFieldResponderOpenTask.id],
  );
  await pool.query(
    `UPDATE tasks SET status = 'In progress', due_at = now() + interval '30 days'
     WHERE id = $1 AND due_at < now() + interval '7 days'`,
    [uatFieldResponderInProgressTask.id],
  );

  // UAT data-doctor fixture (Phase 5/6 UAT pass, field-mobile test 6): a
  // real UNRESOLVED sync_conflicts row reachable at a real
  // /field/conflicts/:id URL, produced through the exact same code path
  // field-reports.test.ts's own "detects a conflict" integration test and
  // field-mobile-sync-conflict.spec.ts's e2e setup use — submit a field
  // report via the sync-batch route whose captured_at PREDATES the
  // anchor incident's updated_at, so field-reports.ts's own
  // conflict-detection rule (incident.updated_at > report.captured_at)
  // fires and writes BOTH versions itself. This is NOT a hand-inserted
  // sync_conflicts row — running this through findOrInsert's generic
  // helper would bypass the real detection logic, so this block instead
  // checks for an existing row by client_report_id (field_reports'
  // natural idempotency key) and only drives the real route handlers'
  // SQL when absent, mirroring exactly what the route itself does.
  const uatConflictClientReportId = 'uat-sync-conflict-field-responder-seed';
  const existingUatConflictReport = await pool.query<{ id: string; sync_status: string }>(
    `SELECT id, sync_status FROM field_reports WHERE client_report_id = $1`,
    [uatConflictClientReportId],
  );
  if (existingUatConflictReport.rows.length === 0) {
    const uatConflictIncidentId = incidentIdsByName['UAT-ASSIGN-ROLE Default Agency Flood'];

    // Bump the anchor incident's updated_at to NOW — the real EOC-side
    // change this conflict represents (identical mechanism
    // field-reports.test.ts's own sync-batch conflict test and
    // field-mobile-sync-conflict.spec.ts's e2e setup use).
    await pool.query(`UPDATE incidents SET updated_at = now() WHERE id = $1`, [uatConflictIncidentId]);

    const incidentRow = await pool.query<{ updated_at: string; name: string }>(
      `SELECT updated_at, name FROM incidents WHERE id = $1`,
      [uatConflictIncidentId],
    );
    const incident = incidentRow.rows[0];

    const capturedAt = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 min before the bump above
    const reportPayload = {
      client_report_id: uatConflictClientReportId,
      incident_id: uatConflictIncidentId,
      observation_type: 'Damage assessment',
      description: 'UAT-SYNC-CONFLICT Roof damage observed at shelter site',
      captured_at: capturedAt,
    };

    // Same two-step insert field-reports.ts's sync-batch conflict branch
    // performs: field_reports row first (sync_status='conflict'), then
    // the sync_conflicts row referencing it, both versions preserved
    // exactly as the real route would have written them.
    const insertedConflictReport = await pool.query<{ id: string }>(
      `INSERT INTO field_reports
         (client_report_id, incident_id, observation_type, description, submitted_by, captured_at, sync_status)
       VALUES ($1,$2,$3,$4,$5,$6,'conflict')
       RETURNING id`,
      [
        reportPayload.client_report_id,
        reportPayload.incident_id,
        reportPayload.observation_type,
        reportPayload.description,
        fieldResponderUser.id,
        reportPayload.captured_at,
      ],
    );

    const insertedConflict = await pool.query<{ id: string }>(
      `INSERT INTO sync_conflicts (entity_type, entity_id, field_version, eoc_version)
       VALUES ('field_report', $1, $2, $3)
       RETURNING id`,
      [
        insertedConflictReport.rows[0].id,
        JSON.stringify(reportPayload),
        JSON.stringify({ incident_updated_at: incident.updated_at, incident_name: incident.name }),
      ],
    );
    record('field_reports', { id: insertedConflictReport.rows[0].id, inserted: true });
    record('sync_conflicts', { id: insertedConflict.rows[0].id, inserted: true });
  } else {
    record('field_reports', { id: existingUatConflictReport.rows[0].id, inserted: false });
  }

  // UAT data-doctor fixture (Phase 3 UAT re-run): at least one Overdue
  // task, reachable via the Task List's DEFAULT view (no filter applied,
  // page 1, ORDER BY due_at ASC per tasks.ts's list route) for every role
  // holding `tasks:edit` (incident_commander, eoc_director,
  // planning_logistics_chief — all three share 'Default Agency'
  // jurisdiction_scope and therefore all see this task through
  // tasks.ts's jurisdiction-scope filter, which leaves it unfiltered for
  // any of them). due_at is set deliberately far in the past so
  // ORDER BY due_at ASC sorts it onto page 1 ahead of any
  // later-due/non-overdue task a human may have since created by hand
  // through the UI during a prior UAT pass (never overwritten — this
  // fixture is only ever inserted once, on the first run, per
  // findOrInsert's natural-key match on title+owner_id below).
  //
  // Status is written as 'Overdue' directly (not left 'Open' for
  // overdue-sweep.ts's 60s scheduler to flip) so the precondition is
  // deterministically true the instant this script finishes, rather than
  // depending on a timing race with the background scheduler on a
  // freshly-booted sandbox. The resulting row is schema-identical to one
  // overdue-sweep.ts would have produced itself: same task_status_history
  // audit trail shape (NULL->Open by the creator, then Open->Overdue with
  // changed_by=NULL marking it system-driven, matching overdue-sweep.ts's
  // own documented convention), same incident_timeline danger-tone entry.
  const uatOverdueIncidentId =
    incidentIdsByName['UAT-ASSIGN-ROLE Default Agency Flood'];
  const uatOverdueTask = await findOrInsert(
    'tasks',
    ['title', 'owner_id'],
    ['UAT-OVERDUE Verify generator fuel levels', commanderUser.id],
    [
      'title',
      'description',
      'status',
      'owner_id',
      'incident_id',
      'due_at',
      'requires_approval',
      'created_by',
    ],
    [
      'UAT-OVERDUE Verify generator fuel levels',
      'Confirm pre-positioned generators have adequate fuel reserves.',
      'Overdue',
      commanderUser.id,
      uatOverdueIncidentId,
      '2026-01-01T00:00:00.000Z', // deliberately far in the past
      false,
      commanderUser.id,
    ],
  );
  record('tasks', uatOverdueTask);
  if (uatOverdueTask.inserted) {
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by)
       VALUES ($1, NULL, 'Open', $2)`,
      [uatOverdueTask.id, commanderUser.id],
    );
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by)
       VALUES ($1, 'Open', 'Overdue', NULL)`,
      [uatOverdueTask.id],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source)
       VALUES ($1, 'Task overdue: UAT-OVERDUE Verify generator fuel levels', 'danger', NULL, 'system')`,
      [uatOverdueIncidentId],
    );
  }

  // Phase 3 (F3/F4, roadmap success criterion 2) UAT fixture: an
  // already-Approved plan with a linked task template, so a human
  // tester's UAT walkthrough of "Materialize-Tasks UI Trigger Check"
  // never has to author+approve a plan from scratch just to reach the
  // precondition state. Authored by planner@epmp.local (the
  // planning_logistics_chief role actually holding `plans` create/edit),
  // reviewed/approved by eocdirector@epmp.local (the eoc_director role
  // holding the SEPARATE `plans` review action-level) — the identical
  // cross-reviewer pair 03-08's own plan-to-task-materialization.spec.ts
  // uses, satisfying chk_no_self_approval for real.
  //
  // Natural key: (name, jurisdiction_id), same pattern this file already
  // uses for incidents above — plans has no UNIQUE constraint on name
  // alone, so this find-or-insert is scoped the same way.
  const uatPlan = await findOrInsert(
    'plans',
    ['name', 'jurisdiction_id'],
    ['UAT-MATERIALIZE-READY Generator Pre-Positioning Plan', jurisdiction.id],
    ['name', 'type', 'jurisdiction_id', 'owner_id', 'status', 'current_version'],
    [
      'UAT-MATERIALIZE-READY Generator Pre-Positioning Plan',
      'EOP',
      jurisdiction.id,
      plannerUser.id,
      'Approved',
      2, // mirrors plans.ts's review-approve step, which increments current_version on approval
    ],
  );
  record('plans', uatPlan);

  const uatPlanSection = await findOrInsert(
    'plan_sections',
    ['plan_id', 'heading'],
    [uatPlan.id, 'Generator pre-positioning'],
    ['plan_id', 'heading', 'body', 'sort_order'],
    [
      uatPlan.id,
      'Generator pre-positioning',
      'Pre-position backup generators at critical facilities ahead of expected outages.',
      0,
    ],
  );
  record('plan_sections', uatPlanSection);

  const uatTaskTemplate = await findOrInsert(
    'plan_task_templates',
    ['plan_section_id', 'default_title'],
    [uatPlanSection.id, 'Pre-position generators (UAT)'],
    ['plan_section_id', 'default_title', 'default_owner_role', 'default_due_offset_minutes'],
    [uatPlanSection.id, 'Pre-position generators (UAT)', 'incident_commander', 120],
  );
  record('plan_task_templates', uatTaskTemplate);

  // plan_versions row proving the Approved status actually went through a
  // real submit->review->approve cycle (version_number=1, the version
  // active before plans.ts's approval step bumped plans.current_version
  // to 2 above) — reviewed_by deliberately differs from submitted_by to
  // satisfy chk_no_self_approval, matching the real no-self-approval
  // workflow a human tester would have produced by hand.
  const uatPlanVersion = await findOrInsert(
    'plan_versions',
    ['plan_id', 'version_number'],
    [uatPlan.id, 1],
    [
      'plan_id',
      'version_number',
      'content_snapshot',
      'submitted_by',
      'reviewed_by',
      'review_action',
      'reviewed_at',
    ],
    [
      uatPlan.id,
      1,
      JSON.stringify([
        {
          id: uatPlanSection.id,
          heading: 'Generator pre-positioning',
          body: 'Pre-position backup generators at critical facilities ahead of expected outages.',
          sort_order: 0,
        },
      ]),
      plannerUser.id,
      eocDirectorUser.id,
      'approve',
      new Date().toISOString(),
    ],
  );
  record('plan_versions', uatPlanVersion);

  // UAT data-doctor fixture (Phase 3 UAT re-run, test "Link Plan Section to
  // Task Template"): a SECOND Approved plan whose one section has ZERO
  // linked task templates, so the PlanDetail reading view's "Link tasks"
  // action can be exercised as a genuinely fresh "define new template"
  // flow — the original UAT-MATERIALIZE-READY plan above deliberately
  // already has its one section pre-linked (that plan exists specifically
  // so the Materialize-Tasks test never needs to author a template first),
  // so re-using it here would only ever show the already-linked state,
  // never the empty one this test needs to see. Same author/reviewer
  // pair and same cross-reviewer plan_versions shape as the fixture
  // above, satisfying chk_no_self_approval identically.
  const uatUnlinkedPlan = await findOrInsert(
    'plans',
    ['name', 'jurisdiction_id'],
    ['UAT-LINK-TASKS-READY Shelter Activation Plan', jurisdiction.id],
    ['name', 'type', 'jurisdiction_id', 'owner_id', 'status', 'current_version'],
    [
      'UAT-LINK-TASKS-READY Shelter Activation Plan',
      'EOP',
      jurisdiction.id,
      plannerUser.id,
      'Approved',
      2,
    ],
  );
  record('plans', uatUnlinkedPlan);

  const uatUnlinkedPlanSection = await findOrInsert(
    'plan_sections',
    ['plan_id', 'heading'],
    [uatUnlinkedPlan.id, 'Shelter activation'],
    ['plan_id', 'heading', 'body', 'sort_order'],
    [
      uatUnlinkedPlan.id,
      'Shelter activation',
      'Open and staff emergency shelters ahead of expected displacement.',
      0,
    ],
  );
  record('plan_sections', uatUnlinkedPlanSection);
  // Deliberately NO plan_task_templates row created for this section —
  // that absence IS the precondition this fixture exists to guarantee.

  const uatUnlinkedPlanVersion = await findOrInsert(
    'plan_versions',
    ['plan_id', 'version_number'],
    [uatUnlinkedPlan.id, 1],
    [
      'plan_id',
      'version_number',
      'content_snapshot',
      'submitted_by',
      'reviewed_by',
      'review_action',
      'reviewed_at',
    ],
    [
      uatUnlinkedPlan.id,
      1,
      JSON.stringify([
        {
          id: uatUnlinkedPlanSection.id,
          heading: 'Shelter activation',
          body: 'Open and staff emergency shelters ahead of expected displacement.',
          sort_order: 0,
        },
      ]),
      plannerUser.id,
      eocDirectorUser.id,
      'approve',
      new Date().toISOString(),
    ],
  );
  record('plan_versions', uatUnlinkedPlanVersion);

  // UAT data-doctor fixture (Phase 8 UAT pass, test "Live-Linked Document
  // Flagged Review" — 08-06's F17 final hard requirement): a REAL
  // mode='link_live' document_links row, already flagged
  // content_status='changed', attached to the existing UAT-LINK-TASKS-READY
  // plan above, so a human tester's UAT walkthrough of PlanDetail.tsx's
  // "Source changed, review" Alert never has to perform the full
  // import/link-then-wait-for-a-background-sync-tick flow themselves just
  // to SEE the flagged state once.
  //
  // Driven through the REAL functions document-adapter.ts exports — never
  // a hand-inserted row bypassing the module's own logic (mirrors this
  // file's own established "run the real adapter function" precedent for
  // EOC COTS/facility/hazard-feed sync above, and matches
  // plan-live-link-flagged-review.spec.ts's own "prefer the real detection
  // path" design note):
  //  1. linkDocument(userId, externalDocId, planId) — the EXACT function
  //     POST /api/v1/integrations/documents/:id/link calls, called here
  //     with plannerUser.id (planning_logistics_chief, who already holds
  //     the `plans:edit` grant that route requires) and the fixed
  //     'DOC-SOP-002' external_document_id — the ONE id
  //     runDocumentLinkSync()'s own content-change simulation recognizes
  //     as its deterministic trigger (document-adapter.ts's own doc
  //     comment on that function names it explicitly).
  //  2. runDocumentLinkSync() — the REAL scheduled-sweep function, called
  //     once here exactly like this file's EOC COTS/facility precedent
  //     above, which performs the actual
  //     `UPDATE document_links SET content_status = 'changed', ...` the
  //     scheduler would otherwise only perform on its first 5-minute tick.
  //
  // Idempotent: linkDocument() has no natural-key guard of its own (a
  // document CAN legitimately be linked to the same plan twice in real
  // usage), so this block first checks for an existing link_live row for
  // this exact (plan_id, external_document_id) pair before calling
  // linkDocument() again — a second seed run must not create a duplicate
  // row. runDocumentLinkSync() itself is already idempotent (its own
  // `AND content_status <> 'changed'` guard), so calling it again on an
  // already-flagged row here is always a safe no-op.
  const existingUatLiveLinkRow = await pool.query<{ id: string; content_status: string }>(
    `SELECT id, content_status FROM document_links
     WHERE plan_id = $1 AND external_document_id = $2 AND mode = 'link_live'
     LIMIT 1`,
    [uatUnlinkedPlan.id, 'DOC-SOP-002'],
  );

  if (existingUatLiveLinkRow.rows.length === 0) {
    const linked = await linkDocument(plannerUser.id, 'DOC-SOP-002', uatUnlinkedPlan.id, [
      jurisdiction.id,
    ]);
    record('document_links', { id: linked.id, inserted: true });
  } else {
    record('document_links', { id: existingUatLiveLinkRow.rows[0].id, inserted: false });
  }

  // Always re-run the real sync sweep — idempotent, and self-healing for a
  // sandbox where the row above was already linked (e.g. by a prior seed
  // run or a human tester) but hadn't yet been flagged by a scheduled tick.
  const uatDocLinkSyncResult = await runDocumentLinkSync();
  console.log(
    `Document link sync: checked ${uatDocLinkSyncResult.checked} link_live row(s), ` +
      `${uatDocLinkSyncResult.flagged} newly flagged, ${uatDocLinkSyncResult.permission_revoked} permission-revoked.`,
  );

  // UAT data-doctor fixture (Phase 3 UAT re-run, tests "Resource Request
  // Lifecycle (create -> approve/decline)" and "Resource Request Visible on
  // Operating Picture"): a resource request already in 'Awaiting approval'
  // on a real UAT incident that HAS a location, so:
  //  - Test 4 (commander@epmp.local or eocdirector@epmp.local creates a
  //    request; planner@epmp.local approves/declines it) has a request
  //    already sitting in the exact state planner@epmp.local's
  //    `resource_requests:approve` permission needs to act on, without a
  //    human first having to drive the Create-Request form just to reach
  //    it — and the human can still create an independent NEW request via
  //    the UI to exercise the create half fresh, since this fixture is
  //    additive, never a substitute for that flow.
  //  - Test 5 (Operating Picture map) needs a resource_requests row whose
  //    status is NOT Fulfilled/Declined (operating-picture.ts's WHERE
  //    clause) and whose linked incident has a non-NULL `location` — the
  //    UAT-ASSIGN-ROLE incident seeded above already satisfies both, so
  //    reusing its id here (rather than minting a third incident) is the
  //    minimal fixture that makes the triangle resource-marker visible.
  //
  // requested_by = commanderUser (incident_commander, which holds
  // `resource_requests:create` per the grants above) — mirrors who a real
  // UAT tester would be signed in as for Test 4's "create" half.
  // requesting_role uses the free-text role-name convention
  // CreateResourceRequest.tsx's own Select establishes (REQUESTING_ROLE_
  // OPTIONS maps to role names, not display labels).
  //
  // Natural key: (description, incident_id) — resource_requests has no
  // UNIQUE constraint of its own (same situation as jurisdictions/
  // sso_config above), so this find-or-insert is scoped the same way,
  // using the self-describing UAT-prefixed description as the identity.
  const uatResourceRequestDescription = 'UAT-RESOURCE-REQUEST Portable generators for shelter';
  const uatResourceRequest = await findOrInsert(
    'resource_requests',
    ['description', 'incident_id'],
    [uatResourceRequestDescription, uatOverdueIncidentId],
    [
      'resource_type',
      'description',
      'quantity',
      'status',
      'incident_id',
      'requesting_role',
      'needed_by',
      'requested_by',
    ],
    [
      'Equipment',
      uatResourceRequestDescription,
      2,
      'Awaiting approval',
      uatOverdueIncidentId,
      'incident_commander',
      new Date(Date.now() + 86_400_000).toISOString(), // due 24h out, mirrors the app's own create-form test fixture convention
      commanderUser.id,
    ],
  );
  record('resource_requests', uatResourceRequest);
  if (uatResourceRequest.inserted) {
    // Mirrors the real POST /api/v1/resource-requests handler's own
    // two-row history (NULL->Draft, Draft->Awaiting approval) and Timeline
    // entry, so this fixture is schema-identical to one a human would have
    // produced by hand through the UI — same "replicate the app's own
    // invariants" rule this file follows for the UAT-OVERDUE task above.
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
       VALUES ($1, NULL, 'Draft', $2)`,
      [uatResourceRequest.id, commanderUser.id],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by)
       VALUES ($1, 'Draft', 'Awaiting approval', $2)`,
      [uatResourceRequest.id, commanderUser.id],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4)`,
      [
        uatOverdueIncidentId,
        `Resource request: Equipment (${uatResourceRequestDescription})`,
        commanderUser.id,
        JSON.stringify({ resource_request_id: uatResourceRequest.id, quantity: 2 }),
      ],
    );
  }

  // -------------------------------------------------------------------
  // UAT data-doctor fixtures (Phase 4 UAT pass, F5 Notifications + F7
  // Reporting/Learning): every row below is additive (findOrInsert /
  // existence-guarded direct SQL, never UPDATE/DELETE of a prior row)
  // and self-describing via its UAT- prefix, per this file's own
  // established convention for every earlier phase's fixtures above.
  // -------------------------------------------------------------------

  const nowMs = Date.now();
  const hoursAgoIso = (h: number) => new Date(nowMs - h * 60 * 60 * 1000).toISOString();
  const daysAgoIso = (d: number) => new Date(nowMs - d * 24 * 60 * 60 * 1000).toISOString();

  // --- Test 1 (Compose Notification): a Jurisdiction-type recipient group
  // --- the ONLY type incident_commander can see per this plan's own
  // --- admin:view gap (RecipientGroups.tsx's Role-type picker needs
  // --- admin:view, which incident_commander deliberately lacks).
  // --- Natural key: (name, type) — recipient_groups has no UNIQUE
  // --- constraint of its own, same situation as jurisdictions/sso_config.
  const uatRecipientGroup = await findOrInsert(
    'recipient_groups',
    ['name', 'type'],
    ['UAT-NOTIFY Default Agency residents', 'Jurisdiction'],
    ['name', 'type', 'selector', 'created_by'],
    [
      'UAT-NOTIFY Default Agency residents',
      'Jurisdiction',
      JSON.stringify({ jurisdiction_id: jurisdiction.id }),
      commanderUser.id,
    ],
  );
  record('recipient_groups', uatRecipientGroup);

  // Nice-to-have per test 1's own precondition list — a message template
  // so Step 2's "Template (optional)" Select has a real option, though
  // compose works from scratch too.
  const uatMessageTemplate = await findOrInsert(
    'message_templates',
    ['name'],
    ['UAT-NOTIFY Shelter-in-place advisory template'],
    ['name', 'category', 'body', 'created_by'],
    [
      'UAT-NOTIFY Shelter-in-place advisory template',
      'Public Safety',
      'This is an advisory for Default Agency residents: shelter in place until further notice. Monitor official channels for updates.',
      commanderUser.id,
    ],
  );
  record('message_templates', uatMessageTemplate);

  // --- Test 2 (Delivery & Acknowledgment Tracking): an already
  // --- approved-and-sent notification, attached to the existing
  // --- UAT-ASSIGN-ROLE incident (Open, already has task/resource-request
  // --- content from the Phase-3 fixture above), with a MIX of delivery
  // --- statuses across its recipients — richer than the real send path
  // --- alone would produce (04-01's send handler resolves every
  // --- recipient straight to 'Sent', documented pre-F14 simplification),
  // --- so the Delivery Tracking table shows the full Queued/Sent/
  // --- Delivered/Failed/Acknowledged tone range a human tester can
  // --- actually see, not just one status repeated. Natural key:
  // --- message_body (notifications has no UNIQUE constraint of its own).
  const uatSentNotificationBody =
    'UAT-NOTIFY-SENT Shelter-in-place advisory issued for Default Agency residents.';
  const uatSentNotification = await findOrInsert(
    'notifications',
    ['message_body'],
    [uatSentNotificationBody],
    [
      'incident_id',
      'message_body',
      'ai_origin',
      'channels',
      'recipient_group_ids',
      'approved_by',
      'approved_at',
      'sent_at',
      'created_by',
    ],
    [
      uatOverdueIncidentId,
      uatSentNotificationBody,
      false,
      ['SMS', 'Email'],
      [uatRecipientGroup.id],
      commanderUser.id,
      hoursAgoIso(2),
      hoursAgoIso(2),
      commanderUser.id,
    ],
  );
  record('notifications', uatSentNotification);

  if (uatSentNotification.inserted) {
    const uatRecipients: Array<{
      name: string;
      contact: string;
      channel: string;
      status: 'Delivered' | 'Acknowledged' | 'Failed' | 'Sent';
      failure_reason?: string;
    }> = [
      { name: 'Incident Commander', contact: 'commander@epmp.local', channel: 'Email', status: 'Acknowledged' },
      { name: 'Planning Chief', contact: 'planner@epmp.local', channel: 'Email', status: 'Delivered' },
      { name: 'EOC Director', contact: 'eocdirector@epmp.local', channel: 'SMS', status: 'Delivered' },
      {
        name: 'EPMP Admin',
        contact: 'admin@epmp.local',
        channel: 'SMS',
        status: 'Failed',
        failure_reason: 'Carrier rejected the message (invalid number format).',
      },
    ];
    for (const r of uatRecipients) {
      const recipientRows = await pool.query<{ id: string }>(
        `INSERT INTO notification_recipients (notification_id, recipient_name, recipient_contact, channel)
         VALUES ($1,$2,$3,$4) RETURNING id`,
        [uatSentNotification.id, r.name, r.contact, r.channel],
      );
      await pool.query(
        `INSERT INTO notification_delivery_status (notification_recipient_id, status, failure_reason, updated_at)
         VALUES ($1,$2,$3,$4)`,
        [recipientRows.rows[0].id, r.status, r.failure_reason ?? null, hoursAgoIso(1)],
      );
    }
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatOverdueIncidentId,
        `Notification sent: ${uatSentNotificationBody.slice(0, 60)}`,
        commanderUser.id,
        JSON.stringify({ notification_id: uatSentNotification.id, approver_id: commanderUser.id, channels: ['SMS', 'Email'] }),
        hoursAgoIso(2),
      ],
    );
  }

  // --- Plan 09-01 (F14): directly exercise the notification-provider
  // --- adapter against the already-seeded uatSentNotification's id, so
  // --- notification_dispatch_log/integration_health/cap_alert_records
  // --- rows exist immediately after `npm run seed` — same precedent as
  // --- the EOC COTS/facility/hazard-feed sync calls below. These three
  // --- calls run in sequence: Everbridge (SMS) success, IPAWS success
  // --- (full capFields set, proving cap_alert_records is seeded with a
  // --- CAP-complete row), then a forced outage demonstrating the
  // --- offline transition is reachable. Final state after all three:
  // --- 'Everbridge' integration_health row is 'offline' (the forced
  // --- outage runs LAST and is the most recent recordProviderHealth
  // --- call for that provider) — documented here for Plan 09-03's
  // --- Playwright suite to expect.
  await sendViaProvider({
    notification_id: uatSentNotification.id,
    channel: 'SMS',
    recipients: [{ name: 'Incident Commander', contact: 'commander@epmp.local' }],
    message: uatSentNotificationBody,
    approved_by: commanderUser.id,
    approved_at: hoursAgoIso(2),
  });
  await sendViaProvider({
    notification_id: uatSentNotification.id,
    channel: 'IPAWS',
    recipients: [{ name: 'Incident Commander', contact: 'commander@epmp.local' }],
    message: uatSentNotificationBody,
    approved_by: commanderUser.id,
    approved_at: hoursAgoIso(2),
    capFields: {
      sender: 'EPMP Agency Alerting Authority',
      event: 'General Emergency Notification',
      urgency: 'Immediate',
      severity: 'Severe',
      certainty: 'Observed',
      area: 'Default Agency service area',
    },
  });
  await sendViaProvider({
    notification_id: uatSentNotification.id,
    channel: 'SMS',
    recipients: [{ name: 'Incident Commander', contact: 'commander@epmp.local' }],
    message: 'FORCE_PROVIDER_OUTAGE',
    approved_by: commanderUser.id,
    approved_at: hoursAgoIso(2),
  });
  console.log(
    'Notification-provider adapter: seeded Everbridge/IPAWS dispatch-log + cap_alert_records + integration_health rows (Everbridge left offline after the forced-outage demo call).',
  );

  // --- Test 4 (Generate AAR — wizard half): a SECOND closed incident with
  // --- rich Timeline activity (command-role assignment, activation
  // --- change, task, fulfilled resource request, sent notification),
  // --- left WITHOUT a pre-generated aars row so a human tester's own
  // --- walkthrough of the wizard triggers real auto-assembly on first
  // --- visit (AarGenerator.tsx's own auto-POST-on-mount contract), then
  // --- carries it through finding-ownership + finalize themselves.
  // --- Test 4's OPEN half (closure-gate EmptyState) is already satisfied
  // --- by the pre-existing UAT-ASSIGN-ROLE/UAT-ESCALATE-READY incidents
  // --- (both still Open) — no new fixture needed for that side.
  const uatAarReadyIncident = await findOrInsert(
    'incidents',
    ['name', 'jurisdiction_id'],
    ['UAT-CLOSED-AAR-READY Default Agency Severe Weather', jurisdiction.id],
    ['name', 'type', 'severity', 'jurisdiction_id', 'opened_at', 'created_by'],
    [
      'UAT-CLOSED-AAR-READY Default Agency Severe Weather',
      'Severe Weather',
      'Elevated',
      jurisdiction.id,
      daysAgoIso(3),
      commanderUser.id,
    ],
  );
  record('incidents', uatAarReadyIncident);

  if (uatAarReadyIncident.inserted) {
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, occurred_at)
       VALUES ($1, 'Incident created', 'brand', $2, 'EPMP', $3)`,
      [uatAarReadyIncident.id, commanderUser.id, daysAgoIso(3)],
    );

    // Command-role assignment — decision-tagged via DECISION_TITLE_PATTERN's
    // "assigned to" match (reporting.ts).
    await pool.query(
      `INSERT INTO incident_command_roles (incident_id, role_title, person_id, assigned_by, assigned_at)
       VALUES ($1, 'Incident Commander', $2, $2, $3)`,
      [uatAarReadyIncident.id, commanderUser.id, daysAgoIso(3)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, 'Incident Commander assigned to Incident Commander', 'brand', $2, 'EPMP', $3, $4)`,
      [
        uatAarReadyIncident.id,
        commanderUser.id,
        JSON.stringify({ role_title: 'Incident Commander', person_id: commanderUser.id }),
        daysAgoIso(3),
      ],
    );

    // Activation change — decision-tagged, and feeds analytics.ts's
    // median_activation_time KPI (JOIN LATERAL on 'Activation changed to%').
    // Deliberately a bit AFTER opened_at (daysAgoIso(3)) — a timestamp
    // identical to opened_at would make the KPI's own
    // first_activation.occurred_at - i.opened_at delta compute to exactly
    // zero, indistinguishable from "no real elapsed time", which defeats
    // this fixture's purpose of proving the KPI renders a genuine
    // non-zero value.
    await pool.query(`UPDATE incidents SET activation_level = 'Partial' WHERE id = $1`, [uatAarReadyIncident.id]);
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, 'Activation changed to Partial', 'warning', $2, 'EPMP', $3, $4)`,
      [
        uatAarReadyIncident.id,
        commanderUser.id,
        JSON.stringify({ from: 'Monitoring', to: 'Partial' }),
        hoursAgoIso(3 * 24 - 2),
      ],
    );

    // Task — ordinary (non-decision-tagged) timeline content.
    const taskRows = await pool.query<{ id: string }>(
      `INSERT INTO tasks (title, description, status, owner_id, incident_id, due_at, requires_approval, created_by)
       VALUES ($1,$2,'Done',$3,$4,$5,false,$3) RETURNING id`,
      [
        'UAT-AAR-READY Verify shelter capacity',
        'Confirm emergency shelter has adequate capacity for displaced residents.',
        commanderUser.id,
        uatAarReadyIncident.id,
        daysAgoIso(2),
      ],
    );
    const uatAarReadyTaskId = taskRows.rows[0].id;
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, NULL, 'Open', $2, $3)`,
      [uatAarReadyTaskId, commanderUser.id, daysAgoIso(3)],
    );
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Open', 'Done', $2, $3)`,
      [uatAarReadyTaskId, commanderUser.id, daysAgoIso(2)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatAarReadyIncident.id,
        'Task created: UAT-AAR-READY Verify shelter capacity',
        commanderUser.id,
        JSON.stringify({ task_id: uatAarReadyTaskId, owner_id: commanderUser.id }),
        daysAgoIso(3),
      ],
    );

    // Resource request, fulfilled end-to-end — feeds the AAR's
    // resource_history section AND analytics.ts's
    // resource_request_fulfillment_time KPI (needs status='Fulfilled'
    // with a real fulfilled_at - created_at gap). Approved by
    // planner@epmp.local (resource_requests:approve holder) so this
    // incident's Timeline carries a SECOND distinct actor, same purpose
        // as every other phase's cross-reviewer fixture.
    const uatAarReadyRrDescription = 'UAT-AAR-READY Cots and blankets for shelter';
    const rrRows = await pool.query<{ id: string }>(
      `INSERT INTO resource_requests
         (resource_type, description, quantity, status, incident_id, requesting_role, needed_by, requested_by, approved_by, assigned_to, fulfilled_at, created_at, updated_at)
       VALUES ('Supplies',$1,10,'Fulfilled',$2,'incident_commander',$3,$4,$5,'Logistics pool A',$6,$7,$6)
       RETURNING id`,
      [
        uatAarReadyRrDescription,
        uatAarReadyIncident.id,
        daysAgoIso(3),
        commanderUser.id,
        plannerUser.id,
        hoursAgoIso(36),
        daysAgoIso(3),
      ],
    );
    const uatAarReadyRrId = rrRows.rows[0].id;
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, NULL, 'Draft', $2, $3)`,
      [uatAarReadyRrId, commanderUser.id, daysAgoIso(3)],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Draft', 'Awaiting approval', $2, $3)`,
      [uatAarReadyRrId, commanderUser.id, daysAgoIso(3)],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Awaiting approval', 'Approved', $2, $3)`,
      [uatAarReadyRrId, plannerUser.id, daysAgoIso(2)],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Approved', 'Fulfilled', $2, $3)`,
      [uatAarReadyRrId, plannerUser.id, hoursAgoIso(36)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatAarReadyIncident.id,
        `Resource request: Supplies (${uatAarReadyRrDescription})`,
        commanderUser.id,
        JSON.stringify({ resource_request_id: uatAarReadyRrId, quantity: 10 }),
        daysAgoIso(3),
      ],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'success', $3, 'EPMP', $4, $5)`,
      [
        uatAarReadyIncident.id,
        `Resource request approved: Supplies (${uatAarReadyRrDescription})`,
        plannerUser.id,
        JSON.stringify({ resource_request_id: uatAarReadyRrId }),
        daysAgoIso(2),
      ],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'success', $3, 'EPMP', $4, $5)`,
      [
        uatAarReadyIncident.id,
        `Resource request fulfilled: Supplies (${uatAarReadyRrDescription})`,
        plannerUser.id,
        JSON.stringify({ resource_request_id: uatAarReadyRrId, assigned_to: 'Logistics pool A' }),
        hoursAgoIso(36),
      ],
    );

    // A sent notification tied to THIS incident (test 8 reusable, and
    // rounds out the AAR's Timeline with the exact "command-role
    // assignment + a task + a notification sent" triple the test spec
    // names).
    const uatAarReadyNotifBody = 'UAT-AAR-READY Evacuation lifted for Default Agency shelter zone.';
    const notifRows = await pool.query<{ id: string }>(
      `INSERT INTO notifications
         (incident_id, message_body, ai_origin, channels, recipient_group_ids, approved_by, approved_at, sent_at, created_by, created_at)
       VALUES ($1,$2,false,$3,$4,$5,$6,$6,$5,$6) RETURNING id`,
      [
        uatAarReadyIncident.id,
        uatAarReadyNotifBody,
        ['Email'],
        [uatRecipientGroup.id],
        commanderUser.id,
        hoursAgoIso(30),
      ],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatAarReadyIncident.id,
        `Notification sent: ${uatAarReadyNotifBody.slice(0, 60)}`,
        commanderUser.id,
        JSON.stringify({ notification_id: notifRows.rows[0].id, approver_id: commanderUser.id, channels: ['Email'] }),
        hoursAgoIso(30),
      ],
    );

    // Closure — the literal "Incident closed" decision-tagged entry
    // reporting.ts's DECISION_TITLE_PATTERN matches, and the state the
    // AAR_NOT_CLOSED gate (reporting.ts) requires before generation.
    await pool.query(
      `UPDATE incidents SET status = 'Closed', closed_at = $2, updated_at = $2 WHERE id = $1`,
      [uatAarReadyIncident.id, hoursAgoIso(24)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, occurred_at)
       VALUES ($1, 'Incident closed', 'brand', $2, 'EPMP', $3)`,
      [uatAarReadyIncident.id, commanderUser.id, hoursAgoIso(24)],
    );
  }

  // --- Test 7 (Incident Workspace Reports tab integration): a THIRD
  // --- incident, closed the same way, but with its AAR actually
  // --- generated AND finalized (findings owned, closure_status set to
  // --- both values so analytics' corrective_action_closure_rate KPI has
  // --- a non-trivial denominator too) — recoverable via
  // --- GET /api/v1/evidence-log?action_type=aar_finalized, matching
  // --- IncidentWorkspace.tsx's useIncidentReports read path exactly.
  const uatAarFinalizedIncident = await findOrInsert(
    'incidents',
    ['name', 'jurisdiction_id'],
    ['UAT-CLOSED-AAR-FINALIZED Default Agency HazMat Response', jurisdiction.id],
    ['name', 'type', 'severity', 'jurisdiction_id', 'opened_at', 'created_by'],
    [
      'UAT-CLOSED-AAR-FINALIZED Default Agency HazMat Response',
      'HazMat',
      'Critical',
      jurisdiction.id,
      daysAgoIso(10),
      commanderUser.id,
    ],
  );
  record('incidents', uatAarFinalizedIncident);

  if (uatAarFinalizedIncident.inserted) {
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, occurred_at)
       VALUES ($1, 'Incident created', 'brand', $2, 'EPMP', $3)`,
      [uatAarFinalizedIncident.id, commanderUser.id, daysAgoIso(10)],
    );

    await pool.query(
      `INSERT INTO incident_command_roles (incident_id, role_title, person_id, assigned_by, assigned_at)
       VALUES ($1, 'Incident Commander', $2, $2, $3)`,
      [uatAarFinalizedIncident.id, commanderUser.id, daysAgoIso(10)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, 'Incident Commander assigned to Incident Commander', 'brand', $2, 'EPMP', $3, $4)`,
      [
        uatAarFinalizedIncident.id,
        commanderUser.id,
        JSON.stringify({ role_title: 'Incident Commander', person_id: commanderUser.id }),
        daysAgoIso(10),
      ],
    );

    // Same "must be after opened_at, not equal to it" reasoning as
    // UAT-CLOSED-AAR-READY's identical fixture above.
    await pool.query(`UPDATE incidents SET activation_level = 'Full' WHERE id = $1`, [uatAarFinalizedIncident.id]);
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, 'Activation changed to Full', 'warning', $2, 'EPMP', $3, $4)`,
      [
        uatAarFinalizedIncident.id,
        commanderUser.id,
        JSON.stringify({ from: 'Monitoring', to: 'Full' }),
        hoursAgoIso(10 * 24 - 3),
      ],
    );

    const taskRows2 = await pool.query<{ id: string }>(
      `INSERT INTO tasks (title, description, status, owner_id, incident_id, due_at, requires_approval, created_by)
       VALUES ($1,$2,'Done',$3,$4,$5,false,$3) RETURNING id`,
      [
        'UAT-AAR-FINALIZED Decontaminate affected site',
        'Confirm the affected site has been decontaminated and cleared for re-entry.',
        commanderUser.id,
        uatAarFinalizedIncident.id,
        daysAgoIso(9),
      ],
    );
    const uatAarFinalizedTaskId = taskRows2.rows[0].id;
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, NULL, 'Open', $2, $3)`,
      [uatAarFinalizedTaskId, commanderUser.id, daysAgoIso(10)],
    );
    await pool.query(
      `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Open', 'Done', $2, $3)`,
      [uatAarFinalizedTaskId, commanderUser.id, daysAgoIso(9)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatAarFinalizedIncident.id,
        'Task created: UAT-AAR-FINALIZED Decontaminate affected site',
        commanderUser.id,
        JSON.stringify({ task_id: uatAarFinalizedTaskId, owner_id: commanderUser.id }),
        daysAgoIso(10),
      ],
    );

    const uatAarFinalizedRrDescription = 'UAT-AAR-FINALIZED Hazmat containment kits';
    const rrRows2 = await pool.query<{ id: string }>(
      `INSERT INTO resource_requests
         (resource_type, description, quantity, status, incident_id, requesting_role, needed_by, requested_by, approved_by, assigned_to, fulfilled_at, created_at, updated_at)
       VALUES ('Equipment',$1,4,'Fulfilled',$2,'incident_commander',$3,$4,$5,'Logistics pool B',$6,$7,$6)
       RETURNING id`,
      [
        uatAarFinalizedRrDescription,
        uatAarFinalizedIncident.id,
        daysAgoIso(10),
        commanderUser.id,
        plannerUser.id,
        daysAgoIso(9),
        daysAgoIso(10),
      ],
    );
    const uatAarFinalizedRrId = rrRows2.rows[0].id;
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, NULL, 'Draft', $2, $3)`,
      [uatAarFinalizedRrId, commanderUser.id, daysAgoIso(10)],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Draft', 'Awaiting approval', $2, $3)`,
      [uatAarFinalizedRrId, commanderUser.id, daysAgoIso(10)],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Awaiting approval', 'Approved', $2, $3)`,
      [uatAarFinalizedRrId, plannerUser.id, daysAgoIso(9.5)],
    );
    await pool.query(
      `INSERT INTO resource_request_status_history (resource_request_id, from_status, to_status, changed_by, changed_at)
       VALUES ($1, 'Approved', 'Fulfilled', $2, $3)`,
      [uatAarFinalizedRrId, plannerUser.id, daysAgoIso(9)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatAarFinalizedIncident.id,
        `Resource request: Equipment (${uatAarFinalizedRrDescription})`,
        commanderUser.id,
        JSON.stringify({ resource_request_id: uatAarFinalizedRrId, quantity: 4 }),
        daysAgoIso(10),
      ],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'success', $3, 'EPMP', $4, $5)`,
      [
        uatAarFinalizedIncident.id,
        `Resource request approved: Equipment (${uatAarFinalizedRrDescription})`,
        plannerUser.id,
        JSON.stringify({ resource_request_id: uatAarFinalizedRrId }),
        daysAgoIso(9.5),
      ],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'success', $3, 'EPMP', $4, $5)`,
      [
        uatAarFinalizedIncident.id,
        `Resource request fulfilled: Equipment (${uatAarFinalizedRrDescription})`,
        plannerUser.id,
        JSON.stringify({ resource_request_id: uatAarFinalizedRrId, assigned_to: 'Logistics pool B' }),
        daysAgoIso(9),
      ],
    );

    const uatAarFinalizedNotifBody = 'UAT-AAR-FINALIZED HazMat all-clear issued for Default Agency response zone.';
    const notifRows2 = await pool.query<{ id: string }>(
      `INSERT INTO notifications
         (incident_id, message_body, ai_origin, channels, recipient_group_ids, approved_by, approved_at, sent_at, created_by, created_at)
       VALUES ($1,$2,false,$3,$4,$5,$6,$6,$5,$6) RETURNING id`,
      [
        uatAarFinalizedIncident.id,
        uatAarFinalizedNotifBody,
        ['Email', 'IPAWS'],
        [uatRecipientGroup.id],
        commanderUser.id,
        daysAgoIso(8.5),
      ],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, detail, occurred_at)
       VALUES ($1, $2, 'brand', $3, 'EPMP', $4, $5)`,
      [
        uatAarFinalizedIncident.id,
        `Notification sent: ${uatAarFinalizedNotifBody.slice(0, 60)}`,
        commanderUser.id,
        JSON.stringify({ notification_id: notifRows2.rows[0].id, approver_id: commanderUser.id, channels: ['Email', 'IPAWS'] }),
        daysAgoIso(8.5),
      ],
    );

    await pool.query(
      `UPDATE incidents SET status = 'Closed', closed_at = $2, updated_at = $2 WHERE id = $1`,
      [uatAarFinalizedIncident.id, daysAgoIso(8)],
    );
    await pool.query(
      `INSERT INTO incident_timeline (incident_id, title, tone, actor_id, source, occurred_at)
       VALUES ($1, 'Incident closed', 'brand', $2, 'EPMP', $3)`,
      [uatAarFinalizedIncident.id, commanderUser.id, daysAgoIso(8)],
    );

    // Generate the AAR content exactly the way reporting.ts's own
    // assembleAarAssembly() does (same filter predicate, same source
    // tables), then insert it already Finalized — mirrors a human
    // tester's own "generate -> add finding -> finalize" path end-to-end,
    // just performed once here so the Reports tab/evidence-log have
    // something to show on first UAT visit.
    const timelineRows = await pool.query<Record<string, unknown>>(
      `SELECT id, occurred_at, title, meta, tone, actor_id, source, detail
       FROM incident_timeline WHERE incident_id = $1 ORDER BY occurred_at ASC`,
      [uatAarFinalizedIncident.id],
    );
    const decisionTitlePattern = /Activation changed to|assigned to|Incident closed/;
    const decisionsLog = timelineRows.rows.filter((row) => {
      const source = row.source as string;
      const tone = row.tone as string;
      const title = row.title as string;
      if (source !== 'EPMP') return false;
      if (tone === 'warning' || tone === 'danger') return true;
      return decisionTitlePattern.test(title);
    });
    const resourceRequestsForAar = await pool.query<Record<string, unknown>>(
      `SELECT * FROM resource_requests WHERE incident_id = $1`,
      [uatAarFinalizedIncident.id],
    );
    const resourceHistoryForAar = await pool.query<Record<string, unknown>>(
      `SELECT h.* FROM resource_request_status_history h
       JOIN resource_requests r ON r.id = h.resource_request_id
       WHERE r.incident_id = $1`,
      [uatAarFinalizedIncident.id],
    );

    const uatAar = await findOrInsert(
      'aars',
      ['incident_id'],
      [uatAarFinalizedIncident.id],
      ['incident_id', 'timeline_export', 'decisions_log', 'resource_history', 'status', 'finalized_by', 'finalized_at', 'created_by'],
      [
        uatAarFinalizedIncident.id,
        JSON.stringify(timelineRows.rows),
        JSON.stringify(decisionsLog),
        JSON.stringify({ requests: resourceRequestsForAar.rows, status_history: resourceHistoryForAar.rows }),
        'Finalized',
        plannerUser.id,
        daysAgoIso(7),
        commanderUser.id,
      ],
    );
    record('aars', uatAar);

    if (uatAar.inserted) {
      // One owned-and-closed corrective action (feeds
      // corrective_action_closure_rate's numerator AND denominator with a
      // real Closed row), finalized by planner@epmp.local (reporting:edit
      // holder) — matches the real finalize route's authority.
      await pool.query(
        `INSERT INTO aar_findings (aar_id, finding_text, category, corrective_action, owner_id, due_date, closure_status)
         VALUES ($1,$2,$3,$4,$5,$6,'Closed')`,
        [
          uatAar.id,
          'HazMat containment kits were slower to fulfill than the response window allowed.',
          'Logistics',
          'Pre-position a second cache of containment kits at the Default Agency staging site.',
          plannerUser.id,
          new Date(nowMs + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        ],
      );

      // The SAME AuditService.record() write reporting.ts's finalize
      // route performs — this IS the single-writer audit_log entry
      // IncidentWorkspace.tsx's useIncidentReports/evidence-log.ts's
      // action_type=aar_finalized filter finds.
      await pool.query(
        `INSERT INTO audit_log (actor_id, action, record_type, record_id, detail, occurred_at)
         VALUES ($1,'aar_finalized','aar',$2,$3,$4)`,
        [
          plannerUser.id,
          uatAar.id,
          JSON.stringify({ incident_id: uatAarFinalizedIncident.id }),
          daysAgoIso(7),
        ],
      );
    }
  }

  // record_authority_registry baseline rows (natural key: record_type, which IS unique)
  //
  // Phase 8 (08-01, F13): 'incident' declared EPMP-authoritative here —
  // the four EOC COTS exchange-record types need a registered authority
  // for checkRecordAuthority to resolve against something other than its
  // own 'EPMP' collapsed-default, making the "undeclared record types are
  // not synced" rule observably testable. 'resource_request'/'status'/
  // 'activity_log' are left DELIBERATELY UNREGISTERED here — this plan's
  // own integration test proves they're skipped entirely by
  // runEocCotsSync's isRecordTypeDeclared gate.
  const authorityRows = [
    { record_type: 'user_identity', authoritative_system: 'EPMP' },
    { record_type: 'personnel_roster', authoritative_system: 'HRIS' },
    { record_type: 'incident', authoritative_system: 'EPMP' },
  ];
  for (const a of authorityRows) {
    const result = await findOrInsert(
      'record_authority_registry',
      ['record_type'],
      [a.record_type],
      ['record_type', 'authoritative_system'],
      [a.record_type, a.authoritative_system],
    );
    record('record_authority_registry', result);
  }

  // Plan 09-04 (F16-roster): `record_type` carries a real UNIQUE constraint
  // (this file's migration 1700000000000_auth-org-schema.js), so this
  // ON CONFLICT upsert is valid against it. Deliberately a standalone
  // statement, NOT a findOrInsert() call — findOrInsert is find-or-insert-
  // ONLY (see its own doc comment above) and would silently no-op against
  // the 'personnel_roster' row the authorityRows loop just above this one
  // already found-or-inserted with `notes` left NULL (that row has existed
  // since Phase 1, this plan is what first sets its notes). This statement
  // is what actually makes /admin/record-authority's personnel_roster row
  // show "Reference data only" instead of "—", on both a fresh seed run
  // AND a re-run against an already-seeded database (idempotent either
  // way, via ON CONFLICT DO UPDATE rather than a one-time INSERT).
  await pool.query(
    `INSERT INTO record_authority_registry (record_type, authoritative_system, notes)
     VALUES ($1, $2, $3)
     ON CONFLICT (record_type) DO UPDATE SET notes = EXCLUDED.notes`,
    ['personnel_roster', 'HRIS', 'Reference data only'],
  );

  // Phase 6 (06-02, F18): role_landing_config rows for all 5 persona roles
  // (PER-01..PER-05) — the table 01-01's migration created but explicitly
  // left unpopulated, scoped as Phase 6/F18 work (see that migration's own
  // inline NOTE). role_id IS UNIQUE on this table (the migration's own
  // `role_id UUID NOT NULL REFERENCES roles(id) UNIQUE`), so findOrInsert's
  // natural-key match below is exactly role_id, matching the file's own
  // established idempotent pattern.
  //
  // PER-05 (secops_admin) is modeled as ONE row carrying only the DEFAULT
  // (admin) facet's nav_groups — S18.5's distinct executive-facet SideNav
  // (Executive dashboard, Reports) is NOT stored here, since
  // role_landing_config's role_id UNIQUE constraint allows exactly one row
  // per role and there is no schema field for a second facet. 06-07's
  // ExecutiveDashboard page hardcodes the executive-facet nav_groups
  // client-side as a static two-item array — a documented, budget-scoped
  // simplification, not an oversight.
  //
  // Each entry below is re-asserted via an explicit UPDATE immediately
  // after findOrInsert (same "re-assert idempotently" pattern this file's
  // sso_config/group_to_role_mapping block already uses above), since
  // findOrInsert's INSERT-only-on-first-creation behavior would otherwise
  // leave a stale landing-config payload in place across this phase's own
  // repeated development seed runs.
  const roleLandingConfigs = [
    {
      roleName: 'eoc_director', // PER-01, S18.1
      default_landing_route: '/dashboard',
      nav_groups: [
        { label: 'Prepare', items: [{ id: 'plans', label: 'Plans & playbooks', icon: 'file', href: '/plans' }] },
        {
          label: 'Monitor',
          items: [
            { id: 'operating-picture', label: 'Operating picture', icon: 'map', href: '/operating-picture' },
            { id: 'signals', label: 'Signals', icon: 'broadcast', href: '/signals' },
          ],
        },
        { label: 'Activate', items: [{ id: 'incidents', label: 'Incidents', icon: 'flag', href: '/incidents' }] },
        {
          label: 'Coordinate',
          items: [{ id: 'notifications', label: 'Notifications', icon: 'bell', href: '/notifications/compose' }],
        },
        { label: 'Improve', items: [{ id: 'reports', label: 'Reports', icon: 'file', href: '/reports/analytics' }] },
      ],
      mobile_bottom_bar_items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'home', href: '/dashboard' },
        { id: 'incidents', label: 'Incidents', icon: 'flag', href: '/incidents' },
        { id: 'operating-picture', label: 'Map', icon: 'map', href: '/operating-picture' },
        { id: 'profile', label: 'Profile', icon: 'users', href: '/profile' },
      ],
    },
    {
      // PER-02, S18.2. `default_landing_route` is `/incidents` (the list)
      // not a specific incident id, per S18.2's own spec ("Incident List
      // if none is active") — a literal "currently active incident"
      // redirect would need a server-side "most recent active incident"
      // resolution this plan's own 2-3 task budget doesn't include;
      // 06-05's frontend wraps this with the active-incident-redirect
      // logic client-side using data it already fetches.
      roleName: 'incident_commander',
      default_landing_route: '/incidents',
      nav_groups: [
        { label: 'Activate', items: [{ id: 'incidents', label: 'Incidents', icon: 'flag', href: '/incidents' }] },
        {
          label: 'Coordinate',
          items: [{ id: 'notifications', label: 'Notifications', icon: 'bell', href: '/notifications/compose' }],
        },
        {
          label: 'Monitor',
          items: [{ id: 'operating-picture', label: 'Operating picture', icon: 'map', href: '/operating-picture' }],
        },
      ],
      mobile_bottom_bar_items: [
        { id: 'incidents', label: 'Incidents', icon: 'flag', href: '/incidents' },
        { id: 'operating-picture', label: 'Map', icon: 'map', href: '/operating-picture' },
        { id: 'notifications', label: 'Notify', icon: 'bell', href: '/notifications/compose' },
        { id: 'profile', label: 'Profile', icon: 'users', href: '/profile' },
      ],
    },
    {
      roleName: 'planning_logistics_chief', // PER-03, S18.3
      default_landing_route: '/my-work',
      nav_groups: [
        { label: 'Prepare', items: [{ id: 'plans', label: 'Plans & playbooks', icon: 'file', href: '/plans' }] },
        {
          label: 'Coordinate',
          items: [{ id: 'notifications', label: 'Notifications', icon: 'bell', href: '/notifications/compose' }],
        },
        { label: 'Improve', items: [{ id: 'reports', label: 'Reports', icon: 'file', href: '/reports/analytics' }] },
      ],
      mobile_bottom_bar_items: [
        { id: 'my-work', label: 'My work', icon: 'home', href: '/my-work' },
        { id: 'plans', label: 'Plans', icon: 'file', href: '/plans' },
        { id: 'reports', label: 'Reports', icon: 'file', href: '/reports/analytics' },
        { id: 'profile', label: 'Profile', icon: 'users', href: '/profile' },
      ],
    },
    {
      // PER-04, S18.4. `nav_groups: []` is deliberate per S18.4 — "No
      // desktop SideNav variant is offered to this role by default." This
      // role only ever sees the bottom-bar variant (06-07's AppShell.tsx
      // `forcedBottomBar` override renders it unconditionally for this
      // role, not just at the bp-md breakpoint).
      //
      // [Rule 1 - Bug, 06-07] This row's labels/hrefs originally drifted
      // from the Field group's own CANONICAL item set (routes.ts's
      // `hasFieldReports` nav-config block) — that block was corrected by
      // Phase 5's gap-closure plan (05-06, UAT gap refs 8/1) to relabel
      // "Tasks"→"My Tasks" and "Profile"→"Field home" (routing to `/field`,
      // not a nonexistent `/profile`), but this seed's own
      // mobile_bottom_bar_items literal was never updated to match,
      // leaving it stale. 06-07's AppShell.tsx now prefers THIS row over
      // nav-config's own Field-group derivation whenever non-empty (its
      // own doc comment, Task 2) — wiring it up surfaced this
      // pre-existing mismatch via field-mobile-bottom-nav.spec.ts's
      // regression failure (expected "My Tasks"/"Field home", got the
      // stale "Tasks"/"Profile"). Field exactly matches routes.ts's own
      // array (id, label, icon, href) so both sources agree.
      roleName: 'field_responder',
      default_landing_route: '/field',
      nav_groups: [] as unknown[],
      mobile_bottom_bar_items: [
        { id: 'field-tasks', label: 'My Tasks', icon: 'flag', href: '/field/tasks' },
        { id: 'field-report', label: 'Report', icon: 'send', href: '/field/report' },
        { id: 'field-map-nav', label: 'Map', icon: 'map', href: '/field/map' },
        { id: 'field-profile', label: 'Field home', icon: 'home', href: '/field' },
      ],
    },
    {
      // PER-05, S18.5 — see the function-level comment above for why this
      // is one row carrying only the admin (default) facet.
      roleName: 'secops_admin',
      default_landing_route: '/admin/platform-monitoring',
      nav_groups: [
        {
          label: 'Admin',
          items: [
            { id: 'users', label: 'Users', icon: 'users', href: '/admin/users' },
            { id: 'roles', label: 'Roles & permissions', icon: 'shield', href: '/admin/roles' },
            { id: 'audit-log', label: 'Audit log', icon: 'file', href: '/admin/audit-log' },
            { id: 'integration-health', label: 'Integration health', icon: 'activity', href: '/admin/integration-health' },
            { id: 'platform-monitoring', label: 'Platform monitoring', icon: 'gauge', href: '/admin/platform-monitoring' },
          ],
        },
      ],
      mobile_bottom_bar_items: null as unknown[] | null,
    },
  ];

  // Phase 6 (06-03, F9): ai_assist feature permission — the NEW
  // permission string 06-03's ai-assist/ai-drafts.ts routes gate on
  // (relocated out of notifications.ts's old notifications:view gate).
  // Granted to exactly the FRD's named drafting/reviewing personas:
  // eoc_director (PER-01) and planning_logistics_chief (PER-03) are the
  // FRD's "A reviewer (typically PER-01 or PER-03)" signal-triage
  // reviewers; incident_commander (PER-02) drafts ICS-form/SITREP
  // narrative content directly per S9.3's embedding list ("F1 ICS
  // forms/narrative"). All three get the full
  // view/create/approve/discard action set — there is no narrower
  // read-only/draft-only split documented for this feature the way
  // notifications/resource_requests/plans each have one.
  //
  // field_responder (PER-04) and secops_admin (PER-05) deliberately get
  // NO explicit 'ai_assist' row: field_responder has no AIDraft
  // touchpoint in this phase's scope (F6 mobile forms don't embed
  // AIDraft per the FRD's S9.3 list), and secops_admin's role is
  // platform administration, not incident content drafting — same
  // "intentional, not an oversight" reasoning this file already
  // documents for every other feature's admin-exclusion above.
  const aiAssistRoles = ['incident_commander', 'eoc_director', 'planning_logistics_chief'] as const;

  for (const roleName of aiAssistRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'ai_assist'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'ai_assist', ['view', 'create', 'approve', 'discard']],
    );
    record('role_permissions', result);
  }

  for (const cfg of roleLandingConfigs) {
    const roleId = roleIds[cfg.roleName];
    // `mobile_bottom_bar_items` is a nullable JSONB column with a
    // chk_bottom_bar_max CHECK that reads `IS NULL OR
    // jsonb_array_length(...) <= 4` — JSON.stringify(null) produces the
    // STRING "null", which Postgres happily stores as a JSONB scalar
    // `null` value, NOT a SQL NULL. That scalar fails the CHECK's `IS
    // NULL` branch (it isn't SQL NULL) and then explodes on
    // jsonb_array_length("a scalar"). Passing the actual JS `null` (not
    // its JSON.stringify'd string) as the bound parameter is what makes
    // pg write a true SQL NULL into the column, matching the CHECK
    // constraint's own first branch. PER-05's row is the only one in this
    // seed that exercises the null case; found via this task's own first
    // seed run exploding with "cannot get array length of a scalar".
    const mobileBottomBarParam =
      cfg.mobile_bottom_bar_items === null ? null : JSON.stringify(cfg.mobile_bottom_bar_items);
    const result = await findOrInsert(
      'role_landing_config',
      ['role_id'],
      [roleId],
      ['role_id', 'default_landing_route', 'nav_groups', 'mobile_bottom_bar_items'],
      [roleId, cfg.default_landing_route, JSON.stringify(cfg.nav_groups), mobileBottomBarParam],
    );
    record('role_landing_config', result);
    await pool.query(
      `UPDATE role_landing_config SET default_landing_route = $2, nav_groups = $3, mobile_bottom_bar_items = $4 WHERE role_id = $1`,
      [roleId, cfg.default_landing_route, JSON.stringify(cfg.nav_groups), mobileBottomBarParam],
    );
  }

  // Phase 6 (06-04, F9): sample hazard_feed_config + hazard_feed_events
  // rows simulating a real corroborating cluster — no live NOAA/NWS/USGS
  // feed credential exists in this sandbox (F12 is explicitly deferred to
  // v2 per .planning/REQUIREMENTS.md), so this seed data stands in for
  // what a live feed poll would produce, giving
  // clusterHazardFeedEvents() real variety to demonstrate against:
  //  - 3 corroborating feeds (NOAA/NWS/USGS), all type='Coastal Flood
  //    Watch', geometries within 0.5 degrees of each other, issued within
  //    the last few hours -> clusters into ONE High-confidence signal.
  //  - 2 isolated single-source events (different type, far-apart
  //    geometry, one per feed) -> each clusters into its own
  //    Medium-confidence signal.
  // Natural key for hazard_feed_config: feed_name (the CHECK constraint
  // already limits this to exactly 'NOAA'/'NWS'/'USGS', and this seed
  // only ever creates one config row per feed name).
  const hazardFeedDefs = [
    { feed_name: 'NOAA', endpoint_url: 'https://api.weather.gov/alerts/noaa-stub' },
    { feed_name: 'NWS', endpoint_url: 'https://api.weather.gov/alerts/nws-stub' },
    { feed_name: 'USGS', endpoint_url: 'https://earthquake.usgs.gov/alerts/usgs-stub' },
  ] as const;

  const hazardFeedIds: Record<string, string> = {};
  for (const f of hazardFeedDefs) {
    const result = await findOrInsert(
      'hazard_feed_config',
      ['feed_name'],
      [f.feed_name],
      ['feed_name', 'endpoint_url'],
      [f.feed_name, f.endpoint_url],
    );
    hazardFeedIds[f.feed_name] = result.id;
    record('hazard_feed_config', result);
  }

  const hazardFeedEventNowMs = Date.now();
  const hazardFeedEventHoursAgoIso = (h: number) =>
    new Date(hazardFeedEventNowMs - h * 60 * 60 * 1000).toISOString();

  // Natural key for hazard_feed_events: UNIQUE(feed_id, external_event_id)
  // per this plan's own migration — findOrInsert matches on exactly that
  // pair, so a second seed run never re-inserts these fixture rows.
  const hazardFeedEventDefs = [
    // The 3 corroborating same-type/nearby-geometry events — all within
    // the same 0.5-degree grid cell (38.80-38.90 lat, -77.05--76.95 lng
    // all snap to the same grid cell), same `type`, so
    // clusterHazardFeedEvents()'s GROUP BY produces exactly ONE group of
    // 3 for these.
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-001',
      type: 'Coastal Flood Watch',
      severity: 'Elevated',
      lng: -77.02,
      lat: 38.85,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(2),
    },
    {
      feed_name: 'NWS',
      external_event_id: 'UAT-SIGNAL-NWS-001',
      type: 'Coastal Flood Watch',
      severity: 'Elevated',
      lng: -77.03,
      lat: 38.86,
      source: 'NWS',
      issued_at: hazardFeedEventHoursAgoIso(1.5),
    },
    {
      feed_name: 'USGS',
      external_event_id: 'UAT-SIGNAL-USGS-001',
      type: 'Coastal Flood Watch',
      severity: 'Elevated',
      lng: -77.01,
      lat: 38.84,
      source: 'USGS',
      issued_at: hazardFeedEventHoursAgoIso(1),
    },
    // Isolated single-source event #1 — different type, far-apart
    // geometry (no other event anywhere near this grid cell) ->
    // clusters alone into a Medium-confidence signal.
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-002',
      type: 'High Wind Warning',
      severity: 'Watch',
      lng: -95.37,
      lat: 29.76,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(4),
    },
    // Isolated single-source event #2 — a second distinct type/location,
    // same reasoning as above.
    {
      feed_name: 'USGS',
      external_event_id: 'UAT-SIGNAL-USGS-002',
      type: 'Earthquake Advisory',
      severity: 'Watch',
      lng: -122.42,
      lat: 37.77,
      source: 'USGS',
      issued_at: hazardFeedEventHoursAgoIso(6),
    },
    // UAT data-doctor fixtures (added post-06-VERIFICATION.md's documented
    // "signal-triage.spec.ts fixture exhaustion" finding): the 3 original
    // fixture events above each cluster into exactly ONE signal apiece on
    // a FIRST seed run, and the Signal Triage Queue's own Promote/Dismiss
    // actions (exercised repeatedly by both e2e specs and manual UAT
    // passes in this one long-lived sandbox) permanently flip those
    // signals out of 'New' status — clusterHazardFeedEvents()'s own
    // `WHERE NOT EXISTS (signal_source_events link)` idempotency guard
    // correctly never re-clusters the SAME hazard_feed_events rows, so a
    // re-seed alone can never replenish 'New' rows once every original
    // fixture signal has been triaged. These two additional isolated
    // events (new `external_event_id`s, so findOrInsert's natural-key
    // match never collides with the originals above, and distinct
    // type/far-apart geometry so they each form their own fresh,
    // never-before-clustered group) give clusterHazardFeedEvents() two
    // more Medium-confidence 'New' signals to create every time this gap
    // recurs — safe to append again later following this exact pattern if
    // the queue is ever drained again.
    {
      feed_name: 'NWS',
      external_event_id: 'UAT-SIGNAL-NWS-003',
      type: 'Flash Flood Warning',
      severity: 'Elevated',
      lng: -84.39,
      lat: 33.75,
      source: 'NWS',
      issued_at: hazardFeedEventHoursAgoIso(3),
    },
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-004',
      type: 'Winter Storm Warning',
      severity: 'Elevated',
      lng: -104.99,
      lat: 39.74,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(5),
    },
    // Second round of UAT data-doctor fixtures (gap closure 06-11, GATE.md's
    // "browser_suite: fail" blocker, failure #3): the same fixture-exhaustion
    // pattern documented at UAT-SIGNAL-NWS-003/NOAA-004 above recurred after
    // further repeated full-suite Playwright runs drained those two as well.
    // 6 more isolated, mutually-distinct events — each a different type, far
    // apart in geometry from every other entry in this array — give
    // clusterHazardFeedEvents() 6 more fresh Medium-confidence 'New' signals
    // every time `npm run seed` runs. Safe to append a third round again
    // later following this exact pattern if the queue is ever drained again.
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-005',
      type: 'Tornado Watch',
      severity: 'Elevated',
      lng: -96.80,
      lat: 32.78,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(7),
    },
    {
      feed_name: 'NWS',
      external_event_id: 'UAT-SIGNAL-NWS-006',
      type: 'Heat Advisory',
      severity: 'Watch',
      lng: -112.07,
      lat: 33.45,
      source: 'NWS',
      issued_at: hazardFeedEventHoursAgoIso(8),
    },
    {
      feed_name: 'USGS',
      external_event_id: 'UAT-SIGNAL-USGS-007',
      type: 'Volcanic Activity Advisory',
      severity: 'Watch',
      lng: -121.76,
      lat: 46.85,
      source: 'USGS',
      issued_at: hazardFeedEventHoursAgoIso(9),
    },
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-008',
      type: 'Red Flag Warning',
      severity: 'Elevated',
      lng: -119.42,
      lat: 36.73,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(10),
    },
    {
      feed_name: 'NWS',
      external_event_id: 'UAT-SIGNAL-NWS-009',
      type: 'Dense Fog Advisory',
      severity: 'Watch',
      lng: -72.68,
      lat: 41.76,
      source: 'NWS',
      issued_at: hazardFeedEventHoursAgoIso(11),
    },
    {
      feed_name: 'USGS',
      external_event_id: 'UAT-SIGNAL-USGS-010',
      type: 'Landslide Advisory',
      severity: 'Watch',
      lng: -122.68,
      lat: 45.52,
      source: 'USGS',
      issued_at: hazardFeedEventHoursAgoIso(12),
    },
    // Third round of UAT data-doctor fixtures (execute-phase's own gap_redrive
    // step on gap-closure plan 06-11: the exact same fixture-exhaustion
    // pattern recurred ONE run after 06-11's second round landed — this
    // session's cumulative Playwright executions across three parallel
    // executors' self-verification runs, the phase-level browser_suite_gate
    // full-suite pass, and the gap-closure redrive itself collectively
    // Promoted/Dismissed all 13 prior UAT-SIGNAL fixtures before this
    // redrive's own re-run of signal-triage.spec.ts — exactly the scenario
    // 06-11's own code comment above anticipated: "safe to append a third
    // round again later following this exact pattern if the queue is ever
    // drained again." 6 more isolated, mutually-distinct events (new
    // `external_event_id`s so findOrInsert's natural-key match never
    // collides with any of the 13 originals, distinct types not reused by
    // any prior round, geometry far from every existing entry) give
    // clusterHazardFeedEvents() 6 more fresh Medium-confidence 'New' signals
    // every time `npm run seed` runs.
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-011',
      type: 'Coastal Flood Watch',
      severity: 'Watch',
      lng: -80.19,
      lat: 25.76,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(13),
    },
    {
      feed_name: 'NWS',
      external_event_id: 'UAT-SIGNAL-NWS-012',
      type: 'High Wind Warning',
      severity: 'Elevated',
      lng: -104.80,
      lat: 41.14,
      source: 'NWS',
      issued_at: hazardFeedEventHoursAgoIso(14),
    },
    {
      feed_name: 'USGS',
      external_event_id: 'UAT-SIGNAL-USGS-013',
      type: 'Earthquake Advisory',
      severity: 'Elevated',
      lng: -118.24,
      lat: 34.05,
      source: 'USGS',
      issued_at: hazardFeedEventHoursAgoIso(15),
    },
    {
      feed_name: 'NOAA',
      external_event_id: 'UAT-SIGNAL-NOAA-014',
      type: 'Flood',
      severity: 'Watch',
      lng: -90.07,
      lat: 29.95,
      source: 'NOAA',
      issued_at: hazardFeedEventHoursAgoIso(16),
    },
    {
      feed_name: 'NWS',
      external_event_id: 'UAT-SIGNAL-NWS-015',
      type: 'Wildfire',
      severity: 'Elevated',
      lng: -116.97,
      lat: 33.73,
      source: 'NWS',
      issued_at: hazardFeedEventHoursAgoIso(17),
    },
    {
      feed_name: 'USGS',
      external_event_id: 'UAT-SIGNAL-USGS-016',
      type: 'Damage assessment',
      severity: 'Watch',
      lng: -149.90,
      lat: 61.22,
      source: 'USGS',
      issued_at: hazardFeedEventHoursAgoIso(18),
    },
  ] as const;

  for (const e of hazardFeedEventDefs) {
    const feedId = hazardFeedIds[e.feed_name];
    const existingEvent = await pool.query<{ id: string }>(
      `SELECT id FROM hazard_feed_events WHERE feed_id = $1 AND external_event_id = $2`,
      [feedId, e.external_event_id],
    );
    if (existingEvent.rows.length > 0) {
      record('hazard_feed_events', { id: existingEvent.rows[0].id, inserted: false });
      continue;
    }
    const inserted = await pool.query<{ id: string }>(
      `INSERT INTO hazard_feed_events
         (feed_id, external_event_id, type, severity, geometry, confidence, source, issued_at)
       VALUES ($1,$2,$3,$4, ST_SetSRID(ST_MakePoint($5,$6), 4326), $7, $8, $9)
       RETURNING id`,
      [feedId, e.external_event_id, e.type, e.severity, e.lng, e.lat, 'High', e.source, e.issued_at],
    );
    record('hazard_feed_events', { id: inserted.rows[0].id, inserted: true });
  }

  // Run the real clustering job against whatever unclustered
  // hazard_feed_events rows exist right now — the fixture rows above on a
  // first run, nothing new on every subsequent run (its own
  // WHERE NOT EXISTS (signal_source_events link) query condition finds no
  // unclustered events the second time), leaving the Signal Triage Queue
  // populated for human review/demo purposes after every `npm run seed`.
  const clusterResult = await clusterHazardFeedEvents();
  console.log(`Signal clustering: ${clusterResult.clustersCreated} new signal(s) created from hazard feed events.`);

  // Phase 7 (07-01, F12): promote every hazard_feed_events row (the fixture
  // rows seeded above) into hazard_layers — idempotent, calls the SAME
  // exported function Task 1 built rather than duplicating the promotion
  // SQL inline here. Leaves hazard_layers populated for manual QA/UAT
  // immediately after a fresh `npm run seed`, before the 5-minute
  // scheduler's first tick.
  await syncHazardLayersFromEvents();
  console.log('Hazard layers: promoted hazard_feed_events rows into hazard_layers.');

  // Also run the ingestion job once here so integration_health has real
  // NOAA(online)/NWS(offline)/USGS(offline) rows immediately after
  // seeding, rather than waiting for the scheduler's first tick.
  const ingestionResult = await runHazardFeedIngestion();
  console.log(`Hazard feed ingestion: attempted ${ingestionResult.feeds_attempted} feed(s) (NOAA online, NWS/USGS deterministically offline per this stub's KNOWN_LIVE_FEED contract).`);

  // Phase 8 (08-01, F13): run the EOC COTS sync job once here so
  // integration_health's 'WebEOC' row and at least one eoc_cots_conflicts
  // row (via the seeded 'EOC-CONFLICT-001' trigger) exist immediately
  // after `npm run seed`, without waiting for the 5-minute scheduler's
  // first tick — matching Plan 07-01/07-02's precedent of calling their
  // own ingestion function once in seed.ts.
  const eocCotsSyncResult = await runEocCotsSync();
  console.log(`EOC COTS sync: ${eocCotsSyncResult.synced} record(s) synced, ${eocCotsSyncResult.conflicts} conflict(s) detected.`);

  // Phase 8 (08-02, F17): run the facility sync job once here so
  // `facilities` and integration_health's 'Facility/Asset Feed' row are
  // populated immediately after `npm run seed`, matching the identical
  // precedent above for EOC COTS/hazard-feed ingestion. No explicit
  // document-adapter seed call is needed — document-adapter.ts's lazy
  // per-user access-set seeding means the first browse/import/link call
  // for any user populates its own state; this is deliberate and matches
  // the stub's documented lazy-seed design.
  await runFacilitySync();
  console.log('Facility sync: populated facilities + Facility/Asset Feed integration_health row.');

  // Plan 09-02 (F16-roster): run the HRIS roster sync job once here so
  // `personnel_roster` (one matched row against the real seeded
  // commander@epmp.local user, one unmatched reference-only row) and
  // integration_health's 'HRIS' row are populated immediately after
  // `npm run seed`, matching the identical precedent above for EOC
  // COTS/facility/hazard-feed ingestion.
  const hrisRosterSyncResult = await runHrisRosterSync();
  console.log(
    `HRIS roster sync: ${hrisRosterSyncResult.synced} record(s) synced, ${hrisRosterSyncResult.matched} matched, ${hrisRosterSyncResult.unmatched} unmatched.`,
  );

  console.log(
    'Seed summary: ' +
      Object.entries(summary)
        .map(([table, s]) => `${table}=${s.inserted} inserted/${s.existing} already-present`)
        .join(', '),
  );

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
