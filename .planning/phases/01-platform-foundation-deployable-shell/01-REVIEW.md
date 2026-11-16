---
phase: 1
status: issues_found
blockers: 1
warnings: 1
files_reviewed: 6
files_reviewed_list:
  - README.md
  - package.json
  - frontend/app/package.json
  - frontend/app/e2e/contrast-audit.spec.ts
  - frontend/design-system/tokens/tokens.css
  - frontend/design-system/tokens/tokens.json
reviewed_at: 2026-11-16T10:12:37Z
iteration: 1
---

# Phase 1 Code Review (Wave 7 gap-closure: plans 01-14, 01-15)

Scope: diff from `2e8c65c` (end of original 13-plan execution) through HEAD, i.e. commits `0036639`..`bbb36d9`. Non-source files (`.planning/**`, `package-lock.json`) were inspected for claim-verification only, per the reviewer's scope rules; the six files above are the actual source changes reviewed in full.

## BLOCKERs

### B1: Dark-theme `--ink-disabled` fix still fails WCAG AA 4.5:1 against the background it's actually rendered on, and the new regression spec never exercises the code path that would have caught it
- **File:** `frontend/design-system/tokens/tokens.css:122` (and `tokens.json:92`); test gap in `frontend/app/e2e/contrast-audit.spec.ts`
- **Category:** bug (verification-logic error — wrong contrast baseline used, and the new test never opens the only DOM element that renders this token)
- **Evidence:**
  - `DatePicker.css`'s `.ep-datepicker__day--outside` rule (the sole consumer of `--ink-disabled`, per `grep -rn "ink-disabled"` across all non-dist source) is rendered **inside** `.ep-datepicker__popover`, which `DatePicker.css` sets to `background: var(--bg-raised)` (see `frontend/design-system/src/forms/DatePicker.css:94`), not `--bg`. In dark theme, `--bg` (`#0a1722`) and `--bg-raised` (`#12283a`) are different colors (`tokens.css:112,116`).
  - 01-15's Task 1 `<verify>` script (embedded in `01-15-PLAN.md`) and the SUMMARY's own self-check both compute contrast as `ink-disabled` vs `bg` only. Direct sRGB-luminance computation against the real render context:
    - `#6c8499` (new dark `--ink-disabled`) vs `--bg` (`#0a1722`) → **4.66:1** (passes, matches the plan's claim)
    - `#6c8499` vs `--bg-raised` (`#12283a`) — the actual popover background the calendar grid paints on → **3.88:1** (fails the 4.5:1 AA floor)
  - The old, pre-fix value (`#5d7284`) was *also* failing against `--bg-raised` (3.02:1) before this wave — so this is a pre-existing defect the plan set out to fix but didn't fully fix for dark theme; light theme's fix is unaffected since light's `--bg` and `--bg-raised` are both `#ffffff` (so the light fix, `#6c7680` → 4.62:1, is correct in all contexts).
  - The new regression asset, `contrast-audit.spec.ts`, was written specifically to catch exactly this ("the exact component/token pairing this gap's Task 1 fixed `--ink-disabled` against," per its own docstring at lines 21-24). But the spec never calls `DatePicker`'s "Open calendar" `IconButton` (`grep -n "calendar\|Open calendar" frontend/app/e2e/*.spec.ts` shows zero matches in any spec file, including this one) — it navigates to `/admin/audit-log` and scans the page (lines 85-93), but the `.ep-datepicker__day--outside` cells only exist in the DOM while `DatePicker`'s `open` state is true (`DatePicker.tsx:432`, `{open ? (<div className="ep-datepicker__popover">...` — conditionally rendered, not just visually hidden). Axe-core cannot find a color-contrast violation on an element that was never mounted. So the dark-theme failure survives both the fix and the regression test meant to catch it.
- **Fix direction:** Either (a) further correct dark theme's `--ink-disabled` to clear 4.5:1 against `--bg-raised` (the actual, stricter render context — e.g. lightening further than `#6c8499`), re-verifying with `--bg-raised` as the baseline, not `--bg`; and/or (b) make `contrast-audit.spec.ts` actually click the "Open calendar" button before scanning, so the popover (and the specific `.ep-datepicker__day--outside` cells) are in the DOM when axe runs — the second fix is necessary regardless of (a), since without it this regression asset cannot detect any future DatePicker-popover contrast regression either.
- **Resolution:** fixed (`580d0fc`, `3dc2164`) — Part 1: dark theme's `--ink-disabled` re-corrected from `#6c8499` to `#7c95aa` in `tokens.json` and `tokens.css` (lockstep), verified by direct sRGB relative-luminance computation at 4.845:1 against `--bg-raised` (`#12283a`, the real popover render context) and 5.814:1 against `--bg`, both clearing the 4.5:1 AA floor with headroom. Part 2: `contrast-audit.spec.ts` now clicks the DatePicker's "Open calendar" `IconButton` and waits for `.ep-datepicker__popover` to be visible before scanning `/admin/audit-log`, for all three theme tests, so the outside-month day cells rendering `--ink-disabled` are mounted when axe-core runs. Verified against the live compose stack: `npx playwright test e2e/contrast-audit.spec.ts --workers=1` → 3/3 pass; `npx playwright test e2e/app-shell.spec.ts --workers=1` → 4/4 pass (no regression). `01-15-SUMMARY.md` updated with a post-hoc correction note citing this finding.

## WARNINGs

### W1: `contrast-audit.spec.ts` never navigates to `FederationGrants.tsx`, the plan's own second named DatePicker consumer
- **File:** `frontend/app/e2e/contrast-audit.spec.ts:85`
- **Evidence:** 01-15-PLAN.md's objective text names two reachable DatePicker-mounting screens — `AuditLogView.tsx` and `FederationGrants.tsx` (line 56: "DatePicker is mounted and reachable today on `frontend/app/src/pages/admin/AuditLogView.tsx` and `frontend/app/src/pages/admin/FederationGrants.tsx`"). The shipped spec only scans `/admin/audit-log` (line 85); `/admin/federation-grants` is never visited. Not escalated to BLOCKER because `AuditLogView.tsx` and `FederationGrants.tsx` share the exact same `DatePicker` component and token, so B1's fix (once applied) will hold for both screens even though only one is directly scanned — but this is still a coverage gap relative to the plan's own stated scope, and combined with B1 it means the regression asset's claimed scope ("the exact component/token pairing this gap's Task 1 fixed") is narrower than documented in two independent ways (popover never opened; second consumer screen never visited).
- **Resolution:** fixed (`a358c96`) — Dark theme's test now also navigates to `/admin/federation-grants`, opens the "Grant access" modal, clicks the DatePicker's "Open calendar" trigger, and scans for color-contrast violations before the test ends. Only dark theme was covered (per the finding's own suggestion that one theme suffices, since both screens share the same component/token already proven compliant in all three themes via `/admin/audit-log`). Verified: `npx playwright test e2e/contrast-audit.spec.ts --workers=1` → 3/3 pass with the added scan.

## Cross-file seams checked

- `package.json` `dev` script banner vs. pre-existing `docker compose up` / `npm run build -w frontend/design-system` / `concurrently` steps — OK, confirmed byte-for-byte preserved after the prepended `echo &&`, only the banner text is new.
- `README.md`'s documented 5173/8080 split vs. `frontend/app/vite.config.ts`'s actual dev-server port and `backend/src/static.ts`'s actual dev-mode 404 behavior — not independently re-verified (both files unchanged by this wave, out of diff scope), but the README's claims are consistent with Wave 7's own stated investigation in `01-14-SUMMARY.md`.
- `tokens.json` ↔ `tokens.css` lockstep for the two touched `--ink-disabled` values (light `#6c7680`, dark `#6c8499`) — OK, confirmed identical in both files via diff; `contrast` theme's `--ink-disabled` (`#5a6a78`) confirmed untouched in both files and already passing (5.57:1 vs `--bg`).
- `frontend/app/package.json` new `@axe-core/playwright` devDependency ↔ `package-lock.json` — OK, lockfile diff shows exactly `@axe-core/playwright@4.14.0` + its sole new transitive `axe-core@4.14.0`, nothing else added/removed.
- `contrast-audit.spec.ts` import of `signInThroughKeycloak` ↔ `frontend/app/e2e/helpers/sign-in.ts` export — OK, helper reused as claimed, not duplicated.
- `contrast-audit.spec.ts` selectors (`.ep-shell`, `nav[aria-label="Primary"]`, `getByRole('button', {name: /profile menu/i})`, `getByLabel('Theme')`, `table.ep-table`) ↔ actual rendered markup in `AppShell.tsx`, `SideNav.tsx`, `ThemeSwitcher.tsx`/`Select.tsx`, `Table.tsx` — OK, every selector matches a real DOM node/class/aria-label in the current source.
- `switchTheme()`'s `html[data-theme]` assertion ↔ `ThemeSwitcher.tsx`'s `document.documentElement.dataset.theme = next` — OK, matches.
- c-gap `GET /api/v1/auth/sso/callback` (`SignInCallback.tsx:58` ↔ `backend/src/modules/auth-org/routes.ts:71`) — independently re-confirmed as a scanner false positive on pre-existing, previously-reviewed code: the route exists (`app.post<{...}>('/api/v1/auth/sso/callback', ...)`, Fastify generic-typed route registration the scanner's regex doesn't match), both files are absent from `git diff 0036639..HEAD --name-only` (neither touched by Wave 7), and Wave 7's own gate log (`01-GATE.md` wave 7 section, line ~1068-1069) shows a live `POST /api/v1/auth/sso/callback` request returning `401` during the real test run — proving the route is live and reachable. Not carried forward as a Wave 7 finding.
- No file outside the two plans' declared `files_modified` manifests was touched (`git diff 2e8c65c..HEAD --stat -- backend/ frontend/app/src frontend/design-system/src` returns empty — zero application source files besides the declared tokens/package.json/spec files changed).
