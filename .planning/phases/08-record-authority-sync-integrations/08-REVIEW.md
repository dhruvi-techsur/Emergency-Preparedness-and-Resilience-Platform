---
phase: 8
status: clean
blockers: 0
warnings: 0
files_reviewed: 6
files_reviewed_list:
  - backend/src/modules/integration-gateway/eoc-cots-adapter.ts
  - backend/src/modules/integration-gateway/document-adapter.ts
  - backend/src/modules/plans/plans.test.ts
  - backend/src/modules/integration-gateway/eoc-cots-adapter.test.ts
  - backend/src/modules/integration-gateway/eoc-cots-conflicts.test.ts
  - backend/src/modules/integration-gateway/facility-document-adapter.test.ts
reviewed_at: 2026-11-20T13:25:00Z
iteration: 2
---

# Phase 8 Code Review

## BLOCKERs

None.

## WARNINGs

None.

## Verification detail

### B1 (unbounded duplicate `eoc_cots_conflicts` rows) — fix confirmed correct
- **Fix (c47134d):** `eoc-cots-adapter.ts:285-317` now runs `SELECT id FROM eoc_cots_conflicts WHERE config_id = $1 AND record_type = $2 AND external_value = $3::jsonb LIMIT 1` before the INSERT, and skips the insert entirely (no `conflicts += 1` bump either) if a row already exists for that `(config_id, record_type, external_value)` triple — whether that prior row is resolved or still open.
- **Read the actual guard, not just the commit message:** the guard keys on `external_value` (the full JSON payload, stable across ticks since `fetchExchangeRecords`'s stub returns an identical fixed payload for `EOC-CONFLICT-001` every call), not a weaker key like `config_id+record_type` alone — so a genuinely changed external value for the same record_type would still raise a new row, matching the stated fix direction exactly.
- **Manual repro (ad-hoc script run against the live dev Postgres via the real `runEocCotsSync()`/`findOrCreateEocCotsConfig()` exports, not a mock):**
  - 3 consecutive `runEocCotsSync()` calls → exactly 1 `eoc_cots_conflicts` row for `record_type='incident'` (previously: 3).
  - Manually marking that row `resolution='keep_epmp'`, then running `runEocCotsSync()` once more → still exactly 1 row, now showing the resolved value — confirming a resolved conflict does **not** reappear on the next tick, which was the literal failure mode B1 described.
  - Output: `After 3 ticks, rows: 1 [...resolution:null]` / `After resolve + 1 more tick, rows: 1 [...resolution:"keep_epmp"]`.
- **Automated tests:** `eoc-cots-adapter.test.ts` (8/8 pass) and `eoc-cots-conflicts.test.ts` (4/4 pass), run live against the project's real Postgres/OPA compose stack, no mocking.
- B1 is genuinely fixed; no regression found in `eoc-cots-conflicts.ts`'s resolve route (untouched, still enforces the `AND resolution IS NULL` race guard and caller-identity check correctly).

### W1 (dead document-permission-revocation path) — fix confirmed correct
- **Fix (ad51b49):** `document-adapter.ts:73-79` adds `simulateDocumentAccessRevocation(userId, externalDocId)`, which mutates the SAME in-memory `SIMULATED_USER_DOCUMENT_ACCESS` map `resolveUserAccessSet`/`checkAndPersistPermission` already read — not a separate fixture or a hand-set DB column. It is exported exactly once and consumed exactly once, in `plans.test.ts`.
- **The new test genuinely drives the production path, not a mock:** `plans.test.ts`'s new `describe('document_links permission revocation (F17)')` block (1) creates a real plan via `POST /api/v1/plans`, (2) links `DOC-EOP-001` via the real `POST /api/v1/integrations/documents/:id/link` route (which lazily seeds `authorId`'s access set with `GRANTED_DOCUMENT_IDS` — the identical seeding path every other document-adapter caller uses), (3) confirms `permission_status: 'valid'` via a real `GET /api/v1/plans/{id}`, (4) calls the new trigger to remove `DOC-EOP-001` from `authorId`'s access set, (5) re-GETs `/api/v1/plans/{id}` and asserts the response flips to `'revoked'`, and (6) independently confirms the DB row itself was persisted as `'revoked'` via a direct `SELECT`. This exercises `plans.ts`'s real `fetchPlanDocumentLinks` → `revalidateDocumentLinkPermission` → `checkAndPersistPermission`'s `stillGranted === false` branch end-to-end — exactly the path that was previously unreachable.
- **Confirmed the UI consumer is wired to the same field:** `PlanDetail.tsx:345-347` filters `document_links` on `permission_status === 'revoked'` and renders the "Access removed" `Alert` — this field is the same one the new test now proves is reachable, so the UI path is no longer dead.
- **Test isolation checked:** `simulateDocumentAccessRevocation` is called only once, against `authorId`/`DOC-EOP-001`, in a `describe` block that runs after all other `plans.test.ts` tests that reference `authorId` for unrelated assertions (`submitted_by`, `acknowledged_by`) — none of those prior assertions depend on `authorId`'s document-access set, so the revocation introduces no test-order coupling within the file. `facility-document-adapter.test.ts` and `eoc-cots-adapter.test.ts`/`eoc-cots-conflicts.test.ts` were confirmed via `git diff` to be byte-for-byte untouched by either fix commit (the task description's framing of them as "fixer-touched" does not match the actual diff — verified no changes were made, no regression possible there).
- **Automated tests:** `plans.test.ts` (5/5 pass) and `facility-document-adapter.test.ts` (10/10 pass) both pass live against the real stack.

### Regression sweep
- Full backend suite re-run (`npx vitest run`, live Postgres/NATS/OPA stack): **22 test files, 144 tests, all pass** — no regression anywhere in the repo from either fix.
- `npx tsc --noEmit` on the backend package: clean, no type errors.
- `git diff e9d74d9 HEAD --stat` confirms the fixer touched exactly the 3 files the fix commits claim (`eoc-cots-adapter.ts`, `document-adapter.ts`, `plans.test.ts`) plus this REVIEW.md — no stray edits elsewhere in the phase's file set.

## Cross-file seams checked
- `eoc-cots-adapter.ts`'s dedup `SELECT` ↔ `eoc_cots_conflicts` schema (`1700000000014_eoc-cots-schema.js`) — `external_value JSONB NOT NULL` column exists and the `$3::jsonb` cast matches; `idx_eoc_cots_conflicts_unresolved` partial index is unaffected (guard doesn't rely on it). OK.
- `document-adapter.ts`'s `simulateDocumentAccessRevocation` export ↔ `plans.test.ts`'s import — signature (`(userId: string, externalDocId: string): void`) matches the single call site exactly. OK.
- `plans.ts`'s `revalidateDocumentLinkPermission` import/usage ↔ `document-adapter.ts`'s export — unchanged by either fix, still matches (confirmed in iteration 1, re-confirmed here since `document-adapter.ts` was touched). OK.
- `PlanDetail.tsx`'s `permission_status === 'revoked'` filter ↔ `plans.ts`'s GET response shape — unchanged, still matches; now proven reachable by the new test rather than merely structurally correct. OK.
- No other seams in this iteration's touched-file scope (`eoc-cots-adapter.ts`, `document-adapter.ts`, `plans.test.ts`) were altered in ways that affect any other consumer — `eocCotsRoutes`'s exported shape, `isRecordTypeDeclared`, `findOrCreateEocCotsConfig`, `browseDocuments`, `importDocument`, `linkDocument`, `runDocumentLinkSync`, and `checkAndPersistPermission`'s signatures are all byte-identical to iteration 1.
