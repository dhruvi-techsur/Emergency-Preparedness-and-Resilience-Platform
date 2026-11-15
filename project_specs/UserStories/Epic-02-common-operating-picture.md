## Epic 2: Common Operating Picture (F2)

Live incident dashboards, maps, weather/hazard layers, and facility/resource positions — a shared, time-stamped view of the current situation for every role.

### US-2.1: View incidents, facilities, and resources on a shared map
**As a** James Okafor / Incident Commander, **I want to** see incidents, facilities, and resource positions on one live map with status-coded markers, **so that** I have shared situational awareness instead of reconciling radio traffic and verbal reports.

**Acceptance Criteria:**
- [ ] `MapCanvas` renders incident (diamond), facility (square), resource (triangle), and shelter (circle) markers distinguished by shape and tone, never tone alone
- [ ] Each marker is keyboard-focusable (Tab, Enter) and duplicated in a hidden text list for screen readers
- [ ] Selecting a marker opens `MapPopup` with title, status `Badge`, 2–3 key facts, `Provenance`, and 1–2 deep-link actions
- [ ] Closing a popup returns focus to its originating marker
- [ ] Status bar shows "As of HH:MM ET · Base layer: [source]" reflecting the stalest currently-visible layer

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Toggle weather/hazard overlay layers with provenance
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** toggle weather/hazard overlay layers on the map and see each layer's source and data age, **so that** I only rely on current, verified information when advising command.

**Acceptance Criteria:**
- [ ] `LayerPanel` lists 4–8 layers (incidents first, reference layers last) each showing label, source, "As of HH:MM" age, and verified/unverified flag
- [ ] Unverified weather/hazard layers are off by default and show a dashed "Unverified" visual treatment even when toggled on
- [ ] Toggling a layer is immediate with no save step
- [ ] A layer missing `source` or `asOf` is never displayed (rejected at ingestion, not shown without provenance)
- [ ] No more than 6 layers are visible simultaneously without grouping/consolidation

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Operate the map in degraded/offline GIS conditions
**As a** Maria Alvarez / EOC Director, **I want to** continue using the operating picture even when the GIS base-layer feed is unavailable, **so that** a vendor outage never blocks situational awareness during an activation.

**Acceptance Criteria:**
- [ ] When the GIS feed is unavailable or times out, `MapCanvas` renders a schematic base map labeled "Schematic base map, offline"
- [ ] EPMP-authored markers (incidents, resources, hazards) continue to render on top of the schematic base map
- [ ] The operating-picture page never fails to render due to a GIS outage (200 degraded response, not an error page)
- [ ] Status bar reflects the degraded state clearly rather than showing a stale/misleading "as of" time silently

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: View a live EOC/executive dashboard summary
**As a** Maria Alvarez / EOC Director, **I want to** see a dashboard of active incidents, open tasks, and pending resource requests as soon as I sign in, **so that** I can assess the overall situation in minutes rather than piecing it together from calls.

**Acceptance Criteria:**
- [ ] Dashboard shows up to 4 `Stat` tiles (e.g., Active incidents, Open tasks, Pending resource requests, Notifications pending acknowledgment)
- [ ] A 12-column grid of `Card`s includes an operating-picture map thumbnail linking to the full map view
- [ ] A side `Card` shows recent Timeline entries across all in-scope incidents plus a task-status summary
- [ ] Dashboard `Stat` tiles and summary cards update via event-bus-driven refresh without requiring a manual page reload
- [ ] A dashboard aggregate query timeout shows a clear retry message (504 DASHBOARD_TIMEOUT) rather than a blank screen

**Priority:** P0 | **Feature Ref:** F2
