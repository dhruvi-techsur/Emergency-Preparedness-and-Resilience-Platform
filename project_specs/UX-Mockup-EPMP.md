# UX Mockup

**Project:** EPMP (Emergency Preparedness & Management Platform)
**Generated:** 2026-11-14
**Based on:** UserStories-EPMP.md, JOURNEYS-EPMP.md, PRD-EPMP.md, FRD-EPMP.md, EPMP-Design-System.pdf.md, EPMP-llm-build-guide.md

---

## Overview

EPMP's UX is built exclusively from the EPMP Design System's 40 `window.EPMP` components and its nine named page patterns (app shell, dashboard, incident workspace, lists/tables, forms, field-mobile, operating-picture/map, analytics/reporting, notifications/alerts, interoperability/integration-health). No screen in this document introduces a component, color, or layout pattern outside that system. Every component reference below names the exact `window.EPMP` component (e.g., `PageHeader`, `Table`, `AIDraft`, `SyncStatus`) and, where relevant, the exact token-driven state (e.g., `Badge tone="danger" solid`).

**Design principles carried into every screen:**
1. **Calm under pressure** — one `primary` Button per region, quiet `bg`/`bg-subtle` surfaces, color never used alone for status.
2. **Evidence and provenance** — every ingested or AI-derived fact on screen carries a `Provenance` chip (source, time, verified/unverified).
3. **Humans decide** — all AI content renders only inside `AIDraft`, gated behind a named-person Approve action; nothing AI-generated is ever auto-issued.
4. **Works when connectivity does not** — `SyncStatus` is pinned in the header (desktop) or top of screen (field-mobile) on every view, reflecting `online`/`syncing`/`offline`/`conflict`.
5. **One next action** — `PageHeader` actions and `Modal` footers name the outcome explicitly ("Escalate to Full" / "Keep at Partial"), never "Yes/No" or "Submit".
6. **Accessible by default** — WCAG 2.2 AA (7:1 in `contrast` theme), Section 508, one `h1` per page via `PageHeader`, visible 2px `focus-ring` on every interactive element, 44px (`size="lg"`) touch targets on field-mobile.

**Personas and their primary journeys covered:**

| Persona | Role | Primary Journeys | Primary Screens |
|---|---|---|---|
| PER-01 | Maria Alvarez — EOC Director / EMA Coordinator | JRN-01.1 (start-of-shift readiness), JRN-01.2 (storm activation) | EOC/Executive Dashboard, Incident Create, Activation Modal, Plan Repository |
| PER-02 | James Okafor — Incident Commander / PIO | JRN-02.1 (full incident lifecycle), JRN-02.2 (public message approval) | Incident Workspace (Timeline/Tasks/Resources/Reports), Notification Compose, Delivery Tracking |
| PER-03 | Priya Nandan — Planning & Logistics Section Chief | JRN-03.1 (resource request + SITREP), JRN-03.2 (AAR + plan linkage) | Resource Request Detail, SITREP Generator, AAR Generator, Plan Editor |
| PER-04 | Diego Reyes — Field Responder | JRN-04.1 (offline field reporting + sync) | Field Home, My Tasks (field), Report Observation, Sync Conflict Resolution |
| PER-05 | Dana Whitfield — IT/SecOps Admin & Executive Sponsor | JRN-05.1 (integration conflict resolution), JRN-05.2 (quarterly executive review) | Admin Console (Users/Roles/Audit/Integration Health), Executive Briefing Dashboard |

**Navigation structure (per F0/F18):** `SideNav` is lifecycle-ordered — Prepare, Monitor, Activate, Coordinate, Recover, Improve — with 6–9 top-level items scoped per role by RBAC (F8). Below `bp-md` (768px), `SideNav` collapses to a bottom bar of exactly 4 role-dependent destinations. No role ever sees a disabled/grayed nav item for a capability it lacks — absent items only.

---

## Navigation Map

| Screen | Route | Reached from | Nav element |
|--------|-------|--------------|-------------|
| EOC / Executive Dashboard (PER-01 landing) | `/dashboard` | App shell (sign-in default for PER-01) | SideNav: "Dashboard" (top, no group) |
| Executive Briefing Dashboard (PER-05 executive facet) | `/executive` | App shell (sign-in default, executive facet) / Facet toggle on PER-05 landing | SideNav: "Executive dashboard" (executive facet) |
| Operating Picture (Map) | `/operating-picture` | SideNav | SideNav → Monitor: "Operating picture" |
| Incident List | `/incidents` | SideNav | SideNav → Activate: "Incidents" |
| Create Incident (form) | `/incidents/new` | Incident List primary action | Button: "Create incident" |
| Incident Workspace | `/incidents/{id}` | Incident List row click / Dashboard map thumbnail / Signal Triage promote | Row click: incident name link |
| Command Role Assignment (Modal) | n/a (modal over Incident Workspace) | Incident Workspace command-roles panel | Button: "Reassign" (per row) |
| Activation Level Change (Modal) | n/a (modal over Incident Workspace) | Incident Workspace PageHeader status control | Control: activation-level Select/Badge in PageHeader |
| ICS Form / Checklist Editor | `/incidents/{id}/forms/{formId}` | Incident Workspace → Reports tab | Row click: form name link |
| Plan Repository (List) | `/plans` | SideNav | SideNav → Prepare: "Plans & playbooks" |
| Plan Detail / Reading View | `/plans/{id}` | Plan Repository row click | Row click: plan name link |
| Plan Editor | `/plans/{id}/edit` | Plan Detail "Edit" action | Button: "Edit" |
| Link Tasks to Plan Section (Modal) | n/a (modal over Plan Editor) | Plan Editor section "Link tasks" action | Button: "Link tasks" |
| Import from Document System (Modal) | n/a (modal over Plan Repository) | Plan Repository primary action menu | Button: "Import plan" |
| Task List (standalone) | `/tasks` | SideNav | SideNav → Coordinate: "Tasks" |
| Task List (embedded) | `/incidents/{id}` (Tasks tab) | Incident Workspace | Tabs: "Tasks" |
| Create/Edit Task (form) | `/tasks/new` or `/incidents/{id}/tasks/new` | Task List primary action / Incident Workspace Tasks tab | Button: "New task" |
| Task Detail | `/tasks/{id}` | Task List row click | Row click: task title link |
| Resource Request List (standalone) | `/resource-requests` | SideNav | SideNav → Coordinate: "Resources" |
| Resource Request List (embedded) | `/incidents/{id}` (Resources tab) | Incident Workspace | Tabs: "Resources" |
| Create/Edit Resource Request (form) | `/resource-requests/new` | Resource Request List primary action | Button: "New resource request" |
| Resource Request Detail | `/resource-requests/{id}` | Resource Request List row click | Row click: request name link |
| Recipient Groups (List + Editor) | `/notifications/groups` | SideNav | SideNav → Coordinate: "Notifications" → sub-tab "Groups" |
| Message Templates (List + Editor) | `/notifications/templates` | SideNav | SideNav → Coordinate: "Notifications" → sub-tab "Templates" |
| Compose Notification (4-step flow) | `/notifications/compose` | Notifications landing primary action / Incident Workspace "Compose notification" | Button: "Compose notification" |
| Delivery & Acknowledgment Tracking | `/notifications/{id}/delivery` | Compose Notification (after send) / Notifications list row click | Auto-redirect on send; row click from sent list |
| Field Home (bottom-nav, mobile) | `/field` | App shell (sign-in default for PER-04) | Bottom bar: "Tasks" (landing) |
| My Tasks (field view) | `/field/tasks` | Field Home bottom bar | Bottom bar: "Tasks" |
| Report Observation (structured form) | `/field/report` | Field Home bottom bar primary action | Bottom bar: "Report" |
| Queued Submissions View | `/field/queued` | SyncStatus indicator tap (field header) | Tap: SyncStatus queued-count pill |
| Sync Conflict Resolution | `/field/conflicts/{id}` | Queued Submissions View conflict row / SyncStatus conflict state | Tap: conflict row / SyncStatus "conflict" alert |
| Field Map (lightweight operating picture) | `/field/map` | Field Home bottom bar | Bottom bar: "Map" |
| SITREP Generator | `/incidents/{id}/sitreps/new` | Incident Workspace Reports tab / PageHeader "Generate SITREP" | Button: "Generate SITREP" |
| AAR Generator | `/incidents/{id}/aar/new` | Incident Workspace Reports tab (incident must be Closed) | Button: "Generate AAR" |
| Evidence & Audit Log View | `/admin/audit-log` | Admin Console SideNav | SideNav (admin): "Audit log" |
| Analytics & Reporting Dashboard | `/reports/analytics` | SideNav | SideNav → Improve: "Reports" → sub-tab "Analytics" |
| Admin Console Shell / Users | `/admin/users` | Admin Console SideNav | SideNav (admin): "Users" |
| Roles & Permissions | `/admin/roles` | Admin Console SideNav | SideNav (admin): "Roles & permissions" |
| SSO Configuration | `/admin/sso` | Admin Console SideNav | SideNav (admin): "SSO configuration" |
| Integration Health | `/admin/integration-health` | Admin Console SideNav | SideNav (admin): "Integration health" |
| Platform Monitoring | `/admin/platform-monitoring` | App shell (sign-in default for PER-05 admin facet) | SideNav (admin): "Platform monitoring" |
| Record Authority Registry | `/admin/record-authority` | Admin Console SideNav | SideNav (admin): "Record authority" |
| Federation Grants | `/admin/federation` | Admin Console SideNav | SideNav (admin): "Federation grants" |
| API & Integration Gateway (API Clients) | `/admin/api-clients` | Admin Console SideNav | SideNav (admin): "API clients" |
| Signal Triage Queue | `/signals` | SideNav | SideNav → Monitor: "Signals" |
| Signal Detail | `/signals/{id}` | Signal Triage Queue row click | Row click: signal summary link |
| Theme Switcher | n/a (menu, not a route) | User/profile `Avatar` menu, every page | Avatar menu: "Theme" |

**Invariant check — no orphan screens:** every screen above has at least one inbound path from either the role-scoped `SideNav`/bottom-bar (app shell) or a reachable parent screen already itself reachable from the shell. Modals (Command Role Assignment, Activation Level Change, Link Tasks, Import Document) are reached exclusively from their parent screen's action and are not independently routable.
## User Flows

### Flow 1: Start-of-Shift Readiness & Activity Check (JRN-01.1)

**Trigger:** Maria Alvarez (PER-01) signs in at the start of her shift.
**User Story:** US-0.1 (role-scoped nav), US-2.4 (EOC dashboard), US-3.1 (plan repository)

```
[Sign-in via SSO]
    │
    ▼
[EOC / Executive Dashboard — role-scoped landing, PageHeader h1 "Dashboard"]
    │
    ├── Scans Stat tiles (Active incidents / Open tasks / Pending
    │   resource requests / Notifications pending ack) ──▶ all current,
    │   data-age visible on every tile
    │
    ▼
[Filters operating-picture map thumbnail by jurisdiction + severity Badge]
    │
    ├── Spots an Elevated/Critical marker ──▶ clicks map-thumbnail Card
    │   ──▶ Operating Picture (Map) full view, scoped to that jurisdiction
    │
    ▼
[Navigates to Plan Repository via SideNav → Prepare]
    │
    ├── Checks Status Badge column for overdue Review/Draft plans
    │
    ▼
[Returns to Dashboard, exports readiness summary]
    │
    └── Success ──▶ One-page readiness/activity summary exported
        (Reports/Export action) with timestamp + source per line,
        ready for 8am leadership call
```

**Steps:**
1. Maria signs in; SSO resolves her role (PER-01) and the shell renders the EOC Director `SideNav` plus the Dashboard page pattern as her default landing view (S18.1).
2. `PageHeader` ("Dashboard") + up to 4 `Stat` tiles show Active incidents, Open tasks, Pending resource requests, Notifications pending acknowledgment — each tile shows a data-age caption.
3. A 12-column grid of `Card`s shows the operating-picture map thumbnail (widest card) and a side `Card` with recent cross-incident `Timeline` entries plus a task-status summary.
4. Maria scans severity `Badge`s on the map thumbnail and incident list to triage visually; she clicks through to the full Operating Picture (`MapCanvas`) for any jurisdiction needing attention.
5. She navigates to Plan Repository (`/plans`) via `SideNav` → Prepare, scanning the Status `Badge` column (Draft/Review/Approved) for overdue approvals.
6. She returns to the Dashboard and triggers a one-click readiness-summary export (Reports/F7 pattern), which assembles current data with "as of HH:MM · source" on every line.

---

### Flow 2: Storm Activation Decision & Command Handoff (JRN-01.2)

**Trigger:** Maria is monitoring an approaching storm via the hazard overlay and must decide whether to activate.
**User Story:** US-1.1 (create/classify incident), US-1.2 (assign command roles), US-1.3 (activation level change), US-5.2 (notify), US-10.2 (federation grant — referenced for scoped sharing)

```
[Operating Picture — storm-track hazard overlay layer, LayerPanel
 shows source + "As of HH:MM" + Unverified flag if not yet validated]
    │
    ▼
[Decide: clicks "Create incident" from Incident List PageHeader]
    │
    ▼
[Create Incident form — name, type, severity, jurisdiction,
 description, opened-at]
    │
    ├── Possible-duplicate warning (409) ──▶ Alert shown, does not
    │   block creation
    │
    ▼
[Submit ──▶ Incident Workspace, status=Open, activation=Monitoring,
 first Timeline entry "Incident created" auto-written]
    │
    ▼
[Assign Command — Command Role Assignment Modal: assigns James
 Okafor as Incident Commander]
    │
    ├── Timeline entry: actor + timestamp, auto-captured
    │
    ▼
[Activation Level Change Modal (danger-tier escalation,
 Monitoring → Full)]
    │
    ├── Blocked (422 NO_COMMANDER_ASSIGNED) if no IC assigned yet
    │
    ▼
[Confirms "Escalate to Full" ──▶ Timeline entry + notification
 triggered to assigned roles]
    │
    ▼
[Notify — Compose Notification flow: audience → message → review
 → approve & send]
    │
    ▼
[Share Scoped Picture — Federation Grants: explicit, scoped,
 revocable grant to neighboring jurisdiction]
    │
    └── Success ──▶ Command structure stood up, neighboring
        jurisdiction sees only the granted data slice
```

**Steps:**
1. Maria monitors the storm-track hazard overlay layer on the Operating Picture; unverified feeds show the dashed "Unverified" `Provenance` treatment until validated.
2. She decides to activate and opens Create Incident (`/incidents/new`), completing name/type/severity/jurisdiction/description/opened-at fields; a possible-duplicate `Alert` may appear but never blocks submission.
3. On submit, the Incident Workspace opens immediately with status `Open`, activation `Monitoring`, and an auto-written first `Timeline` entry.
4. She assigns James Okafor as Incident Commander via the Command Role Assignment `Modal`, which writes a `Timeline` entry with actor and timestamp automatically.
5. She escalates activation level via the `Modal danger` confirmation, which is blocked with a clear 422 message if no Incident Commander is assigned; footer buttons name the explicit outcome ("Escalate to Full" / "Keep at Partial").
6. She sends an activation notification via the 4-step Compose Notification flow and tracks delivery/acknowledgment.
7. She grants a neighboring jurisdiction scoped, time-limited, revocable access via Federation Grants (F10 S10.3) for mutual-aid coordination.
### Flow 3: Full Incident Lifecycle — Activation Through After-Action (JRN-02.1, MVP demonstration scenario)

**Trigger:** James Okafor (PER-02) opens the incident workspace after Maria names him Incident Commander.
**User Story:** US-1.4 (single workspace), US-4.1/US-4.2 (tasks), US-4.3/US-4.4 (resource requests), US-2.1 (map), US-9.2 (AI narrative), US-1.6 (closure)

```
[Accept Command — Incident Workspace: PageHeader + command-roles
 panel already populated from Maria's activation]
    │
    ▼
[Assign Roles & Tasks — Tasks tab, "New task" ──▶ Create Task form,
 owner required]
    │
    ├── 422 TASK_OWNER_REQUIRED if no owner selected
    │
    ▼
[Track Resource Request — Resources tab, creates request (generator
 + sandbags), watches Badge move Draft → Awaiting approval → Approved
 → Fulfilled]
    │
    ▼
[Monitor Operating Picture — MapCanvas status-coded markers +
 status bar "As of HH:MM ET · Base layer: agency GIS"]
    │
    ▼
[Record a Decision — Timeline entry, pre-position second generator,
 actor + timestamp auto-captured]
    │
    ▼
[Review AI-Drafted Narrative — "Draft with AI" on an ICS form field
 ──▶ AIDraft panel + Provenance chips below field, never in-field]
    │
    ├── Approve ──▶ text copied into field, reviewer+time logged
    │   to Timeline
    ├── Edit ──▶ adjusts text before approving
    └── Discard ──▶ removed, audit note only
    │
    ▼
[Close & Hand Off Reporting — Modal confirmation states consequence
 ("closes all open tasks to Overdue unless completed")]
    │
    └── Success ──▶ Incident status = Closed; "Generate AAR" becomes
        available to Priya in Reports tab
```

**Steps:**
1. James opens the Incident Workspace (`/incidents/{id}`); `PageHeader` shows incident name, severity `Badge`, subtitle (jurisdiction + opened date); the pinned command-roles `Card` already shows Maria's activation-time assignments.
2. He assigns Planning/Logistics (Priya) and names field-task owners via the Tasks tab's "New task" action; a task cannot be created without an owner (422 `TASK_OWNER_REQUIRED`).
3. He creates a resource request from the Resources tab; it starts `Draft`, becomes `Awaiting approval` on submit, and its `Badge` status is visible end-to-end without a page reload (event-bus driven).
4. He monitors the live `MapCanvas` as field units report shelter status; the status bar always names data age and base-layer source.
5. He logs a decision directly to the `Timeline` (append-only; actor + timestamp auto-captured, never editable after the fact).
6. He reviews an `AIDraft`-generated incident narrative paragraph with `Provenance` sources per fact; nothing is written to the official record until he clicks Approve, which logs reviewer + timestamp.
7. He closes the incident via a `Modal` stating the explicit consequence, which writes a final `Timeline` entry and unlocks AAR generation (F7) for Priya.

---

### Flow 4: Approving and Tracking a Public Shelter-Opening Message (JRN-02.2)

**Trigger:** James (PIO capacity) needs to send a public message about a now-operational shelter.
**User Story:** US-5.1 (recipient groups/templates), US-5.2 (4-step compose), US-5.3 (delivery tracking), US-9.3 (AI never auto-issues public content)

```
[Select Audience — Compose Notification Step 1: geotargeted area
 drawn on MapCanvas/LayerPanel; live recipient-count estimate]
    │
    ▼
[Draft Message — Step 2: "Draft with AI" ──▶ AIDraft panel pulls
 shelter facts from resource/task record + Provenance]
    │
    ├── Approve ──▶ text inserted into message field, logged
    │
    ▼
[Review — Step 3: fully read-only preview of message, channels,
 approver of record — nothing editable without returning to a
 prior step]
    │
    ▼
[Approve & Send — Step 4: signed-in user must match designated
 approver (403 APPROVER_MISMATCH otherwise)]
    │
    ├── Public/external-reach ──▶ Modal danger restates audience
    │   size + channels before dispatch
    │
    ▼
[Track Delivery — Table of recipients, Status Badge
 (Queued/Sent/Delivered/Failed), acknowledgment Progress bar,
 auto-refreshes as F14 callbacks arrive]
    │
    └── Success ──▶ Delivery/ack status visible within minutes;
        no AI content reached the public without named approval
```

**Steps:**
1. James selects a geotargeted recipient group drawn directly on the operating-picture map (`MapCanvas` + `LayerPanel`); a live recipient-count estimate updates as he draws.
2. He drafts the message, optionally clicking "Draft with AI" which inserts an `AIDraft` panel with `Provenance` chips sourced from the shelter's resource/task record — the message field itself is never auto-populated.
3. The Review step (Step 3) is fully read-only: exact message text, channels, and the named approver of record, with no inline editing permitted.
4. At Approve & Send, the system verifies the signed-in user matches the designated approver for the selected channels; public/external-reach sends trigger a `Modal danger` restating audience size and channels as a final deliberate gate.
5. After sending, James checks the Delivery & Acknowledgment Tracking `Table`, which auto-refreshes as provider callbacks (F14) arrive, with failed deliveries always showing a visible reason.
### Flow 5: Resource Request Lifecycle & Daily SITREP (JRN-03.1)

**Trigger:** Priya Nandan (PER-03) is tasked with fulfilling a resource request and producing the evening SITREP.
**User Story:** US-4.3 (submit/track request), US-4.4 (approve/decline/fulfill), US-7.1 (generate SITREP)

```
[Receive Request — Resources tab, request auto-linked to
 originating task/incident]
    │
    ▼
[Approve — Resource Request Detail, "Approve" action]
    │
    ├── "Decline" ──▶ Modal requires non-empty reason
    │   (422 DECLINE_REASON_REQUIRED otherwise)
    │
    ▼
[Assign — optional assignment step: who/what fulfills the request]
    │
    ▼
[Track & Close — status list shows open vs. assigned at a glance;
 "Mark fulfilled" moves status to Fulfilled]
    │
    ▼
[Draft SITREP — SITREP Generator auto-pulls current Timeline, task
 status, resource-request status into structured draft]
    │
    ├── "Draft with AI" on narrative sections ──▶ AIDraft +
    │   Provenance, human-approved
    │
    ▼
[Finalize — Preview pane shows assembled document; "Approve and
 finalize" requires named-person reviewer + timestamp]
    │
    └── Success ──▶ SITREP is official record, ready before evening
        briefing
```

**Steps:**
1. Priya opens the Resources tab in the Incident Workspace; the new request from James is already linked to the shelter task — no manual cross-referencing needed.
2. She reviews request details on the Resource Request Detail screen and clicks "Approve" (a recorded, timestamped transition) or "Decline" (`Modal` requiring a non-empty reason).
3. Approving prompts an optional assignment step naming who/what fulfills the request; the Resource Request List shows exactly which requests remain open vs. already assigned.
4. Once delivered, she marks the request `Fulfilled` — an explicit close action is always required; no request can silently remain "open."
5. She opens the SITREP Generator (`/incidents/{id}/sitreps/new`), which auto-assembles current `Timeline`, task-status, and resource-request data into a structured draft; narrative sections offer `AIDraft`-assisted drafting with `Provenance` per fact.
6. She reviews the assembled document in the preview pane and clicks "Approve and finalize," which requires her recorded identity and timestamp before the SITREP counts as official record — SITREPs remain available throughout the incident's lifecycle, not gated on closure.

---

### Flow 6: Closing the Loop — After-Action Report Into Updated Plans (JRN-03.2)

**Trigger:** The storm incident has closed; Priya must produce the AAR and link findings back to plans.
**User Story:** US-7.2 (generate AAR), US-3.2 (link plan sections to tasks)

```
[Generate AAR — only available once incident status = Closed
 (409 INCIDENT_NOT_CLOSED otherwise)]
    │
    ▼
[Step 1-3: Timeline export, Decisions log, Resource-request history
 — auto-populated, read-only/annotatable]
    │
    ▼
[Step 4: Findings & corrective actions — each entry requires
 non-null owner + due date before finalization
 (422 CORRECTIVE_ACTION_UNOWNED otherwise)]
    │
    ▼
[Link to Plan — "Link tasks" action on the relevant plan section;
 corrective action references the logistics SOP section]
    │
    ▼
[Step 5: Review & finalize]
    │
    ├── Finalizing writes an immutable, exportable record +
    │   evidence-log entry
    │
    └── Success ──▶ Corrective actions traceable back to an updated
        plan/SOP section
```

**Steps:**
1. Priya triggers "Generate AAR" from the Incident Workspace Reports tab — only enabled once the incident is `Closed`.
2. Steps 1–3 of the AAR wizard (Timeline export, Decisions log, Resource-request history) auto-populate from existing incident data as read-only/annotatable content — nothing is manually re-entered.
3. In Step 4 (Findings & corrective actions), she converts a finding ("second generator arrived too late") into a structured corrective action with a named owner and due date; finalization is blocked (422) until every corrective action has both.
4. She links the corrective action to the specific logistics SOP section it should update, using the Plan & Playbook repository's "Link tasks" linkage pattern (F3 S3.5), without leaving the AAR workflow's conceptual thread.
5. Step 5 finalizes the AAR as an immutable, exportable record and triggers an evidence-log entry — corrections thereafter require a new version or dated addendum, never a direct edit.
### Flow 7: Offline Field Reporting and Reconnect Sync Confirmation (JRN-04.1)

**Trigger:** Diego Reyes (PER-04) is working in an area with zero connectivity and needs to keep reporting.
**User Story:** US-6.1 (check/update tasks offline), US-6.2 (submit structured report), US-6.3 (confirm sync on reconnect), US-6.4 (resolve sync conflict)

```
[Check Tasks — Field Home, SyncStatus pinned at top shows "offline"
 immediately]
    │
    ▼
[My Tasks (field view) — cached locally, loads instantly regardless
 of connectivity; card-per-row layout, one-tap status buttons
 sized lg (44px)]
    │
    ▼
[Submit Report — Report Observation form: one-tap photo capture +
 visible thumbnail, one-tap "Use my location" + lat/long/accuracy
 shown as text]
    │
    ├── 422 REPORT_EMPTY if no description/photo/location present
    │
    ▼
[Update Status — single-action status update ("Mark done"), no
 multi-step form]
    │
    ▼
[Stay Queued — every submission shows "Queued" Badge via SyncStatus
 styling immediately on local capture]
    │
    ▼
[Reconnect — SyncStatus transitions to "syncing"; queued items sync
 in creation order]
    │
    ├── Clean sync ──▶ Timeline entry appended, preserving original
    │   captured_at timestamp
    │
    └── Conflict detected ──▶ Sync Conflict Resolution screen
        │
        ├── "Keep my version" / "Keep EOC version" — no automatic
        │   merge, explicit named-person choice required
        │
        └── Success ──▶ Timeline entry notes which version was kept
            and by whom; zero data loss, zero silent drops
```

**Steps:**
1. Diego opens the Field Home (`/field`), mobile breakpoint, bottom-nav only; `SyncStatus` immediately reflects `offline` state even before he taps anything.
2. He checks My Tasks (field view) — cached locally and instantly available regardless of connectivity, rendered as card-per-row (not a dense table) with `size="lg"` one-tap status buttons.
3. He captures a structured field report: observation type, description, one-tap photo capture with a visible thumbnail confirmation, and one-tap "Use my location" with lat/long + accuracy shown as readable text (not just a map pin). A report cannot be fully empty (422 `REPORT_EMPTY`).
4. He updates a task's status with a single tap ("Mark done") — no multi-step form, no hover or gesture dependency.
5. Every submission immediately shows a "Queued" `Badge` via `SyncStatus` styling the moment it's captured locally — nothing waits silently in an ambiguous state.
6. On reconnect, `SyncStatus` shows `syncing`; all queued items sync automatically in creation order, each appending a `Timeline` entry that preserves the original field-capture `captured_at` timestamp (not the sync time).
7. If a queued submission conflicts with an EOC-side change to the same record, the Sync Conflict Resolution screen (S6.5) shows "Your version" vs. "Current EOC version" side by side with differing fields highlighted; Diego must explicitly choose "Keep my version" or "Keep EOC version" — no default/automatic resolution exists. The resolution writes a `Timeline` entry naming which version was kept and by whom.
8. If a photo fails to upload after reconnect, the report text/location still syncs and the photo failure is flagged separately rather than blocking the whole report.
### Flow 8: Resolving an EOC-COTS Integration Conflict (JRN-05.1, Admin Facet)

**Trigger:** EPMP and WebEOC both record conflicting status updates for the same shelter facility.
**User Story:** US-8.4 (integration health), US-7.3 (audit trail), US-8.2 (RBAC review)

```
[Notice Alert — Admin Console → Integration Health view: alert
 flags a record conflict between EPMP and WebEOC]
    │
    ▼
[Investigate — Integration Health detail: both values shown side
 by side with their respective sources + declared record authority]
    │
    ▼
[Resolve — "Keep EPMP value" / "Keep [external] value" actions
 inline, never a silent overwrite]
    │
    ├── Resolution written back through the adapter if EPMP value
    │   kept; applied locally if external value kept
    │
    ▼
[Verify Audit Entry — Audit Log view: conflict + resolution shown
 with Dana's identity and timestamp]
    │
    ▼
[Review RBAC Scope — Roles & Permissions: checks which roles
 currently access the shelter facility's incident data]
    │
    └── Success ──▶ Record-authority declaration explicit, zero
        silent overwrites, every action captured in append-only
        audit trail
```

**Steps:**
1. Dana Whitfield (PER-05, admin facet) sees a `Badge`-flagged conflict row in the Integration Health `Table` (System, Last sync, Direction, Record authority, `SyncStatus`).
2. She opens the conflict detail, which shows both EPMP's and WebEOC's values side by side with their respective sources and the declared record-authority owner for that record type.
3. She clicks "Keep EPMP value" (or "Keep WebEOC value") — an explicit, deliberate action; the UI never silently overwrites either side.
4. She navigates to the Evidence & Audit Log View (shared pattern with F7 S7.4) to confirm the conflict and resolution are captured with her identity and timestamp, immutable and exportable.
5. While in the admin console, she reviews Roles & Permissions to confirm only the correct roles retain access to the shelter facility's incident data.

---

### Flow 9: Quarterly Executive Review of Readiness and Evidence (JRN-05.2, Executive Facet)

**Trigger:** Dana needs to answer "are we more prepared than last quarter?" ahead of a budget review.
**User Story:** US-7.4 (KPI trends dashboard), US-7.3 (evidence export)

```
[Open Dashboard — Executive Briefing Dashboard: display-scale
 numbers for 1-3 headline KPIs, no other decoration]
    │
    ▼
[Review KPIs — each Stat shows definition, period, source on hover
 or in caption; no invented targets]
    │
    ▼
[Drill Into Evidence — clicks through a KPI to Analytics & Reporting
 Dashboard, then to the underlying incident's AAR and closed
 corrective actions]
    │
    ▼
[Check Compliance Posture — confirms zero unresolved WCAG 2.2 AA /
 Section 508 findings; no FedRAMP claims anywhere in copy]
    │
    ▼
[Prepare Briefing — exports KPI summary + evidence links via
 "Export as CSV/PDF"]
    │
    └── Success ──▶ Leadership-ready packet with evidence links
        intact, built from platform evidence alone
```

**Steps:**
1. Dana (executive facet) signs in and lands directly on the Executive Briefing Dashboard — 1–3 `display`-scale KPI numbers only, no charts, no decoration.
2. She reviews each KPI's definition, baseline, period, and source shown in `caption` or on hover; a KPI never shows a numeric target unless one was explicitly configured — otherwise only the current measured value appears.
3. She clicks "View full reporting" to drill into the Analytics & Reporting Dashboard (F7 S7.5), then further into a specific incident's AAR and its closed corrective actions as traceable evidence.
4. She confirms the compliance posture (zero unresolved accessibility findings, no FedRAMP authorization claims anywhere in product copy).
5. She exports the KPI summary and evidence links as a single leadership-ready packet via "Export as CSV/PDF," with export failures (500 `EXPORT_FAILED`) showing a clear retry message rather than failing silently.
## Screen Designs

### Screen: EOC / Executive Dashboard

**Purpose:** Give PER-01 (and any desk-based role) a shared, time-stamped summary of active incidents, tasks, and resource requests the moment they sign in.
**User Stories:** US-2.4, US-0.1, US-18 (persona landing — S18.1), JRN-01.1

#### Layout

Page pattern: **Dashboard**. Built inside the app shell (`SideNav` + header strip).

```
┌───────────────────────────────────────────────────────────────┐
│ SideNav │ Header: Breadcrumbs · global search Combobox ·       │
│ (240px) │ SyncStatus · alerts IconButton · Avatar              │
├─────────┼─────────────────────────────────────────────────────┤
│         │ PageHeader  h1 "Dashboard"  subtitle: jurisdiction   │
│         │   scope · actions: "Export summary" (secondary)      │
│         ├─────────────────────────────────────────────────────┤
│         │ Stat  Stat  Stat  Stat   (4 tiles, 1 row)            │
│         │ Active   Open    Pending   Notifications             │
│         │ incidents tasks  resource  pending ack               │
│         │                  requests                            │
│         ├─────────────────────────────────────────────────────┤
│         │ Card (8/12, "Operating picture")   │ Card (4/12)     │
│         │  MapCanvas thumbnail, status bar:   │ h3 "Recent      │
│         │  "As of 08:42 ET · Base layer:      │ activity"       │
│         │  agency GIS" · link to full map     │ Timeline        │
│         │                                     │ (cross-incident)│
│         │                                     ├─────────────────│
│         │                                     │ h4 "Task status"│
│         │                                     │ DonutChart      │
└─────────┴─────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Dashboard" page title | `PageHeader` |
| Primary | 4 `Stat` tiles (Active incidents, Open tasks, Pending resource requests, Notifications pending ack) | Row directly under `PageHeader` |
| Secondary (h3) | Operating-picture map thumbnail | Widest `Card`, 8 of 12 columns |
| Secondary (h3) | Recent cross-incident `Timeline` + task-status summary | Side `Card`, 4 of 12 columns |
| Tertiary (caption) | Data-age / source labels on every tile and the map status bar | Beneath each `Stat` value; map status bar |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | 4 `Stat` tiles populated; map thumbnail renders live markers; `Timeline` shows latest 5-8 entries | N/A |
| Loading | `Skeleton` blocks sized to each `Stat` tile and `Card` (>300ms); atomic replace, no layout shift | None required (silent) |
| Success | Live data with "as of HH:MM" caption refreshed via event-bus push | No toast (continuous, not a one-time action) |
| Error | `Alert tone="danger"` at top of content area: "Dashboard is taking longer than expected to load. Retry." (504 `DASHBOARD_TIMEOUT`) | Retry button in `Alert`; last-known `Stat` values remain visible, labeled with their age |
| Empty (first-use) | `EmptyState` inside the recent-activity `Card`: "No incidents yet" + "Create incident" action | Single action, one sentence |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Export summary" | `Button secondary` | Opens the readiness-summary export (Reports/F7 pattern); produces one-click PDF/CSV with timestamp+source per line |
| Operating-picture map thumbnail `Card` | `Card interactive` | Click navigates to full Operating Picture (`/operating-picture`) |
| `Stat` tiles | Static data display | Hover/focus reveals definition, period, source in a `Tooltip` |
| `Timeline` entries | Linked text | Click navigates to the source incident's workspace |
| Global search `Combobox` (header) | Search | Free-text search across incidents, plans, tasks, resources scoped to RBAC |

**Keyboard/focus:** `Stat` tiles and the map-thumbnail `Card` are each one Tab stop; 2px `focus-ring` on focus. `Timeline` entries are individually focusable links.
### Screen: Executive Briefing Dashboard (PER-05 Executive Facet)

**Purpose:** Answer "are we more prepared than last quarter?" using 1–3 headline KPIs with zero operational decoration, for Dana Whitfield's executive-sponsor facet.
**User Stories:** US-7.4, JRN-05.2, S18.5 (executive facet)

#### Layout

Page pattern: **Dashboard (executive-briefing variant)**.

```
┌───────────────────────────────────────────────────────────────┐
│ SideNav (executive facet: Executive dashboard, Reports)        │
│ Header: facet toggle (Admin / Executive) · SyncStatus · Avatar │
├───────────────────────────────────────────────────────────────┤
│ PageHeader  h1 "Executive dashboard"  subtitle: "Operational   │
│   Period ... · Quarter ending ..."  actions: "Export briefing" │
├───────────────────────────────────────────────────────────────┤
│         display            display            display         │
│    Readiness posture   Incident outcomes  Corrective-action    │
│         "87%"                "14 closed"     closure rate       │
│                                                  "62%"           │
│  caption: definition, period,  caption: ...    caption: ...     │
│  source on hover                                                │
├───────────────────────────────────────────────────────────────┤
│  Link: "View full reporting" (secondary, → Analytics Dashboard)│
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Executive dashboard" | `PageHeader` |
| Primary (`display` 40/48) | 1–3 headline KPI numbers only | Centered row, nothing decorative around them |
| Secondary (caption) | Definition, period, source per KPI | On hover or always-visible `caption` beneath each number |
| Tertiary | "View full reporting" drill-down link | Below the KPI row, `secondary` link styling |

No charts, no `Card` grid, no additional panels — the executive-briefing pattern is explicitly decoration-free per the design system's dashboard pattern.

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | 1–3 `display`-scale numbers with captions | N/A |
| Loading | `Skeleton` blocks sized to each `display` number | None |
| Success | Numbers reflect current quarter data | N/A (no toast; persistent view) |
| Error | `Alert danger`: "This date range is taking too long to load. Narrow it and retry." (504 `ANALYTICS_TIMEOUT`) | Retry action in `Alert` |
| Empty | Not applicable — if no KPI has been configured with definition/baseline/owner/cadence, the tile shows only the current measured value, never an invented target |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Facet toggle (Admin/Executive) | `Switch`/`Select` in header | Switches `SideNav` and landing view between admin console and executive briefing — same login, no re-authentication |
| "Export briefing" | `Button secondary` | Produces leadership-ready packet with evidence links intact |
| "View full reporting" | `Button ghost` / link | Navigates to `/reports/analytics` (F7 S7.5) for drill-down |
| KPI number | Static, with `Tooltip` on hover/focus | Reveals definition/baseline/period/source — never a bare number without this context |

**Keyboard/focus:** Each KPI number and its caption form one focusable unit (Tab stop) with `focus-ring`; `Tooltip` content is also reachable via keyboard focus, never hover-only.

**Accessibility note:** This is the only screen in EPMP using `display` type scale; it appears exactly once per view, satisfying the "one `display` per view" rule.
### Screen: Operating Picture (Map)

**Purpose:** Shared, time-stamped situational awareness across incidents, facilities, resources, and hazard layers for every role.
**User Stories:** US-2.1, US-2.2, US-2.3, JRN-02.1 (Monitor Operating Picture), JRN-01.2 (Monitor)

#### Layout

Page pattern: **Operating picture (map)**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Operating picture"  subtitle: jurisdiction     │
│   scope                                                        │
├───────────────────────────────────────┬───────────────────────┤
│  MapCanvas (8 of 12 columns, bp-lg+)   │ Right column (4/12):  │
│   ┌─────────────────────────────┐     │  h3 "Selected incident"│
│   │ MapControls (top-right):    │     │  Timeline (for pinned/ │
│   │  zoom, locate, layers,      │     │  selected incident)    │
│   │  fullscreen                 │     │                        │
│   │                             │     │  h4 "Tasks"            │
│   │  markers: ◆ incident        │     │  Table (task list,     │
│   │  ■ facility ▲ resource      │     │  scoped to selection)  │
│   │  ● shelter — shape+tone,    │     │                        │
│   │  ink outline 2px            │     │                        │
│   │                             │     │                        │
│   │ MapLegend (bottom-left):    │     │                        │
│   │  exactly the glyphs drawn   │     │                        │
│   │                             │     │                        │
│   │ MapPopup (on selection):    │     │                        │
│   │  title, status Badge,       │     │                        │
│   │  2-3 facts, Provenance,     │     │                        │
│   │  1-2 actions                │     │                        │
│   └─────────────────────────────┘     │                        │
│   Status bar: "As of 08:42 ET ·       │                        │
│   Base layer: agency GIS"             │                        │
│   (or "Schematic base map, offline")  │                        │
├───────────────────────────────────────┴───────────────────────┤
│  LayerPanel (opened from MapControls, overlay): 4-8 layers,    │
│  incidents first, reference last; source + "As of HH:MM" +     │
│  verified/unverified flag per row                              │
└───────────────────────────────────────────────────────────────┘
```

Below `bp-md`: map is full width; the right-column list becomes a bottom sheet.

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Operating picture" | `PageHeader` |
| Primary | Live markers (incident/facility/resource/shelter) | `MapCanvas`, 8 of 12 columns |
| Secondary (h3) | Selected/pinned incident `Timeline` + task list | Right column, 4 of 12 |
| Secondary | `LayerPanel` (source, data age, verified flag) | Overlay from `MapControls` |
| Tertiary (caption) | Status bar data age + base-layer source | Bottom of `MapCanvas` |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Live markers + status bar "As of HH:MM ET · Base layer: agency GIS" | N/A |
| Loading | `Skeleton` sized to `MapCanvas` and the right-column `Timeline`/`Table` | None |
| Degraded/offline (GIS feed unavailable) | `MapCanvas` renders schematic base map labeled "Schematic base map, offline"; EPMP markers continue rendering on top | Status bar clearly reflects degraded state, never a stale "as of" silently |
| Error (marker fetch failed) | `Alert danger` above the map: "Couldn't load current positions. Retry." (500 `MARKER_FETCH_FAILED`) | Retry action; last-known markers remain visible |
| Empty | `EmptyState` in right-column `Timeline`/task panel: "No incident selected" + "Select a marker to see details" | One action |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Map markers | Keyboard-focusable (Tab, Enter) | Opens `MapPopup`; also duplicated in a hidden text list for screen readers |
| `MapPopup` close | `IconButton` (label "Close") | Closing returns focus to the originating marker |
| `MapControls` (zoom/locate/layers/fullscreen) | `IconButton` group | Only handlers that are supported render; zoom always shown |
| `LayerPanel` toggle | `Checkbox` per layer row | Immediate toggle, no save step; unverified layers stay dashed "Unverified" even when on |
| `MapPopup` deep-link actions | `Button secondary`/link | Navigate to full incident workspace, resource detail, or facility detail |

**Keyboard/focus:** Pan/zoom operable via keyboard in the underlying map engine plus `MapControls`; every marker is a Tab stop with `focus-ring` halo on selection; no marker relies on tone alone (shape + 2px `ink` outline on every marker).

**Responsive:** Below `bp-md`, map is full width, `LayerPanel`/list content collapses to a bottom sheet; `MapLegend` is collapsible on mobile.
### Screen: Incident List

**Purpose:** Browse, filter, and triage all incidents the user's role/jurisdiction can see.
**User Stories:** US-1.1, US-0.3 (states standard)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Incidents"  actions: "Create incident" (primary)│
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search TextField · filter Selects (severity,          │
│  activation, jurisdiction) · caption "1 to 25 of 140"           │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                             │
│  Table                                                           │
│   Name (linked) │ Type │ Severity (Badge) │ Jurisdiction │       │
│   Activation │ Opened │ Commander (Avatar+name)                 │
│   ─────────────────────────────────────────────────────────    │
│   Riverbend Flood │ Flood │ Critical (danger solid) │ ...       │
│   ...                                                            │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Incidents" | `PageHeader` |
| Primary | Name, Severity `Badge`, Activation columns | First columns, left-aligned, linked name |
| Secondary | Type, Jurisdiction, Opened, Commander | Remaining `Table` columns |
| Tertiary (caption) | Row count "1 to 25 of 140" | Toolbar, right-aligned |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Populated `Table`, selected row `brand-subtle` | N/A |
| Loading | 6 `Skeleton` rows sized to the final table layout | None |
| Empty (first-use) | `EmptyState`: "No incidents yet" + "Create incident" action | One sentence, one action |
| Empty (filtered) | `EmptyState`: "No incidents match" + "Clear filters" action | Visually distinct copy from first-use |
| Error | `Alert danger` above table + Retry; last-known rows stay visible, labeled with age | Retry restores full table |
| Bulk-selection | Toolbar replaced by bulk actions (e.g., "Export selected") | Selected rows highlighted `brand-subtle` |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Create incident" | `Button primary` | Navigates to `/incidents/new` |
| Row (Name column) | Linked text | Navigates to Incident Workspace |
| Filter `Select`s | Severity/activation/jurisdiction | Immediate filter, no save step |
| Search `TextField` | Free text | Filters table client/server-side |

**Keyboard/focus:** `Table` rows are reachable by Tab; `onRowClick` also triggers on Enter when a row is focused. Status columns always render as `Badge` (icon+word+color), never plain colored text.
### Screen: Create Incident (form)

**Purpose:** Capture a new incident's classification so the team has a single authoritative record from the first moment of an event.
**User Stories:** US-1.1, JRN-01.2 (Decide/Activate)

#### Layout

Page pattern: **Forms**, single column, max 560px.

```
┌───────────────────────────────────────┐
│ PageHeader  h1 "Create incident"       │
├───────────────────────────────────────┤
│ TextField  "Name" (required)           │
│ Select     "Type"                      │
│ Select     "Severity" (Critical/       │
│            Elevated/Watch/Normal)      │
│ Combobox   "Jurisdiction" (searchable) │
│ TextField multiline "Description"      │
│ DatePicker withTime zone "Opened at"   │
├───────────────────────────────────────┤
│  [Cancel ghost]      [Create incident  │
│                        primary]        │
└───────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Create incident" | `PageHeader` |
| Primary | Name, Type, Severity (required fields) | Top of form |
| Secondary | Jurisdiction, Description, Opened at | Remaining fields, `space-5` gaps |
| Tertiary | Cancel action | Footer, left of primary, `ghost` |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty form, "Create incident" primary enabled | N/A |
| Validating | Inline field errors on blur | "Enter a date after..." style, cause-then-fix copy |
| Possible duplicate | `Alert warning` above form: "An incident named '[name]' was opened in the last 24 hours. Confirm this is a new incident." (409, non-blocking) | Does not block submission |
| Submit error | Focus moves to first invalid field; summary `Alert danger` above form | Names what's wrong, never clears entered data |
| Success | Redirects immediately to Incident Workspace | No toast needed (navigation is the confirmation) |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Create incident" | `Button primary` | Submits; on success routes to `/incidents/{id}` |
| "Cancel" | `Button ghost` | Returns to Incident List, discards entered data (confirmed via standard browser/SPA navigation guard if dirty) |
| Opened-at `DatePicker` | `withTime zone` | Always states time zone; never silently defaults a time |

**Keyboard/focus:** Labels always above fields; errors linked via `aria-describedby`; required fields marked with `required` attribute, not placeholder text. Validates on blur and on submit.
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
### Screen: ICS Form / Checklist Editor (with AIDraft + Provenance review)

**Purpose:** Let Priya complete structured ICS forms with optional AI-drafted narrative sections, always human-reviewed before becoming official.
**User Stories:** US-1.5, US-9.2, JRN-02.1 (Review AI-Drafted Narrative)

#### Layout

Page pattern: **Forms** (long-form, stepped).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "ICS-201: Incident Briefing"  status Badge:     │
│   "Draft" (neutral)                                             │
├───────────────────────────────────────────────────────────────┤
│ Progress  "Step 2 of 4"  ▓▓▓▓▓▓░░░░   autosave: "Saved 08:41"  │
├───────────────────────────────────────────────────────────────┤
│ h4 "Situation summary"                                          │
│ TextField multiline "Narrative"                                 │
│  [Draft with AI]  (Button secondary)                             │
│                                                                   │
│  ┌─ AIDraft panel (inserted below field on click) ──────────┐  │
│  │ "Not issued" Badge (persists until Approve)               │  │
│  │ Draft text: "Flooding has affected 3 shelters as of       │  │
│  │  08:30. Resource requests pending for 2 generators..."     │  │
│  │ Provenance chips: [Incident Timeline · 08:30 · Verified]  │  │
│  │  [Resource Request #1182 · 07:55 · Verified]               │  │
│  │ note (if low confidence): "Low confidence: only one        │  │
│  │  source available"                                          │  │
│  │                [Discard]  [Edit]  [Approve primary]        │  │
│  └─────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│  [Cancel ghost]       [Back]   [Continue primary]               │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | Form name (e.g., "ICS-201: Incident Briefing") | `PageHeader` |
| Primary | Current step's 5–8 fields | Main form body |
| Secondary (h4) | Field group heading | Above each field group |
| Secondary | `AIDraft` panel (draft text, "Not issued" `Badge`) | Directly below the narrative field, never inside it |
| Tertiary | `Provenance` chips per source | Within the `AIDraft` panel |
| Tertiary (caption) | Autosave indicator "Saved HH:MM" | Top-right of `Progress` row |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (Draft status) | Status `Badge` "Draft" (neutral), visually distinct from "Approved" | N/A |
| AIDraft requested | `AIDraft` panel appears with "Not issued" `Badge` | Badge persists until Approve is clicked |
| AIDraft low-confidence | Inline note in draft body itself: "Low confidence: only one source available" | Never hidden or silently upgraded |
| AIDraft approved | Text copied into the field; `AIDraft` panel collapses; `Timeline` entry logged with reviewer+time | Field now shows approved text, form remains "Draft" until the whole form is approved |
| AIDraft discarded | Panel removed; audit note only (no content retained) | No visible trace in the field |
| AI gateway unavailable | `Alert info`: "AI drafting is temporarily unavailable. You can still write this manually." (503 `AI_GATEWAY_UNAVAILABLE`) | Does not block manual completion |
| Approval blocked | `Alert danger`: "Approval must be made by a signed-in person, not an automated process." (403 `APPROVAL_REQUIRES_NAMED_USER`) | Form stays in `Draft` |
| Form fully approved | Status `Badge` changes to "Approved" (success), form becomes read-only | Confirmed via `Badge` change, no further edits possible |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Draft with AI" | `Button secondary` | Inserts `AIDraft` panel below the field; never auto-fills the field |
| "Approve" (in `AIDraft`) | `Button primary` | Copies draft text into field; logs reviewer+timestamp to `Timeline` |
| "Edit" (in `AIDraft`) | `Button secondary` | Opens draft text in an editable state before approving |
| "Discard" (in `AIDraft`) | `Button ghost` | Removes draft; audit note only |
| "Continue" | `Button primary` | Advances to next step; autosaves current step |

**Keyboard/focus:** `Progress` indicator is non-interactive (visual only, with `aria-label` stating step count). Every step validates on blur; submit-with-errors moves focus to the first error and shows a summary `Alert`.
### Screen: Plan Repository (List)

**Purpose:** Let agencies substantiate preparedness on demand via a versioned, approvable plan/SOP repository.
**User Stories:** US-3.1, JRN-01.1 (Verify Plans)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Plans & playbooks"  actions: "Create plan"      │
│   (primary), "Import plan" (secondary)                          │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search · filters (type, status, jurisdiction)          │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                              │
│  Table: Name (linked) │ Type (EOP/SOP/Annex) │ Status (Badge:    │
│   Draft/Review/Approved) │ Version │ Jurisdiction │ Last updated │
│   │ Owner (Avatar)                                               │
└───────────────────────────────────────────────────────────────┘
```

#### States
Standard list states per S0.3: `Skeleton` rows while loading; `EmptyState` "No plans yet" + "Create plan" (first-use) vs. "No plans match" + "Clear filters" (filtered); `Alert danger` + Retry on error, last-known data labeled with age.

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Create plan" | `Button primary` | Opens Plan Editor, new draft |
| "Import plan" | `Button secondary` | Opens Import from Document System modal (S3.6) |
| Row (Name) | Linked text | Navigates to Plan Detail / Reading View |

---

### Screen: Plan Detail / Reading View

**Purpose:** A focused, distraction-free reading experience with jump links and version history.
**User Stories:** US-3.4, US-3.1

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Riverbend County Flood Response EOP"            │
│   status Badge "Approved" (success) · version "v3" ·            │
│   actions: "Edit" (if permitted), "Import new version"          │
├──────────────────────┬────────────────────────────────────────┤
│ Sidebar (jump links): │ Content area, constrained to            │
│  §1 Purpose           │ reading-max (720px):                     │
│  §2 Roles             │   h2 "1. Purpose" ... body-lg text       │
│  §3 Activation        │   h2 "2. Roles" ... body-lg text         │
│  §4 Resources         │                                           │
│   linked tasks shown  │                                           │
│   per section         │                                           │
├──────────────────────┤                                           │
│ Version history       │                                           │
│  (collapsible):       │                                           │
│  v3 Approved (current)│                                           │
│  v2 "View this        │                                           │
│   version" (read-only)│                                           │
│  v1 "View this        │                                           │
│   version" (read-only)│                                           │
└──────────────────────┴────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | Plan name | `PageHeader` |
| Secondary | Status `Badge`, version number | `PageHeader` status slot |
| Secondary (h2) | Plan section headings | Content area, `reading-max` 720px |
| Tertiary | Linked tasks per section | Sidebar, beneath each jump link |
| Tertiary | Version history | Sidebar, collapsible, read-only |

#### States
Previous Approved versions are never deleted — "View this version" always available, read-only, non-destructive.

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Edit" | `Button secondary` | Navigates to Plan Editor (only if permitted) |
| Sidebar jump link | Anchor link | Scrolls content area to the section |
| "View this version" | `Button ghost` | Opens the historical version read-only |

**Keyboard/focus:** Content area max line length `reading-max` for legibility; jump links are a standard focusable list.

---

### Screen: Plan Editor

**Purpose:** Author/edit plan sections and link them to the operational tasks they generate.
**User Stories:** US-3.2, US-3.1

#### Layout

Page pattern: **Forms** (long-form).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Edit: Riverbend County Flood Response EOP"      │
├───────────────────────────────────────────────────────────────┤
│ h4 "1. Purpose"                                                  │
│ TextField multiline                                              │
│ [Link tasks] (Button secondary)                                 │
│                                                                   │
│ h4 "2. Roles"                                                    │
│ TextField multiline                                              │
│ [Link tasks]                                                     │
├───────────────────────────────────────────────────────────────┤
│ autosave: "Saved 08:41"                                          │
│  [Save as draft secondary]    [Submit for review primary]       │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Submit with zero sections | `Alert danger`: "Add at least one section before submitting this plan for review." (422 `PLAN_EMPTY`) | Blocks submission |
| Self-approval attempted | `Alert danger`: "You submitted this plan for review. Ask another reviewer to approve it." (403 `SELF_APPROVAL_BLOCKED`) | Shown on the Approval Workflow screen, not here |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Link tasks" (per section) | `Button secondary` | Opens Link Tasks to Plan Section `Modal` |
| "Save as draft" | `Button secondary` | Saves without changing status |
| "Submit for review" | `Button primary` | Moves status Draft → Review |

---

### Screen: Link Tasks to Plan Section (Modal)

**User Stories:** US-3.2

```
┌─────────────────────────────────────┐
│ Modal: "Link tasks to '2. Roles'"    │
├─────────────────────────────────────┤
│ List of existing task templates      │
│ (multi-select Checkbox) or           │
│ "+ Define new template" (name,       │
│ default owner role, due offset)      │
├─────────────────────────────────────┤
│       [Cancel]   [Link tasks primary]│
└─────────────────────────────────────┘
```
Multiple task templates may be associated with one section; when an incident activates and references the plan, linked templates are offered as one-click task creation (F4) rather than requiring tasks written from scratch.
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
### Screen: Recipient Groups & Message Templates (List + Editor)

**User Stories:** US-5.1

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Notification groups"  actions: "New group"       │
├───────────────────────────────────────────────────────────────┤
│ Table: Group name (linked) │ Type (Role/Jurisdiction/Geography) │
│  │ Member count │ Last used                                      │
└───────────────────────────────────────────────────────────────┘
```
Editor: name, type `Select`, type-specific selector (role `Combobox`, jurisdiction `Combobox`, or geography drawn on `MapCanvas`). Message Templates follows the same list pattern (Template name, Category, Last updated) with an editor offering a `TextField multiline` body with placeholder tokens (e.g., `{{incident_name}}`) and a character count.

---

### Screen: Compose Notification (4-step flow, required order)

**Purpose:** Guarantee nothing goes out that hasn't been deliberately reviewed and named-person approved.
**User Stories:** US-5.2, US-9.3, JRN-02.2 (full flow)

#### Layout

Page pattern: **Notifications and alerts**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Compose notification"                            │
│ Progress  "Step 1 of 4: Audience" ▓░░░                           │
├───────────────────────────────────────────────────────────────┤
│ STEP 1 — AUDIENCE                                                 │
│  Combobox (multi) "Recipient groups"                              │
│  — or — MapCanvas + LayerPanel: draw geotargeted area              │
│  caption: "Estimated recipients: 606" (live estimate)             │
│                                                                     │
│ STEP 2 — MESSAGE                                                   │
│  Select "Template" (optional) or TextField multiline "Message"    │
│   character count shown                                            │
│  [Draft with AI] (Button secondary)                                │
│   ┌─ AIDraft panel ──────────────────────────────────────────┐   │
│   │ "Not issued" Badge · draft text pulled from shelter        │   │
│   │ record · Provenance chips                                  │   │
│   │        [Discard] [Edit] [Approve primary]                  │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                     │
│ STEP 3 — REVIEW (fully read-only)                                  │
│  Final message text · Audience size · Channels · Approver          │
│   of record — nothing editable here                                │
│                                                                     │
│ STEP 4 — APPROVE AND SEND                                          │
│  "Approve and send" (primary)                                      │
│   ┌─ Modal danger (public/external-reach only) ───────────────┐  │
│   │ "Send to 606 recipients via SMS, Email, IPAWS?"             │  │
│   │ restates audience size + channels                            │  │
│   │          [Cancel]  [Send now danger primary]                 │  │
│   └────────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│  [Back]                                        [Continue primary] │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Compose notification" | `PageHeader` |
| Primary | Current step content | Main form body, one step visible at a time |
| Secondary | `Progress` step indicator | Below `PageHeader` |
| Secondary | `AIDraft` panel (Step 2 only) | Below message field |
| Tertiary | Live recipient-count estimate | Step 1, below audience selector |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| No audience selected | Blocked from advancing past Step 1; `Alert danger`: "Select at least one recipient group or draw a geotargeted area." (422 `NO_AUDIENCE_SELECTED`) | Focus returns to audience selector |
| AI draft not yet approved | Message field remains empty/unchanged | 400 `AIDRAFT_NOT_APPROVED` if any API caller attempts to bypass |
| Review step | All fields rendered read-only, no inline edit controls | Must click "Back" to change anything |
| Approver mismatch | `Alert danger`: "You're not the designated approver for this channel. Route it to [approver name]." (403 `APPROVER_MISMATCH`) | Send blocked, server-enforced |
| Public/external send | `Modal danger` confirmation, cannot be bypassed | Restates audience size and channels verbatim |
| Channel unavailable at send | `Alert warning`: "[Channel] is temporarily unavailable. The message is queued and will retry." (503 `CHANNEL_UNAVAILABLE`) | Non-blocking for other channels |
| Message too long | `Alert danger`: "This message exceeds the [N]-character limit for [channel]. Shorten it." (422 `MESSAGE_TOO_LONG`) | Character count turns `danger-text` when over limit |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Draft with AI" | `Button secondary` | Inserts `AIDraft` panel; AI never auto-populates the message field |
| "Continue" | `Button primary` | Advances one step; disabled until current step's validation passes |
| "Approve and send" | `Button primary` (Step 4) | Requires signed-in user = designated approver; triggers `Modal danger` for public sends |

**Keyboard/focus:** Step navigation never skips validation; `Progress` announces current step via `aria-label`. The `MapCanvas` geotargeting draw tool has a keyboard-operable polygon-entry fallback (coordinates `TextField`) since freehand drawing is pointer-only.

---

### Screen: Delivery & Acknowledgment Tracking

**Purpose:** Confirm with certainty whether a sent message was actually delivered and acknowledged.
**User Stories:** US-5.3, JRN-02.2 (Track Delivery)

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Delivery: Shelter opening notice"                 │
├───────────────────────────────────────────────────────────────┤
│ Progress "68% acknowledged, 412 of 606" (tone=success)            │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: filter by delivery state (Queued/Sent/Delivered/Failed)  │
├───────────────────────────────────────────────────────────────┤
│ Table: Name/Group │ Channel │ Status (Badge) │ Ack Progress bar   │
│  Riverbend Shelter list · SMS · Delivered (success) · ✓ 100%     │
│  County staff · Email · Failed (danger) · reason: "bounced"       │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | `Table` auto-refreshes as F14 callbacks arrive | No manual reload required |
| Failed delivery | Status `Badge` "Failed" (danger) + visible reason text in row | Never a silent drop |
| Loading | `Skeleton` rows | None |
| Error (page-level) | `Alert danger` + Retry | Last-known delivery status stays visible, labeled with age |

**Keyboard/focus:** Filter `Select` by delivery state is a standard focusable control; `Table` rows are not independently navigable links (this is a status view, not a record list) but each row's reason text is screen-reader accessible inline.
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
### Screen: Report Observation (structured form)

**Purpose:** One-tap, gloved-hand-friendly structured field reporting with photo and location capture, fully offline-capable.
**User Stories:** US-6.2, JRN-04.1 (Submit Report)

#### Layout

Page pattern: **Field mobile**. Single column, all controls `size="lg"`.

```
┌───────────────────────────────┐
│ SyncStatus: ● offline           │
│  "3 queued"                     │
├───────────────────────────────┤
│  h1 "Report observation"        │
│                                 │
│  Select "Observation type" lg   │
│                                 │
│  TextField multiline            │
│   "Description" lg              │
│                                 │
│  [📷 Capture photo] (Button lg) │
│   ┌─ thumbnail confirmation ──┐│
│   │ [image preview]  ✓ Captured││
│   └──────────────────────────┘│
│                                 │
│  [📍 Use my location] (Button  │
│   lg)                           │
│   ┌─ confirmation text ───────┐│
│   │ Lat: 38.9012, Long:        ││
│   │ -77.0401 · Accuracy: ±5m   ││
│   └──────────────────────────┘│
├───────────────────────────────┤
│ Bottom action bar (single       │
│  primary): [Submit report lg]   │
└───────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | `SyncStatus` | Pinned top |
| Primary (h1) | "Report observation" | Page title |
| Primary | Observation type, Description | Top of form |
| Primary | Photo capture + thumbnail confirmation | Below description |
| Primary | Location capture + text confirmation (lat/long/accuracy) | Below photo |
| Primary action | "Submit report" | Bottom action bar, single button |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty form, no photo/location yet | N/A |
| Photo captured | Visible thumbnail with "✓ Captured" confirmation text | Not just a silent state change |
| Location captured | Lat/long + accuracy shown as readable text, not just a map pin | Explicit confirmation, never ambiguous |
| Submit with empty report | `Alert danger`: "Add a description, photo, or location before submitting." (422 `REPORT_EMPTY`) | Blocks submit |
| Submitting online | Brief `Button loading` state on "Submit report" | Label width stays stable |
| Submitting offline | Immediate local success; `SyncStatus` queued count increments | "Queued" confirmation, never a spinner that implies failure |
| Location unavailable | `Alert info` (degraded, 200): "Location isn't available. You can still submit without it." | Non-blocking |
| Photo upload failed post-reconnect | `Alert warning`: "Photo didn't upload. The rest of your report synced. Retry the photo." (500 `PHOTO_UPLOAD_FAILED`) | Rest of report still syncs |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Capture photo" | `Button size="lg"` with camera `Icon` | One tap opens camera, returns to form with thumbnail |
| "Use my location" | `Button size="lg"` with map-pin `Icon` | One tap captures GPS, shows text confirmation |
| "Submit report" | `Button primary size="lg"` | Always succeeds locally; sends immediately online or queues offline |

**Keyboard/focus:** No hover-dependent or swipe-only interactions; every action (photo, location, submit) has a visible, single-tap button equivalent. `captured_at` is set client-side at the moment of capture, not at sync time.
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
### Screen: SITREP Generator

**Purpose:** Never start from a blank page — auto-assemble current incident data into a reviewable situation report.
**User Stories:** US-7.1, JRN-03.1 (Draft SITREP, Finalize)

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Generate situation report"  status Badge "Draft" │
├───────────────────────────────────────────────────────────────┤
│ Auto-pulled sections (read-only, structured):                    │
│  h4 "Current timeline" — list of recent entries                   │
│  h4 "Task status" — summary counts by status                      │
│  h4 "Resource-request status" — summary counts by status          │
│                                                                     │
│ h4 "Narrative summary"                                             │
│  TextField multiline  [Draft with AI]                              │
│   ┌─ AIDraft panel: draft text + Provenance chips +                │
│   │  "Not issued" badge · [Discard][Edit][Approve]                 │
│   └──────────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────┤
│ h3 "Preview" — assembled document preview pane                     │
├───────────────────────────────────────────────────────────────┤
│  [Save as draft secondary]     [Approve and finalize primary]     │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Draft | Status `Badge` "Draft" (neutral) | Remains available throughout incident lifecycle, not gated on closure |
| AIDraft inserted | "Not issued" `Badge` persists until Approve | Low-confidence drafts state so in the body text |
| Finalized | Status `Badge` "Approved" (success) | Only Approved documents count as official record |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Draft with AI" | `Button secondary` | Narrative section only; `AIDraft` panel inserted below field |
| "Save as draft" | `Button secondary` | Preserves current state as `Draft` |
| "Approve and finalize" | `Button primary` | Requires named-person reviewer+timestamp; locks document as official record |

---

### Screen: AAR Generator

**Purpose:** Close the preparedness loop by turning incident activity into traceable, reusable learning.
**User Stories:** US-7.2, JRN-03.2 (Generate AAR through Publish & Export)

#### Layout

Page pattern: **Forms** (multi-step with `Progress`).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "After-action report: Riverbend flood response"   │
│  (only available once incident Closed)                            │
│ Progress "Step 4 of 5: Findings & corrective actions" ▓▓▓▓░       │
├───────────────────────────────────────────────────────────────┤
│ STEP 1 — Timeline export (auto-populated, read-only, exportable) │
│ STEP 2 — Decisions log (auto-populated, editable annotations)    │
│ STEP 3 — Resource-request history (auto-populated Table)         │
│                                                                     │
│ STEP 4 — Findings & corrective actions                             │
│  Card (per finding):                                                │
│   TextField "Finding text"                                          │
│   Select "Category"                                                 │
│   TextField "Corrective action"                                     │
│   Combobox "Owner" (required)                                       │
│   DatePicker "Due date" (required)                                  │
│   [+ Add finding]                                                    │
│  [Draft with AI] available on findings narrative                    │
│                                                                     │
│ STEP 5 — Review & finalize                                          │
├───────────────────────────────────────────────────────────────┤
│  [Back]                        [Finalize AAR primary]              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "After-action report: [incident name]" | `PageHeader` |
| Primary | Current step content | Main body, `Progress` indicator above |
| Secondary (h4) | Step section headings (Timeline export, Decisions log, etc.) | Within each step |
| Secondary | Finding/corrective-action fields | Step 4 `Card` per finding |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Incident not closed | "Generate AAR" action is absent/disabled from Reports tab | 409 `INCIDENT_NOT_CLOSED` if attempted directly |
| Steps 1–3 | Read-only, annotatable, auto-populated — never manually re-entered | N/A |
| Unowned corrective action | `Alert danger`: "Assign an owner and due date to every corrective action before finalizing." (422 `CORRECTIVE_ACTION_UNOWNED`) | Blocks finalization |
| Finalized | Document becomes immutable, exportable | 403 `DOCUMENT_IMMUTABLE` if edit attempted post-finalization; corrections require a new version/addendum |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "+ Add finding" | `Button secondary` | Adds a new finding/corrective-action `Card` |
| "Draft with AI" (findings narrative) | `Button secondary` | `AIDraft` + `Provenance`, human-approved per F9 |
| "Finalize AAR" | `Button primary` | Writes immutable record + evidence-log entry |
| Link to plan section (per finding) | `Combobox` | Associates corrective action with the specific plan/SOP section (F3) it should update |

**Keyboard/focus:** Multi-step `Progress` announces current step; validation blocks advancing past Step 4 until every corrective action has owner+due date.
### Screen: Evidence & Audit Log View

**Purpose:** Demonstrate preparedness and accountability via an append-only, exportable, filterable record — no edit or delete control exists anywhere, for any role.
**User Stories:** US-7.3, US-8.3, JRN-05.1 (Verify Audit Entry), JRN-05.2 (Drill Into Evidence)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Evidence & audit log"  actions: "Export as        │
│  CSV/PDF" (secondary)                                              │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: date range (two DatePickers) · actor Combobox ·          │
│  action/record-type filters                                        │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                                 │
│  Table: Timestamp (monospace/data) │ Actor (Avatar+name) │         │
│   Action │ Record type │ Record (linked)                           │
│   08:12:03 · Maria Alvarez · "Activation changed" ·                │
│    Incident · Riverbend flood response                              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Evidence & audit log" | `PageHeader` |
| Primary | Timestamp, Actor, Action columns | `Table`, monospace timestamps |
| Secondary | Record type, linked Record | Remaining columns |
| Tertiary | Date-range and actor filters | Toolbar |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Populated, filterable `Table` | N/A |
| Loading | `Skeleton` rows | None |
| Empty (filtered) | `EmptyState`: "No log entries match" + "Clear filters" | One action |
| Export failed | `Alert danger`: "This export didn't complete. Retry." (500 `EXPORT_FAILED`) | Retry action |
| No controls | **No edit or delete control exists anywhere in this view, for any role, including admins** | This is a hard design constraint, not a permission-dependent state |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Export as CSV/PDF" | `Button secondary` | Produces an export matching exactly the filtered view on screen |
| Record (linked) | Text link | Navigates to the source record (incident, plan, task, etc.) |
| Date-range `DatePicker`s | `withTime` optional | Filters the log |

**Keyboard/focus:** `Table` has `caption` (screen-reader title) and `th scope="col"` on every header. This view's immutability is enforced at the data layer — no UI affordance for edit/delete is ever rendered, for any role.

---

### Screen: Analytics & Reporting Dashboard

**Purpose:** Answer "are we more prepared?" with defined, traceable KPIs — never invented targets, never AI-activity-counts-as-outcomes.
**User Stories:** US-7.4, JRN-05.2 (Review KPIs, Drill Into Evidence)

#### Layout

Page pattern: **Analytics and reporting**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Analytics & reporting"                            │
├───────────────────────────────────────────────────────────────┤
│ Stat row (up to 4):                                                │
│  Median activation    Resource-request    Corrective-action       │
│  time                 fulfillment time    closure rate            │
│  "42 min"             "2.1 hrs"           "62%"                   │
│  caption: definition, period, source for each                      │
├───────────────────────────────────────────────────────────────┤
│ Card "Activation time trend" (title+subtitle: unit/period/source) │
│  LineChart (viz-1..6, marker shapes, hidden data table)            │
│                                                                     │
│ Card "Resource requests by type"                                    │
│  BarChart horizontal (patterns enabled)                             │
│                                                                     │
│ Card "Corrective actions by status"                                 │
│  DonutChart (tone=status)                                            │
├───────────────────────────────────────────────────────────────┤
│ Date range: two DatePickers · people/places: Combobox              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Analytics & reporting" | `PageHeader` |
| Primary | `Stat` row (≤4 KPIs) | Below `PageHeader` |
| Secondary (h3, in `Card` header) | Chart title + subtitle (unit/period/source) | Each `Card` |
| Tertiary | Hidden data-table alternative | Per chart, for screen readers |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| KPI with no configured target | Shows only current measured value, no target line | Never an invented target |
| KPI with configured target | `Stat` shows value + definition/baseline/owner/cadence on hover/caption | Explicit configuration required first |
| Large date-range timeout | `Alert danger`: "This date range is taking too long to load. Narrow it and retry." (504 `ANALYTICS_TIMEOUT`) | Retry + narrow-range suggestion |
| Loading | `Skeleton` sized to each `Stat`/chart | None |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| Date-range `DatePicker`s | `withTime` optional | Re-queries all charts and `Stat`s |
| Chart hidden data table | Toggle/disclosure | Screen-reader and keyboard-accessible alternative to the visual chart |

**Note (AI governance):** AI-generated activity counts (e.g., "N drafts generated") are never presented as a business-outcome KPI on this dashboard — only decision-quality, time-saved, and error-rate metrics qualify, per US-7.4.
### Screen: Admin Console Shell / Users

**Purpose:** The IT/SecOps admin landing surface — user, role, and integration management, visible only to the Admin role.
**User Stories:** US-8.1, US-8.2, JRN-05.1 (Review RBAC Scope)

#### Layout

App shell with an admin-scoped `SideNav`.

```
┌───────────────────────────────────────────────────────────────┐
│ SideNav (admin): Users, Roles & permissions, SSO configuration,  │
│  Audit log, Integration health, Platform monitoring,              │
│  Record authority, Federation grants                               │
│ Header: facet toggle (Admin/Executive for PER-05) · SyncStatus ·  │
│  Avatar                                                            │
├───────────────────────────────────────────────────────────────┤
│ PageHeader  h1 "Users"  actions: "Invite user" (primary)          │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search · filter (role, status)                           │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                                 │
│  Table: Name (Avatar) │ Email │ Role │ Jurisdiction scope │        │
│   Status (Badge: Active/Suspended) │ Last login                    │
└───────────────────────────────────────────────────────────────┘
```

User Detail (opened via row click): role assignment `Select`, jurisdiction-scope `Combobox` (multi), "Suspend access" (`Button danger`, requires `Modal` confirmation) / "Reactivate" actions.

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Users" | `PageHeader` |
| Primary | Name, Role, Status `Badge` | First `Table` columns |
| Secondary | Email, Jurisdiction scope, Last login | Remaining columns |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Populated `Table` | N/A |
| Suspend confirmation | `Modal danger`: "Suspend [name]'s access? This immediately invalidates their active sessions." | Footer: "Keep access" / "Suspend access" (danger primary) — never "Yes/No" |
| Suspended | Status `Badge` "Suspended" (danger) | Active sessions invalidated immediately, not at token expiry |
| Loading/Empty/Error | Standard per S0.3 | `Skeleton` / `EmptyState` / `Alert danger` + Retry |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Invite user" | `Button primary` | Opens invite form |
| Row click | Navigation | Opens User Detail |
| "Suspend access" | `Button danger` | Opens `Modal danger` confirmation |

---

### Screen: Roles & Permissions

**Purpose:** Configure RBAC down to the feature/action level and jurisdiction scope.
**User Stories:** US-8.2

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Roles & permissions"  actions: "New role"         │
├───────────────────────────────────────────────────────────────┤
│ Table of roles (linked) │ # users assigned │ Last modified        │
├───────────────────────────────────────────────────────────────┤
│ Role edit panel (opened per role):                                  │
│  Permission matrix (feature × action):                              │
│   "Incidents: create/view/edit/approve-activation"                  │
│   Checkbox groups per feature area                                   │
├───────────────────────────────────────────────────────────────┤
│ [Cancel ghost]           [Save changes primary]                    │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Permission change | Opens confirmation `Modal` before applying | Logged with before/after permission set, not just "permissions changed" |
| Role deletion attempted, in use | `Alert danger`: "Reassign all users before deleting this role." (409 `ROLE_IN_USE`) | Blocks deletion |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| `Checkbox` groups (per feature × action) | Permission toggle | Grouped under `fieldset`/`legend` per feature area |
| "Save changes" | `Button primary` | Opens confirmation `Modal` restating the before/after diff |

---

### Screen: SSO Configuration

**Purpose:** Configure and mandatorily test an SSO connection before it can go live — never lock out an agency with an untested config.
**User Stories:** US-8.5

#### Layout

Page pattern: **Forms**.

```
┌───────────────────────────────────────┐
│ PageHeader  h1 "SSO configuration"      │
├───────────────────────────────────────┤
│ TextField/file "IdP metadata URL or     │
│  XML upload"                            │
│ Select "Protocol" (SAML2/OIDC)          │
│ Attribute mapping table:                │
│  email_attr, name_attr, group_attr      │
│ Group → role mapping table               │
├───────────────────────────────────────┤
│  [Test connection secondary]             │
│  (must succeed before Save activates)    │
│  [Save configuration primary, disabled   │
│   until test passes]                     │
└───────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Untested | "Save configuration" disabled | Cannot activate as live config |
| Test passed | `Alert success`: "Connection test succeeded." "Save configuration" enabled | Clear unlock signal |
| Test failed | `Alert danger`: "Couldn't validate this identity provider configuration. Check the metadata URL and retry." (422 `SSO_CONFIG_INVALID`) | "Save configuration" remains disabled |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Test connection" | `Button secondary` | Must succeed before "Save configuration" activates |
| "Save configuration" | `Button primary` | Disabled until test passes; logs change to audit trail |
### Screen: Integration Health

**Purpose:** Surface record authority, sync status, and conflicts per external system — never a silent overwrite.
**User Stories:** US-8.4, US-10.1, JRN-05.1 (Notice Alert, Investigate, Resolve)

#### Layout

Page pattern: **Interoperability and integration health**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Integration health"                               │
├───────────────────────────────────────────────────────────────┤
│ Table: System │ Last sync │ Direction (in/out/bidirectional) │    │
│  Record authority │ SyncStatus                                     │
│  WebEOC │ 08:40 │ Bidirectional │ WebEOC (dispatch) │ ● syncing    │
│  Agency GIS │ 08:42 │ In │ Agency GIS │ ● online                   │
│  Everbridge │ 08:35 │ Out │ EPMP │ ● online                        │
├───────────────────────────────────────────────────────────────┤
│ Conflict row (expanded):                                            │
│  "Shelter status: EPMP says 'Open', WebEOC says 'Full'"             │
│  Both values shown side by side with sources                         │
│  [Keep EPMP value]  [Keep WebEOC value]                              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Integration health" | `PageHeader` |
| Primary | System, `SyncStatus` | First/last `Table` columns |
| Secondary | Last sync, Direction, Record authority | Middle columns |
| Primary (conflict rows) | Both values side by side + resolution actions | Expanded conflict row |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Healthy | `SyncStatus` state=`online` or `syncing`, icon+word+color | N/A |
| Conflict | `SyncStatus` state=`conflict`; row expands to show both values | Resolution actions inline: "Keep EPMP value" / "Keep [external] value" — never a silent overwrite |
| Feed unreachable | `Badge`/`SyncStatus` "offline" with error reason | Logged to integration health, last-known data labeled with age |
| Adapter auth failed | `Alert danger`: "Connection to [vendor] failed. Check the integration credentials." (401 `EOC_ADAPTER_AUTH_FAILED`) | Retry/reconfigure action |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Keep EPMP value" | `Button secondary` | Commits EPMP's value; written back through the adapter |
| "Keep [external] value" | `Button secondary` | Commits the external system's value locally |

**Keyboard/focus:** Conflict resolution requires an explicit named-person choice; the action buttons carry equal visual weight (no pre-selected "safe" default for a consequential choice).

---

### Screen: Platform Monitoring

**Purpose:** Catch and respond to degraded platform conditions before users are significantly impacted.
**User Stories:** US-8.4

#### Layout

Page pattern: **Dashboard** (admin variant).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Platform monitoring"                               │
├───────────────────────────────────────────────────────────────┤
│ Stat row: Uptime │ Active sessions │ Failed-login rate │           │
│  Integration-error rate                                             │
├───────────────────────────────────────────────────────────────┤
│ Alert danger (persistent, if active): "Notification fan-out is     │
│  degraded. 42 users affected. Investigating."                       │
├───────────────────────────────────────────────────────────────┤
│ Card "Availability trend"                                            │
│  LineChart (thresholds dashed/labelled)                               │
│                                                                         │
│ Card "Background job monitor" (F10 S10.4)                             │
│  Table: Job type │ Status │ Last run │ Failure count │ Next retry     │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Healthy | No persistent `Alert`; `Stat` row shows normal values | N/A |
| Degraded | Persistent `Alert danger` at top of content area, remains until resolved | 200 (alert) `PLATFORM_HEALTH_DEGRADED`: "[Subsystem] is degraded. [N] users affected. Investigating." |
| Job failure threshold exceeded | Row in Background Job Monitor flagged | 200 (alert) `BACKGROUND_JOB_DEGRADED`: "[Job type] has failed [N] times and is in backoff. Last error: [reason]." |

**Note:** No screen in the admin console, including this one, claims FedRAMP authorization in any copy.

---

### Screen: Record Authority Registry

**User Stories:** US-10.1

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Record authority registry"                        │
├───────────────────────────────────────────────────────────────┤
│ Table: Record type │ Authoritative system │ Notes                  │
│  Incident │ EPMP │ —                                                │
│  Dispatch status │ CAD/911 system │ Read-only, never edited          │
│  Personnel roster │ HR/IAM system │ Reference data only              │
└───────────────────────────────────────────────────────────────┘
```
Read-mostly reference configuration; changes require admin role and are audited. An undeclared record type is never synced by any integration feature.

---

### Screen: Federation Grants

**User Stories:** US-10.2, JRN-01.2 (Share Scoped Picture)

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Federation grants"  actions: "Grant access"       │
├───────────────────────────────────────────────────────────────┤
│ Table: Partner jurisdiction │ Scope granted │ Granted by │         │
│  Expires │ Status (Badge: Active/Revoked)                           │
├───────────────────────────────────────────────────────────────┤
│ Grant form (modal): partner Combobox, scope Checkbox list           │
│  (explicit, enumerated — no "all data" option), expiry DatePicker    │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Active grant | Status `Badge` "Active" (success) | Scope explicitly enumerated, never implicit "all data" |
| Revoked | Status `Badge` "Revoked" (neutral) | Takes effect within the same request cycle — no caching window |
| Expired/revoked access denied | `Alert danger`: "Access to this data was revoked or has expired." (403 `FEDERATION_ACCESS_DENIED`) | Shown to the partner jurisdiction attempting access |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Grant access" | `Button primary` | Opens grant form `Modal` |
| "Revoke" (per row) | `Button danger` | Immediate effect, `Modal` confirmation |
### Screen: Signal Triage Queue

**Purpose:** Let Maria/Priya validate AI-surfaced candidate signals before they ever become incidents — never auto-promoted under any configuration.
**User Stories:** US-9.1, JRN-01.2 (Monitor, context for activation decisions)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Signal triage queue"                               │
├───────────────────────────────────────────────────────────────┤
│ Table: Signal summary (linked) │ Source feed(s) │ Confidence       │
│  (qualitative text: "High — 3 corroborating NOAA/NWS feeds") │      │
│  Detected at │ Status (Badge: New/Dismissed/Promoted)               │
├───────────────────────────────────────────────────────────────┤
│  Row actions: "Review" → opens Signal Detail                        │
│   "Promote to incident" (opens F1 Create Incident, pre-filled —     │
│   never creates an incident directly)                                │
│   "Dismiss" (opens Modal requiring one-line reason)                  │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Signal triage queue" | `PageHeader` |
| Primary | Signal summary, Confidence (qualitative + reason) | First `Table` columns |
| Secondary | Source feed(s), Detected at, Status `Badge` | Remaining columns |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| New | Status `Badge` "New" (info) | Awaiting human review |
| Dismissed | Status `Badge` "Dismissed" (neutral) | Reason recorded, visible on hover/detail |
| Promoted | Status `Badge` "Promoted" (success) | Links to the resulting incident once created |
| Dismiss without reason | `Modal` requires non-empty reason `TextField` | Cannot submit empty |
| Confidence | Always qualitative text + stated reason | Never a bare percentage, per content rule |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Promote to incident" | `Button secondary` | Pre-fills F1's Create Incident form only; 400 `PROMOTE_REQUIRES_HUMAN_SUBMIT` if an API caller attempts to bypass human submission |
| "Dismiss" | `Button ghost` | Opens `Modal` requiring one-line reason |
| Row (Signal summary) | Linked text | Navigates to Signal Detail |

**Governance note:** Under no configuration is a signal auto-promoted to an active incident — this is enforced at both the UI and API layers.

---

### Screen: Signal Detail

**User Stories:** US-9.1

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Signal: Coastal flood watch cluster"               │
│  actions: "Promote to incident" (secondary) · "Dismiss" (ghost)   │
├───────────────────────────────────────────────────────────────┤
│ h3 "Clustered source events"                                        │
│  Provenance chip per event:                                          │
│   [NOAA/NWS · 06:45 · Verified]                                      │
│   [USGS stream gauge · 07:02 · Unverified — dashed outline]          │
└───────────────────────────────────────────────────────────────┘
```

No action on this screen writes an operational record directly — "Promote to incident" only pre-fills the incident-creation form for a human to review, edit, and submit.
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
## Responsive Considerations

Breakpoints (per design-system tokens): `bp-sm` 640px, `bp-md` 768px, `bp-lg` 1024px, `bp-xl` 1280px.

### Desktop (≥ bp-lg, 1024px+)

- `SideNav` expanded (240px), lifecycle-grouped, 6–9 top-level items.
- Two/three-column operating-picture layout: `MapCanvas` 8 of 12 columns, right column (`Timeline`/tasks) 4 of 12.
- Incident Workspace: left two-thirds active tab content, right third pinned command-roles + map-thumbnail `Card`.
- Dashboard: 12-column grid of `Card`s (8/4 or 6/6 split).
- Two charts per row on Analytics & Reporting Dashboard at `bp-lg`+.
- `Table` is the default dense data presentation; full columns visible.

### Tablet (bp-md to bp-lg, 768–1023px)

- `SideNav` remains expanded (or collapses to 64px icon rail per agency config) — nav still fully present above `bp-md`.
- Dashboard grid collapses toward single/double column as width tightens; `Stat` row may wrap to 2×2.
- Operating-picture map remains visible but the right-column `Timeline`/task list may stack beneath rather than beside the map as width approaches `bp-md`.
- Forms remain single column, max 560px, unaffected by this range.

### Mobile (< bp-md, phones and small tablets)

- **`SideNav` collapses to a bottom bar of exactly 4 destinations**, role-dependent (e.g., PER-04 sees Tasks/Report/Map/Profile; PER-02 on mobile might see Incidents/Tasks/Resources/Profile). Header strip keeps only `SyncStatus` and the incident name (if applicable) — nothing else.
- Dashboard/list grids collapse to a single column.
- **`Table` instances convert to card/label-value layouts below `bp-sm`** (640px) per the platform-wide responsive rule — this applies automatically to every feature-specific `Table` (tasks, resource requests, incidents, plans) without per-feature redefinition.
- Operating-picture map becomes full width; the right-column `Timeline`/task list becomes a bottom sheet.
- `MapLegend` is collapsible on mobile.
- **Field-mobile screens (F6) always use `size="lg"` (44px) controls**, single-column `body-lg` text, 24px checkboxes, and a bottom action bar with exactly one primary `Button`. This applies to Field Home, My Tasks, Report Observation, Queued Submissions, Sync Conflict Resolution, and Field Map regardless of actual viewport width — these are the canonical field-mobile layouts.
- Photo and location capture are always one-tap with a visible text/thumbnail confirmation — never hover-dependent or swipe-only.
- `SyncStatus` is pinned at the very top of every mobile screen and is never hidden, collapsed, or deprioritized regardless of available space.
- Tooltips are never the only carrier of information on touch devices (no hover on touch) — anything essential appears as visible text.

### Cross-cutting responsive rules

- Touch targets are ≥44px (`size="lg"`) on any field-mobile breakpoint or when `SyncStatus` indicates a field-mobile context; desktop minimum is 24px per WCAG 2.2 with adequate spacing.
- Charts fall back to `BarChart horizontal` or a `Table`/hidden-data-table below `bp-sm` where a vertical `BarChart`/`LineChart` would become illegible.
- Grids always collapse to one column below `bp-md`; never hide status or `SyncStatus` at any breakpoint.
- No breakpoint changes which information is available — only how it's laid out (card-vs-table, column count, nav placement).
## Accessibility Notes

Target: **WCAG 2.2 AA** and **Section 508** on every screen in this document, with the `contrast` theme as an additional high-contrast option. Conformance is demonstrated by testing (keyboard pass, screen-reader pass, axe scan, 200%/400% zoom, contrast audit per theme) — **never asserted as a certification EPMP does not hold, and no screen may claim FedRAMP authorization in any copy** (hard constraint, verified explicitly on every admin/executive screen).

### Contrast

- Text: 4.5:1 minimum on its ground (3:1 for 24px+/19px-bold+ text); **7:1 in the `contrast` theme** — applies to every screen including map labels, chart labels, and `AIDraft`/`Provenance` chip text.
- Controls, focus rings, icons, and chart marks that carry meaning: 3:1 minimum. Control borders always use `border-strong`, never the decorative `border` token.
- `accent` (gold) is under 3:1 on `bg` in all themes — used only as a fill carrying `on-accent` text (e.g., the brand mark, a single highlighted row), never as a lone status mark or body text. No screen in this document uses gold for status.
- Full functional and visual parity is required across light/dark/contrast on every screen, including `MapCanvas` base-layer styling (`map-*` tokens) and every chart (`viz-*`/`seq-*` tokens).

### Color and meaning — status always icon + word + color

Every status indicator across all 22 screens (`Badge`, `Alert`, `SyncStatus`, map markers) renders as **icon + word + color**, never color alone:
- Incident severity: Critical = `danger solid` + alert icon + word "Critical"; Elevated = `warning` + icon + word; Watch = `info` + icon + word; Normal = `success` + check icon + word.
- Task/resource-request status `Badge`s: Open/Draft (neutral/info), In progress/Awaiting approval (brand/warning), Done/Fulfilled/Approved (success + check), Overdue/Declined (danger + alert), each with the status word.
- `SyncStatus`: `online` (check icon + "Online"), `syncing` (spinner icon + "Syncing"), `offline` (wifi-off icon + "Offline" + queued count), `conflict` (alert icon + "Conflict").
- Map markers differ by **shape** (incident diamond, facility square, resource triangle, shelter circle) in addition to tone, each outlined in `ink` for 3:1 against any base — never tone alone.
- Charts: series differentiated by shape/marker/pattern in addition to color (`LineChart` marker shapes, `BarChart patterns` for print/grayscale/contrast), with values printed directly rather than requiring legend lookup.

### Keyboard and focus

- Skip-to-content link is the first focusable element on every page (all 22 screens), before `SideNav`.
- Everything operable by keyboard in a logical order; no keyboard traps; no hover-only or gesture-only controls anywhere (explicitly verified on all F6 field-mobile screens: photo capture, location capture, status updates, and conflict resolution all have visible single-tap button equivalents).
- Visible focus: 2px solid `focus-ring`, 2px offset, never removed, on every interactive element across every screen in this document.
- `Modal` traps focus, closes on Escape, returns focus to the trigger (verified on Command Role Assignment, Activation Level Change, Decline Reason, Suspend User, Revoke Federation Grant modals).
- `Tabs` use Left/Right arrow keys (Incident Workspace Timeline/Tasks/Resources/Reports tabs).
- Map markers are keyboard-focusable (Tab, Enter) with a hidden text-list equivalent for screen readers (Operating Picture, Field Map).

### Touch and motion

- Field-mobile controls use `size="lg"` (44px minimum) throughout: Field Home, My Tasks, Report Observation, Queued Submissions, Sync Conflict Resolution, Field Map.
- No gesture without a single-pointer alternative anywhere in the field-mobile surface.
- `prefers-reduced-motion` respected; nothing loops except the `Skeleton` pulse and `Button loading` spinner; nothing flashes more than 3 times per second.

### Structure and semantics

- **One `h1` per page, via `PageHeader`, with ordered headings beneath it (no skipped levels)** — verified across all 22 screens (e.g., Incident Workspace: h1 incident name → h3 tab panel titles → h4 field-group headings; Executive Briefing: h1 → caption KPI context, no h2/h3 skipped).
- Landmarks: `header`, `nav` (labelled), `main`, `footer` present in the app shell wrapping every screen.
- `Table` instances have `th scope="col"` and a `caption` (screen-reader title) — Incident List, Task List, Resource Request List, Evidence & Audit Log View, Integration Health, Users, Record Authority Registry, Federation Grants, Signal Triage Queue, Delivery & Acknowledgment Tracking.
- `aria-live` (`status`/`alert`) used sparingly for async updates: `SyncStatus` state changes, Delivery & Acknowledgment Tracking auto-refresh, Dashboard `Stat` tile event-bus updates.
- Page titles describe the page and, where applicable, the incident name (e.g., "Riverbend flood response — Incident Workspace").

### Forms

- Every field has a visible, programmatically associated label (never placeholder-only) — Create Incident, Create Task, Create Resource Request, Compose Notification, SSO Configuration, AAR Generator Step 4.
- Hint and error text linked via `aria-describedby`; required fields indicated in text, not color alone; errors identified with text + icon + a suggested fix, shown on blur/submit (never on first keystroke).
- Radio groups wrapped in `fieldset`/`legend` (e.g., Resource type selection where applicable).
- On submit with errors, focus moves to the first invalid field and a summary `Alert danger` appears above the form (Create Incident, Create Task, Compose Notification).

### Content

- Plain language throughout (grade 8 or below for any public-facing notification copy); acronyms (EOC, ICS, COP, AAR, SITREP) expanded on first use per page.
- Every ingested or AI-derived fact carries a text/`Provenance` equivalent — maps and charts always have a text/table alternative for screen readers (Operating Picture hidden marker list; every chart's hidden data table).
- AI output copy always says "Draft" and names who must approve — never "AI decided" or "AI approved" (verified in `AIDraft` panel copy across F1, F5, F7, F9 screens).
- Unverified information always says "Unverified" and names its source — never presented as a confirmed fact (Operating Picture `LayerPanel`, Signal Detail `Provenance` chips).

### Testing checklist (per release, applied to every screen in this document)

1. Keyboard-only pass of each full flow (all 9 flows in this document).
2. Screen-reader pass (NVDA/JAWS and VoiceOver) of each primary flow.
3. 200% and 400% zoom, no loss of content, on all 22 screens.
4. All three themes (light/dark/contrast) verified on every screen.
5. Contrast audit including interactive states (hover/pressed/disabled/focus).
6. Reduced-motion verification.
7. Automated scan (axe) with zero serious or critical issues.
8. Section 508 test process results recorded for the release; zero unresolved findings claimed, never a certification assertion.
