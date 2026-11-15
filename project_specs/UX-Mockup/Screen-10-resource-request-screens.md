### Screen: Resource Request List (standalone and embedded in Incident Workspace Resources tab)

**Purpose:** Track personnel/equipment/supply requests end to end so none is lost, duplicated, or left unacknowledged.
**User Stories:** US-4.3, JRN-03.1 (Receive Request, Track & Close)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Resource requests"  actions: "New resource       │
│   request" (primary)                                              │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search · filter (status, type)                           │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                                │
│  Table: Request (linked) │ Type │ Status (Badge) │ Quantity │     │
│   Requested by (Avatar) │ Incident │ Requested at                  │
└───────────────────────────────────────────────────────────────┘
```

#### States
Standard per S0.3. Status `Badge` vocabulary: Draft (neutral), Awaiting approval (warning), Approved (info), Fulfilled (success), Declined (danger).

---

### Screen: Create/Edit Resource Request (form)

**User Stories:** US-4.3

```
┌───────────────────────────────────────┐
│ PageHeader  h1 "New resource request"   │
├───────────────────────────────────────┤
│ Select     "Resource type"              │
│  (Personnel/Equipment/Supplies)         │
│ TextField multiline "Description"       │
│  (required, ≤1000 chars)                │
│ TextField  "Quantity" (numeric,         │
│  required, ≥1)                          │
│ Combobox   "Incident" (pre-filled)       │
│ DatePicker withTime zone "Needed by"     │
│ Select     "Requesting role"             │
├───────────────────────────────────────┤
│  [Cancel ghost]   [Submit request        │
│                     primary]             │
└───────────────────────────────────────┘
```
Submitting moves status `Draft` → `Awaiting approval`.

---

### Screen: Resource Request Detail (with Approval actions)

**Purpose:** Full lifecycle view — approve, decline, assign, fulfill — with visible approval history.
**User Stories:** US-4.4, JRN-03.1 (Approve, Assign, Track & Close)

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "2 generators — Riverbend Shelter"                │
│  status Badge "Awaiting approval" (warning)                       │
│  actions: "Approve" (primary) / "Decline" (secondary)             │
├───────────────────────────────────────────────────────────────┤
│ Full request details: type, description, quantity, incident,     │
│  needed-by, requesting role                                       │
├───────────────────────────────────────────────────────────────┤
│ h4 "Approval history"                                              │
│ Timeline-style entries:                                            │
│  Submitted 07:55 · Priya Nandan                                   │
│  Approved 08:10 · James Okafor                                    │
│  Assigned 08:15 · Logistics crew 2                                │
│  Fulfilled 09:30 · Priya Nandan                                   │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Decline clicked | `Modal` opens requiring `TextField` reason | 422 `DECLINE_REASON_REQUIRED` if left empty |
| Approved | Status `Badge` → "Approved" (info); optional assignment step prompted | "Assign" secondary action appears |
| Assigned | "Mark fulfilled" action becomes available | Status remains "Approved" until explicitly marked |
| Fulfilled | Status `Badge` → "Fulfilled" (success) | Approval history shows full chain |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Approve" | `Button primary` | Moves status to `Approved`; prompts optional assignment |
| "Decline" | `Button secondary` | Opens `Modal` requiring reason |
| "Mark fulfilled" | `Button primary` | Moves status to `Fulfilled` (only available once assigned) |

**Note:** Every status transition writes a `Timeline` entry on the owning incident; resource-request status publishes to the event bus so F2 (operating picture) and F7 (reporting) reflect current state without manual refresh.
