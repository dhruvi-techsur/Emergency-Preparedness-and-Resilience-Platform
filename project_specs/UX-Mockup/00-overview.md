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
| Admin Console Shell / Users | `/admin/users` | App shell (sign-in default for PER-05 admin facet) | SideNav (admin): "Users" |
| Roles & Permissions | `/admin/roles` | Admin Console SideNav | SideNav (admin): "Roles & permissions" |
| SSO Configuration | `/admin/sso` | Admin Console SideNav | SideNav (admin): "SSO configuration" |
| Integration Health | `/admin/integration-health` | Admin Console SideNav | SideNav (admin): "Integration health" |
| Platform Monitoring | `/admin/platform-monitoring` | Admin Console SideNav (also default landing) | SideNav (admin): "Platform monitoring" |
| Record Authority Registry | `/admin/record-authority` | Admin Console SideNav | SideNav (admin): "Record authority" |
| Federation Grants | `/admin/federation` | Admin Console SideNav | SideNav (admin): "Federation grants" |
| Signal Triage Queue | `/signals` | SideNav | SideNav → Monitor: "Signals" |
| Signal Detail | `/signals/{id}` | Signal Triage Queue row click | Row click: signal summary link |
| Theme Switcher | n/a (menu, not a route) | User/profile `Avatar` menu, every page | Avatar menu: "Theme" |

**Invariant check — no orphan screens:** every screen above has at least one inbound path from either the role-scoped `SideNav`/bottom-bar (app shell) or a reachable parent screen already itself reachable from the shell. Modals (Command Role Assignment, Activation Level Change, Link Tasks, Import Document) are reached exclusively from their parent screen's action and are not independently routable.
