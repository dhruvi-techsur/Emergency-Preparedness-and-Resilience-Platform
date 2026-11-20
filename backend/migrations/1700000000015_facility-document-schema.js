/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02d-data-integration-geo.md's
// "Asset, Facility & Document Integration" section, scoped to ONLY
// facility_feed_config/facilities/document_system_config — `document_links`
// is explicitly OWNED by Phase 3's 1700000000007_plans-schema.js migration
// and is NOT re-created here.
//
// Renumbered from the plan's literal 1700000000013 to 1700000000015 — that
// slot was already claimed by Phase 7's own cad-dispatch-schema.js, and
// 1700000000014 by this same phase's 08-01 eoc-cots-schema.js, by the time
// this plan executed. Same cross-plan migration-numbering collision every
// prior phase (04-01/04-02/05-01/06-01/07-01/07-02/08-01) has hit and
// resolved identically — renumber to the next free slot, no DDL content
// change.
const UP_SQL = `
CREATE TABLE facility_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  erp_vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_facility_id VARCHAR(300) NOT NULL,
  name VARCHAR(200) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status VARCHAR(50) NOT NULL,
  source VARCHAR(100) NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (external_facility_id, source)
);
-- Note (F17 hard constraint): no inventory/maintenance/cost columns exist on
-- this table by design — those fields are discarded at the integration-
-- adapter boundary before persistence, never stored even transiently. See
-- facility-adapter.ts's fetchFacilityStatus() allow-list normalization.

CREATE TABLE document_system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_facilities_status ON facilities(status);

-- background_jobs_job_type_check ALTER (job_type isolation): adds the
-- DISTINCT 'facility_sync' value this adapter's own scheduled sync job
-- uses, kept structurally separate from every other adapter's own job_type
-- so independently-scheduled adapters never find-and-overwrite the SAME
-- background_jobs row via the shared 'WHERE job_type = \'...\' LIMIT 1'
-- idiom webhook-delivery-worker.ts established. Same precedent as
-- 1700000000006_background-jobs-extend-job-type.js's addition of
-- 'task_overdue_sweep', 1700000000013_cad-dispatch-schema.js's addition of
-- 'cad_ingestion'.
--
-- Constraint name confirmed against the real migrated database (per this
-- plan's own verification instruction) via:
--   SELECT conname FROM pg_constraint WHERE conrelid = 'background_jobs'::regclass AND contype = 'c';
-- Result: background_jobs_job_type_check. Full current list re-verified at
-- execution time (Phase 1 base list + 'task_overdue_sweep' (1700000000006)
-- + 'cad_ingestion' (1700000000013)) — this ALTER restates that FULL list
-- plus this migration's own new 'facility_sync' value. Plan 08-01's
-- 'sync_reconciliation' value already existed in the Phase-1 base list (no
-- ALTER needed for it); Plan 08-06's 'document_link_sync' addition (if it
-- runs after this migration) will itself re-verify and restate the list
-- including this migration's 'facility_sync' entry.
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep','cad_ingestion','facility_sync'));
`;

const DOWN_SQL = `
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep','cad_ingestion'));

DROP TABLE IF EXISTS document_system_config;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS facility_feed_config;
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
