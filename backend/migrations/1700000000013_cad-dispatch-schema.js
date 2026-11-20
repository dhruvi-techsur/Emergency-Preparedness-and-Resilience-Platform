/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02d-data-integration-geo.md's
// "CAD / 911 Integration" section. No filename renumbering needed: `ls
// backend/migrations` confirms 1700000000013 is free at the time this plan
// executes — the highest existing migration is Plan 07-01's own
// 1700000000012_hazard-layers-schema.js (Wave 1, parallel, independent
// feature). This migration necessarily runs AFTER that one on the numeric
// timestamp ordering node-pg-migrate uses, which is why the
// background_jobs_job_type_check ALTER below (not 07-01's own migration) is
// the one responsible for adding 'cad_ingestion' to the allowed list.
//
// No UPDATE path exists from any non-adapter code; CAD data is strictly
// read-only from EPMP's perspective (F15: "EPMP never edits dispatch
// data") — mirrors the TechArch spec's own inline comment on this table.
const UP_SQL = `
CREATE TABLE cad_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  incident_matching_strategy VARCHAR(20) NOT NULL DEFAULT 'human_confirmed'
    CHECK (incident_matching_strategy IN ('shared_number','human_confirmed')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cad_dispatch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES cad_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  cad_incident_number VARCHAR(100),
  linked_incident_id UUID REFERENCES incidents(id),
  status VARCHAR(100) NOT NULL,
  unit_ids TEXT[],
  location GEOGRAPHY(POINT, 4326),
  source VARCHAR(100) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (config_id, external_event_id)
);
-- No UPDATE path exists from any non-adapter code; CAD data is strictly
-- read-only from EPMP's perspective (F15: "EPMP never edits dispatch
-- data"). No PATCH/PUT/DELETE route exists anywhere in this codebase for
-- this table — see cad-adapter.ts/incidents.ts, and this plan's own
-- structural grep-based <verify> step.

CREATE INDEX idx_cad_dispatch_events_incident ON cad_dispatch_events(linked_incident_id);
CREATE INDEX idx_cad_dispatch_events_location ON cad_dispatch_events USING GIST(location);

-- background_jobs_job_type_check ALTER (job_type isolation): adds the
-- DISTINCT 'cad_ingestion' value this adapter's own scheduled ingestion job
-- uses, kept structurally separate from Plan 07-01's 'feed_ingestion' value
-- so the two independently-scheduled adapters never find-and-overwrite the
-- SAME background_jobs row via the shared 'WHERE job_type = \'...\' LIMIT 1'
-- idiom webhook-delivery-worker.ts established. Same precedent as
-- 1700000000006_background-jobs-extend-job-type.js's addition of
-- 'task_overdue_sweep'.
--
-- Constraint name confirmed against the real migrated database (per this
-- plan's own verification instruction) via:
--   SELECT conname FROM pg_constraint WHERE conrelid = 'background_jobs'::regclass AND contype = 'c';
-- Result: background_jobs_job_type_check — matches node-pg-migrate's default
-- naming for an inline CHECK on a CREATE TABLE column, same name
-- 1700000000006's own precedent confirmed, and consistent with every
-- subsequent extension of this same constraint (Phase 1 -> +task_overdue_sweep
-- (1700000000006) -> +cad_ingestion (this migration)).
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep','cad_ingestion'));
`;

const DOWN_SQL = `
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep'));

DROP TABLE IF EXISTS cad_dispatch_events;
DROP TABLE IF EXISTS cad_config;
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
