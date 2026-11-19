---
phase: 05-mobile-field-operations
plan: 03
subsystem: mobile-field-ops
tags: [react, offline-first, indexeddb, geolocation, field-mobile, playwright]

# Dependency graph
requires:
  - phase: 05-01
    provides: "field_reports/sync_conflicts/field_report_photos backend data layer + POST /api/v1/field-reports, POST /api/v1/field-reports/sync-batch, POST /api/v1/field-reports/:id/photos endpoints"
  - phase: 05-02
    provides: "SyncStatus design-system component + offline-queue.ts (IndexedDB-backed, enqueueFieldReport/getQueueSnapshot/subscribeToQueue/syncQueueNow) + PWA scaffolding"
  - phase: 05-05
    provides: "real seeded field_responder Keycloak identity (field-responder@epmp.local) + signInAsFieldResponder Playwright helper + idempotent field_reports role_permissions grants"
provides:
  - "FieldMobileShell — shared wrapper pinning SyncStatus at the top of every field-mobile screen, used by this plan's 3 screens and 05-04's remaining 3"
  - "Field Home (/field) — today's tasks list + Report observation primary action"
  - "My Tasks field view (/field/tasks) — one-tap Start/Mark done, offline-queueable via a new tasks_status IndexedDB object store"
  - "Report Observation (/field/report) — structured form with one-tap photo/location capture, offline-first queue-first submit"
  - "offline-queue.ts extended with enqueueTaskStatusChange + a second tasks_status object store (DB_VERSION 1->2)"
  - "api-client.ts extended with uploadFieldReportPhoto (multipart FormData upload)"
  - "design-system Icon.tsx extended with a 'camera' glyph"
affects: [05-04-mobile-field-operations, F6-mobile-field-operations]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Offline-queue extension pattern: a feature needing a second queued-write type (task-status changes) extends the EXISTING IndexedDB database with a second object store via an idb upgrade-callback version bump, rather than standing up a parallel queue mechanism"
    - "Field-mobile shared-shell pattern: one wrapper component owns SyncStatus subscription + rendering so every screen gets reactive connectivity state for free, without each screen independently subscribing"
    - "Queue-first-write invariant: submit handlers call the offline-queue's enqueue* function directly, never a raw apiPost/apiPatch, so a submission is persisted to IndexedDB before any network attempt regardless of connectivity"

key-files:
  created:
    - frontend/app/src/lib/field-mobile-shell.tsx
    - frontend/app/src/pages/field-mobile/FieldHome.tsx
    - frontend/app/src/pages/field-mobile/FieldHome.css
    - frontend/app/src/pages/field-mobile/MyTasksField.tsx
    - frontend/app/src/pages/field-mobile/ReportObservation.tsx
    - frontend/app/src/pages/field-mobile/ReportObservation.css
    - frontend/app/e2e/field-mobile-report.spec.ts
  modified:
    - frontend/app/src/lib/offline-queue.ts
    - frontend/app/src/lib/offline-queue.test.ts
    - frontend/app/src/lib/api-client.ts
    - frontend/design-system/src/foundations/Icon.tsx
    - frontend/app/src/main.tsx

key-decisions:
  - "offline-queue.ts's IndexedDB gets a SECOND object store (tasks_status, DB_VERSION 1->2) for queued task-status changes rather than a parallel queue mechanism — one offline-queue, not two"
  - "My Tasks' status-update tap degrades any apiPatch failure (not just navigator.onLine===false) to the same queued path, since a field app should never make a tap feel lost regardless of why the network call failed"
  - "Report Observation's photo upload is best-effort-online-only in this plan's scope (not IndexedDB-queued) — enqueueFieldReport already guarantees the report text/location is never lost; a documented, bounded gap matching the mockup's own 'photo upload failed post-reconnect' state"
  - "This plan wires its own 3 field-mobile routes into main.tsx (field, field/tasks, field/report) rather than leaving them for 05-04, since this plan's own Playwright spec needs them live to prove the offline-first submit flow end-to-end"
  - "SyncStatus's tap in FieldMobileShell always navigates to /field/queued, even in 'conflict' state — a specific conflict is reached from a Queued Submissions View row's own conflict_id (05-04), not from this global tap which has no single id to deep-link to"
  - "camera icon added to the design system's Icon component — no prior Phase 1-4 screen needed one, following the 'screen that first needs a primitive adds it' precedent"

patterns-established:
  - "Field-mobile screens compose FieldMobileShell (SyncStatus pinned top) + their own content, never the generic AppShell PageHeader — field-mobile is a distinct page pattern per the UX mockup"

# Metrics
duration: 35min
completed: 2026-11-18
---

# Phase 5 Plan 3: Field Home, My Tasks, Report Observation Summary

**Field Home/My Tasks/Report Observation screens built on a new FieldMobileShell wrapper, with My Tasks' status updates and Report Observation's submit both queue-first through offline-queue.ts (extended with a second tasks_status IndexedDB store), proven end-to-end via Playwright against the real 05-01 backend using 05-05's seeded field-responder identity.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-18T14:21:00Z
- **Completed:** 2026-11-18T14:57:06Z
- **Tasks:** 3 completed
- **Files modified:** 12 (7 created, 5 modified)

## Accomplishments
- Built `FieldMobileShell`, the shared wrapper pinning `SyncStatus` at the top of every field-mobile screen (reused by this plan's 3 screens and 05-04's remaining 3), subscribed reactively to the offline-queue via `subscribeToQueue`
- Built Field Home (`/field`) — today's tasks list via `GET /api/v1/tasks?owner={id}`, correct Badge status tones, Skeleton loading state, informational-only EmptyState, and a single `size="lg"` primary "Report observation" sticky bottom action
- Built My Tasks field view (`/field/tasks`) — one-tap Start/Mark done buttons that PATCH directly when online (degrading any failure to the queued path) or queue via a NEW `tasks_status` IndexedDB object store when offline, with an immediate "Queued" Badge overlay
- Built Report Observation (`/field/report`) — Select/TextField fields, one-tap photo capture (hidden file input with `capture="environment"`) with thumbnail + "✓ Captured" confirmation, one-tap Geolocation capture with exact lat/long/accuracy text confirmation, client-side empty-report validation matching the FRD's exact message, and a submit path that ALWAYS calls `enqueueFieldReport` (queue-first, regardless of connectivity) with `captured_at` set at the moment of tap
- Extended `offline-queue.ts` with `enqueueTaskStatusChange` + a second `tasks_status` object store (idb upgrade-callback version bump 1→2) and extended `syncQueueNow` to process both stores on reconnect
- Added a `camera` icon to the design system and `uploadFieldReportPhoto` (multipart FormData) to `api-client.ts`
- Wired this plan's 3 field-mobile routes into `main.tsx` so the Playwright spec could exercise them against a real running app
- Playwright spec (`field-mobile-report.spec.ts`) proves both the exact empty-report validation message and the full queue-first submit-then-navigate flow against the real compose stack, signing in as 05-05's real seeded `field-responder@epmp.local` identity

## Task Commits

Each task was committed atomically:

1. **Task 1: FieldMobileShell + Field Home** - `6a679fe` (feat)
2. **Task 2: My Tasks (field view) — one-tap offline-queueable status updates** - `d1f8340` (feat)
3. **Task 3: Report Observation — photo/location capture, offline-first submit, Playwright coverage** - `90c7ce2` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/lib/field-mobile-shell.tsx` - Shared `FieldMobileShell` wrapper pinning `SyncStatus`
- `frontend/app/src/pages/field-mobile/FieldHome.tsx` / `.css` - Field Home landing screen
- `frontend/app/src/pages/field-mobile/MyTasksField.tsx` - My Tasks field view, one-tap status updates
- `frontend/app/src/pages/field-mobile/ReportObservation.tsx` / `.css` - Structured observation form
- `frontend/app/src/lib/offline-queue.ts` - Added `tasks_status` object store + `enqueueTaskStatusChange`, extended `syncQueueNow`
- `frontend/app/src/lib/offline-queue.test.ts` - Fixed to open at the new `DB_VERSION` 2 and mock `apiPatch`
- `frontend/app/src/lib/api-client.ts` - Added `uploadFieldReportPhoto` multipart helper
- `frontend/design-system/src/foundations/Icon.tsx` - Added `camera` glyph
- `frontend/app/src/main.tsx` - Wired `field`/`field/tasks`/`field/report` routes
- `frontend/app/e2e/field-mobile-report.spec.ts` - Playwright coverage of the empty-report-validation + queue-first-submit flow

## Decisions Made
- `offline-queue.ts` extended with a SECOND IndexedDB object store (`tasks_status`) rather than a parallel queue mechanism — one offline-queue, not two, per the plan's own explicit instruction
- My Tasks' status-tap treats ANY `apiPatch` failure (not just `navigator.onLine===false`) as "couldn't reach the server right now" and degrades to the queued path — a field app should never make a tap feel lost
- Report Observation's photo upload stays best-effort-online-only in this plan's scope (documented, bounded gap — the report text/location is never lost regardless)
- This plan's own 3 field-mobile routes (`field`, `field/tasks`, `field/report`) were wired into `main.tsx` now, rather than left entirely for 05-04, because this plan's own Playwright spec needed them live; 05-04 appends its remaining 3 routes + bottom-nav wiring following the established append-not-overwrite convention
- `FieldMobileShell`'s `SyncStatus` tap always navigates to `/field/queued`, even in `conflict` state, since a specific conflict's deep link comes from a Queued Submissions View row (05-04), not from this global tap

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed `offline-queue.test.ts` breakage from the `tasks_status` object-store addition**
- **Found during:** Task 2 (My Tasks field view — extending `offline-queue.ts`)
- **Issue:** Bumping `DB_VERSION` from 1 to 2 (to add the `tasks_status` object store) broke the existing unit test's `clearQueueStore()` helper, which hardcoded `indexedDB.open(DB_NAME, 1)` — fake-indexeddb throws `VersionError: An attempt was made to open a database using a lower version than the existing version` once `offline-queue.ts`'s own `getDb()` has already opened the database at version 2. The test file's mocked `./api-client` module also didn't export `apiPatch`, which `syncQueueNow`'s new tasks_status-sync branch now imports.
- **Fix:** Updated the test helper to open at version 2 (with an inline comment explaining why), and added `apiPatch: vi.fn()` to the `vi.mock('./api-client', …)` factory.
- **Files modified:** `frontend/app/src/lib/offline-queue.test.ts`
- **Verification:** All 5 existing offline-queue unit tests pass (`npx vitest run src/lib/offline-queue.test.ts`); full `frontend/app` vitest suite green.
- **Committed in:** `d1f8340` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was a direct, necessary consequence of this plan's own `tasks_status` object-store addition — no scope creep, no behavior change to the test's actual assertions.

## Issues Encountered
None — the plan's own `<verify>` commands for Task 3 required the full compose stack + backend/frontend dev servers; these were already running per the environment note, and the Playwright spec passed on the first run with no debugging needed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `FieldMobileShell`, `FieldHome`, `MyTasksField`, `ReportObservation` are all built, routed, and proven end-to-end — ready for 05-04 to build on top of (`QueuedSubmissions`, `SyncConflictResolution`, `FieldMap`, plus the remaining 3 routes and bottom-nav wiring)
- `offline-queue.ts`'s `tasks_status` object store and `enqueueTaskStatusChange`/extended `syncQueueNow` are available for 05-04's Queued Submissions View to read directly
- No blockers — 05-04 explicitly depends on this plan (`05-01`, `05-02`, `05-03`, `05-05`) and all 4 are now complete

## Known Stubs
None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across every file created/modified this plan returned no matches. Report Observation's photo-upload-is-online-only limitation is a documented, bounded scope decision (see Decisions Made above), not an unfinished stub — the report itself (text/location) is never lost regardless of connectivity.

## Self-Check: PASSED

- `[ -f frontend/app/src/lib/field-mobile-shell.tsx ]` → FOUND
- `[ -f frontend/app/src/pages/field-mobile/FieldHome.tsx ]` → FOUND
- `[ -f frontend/app/src/pages/field-mobile/MyTasksField.tsx ]` → FOUND
- `[ -f frontend/app/src/pages/field-mobile/ReportObservation.tsx ]` → FOUND
- `[ -f frontend/app/e2e/field-mobile-report.spec.ts ]` → FOUND
- `git log --oneline --all --grep="05-03"` → 3 task commits found (`6a679fe`, `d1f8340`, `90c7ce2`)
- Build check: `cd frontend/app && npm run build` → exit 0 (Vite build + PWA precache succeeded)
- Build check: `cd backend && npm run build` → exit 0 (unaffected, confirmed clean)
- Playwright: `npx playwright test e2e/field-mobile-report.spec.ts --workers=1` → 1 passed
- Vitest: `npx vitest run` (frontend/app) → 5 passed; `npx vitest run` (design-system) → 59 passed
- All 7 integration_contracts `verify` greps → CONTRACT_OK

---
*Phase: 05-mobile-field-operations*
*Completed: 2026-11-18*
