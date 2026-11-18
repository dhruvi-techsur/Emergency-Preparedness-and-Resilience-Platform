---
phase: 4
status: clean
blockers: 0
warnings: 0
files_reviewed: 12
files_reviewed_list:
  - frontend/app/src/pages/notifications/NotificationsLanding.tsx
  - frontend/app/src/main.tsx
  - backend/src/modules/auth-org/routes.ts
  - frontend/app/src/auth/oidc-config.ts
  - frontend/app/src/auth/RouteGuard.tsx
  - frontend/app/src/pages/SignInCallback.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
  - frontend/app/e2e/notifications-compose.spec.ts
  - frontend/app/e2e/incident-workspace.spec.ts
  - frontend/app/e2e/auth-deep-link-return-path.spec.ts
  - backend/src/modules/auth-org/rbac.ts
  - backend/src/modules/auth-org/rbac.test.ts
reviewed_at: 2026-11-18T13:10:00Z
iteration: 1
---

# Phase 4 Code Review (04-08 + 04-09 gap-closure diff)

Scope: this iteration reviews ONLY the files touched by 04-08 (notifications landing / deep-link return-path / AAR-button explanation) and 04-09 (RBAC PERMISSION_DENIED error-code split), per the gap-closure instructions. 04-01..04-07 were already reviewed/fixed (see prior iteration-2 content, superseded by this scoped pass) and are out of scope here. The 3 HIGH-severity security fixes (jurisdiction-scope gates, evidence-log UNION scoping, approver_id identity check — commits 1623fd4/098d2d6/1ef89f4/6e8f20b) predate 04-08/04-09, were independently security-audited, and are likewise out of scope.

## Contract-scan verification

The scanner's one `c-gap` finding is a **confirmed false positive**, independently re-verified:

- `c-gap api frontend/app/src/pages/SignInCallback.tsx:65 GET /api/v1/auth/sso/callback — no matching backend route declaration`
- Read `SignInCallback.tsx:65-69` directly: `fetch('/api/v1/auth/sso/callback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_token: idToken }) })` — the `method: 'POST'` is explicit in the options object; the scanner's static parser evidently didn't parse the `method` key out of the object literal and defaulted to GET.
- Read `backend/src/modules/auth-org/routes.ts:71`: `app.post<{ Body: { id_token: string } }>('/api/v1/auth/sso/callback', async (req, reply) => {...})` — exact path, POST method, matching `{ id_token }` body shape. This route (and `routes.test.ts:160-161`'s coverage of it) predates Phase 4 entirely (Phase 1, 01-10).
- `SignInCallback.tsx` was touched by 04-08 only to add the `oidcUser.state` return-path read-back (lines 79-84) — the `fetch('/api/v1/auth/sso/callback', ...)` call itself (lines 65-69) is unchanged by this diff, confirmed via `git show 0ce43dd -- frontend/app/src/pages/SignInCallback.tsx` (the diff hunk only touches the post-exchange navigate logic, not the fetch call).

Verdict: not a real gap. Zero other c-gaps were reported.

## BLOCKERs

None.

## WARNINGs

None.

## Detailed verification notes

### 04-08 Task 1 — Notifications landing page + SideNav repoint
- `NotificationsLanding.tsx` (new, 47 lines): exports `NotificationsLanding()`, composed from `PageHeader`/`Card`/`Button` exactly per the design-system's documented contracts (`PageHeader.actions` is `React.ReactNode[]` with primary-last convention — satisfied; `Card.actions`/`title` props used correctly). `navigate('/notifications/compose')` carries no `incident=` param, matching the gap's reproduction requirement.
- `main.tsx`: `<Route path="notifications" element={<NotificationsLanding />} />` registered before its more-specific siblings (`groups`/`templates`/`compose`/`:id/delivery`) — react-router path matching has no ambiguity here regardless of order; import added correctly alongside the other notification page imports.
- `routes.ts` nav-config: `hasNotifications`-gated Coordinate-group item repointed from `/notifications/groups` to `/notifications`, relabeled `'Notification groups'` → `'Notifications'`, `id`/`icon` left unchanged as instructed. `'Message templates'` sub-item is untouched, still present, still pointing at `/notifications/templates`. No duplicate `'Notifications'` label exists elsewhere in the nav-config or AppShell to collide with the new Playwright `getByRole('link', { name: 'Notifications' })` selector (grepped for collisions — none).
- `notifications-compose.spec.ts`: new standalone `test()` outside the `describe.serial` block (correct — needs no shared fixture state), asserts URL `/notifications` then `/notifications/compose` with `not.toContain('incident=')` — exact gap reproduction.
- Cross-file seam: `SideNav`'s `href`-driven `<a>` tags (confirmed in `SideNav.tsx:155-165`) render real anchors, so `getByRole('link', ...)` resolves correctly against the repointed nav item. OK.

### 04-08 Task 2 — Deep-link return-path via OIDC `state`
- `oidc-config.ts`: `signIn(returnPath?: string): Promise<void>` forwards `userManager.signinRedirect(returnPath ? { state: returnPath } : undefined)`. Confirmed against the vendored `oidc-client-ts` type declarations (`node_modules/oidc-client-ts/dist/types/oidc-client-ts.d.ts`): `signinRedirect(args?: SigninRedirectArgs)` accepts `undefined`; `ExtraSigninRequestArgs.state?: unknown` (line 243/109); `User.state?: unknown` (line 169, "custom state data set during the initial signin request") — matches the plan's claimed API surface exactly.
- `RouteGuard.tsx`: unauthenticated-branch effect now calls `signIn(location.pathname + location.search)` — `location` already in scope via the file's existing `useLocation()` call. Sole caller of `signIn()` in the whole frontend (grepped) — no other call site needed updating.
- `SignInCallback.tsx`: reads `oidcUser.state` and type-guards it (`typeof state === 'string' && state.startsWith('/') && state !== '/auth/callback'`) before passing to `navigate(returnPath, { replace: true })`, falling back to `'/'` otherwise — closes the open-redirect vector (absolute URLs fall through) and the self-redirect-loop edge case (`/auth/callback` explicitly excluded). The fetch to `/api/v1/auth/sso/callback` immediately above this logic is untouched (see contract-scan verification above).
- `auth-deep-link-return-path.spec.ts`: uses `page.context().newPage()` (shared cookies, independent `sessionStorage`) — not `browser.newContext()` — matching the documented reproduction mechanism. Single navigation to the deep link with `waitUntil: 'commit'` avoids the double-redirect race the plan's own SUMMARY documents as an auto-fixed issue during execution; this is a sound fix, not a residual bug.
- `tsc --noEmit` clean on both `frontend/app` and `backend` for this diff.

### 04-08 Task 3 — AAR button explanation
- `IncidentWorkspace.tsx`: `title="Close this incident before generating its after-action report."` added to the disabled Generate-AAR `Button` (confirmed `Button` spreads `...rest` including `title` onto the native `<button>`, per `Button.tsx`); an always-visible `<p className="caption">Close this incident to generate its after-action report.</p>` renders conditionally on `incident.status !== 'Closed'`, directly below the button row. Matches `AarGenerator.tsx`'s own EmptyState wording (near-verbatim, singular/plural phrasing difference between the two messages is a non-functional wording choice, not a defect). `incident-workspace.spec.ts`'s new test 6 asserts both the `title` attribute and the visible caption.

### 04-09 — RBAC PERMISSION_DENIED
- `rbac.ts`: new `PERMISSION_DENIED` constant; `requirePermission()`'s single `if (!allowed)` branch (line 76-78) returns it instead of `ROLE_UNRESOLVED`. `ROLE_UNRESOLVED`'s constant definition and its one real call site (`routes.ts:85`, inside the SSO-callback's `RoleUnresolvedError` catch) are untouched — grepped the entire backend for every `ROLE_UNRESOLVED` reference; confirmed no other production call site existed that would now silently receive the wrong constant.
- `notifications.test.ts`'s one pre-existing assertion of the old behavior (`eoc_director` send-without-`approve` case) was updated to `PERMISSION_DENIED` with an accurate adjacent comment. Grepped every other backend `.test.ts` file asserting a `403` status for an `error_code` expectation (`plans.test.ts` `SELF_APPROVAL_BLOCKED`, `admin.test.ts` `AUDIT_LOG_IMMUTABLE`/`SSO_CONFIG_INVALID`, `reporting.test.ts` `DOCUMENT_IMMUTABLE`/`EVIDENCE_LOG_IMMUTABLE`) — none of these originate from `requirePermission()`'s denial branch (they're route-handler-level business-rule 403s thrown after the RBAC preHandler already passed), so none were silently broken by this rename.
- `rbac.test.ts` (new, 156 lines): sets up 3 roles (view+create-only, zero-grant, full-edit) against a bare test route gated by the real `requirePermission('reporting','edit')` preHandler, synced to real OPA via `syncRolePermissionsToOpa` (signature/usage matches every other test file's established pattern). 3 assertions: resolved-but-missing-one-action → `PERMISSION_DENIED` with accurate wording; zero-grant-on-feature → also `PERMISSION_DENIED` (proving the distinction is action-level, not feature-presence-level); positive control → not `PERMISSION_DENIED`. `mintSessionToken`'s call signature matches its existing usage across `admin.test.ts`/`routes.test.ts`.
- `tsc -p tsconfig.json --noEmit` clean on backend for this diff.

## Cross-file seams checked
- `NotificationsLanding` export (`NotificationsLanding.tsx`) → `main.tsx`'s route registration: OK — exact named import, exact route path.
- `routes.ts`'s repointed `href: '/notifications'` nav item → `main.tsx`'s registered `/notifications` route: OK — path match confirmed.
- `signIn(returnPath?)` (`oidc-config.ts`) → sole caller `RouteGuard.tsx`'s `signIn(location.pathname + location.search)`: OK — signature matches, no other call sites to break.
- `oidcUser.state` round-trip: `RouteGuard` sets it via `signIn()` → oidc-client-ts's `ExtraSigninRequestArgs.state` → Keycloak echoes it back → `SignInCallback` reads `User.state`: OK, confirmed against vendored type declarations.
- `POST /api/v1/auth/sso/callback` (frontend `SignInCallback.tsx:65`) → backend route declaration (`routes.ts:71`): OK — contract-scan's GET-labeled false positive refuted (method is POST, set via the fetch options object the scanner's parser missed).
- `requirePermission()`'s new `PERMISSION_DENIED` (`rbac.ts`) → test assertions across the backend suite: OK — the one real pre-existing dependent assertion (`notifications.test.ts`) was updated; no other test asserts `ROLE_UNRESOLVED` from an RBAC-preHandler-driven 403.
- `ROLE_UNRESOLVED`'s one remaining call site (`routes.ts`'s SSO-callback catch block) → unaffected by this rename: OK, confirmed untouched.
- `disabled={incident.status !== 'Closed'}` gate (`IncidentWorkspace.tsx`) ↔ `AarGenerator.tsx`'s own identical page-level guard: OK — consistent wording, consistent condition, no drift.

Both gap-closure plans' production code and tests are internally consistent, consistent with each other, consistent with the surrounding (already-reviewed) codebase, and introduce no regressions. Phase 4 remains clean.
