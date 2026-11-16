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
