---
phase: 5
status: clean
blockers: 0
warnings: 0
files_reviewed: 20
files_reviewed_list:
  - backend/scripts/seed.ts
  - backend/src/modules/auth-org/rbac.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/auth-org/opa-client.ts
  - backend/src/modules/incident-ops/field-reports.ts
  - backend/src/modules/incident-ops/tasks.ts
  - backend/src/modules/incident-ops/sync-conflicts.ts
  - backend/migrations/1700000000010_field-operations-schema.js
  - frontend/app/src/lib/offline-queue.ts
  - frontend/app/src/lib/offline-queue.test.ts
  - frontend/app/src/lib/api-client.ts
  - frontend/app/src/pages/field-mobile/QueuedSubmissions.tsx
  - frontend/app/src/pages/field-mobile/ReportObservation.tsx
  - frontend/app/src/pages/field-mobile/SyncConflictResolution.tsx
  - frontend/app/src/pages/field-mobile/FieldHome.tsx
  - frontend/app/src/main.tsx
  - frontend/app/e2e/app-shell.spec.ts
  - frontend/app/e2e/field-mobile-report.spec.ts
  - frontend/app/e2e/field-mobile-sync-conflict.spec.ts
  - .planning/phases/05-mobile-field-operations/05-REVIEW.md
reviewed_at: 2026-11-18T16:45:00Z
iteration: 2
---

# Phase 5 Code Review (re-review)

Re-review scope per instructions: verify each of iteration 1's 6 findings
(B1, B2, B3, W1, W2, W3) against the current code (not the fixer's claims),
check the 6 fix commits (`25f92ff`, `a3f0880`, `67bcb5c`, `6634781`,
`6eda07c`, `5bc63c8`) and every file they touched, and trace dependents of
each changed seam for regressions. `tsc --noEmit` run clean on both
`backend/` and `frontend/app/`. `offline-queue.test.ts` (8/8),
`field-reports.test.ts` (7/7), `tasks.test.ts` (5/5), and `routes.test.ts`
(6/6) all re-run and pass.

## Verification of iteration-1 findings

### B1 (photo upload targets the wrong identifier) — CONFIRMED FIXED
Read `backend/src/modules/incident-ops/field-reports.ts:304-345` (POST) and
`:374-395` (GET) directly. Both routes now resolve `:id` via
`SELECT id FROM field_reports WHERE id::text = $1 OR client_report_id = $1`
before any INSERT/SELECT against `field_report_photos`. `client_report_id`
is `VARCHAR(100) NOT NULL UNIQUE` (migration line 20) and `id` is the
`UUID PRIMARY KEY` — the `id::text` cast correctly avoids the
`uuid = character varying` operator error for non-UUID-shaped client ids
while still matching when `$1` happens to be a real UUID. Since
`client_report_id` carries a `UNIQUE` constraint and `id` is the PK, there
is no ambiguity between the two branches of the `OR`.
`ReportObservation.tsx` now `await`s `syncQueueNow()` before the upload
call (closing the original fire-and-forget race) and the backend's
id-or-client_report_id fallback is genuinely redundant-but-safe on top of
that. `uploadFieldReportPhoto` in `api-client.ts` is unchanged and still
passes `clientReportId` — correct, since the route now accepts it.
`field-reports.test.ts` exercises this module end-to-end (7/7 passing).
**Fixed, no regression.**

### W3 (silent photo-upload failure) — CONFIRMED FIXED
Read the full diff: `photoUploadError` state is set on catch, an
`Alert tone="warning"` with the exact plan-specified copy and a "Retry the
photo" action (`handleRetryPhoto`, re-targets via the stable
`clientReportId` ref) renders. Navigation to `/field` is correctly
deferred (`if (!photoFailed) navigate(...)`) so the Alert is actually
visible before unmount. `Alert`'s `actions` prop exists in the design
system (`frontend/design-system/src/feedback/Alert.tsx:34`) and is
rendered (`:63`) — the `Button` passed as `actions` is a valid consumer.
**Fixed, no regression.**

### B2 (field_responder lacked a tasks `edit`/status grant) — CONFIRMED FIXED
Read `rbac.ts` in full. `requirePermission(feature, action)` now simply
delegates to `requireAnyPermission(feature, [action])` — behaviorally
identical to the pre-fix single-action check for every one of the ~70
other `requirePermission(...)` call sites across the backend (confirmed by
grep across every module: `federation-grants.ts`, `resource-requests.ts`,
`incidents.ts`, `plans.ts`, `admin-*.ts`, `evidence-log.ts`,
`notifications.ts`, etc. — all still call the two-arg form, all resolve
through the identical single-iteration loop). `tasks.ts`'s
`PATCH /:id/status` now uses `requireAnyPermission('tasks', ['edit',
'status'])`; `seed.ts` grants `field_responder` `['view','status']`
(verified the diff: explicit idempotent UPDATE path, not just
`findOrInsert`, so a previously-seeded `['view']`-only row is correctly
widened on re-seed — matters because `findOrInsert`'s match key is
`(role_id, feature)`, which would otherwise never fire on an existing row).
`opa-client.ts`'s `syncRolePermissionsToOpa` pushes the `actions` array
verbatim per feature with no hardcoded action enum to update elsewhere —
no additional seam to break. `tasks.test.ts` (5/5) and
`field-reports.test.ts` (7/7) both pass post-fix. **Fixed, no regression.**

### B3 (My Tasks `/field/tasks` orphan screen) — CONFIRMED FIXED
`routes.ts`'s `field-tasks` nav-config item's `href` changed from `/field`
to `/field/tasks` (one-line diff, confirmed via `git show`). `main.tsx`'s
route tree is untouched — `field` → `FieldHome`, `field/tasks` →
`MyTasksField`, both still registered (confirmed by direct read of
`main.tsx:172` and surrounding routes). Grepped `app-shell.spec.ts`,
`field-mobile-report.spec.ts`, `field-mobile-sync-conflict.spec.ts` for any
hardcoded assertion on the old `/field` href or any `page.goto`/
`waitForURL` that would break from this change — none found; the only
field-mobile-report spec URL assertion is `pathname === '/field'` for
Field Home itself (still correct, unaffected). **Fixed, no regression.**

### W1 (resolved sync conflicts never cleared local IndexedDB status) — CONFIRMED FIXED
`resolveQueuedConflict(conflictId, resolution)` added to `offline-queue.ts`
exactly mirrors the server's own branch in
`sync-conflicts.ts:138-155` (`keep_mine` → `synced`, `keep_eoc` → `failed`)
rather than collapsing to one state. Traced the `conflict_id` identifier
through both sides: `field-reports.ts:229`'s sync-batch conflict branch
sets `conflict_id: conflictRows[0].id` (i.e. `sync_conflicts.id`);
`offline-queue.ts:355` stores that value as the local row's `conflict_id`;
`SyncConflictResolution.tsx`'s route param `id` (`/field/conflicts/:id`)
is the *same* `sync_conflicts.id` used in both `GET /sync-conflicts/:id`
and `POST /sync-conflicts/:id/resolve`. `handleResolve` now calls
`resolveQueuedConflict(id, resolution)` with that exact id after the POST
succeeds — the identifiers line up correctly on both sides. The no-match
branch (conflict seeded directly against the backend, not via this
device's own queue) correctly no-ops rather than throwing.
`offline-queue.test.ts` (8/8, including the 3 new cases) passes.
**Fixed, no regression.**

### W2 (queued task-status changes invisible in Queued Submissions) — CONFIRMED FIXED
`getQueueSnapshot()` already computed `taskStatusItems` locally for the
`queuedCount` aggregate pre-fix; the fix just adds it to the returned
`QueueSnapshot` object (confirmed: `return { state, queuedCount, items,
taskStatusItems }`). `QueuedSubmissions.tsx` renders it as a separate,
read-only card list titled `"Task status: {new_status}"` exactly per
05-04-PLAN.md's documented format, sharing the `STATUS_BADGE` lookup
(confirmed `QueuedTaskStatusChange['queue_status']` type —
`'pending'|'syncing'|'synced'|'failed'` — is a strict subset of
`QueuedFieldReport['queue_status']`, so the shared `Record` lookup table
is type-safe with no unsafe cast). `tsc --noEmit` clean on this file.
**Fixed, no regression.**

## Contract scan (re-run)

```
c-gap api frontend/app/src/pages/SignInCallback.tsx:65 GET /api/v1/auth/sso/callback — no matching backend route declaration
c-adv api frontend/app/src/lib/api-client.ts:121 GET /api/v1/field-reports/${fieldReportId}/photos — dynamic path, could not match statically
contracts: gaps=1 advisories=1 routes=46 api_routes=18 front_files=97 back_files=51
```

Identical output to iteration 1 — no new gaps introduced by any of the 6
fixes. Both entries were already investigated and confirmed non-issues in
iteration 1 (SignInCallback is a POST with `method:'POST'` set on a
separate object-literal line the scanner's static parser can't see;
`uploadFieldReportPhoto` is actually a POST whose dynamic path the scanner
correctly flags as unresolvable — the real bug this pairing had, the
client/server identifier mismatch, is B1 above, now fixed).

## Regression check on changed seams

- `requirePermission` ↔ all ~70 other call sites across
  `incident-ops/*`, `integration-gateway/*`, `auth-org/*`,
  `comms-reporting/*`, `plans/*` — grepped every usage; all still call the
  2-arg form, which delegates to `requireAnyPermission(feature, [action])`
  with identical single-iteration behavior. OK, no regression.
- `tasks.ts`'s `/owner` route (separate `edit`-gated endpoint, adjacent to
  the fixed `/status` route) — unchanged, still `requirePermission('tasks',
  'edit')`, still correctly excludes `field_responder`. OK.
- `offline-queue.ts`'s existing `items`-only consumers (FieldMap's
  location-marker filter, `deleteQueuedItem`/retry handlers keyed on
  `client_report_id`) — `taskStatusItems` was added as a genuinely separate
  field, not a union widening of `items`, so none of these needed or
  received changes. Confirmed by reading `QueueSnapshot`'s full shape and
  every consumer of `.items`. OK.
- `SyncConflictResolution.tsx` ↔ `offline-queue.ts`'s new
  `resolveQueuedConflict` export — signature and identifier semantics
  verified consistent (see W1 above). OK.
- `QueuedSubmissions.tsx` ↔ `offline-queue.ts`'s new `taskStatusItems`
  field and `QueuedTaskStatusChange` type — import, type, and badge-map
  usage all consistent; `tsc --noEmit` clean. OK.
- `routes.ts` nav-config `field-tasks` href change ↔ `main.tsx` route tree
  ↔ e2e specs — traced all three; no stale assertions broken. OK.
- `field-reports.ts`'s photo routes ↔ `api-client.ts`'s
  `uploadFieldReportPhoto` — route accepts the identifier the frontend
  already sends; no frontend change was needed or made. OK.
- `seed.ts`'s widened `field_responder` tasks grant ↔ `opa-client.ts`'s
  `syncRolePermissionsToOpa` — pushes `actions` verbatim per feature, no
  hardcoded action enum elsewhere to go stale. OK.

## BLOCKERs

None.

## WARNINGs

None.

## Cross-file seams checked

All seams from iteration 1 re-verified (see "Regression check on changed
seams" above for the ones touched by the fix pass); no new seams
introduced since no new routes/exports/types were added beyond
`requireAnyPermission`, `resolveQueuedConflict`, and
`QueueSnapshot.taskStatusItems`, all three traced to every consumer above.
