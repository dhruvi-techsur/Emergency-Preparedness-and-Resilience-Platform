---
phase: 5
status: clean
blockers: 0
warnings: 0
files_reviewed: 6
files_reviewed_list:
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/auth-org/routes.test.ts
  - frontend/design-system/src/navigation/SideNav.tsx
  - frontend/design-system/test/layout-nav.test.tsx
  - frontend/app/src/app-shell/AppShell.tsx
  - frontend/app/e2e/field-mobile-bottom-nav.spec.ts
reviewed_at: 2026-11-19T12:05:00Z
iteration: 2
---

# Phase 5 Code Review (re-review, iteration 2)

Scope: re-review of iteration 1's W1 fix (commit `57a895a`) against `backend/src/modules/auth-org/routes.test.ts`, plus re-confirmation that the full 05-06 file set (`files_reviewed_list` above, unchanged from iteration 1) carries no new findings. Per the re-review constraint, this iteration reviewed only the previously-listed files (the fixer touched no new file).

## W1 (iteration 1) — verification

**Original finding:** the new regression test (`routes.test.ts:160-218` at iteration 1) granted `field_reports:view` to the shared `testRoleId`, ran several assertions, and only restored the role's permission set (DELETE + `syncRolePermissionsToOpa`) *after* the assertions — with no `try/finally`, so a thrown assertion would skip the restore and could pollute the earlier `toEqual([])` nav-config test on a subsequent run.

**Fix applied (commit `57a895a`):** read in full (see diff above and the current file, lines 160-225).

- The grant (`SELECT`/`INSERT`/`UPDATE` on `role_permissions`, lines 168-182), the `syncRolePermissionsToOpa` call (line 186), token minting (line 188), the request (line 194), and **all** assertions (`expect(res.status)`, `expect(fieldGroup)`, `expect(fieldGroup.items)`, `expect(fourthItem.label)`, `expect(fourthItem.href)`, and the per-group `id` loop, lines 196-209) are inside the `try` block.
- The restore — `DELETE FROM role_permissions WHERE role_id = $1 AND feature = $2` (line 216-219) followed by re-querying all perms and `syncRolePermissionsToOpa(restoredPerms)` (lines 220-223) — is inside `finally`, and nothing else follows the `finally` block before the `it(...)` closes (line 224-225).
- This means: if any assertion between lines 196-209 throws, JS's `try/finally` semantics guarantee the `finally` block still executes before the exception propagates out of the `it(...)` callback — the restore runs unconditionally. **Confirmed correct**, matching the exact structure requested in the fix direction.

**Regression check on control flow / scoping:**
- `fieldGroup`, `fourthItem`, `allPerms`, `token`, `res`, `existingFieldReportsPerm` are all declared with `const` inside the `try` block and are not referenced in `finally` or after — no scoping leak, no TDZ/reference issues. `finally` declares its own independent `restoredPerms` const, no naming collision.
- No assertion logic changed — every `expect(...)` call is byte-identical to iteration 1's version, just relocated inside `try` (confirmed via diff: only indentation changed on assertion lines, not content).
- No other test in the file (`beforeAll`, `afterAll`, or the 6 other `it(...)` blocks) was touched by this commit — diff is scoped entirely to lines within the single `it(...)` block at 160-225. Read the full file (233 lines) top to bottom: `beforeAll` seeding (lines 39-73), `afterAll` teardown (75-77), and the other 6 tests (80-158, 227-232) are unchanged from iteration 1.
- Brace/paren balance and TS syntax validity confirmed via `tsc --noEmit` (zero errors) and a TypeScript AST parse of the file (parses cleanly, no syntax errors).
- The fixer's own verification note (targeted file run twice back-to-back: 7/7 passed both times; full suite: 15 files / 87 tests passed) is consistent with the structural read — no reason to doubt it given the fix is a straightforward, correctly-nested `try/finally` wrap with no logic alteration.

**Verdict: W1 is fixed, no regression introduced.**

## BLOCKERs

None.

## WARNINGs

None.

## Cross-file seams checked

- `backend/src/modules/auth-org/routes.ts` nav_groups shape ↔ `frontend/app/src/app-shell/AppShell.tsx` consumption of `g.id`/`g.items` — OK (unchanged since iteration 1; fixer touched only the test file).
- `frontend/design-system/src/navigation/SideNav.tsx` `SideNavGroup.id?` type ↔ producers/consumers (`routes.ts`, `AppShell.tsx`) — OK (unchanged).
- `backend/src/modules/auth-org/routes.test.ts` new test's `testRoleId` mutation ↔ earlier `toEqual([])` nav-config test (line 157) ↔ other test files — OK, now provably safe under assertion failure: the `try/finally` wrap guarantees the restore runs even if the new test's assertions throw, closing the intra-file ordering risk flagged as W1 in iteration 1. `routes_test_role` remains unique to this file (no cross-file leak).
- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` selectors ↔ `SideNav.tsx` classNames — OK (unchanged since iteration 1).
- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` `signInAsFieldResponder` helper ↔ `frontend/app/e2e/helpers/sign-in.ts` export — OK (unchanged).

## Verification commands run this iteration

- `npx tsc --noEmit -p backend` — zero errors.
- TypeScript AST parse of `routes.test.ts` — parses cleanly, no syntax errors.
- `git diff --name-only cc0d599^..HEAD` (full 05-06 diff including the fix commit) — identical file set to iteration 1's `files_reviewed_list`; fixer introduced no new file.
- Full file read of `routes.test.ts` (233 lines, in full) — confirmed no other test block was altered by `57a895a`.
