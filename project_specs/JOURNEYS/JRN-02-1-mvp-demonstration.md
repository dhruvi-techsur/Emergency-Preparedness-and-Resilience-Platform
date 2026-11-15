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
