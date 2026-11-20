---
phase: 7
status: clean
blockers: 0
warnings: 0
files_reviewed: 4
files_reviewed_list:
  - backend/src/modules/integration-gateway/hazard-feed-adapter.ts
  - frontend/app/package.json
  - package-lock.json
  - .planning/phases/07-operating-picture-read-overlays-weather-dispatch/07-REVIEW.md
reviewed_at: 2026-11-20T10:52:00Z
iteration: 2
---

# Phase 7 Code Review (iteration 2 — re-review of fixer's commits)

Scope: verify iteration-1's W1 and W2 fixes (commits `461ed2e`, `ad72c74`, docs commit `87b4095`) are real, correct, and free of fix-introduced regressions. Per the prompt, this is scoped to the previously reviewed files list plus files the fixer touched — not a from-scratch re-review of the full phase diff.

## W1 verification — hazard-layer verify 404 guard

**File:** `backend/src/modules/integration-gateway/hazard-feed-adapter.ts:257-267`

The fix adds exactly what iteration 1 asked for: a `SELECT id FROM hazard_layers WHERE id = $1` existence check inserted between the `verified_by` identity-equality check (403 path, unchanged) and the `UPDATE ... SET verified = true` mutation. On zero rows it returns `404 { error_code: 'HAZARD_LAYER_NOT_FOUND' }` before touching the database, matching the `fetchIncidentForMutation` / `INCIDENT_NOT_FOUND` convention in `incidents.ts` referenced by the original finding.

Checked for regressions:
- Ordering is correct — the identity check still runs first (an unauthenticated/wrong-identity caller gets 403 regardless of whether the id is real, which is the right precedence: don't leak existence info to a caller who isn't even verifying as themselves... though in this case the error message is generic enough either way).
- The existing passing test (`operating-picture.test.ts:318`, "rejects a mismatched verified_by, and succeeds for the caller's own id") still exercises both the 403 and 204 paths with a real `layerId` fixture, so the new guard's "existing row" branch is covered. Ran it live against the compose stack: **11/11 tests pass**, including this one, confirmed via direct test run (not just trusting the commit log) — `req-c` (mismatch) → 403, `req-d` (own id) → 204.
- No test explicitly exercises the new 404 branch (a request with a syntactically-valid-but-nonexistent UUID), but the code path is a straightforward early-return mirroring an already-proven pattern elsewhere in the codebase; this is a minor coverage gap, not a defect — not escalating to a WARNING since the logic is simple, correct on inspection, and type-checks clean (`tsc --noEmit` on backend: no output, clean).
- No change to the route's registration, permission gate, or response shape for the two pre-existing paths (403/204) — confirmed by diff: only 12 lines inserted, nothing else touched.

**Verdict: fix is correct, complete, and regression-free.**

## W2 verification — `@epmp/backend` devDependency declaration

**File:** `frontend/app/package.json`, `package-lock.json`

The fix adds `"@epmp/backend": "*"` to `frontend/app/package.json`'s `devDependencies`, in the same style as the pre-existing `"@epmp/design-system": "*"` workspace-reference entry, and the corresponding `package-lock.json` workspace entry is updated in lockstep (both files modified in the same commit, `ad72c74`).

Checked for regressions:
- `npm ls @epmp/backend --workspace=frontend/app` resolves correctly: `@epmp/app@0.1.0 -> ./frontend/app` now depends on `@epmp/backend@0.1.0 -> ./backend`, confirming the workspace link is live, not just declared-and-dangling.
- `package-lock.json`'s `node_modules/@epmp/backend` entry (`"resolved": "backend", "link": true`) is unchanged by this commit — it already existed as a root-level workspace link before this fix; the fix only adds the explicit consumer-side declaration in `frontend/app`'s own dependency list, which is exactly the "declare the coupling" fix direction iteration 1 recommended. No new package version, no new transitive dependency tree, no conflicting version constraint introduced.
- `tsc --noEmit` in `frontend/app`: clean, no output.
- The import site itself (`frontend/app/e2e/incident-workspace-dispatch-status.spec.ts:4`, `import { fetchCadDispatchEvents } from '../../../backend/src/modules/integration-gateway/cad-adapter'`) is unchanged — the fix doesn't touch the spec, only the dependency declaration, which is the correct minimal-diff resolution for a "declare existing implicit coupling" finding.

**Verdict: fix is correct, minimal, and regression-free.**

## Docs commit (`87b4095`)

Appends the two "Resolution:" paragraphs to iteration 1's `07-REVIEW.md` under each WARNING — administrative only, no source change, nothing to review.

## Cross-file seams checked

- `hazard-feed-adapter.ts` verify route → `operating-picture.test.ts`'s existing verify test: both paths (403, 204) still pass live against the running stack post-fix — OK
- `frontend/app/package.json` → `package-lock.json` workspace entry: declaration and lockfile in sync, `npm ls` confirms live resolution — OK
- Fixer's commits touched only the two files flagged in iteration 1 (plus the lockfile and the review doc itself) — no incidental touches to unrelated phase-7 files, so the iteration-1 "Cross-file seams checked" section (routes↔schema, UI↔API shapes, job_type isolation, etc.) remains valid and unaffected by these two commits — not re-verified from scratch per the re-review scope, but no fixer-touched file intersects with any of those seams.

## Conclusion

Both iteration-1 WARNINGs are genuinely fixed, verified against the live compose stack (not just commit-message trust), and introduce no new defects. No new findings in the fixer's commits. Phase 7 is clean.

## Post-gate fix pass — browser suite BLOCKERs (2026-11-20, same day)

Phase 7's browser-suite gate found 2 real, phase-7-introduced test failures in `incident-workspace-dispatch-status.spec.ts` (a 3rd, in `field-mobile-sync-conflict.spec.ts`, is the pre-existing Phase-5 test-isolation flake documented in `05-06-SUMMARY.md`/STATE.md, unrelated to Phase 7, not touched).

### B1 — shared `cad_dispatch_events` fixture re-linked away from seed by `incidents.test.ts`'s own CAD-matching test

Root cause confirmed exactly as diagnosed: `incidents.test.ts`'s "after runCadIngestion() links a dispatch event by shared number..." test creates its own `CAD-UAT-001 Matchable Incident {ts}` fixture in `testJurisdictionId` and calls `runCadIngestion()`, which deterministically re-links the ONE shared `UAT-CAD-001` row (ORDER BY opened_at DESC, no sticky behavior) away from seed.ts's `UAT-ESCALATE-READY Default Agency Wildfire` incident. Running `npm test` (backend) before the Playwright suite — the exact sequence CI performs — permanently broke the e2e fixture until a manual `npm run seed`.

**Resolution: fixed (aac30df)** — chose **option (a)**: added an `afterAll` hook, scoped to the `07-02: F15 CAD/911 dispatch-status` describe block only, that restores the shared row's `linked_incident_id` back to the seed's `UAT-ESCALATE-READY Default Agency Wildfire` incident after that describe block's tests complete. Option (b) (a dedicated non-shared CAD config/external_event_id for this test) was considered but rejected — the test's own stated purpose is proving the REAL "shared number" matching behavior against the REAL stub's one fixed `external_event_id`/`cad_incident_number`, so faking a second config would test a different, less faithful contract. Verified: full backend suite (19 files, 119 tests) green; direct psql query after the full suite run confirms `UAT-CAD-001` → `UAT-ESCALATE-READY Default Agency Wildfire` (Default Agency jurisdiction), matching the required post-condition exactly.

### B2 — `incident-workspace-dispatch-status.spec.ts` test 4 imports backend source directly into the Playwright process

Root cause confirmed exactly as diagnosed: test 4 imported `fetchCadDispatchEvents` from backend source and called it in the Playwright test runner's own Node process, which has no `DATABASE_URL` set (only the real backend server process does) — crashing with "no PostgreSQL user name specified in startup packet". This is the same cross-process env assumption iteration-1's W2 only partially addressed (declaring the workspace dependency, not fixing the underlying pattern).

**Resolution: fixed (d13e883, f119b85)** — mirrored `operating-picture.ts`'s `force_gis_failure` pattern exactly, per the established precedent:
- **d13e883** (backend): added `GET /api/v1/_test/cad-forced-outage` to `cad-adapter.ts`'s `cadRoutes`, gated on `requirePermission('incidents', 'view')` (same grant commander@epmp.local's seeded role already holds). The route calls `fetchCadDispatchEvents(undefined, true)` SERVER-SIDE inside the already-running backend process (real `DATABASE_URL`-backed pool), catches the deterministic `CAD_FEED_UNREACHABLE` throw, and returns `200 { forced: true, message }`. Exposed as a dedicated route rather than a query param on an existing route because `fetchCadDispatchEvents` is this adapter's own live-fetch boundary, not a parameter of `GET /api/v1/incidents/:id/dispatch-status` (which only ever reads the already-cached `cad_dispatch_events` table).
- **f119b85** (frontend): removed the direct backend-source import; test 4 now calls the new route via `page.evaluate(() => fetch(...))` reading the session token out of `sessionStorage`, the exact `apiGetViaPage`-style pattern already established by `operating-picture-resource-markers.spec.ts`, `tasks-resources.spec.ts`, and others. Removed the now-unneeded `@epmp/backend` devDependency from `frontend/app/package.json` (confirmed via grep it was the only consumer) and regenerated `package-lock.json` (1-line diff).

Verified: `tsc --noEmit` clean in both `backend` and `frontend/app`; `npm run build` clean in `backend`; live Playwright run of `incident-workspace-dispatch-status.spec.ts` — **4/4 pass**; sibling spec `operating-picture-hazard-layers.spec.ts` — **3/3 pass**, confirming no regression from the shared-fixture restoration in B1.

**Commits:** `aac30df` (B1), `d13e883` (B2 server-side route), `f119b85` (B2 spec + dependency cleanup).

## Post-gate fix pass #2 — B1's `afterAll` restore defeated by the live scheduler (2026-11-20, same day)

B1's `afterAll` restore hook (`aac30df`) fixed the symptom (restores the shared row immediately after the backend test file runs) but not the root cause: `runCadIngestion`'s "shared number" incident-matching re-ran its ILIKE name-search on EVERY 5-minute scheduler tick, forever, against ANY incident whose name happened to contain `CAD-UAT-001` — including the 14 (and counting) `CAD-UAT-001 Matchable Incident ...` fixtures this test file's own matching test had accumulated across repeated runs in this long-lived dev database. The live `startCadIngestionScheduler()` process re-broke the restored link on its own next tick, independent of any test run, confirmed reproducible (`afterAll` fix passed, then failed again ~17 minutes later from background ticking alone).

**Resolution: fixed (`a9f963a`, `5cfd182`)** — chose the **sticky-once-matched** fix direction (option 2 of the three offered), not the "exclude non-Open status" direction, because all 14 stale fixture incidents were themselves `status = 'Open'` (confirmed via `\d incidents` + a direct query before choosing) — status-filtering alone would not have stopped the re-match. `cad-adapter.ts`'s `runCadIngestion` now checks for an existing valid `linked_incident_id` (joined against `incidents` to confirm the row still exists) before running the ILIKE search; if one exists, it's preserved untouched, and the name-match search only runs for a first-time match. The function's own docstring (previously documenting "not sticky, re-evaluated every tick" as an intentional design choice) is updated to explain the reversal and why.

`incidents.test.ts`'s `07-02` describe block required two changes to stay correct against the new contract (not weakened — the existing test's own purpose, proving the first-time "shared number" match end-to-end, still holds, it just needs to explicitly clear the existing link first since a second+ call to `runCadIngestion()` no longer re-searches): (1) the "after runCadIngestion() links..." test now nulls the shared row's `linked_incident_id` before calling `runCadIngestion()`, to deterministically exercise the first-time-match branch; (2) a new test, "a SECOND runCadIngestion() tick does NOT re-link... (sticky-once-matched)", was added that directly proves the sticky contract by creating a second, newer competing fixture and asserting the link holds — this is the exact scenario that caused the original bug.

Verification performed:
- `backend`: `tsc --noEmit` clean, `npm run build` clean.
- Full backend suite: 19 files, 120 tests green (was 119; +1 new sticky-proof test).
- psql post-suite: `cad_dispatch_events.linked_incident_id` → `UAT-ESCALATE-READY Default Agency Wildfire` (seed-intended target), confirmed.
- **Live-scheduler proof (critical, not skippable):** a throwaway one-off script (`npx tsx` against the live `DATABASE_URL`, deleted after use) created a NEW, more-recently-opened `CAD-UAT-001`-matching incident and called `runCadIngestion()` directly — simulating the live running backend process's next scheduler tick without restarting it. The existing link to the seed incident held unchanged. This is the direct substitute for waiting a real 5 minutes, per the fix-pass instructions.
- Playwright: `incident-workspace-dispatch-status.spec.ts` — **4/4 pass**, re-run live against the already-running stack (ports 5173/8080, not restarted).

Cleanup performed: the 14 (18 by the time of cleanup, due to additional runs during this investigation) accumulated `CAD-UAT-001 Matchable Incident ...` stale fixture incidents could NOT be hard-deleted as the finding's suggested SQL assumed — `incident_timeline` is a genuinely append-only table (`trg_incident_timeline_immutable` trigger rejects DELETE/UPDATE, confirmed via `\d incident_timeline`), and every one of these fixtures has a `incident_timeline` row referencing it (the "Incident created" row every `POST /api/v1/incidents` call writes) — an intentional production invariant (audit-trail immutability), not test pollution, and not something this fix pass's scope permits loosening. Instead, all 18 stale fixtures were set to `status = 'Closed'` (a supported, reversible state transition), neutralizing them as re-match targets for any future status-aware logic without violating the append-only guarantee. This is a cleanup action, not a correctness dependency of the sticky fix itself (the sticky fix holds regardless of these rows' status, as proven above).

**Commits:** `a9f963a` (production fix, cad-adapter.ts), `5cfd182` (test updates, incidents.test.ts).
