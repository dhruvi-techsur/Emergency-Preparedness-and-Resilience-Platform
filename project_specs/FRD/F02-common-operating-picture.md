## F2: Common Operating Picture

**Description:** Live incident dashboards, maps, weather/hazard layers, and facility/resource positions, giving every role a shared, time-stamped view of the current situation. This is the feature that makes "shared situational awareness" real rather than aspirational — every layer on the map declares its source and age, and degraded/offline conditions are a first-class, visibly labeled state rather than a failure.

**Terminology:**
- **Operating picture:** The map-centric shared view of current incidents, facilities, resources, and hazard overlays. Preferred UI term over "COP."
- **Layer:** A toggleable data overlay on the map (incidents, facilities, resources, weather/hazard feeds), each carrying a source and data-age label.
- **Schematic base map:** The offline/degraded fallback base map shown when real GIS tiles are unavailable, always labeled "Schematic base map, offline."
- **Marker:** A map symbol distinguished by shape (incident = diamond, facility = square, resource = triangle, shelter = circle) and tone (status color), outlined in `ink` for 3:1 contrast on any base.

### Sub-features
- Operating-picture map view (`MapCanvas` + `MapControls`, `LayerPanel`, `MapLegend`, `MapPopup`).
- Live EOC and executive dashboards (`Stat` tiles + `Card`-based layout).
- Weather/hazard overlay layers from approved external feeds (F12), off by default when unverified.
- Status bar showing data age and base-layer source on every map/dashboard view.
- Degraded/offline mode with schematic base map.

### Screens

**S2.1 — Operating Picture (Map)**
- Page pattern: Operating picture (map). `MapCanvas` at 8 of 12 columns at `bp-lg`+, `MapControls` top-right (zoom always shown; locate/layers/fullscreen as supported), `LayerPanel` opened from controls (4–8 layers; incidents first, reference layers last; unverified feeds off by default and labeled "Unverified"), `MapLegend` bottom-left (exactly the glyphs currently drawn), `MapPopup` for selected feature (title, status `Badge`, 2–3 facts, `Provenance`, 1–2 actions). Status bar: "As of HH:MM ET · Base layer: agency GIS" (or "Schematic base map, offline" when degraded). Right column (4 of 12 at `bp-lg`+): incident `Timeline` and task list for the currently selected/pinned incident. Below `bp-md`: map full width, list becomes a bottom sheet.
- Every marker is keyboard-focusable (Tab, Enter) and duplicated in a hidden text list for screen readers; closing a popup returns focus to its marker.

**S2.2 — EOC / Executive Dashboard**
- Page pattern: Dashboard. `PageHeader`, then a row of up to 4 `Stat` tiles (e.g., Active incidents, Open tasks, Pending resource requests, Notifications pending acknowledgment), then a 12-column grid of `Card`s (8/4 or 6/6 split). Widest card: operating-picture map thumbnail/mini-view linking to S2.1. Side `Card`: recent `Timeline` entries across all incidents in scope, plus a task-status summary. Executive-briefing variant (PER-05 executive facet, see F18): `display`-scale numbers for 1–3 headline KPIs only, no other decoration; each number shows definition/period/source on hover or in `caption`.

**S2.3 — Layer Panel (opened from MapControls)**
- `LayerPanel`: checklist of layers, each row showing label, source, "As of HH:MM" age, verified/unverified flag, optional count. Toggling a layer is immediate (no save step). Unverified weather/hazard layers (from F12) are visually dashed-outlined per `Provenance` conventions and off by default.

### Process
1. On load, the operating picture queries the current incident/facility/resource positions (F1, F4, F17) and renders them as markers on the base map obtained from F11's GIS read integration.
2. If the GIS base-layer feed is unavailable or times out, `MapCanvas` falls back to the schematic offline base map, labels it "Schematic base map, offline," and continues rendering EPMP markers on top — the page never fails to render.
3. The status bar computes and displays data age as the max staleness across currently visible layers and the base-layer source name.
4. User opens `LayerPanel` to toggle weather/hazard overlay layers (F12); unverified layers remain off until explicitly enabled, and stay visually flagged "Unverified" even when on, until a person validates the underlying feed.
5. Selecting a marker opens `MapPopup` with the record's key facts and `Provenance`; actions in the popup deep-link to the full record (incident workspace F1, resource detail F4, facility detail F17).
6. Dashboard `Stat` tiles and summary cards poll/subscribe to the same underlying incident/task/resource aggregates and update independent of the map view.
7. Resource-request status changes (F4) and notification delivery status (F5) surface on the operating picture and dashboard without requiring a page reload (event-bus-driven updates via F10).

### Inputs
- `jurisdiction_scope` (UUID[] or "all", from RBAC/F8): determines which incidents/facilities/resources are visible.
- `layer_toggles` ([{layer_id, enabled}], user session state): which overlay layers are currently on.
- `selected_marker_id` (UUID, optional): currently selected map feature.
- `map_viewport` (bounds, runtime): current pan/zoom state, not persisted server-side.

### Outputs
- Rendered map with incident/facility/resource/hazard markers, legend, and status bar (data age + base-layer source).
- Dashboard `Stat` tiles and summary cards reflecting current counts and statuses.
- Hidden text-list equivalent of all visible map markers for screen-reader access.

### Validation
- Every layer in `LayerPanel` must show a non-null `source` and `asOf` timestamp; a layer missing either is rejected at ingestion (F12/F11), not displayed silently without provenance.
- Unverified feeds must default to `checked: false` and must render the dashed "Unverified" treatment whenever toggled on.
- No more than 6 layers may be visible simultaneously without consolidation into `LayerPanel` groups.
- Status bar data-age calculation must reflect the stalest currently-visible layer, not an average.
- Markers must be distinguishable by shape and tone, never tone alone; selected markers must show a `focus-ring` halo.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| GIS base-layer feed unavailable | 200 (degraded) | GIS_FEED_UNAVAILABLE | "Schematic base map, offline. Live map layers will return when the GIS feed reconnects." |
| Hazard feed stale beyond threshold | 200 (flagged) | HAZARD_FEED_STALE | "[Layer name] data is more than [N] hours old. Verify before relying on it." |
| Marker data fetch failed | 500 | MARKER_FETCH_FAILED | "Couldn't load current positions. Retry." |
| Dashboard aggregate query timeout | 504 | DASHBOARD_TIMEOUT | "Dashboard is taking longer than expected to load. Retry." |
| Unauthorized jurisdiction scope requested | 403 | JURISDICTION_SCOPE_DENIED | "You don't have access to data for this jurisdiction." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Operating Picture for `GET /api/v1/operating-picture/markers`, `GET /api/v1/operating-picture/layers`, `GET /api/v1/dashboard/summary`.

### Schema Surface (this feature)
Reads `incidents`, `facilities` (F17), `resource_requests` (F4), `hazard_layers` (F12), `gis_feed_status` (F11) — no feature-owned tables; this is a read/aggregation and rendering layer. See `Y0d-schema-integration-geo.md` §Operating Picture Views.
