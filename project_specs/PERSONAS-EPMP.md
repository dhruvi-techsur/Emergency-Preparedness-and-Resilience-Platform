# Personas
## EPMP (Emergency Preparedness & Management Platform)

| Field | Value |
|-------|-------|
| **Product Name** | EPMP (Emergency Preparedness & Management Platform) |
| **Date** | 2026-11-14 |
| **Related PRD** | PRD-EPMP.md |

---

## Consolidation Note

PRD-EPMP.md Section 3 names nine distinct roles, each with its own "Primary MVP view," because role-specific dashboards (F18) are an explicit MVP feature. This document consolidates those nine roles into **five persona profiles**, grouped by shared workflow pattern, device context, and — where the roles genuinely mirror real Incident Command System (ICS) structure — shared organizational position:

- **PER-01** merges *State EOC director/emergency manager* and *County/city EMA coordinator*: the same readiness-and-activation job at different jurisdictional scale, using the same dashboards and tools.
- **PER-02** merges *Incident commander/public safety leader* and *Public affairs/communications*: in real ICS structure, the Public Information Officer is a Command Staff role reporting directly to the Incident Commander — both set and protect the official narrative of an active incident.
- **PER-03** merges *Planning/situation analyst* and *Logistics/resource coordinator*: both are ICS General Staff "section chief" functions that support command with data and resources rather than directing the response or executing it in the field.
- **PER-04**, *Field responder*, stays standalone — its mobile, offline, touch-target-driven UI needs (F6) are too distinct from every desk-based role to merge without losing them.
- **PER-05** merges *IT/SecOps administrator* and *Agency executive/funder*: both are non-operational "institutional assurance" roles who never touch the incident workspace directly — one certifies the platform is secure and available, the other certifies the program is funded and defensible — and both consume the same audit/evidence/KPI surfaces rather than producing operational records.

Five personas, not four, because the Field Responder's offline/mobile context and the Command/General-Staff split are load-bearing distinctions for the design system's page patterns (field-mobile vs. incident-workspace vs. dashboard) — collapsing further would make the Feature-Persona Matrix below unable to discriminate between genuinely different screens.

---

## Persona Summary

| ID | Name | Role | Primary Goal |
|----|------|------|-------------|
| PER-01 | Maria Alvarez | EOC Director / Emergency Manager | Maintain a defensible, shared readiness and activation picture across jurisdictions |
| PER-02 | James Okafor | Incident Commander / Public Information Officer | Command the response and control the official public narrative with equal accountability |
| PER-03 | Priya Nandan | Planning & Logistics Section Chief | Keep the operation documented and resourced without losing a request or a fact |
| PER-04 | Diego Reyes | Field Responder | Report what's happening on the ground and get tasked, even with no signal |
| PER-05 | Dana Whitfield | IT/SecOps Administrator & Agency Executive Sponsor | Prove the platform is secure, available, and worth the investment |

---

## PER-01: Maria Alvarez

**Role & Context:**
Maria represents the readiness-and-activation leadership chain: a state EOC director overseeing multi-jurisdiction preparedness, and the county/city EMA coordinator who runs the same playbook at local scale. Whether she is reviewing a statewide readiness portfolio or deciding whether to activate her county's EOC for an approaching storm, her day splits between monitoring conditions across her jurisdiction, keeping plans and SOPs current, and deciding when to move from "watching" to "activated." She works primarily from a desk in an EOC or office, often on a wall display during activations, and reports to elected or appointed leadership while coordinating informally with peer jurisdictions.

**Goals:**
- See one trustworthy, shared picture of readiness, active incidents, and resource status across every jurisdiction she's responsible for, instead of piecing it together from calls and spreadsheets (F2, F18)
- Activate an incident and assign command roles in minutes, not through a phone tree (F1)
- Keep plans, SOPs, and approvals current and versioned so her agency can substantiate its own preparedness on demand (F3)
- Trust that notifications to her teams were actually delivered and acknowledged (F5)

**Pain Points:**
- Plans and readiness records are scattered across disconnected documents and drives with no versioning discipline, making it hard to prove preparedness to auditors or elected officials
- No shared, time-stamped operating picture means she's often making activation calls on stale or incomplete information
- Cross-jurisdiction awareness is all-or-nothing today: partner agencies see too little or too much, because there's no controlled way to share a picture across organizational boundaries

**Technical Expertise:** Intermediate — comfortable with dashboards, maps, and web forms; delegates deep system configuration to IT/SecOps staff

**Top Tasks:**
1. Review the active-operations dashboard and readiness portfolio at the start of every shift (daily, critical)
2. Activate an incident and assign initial command roles when conditions warrant (as-needed, critical)
3. Approve or review plan/SOP updates moving through the approval workflow (weekly, high)
4. Send or authorize activation notifications to teams and partner jurisdictions (as-needed, high)
5. Pull a readiness or activity summary for leadership or a peer jurisdiction (weekly, medium)

**Success Criteria:**
- Can state current readiness status (current plans, open gaps, active incidents) for her full jurisdiction in under 5 minutes
- Median time from validated event to active command structure decreases measurably incident over incident
- Zero instances of a partner jurisdiction seeing data it isn't authorized to see

---

## PER-02: James Okafor

**Role & Context:**
James represents both the Incident Commander — the public safety leader who sets objectives and commands the response to an activated incident — and the Public Information Officer function, the Command Staff role responsible for drafting and approving the incident's official public communications. During an activation he works from the incident workspace almost continuously: assigning ICS roles, tracking tasks and resource requests, watching the operating picture, and — wearing the PIO hat — approving the messages that go out to the public, partner agencies, and media. He answers directly to the EOC director/emergency manager during an activation and directs the planning/logistics section chief and field responders.

**Goals:**
- Stand up a command structure with named-person accountability the moment an incident is validated (F1)
- See incidents, resources, and facility positions on one live, shared map rather than reconciling radio traffic and verbal reports (F2)
- Create, assign, and track tasks and resource requests without losing one in a spreadsheet or a phone call (F4)
- Draft and send approved public messages with confidence that delivery and acknowledgment are tracked, never guessed at (F5, F14)

**Pain Points:**
- Manual tasking means requests and assignments get tracked across spreadsheets, phone calls, and radio traffic, so something is inevitably lost, duplicated, or never acknowledged
- Multiple disconnected communication channels create delay and uncertainty about whether a public notification actually reached and was acknowledged by its audience
- No single timeline exists today capturing every status change and decision with who made it and when — accountability has to be reconstructed after the fact

**Technical Expertise:** Intermediate to advanced — operates confidently under time pressure in a purpose-built incident application; limited patience for extra clicks or unclear states during an active incident

**Top Tasks:**
1. Monitor the incident workspace (timeline, tasks, resources, map) continuously during an activation (continuous during activation, critical)
2. Assign and reassign ICS command roles and tasks as the incident evolves (as-needed, critical)
3. Approve and send public-facing messages drafted from templates or AI assistance (as-needed, critical)
4. Review and approve AI-drafted ICS forms and incident narrative before they become official record (as-needed, high)
5. Create and track resource requests against the incident (several times per shift, high)

**Success Criteria:**
- Every command-role assignment, status change, and decision is captured in the incident timeline with actor and timestamp — zero gaps when reconstructing an incident after the fact
- No AI-drafted content ever reaches the public without a named-person approval step
- Delivery and acknowledgment status for every public message is visible within minutes of sending

---

## PER-03: Priya Nandan

**Role & Context:**
Priya represents the ICS General Staff functions that keep an incident documented and resourced: the planning/situation analyst who maintains plans, consolidates field data, and produces reports, and the logistics/resource coordinator who validates, requests, assigns, and tracks personnel and equipment. She works from a desk in the EOC alongside the Incident Commander, spending her day moving between the plan repository, the incident workspace's Tasks/Resources tabs, and report-generation tools. She reports results and findings to the Incident Commander and ultimately to the EOC director, and she's the one who has to answer "what actually happened" once an incident closes.

**Goals:**
- Link a plan or SOP section directly to the operational tasks it should generate during an incident, instead of keeping plans and execution disconnected (F3, F4)
- Create, approve, assign, and close resource requests for personnel and equipment without losing track of status (F4)
- Produce ICS-standard forms, SITREPs, and after-action reports from incident data without starting from a blank page every time (F7, F9)
- Build an exportable evidence and audit trail that demonstrates preparedness and accountability after every incident or exercise (F7)

**Pain Points:**
- Plans, SOPs, and approvals live in disconnected documents with no linkage to the response tasks that actually execute them
- Reports are assembled after the fact, so lessons from an incident rarely make it back into updated plans, corrective actions, or training — the loop never closes
- Resource requests tracked manually make it easy for a request to be lost, duplicated, or left unacknowledged

**Technical Expertise:** Intermediate — spends significant time in structured forms, tables, and document tools; expects AI drafting assistance to speed up form and report writing but insists on reviewing before anything is finalized

**Top Tasks:**
1. Create, approve, assign, and track resource requests against active tasks and incidents (daily during activation, critical)
2. Review and finalize AI-assisted ICS forms and SITREP drafts before they become official record (daily during activation, critical)
3. Maintain and version plan/SOP content, linking sections to the tasks they generate (weekly, high)
4. Generate the after-action report (timeline export, decisions log, resource history, findings) after an incident closes (per incident/exercise, high)
5. Import or sync EOPs/SOPs/annexes from existing document systems into the plan repository (as-needed, medium)

**Success Criteria:**
- Time to produce ICS documentation and a final report decreases measurably versus the manual/spreadsheet baseline
- Every resource request has a visible, current status (created → approved → assigned → closed) with no untracked gaps
- Corrective actions from an AAR are traceable back to an updated plan or SOP

---

## PER-04: Diego Reyes

**Role & Context:**
Diego is a field responder — a firefighter, EMS captain, or public-works crew lead — who receives tasks from the Incident Commander and submits geolocated observations and status updates from the field. He operates a phone or rugged tablet in conditions where cellular connectivity is unreliable or absent: inside damaged structures, in rural areas, or during a prolonged activation that outlasts local infrastructure. He reports to the Incident Commander (PER-02) and depends on the Planning & Logistics Section (PER-03) to confirm resources are actually on the way.

**Goals:**
- Receive task assignments and submit structured field reports, photos, and location data without needing reliable connectivity (F6)
- Keep working — capturing observations, updating status — even when fully offline, with confidence nothing is lost (F6)
- Know that a submission queued while offline actually made it to the EOC once reconnected, instead of wondering if it disappeared (F6)

**Pain Points:**
- Field-to-EOC reporting today depends on radio traffic and phone calls that are easy to miss, garble, or fail to log
- No confirmation that a submitted update, photo, or location was actually received by command
- Existing tools assume connectivity that frequently isn't there in the field

**Technical Expertise:** Novice to intermediate — needs large, obvious touch targets and single-action workflows; no patience for multi-step forms or hover/gesture-only interactions while wearing gloves or working one-handed

**Top Tasks:**
1. Check assigned tasks and update their status (continuously during a shift, critical)
2. Submit structured field reports with photo and location capture (multiple times per shift, critical)
3. Confirm queued offline submissions synced successfully once reconnected (every reconnect, high)
4. Review and resolve a flagged sync conflict when the EOC version of a record differs from the field version (occasional, high)

**Success Criteria:**
- Zero data loss for field submissions made while offline — every queued item either syncs or is flagged to a named person, never silently dropped
- Every field action has a visible, one-tap button equivalent — no interaction requires a hover or gesture
- Time from field observation to EOC visibility drops from radio/phone delay to near-real-time once connectivity returns

---

## PER-05: Dana Whitfield

**Role & Context:**
Dana represents two roles that never touch the incident workspace directly but are jointly accountable for whether the platform can be trusted at all: the IT/SecOps administrator who configures access, integrates external systems, and monitors platform health, and the agency executive/funder who oversees the program's readiness, cost, risk, and mission impact without getting involved in day-to-day operations. As administrator, Dana spends time in the admin console managing SSO, roles, and integration health. As executive sponsor, Dana reviews a small set of headline KPIs and evidence records on a cadence — weekly, monthly, or after every incident — to decide whether the program is working and worth continued funding.

**Goals:**
- Configure SSO, granular role- and incident-scoped permissions, and review a full audit trail of security-relevant actions (F8)
- Monitor integration health (GIS, EOC COTS, notification providers, CAD) and know explicitly which system is authoritative for which record (F10, F13)
- See 1–3 headline KPIs — readiness posture, incident outcomes, corrective-action closure — without wading through operational detail (F18, F7)
- Prove the platform meets WCAG 2.2 AA / Section 508 and never overstates its compliance posture (e.g., FedRAMP) in a way that creates legal exposure (F0, F8)

**Pain Points:**
- No way today to see, in one place, which system owns which record across GIS, EOC COTS, CAD, and HR/IAM — integration failures surface as confusing data conflicts instead of a clear health view
- Readiness, cost, and risk data live in disconnected reports that have to be manually assembled before every budget or oversight review
- AI-assisted features create new governance risk if drafts aren't provably reviewed and approved by a named person before becoming official

**Technical Expertise:** Bimodal by sub-role — the administrator facet is an expert (API/IAM/integration configuration); the executive facet is a novice-to-intermediate dashboard consumer with no interest in system internals

**Top Tasks:**
1. Monitor platform availability, integration health, and audit logs (daily, critical — admin facet)
2. Configure and review RBAC roles, permissions, and SSO settings (weekly/as-needed, critical — admin facet)
3. Review the executive dashboard's headline KPIs and evidence records (weekly/monthly, high — executive facet)
4. Review corrective-action closure rates and AAR findings across recent incidents (per incident, high — executive facet)
5. Resolve a flagged integration conflict (e.g., EOC COTS vs. EPMP record mismatch) by choosing which value is authoritative (as-needed, medium — admin facet)

**Success Criteria:**
- Zero unresolved WCAG 2.2 AA / Section 508 findings per release, and no FedRAMP-authorization claims appear anywhere in product copy
- Every external system has an explicit, visible record-authority declaration with no silent overwrites
- Executive can answer "are we more prepared than last quarter?" using platform evidence alone, without a manually assembled report

---

## Persona Relationships

| Persona | Interacts With | Nature of Interaction |
|---------|---------------|----------------------|
| PER-01 (EOC Director) | PER-02 (Incident Commander) | Activates the incident, designates the Incident Commander, and receives status rollups during the activation |
| PER-01 (EOC Director) | PER-05 (Admin/Executive) | Depends on the administrator for platform availability and access control; the executive sponsor reviews the director's readiness portfolio as program evidence |
| PER-02 (Incident Commander) | PER-03 (Planning & Logistics) | Tasks the section chief to produce SITREPs/ICS forms and to fulfill resource requests generated by command decisions |
| PER-02 (Incident Commander) | PER-04 (Field Responder) | Assigns tasks to field units and receives their geolocated status reports and observations |
| PER-02 (Incident Commander) | PER-05 (Admin/Executive) | Sends public communications through infrastructure the administrator configures; incident outcomes feed the executive's post-incident review |
| PER-03 (Planning & Logistics) | PER-04 (Field Responder) | Confirms resource availability/delivery against field requests and consolidates field reports into SITREPs and the AAR |
| PER-03 (Planning & Logistics) | PER-05 (Admin/Executive) | Produces the evidence/audit trail the executive reviews; depends on the administrator for role-scoped access to plans and resource data |

---

## Feature-Persona Matrix

| Feature | PER-01 | PER-02 | PER-03 | PER-04 | PER-05 |
|---------|--------|--------|--------|--------|--------|
| F0: Web & Mobile Application Shell | Primary | Primary | Primary | Primary | Primary |
| F1: Incident / ICS | Primary | Primary | Primary | Secondary | Secondary |
| F2: Common Operating Picture | Primary | Primary | Primary | Secondary | Secondary |
| F3: Plans & Playbooks | Primary | Secondary | Primary | — | Secondary |
| F4: Tasks & Resource Requests | Secondary | Primary | Primary | Primary | — |
| F5: Notifications Integration | Secondary | Primary | Secondary | Secondary | Secondary |
| F6: Mobile Field Operations | — | Secondary | Secondary | Primary | — |
| F7: Reporting & Learning | Secondary | Secondary | Primary | — | Primary |
| F8: Security & Administration | Secondary | Secondary | Secondary | Secondary | Primary |
| F9: AI-Assisted Drafting & Signal Triage | Secondary | Secondary | Primary | — | Secondary |
| F10: Platform API, Integration Gateway & Event Bus | — | — | — | — | Primary |
| F11: GIS & Geospatial Integration | Secondary | Primary | Secondary | Secondary | Secondary |
| F12: Weather & Hazard Feed Ingestion | Secondary | Secondary | Secondary | — | — |
| F13: EOC COTS Interoperability | Secondary | — | — | — | Primary |
| F14: Notification Provider & Public-Alerting Integration | — | Primary | — | — | Secondary |
| F15: CAD / 911 Integration | — | Secondary | — | — | Secondary |
| F16: HR / IAM & Identity Integration | — | — | Secondary | — | Primary |
| F17: Asset, Facility & Document System Integration | Secondary | — | Secondary | — | Secondary |
| F18: Persona & Role-Specific Dashboards | Primary | Primary | Primary | Primary | Primary |

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-11-14*
