---
phase: 06-persona-dashboards-ai-assistance
plan: 09
subsystem: ui
tags: [react, signals, signal-triage, provenance, postgres, playwright]

# Dependency graph
requires:
  - phase: 06-04
    provides: "Signal Triage Queue backend — GET /api/v1/signals, POST .../promote (writes no incidents row), POST .../dismiss (422 on empty reason), clusterHazardFeedEvents() seed data"
  - phase: 06-06
    provides: "Monitor SideNav group's RBAC-gated 'Signals' nav item and the signInAsEocDirector Playwright helper"
  - phase: 06-08
    provides: "The last-landed route in main.tsx (/incidents/:incidentId/forms/:formId), the file this plan appends after"
provides:
  - "SignalTriageQueue.tsx (/signals) — Table with Review/Promote/Dismiss row actions, qualitative-only confidence rendering"
  - "SignalDetail.tsx (/signals/:id) — per-clustered-event Provenance chips, same Promote/Dismiss actions as the Queue"
  - "CreateIncident.tsx accepts an optional router-state pre-fill (name/type/severity) — additive-only, non-breaking to Phase 2's own flow"
  - "GET /api/v1/signals extended with a new source_events field (per-event source+occurred_at) for Signal Detail's Provenance chips"
affects: [reporting, incident-ops]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Promote-then-navigate: a triage action calls only its own read-only promote endpoint, then navigates to an existing create form with router state — never a direct create-endpoint call from the triage screen itself"
    - "Pre-fill-via-router-state consumption: useState lazy initializers reading an optional location.state field, with the normal no-state path behaving identically to before"

key-files:
  created:
    - frontend/app/src/pages/signals/SignalTriageQueue.tsx
    - frontend/app/src/pages/signals/SignalDetail.tsx
    - frontend/app/src/pages/signals/SignalTriage.css
    - frontend/app/e2e/signal-triage.spec.ts
  modified:
    - frontend/app/src/pages/incidents/CreateIncident.tsx
    - frontend/app/src/main.tsx
    - backend/src/modules/ai-assist/signals.ts

key-decisions:
  - "Extended GET /api/v1/signals with a new source_events field (per-event source+occurred_at) rather than adding a dedicated single-id signal route — the existing source_feeds aggregate can't distinguish individual clustered events sharing a feed name, which Signal Detail's one-chip-per-event requirement needs, and 06-04 documented no single-id lookup as in scope"
  - "Signal Detail fetches the full signals list and filters client-side by id (06-04's own documented fallback for 'no single-id GET route exists')"
  - "Provenance verified/confidence is a derived heuristic (Low confidence + exactly 1 contributing source -> unverified), not a literal signal_source_events.verified column read, since that column doesn't exist in this schema"
  - "CreateIncident.tsx's pre-fill type_suggestion is defensively mapped through resolveTypeSuggestion() to the form's existing IncidentType enum (falling back to 'Other') — 06-04's promote endpoint derives free-text hazard vocabulary that is not itself a member of incidents.type's CHECK constraint"

patterns-established:
  - "Promote-then-navigate: never call the target create-endpoint directly from a pre-fill-producing screen"

# Metrics
duration: 9min
completed: 2026-11-19
---

# Phase 6 Plan 09: Signal Triage Queue + Signal Detail Summary

**Signal Triage Queue (/signals) and Signal Detail (/signals/:id) consuming 06-04's real signal-clustering backend, proving at the UI layer that Promote only ever navigates to the pre-filled Create Incident form — never a direct incident-creation call — backed by an explicit Playwright before/after incidents-count proof.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-11-19T18:33:55Z
- **Completed:** 2026-11-19T18:43:17Z
- **Tasks:** 3
- **Files modified:** 7 (4 created, 3 modified)

## Accomplishments

- `SignalTriageQueue.tsx` — Table with Review/Promote/Dismiss row actions; Confidence column renders `${label} — ${reason}` as plain text only (no numeric/progress-bar-style component is ever imported, which is itself the enforcement mechanism for "never a bare percentage")
- Dismiss opens a `Modal` whose confirm button is structurally `disabled` while the typed reason is empty — a client-side backstop for 06-04's own server-side 422 `SIGNAL_DISMISS_REASON_REQUIRED`
- Promote calls only the signals-triage `/promote` endpoint (which itself writes no `incidents` row, per 06-04's own structural guarantee), then `navigate('/incidents/new', { state: { prefill } })` — this screen's own code contains zero incident-creation calls
- `SignalDetail.tsx` — renders one `Provenance` chip per clustered source event, with a documented derived verified/confidence heuristic (Low confidence + single source → unverified) standing in for the schema's lack of a literal `verified` column
- `CreateIncident.tsx` reads an optional router-state pre-fill as `useState` lazy-initializer defaults only — a normal `/incidents/new` visit with no router state behaves exactly as before Phase 2
- New `signal-triage.spec.ts` proves the full flow end-to-end against the real backend, including the explicit before/during/after incidents-count assertion that Promote alone never creates a record and only the human's own form submission does

## Task Commits

Each task was committed atomically:

1. **Task 1: Signal Triage Queue (Table + Dismiss Modal + Promote pre-fill navigation)** — `7117213` (feat)
2. **Task 2: Signal Detail (Provenance chips) + CreateIncident pre-fill consumption** — `f7ca4ba` (feat)
3. **Task 3: Route registration + Playwright proof of the full triage flow** — `76f3e48` (feat)

_Note: Task 2's commit also includes a Rule-3 backend extension (signals.ts's new `source_events` field); Task 3's commit also includes a Rule-1 bugfix to CreateIncident.tsx — see Deviations below._

## Files Created/Modified

- `frontend/app/src/pages/signals/SignalTriageQueue.tsx` — S9.1 Signal Triage Queue Table
- `frontend/app/src/pages/signals/SignalDetail.tsx` — S9.2 Signal Detail with Provenance chips
- `frontend/app/src/pages/signals/SignalTriage.css` — toolbar/table/provenance-list layout
- `frontend/app/e2e/signal-triage.spec.ts` — full end-to-end triage-flow proof
- `frontend/app/src/pages/incidents/CreateIncident.tsx` — optional pre-fill consumption + type-suggestion sanitization
- `frontend/app/src/main.tsx` — `/signals`, `/signals/:id` route registration
- `backend/src/modules/ai-assist/signals.ts` — additive `source_events` field on the list response

## Decisions Made

- Extended the existing `GET /api/v1/signals` with a `source_events` field rather than adding a new single-id route — simpler, additive, and matches the plan's own "whichever is simpler given 06-04's actual route shape" instruction.
- Signal Detail filters the full list client-side by id (06-04's own documented fallback).
- Provenance `verified`/`confidence` per chip is a documented derived heuristic, not a literal column read, since `signal_source_events` has no `verified` boolean.
- `CreateIncident.tsx`'s pre-fill `type_suggestion` is defensively resolved against the known `IncidentType` enum, falling back to `'Other'` — see Deviations.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Extended `GET /api/v1/signals` with a `source_events` field**
- **Found during:** Task 2 (Signal Detail)
- **Issue:** The existing `GET /api/v1/signals` response only carried a de-duplicated `source_feeds` array (distinct feed names), which cannot distinguish individual clustered events sharing a feed name — Signal Detail's "one Provenance chip per clustered source event" requirement needs each event's own `source`/`occurred_at`, which the aggregate alone can't provide.
- **Fix:** Added a new, additive `source_events` field (`json_agg` of `{source, occurred_at}` per signal, ordered by `occurred_at`) to the existing list query. No breaking change to the existing `source_feeds` field or any other consumer (only 06-09's own new screens read the new field).
- **Files modified:** `backend/src/modules/ai-assist/signals.ts`
- **Verification:** `tsc --noEmit` (backend) clean; full backend suite (108/108) green with zero regression; `signal-triage.spec.ts` test 6 confirms at least one `.ep-provenance` chip renders.
- **Committed in:** `f7ca4ba` (Task 2 commit)

**2. [Rule 1 - Bug] `CreateIncident.tsx`'s pre-fill `type_suggestion` is defensively sanitized against the known `IncidentType` enum**
- **Found during:** Task 3's own Playwright verification (test 3-5 initially failed with a 500 on submit)
- **Issue:** 06-04's `signals.ts::deriveTypeSuggestion()` derives a free-text hazard-feed vocabulary string from the signal's own summary (e.g. `"Earthquake Advisory"`, `"High Wind Warning"`, `"Hurricane Watch"`) — none of which are members of `incidents.type`'s own `CHECK (type IN ('Flood','Wildfire','Severe Weather','HazMat','Public Health','Other'))` constraint. Submitting one of these pre-filled, unedited values straight through the Create Incident form 500s on the DB constraint (reproduced directly against the live stack before fixing).
- **Fix:** Added `resolveTypeSuggestion()` in `CreateIncident.tsx`, used as the `type` state's lazy initializer: any pre-fill suggestion not already a known `IncidentType` resolves to the form's existing `'Other'` catch-all — the same bucket a human would pick manually for an unlisted hazard type — rather than letting an invalid value reach the submit call.
- **Files modified:** `frontend/app/src/pages/incidents/CreateIncident.tsx`
- **Verification:** `tsc --noEmit` (frontend/app) clean; `signal-triage.spec.ts` (4/4, including the full promote → submit → incidents-count-increments-by-1 flow) passes; `incident-list-create.spec.ts` (4/4) regression-passes unaffected (that suite never exercises a pre-fill, so it was never at risk, but is unaffected by this additive-only fix either way).
- **Committed in:** `76f3e48` (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking backend extension, 1 bug fix)
**Impact on plan:** Both auto-fixes were necessary for correctness — the first because Signal Detail's own stated requirement (one chip per clustered event) was structurally unreachable with the prior response shape; the second because the promote → pre-fill → submit flow (success criterion 5's actual end-to-end proof) would 500 on a real High-confidence cluster's own derived type without it. No scope creep — neither touches any file outside this plan's own stated scope.

## Issues Encountered

None beyond the two auto-fixed deviations above, both discovered and resolved during this plan's own verification steps (not pre-existing/unrelated issues).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Success criterion 5 is now fully proven end-to-end at the UI layer: 06-04 proved the backend structurally cannot create an incident through the promote endpoint; this plan proves the frontend never attempts to skip the human-submission step either (Promote wires exclusively to form-navigation, with an explicit incidents-count-unchanged assertion covering the gap between navigation and submission).
- All three integration contracts (06-04's `signalsRoutes`, 06-06's `hasAiAssist` Signals nav item, 06-08's already-landed `main.tsx` route) matched their documented shapes exactly — no contract-shape deviation.
- Full backend suite (19 files, 108 tests) green with zero regression; `tsc --noEmit` clean for backend, frontend/app, and design-system; both backend and frontend/app production builds clean; 4/4 new `signal-triage.spec.ts` plus 4/4 `incident-list-create.spec.ts` regression passing.
- Ready for 06-10 (final plan in this phase).

## Self-Check: PASSED

- `frontend/app/src/pages/signals/SignalTriageQueue.tsx` — FOUND
- `frontend/app/src/pages/signals/SignalDetail.tsx` — FOUND
- `frontend/app/src/pages/signals/SignalTriage.css` — FOUND
- `frontend/app/e2e/signal-triage.spec.ts` — FOUND
- Commit `7117213` — FOUND (`git log --oneline` confirms)
- Commit `f7ca4ba` — FOUND
- Commit `76f3e48` — FOUND
- Build check: backend `npm run build` (tsc -p tsconfig.json) → exit 0
- Build check: frontend/app `npm run build` (vite build) → exit 0
- `## Known Stubs`: None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all 7 changed files returned zero matches.

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*
