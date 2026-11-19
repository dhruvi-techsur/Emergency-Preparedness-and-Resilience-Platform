---
phase: 06-persona-dashboards-ai-assistance
plan: 04
subsystem: ai-assist
tags: [signal-triage, clustering, postgis, fastify, ai-governance]

# Dependency graph
requires:
  - phase: 06-persona-dashboards-ai-assistance
    provides: "06-01's signals/signal_source_events/hazard_feed_config/hazard_feed_events schema; 06-03's ai-assist/routes.ts with aiDraftsRoutes already registered and the ai_assist feature-permission already seeded"
provides:
  - "clusterHazardFeedEvents() — deterministic (type, 0.5-degree grid cell) grouping of raw hazard_feed_events into candidate signals rows, with qualitative confidence derivation"
  - "GET /api/v1/signals — status/confidence-filtered Signal Triage Queue list"
  - "POST /api/v1/signals/{id}/promote — structurally incapable of creating an incident; returns SignalPromotePrefill only"
  - "POST /api/v1/signals/{id}/dismiss — reason-required, app-layer + DB CHECK backstopped"
affects: ["06-09 (Signal Triage Queue + Signal Detail frontend screens)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Real clustering via single SQL GROUP BY on (type, ST_SnapToGrid(geometry, 0.5)) — not a 1:1 passthrough"
    - "Structural (not just runtime) guarantee against a mutation: the promote endpoint's source file contains zero incidents-table write statements"

key-files:
  created:
    - backend/src/modules/ai-assist/signal-clustering.ts
    - backend/src/modules/ai-assist/signals.ts
    - backend/src/modules/ai-assist/signals.test.ts
  modified:
    - backend/src/modules/ai-assist/routes.ts
    - backend/scripts/seed.ts

key-decisions:
  - "clusterHazardFeedEvents() hosted in ai-assist (not comms-reporting, TechArch's literal module assignment) since comms-reporting has zero executed code in this codebase — documented inline as a relocatable, contract-preserving placement"
  - "Signal triage routes reuse 06-03's ai_assist feature-permission rather than inventing a new permission string — signal triage and AIDraft are both F9 sub-features with no documented narrower split"
  - "promote/dismiss both gated on 'view' (not 'edit'/'approve') since neither mutates incident data — only the signals row's own status bookkeeping changes"

# Metrics
duration: 25min
completed: 2026-11-19
---

# Phase 6 Plan 04: Signal Triage Queue — Clustering + Promote/Dismiss API Summary

**Deterministic (type, 0.5°-grid) clustering of hazard-feed events into qualitative-confidence signals, plus a promote endpoint with zero incidents-table write statements anywhere in its code — a structural, not just runtime, guarantee it can never create an incident.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-19T12:39:24Z
- **Completed:** 2026-11-19T13:04:00Z
- **Tasks:** 3
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments

- `clusterHazardFeedEvents()` groups unclustered `hazard_feed_events` by a real deterministic rule — `(type, ST_SnapToGrid(geometry, 0.5))` — via one SQL `GROUP BY` query, never a 1:1 passthrough. Confidence is always a qualitative label (`High`/`Medium`) plus a stated reason string (`"3 corroborating feeds (NOAA, NWS, USGS)"` / `"Single source: USGS"`), never a bare percentage.
- Idempotent by construction: the grouping query's own `WHERE NOT EXISTS (signal_source_events link)` condition means a second run clusters nothing new. Verified directly: first seed run created 3 signals (1 High, 2 Medium) from 5 seeded hazard-feed events; second run created 0 new signals, leaving the count at 3.
- `GET /api/v1/signals` (status/confidence filterable) and `POST .../promote` (pre-fill-only) and `POST .../dismiss` (reason-required) all shipped, gated on 06-03's existing `ai_assist` permission.
- The promote endpoint's own source file contains **zero** incidents-table write statements anywhere, under any condition — verified both by this plan's own grep-based `<verify>` step (`grep -n "INSERT INTO incidents"` returns no matches) and by the integration test's direct `COUNT(*) FROM incidents` proof that the count is unchanged before/after a promote call.

## Task Commits

1. **Task 1: Deterministic hazard-feed clustering function + seed sample feed events** - `722f57e` (feat)
2. **Task 2: Signal triage queue API — list, promote (pre-fill-only), dismiss (reason-required)** - `9176149` (feat)
3. **Task 3: Integration test — clustering produces real groups, promote never creates an incident, dismiss requires reason** - `b023374` (test)

_No TDD cycles — all three tasks were `type="auto"`._

## Files Created/Modified

- `backend/src/modules/ai-assist/signal-clustering.ts` — `clusterHazardFeedEvents()`, the real (type, grid-cell) grouping job
- `backend/src/modules/ai-assist/signals.ts` — `GET/POST /api/v1/signals` triage queue API (list/promote/dismiss)
- `backend/src/modules/ai-assist/signals.test.ts` — 5-assertion integration test proving real clustering, the promote-never-creates-an-incident invariant, and the dismiss-reason gate
- `backend/src/modules/ai-assist/routes.ts` — appended `signalsRoutes` registration beside 06-03's existing `aiDraftsRoutes`
- `backend/scripts/seed.ts` — added 3 `hazard_feed_config` rows (NOAA/NWS/USGS) + 5 `hazard_feed_events` rows (3 corroborating, 2 isolated) and a `clusterHazardFeedEvents()` call in `main()`, so every fresh `npm run seed` run populates the Signal Triage Queue

## Decisions Made

- `clusterHazardFeedEvents()` is hosted in `ai-assist` rather than TechArch's literal `comms-reporting` module assignment, since `comms-reporting` has zero executed code in this codebase (Phase 4 is unexecuted PLAN.md files only). Documented inline as a contract-preserving placement — moving it later to a real `comms-reporting` module changes nothing about its exported signature.
- Signal triage's three routes reuse 06-03's `ai_assist` feature-permission rather than inventing a new permission string, since signal triage and AIDraft are both F9 sub-features and no narrower split is documented anywhere for signal triage specifically.
- Both `promote` and `dismiss` are gated on the `view` action-level (not `edit`/`approve`), since neither endpoint mutates incident data — only the `signals` row's own status bookkeeping (`Promoted`/`Dismissed`) changes, which the FRD itself frames as a read-adjacent triage action.

## Deviations from Plan

None — plan executed exactly as written. The plan's own sequencing note (explicit `depends_on: ["06-01","06-03"]`, this plan running strictly after 06-03) held: `routes.ts` and `seed.ts` were both found in exactly the state 06-03 left them, and both appends landed cleanly with zero merge conflict or route-collision risk.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required. No live NOAA/NWS/USGS feed credential is needed; F12 (Weather & Hazard Feed Ingestion) remains explicitly deferred to v2 per `.planning/REQUIREMENTS.md`, and this plan's seeded sample data stands in for what a live feed poll would produce.

## Known Stubs

None found. `clusterHazardFeedEvents()`'s grouping rule, confidence derivation, and the promote endpoint's `type_suggestion`/`severity_suggestion` heuristics are all documented, deterministic simplifications (not TODOs or hardcoded stand-ins for missing logic) — each produces real, varying output from real input data, verified directly by the integration test's assertions on distinct High vs Medium confidence outcomes.

## Next Phase Readiness

- 06-09's Signal Triage Queue + Signal Detail frontend screens can now consume `GET /api/v1/signals`, `POST .../promote`, and `POST .../dismiss` directly — all three endpoints are live, tested, and gated on the already-seeded `ai_assist` permission (PER-01/02/03).
- Full backend suite (19 files, 108 tests, +5 from this plan) green with zero regression; `tsc --noEmit` and `npm run build` both clean.
- No blockers for this phase's remaining plans (06-06 through 06-10).

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*

## Self-Check: PASSED

- All 5 key-files (3 created, 2 modified) confirmed present on disk.
- All 3 task commits (722f57e, 9176149, b023374) confirmed in git log.
- Build check: `npm run build` (tsc -p tsconfig.json) → exit 0 (clean, no output).
- `tsc --noEmit` → exit 0 (clean, no output).
- Full backend suite: 19 files, 108 tests, all passed, zero regression against the pre-plan baseline (103 tests).
- `## Known Stubs` section present above; no entry classified blocking.
