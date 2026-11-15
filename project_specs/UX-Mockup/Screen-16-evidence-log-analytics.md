### Screen: Evidence & Audit Log View

**Purpose:** Demonstrate preparedness and accountability via an append-only, exportable, filterable record — no edit or delete control exists anywhere, for any role.
**User Stories:** US-7.3, US-8.3, JRN-05.1 (Verify Audit Entry), JRN-05.2 (Drill Into Evidence)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Evidence & audit log"  actions: "Export as        │
│  CSV/PDF" (secondary)                                              │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: date range (two DatePickers) · actor Combobox ·          │
│  action/record-type filters                                        │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                                 │
│  Table: Timestamp (monospace/data) │ Actor (Avatar+name) │         │
│   Action │ Record type │ Record (linked)                           │
│   08:12:03 · Maria Alvarez · "Activation changed" ·                │
│    Incident · Riverbend flood response                              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Evidence & audit log" | `PageHeader` |
| Primary | Timestamp, Actor, Action columns | `Table`, monospace timestamps |
| Secondary | Record type, linked Record | Remaining columns |
| Tertiary | Date-range and actor filters | Toolbar |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Populated, filterable `Table` | N/A |
| Loading | `Skeleton` rows | None |
| Empty (filtered) | `EmptyState`: "No log entries match" + "Clear filters" | One action |
| Export failed | `Alert danger`: "This export didn't complete. Retry." (500 `EXPORT_FAILED`) | Retry action |
| No controls | **No edit or delete control exists anywhere in this view, for any role, including admins** | This is a hard design constraint, not a permission-dependent state |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Export as CSV/PDF" | `Button secondary` | Produces an export matching exactly the filtered view on screen |
| Record (linked) | Text link | Navigates to the source record (incident, plan, task, etc.) |
| Date-range `DatePicker`s | `withTime` optional | Filters the log |

**Keyboard/focus:** `Table` has `caption` (screen-reader title) and `th scope="col"` on every header. This view's immutability is enforced at the data layer — no UI affordance for edit/delete is ever rendered, for any role.

---

### Screen: Analytics & Reporting Dashboard

**Purpose:** Answer "are we more prepared?" with defined, traceable KPIs — never invented targets, never AI-activity-counts-as-outcomes.
**User Stories:** US-7.4, JRN-05.2 (Review KPIs, Drill Into Evidence)

#### Layout

Page pattern: **Analytics and reporting**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Analytics & reporting"                            │
├───────────────────────────────────────────────────────────────┤
│ Stat row (up to 4):                                                │
│  Median activation    Resource-request    Corrective-action       │
│  time                 fulfillment time    closure rate            │
│  "42 min"             "2.1 hrs"           "62%"                   │
│  caption: definition, period, source for each                      │
├───────────────────────────────────────────────────────────────┤
│ Card "Activation time trend" (title+subtitle: unit/period/source) │
│  LineChart (viz-1..6, marker shapes, hidden data table)            │
│                                                                     │
│ Card "Resource requests by type"                                    │
│  BarChart horizontal (patterns enabled)                             │
│                                                                     │
│ Card "Corrective actions by status"                                 │
│  DonutChart (tone=status)                                            │
├───────────────────────────────────────────────────────────────┤
│ Date range: two DatePickers · people/places: Combobox              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Analytics & reporting" | `PageHeader` |
| Primary | `Stat` row (≤4 KPIs) | Below `PageHeader` |
| Secondary (h3, in `Card` header) | Chart title + subtitle (unit/period/source) | Each `Card` |
| Tertiary | Hidden data-table alternative | Per chart, for screen readers |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| KPI with no configured target | Shows only current measured value, no target line | Never an invented target |
| KPI with configured target | `Stat` shows value + definition/baseline/owner/cadence on hover/caption | Explicit configuration required first |
| Large date-range timeout | `Alert danger`: "This date range is taking too long to load. Narrow it and retry." (504 `ANALYTICS_TIMEOUT`) | Retry + narrow-range suggestion |
| Loading | `Skeleton` sized to each `Stat`/chart | None |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Date-range `DatePicker`s | `withTime` optional | Re-queries all charts and `Stat`s |
| Chart hidden data table | Toggle/disclosure | Screen-reader and keyboard-accessible alternative to the visual chart |

**Note (AI governance):** AI-generated activity counts (e.g., "N drafts generated") are never presented as a business-outcome KPI on this dashboard — only decision-quality, time-saved, and error-rate metrics qualify, per US-7.4.
