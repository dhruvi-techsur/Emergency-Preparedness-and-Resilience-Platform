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
