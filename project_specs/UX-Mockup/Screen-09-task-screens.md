### Screen: Task List (standalone and embedded in Incident Workspace Tasks tab)

**Purpose:** Give every unit of work a visible, accountable owner and status.
**User Stories:** US-4.1, US-4.2

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Tasks"  actions: "New task" (primary)            │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search · filter (status, owner, due-window)             │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                               │
│  Table: Task (linked) │ Status (Badge) │ Owner (Avatar+name) │   │
│   Due │ Incident │ Linked plan section                           │
└───────────────────────────────────────────────────────────────┘
```

When embedded in the Incident Workspace Tasks tab, the Incident column is omitted (implicit) and the "New task" action pre-fills the current incident.

#### States
Standard per S0.3: `Skeleton` rows; `EmptyState` "No tasks yet" + "New task" (first-use) / "No tasks match" + "Clear filters" (filtered); `Alert danger` + Retry on error. Bulk actions ("Mark done", "Reassign") replace the toolbar when rows are selected.

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "New task" | `Button primary` | Opens Create Task form |
| Row (Task column) | Linked text | Navigates to Task Detail |
| Status `Badge` | Icon+word+color | Open=info, In progress=brand, Awaiting approval=warning, Done=success, Overdue=danger |

---

### Screen: Create/Edit Task (form)

**User Stories:** US-4.1

```
┌───────────────────────────────────────┐
│ PageHeader  h1 "Create task"            │
├───────────────────────────────────────┤
│ TextField  "Title" (required)           │
│ TextField multiline "Description"       │
│  (optional)                             │
│ Combobox   "Owner" (person or role,     │
│  required)                              │
│ DatePicker withTime zone "Due"          │
│ Combobox   "Incident" (pre-filled when  │
│  created from a workspace)              │
│ Combobox   "Linked plan section"        │
│  (optional, pre-filled from template)   │
├───────────────────────────────────────┤
│  [Cancel ghost]    [Create task primary]│
└───────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| No owner selected on submit | `Alert danger`: "Assign an owner before creating this task." (422 `TASK_OWNER_REQUIRED`) | Focus moves to Owner field |
| Due date in the past | `Alert warning`: "This due time has already passed. Confirm this is a retroactive entry." (422 `DUE_DATE_PAST` without override) | Requires explicit confirmation checkbox to proceed |

---

### Screen: Task Detail

**User Stories:** US-4.2

```
┌───────────────────────────────────────────────┐
│ PageHeader  h1 "Deliver 2 generators to shelter"│
│  status Badge "In progress" (brand)             │
│  actions: "Submit for approval" / "Reopen"       │
│  (context-dependent on current state)            │
├───────────────────────────────────────────────┤
│ Description, Owner (Avatar), Due, Linked         │
│ incident/plan section                             │
├───────────────────────────────────────────────┤
│ h4 "Status history"                              │
│ Timeline (small, task-scoped)                    │
│  09:10 ● brand "Open → In progress" James Okafor │
└───────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Invalid transition attempted | `Alert danger`: "This task can't move to [status] from its current state." (409 `INVALID_STATUS_TRANSITION`) | Action buttons reflect only valid next states |
| Status-appropriate actions | Button set changes per current state | "Mark in progress" (Open) / "Submit for approval" (In progress, if approval-required) / "Reopen" (Done/Overdue) |

**Note:** Overdue transition is system-computed (visible via `Badge`), never a user-settable action.
