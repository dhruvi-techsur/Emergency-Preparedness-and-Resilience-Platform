### Screen: Operating Picture (Map)

**Purpose:** Shared, time-stamped situational awareness across incidents, facilities, resources, and hazard layers for every role.
**User Stories:** US-2.1, US-2.2, US-2.3, JRN-02.1 (Monitor Operating Picture), JRN-01.2 (Monitor)

#### Layout

Page pattern: **Operating picture (map)**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Operating picture"  subtitle: jurisdiction     │
│   scope                                                        │
├───────────────────────────────────────┬───────────────────────┤
│  MapCanvas (8 of 12 columns, bp-lg+)   │ Right column (4/12):  │
│   ┌─────────────────────────────┐     │  h3 "Selected incident"│
│   │ MapControls (top-right):    │     │  Timeline (for pinned/ │
│   │  zoom, locate, layers,      │     │  selected incident)    │
│   │  fullscreen                 │     │                        │
│   │                             │     │  h4 "Tasks"            │
│   │  markers: ◆ incident        │     │  Table (task list,     │
│   │  ■ facility ▲ resource      │     │  scoped to selection)  │
│   │  ● shelter — shape+tone,    │     │                        │
│   │  ink outline 2px            │     │                        │
│   │                             │     │                        │
│   │ MapLegend (bottom-left):    │     │                        │
│   │  exactly the glyphs drawn   │     │                        │
│   │                             │     │                        │
│   │ MapPopup (on selection):    │     │                        │
│   │  title, status Badge,       │     │                        │
│   │  2-3 facts, Provenance,     │     │                        │
│   │  1-2 actions                │     │                        │
│   └─────────────────────────────┘     │                        │
│   Status bar: "As of 08:42 ET ·       │                        │
│   Base layer: agency GIS"             │                        │
│   (or "Schematic base map, offline")  │                        │
├───────────────────────────────────────┴───────────────────────┤
│  LayerPanel (opened from MapControls, overlay): 4-8 layers,    │
│  incidents first, reference last; source + "As of HH:MM" +     │
│  verified/unverified flag per row                              │
└───────────────────────────────────────────────────────────────┘
```

Below `bp-md`: map is full width; the right-column list becomes a bottom sheet.

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Operating picture" | `PageHeader` |
| Primary | Live markers (incident/facility/resource/shelter) | `MapCanvas`, 8 of 12 columns |
| Secondary (h3) | Selected/pinned incident `Timeline` + task list | Right column, 4 of 12 |
| Secondary | `LayerPanel` (source, data age, verified flag) | Overlay from `MapControls` |
| Tertiary (caption) | Status bar data age + base-layer source | Bottom of `MapCanvas` |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Live markers + status bar "As of HH:MM ET · Base layer: agency GIS" | N/A |
| Loading | `Skeleton` sized to `MapCanvas` and the right-column `Timeline`/`Table` | None |
| Degraded/offline (GIS feed unavailable) | `MapCanvas` renders schematic base map labeled "Schematic base map, offline"; EPMP markers continue rendering on top | Status bar clearly reflects degraded state, never a stale "as of" silently |
| Error (marker fetch failed) | `Alert danger` above the map: "Couldn't load current positions. Retry." (500 `MARKER_FETCH_FAILED`) | Retry action; last-known markers remain visible |
| Empty | `EmptyState` in right-column `Timeline`/task panel: "No incident selected" + "Select a marker to see details" | One action |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Map markers | Keyboard-focusable (Tab, Enter) | Opens `MapPopup`; also duplicated in a hidden text list for screen readers |
| `MapPopup` close | `IconButton` (label "Close") | Closing returns focus to the originating marker |
| `MapControls` (zoom/locate/layers/fullscreen) | `IconButton` group | Only handlers that are supported render; zoom always shown |
| `LayerPanel` toggle | `Checkbox` per layer row | Immediate toggle, no save step; unverified layers stay dashed "Unverified" even when on |
| `MapPopup` deep-link actions | `Button secondary`/link | Navigate to full incident workspace, resource detail, or facility detail |

**Keyboard/focus:** Pan/zoom operable via keyboard in the underlying map engine plus `MapControls`; every marker is a Tab stop with `focus-ring` halo on selection; no marker relies on tone alone (shape + 2px `ink` outline on every marker).

**Responsive:** Below `bp-md`, map is full width, `LayerPanel`/list content collapses to a bottom sheet; `MapLegend` is collapsible on mobile.
