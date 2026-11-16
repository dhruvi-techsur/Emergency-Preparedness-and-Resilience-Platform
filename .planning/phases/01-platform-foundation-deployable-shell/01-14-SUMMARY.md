---
phase: 01-platform-foundation-deployable-shell
plan: 14
subsystem: infra
tags: [dev-tooling, readme, docs, gap-closure, sso, uat]

# Dependency graph
requires:
  - phase: 01-platform-foundation-deployable-shell
    provides: "01-01 root package.json dev script; 01-10 Vite dev server on 5173 with OIDC sign-in flow; 01-13 pivota-deploy.yaml declaring port 8080 (production)"
provides:
  - "package.json dev script startup banner naming http://localhost:5173 (sign-in UI) vs http://localhost:8080 (backend-only API) before any other step runs"
  - "README.md Development section documenting the 5173/8080 native-dev-mode port split and why 8080 shows a bare JSON 404 until a production build exists"
affects: [init-dev-server (platform workflow, out of this phase's scope), future-UAT-reruns]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Pre-flight echo banner in a root dev script naming every port a developer could land on, printed before any service starts"]

key-files:
  created: []
  modified: ["package.json", "README.md"]

key-decisions:
  - "This plan deliberately does NOT write .pivota/start-dev.sh — per runtime-environment.md §7a that file is generated only by the platform's init-dev-server workflow, and the UAT's own root-cause diagnosis (.planning/debug/no-sign-in-option-reachable.md) is explicit that the absence of that file is the actual root cause, not any defect in this phase's application code"
  - "Banner text is prepended to the existing dev script string via a single additive echo && chain — zero reordering or removal of the three pre-existing steps (compose up, design-system build, concurrently with its 3 named processes), keeping this a strictly additive dev-tooling change with zero production/Dockerfile impact (confirmed: Dockerfile's CMD runs node backend/dist/server.js directly, never npm run dev)"

patterns-established:
  - "In-repo UAT gap mitigation that explicitly documents the boundary of what's fixable from application code vs. what requires a separate platform workflow, rather than silently declaring partial closure as full closure"

# Metrics
duration: 8min
completed: 2026-11-16
---

# Phase 1 Plan 14: Dev-Mode Port Banner & README Documentation Summary

**Root `npm run dev` now prints a startup banner naming `http://localhost:5173` as the sign-in UI before docker compose/concurrently launch, and README.md documents why `8080` (the backend's/`pivota-deploy.yaml`'s port) shows a bare JSON 404 with no sign-in option in native dev mode.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-11-16T09:45:00Z
- **Completed:** 2026-11-16T09:53:11Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- `package.json`'s `dev` script now begins with an `echo` banner naming both `http://localhost:5173` (sign-in UI, call it out explicitly) and `http://localhost:8080` (backend-only API, no UI until a production build exists), printed before docker compose starts any service
- Every pre-existing step of the `dev` script (docker compose up for db/nats/opa/keycloak, design-system build, concurrently running design-system/backend/frontend dev servers) preserved byte-for-byte except for the prepended banner
- `README.md` gained a `## Development` section explaining: how to start the stack, which port to open in a browser (5173), why 8080 returns a bare 404 in dev mode (`frontend/app/dist` doesn't exist until `vite build` runs), and that `pivota-deploy.yaml`'s `port: 8080` refers to the *production/deployed* port where the Dockerfile's build stage has already run `vite build`

## Task Commits

Each task was committed atomically:

1. **Task 1: Dev-mode port banner + README documentation** - `ae5726d` (docs)

_Note: single-task plan, no plan-metadata-only commit was needed beyond the SUMMARY/STATE commit that follows this one._

## Files Created/Modified
- `package.json` - `dev` script now opens with an `echo` banner naming 5173 (sign-in UI) and 8080 (backend-only API) before its three pre-existing steps run unchanged
- `README.md` - New `## Development` section documenting the native-dev-mode 5173/8080 port split, why 8080 shows no UI until a production build exists, and the distinction from `pivota-deploy.yaml`'s production-mode 8080

## Decisions Made
- Did not write `.pivota/start-dev.sh` — that file is generated exclusively by the platform's `init-dev-server` workflow (runtime-environment.md §7a), which is outside this phase's repository scope. Attempting to author it here would both exceed this plan's explicitly stated scope and risk conflicting with whatever `init-dev-server` generates when it eventually runs for this project.
- Kept the banner as a single additive `echo '...' &&` prefix rather than restructuring the dev script into multiple commands, to minimize diff surface and guarantee the three pre-existing steps (compose up, design-system build, concurrently) are provably unchanged (verified via `grep -n "docker compose up -d db nats opa keycloak" package.json`)

## Deviations from Plan

None - plan executed exactly as written. The plan itself explicitly frames this as a partial, in-repo-only mitigation and instructs not to attempt the actual root-cause fix (`.pivota/start-dev.sh`), which was followed precisely.

## Issues Encountered

During the plan-level build verification (required by the executor's test_execution_boundary step, run once after the last task), `npm run build -w backend` initially failed with `sh: 1: tsc: not found` because this sandbox had never run `npm install` for this project's dependencies. This is a pre-existing environment-bootstrap gap unrelated to this plan's own 2-line docs/config change — not a deviation under Rule 1–3 since it isn't something this task's changes caused, and not a architectural concern under Rule 4. Resolved by running `npm install --include=dev` (per runtime-environment.md §4, devDependencies must be installed, never `--omit=dev`/`NODE_ENV=production` before a build) at the root, after which `npm run build -w backend` (`tsc -p tsconfig.json`) completed with exit code 0 and no errors. This install is a one-time sandbox-session bootstrap step, not a change to any tracked file (package-lock.json was already up to date — `git status` showed no diff from the install), so nothing further was committed for it.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 1 (`01-platform-foundation-deployable-shell`) now has all 14 completed plans; `01-15-PLAN.md` (WCAG contrast audit gap closure) remains the final plan before Phase 1 is fully complete.
- **Important caveat on UAT gap ref 3 ("there is no sign in option"):** this plan closes everything achievable from this phase's own repository code. It does **not** fully close the gap — full closure requires the platform's `init-dev-server` workflow to run for this project and generate `.pivota/start-dev.sh` routing a preview session to port 5173 (or orchestrating both 5173 and 8080). Any future UAT re-run that still lands a human on port 8080 directly (bypassing `.pivota/start-dev.sh`) will still reproduce the original symptom — that is expected and is not a regression in this phase's code; it is the same platform-level gap previously diagnosed in `.planning/debug/no-sign-in-option-reachable.md`.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- `package.json` exists on disk and contains `5173` in its `dev` script: CONFIRMED (`grep -n "5173" package.json`)
- `README.md` exists on disk and contains both `5173` and `8080`: CONFIRMED (`grep -n "5173" README.md && grep -n "8080" README.md`)
- Commit `ae5726d` exists in git history: CONFIRMED (`git log --oneline` shows `ae5726d docs(01-14): add dev-mode port banner and README 5173/8080 split`)
- Plan-level build check: `npm run build -w backend` (`tsc -p tsconfig.json`) → exit 0, no errors (after `npm install --include=dev` to bootstrap this sandbox session's previously-uninstalled node_modules — see Issues Encountered)
- `## Known Stubs` scan of the diff (`package.json`, `README.md`) for `TODO|FIXME|placeholder|not.?implemented|coming soon`: none found

## Known Stubs

None found.
