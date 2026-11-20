---
phase: 08-record-authority-sync-integrations
plan: 09
subsystem: plans
tags: [plans, integration-gateway, document-adapter, gap-closure, UAT, F17]

# Dependency graph
requires:
  - phase: 08-record-authority-sync-integrations
    provides: "08-07's jurisdiction-scope hardened linkDocument() (4th jurisdictionScope parameter) — this plan calls linkDocument with that parameter"
provides:
  - "POST /api/v1/plans/import — lands an imported/linked document as a real Plan (new Draft v1, or attach to an existing in-scope plan)"
  - "hasDocumentAccess(userId, externalDocId) — small additive standalone export on document-adapter.ts, enabling a pre-flight permission check before any plans-table INSERT"
affects: [plan-repository-ui, integration-gateway]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Permission-check-before-write ordering: a pre-flight access-set check runs BEFORE any plans-table INSERT, so a rejected import can never leave an orphaned Draft plan behind — no delete-after-the-fact rollback needed"

key-files:
  created: []
  modified:
    - backend/src/modules/plans/plans.ts
    - backend/src/modules/integration-gateway/document-adapter.ts
    - backend/src/modules/plans/plans.test.ts

key-decisions:
  - "Added hasDocumentAccess() as a small additive export to document-adapter.ts (not in the plan's original files_modified list) rather than the delete-after-the-fact rollback fallback the plan offered as an acceptable alternative — the plan itself flagged this as the preferred, strictly safer approach if achievable as a minimal additive change, and it was"
  - "New-plan tests use a dedicated fixture user, not the file's shared authorToken/authorId, to avoid a cross-describe-block collision with the pre-existing permission-revocation test's simulateDocumentAccessRevocation(authorId, 'DOC-EOP-001') call, which runs earlier in the same test file/process against the same in-memory, module-level access-set map"

patterns-established:
  - "Pre-flight permission check (not pre-planned rollback) is the preferred pattern for 'no orphan on rejection' guarantees when the permission check doesn't structurally depend on the row being created"

# Metrics
duration: 18min
completed: 2026-11-20
---

# Phase 8 Plan 09: POST /api/v1/plans/import — F17's missing "land it as a Plan" step Summary

**New `POST /api/v1/plans/import` route creates a real Draft/v1 plan with `source_document_ref` set (or attaches to an existing in-scope plan), closing the gap where "Import copy"/"Link live" wrote a `document_links` row with `plan_id=NULL` and no Plan was ever created.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-20T17:41:00Z
- **Completed:** 2026-11-20T17:59:22Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Backend half of UAT gap ref 4 (major) closed: clicking "Import copy"/"Link live" in the Plan Repository's Import modal now genuinely creates a reachable Plan, not a silent no-op
- `plans.source_document_ref` — a column that has existed since Phase 3's migration specifically for this moment — is written for the first time by any code path
- Permission-check-before-write ordering guarantees zero orphaned Draft plans survive a rejected import, for BOTH `import_copy` and `link_live` new-plan sub-paths, with no delete-after-the-fact rollback needed
- Existing-plan attach path reuses `fetchPlanRow`'s exact jurisdiction-scope clause, closing a second potential IDOR code path before it could ever open (F-08-01 precedent)
- All document-permission enforcement delegated to the already-shipped, already-tested `importDocument`/`linkDocument` functions — the permission boundary lives in exactly one place

## Task Commits

Each task was committed atomically:

1. **Task 1: POST /api/v1/plans/import route** - `9e4a2d4` (feat)
2. **Task 2: Integration tests (4 new cases)** - `3385080` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/src/modules/plans/plans.ts` - New `POST /api/v1/plans/import` route; creates a Draft/v1 plan with `source_document_ref` set when no `plan_id` given, or attaches to an existing in-scope plan otherwise
- `backend/src/modules/integration-gateway/document-adapter.ts` - New small additive `hasDocumentAccess(userId, externalDocId)` export — a side-effect-free pre-flight check reusing the identical access-set lookup `importDocument`/`linkDocument` already perform internally
- `backend/src/modules/plans/plans.test.ts` - New `describe('POST /api/v1/plans/import — F17 gap closure (UAT ref 4)')` block, 4 new test cases, using a dedicated fixture user to avoid cross-test access-set collision

## Decisions Made
- Took the plan's preferred approach (pre-flight `hasDocumentAccess()` check before any plans-table INSERT) over the delete-after-the-fact rollback fallback it offered as an acceptable alternative — this is strictly safer (no transient orphan window at all, not even one cleaned up after the fact) and required only one small, additive, non-breaking export added to `document-adapter.ts`'s existing surface
- Extended `files_modified` beyond the plan's literal list to include `document-adapter.ts`, exactly as the plan anticipated and explicitly permitted ("mention the additional file touched in your SUMMARY" if this route is taken)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug, test-only] Dedicated fixture user needed for new tests to avoid cross-test access-set collision**
- **Found during:** Task 2 (writing the new-plan import_copy test)
- **Issue:** `document-adapter.ts`'s `SIMULATED_USER_DOCUMENT_ACCESS` map is module-level, in-memory, and keyed by `userId`. The file's pre-existing "document_links permission revocation" describe block calls `simulateDocumentAccessRevocation(authorId, 'DOC-EOP-001')`, permanently revoking `authorId`'s access to `DOC-EOP-001` for the remainder of the test process. Reusing `authorToken`/`authorId` for this plan's own `DOC-EOP-001` import_copy test would have produced a false-negative 403.
- **Fix:** Added a dedicated `importTestId`/`importTestToken` fixture user (seeded in a `beforeAll` inside the new describe block, same jurisdiction/role as the shared fixtures) and used it consistently across all 4 new test cases instead of the shared `authorToken`/`authorId`.
- **Files modified:** backend/src/modules/plans/plans.test.ts
- **Verification:** All 9 tests in the file (5 pre-existing + 4 new) pass; full backend suite (22 files, 152 tests) zero regression.
- **Committed in:** `3385080` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1, test-only — no production code affected)
**Impact on plan:** Purely a test-isolation fix necessitated by shared module-level state between two independent test describe blocks in the same file; zero impact on production behavior or scope.

## Issues Encountered
None — the plan's own spec, including its "re-examine the ordering" note preferring the pre-flight-check approach, was directly achievable and followed exactly.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Backend half of UAT gap ref 4 is fully closed. The frontend half (if any remains — 08-05's `ImportDocumentModal.tsx` already wires "Import copy"/"Link live" buttons to `document-adapter.ts`'s existing routes) is tracked by plan 08-10, not this plan.
- `tsc --noEmit` (backend) and `npm run build -w backend` both clean; full backend suite (22 files, 152 tests, +4 from this plan) zero regression; `npm run seed` re-confirmed idempotent (second run: 0 inserted across every table).
- No blockers for 08-10.

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` against all 3 changed files returned zero hits, and manual review found no hardcoded/stubbed response shapes, empty function bodies, or silently-swallowed errors introduced by this plan.

## Self-Check: PASSED

- `backend/src/modules/plans/plans.ts` — FOUND
- `backend/src/modules/integration-gateway/document-adapter.ts` — FOUND
- `backend/src/modules/plans/plans.test.ts` — FOUND
- `.planning/phases/08-record-authority-sync-integrations/08-09-SUMMARY.md` — FOUND
- Commit `9e4a2d4` (Task 1, feat) — FOUND in git log
- Commit `3385080` (Task 2, test) — FOUND in git log
- Build check: `cd backend && npx tsc --noEmit` → exit 0 (clean); `npm run build -w backend` → exit 0 (clean)
- Full backend suite: 22 files, 152 tests, zero regression (148 pre-existing + 4 new)
- `npm run seed -w backend` re-run twice: idempotent (0 inserted across every table on the second run)
