### Flow 3: Full Incident Lifecycle — Activation Through After-Action (JRN-02.1, MVP demonstration scenario)

**Trigger:** James Okafor (PER-02) opens the incident workspace after Maria names him Incident Commander.
**User Story:** US-1.4 (single workspace), US-4.1/US-4.2 (tasks), US-4.3/US-4.4 (resource requests), US-2.1 (map), US-9.2 (AI narrative), US-1.6 (closure)

```
[Accept Command — Incident Workspace: PageHeader + command-roles
 panel already populated from Maria's activation]
    │
    ▼
[Assign Roles & Tasks — Tasks tab, "New task" ──▶ Create Task form,
 owner required]
    │
    ├── 422 TASK_OWNER_REQUIRED if no owner selected
    │
    ▼
[Track Resource Request — Resources tab, creates request (generator
 + sandbags), watches Badge move Draft → Awaiting approval → Approved
 → Fulfilled]
    │
    ▼
[Monitor Operating Picture — MapCanvas status-coded markers +
 status bar "As of HH:MM ET · Base layer: agency GIS"]
    │
    ▼
[Record a Decision — Timeline entry, pre-position second generator,
 actor + timestamp auto-captured]
    │
    ▼
[Review AI-Drafted Narrative — "Draft with AI" on an ICS form field
 ──▶ AIDraft panel + Provenance chips below field, never in-field]
    │
    ├── Approve ──▶ text copied into field, reviewer+time logged
    │   to Timeline
    ├── Edit ──▶ adjusts text before approving
    └── Discard ──▶ removed, audit note only
    │
    ▼
[Close & Hand Off Reporting — Modal confirmation states consequence
 ("closes all open tasks to Overdue unless completed")]
    │
    └── Success ──▶ Incident status = Closed; "Generate AAR" becomes
        available to Priya in Reports tab
```

**Steps:**
1. James opens the Incident Workspace (`/incidents/{id}`); `PageHeader` shows incident name, severity `Badge`, subtitle (jurisdiction + opened date); the pinned command-roles `Card` already shows Maria's activation-time assignments.
2. He assigns Planning/Logistics (Priya) and names field-task owners via the Tasks tab's "New task" action; a task cannot be created without an owner (422 `TASK_OWNER_REQUIRED`).
3. He creates a resource request from the Resources tab; it starts `Draft`, becomes `Awaiting approval` on submit, and its `Badge` status is visible end-to-end without a page reload (event-bus driven).
4. He monitors the live `MapCanvas` as field units report shelter status; the status bar always names data age and base-layer source.
5. He logs a decision directly to the `Timeline` (append-only; actor + timestamp auto-captured, never editable after the fact).
6. He reviews an `AIDraft`-generated incident narrative paragraph with `Provenance` sources per fact; nothing is written to the official record until he clicks Approve, which logs reviewer + timestamp.
7. He closes the incident via a `Modal` stating the explicit consequence, which writes a final `Timeline` entry and unlocks AAR generation (F7) for Priya.

---

### Flow 4: Approving and Tracking a Public Shelter-Opening Message (JRN-02.2)

**Trigger:** James (PIO capacity) needs to send a public message about a now-operational shelter.
**User Story:** US-5.1 (recipient groups/templates), US-5.2 (4-step compose), US-5.3 (delivery tracking), US-9.3 (AI never auto-issues public content)

```
[Select Audience — Compose Notification Step 1: geotargeted area
 drawn on MapCanvas/LayerPanel; live recipient-count estimate]
    │
    ▼
[Draft Message — Step 2: "Draft with AI" ──▶ AIDraft panel pulls
 shelter facts from resource/task record + Provenance]
    │
    ├── Approve ──▶ text inserted into message field, logged
    │
    ▼
[Review — Step 3: fully read-only preview of message, channels,
 approver of record — nothing editable without returning to a
 prior step]
    │
    ▼
[Approve & Send — Step 4: signed-in user must match designated
 approver (403 APPROVER_MISMATCH otherwise)]
    │
    ├── Public/external-reach ──▶ Modal danger restates audience
    │   size + channels before dispatch
    │
    ▼
[Track Delivery — Table of recipients, Status Badge
 (Queued/Sent/Delivered/Failed), acknowledgment Progress bar,
 auto-refreshes as F14 callbacks arrive]
    │
    └── Success ──▶ Delivery/ack status visible within minutes;
        no AI content reached the public without named approval
```

**Steps:**
1. James selects a geotargeted recipient group drawn directly on the operating-picture map (`MapCanvas` + `LayerPanel`); a live recipient-count estimate updates as he draws.
2. He drafts the message, optionally clicking "Draft with AI" which inserts an `AIDraft` panel with `Provenance` chips sourced from the shelter's resource/task record — the message field itself is never auto-populated.
3. The Review step (Step 3) is fully read-only: exact message text, channels, and the named approver of record, with no inline editing permitted.
4. At Approve & Send, the system verifies the signed-in user matches the designated approver for the selected channels; public/external-reach sends trigger a `Modal danger` restating audience size and channels as a final deliberate gate.
5. After sending, James checks the Delivery & Acknowledgment Tracking `Table`, which auto-refreshes as provider callbacks (F14) arrive, with failed deliveries always showing a visible reason.
