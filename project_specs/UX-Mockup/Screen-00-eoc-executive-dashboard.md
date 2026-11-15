## Screen Designs

### Screen: EOC / Executive Dashboard

**Purpose:** Give PER-01 (and any desk-based role) a shared, time-stamped summary of active incidents, tasks, and resource requests the moment they sign in.
**User Stories:** US-2.4, US-0.1, US-18 (persona landing — S18.1), JRN-01.1

#### Layout

Page pattern: **Dashboard**. Built inside the app shell (`SideNav` + header strip).

```
┌───────────────────────────────────────────────────────────────┐
│ SideNav │ Header: Breadcrumbs · global search Combobox ·       │
│ (240px) │ SyncStatus · alerts IconButton · Avatar              │
├─────────┼─────────────────────────────────────────────────────┤
│         │ PageHeader  h1 "Dashboard"  subtitle: jurisdiction   │
│         │   scope · actions: "Export summary" (secondary)      │
│         ├─────────────────────────────────────────────────────┤
│         │ Stat  Stat  Stat  Stat   (4 tiles, 1 row)            │
│         │ Active   Open    Pending   Notifications             │
│         │ incidents tasks  resource  pending ack               │
│         │                  requests                            │
│         ├─────────────────────────────────────────────────────┤
│         │ Card (8/12, "Operating picture")   │ Card (4/12)     │
│         │  MapCanvas thumbnail, status bar:   │ h3 "Recent      │
│         │  "As of 08:42 ET · Base layer:      │ activity"       │
│         │  agency GIS" · link to full map     │ Timeline        │
│         │                                     │ (cross-incident)│
│         │                                     ├─────────────────│
│         │                                     │ h4 "Task status"│
│         │                                     │ DonutChart      │
└─────────┴─────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Dashboard" page title | `PageHeader` |
| Primary | 4 `Stat` tiles (Active incidents, Open tasks, Pending resource requests, Notifications pending ack) | Row directly under `PageHeader` |
| Secondary (h3) | Operating-picture map thumbnail | Widest `Card`, 8 of 12 columns |
| Secondary (h3) | Recent cross-incident `Timeline` + task-status summary | Side `Card`, 4 of 12 columns |
| Tertiary (caption) | Data-age / source labels on every tile and the map status bar | Beneath each `Stat` value; map status bar |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | 4 `Stat` tiles populated; map thumbnail renders live markers; `Timeline` shows latest 5-8 entries | N/A |
| Loading | `Skeleton` blocks sized to each `Stat` tile and `Card` (>300ms); atomic replace, no layout shift | None required (silent) |
| Success | Live data with "as of HH:MM" caption refreshed via event-bus push | No toast (continuous, not a one-time action) |
| Error | `Alert tone="danger"` at top of content area: "Dashboard is taking longer than expected to load. Retry." (504 `DASHBOARD_TIMEOUT`) | Retry button in `Alert`; last-known `Stat` values remain visible, labeled with their age |
| Empty (first-use) | `EmptyState` inside the recent-activity `Card`: "No incidents yet" + "Create incident" action | Single action, one sentence |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Export summary" | `Button secondary` | Opens the readiness-summary export (Reports/F7 pattern); produces one-click PDF/CSV with timestamp+source per line |
| Operating-picture map thumbnail `Card` | `Card interactive` | Click navigates to full Operating Picture (`/operating-picture`) |
| `Stat` tiles | Static data display | Hover/focus reveals definition, period, source in a `Tooltip` |
| `Timeline` entries | Linked text | Click navigates to the source incident's workspace |
| Global search `Combobox` (header) | Search | Free-text search across incidents, plans, tasks, resources scoped to RBAC |

**Keyboard/focus:** `Stat` tiles and the map-thumbnail `Card` are each one Tab stop; 2px `focus-ring` on focus. `Timeline` entries are individually focusable links.
