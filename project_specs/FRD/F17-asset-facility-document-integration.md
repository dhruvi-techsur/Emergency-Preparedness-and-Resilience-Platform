## F17: Asset, Facility & Document System Integration

**Description:** Read integration with asset/facility/ERP systems for site status, and permission-aware import/link/sync with document systems (SharePoint and similar) for plans, SOPs, annexes, and evidence — supporting F2 (facility positions) and F3 (plan repository) without EPMP duplicating these systems of record. Full asset/inventory/maintenance management is explicitly deferred.

**Terminology:**
- **Facility marker:** A map marker (square shape, per F2's symbology) representing a facility's read-synced status/location.
- **Document link:** A reference from an EPMP plan (F3) to an externally-stored document, either imported as a copy or linked live.

### Sub-features
- Read-only facility/asset status and location feed into the common operating picture (F2) as facility markers with provenance.
- Permission-aware import/link/sync of EOPs/SOPs/annexes/evidence documents from SharePoint or equivalent into the plan repository (F3), preserving source-system access permissions.
- No write-back of inventory, maintenance, or cost data (explicitly out of scope).

### Approved Adapter Pattern
Two separate adapter contracts: (1) a read-only facility/asset-status adapter per ERP/facility-management vendor family; (2) a permission-aware document adapter for SharePoint or equivalent document systems, reused by F3's import/link flow (S3.6).

**Facility/asset adapter contract (MVP depth):**
- **Poll request:** `GET {adapter}/facility-status?since={timestamp}`.
- **Normalized response:** `{ facility_id, name, location (GeoJSON point), status, source, as_of }` — no inventory, maintenance, or cost fields are requested or persisted in this MVP.

**Document adapter contract (MVP depth), shared with F3 S3.6:**
- **Browse request:** `GET {adapter}/documents?query={search}` — executed with the requesting user's own delegated credentials against the source system, so results never exceed what that user could already see in SharePoint.
- **Import request:** `POST {adapter}/documents/{id}/import` → returns document content/metadata for a point-in-time copy into F3's plan repository.
- **Link request:** `POST {adapter}/documents/{id}/link` → establishes a live reference; subsequent permission or content checks re-query the source system using the original importing user's delegated credentials (or re-validate on each access, per TechArch's chosen session model).

### Process
1. A scheduled background job (F10) polls the configured facility/asset system for status/location updates via the facility adapter, normalizing responses to include `source` and `as_of`.
2. Normalized facility data renders as facility markers (square shape, status-toned) on F2's operating picture, with `Provenance` attached; no inventory, maintenance, or cost fields are ever requested, stored, or displayed in this MVP.
3. When a planning user imports or links a document from a connected document system (F3 S3.6), the document adapter executes the browse/import/link request using that user's own delegated permissions — never a shared service account with broader access than the requesting user has.
4. For "Link live" documents, a periodic background check re-validates the source document's permissions and content; a permission downgrade at the source immediately restricts the EPMP-side link's visibility, and a content change is flagged to a named person for review rather than silently applied.
5. Feed/integration health for both the facility adapter and the document adapter is surfaced in F8's Integration Health view, declaring the source ERP/document system as authoritative for facility status and document content respectively.

### Inputs
- Facility adapter config: `erp_vendor` (string, required), `endpoint_url`, `auth_credentials` (required).
- Facility record (post-normalization): `facility_id`, `name`, `location`, `status`, `source`, `as_of`.
- Document import/link request: `document_external_id` (required), `mode` (enum: `import_copy`|`link_live`, required), `requesting_user_credentials` (delegated, required).

### Outputs
- Facility markers consumable by F2's operating picture.
- Imported/linked document content and metadata consumable by F3's plan repository.
- Integration-health status entries for both adapters in F8 S8.6.

### Validation
- The facility adapter must never request, store, or expose inventory, maintenance, or cost fields in this MVP — any such fields present in a vendor response are discarded at the adapter boundary, not merely hidden in the UI.
- Document browse/import/link operations must always execute under the requesting user's own delegated permissions; a user must never see or import a document in EPMP that they could not already access in the source system.
- A "Link live" document's permission state must be re-validated on a defined cadence (at minimum, before each render in F3's reading view) — stale permission caching that could expose a since-revoked document is not permitted.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Facility feed unreachable | 503 | FACILITY_FEED_UNREACHABLE | (Logged to integration health; last-known facility positions remain on the map, labeled with their age.) |
| Document import permission denied | 403 | IMPORT_PERMISSION_DENIED | "You don't have access to this document in the source system." |
| Linked document permission revoked at source | 403 | LINK_PERMISSION_REVOKED | "Access to this linked document was removed in [source system]. It's no longer visible here." |
| Document content changed at source (link live) | 200 (flagged) | LINKED_DOCUMENT_CHANGED | "This document changed in [source system]. Review before relying on the current EPMP copy." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §Asset/Facility/Document Systems for `GET /api/v1/integrations/facilities/status`, `GET /api/v1/integrations/documents/browse`, `POST /api/v1/integrations/documents/{id}/import`, `POST /api/v1/integrations/documents/{id}/link`, `GET /api/v1/integrations/facilities/health`, `GET /api/v1/integrations/documents/health`.

### Schema Surface (this feature)
Owns tables `facility_feed_config`, `facilities`, `document_system_config`, `document_links` — see `Y0d-schema-integration-geo.md` §Asset/Facility/Document Integration. Feeds F2 (facility markers) and F3 (`plans` document linkage).
