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
