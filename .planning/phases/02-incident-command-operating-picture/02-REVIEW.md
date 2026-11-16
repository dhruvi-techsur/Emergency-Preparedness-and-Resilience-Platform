---
phase: 02
status: clean
blockers: 0
warnings: 0
files_reviewed: 11
files_reviewed_list:
  - backend/src/modules/incident-ops/activation.test.ts
  - backend/src/modules/incident-ops/activation.ts
  - backend/src/modules/incident-ops/closure.ts
  - backend/src/modules/incident-ops/command-roles.ts
  - backend/src/modules/incident-ops/incidents.test.ts
  - backend/src/modules/incident-ops/incidents.ts
  - backend/src/modules/incident-ops/operating-picture.test.ts
  - backend/src/modules/incident-ops/operating-picture.ts
  - frontend/app/e2e/incident-workspace.spec.ts
  - frontend/app/src/pages/incidents/ClosureModal.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
reviewed_at: 2026-11-16T15:07:20Z
iteration: 2
---

# Phase 2 Code Review (iteration 2 — re-review)

## Fix verification

### B1 — `IncidentWorkspace` infinite spinner on fetch error → **fixed, verified**
- **Commit:** `3b8eb4d`
- **File:** `frontend/app/src/pages/incidents/IncidentWorkspace.tsx:146-166`
- **Verification:** Read the fix directly. An `incidentQuery.isError` branch is now checked *before* the `isLoading || !data` fallback, so a settled-but-failed fetch (404, 500, etc.) no longer falls through to the old condition. The branch renders `EmptyState` with the real server message (`ApiRequestError.body.message` via `instanceof` narrowing, with a sane string fallback for non-`ApiRequestError` failures) and a "Back to incidents" `Button` wired to the already-in-scope `navigate` from `useNavigate()` (confirmed declared at line 124, used correctly — no new import needed beyond `ApiRequestError`, which was added). `EmptyState`'s `action` prop and `Button`'s `variant="primary"` are both real, exported members of `@epmp/design-system` (confirmed in `EmptyState.tsx:22` and `Button.tsx:17`). `tsc --noEmit` on `frontend/app` is clean. No regression: the pre-existing 4 e2e tests plus the new W2 test (5 total) in `incident-workspace.spec.ts` all pass against the live dev stack, none of which exercise the error path directly but none of which regressed either — the new error branch is additive and sits strictly before the unchanged loading/success logic.

### W1 — jurisdiction-scope gap on mutating incident-ops routes → **fixed (app-layer), verified**
- **Commit:** `e214583`
- **Files:** `incidents.ts`, `activation.ts`, `command-roles.ts`, `closure.ts`
- **Verification:** Every route the original finding named now enforces scope:
  - `GET /api/v1/incidents` (list) — `WHERE i.jurisdiction_id = ANY($1)` is now the first condition, `$1` bound to `req.epmpUser.jurisdiction_scope`; remaining filter params correctly renumbered starting at `$2` (`idx = 2`), and every subsequent `params.push()` call matches its `$${idx++}` placeholder in order — traced manually, no off-by-one.
  - `GET /api/v1/incidents/:id`, `PATCH /api/v1/incidents/:id`, `GET /api/v1/incidents/:id/timeline` — all now call `fetchIncidentForMutation`/`fetchIncidentDetailShape` with `req.epmpUser.jurisdiction_scope`, returning `INCIDENT_NOT_FOUND` (404) on scope miss, indistinguishable from a genuinely nonexistent id.
  - `POST /api/v1/incidents/:id/activation`, `POST /api/v1/incidents/:id/command-roles`, `POST /api/v1/incidents/:id/closure` — each now calls the shared `fetchIncidentForMutation(incidentId, req.epmpUser!.jurisdiction_scope)` guard before doing any state-changing work, confirmed read in full in all three files.
  - The shared helper `fetchIncidentForMutation` (`incidents.ts`) does the scoping once (`WHERE id = $1 AND jurisdiction_id = ANY($2)`), avoiding drift across the four call sites.
  - `POST /api/v1/incidents` (create) correctly does **not** apply a scope filter to its own `fetchIncidentDetailShape(incident.id)` call — intentional, since the caller just created this incident on their own behalf; this is not a re-introduction of the gap.
- Ran the actual backend test suite against the live Postgres container: **36/36 passing**, including the two new regression tests (`incidents.test.ts` "jurisdiction-scope isolation" and `activation.test.ts` "jurisdiction-scope isolation... W1 fix") which construct a genuinely separate jurisdiction + user and assert 404 on GET-detail/list/PATCH/timeline and activation/command-roles/closure respectively, plus a sanity check that the legitimate owner can still act on their own incident. Not taking the SUMMARY's word for it — read both new tests in full; they exercise real HTTP round-trips against the real schema, not mocks.
- **Scope caveat correctly carried forward, not silently dropped:** the DB-layer RLS-policy half (`CREATE POLICY` + `SET LOCAL app.jurisdiction_scope`) remains unimplemented, as the fix commit message and 02-REVIEW.md's own resolution note both state plainly. This was explicitly out of scope for an app-layer fix-pass (it requires a new migration) and the original finding's own fix-direction offered both halves as alternatives ("and/or"). Not escalating this residual gap to a new finding in this iteration — it was disclosed, not hidden, and the app-layer enforcement now closes the actual exploitable path (a direct SQL injection or a compromised app-tier credential would still need the DB-layer backstop, but that is a materially different threat than "any authenticated user through the normal API").

### W2 — incident closure unreachable from the UI → **fixed, verified**
- **Commit:** `2420eb7`
- **Files:** `ClosureModal.tsx` (new), `IncidentWorkspace.tsx`
- **Verification:** Read `ClosureModal.tsx` in full. It follows the exact `ActivationModal` division of responsibility described in its own doc comment: the Modal's `danger` tier and consequence wording are the UX half, `POST /api/v1/incidents/{id}/closure` with `{confirmed: true}` is the actual enforcement (confirmed against `closure.ts`, which does reject `confirmed !== true` with `ACTIVATION_CONFIRMATION_REQUIRED` before doing any work). `err.message` on a caught `ApiRequestError` resolves correctly because `ApiRequestError`'s constructor calls `super(body.message)` (confirmed in `api-client.ts:9-16`) — the error surfaced to the user is the real backend message, not a generic string. `IncidentWorkspace.tsx`'s new `PageHeader` action is conditionally rendered only `incident.status === 'Open'`, correctly hidden post-closure. `Modal`'s `danger` prop sets `role="alertdialog"` (confirmed in `Modal.tsx:110`), matching the new e2e test's `page.getByRole('alertdialog')` selector. `Button`'s `ButtonVariant` type includes `'danger'` (confirmed `Button.tsx:17`) — no type mismatch.
- Ran the actual Playwright e2e spec against the live dev stack (frontend on :5173, backend on :8080, both already running): **5/5 passing**, including the new test 5 ("Closing an incident via the Modal removes the action and records a Timeline entry") which opens the Modal, confirms, asserts the action disappears, and asserts the Timeline tab shows "Incident closed" — genuinely exercised, not just asserted in a commit message.

### W3 — malformed `bbox` producing NaN geometry → **fixed, verified**
- **Commit:** `9d24d5f`
- **File:** `backend/src/modules/incident-ops/operating-picture.ts:112-126`
- **Verification:** Read the fix in full context. `parsedBbox.length !== 4 || !parsedBbox.every(Number.isFinite)` correctly catches both the wrong-arg-count case and the NaN/Infinity case (`Number.isFinite` returns `false` for `NaN`, `Infinity`, `-Infinity`, and non-numbers — correct choice over `isNaN` which has coercion surprises, though either would have worked here since `Number('abc')` is `NaN` not some other primitive). On validation failure it `throw`s into the already-existing empty `catch` block, which was already proven (by the pre-existing `force_gis_failure` test) to fall through cleanly to the schematic defaults set above the `try`. This reuses the existing failure path rather than inventing a new one — correct, minimal fix exactly matching the original finding's fix-direction.
- Ran the actual backend test suite: the new regression test (`bbox=1,2,notanumber` → 200, `base_layer_source: 'Schematic base map, offline'`) passes, and the full `operating-picture.test.ts` file (5/5) and full backend suite (36/36) pass with this fix combined with W1's changes to the same file region (no interaction/conflict between the two fixes — W1 didn't touch `operating-picture.ts` at all, since its two routes were already correctly scoped before this phase's fix-pass).

## Regression check

No regressions introduced by any of the four fixes:
- Full backend test suite: 36/36 passing (ran directly against the live Postgres/Keycloak/NATS/OPA containers, not trusting the commit message's claim).
- `tsc --noEmit` clean on `backend`, `frontend/app`, and `frontend/design-system`.
- Full `incident-workspace.spec.ts` Playwright suite: 5/5 passing against the live dev stack (frontend :5173, backend :8080).
- Cross-checked every new/changed call site introduced by the fixes (`fetchIncidentForMutation`, `fetchIncidentDetailShape(id, scope)`, `ClosureModal` props, the renumbered list-query param indices) against its own definition and every caller — no signature drift, no off-by-one in the SQL param renumbering, no stale import.
- `ApiRequestError.body.message` / `.message` usage in both `IncidentWorkspace.tsx` (B1) and `ClosureModal.tsx` (W2) verified against the actual class definition in `api-client.ts` rather than assumed.

## Cross-file seams checked (fix-pass scope)

- `fetchIncidentForMutation` export (`incidents.ts`) ↔ its 4 call sites in `incidents.ts` (PATCH, timeline), `activation.ts`, `command-roles.ts`, `closure.ts` — OK, identical signature `(incidentId: string, jurisdictionScope: string[])` at every call site.
- `fetchIncidentDetailShape(id, jurisdictionScope?)` / `fetchIncidentListShape(id, jurisdictionScope?)` signature change ↔ every caller (`incidents.ts` GET/PATCH, `activation.ts` ×2, `closure.ts` ×2) — OK, all updated consistently; the one intentionally-unscoped call (`POST /incidents` create round-trip) is deliberate, not a missed site.
- Incidents-list SQL param renumbering (`idx` now starts at 2) ↔ the 4 conditional `params.push()`/`$${idx++}` pairs below it — OK, traced in order, no mismatch.
- `ClosureModal` props (`incidentId`, `incidentName`, `open`, `onClose`, `onClosed`) ↔ `IncidentWorkspace.tsx`'s usage — OK, exact match.
- `ClosureModal`'s `apiPost('/api/v1/incidents/{id}/closure', {confirmed: true})` ↔ `closure.ts`'s route declaration and `Body: {confirmed?: boolean}` type — OK.
- `Modal danger` prop → `role="alertdialog"` ↔ new e2e test's `getByRole('alertdialog')` selector — OK.
- `IncidentWorkspace.tsx`'s new `isError` branch ↔ `EmptyState`/`Button` design-system exports — OK, both exist with the props used.
- `ApiRequestError.message`/`.body.message` usage in both fixed files ↔ actual class definition (`super(body.message)`) — OK, confirmed not an assumption.
- `operating-picture.ts`'s new bbox validation ↔ existing `catch` block's fallthrough behavior (previously proven by the `force_gis_failure` test) — OK, reuses proven path rather than new logic.

All 4 iteration-1 findings (1 BLOCKER, 3 WARNINGs) confirmed genuinely fixed at the root cause, each with real regression test coverage that was actually run (not just claimed) against the live stack. No new defects introduced by the fixes. No findings to carry forward except the already-disclosed, explicitly-out-of-scope DB-layer RLS half of W1, which is not escalated here since it was transparently scoped out rather than hidden.
