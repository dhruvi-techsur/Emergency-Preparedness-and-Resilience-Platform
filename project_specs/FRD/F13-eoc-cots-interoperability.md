## F13: EOC COTS Interoperability

**Description:** Governed interoperability with incumbent EOC platforms (WebEOC, Veoci, DisasterLAN) so agencies that retain these systems can use EPMP as a coordination/readiness layer rather than a forced replacement, per the product's dual commercial posture. Scoped to an MVP-appropriate record set via approved adapters, not full bidirectional sync of every board/widget type.

**Terminology:**
- **EOC COTS:** Commercial off-the-shelf incumbent EOC platform (e.g., WebEOC, Veoci, DisasterLAN).
- **Board:** An incumbent system's native term for a structured data table/form (e.g., a WebEOC "board"); mapped to EPMP's incidents/tasks/resource-requests where the record types align.
- **Conflict:** A state where the same logical record (e.g., an incident status) differs between EPMP and the external COTS system, requiring human resolution.

### Sub-features
- Approved adapter integration exchanging incidents, boards, resource requests, status, and activity logs with incumbent EOC COTS systems.
- Explicit record-authority declaration per integrated system, visible in integration-health view.
- Conflict surfacing with side-by-side values and "Keep EPMP value" / "Keep [external] value" actions.
- Integration-health view (system, last sync, direction, record authority, `SyncStatus`).

### Screens

**S13.1 — EOC COTS Integration Health & Conflict Resolution (embedded in F8 S8.6 Integration Health)**
- Shares F8's Integration Health `Table` row for each configured EOC COTS system (System name, Last sync, Direction, Record authority, `SyncStatus`). A conflict-flagged row expands to a side-by-side comparison: EPMP's current value and the external system's value, each labeled with its source and last-modified time, with "Keep EPMP value" / "Keep [external] value" actions (never a silent overwrite). This is not an independently-routed screen — it is the EOC-COTS-specific instance of F8 S8.6's shared conflict-row pattern, reached exclusively via `/admin/integration-health`.

### Approved Adapter Pattern
One normalized adapter contract per COTS vendor family, each translating the vendor's native API (WebEOC's REST/SOAP board API, Veoci's REST API, DisasterLAN's integration API) into a common internal "exchange record" representation covering exactly four record types in this MVP: Incident, Resource Request, Status Update, Activity Log Entry. Full per-vendor board/widget mapping beyond these four record types is explicitly out of scope.

**Adapter contract (MVP depth):**
- **Inbound sync:** `GET {adapter}/exchange-records?type={incident|resource_request|status|activity_log}&since={timestamp}` → normalized `{ external_id, type, payload, external_system, last_modified_external }`.
- **Outbound sync:** `POST {adapter}/exchange-records` with the EPMP-side record, translated by the adapter into the vendor's native board/field format.
- **Conflict detection:** on each sync cycle, if both EPMP and the external system have modified the same logical record since the last successful sync, the adapter returns both versions tagged `conflict: true` rather than picking one.

### Process
1. A scheduled or triggered sync job (F10) calls the adapter's inbound-sync endpoint for each of the four exchange-record types, scoped to records modified since the last successful sync.
2. For each inbound record, the system checks the record-authority registry (F10 S10.2): if the external system is authoritative for that record type, the inbound value is accepted and applied directly, with provenance noting the external source; if EPMP is authoritative, the inbound value is treated as a candidate and checked for conflict against the EPMP-side current value.
3. If both sides have diverged since the last sync, the record is flagged as a conflict and surfaced in F8 S8.6 / this feature's integration-health view with both values shown side by side; no automatic merge or overwrite occurs.
4. A named person (typically PER-01 or PER-05 admin facet) resolves the conflict by explicitly choosing "Keep EPMP value" or "Keep [external system] value"; the resolution is written back through the adapter to the external system if EPMP's value was kept, or applied locally if the external value was kept.
5. Outbound sync pushes EPMP-originated changes (new incidents, resource requests, status updates, activity-log entries) to the external system via the adapter's outbound contract, for record types where EPMP is authoritative or where bidirectional exchange is configured.
6. Integration health (last sync time, direction, record authority, current `SyncStatus`) is continuously updated and visible in F8 S8.6.

### Inputs
- Adapter config: `vendor` (enum: `WebEOC`|`Veoci`|`DisasterLAN`, required), `endpoint_url`, `auth_credentials` (vendor-specific, required).
- Sync record (either direction): `external_id`, `type` (enum, required), `payload`, `last_modified_external`/`last_modified_epmp`.
- Conflict resolution: `conflict_id` (UUID, required), `resolution` (enum: `keep_epmp`|`keep_external`, required), `resolved_by` (UUID, required).

### Outputs
- Synced incident/resource-request/status/activity-log records reflected in both systems (per declared record authority).
- Conflict entries in the integration-health view, pending resolution.
- Integration-health status (last sync, direction, authority, `SyncStatus`) in F8 S8.6.

### Validation
- Every sync cycle must declare, per record type, which system is authoritative (via F10's record-authority registry) before applying any inbound change — undeclared record types are not synced.
- A detected conflict must never be auto-resolved by any heuristic (e.g., "last write wins"); resolution always requires an explicit named-person choice.
- Outbound sync to the external system must only occur for record types where the record-authority registry permits an EPMP-originated write.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Adapter authentication failed | 401 | EOC_ADAPTER_AUTH_FAILED | "Connection to [vendor] failed. Check the integration credentials." |
| Sync detected a conflict | 200 (flagged) | EOC_SYNC_CONFLICT | "[Record] differs between EPMP and [vendor]. Choose which value to keep." |
| Outbound write rejected by external system | 502 | EOC_OUTBOUND_REJECTED | "[Vendor] rejected this update: [vendor error reason]." |
| Record type not in approved exchange set | 400 | EOC_RECORD_TYPE_UNSUPPORTED | "This record type isn't part of the approved exchange set with [vendor]." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §EOC COTS for `GET/POST /api/v1/integrations/eoc-cots/exchange-records`, `GET /api/v1/integrations/eoc-cots/conflicts`, `POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve`, `GET /api/v1/integrations/eoc-cots/health`.

### Schema Surface (this feature)
Owns tables `eoc_cots_config`, `eoc_cots_sync_log`, `eoc_cots_conflicts` — see `Y0d-schema-integration-geo.md` §EOC COTS. References `incidents` (F1), `resource_requests` (F4) as the EPMP-side records being exchanged.
