/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02b-data-incident-ops.md's
// "Incident/ICS" section (ics_forms ONLY), 02c-data-plans-comms-reporting.md's
// "AI Assistance (F9)" section (signals/signal_source_events ONLY — this
// plan's own ai_drafts block is intentionally omitted, see the collision
// note below), and 02d-data-integration-geo.md's "Hazard Feeds" section
// (hazard_feed_config/hazard_feed_events).
//
// Filename-numbering deviation ([Rule 3 - Blocking], same precedent 04-01/
// 04-02/05-01 each established): the plan's literal filename
// `1700000000010_persona-ai-signal-schema.js` collides with Phase 5's
// already-committed `1700000000010_field-operations-schema.js` (that
// filename did not exist when this PLAN.md was authored — 1700000000010 was
// free at the time, but 05-01 has since landed and claimed it). Renumbered
// to the next free slot, `1700000000011`. No other file references the old
// number.
//
// `ics_forms` belongs to F1's domain per TechArch 02b, but Phase 2
// (02-01-SUMMARY.md) deliberately deferred it — "ICS forms and SITREPs ship
// in a later phase (F7/F9)". Phase 6 builds it now because F9's AIDraft
// governance demonstration (success criteria 3/4) needs a real
// official-record target with an ai_origin/approved_by pair to enforce
// against; signals/hazard_feed_* are F9's own tables per TechArch 02c/02d.
//
// **Named cross-phase collision — already resolved, not hypothetical.**
// This plan's own PLAN.md (Task 1) anticipated that Phase 4's
// `04-01-PLAN.md` might define its OWN `CREATE TABLE ai_drafts` plus its OWN
// `assertAiOriginApproved`/`AiOriginNotApprovedError`, and documented that
// whichever phase executes SECOND against a live database MUST detect the
// already-existing table/guard and reuse rather than redefine. Phase 4 HAS
// in fact already executed (confirmed:
// backend/migrations/1700000000008_notifications-schema.js already contains
// `CREATE TABLE ai_drafts` byte-identical to this plan's own spec, and
// backend/src/modules/comms-reporting/notifications.ts already exports
// `assertAiOriginApproved`/`AiOriginNotApprovedError`). This migration
// therefore does NOT re-create ai_drafts — ics_forms below references the
// EXISTING ai_drafts(id) via its ai_draft_id FK, and
// backend/src/modules/ai-assist/governance.ts (this plan's Task 2) imports
// and re-exports the EXISTING guard from comms-reporting/notifications.ts
// rather than redefining it, per TechArch 01-components.md §2.4's "shared
// middleware, not duplicated logic" rule — the exact two-phase situation
// this plan's own PLAN.md predicted.
//
// Dependency order: hazard_feed_config -> hazard_feed_events -> ics_forms
// (references the pre-existing ai_drafts, plus incidents/users) -> signals
// -> signal_source_events (references hazard_feed_events).
const UP_SQL = `
CREATE TABLE hazard_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name VARCHAR(50) NOT NULL CHECK (feed_name IN ('NOAA','NWS','USGS')),
  endpoint_url TEXT NOT NULL,
  poll_interval_seconds INTEGER NOT NULL DEFAULT 300,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hazard_feed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES hazard_feed_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  geometry GEOGRAPHY NOT NULL,
  confidence VARCHAR(10) NOT NULL CHECK (confidence IN ('High','Medium','Low')),
  source VARCHAR(100) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feed_id, external_event_id)
);

CREATE TABLE ics_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  form_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Approved')),
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_ai_requires_approval CHECK (NOT (ai_origin AND status = 'Approved' AND approved_by IS NULL)),
  CONSTRAINT chk_approved_requires_reviewer CHECK (status != 'Approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT NOT NULL,
  confidence_label VARCHAR(10) NOT NULL CHECK (confidence_label IN ('High','Medium','Low')),
  confidence_reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'New' CHECK (status IN ('New','Dismissed','Promoted')),
  dismissed_reason TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_dismissed_requires_reason CHECK (status != 'Dismissed' OR dismissed_reason IS NOT NULL)
);

CREATE TABLE signal_source_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES signals(id),
  hazard_feed_event_id UUID REFERENCES hazard_feed_events(id),
  source VARCHAR(100) NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_hazard_feed_events_feed_time ON hazard_feed_events(feed_id, issued_at DESC);
CREATE INDEX idx_hazard_feed_events_geometry ON hazard_feed_events USING GIST(geometry);
CREATE INDEX idx_hazard_feed_events_expires ON hazard_feed_events(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_ics_forms_incident ON ics_forms(incident_id, status);
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signal_source_events_signal ON signal_source_events(signal_id);
CREATE INDEX idx_signal_source_events_hazard ON signal_source_events(hazard_feed_event_id);
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS signal_source_events;
DROP TABLE IF EXISTS signals;
DROP TABLE IF EXISTS ics_forms;
DROP TABLE IF EXISTS hazard_feed_events;
DROP TABLE IF EXISTS hazard_feed_config;
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
