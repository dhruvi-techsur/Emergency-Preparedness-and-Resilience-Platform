/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

const UP_SQL = `
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Open'
    CHECK (status IN ('Open','In progress','Awaiting approval','Done','Overdue')),
  owner_id UUID NOT NULL REFERENCES users(id),
  incident_id UUID REFERENCES incidents(id),
  -- DEVIATION FROM TechArch 02b (documented, plan 03-01's own note): no
  -- REFERENCES plan_sections(id) clause here. plan_sections does not exist
  -- until 03-03's migration runs (plans/plan_sections/plan_task_templates
  -- are a separate table family per 02c-data-plans-comms-reporting.md,
  -- created in a LATER wave than this plan). 03-03's migration adds
  -- ALTER TABLE tasks ADD CONSTRAINT fk_tasks_plan_section FOREIGN KEY
  -- (plan_section_id) REFERENCES plan_sections(id) once plan_sections
  -- exists -- mirrors TechArch's own documented migration-ordering
  -- workaround for ai_drafts/notifications in 02c's "Migration Ordering
  -- Note." Threat T-03-03 (accepted) tracks the bounded referential-
  -- integrity gap between this migration and 03-03's ALTER.
  plan_section_id UUID,
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

CREATE INDEX idx_tasks_owner_status ON tasks(owner_id, status);
CREATE INDEX idx_tasks_incident ON tasks(incident_id);
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE status NOT IN ('Done','Overdue');
CREATE INDEX idx_task_status_history_task ON task_status_history(task_id, changed_at DESC);
CREATE INDEX idx_resource_requests_incident_status ON resource_requests(incident_id, status);
CREATE INDEX idx_resource_requests_task ON resource_requests(task_id);
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS resource_request_status_history;
DROP TABLE IF EXISTS resource_requests;
DROP TABLE IF EXISTS task_status_history;
DROP TABLE IF EXISTS tasks;
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
