## Epic 13: EOC COTS Interoperability (F13)

Governed interoperability with incumbent EOC platforms (WebEOC, Veoci, DisasterLAN) via approved adapters at MVP depth.

### US-13.1: Exchange incidents and resource requests with our incumbent EOC system
**As a** Maria Alvarez / EOC Director, **I want to** keep using EPMP alongside our existing WebEOC/Veoci/DisasterLAN deployment with incidents, resource requests, status, and activity logs exchanged automatically, **so that** my agency can adopt EPMP as a coordination layer without abandoning our incumbent investment.

**Acceptance Criteria:**
- [ ] Inbound/outbound sync covers exactly four record types: Incident, Resource Request, Status Update, Activity Log Entry
- [ ] Every sync cycle checks the record-authority registry before applying any inbound change; undeclared record types are not synced
- [ ] Outbound sync to the external system only occurs for record types where the registry permits an EPMP-originated write
- [ ] Adapter authentication failure shows a clear message (401 EOC_ADAPTER_AUTH_FAILED)

**Priority:** P1 | **Feature Ref:** F13

---

### US-13.2: Resolve a conflict between EPMP and an incumbent EOC system
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see both values side by side when EPMP and an incumbent EOC system disagree on the same record, and explicitly choose which to keep, **so that** neither system silently overwrites meaningful data.

**Acceptance Criteria:**
- [ ] A detected conflict shows both values side by side with "Keep EPMP value" / "Keep [external] value" actions — never auto-resolved by any heuristic (e.g., last-write-wins)
- [ ] The resolution is written back through the adapter to the external system if EPMP's value was kept, or applied locally if the external value was kept
- [ ] Integration-health view shows System, Last sync, Direction, Record authority, and `SyncStatus` for the connected COTS system
- [ ] An outbound write rejected by the external system shows the vendor's error reason (502 EOC_OUTBOUND_REJECTED)

**Priority:** P1 | **Feature Ref:** F13
