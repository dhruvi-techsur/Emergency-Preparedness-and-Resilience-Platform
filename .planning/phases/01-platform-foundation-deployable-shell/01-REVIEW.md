---
phase: 1
status: issues_found
blockers: 0
warnings: 1
files_reviewed: 5
files_reviewed_list:
  - backend/src/modules/auth-org/admin-sso-config.ts
  - backend/src/modules/integration-gateway/webhook-delivery-worker.ts
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/admin/RecordAuthority.tsx
  - backend/src/modules/integration-gateway/record-authority.ts
reviewed_at: 2026-11-16T05:58:00Z
iteration: 2
---

# Phase 1 Code Review — Iteration 2 (re-review of fix commits 59dae11, e9a5f29, 8b994a6)

## Verification of prior findings

### B1 (SSO config has no create path) — VERIFIED FIXED

Read the full diff and the resulting file (`admin-sso-config.ts:132-230`). `PATCH /api/v1/admin/sso-config` now branches on `fetchCurrentConfig()` returning `undefined`: when no row exists it `INSERT`s a new row (lines 209-224) instead of 404ing; when a row exists it still `UPDATE`s as before. Added a 400 `SSO_CONFIG_INVALID` guard (lines 148-153) requiring at least one metadata field on create, which is also enforced by the table's own `chk_idp_metadata` CHECK constraint as a second line of defense.

**Verified directly against the live compose stack, not just by reading the diff:** backed up the single pre-existing `sso_config` row, `DELETE`d it to genuinely simulate a fresh deployment, started the real server (`tsx src/server.ts`) against the live Postgres/NATS/OPA, and drove the routes with curl using a session JWT minted the same way `session.ts` does:
- `GET /api/v1/admin/sso-config` on the empty table → `404 SSO_CONFIG_NOT_FOUND` (expected, unchanged).
- `PATCH` with only `protocol` + `idp_metadata_url`, no `active` → `200`, a new row is created (confirmed via a second `GET` immediately returning `200` with the same data).
- `PATCH` with `protocol` only (no metadata at all) on the still-empty table → `400 SSO_CONFIG_INVALID`, and confirmed via direct `SELECT COUNT(*)` that no row was inserted.

Full backend suite (22/22, run directly against the live stack) and `tsc --noEmit` (backend + frontend) both pass. B1 is genuinely closed — the real-deployment bootstrap path works as the fix claims. Restored the original row afterward; `sso_config` count is back to 1.

**Resolution:** no action needed — already fixed in prior iteration, re-confirmed above.

### W1 (dead "Record Authority" nav item) — VERIFIED FIXED, but introduces a new defect (see W-new below)

`RecordAuthority.tsx` (175 lines, new file) + the `<Route path="admin/record-authority" ...>` wired into `main.tsx:65` close the original gap: the nav item now lands on a real list+modal screen that calls the already-complete `GET`/`POST /api/v1/admin/record-authority` endpoints. Response/request shapes match exactly (`record_type`/`authoritative_system`/`notes`, matching `record-authority.ts:6-10` and `:90-94`). `vite build` succeeds, `tsc --noEmit` is clean, and `gateway.test.ts`'s existing coverage of the same backend endpoints (test 4/5) still passes, confirming the contract the new screen depends on is unchanged. Playwright e2e has no spec covering this new screen (not a blocker — Record Authority wasn't in scope for any existing e2e file, and its omission isn't a regression from this fix).

However, see the new WARNING below: the "Edit" modal this fix adds lets the admin change the `record_type` field itself, which the backend contract doesn't support as an edit — it creates a duplicate registry entry instead.

**Resolution:** no action needed on W1 itself (already fixed in prior iteration, re-confirmed above); the defect it introduced is tracked and fixed as W-new-1 below.

### W2 (webhook delivery worker never retries) — VERIFIED FIXED

`webhook-delivery-worker.ts`'s processing loop now tracks `anyFailure` across all per-subscription delivery attempts for a message and, at the end, calls `msg.nak(delayMs)` (computed via the existing `computeBackoff(msg.info.deliveryCount)`) instead of unconditionally `msg.ack()`ing when any attempt failed. Confirmed `nak(millis?: number): void` is the real NATS JsMsg API (`node_modules/nats/lib/jetstream/jsmsg.d.ts:47`), matching the fix's usage, and `deliveryCount: number` is a real field on `msg.info` (`jsapi_types.d.ts:995-998`) — not a hallucinated API. The fix additionally reworks the per-delivery dedup logic so a JetStream-redelivered message reuses the existing `webhook_deliveries` row (re-attempting it) rather than treating any existing row as an unconditional "already processed, skip," correctly distinguishing a `'delivered'` row (true duplicate, skip) from a `'failed'` row (retry target). A race between a concurrent redelivery's `INSERT` and this code's own `INSERT ... ON CONFLICT DO NOTHING` is handled by re-selecting the row the other path created rather than silently dropping the delivery attempt (lines 130-144).

The outer `catch (err)` block (line 188-191, unrelated to this fix, pre-existing) still unconditionally `ack()`s on a genuinely unexpected processing exception (e.g. a decode failure) — this is intentionally out of scope for W2 (W2 was specifically about per-subscription *delivery* failures being silently swallowed, which is now fixed) and is a defensible choice (an unparseable/corrupt message should not infinitely redeliver). Not re-flagging this as a new issue.

Full backend suite (22/22) passes, including `eventbus.test.ts`'s delivery-mechanics coverage, which exercises the same code path (though it does not specifically assert on the nak/redelivery branch — only the happy-path ack branch is exercised by any automated test currently in the repo; the fix's retry behavior was verified by the fixer manually against a flaky receiver per the commit message, and independently confirmed here via direct code/type-signature inspection rather than re-running that manual scenario).

**Resolution:** no action needed — already fixed in prior iteration, re-confirmed above.

## WARNINGs

### W-new-1: RecordAuthority.tsx's edit modal allows changing the natural-key `record_type` field, silently creating a duplicate registry row instead of editing the existing one

- **File:** `frontend/app/src/pages/admin/RecordAuthority.tsx:61-67,150-155`
- **Evidence:** `openEditModal(row)` (lines 61-67) prefills `recordType` from the clicked row's `record_type` into the SAME `recordType` state the create flow uses, and the modal's "Record type" `TextField` (lines 150-155) is fully editable in both the create and edit case — there is no `disabled`/`readOnly` prop distinguishing edit mode from create mode, and no separate "this field is locked once registered" treatment. `handleSave()` (lines 69-87) always calls `POST /api/v1/admin/record-authority` with whatever `recordType` is currently in the field.

  The backend's `POST` route (`record-authority.ts:69-79`) upserts via `ON CONFLICT (record_type) DO UPDATE` — `record_type` is the natural key the conflict target is keyed on. If an admin opens the edit modal for an existing row (e.g. `personnel_roster` → `HRIS`) and, intending to just update the `notes` or `authoritative_system`, also edits the "Record type" field (or mis-clicks/fat-fingers it), the `POST` does NOT update the original `personnel_roster` row — it inserts a brand-new row under the new key, leaving the original row untouched and orphaned in the registry.

  **Confirmed directly against the live backend**, bypassing the UI: registered `test_record` → `EPMP`, then POSTed `test_record_renamed` (same authoritative_system/notes, simulating "opened edit, retyped the Record type field") — the registry ended up with BOTH `test_record` and `test_record_renamed` as separate rows, not one updated row. This is exactly what the UI's current edit flow would produce if a user edited that field during an "Edit" action, since the component has no mechanism preventing it.

  Net effect: `checkRecordAuthority(recordType)` (the function every future Phase 2+ write-path call site depends on per this file's own doc comment) would continue resolving the OLD `record_type` to its stale authoritative_system, since the "edit" silently created a new, differently-keyed row rather than correcting the existing one — the admin has no visible indication their edit didn't apply to the record they thought they were editing.
- **Fix direction:** Disable/lock the "Record type" field when the modal is opened via `openEditModal` (i.e. derive a `isEditMode` flag from whether a row was passed in, and set the TextField's `disabled` prop accordingly), matching the backend's actual edit semantics (record_type is an immutable natural key once registered; only `authoritative_system`/`notes` are editable in place).

**Resolution:** fixed (5e0813b) — added `isEditMode` state set by `openCreateModal`/`openEditModal`, passed as `disabled` on the "Record type" `TextField` plus an explanatory hint shown only in edit mode. Verified: `tsc --noEmit` clean, `vite build` succeeds.

## Cross-file seams checked (this iteration's scope)

- `backend/src/modules/auth-org/admin-sso-config.ts` PATCH (create+update) ↔ `frontend/app/src/pages/admin/SsoConfigForm.tsx`'s single `apiPatch` call: OK — same body shape on both create and update paths; form's default field values (`email`/`name`/`groups`, empty group mapping) match the backend's `DEFAULT_ATTRIBUTE_MAPPING`/`[]` fallbacks exactly, so a bare first-save from this screen persists without needing special-casing.
- `backend/src/modules/integration-gateway/webhook-delivery-worker.ts` ↔ `backend/src/modules/integration-gateway/nats-client.ts` (`AckPolicy.Explicit`, durable consumer): OK — `nak()`/`msg.info.deliveryCount` usage matches the real `nats` package's type declarations (verified directly against `node_modules/nats/lib/jetstream/jsmsg.d.ts` and `jsapi_types.d.ts`), not assumed.
- `frontend/app/src/pages/admin/RecordAuthority.tsx` ↔ `backend/src/modules/integration-gateway/record-authority.ts` (GET/POST): response/request shapes match exactly — but see **W-new-1**, the UI's edit-mode affordance doesn't match the backend's upsert-by-natural-key semantics.
- `frontend/app/src/main.tsx` route tree ↔ `AppShell`'s nav config (`routes.ts:48`'s `record-authority` nav item): OK — the route now exists, closing the original W1 dead-link gap.

## Note on scope

This iteration reviewed only the 5 files touched by the three fix commits (`59dae11`, `e9a5f29`, `8b994a6`) plus `record-authority.ts` as the backend counterpart `RecordAuthority.tsx` newly integrates against, per the re-review scoping rule. The rest of iteration 1's 73-file `files_reviewed_list` was not re-read in this pass since none of those other files were touched by the fix commits.
