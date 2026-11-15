## Epic 5: Notifications Integration (F5)

Recipient groups, message templates, geotargeting, and a 4-step compose flow with delivery/acknowledgment tracking.

### US-5.1: Manage reusable recipient groups and message templates
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** define reusable recipient groups (by role, jurisdiction, or geography) and message templates, **so that** I don't recreate the same audience and wording every time I need to communicate.

**Acceptance Criteria:**
- [ ] Recipient-group editor supports type `Role`, `Jurisdiction`, or `Geography`, each with a type-specific selector (role `Combobox`, jurisdiction `Combobox`, or geography drawn on `MapCanvas`)
- [ ] Recipient-group list shows Group name, Type, Member count, Last used
- [ ] Message-template editor supports placeholder tokens (e.g., `{{incident_name}}`) with a character count
- [ ] Template list shows Template name, Category, Last updated

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.2: Compose a notification through a required audience → message → review → send flow
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** compose a notification by selecting an audience, drafting the message (optionally with AI assistance), reviewing it read-only, and then approving and sending, **so that** nothing goes out that hasn't been deliberately reviewed.

**Acceptance Criteria:**
- [ ] Step 1 (Audience) requires at least one recipient group or a non-empty geotargeted area before proceeding (422 NO_AUDIENCE_SELECTED otherwise); a live recipient-count estimate is shown
- [ ] Step 2 (Message) offers "Draft with AI," which inserts an `[AIDraft]` panel with `Provenance` sources; AI never auto-populates the message field without an explicit, logged Approve action (400 AIDRAFT_NOT_APPROVED if attempted)
- [ ] Step 3 (Review) is fully read-only — nothing is editable without returning to a prior step
- [ ] Step 4 requires the signed-in user to match the designated approver for the selected channels (403 APPROVER_MISMATCH otherwise); public/external-reach sends show a `Modal danger` confirmation restating audience size and channels
- [ ] The compose/send action and its approver are written to the originating incident's Timeline if the notification is incident-linked

**Priority:** P0 | **Feature Ref:** F5

---

### US-5.3: Track delivery and acknowledgment of a sent notification
**As a** Maria Alvarez / EOC Director, **I want to** see a real-time view of delivery and acknowledgment status per recipient after sending a notification, **so that** I know with certainty whether my teams actually received and acknowledged it, not just that it was sent.

**Acceptance Criteria:**
- [ ] Delivery-tracking view shows a `Table` of recipients with Name/Group, Channel, Status `Badge` (Queued/Sent/Delivered/Failed), and an acknowledgment `Progress` bar (e.g., "68% acknowledged, 412 of 606")
- [ ] View auto-refreshes as delivery callbacks arrive from F14, without manual reload
- [ ] Failed deliveries show a visible reason rather than silently dropping (never a silent failure)
- [ ] Status can be filtered by delivery state

**Priority:** P0 | **Feature Ref:** F5
