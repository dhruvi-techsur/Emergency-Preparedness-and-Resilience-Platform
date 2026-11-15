## F15: CAD / 911 Integration

**Description:** Read integration with CAD/911 and public-safety dispatch systems to bring approved incident and dispatch status into EPMP's incident record, without EPMP becoming a dispatch system of record.

**Terminology:**
- **CAD:** Computer-Aided Dispatch — the public-safety system of record for 911/dispatch events.
- **Dispatch status:** The CAD-side lifecycle state of a dispatched unit/event (e.g., dispatched, en route, on scene, cleared).

### Sub-features
- Vendor-authorized, read-oriented event/API integration surfacing dispatch status against an EPMP incident.
- Record authority for dispatch data remains with CAD/911; EPMP references and displays it with provenance, never edits it.
- Integration-health visibility consistent with F13's pattern.

### Approved Adapter Pattern
One normalized adapter contract per CAD vendor, read-only, translating vendor-specific dispatch events into a common internal representation linked to an EPMP incident by a configured matching key (e.g., shared incident number, geographic/time proximity match confirmed by a human).

**Adapter contract (MVP depth):**
- **Poll/subscribe request:** `GET {adapter}/dispatch-events?since={timestamp}` or vendor-native webhook subscription where supported.
- **Normalized response:** `{ external_event_id, cad_incident_number, status, unit_ids, location (GeoJSON), updated_at, source }`.
- No write/update operations exist in this adapter contract — it is strictly read-only, consistent with CAD remaining the system of record for dispatch data.

### Process
1. A background job (F10) polls or subscribes to the configured CAD system's dispatch-event feed via the adapter.
2. Normalized dispatch events are matched to an EPMP incident, either automatically (shared incident number configured) or via a human-confirmed match (geographic/time proximity suggested, person confirms the link).
3. Matched dispatch status displays within the linked incident's workspace (F1) as a read-only panel/card, always carrying `Provenance` (source: CAD system name, timestamp) — never editable from EPMP.
4. If a user attempts to edit dispatch-status data from within EPMP, the system blocks the edit and explains that CAD/911 is authoritative for this record type (consistent with F10's record-authority enforcement).
5. Feed health (last poll/subscription event, error count) is surfaced in F8's Integration Health view, declaring CAD as authoritative for all dispatch-status record types.

### Inputs
- Adapter config: `vendor` (string, required), `endpoint_url`/`webhook_config` (required), `auth_credentials` (vendor-specific, required), `incident_matching_strategy` (enum: `shared_number`|`human_confirmed`, required).
- Dispatch event (post-normalization): `external_event_id`, `cad_incident_number`, `status`, `unit_ids`, `location`, `updated_at`, `source`.

### Outputs
- Read-only dispatch-status panel within the linked incident workspace (F1).
- Integration-health status entry (F8 S8.6) declaring CAD as authoritative for dispatch records.

### Validation
- No API endpoint in this feature accepts a write/update to dispatch-status data — the contract is read-only by design, enforced at the route level (no PATCH/PUT/DELETE routes exist for this resource).
- A dispatch event with no plausible incident match (neither shared number nor human-confirmed) remains unlinked and is not force-attached to an unrelated incident.
- Every displayed dispatch-status fact must carry its CAD-system source and timestamp via `Provenance`.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| CAD feed/webhook unreachable | 503 | CAD_FEED_UNREACHABLE | (Logged to integration health; incident workspace shows last-known dispatch status labeled with its age.) |
| Edit attempted on CAD-authoritative data | 403 | CAD_RECORD_READ_ONLY | "Dispatch status is maintained by [CAD system] and can't be edited here." |
| Dispatch event has no matching incident | 200 (unlinked) | CAD_EVENT_UNMATCHED | (Logged for review; not attached to any incident until matched.) |

### API Surface (this feature)
See `Y1d-api-integrations.md` §CAD/911 for `GET /api/v1/integrations/cad/dispatch-events`, `GET /api/v1/incidents/{id}/dispatch-status`, `GET /api/v1/integrations/cad/health`.

### Schema Surface (this feature)
Owns tables `cad_config`, `cad_dispatch_events` — see `Y0d-schema-integration-geo.md` §CAD/911. References `incidents` (F1) via the matching link, never writes to `incidents` fields it doesn't own.
