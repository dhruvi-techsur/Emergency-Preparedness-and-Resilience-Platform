
## Wave 2 gate (06-02): Pre-existing test-isolation flakiness in field-reports.test.ts (out of scope)

**Found during:** Post-wave build/test gate for Wave 2 (06-02 — persona landing-config backend)
**Symptom:** `POST /api/v1/field-reports/sync-batch processes reports in order, detects a conflict, and preserves both versions` and `POST /api/v1/sync-conflicts/{id}/resolve with keep_mine...` intermittently fail (`expected 'conflict' to be 'synced'`, `expected undefined to be truthy`) when the full backend suite runs together.
**Root cause:** Not caused by 06-02's changes (which touch only `backend/src/modules/auth-org/landing-config.ts`, `routes.ts`, `scripts/seed.ts` — no overlap with `field-reports.ts`/`sync-conflicts` tables). Confirmed via isolation: `npx vitest run src/modules/incident-ops/field-reports.test.ts` alone passes 16/16 every time. Re-running the full suite 3x reproduced the failure 1/3 times — a genuine intermittent flake from shared compose-stack Postgres state across concurrently-run test files, the same class of issue already logged in `.planning/phases/05-mobile-field-operations/deferred-items.md` for this same test area (05-04, 05-06).
**Action:** Not fixed (deviation rules scope boundary — pre-existing, unrelated-file test-isolation gap). Gate re-run produced a clean 98/98 pass; recorded `pass` with a `pre_existing` note in `06-GATE.md` per protocol rather than entering the fix loop for a flake outside this wave's scope.

## Wave 3 gate (06-03): Pre-existing test-isolation flakiness in tasks.test.ts (out of scope)

**Found during:** Post-wave build/test gate for Wave 3 (06-03 — AI-drafts request/approve/discard lifecycle)
**Symptom:** `POST /api/v1/tasks with no owner_id returns 422 TASK_OWNER_REQUIRED and inserts no row` intermittently fails on a bare `SELECT count(*) FROM tasks` before/after comparison when the full backend suite runs together — same exact failure signature as 05-04's documented flake.
**Root cause:** Not caused by 06-03's changes (`ai-assist/ai-drafts.ts`, `ai-assist/routes.ts`, `server.ts`, `scripts/seed.ts` — no overlap with the `tasks` table or its tests). Confirmed via isolation: `npx vitest run src/modules/incident-ops/tasks.test.ts` alone passes 5/5. Pre-existing row-count-comparison test-isolation gap first logged in `.planning/phases/05-mobile-field-operations/deferred-items.md` (05-04) — still present, unrelated to any Phase 6 plan.
**Action:** Not fixed (deviation rules scope boundary). Gate retry produced a clean 103/103 pass; recorded `pass` with a `pre_existing` note in `06-GATE.md` per protocol.
