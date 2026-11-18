/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02c-data-plans-comms-reporting.md's
// "AI Assistance (F9)" section (ai_drafts ONLY — not signals/
// signal_source_events, which are Phase 6/F9-signal-triage scope, out of
// this plan) and "Notifications (F5)" section (all five tables).
//
// Scope-deviation note (documented inline per this plan's own instruction):
// TechArch's ai_drafts migration-ordering note says it should ship as a
// "phase-0 table with no outbound FKs" shared by ics_forms (F1, not built —
// Phase 2 deliberately deferred ICS forms, see 02-01's scope boundary),
// notifications (this plan), and sitreps/aars (04-02, this same phase).
// Since ics_forms doesn't exist yet in this codebase, ai_drafts has exactly
// two real referencing tables right now (notifications here, sitreps/aars
// in 04-02) — a future Phase-6 ICS-forms plan should find ai_drafts already
// exists and only needs an ai_draft_id FK column added to its own new
// table, not a fresh ai_drafts migration.
const UP_SQL = `
CREATE TABLE ai_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_feature VARCHAR(50) NOT NULL CHECK (target_feature IN ('ics_form','notification','sitrep','aar')),
  target_field VARCHAR(100) NOT NULL,
  draft_text TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]',
  confidence_label VARCHAR(10) NOT NULL CHECK (confidence_label IN ('High','Medium','Low')),
  requesting_user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(20) CHECK (action IN ('approve','edit','discard')),
  edited_text TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_approve_requires_named_user CHECK (action != 'approve' OR approved_by IS NOT NULL),
  CONSTRAINT chk_sources_or_flagged CHECK (jsonb_array_length(sources) > 0 OR draft_text ILIKE '%no source%' OR draft_text ILIKE '%low confidence%')
);

CREATE TABLE recipient_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Role','Jurisdiction','Geography')),
  selector JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  body TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  message_body TEXT NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  channels TEXT[] NOT NULL,
  recipient_group_ids UUID[] NOT NULL DEFAULT '{}',
  geotarget_polygon GEOGRAPHY(POLYGON, 4326),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_send_requires_approval CHECK (NOT (sent_at IS NOT NULL AND approved_by IS NULL)),
  CONSTRAINT chk_ai_origin_requires_approval CHECK (NOT (ai_origin AND sent_at IS NOT NULL AND approved_by IS NULL)),
  CONSTRAINT chk_audience_present CHECK (array_length(recipient_group_ids, 1) > 0 OR geotarget_polygon IS NOT NULL)
);

CREATE TABLE notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  recipient_name VARCHAR(200),
  recipient_contact VARCHAR(300),
  channel VARCHAR(50) NOT NULL
);

CREATE TABLE notification_delivery_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_recipient_id UUID NOT NULL REFERENCES notification_recipients(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Queued'
    CHECK (status IN ('Queued','Sent','Delivered','Failed','Acknowledged')),
  failure_reason TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_incident ON notifications(incident_id);
CREATE INDEX idx_notifications_geotarget ON notifications USING GIST(geotarget_polygon);
CREATE INDEX idx_notification_recipients_notif ON notification_recipients(notification_id);
CREATE INDEX idx_notification_delivery_status_notif ON notification_delivery_status(notification_recipient_id, status);
CREATE INDEX idx_ai_drafts_unresolved ON ai_drafts(requesting_user_id) WHERE action IS NULL;
CREATE INDEX idx_ai_drafts_target ON ai_drafts(target_feature, target_field);
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS notification_delivery_status;
DROP TABLE IF EXISTS notification_recipients;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS message_templates;
DROP TABLE IF EXISTS recipient_groups;
DROP TABLE IF EXISTS ai_drafts;
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
