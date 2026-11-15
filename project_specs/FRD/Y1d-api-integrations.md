## API Endpoints — External Integrations (Y1d)

Covers F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F14 (Notification Providers), F15 (CAD/911), F16 (HR/IAM roster), F17 (Asset/Facility/Document). All integration endpoints follow the approved-adapter pattern described in each feature's chunk; this file specifies the normalized, vendor-neutral contract EPMP's own services expose/consume internally.

### GIS (F11)

**`GET /api/v1/integrations/gis/features?layer_id={...}&bbox={minx,miny,maxx,maxy}`**
Response: `{ layer_id, source, as_of, features: [GeoJSON Feature] }`
Errors: `504 GIS_FEED_TIMEOUT` (triggers F2 schematic fallback, not a hard error to the end user), `502 GIS_FEED_INVALID`

**`POST /api/v1/integrations/gis/publish`**
Request: `{ layer_id, features: [GeoJSON Feature], visibility: "agency-internal"|"public" }`
Errors: `400 GIS_PUBLISH_LAYER_NOT_ALLOWED`, `403 GIS_PUBLISH_DENIED`

**`GET /api/v1/integrations/gis/health`**

### Hazard Feeds (F12)

**`GET /api/v1/integrations/hazard-feeds/events?feed={noaa|usgs|...}&since={timestamp}`**
Response: `{ feed, events: [{id, type, severity, geometry, confidence, source, issued_at, expires_at}] }`

**`POST /api/v1/hazard-layers/{id}/verify`**
Request: `{ verified_by }` · Errors: `403 VERIFICATION_REQUIRES_NAMED_USER`

**`GET /api/v1/integrations/hazard-feeds/health`**

### EOC COTS (F13)

**`GET /api/v1/integrations/eoc-cots/exchange-records?type={incident|resource_request|status|activity_log}&since={timestamp}`**
Response: `{ external_id, type, payload, external_system, last_modified_external }`

**`POST /api/v1/integrations/eoc-cots/exchange-records`** (outbound sync)
Request: EPMP-side record, type-scoped to the four approved record types.
Errors: `400 EOC_RECORD_TYPE_UNSUPPORTED`, `502 EOC_OUTBOUND_REJECTED`, `401 EOC_ADAPTER_AUTH_FAILED`

**`GET /api/v1/integrations/eoc-cots/conflicts`**
**`POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve`**
Request: `{ resolution: "keep_epmp"|"keep_external", resolved_by }`

**`GET /api/v1/integrations/eoc-cots/health`**

### Notification Providers (F14)

**`POST /api/v1/integrations/notification-providers/send`**
Request: `{ notification_id, channel, recipients, message, approved_by, approved_at }` — rejects if `approved_by`/`approved_at` missing.
Errors: `400 SEND_REQUIRES_APPROVAL`, `503 PROVIDER_UNAVAILABLE`, `422 CAP_FIELDS_INCOMPLETE`, `403 CAP_AUTHORITY_DENIED`

**`POST /api/v1/integrations/notification-providers/callback`** (inbound webhook from provider)
Request: `{ external_message_id, recipient, status, timestamp }`
Response: `200` (or logged `CALLBACK_UNMATCHED` if no matching record)

**`GET /api/v1/integrations/notification-providers/health`**

### CAD / 911 (F15) — strictly read-only, no write routes exist

**`GET /api/v1/integrations/cad/dispatch-events?since={timestamp}`**
Response: `{ external_event_id, cad_incident_number, status, unit_ids, location, updated_at, source }`

**`GET /api/v1/incidents/{id}/dispatch-status`**
Response: read-only panel data with `Provenance` fields. Errors (if a PATCH is attempted on this route, which does not exist): `403 CAD_RECORD_READ_ONLY`

**`GET /api/v1/integrations/cad/health`**

### HR / IAM Roster (F16)

**`GET /api/v1/integrations/hris/personnel?since={timestamp}`**
Response: `{ external_person_id, name, email, role_titles, qualifications, contact_info, jurisdiction, source, as_of }`

**`GET /api/v1/integrations/hris/health`**
*(SSO/authentication endpoints are shared with F8 — see `Y1a-api-auth-admin.md` §Security & Administration, `POST /api/v1/auth/sso/callback`.)*

### Asset, Facility & Document Systems (F17)

**`GET /api/v1/integrations/facilities/status?since={timestamp}`**
Response: `{ facility_id, name, location, status, source, as_of }` — no inventory/maintenance/cost fields.

**`GET /api/v1/integrations/documents/browse?query={search}`**
Executed under the requesting user's delegated credentials; results never exceed source-system visibility.

**`POST /api/v1/integrations/documents/{id}/import`**
**`POST /api/v1/integrations/documents/{id}/link`**
Errors: `403 IMPORT_PERMISSION_DENIED`, `403 LINK_PERMISSION_REVOKED`, `200 LINKED_DOCUMENT_CHANGED` (flagged)

**`GET /api/v1/integrations/facilities/health`** / **`GET /api/v1/integrations/documents/health`**

### Shared Conventions Across All Integration Endpoints
- Every response payload carrying ingested external data must include `source` and an `as_of`/`issued_at`/`updated_at` timestamp (provenance enforcement, F10) — payloads missing these are rejected server-side before persistence, not merely flagged client-side.
- All integration health endpoints return the common shape: `{ system_name, last_sync_at, direction, record_authority, sync_status, error_count }`.
- Background polling jobs backing these endpoints are monitored via `GET /api/v1/admin/platform-health` and the background-jobs table (see `Y0a-schema-auth-org.md`).
