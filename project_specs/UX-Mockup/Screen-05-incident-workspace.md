### Screen: Incident Workspace (Tabs: Timeline / Tasks / Resources / Reports)

**Purpose:** The single command surface for an active incident — command roles, timeline, tasking, resourcing, and reporting in one place.
**User Stories:** US-1.4, US-1.2, US-1.3, US-1.5, US-1.6, JRN-02.1 (full lifecycle)

#### Layout

Page pattern: **Incident workspace**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Riverbend flood response"                      │
│   severity Badge (Critical, danger solid) · subtitle:          │
│   "Jurisdiction: Riverbend County · Opened Nov 12, 2026"        │
│   actions: "Generate SITREP" (secondary)  "New task" (primary) │
├───────────────────────────────────────────────────────────────┤
│ Tabs: Timeline │ Tasks │ Resources │ Reports   (fixed order)    │
├───────────────────────────────────────┬───────────────────────┤
│  Active tab content (2/3 width)        │ Right column (1/3):   │
│                                         │                        │
│  TIMELINE TAB:                         │ Card "Command roles"  │
│   Timeline component, newest-first:    │  Avatar + role + name │
│   08:42 ● brand  "Incident created"    │  "Reassign" per row:  │
│    meta: James Okafor · EPMP           │  Incident Commander:  │
│   08:50 ● warning "Activation:         │   James Okafor        │
│    Partial → Full"                     │  Planning: Priya N.   │
│    meta: Maria Alvarez · EPMP          │  Logistics: (unassigned│
│   09:05 ● brand "Decision: pre-position│   — "Assign" shown)   │
│    second generator" meta: James Okafor│                        │
│   09:12 ● info "AI-drafted narrative   ├───────────────────────┤
│    approved" meta: James Okafor ·      │ Card "Map thumbnail"  │
│    AI-sourced, reviewed                │  MapCanvas mini-view, │
│                                         │  scoped to this       │
│  TASKS TAB: embedded Table (F4 S4.1)   │  incident, links to   │
│   scoped to this incident; "New task"  │  full operating       │
│                                         │  picture              │
│  RESOURCES TAB: embedded Table (F4     │                        │
│   S4.4) scoped to this incident        │                        │
│                                         │                        │
│  REPORTS TAB: list of SITREPs/ICS      │                        │
│   forms/AAR with Status Badge          │                        │
│   (Draft/Approved), "Generate" actions │                        │
└─────────────────────────────────────────┴───────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | Incident name | `PageHeader` |
| Primary | Severity `Badge`, activation status | `PageHeader` status slot |
| Primary (h3/tab) | Active tab content (Timeline/Tasks/Resources/Reports) | Left two-thirds |
| Secondary (h3) | Pinned command-roles `Card` | Right column, top |
| Secondary (h3) | Map-thumbnail `Card` | Right column, below command roles |
| Tertiary | Timeline entry meta (actor + source), AI-sourced labels | Below each `Timeline` entry title |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | All 4 tabs populated, command roles filled | N/A |
| Loading | `Skeleton` sized to `Timeline`/`Table`/command-roles `Card` | None |
| Empty (Timeline, first-use) | Cannot occur — "Incident created" entry is always auto-written on creation | N/A |
| Empty (Tasks/Resources tab, first-use) | `EmptyState`: "No tasks yet" + "New task" action | One action |
| Empty (Command role unassigned) | Row shows role name + "Assign" action instead of `Avatar` | Visually distinct from filled rows |
| Error | `Alert danger` + Retry within the affected tab/panel only; other panels unaffected | Last-known data visible, labeled with age |
| Timeline write failed | `Alert danger`: "This action didn't record to the incident timeline. Retry before continuing." (500 `TIMELINE_WRITE_FAILED`) | Blocks continuing until retried |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Generate SITREP" | `Button secondary` | Navigates to SITREP Generator |
| "New task" | `Button primary` | Opens Create Task form, pre-filled with this incident |
| Activation-level control (in `PageHeader` status) | `Select`/`Badge` control | Opens Activation Level Change `Modal` |
| "Reassign" (per command-role row) | `Button ghost` | Opens Command Role Assignment `Modal` |
| `Tabs` | `Tabs` component | Left/Right arrow key navigation; same fixed order on every incident |
| Map-thumbnail `Card` | `Card interactive` | Links to full Operating Picture scoped to this incident |

**Keyboard/focus:** `Tabs` use Left/Right arrows between tab headers; each tab panel has `role="tabpanel"`. `Timeline` entries are expandable (optional `children`) via a disclosure control with visible focus state.
