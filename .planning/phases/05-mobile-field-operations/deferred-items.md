
## 05-04: Pre-existing test-isolation flakiness in tasks.test.ts (out of scope)

**Found during:** Task 3 verification (full `npm run test -w backend` run)
**Symptom:** `POST /api/v1/tasks with no owner_id returns 422 TASK_OWNER_REQUIRED and inserts no row` failed with `expected '78' to be '77'` — a `SELECT count(*) FROM tasks` before/after comparison.
**Root cause:** Not caused by this plan's changes (sync-conflicts.ts GET /:id route, offline-queue.ts deleteQueuedItem, routes.ts nav-config field_reports group — none touch the `tasks` table). Confirmed by running `npx vitest run src/modules/incident-ops/tasks.test.ts` in isolation: all 5 tests pass. The full-suite run's shared compose-stack Postgres database accumulates rows across concurrently-running test files in the same run, and this particular assertion is a bare row-count comparison vulnerable to that — a pre-existing test-isolation gap in tasks.test.ts, unrelated to and out of scope for this plan.
**Action:** Not fixed (deviation rules scope boundary — pre-existing issue in an unrelated file). Logged here per protocol.
