### Screen: Executive Briefing Dashboard (PER-05 Executive Facet)

**Purpose:** Answer "are we more prepared than last quarter?" using 1–3 headline KPIs with zero operational decoration, for Dana Whitfield's executive-sponsor facet.
**User Stories:** US-7.4, JRN-05.2, S18.5 (executive facet)

#### Layout

Page pattern: **Dashboard (executive-briefing variant)**.

```
┌───────────────────────────────────────────────────────────────┐
│ SideNav (executive facet: Executive dashboard, Reports)        │
│ Header: facet toggle (Admin / Executive) · SyncStatus · Avatar │
├───────────────────────────────────────────────────────────────┤
│ PageHeader  h1 "Executive dashboard"  subtitle: "Operational   │
│   Period ... · Quarter ending ..."  actions: "Export briefing" │
├───────────────────────────────────────────────────────────────┤
│         display            display            display         │
│    Readiness posture   Incident outcomes  Corrective-action    │
│         "87%"                "14 closed"     closure rate       │
│                                                  "62%"           │
│  caption: definition, period,  caption: ...    caption: ...     │
│  source on hover                                                │
├───────────────────────────────────────────────────────────────┤
│  Link: "View full reporting" (secondary, → Analytics Dashboard)│
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Executive dashboard" | `PageHeader` |
| Primary (`display` 40/48) | 1–3 headline KPI numbers only | Centered row, nothing decorative around them |
| Secondary (caption) | Definition, period, source per KPI | On hover or always-visible `caption` beneath each number |
| Tertiary | "View full reporting" drill-down link | Below the KPI row, `secondary` link styling |

No charts, no `Card` grid, no additional panels — the executive-briefing pattern is explicitly decoration-free per the design system's dashboard pattern.

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | 1–3 `display`-scale numbers with captions | N/A |
| Loading | `Skeleton` blocks sized to each `display` number | None |
| Success | Numbers reflect current quarter data | N/A (no toast; persistent view) |
| Error | `Alert danger`: "This date range is taking too long to load. Narrow it and retry." (504 `ANALYTICS_TIMEOUT`) | Retry action in `Alert` |
| Empty | Not applicable — if no KPI has been configured with definition/baseline/owner/cadence, the tile shows only the current measured value, never an invented target |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Facet toggle (Admin/Executive) | `Switch`/`Select` in header | Switches `SideNav` and landing view between admin console and executive briefing — same login, no re-authentication |
| "Export briefing" | `Button secondary` | Produces leadership-ready packet with evidence links intact |
| "View full reporting" | `Button ghost` / link | Navigates to `/reports/analytics` (F7 S7.5) for drill-down |
| KPI number | Static, with `Tooltip` on hover/focus | Reveals definition/baseline/period/source — never a bare number without this context |

**Keyboard/focus:** Each KPI number and its caption form one focusable unit (Tab stop) with `focus-ring`; `Tooltip` content is also reachable via keyboard focus, never hover-only.

**Accessibility note:** This is the only screen in EPMP using `display` type scale; it appears exactly once per view, satisfying the "one `display` per view" rule.
