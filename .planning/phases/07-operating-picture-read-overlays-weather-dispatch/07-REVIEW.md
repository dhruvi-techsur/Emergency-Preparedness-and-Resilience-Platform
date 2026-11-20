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
