# User Journeys
## EPMP (Emergency Preparedness & Management Platform)

| Field | Value |
|-------|-------|
| **Product Name** | EPMP (Emergency Preparedness & Management Platform) |
| **Date** | 2026-11-14 |
| **Related Personas** | PERSONAS-EPMP.md |
| **Related JTBD** | JTBD-EPMP.md |
| **Related PRD** | PRD-EPMP.md |

---

## Journey Index

| ID | Persona | Scenario | Key JTBD | Stages |
|----|---------|----------|----------|--------|
| JRN-01.1 | PER-01 | Start-of-shift readiness and activity check across jurisdictions | JTBD-01.1 | 5 |
| JRN-01.2 | PER-01 | Deciding to activate ahead of an approaching storm and handing off to an Incident Commander | JTBD-01.2, JTBD-01.4 | 6 |
| JRN-02.1 | PER-02 | Full incident lifecycle: activate, command, task, resource, decide, report (MVP demonstration scenario) | JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-02.4 | 7 |
| JRN-02.2 | PER-02 | Approving and tracking a public-facing message during an active incident | JTBD-02.4 | 5 |
| JRN-03.1 | PER-03 | Running the resource-request lifecycle and producing a daily SITREP | JTBD-03.1, JTBD-03.2 | 6 |
| JRN-03.2 | PER-03 | Closing the loop: generating the after-action report and feeding corrective actions back into plans | JTBD-03.3, JTBD-03.4 | 5 |
| JRN-04.1 | PER-04 | Submitting field observations and task updates with no connectivity, then confirming sync on reconnect | JTBD-04.1, JTBD-04.2, JTBD-04.3 | 6 |
| JRN-05.1 | PER-05 | Resolving a flagged EOC-COTS integration conflict and reviewing the audit trail (admin facet) | JTBD-05.1, JTBD-05.2 | 5 |
| JRN-05.2 | PER-05 | Quarterly executive review of readiness KPIs and evidence records (executive facet) | JTBD-05.3, JTBD-05.4 | 5 |

---
## PER-01: Maria Alvarez

### JRN-01.1: Start-of-Shift Readiness & Activity Check

**Persona:** PER-01 (Maria Alvarez)
**Scenario:** Maria arrives at the EOC at the start of her shift and needs to know, across every jurisdiction she's responsible for, what's active, what's at risk, and whether any plans or approvals are overdue — before she briefs leadership or decides where to focus her limited attention for the day.
**Related Jobs:** JTBD-01.1, JTBD-01.3

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Arrive | Logs into the EOC director dashboard from her desk workstation | Login / SSO, role-specific dashboard (F0, F18) | "Let's see what happened overnight before the 8am call." | Alert, mildly anxious | Yesterday she had to call three county liaisons to get this picture | Dashboard loads pre-filtered to her jurisdictions with last-login delta highlighted |
| Orient | Scans the readiness portfolio and active-incidents panel across all jurisdictions | EOC director dashboard (F2, F18) | "Is everything time-stamped? I need to know how current this is." | Focused, slightly skeptical | Historically has no way to confirm data freshness or source | Visible "as of HH:MM · source" label on every tile (per NFR) |
| Prioritize | Filters by jurisdiction and severity to spot anything Elevated or Critical | Common operating picture map/dashboard (F2) | "Which county needs me first?" | Determined | Without status-coded markers, severity triage took phone calls | Status-coded severity badges let her triage visually in seconds |
| Verify Plans | Checks whether any plan/SOP approvals are overdue before her leadership briefing | Plan & Playbook repository (F3) | "Did that mutual-aid annex ever get approved?" | Mildly frustrated at first, then reassured | Previously had to dig through shared drives with no version history | Approval-state badge (draft/review/approved) visible directly on the dashboard widget |
| Brief | Exports a one-page readiness/activity summary to bring to the leadership call | Reporting export (F7, F18) | "I need this in front of me in one sitting, no last-minute assembly." | Confident, relieved | Previously built this summary by hand every morning | One-click readiness summary export with timestamp and source per line |

#### Key Moments
- **Decision Point:** Prioritize stage — Maria decides which jurisdiction gets her attention first; a wrong read here cascades into a late activation decision later in the day.
- **Risk of Abandonment:** Orient stage — if the dashboard doesn't clearly show data freshness, Maria reverts to calling liaisons directly, abandoning the tool for her actual decision-making.
- **Delight Opportunity:** Brief stage — a one-click, already-current readiness summary replaces what used to be 20+ minutes of manual assembly before every leadership call.

#### Success Outcome
Maria states her full jurisdiction's current readiness status — current plans, open gaps, active incidents — in under 5 minutes, satisfying JTBD-01.1's success measure, and produces a leadership-ready summary without reconstructing anything from external documents (JTBD-01.3).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | F0, F18 |
| Orient | F2, F18 |
| Prioritize | F2 |
| Verify Plans | F3 |
| Brief | F7, F18 |

---
### JRN-01.2: Storm Activation Decision & Command Handoff

**Persona:** PER-01 (Maria Alvarez)
**Scenario:** A tropical storm is projected to make landfall in 36 hours. Maria has been monitoring the hazard overlay all morning and now must decide whether to activate her county's EOC, stand up a command structure, designate an Incident Commander, and share a scoped operating picture with a neighboring jurisdiction that may need to request mutual aid.
**Related Jobs:** JTBD-01.2, JTBD-01.4

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Monitor | Watches the storm track overlay against her jurisdiction boundary | Common operating picture, weather/hazard layer (F2, F12) | "Is this close enough to act now, or do I wait one more update cycle?" | Watchful, tense | Hazard feed confidence isn't always obvious at a glance | Unverified/low-confidence feeds visibly flagged until validated |
| Decide | Chooses to activate rather than continue monitoring | Incident intake / activation flow (F1) | "If I wait for certainty, I lose the lead time I need." | Resolved, a little anxious about the call | Historically activation meant working a phone tree with no persistent record | Guided activation flow with a confirmation modal stating operational consequence |
| Activate | Confirms the activation modal and classifies the incident (type, severity, jurisdiction) | Incident workspace, activation modal (F1) | "This needs to be unambiguous and on the record." | Deliberate, focused | No single moment today captures "we are now activated" with a timestamp | Single confirmation action creates the incident and starts the append-only timeline |
| Assign Command | Designates James as Incident Commander and names initial command-staff roles | Incident workspace, command-role assignment (F1) | "Everyone needs to know who's in charge right now, not after a callback." | Confident | Verbal role assignment meant no persistent record of who held what | Named-person assignment auto-captures actor + timestamp, no extra step |
| Notify | Sends an activation notification to her own teams and informs the peer jurisdiction liaison | Notifications compose flow (F5) | "I need to know this actually reached people, not just that I hit send." | Slightly uneasy until confirmed | No tracked delivery/acknowledgment on today's channels | Delivery/acknowledgment view confirms receipt per recipient |
| Share Scoped Picture | Grants the neighboring jurisdiction a scoped, revocable view into her operating picture for mutual-aid coordination | Federation / cross-jurisdiction sharing (F10) | "They need enough to help, not everything I have." | Cautious, protective of data boundaries | Today it's all-or-nothing sharing by phone/email | Explicit, scoped, independently revocable federation grant with an audit trail |

#### Key Moments
- **Decision Point:** Decide stage — Maria must commit to activation under uncertainty; the confirmation modal is the point of no return and must clearly state the operational consequence.
- **Risk of Abandonment:** Activate stage — if the activation flow requires leaving the screen or re-entering data already known from Monitor, Maria may revert to her old phone-tree habit under time pressure.
- **Delight Opportunity:** Assign Command stage — a single guided flow that moves from "activate" to "named command structure" in one sitting replaces what used to take a chain of phone calls.

#### Success Outcome
Median time from validated event to active command structure decreases measurably (JTBD-01.2), and the neighboring jurisdiction sees only the explicitly granted data slice with zero unauthorized exposure (JTBD-01.4).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Monitor | F2, F12 |
| Decide | F1 |
| Activate | F1 |
| Assign Command | F1 |
| Notify | F5 |
| Share Scoped Picture | F10 |

---
## PER-02: James Okafor

### JRN-02.1: Full Incident Lifecycle — Activation Through After-Action (MVP Demonstration Scenario)

**Persona:** PER-02 (James Okafor)
**Scenario:** Maria has just activated the storm incident and named James as Incident Commander. James now runs the incident end to end: he accepts command, assigns ICS roles and tasks, tracks an initial resource request, monitors the live operating picture, records a key decision, and — once the storm passes and the incident closes — ensures a situation report and after-action report exist as evidence. This is the cross-persona scenario that demonstrates the full MVP operational foundation in one continuous thread (handing off documentation work to Priya at the appropriate points).
**Related Jobs:** JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-02.4

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Accept Command | Opens the incident workspace, reviews the activation record, accepts the Incident Commander role | Incident workspace, PageHeader + command-roles panel (F1) | "I need to know exactly what Maria already decided before I start issuing orders." | Focused, slightly adrenalized | Previously had to reconstruct what was decided verbally before he could act | Activation record and command roles are already visible the moment he opens the workspace |
| Assign Roles & Tasks | Assigns Planning/Logistics (Priya) and names initial field task owners (Diego's unit) | Incident workspace, Tasks tab, role assignment (F1, F4) | "Every assignment needs a name attached, not 'someone handle this.'" | Decisive | Manual tasking meant assignments got lost across spreadsheets and radio calls | Task create/assign is one recorded action with owner + due period captured automatically |
| Track Resource Request | Creates an initial resource request (generator + sandbags for a shelter site) and watches its status move through the lifecycle | Incident workspace, Resources tab (F4) | "Did logistics actually see this, or is it sitting in a queue somewhere?" | Attentive, a little impatient | No visible end-to-end status today — requests disappear into phone calls | Request shows current status (created → approved → assigned → closed) at a glance, linked to the incident |
| Monitor Operating Picture | Watches the live map as field units report shelter status and storm positions update | Common operating picture map (F2, F11) | "Is this still accurate, or am I looking at stale data?" | Calm when data is current, uneasy when it isn't | Previously reconciled radio traffic and verbal reports by hand | Status-coded markers plus a visible data-age/source label on every panel |
| Record a Decision | Logs the decision to pre-position a second generator at a shelter before the overnight peak, with his rationale | Incident timeline, decision entry (F1) | "If someone reviews this in six months, they need to see why I made this call." | Deliberate, accountable | No single timeline today captures decisions with who made them and when | Append-only timeline auto-captures actor + timestamp on every decision entry |
| Review AI-Drafted Narrative | Reviews an AI-drafted incident narrative paragraph pulled from the timeline, edits it, and approves it | Incident workspace, AIDraft + Provenance component (F9) | "This reads close, but I want to confirm the resource count before I sign off." | Cautiously trusting | Drafting narrative from scratch during an active incident eats time he doesn't have | AIDraft shows source provenance per fact, and nothing becomes official until he approves it by name |
| Close & Hand Off Reporting | Marks the incident phase complete and tasks Priya to finalize the SITREP/AAR from the now-complete incident record | Incident workspace → Reporting handoff (F1, F7) | "Everything that happened needs to already be in the record — I shouldn't have to re-tell it." | Relieved | Historically, reporting started from memory and scattered notes after the fact | Timeline, decisions, and resource history are already structured and ready for Priya's report generation |

#### Key Moments
- **Decision Point:** Record a Decision stage — this is the single moment most likely to be scrutinized after the incident closes; if the timeline doesn't make rationale and attribution effortless to capture, James will revert to an after-the-fact verbal account.
- **Risk of Abandonment:** Track Resource Request stage — if status isn't visible at a glance, James falls back to calling Priya directly, breaking the single-source-of-truth model the whole journey depends on.
- **Delight Opportunity:** Review AI-Drafted Narrative stage — a defensible narrative draft appears already built from his own timeline entries, turning a dreaded end-of-shift task into a quick review-and-approve action.

#### Success Outcome
Every command-role assignment, status change, and decision is captured in the incident timeline with actor and timestamp — zero gaps on reconstruction (JTBD-02.1); the live map shortens time to a verified situation report (JTBD-02.2); the resource request shows continuous status with no untracked gaps (JTBD-02.3 / JTBD-03.1); and the handoff to Priya sets up JTBD-03.4's closed-loop AAR.

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Accept Command | F1 |
| Assign Roles & Tasks | F1, F4 |
| Track Resource Request | F4 |
| Monitor Operating Picture | F2, F11 |
| Record a Decision | F1 |
| Review AI-Drafted Narrative | F9 |
| Close & Hand Off Reporting | F1, F7 |

---
### JRN-02.2: Approving and Tracking a Public Shelter-Opening Message

**Persona:** PER-02 (James Okafor, wearing the Public Information Officer hat)
**Scenario:** With the shelter now operational, James needs to get an accurate public message out — shelter location, hours, and an evacuation-route reminder — through the agency's approved channels, and he needs to know with certainty that it was delivered and acknowledged, not just sent into the void.
**Related Jobs:** JTBD-02.4

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Select Audience | Chooses the geotargeted recipient group around the shelter's service area | Notifications compose flow, audience step (F5) | "I only want this reaching the people actually affected, not the whole county." | Methodical | Past tools made audience selection an afterthought, leading to over- or under-reach | Geotargeted audience selection drawn directly on the operating-picture map |
| Draft Message | Reviews an AI-drafted message pulled from the shelter's resource/task record, then edits the tone | Notifications compose flow, message step with AIDraft (F5, F9) | "The facts are right, but I want this to sound calmer for a public audience." | Engaged, a bit rushed | Drafting from scratch under time pressure risks errors in a message the public will see | AIDraft pulls shelter details directly from the record so facts can't drift from the source |
| Review | Reviews the read-only preview: exact message, channels, and approver of record | Notifications compose flow, review step (F5) | "Before this goes out, I need to see exactly what people will receive." | Careful, slightly tense | No prior read-only review step meant last-minute typos sometimes shipped | Mandatory read-only preview step before send, by design-system contract |
| Approve & Send | Signs his name to the approval and sends the message through the connected provider | Notifications compose flow, approve/send step (F5, F14) | "This is now attached to me — it has to be right." | Resolute | No named-person accountability on today's ad hoc channels | Named-person approval is a hard gate; AI can draft but never sends |
| Track Delivery | Checks the delivery/acknowledgment table a few minutes after sending | Notifications delivery/acknowledgment view (F5, F14) | "Did it actually land, and is anyone acknowledging it?" | Relieved once confirmed, anxious until then | Historically had no way to know if a public message landed at all | Per-recipient delivery status and acknowledgment progress visible within minutes |

#### Key Moments
- **Decision Point:** Approve & Send stage — James's named approval is the irreversible gate; the design must make this feel deliberate, never accidental.
- **Risk of Abandonment:** Review stage — if the preview doesn't clearly separate draft-in-progress from what's about to be sent, James may lose confidence and route around the tool via phone/email as before.
- **Delight Opportunity:** Track Delivery stage — real-time acknowledgment progress replaces what used to be total uncertainty about whether a public message landed at all.

#### Success Outcome
Delivery and acknowledgment status for the message is visible within minutes of sending, and no AI-drafted content reaches the public without James's named-person approval — satisfying JTBD-02.4's success measure in full.

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Select Audience | F5 |
| Draft Message | F5, F9 |
| Review | F5 |
| Approve & Send | F5, F14 |
| Track Delivery | F5, F14 |

---
## PER-03: Priya Nandan

### JRN-03.1: Resource Request Lifecycle & Daily SITREP

**Persona:** PER-03 (Priya Nandan)
**Scenario:** It's mid-afternoon during the storm activation. James has tasked Priya with fulfilling the generator/sandbag request from the shelter site, and command expects a SITREP before the evening briefing. Priya needs to move the resource request through its full lifecycle and turn the day's incident data into a reviewable situation report without starting from a blank page.
**Related Jobs:** JTBD-03.1, JTBD-03.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Receive Request | Opens the Resources tab and sees James's new request linked to the shelter task | Incident workspace, Resources tab (F4) | "Good — I can see exactly which task this ties back to." | Oriented | In the past, requests arrived as a phone call disconnected from any task context | Request auto-links to its originating task/incident, no manual cross-referencing |
| Approve | Reviews the request details and approves it for fulfillment | Resource request detail, approve action (F4) | "Is this quantity and site correct before I commit logistics time to it?" | Careful | Approving used to mean a verbal "yes, go ahead" with no record | Approval is a recorded, timestamped status transition, not a conversation |
| Assign | Assigns the request to the available logistics contact and crew | Resource request detail, assign action (F4) | "Who's actually free to run this right now?" | Practical, slightly rushed | No visibility into current status meant duplicate assignments happened | Status list shows exactly which requests are still open vs. already assigned |
| Track & Close | Monitors status as the crew delivers, then marks the request closed | Resource request list view (F4) | "I need to close this out before it looks like it's still open at the briefing." | Satisfied | Previously, closed requests sometimes lingered as "open" because no one updated a spreadsheet | Explicit close action required — no request can silently fall off the list |
| Draft SITREP | Requests an AI-assisted SITREP draft pulled from the day's timeline, tasks, and resource history | Reporting, AI-assisted SITREP draft (F7, F9) | "This needs to be accurate — I'm not rubber-stamping something I haven't checked." | Appreciative but vigilant | Building a SITREP from notes and memory ate an hour every afternoon | Draft shows source provenance per fact, pulled directly from reviewed incident data |
| Finalize | Reviews, edits, and approves the SITREP as official record before the evening briefing | Reporting, review/approve action (F7, F9) | "Once I approve this, it's the record — it has to be right." | Confident, on time for once | No prior review gate meant inconsistent, unreviewed content sometimes went out | Named-person approval is required and recorded with reviewer and timestamp before anything becomes official |

#### Key Moments
- **Decision Point:** Approve stage — Priya's approval commits logistics resources; getting this wrong cascades into a failed delivery later in the shift.
- **Risk of Abandonment:** Draft SITREP stage — if the AI draft's source provenance isn't visible and trustworthy, Priya reverts to writing the SITREP from scratch, erasing the time-saving benefit entirely.
- **Delight Opportunity:** Finalize stage — finishing the SITREP well before the evening briefing, instead of racing the clock, is a tangible daily win.

#### Success Outcome
Every resource request shows a visible, current status from creation to closure with no untracked gaps (JTBD-03.1), and the time to produce ICS documentation and a final report decreases measurably versus the manual baseline (JTBD-03.2).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Receive Request | F4 |
| Approve | F4 |
| Assign | F4 |
| Track & Close | F4 |
| Draft SITREP | F7, F9 |
| Finalize | F7, F9 |

---
### JRN-03.2: Closing the Loop — After-Action Report Into Updated Plans

**Persona:** PER-03 (Priya Nandan)
**Scenario:** The storm incident has closed. Priya now needs to produce the after-action report, make sure its findings become trackable corrective actions, and link at least one corrective action back to an actual plan/SOP update — closing the loop between what happened and what the agency's written readiness says it will do next time.
**Related Jobs:** JTBD-03.3, JTBD-03.4

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Generate AAR | Triggers AAR generation for the closed incident | Reporting, AAR generation (F7) | "I don't want to rebuild this timeline from memory again." | Hopeful, a little tired from the activation | Historically assembled AARs from scattered notes days after the incident, losing detail | Timeline, decisions, and resource-request history auto-populate from existing incident data |
| Review Findings | Reads through the auto-populated timeline and decisions log, adds findings as structured entries | AAR editor, findings list (F7) | "Is this finding actually new, or did we already know this from the last storm?" | Analytical | Findings used to live as free text buried in a PDF nobody revisited | Findings form a structured, trackable list rather than free text |
| Assign Corrective Actions | Converts a finding ("second generator arrived too late") into a corrective action with an owner | AAR editor, corrective-action tracker (F7) | "This needs an owner and a deadline, or it just becomes another forgotten PDF." | Determined | No mechanism previously existed to track whether a finding ever got acted on | Corrective actions carry an owner and a trackable status, not just a line in a report |
| Link to Plan | Links the corrective action to the specific logistics SOP section it should update (pre-positioning threshold) | Plan & Playbook repository, task-template linkage (F3, F4) | "If this isn't wired back into the actual plan, we'll make the same mistake next storm." | Purposeful | Plans and after-action learning lived in completely disconnected systems before | Plan/SOP sections link directly to the task templates and corrective actions that reference them |
| Publish & Export | Finalizes the AAR as an evidence record and exports it for the leadership review | Reporting, evidence/audit export (F7) | "This needs to be ready to hand to an auditor or Maria without extra assembly." | Accomplished | Previously the AAR and the plan update were two separate, unsynced deliverables | One exportable evidence record ties timeline, findings, and plan linkage together |

#### Key Moments
- **Decision Point:** Assign Corrective Actions stage — deciding which findings become trackable corrective actions (versus noted-but-not-acted-on) determines whether the loop actually closes.
- **Risk of Abandonment:** Link to Plan stage — if linking a corrective action to a plan section requires leaving the AAR workflow entirely, Priya may skip the linkage under time pressure and the loop quietly stays open.
- **Delight Opportunity:** Generate AAR stage — opening an AAR that's already 80% populated from real incident data, instead of a blank document, turns a dreaded task into a review exercise.

#### Success Outcome
Corrective actions from the AAR are traceable back to an updated plan or SOP (JTBD-03.3), and corrective-action closure rate increases while recurrence of findings decreases, measured per incident (JTBD-03.4).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Generate AAR | F7 |
| Review Findings | F7 |
| Assign Corrective Actions | F7 |
| Link to Plan | F3, F4 |
| Publish & Export | F7 |

---
## PER-04: Diego Reyes

### JRN-04.1: Offline Field Reporting and Reconnect Sync Confirmation

**Persona:** PER-04 (Diego Reyes)
**Scenario:** Diego's crew is checking structural damage and shelter conditions in an area where cellular connectivity has dropped entirely. He needs to keep checking tasks, submitting geolocated reports with photos, and updating status throughout the shift — with zero loss — and then confirm, once signal returns, that everything he submitted actually reached the EOC.
**Related Jobs:** JTBD-04.1, JTBD-04.2, JTBD-04.3

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Check Tasks | Opens the mobile app to see his assigned tasks while already offline | Mobile field app, task list (F6) | "I need to see what command expects of me even with zero bars." | Mildly tense about connectivity, focused on the job | Past tools assumed connectivity and simply failed to load | Task list is cached locally and available instantly, connectivity or not |
| Submit Report | Captures a photo of storm damage, tags the location, and submits a structured report — one-handed, gloved | Mobile field app, structured report form (F6) | "This has to work in one tap — I don't have a free hand for a multi-step form." | Determined, slightly rushed | Multi-step forms and hover/gesture interactions are unusable in the field | Large 44px touch targets, one-tap photo/location capture, single-column layout |
| Update Status | Marks a task as complete with a single action | Mobile field app, task status control (F6) | "Done — now what's next, I don't want to scroll through a form to say that." | Capable | Status updates via radio were easy to miss or misreport | Single-action status update, no multi-step form required |
| Stay Queued | Notices every submission shows a "Queued" badge instead of a spinner or error | Mobile field app, SyncStatus indicator (F6) | "Is this actually saved, or did I just lose that photo?" | Anxious until reassured | No confirmation mechanism today beyond hoping the radio call got through | SyncStatus pinned at the top of every screen shows "Queued" the moment of local capture — nothing is silently lost |
| Reconnect | Regains signal and watches queued items transition from "Queued" to "Synced" | Mobile field app, SyncStatus + Timeline (F6) | "Did everything actually make it, or is something still stuck?" | Relieved as each item confirms | Previously had zero visibility into whether a report ever reached command | Every sync appends a visible timeline entry confirming receipt |
| Resolve Conflict | Reviews a flagged conflict where the EOC's record of a task differs from his own update | Mobile field app, conflict-resolution screen (F6) | "I don't want my update silently overwritten, but I also don't want to guess which version is right." | Cautious, wants clarity | Silent overwrites would mean his on-the-ground account could just vanish | Conflicts always surface to a named person for resolution, never auto-resolved |

#### Key Moments
- **Decision Point:** Resolve Conflict stage — Diego must decide which version of a record is accurate; getting this wrong could misinform command about actual field conditions.
- **Risk of Abandonment:** Stay Queued stage — if Diego can't trust the "Queued" indicator, he'll revert to calling it in over radio just to be sure, defeating the offline-first design entirely.
- **Delight Opportunity:** Reconnect stage — watching every queued item flip to "Synced" with a timeline entry gives Diego concrete proof his work mattered, replacing hours of uncertainty.

#### Success Outcome
Zero data loss for field submissions made while offline (JTBD-04.1); every queued item syncs or is flagged to a named person, never silently dropped (JTBD-04.2); and time from field observation to EOC visibility drops to near-real-time once connectivity returns via single-action updates (JTBD-04.3).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Check Tasks | F6 |
| Submit Report | F6 |
| Update Status | F6, F4 |
| Stay Queued | F6 |
| Reconnect | F6 |
| Resolve Conflict | F6 |

---
## PER-05: Dana Whitfield

### JRN-05.1: Resolving an EOC-COTS Integration Conflict (Admin Facet)

**Persona:** PER-05 (Dana Whitfield, IT/SecOps administrator facet)
**Scenario:** During the storm activation, EPMP and the agency's incumbent WebEOC instance both record a status update for the same shelter facility, and the values disagree. Dana needs to see this as a clear, explainable conflict rather than a confusing data mismatch, resolve it without a silent overwrite, and confirm the relevant actions are captured in the audit trail for a later security review.
**Related Jobs:** JTBD-05.1, JTBD-05.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Notice Alert | Sees an integration-health alert flag a record conflict between EPMP and WebEOC | Admin console, integration-health view (F13) | "Is this a real conflict or just a timing lag between two systems?" | Alert, slightly wary | Previously, conflicts surfaced as confusing mismatches with no explanation of cause | Integration-health table shows system, last sync, direction, and record authority at a glance |
| Investigate | Opens the conflicting record and sees both values side by side with their respective sources | Integration-health detail, conflict view (F13) | "Which system is actually supposed to own this record type?" | Methodical | No prior tooling showed both values together — Dana had to query each system separately | Side-by-side values with an explicit record-authority declaration per system |
| Resolve | Chooses "Keep EPMP value" based on the declared record authority for facility status | Conflict view, keep-value action (F13) | "This decision needs to be deliberate and on the record, not a guess." | Confident | Silent overwrites in the past meant no one could say which value "won" or why | Explicit "keep this value" action — never a silent overwrite |
| Verify Audit Entry | Checks the audit log to confirm the conflict and resolution were captured with Dana's identity and timestamp | Admin console, audit log (F8) | "If a security reviewer asks about this next month, I need this to already be there." | Reassured | Historically had to manually document conflict resolutions outside the system | Append-only audit log automatically captures the resolution with actor and timestamp |
| Review RBAC Scope | While in the admin console, reviews which roles currently have access to the shelter facility's incident data | Admin console, RBAC/role management (F8) | "Is anyone who shouldn't still have access to this incident?" | Vigilant | RBAC reviews used to be a manual, ad hoc spreadsheet exercise | Granular, incident-scoped permissions are visible and editable in one console view |

#### Key Moments
- **Decision Point:** Resolve stage — Dana's choice of which value to keep becomes the record of truth; this must never be reversible by accident.
- **Risk of Abandonment:** Investigate stage — if record authority isn't explicit and visible, Dana has to escalate to a vendor support call, breaking the self-service resolution model.
- **Delight Opportunity:** Verify Audit Entry stage — confirming the resolution is already fully documented, with zero extra effort, turns a compliance chore into a non-event.

#### Success Outcome
Every external system has an explicit, visible record-authority declaration with no silent overwrites (JTBD-05.1), and every security-relevant action — including this conflict resolution — is captured in the append-only audit trail with zero gaps (JTBD-05.2).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Notice Alert | F13 |
| Investigate | F13 |
| Resolve | F13, F10 |
| Verify Audit Entry | F8 |
| Review RBAC Scope | F8 |

---
### JRN-05.2: Quarterly Executive Review of Readiness and Evidence (Executive Facet)

**Persona:** PER-05 (Dana Whitfield, agency executive/funder facet)
**Scenario:** Ahead of a quarterly budget and oversight review, Dana needs to answer one question for leadership: are we more prepared than last quarter? Dana wants this answered using the platform's own evidence — a handful of headline KPIs and traceable records — without asking staff to manually assemble another report.
**Related Jobs:** JTBD-05.3, JTBD-05.4

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Open Dashboard | Logs in and lands directly on the executive briefing view | Executive dashboard (F18) | "I don't want to wade through operational detail — just tell me where we stand." | Calm, time-constrained | Past reviews meant staff manually assembled readiness/cost/risk data from disconnected reports | Executive view surfaces only 1–3 display-scale KPIs with no other decoration |
| Review KPIs | Scans readiness posture, incident-outcome, and corrective-action closure KPIs | Executive dashboard, KPI tiles (F18, F7) | "Is corrective-action closure actually improving, or just looking busy?" | Analytical | Historically no consistent KPI definition existed across quarters | KPIs link directly to exportable, traceable evidence records, not a static number |
| Drill Into Evidence | Clicks through a KPI to its underlying evidence — a specific incident's AAR and closed corrective actions | Reporting, evidence/audit export (F7) | "I want to see the actual record behind this number before I repeat it to the board." | Satisfied once verified | Previously had to request this evidence be manually compiled by staff | Evidence records are exportable and traceable back to their source incidents on demand |
| Check Compliance Posture | Confirms the accessibility/compliance summary shows zero unresolved findings and no FedRAMP claims anywhere in copy | Compliance/accessibility summary (F0, F8) | "I need to be sure nothing here creates legal exposure before this goes in front of funders." | Reassured, protective of the agency's standing | Unclear or overstated compliance language in the past created audit risk | Conformance is demonstrated by test evidence, never asserted as a certification not held |
| Prepare Briefing | Exports the KPI summary and evidence links into a briefing packet for leadership | Executive dashboard, export action (F18, F7) | "This needs to stand on its own without me adding caveats afterward." | Confident | Previously spent days manually assembling this packet before every review | One export produces a leadership-ready packet with evidence links intact |

#### Key Moments
- **Decision Point:** Review KPIs stage — Dana decides whether the program narrative is "more prepared" or "needs intervention" based on these three numbers; the KPIs must be trustworthy enough to state to funders without hedging.
- **Risk of Abandonment:** Drill Into Evidence stage — if a KPI doesn't link to real, traceable evidence, Dana loses confidence in the dashboard and reverts to requesting a manually assembled report, undermining the entire executive-view value proposition.
- **Delight Opportunity:** Prepare Briefing stage — walking into the board meeting with a platform-generated packet, rather than a hand-built slide deck, is a visible, credibility-building win for Dana personally.

#### Success Outcome
Dana answers "are we more prepared than last quarter?" using platform evidence alone, without a manually assembled report (JTBD-05.3), and confirms zero unresolved WCAG 2.2 AA / Section 508 findings with no FedRAMP-authorization claims anywhere in copy (JTBD-05.4).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open Dashboard | F18 |
| Review KPIs | F18, F7 |
| Drill Into Evidence | F7 |
| Check Compliance Posture | F0, F8 |
| Prepare Briefing | F18, F7 |

---
## Cross-Journey Patterns

- **Common Pain Points:**
  - **"Is this actually current?" anxiety** appears across PER-01 (JRN-01.1 Orient), PER-02 (JRN-02.1 Monitor Operating Picture), and PER-05 (JRN-05.1 Notice Alert) — every desk-based persona independently distrusts data staleness until the product makes data age and source explicit everywhere, not just on the map.
  - **Silent loss of manual coordination artifacts** (lost tasks, unacknowledged requests, unconfirmed messages, unconfirmed field reports) recurs across PER-02 (tasking), PER-03 (resource requests), PER-04 (offline sync), and PER-02 (public messaging) — the platform's core value proposition is converting "did this actually land?" from a guess into a visible status at every one of these touchpoints.
  - **Reconstruction-after-the-fact burden** shows up for PER-01 (plan/SOP currency), PER-02 (incident accountability), PER-03 (SITREP/AAR drafting), and PER-05 (audit/KPI assembly) — nearly every persona has historically had to manually rebuild a record that should have existed automatically from the moment the underlying action occurred.
  - **Distrust of AI output until provenance is visible** appears identically for PER-02 (AI-drafted narrative and public message), PER-03 (AI-assisted SITREP), and implicitly for PER-05 (compliance review of AI governance) — every persona who touches `AIDraft` content pauses to verify the source before trusting it, regardless of role.

- **Shared Opportunities:**
  - A single, consistently-applied "as of HH:MM · source" pattern on every dashboard, map, and list panel (per F0/F2 NFRs) resolves the data-currency anxiety once across PER-01, PER-02, and PER-05 rather than requiring a bespoke fix per persona.
  - A universal status-lifecycle visualization (created → approved → assigned → closed, or queued → synced → conflict) reused across F4 (tasks/resources), F5 (notifications), and F6 (field sync) turns "did this make it?" into one learned interaction pattern instead of four different ones.
  - `AIDraft` + `Provenance`, applied consistently across F7 (SITREP/AAR), F9 (narrative/message drafting), builds one trust pattern once that every AI-touching persona can rely on, rather than re-earning trust per feature.
  - The append-only Timeline (F1) and append-only audit log (F8) together eliminate the reconstruction burden for PER-01, PER-02, PER-03, and PER-05 simultaneously — it is the single structural fix underlying four personas' independently-reported pain points.

- **Convergence Points:**
  - **Activation handoff** (JRN-01.2 → JRN-02.1): Maria's activation and command designation is the exact moment James's journey begins; the incident record must carry forward without requiring James to re-enter anything Maria already captured.
  - **Resource request lifecycle** (JRN-02.1 Track Resource Request → JRN-03.1 Receive Request): the same resource request is a single shared record traversed by both PER-02 (requester) and PER-03 (fulfiller) — status must be identically visible and consistent for both.
  - **Field-to-command reporting** (JRN-04.1 Reconnect → JRN-02.1 Monitor Operating Picture / JRN-03.1 Draft SITREP): Diego's synced field reports are the raw material both James's operating picture and Priya's SITREP draft consume — sync latency and data quality here directly determine the fidelity of two other personas' journeys.
  - **Incident closure into evidence** (JRN-02.1 Close & Hand Off Reporting → JRN-03.2 Generate AAR → JRN-05.2 Drill Into Evidence): the same incident record flows from Incident Commander closure, through Planning's AAR, to the executive's KPI drill-down — a single structural thread spanning three personas and justifying the append-only, auto-populating design of F7.

---
## Journey-to-JTBD Traceability

| Journey Stage | JTBD ID | Expected Outcome |
|--------------|---------|-------------------|
| JRN-01.1:Orient | JTBD-01.1 | Shared, time-stamped operating picture lets Maria assess readiness across jurisdictions in minutes |
| JRN-01.1:Verify Plans | JTBD-01.3 | Versioned, approved plans/SOPs are producible on demand as defensible preparedness evidence |
| JRN-01.1:Brief | JTBD-01.1, JTBD-01.3 | One-sitting readiness summary with zero reconstruction from external documents |
| JRN-01.2:Decide | JTBD-01.2 | Activation and initial role assignment complete in a single guided flow |
| JRN-01.2:Assign Command | JTBD-01.2 | Named-person accountability captured automatically for every role assigned |
| JRN-01.2:Share Scoped Picture | JTBD-01.4 | Federation grants are explicit, scoped, revocable, and auditable — zero unauthorized exposure |
| JRN-02.1:Accept Command | JTBD-02.1 | Command structure stood up with named-person accountability immediately upon activation |
| JRN-02.1:Assign Roles & Tasks | JTBD-02.1, JTBD-02.3 | Role and task assignment each captured as a single recorded action with actor and timestamp |
| JRN-02.1:Track Resource Request | JTBD-02.3 | Resource requests show current, visible status end to end with nothing lost |
| JRN-02.1:Monitor Operating Picture | JTBD-02.2 | Live shared map replaces radio/verbal reconciliation, shortening time to a verified situation report |
| JRN-02.1:Record a Decision | JTBD-02.1 | Every decision captured in the incident timeline with actor and timestamp — zero reconstruction gaps |
| JRN-02.1:Review AI-Drafted Narrative | JTBD-03.2 | AI-drafted narrative carries provenance and requires named-person approval before becoming official |
| JRN-02.2:Approve & Send | JTBD-02.4 | Named-person approval required before any AI-drafted content reaches the public |
| JRN-02.2:Track Delivery | JTBD-02.4 | Delivery and acknowledgment status visible within minutes of sending |
| JRN-03.1:Receive Request | JTBD-03.1 | Resource request auto-linked to its originating task/incident — no untracked gaps |
| JRN-03.1:Track & Close | JTBD-03.1 | Every resource request shows visible, current status from creation to closure |
| JRN-03.1:Draft SITREP | JTBD-03.2 | AI-assisted drafts pull from reviewed incident data with visible source provenance |
| JRN-03.1:Finalize | JTBD-03.2 | No draft becomes official record without a named-person approval, recorded with reviewer and time |
| JRN-03.2:Generate AAR | JTBD-03.4 | AAR auto-populates timeline, decisions, and resource history from existing incident data |
| JRN-03.2:Assign Corrective Actions | JTBD-03.4 | Findings and corrective actions form a structured, trackable list rather than free text |
| JRN-03.2:Link to Plan | JTBD-03.3 | Plan/SOP section linkage is visible whenever a task traces back to it; corrective actions traceable to updated plans |
| JRN-04.1:Submit Report | JTBD-04.1 | Field reporting remains fully functional offline with zero silent data loss |
| JRN-04.1:Stay Queued | JTBD-04.1 | Submission captured locally and queued without data loss, confirmed visually with a "Queued" state |
| JRN-04.1:Reconnect | JTBD-04.2 | Each queued item resolves to "Synced" or a flagged conflict assigned to a named person — never silently disappearing |
| JRN-04.1:Update Status | JTBD-04.3 | Single-action status updates shrink field-to-EOC visibility lag to near-real-time |
| JRN-04.1:Resolve Conflict | JTBD-04.2 | Conflicts always surfaced to a named person rather than silently overwritten |
| JRN-05.1:Investigate | JTBD-05.1 | Integration-health view shows system, last sync, direction, record authority, and sync status |
| JRN-05.1:Resolve | JTBD-05.1 | Conflicts offer explicit "keep this value" actions — never a silent overwrite |
| JRN-05.1:Verify Audit Entry | JTBD-05.2 | Every security-relevant action captured in the append-only audit trail with zero gaps |
| JRN-05.2:Review KPIs | JTBD-05.3 | Executive dashboard shows 1–3 display-scale KPIs with no other decoration |
| JRN-05.2:Drill Into Evidence | JTBD-05.3 | Evidence records are exportable and traceable back to their source incidents |
| JRN-05.2:Check Compliance Posture | JTBD-05.4 | Accessibility conformance demonstrated by test evidence; zero FedRAMP-authorization claims in copy |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-11-14*
