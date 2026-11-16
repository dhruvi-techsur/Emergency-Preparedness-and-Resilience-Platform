# Roadmap: EPMP (Emergency Preparedness & Management Platform)

**Deployable**: yes — DEPLOY-01 (Phase 1)

## Overview

EPMP ships as six phases that build outward from a deployable, securely-authenticated
platform shell toward the full incident-centric MVP. Phase 1 stands up the thing that
can actually run — SSO, RBAC, audit, the API/event-bus backbone, and the app shell
itself — as a containerized, healthy service from day one. Phases 2–4 build the
operational core in dependency order: incident command and the shared operating
picture first (the demonstration path's starting point), then plans/tasks/resource
requests (the coordination layer that references incidents), then notifications and
reporting/learning (which consume incident, task, and resource data to close the
preparedness loop). Phase 5 adds offline-first mobile field operations once the
incident and task APIs it syncs against exist. Phase 6 closes the MVP with persona-scoped
dashboards across every module and governed AI-assisted drafting/signal-triage layered
onto the incident, notification, and reporting surfaces already built — the two
capabilities that reach across (rather than own) the rest of the platform.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Platform Foundation & Deployable Shell** - SSO/RBAC/audit, the API/event-bus backbone, and the application shell, running as a real deployed service
- [ ] **Phase 2: Incident Command & Operating Picture** - Incident/ICS activation and command, backed by a shared, GIS-grounded operating picture
- [ ] **Phase 3: Plans, Tasks & Resource Requests** - Versioned plan/SOP repository linked to a full task and resource-request lifecycle
- [ ] **Phase 4: Notifications & Reporting/Learning** - Accountable, approval-gated notifications and ICS/SITREP/AAR reporting that closes the preparedness loop
- [ ] **Phase 5: Mobile Field Operations** - Offline-first, installable field-mobile app with queued submissions and reconciliation
- [ ] **Phase 6: Persona Dashboards & AI Assistance** - Role-scoped dashboards for every persona plus governed, human-approved AI drafting and signal triage

## Phase Details

### Phase 1: Platform Foundation & Deployable Shell
**Goal**: Every persona can sign in once via agency SSO into a single, themeable application shell with role-based access and a full audit trail, and the repository runs as a real, deployable, Postgres-backed service from the first commit.
**Status**: In progress
**Depends on**: Nothing (first phase)
**Requirements**: F0, F8, F10, F16-SSO, DEPLOY-01
**Success Criteria** (what must be TRUE):
  1. A user can sign in via SAML2/OIDC SSO against a configured identity provider and land in a role-scoped app shell (`SideNav`, header strip, theme) rather than a generic landing page.
  2. An admin can manage users, roles, and granular RBAC permissions from the Admin Console, and every security-relevant action (login, permission change, record access) is written to an append-only audit log that cannot be updated or deleted.
  3. Every list/table/panel in the shell renders loading (`Skeleton`), empty (`EmptyState`), and error (`Alert` + retry) states, and a user can switch between light/dark/contrast themes instantly with no loss of WCAG contrast compliance.
  4. A versioned OpenAPI REST surface is reachable (e.g. `GET /api/v1/me`), protected by OAuth2/OIDC bearer tokens, with at least one event published through the event bus and consumable by a registered webhook subscriber.
  5. `docker build .` succeeds at the repository root, and the image runs as a numeric non-root `USER`.
  6. Started with only `PORT` set, the app answers `GET /healthz` with 200, without authentication, within 30 seconds, and `GET /` shows its main page (or redirects to it).
  7. `pivota-deploy.yaml` at the root reads `port: 8080`, `healthPath: /healthz`, `size: small`, `database: postgres`, the app migrates its schema at start, and the dev-server preview still starts as before.
**Plans:** 13 plans

Plans:
- [ ] 01-01-PLAN.md — Dev infrastructure: docker-compose (Postgres+PostGIS, NATS, OPA, Keycloak), exact auth-org schema migration, idempotent seed, OPA policy, Keycloak realm import
- [ ] 01-02-PLAN.md — Design system: token system + build pipeline, Icon/Button/IconButton, Skeleton/Badge/Alert/EmptyState/Toast
- [ ] 01-03-PLAN.md — Backend auth-org core: server bootstrap, OPA client, session JWT, AuditService, RBAC middleware, SSO callback, session/theme/nav routes
- [ ] 01-04-PLAN.md — Design system: Card, Avatar, PageHeader, Breadcrumbs, SideNav
- [ ] 01-05-PLAN.md — Design system: TextField, Select, Checkbox, Switch, Combobox, DatePicker
- [ ] 01-06-PLAN.md — Design system: Table, Timeline, Stat, Tabs, Modal
- [ ] 01-07-PLAN.md — Backend F8 admin API: Users, Roles & Permissions, SSO config (test-before-activate), Audit Log
- [ ] 01-08-PLAN.md — Backend F10 registry: API Clients (one-time secret), Record Authority Registry, Federation Grants (immediate revocation)
- [ ] 01-09-PLAN.md — Backend F10 event bus: NATS JetStream, webhook delivery worker (idempotent), OpenAPI document, platform/integration health
- [ ] 01-10-PLAN.md — Frontend app shell: Vite SPA, OIDC auth flow, AppShell, ThemeSwitcher, typed API client, Playwright e2e
- [ ] 01-11-PLAN.md — Frontend admin console: Users list/detail, Roles & Permissions, Audit Log view, Playwright e2e
- [ ] 01-12-PLAN.md — Frontend admin console: SSO Config form, Platform Monitoring, Integration Health, API Clients, Federation Grants, Playwright e2e
- [ ] 01-13-PLAN.md — Deployability: /healthz, static serving, baseline role migration, Dockerfile, pivota-deploy.yaml, .env.example, deploy-check verification

### Phase 2: Incident Command & Operating Picture
**Goal**: Command staff can intake and activate an incident, assign named command roles, and see a shared, time-stamped operating picture that never fails to render — even when the live GIS feed is unavailable.
**Status**: Ready to execute
**Depends on**: Phase 1
**Requirements**: F1, F2, F11
**Success Criteria** (what must be TRUE):
  1. A user can create and classify an incident (type, severity, jurisdiction), and the system opens an incident workspace with a severity badge, pinned command-role panel, and Timeline/Tasks/Resources/Reports tabs.
  2. A user can assign command roles (Incident Commander and supporting ICS roles) to named people, and every assignment, status change, and decision writes exactly one entry to the incident's append-only Timeline with actor and source.
  3. Changing the activation level (Monitoring/Partial/Full) requires a modal confirmation stating the specific operational consequence before the change takes effect, and at least one Incident Commander must be assigned before activating above Monitoring.
  4. The operating picture renders incidents, facilities, and resources as status-coded, shape-distinguished markers on a real GIS-sourced base map, with a status bar showing data age and base-layer source.
  5. When the GIS feed is unavailable, the operating picture falls back to a schematic base map clearly labeled "Schematic base map, offline" and continues rendering EPMP markers — the page never fails to render.
**Plans:** 7 plans

Plans:
- [ ] 02-01-PLAN.md — Backend incident-ops foundation: incidents/command-roles/timeline schema, TimelineService transaction helper, incident CRUD
- [ ] 02-02-PLAN.md — Backend incident-ops state machine: command-role assignment, activation-level change (server-side commander+confirmation gates), closure
- [ ] 02-03-PLAN.md — Backend GIS adapter (F11) + operating-picture markers/layers endpoint with mandatory schematic fallback
- [ ] 02-04-PLAN.md — Design system: MapCanvas, MapControls, MapLegend, MapPopup, LayerPanel, Provenance
- [ ] 02-05-PLAN.md — Frontend: Incident List + Create Incident (non-blocking duplicate warning)
- [ ] 02-06-PLAN.md — Frontend: Incident Workspace + Command Role Modal + Activation Level Modal
- [ ] 02-07-PLAN.md — Frontend: Operating Picture map page with degraded-mode rendering

### Phase 3: Plans, Tasks & Resource Requests
**Goal**: Planning staff can maintain a versioned, approved plan/SOP repository linked to generated tasks, and command/logistics staff can run tasks and resource requests through to closure — replacing manual spreadsheets and phone-based tracking.
**Depends on**: Phase 2
**Requirements**: F3, F4
**Success Criteria** (what must be TRUE):
  1. A user can author a plan/SOP and move it through Draft → Review → Approved with immutable version history and no self-approval (a different named reviewer must approve).
  2. A user can link a plan section to a task template, and when an incident references that plan, the linked template is offered for one-click task creation rather than writing the task from scratch.
  3. A user can create, assign (to a named person or role), approve, track, and close a task, and a task left open past its due time automatically flips to Overdue without any manual status update.
  4. A user can create a resource request linked to an incident or task and move it through Draft → Awaiting approval → Approved → Fulfilled (or Declined with a required reason), with its current status visible on both the operating picture and in reporting without a page reload.
**Plans**: TBD

### Phase 4: Notifications & Reporting/Learning
**Goal**: Communications staff can send accountable, approval-gated notifications with tracked delivery and acknowledgment, and planning staff can turn incident activity into ICS output, SITREPs, and after-action reports — closing the preparedness loop so every incident leaves a reusable evidence trail.
**Depends on**: Phase 2, Phase 3
**Requirements**: F5, F7
**Success Criteria** (what must be TRUE):
  1. A user can compose a notification through the mandatory 4-step flow (audience → message → review → approve & send), including geotargeted audience selection drawn on the operating-picture map.
  2. No notification can reach an external recipient without a named-person approval step recorded against it — the send action is never automatic, even when AI drafted the message body.
  3. A user can view a per-recipient delivery and acknowledgment tracking table showing current status for any sent notification.
  4. A user can generate ICS-standard output/SITREPs and an initial after-action report (timeline export, decisions log, resource-request history, findings/corrective-action list) directly from an incident's existing data, without manually re-entering it.
  5. A user can view an append-only, exportable evidence/audit log and an analytics/reporting dashboard summarizing incident, task, and resource-request activity.
**Plans**: TBD

### Phase 5: Mobile Field Operations
**Goal**: Field responders can submit structured observations and task updates from an installable mobile web app that keeps working fully offline and reconciles safely when connectivity returns — so field-to-EOC reporting never silently loses or overwrites data.
**Depends on**: Phase 2, Phase 3
**Requirements**: F6
**Success Criteria** (what must be TRUE):
  1. A field responder can install the mobile web app and complete structured forms with one-tap photo and location capture, using 44px touch targets and no hover-only or gesture-only interactions.
  2. Every edit remains possible while offline; a queued submission shows "Queued" via `SyncStatus` pinned at the top of every mobile screen rather than appearing to fail or disappear.
  3. On reconnect, queued field data syncs to the EOC automatically and appends a Timeline entry noting the sync, with no manual "upload" step required from the responder.
  4. When the same record was changed both offline and at the EOC, the conflict is surfaced to a named person for resolution — the system never silently keeps one value and discards the other.
**Plans**: TBD

### Phase 6: Persona Dashboards & AI Assistance
**Goal**: Every named persona lands on a dashboard scoped to their job the moment they sign in, and planning/communications staff get governed AI drafting and signal-triage assistance that accelerates their work without ever bypassing human accountability.
**Depends on**: Phase 1, Phase 2, Phase 4, Phase 5
**Requirements**: F9, F18
**Success Criteria** (what must be TRUE):
  1. Each of the 5 consolidated personas (PER-01–PER-05) lands on a distinct default dashboard with role-based navigation and action visibility driven by the RBAC model — a user never sees `SideNav` groups or actions their role doesn't permit.
  2. The executive-briefing dashboard variant shows 1–3 `display`-scale headline KPIs with no other decoration, each with a visible definition/period/source.
  3. A user can request AI-assisted drafting of an ICS form field or incident/SITREP narrative, and the result renders only inside the `AIDraft` component with `Provenance` source chips — it never appears pre-inserted into the record.
  4. AI-drafted content cannot become part of an official record without a named-person approval, recorded with reviewer identity and timestamp in the incident Timeline; a write carrying `ai_origin: true` without `approved_by` is rejected at the API, not just hidden in the UI.
  5. Signal triage surfaces candidate events clustered from hazard feeds in a queue for human validation but never auto-promotes a signal directly into an active incident.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Platform Foundation & Deployable Shell | 0/TBD | In progress | - |
| 2. Incident Command & Operating Picture | 0/7 | Ready to execute | - |
| 3. Plans, Tasks & Resource Requests | 0/TBD | Not started | - |
| 4. Notifications & Reporting/Learning | 0/TBD | Not started | - |
| 5. Mobile Field Operations | 0/TBD | Not started | - |
| 6. Persona Dashboards & AI Assistance | 0/TBD | Not started | - |