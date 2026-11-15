# User Stories
## EPMP (Emergency Preparedness & Management Platform)

| Field | Value |
|-------|-------|
| **Product Name** | EPMP (Emergency Preparedness & Management Platform) |
| **Date** | 2026-11-14 |
| **Related PRD** | PRD-EPMP.md |
| **Related FRD** | FRD-EPMP.md |
| **Related Personas** | PERSONAS-EPMP.md |

---

## Story Format

Each story follows: **As a [persona], I want to [action], so that [outcome].**

Acceptance criteria are listed beneath each story. Stories are grouped into 19 epics, one per PRD/FRD feature (F0–F18), and prioritised P0–P2 per the PRD Feature Index.

## Personas Used

| Persona | Name | Role |
|---|---|---|
| PER-01 | Maria Alvarez | EOC Director / Emergency Manager |
| PER-02 | James Okafor | Incident Commander / Public Information Officer |
| PER-03 | Priya Nandan | Planning & Logistics Section Chief |
| PER-04 | Diego Reyes | Field Responder |
| PER-05 | Dana Whitfield | IT/SecOps Administrator & Executive Sponsor |

---
## Epic 0: Web & Mobile Application Shell (F0)

The app shell, navigation, page-pattern library, and theming system every persona uses to operate EPMP. No other feature is usable without this surface.

### US-0.1: Role-scoped navigation on sign-in
**As a** Maria Alvarez / EOC Director, **I want to** see a navigation structure organized by lifecycle stage (Prepare, Monitor, Activate, Coordinate, Recover, Improve) scoped to my role, **so that** I can find the right tool for my current job without wading through screens meant for other roles.

**Acceptance Criteria:**
- [ ] `SideNav` renders 6–9 top-level items grouped in lifecycle order Prepare → Monitor → Activate → Coordinate → Recover → Improve
- [ ] `SideNav` collapses to a bottom bar of exactly 4 destinations below `bp-md`, with destinations determined by role (F18)
- [ ] Current page is highlighted `brand-subtle`; brand mark (gold square + "EPMP" `h4`) shown at top
- [ ] A user never sees a `SideNav` group or action their role doesn't permit (no disabled/grayed items — items are absent)
- [ ] Skip-to-content link is the first focusable element on every page

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Switch between light, dark, and contrast themes
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** switch between light, dark, and contrast (Section 508 high-contrast) themes from any page, **so that** operators in low-light EOC conditions and users needing high contrast can work comfortably and accessibly.

**Acceptance Criteria:**
- [ ] Theme switcher (`Select`/`Switch` group) is reachable from the user/profile menu on every page
- [ ] Choosing `light`, `dark`, or `contrast` applies instantly via `data-theme` without a page reload
- [ ] Theme preference persists per-user and is applied before first paint on next load (no flash of incorrect theme)
- [ ] Contrast theme achieves 7:1 text contrast; all three themes achieve full functional and visual parity, including maps and charts
- [ ] Theme preference save failure shows a clear error ("Couldn't save your theme preference...") and does not block continued use

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Consistent loading, empty, and error states everywhere
**As a** James Okafor / Incident Commander, **I want to** see consistent loading, empty, and error treatments on every list, table, and panel, **so that** I always know whether data is still arriving, genuinely absent, or failed to load — never left guessing during a live incident.

**Acceptance Criteria:**
- [ ] Every list/table/panel shows `Skeleton` sized to the final layout when loading takes more than 300ms, and replaces skeletons atomically (no partial replace / layout shift)
- [ ] First-use empty state shows a title, one sentence, and at most one action (e.g., "No incidents yet" + "Create incident")
- [ ] Filtered-out empty state is visually distinct from first-use empty state (e.g., "No incidents match" + "Clear filters")
- [ ] Error state shows `Alert` (danger) with a Retry action and keeps last-known data visible, labeled with its age
- [ ] Status is always shown as icon + word + color, never color alone, across every `Badge`/`Alert`/`SyncStatus` instance

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Design-system-only screens with no ad hoc components
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** have any screen that needs a treatment the 40-component design system doesn't support flagged as a logged gap rather than improvised, **so that** the product never accumulates inconsistent, inaccessible one-off UI that undermines trust and compliance.

**Acceptance Criteria:**
- [ ] No screen ships with raw hex colors, arbitrary pixel values, or custom components outside the `window.EPMP` set
- [ ] When a screen needs an unsupported treatment, a "Design system gap" flag is logged and visible to F8 admins with the proposed addition described
- [ ] Every page has exactly one `h1` (via `PageHeader`) with ordered headings beneath it — no skipped levels
- [ ] Every interactive element shows a visible 2px focus ring on focus; no element suppresses focus styling
- [ ] Touch targets on field-mobile breakpoints are ≥44px (`size="lg"`)

**Priority:** P0 | **Feature Ref:** F0
## Epic 1: Incident / ICS (F1)

Incident intake, classification, command-role assignment, activity timeline, checklists, and ICS forms — the core activation and command workflow.

### US-1.1: Create and classify a new incident
**As a** Maria Alvarez / EOC Director, **I want to** create and classify a new incident with type, severity, and jurisdiction, **so that** my team has a single authoritative record to coordinate around from the first moment of an event.

**Acceptance Criteria:**
- [ ] Create-incident form captures name (required, 3–200 chars), type, severity (Critical/Elevated/Watch/Normal), jurisdiction, description (≤2000 chars), and opened-at timestamp
- [ ] On submit, the incident is created with status `Open` and activation level defaulting to `Monitoring`
- [ ] A first Timeline entry ("Incident created") is written automatically with actor and timestamp
- [ ] Submitting a name matching another incident opened in the same jurisdiction within 24 hours shows a possible-duplicate warning (409 INCIDENT_POSSIBLE_DUPLICATE) but does not block creation
- [ ] On submit error, focus moves to the first invalid field and a summary `Alert` appears above the form

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Assign command roles with named-person accountability
**As a** James Okafor / Incident Commander, **I want to** assign ICS command roles (Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public Information) to named people, **so that** every position in the command structure has clear, accountable ownership.

**Acceptance Criteria:**
- [ ] Role-assignment `Modal` lets me search personnel (from F16 roster where synced, else manual entry) and assign or reassign a role
- [ ] Current assignee is shown when reassigning a role
- [ ] Every assignment writes a Timeline entry with actor and timestamp
- [ ] At least one Incident Commander must be assigned before activation level can move above `Monitoring` (422 NO_COMMANDER_ASSIGNED otherwise)
- [ ] Pinned command-role panel on the Incident Workspace shows `Avatar` + role + name with a "Reassign" action per row

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: Change activation level with explicit consequence confirmation
**As a** James Okafor / Incident Commander, **I want to** change an incident's activation level (Monitoring/Partial/Full) through a confirmation that states the operational consequence, **so that** escalation decisions are deliberate and never accidental.

**Acceptance Criteria:**
- [ ] Escalating activation opens a `Modal danger` stating the decision and consequence (e.g., "This notifies all assigned command roles and opens full resource-request approval workflows")
- [ ] Modal footer buttons name the outcome explicitly (e.g., "Escalate to Full" / "Keep at Partial") — never generic "Yes/No"
- [ ] De-escalating activation uses a standard (non-danger) `Modal` confirmation
- [ ] The change writes a Timeline entry and triggers any configured notification (F5) to assigned roles
- [ ] Activation cannot move above `Monitoring` without at least one assigned Incident Commander

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Monitor the incident via a single workspace
**As a** James Okafor / Incident Commander, **I want to** view timeline, tasks, resources, and reports for an incident in one workspace with a pinned command-role roster and map thumbnail, **so that** I can command the response without switching between disconnected tools.

**Acceptance Criteria:**
- [ ] `PageHeader` shows incident name, severity `Badge`, jurisdiction + opened date subtitle, and "Generate SITREP" / "New task" actions
- [ ] Tabs (Timeline, Tasks, Resources, Reports) appear in the same fixed order on every incident
- [ ] Timeline tab shows entries newest-first with time (24-hour, monospace), status-dot tone, title, and actor+source meta; AI-sourced entries are labeled as such
- [ ] Right-hand panel shows pinned command roles and a map-thumbnail panel linking to the full operating picture (F2) scoped to this incident
- [ ] Tasks and Resources tabs embed the respective F4 tables scoped to this incident

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.5: Complete ICS forms with AI-assisted drafting
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** complete structured ICS forms (e.g., ICS-201/202) with optional AI-drafted narrative sections that I review before approving, **so that** I produce official documentation faster without sacrificing accuracy or accountability.

**Acceptance Criteria:**
- [ ] Long ICS forms are split into steps of 5–8 fields with a `Progress` indicator and autosave ("Saved HH:MM")
- [ ] "Draft with AI" button on narrative fields inserts an `[AIDraft]` panel with `Provenance` sources below the field, never directly into the field
- [ ] Approving the draft copies the text into the field and logs reviewer + timestamp to the Timeline; Discard removes it with no trace beyond an audit note
- [ ] A form cannot transition to `Approved` without a recorded named-person reviewer and timestamp (403 APPROVAL_REQUIRES_NAMED_USER otherwise)
- [ ] Forms remain in `Draft` status, visually distinct from `Approved`, until explicitly approved

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.6: Close an incident with explicit consequence
**As a** Maria Alvarez / EOC Director, **I want to** close an incident through a confirmation that states what will happen to open items, **so that** closure is a deliberate, informed action rather than an accidental status flip.

**Acceptance Criteria:**
- [ ] Closing an incident requires a `Modal` confirmation stating the consequence (e.g., "closes all open tasks to Overdue unless completed")
- [ ] Closure writes a Timeline entry with actor and timestamp
- [ ] Closure makes the "Generate AAR" action available in Reports (F7); AAR generation is blocked on any incident not yet `Closed`
- [ ] Every state-changing action on the incident (create, reassign, activation change, closure) writes exactly one Timeline entry with non-null actor and source

**Priority:** P0 | **Feature Ref:** F1
## Epic 2: Common Operating Picture (F2)

Live incident dashboards, maps, weather/hazard layers, and facility/resource positions — a shared, time-stamped view of the current situation for every role.

### US-2.1: View incidents, facilities, and resources on a shared map
**As a** James Okafor / Incident Commander, **I want to** see incidents, facilities, and resource positions on one live map with status-coded markers, **so that** I have shared situational awareness instead of reconciling radio traffic and verbal reports.

**Acceptance Criteria:**
- [ ] `MapCanvas` renders incident (diamond), facility (square), resource (triangle), and shelter (circle) markers distinguished by shape and tone, never tone alone
- [ ] Each marker is keyboard-focusable (Tab, Enter) and duplicated in a hidden text list for screen readers
- [ ] Selecting a marker opens `MapPopup` with title, status `Badge`, 2–3 key facts, `Provenance`, and 1–2 deep-link actions
- [ ] Closing a popup returns focus to its originating marker
- [ ] Status bar shows "As of HH:MM ET · Base layer: [source]" reflecting the stalest currently-visible layer

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Toggle weather/hazard overlay layers with provenance
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** toggle weather/hazard overlay layers on the map and see each layer's source and data age, **so that** I only rely on current, verified information when advising command.

**Acceptance Criteria:**
- [ ] `LayerPanel` lists 4–8 layers (incidents first, reference layers last) each showing label, source, "As of HH:MM" age, and verified/unverified flag
- [ ] Unverified weather/hazard layers are off by default and show a dashed "Unverified" visual treatment even when toggled on
- [ ] Toggling a layer is immediate with no save step
- [ ] A layer missing `source` or `asOf` is never displayed (rejected at ingestion, not shown without provenance)
- [ ] No more than 6 layers are visible simultaneously without grouping/consolidation

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Operate the map in degraded/offline GIS conditions
**As a** Maria Alvarez / EOC Director, **I want to** continue using the operating picture even when the GIS base-layer feed is unavailable, **so that** a vendor outage never blocks situational awareness during an activation.

**Acceptance Criteria:**
- [ ] When the GIS feed is unavailable or times out, `MapCanvas` renders a schematic base map labeled "Schematic base map, offline"
- [ ] EPMP-authored markers (incidents, resources, hazards) continue to render on top of the schematic base map
- [ ] The operating-picture page never fails to render due to a GIS outage (200 degraded response, not an error page)
- [ ] Status bar reflects the degraded state clearly rather than showing a stale/misleading "as of" time silently

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.4: View a live EOC/executive dashboard summary
**As a** Maria Alvarez / EOC Director, **I want to** see a dashboard of active incidents, open tasks, and pending resource requests as soon as I sign in, **so that** I can assess the overall situation in minutes rather than piecing it together from calls.

**Acceptance Criteria:**
- [ ] Dashboard shows up to 4 `Stat` tiles (e.g., Active incidents, Open tasks, Pending resource requests, Notifications pending acknowledgment)
- [ ] A 12-column grid of `Card`s includes an operating-picture map thumbnail linking to the full map view
- [ ] A side `Card` shows recent Timeline entries across all in-scope incidents plus a task-status summary
- [ ] Dashboard `Stat` tiles and summary cards update via event-bus-driven refresh without requiring a manual page reload
- [ ] A dashboard aggregate query timeout shows a clear retry message (504 DASHBOARD_TIMEOUT) rather than a blank screen

**Priority:** P0 | **Feature Ref:** F2
## Epic 3: Plans & Playbooks (F3)

A plan repository with SOPs, versioning, and approvals, with linkage from plan sections to the operational tasks they generate.

### US-3.1: Maintain a versioned, approvable plan repository
**As a** Maria Alvarez / EOC Director, **I want to** maintain plans and SOPs in a repository with version history and a draft → review → approved workflow, **so that** my agency can substantiate its preparedness on demand instead of relying on scattered documents.

**Acceptance Criteria:**
- [ ] Plan list shows Name, Type (EOP/SOP/Annex), Status (`Badge`: Draft/Review/Approved), Version, Jurisdiction, Last updated, and Owner
- [ ] A plan cannot move to `Approved` without passing through `Review` first — no direct Draft → Approved transition
- [ ] The reviewer approving a plan must be a different named person than the most recent editor (no self-approval), unless an explicit logged exception applies (403 SELF_APPROVAL_BLOCKED otherwise)
- [ ] Approving a plan increments its version, transitions status to `Approved`, and writes an audit-log entry with reviewer and timestamp
- [ ] Previous Approved versions remain accessible read-only in version history and are never deleted

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Link plan sections to the tasks they generate
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** link a plan or SOP section directly to the operational tasks it should generate, **so that** written readiness and executed response are no longer disconnected.

**Acceptance Criteria:**
- [ ] A "Link tasks" action on each plan section opens a modal to select existing task templates or define a new one (name, default owner role, default due offset)
- [ ] Multiple task templates can be associated with one plan section
- [ ] When an incident activates and references a plan, linked task templates are offered as one-click task creation rather than requiring tasks to be written from scratch
- [ ] A plan must have at least one section before it can be submitted for review (422 PLAN_EMPTY otherwise)

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Import plans from an existing document system
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** import or link EOPs/SOPs/annexes from our existing SharePoint library into the plan repository, **so that** I don't have to recreate readiness documents we already maintain elsewhere.

**Acceptance Criteria:**
- [ ] Import flow lets me browse/search the connected document library scoped to my own existing permissions and choose "Import copy" or "Link live" sync mode
- [ ] A document I couldn't see in the source system is never visible to me in this import flow (403 IMPORT_PERMISSION_DENIED when attempted)
- [ ] "Link live" documents are periodically re-checked for source changes; changes are flagged to a named person for review, never auto-applied (200 flagged PLAN_SOURCE_CHANGED)
- [ ] A permission downgrade at the source system immediately restricts EPMP-side visibility of a linked document

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: Read plans in a focused, distraction-free view
**As a** James Okafor / Incident Commander, **I want to** read an approved plan's content in a clean, line-length-constrained reading view with jump links to sections, **so that** I can quickly find the guidance I need during an incident without visual strain.

**Acceptance Criteria:**
- [ ] Plan content area is constrained to `reading-max` (720px) for the plan text
- [ ] Sidebar lists plan sections as jump links and shows linked tasks per section
- [ ] Version history is shown as a collapsible, read-only list with "View this version" per entry
- [ ] Plan detail header shows plan name, status `Badge`, and version number

**Priority:** P0 | **Feature Ref:** F3
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
## Epic 5: Notifications Integration (F5)

Recipient groups, message templates, geotargeting, and a 4-step compose flow with delivery/acknowledgment tracking.

### US-5.1: Manage reusable recipient groups and message templates
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** define reusable recipient groups (by role, jurisdiction, or geography) and message templates, **so that** I don't recreate the same audience and wording every time I need to communicate.

**Acceptance Criteria:**
- [ ] Recipient-group editor supports type `Role`, `Jurisdiction`, or `Geography`, each with a type-specific selector (role `Combobox`, jurisdiction `Combobox`, or geography drawn on `MapCanvas`)
- [ ] Recipient-group list shows Group name, Type, Member count, Last used
- [ ] Message-template editor supports placeholder tokens (e.g., `{{incident_name}}`) with a character count
- [ ] Template list shows Template name, Category, Last updated

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.2: Compose a notification through a required audience → message → review → send flow
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** compose a notification by selecting an audience, drafting the message (optionally with AI assistance), reviewing it read-only, and then approving and sending, **so that** nothing goes out that hasn't been deliberately reviewed.

**Acceptance Criteria:**
- [ ] Step 1 (Audience) requires at least one recipient group or a non-empty geotargeted area before proceeding (422 NO_AUDIENCE_SELECTED otherwise); a live recipient-count estimate is shown
- [ ] Step 2 (Message) offers "Draft with AI," which inserts an `[AIDraft]` panel with `Provenance` sources; AI never auto-populates the message field without an explicit, logged Approve action (400 AIDRAFT_NOT_APPROVED if attempted)
- [ ] Step 3 (Review) is fully read-only — nothing is editable without returning to a prior step
- [ ] Step 4 requires the signed-in user to match the designated approver for the selected channels (403 APPROVER_MISMATCH otherwise); public/external-reach sends show a `Modal danger` confirmation restating audience size and channels
- [ ] The compose/send action and its approver are written to the originating incident's Timeline if the notification is incident-linked

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.3: Track delivery and acknowledgment of a sent notification
**As a** Maria Alvarez / EOC Director, **I want to** see a real-time view of delivery and acknowledgment status per recipient after sending a notification, **so that** I know with certainty whether my teams actually received and acknowledged it, not just that it was sent.

**Acceptance Criteria:**
- [ ] Delivery-tracking view shows a `Table` of recipients with Name/Group, Channel, Status `Badge` (Queued/Sent/Delivered/Failed), and an acknowledgment `Progress` bar (e.g., "68% acknowledged, 412 of 606")
- [ ] View auto-refreshes as delivery callbacks arrive from F14, without manual reload
- [ ] Failed deliveries show a visible reason rather than silently dropping (never a silent failure)
- [ ] Status can be filtered by delivery state

**Priority:** P0 | **Feature Ref:** F5
## Epic 6: Mobile Field Operations (F6)

Mobile updates, structured forms, and geolocated observations for field responders, with offline caching and reconciliation.

### US-6.1: Check and update my tasks from the field, even offline
**As a** Diego Reyes / Field Responder, **I want to** view my assigned tasks and update their status with one-tap buttons, even without connectivity, **so that** I can keep working without waiting for a signal.

**Acceptance Criteria:**
- [ ] Field task view shows title, status `Badge`, and due in a card-per-row layout (not a dense table) with one-tap status buttons sized `lg` (44px)
- [ ] Status updates made while offline are written to local cache and queued, with `SyncStatus` showing an incremented queued count
- [ ] Every field action has a visible button equivalent — no interaction depends on hover or gesture
- [ ] `SyncStatus` is pinned at the top of every mobile screen and reflects online/syncing/offline/conflict state in real time

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.2: Submit a structured field report with photo and location
**As a** Diego Reyes / Field Responder, **I want to** submit a structured observation with one-tap photo and location capture, **so that** command has accurate, geolocated field data without relying on radio traffic.

**Acceptance Criteria:**
- [ ] Report form includes observation type, description, one-tap photo capture with visible thumbnail confirmation, and one-tap "Use my location" with visible lat/long + accuracy confirmation shown as text
- [ ] A report must have at least a description, a photo, or a location — not fully empty (422 REPORT_EMPTY otherwise)
- [ ] Submission always succeeds locally regardless of connectivity — it sends immediately online or queues offline
- [ ] Every queued submission carries a client-generated `captured_at` timestamp reflecting when the observation actually happened, not when it syncs
- [ ] Bottom action bar shows a single primary "Submit report" button; all controls are `size="lg"`

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.3: Confirm queued submissions synced successfully on reconnect
**As a** Diego Reyes / Field Responder, **I want to** see which of my queued submissions have synced to the EOC once I reconnect, **so that** I know my reports were received instead of wondering if they disappeared.

**Acceptance Criteria:**
- [ ] Queued Submissions view lists each unsynced item with type, timestamp, and a "Queued" `Badge` via `SyncStatus` styling
- [ ] A queued item can be deleted before it syncs (if created in error) but cannot be edited once queued
- [ ] On reconnect, all queued items sync automatically in creation order; `SyncStatus` shows `syncing` during the process
- [ ] Every item that syncs cleanly appends a Timeline entry noting the sync, preserving the original field-capture timestamp
- [ ] No submission is ever silently dropped — every item resolves to synced, conflict (pending resolution), or failed (flagged, with reason and retry option)

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.4: Resolve a sync conflict without losing data
**As a** Diego Reyes / Field Responder, **I want to** see a side-by-side comparison when my queued submission conflicts with an EOC-side change, and explicitly choose which version to keep, **so that** neither version is silently lost or overwritten.

**Acceptance Criteria:**
- [ ] Conflict view shows "Your version" vs. "Current EOC version" with differing fields highlighted
- [ ] Actions are "Keep my version" / "Keep EOC version" — no automatic merge or default resolution path exists
- [ ] Resolution requires an explicit named-person choice and writes a Timeline entry noting which version was kept and by whom
- [ ] If a photo fails to upload after reconnect, the report text/location still syncs and the photo failure is flagged separately rather than blocking the whole report

**Priority:** P0 | **Feature Ref:** F6
## Epic 7: Reporting & Learning (F7)

ICS output, operational summaries, after-action reports, and evidence/audit logs — closing the preparedness loop.

### US-7.1: Generate a SITREP from current incident data
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** generate a situation report that auto-assembles current timeline, task, and resource-request data, **so that** I never start from a blank page when leadership needs an update.

**Acceptance Criteria:**
- [ ] SITREP generator auto-pulls current incident Timeline, task status, and resource-request status into a structured draft
- [ ] Narrative sections offer "Draft with AI" (`[AIDraft]` + `Provenance`), requiring named-person approval before finalizing
- [ ] Preview pane shows the assembled document before "Save as draft" or "Approve and finalize"
- [ ] SITREPs remain available throughout an incident's lifecycle (not gated on closure)
- [ ] Only Approved documents count as official record

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.2: Generate an after-action report once an incident closes
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** generate an after-action report with auto-populated timeline, decisions, and resource history plus a structured findings list, **so that** lessons from the incident make it back into updated plans instead of being lost.

**Acceptance Criteria:**
- [ ] "Generate AAR" is only available once the incident status is `Closed` (409 INCIDENT_NOT_CLOSED otherwise)
- [ ] Steps 1–3 (timeline export, decisions log, resource-request history) are auto-populated and read-only/annotatable — nothing is manually re-entered
- [ ] Step 4 (findings & corrective actions) requires each entry to have a non-null owner and due date before finalization (422 CORRECTIVE_ACTION_UNOWNED otherwise)
- [ ] Finalizing the AAR writes it as an immutable, exportable record and triggers an evidence-log entry
- [ ] A finalized AAR cannot be edited directly — corrections require a new version or dated addendum (403 DOCUMENT_IMMUTABLE otherwise)

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.3: Review an exportable, append-only evidence and audit log
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** view and export a filterable, append-only log of timestamped actions across incidents, **so that** I can demonstrate preparedness and accountability without manually assembling evidence.

**Acceptance Criteria:**
- [ ] Evidence/audit log view shows Timestamp (monospace), Actor (`Avatar`), Action, Record type, and linked Record, filterable by date range, actor, and action/record type
- [ ] An "Export as CSV/PDF" action produces an export matching exactly the filtered view on screen
- [ ] No edit or delete control exists anywhere in this view, for any role, including F8 admins
- [ ] Export failures show a clear retry message (500 EXPORT_FAILED) rather than a silent failure

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.4: Review KPI trends on an analytics dashboard
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** view a small set of KPI tiles and charts with defined baselines, targets, and sources, **so that** I can answer "are we more prepared than last quarter?" using evidence instead of a manually assembled report.

**Acceptance Criteria:**
- [ ] `Stat` row shows KPIs (e.g., median activation time, resource-request fulfillment time, corrective-action closure rate) each with a definition, period, and source
- [ ] Each chart (`LineChart`/`BarChart`/`DonutChart`) has a title, subtitle (unit/period/source), and a hidden data-table alternative
- [ ] A KPI tile never shows a numeric target unless that target has been explicitly configured with definition/baseline/owner/cadence — otherwise it shows only the current measured value
- [ ] AI-generated activity counts (e.g., "N drafts generated") are never presented as a business-outcome KPI
- [ ] A large date-range query that times out shows a clear retry/narrow-range message (504 ANALYTICS_TIMEOUT)

**Priority:** P0 | **Feature Ref:** F7
## Epic 8: Security & Administration (F8)

The identity, access, audit, and operational-monitoring foundation for secure multi-role use.

### US-8.1: Sign in via agency SSO
**As a** Maria Alvarez / EOC Director, **I want to** sign in using my agency's identity provider via SAML2/OIDC, **so that** I use the same trusted credentials my agency already manages, with no separate password to remember.

**Acceptance Criteria:**
- [ ] Sign-in authenticates via the configured IdP (SAML2 or OIDC) and resolves or provisions the local user record
- [ ] IdP groups/attributes map to an EPMP role per the configured mapping
- [ ] A failed SSO assertion/token validation shows a clear message (401 SSO_AUTH_FAILED) directing the user to contact an administrator if it continues
- [ ] A user with no mapped role sees a clear message (403 ROLE_UNRESOLVED) rather than a blank or broken screen
- [ ] Session persists across page refreshes without re-prompting for credentials

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.2: Configure granular, role- and jurisdiction-scoped permissions
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** configure RBAC roles and permissions down to the feature/action level and jurisdiction scope, **so that** every persona sees exactly the data and actions their job requires, nothing more.

**Acceptance Criteria:**
- [ ] Roles & Permissions screen shows a permission matrix (feature × action, e.g., "Incidents: create/view/edit/approve-activation") editable via checkbox groups
- [ ] Permission changes require confirmation and are logged with the before/after permission set, not just "permissions changed"
- [ ] A role cannot be deleted while any user is currently assigned to it (409 ROLE_IN_USE otherwise)
- [ ] Suspending a user's access immediately invalidates their active sessions (does not wait for token expiry)
- [ ] Every other feature's RBAC check (F0–F18) consumes this role/jurisdiction-scope resolution

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.3: Review an immutable, append-only audit trail
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** review every security-relevant action (login, permission change, record access, AI-draft approval) in an append-only audit log, **so that** I can investigate incidents and prove compliance without gaps.

**Acceptance Criteria:**
- [ ] Audit log view additionally filters by login events, permission changes, record-access events, and AI-draft approvals (shared pattern with F7 S7.4)
- [ ] Audit log entries are immutable and exempt from any delete/edit code path at the data layer, including for admins (403 AUDIT_LOG_IMMUTABLE if attempted)
- [ ] Log is read-only and exportable
- [ ] Every login, permission change, record access to a sensitive type, and AI-draft approval writes an entry with actor, timestamp, action, and affected record

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.4: Monitor platform availability and integration health
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** monitor platform uptime, active sessions, failed-login rate, and integration-error rate from one admin view, **so that** I can catch and respond to degraded conditions before users are significantly impacted.

**Acceptance Criteria:**
- [ ] Platform Monitoring shows a `Stat` row (uptime, active sessions, failed-login rate, integration-error rate) and trend `LineChart`s for availability over time
- [ ] A persistent `Alert` (danger) surfaces any current platform-health incident until resolved (200 alert PLATFORM_HEALTH_DEGRADED)
- [ ] Integration Health table shows System, Last sync, Direction, Record authority, and `SyncStatus` for each connected external system
- [ ] Conflict rows show "Keep EPMP value" / "Keep [external] value" actions inline, never a silent overwrite
- [ ] No screen in the admin console, including this one, claims FedRAMP authorization in any copy

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.5: Configure SSO safely with a mandatory test step
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** configure and test an SSO connection before it goes live, **so that** I never lock out my agency's users with an untested identity-provider configuration.

**Acceptance Criteria:**
- [ ] SSO configuration form accepts IdP metadata (URL or XML), protocol (SAML2/OIDC), and attribute/group-to-role mapping
- [ ] "Test connection" must succeed before "Save configuration" can activate the config as live
- [ ] Invalid or unreachable IdP metadata shows a clear message (422 SSO_CONFIG_INVALID)
- [ ] Configuration changes are logged to the audit trail

**Priority:** P0 | **Feature Ref:** F8
## Epic 9: AI-Assisted Drafting & Signal Triage (F9)

Signal triage/clustering on approved hazard feeds, and AI-assisted drafting of ICS form fields and incident narrative, always human-approved.

### US-9.1: Review and validate candidate signals before they become incidents
**As a** Maria Alvarez / EOC Director, **I want to** review AI-surfaced candidate signals from hazard feeds with their source provenance and confidence, **so that** I can validate real threats quickly without ever having an incident auto-created without my review.

**Acceptance Criteria:**
- [ ] Signal Triage Queue shows signal summary, source feed(s), confidence as a qualitative label with a stated reason (never a bare percentage), detected-at time, and status (New/Dismissed/Promoted)
- [ ] Signal Detail shows the clustered source events with `Provenance` (source, time, confidence) for each
- [ ] "Promote to incident" only pre-fills the F1 incident-creation form — it never creates an incident directly (400 PROMOTE_REQUIRES_HUMAN_SUBMIT if an API caller attempts to bypass this)
- [ ] "Dismiss" requires a one-line reason
- [ ] Under no configuration is a signal auto-promoted to an active incident

**Priority:** P1 | **Feature Ref:** F9

---

### US-9.2: Draft ICS form and narrative text with AI, always reviewed before approval
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** use "Draft with AI" to generate ICS form text and narrative content that I review, edit, and approve before it becomes official, **so that** I save drafting time without ever letting unreviewed AI content into the official record.

**Acceptance Criteria:**
- [ ] `AIDraft` panel shows draft text, `Provenance` chips per source, and a "Not issued" badge that persists until Approve
- [ ] Approve copies text into the target field and logs reviewer + timestamp to the owning record's Timeline/audit trail; Edit allows adjusting text before approving; Discard removes it
- [ ] Low-confidence or missing-source drafts state this plainly in the draft body itself (e.g., "Low confidence: only one source available") rather than being hidden or silently upgraded
- [ ] Every `AIDraft` carries at least one `Provenance` source or explicitly states "No source available"
- [ ] No API endpoint that writes to an incident, ICS form, notification, SITREP, or AAR accepts AI-origin content without a non-null approver and timestamp (400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED otherwise)

**Priority:** P1 | **Feature Ref:** F9

---

### US-9.3: Trust that AI can never auto-issue a public warning or binding decision
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** have an absolute, non-overridable guarantee that no AI-generated content can be automatically dispatched as a public warning, evacuation instruction, or binding resource decision, **so that** the platform's AI governance model is trustworthy under any configuration or admin setting.

**Acceptance Criteria:**
- [ ] This prohibition is enforced at both the UI and API layers, with no feature flag or admin setting able to override it
- [ ] The approve action requires an `approver_id` resolving to an active, named (non-service) user account; service/system accounts cannot approve AI drafts (403 APPROVAL_REQUIRES_NAMED_USER otherwise)
- [ ] An AI gateway outage shows "AI drafting is temporarily unavailable. You can still write this manually." rather than blocking the workflow
- [ ] This constraint is verifiable in a security review of F5 (notifications) and F14 (public-alerting) send paths

**Priority:** P1 | **Feature Ref:** F9
## Epic 10: Platform API, Integration Gateway & Event Bus (F10)

The programmatic contract and background-processing backbone enforcing record authority, provenance, controlled federation, and graceful failure.

### US-10.1: Declare and view record authority per external system
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see a documented registry of which system (EPMP or a named external system) is authoritative for each record type, **so that** integration conflicts are resolved by policy, not guesswork.

**Acceptance Criteria:**
- [ ] Record Authority Registry shows Record type, Authoritative system, and Notes for every integrated record type
- [ ] An undeclared record type is never synced by any integration feature (F13, F15, F16, F17)
- [ ] Changes to the registry require admin role and are audited
- [ ] A write attempted against an externally-owned record shows a clear conflict message (409 RECORD_AUTHORITY_CONFLICT) rather than silently overwriting

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.2: Grant and revoke cross-jurisdiction data federation
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** grant a partner jurisdiction scoped, time-limited access to specific incident/record data and revoke it instantly, **so that** cross-jurisdiction sharing is explicit and controlled rather than all-or-nothing.

**Acceptance Criteria:**
- [ ] Federation Grants screen shows Partner jurisdiction, Scope granted, Granted by, Expires, and Status (Active/Revoked)
- [ ] A grant must have an explicit, enumerated scope — a grant with no scope restriction (implicit "all data") is rejected
- [ ] Revoking a grant takes effect within the same request cycle, with no caching window that honors a revoked credential
- [ ] An expired or revoked grant denies access with a clear message (403 FEDERATION_ACCESS_DENIED)

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.3: Trust that ingested data always carries provenance
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** have every ingested or AI-derived fact carry source, timestamp, version, and confidence, **so that** I never mistake an unverified feed for operational fact.

**Acceptance Criteria:**
- [ ] Inbound data lacking `source`, `timestamp`, `version`, or `confidence` is rejected at the API boundary (422 PROVENANCE_REQUIRED), never persisted as if verified
- [ ] This enforcement applies uniformly across all integration sources (F11–F17)
- [ ] Provenance is visible wherever the data surfaces in the UI (map layers, dashboard tiles, dispatch panels)

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.4: Monitor background job health
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see the status, last run, failure count, and next retry for every background job type, **so that** a silently failing feed-ingestion or sync job never goes unnoticed.

**Acceptance Criteria:**
- [ ] Background Job Monitor shows Job type, Status, Last run, Failure count, Next retry for notification fan-out, feed ingestion, sync reconciliation, and report generation
- [ ] A job exceeding its failure threshold surfaces a clear alert (200 alert BACKGROUND_JOB_DEGRADED) with the last error reason
- [ ] Monitor is surfaced as part of the platform-health view (F8 S8.7), not a hidden/separate nav item
- [ ] A duplicate webhook delivery (matching idempotency key) is safely no-op'd, never reprocessed

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.5: View and revoke registered API clients and partner access
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see every registered API client/partner with its granted scopes and last request, and revoke access immediately when needed, **so that** partner/programmatic access to EPMP is visible and controllable, not an unmonitored standing credential.

**Acceptance Criteria:**
- [ ] API & Integration Gateway screen shows a `Table` of registered API clients/partners: client name, scopes granted, last request, and rate-limit status
- [ ] "Revoke access" (`danger`, per row) requires a `Modal` confirmation before taking effect
- [ ] Revocation takes effect within the same request cycle — no caching window that honors a revoked client's existing token
- [ ] This screen is reachable from the Admin Console `SideNav` alongside Record Authority Registry and Federation Grants (shared F10 admin surface)
- [ ] Every client registration and revocation is written to the append-only audit log (F8) with actor and timestamp

**Priority:** P0 | **Feature Ref:** F10
## Epic 11: GIS & Geospatial Integration (F11)

Read integration with the agency's own GIS so the operating picture renders real base maps and facility layers without EPMP becoming a parallel GIS system of record.

### US-11.1: Render the operating picture on our agency's real GIS base map
**As a** James Okafor / Incident Commander, **I want to** see EPMP's incident and resource markers rendered on top of our agency's own GIS base layers (not a generic map), **so that** the operating picture reflects the boundaries and geography my team already trusts.

**Acceptance Criteria:**
- [ ] Base-layer feature services (Esri, OSM-derived, or agency GIS) are read via the approved adapter and normalized to a common GeoJSON representation with `source` and `as_of` provenance
- [ ] Base-layer styling uses only `map-*` design tokens so EPMP's own markers remain the most prominent layer
- [ ] A response missing `source` or `as_of` is treated as a feed failure (triggers degraded fallback), never silently passed through
- [ ] Feed health (last successful fetch, error count) is visible in F8's Integration Health view, with the agency's GIS declared authoritative for base-layer/boundary/facility-location data

**Priority:** P0 | **Feature Ref:** F11

---

### US-11.2: Publish EPMP-authored layers back to the agency GIS where permitted
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** publish EPMP's incident, resource, and hazard-overlay layers back to our agency's GIS as an authorized service where we've granted write permission, **so that** other agency GIS consumers benefit from EPMP's data without EPMP becoming a second system of record.

**Acceptance Criteria:**
- [ ] Publish requests are restricted to the defined layer set (incidents, resource positions, hazard overlays); a request targeting an undeclared layer type is rejected (400 GIS_PUBLISH_LAYER_NOT_ALLOWED)
- [ ] Publishing to an agency that hasn't granted write permission is denied with a clear message (403 GIS_PUBLISH_DENIED)
- [ ] Publish availability is visible per agency in the integration configuration

**Priority:** P0 | **Feature Ref:** F11
## Epic 12: Weather & Hazard Feed Ingestion (F12)

Read-only ingestion of NOAA/NWS/USGS hazard data as operating-picture overlay layers, with full provenance preserved.

### US-12.1: See hazard feed data as a toggleable, provenance-labeled layer
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** see NOAA/NWS/USGS hazard events ingested as overlay layers with clear source and confidence, **so that** I can factor current hazard conditions into planning without mistaking an unverified feed for confirmed fact.

**Acceptance Criteria:**
- [ ] Ingested hazard events carry `source`, `issued_at`, and `confidence`; an event missing any of these is rejected, not persisted as a usable layer
- [ ] New hazard layers are persisted `verified: false` by default and appear off-by-default, dashed "Unverified" in `LayerPanel`
- [ ] Expired events (`expires_at` in the past) are visually distinguished or removed from the active layer list, never shown as current without an age indicator

**Priority:** P1 | **Feature Ref:** F12

---

### US-12.2: Verify a hazard layer as a deliberate human action
**As a** Maria Alvarez / EOC Director, **I want to** explicitly mark a hazard layer as verified after reviewing it against other evidence, **so that** my team can rely on it with confidence while unverified data stays visibly flagged.

**Acceptance Criteria:**
- [ ] `verified` can only be set `true` by an explicit, named-person action — no automated promotion under any configuration
- [ ] Marking verified removes the dashed "Unverified" treatment from the layer
- [ ] Verification attempted by a non-named/service account is blocked (403 VERIFICATION_REQUIRES_NAMED_USER)
- [ ] A feed outage retries with exponential backoff and is logged to Integration Health; the operating picture continues rendering last-known data labeled with its age rather than blocking

**Priority:** P1 | **Feature Ref:** F12
## Epic 13: EOC COTS Interoperability (F13)

Governed interoperability with incumbent EOC platforms (WebEOC, Veoci, DisasterLAN) via approved adapters at MVP depth.

### US-13.1: Exchange incidents and resource requests with our incumbent EOC system
**As a** Maria Alvarez / EOC Director, **I want to** keep using EPMP alongside our existing WebEOC/Veoci/DisasterLAN deployment with incidents, resource requests, status, and activity logs exchanged automatically, **so that** my agency can adopt EPMP as a coordination layer without abandoning our incumbent investment.

**Acceptance Criteria:**
- [ ] Inbound/outbound sync covers exactly four record types: Incident, Resource Request, Status Update, Activity Log Entry
- [ ] Every sync cycle checks the record-authority registry before applying any inbound change; undeclared record types are not synced
- [ ] Outbound sync to the external system only occurs for record types where the registry permits an EPMP-originated write
- [ ] Adapter authentication failure shows a clear message (401 EOC_ADAPTER_AUTH_FAILED)

**Priority:** P1 | **Feature Ref:** F13

---

### US-13.2: Resolve a conflict between EPMP and an incumbent EOC system
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see both values side by side when EPMP and an incumbent EOC system disagree on the same record, and explicitly choose which to keep, **so that** neither system silently overwrites meaningful data.

**Acceptance Criteria:**
- [ ] A detected conflict shows both values side by side with "Keep EPMP value" / "Keep [external] value" actions — never auto-resolved by any heuristic (e.g., last-write-wins)
- [ ] The resolution is written back through the adapter to the external system if EPMP's value was kept, or applied locally if the external value was kept
- [ ] Integration-health view shows System, Last sync, Direction, Record authority, and `SyncStatus` for the connected COTS system
- [ ] An outbound write rejected by the external system shows the vendor's error reason (502 EOC_OUTBOUND_REJECTED)

**Priority:** P1 | **Feature Ref:** F13
## Epic 14: Notification Provider & Public-Alerting Integration (F14)

Outbound integration with external notification providers and the FEMA IPAWS/OASIS CAP ecosystem for approval-controlled public warning distribution.

### US-14.1: Dispatch an approved message through a real notification provider
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** have my approved notification actually dispatched through our configured provider (e.g., Everbridge/AtHoc-class channel) with delivery status fed back, **so that** sending a message is real, trackable action rather than a best-effort guess.

**Acceptance Criteria:**
- [ ] The send endpoint rejects any request lacking `approved_by`/`approved_at`, unconditionally, with no override (400 SEND_REQUIRES_APPROVAL)
- [ ] Delivery/acknowledgment callbacks from the provider update F5's delivery-tracking view in near-real-time, matched by `external_message_id`
- [ ] A provider outage queues the message for retry with backoff rather than dropping it; failures surface in F5's delivery view with a visible reason and retry status (503 PROVIDER_UNAVAILABLE)
- [ ] An unmatched delivery callback is logged for investigation, never silently discarded or attached to the wrong record

**Priority:** P1 | **Feature Ref:** F14

---

### US-14.2: Send a public warning through IPAWS/CAP with complete required fields
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** have any message routed through IPAWS/CAP-compatible channels formatted to the complete OASIS CAP standard under our agency's authorized sender identity, **so that** public warnings meet the required legal/technical format and never go out under an unauthorized identity.

**Acceptance Criteria:**
- [ ] CAP-formatted sends include all OASIS CAP required fields (identifier, sender, sent, status, scope, category, event, urgency, severity, certainty, area)
- [ ] An incomplete CAP payload is never dispatched — it is rejected back to the composer for completion (422 CAP_FIELDS_INCOMPLETE)
- [ ] EPMP never originates a CAP alert without an explicit, agency-authorized sender identity attached
- [ ] An agency without IPAWS/CAP channel authorization is blocked from sending through it (403 CAP_AUTHORITY_DENIED)
- [ ] This CAP-formatting step never runs for a message that has not passed F5's named-person approval gate

**Priority:** P1 | **Feature Ref:** F14
## Epic 15: CAD / 911 Integration (F15)

Read integration with CAD/911 dispatch systems to surface dispatch status against an EPMP incident without EPMP becoming a dispatch system of record.

### US-15.1: See read-only dispatch status within the incident workspace
**As a** James Okafor / Incident Commander, **I want to** see CAD/911 dispatch status (dispatched, en route, on scene, cleared) displayed within my incident workspace, **so that** I have a fuller operational picture without needing a separate dispatch screen.

**Acceptance Criteria:**
- [ ] Matched dispatch events display as a read-only panel/card within the linked incident workspace, carrying `Provenance` (CAD system name, timestamp)
- [ ] Dispatch events are matched to an incident either automatically (shared incident number) or via human-confirmed match (geographic/time proximity)
- [ ] An attempted edit to dispatch-status data from within EPMP is blocked with a clear explanation (403 CAD_RECORD_READ_ONLY) — CAD/911 remains the system of record
- [ ] No PATCH/PUT/DELETE route exists for this resource at the API level — the contract is read-only by design
- [ ] A CAD feed outage shows last-known dispatch status labeled with its age, logged to Integration Health (503 CAD_FEED_UNREACHABLE)

**Priority:** P2 | **Feature Ref:** F15
## Epic 16: HR / IAM & Identity Integration (F16)

Identity, organization, role, qualification, and contact-record integration with an agency's HR/IAM systems.

### US-16.1: See personnel roster and qualification data flow into role and resource assignment
**As a** James Okafor / Incident Commander, **I want to** search and assign personnel for command roles and resource requests using roster/qualification data synced from our HR/IAM system, **so that** I can assign the right qualified person without manually re-entering personnel data.

**Acceptance Criteria:**
- [ ] Personnel records from HR/IAM are matched to existing EPMP users by email; unmatched records are retained as reference-only entries available for selection, never silently discarded
- [ ] Role and qualification data populate F1's command-role assignment search (S1.4) and F4's resource-request owner/assignment fields as reference data
- [ ] Roster sync never overwrites EPMP-owned fields (RBAC role assignment, theme preference, audit history) — it only updates HR-sourced reference fields
- [ ] A roster record missing required fields is skipped and counted, not silently dropped without trace (422 HRIS_RECORD_INCOMPLETE)

**Priority:** P1 | **Feature Ref:** F16

---

### US-16.2: Flag conflicts when a locally edited field disagrees with HR as authority
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see a flagged conflict rather than a silent overwrite when a locally edited field disagrees with an HR-authoritative field on the next sync, **so that** personnel data integrity is preserved without losing either side's information.

**Acceptance Criteria:**
- [ ] A conflicting local edit to an HR-authoritative field is flagged (200 flagged HR_FIELD_CONFLICT), not silently overwritten on next sync
- [ ] HRIS feed health (last sync, record counts, errors) is visible in F8's Integration Health view
- [ ] An unreachable HRIS feed shows last-synced roster data labeled with its age, logged for investigation (503 HRIS_FEED_UNREACHABLE)

**Priority:** P1 | **Feature Ref:** F16

---

### US-16.3: Sign in via the same SSO connection used for authentication
**As a** Maria Alvarez / EOC Director, **I want to** authenticate via the same SAML2/OIDC identity-provider connection my agency already uses for every system, **so that** I don't manage a separate EPMP-specific credential.

**Acceptance Criteria:**
- [ ] SSO authentication for F16 shares the same SAML2/OIDC integration configured in F8 (no duplicated login flow)
- [ ] Identity-mapping needs specific to roster data consume the same IdP connection without re-prompting the user
- [ ] This authentication path is on the P0 critical path shared with F8

**Priority:** P0 | **Feature Ref:** F16
## Epic 17: Asset, Facility & Document System Integration (F17)

Read integration with asset/facility/ERP systems for site status, and permission-aware document import/link/sync for plans and evidence.

### US-17.1: See facility status and location on the operating picture
**As a** James Okafor / Incident Commander, **I want to** see facility markers with current status and location sourced from our asset/facility system, **so that** I know what's operational without a separate facilities lookup.

**Acceptance Criteria:**
- [ ] Facility status/location is read via the approved adapter and normalized with `source` and `as_of` provenance before rendering as a facility marker (square shape, status-toned) on F2's operating picture
- [ ] No inventory, maintenance, or cost fields are ever requested, stored, or displayed, even if present in the vendor response — discarded at the adapter boundary
- [ ] A facility feed outage shows last-known facility positions on the map, labeled with their age (503 FACILITY_FEED_UNREACHABLE)

**Priority:** P2 | **Feature Ref:** F17

---

### US-17.2: Import or link a document without exceeding my own SharePoint permissions
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** browse, import, or live-link a document from our SharePoint library into the plan repository using my own delegated permissions, **so that** I never see or import something I couldn't already access in the source system.

**Acceptance Criteria:**
- [ ] Browse/import/link operations always execute under the requesting user's own delegated permissions, never a shared service account with broader access
- [ ] A "Link live" document's permission state is re-validated at minimum before each render in F3's reading view; a revoked permission immediately restricts visibility (403 LINK_PERMISSION_REVOKED)
- [ ] A source-side content change on a "Link live" document is flagged to a named person for review, never silently applied (200 flagged LINKED_DOCUMENT_CHANGED)
- [ ] Attempting to import a document the user lacks source-system access to is denied (403 IMPORT_PERMISSION_DENIED)

**Priority:** P2 | **Feature Ref:** F17
## Epic 18: Persona & Role-Specific Dashboards (F18)

Tailored default views and navigation for each of the five consolidated personas, driven by RBAC.

### US-18.1: Land on a role-relevant dashboard immediately after sign-in
**As a** Maria Alvarez / EOC Director, **I want to** land on a readiness-and-activation dashboard scoped to my jurisdiction the moment I sign in, **so that** I never have to navigate to find my starting point.

**Acceptance Criteria:**
- [ ] On sign-in, F18 resolves role (and facet, for PER-05) and routes to the correct default landing view with the correct `SideNav`/bottom-bar configuration
- [ ] Every role maps to exactly one default landing view and nav configuration — a role with no mapping falls back to a generic dashboard with an explicit "contact your administrator" note, never a blank page (200 fallback ROLE_VIEW_UNMAPPED)
- [ ] Primary actions surfaced on the landing view match the role's top tasks (e.g., Maria sees "Create incident," "Activate EOC," "Review plan approvals")
- [ ] Status vocabulary (severity, task status, resource-request status) renders identically across every role's view of the same underlying record

**Priority:** P0 | **Feature Ref:** F18

---

### US-18.2: Operate a field-mobile landing experience with exactly 4 destinations
**As a** Diego Reyes / Field Responder, **I want to** land on a mobile field-home screen with bottom-bar navigation limited to the 4 actions I actually need, **so that** I'm never navigating a desktop-oriented interface on my phone in the field.

**Acceptance Criteria:**
- [ ] Default landing view is Field Home (F6), mobile breakpoint, bottom-bar only (Tasks, Report, Map, Profile)
- [ ] Mobile bottom-bar destinations never exceed 4, regardless of role
- [ ] No desktop `SideNav` variant is offered to this role by default
- [ ] "Report observation" remains the single primary action in the bottom action bar

**Priority:** P0 | **Feature Ref:** F18

---

### US-18.3: Switch between admin and executive facets without ambiguity
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** explicitly toggle between my Admin Console view and my Executive-briefing view, **so that** the system never guesses which facet I need and I always know which hat I'm wearing.

**Acceptance Criteria:**
- [ ] A facet toggle at the top of the landing view switches between Admin Console (default: Platform Monitoring) and Executive-briefing dashboard — never auto-selected by the system
- [ ] Executive-briefing view shows `display`-scale numbers for 1–3 headline KPIs only, each with definition/period/source in caption, with no charts or decoration
- [ ] A facet toggle attempted without both-facet permission is denied (403 FACET_ACCESS_DENIED)
- [ ] "View full reporting" links from the executive facet to F7's Analytics Dashboard for drill-down
- [ ] Unavailable executive KPI data shows a clear retry message (503 KPI_DATA_UNAVAILABLE) rather than a blank tile

**Priority:** P0 | **Feature Ref:** F18
## Story Index

| Story ID | Title | Priority | Feature Ref |
|---|---|---|---|
| US-0.1 | Role-scoped navigation on sign-in | P0 | F0 |
| US-0.2 | Switch between light, dark, and contrast themes | P0 | F0 |
| US-0.3 | Consistent loading, empty, and error states everywhere | P0 | F0 |
| US-0.4 | Design-system-only screens with no ad hoc components | P0 | F0 |
| US-1.1 | Create and classify a new incident | P0 | F1 |
| US-1.2 | Assign command roles with named-person accountability | P0 | F1 |
| US-1.3 | Change activation level with explicit consequence confirmation | P0 | F1 |
| US-1.4 | Monitor the incident via a single workspace | P0 | F1 |
| US-1.5 | Complete ICS forms with AI-assisted drafting | P0 | F1 |
| US-1.6 | Close an incident with explicit consequence | P0 | F1 |
| US-2.1 | View incidents, facilities, and resources on a shared map | P0 | F2 |
| US-2.2 | Toggle weather/hazard overlay layers with provenance | P0 | F2 |
| US-2.3 | Operate the map in degraded/offline GIS conditions | P0 | F2 |
| US-2.4 | View a live EOC/executive dashboard summary | P0 | F2 |
| US-3.1 | Maintain a versioned, approvable plan repository | P0 | F3 |
| US-3.2 | Link plan sections to the tasks they generate | P0 | F3 |
| US-3.3 | Import plans from an existing document system | P0 | F3 |
| US-3.4 | Read plans in a focused, distraction-free view | P0 | F3 |
| US-4.1 | Create and assign a task with a named owner | P0 | F4 |
| US-4.2 | Track a task through its full status lifecycle | P0 | F4 |
| US-4.3 | Submit and track a resource request | P0 | F4 |
| US-4.4 | Approve, decline, or fulfill a resource request | P0 | F4 |
| US-5.1 | Manage reusable recipient groups and message templates | P0 | F5 |
| US-5.2 | Compose a notification through a required audience→message→review→send flow | P0 | F5 |
| US-5.3 | Track delivery and acknowledgment of a sent notification | P0 | F5 |
| US-6.1 | Check and update my tasks from the field, even offline | P0 | F6 |
| US-6.2 | Submit a structured field report with photo and location | P0 | F6 |
| US-6.3 | Confirm queued submissions synced successfully on reconnect | P0 | F6 |
| US-6.4 | Resolve a sync conflict without losing data | P0 | F6 |
| US-7.1 | Generate a SITREP from current incident data | P0 | F7 |
| US-7.2 | Generate an after-action report once an incident closes | P0 | F7 |
| US-7.3 | Review an exportable, append-only evidence and audit log | P0 | F7 |
| US-7.4 | Review KPI trends on an analytics dashboard | P0 | F7 |
| US-8.1 | Sign in via agency SSO | P0 | F8 |
| US-8.2 | Configure granular, role- and jurisdiction-scoped permissions | P0 | F8 |
| US-8.3 | Review an immutable, append-only audit trail | P0 | F8 |
| US-8.4 | Monitor platform availability and integration health | P0 | F8 |
| US-8.5 | Configure SSO safely with a mandatory test step | P0 | F8 |
| US-9.1 | Review and validate candidate signals before they become incidents | P1 | F9 |
| US-9.2 | Draft ICS form and narrative text with AI, always reviewed before approval | P1 | F9 |
| US-9.3 | Trust that AI can never auto-issue a public warning or binding decision | P1 | F9 |
| US-10.1 | Declare and view record authority per external system | P0 | F10 |
| US-10.2 | Grant and revoke cross-jurisdiction data federation | P0 | F10 |
| US-10.3 | Trust that ingested data always carries provenance | P0 | F10 |
| US-10.4 | Monitor background job health | P0 | F10 |
| US-10.5 | View and revoke registered API clients and partner access | P0 | F10 |
| US-11.1 | Render the operating picture on our agency's real GIS base map | P0 | F11 |
| US-11.2 | Publish EPMP-authored layers back to the agency GIS where permitted | P0 | F11 |
| US-12.1 | See hazard feed data as a toggleable, provenance-labeled layer | P1 | F12 |
| US-12.2 | Verify a hazard layer as a deliberate human action | P1 | F12 |
| US-13.1 | Exchange incidents and resource requests with our incumbent EOC system | P1 | F13 |
| US-13.2 | Resolve a conflict between EPMP and an incumbent EOC system | P1 | F13 |
| US-14.1 | Dispatch an approved message through a real notification provider | P1 | F14 |
| US-14.2 | Send a public warning through IPAWS/CAP with complete required fields | P1 | F14 |
| US-15.1 | See read-only dispatch status within the incident workspace | P2 | F15 |
| US-16.1 | See personnel roster and qualification data flow into role/resource assignment | P1 | F16 |
| US-16.2 | Flag conflicts when a locally edited field disagrees with HR as authority | P1 | F16 |
| US-16.3 | Sign in via the same SSO connection used for authentication | P0 | F16 |
| US-17.1 | See facility status and location on the operating picture | P2 | F17 |
| US-17.2 | Import or link a document without exceeding my own SharePoint permissions | P2 | F17 |
| US-18.1 | Land on a role-relevant dashboard immediately after sign-in | P0 | F18 |
| US-18.2 | Operate a field-mobile landing experience with exactly 4 destinations | P0 | F18 |
| US-18.3 | Switch between admin and executive facets without ambiguity | P0 | F18 |

## Summary Table

| Epic | Story Count | P0 | P1 | P2 |
|------|-------------|----|----|-----|
| Epic 0: Application Shell (F0) | 4 | 4 | 0 | 0 |
| Epic 1: Incident / ICS (F1) | 6 | 6 | 0 | 0 |
| Epic 2: Common Operating Picture (F2) | 4 | 4 | 0 | 0 |
| Epic 3: Plans & Playbooks (F3) | 4 | 4 | 0 | 0 |
| Epic 4: Tasks & Resource Requests (F4) | 4 | 4 | 0 | 0 |
| Epic 5: Notifications Integration (F5) | 3 | 3 | 0 | 0 |
| Epic 6: Mobile Field Operations (F6) | 4 | 4 | 0 | 0 |
| Epic 7: Reporting & Learning (F7) | 4 | 4 | 0 | 0 |
| Epic 8: Security & Administration (F8) | 5 | 5 | 0 | 0 |
| Epic 9: AI-Assisted Drafting & Signal Triage (F9) | 3 | 0 | 3 | 0 |
| Epic 10: Platform API, Integration Gateway & Event Bus (F10) | 5 | 5 | 0 | 0 |
| Epic 11: GIS & Geospatial Integration (F11) | 2 | 2 | 0 | 0 |
| Epic 12: Weather & Hazard Feed Ingestion (F12) | 2 | 0 | 2 | 0 |
| Epic 13: EOC COTS Interoperability (F13) | 2 | 0 | 2 | 0 |
| Epic 14: Notification Provider & Public-Alerting Integration (F14) | 2 | 0 | 2 | 0 |
| Epic 15: CAD / 911 Integration (F15) | 1 | 0 | 0 | 1 |
| Epic 16: HR / IAM & Identity Integration (F16) | 3 | 1 | 2 | 0 |
| Epic 17: Asset, Facility & Document System Integration (F17) | 2 | 0 | 0 | 2 |
| Epic 18: Persona & Role-Specific Dashboards (F18) | 3 | 3 | 0 | 0 |
| **Total** | **63** | **49** | **11** | **3** |

---
## Priority Definitions

| Priority | Definition |
|----------|------------|
| **P0** | Critical - Must have for MVP. Covers the application shell, all eight named operational modules (Incident/ICS, Common Operating Picture, Plans & Playbooks, Tasks & Resource Requests, Notifications, Mobile Field Operations, Reporting & Learning), Security & Administration, the Platform API/Event Bus, GIS integration, SSO/authentication (F16), and persona dashboards. |
| **P1** | High - Important for first release but not required for the core incident-activation demonstration path. Covers AI-Assisted Drafting & Signal Triage, Weather & Hazard Feed Ingestion, EOC COTS Interoperability, Notification Provider & Public-Alerting Integration, and HR/IAM roster/qualification sync. |
| **P2** | Medium - Valuable but depends on agency-specific vendor access or supports (without blocking) the core MVP path. Covers CAD/911 Integration and Asset/Facility/Document System Integration. |
| **P3** | Low - Future consideration. No P3 stories are in this MVP scope; all out-of-scope items are tracked in PRD-EPMP.md §10. |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-11-14*
