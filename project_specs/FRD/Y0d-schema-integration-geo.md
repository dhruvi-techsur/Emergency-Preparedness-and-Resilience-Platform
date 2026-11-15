## Database Schema — Integration & Geospatial (Y0d)

Covers tables owned by F11 (GIS), F12 (Hazard Feeds), F13 (EOC COTS), F15 (CAD/911), and F17 (Asset/Facility/Document). PostGIS extension required for geography types.

### GIS Integration (F11)

```sql
CREATE TABLE gis_feed_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id VARCHAR(100) NOT NULL,
  vendor VARCHAR(100) NOT NULL, -- 'Esri','OSM','agency_gis'
  last_fetch_at TIMESTAMPTZ,
  last_fetch_status VARCHAR(20) NOT NULL DEFAULT 'ok', -- 'ok'|'error'|'timeout'
  can_publish BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
*(Geospatial feature data itself is read-through/cached only — EPMP is not the system of record for GIS base-layer content; see F11.)*

### Hazard Feeds (F12)

```sql
CREATE TABLE hazard_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name VARCHAR(50) NOT NULL, -- 'NOAA'|'NWS'|'USGS'
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
  confidence VARCHAR(10) NOT NULL, -- 'High'|'Medium'|'Low'
  source VARCHAR(100) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feed_id, external_event_id)
);

CREATE TABLE hazard_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_feed_event_id UUID NOT NULL REFERENCES hazard_feed_events(id),
  label VARCHAR(200) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### EOC COTS Interoperability (F13)

```sql
CREATE TABLE eoc_cots_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(50) NOT NULL, -- 'WebEOC'|'Veoci'|'DisasterLAN'
  endpoint_url TEXT NOT NULL,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL, -- 'incident'|'resource_request'|'status'|'activity_log'
  external_id VARCHAR(300),
  epmp_record_id UUID,
  direction VARCHAR(20) NOT NULL, -- 'inbound'|'outbound'
  sync_status VARCHAR(20) NOT NULL DEFAULT 'ok',
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL,
  epmp_record_id UUID NOT NULL,
  epmp_value JSONB NOT NULL,
  external_value JSONB NOT NULL,
  resolution VARCHAR(20), -- 'keep_epmp'|'keep_external', null until resolved
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### CAD / 911 Integration (F15)

```sql
CREATE TABLE cad_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  incident_matching_strategy VARCHAR(20) NOT NULL DEFAULT 'human_confirmed', -- 'shared_number'|'human_confirmed'
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cad_dispatch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES cad_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  cad_incident_number VARCHAR(100),
  linked_incident_id UUID REFERENCES incidents(id),
  status VARCHAR(100) NOT NULL,
  unit_ids TEXT[],
  location GEOGRAPHY(POINT, 4326),
  source VARCHAR(100) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (config_id, external_event_id)
);
```

### Asset, Facility & Document Integration (F17)

```sql
CREATE TABLE facility_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  erp_vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_facility_id VARCHAR(300) NOT NULL,
  name VARCHAR(200) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status VARCHAR(50) NOT NULL,
  source VARCHAR(100) NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (external_facility_id, source)
);

CREATE TABLE document_system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL, -- 'SharePoint', etc.
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- document_links table defined in Y0c (owned conceptually by F3, populated via F17's adapter)
```

### Event Bus Supplementary (F10, cross-referenced from Y0a)

```sql
-- See Y0a-schema-auth-org.md for webhook_subscriptions, webhook_deliveries, background_jobs.
```

### Indexes (representative)

```sql
CREATE INDEX idx_hazard_feed_events_feed_time ON hazard_feed_events(feed_id, issued_at DESC);
CREATE INDEX idx_hazard_layers_unverified ON hazard_layers(verified) WHERE verified = false;
CREATE INDEX idx_eoc_cots_conflicts_unresolved ON eoc_cots_conflicts(config_id) WHERE resolution IS NULL;
CREATE INDEX idx_cad_dispatch_events_incident ON cad_dispatch_events(linked_incident_id);
CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_hazard_feed_events_geometry ON hazard_feed_events USING GIST(geometry);
```
