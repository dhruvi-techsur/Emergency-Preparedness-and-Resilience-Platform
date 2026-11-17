import { pool } from '../src/db/client.js';

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
  // secops_admin deliberately gets NO explicit 'incidents' row here: it
  // already has blanket admin/platform access from the grants above, and
  // that access is scoped to the admin console (user/role/SSO/audit
  // management), not incident-command operations — omitting it is
  // intentional, not an oversight.
  const incidentsFullAccessRoles = ['incident_commander', 'eoc_director'] as const;
  const incidentsViewOnlyRoles = ['planning_logistics_chief', 'field_responder'] as const;

  for (const roleName of incidentsFullAccessRoles) {
    const result = await findOrInsert(
      'role_permissions',
      ['role_id', 'feature'],
      [roleIds[roleName], 'incidents'],
      ['role_id', 'feature', 'actions'],
      [roleIds[roleName], 'incidents', ['view', 'create', 'edit']],
    );
    record('role_permissions', result);
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

  const tasksViewOnlyPerm = await findOrInsert(
    'role_permissions',
    ['role_id', 'feature'],
    [roleIds['field_responder'], 'tasks'],
    ['role_id', 'feature', 'actions'],
    [roleIds['field_responder'], 'tasks', ['view']],
  );
  record('role_permissions', tasksViewOnlyPerm);

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

  for (const inc of incidentsToSeed) {
    const incidentResult = await findOrInsert(
      'incidents',
      ['name', 'jurisdiction_id'],
      [inc.name, jurisdiction.id],
      ['name', 'type', 'severity', 'jurisdiction_id', 'opened_at', 'created_by'],
      [inc.name, inc.type, inc.severity, jurisdiction.id, new Date().toISOString(), commanderUser.id],
    );
    record('incidents', incidentResult);

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

  // record_authority_registry baseline rows (natural key: record_type, which IS unique)
  const authorityRows = [
    { record_type: 'user_identity', authoritative_system: 'EPMP' },
    { record_type: 'personnel_roster', authoritative_system: 'HRIS' },
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
