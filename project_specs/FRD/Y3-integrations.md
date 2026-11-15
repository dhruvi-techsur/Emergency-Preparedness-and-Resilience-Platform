## Y3: External Integration Points

This chunk consolidates the external system dependencies and integration contracts introduced per-feature in F11–F17, summarizing the approved-adapter pattern, record-authority declarations, and the four non-negotiable integration behaviors (record authority, trusted provenance, controlled federation, graceful failure) as a single cross-reference. Per-feature detail (screens, process, validation, errors) lives in each feature's own chunk; this file is the systems-integration index.

### Integration Summary Table

| External System Family | Owning Feature | Direction | Record Authority (External System) | Record Authority (EPMP) | Adapter Pattern |
|---|---|---|---|---|---|
| GIS (Esri, OSM-derived, agency GIS) | F11 | Read (base layers/boundaries/facilities); optional publish (EPMP-authored layers) | Base map, boundaries, facility locations | Incidents, resource positions, hazard overlays (when published) | One normalized GeoJSON adapter per vendor; `source`/`as_of` on every response |
| NOAA / NWS / USGS hazard feeds | F12 | Read-only | All hazard-event data | None (EPMP never originates hazard facts) | One adapter per feed family (CAP-XML, GeoJSON); events persist `verified: false` by default |
| EOC COTS (WebEOC, Veoci, DisasterLAN) | F13 | Bidirectional, scoped to 4 record types | Varies per declared record type | Varies per declared record type | One adapter per vendor; 4 exchange-record types only (Incident, Resource Request, Status Update, Activity Log) |
| Everbridge / AtHoc / notification channels | F14 | Outbound send + inbound delivery callback | Delivery/acknowledgment receipts | Message content, audience, approval | One adapter per provider family; send endpoint requires `approved_by`/`approved_at` |
| FEMA IPAWS / OASIS CAP | F14 | Outbound, approval- and authority-gated | N/A (standards format, not a system of record) | CAP envelope content (post-approval) | CAP-formatting adapter layered on top of the notification-provider adapter |
| CAD / 911 / public safety dispatch | F15 | Read-only | All dispatch-status data | None (EPMP never edits dispatch data) | One adapter per CAD vendor; strictly read-only, no write routes exist |
| HR / IAM / personnel rosters | F16 | Read sync (roster) + SSO (auth, shared with F8) | Personnel role/qualification/contact data (where agency designates) | RBAC role assignment, theme preference, audit history (always EPMP-owned) | One adapter per HRIS vendor; SSO via standard SAML2/OIDC |
| Asset / facility / ERP systems | F17 | Read-only (status/location) | Facility status, location; all inventory/maintenance/cost (not touched) | None | One adapter per ERP vendor; inventory/maintenance/cost fields discarded at adapter boundary, never persisted |
| SharePoint / document systems | F17 (feeds F3) | Permission-aware import/link | Document content and permissions | Plan/SOP structure and linkage metadata | Document adapter reused by F3's import flow; executes under requesting user's delegated credentials |

### Four Non-Negotiable Integration Behaviors — Enforcement Points

1. **Record authority:** Declared per record type in the `record_authority_registry` table (F10, see `Y0a-schema-auth-org.md`), consulted by every write path in F13/F15/F16/F17 before applying an inbound or outbound change. Visible to admins in F8 S8.6 Integration Health.
2. **Trusted provenance:** Enforced at the API boundary (F10) — every ingested fact must carry `source`, `timestamp`/`as_of`, `version` (where applicable), and `confidence` before persistence; see `Y2-errors.md` §`PROVENANCE_REQUIRED`. Rendered to users via the `Provenance` component wherever the fact is displayed (F2's `LayerPanel`/`MapPopup`, F1's Timeline AI-sourced entries, F9's `AIDraft` panels).
3. **Controlled federation:** Policy-enforced via `federation_grants` (F10), each grant scoped to an explicit record-type/incident-filter set, revocable with immediate effect (no caching window). Managed in F10 S10.3.
4. **Graceful failure:** Every integration feature (F11–F17) specifies a queue/retry/reconcile behavior and a visible degraded-mode state (`SyncStatus`, map schematic fallback, "last-known data labeled with age") rather than a blocking failure — see each feature's Process section and `Y2-errors.md`'s "Retry & Backoff Guidance."

### Standards Alignment (per PRD §6 NFRs)

- **OpenAPI/REST/JSON:** all endpoints in `Y1a`–`Y1d`.
- **OAuth2/OIDC/SAML2:** F8 SSO (S8.4), F16 SSO (shared), F10 API-client auth.
- **Webhooks/event bus with idempotent retries:** F10 `webhook_subscriptions`/`webhook_deliveries`.
- **OASIS CAP:** F14's CAP-formatting adapter for IPAWS/public-warning channels.
- **OASIS EDXL (resource messaging):** reserved for F4/F13 resource-request exchange with partner agencies where a specific regulated use case requires it beyond this MVP's basic resource-request lifecycle — not committed in MVP scope beyond the approved-adapter pattern already specified.
- **NIEM data models:** reserved for cross-agency semantic exchange beyond this MVP's declared record types; not elaborated further here per the PRD's evidence boundary.
- **OGC services/GeoJSON/Esri REST:** F11's adapter contract.
- **STIX/TAXII, FHIR:** explicitly optional per PRD §6, only if a specific regulated use case requires them — no MVP feature requires them, so no contract is specified.

### Out-of-Scope Integration Depth (explicit, per PRD §10)

- No integration feature in this FRD specifies full bidirectional, field-complete sync with any named external system — each is scoped to an explicitly declared, approved-adapter record subset.
- No integration feature builds a parallel system of record for GIS, CAD, alerting, or infrastructure data — EPMP reads, displays, and (where explicitly permitted) publishes back to these systems, never replaces them.
- Inventory, maintenance, and cost data from asset/ERP systems (F17) is explicitly never requested, stored, or displayed in this MVP.
