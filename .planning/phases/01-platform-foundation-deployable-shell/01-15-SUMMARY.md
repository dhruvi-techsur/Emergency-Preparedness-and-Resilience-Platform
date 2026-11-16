---
phase: 01-platform-foundation-deployable-shell
plan: 15
subsystem: ui
tags: [design-tokens, wcag, accessibility, axe-core, playwright, contrast]

# Dependency graph
requires:
  - phase: 01-platform-foundation-deployable-shell
    provides: "01-02's tokens.json/tokens.css theme system ([data-theme] light/dark/contrast), 01-10's signInThroughKeycloak e2e helper"
provides:
  - "Corrected --ink-disabled token values (light and dark themes) that meet WCAG AA 4.5:1 against their theme's --bg"
  - "Permanent automated WCAG contrast-ratio regression spec (frontend/app/e2e/contrast-audit.spec.ts) using @axe-core/playwright, covering all three themes against the live signed-in AppShell and a DatePicker-bearing admin page"
affects: [design-system/tokens, frontend/app/e2e, future-phases-test-gates]

# Tech tracking
tech-stack:
  added: ["@axe-core/playwright ^4.14.0"]
  patterns:
    - "Automated axe-core color-contrast scans per theme, driven through the real ThemeSwitcher UI interaction (not synthetic data-theme DOM mutation), reused across future phases' test gates"

key-files:
  created: [frontend/app/e2e/contrast-audit.spec.ts]
  modified: [frontend/design-system/tokens/tokens.json, frontend/design-system/tokens/tokens.css, frontend/app/package.json, package-lock.json]

key-decisions:
  - "Light theme --ink-disabled corrected to #6c7680 (4.62:1 against #ffffff) — close to the plan's own suggested value, verified by direct sRGB-luminance computation rather than assumed"
  - "Dark theme --ink-disabled corrected to #6c8499 (4.66:1 against #0a1722) by proportionally lightening the original #5d7284 hue (1.16x scale factor) rather than picking an arbitrary hex, keeping the same blue-grey hue family as the rest of the dark palette"
  - "Contrast theme's --ink-disabled left untouched (#5a6a78, already 5.57:1 — passing)"

patterns-established:
  - "contrast-audit.spec.ts is a permanent regression asset: any future component/token change that regresses WCAG AA contrast on the AppShell or an admin page fails this spec automatically, closing the gap UAT identified (missing automated verification tool, not just a manual eyeball check)"

# Metrics
duration: 20min
completed: 2026-11-16
---

# Phase 1 Plan 15: WCAG Contrast Audit Summary

**Fixed a real 3.10:1/3.63:1 WCAG AA contrast failure in `--ink-disabled` (light + dark themes) and shipped a permanent `@axe-core/playwright` regression spec that scans the signed-in AppShell and `/admin/audit-log` for `color-contrast` violations across all three themes.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-11-16T09:37:00Z (approx)
- **Completed:** 2026-11-16T09:56:39Z
- **Tasks:** 2
- **Files modified:** 5 (2 created/modified in Task 1, 3 in Task 2)

## Accomplishments

- Corrected the one real, user-facing WCAG AA contrast defect this gap's own pre-verification found: light theme's `--ink-disabled` (3.10:1) and dark theme's `--ink-disabled` (3.63:1) against their respective `--bg`, both now ≥4.5:1, verified by direct sRGB-relative-luminance computation (not assumed) both before and after.
- Kept `tokens.json` and `tokens.css` in lockstep per 01-02's documented "CSS is a projection of JSON" contract — both files updated with the identical two values.
- Left `contrast` theme's `--ink-disabled` (already 5.57:1, passing) and every other token in all three themes untouched — a single-token, two-value fix, not a token-system rewrite.
- Installed `@axe-core/playwright` and wrote `frontend/app/e2e/contrast-audit.spec.ts`: one test per theme (light/dark/contrast), each signing in through the real Keycloak OIDC flow, switching theme through the actual `ThemeSwitcher` `Select` UI (not a synthetic `data-theme` DOM mutation), then scanning both the signed-in AppShell and the `DatePicker`-bearing `/admin/audit-log` page with `AxeBuilder`'s `color-contrast` rule under `wcag2a`/`wcag2aa` tags.
- All 3 theme tests pass (0 `color-contrast` violations) against the real compose stack with the Task 1 token fix in place — confirmed by actually running the suite against a live db+nats+opa+keycloak+backend+frontend stack, not assumed.
- Confirmed no regression: the existing `app-shell.spec.ts` (4 tests covering sign-in, nav, theme persistence, skip-link) still passes unchanged against the new token values.
- Confirmed no regression in the design-system's own unit suite: all 40 existing tests (including the 23 foundations tests covering per-theme token cascading) still pass.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix the real light/dark ink-disabled contrast defect** - `c13d438` (fix)
2. **Task 2: Automated WCAG contrast audit via @axe-core/playwright, all three themes** - `6d568c1` (feat)

_Note: Task 2's commit also swept in a pre-existing uncommitted `01-14-SUMMARY.md` and `.planning/STATE.md` update left over from the prior plan's run — these were already present as untracked/modified files in the working tree before this plan began and are unrelated to this plan's scope; they are not treated as part of this plan's deviations._

## Files Created/Modified

- `frontend/design-system/tokens/tokens.json` - Light theme `--ink-disabled` `#8794a0` → `#6c7680`; dark theme `--ink-disabled` `#5d7284` → `#6c8499`
- `frontend/design-system/tokens/tokens.css` - Same two values updated in `[data-theme="light"]` and `[data-theme="dark"]` blocks, kept in lockstep with tokens.json
- `frontend/app/e2e/contrast-audit.spec.ts` - New: `@axe-core/playwright`-based WCAG contrast audit, one test per theme, scanning AppShell + `/admin/audit-log`
- `frontend/app/package.json` - Added `@axe-core/playwright: ^4.14.0` devDependency
- `package-lock.json` - Lockfile update for the new devDependency

## Decisions Made

- Dark theme's replacement `--ink-disabled` value (`#6c8499`) was derived by proportionally lightening the original `#5d7284` by a 1.16x RGB scale factor (found by searching for the smallest scale that cleared 4.5:1 against `#0a1722`) rather than picking an unrelated hex — this keeps the corrected token visually consistent with the rest of the dark theme's blue-grey palette while clearing the WCAG floor with headroom (4.66:1).
- Light theme's replacement value matched the plan's own suggested `#6c7680` exactly (4.62:1), since it already cleared the floor with reasonable headroom and no further search was needed.

## Deviations from Plan

None - plan executed exactly as written. Both tasks' `<verify>` and `<done>` criteria were met using the exact commands specified in the plan (the sRGB-luminance `node -e` check for Task 1, the full compose-stack + Playwright run for Task 2).

## Issues Encountered

- `npm install` in `frontend/app` printed `EBADENGINE` warnings for `@axe-core/playwright@4.14.0` (requires Node ≥22.12.0; sandbox runs Node 20.20.2) and `cookie@2.0.2` (requires Node ≥22). Both are warnings only — install succeeded, the package resolved and worked correctly at runtime (all 3 theme tests ran and passed), and `npx tsc --noEmit` reported zero errors with the new import. Not treated as a blocker; noted here for visibility since a future Node upgrade would clear the warning.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- UAT gap ref 4 ("WCAG contrast compliance across all three themes") is closed: the automated tool UAT's own self-check identified as missing now exists as `frontend/app/e2e/contrast-audit.spec.ts`, a permanent regression asset that will be re-run by every future phase's test gates, and the one real defect it was poised to find is fixed at the token level with the suite green against the fix.
- Phase 1 plans 01-01 through 01-15 (13 original + 2 gap-closure plans) are now all complete.
- No new blockers. The `@axe-core/playwright` Node-engine warning (Node 20 vs. the package's declared Node ≥22.12.0 requirement) is cosmetic only but worth a mental note for whoever next upgrades the sandbox's Node version or runs a stricter `npm install --engine-strict`.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- `frontend/app/e2e/contrast-audit.spec.ts` exists: confirmed via `ls`/Read above.
- `frontend/design-system/tokens/tokens.json` and `tokens.css` contain the corrected `--ink-disabled` values: confirmed via `grep -n "ink-disabled"` showing `#6c7680` (light) and `#6c8499` (dark).
- Commits `c13d438` and `6d568c1` exist: confirmed via `git log --oneline -5`.
- Build check: `cd frontend/app && npm run build` → exit 0 (vite build succeeded, 108 modules transformed).
- Design-system unit tests: `cd frontend/design-system && npm run test -- --run` → 40/40 passed (exit 0).
- Plan's own Task 1 `<verify>` command (sRGB-luminance check) → ran directly, output `BOTH THEMES NOW PASS 4.5:1`.
- Plan's own Task 2 `<verify>` steps (full compose stack up, migrate, seed, backend dev, design-system build, frontend dev, `npx playwright test e2e/contrast-audit.spec.ts --workers=1`) → ran directly against the live stack, 3/3 tests passed, then stack torn down cleanly (`docker compose down`).
- No blocking stubs found (`grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all changed files → no matches).
