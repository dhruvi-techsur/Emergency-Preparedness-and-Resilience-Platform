## 7. Integration & Adapter Architecture

### 7.1 Common Adapter Pattern

Every external system family (F11–F17) is integrated through a dedicated adapter implementing a common interface, hosted within the `integration-gateway` backend module (see `01-components.md` §2.1). This uniformity is what makes the FRD's "four non-negotiable integration behaviors" (record authority, trusted provenance, controlled federation, graceful failure) enforceable as shared middleware rather than seven separate bespoke implementations.

```typescript
interface IntegrationAdapter<TRecord> {
  // Pull-based adapters (F11, F12, F13 inbound, F15, F16, F17)
  fetch(since?: string): Promise<ProvenancedRecord<TRecord>[]>;

  // Push-based adapters (F11 publish, F13 outbound, F14 send)
  publish?(records: TRecord[]): Promise<PublishResult>;

  // Required on every adapter — feeds integration_health (02a) and S8.6/F13 UI
  health(): Promise<IntegrationHealthStatus>;
}

interface ProvenancedRecord<T> {
  source: string;        // required — adapter's declared system identity
  as_of: string;         // required — ISO 8601, when the fact was true as of
  confidence?: ConfidenceLabel; // required for hazard/signal data, optional elsewhere
  version?: string;
  payload: T;
}
```

**Provenance enforcement middleware** (shared across all adapters) runs immediately after `fetch()` and before any persistence call: any `ProvenancedRecord` missing `source` or `as_of` is rejected with `422 PROVENANCE_REQUIRED` and never reaches a domain table — this is the single enforcement point for F10's "provenance enforcement at the API boundary," applied uniformly rather than per-adapter.

**Record-authority middleware** runs before any write that could affect a record type with a declared external authority (consulting `record_authority_registry`): if EPMP is not authoritative for that record type, an inbound change that conflicts with EPMP's current value is diverted to a `*_conflicts` table rather than applied — never a silent overwrite.

**Backoff/retry (shared job scheduler):** exponential backoff (base → ×2 per failure, capped at a configurable max), state tracked in `background_jobs`; sustained backoff surfaces as `BACKGROUND_JOB_DEGRADED` (alert, not hard failure) rather than blocking unrelated platform operation.

### 7.2 Adapter Catalog (one row per F11–F17 integration)

| # | System family | Feature | Adapter type | Direction | Record authority split | Graceful-failure behavior |
|---|---|---|---|---|---|---|
| 1 | GIS (Esri REST, OGC/WMS/WFS, OSM-derived) | F11 | Normalized GeoJSON adapter, one implementation per vendor sharing a common OGC/GeoJSON translation layer | Read (base layers/boundaries/facilities); optional publish (EPMP-authored layers) | External: base map, boundaries, facility locations. EPMP: incidents, resource positions, hazard overlays (if published) | Timeout/unavailable → F2 operating picture falls back to schematic offline base map (`GIS_FEED_UNAVAILABLE`, 200 degraded, never a hard page failure) |
| 2 | NOAA / NWS / USGS hazard feeds | F12 | One adapter per feed family (CAP-XML parser for NWS alerts, GeoJSON for USGS); scheduled poll (default 300s interval per `hazard_feed_config.poll_interval_seconds`) | Read-only | External: all hazard-event data. EPMP: none — never originates hazard facts | Feed outage → exponential backoff; events already ingested remain visible, flagged with age (`HAZARD_FEED_STALE` beyond threshold) |
| 3 | EOC COTS (WebEOC, Veoci, DisasterLAN) | F13 | One adapter per vendor; normalizes to exactly 4 exchange-record types (Incident, Resource Request, Status Update, Activity Log) — no attempt to sync every board/widget type | Bidirectional, scoped to 4 record types | Varies per declared record type (admin-configured in `record_authority_registry`) | Conflicting field values surfaced side-by-side in integration-health UI with "Keep EPMP value"/"Keep [external] value" — never silent overwrite (`eoc_cots_conflicts`) |
| 4 | Everbridge / AtHoc / notification channels | F14 | One adapter per provider family; send + inbound delivery-callback webhook | Outbound send + inbound callback | External: delivery/acknowledgment receipts. EPMP: message content, audience, approval | Provider outage → message queued for retry, delivery failure surfaced in F5 delivery-status view, never silently dropped (`PROVIDER_UNAVAILABLE`, `503`) |
| 5 | FEMA IPAWS / OASIS CAP | F14 | CAP-formatting layer on top of the notification-provider adapter — translates an approved, human-sent message into a CAP-compliant XML envelope | Outbound, approval- and authority-gated | N/A (standards format, not a system of record). EPMP: CAP envelope content post-approval | `CAP_FIELDS_INCOMPLETE` (422) blocks send before reaching IPAWS if required CAP fields are missing; `CAP_AUTHORITY_DENIED` (403) if the sending agency lacks configured CAP origination authority |
| 6 | CAD / 911 / public safety dispatch | F15 | One adapter per CAD vendor; strictly read-only, no write routes exist in the API surface at all (not merely disabled — absent) | Read-only | External: all dispatch-status data. EPMP: none — never edits dispatch data | Feed unavailable → last-known dispatch status remains visible on the incident's dispatch panel, labeled with age; `CAD_RECORD_READ_ONLY` (403) is a structural guarantee, not a runtime toggle |
| 7 | HR / IAM / personnel rosters (HRIS) | F16 | One adapter per HRIS vendor for roster sync; SSO is handled separately via Keycloak federation (§5.1), not this adapter | Read sync (roster) + SSO (shared, not this adapter) | External: personnel role/qualification/contact data (where agency designates HR authoritative). EPMP: RBAC role assignment, theme preference, audit history (always EPMP-owned, never overwritten by roster sync) | Roster sync failure → `personnel_roster` retains last-synced data (`as_of` visibly aged); `matched_user_id` remains null for unmatched records rather than guessing a match |
| 8 | Asset / facility / ERP systems | F17 | One adapter per ERP vendor; **inventory/maintenance/cost fields are discarded at the adapter boundary** before the payload ever reaches application code — not merely unused, structurally absent from the `facilities` table | Read-only (status/location) | External: facility status, location, and all inventory/maintenance/cost data (untouched). EPMP: none | Feed unavailable → facility markers on operating picture retain last-known status, visibly aged |
| 9 | SharePoint / document systems | F17 (feeds F3) | Document adapter executing under the **requesting user's delegated credentials** (OAuth2 on-behalf-of flow against the document system), reused by F3's plan-import flow | Permission-aware import/link | External: document content and permissions. EPMP: plan/SOP structure and linkage metadata only | Permission check failure → `IMPORT_PERMISSION_DENIED` (403), never falls back to a cached/stale permission state; Link-live mode re-checks permission on every scheduled sync and **immediately restricts** EPMP-side visibility on a detected downgrade |

### 7.3 Standards Alignment at the Adapter Layer

| Standard | Where applied |
|---|---|
| OGC services / GeoJSON / Esri REST | F11 adapter (#1) — normalized internally to GeoJSON regardless of source vendor protocol |
| OASIS CAP | F14's CAP-formatting adapter (#5) |
| OASIS EDXL (RM/DE) | Reserved for F4/F13 resource-request exchange with partner agencies beyond MVP's basic resource-request lifecycle — adapter interface (`IntegrationAdapter<TRecord>`) is generic enough to accept an EDXL-RM payload shape later without a redesign, but no EDXL adapter ships in this MVP |
| NIEM data models | Reserved for cross-agency semantic exchange beyond MVP's declared record types; not elaborated further per the FRD's evidence boundary |
| STIX/TAXII, FHIR | Explicitly optional, no MVP feature requires them; the adapter interface could host either if a regulated use case emerges, but none is built |
| OAuth2/OIDC/SAML2 | Keycloak federation (§5.1) for user SSO; OAuth2 client-credentials for adapter-to-vendor and partner API-client authentication |
| Webhooks with idempotent retries | `webhook_subscriptions`/`webhook_deliveries` (F10, `02a-data-auth-org.md`); every delivery carries an `idempotency_key`, duplicate keys within the retry window are no-ops |

### 7.4 Record-Authority Registry as the Integration Contract of Record

The `record_authority_registry` table (admin-managed via F10 S10.2 / F8 S8.6) is the single declarative source of truth answering "which system owns this record type" for every integration — this is deliberately a **data-driven configuration**, not hard-coded per-adapter logic, so that:
1. A new agency's record-authority decisions (e.g., "this agency's WebEOC remains authoritative for resource requests, but EPMP is authoritative for incidents") can be configured without a code change.
2. The decision is auditable (every change to the registry is itself an audited action, per F8).
3. Every write path in F13/F15/F16/F17 consults the same registry before applying an inbound or outbound change, guaranteeing consistent enforcement across all seven integration features rather than seven independently-reasoned implementations.
