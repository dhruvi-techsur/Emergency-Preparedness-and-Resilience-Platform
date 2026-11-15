## 3c. Data Model — Plans, Notifications, Reporting & AI

Owning features: F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage), F14 (Notification Provider Integration). Forward reference resolved: `signal_source_events.hazard_feed_event_id → hazard_feed_events` (defined in `02d-data-integration-geo.md`); `notifications.ai_draft_id` and `ics_forms.ai_draft_id` reference `ai_drafts` defined below (load this file before `02b` in migration order, or defer the FK as `ALTER TABLE ... ADD CONSTRAINT` after both exist).

### Plans & Playbooks (F3)

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL CHECK (char_length(name) BETWEEN 3 AND 200),
  type VARCHAR(20) NOT NULL CHECK (type IN ('EOP','SOP','Annex')),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Review','Approved')),
  current_version INTEGER NOT NULL DEFAULT 1,
  source_document_ref TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE TABLE plan_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  submitted_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  review_action VARCHAR(20) CHECK (review_action IN ('approve','request_changes')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (plan_id, version_number),
  CONSTRAINT chk_no_self_approval CHECK (reviewed_by IS NULL OR submitted_by IS NULL OR reviewed_by != submitted_by)
);

CREATE TABLE plan_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  heading VARCHAR(300) NOT NULL,
  body TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plan_task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_section_id UUID NOT NULL REFERENCES plan_sections(id),
  default_title VARCHAR(200) NOT NULL,
  default_owner_role VARCHAR(100),
  default_due_offset_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id),
  external_document_id VARCHAR(300) NOT NULL,
  source_system VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('import_copy','link_live')),
  imported_by UUID NOT NULL REFERENCES users(id),
  last_permission_check_at TIMESTAMPTZ,
  permission_status VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (permission_status IN ('valid','revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### AI Assistance (F9) — defined before Notifications/ICS forms reference it

```sql
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
```

### Notifications (F5)

```sql
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
```

### Notification Provider Integration (F14)

```sql
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
```

### Reporting & Learning (F7)

```sql
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
```

### Indexes

```sql
CREATE INDEX idx_plans_jurisdiction_status ON plans(jurisdiction_id, status);
CREATE INDEX idx_plan_versions_plan ON plan_versions(plan_id, version_number DESC);
CREATE INDEX idx_plan_sections_plan ON plan_sections(plan_id, sort_order);
CREATE INDEX idx_plan_task_templates_section ON plan_task_templates(plan_section_id);
CREATE INDEX idx_document_links_plan ON document_links(plan_id);
CREATE INDEX idx_notifications_incident ON notifications(incident_id);
CREATE INDEX idx_notifications_geotarget ON notifications USING GIST(geotarget_polygon);
CREATE INDEX idx_notification_recipients_notif ON notification_recipients(notification_id);
CREATE INDEX idx_notification_delivery_status_notif ON notification_delivery_status(notification_recipient_id, status);
CREATE INDEX idx_notification_dispatch_log_notif ON notification_dispatch_log(notification_id);
CREATE INDEX idx_cap_alert_records_notif ON cap_alert_records(notification_id);
CREATE INDEX idx_sitreps_incident ON sitreps(incident_id);
CREATE INDEX idx_aar_findings_owner_open ON aar_findings(owner_id) WHERE closure_status = 'Open';
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signal_source_events_signal ON signal_source_events(signal_id);
CREATE INDEX idx_signal_source_events_hazard ON signal_source_events(hazard_feed_event_id);
CREATE INDEX idx_ai_drafts_unresolved ON ai_drafts(requesting_user_id) WHERE action IS NULL;
CREATE INDEX idx_ai_drafts_target ON ai_drafts(target_feature, target_field);
```

### Migration Ordering Note

Because `ai_drafts` is referenced by `ics_forms` (domain file `02b`), `notifications` (this file), and `sitreps` (this file), the migration sequence loads domain files in this order: `02a` (no cross-domain FKs) → `02c` AI Assistance section (`ai_drafts`, `signals`) → `02b` (incidents, which references `ai_drafts` via `ics_forms`) → `02c` remainder (plans, notifications, reporting) → `02d` (integration/geo, referenced by `02c`'s `signal_source_events.hazard_feed_event_id`). In practice, the reference implementation ships `ai_drafts` and `hazard_feed_events` as "phase 0" tables with no outbound FKs, added first, then all dependents follow — avoiding circular-dependency migration ordering issues entirely.
