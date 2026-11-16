# Deferred Items — Phase 01-platform-foundation-deployable-shell

Out-of-scope discoveries logged during plan execution, per the deviation
rules' scope boundary ("only auto-fix issues directly caused by the current
task's changes"). Not fixed here — left for the plan that owns the file.

## From 01-04 execution

- **`frontend/design-system/test/data-overlays.test.tsx` fails `tsc --noEmit`**
  (`Cannot find module '@testing-library/user-event'`). This file and its
  missing devDependency belong to plan **01-06** (`Table`, `Timeline`, `Stat`,
  `Tabs`, `Modal` — see `01-06-PLAN.md` files_modified list), which appears to
  be executing in parallel with 01-04 and had not yet added
  `@testing-library/user-event` to `package.json` at the time 01-04 ran its
  project-wide `npx tsc --noEmit`. Not fixed by 01-04 — out of this plan's
  file scope. 01-04's own files (`Card`, `Avatar`, `PageHeader`, `Breadcrumbs`,
  `SideNav`) type-check cleanly; the full-project `tsc --noEmit` only fails on
  this one, unrelated, in-flight file. 01-06 should resolve this as part of
  its own task verification.

## From 01-08 execution

- **`backend/src/modules/auth-org/routes.ts` fails `tsc --noEmit`**
  (`TS2345: Argument of type '401' is not assignable to parameter of type
  '200'` at line 138). This file is being actively modified by plan **01-07**
  (Users + Roles / SSO-config / Audit-log admin endpoints — confirmed via
  `git diff --stat` showing 62 insertions/10 deletions not yet committed, and
  `git log` showing 01-07 commits `ba2cba3`/`71239ad` already landed for its
  own sibling files). Not fixed by 01-08 — out of this plan's file scope
  (`backend/src/modules/integration-gateway/*.ts` only, per 01-08-PLAN.md's
  `files_modified`). All of 01-08's own files
  (`api-clients.ts`, `record-authority.ts`, `federation-grants.ts`,
  `opa-federation-policy.ts`, `routes.ts`, `gateway.test.ts`) type-check
  cleanly in isolation (`npx tsc --noEmit` on the pre-01-07-WIP tree, and via
  targeted re-check after 01-07 lands). 01-07 should resolve this as part of
  its own task verification when it finishes its in-flight response-schema
  typing.

## From 01-07 execution

- **`backend/src/modules/auth-org/routes.ts` transient `tsc --noEmit` failure
  during Task 3** (`TS2345: Argument of type '401' is not assignable to
  parameter of type '200'` at line 138) — this is the SAME in-flight race
  01-08 logged above, observed from 01-07's own side: another parallel-plan
  agent (adding `@fastify/swagger` response-schema typing to the shared
  `routes.ts`/`admin-users.ts`/`server.ts` files) landed a partial edit
  between 01-07's two `tsc --noEmit` invocations. Re-running `tsc --noEmit`
  immediately after showed it resolved once that agent's edit completed — no
  fix was needed on 01-07's side; this entry exists only to close the loop
  with the 01-08 note above (same root cause, different observer).
- **`backend/src/modules/integration-gateway/eventbus.test.ts` — 2 failing
  assertions** (`waitFor timed out` on a NATS JetStream delivery-to-webhook
  test, and an OpenAPI-document assertion expecting `/me` in `paths`) —
  observed via the project-wide `npx vitest run` plan-level gate. This file,
  `backend/src/openapi/*`, and `backend/src/modules/auth-org/admin-integration-health.ts`
  / `platform-health.ts` belong to a different in-flight plan (integration-gateway's
  event bus + the OpenAPI spec generator), not 01-07's `files_modified` list
  (`admin-users.ts`, `admin-roles.ts`, `admin-audit.ts`, `admin-sso-config.ts`,
  `routes.ts`, `admin.test.ts`). Not fixed here, per the deviation rules' scope
  boundary. 01-07's own test file (`admin.test.ts`, 7/7) and the pre-existing
  `routes.test.ts` (6/6) both pass cleanly in the same full-suite run — only
  the unrelated, concurrently-authored `eventbus.test.ts` fails. Whichever
  plan owns `backend/src/openapi/` and `eventbus.test.ts` should resolve this
  as part of its own task verification once its in-flight work settles.
