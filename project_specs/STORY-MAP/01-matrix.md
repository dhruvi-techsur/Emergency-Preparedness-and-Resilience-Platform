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
