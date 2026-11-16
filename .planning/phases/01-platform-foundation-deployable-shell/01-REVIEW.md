---
phase: 1
status: clean
blockers: 0
warnings: 0
files_reviewed: 6
files_reviewed_list:
  - README.md
  - package.json
  - frontend/app/package.json
  - frontend/app/e2e/contrast-audit.spec.ts
  - frontend/design-system/tokens/tokens.css
  - frontend/design-system/tokens/tokens.json
reviewed_at: 2026-11-16T11:40:00Z
iteration: 2
---

# Phase 1 Code Review (Wave 7 gap-closure: plans 01-14, 01-15) — Re-review

Scope: iteration-1's `files_reviewed_list` plus the fixer's touched files. Fixer's commits: `580d0fc`, `3dc2164`, `a358c96`, `8f73db7`, on top of `2230ec5` (the iteration-1 review commit). `git diff 2230ec5..HEAD --name-only` confirms exactly 5 files touched: `01-15-SUMMARY.md`, `01-REVIEW.md` (docs), and the three source files above that iteration-1 also reviewed. No file outside that set — and no application source outside `frontend/design-system/tokens/` and `frontend/app/e2e/` — was touched (`git diff 2230ec5..HEAD --stat -- frontend/design-system/tokens/ frontend/app/e2e/` accounts for the full non-doc diff: 46 insertions/2 deletions across the 3 source files).

## B1 — independently re-verified as fixed

**Part 1 (contrast value):** Recomputed sRGB relative-luminance myself (not trusted from the fixer's claim), using the actual current token values read from `tokens.json`/`tokens.css`:

- Dark `--ink-disabled` is now `#7c95aa` (both files, lockstep — confirmed by diff and by direct read, not just the fixer's commit message).
- `#7c95aa` vs dark `--bg` (`#0a1722`) → **5.8145:1** (passes).
- `#7c95aa` vs dark `--bg-raised` (`#12283a`), the real popover render context DatePicker.css sets on `.ep-datepicker__popover` (`background: var(--bg-raised)`, DatePicker.css:99) → **4.8452:1** (passes, clears 4.5:1 with headroom).
- Sanity-check against the pre-fix value: old `#6c8499` vs `--bg-raised` → 3.8826:1 (confirms the original B1 finding was real and is now resolved, not an artifact of my formula).
- Light theme's `--ink-disabled` (`#6c7680`) and contrast theme's `--ink-disabled` (`#5a6a78`) are byte-identical to their iteration-1 (pre-this-fix-round) values — confirmed by `git diff 2230ec5..HEAD` showing only the single dark-theme line changed in each of `tokens.json`/`tokens.css`. Light's own contrast (4.6248:1 vs `#ffffff`, which is both `--bg` and `--bg-raised` in light theme) and contrast-theme's (5.5739:1 vs `#ffffff`) remain correct and untouched.

**Part 2 (test exercises the real code path):** Read `DatePicker.tsx` and `IconButton.tsx` directly, not assumed:
- `DatePicker.tsx:410-418` renders `<IconButton icon="calendar" label="Open calendar" ... onClick={toggleOpen}>`. `IconButton.tsx:45` sets `aria-label={label}` on a native `<button>`. So `page.getByRole('button', { name: 'Open calendar' })` is a correct, exact-match selector against the real accessible name — not a guess.
- `DatePicker.tsx:432` conditionally renders `.ep-datepicker__popover` only when `open` is true, exactly as the original finding described. The new spec clicks the "Open calendar" button, then does `await expect(page.locator('.ep-datepicker__popover')).toBeVisible({ timeout: 5_000 })` before scanning — this is a real wait-for-mount assertion (not a fixed sleep), so there is no race between the click and the scan.
- `AuditLogView.tsx` renders two `DatePicker`s (Start date, End date) side by side; `.first()` resolves to the Start-date one. Verified `buildMonthGrid` in `DatePicker.tsx` always produces at least one `ep-datepicker__day--outside` cell for any month/weekday combination (every 42-cell grid pads with outside-month days unless a month starts on Sunday AND has exactly 42-0=42... checked exhaustively for all `firstWeekday` × `daysInMonth` combinations: no combination yields zero outside-month cells), so the scan reliably exercises the token regardless of which calendar month is showing at test time.
- Would this construction have caught the ORIGINAL pre-fix bug (`#6c8499` at 3.88:1 vs `--bg-raised`)? Yes: axe-core's `color-contrast` rule computes the effective background by walking up to the nearest ancestor with a non-transparent `background`/`background-color`; `.ep-datepicker__popover` sets `background: var(--bg-raised)` directly on itself (DatePicker.css:99), so axe would resolve `--bg-raised` as the background for the `.ep-datepicker__day--outside` text color check — not `--bg`. With the popover open and mounted, axe-core would have flagged `#6c8499`-on-`#12283a` (3.88:1) as a `color-contrast` violation. I could not construct a scenario where the as-written test would miss this.
- The AppShell scan uses `.include('.ep-shell')` (`contrast-audit.spec.ts:64`); `/admin/audit-log` and `/admin/federation-grants` are separately `page.goto()`'d full-page navigations scanned with the same `.include('.ep-shell')` selector, and `AppShell.tsx:100,168-170` confirms the routed page content (`<Outlet/>`, which renders `AuditLogView`/`FederationGrants`) is nested inside `.ep-shell` via `<main id="main-content" className="ep-shell__content">` — so the popover, when open, is within the scanned subtree on both pages.

## W1 — independently re-verified as fixed

- `contrast-audit.spec.ts:121-137` adds a dark-theme-only block that navigates to `/admin/federation-grants`, clicks "Grant access" (confirmed in `FederationGrants.tsx:153-155` this is the PageHeader action button with exactly that label, opening the create modal), then clicks "Open calendar" and waits for the popover before scanning.
- Read `FederationGrants.tsx:231-235`: the create modal does contain a `DatePicker label="Expires"` — the scan is exercising a real, distinct `DatePicker` instance (not a no-op). `Modal.tsx` renders unconditionally in the DOM (not via a portal outside `.ep-shell`) when `open` is true — confirmed no `createPortal` usage anywhere in `frontend/design-system/src` or `frontend/app/src` — so this modal's DatePicker popover is within the `.ep-shell`-scoped scan.
- Only dark theme is covered, matching the original W1 finding's own stated allowance ("doesn't need to be all three... both screens share the exact same `DatePicker` component and token").

## Regression check

- `git diff 2230ec5..HEAD -- frontend/design-system/tokens/ frontend/app/e2e/` is the complete non-doc diff (confirmed against the full `git diff --name-only` output — identical file set). No other design-system or frontend/app source file was touched.
- Within `tokens.css`/`tokens.json`, only the single dark `--ink-disabled` line changed in each file (confirmed by direct diff, not by trusting the commit message) — light and contrast themes' `--ink-disabled`, and every other token in all three themes, are untouched.
- `contrast-audit.spec.ts`'s only other changes are additive (a doc-comment block, the open-calendar-and-wait block before the audit-log scan, and the new dark-theme-only federation-grants block) — the pre-existing AppShell scan, `switchTheme()`, `scanForColorContrastViolations()`, and the describe/test loop structure are unchanged.

## Cross-file seams checked

- `DatePicker.tsx`'s "Open calendar" `IconButton` accessible name ↔ `contrast-audit.spec.ts`'s `getByRole('button', {name: 'Open calendar'})` selector — OK, exact match confirmed by reading both files.
- `DatePicker.css`'s `.ep-datepicker__popover { background: var(--bg-raised) }` ↔ the dark-theme `--ink-disabled` fix's claimed baseline (`--bg-raised`, not `--bg`) — OK, confirmed the fix used the correct, stricter render context.
- `FederationGrants.tsx`'s "Grant access" button/modal/DatePicker ↔ the new dark-theme federation-grants test block's selectors — OK, each selector (`Grant access` button, `.ep-datepicker__popover`) matches real rendered markup.
- `tokens.json` ↔ `tokens.css` lockstep for the re-corrected dark `--ink-disabled` value (`#7c95aa`) — OK, identical in both files.
- `Modal.tsx` render location (inline in the React tree, no portal) ↔ the federation-grants scan's reliance on `.include('.ep-shell')` catching the modal's contents — OK, confirmed no portal is used anywhere in the design system or app, so the modal (and its DatePicker popover) is a normal descendant of `.ep-shell`.
- All iteration-1 "Cross-file seams checked" items (package.json banner, README port claims, axe-core devDependency/lockfile, `signInThroughKeycloak` import, AppShell/SideNav/ThemeSwitcher/Table selectors, `switchTheme()` theme-attribute assertion, the `sso/callback` c-gap scanner false-positive, and the "no file outside declared manifests" check) are unaffected by this fix round and remain OK as previously verified — none of those files were touched between `2230ec5` and `HEAD`.
