### Screen: Incident List

**Purpose:** Browse, filter, and triage all incidents the user's role/jurisdiction can see.
**User Stories:** US-1.1, US-0.3 (states standard)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Incidents"  actions: "Create incident" (primary)│
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search TextField · filter Selects (severity,          │
│  activation, jurisdiction) · caption "1 to 25 of 140"           │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                             │
│  Table                                                           │
│   Name (linked) │ Type │ Severity (Badge) │ Jurisdiction │       │
│   Activation │ Opened │ Commander (Avatar+name)                 │
│   ─────────────────────────────────────────────────────────    │
│   Riverbend Flood │ Flood │ Critical (danger solid) │ ...       │
│   ...                                                            │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Incidents" | `PageHeader` |
| Primary | Name, Severity `Badge`, Activation columns | First columns, left-aligned, linked name |
| Secondary | Type, Jurisdiction, Opened, Commander | Remaining `Table` columns |
| Tertiary (caption) | Row count "1 to 25 of 140" | Toolbar, right-aligned |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Populated `Table`, selected row `brand-subtle` | N/A |
| Loading | 6 `Skeleton` rows sized to the final table layout | None |
| Empty (first-use) | `EmptyState`: "No incidents yet" + "Create incident" action | One sentence, one action |
| Empty (filtered) | `EmptyState`: "No incidents match" + "Clear filters" action | Visually distinct copy from first-use |
| Error | `Alert danger` above table + Retry; last-known rows stay visible, labeled with age | Retry restores full table |
| Bulk-selection | Toolbar replaced by bulk actions (e.g., "Export selected") | Selected rows highlighted `brand-subtle` |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Create incident" | `Button primary` | Navigates to `/incidents/new` |
| Row (Name column) | Linked text | Navigates to Incident Workspace |
| Filter `Select`s | Severity/activation/jurisdiction | Immediate filter, no save step |
| Search `TextField` | Free text | Filters table client/server-side |

**Keyboard/focus:** `Table` rows are reachable by Tab; `onRowClick` also triggers on Enter when a row is focused. Status columns always render as `Badge` (icon+word+color), never plain colored text.
