## 4d. API — External Integrations

Covers F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F14 (Notification Providers), F15 (CAD/911), F16 (HR/IAM roster), F17 (Asset/Facility/Document). These are the normalized, vendor-neutral contracts EPMP's own services expose/consume internally — each wraps a vendor-specific adapter (see `06-integrations.md`).

### TypeScript Interfaces

```typescript
interface GeoFeatureResponse {
  layer_id: string; source: string; as_of: string;
  features: GeoJSON.Feature[];
}

interface HazardFeedEvent {
  id: string; type: string; severity?: string;
  geometry: GeoJSON.Geometry; confidence: ConfidenceLabel;
  source: string; issued_at: string; expires_at?: string;
}

interface EocCotsExchangeRecord {
  external_id: string;
  type: 'incident' | 'resource_request' | 'status' | 'activity_log';
  payload: Record<string, unknown>;
  external_system: string;
  last_modified_external: string;
}

interface EocCotsConflict {
  id: string; record_type: string; epmp_record_id: string;
  epmp_value: Record<string, unknown>; external_value: Record<string, unknown>;
  resolution: 'keep_epmp' | 'keep_external' | null;
}

interface NotificationProviderSendRequest {
  notification_id: string; channel: string; recipients: string[];
  message: string; approved_by: string; approved_at: string;
}

interface NotificationProviderCallback {
  external_message_id: string; recipient: string; status: string; timestamp: string;
}

interface CadDispatchEvent {
  external_event_id: string; cad_incident_number?: string;
  status: string; unit_ids: string[];
  location?: { lat: number; lng: number };
  updated_at: string; source: string;
}

interface HrisPersonnelRecord {
  external_person_id: string; name: string; email?: string;
  role_titles: string[]; qualifications: string[];
  contact_info: Record<string, unknown>; jurisdiction: string;
  source: string; as_of: string;
}

interface FacilityStatus {
  facility_id: string; name: string;
  location: { lat: number; lng: number };
  status: string; source: string; as_of: string;
  // No inventory/maintenance/cost fields — discarded at adapter boundary (F17 constraint)
}

interface DocumentBrowseResult {
  id: string; name: string; path: string; last_modified: string;
  // Executed under requesting user's delegated credentials; never exceeds source-system visibility
}
```

### Endpoints

**GIS (F11)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/gis/features?layer_id={...}&bbox={...}` | `GeoFeatureResponse` | `504 GIS_FEED_TIMEOUT` (triggers F2 schematic fallback, not hard error), `502 GIS_FEED_INVALID` |
| POST | `/api/v1/integrations/gis/publish` | `{ layer_id, features, visibility: 'agency-internal' \| 'public' }` → `204` | `400 GIS_PUBLISH_LAYER_NOT_ALLOWED`, `403 GIS_PUBLISH_DENIED` |
| GET | `/api/v1/integrations/gis/health` | `IntegrationHealth` | — |

**Hazard Feeds (F12)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/hazard-feeds/events?feed={noaa\|usgs\|...}&since={ts}` | `{ feed: string; events: HazardFeedEvent[] }` | — |
| POST | `/api/v1/hazard-layers/{id}/verify` | `{ verified_by: string }` → `204` | `403 VERIFICATION_REQUIRES_NAMED_USER` |
| GET | `/api/v1/integrations/hazard-feeds/health` | `IntegrationHealth` | — |

**EOC COTS (F13)**

| Method | Path | Request/Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/eoc-cots/exchange-records?type={...}&since={ts}` | → `EocCotsExchangeRecord[]` | — |
| POST | `/api/v1/integrations/eoc-cots/exchange-records` | EPMP-side record, type-scoped to 4 approved types → `204` | `400 EOC_RECORD_TYPE_UNSUPPORTED`, `502 EOC_OUTBOUND_REJECTED`, `401 EOC_ADAPTER_AUTH_FAILED` |
| GET | `/api/v1/integrations/eoc-cots/conflicts` | → `EocCotsConflict[]` | — |
| POST | `/api/v1/integrations/eoc-cots/conflicts/{id}/resolve` | `{ resolution, resolved_by }` → `EocCotsConflict` | — |
| GET | `/api/v1/integrations/eoc-cots/health` | `IntegrationHealth` | — |

**Notification Providers (F14)**

| Method | Path | Request/Response | Errors |
|---|---|---|---|
| POST | `/api/v1/integrations/notification-providers/send` | `NotificationProviderSendRequest` → `202` | `400 SEND_REQUIRES_APPROVAL`, `503 PROVIDER_UNAVAILABLE`, `422 CAP_FIELDS_INCOMPLETE`, `403 CAP_AUTHORITY_DENIED` |
| POST | `/api/v1/integrations/notification-providers/callback` | `NotificationProviderCallback` → `200` | (logged `CALLBACK_UNMATCHED` if no match) |
| GET | `/api/v1/integrations/notification-providers/health` | `IntegrationHealth` | — |

**CAD / 911 (F15) — strictly read-only, no write routes exist**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/cad/dispatch-events?since={ts}` | `CadDispatchEvent[]` | — |
| GET | `/api/v1/incidents/{id}/dispatch-status` | read-only panel data + `Provenance` | `403 CAD_RECORD_READ_ONLY` (if PATCH attempted; route does not exist) |
| GET | `/api/v1/integrations/cad/health` | `IntegrationHealth` | — |

**HR / IAM Roster (F16)**

| Method | Path | Response |
|---|---|---|
| GET | `/api/v1/integrations/hris/personnel?since={ts}` | `HrisPersonnelRecord[]` |
| GET | `/api/v1/integrations/hris/health` | `IntegrationHealth` |

*(SSO/authentication endpoints are shared with F8 — see `03a-api-auth-admin.md`, `POST /api/v1/auth/sso/callback`.)*

**Asset, Facility & Document Systems (F17)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/facilities/status?since={ts}` | `FacilityStatus[]` | — |
| GET | `/api/v1/integrations/documents/browse?query={...}` | `DocumentBrowseResult[]` (delegated credentials) | — |
| POST | `/api/v1/integrations/documents/{id}/import` | → `204` | `403 IMPORT_PERMISSION_DENIED` |
| POST | `/api/v1/integrations/documents/{id}/link` | → `204` | `403 LINK_PERMISSION_REVOKED`, `200 LINKED_DOCUMENT_CHANGED` (flagged) |
| GET | `/api/v1/integrations/facilities/health` / `/api/v1/integrations/documents/health` | `IntegrationHealth` | — |

### Shared Conventions Across All Integration Endpoints

- Every response payload carrying ingested external data includes `source` and an `as_of`/`issued_at`/`updated_at` timestamp — payloads missing these are rejected server-side **before persistence** (`422 PROVENANCE_REQUIRED`), not merely flagged client-side.
- All integration health endpoints return the common `IntegrationHealth` shape (see `03a-api-auth-admin.md`).
- Background polling jobs backing these endpoints are monitored via `GET /api/v1/admin/platform-health` and the `background_jobs` table (see `02a-data-auth-org.md`).
