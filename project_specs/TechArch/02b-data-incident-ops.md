## 3b. Data Model — Incident Operations

Owning features: F1 (Incident/ICS), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations). Forward reference: `tasks.plan_section_id` resolves to `plan_sections` defined in `02c-data-plans-comms-reporting.md`.

### Incident / ICS (F1)

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL
    CHECK (type IN ('Flood','Wildfire','Severe Weather','HazMat','Public Health','Other')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical','Elevated','Watch','Normal')),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  description TEXT CHECK (char_length(description) <= 2000),
  activation_level VARCHAR(20) NOT NULL DEFAULT 'Monitoring'
    CHECK (activation_level IN ('Monitoring','Partial','Full')),
  status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Closed')),
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_name_length CHECK (char_length(name) BETWEEN 3 AND 200)
);
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE TABLE incident_command_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  role_title VARCHAR(100) NOT NULL
    CHECK (role_title IN ('Incident Commander','Planning','Logistics','Operations','Finance/Admin','Public Information')),
  person_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  unassigned_at TIMESTAMPTZ
);

-- Append-only: REVOKE UPDATE/DELETE from app_runtime after creation.
CREATE TABLE incident_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title VARCHAR(300) NOT NULL,
  meta TEXT,
  tone VARCHAR(20) NOT NULL DEFAULT 'brand' CHECK (tone IN ('brand','success','warning','danger')),
  actor_id UUID REFERENCES users(id),
  source VARCHAR(100) NOT NULL,
  detail JSONB
);
REVOKE UPDATE, DELETE ON incident_timeline FROM app_runtime;

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
```

### Tasks & Resources (F4)

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Open'
    CHECK (status IN ('Open','In progress','Awaiting approval','Done','Overdue')),
  owner_id UUID NOT NULL REFERENCES users(id),
  incident_id UUID REFERENCES incidents(id),
  plan_section_id UUID REFERENCES plan_sections(id),
  due_at TIMESTAMPTZ NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE task_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('Personnel','Equipment','Supplies')),
  description TEXT NOT NULL CHECK (char_length(description) <= 1000),
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft'
    CHECK (status IN ('Draft','Awaiting approval','Approved','Fulfilled','Declined')),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  task_id UUID REFERENCES tasks(id),
  requesting_role VARCHAR(100) NOT NULL,
  needed_by TIMESTAMPTZ NOT NULL,
  requested_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  decline_reason TEXT,
  assigned_to VARCHAR(200),
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_decline_requires_reason CHECK (NOT (status = 'Declined' AND decline_reason IS NULL))
);

CREATE TABLE resource_request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_request_id UUID NOT NULL REFERENCES resource_requests(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Field Operations (F6)

```sql
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
```

### Indexes

```sql
CREATE INDEX idx_incidents_jurisdiction_status ON incidents(jurisdiction_id, status);
CREATE INDEX idx_incidents_severity ON incidents(severity) WHERE status = 'Open';
CREATE INDEX idx_incident_command_roles_incident ON incident_command_roles(incident_id) WHERE unassigned_at IS NULL;
CREATE INDEX idx_incident_timeline_incident_time ON incident_timeline(incident_id, occurred_at DESC);
CREATE INDEX idx_ics_forms_incident ON ics_forms(incident_id, status);
CREATE INDEX idx_tasks_owner_status ON tasks(owner_id, status);
CREATE INDEX idx_tasks_incident ON tasks(incident_id);
CREATE INDEX idx_tasks_plan_section ON tasks(plan_section_id);
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE status NOT IN ('Done');
CREATE INDEX idx_task_status_history_task ON task_status_history(task_id, changed_at DESC);
CREATE INDEX idx_resource_requests_incident_status ON resource_requests(incident_id, status);
CREATE INDEX idx_resource_requests_task ON resource_requests(task_id);
CREATE INDEX idx_field_reports_incident ON field_reports(incident_id);
CREATE INDEX idx_field_reports_location ON field_reports USING GIST(location);
CREATE INDEX idx_field_reports_submitted_by ON field_reports(submitted_by);
CREATE INDEX idx_field_report_photos_report ON field_report_photos(field_report_id);
CREATE INDEX idx_sync_conflicts_unresolved ON sync_conflicts(entity_type) WHERE resolution IS NULL;
```

### Transactional Invariant: Timeline Write Atomicity

Per FRD F1 Validation ("every state-changing action... must write exactly one Timeline entry with a non-null actor and source") and the `TIMELINE_WRITE_FAILED` error contract, every `incident-ops` module write path that mutates `incidents`, `incident_command_roles`, `tasks`, or `resource_requests` wraps the domain mutation and the corresponding `incident_timeline` INSERT in a **single database transaction**. If the timeline insert fails, the entire transaction rolls back and the API returns `500 TIMELINE_WRITE_FAILED` rather than leaving a state change unrecorded.
