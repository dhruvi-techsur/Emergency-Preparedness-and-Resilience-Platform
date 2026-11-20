# Requirements: EPMP v2.0 — External Integrations

**Defined:** 2026-11-20
**Milestone:** v2.0 External Integrations
**Core Value:** Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.

**Source:** Derived from `project_specs/PRD-EPMP.md` §5 (F12–F17) and §10 (Out of Scope), and `.planning/milestones/v1.0-REQUIREMENTS.md` (deferral record). Feature IDs (F12–F17) are preserved unchanged from the original PRD/FRD/TechArch/UserStories/RTM spec suite — no renumbering. Phase numbering continues from v1.0's final phase (Phase 6), so v2.0 starts at **Phase 7**.

**Build pattern (user decision, 2026-11-20):** Every integration in this milestone ships as a deterministic, documented adapter stub — no live vendor credentials, simulating success/timeout/degraded paths, with mandatory graceful fallback and `Provenance` enforced at every boundary — following the exact precedent v1.0 Phase 2 established for F11 (GIS). This is a hard constraint on every plan in this milestone, not a per-feature choice.

## v2 Requirements

All six features deferred from v1.0 are in scope for v2.0. Grouped into 3 phases by domain pairing (user decision, 2026-11-20): weather/dispatch overlays, record-authority/sync integrations, and alerting/identity integrations. Exact phase numbers are assigned by the roadmapper.

### Group A — Operating-Picture Read Overlays (Weather & Dispatch)

- [ ] **F12**: Weather & Hazard Feed Ingestion — scoped, read-only ingestion of forecasts/warnings/events/hazard locations with confidence metadata from approved sources (NOAA/NWS/USGS adapter stub); every ingested fact carries source/timestamp/confidence via `Provenance`; unverified feeds stay visibly unverified until a person validates them; feeds surface as toggleable `LayerPanel` layers on the Operating Picture (F2), off by default when unverified; ingestion runs as an F10 background job with retry/backoff on simulated feed outage.
- [ ] **F15**: CAD / 911 Integration — vendor-authorized, read-oriented adapter stub surfacing dispatch status against an EPMP incident in the incident workspace; record authority for dispatch data stays with the CAD/911 system (EPMP references/displays with provenance, never edits); integration-health visibility consistent with F13's pattern (last sync, direction, authority, `SyncStatus`).

### Group B — Record-Authority & Sync Integrations

- [ ] **F13**: EOC COTS Interoperability — approved adapter-stub integration exchanging incidents, boards, resource requests, status, and activity logs with incumbent EOC COTS systems (WebEOC/Veoci/DisasterLAN) at MVP depth (defined record set, not every board/widget type); explicit record-authority declaration per integrated system, visible in an integration-health `Table`; conflict surfacing when the same record differs between EPMP and the external system — both values shown side by side with "Keep EPMP value" / "Keep [external] value" actions, never a silent overwrite.
- [ ] **F17**: Asset, Facility & Document System Integration — read-only facility/asset status and location feed into the Operating Picture (F2) as facility markers with provenance; permission-aware import/link/sync of EOPs/SOPs/annexes/evidence documents from a SharePoint-class system into the plan repository (F3), preserving the source system's access permissions; no write-back of inventory/maintenance/cost data (that remains out of scope per the Advanced Logistics exclusion).

### Group C — Alerting & Identity Integrations

- [ ] **F14**: Notification Provider & Public-Alerting Integration — provider-integration adapter stub for sending approved messages through an Everbridge/AtHoc-class channel, with delivery-status/acknowledgment callbacks fed back into F5's delivery view; OASIS CAP-formatted alert representation for any message routed through an IPAWS/CAP-compatible public-warning channel; every external send stays approval-controlled by a named person (`AIDraft` may fill content, but send is always a deliberate human action); graceful failure — simulated provider outages queue messages for retry and surface delivery failures in the UI rather than silently dropping them.
- [ ] **F16-roster**: HR/IAM roster/qualification sync — read sync of personnel roster, role, qualification, and contact data from an HR/IAM adapter stub, with HR treated as authoritative for personnel records; role/qualification data flows into resource-request matching (F4) and command-role assignment (F1) as reference data, not an independently maintained EPMP personnel system of record. (Completes F16 alongside v1.0's F16-SSO, which already shipped authentication.)

## Out of Scope

Carried forward from `project_specs/PRD-EPMP.md` §10 and `.planning/PROJECT.md`, with two additions specific to this milestone's build pattern:

| Feature | Reason |
|---------|--------|
| Real vendor API credentials or live third-party accounts for any v2.0 integration | No real NOAA/WebEOC/Veoci/DisasterLAN/Everbridge/AtHoc/IPAWS/CAD/HR-IAM/document-system account exists in this environment; every integration is a deterministic, documented stub per the user's explicit build-pattern decision |
| Full bidirectional, field-complete sync with any named external system (EOC COTS, CAD, HR/IAM, asset/document systems) | Each integration targets an MVP-appropriate, explicitly declared record subset via approved adapters/read feeds, not comprehensive two-way sync of every field |
| Write-back of inventory, maintenance, or cost data via F17's asset/facility feed | Explicitly excluded per the PRD; full asset/inventory/maintenance management is deferred to the Advanced Logistics expansion phase (unchanged from v1.0's Out of Scope) |
| Curated/correlated risk-intelligence module (alerting/correlation beyond F12's basic overlay layers) | Expansion phase, not this milestone — F12 ships ingestion + display only |
| Advanced AI & analytics beyond v1.0 Phase 6 scope | Unchanged from v1.0's Out of Scope; no new AI capability is introduced by this milestone |
| Any auto-issued AI-generated public warning, evacuation instruction, or binding resource decision | Unchanged hard constraint; F14's public-alerting integration still requires named-person approval for every external send |
| FedRAMP authorization claims in any UI copy or marketing text | Unchanged from v1.0 |
| Commercial edition packaging / dollar-figure market sizing | Unchanged from v1.0 — business/commercial questions, not engineering scope |

## Traceability

Populated during roadmap creation by the roadmapper agent.

| Requirement | Phase | Status |
|-------------|-------|--------|
| F12 | Phase 7 | Pending |
| F15 | Phase 7 | Pending |
| F13 | Phase 8 | Pending |
| F17 | Phase 8 | Pending |
| F14 | Phase 9 | Pending |
| F16-roster | Phase 9 | Pending |

**Coverage:**
- v2 requirements: 6 total (F12, F13, F14, F15, F16-roster, F17)
- Mapped to phases: 6
- Unmapped: 0

---
*Requirements defined: 2026-11-20*
*Last updated: 2026-11-20 after v2.0 ROADMAP.md creation (Phases 7-9, 100% coverage)*
