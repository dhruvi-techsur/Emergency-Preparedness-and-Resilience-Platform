## Epic 14: Notification Provider & Public-Alerting Integration (F14)

Outbound integration with external notification providers and the FEMA IPAWS/OASIS CAP ecosystem for approval-controlled public warning distribution.

### US-14.1: Dispatch an approved message through a real notification provider
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** have my approved notification actually dispatched through our configured provider (e.g., Everbridge/AtHoc-class channel) with delivery status fed back, **so that** sending a message is real, trackable action rather than a best-effort guess.

**Acceptance Criteria:**
- [ ] The send endpoint rejects any request lacking `approved_by`/`approved_at`, unconditionally, with no override (400 SEND_REQUIRES_APPROVAL)
- [ ] Delivery/acknowledgment callbacks from the provider update F5's delivery-tracking view in near-real-time, matched by `external_message_id`
- [ ] A provider outage queues the message for retry with backoff rather than dropping it; failures surface in F5's delivery view with a visible reason and retry status (503 PROVIDER_UNAVAILABLE)
- [ ] An unmatched delivery callback is logged for investigation, never silently discarded or attached to the wrong record

**Priority:** P1 | **Feature Ref:** F14

---

### US-14.2: Send a public warning through IPAWS/CAP with complete required fields
**As a** James Okafor / Incident Commander (PIO capacity), **I want to** have any message routed through IPAWS/CAP-compatible channels formatted to the complete OASIS CAP standard under our agency's authorized sender identity, **so that** public warnings meet the required legal/technical format and never go out under an unauthorized identity.

**Acceptance Criteria:**
- [ ] CAP-formatted sends include all OASIS CAP required fields (identifier, sender, sent, status, scope, category, event, urgency, severity, certainty, area)
- [ ] An incomplete CAP payload is never dispatched — it is rejected back to the composer for completion (422 CAP_FIELDS_INCOMPLETE)
- [ ] EPMP never originates a CAP alert without an explicit, agency-authorized sender identity attached
- [ ] An agency without IPAWS/CAP channel authorization is blocked from sending through it (403 CAP_AUTHORITY_DENIED)
- [ ] This CAP-formatting step never runs for a message that has not passed F5's named-person approval gate

**Priority:** P1 | **Feature Ref:** F14
