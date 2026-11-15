## 3d. Data Model — Integration & Geospatial

Owning features: F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F15 (CAD/911), F17 (Asset/Facility/Document). PostGIS extension required (declared in `02a`). `hazard_feed_events` is treated as a "phase 0" table with no outbound FKs so that `signal_source_events` (`02c`) can reference it without circular migration ordering — see `02c`'s Migration Ordering Note.

### GIS Integration (F11)

```sql
CREATE TABLE gis_feed_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id VARCHAR(100) NOT NULL,
  vendor VARCHAR(100) NOT NULL CHECK (vendor IN ('Esri','OSM','agency_gis')),
  last_fetch_at TIMESTAMPTZ,
  last_fetch_status VARCHAR(20) NOT NULL DEFAULT 'ok' CHECK (last_fetch_status IN ('ok','error','timeout')),
  can_publish BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (layer_id, vendor)
);
```
*Geospatial feature data itself (base-map tiles, boundary geometries) is read-through/cached only — EPMP is not the system of record for GIS base-layer content; only fetch status/health is persisted here. Live feature data is fetched on-demand via the F11 adapter and optionally cached in Redis/application-memory with a short TTL, not persisted to a dedicated table.*

### Hazard Feeds (F12)

```sql
CREATE TABLE hazard_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name VARCHAR(50) NOT NULL CHECK (feed_name IN ('NOAA','NWS','USGS')),
  endpoint_url TEXT NOT NULL,
  poll_interval_seconds INTEGER NOT NULL DEFAULT 300,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase-0 table: no outbound FKs, to avoid circular migration dependency with signal_source_events (02c).
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

CREATE TABLE hazard_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_feed_event_id UUID NOT NULL REFERENCES hazard_feed_events(id),
  label VARCHAR(200) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_verified_requires_user CHECK (NOT verified OR verified_by IS NOT NULL)
);
```

### EOC COTS Interoperability (F13)

```sql
CREATE TABLE eoc_cots_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(50) NOT NULL CHECK (vendor IN ('WebEOC','Veoci','DisasterLAN')),
  endpoint_url TEXT NOT NULL,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('incident','resource_request','status','activity_log')),
  external_id VARCHAR(300),
  epmp_record_id UUID,
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound','outbound')),
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
  resolution VARCHAR(20) CHECK (resolution IN ('keep_epmp','keep_external')),
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
  incident_matching_strategy VARCHAR(20) NOT NULL DEFAULT 'human_confirmed'
    CHECK (incident_matching_strategy IN ('shared_number','human_confirmed')),
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
-- No UPDATE path exists from any non-adapter code; CAD data is strictly read-only
-- from EPMP's perspective (F15: "EPMP never edits dispatch data").
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
-- Note (F17 hard constraint): no inventory/maintenance/cost columns exist on this
-- table by design — those fields are discarded at the integration-adapter boundary
-- before persistence, never stored even transiently.

CREATE TABLE document_system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- document_links table is defined in 02c-data-plans-comms-reporting.md (owned
-- conceptually by F3, populated via this module's F17 adapter).
```

### Indexes

```sql
CREATE INDEX idx_gis_feed_status_layer ON gis_feed_status(layer_id);
CREATE INDEX idx_hazard_feed_events_feed_time ON hazard_feed_events(feed_id, issued_at DESC);
CREATE INDEX idx_hazard_feed_events_geometry ON hazard_feed_events USING GIST(geometry);
CREATE INDEX idx_hazard_feed_events_expires ON hazard_feed_events(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_hazard_layers_unverified ON hazard_layers(verified) WHERE verified = false;
CREATE INDEX idx_eoc_cots_sync_log_config_time ON eoc_cots_sync_log(config_id, synced_at DESC);
CREATE INDEX idx_eoc_cots_conflicts_unresolved ON eoc_cots_conflicts(config_id) WHERE resolution IS NULL;
CREATE INDEX idx_cad_dispatch_events_incident ON cad_dispatch_events(linked_incident_id);
CREATE INDEX idx_cad_dispatch_events_location ON cad_dispatch_events USING GIST(location);
CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_facilities_status ON facilities(status);
```
