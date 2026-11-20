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
