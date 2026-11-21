/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Renumbered from the plan's literal 1700000000012 to 1700000000017 — that
// slot was already claimed by Phase 7's 07-01 (hazard-layers-schema.js) by
// the time this plan executed, as were 1700000000013 (07-02 cad-dispatch),
// 1700000000014 (08-01 eoc-cots), 1700000000015 (08-02 facility-document),
// and 1700000000016 (08-06 document-links-extend-flagged-state). Same
// cross-plan migration-numbering collision every prior phase has hit and
// resolved identically — renumber to the next free slot, no DDL content
// change. Full current list re-confirmed via `ls backend/migrations` at
// execution time.
//
// Exact DDL from project_specs/TechArch/02c-data-plans-comms-reporting.md
// §"Notification Provider Integration (F14)". `notifications`/
// `notification_recipients`/`notification_delivery_status` already exist
// from Phase 4's 1700000000008_notifications-schema.js — NOT re-created
// here.
const UP_SQL = `
CREATE TABLE notification_provider_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name VARCHAR(100) NOT NULL,
  channel_types TEXT[] NOT NULL,
  is_public_warning_channel BOOLEAN NOT NULL DEFAULT false,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_dispatch_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  provider_name VARCHAR(100) NOT NULL,
  external_message_id VARCHAR(300),
  dispatch_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  dispatched_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cap_alert_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  cap_identifier VARCHAR(300) NOT NULL,
  sender VARCHAR(300) NOT NULL,
  cap_xml TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notification_dispatch_log_notif ON notification_dispatch_log(notification_id);
CREATE INDEX idx_cap_alert_records_notif ON cap_alert_records(notification_id);

-- background_jobs_job_type_check: this plan's own scheduled retry-sweep job
-- (runNotificationRetrySweep) is scoped EXCLUSIVELY to the EXISTING
-- 'notification_fanout' value — confirmed via grepping backend/src for
-- that literal string, which returned NOTHING before this task claimed
-- it. That value has existed, UNUSED, in the Phase 1 original CHECK
-- constraint list since 1700000000000_auth-org-schema.js — no ALTER
-- needed here, unlike every prior adapter plan (task_overdue_sweep,
-- cad_ingestion, facility_sync, document_link_sync), each of which needed
-- a brand-new value added. This migration therefore makes NO
-- background_jobs ALTER at all.
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS cap_alert_records;
DROP TABLE IF EXISTS notification_dispatch_log;
DROP TABLE IF EXISTS notification_provider_config;
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
