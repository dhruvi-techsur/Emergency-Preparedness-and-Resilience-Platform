---
phase: 08-record-authority-sync-integrations
plan: 03
subsystem: integrations
tags: [eoc-cots, conflict-resolution, fastify, react-query, playwright, vitest, caller-identity]

# Dependency graph
requires:
  - phase: 08-01
    provides: eoc_cots_conflicts table (schema), eoc_cots_adapter.ts's runEocCotsSync() detecting and inserting unresolved conflicts, GET /api/v1/integrations/eoc-cots/conflicts
provides:
  - "POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve — the ONLY code path in this codebase permitted to set eoc_cots_conflicts.resolution"
  - "IntegrationHealth.tsx conflict-row expansion pattern (expand/collapse toggle + side-by-side Card panel) — reusable shape for any future integration's conflict rows"
  - "GET /api/v1/integrations/eoc-cots/conflicts now also returns system_name per row"
affects: [integration-gateway, admin-console]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Caller-identity equality on a resolve/approve action (resolved_by must equal req.epmpUser!.id) — mirrors sync-conflicts.ts/hazard-feed-adapter.ts exactly"
    - "Non-idempotent resolve: UPDATE ... WHERE resolution IS NULL + an explicit pre-check, both collapsing to the SAME 404 response on a second attempt — a double-click can never silently win"
    - "Client-side join of a conflicts list to a health-rows list by system_name, rendered as a separate Card below the Table (not a native row-expansion), since Table has no nested-row support"

key-files:
  created:
    - backend/src/modules/integration-gateway/eoc-cots-conflicts.ts
    - backend/src/modules/integration-gateway/eoc-cots-conflicts.test.ts
    - frontend/app/e2e/eoc-cots-conflict-resolution.spec.ts
  modified:
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/modules/integration-gateway/eoc-cots-adapter.ts
    - frontend/app/src/pages/admin/IntegrationHealth.tsx

key-decisions:
  - "Kept the resolve route in its own new file (eoc-cots-conflicts.ts), per 08-01's own documented decision, rather than appending to eoc-cots-adapter.ts"
  - "Cross-plan touch-up to 08-01's GET conflicts route: added system_name:'WebEOC' to each returned row (one-line addition) so the frontend can join conflicts to integration-health rows without a second lookup endpoint"
  - "A double-resolve attempt (already-resolved OR lost-the-race) returns the identical 404 EOC_CONFLICT_NOT_FOUND shape, never a 409 — matches this plan's own explicit 'never silently overwritten' framing more than a conflict-specific error code would"

patterns-established:
  - "Explicit named-person resolve action with caller-identity equality + non-idempotent guard, reusable for any future conflict-bearing integration (CAD/911, HR/IAM roster sync, etc.)"

# Metrics
duration: 10min
completed: 2026-11-20
---

# Phase 8 Plan 3: EOC COTS Conflict Resolution (F13) Summary

**POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve — the sole code path permitted to resolve an eoc_cots_conflicts row, paired with IntegrationHealth.tsx's new side-by-side "Keep EPMP value"/"Keep WebEOC value" conflict-row expansion, proven end-to-end via Playwright including two direct-API-bypass rejection proofs.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-11-20T12:23:53Z
- **Completed:** 2026-11-20T12:33:14Z
- **Tasks:** 3
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- New `eoc-cots-conflicts.ts` route: caller-identity equality (`resolved_by !== req.epmpUser!.id` → 403 `VERIFICATION_REQUIRES_NAMED_USER`), race-safe `UPDATE ... WHERE resolution IS NULL`, a double-resolve attempt collapsing to the identical 404 `EOC_CONFLICT_NOT_FOUND` response as a not-found conflict, an `eoc_cots_sync_log` write (`outbound` for `keep_epmp`, `inbound` for `keep_external`), and an `AuditService.record` call on every successful resolve
- `grep -rn "UPDATE eoc_cots_conflicts" backend/src/modules/` returns exactly one file — `eoc-cots-conflicts.ts` — confirming it is the sole writer, structurally, not just by convention
- `IntegrationHealth.tsx` extended with a conflict-row expansion: any integration-health row with unresolved conflicts shows an "N conflict(s) — review" toggle opening a side-by-side `EPMP value` / `[System] value` panel (raw `JSON.stringify` in `<pre>`, matching this codebase's documented MVP-depth JSONB-display precedent) with literal "Keep EPMP value" / "Keep WebEOC value" actions, neither `autoFocus`'d
- On resolve, `queryClient.invalidateQueries({ queryKey: ['eoc-cots-conflicts'] })` makes the conflict disappear with no page reload — proven via a `navigationCount` assertion in the Playwright spec
- New `eoc-cots-conflict-resolution.spec.ts` (4/4 passing): full UI flow, resolve-and-disappear, a direct `fetch`-through-the-page double-resolve rejection (404), and a direct `fetch`-through-the-page mismatched-`resolved_by` rejection (403) — proving both guards hold independent of the UI
- New `eoc-cots-conflicts.test.ts` (4/4 passing): caller-identity 403, successful `keep_epmp` resolve + non-idempotent second-attempt 404, `keep_external`'s inbound `sync_log` row, nonexistent-id 404
- Full backend suite (22 files, 142 tests) green with zero regression; `npm run build` (backend + frontend/app) and `npx tsc --noEmit` (frontend/app) all clean; `npm run seed` re-run confirmed idempotent (1 conflict re-detected, same count as before)

## Task Commits

Each task was committed atomically:

1. **Task 1: POST /resolve route (eoc-cots-conflicts.ts)** - `a442609` (feat)
2. **Task 2: IntegrationHealth.tsx conflict-row expansion** - `67e6d05` (feat)
3. **Task 3: Playwright + backend integration tests** - `4707c0f` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/src/modules/integration-gateway/eoc-cots-conflicts.ts` - the sole `eoc_cots_conflicts.resolution`-setting route
- `backend/src/modules/integration-gateway/eoc-cots-conflicts.test.ts` - 4 integration tests against the real compose stack
- `backend/src/modules/integration-gateway/routes.ts` - registers `eocCotsConflictsRoutes`
- `backend/src/modules/integration-gateway/eoc-cots-adapter.ts` - GET conflicts route now also returns `system_name`; `findOrCreateEocCotsConfig` exported for test-fixture reuse
- `frontend/app/src/pages/admin/IntegrationHealth.tsx` - conflict-row expand/collapse toggle + side-by-side resolution panel
- `frontend/app/e2e/eoc-cots-conflict-resolution.spec.ts` - 4 Playwright tests, full flow + 2 direct-API-bypass proofs

## Decisions Made
- Added `system_name` to 08-01's GET conflicts response (one-line, documented inline as a cross-plan touch-up) rather than adding a second lookup endpoint, since this stub adapter has exactly one configured vendor and the attribution is deterministic
- Both "already resolved" and "not found" collapse to the identical 404 `EOC_CONFLICT_NOT_FOUND` shape (not a 409) — matches the plan's "a second click must not look like it worked" framing, and reuses the one error code rather than inventing a second

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Exported `findOrCreateEocCotsConfig` from eoc-cots-adapter.ts**
- **Found during:** Task 3 (writing the backend integration test)
- **Issue:** The new test file needs a real `eoc_cots_config.id` to satisfy `eoc_cots_conflicts.config_id`'s NOT NULL FK, and the only existing helper that produces one (`findOrCreateEocCotsConfig`) was a private, un-exported function in 08-01's adapter file
- **Fix:** Changed its declaration from `async function` to `export async function` — zero behavior change, same idempotent find-or-insert body
- **Files modified:** backend/src/modules/integration-gateway/eoc-cots-adapter.ts
- **Verification:** Backend build + full suite (142/142) pass
- **Committed in:** 4707c0f (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for the test file to construct a valid fixture row; no production behavior change.

## Issues Encountered
None — the plan's own documented cross-plan touch-up (adding `system_name` to 08-01's conflicts response) was anticipated in the plan text itself and executed as described, not treated as an unplanned deviation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- F13's conflict-resolution half is complete; Phase 8's remaining plans (08-04, 08-05, 08-06 — already landed in parallel on this branch per the git log) are unaffected by this plan's scope
- The conflict-row expansion pattern established here (client-side join by a shared identifying field, expand/collapse toggle, side-by-side Card panel) is directly reusable by any future integration that surfaces conflicts through the same Integration Health screen
- No blockers

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*

## Self-Check: PASSED

- All key-files.created exist on disk (verified via `[ -f ]`)
- All 3 task commits (`a442609`, `67e6d05`, `4707c0f`) found in `git log --all`
- Build check: `cd backend && npm run build` → exit 0; `cd frontend/app && npx tsc --noEmit && npm run build` → exit 0
- Full backend suite: 22 files, 142 tests, 0 failures
- Playwright: `eoc-cots-conflict-resolution.spec.ts` 4/4 passed; `admin-platform-sso.spec.ts` (shared Integration Health surface) regression-checked 4/4 passed
- `npm run seed` re-run confirmed idempotent
- `## Known Stubs`: None found — no TODO/FIXME/placeholder markers in any file this plan created or modified; the "written back through the adapter" requirement is satisfied at this codebase's established stub-depth (a logged `eoc_cots_sync_log` entry, not a live vendor call), matching every other adapter's documented convention, not a gap unique to this plan
