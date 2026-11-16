/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

const UP_SQL = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL
    CHECK (type IN ('state','county','city','federal','critical_infrastructure')),
  parent_jurisdiction_id UUID REFERENCES jurisdictions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  persona_id VARCHAR(10) NOT NULL
    CHECK (persona_id IN ('PER-01','PER-02','PER-03','PER-04','PER-05')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  jurisdiction_scope UUID[] NOT NULL DEFAULT '{}',
  theme_preference VARCHAR(10) NOT NULL DEFAULT 'light'
    CHECK (theme_preference IN ('light','dark','contrast')),
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active','Suspended')),
  idp_subject VARCHAR(500),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  feature VARCHAR(50) NOT NULL,
  actions TEXT[] NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id),
  UNIQUE (role_id, feature)
);

CREATE TABLE sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol VARCHAR(10) NOT NULL CHECK (protocol IN ('SAML2','OIDC')),
  idp_metadata_url TEXT,
  idp_metadata_xml TEXT,
  attribute_mapping JSONB NOT NULL,
  group_to_role_mapping JSONB NOT NULL,
  tested_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_idp_metadata CHECK (idp_metadata_url IS NOT NULL OR idp_metadata_xml IS NOT NULL)
);

CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  record_type VARCHAR(50),
  record_id UUID,
  detail JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Deviation from TechArch's literal "REVOKE UPDATE, DELETE ON audit_log FROM app_runtime":
-- DEPLOY-01's single-DATABASE_URL deployment contract gives the app exactly one DB role,
-- which must also run migrations (DDL), so a separate low-privilege "app_runtime" role is
-- not available in the deployed environment. A BEFORE UPDATE/DELETE trigger gives the same
-- "enforced at the data layer, regardless of caller, including admins" guarantee without
-- requiring privilege separation across two roles.
CREATE OR REPLACE FUNCTION reject_audit_log_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only: % not permitted', TG_OP;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_immutable
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION reject_audit_log_mutation();

CREATE TABLE integration_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL UNIQUE,
  last_sync_at TIMESTAMPTZ,
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound','outbound','bidirectional')),
  record_authority VARCHAR(100) NOT NULL,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'online'
    CHECK (sync_status IN ('online','syncing','offline','conflict')),
  error_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(200) NOT NULL,
  client_secret_hash TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_client_id UUID NOT NULL REFERENCES api_clients(id),
  callback_url TEXT NOT NULL,
  event_types TEXT[] NOT NULL,
  secret_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id),
  idempotency_key VARCHAR(200) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending','delivered','failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, idempotency_key)
);

CREATE TABLE record_authority_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type VARCHAR(100) NOT NULL UNIQUE,
  authoritative_system VARCHAR(100) NOT NULL,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE federation_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  scope JSONB NOT NULL,
  granted_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Revoked')),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_scope_not_empty CHECK (jsonb_typeof(scope->'record_types') = 'array' AND jsonb_array_length(scope->'record_types') > 0)
);

CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL
    CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage')),
  status VARCHAR(20) NOT NULL DEFAULT 'idle' CHECK (status IN ('idle','running','failed','backoff')),
  last_run_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE personnel_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_person_id VARCHAR(200) NOT NULL,
  matched_user_id UUID REFERENCES users(id),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320),
  role_titles TEXT[],
  qualifications TEXT[],
  contact_info JSONB,
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  source VARCHAR(100) NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (external_person_id, source)
);

-- NOTE: role_landing_config is created here (owned by F18 per TechArch's schema
-- chunking) but is NOT populated or read by any Phase 1 endpoint — Phase 1's nav
-- resolution derives directly from role_permissions (see plan 01-06). Populating/
-- consuming role_landing_config for full persona-dashboard routing is explicitly
-- F18/Phase 6 scope — do not build that here.
CREATE TABLE role_landing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) UNIQUE,
  default_landing_route VARCHAR(200) NOT NULL,
  nav_groups JSONB NOT NULL,
  mobile_bottom_bar_items JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_bottom_bar_max CHECK (mobile_bottom_bar_items IS NULL OR jsonb_array_length(mobile_bottom_bar_items) <= 4)
);

CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_jurisdiction_scope ON users USING GIN(jurisdiction_scope);
CREATE INDEX idx_audit_log_actor_time ON audit_log(actor_id, occurred_at DESC);
CREATE INDEX idx_audit_log_record ON audit_log(record_type, record_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(delivery_status, next_retry_at);
CREATE INDEX idx_personnel_roster_email ON personnel_roster(email);
CREATE INDEX idx_personnel_roster_matched_user ON personnel_roster(matched_user_id);
CREATE INDEX idx_federation_grants_jurisdiction ON federation_grants(partner_jurisdiction_id, status);
CREATE INDEX idx_background_jobs_type_status ON background_jobs(job_type, status);
CREATE INDEX idx_jurisdictions_parent ON jurisdictions(parent_jurisdiction_id);
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS role_landing_config;
DROP TABLE IF EXISTS personnel_roster;
DROP TABLE IF EXISTS background_jobs;
DROP TABLE IF EXISTS federation_grants;
DROP TABLE IF EXISTS record_authority_registry;
DROP TABLE IF EXISTS webhook_deliveries;
DROP TABLE IF EXISTS webhook_subscriptions;
DROP TABLE IF EXISTS api_clients;
DROP TABLE IF EXISTS integration_health;
DROP TRIGGER IF EXISTS trg_audit_log_immutable ON audit_log;
DROP FUNCTION IF EXISTS reject_audit_log_mutation();
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS sso_config;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS jurisdictions;
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
