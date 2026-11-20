# Roadmap: EPMP v2.0 — External Integrations

**Milestone:** v2.0 External Integrations (Phases 7–9; v1.0's Phases 1–6 shipped and are archived in `.planning/milestones/v1.0-ROADMAP.md`)

**Deployable**: yes — DEPLOY-01 shipped in v1.0 Phase 1; this milestone adds no new deployability requirement (no new DEPLOY-01 criteria — the app is already a running, deployed service these phases extend).

## Overview

v2.0 closes out the six external integrations deferred from v1.0 (F12–F17), every one of
them built as a deterministic, documented adapter stub — no live vendor credentials,
simulated success/timeout/degraded paths, mandatory graceful fallback, `Provenance`
enforced at every boundary — following the exact precedent v1.0 Phase 2 established for
F11's GIS adapter. Per an explicit 2026-11-20 user decision, the six requirements are
grouped into three phases by domain pairing (not one phase per feature, not six
single-feature phases): Operating-Picture read overlays, record-authority/sync
integrations, and alerting/identity integrations. The phase sequencing below (which
pairing ships as Phase 7 vs 8 vs 9) is the roadmapper's technical-dependency judgment, per
that same decision, which left ordering unconstrained by any demo/sales priority.

**Why this order:** Phase 7 (weather + CAD/911) is the lowest-complexity, most
precedent-aligned extension — both are pure read-only overlays reusing F11's exact
LayerPanel/Provenance/SyncStatus adapter shape with no new UI pattern required, so it
ships first to re-prove the stub pattern at minimum risk. Phase 8 (EOC COTS + asset/
facility/document) introduces the one genuinely new UI pattern this milestone needs —
side-by-side conflict resolution ("Keep EPMP value" / "Keep [external] value") plus
per-system record-authority declaration — and is sequenced second so that new pattern is
established before the milestone closes. Phase 9 (public alerting + HR/IAM roster) ships
last because it is the lightest net-new backend surface of the three: F14 extends F5's
already-fully-built notification domain (Phase 4) with an outbound stub, and F16-roster
extends F16-SSO's already-fully-built IAM integration (Phase 1) with a read sync — both
layer onto mature v1.0 foundations rather than building new domain logic.

**Hard constraint carried through every phase below:** every success criterion is testable
against the stub's own simulated states (healthy/degraded/outage, success/timeout) — never
against a real vendor's live uptime, a real API key, or a real third-party network call.

## Phases

**Phase Numbering:**
- Integer phases (7, 8, 9): Planned milestone work, continuing from v1.0's final Phase 6
- Decimal phases (7.1, 7.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 7: Operating-Picture Read Overlays (Weather & Dispatch)** - Weather/hazard and CAD/911 dispatch data appear as read-only, provenance-tagged overlays on the Operating Picture and incident workspace, via deterministic adapter stubs following F11's exact pattern
- [ ] **Phase 8: Record-Authority & Sync Integrations** - EOC COTS and asset/facility/document data integrate with explicit record-authority declarations and human-resolved conflict surfacing — never a silent overwrite
- [ ] **Phase 9: Alerting & Identity Integrations** - Approved notifications route through a simulated public-alerting provider under F5's existing approval rule, and HR/IAM roster data syncs read-only into command-role and resource-request matching

## Phase Details

### Phase 7: Operating-Picture Read Overlays (Weather & Dispatch)
**Goal**: EOC and incident-command staff see weather/hazard and CAD/911 dispatch data as additional, clearly-sourced read-only layers on the Operating Picture and incident workspace — simulated via deterministic adapter stubs that behave exactly like F11's GIS adapter (default degraded/fallback path, provenance-tagged, no live vendor credentials) — so an unverified feed is never treated as operational fact and a stub outage never breaks the page.
**Status**: Awaiting verify
**Depends on**: Phase 2 (Operating Picture, F11's GIS adapter pattern), Phase 1 (integration-health view)
**Requirements**: F12, F15
**Success Criteria** (what must be TRUE):
  1. A user can open `LayerPanel` on the Operating Picture and toggle weather/hazard overlay layers sourced from the stub NOAA/NWS/USGS adapter; each layer shows source and as-of age via `Provenance`, and any layer the stub marks unverified stays off by default and keeps the dashed "Unverified" treatment even once toggled on.
  2. When the weather/hazard adapter stub deterministically simulates an outage (same recognized-vs-unrecognized trigger pattern as the GIS adapter), the retry/backoff background job records the failure rather than hiding it, and the Operating Picture keeps rendering with the affected layer simply marked stale/off — the page never fails to render because of a hazard-feed outage.
  3. A user viewing an incident workspace can see a CAD/911 dispatch-status panel for that incident, sourced from the deterministic CAD adapter stub, showing status plus `Provenance` (source/timestamp) — with no edit action anywhere in the UI, since record authority for dispatch data stays with the CAD/911 system.
  4. Both the weather/hazard and CAD/911 integrations appear in the integration-health view (system, last sync, direction = inbound, record authority, `SyncStatus`), and deterministically flipping either stub between healthy/degraded/outage states changes what the health view displays — provable entirely against the stub's own simulated states, with no real vendor network call involved.
**Plans:** 4 plans

Plans:
- [ ] 07-01-PLAN.md — F12 backend: hazard-feed adapter stub (NOAA/NWS/USGS), hazard_layers migration, GET /operating-picture/layers extended, integration_health wiring
- [ ] 07-02-PLAN.md — F15 backend: CAD/911 adapter stub (strictly read-only), cad_dispatch_events migration, GET /incidents/:id/dispatch-status, integration_health wiring
- [ ] 07-03-PLAN.md — F12 frontend: LayerPanel hazard/weather overlay rows on the Operating Picture (depends on 07-01)
- [ ] 07-04-PLAN.md — F15 frontend: read-only Dispatch status Card on the Incident Workspace + integration-health view confirmation (depends on 07-02)

### Phase 8: Record-Authority & Sync Integrations
**Goal**: EOC/logistics and planning staff see WebEOC/Veoci-class EOC COTS data and facility/asset/document-system data integrated into EPMP via deterministic adapter stubs with explicit, visible record-authority declarations — and when a record conflicts between EPMP and the external system, a named person resolves it through an explicit side-by-side "Keep EPMP value" / "Keep [external] value" action — so no sync integration in this milestone ever silently overwrites a record or hides which system actually owns it.
**Depends on**: Phase 7 (integration-health view pattern extended for the first time), Phase 3 (Plans & Playbooks, F2 Operating Picture)
**Requirements**: F13, F17
**Success Criteria** (what must be TRUE):
  1. A user can view an integration-health `Table` row for the simulated EOC COTS system declaring exactly which record types (incidents/boards/resource requests/status/activity logs) it is authoritative for versus EPMP, with last-sync/direction/`SyncStatus` — testable entirely against the stub's own simulated healthy/degraded/outage states.
  2. When the EOC COTS adapter stub simulates the same record differing between EPMP and the external system, the conflict screen shows both values side by side with "Keep EPMP value" / "Keep [external] value" actions, and the conflict is resolved only by the person's explicit click on one of them — never automatically, and never silently overwritten on a subsequent sync cycle.
  3. A user can see facility/asset status and location markers on the Operating Picture, sourced from the deterministic asset/facility adapter stub, each carrying `Provenance` (source/as-of); no inventory, maintenance, or cost field from that feed is ever displayed or persisted anywhere in EPMP.
  4. A user with document-system permission can browse, import, or live-link an EOP/SOP/annex/evidence document from the simulated SharePoint-class adapter into the Plan Repository; a user the stub says lacks permission to a given document cannot see it in the browse/import list at all — enforced server-side, not merely hidden client-side.
  5. When "Link live" mode's background sync detects a simulated source-document change, the linked plan shows a flagged "source changed, review" state rather than silently auto-applying the external edit.
**Plans:** 6 plans

Plans:
- [ ] 08-01-PLAN.md — F13 backend: EOC COTS adapter stub (exchange-records, conflict detection), eoc_cots_config/sync_log/conflicts migration, integration_health wiring
- [ ] 08-02-PLAN.md — F17 backend: facility adapter stub (field-discarding) + document adapter stub (permission-aware browse/import/link), facility_feed_config/facilities/document_system_config migration
- [ ] 08-03-PLAN.md — F13 frontend+backend: EOC COTS conflict resolution UI on Integration Health ("Keep EPMP value"/"Keep [external] value") + sole resolve route (depends on 08-01)
- [ ] 08-04-PLAN.md — F17 frontend: Operating Picture facility markers with Provenance (depends on 08-02)
- [ ] 08-05-PLAN.md — F17 frontend: Plan Repository document browse/import/link modal (depends on 08-02)
- [ ] 08-06-PLAN.md — F17 backend+frontend: Link-live background sync flagging "source changed, review" (depends on 08-02, 08-05)

### Phase 9: Alerting & Identity Integrations
**Goal**: Communications staff can route approved notifications through a deterministic Everbridge/AtHoc-class provider stub (with CAP-formatted public-alert representation) under the exact same named-person-approval rule F5 already enforces, and personnel roster/qualification data syncs read-only from a deterministic HR/IAM adapter stub into resource-request matching and command-role assignment — so no public alert and no roster-sourced assignment can ever happen without a human decision, and no stub provider outage silently drops a message.
**Depends on**: Phase 4 (F5 Notifications Integration domain), Phase 1 (F16-SSO's existing IAM integration)
**Requirements**: F14, F16-roster
**Success Criteria** (what must be TRUE):
  1. A user can route an approved, already-composed F5 notification through the simulated external provider stub and see delivery-status/acknowledgment callbacks feed into F5's existing delivery-tracking table; the external send still requires the exact same named-person approval F5 already enforces — a direct API bypass attempting to send without a matching approver is rejected, not just hidden in the UI.
  2. A message routed through the simulated IPAWS/CAP-compatible channel is representable in OASIS CAP-formatted structure (verifiable from the stub's captured outbound payload), distinct from a normal provider send.
  3. When the notification-provider stub simulates an outage, the queued message is retried and any resulting delivery failure is surfaced visibly in the delivery-tracking UI — never silently dropped, discarded, or shown as successfully sent.
  4. A user can view a personnel roster list (name, role, qualification, contact) sourced read-only from the HR/IAM adapter stub, each entry showing source/as-of via `Provenance`, with HR declared as the authoritative system for personnel records in the integration-health view.
  5. Roster/qualification data populates as selectable reference options in Command Role Assignment (F1) and Resource Request matching (F4), but a person's role/qualification value can only change by resyncing from the HR stub (never a direct in-EPMP edit), and an unmatched roster record shows no matched user rather than being force-matched or guessed.
**Plans:** TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 7 → 8 → 9 (continuing from v1.0's completed Phase 6)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. Operating-Picture Read Overlays (Weather & Dispatch) | 0/TBD | Awaiting verify | - |
| 8. Record-Authority & Sync Integrations | 0/6 | Not started | - |
| 9. Alerting & Identity Integrations | 0/TBD | Not started | - |