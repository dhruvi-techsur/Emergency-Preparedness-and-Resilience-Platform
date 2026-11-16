/* eslint-disable @typescript-eslint/no-unused-vars */

// This migration ships structural reference data (the 5 persona roles plus
// a baseline secops_admin role_permissions grant) safe for ANY environment
// including production, solving the bootstrap problem where SSO
// group-to-role mapping has nothing to map to on a fresh deploy. It
// deliberately does NOT seed `backend/scripts/seed.ts`'s dev-fixture admin
// user/sso_config — those point at the LOCAL docker-compose Keycloak and
// are dev/preview-only; a real deployment's admin configures SSO via the
// Admin Console (S8.4) against its own agency IdP after first boot. This
// migration runs as part of the SAME idempotent migrate step every
// environment (dev compose AND production deploy) executes — it's a
// schema-adjacent data migration, not the separate `scripts/seed.ts` dev
// fixture.

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

const UP_SQL = `
INSERT INTO roles (name, persona_id, description) VALUES
  ('eoc_director', 'PER-01', 'EOC Director'),
  ('incident_commander', 'PER-02', 'Incident Commander'),
  ('planning_logistics_chief', 'PER-03', 'Planning/Logistics Chief'),
  ('field_responder', 'PER-04', 'Field Responder'),
  ('secops_admin', 'PER-05', 'Security & Operations Admin')
ON CONFLICT (name) DO NOTHING;

INSERT INTO role_permissions (role_id, feature, actions)
SELECT id, 'admin', ARRAY['view', 'create', 'edit', 'approve']
FROM roles WHERE name = 'secops_admin'
ON CONFLICT (role_id, feature) DO NOTHING;

INSERT INTO role_permissions (role_id, feature, actions)
SELECT id, 'platform', ARRAY['view', 'edit']
FROM roles WHERE name = 'secops_admin'
ON CONFLICT (role_id, feature) DO NOTHING;
`;

const DOWN_SQL = `
DELETE FROM role_permissions WHERE role_id IN (SELECT id FROM roles WHERE persona_id IN ('PER-01','PER-02','PER-03','PER-04','PER-05'));
DELETE FROM roles WHERE persona_id IN ('PER-01','PER-02','PER-03','PER-04','PER-05');
`;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.sql(UP_SQL);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.sql(DOWN_SQL);
};
