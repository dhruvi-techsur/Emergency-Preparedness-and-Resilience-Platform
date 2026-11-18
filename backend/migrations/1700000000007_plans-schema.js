/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02c-data-plans-comms-reporting.md's
// "Plans & Playbooks (F3)" section, plus this migration's own closure of
// 03-01's documented deferred-FK window (tasks.plan_section_id had no FK
// since plan_sections didn't exist yet when 03-01 ran).
const UP_SQL = `
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
-- RLS policy definitions (jurisdiction-scope filtering per TechArch §1.6) are
-- Phase 2's established pattern -- incidents enabled RLS in 02-01 without yet
-- defining policies, documenting jurisdiction-scope enforcement as applied at
-- the query/WHERE-clause level in application code for Phase 2/3, with RLS
-- reserved for a later hardening pass. This plan follows the identical,
-- already-established convention -- not introducing a new simplification,
-- just applying Phase 2's existing one consistently.
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

CREATE INDEX idx_plans_jurisdiction_status ON plans(jurisdiction_id, status);
CREATE INDEX idx_plan_versions_plan ON plan_versions(plan_id, version_number DESC);
CREATE INDEX idx_plan_sections_plan ON plan_sections(plan_id, sort_order);
CREATE INDEX idx_plan_task_templates_section ON plan_task_templates(plan_section_id);
CREATE INDEX idx_document_links_plan ON document_links(plan_id);

-- Closing the two-migration FK split documented in 03-01's
-- 1700000000004_plans-tasks-resources-schema.js: tasks.plan_section_id was
-- created as a plain UUID column (no FK) because plan_sections didn't exist
-- yet. Now that plan_sections exists (above), add the real FK. Any
-- tasks.plan_section_id value written between 03-01 and this migration
-- running is now retroactively validated; a malformed value written in that
-- window would make THIS migration fail, which is correct fail-fast
-- behavior, not a bug to work around.
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_plan_section
  FOREIGN KEY (plan_section_id) REFERENCES plan_sections(id);
`;

const DOWN_SQL = `
ALTER TABLE tasks DROP CONSTRAINT fk_tasks_plan_section;

DROP TABLE IF EXISTS document_links;
DROP TABLE IF EXISTS plan_task_templates;
DROP TABLE IF EXISTS plan_sections;
DROP TABLE IF EXISTS plan_versions;
DROP TABLE IF EXISTS plans;
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
