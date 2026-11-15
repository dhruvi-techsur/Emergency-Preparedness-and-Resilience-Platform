## Database Schema — Auth, Organization & Platform Core (Y0a)

Covers tables owned by F8 (Security & Administration), F10 (Platform API/Federation), F16 (HR/IAM reference data), and F18 (persona landing config). PostgreSQL + PostGIS. All tables carry `id UUID PK DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` unless noted; append-only tables omit `updated_at`/`updated_by` by design.

### Security & Administration (F8)

```sql
CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'state'|'county'|'city'|'federal'|'critical_infrastructure'
  parent_jurisdiction_id UUID REFERENCES jurisdictions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'eoc_director', 'incident_commander', 'field_responder'
  persona_id VARCHAR(10) NOT NULL, -- 'PER-01'..'PER-05'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  feature VARCHAR(50) NOT NULL, -- e.g. 'incidents','tasks','resource_requests','notifications'
  actions TEXT[] NOT NULL, -- e.g. {'view','create','edit','approve'}
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  jurisdiction_scope UUID[] NOT NULL DEFAULT '{}', -- array of jurisdiction ids
  theme_preference VARCHAR(10) NOT NULL DEFAULT 'light', -- 'light'|'dark'|'contrast'
  status VARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active'|'Suspended'
  idp_subject VARCHAR(500), -- SSO subject identifier
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol VARCHAR(10) NOT NULL, -- 'SAML2'|'OIDC'
  idp_metadata_url TEXT,
  idp_metadata_xml TEXT,
  attribute_mapping JSONB NOT NULL, -- {email_attr, name_attr, group_attr}
  group_to_role_mapping JSONB NOT NULL, -- [{idp_group, role_id}]
  tested_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only: no UPDATE/DELETE permitted at the application layer.
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'login','permission_change','record_access','ai_draft_approval', etc.
  record_type VARCHAR(50),
  record_id UUID,
  detail JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE integration_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL, -- 'GIS','WebEOC','Everbridge','CAD', etc.
  last_sync_at TIMESTAMPTZ,
  direction VARCHAR(20) NOT NULL, -- 'inbound'|'outbound'|'bidirectional'
  record_authority VARCHAR(100) NOT NULL, -- which system owns the record type
  sync_status VARCHAR(20) NOT NULL DEFAULT 'online', -- 'online'|'syncing'|'offline'|'conflict'
  error_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Platform API, Federation & Event Bus (F10)

```sql
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
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending'|'delivered'|'failed'
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, idempotency_key)
);

CREATE TABLE record_authority_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type VARCHAR(100) NOT NULL UNIQUE, -- 'incident','dispatch_status','personnel_roster', etc.
  authoritative_system VARCHAR(100) NOT NULL, -- 'EPMP' or named external system
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE federation_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  scope JSONB NOT NULL, -- {record_types: [...], incident_filters: {...}}
  granted_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active'|'Revoked'
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL, -- 'notification_fanout','feed_ingestion','sync_reconciliation','report_generation'
  status VARCHAR(20) NOT NULL DEFAULT 'idle', -- 'idle'|'running'|'failed'|'backoff'
  last_run_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### HR/IAM Integration Reference Data (F16)

```sql
CREATE TABLE personnel_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_person_id VARCHAR(200) NOT NULL,
  matched_user_id UUID REFERENCES users(id), -- null if unmatched
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320),
  role_titles TEXT[],
  qualifications TEXT[],
  contact_info JSONB,
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  source VARCHAR(100) NOT NULL, -- HRIS system name
  as_of TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Persona Views Reference Config (F18)

```sql
CREATE TABLE role_landing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) UNIQUE,
  default_landing_route VARCHAR(200) NOT NULL,
  nav_groups JSONB NOT NULL, -- [{label, items: [{id,label,icon,href}]}]
  mobile_bottom_bar_items JSONB, -- max 4 items
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes (representative, non-exhaustive)

```sql
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_audit_log_actor_time ON audit_log(actor_id, occurred_at DESC);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(delivery_status, next_retry_at);
CREATE INDEX idx_personnel_roster_email ON personnel_roster(email);
CREATE INDEX idx_federation_grants_jurisdiction ON federation_grants(partner_jurisdiction_id, status);
```
