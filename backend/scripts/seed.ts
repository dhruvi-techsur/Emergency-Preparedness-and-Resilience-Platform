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

  // No explicit call to syncRolePermissionsToOpa here: unlike this plan's
  // earlier concern, OPA's data document is re-synced fresh from
  // role_permissions at every server.ts startup (see server.ts's `start()`),
  // so `npm run migrate && npm run seed` followed by a normal app boot is
  // sufficient — the newly-seeded rows reach OPA on the next server start
  // with no separate sync step needed from this script.

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
  const ssoConfig = await findOrInsert(
    'sso_config',
    ['protocol'],
    ['OIDC'],
    ['protocol', 'idp_metadata_url', 'attribute_mapping', 'group_to_role_mapping', 'active', 'tested_at'],
    [
      'OIDC',
      'http://keycloak:8080/realms/epmp/.well-known/openid-configuration',
      JSON.stringify({ email_attr: 'email', name_attr: 'name', group_attr: 'groups' }),
      JSON.stringify([{ idp_group: '/epmp-admins', role_id: secopsAdminId }]),
      true,
      new Date().toISOString(),
    ],
  );
  record('sso_config', ssoConfig);

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
