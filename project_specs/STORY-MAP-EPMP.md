# User Story Map
## EPMP (Emergency Preparedness & Management Platform)

| Field | Value |
|-------|-------|
| **Product Name** | EPMP (Emergency Preparedness & Management Platform) |
| **Date** | 2026-11-14 |
| **Related Personas** | PERSONAS-EPMP.md |
| **Related Journeys** | JOURNEYS-EPMP.md |
| **Related JTBD** | JTBD-EPMP.md |
| **Related User Stories** | UserStories-EPMP.md |
| **Related PRD** | PRD-EPMP.md |

---

## Overview

This story map organizes EPMP's 62 user stories (Epics 0–18, feature refs F0–F18) along the product's own operational lifecycle — **Prepare → Monitor → Activate → Coordinate → Recover → Improve** — the same six stages used in the F0 `SideNav` and the PRD mission statement. Each lifecycle stage is a lane; every lane table lists the activity, the persona performing it, the epic/feature, the mapped story (or stories), a derived Natural Acceptance Criterion (NaC), and the release increment the story ships in.

**NaC (Natural Acceptance Criteria) concept:** NaC bridges a JTBD outcome to a testable criterion by applying that outcome to a specific journey-stage context. For example, JTBD-01.1 ("minimize time to a trustworthy readiness picture") applied to the Monitor-stage "scan dashboard" activity becomes the NaC "readiness/incident/resource data for all jurisdictions renders in under 5 seconds with a visible timestamp and source." NaC are never invented — every NaC below is pulled from the JTBD-EPMP.md NaC Preview table and anchored to the journey stage and story where that outcome is actually exercised. The full source → stage → criterion → story chain is recorded in the **NaC Derivation Table**.

**Releases:** Release assignment follows the PRD's own priority tiers exactly — **R1 = all 48 P0 stories** (MVP operational foundation), **R2 = all 11 P1 stories** (AI assistance, hazard-feed ingestion, EOC COTS interoperability, notification-provider/public-alerting integration, HR/IAM roster sync), **R3 = all 3 P2 stories** (CAD/911, asset/facility/document integration). This mapping confirms R1 alone lets all five personas (PER-01 through PER-05) complete at least one journey end-to-end — see Release Planning and Coverage Analysis below.

---
## Story Map Matrix

Lanes follow EPMP's own lifecycle order (Prepare → Monitor → Activate → Coordinate → Recover → Improve), matching the `SideNav` structure defined in US-0.1 and the PRD mission statement. All 62 UserStories-EPMP.md stories are placed exactly once, in the lifecycle stage where their journey touchpoint is demonstrated.

### Prepare

| Activity | Persona | Epic | Stories | NaC | Release |
|---|---|---|---|---|---|
| Sign in via agency SSO | PER-01 | Epic 8 (F8) | US-8.1 | JTBD-05.2: SSO resolves role via IdP mapping; a failed assertion shows a named error, never a blank screen | R1 |
| See lifecycle-ordered navigation scoped to my role | PER-01 | Epic 0 (F0) | US-0.1 | JTBD-01.1: Role-scoped `SideNav` renders on sign-in with no group a role doesn't permit | R1 |
| Land on readiness/activation dashboard on sign-in | PER-01 | Epic 18 (F18) | US-18.1 | JTBD-01.1: Readiness/active-incident data for all jurisdictions renders on landing, routed by resolved role | R1 |
| Operate mobile field-home landing with 4 destinations | PER-04 | Epic 18 (F18) | US-18.2 | JTBD-04.3: Field landing is bottom-bar only (max 4 destinations) so status updates stay single-action | R1 |
| Switch between light, dark, and contrast themes | PER-05 | Epic 0 (F0) | US-0.2 | JTBD-05.4: All three themes (incl. 7:1 contrast) hold full functional/visual parity, evidencing accessibility by test | R1 |
| See consistent loading, empty, error states everywhere | PER-02 | Epic 0 (F0) | US-0.3 | JTBD-02.1: Every list/panel shows skeleton/empty/error states, so status is never ambiguous when reconstructing an incident | R1 |
| Flag design-system gaps rather than improvising UI | PER-05 | Epic 0 (F0) | US-0.4 | JTBD-05.4: No screen ships with ad hoc UI; gaps are logged, not improvised, supporting demonstrable conformance | R1 |
| Maintain a versioned, approvable plan repository | PER-01 | Epic 3 (F3) | US-3.1 | JTBD-01.3: Every plan/SOP shows version history and approval state without external document lookup | R1 |
| Link plan sections to the tasks they generate | PER-03 | Epic 3 (F3) | US-3.2 | JTBD-03.3: A task created from a template shows a visible link back to its originating plan section | R1 |
| Import plans from an existing document system | PER-03 | Epic 3 (F3) | US-3.3 | JTBD-01.3: Imported/linked plans preserve source-system permissions so readiness evidence needs zero reconstruction | R1 |
| Read plans in a focused, distraction-free view | PER-02 | Epic 3 (F3) | US-3.4 | JTBD-01.3: Plan content and version history are readable in one sitting, no reconstruction from external drives | R1 |
| Manage reusable recipient groups and templates | PER-02 | Epic 5 (F5) | US-5.1 | JTBD-02.4: Recipient groups/templates are reusable so audience/message setup is never rebuilt per send | R1 |
| Configure granular role/jurisdiction permissions | PER-05 | Epic 8 (F8) | US-8.2 | JTBD-05.2: Every permission change is logged with before/after state, attributable to a named person | R1 |
| Review an immutable, append-only audit trail | PER-05 | Epic 8 (F8) | US-8.3 | JTBD-05.2: Every login, permission change, record access, and AI-draft approval appears in an append-only, exportable log | R1 |
| Monitor platform availability and integration health | PER-05 | Epic 8 (F8) | US-8.4 | JTBD-05.1: Integration-health table shows system, last sync, direction, record authority, and sync status | R1 |
| Configure SSO safely with a mandatory test step | PER-05 | Epic 8 (F8) | US-8.5 | JTBD-05.2: SSO cannot go live without a passing test; every config change is logged to the audit trail | R1 |
| Declare record authority per external system | PER-05 | Epic 10 (F10) | US-10.1 | JTBD-05.1: Record Authority Registry shows authoritative system per record type; undeclared types are never synced | R1 |
| Monitor background job health | PER-05 | Epic 10 (F10) | US-10.4 | JTBD-05.1: Background Job Monitor surfaces status/failures/next retry so a silently failing sync never goes unnoticed | R1 |
| Sign in via the shared SSO connection (HR/IAM) | PER-01 | Epic 16 (F16) | US-16.3 | JTBD-05.2: HR/IAM auth shares the same SAML2/OIDC config as F8 — one governed credential, no duplicate login | R1 |
| Sync personnel roster/qualification data | PER-02 | Epic 16 (F16) | US-16.1 | JTBD-05.2: Roster sync never overwrites EPMP-owned RBAC/audit fields, preserving attributable access control | R2 |
| Flag HR-authority field conflicts | PER-05 | Epic 16 (F16) | US-16.2 | JTBD-05.1: A conflicting local edit to an HR-authoritative field is flagged, never silently overwritten on sync | R2 |
| Import/link a SharePoint document within my own permissions | PER-03 | Epic 17 (F17) | US-17.2 | JTBD-01.3: Import/link always executes under the user's own delegated permissions; a revoked permission immediately restricts visibility | R3 |

### Monitor

| Activity | Persona | Epic | Stories | NaC | Release |
|---|---|---|---|---|---|
| Scan readiness portfolio and active-incidents panel | PER-01 | Epic 2 (F2) | US-2.4 | JTBD-01.1: Dashboard renders up to 4 `Stat` tiles plus timeline/task summary, refreshed via event bus with no manual reload | R1 |
| View incidents, facilities, resources on a shared map | PER-02 | Epic 2 (F2) | US-2.1 | JTBD-02.2: Incidents/facilities/resources render with status-coded markers and a visible data-age/source status bar | R1 |
| Toggle weather/hazard overlay layers with provenance | PER-03 | Epic 2 (F2) | US-2.2 | JTBD-02.2: Every visible layer shows source and "As of HH:MM" age; a layer missing provenance is never displayed | R1 |
| Operate the map in degraded/offline GIS conditions | PER-01 | Epic 2 (F2) | US-2.3 | JTBD-02.2: A schematic base map renders when GIS is unavailable so a vendor outage never blocks situational awareness | R1 |
| Render the operating picture on our agency's real GIS base map | PER-02 | Epic 11 (F11) | US-11.1 | JTBD-02.2: Base-layer services normalize to GeoJSON with source/as_of provenance; missing provenance triggers degraded fallback | R1 |
| Publish EPMP-authored layers back to agency GIS | PER-05 | Epic 11 (F11) | US-11.2 | JTBD-05.1: Publish is restricted to the declared layer set and denied without explicit write permission — never a silent second system of record | R1 |
| Trust that ingested data always carries provenance | PER-03 | Epic 10 (F10) | US-10.3 | JTBD-02.2: Inbound data lacking source/timestamp/version/confidence is rejected at the API boundary, never persisted as if verified | R1 |
| Review AI-surfaced candidate signals before they become incidents | PER-01 | Epic 9 (F9) | US-9.1 | JTBD-01.2: Signal Triage Queue states confidence qualitatively with a reason; no signal is ever auto-promoted to an incident | R2 |
| See hazard feed data as a toggleable, provenance-labeled layer | PER-03 | Epic 12 (F12) | US-12.1 | JTBD-01.2: Unverified feeds persist `verified:false` by default and appear dashed "Unverified" until validated | R2 |
| Verify a hazard layer as a deliberate human action | PER-01 | Epic 12 (F12) | US-12.2 | JTBD-01.2: `verified` can only be set true by a named-person action — no automated promotion under any configuration | R2 |
| See facility status and location on the operating picture | PER-02 | Epic 17 (F17) | US-17.1 | JTBD-02.2: Facility markers render with source/as_of provenance; a feed outage shows last-known position labeled with its age | R3 |

### Activate

| Activity | Persona | Epic | Stories | NaC | Release |
|---|---|---|---|---|---|
| Create and classify a new incident | PER-01 | Epic 1 (F1) | US-1.1 | JTBD-01.2: Incident creation writes status `Open` plus a first Timeline entry automatically with actor and timestamp | R1 |
| Assign command roles with named-person accountability | PER-02 | Epic 1 (F1) | US-1.2 | JTBD-02.1: Every role assignment writes a Timeline entry with actor + timestamp; activation can't exceed Monitoring without an assigned IC | R1 |
| Change activation level with explicit consequence confirmation | PER-02 | Epic 1 (F1) | US-1.3 | JTBD-01.2: Escalation requires a danger-modal stating the operational consequence, writes a Timeline entry, and triggers notification | R1 |

### Coordinate

| Activity | Persona | Epic | Stories | NaC | Release |
|---|---|---|---|---|---|
| Monitor the incident via a single workspace | PER-02 | Epic 1 (F1) | US-1.4 | JTBD-02.2: `PageHeader`/tabs/pinned command-roles/map-thumbnail present timeline, tasks, resources, reports in one workspace | R1 |
| Complete ICS forms with AI-assisted drafting | PER-03 | Epic 1 (F1) | US-1.5 | JTBD-03.2: `AIDraft` shows `Provenance`; a form cannot reach `Approved` without a recorded named-person reviewer | R1 |
| Create and assign a task with a named owner | PER-02 | Epic 4 (F4) | US-4.1 | JTBD-02.3: A task cannot be created without an owner; list shows current status/owner/due at a glance | R1 |
| Track a task through its full status lifecycle | PER-04 | Epic 4 (F4) | US-4.2 | JTBD-04.3: Every status transition writes a Timeline entry (actor/timestamp/before-after), visible to EOC near-real-time | R1 |
| Submit and track a resource request | PER-03 | Epic 4 (F4) | US-4.3 | JTBD-03.1: Resource-request status changes publish to the event bus so COP/reporting reflect current state with no manual refresh | R1 |
| Approve, decline, or fulfill a resource request | PER-03 | Epic 4 (F4) | US-4.4 | JTBD-02.3 / JTBD-03.1: Full approval history (submitted→approved/declined→assigned→fulfilled) is visible with no untracked gaps | R1 |
| Compose a notification through audience→message→review→send | PER-02 | Epic 5 (F5) | US-5.2 | JTBD-02.4: AI never auto-populates the message field; the signed-in approver must match the designated approver before send | R1 |
| Track delivery and acknowledgment of a sent notification | PER-01 | Epic 5 (F5) | US-5.3 | JTBD-02.4: Delivery/acknowledgment status per recipient is visible within minutes of sending, auto-refreshing as callbacks arrive | R1 |
| Check and update tasks from the field, even offline | PER-04 | Epic 6 (F6) | US-6.1 | JTBD-04.3: Offline status updates write to local cache and queue, with `SyncStatus` reflecting state in real time | R1 |
| Submit a structured field report with photo and location | PER-04 | Epic 6 (F6) | US-6.2 | JTBD-04.1: Submission always succeeds locally regardless of connectivity — sends immediately online or queues offline, zero loss | R1 |
| Confirm queued submissions synced successfully on reconnect | PER-04 | Epic 6 (F6) | US-6.3 | JTBD-04.2: Every item resolves to synced, conflict (pending resolution), or failed (flagged) — never silently dropped | R1 |
| Resolve a sync conflict without losing data | PER-04 | Epic 6 (F6) | US-6.4 | JTBD-04.2: Conflict resolution requires an explicit named-person choice, writing a Timeline entry noting which version was kept | R1 |
| Generate a SITREP from current incident data | PER-03 | Epic 7 (F7) | US-7.1 | JTBD-03.2: SITREP auto-pulls current Timeline/task/resource data into a draft; only Approved documents count as official record | R1 |
| Grant and revoke cross-jurisdiction data federation | PER-01 | Epic 10 (F10) | US-10.2 | JTBD-01.4: A federation grant must have an explicit, enumerated scope; revocation takes effect within the same request cycle | R1 |
| Draft ICS form/narrative text with AI, always reviewed | PER-03 | Epic 9 (F9) | US-9.2 | JTBD-03.2: Approve copies draft text and logs reviewer+timestamp; no AI-origin content writes without a non-null approver | R2 |
| Trust that AI can never auto-issue a public warning | PER-05 | Epic 9 (F9) | US-9.3 | JTBD-02.4: This prohibition is enforced at UI and API layers with no feature flag able to override it | R2 |
| Exchange incidents/resource requests with incumbent EOC system | PER-01 | Epic 13 (F13) | US-13.1 | JTBD-05.1: Every sync cycle checks the record-authority registry before applying any inbound change; undeclared types are never synced | R2 |
| Resolve a conflict between EPMP and incumbent EOC system | PER-05 | Epic 13 (F13) | US-13.2 | JTBD-05.1: A detected conflict shows both values side by side with explicit keep-value actions — never auto-resolved by any heuristic | R2 |
| Dispatch an approved message through a real notification provider | PER-02 | Epic 14 (F14) | US-14.1 | JTBD-02.4: The send endpoint rejects any request lacking `approved_by`/`approved_at`, unconditionally, with no override | R2 |
| Send a public warning through IPAWS/CAP with complete fields | PER-02 | Epic 14 (F14) | US-14.2 | JTBD-02.4: An incomplete CAP payload is never dispatched; EPMP never originates a CAP alert without an authorized sender identity | R2 |
| See read-only dispatch status within the incident workspace | PER-02 | Epic 15 (F15) | US-15.1 | JTBD-02.2: Dispatch events display read-only with `Provenance`; no PATCH/PUT/DELETE route exists — CAD/911 remains system of record | R3 |

### Recover

| Activity | Persona | Epic | Stories | NaC | Release |
|---|---|---|---|---|---|
| Close an incident with explicit consequence | PER-01 | Epic 1 (F1) | US-1.6 | JTBD-02.1: Closure writes a Timeline entry with actor/timestamp and makes "Generate AAR" available only once Closed | R1 |
| Generate an after-action report once an incident closes | PER-03 | Epic 7 (F7) | US-7.2 | JTBD-03.4: Timeline/decisions/resource history auto-populate; each finding requires a non-null owner and due date before finalization | R1 |

### Improve

| Activity | Persona | Epic | Stories | NaC | Release |
|---|---|---|---|---|---|
| Review an exportable, append-only evidence and audit log | PER-05 | Epic 7 (F7) | US-7.3 | JTBD-05.3 / JTBD-05.2: Export matches exactly the filtered view on screen; no edit/delete control exists anywhere, for any role | R1 |
| Review KPI trends on an analytics dashboard | PER-05 | Epic 7 (F7) | US-7.4 | JTBD-05.3: A KPI tile never shows a numeric target unless explicitly configured with definition/baseline/owner/cadence | R1 |
| Switch between admin and executive facets without ambiguity | PER-05 | Epic 18 (F18) | US-18.3 | JTBD-05.3: Executive-briefing view shows display-scale numbers for 1–3 headline KPIs only, never auto-selected by the system | R1 |

---
## NaC Derivation Table

Full traceability chain: JTBD outcome → journey stage (lifecycle lane) → NaC → story. Every NaC is pulled or paraphrased from the JTBD-EPMP.md NaC Preview and anchored to the lane/story where it is actually exercised.

| JTBD ID | Outcome | Journey Stage | NaC | Story |
|---------|---------|---------------|-----|-------|
| JTBD-05.2 | Fully attributable security actions | Prepare:Sign in via SSO | Failed SSO assertion shows a named error (401 SSO_AUTH_FAILED); a user with no mapped role sees 403 ROLE_UNRESOLVED, never a blank screen | US-8.1 |
| JTBD-01.1 | Full-jurisdiction readiness status known in under 5 minutes | Prepare:Role-scoped navigation | `SideNav` renders lifecycle-ordered groups scoped to role; no group a role doesn't permit is ever shown | US-0.1 |
| JTBD-01.1 | Full-jurisdiction readiness status known in under 5 minutes | Prepare:Land on dashboard | F18 resolves role and routes to the correct landing view; an unmapped role falls back to a generic dashboard, never a blank page | US-18.1 |
| JTBD-04.3 | Near-real-time field-to-EOC visibility | Prepare:Field-home landing | Field landing is bottom-bar only, max 4 destinations, "Report observation" the single primary action | US-18.2 |
| JTBD-05.4 | Zero compliance-overclaim exposure | Prepare:Theme switch | Contrast theme achieves 7:1 text contrast; all three themes hold full functional/visual parity, evidencing conformance by test | US-0.2 |
| JTBD-02.1 | Zero-gap command accountability | Prepare:Loading/empty/error states | Every list/table/panel shows `Skeleton`/`EmptyState`/`Alert` with retry; status is always icon+word+color | US-0.3 |
| JTBD-05.4 | Zero compliance-overclaim exposure | Prepare:Design-system gaps | An unsupported treatment is logged as a flagged gap, never improvised with raw hex/custom components | US-0.4 |
| JTBD-01.3 | On-demand defensible plan evidence | Prepare:Plan repository | Every plan/SOP shows version history and approval state without external document lookup; no direct Draft→Approved transition | US-3.1 |
| JTBD-03.3 | Plans traceable to execution | Prepare:Link plan sections | A task created from a linked template shows a visible link back to its originating plan section | US-3.2 |
| JTBD-01.3 | On-demand defensible plan evidence | Prepare:Import plans | A document the user couldn't see in SharePoint is never visible in the import flow (403 IMPORT_PERMISSION_DENIED) | US-3.3 |
| JTBD-01.3 | On-demand defensible plan evidence | Prepare:Read plans | Plan content constrained to reading-max (720px); version history is read-only with "View this version" per entry | US-3.4 |
| JTBD-02.4 | Confirmed, approved public messaging | Prepare:Recipient groups/templates | Recipient groups and message templates are reusable, each shown with member count/last-used so setup is never rebuilt | US-5.1 |
| JTBD-05.2 | Fully attributable security actions | Prepare:RBAC configuration | Permission changes are logged with before/after state; a role in use cannot be deleted (409 ROLE_IN_USE) | US-8.2 |
| JTBD-05.2 | Fully attributable security actions | Prepare:Audit trail | Every login, permission change, record access, and AI-draft approval writes an entry; the log is immutable (403 AUDIT_LOG_IMMUTABLE) | US-8.3 |
| JTBD-05.1 | Clear, conflict-free integration state | Prepare:Platform/integration health | Integration Health table shows system, last sync, direction, record authority, sync status for every connected system | US-8.4 |
| JTBD-05.2 | Fully attributable security actions | Prepare:SSO config + test | "Test connection" must succeed before "Save configuration" can activate the config as live; changes are logged | US-8.5 |
| JTBD-05.1 | Clear, conflict-free integration state | Prepare:Record authority registry | An undeclared record type is never synced by any integration feature; registry changes are audited | US-10.1 |
| JTBD-05.1 | Clear, conflict-free integration state | Prepare:Background job monitor | A job exceeding its failure threshold surfaces a clear alert with the last error reason | US-10.4 |
| JTBD-05.2 | Fully attributable security actions | Prepare:HR/IAM SSO | HR/IAM authentication shares the same SAML2/OIDC config as F8 — no duplicated login flow | US-16.3 |
| JTBD-05.2 | Fully attributable security actions | Prepare:Roster/qualification sync | Roster sync never overwrites EPMP-owned RBAC/theme/audit fields — only HR-sourced reference fields update | US-16.1 |
| JTBD-05.1 | Clear, conflict-free integration state | Prepare:HR conflict flag | A conflicting local edit to an HR-authoritative field is flagged (200 flagged HR_FIELD_CONFLICT), never silently overwritten | US-16.2 |
| JTBD-01.3 | On-demand defensible plan evidence | Prepare:SharePoint import/link | Browse/import/link always executes under the user's own delegated permissions, never a broader service account | US-17.2 |
| JTBD-01.1 | Full-jurisdiction readiness status known in under 5 minutes | Monitor:Scan dashboard | Dashboard renders up to 4 `Stat` tiles, refreshed via event-bus without manual reload; a timeout shows a clear retry (504) | US-2.4 |
| JTBD-02.2 | Faster verified situation reports | Monitor:Shared map | Incidents/facilities/resources render with status-coded markers (shape + tone); status bar shows "As of HH:MM · source" | US-2.1 |
| JTBD-02.2 | Faster verified situation reports | Monitor:Hazard overlay layers | Every visible layer shows label/source/age; a layer missing source or asOf is never displayed | US-2.2 |
| JTBD-02.2 | Faster verified situation reports | Monitor:Degraded GIS | A schematic base map renders labeled "offline" when GIS is unavailable; the page never fails to render due to a GIS outage | US-2.3 |
| JTBD-02.2 | Faster verified situation reports | Monitor:Real GIS base map | Base-layer services normalize to GeoJSON with source/as_of provenance; a response missing either triggers degraded fallback | US-11.1 |
| JTBD-05.1 | Clear, conflict-free integration state | Monitor:Publish GIS layers | Publish requests restricted to the declared layer set; publishing without granted write permission is denied (403) | US-11.2 |
| JTBD-02.2 | Faster verified situation reports | Monitor:Provenance enforcement | Inbound data lacking source/timestamp/version/confidence is rejected at the API boundary (422 PROVENANCE_REQUIRED) | US-10.3 |
| JTBD-01.2 | Faster, accountable activation | Monitor:Signal triage queue | Confidence is a qualitative label with a stated reason; under no configuration is a signal auto-promoted to an active incident | US-9.1 |
| JTBD-01.2 | Faster, accountable activation | Monitor:Hazard feed layer | Ingested hazard events carry source/issued_at/confidence; new layers persist `verified:false` by default | US-12.1 |
| JTBD-01.2 | Faster, accountable activation | Monitor:Verify hazard layer | `verified` can only be set true by an explicit, named-person action — no automated promotion under any configuration | US-12.2 |
| JTBD-02.2 | Faster verified situation reports | Monitor:Facility status | Facility markers render with source/as_of provenance; a feed outage shows last-known position labeled with its age | US-17.1 |
| JTBD-01.2 | Faster, accountable activation | Activate:Create incident | On submit, the incident is created `Open` with a first Timeline entry ("Incident created") written automatically | US-1.1 |
| JTBD-02.1 | Zero-gap command accountability | Activate:Assign command roles | Every assignment writes a Timeline entry; activation cannot move above Monitoring without an assigned Incident Commander | US-1.2 |
| JTBD-01.2 | Faster, accountable activation | Activate:Change activation level | Escalating activation opens a danger modal stating the operational consequence; the change writes a Timeline entry | US-1.3 |
| JTBD-02.2 | Faster verified situation reports | Coordinate:Monitor workspace | `PageHeader`, fixed tab order, pinned command-roles and map-thumbnail present timeline/tasks/resources/reports in one place | US-1.4 |
| JTBD-03.2 | Faster reviewable documentation | Coordinate:ICS forms with AI draft | `AIDraft` panel never writes directly into the field; a form cannot transition to Approved without a recorded reviewer | US-1.5 |
| JTBD-02.3 | No lost tasks or resource requests | Coordinate:Create/assign task | A task cannot be created without an owner (422 TASK_OWNER_REQUIRED); list shows current status/owner/due at a glance | US-4.1 |
| JTBD-04.3 | Near-real-time field-to-EOC visibility | Coordinate:Task lifecycle | Every status transition writes a Timeline entry with actor, timestamp, before/after status | US-4.2 |
| JTBD-03.1 | No untracked resource-request gaps | Coordinate:Resource request submit | Resource-request status changes publish to the event bus so COP/reporting reflect current state without manual refresh | US-4.3 |
| JTBD-02.3 / JTBD-03.1 | No lost tasks or requests / no untracked gaps | Coordinate:Approve/fulfill request | Full approval history (submitted→approved/declined→assigned→fulfilled) visible as Timeline-style entries | US-4.4 |
| JTBD-02.4 | Confirmed, approved public messaging | Coordinate:Compose notification | AI never auto-populates the message field without an explicit, logged Approve action; send requires approver match (403 otherwise) | US-5.2 |
| JTBD-02.4 | Confirmed, approved public messaging | Coordinate:Track delivery | Delivery/acknowledgment status per recipient is visible within minutes, auto-refreshing as callbacks arrive; failures never silent | US-5.3 |
| JTBD-04.3 | Near-real-time field-to-EOC visibility | Coordinate:Field task check/update | Status updates made while offline write to local cache and queue; `SyncStatus` reflects online/syncing/offline/conflict in real time | US-6.1 |
| JTBD-04.1 | Zero offline data loss | Coordinate:Submit field report | Submission always succeeds locally regardless of connectivity — sends immediately online or queues offline, zero data loss | US-6.2 |
| JTBD-04.2 | Confirmed or flagged sync | Coordinate:Confirm sync on reconnect | Every item resolves to synced, conflict (pending resolution), or failed (flagged, with reason/retry) — never silently dropped | US-6.3 |
| JTBD-04.2 | Confirmed or flagged sync | Coordinate:Resolve sync conflict | Resolution requires an explicit named-person choice, writing a Timeline entry noting which version was kept and by whom | US-6.4 |
| JTBD-03.2 | Faster reviewable documentation | Coordinate:Generate SITREP | SITREP auto-pulls current Timeline/task/resource data into a draft; only Approved documents count as official record | US-7.1 |
| JTBD-01.4 | Zero unauthorized cross-jurisdiction exposure | Coordinate:Grant federation access | A grant must have an explicit, enumerated scope; revoking takes effect within the same request cycle, no caching window | US-10.2 |
| JTBD-03.2 | Faster reviewable documentation | Coordinate:AI draft ICS/narrative | Approve copies draft text and logs reviewer+timestamp; no API write accepts AI-origin content without a non-null approver | US-9.2 |
| JTBD-02.4 | Confirmed, approved public messaging | Coordinate:AI governance guarantee | This prohibition is enforced at both UI and API layers with no feature flag or admin setting able to override it | US-9.3 |
| JTBD-05.1 | Clear, conflict-free integration state | Coordinate:EOC COTS record exchange | Every sync cycle checks the record-authority registry before applying any inbound change; undeclared types are never synced | US-13.1 |
| JTBD-05.1 | Clear, conflict-free integration state | Coordinate:Resolve EOC conflict | A detected conflict shows both values side by side with explicit keep-value actions — never auto-resolved by any heuristic | US-13.2 |
| JTBD-02.4 | Confirmed, approved public messaging | Coordinate:Dispatch via provider | The send endpoint rejects any request lacking approved_by/approved_at, unconditionally, with no override | US-14.1 |
| JTBD-02.4 | Confirmed, approved public messaging | Coordinate:CAP public warning | An incomplete CAP payload is never dispatched; EPMP never originates a CAP alert without an authorized sender identity | US-14.2 |
| JTBD-02.2 | Faster verified situation reports | Coordinate:CAD dispatch status | Dispatch events display read-only with Provenance; no PATCH/PUT/DELETE route exists — CAD/911 remains system of record | US-15.1 |
| JTBD-02.1 | Zero-gap command accountability | Recover:Close incident | Closure writes a Timeline entry with actor/timestamp; "Generate AAR" is only available once the incident is Closed | US-1.6 |
| JTBD-03.4 | Closed-loop after-action learning | Recover:Generate AAR | Timeline, decisions, and resource history auto-populate; each finding requires a non-null owner and due date before finalization | US-7.2 |
| JTBD-05.3 / JTBD-05.2 | Evidence-only executive answers / attributable actions | Improve:Evidence/audit export | An export matches exactly the filtered view on screen; no edit or delete control exists anywhere, for any role | US-7.3 |
| JTBD-05.3 | Evidence-only executive answers | Improve:KPI analytics dashboard | A KPI tile never shows a numeric target unless explicitly configured with definition/baseline/owner/cadence | US-7.4 |
| JTBD-05.3 | Evidence-only executive answers | Improve:Admin/executive facet toggle | Executive-briefing view shows display-scale numbers for 1–3 headline KPIs only, never auto-selected by the system | US-18.3 |

---
## Release Planning

### Release R1: MVP Operational Foundation

**Theme:** The full incident-centric operational lifecycle — application shell, Incident/ICS activation and command, common operating picture, plans, tasks/resource requests, notifications, mobile field operations, reporting/learning, security/administration, platform API/event bus, and GIS integration — every P0 story per the PRD priority tier. This is the release where all five personas complete at least one end-to-end journey.

**Stories (48):** US-0.1, US-0.2, US-0.3, US-0.4, US-1.1, US-1.2, US-1.3, US-1.4, US-1.5, US-1.6, US-2.1, US-2.2, US-2.3, US-2.4, US-3.1, US-3.2, US-3.3, US-3.4, US-4.1, US-4.2, US-4.3, US-4.4, US-5.1, US-5.2, US-5.3, US-6.1, US-6.2, US-6.3, US-6.4, US-7.1, US-7.2, US-7.3, US-7.4, US-8.1, US-8.2, US-8.3, US-8.4, US-8.5, US-10.1, US-10.2, US-10.3, US-10.4, US-11.1, US-11.2, US-16.3, US-18.1, US-18.2, US-18.3

**Personas Served:** PER-01, PER-02, PER-03, PER-04, PER-05 (all five)

**JTBD Addressed:** JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-01.4, JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-02.4, JTBD-03.1, JTBD-03.2, JTBD-04.1, JTBD-04.2, JTBD-04.3, JTBD-05.1, JTBD-05.2 (JTBD-03.3, JTBD-03.4, JTBD-05.3, JTBD-05.4 partially addressed in R1 via US-3.2/US-7.2/US-7.3/US-7.4/US-18.3, fully closed once R2's AI/interoperability stories land)

**End-to-end journeys completable in R1:**
- **PER-01** — JRN-01.1 (start-of-shift readiness check) and JRN-01.2 (storm activation + command handoff, minus the F12 hazard-overlay confidence flagging which lands in R2): US-18.1, US-2.4, US-2.1/US-2.2/US-2.3, US-3.1, US-7.3 → US-1.1, US-1.2, US-5.2/US-5.3, US-10.2
- **PER-02** — JRN-02.1 (full incident lifecycle) and JRN-02.2 (public message approval/tracking): US-1.2 → US-1.4 → US-4.1 → US-2.1 → US-1.3 → US-5.2 → US-5.3 → US-1.6 (AI-narrative review step, US-9.2, is an enhancement layered on in R2 — the core lifecycle completes without it)
- **PER-03** — JRN-03.1 (resource-request lifecycle + daily SITREP): US-4.3 → US-4.4 → US-7.1 (AI-assisted drafting via US-9.2 is R2; manual SITREP drafting from auto-pulled data in US-7.1 is R1-complete on its own)
- **PER-04** — JRN-04.1 (offline field reporting + reconnect sync): US-18.2 → US-6.1 → US-6.2 → US-6.1 (status update) → US-6.3 → US-6.4
- **PER-05** — JRN-05.1 (admin facet: integration conflict + audit) using F8's native conflict-surfacing pattern (US-8.4) plus JRN-05.2 (executive facet: KPI review): US-8.4 → US-8.3 → US-8.2; US-18.3 → US-7.4 → US-7.3 (full EOC-COTS-specific conflict view, US-13.2, lands in R2 — R1 ships the equivalent integration-health/conflict pattern generically via F8/F10)

**Acceptance Gate:**
- [ ] All NaC for the 48 R1 stories pass
- [ ] PER-01 through PER-05 can each complete at least one journey end-to-end using only R1 stories
- [ ] No P0 story is deferred past R1

---
### Release R2: Governed AI, Hazard Intelligence & External Communication Depth

**Theme:** Adds the governed AI-assistance layer (signal triage, AI-drafted ICS/narrative content), enriches the operating picture with live hazard feeds, extends interoperability to incumbent EOC COTS systems, and completes outbound public-alerting integration — every P1 story per the PRD priority tier. R2 deepens journeys already completable in R1; it does not newly unlock any persona's first end-to-end path.

**Stories (11):** US-9.1, US-9.2, US-9.3, US-12.1, US-12.2, US-13.1, US-13.2, US-14.1, US-14.2, US-16.1, US-16.2

**Personas Served:** PER-01 (US-9.1, US-12.1, US-12.2, US-13.1), PER-02 (US-9.2 as reviewer in the narrative journey, US-14.1, US-14.2, US-16.1), PER-03 (US-9.2, US-12.1), PER-05 (US-9.3, US-13.2, US-16.2)

**JTBD Addressed:** JTBD-01.2 (signal triage + hazard verification), JTBD-02.4 (real provider dispatch + CAP formatting), JTBD-03.2 (AI-assisted drafting with provenance), JTBD-05.1 (EOC COTS record-authority conflict + HR field-conflict flagging)

**Journey depth added in R2:**
- PER-01's JRN-01.2 "Monitor" stage gains full hazard-feed confidence/verification handling (US-12.1, US-12.2) and incident validation gains AI signal triage (US-9.1)
- PER-02's JRN-02.1 "Review AI-Drafted Narrative" stage (US-9.2) and JRN-02.2's "Approve & Send"/"Track Delivery" stages gain real provider dispatch and CAP-compliant public warnings (US-14.1, US-14.2)
- PER-03's JRN-03.1 "Draft SITREP" stage gains full AI-assisted drafting (US-9.2, layered onto R1's US-7.1)
- PER-05's JRN-05.1 gains the EOC-COTS-specific conflict view (US-13.2) and HR-authority conflict flagging (US-16.2), both specializations of the generic F8/F10 conflict pattern already live in R1

**Acceptance Gate:**
- [ ] All NaC for the 11 R2 stories pass
- [ ] AI governance guarantee (US-9.3) is independently verified against both F5 and F14 send paths before any AI-assisted drafting feature is enabled
- [ ] Release extends journey depth without breaking any R1 end-to-end path

---
### Release R3: Supplementary Integrations

**Theme:** Adds integrations that are valuable but agency-specific and non-blocking for the core MVP demonstration path — CAD/911 dispatch visibility and asset/facility/document system integration — every P2 story per the PRD priority tier.

**Stories (3):** US-15.1, US-17.1, US-17.2

**Personas Served:** PER-02 (US-15.1, US-17.1), PER-03 (US-17.2)

**JTBD Addressed:** JTBD-02.2 (fuller operating picture via CAD dispatch status and facility markers), JTBD-01.3 (SharePoint document import/link under the user's own permissions)

**Journey depth added in R3:**
- PER-02's JRN-02.1 "Monitor Operating Picture" stage gains read-only CAD/911 dispatch status (US-15.1) and facility markers sourced from the agency's asset/facility system (US-17.1)
- PER-03's JRN-03.2 (plan/SOP maintenance) gains permission-aware live-linking of SharePoint documents beyond the R1 import/copy flow (US-17.2 builds on R1's US-3.3)

**Acceptance Gate:**
- [ ] All NaC for the 3 R3 stories pass
- [ ] No R3 story is a dependency for any R1 or R2 acceptance gate
- [ ] Agency-specific vendor access for CAD/911 and asset/facility systems is confirmed before activating these integrations per deployment

---
## Coverage Analysis

### Persona Coverage

| Persona | R1 | R2 | R3 |
|---------|----|----|-----|
| PER-01 | US-0.1, US-0.2, US-1.1, US-1.2, US-2.1, US-2.3, US-2.4, US-3.1, US-5.3, US-8.4, US-10.2, US-16.3, US-18.1 | US-9.1, US-12.2, US-13.1 | — |
| PER-02 | US-0.3, US-1.2, US-1.3, US-1.4, US-2.1, US-3.4, US-4.1, US-5.1, US-5.2, US-11.1 | US-9.2, US-14.1, US-14.2, US-16.1 | US-15.1, US-17.1 |
| PER-03 | US-1.5, US-2.2, US-3.2, US-3.3, US-4.3, US-4.4, US-7.1, US-10.3 | US-9.2, US-12.1 | US-17.2 |
| PER-04 | US-4.2, US-6.1, US-6.2, US-6.3, US-6.4, US-18.2 | — | — |
| PER-05 | US-0.2, US-0.4, US-7.3, US-7.4, US-8.1, US-8.2, US-8.3, US-8.4, US-8.5, US-10.1, US-10.4, US-11.2, US-18.3 | US-9.3, US-13.2, US-16.2 | — |

**Every persona (PER-01 through PER-05) has a non-empty R1 column**, confirming the MVP requirement that all five personas can complete at least one journey end-to-end in R1. PER-04 is entirely satisfied within R1 (no R2/R3 stories) because the Field Responder journey (JRN-04.1) is fully scoped within F6, which is 100% P0.

### JTBD Coverage

| JTBD ID | Release | Stories | NaC Count |
|---------|---------|---------|-----------|
| JTBD-01.1 | R1 | US-0.1, US-2.4, US-18.1 | 3 |
| JTBD-01.2 | R1 / R2 | US-1.1, US-1.3 (R1); US-9.1, US-12.1, US-12.2 (R2) | 5 |
| JTBD-01.3 | R1 / R3 | US-3.1, US-3.2, US-3.3, US-3.4 (R1); US-17.2 (R3) | 5 |
| JTBD-01.4 | R1 | US-10.2 | 1 |
| JTBD-02.1 | R1 | US-0.3, US-1.2, US-1.6 | 3 |
| JTBD-02.2 | R1 / R3 | US-2.1, US-2.2, US-2.3, US-1.4, US-11.1, US-10.3 (R1); US-15.1, US-17.1 (R3) | 8 |
| JTBD-02.3 | R1 | US-4.1, US-4.4 | 2 |
| JTBD-02.4 | R1 / R2 | US-5.2, US-5.3 (R1); US-9.3, US-14.1, US-14.2 (R2) | 5 |
| JTBD-03.1 | R1 | US-4.3, US-4.4 | 2 |
| JTBD-03.2 | R1 / R2 | US-1.5, US-7.1 (R1); US-9.2 (R2) | 3 |
| JTBD-03.3 | R1 | US-3.2 | 1 |
| JTBD-03.4 | R1 | US-7.2 | 1 |
| JTBD-04.1 | R1 | US-6.2 | 1 |
| JTBD-04.2 | R1 | US-6.3, US-6.4 | 2 |
| JTBD-04.3 | R1 | US-4.2, US-6.1, US-18.2 | 3 |
| JTBD-05.1 | R1 / R2 | US-8.4, US-10.1, US-10.4, US-11.2 (R1); US-13.1, US-13.2, US-16.2 (R2) | 7 |
| JTBD-05.2 | R1 | US-8.1, US-8.2, US-8.3, US-8.5, US-16.3, US-16.1 | 6 |
| JTBD-05.3 | R1 | US-7.3, US-7.4, US-18.3 | 3 |
| JTBD-05.4 | R1 | US-0.2, US-0.4 | 2 |

Every JTBD outcome in JTBD-EPMP.md has at least one derived NaC and at least one mapped story. No JTBD outcome is orphaned.

### Gap Analysis

- **No JTBD outcomes without stories.** All 19 JTBD IDs (JTBD-01.1 through JTBD-05.4) have at least one NaC derivation and mapped story — confirmed in the JTBD Coverage table above.
- **No personas without an R1 journey.** PER-01 through PER-05 each have a non-empty R1 column; the MVP end-to-end requirement is satisfied for all five.
- **No journey stages without feature coverage.** Every stage in every journey (JRN-01.1 through JRN-05.2) in JOURNEYS-EPMP.md maps to at least one feature/epic, and every epic (F0–F18 / Epic 0–18) has at least one story placed in a lifecycle lane.
- **No orphan stories.** All 62 stories in UserStories-EPMP.md (US-0.1 through US-18.3) appear exactly once in the Story Map Matrix. Verified by cross-referencing the Story Index in UserStories-EPMP.md §"Story Index" against the six lifecycle lanes.
- **Minor noted overlap, not a gap:** US-4.2 (task status lifecycle) appears in the Coordinate lane under PER-04 per its story statement ("As a Diego Reyes / Field Responder...") even though F4 is PER-02/PER-03-primary per the Feature-Persona Matrix; this is intentional — the same task-status mechanism is exercised by both PER-02 (creator) and PER-04 (updater), and JOURNEYS-EPMP.md's JRN-04.1:Update Status touchpoint explicitly cites F6+F4 together.
- **Partial-release JTBD notes (not gaps):** JTBD-01.2, JTBD-02.2, JTBD-02.4, JTBD-03.2, and JTBD-05.1 each have their *core* NaC satisfied in R1 and *additional* NaC added in R2/R3 as the AI, hazard-feed, interoperability, and CAD/facility capabilities mature — this reflects intentional incremental depth, not a missing R1 capability. Each of these JTBD's primary success measure (per JTBD-EPMP.md) is demonstrable using R1 stories alone.

---
## NaC-to-Acceptance Criteria Mapping

Spot-verification that each derived NaC is directly backed by acceptance criteria already written in UserStories-EPMP.md — confirming NaC were derived from, not invented independently of, the existing stories. A representative sample spanning all five personas and all three releases is shown; every NaC in the full Derivation Table above traces to AC text in its cited story.

| NaC | Story | AC from UserStories-EPMP.md | Aligned? |
|-----|-------|-------------------|----------|
| JTBD-01.1: Dashboard renders readiness/incident data for all jurisdictions on landing, routed by resolved role | US-18.1 | "On sign-in, F18 resolves role (and facet, for PER-05) and routes to the correct default landing view with the correct SideNav/bottom-bar configuration" | Yes |
| JTBD-02.1: Every role assignment writes a Timeline entry; activation cannot exceed Monitoring without an assigned IC | US-1.2 | "Every assignment writes a Timeline entry with actor and timestamp" / "At least one Incident Commander must be assigned before activation level can move above Monitoring (422 NO_COMMANDER_ASSIGNED otherwise)" | Yes |
| JTBD-02.3: A task cannot be created without an owner; list shows current status/owner/due at a glance | US-4.1 | "A task cannot be created without an owner (422 TASK_OWNER_REQUIRED)" / "task list shows Task, Status (Badge), Owner (Avatar), Due, Incident, and Linked plan section" | Yes |
| JTBD-03.1: Resource-request status changes publish to the event bus so COP/reporting reflect current state without manual refresh | US-4.3 | "Resource-request status changes publish to the event bus so the operating picture (F2) and reporting (F7) reflect current state without manual refresh" | Yes |
| JTBD-04.1: Submission always succeeds locally regardless of connectivity — sends immediately online or queues offline, zero data loss | US-6.2 | "Submission always succeeds locally regardless of connectivity — it sends immediately online or queues offline" | Yes |
| JTBD-04.2: Every item resolves to synced, conflict, or failed — never silently dropped | US-6.3 | "No submission is ever silently dropped — every item resolves to synced, conflict (pending resolution), or failed (flagged, with reason and retry option)" | Yes |
| JTBD-03.4: Timeline/decisions/resource history auto-populate; each finding requires a non-null owner and due date | US-7.2 | "Steps 1–3 (timeline export, decisions log, resource-request history) are auto-populated and read-only/annotatable" / "Step 4 ... requires each entry to have a non-null owner and due date before finalization (422 CORRECTIVE_ACTION_UNOWNED otherwise)" | Yes |
| JTBD-05.2: Every login, permission change, record access, and AI-draft approval appears in an append-only, exportable log | US-8.3 | "Every login, permission change, record access to a sensitive type, and AI-draft approval writes an entry with actor, timestamp, action, and affected record" | Yes |
| JTBD-05.1: Integration Health table shows system, last sync, direction, record authority, sync status | US-8.4 | "Integration Health table shows System, Last sync, Direction, Record authority, and SyncStatus for each connected external system" | Yes |
| JTBD-05.3: A KPI tile never shows a numeric target unless explicitly configured with definition/baseline/owner/cadence | US-7.4 | "A KPI tile never shows a numeric target unless that target has been explicitly configured with definition/baseline/owner/cadence — otherwise it shows only the current measured value" | Yes |
| JTBD-01.2: Confidence is a qualitative label with a stated reason; no signal is ever auto-promoted to an incident | US-9.1 | "confidence as a qualitative label with a stated reason (never a bare percentage)" / "Under no configuration is a signal auto-promoted to an active incident" | Yes |
| JTBD-02.4: The send endpoint rejects any request lacking approved_by/approved_at, unconditionally, with no override | US-14.1 | "The send endpoint rejects any request lacking approved_by/approved_at, unconditionally, with no override (400 SEND_REQUIRES_APPROVAL)" | Yes |
| JTBD-05.1: A detected conflict shows both values side by side with explicit keep-value actions — never auto-resolved | US-13.2 | "A detected conflict shows both values side by side with 'Keep EPMP value' / 'Keep [external] value' actions — never auto-resolved by any heuristic" | Yes |
| JTBD-02.2: Dispatch events display read-only with Provenance; no PATCH/PUT/DELETE route exists | US-15.1 | "No PATCH/PUT/DELETE route exists for this resource at the API level — the contract is read-only by design" | Yes |
| JTBD-01.3: Browse/import/link always executes under the user's own delegated permissions | US-17.2 | "Browse/import/link operations always execute under the requesting user's own delegated permissions, never a shared service account with broader access" | Yes |

No misalignments were found in this sample. All sampled NaC statements are verbatim or close paraphrases of acceptance criteria already present in UserStories-EPMP.md, confirming the Story Map derives rather than invents testable criteria.

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-11-14*
