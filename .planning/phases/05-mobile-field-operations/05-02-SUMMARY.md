---
phase: 05-mobile-field-operations
plan: 02
subsystem: ui
tags: [pwa, indexeddb, offline-first, design-system, react, idb, vite-plugin-pwa, vitest]

# Dependency graph
requires: []
provides:
  - "SyncStatus design-system component (icon+word+color connectivity indicator, exported from window.EPMP)"
  - "frontend/app/src/lib/offline-queue.ts — IndexedDB-backed offline queue with queue-first writes and auto-sync-on-reconnect"
  - "PWA manifest + service worker scaffolding (installable field-mobile app)"
affects: ["05-03", "05-04"]

# Tech tracking
tech-stack:
  added: ["idb ^8.0.0", "vite-plugin-pwa ^0.21.1", "vitest ^2.1.0 (frontend/app)", "fake-indexeddb ^6.0.0", "jsdom ^25.0.0 (frontend/app)"]
  patterns:
    - "Queue-first-write: enqueue persists to IndexedDB before any network attempt is made, never the reverse"
    - "Single derived-state function (getQueueSnapshot) as the one place connectivity+pending-count is computed, consumed via a Set<callback> subscription (subscribeToQueue) rather than per-screen polling"
    - "SyncStatus reuses Button.css's existing ep-btn-spin @keyframes by name instead of duplicating it, since Button is always present in the shipped bundle"

key-files:
  created:
    - frontend/design-system/src/product-patterns/SyncStatus.tsx
    - frontend/design-system/src/product-patterns/SyncStatus.css
    - frontend/design-system/test/product-patterns.test.tsx
    - frontend/app/src/lib/offline-queue.ts
    - frontend/app/src/lib/offline-queue.test.ts
    - frontend/app/vitest.config.ts
    - frontend/app/public/icons/icon-192.png
    - frontend/app/public/icons/icon-512.png
  modified:
    - frontend/design-system/src/index.ts
    - frontend/app/package.json
    - frontend/app/vite.config.ts
    - frontend/app/index.html

key-decisions:
  - "SyncStatus's syncing-state spin animation references Button.css's existing ep-btn-spin keyframe by name rather than duplicating it, since Button is always part of the shipped design-system bundle any SyncStatus consumer also loads"
  - "offline-queue.ts's syncQueueNow sorts pending rows by created_at ascending explicitly rather than relying on IndexedDB getAll()'s implicit ordering, since that ordering is not guaranteed across all IndexedDB implementations"
  - "A network-level sync-batch failure (the whole request rejecting) leaves every attempted item's queue_status unchanged at 'pending' — never marked 'failed' — so it is retried on the next reconnect rather than silently abandoned"
  - "frontend/app/vitest.config.ts kept as a separate config file from playwright.config.ts/e2e/, with vitest scoped to src/**/*.test.ts, so npm run test and npm run test:e2e never collide on the same files"

patterns-established:
  - "Offline-first client libraries persist locally FIRST, sync opportunistically SECOND — no code path tries network before local write"
  - "Connectivity/pending-state derivation lives in exactly one function per domain (getQueueSnapshot), never recomputed ad hoc by consuming screens"

# Metrics
duration: 35min
completed: 2026-11-18
---

# Phase 5 Plan 02: SyncStatus + Offline Queue + PWA Scaffolding Summary

**IndexedDB-backed offline queue (via `idb`) with queue-first writes and auto-sync-on-reconnect, paired with a new `SyncStatus` icon+word+color design-system component and `vite-plugin-pwa`-generated manifest/service-worker for home-screen installability.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-18T14:20:00Z
- **Completed:** 2026-11-18T14:55:00Z
- **Tasks:** 3
- **Files modified:** 12 (8 created, 4 modified)

## Accomplishments

- `SyncStatus` product-pattern component renders a distinct icon+word+color for each of the 4 connectivity states (online/syncing/offline/conflict), rendering a native `<button>` when tappable and a plain `<span>` otherwise — exported from `window.EPMP` per the design system's public contract
- `offline-queue.ts` persists every locally-created field report to IndexedDB immediately, before any network attempt — the literal mechanism satisfying "a page reload or app close while offline does not lose a single queued item"
- A single `getQueueSnapshot`/`subscribeToQueue` pair gives every future field-mobile screen reactive connectivity+pending-count state with zero per-screen IndexedDB polling or `online`/`offline` listener duplication
- `syncQueueNow` POSTs pending items to 05-01's `/api/v1/field-reports/sync-batch`, reconciles per-item synced/conflict/failed results back to local rows, and — critically — leaves a totally-failed request's items `'pending'` (never `'failed'`) so they're retried on the next reconnect rather than abandoned
- The app is now PWA-installable: `npm run build` emits `dist/manifest.webmanifest` and `dist/sw.js`, with `display:standalone` and a `NetworkFirst` runtime cache for `/api/v1/(tasks|me)` GETs

## Task Commits

1. **Task 1: SyncStatus design-system component** - `267ba6c` (feat)
2. **Task 2: Offline queue — IndexedDB persistence + auto-sync-on-reconnect** - `47888de` (feat)
3. **Task 3: Unit tests for offline queue + PWA manifest/service-worker scaffolding** - `6e39e99` (feat)

**Plan metadata:** (this commit)

_Note: Plan 05-01 (backend field-reports/sync-conflicts API) ran in parallel in this same session — its commits (`fc9d51c`, `51a6f23`, `75c45a0`) interleave with this plan's three commits in `git log` but touch entirely disjoint files._

## Files Created/Modified

- `frontend/design-system/src/product-patterns/SyncStatus.tsx` - Connectivity indicator product-pattern component
- `frontend/design-system/src/product-patterns/SyncStatus.css` - Token-only styling, reuses Button's spin keyframe
- `frontend/design-system/src/index.ts` - Added SyncStatus/SyncStatusProps/SyncStatusState to the PRODUCT PATTERNS export block
- `frontend/design-system/test/product-patterns.test.tsx` - 8 Vitest cases: all 4 states render distinct icon+word, detail text, onClick button vs span
- `frontend/app/src/lib/offline-queue.ts` - IndexedDB-backed queue: enqueueFieldReport/getQueueSnapshot/subscribeToQueue/syncQueueNow
- `frontend/app/src/lib/offline-queue.test.ts` - 5 Vitest cases against fake-indexeddb
- `frontend/app/vitest.config.ts` - New, jsdom environment, src/**/*.test.ts scope
- `frontend/app/vite.config.ts` - Added VitePWA plugin (manifest + NetworkFirst runtime caching)
- `frontend/app/index.html` - Added `<meta name="theme-color">` (manifest link/SW registration auto-injected by the plugin)
- `frontend/app/package.json` - Added idb, vite-plugin-pwa, vitest, jsdom, fake-indexeddb; new "test" script
- `frontend/app/public/icons/icon-192.png`, `icon-512.png` - Placeholder solid-color (#1a1a1a) PWA icons, programmatically generated (no ImageMagick/sharp in the sandbox) — a later design pass can replace without touching the manifest's shape

## Decisions Made

- SyncStatus's spin animation references Button.css's existing `ep-btn-spin` `@keyframes` by name instead of duplicating it — keyframes are global CSS and Button is always present in the shipped bundle
- `syncQueueNow` sorts pending rows by `created_at` ascending explicitly, not relying on IndexedDB's implicit cursor-walk ordering
- A network-level sync-batch failure never marks items `'failed'` — only a server-confirmed per-item outcome does; this is what makes "retried, not abandoned" hold
- `frontend/app/vitest.config.ts` is a separate file from `playwright.config.ts`, scoped to `src/**/*.test.ts`, so `npm run test` and `npm run test:e2e` never collide

## Deviations from Plan

None - plan executed exactly as written. One minor implementation note: the plan's own unit-test cases (3 and 4/5) implicitly assumed enqueue's fire-and-forget auto-sync-if-online branch wouldn't interfere with a test's own explicit `syncQueueNow()` call; the actual test file stubs `navigator.onLine = false` during `enqueueFieldReport` calls in those specific tests to avoid a race between the two, which is a test-isolation detail consistent with (not contradicting) the plan's documented behavior.

## Issues Encountered

- No ImageMagick/sharp available in the sandbox to generate the placeholder PNG icons the plan calls for — generated minimal valid solid-color PNGs programmatically via Node's built-in `zlib`/a hand-rolled CRC32, verified via manual PNG-header parsing (correct signature, IHDR width/height). Resolved without external tooling.
- First draft of `offline-queue.test.ts` used `vi.resetModules()` + dynamic re-import per test for isolation, but `fake-indexeddb`'s `deleteDatabase()` blocked indefinitely against a still-open prior connection from the previous module instance, causing 4/5 tests to time out. Resolved by keeping one module instance for the whole file and directly clearing the IndexedDB object store between tests instead.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `SyncStatus` and `offline-queue`'s 4 exported functions are ready for 05-03/05-04 to import directly — both independently proven correct here via their own unit test suites, before any field-mobile screen exists
- The PWA manifest's `start_url: '/field'` anticipates 05-03's field-mobile route; no screen at that path exists yet, which is expected and does not block installability (the manifest is valid regardless of whether `/field` currently 404s)
- No blockers. 05-01's backend `/api/v1/field-reports/sync-batch` endpoint (built in parallel this session) is the exact target `syncQueueNow` already POSTs to — the two plans' request/response shapes were designed against the same documented contract and match without any follow-up fix needed.

## Known Stubs

None found. The two placeholder PNG icon files (`icon-192.png`, `icon-512.png`) are intentionally not final branded assets per the plan's own instruction ("a solid-color square matching the manifest's theme_color is sufficient... a later design pass can replace without touching the manifest's shape") — cosmetic, not blocking: they are valid, correctly-sized PNGs that satisfy the manifest's installability requirement today.

## Self-Check: PASSED

- All 13 created/modified files verified present on disk via `[ -f ]`.
- All 3 task commits (`267ba6c`, `47888de`, `6e39e99`) verified present via `git log --oneline --all`.
- Build check: `npm run build -w frontend/design-system -w frontend/app` → exit 0 (design-system bundle + app `dist/manifest.webmanifest` + `dist/sw.js` all generated).
- `npx tsc --noEmit` clean in both `frontend/design-system` and `frontend/app`.
- Full `frontend/design-system` Vitest suite: 59/59 passed (including this plan's new 8 `product-patterns.test.tsx` cases).
- `frontend/app`'s new `offline-queue.test.ts`: 5/5 passed against `fake-indexeddb`.
- No blocking stubs found (see Known Stubs above).

---
*Phase: 05-mobile-field-operations*
*Completed: 2026-11-18*
