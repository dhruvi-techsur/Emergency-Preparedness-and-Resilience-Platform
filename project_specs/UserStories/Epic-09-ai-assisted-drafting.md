## Epic 9: AI-Assisted Drafting & Signal Triage (F9)

Signal triage/clustering on approved hazard feeds, and AI-assisted drafting of ICS form fields and incident narrative, always human-approved.

### US-9.1: Review and validate candidate signals before they become incidents
**As a** Maria Alvarez / EOC Director, **I want to** review AI-surfaced candidate signals from hazard feeds with their source provenance and confidence, **so that** I can validate real threats quickly without ever having an incident auto-created without my review.

**Acceptance Criteria:**
- [ ] Signal Triage Queue shows signal summary, source feed(s), confidence as a qualitative label with a stated reason (never a bare percentage), detected-at time, and status (New/Dismissed/Promoted)
- [ ] Signal Detail shows the clustered source events with `Provenance` (source, time, confidence) for each
- [ ] "Promote to incident" only pre-fills the F1 incident-creation form — it never creates an incident directly (400 PROMOTE_REQUIRES_HUMAN_SUBMIT if an API caller attempts to bypass this)
- [ ] "Dismiss" requires a one-line reason
- [ ] Under no configuration is a signal auto-promoted to an active incident

**Priority:** P1 | **Feature Ref:** F9

---

### US-9.2: Draft ICS form and narrative text with AI, always reviewed before approval
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** use "Draft with AI" to generate ICS form text and narrative content that I review, edit, and approve before it becomes official, **so that** I save drafting time without ever letting unreviewed AI content into the official record.

**Acceptance Criteria:**
- [ ] `AIDraft` panel shows draft text, `Provenance` chips per source, and a "Not issued" badge that persists until Approve
- [ ] Approve copies text into the target field and logs reviewer + timestamp to the owning record's Timeline/audit trail; Edit allows adjusting text before approving; Discard removes it
- [ ] Low-confidence or missing-source drafts state this plainly in the draft body itself (e.g., "Low confidence: only one source available") rather than being hidden or silently upgraded
- [ ] Every `AIDraft` carries at least one `Provenance` source or explicitly states "No source available"
- [ ] No API endpoint that writes to an incident, ICS form, notification, SITREP, or AAR accepts AI-origin content without a non-null approver and timestamp (400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED otherwise)

**Priority:** P1 | **Feature Ref:** F9

---

### US-9.3: Trust that AI can never auto-issue a public warning or binding decision
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** have an absolute, non-overridable guarantee that no AI-generated content can be automatically dispatched as a public warning, evacuation instruction, or binding resource decision, **so that** the platform's AI governance model is trustworthy under any configuration or admin setting.

**Acceptance Criteria:**
- [ ] This prohibition is enforced at both the UI and API layers, with no feature flag or admin setting able to override it
- [ ] The approve action requires an `approver_id` resolving to an active, named (non-service) user account; service/system accounts cannot approve AI drafts (403 APPROVAL_REQUIRES_NAMED_USER otherwise)
- [ ] An AI gateway outage shows "AI drafting is temporarily unavailable. You can still write this manually." rather than blocking the workflow
- [ ] This constraint is verifiable in a security review of F5 (notifications) and F14 (public-alerting) send paths

**Priority:** P1 | **Feature Ref:** F9
