## Epic 10: Platform API, Integration Gateway & Event Bus (F10)

The programmatic contract and background-processing backbone enforcing record authority, provenance, controlled federation, and graceful failure.

### US-10.1: Declare and view record authority per external system
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see a documented registry of which system (EPMP or a named external system) is authoritative for each record type, **so that** integration conflicts are resolved by policy, not guesswork.

**Acceptance Criteria:**
- [ ] Record Authority Registry shows Record type, Authoritative system, and Notes for every integrated record type
- [ ] An undeclared record type is never synced by any integration feature (F13, F15, F16, F17)
- [ ] Changes to the registry require admin role and are audited
- [ ] A write attempted against an externally-owned record shows a clear conflict message (409 RECORD_AUTHORITY_CONFLICT) rather than silently overwriting

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.2: Grant and revoke cross-jurisdiction data federation
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** grant a partner jurisdiction scoped, time-limited access to specific incident/record data and revoke it instantly, **so that** cross-jurisdiction sharing is explicit and controlled rather than all-or-nothing.

**Acceptance Criteria:**
- [ ] Federation Grants screen shows Partner jurisdiction, Scope granted, Granted by, Expires, and Status (Active/Revoked)
- [ ] A grant must have an explicit, enumerated scope — a grant with no scope restriction (implicit "all data") is rejected
- [ ] Revoking a grant takes effect within the same request cycle, with no caching window that honors a revoked credential
- [ ] An expired or revoked grant denies access with a clear message (403 FEDERATION_ACCESS_DENIED)

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.3: Trust that ingested data always carries provenance
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** have every ingested or AI-derived fact carry source, timestamp, version, and confidence, **so that** I never mistake an unverified feed for operational fact.

**Acceptance Criteria:**
- [ ] Inbound data lacking `source`, `timestamp`, `version`, or `confidence` is rejected at the API boundary (422 PROVENANCE_REQUIRED), never persisted as if verified
- [ ] This enforcement applies uniformly across all integration sources (F11–F17)
- [ ] Provenance is visible wherever the data surfaces in the UI (map layers, dashboard tiles, dispatch panels)

**Priority:** P0 | **Feature Ref:** F10

---

### US-10.4: Monitor background job health
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see the status, last run, failure count, and next retry for every background job type, **so that** a silently failing feed-ingestion or sync job never goes unnoticed.

**Acceptance Criteria:**
- [ ] Background Job Monitor shows Job type, Status, Last run, Failure count, Next retry for notification fan-out, feed ingestion, sync reconciliation, and report generation
- [ ] A job exceeding its failure threshold surfaces a clear alert (200 alert BACKGROUND_JOB_DEGRADED) with the last error reason
- [ ] Monitor is surfaced as part of the platform-health view (F8 S8.7), not a hidden/separate nav item
- [ ] A duplicate webhook delivery (matching idempotency key) is safely no-op'd, never reprocessed

**Priority:** P0 | **Feature Ref:** F10
