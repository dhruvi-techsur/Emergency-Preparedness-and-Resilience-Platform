/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Renumbered from the plan's literal 1700000000014 to 1700000000016 — that
// slot was already claimed by this phase's own 08-01 (eoc-cots-schema.js)
// by the time this plan executed, and 1700000000015 by 08-02
// (facility-document-schema.js). Same cross-plan migration-numbering
// collision every prior phase has hit and resolved identically — renumber
// to the next free slot, no DDL content change.
//
// ALTER extending Phase 3's EXISTING document_links table
// (1700000000007_plans-schema.js) — NOT re-created here. TechArch's
// literal document_links DDL (02c) has no flagged-state column, since
// F17's "flag, not auto-apply" live-link-change requirement is a
// Phase 8-only capability — same "deviation documented, additive ALTER"
// precedent as 02-01's incidents.location addition and 1700000000006's
// background_jobs CHECK extension.
const UP_SQL = `
ALTER TABLE document_links ADD COLUMN content_status VARCHAR(20) NOT NULL DEFAULT 'current'
  CHECK (content_status IN ('current', 'changed'));
ALTER TABLE document_links ADD COLUMN content_flagged_at TIMESTAMPTZ;
ALTER TABLE document_links ADD COLUMN acknowledged_by UUID REFERENCES users(id);
ALTER TABLE document_links ADD COLUMN acknowledged_at TIMESTAMPTZ;

-- background_jobs_job_type_check ALTER (job_type isolation): adds the
-- DISTINCT 'document_link_sync' value this plan's own scheduled sync job
-- uses, kept structurally separate from every other adapter's own job_type
-- so independently-scheduled adapters never find-and-overwrite the SAME
-- background_jobs row via the shared 'WHERE job_type = \'...\' LIMIT 1'
-- idiom webhook-delivery-worker.ts established. Same precedent as
-- 1700000000006's addition of 'task_overdue_sweep',
-- 1700000000013's addition of 'cad_ingestion',
-- 1700000000015's addition of 'facility_sync'.
--
-- Constraint name confirmed against the real migrated database (per this
-- plan's own verification instruction) via:
--   SELECT conname FROM pg_constraint WHERE conrelid = 'background_jobs'::regclass AND contype = 'c';
-- Result: background_jobs_job_type_check. Full current list re-verified at
-- execution time (Phase 1 base list + 'task_overdue_sweep' (1700000000006)
-- + 'cad_ingestion' (1700000000013) + 'facility_sync' (1700000000015)) —
-- this ALTER restates that FULL list plus this migration's own new
-- 'document_link_sync' value. Plan 08-01's 'sync_reconciliation' value
-- already existed in the Phase-1 base list (no ALTER needed for it).
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep','cad_ingestion','facility_sync','document_link_sync'));
`;

const DOWN_SQL = `
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep','cad_ingestion','facility_sync'));

ALTER TABLE document_links DROP COLUMN acknowledged_at;
ALTER TABLE document_links DROP COLUMN acknowledged_by;
ALTER TABLE document_links DROP COLUMN content_flagged_at;
ALTER TABLE document_links DROP COLUMN content_status;
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
