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
