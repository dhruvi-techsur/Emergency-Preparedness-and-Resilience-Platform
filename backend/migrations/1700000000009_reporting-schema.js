/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02c-data-plans-comms-reporting.md's
// "Reporting & Learning (F7)" section (sitreps, aars, aar_findings).
//
// Filename-numbering deviation (documented inline, same precedent as
// 04-01's own migration): the plan's literal filename
// `1700000000008_reporting-schema.js` collides with 04-01's
// already-committed `1700000000008_notifications-schema.js` — node-pg-migrate
// requires unique, monotonically-ordered migration numbers. Renumbered to
// the next free slot, `1700000000009`. No other file references the old
// number.
//
// aars.incident_id carries a UNIQUE constraint — TechArch's literal DDL
// permits exactly ONE AAR per incident (not one per closure event). The API
// (reporting.ts, Task 2) therefore handles "AAR already exists for this
// incident" as an upsert-in-place against the existing Draft row via
// `ON CONFLICT (incident_id) DO UPDATE ... WHERE aars.status != 'Finalized'`
// rather than always INSERTing a fresh row.
const UP_SQL = `
CREATE TABLE sitreps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Approved')),
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_sitrep_ai_approval CHECK (NOT (ai_origin AND status = 'Approved' AND approved_by IS NULL))
);

CREATE TABLE aars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) UNIQUE,
  timeline_export JSONB NOT NULL,
  decisions_log JSONB NOT NULL,
  resource_history JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Finalized')),
  finalized_by UUID REFERENCES users(id),
  finalized_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_finalized_requires_signoff CHECK (status != 'Finalized' OR (finalized_by IS NOT NULL AND finalized_at IS NOT NULL))
);

CREATE TABLE aar_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aar_id UUID NOT NULL REFERENCES aars(id),
  finding_text TEXT NOT NULL,
  category VARCHAR(100),
  corrective_action TEXT,
  owner_id UUID REFERENCES users(id),
  due_date DATE,
  closure_status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (closure_status IN ('Open','Closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_corrective_action_owned CHECK (corrective_action IS NULL OR (owner_id IS NOT NULL AND due_date IS NOT NULL))
);

CREATE INDEX idx_sitreps_incident ON sitreps(incident_id);
CREATE INDEX idx_aar_findings_owner_open ON aar_findings(owner_id) WHERE closure_status = 'Open';
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS aar_findings;
DROP TABLE IF EXISTS aars;
DROP TABLE IF EXISTS sitreps;
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
