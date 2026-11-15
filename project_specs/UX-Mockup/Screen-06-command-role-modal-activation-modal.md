### Screen: Command Role Assignment (Modal)

**Purpose:** Assign a named person to an ICS command role with automatic accountability capture.
**User Stories:** US-1.2

#### Layout

```
┌─────────────────────────────────────┐
│ Modal (480px)                        │
│ title: "Assign Incident Commander"   │
├─────────────────────────────────────┤
│ Combobox "Search personnel"          │
│  (sourced from F16 roster, else      │
│  manual entry)                       │
│ Current assignee (if reassigning):   │
│  Avatar + name shown inline          │
├─────────────────────────────────────┤
│         [Cancel]  [Assign role       │
│                     primary]         │
└─────────────────────────────────────┘
```

#### Information Hierarchy
`Modal` title states the exact role being assigned (never generic "Assign role"). Current assignee (if any) shown directly above the `Combobox` for context before reassignment.

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty `Combobox`, no assignee | N/A |
| Reassigning | Current assignee `Avatar` + name shown | Clear "currently: [name]" context |
| Loading (roster search) | `Combobox` `loading` prop active | Spinner inline in dropdown |
| Error | `Alert danger` inside modal body if assignment fails | Retry without closing modal |
| Success | Modal closes; `Timeline` entry appended; command-roles panel updates | No separate toast (visible panel update is the confirmation) |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Assign role" | `Button primary` (rightmost) | Commits assignment; writes `Timeline` entry with actor+timestamp |
| "Cancel" | `Button ghost` | Closes modal, no change |

**Keyboard/focus:** Focus moves into the modal on open (to the `Combobox`); Escape closes and returns focus to the triggering "Reassign" button.

---

### Screen: Activation Level Change (Modal — danger-tier when escalating)

**Purpose:** Force a deliberate, consequence-aware decision before changing an incident's activation level.
**User Stories:** US-1.3, JRN-01.2 (Decide/Activate)

#### Layout

```
┌─────────────────────────────────────────────┐
│ Modal danger (alertdialog role)               │
│ title: "Escalate Riverbend flood to Full      │
│  activation?"                                 │
├───────────────────────────────────────────────┤
│ Body: "This notifies all assigned command     │
│ roles and opens full resource-request          │
│ approval workflows."                           │
├───────────────────────────────────────────────┤
│   [Keep at Partial]   [Escalate to Full        │
│                          danger primary]       │
└───────────────────────────────────────────────┘
```

De-escalation uses the same layout but a standard (non-danger) `Modal`.

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (escalating) | `Modal danger`, `alertdialog` role | Title states the decision; body states the consequence |
| Blocked (no IC assigned) | Modal cannot open; inline `Alert warning` on the trigger control instead | "Assign an Incident Commander before activating above Monitoring." (422 `NO_COMMANDER_ASSIGNED`) |
| Success | Modal closes; `Timeline` entry written; notification triggered (F5) | Activation `Badge` updates immediately in `PageHeader` |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Escalate to Full" | `Button danger primary` (rightmost) | Names the outcome explicitly, never "Yes/OK" |
| "Keep at Partial" | `Button secondary` | Names the alternative outcome explicitly, never "No/Cancel" |

**Keyboard/focus:** `alertdialog` traps focus; Escape closes and returns focus to the activation control in `PageHeader`. Never stacks with another modal.
