## Database Schema — Incident Operations (Y0b)

Covers tables owned by F1 (Incident/ICS), F4 (Tasks & Resource Requests), and F6 (Mobile Field Operations). All tables carry `id UUID PK DEFAULT gen_random_uuid()`, `created_at`, `updated_at` unless noted; `incident_timeline` is append-only.

### Incident / ICS (F1)

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL, -- 'Flood','Wildfire','Severe Weather','HazMat','Public Health','Other'
  severity VARCHAR(20) NOT NULL, -- 'Critical'|'Elevated'|'Watch'|'Normal'
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  description TEXT,
  activation_level VARCHAR(20) NOT NULL DEFAULT 'Monitoring', -- 'Monitoring'|'Partial'|'Full'
  status VARCHAR(20) NOT NULL DEFAULT 'Open', -- 'Open'|'Closed'
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incident_command_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  role_title VARCHAR(100) NOT NULL, -- 'Incident Commander','Planning','Logistics','Operations','Finance/Admin','Public Information'
  person_id UUID NOT NULL REFERENCES users(id), -- or personnel_roster.id via mapping
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  unassigned_at TIMESTAMPTZ
);

-- Append-only: no UPDATE/DELETE at application layer; corrections are new rows.
CREATE TABLE incident_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title VARCHAR(300) NOT NULL,
  meta TEXT, -- actor + source description
  tone VARCHAR(20) NOT NULL DEFAULT 'brand', -- 'brand'|'success'|'warning'|'danger'
  actor_id UUID REFERENCES users(id),
  source VARCHAR(100) NOT NULL, -- 'manual','ai_draft','eoc_cots_sync','field_report', etc.
  detail JSONB
);

CREATE TABLE ics_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  form_type VARCHAR(50) NOT NULL, -- 'ICS-201','ICS-202', etc.
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Approved'
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_ai_requires_approval CHECK (NOT (ai_origin AND status = 'Approved' AND approved_by IS NULL))
);
```

### Tasks & Resources (F4)

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Open', -- 'Open'|'In progress'|'Awaiting approval'|'Done'|'Overdue'
  owner_id UUID NOT NULL REFERENCES users(id),
  incident_id UUID REFERENCES incidents(id),
  plan_section_id UUID, -- FK to plan_sections (Y0c), nullable
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
  changed_by UUID REFERENCES users(id), -- null for system-driven Overdue transition
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL, -- 'Personnel'|'Equipment'|'Supplies'
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Awaiting approval'|'Approved'|'Fulfilled'|'Declined'
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
  client_report_id VARCHAR(100) NOT NULL UNIQUE, -- client-generated for idempotent sync
  incident_id UUID REFERENCES incidents(id),
  observation_type VARCHAR(100) NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326),
  location_accuracy_m NUMERIC,
  submitted_by UUID NOT NULL REFERENCES users(id),
  captured_at TIMESTAMPTZ NOT NULL, -- client-side capture time, preserved
  synced_at TIMESTAMPTZ,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'synced', -- 'synced'|'conflict'|'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE field_report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_report_id UUID NOT NULL REFERENCES field_reports(id),
  storage_ref TEXT, -- object storage key once uploaded
  upload_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending'|'uploaded'|'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'field_report','task_status', etc.
  entity_id UUID NOT NULL,
  field_version JSONB NOT NULL,
  eoc_version JSONB NOT NULL,
  resolution VARCHAR(20), -- 'keep_mine'|'keep_eoc', null until resolved
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes (representative)

```sql
CREATE INDEX idx_incidents_jurisdiction_status ON incidents(jurisdiction_id, status);
CREATE INDEX idx_incident_timeline_incident_time ON incident_timeline(incident_id, occurred_at DESC);
CREATE INDEX idx_tasks_owner_status ON tasks(owner_id, status);
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE status NOT IN ('Done');
CREATE INDEX idx_resource_requests_incident_status ON resource_requests(incident_id, status);
CREATE INDEX idx_field_reports_incident ON field_reports(incident_id);
CREATE INDEX idx_sync_conflicts_unresolved ON sync_conflicts(entity_type) WHERE resolution IS NULL;
```
