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
