### Screen: Field Home (bottom-nav, mobile breakpoint)

**Purpose:** Diego's entry point into the field app — always connectivity-aware, always one tap from reporting.
**User Stories:** US-6.1, JRN-04.1 (Check Tasks, Stay Queued)

#### Layout

Page pattern: **Field mobile**. Single column, `body-lg`, all controls `size="lg"` (44px).

```
┌───────────────────────────────┐
│ SyncStatus: ● offline          │ ← pinned top, icon+word+color,
│  "3 queued"                    │   always visible, never hidden
├───────────────────────────────┤
│  h1 "Field home"                │
│                                 │
│  h3 "Today's tasks"            │
│  Card: "Check shelter status —│
│   Riverbend Elementary"        │
│   Badge "Open" (info)  Due 2pm │
│                                 │
│  Card: "Deliver sandbags —     │
│   Shelter site 2"               │
│   Badge "In progress" (brand)  │
│   Due 3pm                       │
│                                 │
├───────────────────────────────┤
│ Bottom bar (4 destinations):    │
│  [Tasks] [Report] [Map]         │
│  [Profile]                      │
│  Bottom action bar: "Report     │
│  observation" (primary, lg)    │
└───────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | `SyncStatus` connectivity state | Pinned top of every mobile screen, before all content |
| Primary (h1) | "Field home" | Page title |
| Secondary (h3) | Today's tasks (card-per-row) | Below title |
| Primary action | "Report observation" | Bottom action bar, single primary button |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Online | `SyncStatus` state=`online`, green check icon + word "Online" | N/A |
| Offline | `SyncStatus` state=`offline`, icon + word "Offline" + queued count in `detail` | "3 queued" shown inline |
| Syncing | `SyncStatus` state=`syncing`, spinner icon + word "Syncing" | Transient, updates as items resolve |
| Conflict | `SyncStatus` state=`conflict`, alert icon + word "Conflict" | Tapping navigates to Sync Conflict Resolution |
| Loading tasks | `Skeleton` card blocks | None |
| Empty | `EmptyState`: "No tasks assigned yet" + no action (informational) | One sentence only |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| `SyncStatus` pill | Tappable | Navigates to Queued Submissions View |
| Bottom bar destinations | 4 fixed items | Tasks / Report / Map / Profile, role-dependent per F18 |
| "Report observation" | `Button primary` `size="lg"` | Bottom action bar; navigates to Report Observation form |

**Keyboard/focus:** Every action has a visible button equivalent — no hover-only or gesture-only interaction anywhere on this screen. Touch targets ≥44px throughout.

---

### Screen: My Tasks (field view)

**Purpose:** One-tap status updates from the field, zero multi-step forms.
**User Stories:** US-6.1, US-4.2, JRN-04.1 (Check Tasks, Update Status)

#### Layout

```
┌───────────────────────────────┐
│ SyncStatus: ● online            │
├───────────────────────────────┤
│  h1 "My tasks"                  │
│                                 │
│  Card (per task, label/value    │
│   pairs, not a dense table):    │
│   "Check shelter status"        │
│   Badge "Open" (info)           │
│   Due: 2:00 PM                  │
│   [Start lg]  (one-tap button)  │
│                                 │
│  Card:                          │
│   "Deliver sandbags"            │
│   Badge "In progress" (brand)   │
│   Due: 3:00 PM                  │
│   [Mark done lg]                │
├───────────────────────────────┤
│ Bottom bar: Tasks│Report│Map│   │
│  Profile                        │
└───────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Cards populated, cached locally | Loads instantly regardless of connectivity |
| Offline update | Tap "Mark done" while offline | `SyncStatus` queued count increments immediately; task card shows "Queued" `Badge` overlay |
| Loading | `Skeleton` card blocks sized to final card layout | None |
| Empty | `EmptyState`: "No tasks assigned yet" | Informational, no action |
| Error | `Alert danger` + Retry; last-known cached tasks remain visible | Labeled with cache age |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Start" / "Mark done" | `Button primary size="lg"` (44px) | Single-tap status transition; writes locally if offline, queues for sync |
| Task card | `Card interactive` | Tap opens task detail (same card content, read more) |

**Keyboard/focus:** All buttons are `size="lg"` (44px minimum); card layout (not dense table) per the field-mobile responsive rule under `bp-sm`.
