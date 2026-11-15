## Interaction Patterns

### Pattern: AIDraft + Provenance Review

**When to use:** Any point where AI assists drafting (ICS narrative, notification message, SITREP/AAR narrative/findings).
**Behavior:** Clicking "Draft with AI" (`Button secondary`) never writes into the target field directly. It inserts an `AIDraft` panel below the field containing the draft text, a "Not issued" `Badge` that persists until Approve, and `Provenance` chips per source used. Three footer actions: "Discard" (`ghost`, removes the draft, leaves only an audit note), "Edit" (`secondary`, opens the draft text editable before approval), "Approve" (`primary`, copies the final text into the field and logs reviewer + timestamp to the owning record's `Timeline`/audit trail). Low-confidence or missing-source drafts state this plainly inside the draft body ("Low confidence: only one source available") rather than being hidden or silently upgraded. No code path writes AI-origin content to an official record without a non-null `approved_by`/`approved_at` pair, enforced server-side.
**Examples:** F1 ICS Form Editor, F5 Compose Notification Step 2, F7 SITREP Generator, F7 AAR Generator Step 4, F9 Signal Detail → Promote to incident (pre-fill only, not an `AIDraft` panel but the same human-gate principle).

### Pattern: Consequence-Stating Modal Confirmation

**When to use:** Any destructive or high-consequence state change (activation escalation, incident closure, role suspension, federation revoke, resource-request decline).
**Behavior:** `Modal` title states the decision as a question ("Escalate Riverbend flood to Full activation?"); body states the operational consequence in one or two sentences; footer buttons name the outcomes explicitly ("Escalate to Full" / "Keep at Partial"), never generic "Yes/No" or "OK/Cancel". Escalating/destructive actions use `Modal danger` (`alertdialog` role); de-escalating or non-destructive confirmations use the standard `Modal`. Never stacks with another modal.
**Examples:** F1 Activation Level Change, F1 Incident Closure, F8 Suspend User Access, F10 Revoke Federation Grant, F5 public/external-reach send confirmation.

### Pattern: Status Lifecycle Visualization

**When to use:** Any record with a defined state machine (tasks, resource requests, plans, sync queue, notifications delivery).
**Behavior:** Current status always renders as `Badge` (icon + word + color). A `Timeline`-style approval-history list shows every transition with actor, timestamp, and before/after status. Status transitions follow a fixed state machine per record type; invalid transitions are blocked server-side with a clear 409 error naming the current state. This single visual language (created → approved → assigned → closed, or queued → synced → conflict) is reused across F4 (tasks/resources), F5 (notification delivery), and F6 (field sync) so users learn it once.
**Examples:** F4 Task Detail status history, F4 Resource Request Detail approval history, F6 Queued Submissions View, F5 Delivery & Acknowledgment Tracking.

### Pattern: Conflict Resolution (Never Silent Overwrite)

**When to use:** Any place two systems (or a field device and the EOC) record diverging values for the same record.
**Behavior:** Both values are shown side by side with their sources (and, where relevant, differing fields highlighted). Two named actions let the user choose explicitly ("Keep EPMP value" / "Keep [external] value", or "Keep my version" / "Keep EOC version") — no default/automatic resolution path exists in the UI or API. The resolution always writes a `Timeline`/audit entry naming who chose which version.
**Examples:** F6 Sync Conflict Resolution (field-mobile), F8/F13 Integration Health conflict rows, F16 HR-field conflict flag.

### Pattern: Provenance on Every Ingested or AI-Derived Fact

**When to use:** Any data point sourced from an external feed, integration, or AI output.
**Behavior:** A `Provenance` chip (source, time, verified/unverified, optional confidence) is attached wherever the fact surfaces — map layers, dashboard tiles, `MapPopup`, `AIDraft` panels, dispatch panels. Unverified data keeps a dashed outline and the word "Unverified" even when the layer/data is otherwise visible; verification requires an explicit named-person action and can never happen automatically.
**Examples:** F2 `LayerPanel`/`MapPopup`, F12 hazard layers, F9 `AIDraft` sources, F15 dispatch-status panel, F17 facility markers.

### Pattern: Empty/Loading/Error on Every List, Table, Panel

**When to use:** Universally — no exceptions.
**Behavior:** Loading shows `Skeleton` sized to the final layout for loads over 300ms, replaced atomically (no partial replace, no layout shift). First-use empty shows `EmptyState` with a title, one sentence, and at most one action ("No incidents yet" + "Create incident"). Filtered-out empty is visually and textually distinct ("No incidents match" + "Clear filters"). Error shows `Alert danger` with a Retry action, keeping last-known data visible and labeled with its age — never a blank or broken screen.
**Examples:** Every `Table`/`Card`/chart/map layer across all 22 screens in this document.

### Pattern: SyncStatus Connectivity Indicator

**When to use:** Every page, pinned in the header (desktop) or top of screen (field-mobile).
**Behavior:** `SyncStatus` renders one of four states — `online`, `syncing`, `offline` (with queued count in `detail`), `conflict` — each with an icon + word (never color alone). When `offline`, all edits remain possible locally; queued items show a "Queued" `Badge`. Conflicts always route to a named-person resolution screen, never auto-resolved.
**Examples:** F0 header strip (desktop), F6 Field Home/My Tasks/Report Observation/Field Map (mobile, pinned top).

## Keyboard Navigation Patterns

- **Skip-to-content:** First focusable element on every page, before `SideNav`.
- **`Tabs`:** Left/Right arrow keys move between tab headers; selected tab has a 2px `brand` underline; each panel has `role="tabpanel"`.
- **`Modal`:** Focus moves into the modal on open; Escape closes and returns focus to the trigger; focus is trapped inside while open; `danger` modals use `role="alertdialog"`.
- **`Combobox`:** Type to filter, Up/Down to move through options, Enter to choose, Escape to close.
- **`DatePicker`:** Typing always works (YYYY-MM-DD or ISO+time); calendar popover supports Arrow keys (day/week), PageUp/PageDown (month), Escape (close, returns focus to field).
- **Map markers:** Every marker is a Tab stop, Enter opens `MapPopup`; closing returns focus to the originating marker; a hidden text list of all visible markers exists for screen readers.
- **`Table` rows:** Reachable via Tab when `onRowClick` is set; Enter activates the row's primary navigation.

## Focus State Pattern

Every interactive element (`Button`, `IconButton`, `TextField`, `Combobox`, `Select`, `Checkbox`, `Radio`, `Switch`, `Tabs` headers, `Table` rows with `onRowClick`, map markers, `Card interactive`) shows a solid 2px `focus-ring` outline with 2px offset on keyboard focus. Focus styling is never suppressed on any element, in any theme. `focus-ring` holds at least 3:1 contrast against every surface in all three themes (verified: 6.3:1 light, 9.7:1 dark, 10.3:1 contrast).
