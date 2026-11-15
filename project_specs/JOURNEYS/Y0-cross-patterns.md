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
