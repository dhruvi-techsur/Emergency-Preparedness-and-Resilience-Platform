---
phase: 1
status: clean
blockers: 0
warnings: 0
files_reviewed: 1
files_reviewed_list:
  - frontend/app/src/pages/admin/RecordAuthority.tsx
reviewed_at: 2026-11-16T06:10:00Z
iteration: 3
---

# Phase 1 Code Review — Iteration 3 (re-review of fix commit 5e0813b)

## Scope

Per the re-review scoping rule, this iteration reviews only `RecordAuthority.tsx` — the single file the fixer touched in commit `5e0813b` — plus the live backend endpoint it integrates against (`record-authority.ts`, unchanged since iteration 2, re-confirmed by direct exercise below rather than re-read). Iteration 2's other verified-fixed findings (B1, W1, W2, spanning `admin-sso-config.ts`, `webhook-delivery-worker.ts`, `main.tsx`) were not touched by this commit and are not re-reviewed.

## Verification of W-new-1

**Finding (iteration 2):** `RecordAuthority.tsx`'s edit modal let an admin change the `record_type` field — the natural key the backend's `POST /api/v1/admin/record-authority` upserts on (`ON CONFLICT (record_type) DO UPDATE`) — producing a duplicate registry row instead of updating the original.

**Fix applied (5e0813b):** Added `isEditMode` state, set `true` by `openEditModal` / `false` by `openCreateModal` (lines 47, 55, 64). The "Record type" `TextField` now receives `disabled={isEditMode}` (line 159) plus an explanatory `hint` shown only in edit mode (line 155).

**Verified by reading the code:**
- `TextField` (`frontend/design-system/src/forms/TextField.tsx:96-99`) spreads `disabled` straight onto the native `<input>` via `sharedProps`/`...rest` — a real HTML `disabled` attribute, not a cosmetic/CSS-only treatment. A disabled native input rejects all keyboard/paste/programmatic-via-user-interaction edits; its `onChange` cannot fire from user interaction, so the controlled `recordType` state cannot diverge from the value `openEditModal` set it to (`row.record_type`, line 65) for the lifetime of that modal session.
- `handleSave` (lines 72-90) still reads `recordType` from the same state variable, so in edit mode it is structurally guaranteed to resubmit the original `record_type`, making the `POST` an in-place update under `ON CONFLICT (record_type) DO UPDATE` rather than an insert of a new key.
- `openCreateModal` resets `isEditMode` to `false` and clears `recordType` to `''` (lines 55-60), so the field correctly re-enables for the create flow and state doesn't leak between an edit session and a subsequent create session.

**Verified by direct exercise against the live backend** (not just static reading): minted a real admin session JWT via `mintSessionToken` reusing `gateway.test.ts`'s existing `gateway_test_admin_role`/test user, then drove the actual sequence the fixed UI now produces:
1. `POST` create `review_test_record` → `OriginalSystem` / `"initial"`. `GET` confirms exactly one row.
2. `POST` with `record_type` held byte-identical to the row being edited (what a disabled field guarantees) and only `authoritative_system`/`notes` changed → `UpdatedSystem` / `"updated via edit"`.
3. `GET` afterward shows **exactly one** `review_test_record` row, with the updated fields — the original row was updated in place, not duplicated.

This matches iteration 2's own repro of the bug (where a changed `record_type` on the same POST produced two separate rows) but with the key field now held constant, confirming the fix closes the gap. Test row cleaned up afterward (`DELETE FROM record_authority_registry WHERE record_type = 'review_test_record'`); registry back to its pre-test 36 rows minus the new test rows added by this check (1 in, 1 deleted — net zero).

**Regression check:** `tsc --noEmit` (frontend) clean, `vite build` succeeds (108 modules, no errors). No other state, prop, or JSX regressions found — the diff is additive (one new state variable, two setter calls, two new props on one `TextField`) and doesn't touch `handleSave`, the `Table`'s row-click wiring, the `Modal`'s open/close lifecycle, or the create flow's reset logic.

**Verdict: W-new-1 is genuinely fixed.** No new defects introduced by this commit.

## BLOCKERs

None.

## WARNINGs

None.

## Cross-file seams checked

- `RecordAuthority.tsx`'s edit-mode `TextField` (`disabled`) ↔ native HTML `disabled` semantics via the design system's `TextField` component (`...rest` spread): OK — confirmed a real attribute, not cosmetic.
- `RecordAuthority.tsx`'s edit flow ↔ backend `POST /api/v1/admin/record-authority`'s `ON CONFLICT (record_type)` upsert semantics: OK — confirmed via live exercise that the fixed flow now produces exactly one row per edit, not a duplicate.
- `isEditMode` state ↔ `openCreateModal`/`openEditModal` entry points: OK — both paths correctly set/reset it, no state leak across modal sessions.

## Overall phase status

This is iteration 3, the final allowed review pass. All findings from iterations 1–2 (B1, W1, W2, W-new-1) are now verified fixed with no regressions. Phase 1 is clean.
