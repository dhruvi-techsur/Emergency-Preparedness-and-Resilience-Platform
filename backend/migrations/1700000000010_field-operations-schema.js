/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// [Rule 3 - Blocking] This file is numbered 1700000000010, not the plan's
// literal 1700000000009 -- that number is already claimed by Phase 4's
// 1700000000009_reporting-schema.js. Same renumbering precedent as
// 04-01 (1700000000008) and 04-02 (1700000000009 at the time), each
// documented inline and in STATE.md -- preserves node-pg-migrate's
// numeric-ordering contract with zero behavioral difference from the
// plan's intent. This migration is additive-only: it does not touch
// incidents/incident_timeline/tasks/users, all of which already exist.
//
// No RLS/append-only trigger is added here, unlike incident_timeline --
// field_reports.sync_status and sync_conflicts.resolution are mutable by
// design, updated in place by the sync-batch and resolve routes.
const UP_SQL = `
CREATE TABLE field_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_report_id VARCHAR(100) NOT NULL UNIQUE,
  incident_id UUID REFERENCES incidents(id),
  observation_type VARCHAR(100) NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326),
  location_accuracy_m NUMERIC,
  submitted_by UUID NOT NULL REFERENCES users(id),
  captured_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced','conflict','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_report_not_empty CHECK (description IS NOT NULL OR location IS NOT NULL)
);

CREATE TABLE field_report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_report_id UUID NOT NULL REFERENCES field_reports(id),
  storage_ref TEXT,
  upload_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending','uploaded','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  field_version JSONB NOT NULL,
  eoc_version JSONB NOT NULL,
  resolution VARCHAR(20) CHECK (resolution IN ('keep_mine','keep_eoc')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_field_reports_incident ON field_reports(incident_id);
CREATE INDEX idx_field_reports_location ON field_reports USING GIST(location);
CREATE INDEX idx_field_reports_submitted_by ON field_reports(submitted_by);
CREATE INDEX idx_field_report_photos_report ON field_report_photos(field_report_id);
CREATE INDEX idx_sync_conflicts_unresolved ON sync_conflicts(entity_type) WHERE resolution IS NULL;
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS sync_conflicts;
DROP TABLE IF EXISTS field_report_photos;
DROP TABLE IF EXISTS field_reports;
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
