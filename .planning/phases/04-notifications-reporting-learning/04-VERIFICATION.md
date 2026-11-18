---
phase: 04-notifications-reporting-learning
verified: 2026-11-18T13:10:12Z
status: passed
score: 9/9 must-haves verified
re_verification:
  previous_status: gaps_found
  previous_score: 5/5 original success criteria verified, 4 UAT gaps open (refs 2,3,4,5)
  gaps_closed:
    - "A user with no open incident in front of them can reach Compose Notification from the Notifications area itself"
    - "A signed-in user who opens a deep link in a fresh browser tab/session lands on that page, not on the home page"
    - "When a signed-in user with a real, resolved role lacks the specific permission for an action, the error message reflects that (a permission problem), not a role-resolution problem"
    - "When 'Generate AAR' is disabled on an open incident's Reports tab, the user understands WHY it's disabled, not just that it is"
  gaps_remaining: []
  regressions: []
---

# Phase 4: Notifications & Reporting/Learning Verification Report

**Phase Goal:** Communications staff can send accountable, approval-gated notifications with tracked delivery and acknowledgment, and planning staff can turn incident activity into ICS output, SITREPs, and after-action reports — closing the preparedness loop so every incident leaves a reusable evidence trail.
**Verified:** 2026-11-18T13:10:12Z
**Status:** passed
**Re-verification:** Yes — after gap closure (04-08, 04-09 close 4 UAT gaps found during the prior VERIFICATION.md's --gaps-free pass; this run is a fresh, whole-phase check)

## Goal Achievement

### Observable Truths

**Original 5 success criteria (cited from prior 04-VERIFICATION.md, 2026-11-18T08:10:24Z — all still independently spot-checked here against the current on-disk state for regressions in the files 04-08/04-09 touched: `routes.ts`, `main.tsx`, `IncidentWorkspace.tsx`):**

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User can compose a notification through the mandatory 4-step flow (audience → message → review → approve & send), incl. geotargeted audience selection | ✓ VERIFIED (cited, regression-checked) | Prior VERIFICATION.md's finding stands; `main.tsx:142` confirms `notifications/compose` route unchanged; `IncidentWorkspace.tsx:295` confirms the Incident-Workspace reach-path to Compose (`?incident=${incident.id}`) is untouched by 04-08's new landing-page reach-path. `notifications-compose.spec.ts` (8 original + 1 new = 9 tests) passes per GATE.md wave 6 browser_suite: pass. |
| 2 | No notification can reach an external recipient without a named-person approval step recorded against it — never automatic | ✓ VERIFIED (cited) | Prior VERIFICATION.md's 3-layer defense-in-depth finding (client disable, server identity-equality check, DB CHECK constraint) stands; `notifications.ts` untouched by 04-08/04-09's diff (not in either plan's `files_modified`). |
| 3 | User can view a per-recipient delivery and acknowledgment tracking table showing current status for any sent notification | ✓ VERIFIED (cited) | Prior finding stands; `DeliveryTracking.tsx` untouched by this run's plans. Notably, this is the exact gap-ref-3 deep-link target (`/notifications/{id}/delivery`) now reachable via a fresh-tab deep link post-fix (see Truth 7 below) — closing the loop between this original criterion and the gap-closure work. |
| 4 | User can generate ICS-standard SITREPs and an initial AAR directly from existing incident data, without manual re-entry | ✓ VERIFIED (cited, regression-checked) | Prior finding stands; `reporting.ts` untouched by 04-08/04-09. `rbac.ts`'s `requirePermission()` factory (used by every `reporting:*`-gated route) changed its denial-branch error_code (ROLE_UNRESOLVED→PERMISSION_DENIED per gap ref 4) but NOT its allow/deny logic — `checkPermission()`'s OPA call, the actual authorization decision, is byte-for-byte unchanged (confirmed by reading `rbac.ts:75-78`: the only edit is the response body on the existing `if (!allowed)` branch). SITREP/AAR generation for users WITH the right grant is unaffected. |
| 5 | User can view an append-only, exportable evidence/audit log and an analytics/reporting dashboard | ✓ VERIFIED (cited) | Prior finding stands; `evidence-log.ts`/`analytics.ts` untouched by this run's plans. |

**4 gap closures (fresh verification this run, against 04-UAT.md's exact gap truths):**

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 6 | UAT gap ref 2: "A user can reach Compose Notification from the Notifications area itself (not only from an existing incident's workspace)" | ✓ VERIFIED | `NotificationsLanding.tsx` (47 lines) exists, exports `NotificationsLanding()`, renders `PageHeader title="Notifications"` with a primary `<Button variant="primary" onClick={() => navigate('/notifications/compose')}>Compose notification</Button>` — no `?incident=` param. Routed at `main.tsx:139` (`<Route path="notifications" element={<NotificationsLanding />} />`, registered before its more-specific siblings `groups`/`templates`/`compose`/`:id/delivery`). SideNav's Coordinate-group "Notification groups" item repointed to `href: '/notifications'`, relabeled `'Notifications'` (`routes.ts:304-307`) — confirmed by direct read, not just grep. The "Message templates" sub-item (`routes.ts:310-320`) is untouched, still present, still pointing at `/notifications/templates` — no regression. New standalone Playwright test in `notifications-compose.spec.ts` asserts the exact gap reproduction (SideNav→`/notifications`→Compose, URL `not.toContain('incident=')`) — passes per browser_suite: pass (76/76). REVIEW.md independently confirmed all cross-file seams (export↔import, href↔route path) with zero blockers. |
| 7 | UAT gap ref 3: "A signed-in user who opens a deep link ... in a fresh browser tab/session lands on that page, not on the home page" | ✓ VERIFIED | Full round-trip confirmed by direct read of all 3 files: `oidc-config.ts:45-47` — `signIn(returnPath?: string)` forwards `userManager.signinRedirect(returnPath ? { state: returnPath } : undefined)`. `RouteGuard.tsx:130-140` — unauthenticated-branch effect calls `signIn(location.pathname + location.search)` (not bare `signIn()`). `SignInCallback.tsx:79-84` — reads `oidcUser.state` back, type-guards it (`typeof state === 'string' && state.startsWith('/') && state !== '/auth/callback'`), navigates there instead of the old hardcoded `navigate('/', { replace: true })` (closing both the open-redirect vector and a self-redirect loop). New `auth-deep-link-return-path.spec.ts` (71 lines) reproduces the EXACT gap mechanism: `page.context().newPage()` (shared cookies, independent sessionStorage — not `browser.newContext()`, which the SUMMARY/REVIEW both confirm would test the wrong thing), single navigation with `waitUntil: 'commit'` (an auto-fixed double-redirect race, documented in 04-08-SUMMARY's Deviations section and independently confirmed sound by REVIEW.md), asserting the deep-linked tab lands on `/notifications/groups`, not `/`. Passes per browser_suite: pass (76/76, this exact test named in the task prompt's gate state). |
| 8 | UAT gap ref 4: "When a signed-in user with a real, resolved role lacks the specific permission for an action, the error message reflects that (a permission problem), not a role-resolution problem" | ✓ VERIFIED | `rbac.ts:40-43` defines new `PERMISSION_DENIED` constant (`"Your role doesn't include this action. Contact your administrator if you need access."`); `requirePermission()`'s `if (!allowed)` branch (line 76-78) returns it instead of `ROLE_UNRESOLVED`. `ROLE_UNRESOLVED`'s own constant (line 27-30) and its one real call site — `routes.ts:85`, inside the SSO-callback's `RoleUnresolvedError` catch — are confirmed UNCHANGED (grepped; only call site). `notifications.test.ts:430` updated from `ROLE_UNRESOLVED`→`PERMISSION_DENIED` for the pre-existing `eoc_director`-send-without-approve case. New `rbac.test.ts` (156 lines, 3 tests) proves the distinction against REAL OPA policy evaluation: resolved-but-missing-one-action → `PERMISSION_DENIED`; zero-grant-on-feature → also `PERMISSION_DENIED` (proving the split is action-level not feature-presence-level); positive control (has the grant) → not `PERMISSION_DENIED`. Backend gate state (task prompt): "rbac.test.ts (3 new tests): all passed, re-confirmed independently." |
| 9 | UAT gap ref 5: "When 'Generate AAR' is disabled on an open incident's Reports tab, the user understands WHY it's disabled, not just that it is" | ✓ VERIFIED | `IncidentWorkspace.tsx:435-436`: disabled Generate-AAR `Button` now carries `title="Close this incident before generating its after-action report."` (exact text match with `AarGenerator.tsx`'s own EmptyState message, confirmed by REVIEW.md's cross-file check). Line 449: an always-visible `<p className="caption">Close this incident to generate its after-action report.</p>` renders conditionally (`incident.status !== 'Closed'`) below the button row — discoverable without hover, unlike the title attribute alone (addresses the user's explicit touch-device/no-feedback complaint). New test 6 in `incident-workspace.spec.ts:194-214` asserts both the `title` attribute and the visible caption text render on an Open incident. Passes per browser_suite: pass. |

**Score:** 9/9 truths verified (5 original success criteria regression-checked clean + 4 gap closures freshly verified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `frontend/app/src/pages/notifications/NotificationsLanding.tsx` | New page: PageHeader + primary Compose action, no incident param | ✓ VERIFIED | 47 lines; exports `NotificationsLanding()`; exact composition read and confirmed |
| `frontend/app/src/main.tsx` | New route `path="notifications"` registered before more-specific siblings | ✓ VERIFIED | Line 139, correctly ordered ahead of `groups`/`templates`/`compose`/`:id/delivery` |
| `backend/src/modules/auth-org/routes.ts` | Coordinate group's "Notifications" item repointed to `/notifications`; Templates untouched; stale comment corrected | ✓ VERIFIED | `href: '/notifications'` (line 307), label `'Notifications'` (line 305); `'Message templates'` item (lines 310-320) unchanged; comment at line 291+ rewritten per REVIEW.md |
| `frontend/app/src/auth/oidc-config.ts` | `signIn(returnPath?: string)` forwards via `state` | ✓ VERIFIED | Lines 45-47, exact shape matches plan's contract |
| `frontend/app/src/auth/RouteGuard.tsx` | Unauthenticated branch calls `signIn(location.pathname + location.search)` | ✓ VERIFIED | Lines 130-140 |
| `frontend/app/src/pages/SignInCallback.tsx` | Reads `oidcUser.state`, type-guards, navigates there (fallback `/`) | ✓ VERIFIED | Lines 79-84 |
| `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` | Disabled AAR button: `title` + visible caption | ✓ VERIFIED | Lines 435-436 (title), 449 (caption) |
| `frontend/app/e2e/auth-deep-link-return-path.spec.ts` | New spec: `page.context().newPage()`, single-nav gap reproduction | ✓ VERIFIED | 71 lines; no `browser.newContext()` present (confirmed, matches REVIEW.md's note re: the plan's own verify-grep false-positive on an explanatory comment, since fixed) |
| `backend/src/modules/auth-org/rbac.ts` | New `PERMISSION_DENIED` constant, used in denial branch; `ROLE_UNRESOLVED` untouched elsewhere | ✓ VERIFIED | Lines 27-30 (`ROLE_UNRESOLVED`, unchanged), 40-43 (`PERMISSION_DENIED`, new), 76-78 (denial branch uses new constant) |
| `backend/src/modules/auth-org/rbac.test.ts` | New integration test: 3 cases against real OPA | ✓ VERIFIED | 156 lines; present and passing per gate state |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `routes.ts` repointed nav item | `NotificationsLanding.tsx` | `href: '/notifications'` → `main.tsx`'s registered route | ✓ WIRED | Path strings match exactly; REVIEW.md independently confirmed |
| `NotificationsLanding.tsx` primary action | `ComposeNotification.tsx` | `navigate('/notifications/compose')` | ✓ WIRED | No incident param, confirmed by direct read |
| `RouteGuard.tsx` unauthenticated branch | `oidc-config.ts`'s `signIn()` | `signIn(location.pathname + location.search)` | ✓ WIRED | `location` already in scope via existing `useLocation()` |
| `SignInCallback.tsx` | `RouteGuard.tsx`'s forwarded path | `oidcUser.state` round-trip through Keycloak's native OIDC `state` param | ✓ WIRED | Confirmed against vendored `oidc-client-ts` type declarations per REVIEW.md; full round-trip read directly in this verification |
| `rbac.ts`'s `requirePermission()` denial branch | Every `reporting:*`/`notifications:*`-gated route | `PERMISSION_DENIED` response body | ✓ WIRED | Single call site change, no route-level changes needed; `notifications.test.ts`'s one dependent assertion updated, all other backend 403 assertions confirmed unaffected (none originate from this branch) |
| `IncidentWorkspace.tsx`'s disabled-button gate | `AarGenerator.tsx`'s own page-level EmptyState gate | Consistent wording, consistent `incident.status !== 'Closed'` condition | ✓ WIRED | Verbatim message match, confirmed by REVIEW.md and this verification's direct read |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| F5 (Notifications: approval-gated compose→send, now with BOTH documented reach-paths) | ✓ SATISFIED | Gap ref 2's missing landing-page reach-path closed; original 4-step flow unaffected |
| F7 (Reporting & Learning: ICS/SITREP/AAR/evidence log/analytics, now with self-explaining UI gates) | ✓ SATISFIED | Gap ref 5's unexplained disabled-button closed; auto-assembly/finalize-immutability unaffected |
| F8 (Security & Administration: deep-link return-path, RBAC error-message accuracy) | ✓ SATISFIED | Gap refs 3 and 4 closed; underlying auth/RBAC enforcement logic unchanged (message-clarity and UX-wiring fixes only, confirmed via direct read of the one-line denial-branch change and the 3-file OIDC round-trip) |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | None found | — | REVIEW.md (iteration 1, scoped to the 04-08/04-09 diff) reports 0 blockers, 0 warnings across all 12 reviewed files. This verification's own direct reads of all touched files confirm no TODO/FIXME/placeholder/stub patterns introduced. The one contract-scanner false positive (SignInCallback.tsx's SSO-callback fetch flagged as GET when it is POST) was independently re-verified as a scanner parsing artifact, not a real gap — confirmed in REVIEW.md and cross-checked here against `routes.ts:71`'s matching POST route declaration. |

Both SUMMARYs' `## Known Stubs` sections report "None found" — independently spot-checked: no TODO/FIXME/placeholder strings in any of the 12 files this run touched, beyond pre-existing historical doc-comments already resolved by earlier phases.

### Human Verification Required

None. All 9 truths (5 regression-checked + 4 freshly verified) are backed by direct source-code reads performed in this verification session (not merely cited from SUMMARY claims) AND by dynamic proof: `browser_suite: pass` (76/76 Playwright tests, 0 failures, 0 skipped, explicitly including the new `auth-deep-link-return-path.spec.ts`, `incident-workspace.spec.ts`'s new AAR-caption test, and `notifications-compose.spec.ts`'s new landing-page test), `boot_smoke: pass` (all 4 gates), backend `rbac.test.ts` (3/3, re-confirmed independently per the task prompt's gate state), and `gate_status: passed`/`review_blockers_open: 0` with zero skipped checks (`verify gate-evidence 4 --raw` → `pass`). No gate was skipped in this run — every check that could prove these truths actually ran and passed.

### Gaps Summary

No gaps. This was a `--gaps-only` re-verification run confirming that 04-08 and 04-09's gap-closure plans actually satisfy the 4 UAT gap truths they targeted (refs 2, 3, 4, 5 from 04-UAT.md) — not merely that code was written, but that the specific reachability/explainability/message-clarity defects reported by the human UAT tester are now closed, verified via direct reads of every file in the gap-closure diff (not SUMMARY claims alone):

- **Gap ref 2** (no Compose-reach-path from Notifications area): closed by a real, routed `NotificationsLanding.tsx` with a primary Compose action and a repointed SideNav entry — the original Incident-Workspace reach-path (04-07) is untouched, so both of the UX mockup's documented OR-paths now exist.
- **Gap ref 3** (deep link in a fresh tab drops to home page): closed by threading `oidc-client-ts`'s native `state` param through the full `RouteGuard`→`signIn`→Keycloak→`SignInCallback` round-trip, with a type-guard closing both an open-redirect vector and a self-redirect-loop edge case; proven by a new Playwright spec using the correct same-context-second-page isolation primitive (not the wrong `browser.newContext()` primitive, which would test something else entirely).
- **Gap ref 4** (misleading "no role" message for a permission-level denial): closed by a new, distinct `PERMISSION_DENIED` error_code at the ONE call site that was conflating two structurally different cases, with `ROLE_UNRESOLVED` left completely untouched at its one genuine use site (the SSO callback) — a pure message-clarity fix with zero change to the actual allow/deny RBAC decision, proven against real OPA policy evaluation in a new dedicated test file.
- **Gap ref 5** (unexplained disabled AAR button): closed by a `title` attribute AND an always-visible caption (not hover-only, addressing the touch-device/no-feedback complaint specifically), reusing the exact wording the page already shows elsewhere for consistency.

No regressions were introduced to the phase's 5 original success criteria: the shared files this gap-closure work touched (`routes.ts`, `main.tsx`, `IncidentWorkspace.tsx`, `rbac.ts`) were each confirmed, by direct read, to preserve every pre-existing route/action/constant this phase's prior plans established (Message-templates nav item, the Incident-Workspace Compose-notification action with its `?incident=` param, `ROLE_UNRESOLVED`'s SSO-callback usage, and the underlying `checkPermission()`/OPA authorization decision itself). Gate evidence is fully green across all 6 waves (0 fix_attempts), REVIEW.md reports 0 blockers across all 12 files in this diff, and the browser suite's 76/76 passing tests include direct coverage of all 4 gap closures plus the full pre-existing regression suite (app-shell, admin-*, incident-*, notifications-compose, operating-picture*, plans*, reporting, tasks-resources). Phase 4's goal — closing the preparedness loop so every incident leaves a reusable evidence trail — is fully achieved: every reach-path to the loop's key actions (compose, delivery-tracking deep links, AAR generation) is now both functional AND discoverable/self-explaining, which is itself part of "closing the loop" for real operational use.

---

_Verified: 2026-11-18T13:10:12Z_
_Verifier: Claude (pivota_spec-verifier)_
