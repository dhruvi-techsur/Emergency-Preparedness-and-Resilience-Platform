## Epic 4: Tasks & Resource Requests (F4)

Create, assign, approve, track, and close operational tasks and basic resource requests.

### US-4.1: Create and assign a task with a named owner
**As a** James Okafor / Incident Commander, **I want to** create a task and assign it to a specific person or role, **so that** every unit of work has clear, accountable ownership instead of being lost in a spreadsheet or phone call.

**Acceptance Criteria:**
- [ ] Create-task form requires title (3–200 chars), owner (person or role), and due date/time; description and incident/plan-section links are optional
- [ ] A task cannot be created without an owner (422 TASK_OWNER_REQUIRED)
- [ ] A due date in the past relative to creation time shows a warning and requires explicit confirmation to proceed (422 DUE_DATE_PAST without override)
- [ ] New tasks start in `Open` status; task list shows Task, Status (`Badge`), Owner (`Avatar`), Due, Incident, and Linked plan section
- [ ] Tasks past their due time without reaching `Done` automatically flip to `Overdue` (system-computed, never user-settable directly)

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.2: Track a task through its full status lifecycle
**As a** Diego Reyes / Field Responder, **I want to** update my assigned task's status (Open → In progress → Awaiting approval/Done), **so that** command always has an accurate, current picture of my work without needing to call in.

**Acceptance Criteria:**
- [ ] Task detail shows status-appropriate actions ("Mark in progress" / "Submit for approval" / "Reopen") depending on current state
- [ ] Status transitions follow the fixed state machine per task type — a task flagged as requiring approval cannot skip `Awaiting approval` en route to `Done` (409 INVALID_STATUS_TRANSITION otherwise)
- [ ] Every status transition writes an entry to the owning incident's Timeline with actor, timestamp, and before/after status
- [ ] A small `Timeline` of status changes is visible on the task detail itself

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.3: Submit and track a resource request
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** create a resource request for personnel, equipment, or supplies and track it from draft through fulfillment, **so that** no request is lost, duplicated, or left unacknowledged.

**Acceptance Criteria:**
- [ ] Create-request form requires resource type (Personnel/Equipment/Supplies), description (≤1000 chars), quantity (positive integer), incident, and needed-by date
- [ ] Submitting moves the request from `Draft` to `Awaiting approval`
- [ ] Resource request list shows Request, Type, Status (`Badge`), Quantity, Requested by, Incident, Requested at
- [ ] Resource-request status changes publish to the event bus so the operating picture (F2) and reporting (F7) reflect current state without manual refresh

**Priority:** P0 | **Feature Ref:** F4

---

### US-4.4: Approve, decline, or fulfill a resource request
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** approve, decline (with a reason), assign, and mark resource requests fulfilled, **so that** every request has a visible, current status from creation to closure.

**Acceptance Criteria:**
- [ ] "Approve" and "Decline" actions are available to users with approval permission; Decline opens a modal requiring a non-empty reason (422 DECLINE_REASON_REQUIRED otherwise)
- [ ] Approving moves status to `Approved` and prompts an optional assignment step (who/what is fulfilling the request)
- [ ] "Mark fulfilled" is available once assigned, moving status to `Fulfilled`
- [ ] Request detail shows full approval history (submitted → approved/declined → assigned → fulfilled) as Timeline-style entries
- [ ] Every status transition writes a Timeline entry on the owning incident

**Priority:** P0 | **Feature Ref:** F4
