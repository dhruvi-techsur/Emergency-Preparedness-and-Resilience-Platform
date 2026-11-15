# Requirements Traceability Matrix — EPMP (Emergency Preparedness & Management Platform)

**Document type:** Requirements Traceability Matrix
**Project acronym:** EPMP
**Status:** Draft v1
**Last updated:** 2026-11-15

**Source documents traced:** `PRD-EPMP.md` (19 features, F0–F18), `FRD-EPMP.md` (feature chunks F00–F18 plus cross-feature chunks Y0a–Y0d schema, Y1a–Y1d API, Y2 error catalog, Y3 integrations), `TechArch-EPMP.md` (5 backend modules + Intelligence Layer + React SPA frontend), `UserStories-EPMP.md` (63 stories across 19 epics), `.planning/PROJECT.md` (scope decisions).

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between EPMP's product requirements and its downstream specifications. It links every PRD feature (F0–F18) forward to its elaborating FRD requirement chunk, the TechArch backend module and/or frontend surface that implements it, and the user stories that define its acceptance criteria — and allows each of those artifacts to be traced back to the single PRD feature that originated it. The purpose is to give engineering, QA, and product stakeholders one authoritative answer to two questions for any requirement: "where is this specified in more detail downstream?" and "where did this requirement originate, and has it been tested?"

EPMP's spec suite uses a single, consistent feature-ID convention carried unchanged across every document: PRD features are numbered F0 through F18 in `PRD-EPMP.md` §5/§9, and `FRD-EPMP.md` explicitly commits (§Conventions) to never renumbering them. This makes traceability unusually direct for this project — there is no separate FRD requirement-numbering scheme to reconcile against the PRD's feature IDs. Instead, the FRD elaborates each PRD feature into one or more numbered **screens** (e.g., `S1.1`–`S1.6` for F1), concrete API/schema chunks (`Y0a`–`Y0d`, `Y1a`–`Y1d`), and a feature-specific error-state table. TechArch then groups the 19 features into 5 cohesive backend modules (`auth-org`, `incident-ops`, `plans`, `comms-reporting`, `integration-gateway`) plus an independently-scaled Intelligence Layer (F9) and a React SPA frontend structure, per its modular-monolith architecture decision (§1.1). UserStories elaborates each feature into persona-level stories (`US-{epic}.{n}`) with testable acceptance criteria, which this RTM treats as the testable requirement set in the absence of a separate formal test-case document — 276 acceptance criteria and 121 cross-feature/feature-specific error-state rows collectively form the test-coverage basis below.

Three MVP features (F11 GIS, F12 Weather/Hazard Feeds, F14 Notification Provider, F15 CAD/911, F16 HR/IAM roster sync, F17 Asset/Facility/Document) are read-oriented or outbound-adapter integrations and intentionally have **no dedicated FRD screen IDs of their own** — their UI surfaces are embedded within F2's operating picture (map layers/markers), F5's delivery-tracking view, F3's plan-import flow, F1's incident workspace (CAD dispatch panel), and F8's shared Integration Health view (`S8.6`). This is a deliberate design decision (documented in each feature's FRD chunk), not a traceability gap, and is called out explicitly in the Requirements Detail section below.

## 2. Requirements Summary

- **19 PRD features (F0–F18)** are organized into five categories: **Platform Core** (F0, F8, F10 — 3 features), **Operational Modules** (F1–F7 — 7 features, the named MVP operational foundation), **AI Assistance** (F9 — 1 feature, Phase 1 only), **External Integrations** (F11–F17 — 7 features, approved adapters/read feeds), and **Experience/Role Views** (F18 — 1 feature).
- **Priority distribution:** 12 features at P0 (critical MVP path — F0, F1, F2, F3, F4, F5, F6, F7, F8, F10, F11, F18), 4 at P1 (F9, F12, F13, F14), 2 at P2 (F15, F17), and F16 carries a split priority (P0 for SSO/authentication, shared with F8; P1 for roster/qualification sync).
- **FRD elaboration:** every PRD feature is elaborated into its own FRD chunk (`F00`–`F18`) specifying Sub-features, Screens (where applicable), Process, Inputs, Outputs, Validation, Error States, API Surface, and Schema Surface — 53 tables total across 4 schema domain files and ~81 documented REST endpoints across 4 API domain files.
- **TechArch elaboration:** the 19 features map onto 5 backend modules in a modular-monolith architecture (`auth-org`, `incident-ops`, `plans`, `comms-reporting`, `integration-gateway`), an independently-scaled Intelligence Layer serving F9, and a React SPA frontend built exclusively from the `window.EPMP` design system.
- **User Stories elaboration:** 63 user stories across 19 epics (one epic per PRD/FRD feature), carrying 276 acceptance criteria in total — 49 P0, 11 P1, and 3 P2 stories, matching the PRD's own priority distribution exactly.
- **Error-state coverage:** 121 feature-level error-state rows (across `F00`–`F18`) plus a dedicated cross-feature error catalog (`Y2-errors.md`) covering session/role, federation, AI-governance, record-authority, sync-conflict, and integration-feed-unavailable scenarios shared across multiple features.
- **Non-functional requirements** (design-system exclusivity, three-theme parity, WCAG 2.2 AA/Section 508, AI governance, offline/degraded operation, no-FedRAMP-claims, interoperability-first, four non-negotiable integration behaviors) are woven through every feature rather than isolated in a single epic — traced in the Requirements Detail section under the feature(s) where they are concretely enforced.

## 3. ID Conventions (as used across this project's spec suite)

| Prefix / Pattern | Level | Example | Defined in |
|---|---|---|---|
| `F0`–`F18` | PRD feature / FRD requirement (same ID, never renumbered) | `F1` (Incident / ICS) | `PRD-EPMP.md` §5, `FRD-EPMP.md` §Conventions |
| `S{feature}.{n}` | FRD screen (UI surface within a feature) | `S1.3` (Incident Workspace) | `FRD-EPMP.md` per-feature chunks |
| `Y0a`–`Y0d` | FRD/TechArch schema domain chunk | `Y0b` (Incident/Ops schema) | `FRD-EPMP.md`, `TechArch-EPMP.md` §3 |
| `Y1a`–`Y1d` | FRD/TechArch API domain chunk | `Y1b` (Incident/Ops API) | `FRD-EPMP.md`, `TechArch-EPMP.md` §4 |
| `Y2`, `Y3` | Cross-feature error catalog / integration index | `Y2-errors.md` | `FRD-EPMP.md` |
| Module name (`auth-org`, `incident-ops`, `plans`, `comms-reporting`, `integration-gateway`) | TechArch backend module | `incident-ops` | `TechArch-EPMP.md` §2.1 |
| `US-{epic}.{n}` | User Story | `US-1.1` | `UserStories-EPMP.md` |
| `PER-01`–`PER-05` | Consolidated persona | `PER-02` (Incident Commander/PIO) | `PERSONAS-EPMP.md`, carried into `UserStories-EPMP.md` |
| `{CODE}_{NAME}` | Error code (feature-level or cross-feature) | `INCIDENT_POSSIBLE_DUPLICATE` | `FRD-EPMP.md` per-feature Error States tables, `Y2-errors.md` |

No `REQ-FUNC-XXX` / `REQ-NFR-XXX` / `SPEC-XXX` / `TEST-XXX` ID schemes exist in this project's source documents; this RTM uses the project's actual, already-consistent `F`/`S`/`Y`/module-name/`US` conventions rather than introducing placeholder IDs not present in the source material.

## 4. Traceability Matrix

| PRD Feature | FRD Requirement (Screens) | TechArch Module / Surface | User Stories |
|---|---|---|---|
| F0: Web & Mobile Application Shell | F0 — S0.1 App Shell, S0.2 Theme Switcher, S0.3 Global Loading/Empty/Error States, S0.4 Component Gap Escalation | `auth-org` (session/theme, thin pass-through) + Frontend `app-shell/` (React SPA, `window.EPMP`) | US-0.1, US-0.2, US-0.3, US-0.4 |
| F1: Incident / ICS | F1 — S1.1 Incident List, S1.2 Create Incident, S1.3 Incident Workspace, S1.4 Command Role Assignment, S1.5 Activation Level Change, S1.6 ICS Form/Checklist Editor | `incident-ops` (incident lifecycle state machine, `incident_timeline` sole writer) | US-1.1, US-1.2, US-1.3, US-1.4, US-1.5, US-1.6 |
| F2: Common Operating Picture | F2 — S2.1 Operating Picture (Map), S2.2 EOC/Executive Dashboard, S2.3 Layer Panel | `incident-ops` (read/aggregation layer only — no owned tables) + Frontend `pages/operating-picture/` | US-2.1, US-2.2, US-2.3, US-2.4 |
| F3: Plans & Playbooks | F3 — S3.1 Plan Repository, S3.2 Plan Detail/Reading View, S3.3 Plan Editor, S3.4 Approval Workflow, S3.5 Link Tasks to Section, S3.6 Import from Document System | `plans` (Draft→Review→Approved state machine, task-template materialization) | US-3.1, US-3.2, US-3.3, US-3.4 |
| F4: Tasks & Resource Requests | F4 — S4.1 Task List, S4.2 Create/Edit Task, S4.3 Task Detail, S4.4 Resource Request List, S4.5 Create/Edit Resource Request, S4.6 Resource Request Approval, S4.7 Resource Request Detail | `incident-ops` (task/resource state machines, system-driven Overdue transition) | US-4.1, US-4.2, US-4.3, US-4.4 |
| F5: Notifications Integration | F5 — S5.1 Recipient Groups, S5.2 Message Templates, S5.3 Compose Notification (4-step), S5.4 Delivery & Acknowledgment Tracking | `comms-reporting` (notification domain model; hands off dispatch to `integration-gateway`/F14) | US-5.1, US-5.2, US-5.3 |
| F6: Mobile Field Operations | F6 — S6.1 Field Home, S6.2 My Tasks, S6.3 Report Observation, S6.4 Queued Submissions, S6.5 Sync Conflict Resolution, S6.6 Field Map | `incident-ops` (field-report ingestion, sync-batch reconciliation, `sync_conflicts`) + Frontend `lib/offline/` (SQLite cache, outbox queue) | US-6.1, US-6.2, US-6.3, US-6.4 |
| F7: Reporting & Learning | F7 — S7.1 Reports Tab, S7.2 SITREP Generator, S7.3 AAR Generator, S7.4 Evidence & Audit Log View, S7.5 Analytics & Reporting Dashboard | `comms-reporting` (SITREP/AAR template assembly, evidence/audit read views) | US-7.1, US-7.2, US-7.3, US-7.4 |
| F8: Security & Administration | F8 — S8.1 Admin Console Shell, S8.2 Users, S8.3 Roles & Permissions, S8.4 SSO Configuration, S8.5 Audit Log View, S8.6 Integration Health, S8.7 Platform Monitoring | `auth-org` (session resolution, RBAC entry point, sole `audit_log` writer) | US-8.1, US-8.2, US-8.3, US-8.4, US-8.5 |
| F9: AI-Assisted Drafting & Signal Triage | F9 — S9.1 Signal Triage Queue, S9.2 Signal Detail, S9.3 AIDraft Panel (embedded in F1/F5/F7) | `comms-reporting` (AI gateway client, governance middleware) + independently-scaled Intelligence Layer (model-neutral AI gateway) | US-9.1, US-9.2, US-9.3 |
| F10: Platform API, Integration Gateway & Event Bus | F10 — S10.1 API & Integration Gateway, S10.2 Record Authority Registry, S10.3 Federation Grants, S10.4 Background Job Monitor | `auth-org` (registry/grant CRUD) + `integration-gateway` (runtime enforcement: provenance middleware, record-authority middleware, OPA policy client) | US-10.1, US-10.2, US-10.3, US-10.4, US-10.5 |
| F11: GIS & Geospatial Integration | F11 — no dedicated screens (embedded in F2 S2.1/S2.3 map/layers; health in F8 S8.6) | `integration-gateway` (GIS adapter: `fetch`/`health`/`publish`) | US-11.1, US-11.2 |
| F12: Weather & Hazard Feed Ingestion | F12 — no dedicated screens (embedded in F2 S2.3 Layer Panel; health in F8 S8.6) | `integration-gateway` (NOAA/NWS/USGS adapter, background polling job) | US-12.1, US-12.2 |
| F13: EOC COTS Interoperability | F13 — S13.1 EOC COTS Integration Health & Conflict Resolution (embedded in F8 S8.6) | `integration-gateway` (WebEOC/Veoci/DisasterLAN adapters; publishes to event bus) | US-13.1, US-13.2 |
| F14: Notification Provider & Public-Alerting Integration | F14 — no dedicated screens (embedded in F5 S5.4 delivery tracking; health in F8 S8.6) | `integration-gateway` (Everbridge/AtHoc + CAP-formatting adapters), called by `comms-reporting` | US-14.1, US-14.2 |
| F15: CAD / 911 Integration | F15 — no dedicated screens (embedded in F1 incident workspace as read-only panel; health in F8 S8.6) | `integration-gateway` (CAD adapter, read-only, no write routes) | US-15.1 |
| F16: HR / IAM & Identity Integration | F16 — no dedicated screens of its own (SSO shared with F8 S8.4; roster data surfaces in F1 S1.4 and F4 S4.2/S4.5) | `auth-org` (SSO/session, roster sync target) + `integration-gateway` (roster adapter) | US-16.1, US-16.2, US-16.3 |
| F17: Asset, Facility & Document System Integration | F17 — no dedicated screens (facility markers in F2 S2.1; document import reuses F3 S3.6; health in F8 S8.6) | `integration-gateway` (facility/asset adapter + document adapter, shared with F3) | US-17.1, US-17.2 |
| F18: Persona & Role-Specific Dashboards | F18 — S18.1–S18.5 (PER-01 through PER-05 Landing views) | `auth-org` (persona landing-config resolution, `role_landing_config`) + Frontend role-driven `SideNav`/bottom-bar | US-18.1, US-18.2, US-18.3 |

## 5. Requirements Detail

- **F0 — Web & Mobile Application Shell (P0):** FRD specifies the persistent app shell, three-theme system (light/dark/contrast, 7:1 contrast in `contrast`), global loading/empty/error state conventions, and the Component Gap Escalation process enforcing design-system exclusivity. TechArch implements this as a React SPA frontend with a build-time lint CI gate (no raw hex/pixel values, no non-`window.EPMP` components). No other feature is usable without F0; it is the shared dependency for every screen in F1–F18.
- **F1 — Incident / ICS (P0):** FRD specifies incident intake/classification, command-role assignment, append-only Timeline, ICS checklists/forms (with `[AIDraft]` assistance from F9), and activation-level change with `Modal` confirmation. TechArch's `incident-ops` module enforces the hard invariant that every state-changing action writes exactly one Timeline entry in the same DB transaction as the mutation. This is the MVP's demonstration-path starting feature.
- **F2 — Common Operating Picture (P0):** FRD specifies the map view (`MapCanvas`/`LayerPanel`/`MapPopup`), EOC/executive dashboard, and degraded/offline schematic-base-map fallback. TechArch implements this as a read/aggregation layer only (no owned tables) within `incident-ops`, consuming cached data from `integration-gateway`'s F11/F12/F17 adapters.
- **F3 — Plans & Playbooks (P0):** FRD specifies the plan repository, Draft→Review→Approved workflow (no self-approval), plan-section-to-task-template linkage, and document import/link from SharePoint-class systems (F17). TechArch's `plans` module owns this state machine and delegates document-adapter calls to `integration-gateway`.
- **F4 — Tasks & Resource Requests (P0):** FRD specifies the task and resource-request lifecycles (fixed state machines, system-computed `Overdue`), both scoped to an incident. TechArch places this in `incident-ops` alongside F1, since task/resource mutations and the owning incident's Timeline write are part of the same transactional unit of work.
- **F5 — Notifications Integration (P0):** FRD specifies recipient-group/template management and the mandatory 4-step compose flow (audience → message → review → approve/send), with delivery/acknowledgment tracking. TechArch's `comms-reporting` module owns the internal domain model and validates the AI-governance/named-person-approval guard before handing dispatch to `integration-gateway`'s F14 adapter.
- **F6 — Mobile Field Operations (P0):** FRD specifies the offline-first field UI (task updates, structured observation reports, queued-submission and conflict-resolution views). TechArch implements the client-side half via SQLite (`sql.js`/OPFS) + IndexedDB outbox in the frontend `lib/offline/` layer, with `incident-ops` implementing the server-side sync-reconciliation and `sync_conflicts` handling.
- **F7 — Reporting & Learning (P0):** FRD specifies SITREP/AAR generation (auto-populated from Timeline/task/resource data, `[AIDraft]`-assisted narrative), the append-only evidence/audit log view, and the analytics dashboard. TechArch's `comms-reporting` module assembles these via read-only cross-module queries into `incident-ops`, delegating audit-log data to `auth-org`'s `AuditService`.
- **F8 — Security & Administration (P0):** FRD specifies SSO (SAML2/OIDC), RBAC permission matrix, append-only audit logging, encryption, and platform/integration-health monitoring. TechArch's `auth-org` module is the sole writer to `audit_log` and the RBAC enforcement entry point every other module calls before executing a protected action.
- **F9 — AI-Assisted Drafting & Signal Triage (P1):** FRD specifies signal triage/clustering (never auto-promoted to an incident) and `[AIDraft]`+`Provenance`-gated drafting for ICS forms, SITREPs, AARs, and notifications. TechArch isolates the AI gateway as an independently-scalable service behind `comms-reporting`'s client, with a shared governance middleware (`assertAiOriginApproved`) applied uniformly across every consuming module — the hard constraint that no AI output may be auto-issued as a public warning, evacuation instruction, or binding resource decision is enforced here.
- **F10 — Platform API, Integration Gateway & Event Bus (P0):** FRD specifies the record-authority registry, provenance enforcement, federation grants, and background-job processing (notification fan-out, feed ingestion, sync reconciliation, report generation). TechArch splits ownership: `auth-org` owns registry/grant CRUD; `integration-gateway` performs runtime enforcement (provenance middleware, record-authority middleware, OPA federation checks) uniformly across F11–F17.
- **F11 — GIS & Geospatial Integration (P0):** FRD specifies a single normalized adapter contract (regardless of vendor) producing GeoJSON with `source`/`as_of` provenance, plus a scoped publish-back contract. TechArch's `integration-gateway` implements this adapter; the agency's GIS is declared authoritative for base-layer/boundary/facility-location data.
- **F12 — Weather & Hazard Feed Ingestion (P1):** FRD specifies read-only NOAA/NWS/USGS ingestion, persisted `verified: false` by default, surfaced as toggleable `LayerPanel` layers and also feeding F9's signal-triage job. `integration-gateway` implements the polling adapter with exponential backoff.
- **F13 — EOC COTS Interoperability (P1):** FRD specifies a 4-record-type sync scope (Incident, Resource Request, Status Update, Activity Log Entry) with explicit record-authority checks and side-by-side conflict resolution (never last-write-wins). `integration-gateway` implements the adapter and publishes to the event bus for downstream consumption.
- **F14 — Notification Provider & Public-Alerting Integration (P1):** FRD specifies the provider-send contract (rejects any request lacking `approved_by`/`approved_at`) and OASIS CAP-formatting for IPAWS-class public-warning channels. `integration-gateway` implements both adapters; `comms-reporting` (F5) remains the sole caller, keeping provider-credential handling in one module.
- **F15 — CAD / 911 Integration (P2):** FRD specifies a strictly read-only adapter (no PATCH/PUT/DELETE routes exist at the API level) surfacing dispatch status within the F1 incident workspace, with CAD/911 declared authoritative for all dispatch-status record types.
- **F16 — HR / IAM & Identity Integration (P0 for SSO / P1 for roster sync):** FRD specifies that SSO reuses F8's SAML2/OIDC flow (no duplicated login path) and that roster/qualification sync is read-only, matched by email, never overwriting EPMP-owned fields (RBAC role, theme, audit history). `auth-org` owns SSO/session; `integration-gateway` owns the roster adapter.
- **F17 — Asset, Facility & Document System Integration (P2):** FRD specifies two adapter contracts — a facility/asset-status feed (explicitly discarding inventory/maintenance/cost fields at the adapter boundary) and a permission-aware document adapter shared with F3's import/link flow (S3.6), always executing under the requesting user's own delegated SharePoint permissions.
- **F18 — Persona & Role-Specific Dashboards (P0):** FRD specifies one default landing view per the five consolidated personas (PER-01–PER-05), RBAC-driven nav/action visibility, and the PER-05 Admin/Executive facet toggle. `auth-org` owns persona landing-config resolution (`role_landing_config`), consumed by the frontend's role-driven `SideNav`/bottom-bar.

## 6. Test Case Coverage

In the absence of a separate formal test-case document, this RTM treats each user story's acceptance criteria as the testable requirement set, supplemented by each FRD feature chunk's explicit Error States table (negative/edge-case test scenarios) and the cross-feature error catalog (`Y2-errors.md`).

| PRD Feature | User Stories | Acceptance Criteria (positive test cases) | FRD Error States (negative test cases) | Coverage |
|---|---|---|---|---|
| F0: Web & Mobile Application Shell | 4 | 20 | 6 | 100% |
| F1: Incident / ICS | 6 | 29 | 7 | 100% |
| F2: Common Operating Picture | 4 | 19 | 7 | 100% |
| F3: Plans & Playbooks | 4 | 17 | 7 | 100% |
| F4: Tasks & Resource Requests | 4 | 18 | 7 | 100% |
| F5: Notifications Integration | 3 | 13 | 7 | 100% |
| F6: Mobile Field Operations | 4 | 18 | 7 | 100% |
| F7: Reporting & Learning | 4 | 19 | 7 | 100% |
| F8: Security & Administration | 5 | 23 | 7 | 100% |
| F9: AI-Assisted Drafting & Signal Triage | 3 | 14 | 7 | 100% |
| F10: Platform API, Integration Gateway & Event Bus | 5 | 20 | 7 | 100% |
| F11: GIS & Geospatial Integration | 2 | 7 | 6 | 100% |
| F12: Weather & Hazard Feed Ingestion | 2 | 7 | 5 | 100% |
| F13: EOC COTS Interoperability | 2 | 8 | 6 | 100% |
| F14: Notification Provider & Public-Alerting Integration | 2 | 9 | 7 | 100% |
| F15: CAD / 911 Integration | 1 | 5 | 5 | 100% |
| F16: HR / IAM & Identity Integration | 3 | 10 | 5 | 100% |
| F17: Asset, Facility & Document System Integration | 2 | 7 | 6 | 100% |
| F18: Persona & Role-Specific Dashboards | 3 | 13 | 5 | 100% |
| **Total** | **63** | **276** | **121** | **100%** |

**Cross-feature test scenarios** (traced via `Y2-errors.md` rather than a single owning feature): session/role resolution (F0, F8, F18), jurisdiction/federation scope denial (F2, F10), AI-governance guard (F1, F5, F7, F9 — 5-code closed family: `AIDRAFT_NO_SOURCE`, `AIDRAFT_NOT_APPROVED`, `AIDRAFT_UNAPPROVED_WRITE_BLOCKED`, `APPROVAL_REQUIRES_NAMED_USER`, `PROMOTE_REQUIRES_HUMAN_SUBMIT`), record-authority conflict (F10, F13, F15, F16), sync conflict (F6, F13), provenance-missing rejection (F10, F11, F12, F13, F15, F16, F17), and upstream-feed-unavailable graceful degradation (F11, F12, F13, F14, F15, F16, F17).

## 7. Change Management

| Version | Date | Change Description | Changed By | Affected Features |
|---|---|---|---|---|
| v1.0 | 2026-11-15 | Initial RTM generated from PRD-EPMP, FRD-EPMP, TechArch-EPMP, and UserStories-EPMP (all F0–F18 features traced) | Pivota Spec RTM Generator | F0–F18 (all) |

Future changes to any traced document (PRD, FRD, TechArch, UserStories) that add, remove, renumber, or re-prioritize a feature, screen, module, or story must be reflected in this RTM in the same change cycle — this table is the audit record of when that reconciliation occurred.

## 8. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Product Owner | _______________________ | _______________________ | _______________ |
| Engineering Lead | _______________________ | _______________________ | _______________ |
| QA / Test Lead | _______________________ | _______________________ | _______________ |
| Security / Compliance Reviewer | _______________________ | _______________________ | _______________ |
| Agency Design-Partner Sponsor (if applicable) | _______________________ | _______________________ | _______________ |

---
*This RTM traces `PRD-EPMP.md` (19 features, F0–F18) → `FRD-EPMP.md` (feature chunks + Y0/Y1/Y2/Y3 cross-feature chunks) → `TechArch-EPMP.md` (5 backend modules + Intelligence Layer + React SPA frontend) → `UserStories-EPMP.md` (63 stories, 276 acceptance criteria). Regenerate this document whenever any upstream spec document changes feature scope, IDs, or priority.*
