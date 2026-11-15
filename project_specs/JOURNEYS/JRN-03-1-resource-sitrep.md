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
