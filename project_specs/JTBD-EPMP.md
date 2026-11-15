# Jobs to Be Done
## EPMP (Emergency Preparedness & Management Platform)

| Field | Value |
|-------|-------|
| **Product Name** | EPMP (Emergency Preparedness & Management Platform) |
| **Date** | 2026-11-14 |
| **Related Personas** | PERSONAS-EPMP.md |
| **Related PRD** | PRD-EPMP.md |

---

## JTBD Summary

| ID | Persona | Job Statement | Priority |
|----|---------|--------------|----------|
| JTBD-01.1 | PER-01 | When starting a shift, I want one trustworthy readiness/activity picture across my jurisdictions, so I can decide where to focus without piecing together calls and spreadsheets. | P0 |
| JTBD-01.2 | PER-01 | When conditions warrant, I want to activate an incident and assign command roles in minutes, so I can move from "watching" to "activated" without a phone tree. | P0 |
| JTBD-01.3 | PER-01 | When asked to substantiate preparedness, I want current, versioned plans/SOPs and approvals on demand, so I can prove readiness without reconstructing scattered records. | P1 |
| JTBD-01.4 | PER-01 | When coordinating with peer jurisdictions, I want to share a scoped, authorized operating picture, so I can give partners awareness without exposing unauthorized data. | P1 |
| JTBD-02.1 | PER-02 | When an incident is validated, I want to stand up a named-person command structure immediately, so I can direct the response without ambiguity over ownership. | P0 |
| JTBD-02.2 | PER-02 | When running an active incident, I want one live shared map of incidents, resources, and facilities, so I can decide on current conditions instead of reconciling radio traffic. | P0 |
| JTBD-02.3 | PER-02 | When directing response, I want to create, assign, and track tasks and resource requests reliably, so I can ensure nothing is lost in a spreadsheet or phone call. | P0 |
| JTBD-02.4 | PER-02 | When approving public messages, I want tracked delivery and acknowledgment, so I can know — not guess — that the message reached its audience. | P0 |
| JTBD-03.1 | PER-03 | When tasks generate resource needs, I want a visible request lifecycle from creation to closure, so I can guarantee nothing is lost, duplicated, or unacknowledged. | P0 |
| JTBD-03.2 | PER-03 | When producing SITREPs/ICS forms daily, I want reviewable AI-assisted drafts from incident data, so I can document quickly without starting from a blank page. | P0 |
| JTBD-03.3 | PER-03 | When maintaining plans/SOPs, I want to link plan sections to the tasks they generate, so I can close the gap between written readiness and actual execution. | P1 |
| JTBD-03.4 | PER-03 | When an incident or exercise closes, I want an AAR built directly from incident data, so I can get lessons back into plans and training instead of losing the loop. | P1 |
| JTBD-04.1 | PER-04 | When connectivity is unreliable or absent, I want to submit structured reports, photos, and location regardless, so I can keep reporting without losing work. | P0 |
| JTBD-04.2 | PER-04 | When reconnecting after being offline, I want confirmation every queued item reached the EOC, so I can stop wondering if an update disappeared. | P0 |
| JTBD-04.3 | PER-04 | When working continuously through a shift, I want fast task checks and single-action status updates, so I can stay current without multi-step forms slowing me down. | P0 |
| JTBD-05.1 | PER-05 | When monitoring platform health, I want clear record-authority and integration-health visibility, so I can resolve data conflicts instead of treating them as confusing mismatches. | P0 |
| JTBD-05.2 | PER-05 | When configuring access or facing a security review, I want governed SSO/RBAC and a full audit trail, so I can prove every security-relevant action is attributable. | P0 |
| JTBD-05.3 | PER-05 | When reviewing program performance, I want 1–3 headline KPIs and evidence records, so I can answer whether we're more prepared than last quarter using platform evidence alone. | P1 |
| JTBD-05.4 | PER-05 | When preparing product copy or facing a compliance inquiry, I want demonstrated accessibility conformance with no FedRAMP overclaim, so I can avoid legal exposure. | P1 |

---

## PER-01: Maria Alvarez — Jobs

### JTBD-01.1: Start-of-Shift Readiness & Activity Check

**Job Statement:**
When I arrive at work and need to prioritize my day across every jurisdiction I'm responsible for, I want to see one trustworthy, time-stamped picture of readiness, active incidents, and resource status, so I can decide where to focus without piecing it together from calls and spreadsheets.

**Current Alternatives:**
- Cross-references three or more disconnected spreadsheets and documents by hand
- Relies on phone and email updates from county/peer liaisons that are often delayed or incomplete

**Hiring Criteria:**
- Single dashboard shows readiness, active incidents, and resource status across all jurisdictions she's responsible for
- Every data point is visibly time-stamped with its source
- Dashboard loads in under 5 seconds

**Success Measure:** Maria can state current readiness status (plans, open gaps, active incidents) for her full jurisdiction in under 5 minutes.

**Related Features:** F2, F18
**Priority:** P0

---

### JTBD-01.2: Rapid, Accountable Incident Activation

**Job Statement:**
When conditions warrant moving from monitoring to response, I want to activate an incident and assign initial command roles in minutes, so I can establish an accountable command structure without running a phone tree.

**Current Alternatives:**
- Calls down a phone tree to reach command staff one by one
- Assigns roles verbally with no persistent, reviewable record

**Hiring Criteria:**
- Activation and initial role assignment complete in a single guided flow
- Named-person accountability is captured automatically for every role assigned
- Activation requires a confirmation step stating the operational consequence

**Success Measure:** Median time from validated event to active command structure decreases measurably incident over incident.

**Related Features:** F1
**Priority:** P0

---

### JTBD-01.3: Defensible Plan & SOP Currency

**Job Statement:**
When auditors, elected officials, or a peer jurisdiction ask her to substantiate preparedness, I want current, versioned plans and SOPs with approval history available on demand, so I can prove readiness without reconstructing records from scattered drives.

**Current Alternatives:**
- Digs through disconnected document folders and drives with no version history
- Manually recreates a readiness status summary before every review or audit

**Hiring Criteria:**
- Plan/SOP repository preserves version history and a draft → review → approved workflow
- Approvals are timestamped and visible without extra lookups
- A readiness summary can be exported in one action

**Success Measure:** Maria can produce a current readiness/plan-status summary for leadership or a peer jurisdiction in a single sitting, with zero reconstruction from external documents.

**Related Features:** F3, F7
**Priority:** P1

---

### JTBD-01.4: Controlled Cross-Jurisdiction Sharing

**Job Statement:**
When coordinating informally with peer jurisdictions or responding to an oversight request, I want to share a scoped, authorized slice of the operating picture, so I can give partners the awareness they need without exposing data they aren't authorized to see.

**Current Alternatives:**
- Shares informally by phone or email with no enforced access boundary — all-or-nothing in practice

**Hiring Criteria:**
- Federation grants are explicit, scoped to specific data, and revocable at any time
- Every partner's access is auditable after the fact

**Success Measure:** Zero instances of a partner jurisdiction seeing data it isn't authorized to see.

**Related Features:** F10
**Priority:** P1

---

## PER-02: James Okafor — Jobs

### JTBD-02.1: Immediate, Named-Person Command Structure

**Job Statement:**
When an incident is validated and requires activation, I want to stand up a command structure with named-person accountability immediately, so I can begin directing the response without ambiguity about who owns what.

**Current Alternatives:**
- Assigns roles verbally over radio or phone with no persistent record of who holds which role

**Hiring Criteria:**
- Role assignment and reassignment are each a single recorded action
- Every assignment captures actor and timestamp automatically in the incident record

**Success Measure:** Every command-role assignment, status change, and decision is captured in the incident timeline with actor and timestamp — zero gaps when reconstructing an incident after the fact.

**Related Features:** F1
**Priority:** P0

---

### JTBD-02.2: Continuous Shared Situational Awareness

**Job Statement:**
When running an active incident continuously, I want to see incidents, resources, and facility positions on one live, shared map, so I can make decisions from current conditions instead of reconciling radio traffic and verbal reports.

**Current Alternatives:**
- Manually reconciles radio traffic, verbal field reports, and separate resource lists

**Hiring Criteria:**
- Live map shows status-coded markers for incidents, resources, and facilities in one view
- Every map panel visibly shows data age and source

**Success Measure:** Time to first verified situation report decreases measurably versus the radio/phone baseline.

**Related Features:** F2, F11
**Priority:** P0

---

### JTBD-02.3: Reliable Tasking & Resource Requests

**Job Statement:**
When directing field response and section chiefs during an activation, I want to create, assign, and track tasks and resource requests reliably, so I can ensure every request is acknowledged and fulfilled, not lost in a spreadsheet or a phone call.

**Current Alternatives:**
- Tracks requests and assignments across spreadsheets, phone calls, and radio traffic

**Hiring Criteria:**
- Every task and resource request shows a current, visible status end to end (create → assign → track → close)
- No request can be closed without an explicit status update

**Success Measure:** Percentage of priority tasks completed within the agreed operational period increases measurably.

**Related Features:** F4
**Priority:** P0

---

### JTBD-02.4: Accountable Public Communication

**Job Statement:**
When approving and sending public-facing messages during an incident, I want tracked delivery and acknowledgment on every send, so I can know — not guess — that the public and partner audiences actually received and acknowledged the message.

**Current Alternatives:**
- Sends through multiple disconnected communication channels with no confirmed delivery or acknowledgment

**Hiring Criteria:**
- AI may draft message content but never sends it — a named person must approve every external send
- Delivery and acknowledgment status is visible per recipient within minutes of sending

**Success Measure:** Delivery and acknowledgment status for every public message is visible within minutes of sending, and no AI-drafted content ever reaches the public without a named-person approval step.

**Related Features:** F5, F9, F14
**Priority:** P0

---

## PER-03: Priya Nandan — Jobs

### JTBD-03.1: Resource Request Lifecycle Without Gaps

**Job Statement:**
When tasks generate personnel or equipment needs during an activation, I want to create, approve, assign, and close resource requests with a visible status at every stage, so I can guarantee no request is lost, duplicated, or left unacknowledged.

**Current Alternatives:**
- Tracks requests manually across spreadsheets and verbal confirmations from logistics contacts

**Hiring Criteria:**
- Every request shows its current status (created → approved → assigned → closed) at a glance
- Every request is linked to its originating task or incident

**Success Measure:** Every resource request has a visible, current status with no untracked gaps.

**Related Features:** F4
**Priority:** P0

---

### JTBD-03.2: Fast, Reviewable ICS Documentation

**Job Statement:**
When producing SITREPs and ICS forms daily during an activation, I want AI-assisted drafts generated from incident data that I can review before finalizing, so I can produce accurate documentation quickly without starting from a blank page every time.

**Current Alternatives:**
- Assembles forms and SITREPs manually from notes and memory after the fact

**Hiring Criteria:**
- AI drafts pull directly from reviewed incident data with visible source provenance
- No draft becomes official record without a named-person approval, recorded with reviewer and time

**Success Measure:** Time to produce ICS documentation and a final report decreases measurably versus the manual/spreadsheet baseline.

**Related Features:** F7, F9
**Priority:** P0

---

### JTBD-03.3: Plans Linked to Execution

**Job Statement:**
When maintaining plan and SOP content that should drive incident response, I want to link a plan or SOP section directly to the operational tasks it generates, so I can close the gap between written readiness and actual execution instead of keeping plans and response disconnected.

**Current Alternatives:**
- Keeps plans in standalone documents with no connection to the tasks actually executed during a real incident

**Hiring Criteria:**
- A plan/SOP section can be linked to one or more task templates
- The linkage is visible whenever a task is created that traces back to a plan reference

**Success Measure:** Corrective actions from an after-action report are traceable back to an updated plan or SOP.

**Related Features:** F3, F4
**Priority:** P1

---

### JTBD-03.4: Closed-Loop After-Action Learning

**Job Statement:**
When an incident or exercise closes, I want to produce an after-action report directly from incident data — timeline export, decisions log, resource history, and findings — so I can get lessons back into updated plans, corrective actions, and training instead of the loop never closing.

**Current Alternatives:**
- Assembles the after-action report after the fact from memory, scattered notes, and disconnected logs

**Hiring Criteria:**
- The AAR auto-populates its timeline, decisions, and resource-request history from existing incident data
- Findings and corrective actions form a structured, trackable list rather than free text

**Success Measure:** Corrective-action closure rate increases and recurrence of findings decreases, measured per incident.

**Related Features:** F7
**Priority:** P1

---

## PER-04: Diego Reyes — Jobs

### JTBD-04.1: Offline-Capable Field Reporting

**Job Statement:**
When I'm in the field with unreliable or absent cellular connectivity, I want to submit structured reports, photos, and location data regardless of connection state, so I can keep reporting what's happening without waiting for signal or losing my work.

**Current Alternatives:**
- Relies on radio traffic and phone calls that are easy to miss, garble, or never get logged

**Hiring Criteria:**
- Every field action has a visible, one-tap button equivalent — no hover-only or gesture-only interactions
- Every edit remains possible while fully offline
- Touch targets meet a 44px minimum for use one-handed or while gloved

**Success Measure:** Zero data loss for field submissions made while offline.

**Related Features:** F6
**Priority:** P0

---

### JTBD-04.2: Confirmed Sync on Reconnect

**Job Statement:**
When I reconnect after a period offline, I want confirmation that every queued submission actually reached the EOC, so I can stop wondering whether an update, photo, or location silently disappeared.

**Current Alternatives:**
- Has no confirmation mechanism today beyond assuming a radio or phone report got through

**Hiring Criteria:**
- Queued items visibly display a "Queued" status until they're confirmed synced
- Every sync appends a timeline entry, and any conflict is flagged to a named person rather than silently overwritten

**Success Measure:** Every queued item either syncs successfully or is flagged to a named person — never silently dropped.

**Related Features:** F6
**Priority:** P0

---

### JTBD-04.3: Fast Task Awareness and Status Updates

**Job Statement:**
When I'm working continuously through a shift, I want to check my assigned tasks and update their status with minimal interaction, so I can stay current with command's expectations without multi-step forms slowing down field work.

**Current Alternatives:**
- Receives assignments verbally or by radio with no persistent task list to check against

**Hiring Criteria:**
- Status updates complete in a single action, not a multi-step form
- Task list and update controls are usable one-handed or while wearing gloves

**Success Measure:** Time from field observation to EOC visibility drops from radio/phone delay to near-real-time once connectivity returns.

**Related Features:** F6, F4
**Priority:** P0

---

## PER-05: Dana Whitfield — Jobs

### JTBD-05.1: Integration Health & Record-Authority Clarity

**Job Statement:**
When monitoring platform health across GIS, EOC COTS, CAD, and notification-provider integrations, I want clear visibility into which system is authoritative for which record and whether each integration is healthy, so I can resolve data conflicts quickly instead of treating them as confusing, unexplained mismatches.

**Current Alternatives:**
- Investigates data conflicts ad hoc, with no single health view across integrated systems

**Hiring Criteria:**
- An integration-health view shows system, last sync, direction, record authority, and sync status for every integration
- Any conflict shows both values side by side with an explicit "keep this value" action — never a silent overwrite

**Success Measure:** Every external system has an explicit, visible record-authority declaration with no silent overwrites.

**Related Features:** F10, F13
**Priority:** P0

---

### JTBD-05.2: Governed Access & Auditable Security Posture

**Job Statement:**
When configuring access for new roles and users or responding to a security review, I want to configure SSO, granular role- and incident-scoped permissions, and review a full audit trail, so I can prove that access is governed and every security-relevant action is attributable to a named person.

**Current Alternatives:**
- Manages access changes without a consolidated, exportable audit trail to point to during a review

**Hiring Criteria:**
- RBAC covers every persona and role defined for the platform
- The audit log is append-only, exportable, and covers login, permission change, record access, and AI-draft approval events
- SSO is configurable via SAML2/OIDC against the agency's own identity provider

**Success Measure:** Every security-relevant action is captured in the append-only audit trail with zero gaps.

**Related Features:** F8, F16
**Priority:** P0

---

### JTBD-05.3: Evidence-Based Executive Oversight

**Job Statement:**
When reviewing program performance on a weekly, monthly, or post-incident cadence, I want to see 1–3 headline KPIs and evidence records without wading through operational detail, so I can answer whether the program is more prepared than last quarter using platform evidence alone.

**Current Alternatives:**
- Manually assembles readiness, cost, and risk data from disconnected reports before every budget or oversight review

**Hiring Criteria:**
- An executive dashboard shows 1–3 display-scale KPIs with no other decoration
- Evidence records are exportable and traceable back to their source incidents

**Success Measure:** Executive can answer "are we more prepared than last quarter?" using platform evidence alone, without a manually assembled report.

**Related Features:** F7, F18
**Priority:** P1

---

### JTBD-05.4: Compliance Posture Without Overclaiming

**Job Statement:**
When preparing product copy, documentation, or responding to a compliance inquiry, I want accessibility conformance demonstrated by testing and zero FedRAMP-authorization claims, so I can avoid the legal exposure of overstating the platform's compliance posture.

**Current Alternatives:**
- Has no systematic check today to prevent an overstated compliance claim from slipping into product copy

**Hiring Criteria:**
- Accessibility conformance is backed by test evidence, never asserted as a certification the platform doesn't hold
- No FedRAMP-authorization claim appears anywhere in product UI, documentation, or marketing copy

**Success Measure:** Zero unresolved WCAG 2.2 AA / Section 508 findings per release, and no FedRAMP-authorization claims appear anywhere in product copy.

**Related Features:** F0, F8
**Priority:** P1

---

## Outcome-to-Feature Traceability

| JTBD ID | Feature | Expected Outcome |
|---------|---------|-------------------|
| JTBD-01.1 | F2, F18 | Shared, time-stamped operating picture lets Maria assess readiness across jurisdictions in minutes |
| JTBD-01.2 | F1 | Incident activation and command-role assignment complete in minutes with named-person accountability |
| JTBD-01.3 | F3, F7 | Versioned, approved plans/SOPs are producible on demand as defensible preparedness evidence |
| JTBD-01.4 | F10 | Cross-jurisdiction data sharing is explicit, scoped, and revocable — never all-or-nothing |
| JTBD-02.1 | F1 | Every command-role assignment is timestamped and attributable, closing the post-incident reconstruction gap |
| JTBD-02.2 | F2, F11 | Live shared map replaces radio/verbal reconciliation, shortening time to a verified situation report |
| JTBD-02.3 | F4 | Tasks and resource requests carry end-to-end status, eliminating lost or unacknowledged requests |
| JTBD-02.4 | F5, F9, F14 | Public messages carry tracked delivery/acknowledgment and mandatory named-person approval |
| JTBD-03.1 | F4 | Resource requests show continuous status from creation to closure with no untracked gaps |
| JTBD-03.2 | F7, F9 | AI-assisted drafts with provenance and human approval cut documentation time versus manual drafting |
| JTBD-03.3 | F3, F4 | Plan/SOP sections link directly to the tasks they generate, closing the plan-to-execution gap |
| JTBD-03.4 | F7 | AAR auto-populates from incident data, enabling traceable corrective actions back to updated plans |
| JTBD-04.1 | F6 | Field reporting remains fully functional offline with zero silent data loss |
| JTBD-04.2 | F6 | Reconnect-time sync is confirmed or explicitly flagged, never silently dropped |
| JTBD-04.3 | F6, F4 | Single-action status updates shrink field-to-EOC visibility lag to near-real-time |
| JTBD-05.1 | F10, F13 | Integration-health and record-authority views resolve conflicts without confusion or silent overwrite |
| JTBD-05.2 | F8, F16 | SSO, RBAC, and append-only audit logging make every security-relevant action attributable |
| JTBD-05.3 | F7, F18 | Executive dashboard answers program-readiness questions using platform evidence alone |
| JTBD-05.4 | F0, F8 | Accessibility conformance is tested and demonstrable; no FedRAMP claim ever appears in copy |

---

## NaC Preview

| JTBD ID | Outcome | Candidate NaC |
|---------|---------|----------------|
| JTBD-01.1 | Full-jurisdiction readiness status known in under 5 minutes | Given a logged-in EOC director with N jurisdictions, when the dashboard loads, then readiness/active-incident/resource data for all N jurisdictions renders in under 5 seconds with a visible timestamp and source per data point |
| JTBD-01.2 | Faster, accountable activation | Given a validated event, when the director activates an incident, then command roles are assignable within the same flow and each assignment records actor + timestamp without leaving the screen |
| JTBD-01.3 | On-demand defensible plan evidence | Given a request for current preparedness status, when the director opens the plan repository, then every plan/SOP shows its version history and approval state without external document lookup |
| JTBD-01.4 | Zero unauthorized cross-jurisdiction exposure | Given a federation grant scoped to specific data, when a partner jurisdiction user views the shared picture, then only the explicitly granted data is visible and the grant is independently revocable |
| JTBD-02.1 | Zero-gap command accountability | Given an activated incident, when a command role is assigned or reassigned, then the incident timeline records actor and timestamp for that change with no missing entries on reconstruction |
| JTBD-02.2 | Faster verified situation reports | Given an active incident, when the IC opens the operating-picture map, then incidents, resources, and facilities render with status-coded markers and a visible data-age/source label |
| JTBD-02.3 | No lost tasks or resource requests | Given a created task or resource request, when its status changes, then the current status (create/assign/track/close) is visible in the list view with no state requiring external lookup |
| JTBD-02.4 | Confirmed, approved public messaging | Given an AI-drafted public message, when it is sent, then a named-person approval record exists before dispatch and delivery/acknowledgment status is visible within minutes |
| JTBD-03.1 | No untracked resource-request gaps | Given a resource request linked to a task, when its lifecycle stage changes, then the current stage (created/approved/assigned/closed) is visible with a link back to the originating task/incident |
| JTBD-03.2 | Faster reviewable documentation | Given incident data exists, when Priya requests an AI-assisted SITREP/ICS-form draft, then the draft shows source provenance and cannot become official record without a recorded reviewer approval |
| JTBD-03.3 | Plans traceable to execution | Given a plan/SOP section linked to a task template, when a task is created from that template, then the task shows a visible link back to its originating plan section |
| JTBD-03.4 | Closed-loop after-action learning | Given an incident closes, when the AAR is generated, then timeline, decisions, and resource history auto-populate and each finding has a trackable corrective-action status |
| JTBD-04.1 | Zero offline data loss | Given the field app is offline, when a field user submits a report, photo, or location, then the submission is captured locally and queued without any data loss, confirmed visually with a "Queued" state |
| JTBD-04.2 | Confirmed or flagged sync | Given a reconnect event, when queued submissions sync, then each item resolves to "Synced" or a flagged conflict assigned to a named person — never silently disappearing |
| JTBD-04.3 | Near-real-time field-to-EOC visibility | Given an assigned task, when the field user updates its status, then the update is visible to the EOC in near-real-time upon reconnect, completed via a single action |
| JTBD-05.1 | Clear, conflict-free integration state | Given multiple integrated external systems, when Dana opens the integration-health view, then each system shows last sync, direction, record authority, and sync status, with conflicts offering explicit "keep this value" actions |
| JTBD-05.2 | Fully attributable security actions | Given a security-relevant action occurs (login, permission change, record access, AI-draft approval), when Dana reviews the audit log, then every such action is present, append-only, and attributable to a named person |
| JTBD-05.3 | Evidence-only executive answers | Given the executive dashboard, when Dana reviews headline KPIs, then 1–3 display-scale KPIs render with no other decoration and link to exportable, traceable evidence records |
| JTBD-05.4 | Zero compliance-overclaim exposure | Given any release, when accessibility and compliance copy is reviewed, then zero unresolved WCAG 2.2 AA/Section 508 findings exist and no FedRAMP-authorization claim appears anywhere in product copy |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-11-14*
