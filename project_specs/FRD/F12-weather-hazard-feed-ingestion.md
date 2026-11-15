## F12: Weather & Hazard Feed Ingestion

**Description:** Read-only ingestion of NOAA/NWS/USGS and similar hazard data feeds as common-operating-picture overlay layers (F2), with full provenance preserved. The curated, correlated risk-intelligence module is explicitly deferred.

**Terminology:**
- **Hazard feed:** An external, read-only data source (NOAA/NWS/USGS) providing forecasts, warnings, events, or hazard locations with confidence metadata.
- **Hazard layer:** The EPMP-side representation of ingested hazard-feed data, rendered as a toggleable overlay on the operating picture (F2).

### Sub-features
- Scoped, read-only ingestion of forecasts, warnings, events, and hazard locations with confidence metadata.
- Every ingested hazard fact carries source, timestamp, confidence via `Provenance`.
- Feeds surface as toggleable layers in `LayerPanel`, off by default when unverified.
- Feed ingestion runs as a background job with retry/backoff on outage.

### Approved Adapter Pattern
One normalized adapter contract per feed family (NOAA/NWS alerts API, USGS earthquake/hazard feeds), each translating the vendor's native format (CAP-XML for NWS alerts, GeoJSON for USGS) into a common internal hazard-event representation. Vendor-specific parsing logic is a TechArch concern; this FRD specifies the external contract and ingestion behavior only.

**Adapter contract (MVP depth):**
- **Poll request:** scheduled background job calls `GET {adapter}/hazard-events?feed={noaa|usgs|...}&since={timestamp}`.
- **Normalized response:** `{ feed, events: [{ id, type, severity, geometry (GeoJSON), confidence, source, issued_at, expires_at }] }`.
- Each normalized event is persisted with `verified: false` by default until an operator marks it reviewed, per the Provenance convention — ingestion never auto-verifies a feed.

### Process
1. A scheduled background job (F10) polls each configured hazard feed at its defined interval, requesting events since the last successful poll.
2. The adapter normalizes vendor-specific responses (CAP-XML, GeoJSON, etc.) into the common hazard-event representation, attaching `source`, `issued_at`, and `confidence` to every event.
3. Normalized events are persisted as hazard layers with `verified: false`; they appear in F2's `LayerPanel` as toggleable, off-by-default, visually flagged "Unverified" layers.
4. A person (typically PER-01 or PER-03) reviews an unverified hazard layer against other evidence and may mark it `verified: true`, at which point the dashed "Unverified" treatment is removed from the layer — this is a deliberate human action, never automatic.
5. If a feed is unreachable, the job retries with exponential backoff and logs the outage to F8's Integration Health view; the operating picture continues to render using the last successfully ingested data, labeled with its age, rather than blocking.
6. Ingested hazard events also feed F9's signal-triage/clustering job as raw input for candidate-signal detection.

### Inputs
- Feed configuration: `feed_name` (enum: `NOAA`|`NWS`|`USGS`|..., required), `poll_interval` (seconds, required), `endpoint_url` (required).
- Ingested event (post-normalization): `type`, `severity`, `geometry` (GeoJSON), `confidence` (enum), `source`, `issued_at`, `expires_at`.
- Verification action: `hazard_layer_id` (UUID, required), `verified_by` (UUID, required — named person).

### Outputs
- Hazard-layer records consumable by F2's `LayerPanel` and `MapCanvas`.
- Raw hazard events consumable by F9's signal-triage job.
- Feed-health status (last poll, success/failure, backoff state) in F8's Integration Health view.

### Validation
- An ingested event missing `source`, `issued_at`, or `confidence` is rejected (per F10's provenance enforcement), not persisted as a usable layer.
- `verified` can only be set `true` by an explicit, named-person action — no automated promotion from unverified to verified under any configuration.
- Expired events (`expires_at` in the past) must be visually distinguished or removed from the active `LayerPanel` list, never shown as current without an age indicator.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Feed unreachable | 503 | HAZARD_FEED_UNREACHABLE | (Logged to integration health; F2 shows last-known data labeled with age, no blocking error to end users.) |
| Feed returns malformed data | 502 | HAZARD_FEED_MALFORMED | "[Feed name] returned data that couldn't be processed and was skipped this cycle." |
| Verification attempted by non-named/service account | 403 | VERIFICATION_REQUIRES_NAMED_USER | "A signed-in person must verify this hazard layer." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §Hazard Feeds for `GET /api/v1/integrations/hazard-feeds/events`, `POST /api/v1/hazard-layers/{id}/verify`, `GET /api/v1/integrations/hazard-feeds/health`.

### Schema Surface (this feature)
Owns tables `hazard_feed_config`, `hazard_layers`, `hazard_feed_events` — see `Y0d-schema-integration-geo.md` §Hazard Feeds. Feeds F2 (operating picture) and F9 (signal triage).
