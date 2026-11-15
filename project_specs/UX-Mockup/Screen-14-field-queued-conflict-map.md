### Screen: Queued Submissions View

**Purpose:** Confirm nothing was silently lost — every item resolves to synced, conflict, or flagged-failed.
**User Stories:** US-6.3, JRN-04.1 (Stay Queued, Reconnect)

#### Layout

```
┌───────────────────────────────┐
│ SyncStatus: ● syncing           │
├───────────────────────────────┤
│  h1 "Queued submissions"        │
│                                 │
│  Card (per item, label/value):  │
│   "Shelter damage photo"        │
│   Badge "Queued" (SyncStatus    │
│    styling)                     │
│   Captured: Nov 14, 08:12       │
│   [Delete] (ghost, only before  │
│    sync starts)                 │
│                                 │
│  Card:                          │
│   "Task status: Mark done"      │
│   Badge "Synced" (success)      │
│   Synced: Nov 14, 08:20          │
├───────────────────────────────┤
│ Bottom bar: Tasks│Report│Map│   │
│  Profile                        │
└───────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Queued | `Badge` "Queued" via `SyncStatus` styling | Tapping shows full content read-only, no edit capability |
| Syncing | `SyncStatus` header shows `syncing`; items transition in creation order | Each item updates individually as it resolves |
| Synced | `Badge` "Synced" (success) | `Timeline` entry appended on the EOC side noting the sync, preserving original capture timestamp |
| Conflict | `Badge` "Conflict" (warning/danger) | Tap navigates to Sync Conflict Resolution |
| Failed | `Badge` "Failed" (danger) + reason + retry option | Never silently dropped |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Delete" (per queued item) | `Button ghost size="lg"` | Removes an item created in error, only available before it syncs |
| Conflict row | `Card interactive` | Tap opens Sync Conflict Resolution |

---

### Screen: Sync Conflict Resolution

**Purpose:** Never silently overwrite a field responder's update or the EOC's — always surface to a named person.
**User Stories:** US-6.4, JRN-04.1 (Resolve Conflict)

#### Layout

```
┌───────────────────────────────┐
│ SyncStatus: ● conflict           │
├───────────────────────────────┤
│  h1 "Resolve conflict"           │
│                                 │
│  h4 "Your version"               │
│  Status: In progress             │
│  Notes: "2 generators delivered" │
│  (highlighted: differs)          │
│                                 │
│  h4 "Current EOC version"        │
│  Status: Done                    │
│  Notes: "1 generator delivered"  │
│  (highlighted: differs)          │
│                                 │
├───────────────────────────────┤
│ [Keep EOC version lg]            │
│ [Keep my version lg primary]     │
└───────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Resolve conflict" | Page title |
| Primary (h4) | "Your version" vs "Current EOC version" | Side-by-side (stacked on narrow mobile) |
| Secondary | Differing fields highlighted | Within each version block |
| Primary actions | "Keep my version" / "Keep EOC version" | Bottom, both `size="lg"`, no default/pre-selected choice |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Unresolved | Both versions shown, no action pre-selected | Explicit named-person choice required — no auto-merge |
| Resolved | Screen closes; `Timeline` entry written | Notes which version was kept and by whom |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Keep my version" | `Button primary size="lg"` | Commits the field responder's version |
| "Keep EOC version" | `Button secondary size="lg"` | Commits the EOC's version |

**Keyboard/focus:** No default/automatic resolution path exists in the UI; both buttons present equal visual weight except standard primary/secondary distinction, never implying one choice is "correct."

---

### Screen: Field Map (lightweight operating-picture view)

**Purpose:** A constrained, offline-capable map for field context with the single reporting action always available.
**User Stories:** US-6.1, US-2.3 (shared offline pattern)

#### Layout

```
┌───────────────────────────────┐
│ SyncStatus: ● offline           │
├───────────────────────────────┤
│  MapCanvas (offline=true):      │
│   "Schematic base map, offline" │
│   label, markers still render   │
│   queued reports shown as       │
│   pending markers (SyncStatus   │
│   styling: dashed outline)       │
├───────────────────────────────┤
│ Bottom action bar: [Report      │
│  observation lg primary]        │
│ Bottom bar: Tasks│Report│Map│   │
│  Profile                        │
└───────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Offline | Schematic base map, EPMP markers still render on top | Status bar labels degraded state explicitly |
| Queued report marker | Dashed outline per `SyncStatus` pending-state styling | Distinguishes from confirmed/synced markers |

**Keyboard/focus:** Every marker keyboard-focusable; "Report observation" is always the single primary action in the bottom bar regardless of map state.
