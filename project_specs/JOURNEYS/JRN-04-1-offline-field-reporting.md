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
