---
phase: 5
status: issues_found
blockers: 0
warnings: 1
files_reviewed: 6
files_reviewed_list:
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/auth-org/routes.test.ts
  - frontend/design-system/src/navigation/SideNav.tsx
  - frontend/design-system/test/layout-nav.test.tsx
  - frontend/app/src/app-shell/AppShell.tsx
  - frontend/app/e2e/field-mobile-bottom-nav.spec.ts
reviewed_at: 2026-11-19T11:30:00Z
iteration: 1
---

# Phase 5 Code Review (scoped to 05-06 gap-closure plan)

Scope: the 3 code commits of 05-06 (`cc0d599`, `c852e10`, `2aaf9f4`) plus the `deferred-items.md` note they append to. Does NOT re-review 05-01 through 05-05 (already covered by the prior 05-REVIEW.md/05-VERIFICATION.md/05-SECURITY.md, whose findings are tracked as resolved in 05-SECURITY.md).

## BLOCKERs

None.

## WARNINGs

### W1: New regression test lacks try/finally around its DB-state restore step, risking cross-test pollution on assertion failure
- **File:** backend/src/modules/auth-org/routes.test.ts:160-218
- **Evidence:** The new `it(...)` block (lines 160-218) grants `field_reports:view` to the shared `testRoleId` (lines 163-181), then runs several `expect()` assertions (lines 191-204), and only *after* all assertions pass does it restore the role's original permission set via `DELETE FROM role_permissions ... ; syncRolePermissionsToOpa(...)` (lines 210-217). If any assertion on lines 191-204 throws (e.g. a future regression makes `fieldGroup` falsy, or the item count/label/href checks fail), the function returns early via the thrown error and the restore block on lines 210-217 never runs. `testRoleId` is shared across the whole file (seeded once in `beforeAll`), so the earlier test at line 144 (`'GET /api/v1/me/nav-config returns ... nav_groups ... equal []'`) asserts the role has NO field_reports permission — that assertion only holds on a FRESH run or after a successful (not failed) run of this later test. In a watch-mode re-run, or in a future CI retry step that re-runs an already-mutated row without re-seeding, test order/idempotency could silently break for the earlier `toEqual([])` assertion. This is non-blocking today (tests currently pass, and each CI run typically seeds the DB fresh / tests execute sequentially within this file per Vitest's default single-worker-per-file semantics), but it is a real latent test-isolation gap introduced by this plan's own new test, not a pre-existing one.
- **Fix direction:** Wrap the permission-grant + assertions + restore sequence in a `try { ... } finally { /* restore */ }` block so the role's permission set is always restored regardless of assertion outcome, matching the safer pattern used elsewhere in file-adjacent suites.
- **Resolution:** fixed (57a895a) — wrapped the field_reports grant + assertions in `try`, moved the DELETE + `syncRolePermissionsToOpa` restore into `finally`. Verified: targeted file run twice in a row (`npx vitest run src/modules/auth-org/routes.test.ts`) — 7/7 passed both times, confirming the earlier `toEqual([])` nav-config test remains unaffected by repeated runs; full backend suite (`npx vitest run`) — 15 files / 87 tests passed with zero regressions.

## Verification of required checks

1. **`nav_groups[].id` added to all 7 groups** — Confirmed. `routes.ts` diff (commit `cc0d599`) adds `id:` to Prepare (`'prepare'`, line 261), Monitor (`'monitor'`, line 279), Activate (`'activate'`, line 290), Coordinate (`'coordinate'`, line 299), Improve (`'improve'`, line 353), Field (`'field'`, line 430), and Admin (`'admin'`, line 441). No group was missed; all 7 literal objects in the `nav_groups` array now carry a non-empty string `id` alongside `label`.

2. **AppShell.tsx fallback to `flatItems` is safe** — Confirmed. `fieldGroup = navGroups.find((g) => g.id === 'field')` (line 106) returns `undefined` when no group has `id === 'field'` (e.g. a role with no `field_reports` permission, whose `nav_groups` array simply omits the Field entry per `routes.ts`'s `...(hasFieldReports ? [...] : [])` spread). `mobileBottomBarItems = fieldGroup ? fieldGroup.items : flatItems` (line 107) then falls back to the pre-existing `flatItems` array, which is always a valid (possibly empty) array — `navGroups.flatMap(...)` on an empty `navGroups` (e.g. before the nav-config query resolves, `navConfig?.nav_groups ?? []` on line 90) yields `[]`, and `SideNav`'s bottom-bar branch (`frontend/design-system/src/navigation/SideNav.tsx:104`) handles an empty `mobileBottomBarItems` by rendering zero `<li>` entries — no crash, just an empty (but structurally valid) bottom bar. No code path here can throw or render undefined.

3. **Field item's 4th entry `id`/`href` unchanged** — Confirmed. `routes.ts:436`: `{ id: 'field-profile', label: 'Field home', icon: 'home', href: '/field' }` — only `label` (`'Profile'` → `'Field home'`) and `icon` (`'users'` → `'home'`) changed; `id` and `href` are byte-identical to the pre-05-06 value. Grepped all of `frontend/` and `backend/` for `field-profile` and literal `'Profile'`/`"Profile"` usage outside comments/this one declaration and the new test's lookup (`routes.test.ts:195`) — nothing else keys off either value, so no accidental breaking change.

4. **New backend regression test's role/permission mutation doesn't leak into other tests** — Partially confirmed; see **W1** above. The test does restore the role's permission set (lines 210-217) and the restore logic itself is correct (mirrors the existing suspended-user test's restore-after-test pattern at lines 140-141), but the restore is not guarded by `try/finally`, so a future assertion failure in this same test would skip the restore step and could affect the earlier `toEqual([])` test on a subsequent run. `routes_test_role` is not referenced by any other test file (grepped `backend/src` for the string — only this file uses it), so there is no CROSS-FILE leak risk, only an intra-file ordering risk under the specific failure condition described in W1.

5. **`SideNavGroup.id?: string` is additive/optional, no existing caller breaks** — Confirmed. The field is declared `id?: string` (SideNav.tsx:54), strictly additive to the existing `{ label?: string; items: SideNavItem[] }` shape. Grepped all consumers of the exported `SideNavGroup` type (`frontend/design-system/src/index.ts:78` re-export, `frontend/app/src/app-shell/AppShell.tsx`) — the only runtime producer is `routes.ts` (now always supplies `id`), and the only runtime consumer is `AppShell.tsx` (reads `g.id` defensively via `.find()`, never assumes presence). The rail-variant's `groups.map(...)` render loop (SideNav.tsx:148-151) still keys each group `<div>` by `group.label ?? \`group-${groupIndex}\`` — unaffected by the new `id` field, since that key logic was not touched by this diff. `tsc --noEmit` on `frontend/app` confirms no type errors from the additive field. The new design-system unit test (`layout-nav.test.tsx:135-143`) explicitly proves a group with `id` set renders identically to one without.

## Contract-scan disposition

- **c-gap** `frontend/app/src/pages/SignInCallback.tsx:65` `GET /api/v1/auth/sso/callback` — **independently confirmed FALSE POSITIVE, out of 05-06's scope.** Read both files: `backend/src/modules/auth-org/routes.ts:71` declares `app.post<{ Body: { id_token: string } }>('/api/v1/auth/sso/callback', ...)` (a POST route, matching backend test coverage at `routes.test.ts:220-225`, pre-existing and unmodified by this plan). `SignInCallback.tsx:65` calls `fetch('/api/v1/auth/sso/callback', { method: 'POST', ... })` — an explicit POST, not a GET; the scanner's "GET" label is a static-analysis artifact of an unadorned `fetch(...)` call missing an inferred default. Confirmed via `git show --stat` that none of 05-06's 3 code commits (`cc0d599`, `c852e10`, `2aaf9f4`) touch `SignInCallback.tsx` — its last change is `b29c7d5` ("feat(phase-5): execution complete"), predating this gap-closure plan. Route exists, method matches, file untouched by this diff. Not a 05-06 finding.
- **c-adv** `frontend/app/src/lib/api-client.ts:121` dynamic-path advisory — noted, not acted on (advisory only, per instructions; also outside 05-06's changed-file set).

## Cross-file seams checked

- `backend/src/modules/auth-org/routes.ts` nav_groups shape ↔ `frontend/app/src/app-shell/AppShell.tsx` consumption of `g.id`/`g.items` — OK, `id: 'field'` emitted by backend matches the exact string AppShell's `.find()` matches against.
- `frontend/design-system/src/navigation/SideNav.tsx` `SideNavGroup.id?` type ↔ all producers/consumers (`routes.ts`, `AppShell.tsx`) — OK, additive field, no breaking caller found.
- `frontend/design-system/src/navigation/SideNav.tsx` exports ↔ `frontend/design-system/src/index.ts` re-export ↔ `AppShell.tsx` import — OK, `SideNavGroup`/`SideNavItem` types flow through unchanged export path.
- `backend/src/modules/auth-org/routes.ts` field-profile item `href: '/field'` ↔ `frontend/app/src/main.tsx:171` route table (`<Route path="field" element={<FieldHome />} />`) — OK, confirmed `/field` renders `FieldHome.tsx`, whose `<h1>Field home</h1>` (line 62) and "Report observation" button (line 95) match the new e2e test's post-click assertions exactly.
- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` CSS-class selectors (`.ep-sidenav--bottom-bar`, `.ep-sidenav--rail`, `.ep-sidenav__bottom-label`) ↔ `SideNav.tsx` rendered classNames — OK, exact string matches confirmed by direct read of both files.
- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` `signInAsFieldResponder` helper ↔ `frontend/app/e2e/helpers/sign-in.ts` export — OK, helper exists (line 102) with matching seeded credential (`field-responder@epmp.local`).
- `backend/src/modules/auth-org/routes.test.ts` new test's `testRoleId` mutation ↔ other test files in the suite — OK, `routes_test_role` string is unique to this file (no other test file references it); only intra-file ordering risk flagged as W1.
- SSO callback route (`routes.ts:71`, POST) ↔ `SignInCallback.tsx:65` fetch call (POST) — OK, confirmed matching despite contract-scan's mislabeled c-gap (see disposition above); file outside 05-06's diff entirely.
- `nav_groups`/`navGroups` other consumers (`ComposeNotification.tsx: unknown[]`, `app-shell.spec.ts`: label-only flattening) — OK, neither relies on group ordering or the new `id` field; additive change does not affect either.
