## Epic 15: CAD / 911 Integration (F15)

Read integration with CAD/911 dispatch systems to surface dispatch status against an EPMP incident without EPMP becoming a dispatch system of record.

### US-15.1: See read-only dispatch status within the incident workspace
**As a** James Okafor / Incident Commander, **I want to** see CAD/911 dispatch status (dispatched, en route, on scene, cleared) displayed within my incident workspace, **so that** I have a fuller operational picture without needing a separate dispatch screen.

**Acceptance Criteria:**
- [ ] Matched dispatch events display as a read-only panel/card within the linked incident workspace, carrying `Provenance` (CAD system name, timestamp)
- [ ] Dispatch events are matched to an incident either automatically (shared incident number) or via human-confirmed match (geographic/time proximity)
- [ ] An attempted edit to dispatch-status data from within EPMP is blocked with a clear explanation (403 CAD_RECORD_READ_ONLY) — CAD/911 remains the system of record
- [ ] No PATCH/PUT/DELETE route exists for this resource at the API level — the contract is read-only by design
- [ ] A CAD feed outage shows last-known dispatch status labeled with its age, logged to Integration Health (503 CAD_FEED_UNREACHABLE)

**Priority:** P2 | **Feature Ref:** F15
