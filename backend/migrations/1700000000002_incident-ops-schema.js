/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

const UP_SQL = `
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL
    CHECK (type IN ('Flood','Wildfire','Severe Weather','HazMat','Public Health','Other')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical','Elevated','Watch','Normal')),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  description TEXT CHECK (char_length(description) <= 2000),
  activation_level VARCHAR(20) NOT NULL DEFAULT 'Monitoring'
    CHECK (activation_level IN ('Monitoring','Partial','Full')),
  status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Closed')),
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  -- DEVIATION FROM TechArch 02b (documented): TechArch's incidents DDL has no
  -- geolocation column, yet F2/FRD explicitly requires rendering incidents as
  -- diamond-shaped map markers (US-2.1, S2.1) and the API's MapMarker interface
  -- (03b-api-incident-ops.md) requires a location:{lat,lng}. Added nullable so
  -- S1.2's literal create-form field list (which has no location input) is not
  -- broken -- incidents created without a location are fully functional (list,
  -- workspace, timeline, command roles, activation) but are simply omitted from
  -- the operating-picture markers array until a location is set. This is NOT
  -- a GIS feed failure; it is incomplete optional data, handled gracefully.
  location GEOGRAPHY(POINT, 4326),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_name_length CHECK (char_length(name) BETWEEN 3 AND 200)
);
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE TABLE incident_command_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  role_title VARCHAR(100) NOT NULL
    CHECK (role_title IN ('Incident Commander','Planning','Logistics','Operations','Finance/Admin','Public Information')),
  person_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  unassigned_at TIMESTAMPTZ
);

CREATE TABLE incident_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title VARCHAR(300) NOT NULL,
  meta TEXT,
  tone VARCHAR(20) NOT NULL DEFAULT 'brand' CHECK (tone IN ('brand','success','warning','danger')),
  actor_id UUID REFERENCES users(id),
  source VARCHAR(100) NOT NULL,
  detail JSONB
);

-- Same documented deviation 01-01 used for audit_log: DEPLOY-01's single-
-- DATABASE_URL deployment gives the app exactly one DB role, which must also
-- run migrations, so a separate low-privilege "app_runtime" role (TechArch's
-- literal "REVOKE UPDATE, DELETE ON incident_timeline FROM app_runtime") is not
-- available. A BEFORE UPDATE/DELETE trigger gives the identical "enforced at
-- the data layer regardless of caller" guarantee.
CREATE OR REPLACE FUNCTION reject_incident_timeline_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'incident_timeline is append-only: % not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_incident_timeline_immutable
  BEFORE UPDATE OR DELETE ON incident_timeline
  FOR EACH ROW EXECUTE FUNCTION reject_incident_timeline_mutation();

CREATE INDEX idx_incidents_jurisdiction_status ON incidents(jurisdiction_id, status);
CREATE INDEX idx_incidents_severity ON incidents(severity) WHERE status = 'Open';
CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
CREATE INDEX idx_incident_command_roles_incident ON incident_command_roles(incident_id) WHERE unassigned_at IS NULL;
CREATE INDEX idx_incident_timeline_incident_time ON incident_timeline(incident_id, occurred_at DESC);
`;

const DOWN_SQL = `
DROP TRIGGER IF EXISTS trg_incident_timeline_immutable ON incident_timeline;
DROP FUNCTION IF EXISTS reject_incident_timeline_mutation();
DROP TABLE IF EXISTS incident_timeline;
DROP TABLE IF EXISTS incident_command_roles;
DROP TABLE IF EXISTS incidents;
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
