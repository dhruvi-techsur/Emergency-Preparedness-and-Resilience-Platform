/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Phase 1's background_jobs.job_type CHECK list did not anticipate Phase 3's
// task-overdue sweep. Rather than reusing an existing value semantically
// (none fit: 'sync_reconciliation' means field-mobile reconciliation,
// 'report_generation' means SITREP/AAR assembly — neither is this), extend
// the allowed list with the real value this sweep needs.
//
// Constraint name confirmed against the real migrated database (per this
// plan's own verification instruction) via:
//   SELECT conname FROM pg_constraint WHERE conrelid = 'background_jobs'::regclass AND contype = 'c';
// Result: background_jobs_job_type_check — matches node-pg-migrate's default
// naming for an inline CHECK on a CREATE TABLE column, confirming the
// assumption rather than guessing silently.
const UP_SQL = `
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage','task_overdue_sweep'));
`;

const DOWN_SQL = `
ALTER TABLE background_jobs DROP CONSTRAINT background_jobs_job_type_check;
ALTER TABLE background_jobs ADD CONSTRAINT background_jobs_job_type_check
  CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage'));
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
