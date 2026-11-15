## F9: AI-Assisted Drafting & Signal Triage

**Description:** The Phase-1 AI use cases: signal triage/clustering on approved risk feeds, and AI-assisted drafting of structured incident information and ICS forms from reviewed notes. Every output is a draft, never an auto-issued fact or action. This feature is the governance layer that every other feature's `[AIDraft]` touchpoints (F1, F5, F7) depend on.

**Terminology:**
- **AIDraft:** The only UI surface through which AI output reaches a person — always labeled, never auto-issued, shows sources, requires named-person approve/edit/discard.
- **Signal:** A candidate event surfaced from clustering/triage across approved hazard feeds, requiring human validation before it may become an incident.
- **Confidence:** A qualitative label (`High`/`Medium`/`Low`) with a stated reason — never a bare percentage.
- **Model-neutral gateway:** The AI service abstraction that routes requests to a model without hard-coding product logic to a specific vendor model.

### Sub-features
- Signal triage/clustering across approved weather/hazard feeds (F12), surfacing candidates for human validation.
- `[AIDraft]`-assisted drafting of ICS form fields and incident narrative text from reviewed notes.
- Named-person approval required before any AI-drafted content becomes official record.
- Low-confidence/missing-source drafts say so in the draft body.
- Absolute prohibition on auto-issuing AI content as public warning, evacuation instruction, or binding resource decision.

### Screens

**S9.1 — Signal Triage Queue**
- `Table`: Signal summary, Source feed(s), Confidence (text: High/Medium/Low + reason, never a bare percentage), Detected at, Status (New/Dismissed/Promoted). "Review" action per row opens detail; "Promote to incident" (opens F1 S1.2 pre-filled, still requires full human review and submission — never auto-created) and "Dismiss" (requires a one-line reason) actions.

**S9.2 — Signal Detail**
- Shows the clustered source events/feeds that produced this signal, each with `Provenance` (source, time, confidence). No action in this screen writes an operational record directly — "Promote to incident" only pre-fills the incident-creation form (F1 S1.2) for a human to review, edit, and submit.

**S9.3 — AIDraft Panel (embedded wherever "Draft with AI" appears: F1 ICS forms/narrative, F5 message compose, F7 SITREP/AAR narrative)**
- `AIDraft` component: draft text body, `Provenance` chips per source used, "Not issued" badge persists until Approve. Footer actions: "Approve" (inserts text into the target field, logs reviewer + timestamp to the owning record's Timeline/audit trail), "Edit" (opens the draft text in an editable state before approval), "Discard" (removes the draft, no record kept of its content beyond an audit note that a draft was discarded). Low-confidence or missing-source drafts show an inline note in the draft body itself (e.g., "Low confidence: only one source available") rather than being hidden.

### Process
1. Approved weather/hazard feed data (F12) flows into a triage/clustering job (background, via F10) that groups related raw events into candidate "signals."
2. Each signal is scored with a qualitative confidence label and reason, and surfaced in S9.1 for human review — a signal is never auto-promoted to an active incident under any configuration.
3. A reviewer (typically PER-01 or PER-03) opens S9.2, reviews the clustered source data and provenance, and either dismisses the signal (with a reason) or clicks "Promote to incident," which pre-fills the F1 incident-creation form — the reviewer must still complete and submit that form as a distinct, deliberate action.
4. Separately, wherever a "Draft with AI" button appears on a form (ICS forms/F1, message compose/F5, SITREP/AAR narrative/F7), clicking it sends the relevant reviewed notes/context to the model-neutral AI gateway and renders the response in an `AIDraft` panel (S9.3) below the field — never directly into the field.
5. The named person reviewing the draft can Approve (copies text into the field, logs reviewer+timestamp to the owning record), Edit (adjust text before approving), or Discard (removes it). No code path writes AI-drafted text into an official field without passing through this explicit Approve action.
6. If the AI service returns a low-confidence result or cannot find a source for part of its output, the draft body itself states this plainly (e.g., "Low confidence: based on limited data") — the system never silently upgrades a weak draft to look authoritative.
7. At the API boundary, every endpoint capable of writing to an official record (incident fields, ICS forms, notifications, SITREP/AAR content) rejects any payload tagged as AI-originated that lacks a recorded approver ID and timestamp — this is a server-side guard, not merely a UI convention.

### Inputs
- Signal triage: `feed_events` ([{source, timestamp, payload}], from F12 background ingestion).
- AIDraft request: `context` (string — reviewed notes or structured data the draft should be based on), `target_field` (string, identifies where the draft would be inserted if approved), `requesting_user_id` (UUID, required).
- Approval: `draft_id` (UUID, required), `action` (enum: `approve`|`edit`|`discard`, required), `edited_text` (string, required if `action=edit`), `approver_id` (UUID, required).

### Outputs
- Signal triage queue entries with confidence labels and source provenance.
- `AIDraft` panel content (draft text + sources + confidence note), never written to any official record until approved.
- Approval audit entries (reviewer, timestamp, original draft, final approved text if edited) on the owning record's Timeline/audit trail.

### Validation
- A signal may never transition directly to an active incident without a human explicitly completing and submitting the F1 incident-creation form — "Promote to incident" is a pre-fill action only, enforced server-side (the promote endpoint returns a pre-filled draft payload, not a created incident).
- Every `AIDraft` must carry at least one `Provenance` source or explicitly state "No source available" in its body — it may never present as sourced when it is not.
- Confidence must always render as a qualitative label with a stated reason, never a bare numeric percentage.
- The approve action requires a `approver_id` resolving to an active, named (non-service) user account; service/system accounts cannot approve AI drafts.
- No API endpoint that writes to an incident, ICS form, notification, SITREP, or AAR may accept content flagged `ai_origin: true` without a non-null `approved_by`/`approved_at` pair — this is validated at the data layer, independent of which UI client calls it.
- Under no configuration, feature flag, or admin setting may AI-generated content be dispatched as a public warning, evacuation instruction, or binding resource deployment decision without this same human-approval gate — this is a hard, non-overridable constraint.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| AI gateway unavailable | 503 | AI_GATEWAY_UNAVAILABLE | "AI drafting is temporarily unavailable. You can still write this manually." |
| Draft requested with no usable source context | 200 (flagged) | AIDRAFT_NO_SOURCE | "No source available for this draft. Review carefully before using it." |
| Approval attempted by a service/system account | 403 | APPROVAL_REQUIRES_NAMED_USER | "AI drafts must be approved by a signed-in person." |
| Write attempted with unapproved AI-origin content (API guard) | 400 | AIDRAFT_UNAPPROVED_WRITE_BLOCKED | "This content hasn't been approved and can't be saved to the official record." |
| Signal promotion attempted to bypass incident-creation form | 400 | PROMOTE_REQUIRES_HUMAN_SUBMIT | "Promoting a signal only pre-fills the incident form. Complete and submit it to create the incident." |

### API Surface (this feature)
See `Y1c-api-comms-reporting.md` §AI Assistance for `GET /api/v1/signals`, `POST /api/v1/signals/{id}/promote` (returns pre-fill payload only), `POST /api/v1/signals/{id}/dismiss`, `POST /api/v1/ai-drafts`, `POST /api/v1/ai-drafts/{id}/approve`, `POST /api/v1/ai-drafts/{id}/discard`.

### Schema Surface (this feature)
Owns tables `signals`, `signal_source_events`, `ai_drafts` — see `Y0c-schema-comms-reporting.md` §AI Assistance. `ai_drafts.approved_by`/`approved_at` are referenced by F1 (`ics_forms`), F5 (`notifications`), and F7 (`sitreps`/`aars`) as the enforcement join for the "no unapproved AI content" constraint.
