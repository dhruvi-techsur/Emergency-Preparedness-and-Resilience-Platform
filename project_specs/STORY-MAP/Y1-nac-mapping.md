## NaC-to-Acceptance Criteria Mapping

Spot-verification that each derived NaC is directly backed by acceptance criteria already written in UserStories-EPMP.md — confirming NaC were derived from, not invented independently of, the existing stories. A representative sample spanning all five personas and all three releases is shown; every NaC in the full Derivation Table above traces to AC text in its cited story.

| NaC | Story | AC from UserStories-EPMP.md | Aligned? |
|-----|-------|-------------------|----------|
| JTBD-01.1: Dashboard renders readiness/incident data for all jurisdictions on landing, routed by resolved role | US-18.1 | "On sign-in, F18 resolves role (and facet, for PER-05) and routes to the correct default landing view with the correct SideNav/bottom-bar configuration" | Yes |
| JTBD-02.1: Every role assignment writes a Timeline entry; activation cannot exceed Monitoring without an assigned IC | US-1.2 | "Every assignment writes a Timeline entry with actor and timestamp" / "At least one Incident Commander must be assigned before activation level can move above Monitoring (422 NO_COMMANDER_ASSIGNED otherwise)" | Yes |
| JTBD-02.3: A task cannot be created without an owner; list shows current status/owner/due at a glance | US-4.1 | "A task cannot be created without an owner (422 TASK_OWNER_REQUIRED)" / "task list shows Task, Status (Badge), Owner (Avatar), Due, Incident, and Linked plan section" | Yes |
| JTBD-03.1: Resource-request status changes publish to the event bus so COP/reporting reflect current state without manual refresh | US-4.3 | "Resource-request status changes publish to the event bus so the operating picture (F2) and reporting (F7) reflect current state without manual refresh" | Yes |
| JTBD-04.1: Submission always succeeds locally regardless of connectivity — sends immediately online or queues offline, zero data loss | US-6.2 | "Submission always succeeds locally regardless of connectivity — it sends immediately online or queues offline" | Yes |
| JTBD-04.2: Every item resolves to synced, conflict, or failed — never silently dropped | US-6.3 | "No submission is ever silently dropped — every item resolves to synced, conflict (pending resolution), or failed (flagged, with reason and retry option)" | Yes |
| JTBD-03.4: Timeline/decisions/resource history auto-populate; each finding requires a non-null owner and due date | US-7.2 | "Steps 1–3 (timeline export, decisions log, resource-request history) are auto-populated and read-only/annotatable" / "Step 4 ... requires each entry to have a non-null owner and due date before finalization (422 CORRECTIVE_ACTION_UNOWNED otherwise)" | Yes |
| JTBD-05.2: Every login, permission change, record access, and AI-draft approval appears in an append-only, exportable log | US-8.3 | "Every login, permission change, record access to a sensitive type, and AI-draft approval writes an entry with actor, timestamp, action, and affected record" | Yes |
| JTBD-05.1: Integration Health table shows system, last sync, direction, record authority, sync status | US-8.4 | "Integration Health table shows System, Last sync, Direction, Record authority, and SyncStatus for each connected external system" | Yes |
| JTBD-05.3: A KPI tile never shows a numeric target unless explicitly configured with definition/baseline/owner/cadence | US-7.4 | "A KPI tile never shows a numeric target unless that target has been explicitly configured with definition/baseline/owner/cadence — otherwise it shows only the current measured value" | Yes |
| JTBD-01.2: Confidence is a qualitative label with a stated reason; no signal is ever auto-promoted to an incident | US-9.1 | "confidence as a qualitative label with a stated reason (never a bare percentage)" / "Under no configuration is a signal auto-promoted to an active incident" | Yes |
| JTBD-02.4: The send endpoint rejects any request lacking approved_by/approved_at, unconditionally, with no override | US-14.1 | "The send endpoint rejects any request lacking approved_by/approved_at, unconditionally, with no override (400 SEND_REQUIRES_APPROVAL)" | Yes |
| JTBD-05.1: A detected conflict shows both values side by side with explicit keep-value actions — never auto-resolved | US-13.2 | "A detected conflict shows both values side by side with 'Keep EPMP value' / 'Keep [external] value' actions — never auto-resolved by any heuristic" | Yes |
| JTBD-02.2: Dispatch events display read-only with Provenance; no PATCH/PUT/DELETE route exists | US-15.1 | "No PATCH/PUT/DELETE route exists for this resource at the API level — the contract is read-only by design" | Yes |
| JTBD-01.3: Browse/import/link always executes under the user's own delegated permissions | US-17.2 | "Browse/import/link operations always execute under the requesting user's own delegated permissions, never a shared service account with broader access" | Yes |

No misalignments were found in this sample. All sampled NaC statements are verbatim or close paraphrases of acceptance criteria already present in UserStories-EPMP.md, confirming the Story Map derives rather than invents testable criteria.

---

*Document generated by Pivota Spec Framework*
*Last updated: 2026-11-14*
