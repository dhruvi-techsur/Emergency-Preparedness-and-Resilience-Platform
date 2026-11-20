# Deferred Items — Phase 09 (Alerting & Identity Integrations)

## Plan 09-04

- **Pre-existing, unrelated test-timing flake**: `tasks-resources.spec.ts`
  test 5 ("Overdue visibility: a backdated task flips to the Overdue
  Badge...") failed on a 60s Playwright test-timeout while waiting on its
  own internal `toPass({ timeout: 90_000, ... })` retry loop — the test's
  own per-test timeout (`playwright.config.ts`'s default `timeout: 60_000`)
  is shorter than the 90s window the test body itself asks `toPass` to
  wait across the background Overdue-sweep's default 60s interval + a
  30s poll cycle. This is a pre-existing test/config mismatch unrelated to
  this plan's changes (this plan touched zero Task-sweep code; it modified
  only `PersonnelRoster.tsx`/`CommandRoleModal.tsx`/
  `ResourceRequestDetail.tsx`/`seed.ts`/`routes.ts`/`main.tsx`). Confirmed
  out of scope by re-running the two Resource-Request-specific regression
  tests in that same file (tests 6 and 7) in isolation — both pass clean.
  Logged here rather than fixed, per this plan's scope boundary (only
  auto-fix issues directly caused by the current task's changes).

## Phase-end browser suite: field-mobile-sync-conflict.spec.ts (pre-existing, out of scope)

**Found during:** Phase 9's `browser_suite_gate` full Playwright run (137 tests, 2 unexpected).
**Symptom:** Test `1-6. field_responder seeds a conflict via sync-batch...` fails on `getByRole('heading', { name: 'Your version' })` never appearing.
**Root cause:** Identical, previously-documented root cause from `05-mobile-field-operations/deferred-items.md`'s "05-06: Pre-existing test-isolation flakiness in field-mobile-sync-conflict.spec.ts" entry — the spec's `setup` picks `jurisdictions.items[0]` (alphabetical) as the test incident's jurisdiction, and an unrelated prior phase's test-fixture jurisdiction continues to sort first in the shared compose-stack DB, landing the created incident outside both seeded identities' `jurisdiction_scope` (the F-05-01 enforcement correctly rejecting it, not a defect). Zero phase-9 commits touch this spec file, `jurisdictions`, `incidents`, or `sync_conflicts`.
**Action:** Not fixed (deviation-rules scope boundary — pre-existing, unrelated, previously logged against a different phase). Confirmed by isolated re-run: this is the ONLY failure in the file (1 failed / 1 passed in isolation), consistent with the documented root cause.
