### Flow 5: Resource Request Lifecycle & Daily SITREP (JRN-03.1)

**Trigger:** Priya Nandan (PER-03) is tasked with fulfilling a resource request and producing the evening SITREP.
**User Story:** US-4.3 (submit/track request), US-4.4 (approve/decline/fulfill), US-7.1 (generate SITREP)

```
[Receive Request — Resources tab, request auto-linked to
 originating task/incident]
    │
    ▼
[Approve — Resource Request Detail, "Approve" action]
    │
    ├── "Decline" ──▶ Modal requires non-empty reason
    │   (422 DECLINE_REASON_REQUIRED otherwise)
    │
    ▼
[Assign — optional assignment step: who/what fulfills the request]
    │
    ▼
[Track & Close — status list shows open vs. assigned at a glance;
 "Mark fulfilled" moves status to Fulfilled]
    │
    ▼
[Draft SITREP — SITREP Generator auto-pulls current Timeline, task
 status, resource-request status into structured draft]
    │
    ├── "Draft with AI" on narrative sections ──▶ AIDraft +
    │   Provenance, human-approved
    │
    ▼
[Finalize — Preview pane shows assembled document; "Approve and
 finalize" requires named-person reviewer + timestamp]
    │
    └── Success ──▶ SITREP is official record, ready before evening
        briefing
```

**Steps:**
1. Priya opens the Resources tab in the Incident Workspace; the new request from James is already linked to the shelter task — no manual cross-referencing needed.
2. She reviews request details on the Resource Request Detail screen and clicks "Approve" (a recorded, timestamped transition) or "Decline" (`Modal` requiring a non-empty reason).
3. Approving prompts an optional assignment step naming who/what fulfills the request; the Resource Request List shows exactly which requests remain open vs. already assigned.
4. Once delivered, she marks the request `Fulfilled` — an explicit close action is always required; no request can silently remain "open."
5. She opens the SITREP Generator (`/incidents/{id}/sitreps/new`), which auto-assembles current `Timeline`, task-status, and resource-request data into a structured draft; narrative sections offer `AIDraft`-assisted drafting with `Provenance` per fact.
6. She reviews the assembled document in the preview pane and clicks "Approve and finalize," which requires her recorded identity and timestamp before the SITREP counts as official record — SITREPs remain available throughout the incident's lifecycle, not gated on closure.

---

### Flow 6: Closing the Loop — After-Action Report Into Updated Plans (JRN-03.2)

**Trigger:** The storm incident has closed; Priya must produce the AAR and link findings back to plans.
**User Story:** US-7.2 (generate AAR), US-3.2 (link plan sections to tasks)

```
[Generate AAR — only available once incident status = Closed
 (409 INCIDENT_NOT_CLOSED otherwise)]
    │
    ▼
[Step 1-3: Timeline export, Decisions log, Resource-request history
 — auto-populated, read-only/annotatable]
    │
    ▼
[Step 4: Findings & corrective actions — each entry requires
 non-null owner + due date before finalization
 (422 CORRECTIVE_ACTION_UNOWNED otherwise)]
    │
    ▼
[Link to Plan — "Link tasks" action on the relevant plan section;
 corrective action references the logistics SOP section]
    │
    ▼
[Step 5: Review & finalize]
    │
    ├── Finalizing writes an immutable, exportable record +
    │   evidence-log entry
    │
    └── Success ──▶ Corrective actions traceable back to an updated
        plan/SOP section
```

**Steps:**
1. Priya triggers "Generate AAR" from the Incident Workspace Reports tab — only enabled once the incident is `Closed`.
2. Steps 1–3 of the AAR wizard (Timeline export, Decisions log, Resource-request history) auto-populate from existing incident data as read-only/annotatable content — nothing is manually re-entered.
3. In Step 4 (Findings & corrective actions), she converts a finding ("second generator arrived too late") into a structured corrective action with a named owner and due date; finalization is blocked (422) until every corrective action has both.
4. She links the corrective action to the specific logistics SOP section it should update, using the Plan & Playbook repository's "Link tasks" linkage pattern (F3 S3.5), without leaving the AAR workflow's conceptual thread.
5. Step 5 finalizes the AAR as an immutable, exportable record and triggers an evidence-log entry — corrections thereafter require a new version or dated addendum, never a direct edit.
