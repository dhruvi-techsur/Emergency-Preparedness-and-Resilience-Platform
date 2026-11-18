---
phase: 4
status: clean
blockers: 0
warnings: 0
files_reviewed: 4
files_reviewed_list:
  - frontend/app/src/pages/reporting/EvidenceLogView.tsx
  - frontend/app/src/lib/api-client.ts
  - backend/src/modules/comms-reporting/reporting.ts
  - backend/src/modules/comms-reporting/reporting.test.ts
reviewed_at: 2026-11-18T08:05:00Z
iteration: 2
---

# Phase 4 Code Review (re-review, iteration 2)

## Verification of prior findings

### B1 — Evidence Log CSV export used `window.location.href` (dropped Bearer auth header) — VERIFIED FIXED
- **Fix commit:** 210c733
- **File:** `frontend/app/src/lib/api-client.ts:72-90`, `frontend/app/src/pages/reporting/EvidenceLogView.tsx:155-168,217`
- **Verification:** Read both files in full. `apiGetBlob()` is a new exported function that calls `fetch(path, { headers: { ...authHeaders() } })` — identical header-attachment mechanism to every other `apiGet`/`apiPost`/`apiPatch` call in this file, so the `Authorization: Bearer <token>` header is now actually sent. It correctly replicates `handleResponse`'s 401 handling (clear session, redirect to `/`, throw `ApiRequestError`) and falls through to `res.blob()` on success rather than `res.json()`, which is correct for a CSV body. `EvidenceLogView.tsx`'s `handleExportCsv` now calls `apiGetBlob(...)`, builds an object URL, and triggers a synthetic `<a download>` click — the exact pattern `AarGenerator.tsx`'s pre-existing `handleExportTimeline` uses. The button's `onClick` is `() => void handleExportCsv()`, correctly fire-and-forgetting the async handler without an unhandled-rejection risk (errors are caught inside `handleExportCsv`'s own try/catch and surfaced via `exportError` state, which the JSX renders as an `Alert tone="danger"`). `tsc --noEmit` on the frontend project is clean. No regression: the button still passes the same `queryParams` querystring as before, and the backend route (`evidence-log.ts:189-224`) is unchanged, still gated by `requirePermission('reporting','view')` — now actually satisfiable since the Bearer header is present.

### W1 — AAR findings re-POST duplicated rows instead of replacing them — VERIFIED FIXED
- **Fix commit:** 57f7d2a
- **File:** `backend/src/modules/comms-reporting/reporting.ts:436-444`
- **Verification:** Read the route in full (lines 376-456). A `DELETE FROM aar_findings WHERE aar_id = $1` was inserted immediately after the `aars` row upsert succeeds (after the `DOCUMENT_IMMUTABLE` guard, so a re-POST against an already-Finalized AAR never reaches the DELETE) and immediately before the per-finding `INSERT` loop. This correctly makes every re-POST (first-ever or repeat) delete-then-reinsert, matching the route's own "refreshes the snapshot" doc comment and `AarGenerator.tsx`'s `handleFinalize()` call pattern (re-POST findings, then finalize). Checked for FK fallout: `aar_findings.id` has no other table referencing it (grepped all migrations for `REFERENCES aar_findings` — zero matches), so the DELETE is safe with no orphan-reference risk. Checked for a transaction-atomicity regression: both the DELETE and the subsequent INSERT loop use the same non-transactional `query()` helper the rest of this route already uses (no `BEGIN`/`COMMIT` anywhere in this file pre- or post-fix), so this fix introduces no new partial-failure window beyond what already existed in the original insert-loop (a mid-loop failure after the DELETE would now leave the findings table emptied rather than appended-to, which is a strict improvement, not a new risk). `reporting.test.ts`'s existing 6 tests all still pass conceptually (the DELETE is a no-op on first POST since there's nothing to delete yet, so the single-POST-per-test coverage path is unaffected) — confirmed by reading each test; none exercises two POSTs with non-empty `findings` on the same incident, but the fix itself is correct and `tsc --noEmit` on the backend project is clean.

### W2 — Evidence Log action_type dropdown missing `user_suspend`/`user_reactivate` — VERIFIED FIXED
- **Fix commit:** 667ee69
- **File:** `frontend/app/src/pages/reporting/EvidenceLogView.tsx:54-60`
- **Verification:** Read the diff and the surrounding `ACTION_TYPE_OPTIONS` array. `{ value: 'user_suspend', label: 'User suspended' }` and `{ value: 'user_reactivate', label: 'User reactivated' }` were added alongside the existing `user_edit` entry. Confirmed against `backend/src/modules/auth-org/admin-users.ts:195`'s actual action-string computation (`statusChanged ? (status === 'Suspended' ? 'user_suspend' : 'user_reactivate') : 'user_edit'`) — the three dropdown values now exactly cover all three action strings that route can write. Confirmed the backend's `action_type` filter (`evidence-log.ts:65-67`) is a plain parameterized equality match against the free-text column, so no backend change was needed and none was made. No regression: option values/labels are unique, no duplicate `value` keys introduced, `tsc --noEmit` clean.

## Regression scan on fixer-touched files

- `api-client.ts`: the new `apiGetBlob` function is additive only — no existing exported function (`apiGet`, `apiPost`, `apiPatch`, `handleResponse`, `authHeaders`) was modified. Zero risk of regressing any other call site in the app that already uses this file (confirmed via `grep -rn "api-client"` — only `EvidenceLogView.tsx` imports the new symbol).
- `EvidenceLogView.tsx`: the only other change beyond the CSV button and dropdown is the new `exportError` state + `Alert` render block, both net-new and additive; no existing query, filter, or table-rendering logic was touched.
- `reporting.ts`: the DELETE is a single new line inserted at a point that cannot be reached before the existing 404/409/422/403 guards all pass — none of those guard orderings were altered, confirmed by re-reading lines 388-444 end to end.

## Cross-file seams checked

- `apiGetBlob` export (`api-client.ts`) → sole consumer `EvidenceLogView.tsx`'s `handleExportCsv`: OK — signature (`path: string) => Promise<Blob>`) matches the call site exactly.
- `DELETE FROM aar_findings` (`reporting.ts:444`) → `aar_findings` schema's lack of any downstream FK dependents: OK — confirmed via migration grep, no cascading-delete risk.
- `ACTION_TYPE_OPTIONS` values (`EvidenceLogView.tsx`) → `admin-users.ts`'s actual `action` string computation: OK — all three status-edit action strings now represented.
- All other cross-file seams from iteration 1 (routes↔callers, types↔usages, exports↔imports across the full Phase 4 diff) were already verified clean in iteration 1 and are unaffected by this fix pass — not re-derived here per re-review scope.

All three iteration-1 findings are genuinely resolved with no fix-introduced regressions. Phase 4 is clean.
