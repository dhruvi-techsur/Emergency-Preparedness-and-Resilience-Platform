## F4: Tasks & Resource Requests

**Description:** Create, assign, approve, track, and close operational tasks and initial resource requests — the MVP's manual-coordination replacement. Advanced logistics (inventory, workforce scheduling, mutual aid, fulfillment tracing) is explicitly deferred.

**Terminology:**
- **Task:** A tracked unit of work with an owner and due time. Statuses: `Open`, `In progress`, `Awaiting approval`, `Done`, `Overdue`.
- **Resource request:** A request for people, equipment, or supplies. Statuses: `Draft`, `Awaiting approval`, `Approved`, `Fulfilled`, `Declined`.
- **Owner:** The person or role a task/request is assigned to; always a named accountability point, never "unassigned" once in `Open` status.

### Sub-features
- Task lifecycle: create, assign (person or role), approve, track status, close.
- Basic resource-request lifecycle: create, approve, assign, track, close; linked to originating incident or task.
- List/table views with search, filter, bulk actions.
- Resource-request status visible on operating picture (F2) and reporting (F7).

### Screens

**S4.1 — Task List (standalone and embedded in Incident Workspace Tasks tab)**
- `Table` inside `Card padded={false}`: columns Task (linked), Status (`Badge`), Owner (`Avatar` + name), Due, Incident (when standalone view spans incidents), Linked plan section (if any). Toolbar: search, filter by status/owner/due-window, "New task" primary action. Bulk actions (e.g., "Mark done", "Reassign") replace toolbar on selection.

**S4.2 — Create/Edit Task (form)**
- Single column, max 560px. Fields: Title (`TextField`, required), Description (`TextField multiline`, optional), Owner (`Combobox` — person or role), Due (`DatePicker withTime zone`), Incident (`Combobox`, pre-filled when created from an incident workspace), Linked plan section (`Combobox`, optional, pre-filled when materialized from F3 template). Footer: Cancel / "Create task" or "Save changes" (primary).

**S4.3 — Task Detail**
- `PageHeader`: task title, status `Badge`, actions "Mark in progress" / "Submit for approval" / "Reopen" depending on current state. Body: description, owner, due, linked incident/plan section, and a small `Timeline` of status changes specific to this task.

**S4.4 — Resource Request List (standalone and embedded in Incident Workspace Resources tab)**
- `Table` inside `Card padded={false}`: columns Request (linked), Type (Personnel/Equipment/Supplies), Status (`Badge`), Quantity, Requested by (`Avatar`), Incident, Requested at. Toolbar: search, filter by status/type. "New resource request" primary action.

**S4.5 — Create/Edit Resource Request (form)**
- Fields: Resource type (`Select`: Personnel/Equipment/Supplies), Description (`TextField multiline`, required — what specifically is needed), Quantity (`TextField` numeric, required), Incident (`Combobox`, pre-filled from context), Needed by (`DatePicker withTime zone`), Requesting role (`Select`). Footer: Cancel / "Submit request" (primary) — submitting moves status from `Draft` to `Awaiting approval`.

**S4.6 — Resource Request Approval (inline action / Modal for decline)**
- On the request detail or list row: "Approve" (primary) / "Decline" (secondary, opens `Modal` requiring a reason `TextField`) for users with approval permission. Approving moves status to `Approved` and prompts an optional "Assign" step (who/what is fulfilling it). "Mark fulfilled" action available once assigned, moving status to `Fulfilled`.

**S4.7 — Resource Request Detail**
- `PageHeader`: request summary, status `Badge`. Body: full request details, approval history (`Timeline`-style entries: submitted → approved/declined → assigned → fulfilled), linked incident and task (if any).

### Process
1. A user (typically PER-02 or PER-03) creates a task via S4.2, either standalone or from within an Incident Workspace (F1) Tasks tab, or materialized from a plan's linked task template (F3) when an incident activates.
2. Task status starts at `Open`; the owner updates it to `In progress`, then either `Done` directly (if no approval required) or `Awaiting approval` (if the task type requires sign-off), at which point an approver moves it to `Done`.
3. Tasks past their due time without reaching `Done` automatically flip to `Overdue` (system-driven status, visible via `Badge`, triggers no auto-notification beyond what F5 rules define for overdue tasks).
4. A user creates a resource request via S4.5, linked to an incident and optionally a task; it starts in `Draft` and moves to `Awaiting approval` on submit.
5. An approver (typically PER-03, logistics function) reviews and Approves or Declines (S4.6); Approved requests can be assigned to a specific resource/person, then marked `Fulfilled` once delivered.
6. Every status transition on a task or resource request writes an entry to the owning incident's Timeline (F1) with actor, timestamp, and the before/after status.
7. Resource-request status changes publish to the event bus (F10) so the operating picture (F2) and reporting (F7) reflect current state without manual refresh.

### Inputs
- Task: `title` (string, required, 3–200 chars), `owner_id` (UUID, required — person or role), `due_at` (ISO datetime+zone, required), `incident_id` (UUID, optional), `plan_section_id` (UUID, optional).
- Resource request: `resource_type` (enum, required): `Personnel`|`Equipment`|`Supplies`; `description` (string, required, ≤1000 chars); `quantity` (integer, required, ≥1); `incident_id` (UUID, required); `needed_by` (ISO datetime+zone, required); `requesting_role` (enum, required).
- Status transitions: `new_status` (enum per type, required), `reason` (string, required only for `Declined`).

### Outputs
- Task/resource-request records with current status, owner/approver history, and linkage to incident/plan.
- Status-change events published to F10 event bus for F2/F7 consumption.
- Timeline entries on the owning incident (F1).

### Validation
- A task cannot be created without an owner — "unassigned" is not a valid starting state once beyond `Draft`-equivalent (tasks have no draft state; they start `Open`).
- `due_at` must be in the future relative to `created_at` at creation time (warn if in the past, allow override with explicit confirmation for backfilled/retroactive entries).
- Resource request `quantity` must be a positive integer; `needed_by` must be present.
- A `Declined` resource request requires a non-empty `reason`.
- Status transitions must follow the fixed state machine per type (e.g., a task cannot go from `Open` directly to `Done` if the task type is flagged as requiring approval — must pass through `Awaiting approval`).
- Overdue transition is system-computed, never user-settable directly.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Task created without owner | 422 | TASK_OWNER_REQUIRED | "Assign an owner before creating this task." |
| Resource request declined without reason | 422 | DECLINE_REASON_REQUIRED | "State why this request is declined." |
| Invalid status transition attempted | 409 | INVALID_STATUS_TRANSITION | "This task can't move to [status] from its current state." |
| Due date in the past without override | 422 | DUE_DATE_PAST | "This due time has already passed. Confirm this is a retroactive entry." |
| Task/request not found | 404 | RECORD_NOT_FOUND | "This item no longer exists or you don't have access." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Tasks and §Resource Requests for `GET/POST /api/v1/tasks`, `PATCH /api/v1/tasks/{id}/status`, `GET/POST /api/v1/resource-requests`, `POST /api/v1/resource-requests/{id}/approve`, `POST /api/v1/resource-requests/{id}/decline`, `POST /api/v1/resource-requests/{id}/fulfill`.

### Schema Surface (this feature)
Owns tables `tasks`, `task_status_history`, `resource_requests`, `resource_request_status_history` — see `Y0b-schema-incident-ops.md` §Tasks & Resources. Reads `incidents` (F1), `plan_task_templates` (F3), `users` (F8).
