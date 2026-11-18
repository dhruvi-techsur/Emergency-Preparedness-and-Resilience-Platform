---
phase: 04-notifications-reporting-learning
plan: 05
subsystem: notifications
tags: [react, react-query, geojson, ai-governance, playwright]

# Dependency graph
requires:
  - phase: 04-notifications-reporting-learning
    provides: "04-01's comms-reporting notifications API (recipient-groups/message-templates CRUD, compose/send/delivery-status, ai-drafts stub, assertAiOriginApproved guard); 04-03's Progress/LayerPanel-compatible design-system components; 04-04's seeded notifications role-permission grants (incident_commander alone holds approve)"
  - phase: 01-platform-foundation-deployable-shell
    provides: "AppShell/main.tsx route-tree convention, GET /api/v1/me/nav-config role_permissions-driven derivation pattern (01-03), UserDetail.tsx's Checkbox-list multi-select substitution pattern (01-11)"
provides:
  - "RecipientGroups.tsx (/notifications/groups): list + editor Modal, type-specific selector incl. the keyboard-operable coordinates-polygon Geography fallback"
  - "MessageTemplates.tsx (/notifications/templates): list + editor Modal with category Select and placeholder-token hint"
  - "ComposeNotification.tsx (/notifications/compose, optional ?incident=<id>): full 4-step wizard enforcing order, audience gate, AI-draft approve-before-insert, read-only Review, proactively permission-gated send, danger confirmation Modal"
  - "DeliveryTracking.tsx (/notifications/:id/delivery): ~5s-polling per-recipient status table with inline failure_reason"
  - "parseCoordinatesToPolygon() shared helper (exported from RecipientGroups.tsx, reused by ComposeNotification's Step 1)"
  - "GET /api/v1/me/nav-config extended: 'Coordinate' SideNav group gains Notification groups/Message templates items; response gains a new `permissions` field (signed-in user's full feature->actions map)"
affects: ["04-06 (same wave, shares AppShell.tsx/main.tsx/routes.ts — appended-only, no conflict)", "04-07 (any future Incident Workspace wiring touching the same nav-config response shape)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Compose-at-confirm (not at Step-1-completion): the 4-step wizard holds all state locally and only calls POST /api/v1/notifications/compose + .../send at the danger Modal's 'Send now' click — no partial notification row is ever written for a user who abandons before Step 4"
    - "Proactive permission-gating via a piggybacked nav-config field: rather than a dedicated permissions-check endpoint, GET /api/v1/me/nav-config's already-fetched role_permissions query now also returns the full feature->actions map, letting ComposeNotification disable 'Approve and send' before any API round-trip — the server-side requirePermission('notifications','approve') + approver-identity-equality check remains the actual enforcement boundary (T-04-09)"
    - "AIDraft-pattern panel composed from existing primitives (Card + Badge + Provenance + Button), not a new reusable component — documented inline as this phase's correct budget-scoped choice since AIDraft itself is Phase 6 scope per the design system's own export list"
key-files:
  created:
    - frontend/app/src/pages/notifications/RecipientGroups.tsx
    - frontend/app/src/pages/notifications/MessageTemplates.tsx
    - frontend/app/src/pages/notifications/ComposeNotification.tsx
    - frontend/app/src/pages/notifications/DeliveryTracking.tsx
    - frontend/app/e2e/notifications-compose.spec.ts
  modified:
    - frontend/app/src/main.tsx
    - backend/src/modules/auth-org/routes.ts

key-decisions:
  - "Routes added to main.tsx (not AppShell.tsx itself), consistent with 02-05/02-06's established convention that main.tsx owns the nested route tree while AppShell.tsx stays layout/chrome only"
  - "GET /api/v1/me/nav-config extended with a `permissions` field (full feature->actions map) rather than inventing a second dedicated permissions-check endpoint, since the route already runs the exact role_permissions query this need requires"
  - "Recipient-group/message-template 'editing' creates a new row via the existing POST endpoint rather than mutating in place — 04-01's API exposes no PATCH/edit route for either resource, documented inline in both files as a Phase-4 simplification, not an oversight"
  - "Compose happens lazily at Step 4's danger-Modal confirm, not at Step-1 completion — keeps Steps 1-3 free of any partial/abandoned notification database rows"
  - "Test recipient group seeded as Jurisdiction-type (not Role-type) in the Playwright spec, since GET /api/v1/admin/roles requires admin:view which incident_commander deliberately does not hold (02-01's seed decision) — GET /api/v1/jurisdictions (incidents:view-gated) is reachable instead"

patterns-established:
  - "Shared coordinate-polygon parsing helper (parseCoordinatesToPolygon) factored once in RecipientGroups.tsx and reused by ComposeNotification.tsx, avoiding duplicating the mockup's keyboard-operable fallback logic across both Geography-selection surfaces"

# Metrics
duration: 42min
completed: 2026-11-18
---

# Phase 4 Plan 5: Notifications Integration (frontend screens) Summary

**Four routable Notifications screens (Recipient Groups, Message Templates, 4-step Compose with mandatory audience/review/AI-governance/approval gates, and polling Delivery Tracking) making 04-01's comms-reporting backend observable to a real browser user for the first time, proven end-to-end by an 8-step Playwright suite against the live compose stack.**

## Performance

- **Duration:** 42 min
- **Started:** 2026-11-18T06:05:00Z (approx.)
- **Completed:** 2026-11-18T06:47:00Z
- **Tasks:** 3
- **Files modified:** 7 (5 created, 2 modified)

## Accomplishments
- `RecipientGroups.tsx`/`MessageTemplates.tsx`: list + editor screens wired into the shell, including the mockup-specified keyboard-operable coordinates fallback for Geography-type group selection (no literal freehand-draw prop exists on `MapCanvas`)
- `ComposeNotification.tsx`: the complete 4-step wizard — Step 1 enforces the exact FRD `NO_AUDIENCE_SELECTED` message client-side; Step 2's "Draft with AI" never auto-populates the message field (only an explicit server-confirmed Approve click does, per T-04-10's mitigation); Step 3 renders fully read-only with zero input/textarea; Step 4's "Approve and send" is proactively permission-gated and its danger Modal restates audience+channels before any send call
- `DeliveryTracking.tsx`: ~5s-polling per-recipient status table, Failed rows always show their reason inline — never a silent drop
- Backend: `GET /api/v1/me/nav-config` extended (append-only) with Notifications nav items in the existing "Coordinate" group and a new `permissions` field the compose flow reads
- `notifications-compose.spec.ts`: all 8 steps pass against the real compose stack (db/nats/opa/keycloak + backend + frontend dev servers), proving the complete compose-to-delivery flow including the cross-feature incident Timeline write

## Task Commits

Each task was committed atomically:

1. **Task 1: Recipient Groups + Message Templates** — `1940ba4` (feat)
2. **Task 2: Compose Notification 4-step flow + Delivery Tracking** — `e12e160` (feat)
3. **Task 3: AppShell wiring + Playwright coverage** — `1b4fda8` (feat)

**Plan metadata:** (this commit)

_Note: no TDD tasks in this plan — all `type="auto"`._

## Files Created/Modified
- `frontend/app/src/pages/notifications/RecipientGroups.tsx` — List + editor Modal; exports `parseCoordinatesToPolygon` for shared reuse
- `frontend/app/src/pages/notifications/MessageTemplates.tsx` — List + editor Modal with category Select, character count, placeholder-token hint
- `frontend/app/src/pages/notifications/ComposeNotification.tsx` — 4-step wizard: Audience/Message/Review/Approve-and-send
- `frontend/app/src/pages/notifications/DeliveryTracking.tsx` — Polling delivery-status Table with ack-percentage Progress bar
- `frontend/app/src/main.tsx` — Appended 4 notifications routes to the nested route tree
- `backend/src/modules/auth-org/routes.ts` — Appended Notifications nav items + new `permissions` response field to `GET /api/v1/me/nav-config`
- `frontend/app/e2e/notifications-compose.spec.ts` — 8-test full-stack Playwright suite

## Decisions Made
- Routes live in `main.tsx`, not `AppShell.tsx` — matches 02-05/02-06's established split (main.tsx owns the route tree; AppShell is chrome-only)
- `nav-config`'s new `permissions` field reuses the route's already-fetched `role_permissions` query rather than adding a second endpoint
- Recipient-group/message-template "edit" creates a new row (04-01's API has no PATCH route for either) — documented inline in both files
- Compose is deferred to Step 4's confirm click, not Step 1 completion — no partial notification rows for abandoned compose sessions
- Test fixture recipient group is Jurisdiction-type (not Role-type), since `incident_commander` lacks `admin:view` needed for the roles-list endpoint a Role-type group's Combobox would need

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Icon name `'file-text'` is not a member of the design system's `IconName` type**
- **Found during:** Task 3 (AppShell wiring)
- **Issue:** `ADMIN_NAV_ITEMS`'s pre-existing audit-log nav item already used `icon: 'file-text'`, which isn't in `Icon.tsx`'s `ICON_NAMES` list (a pre-existing gap, out of this plan's scope to fix). Using the same name for the new Message Templates nav item would have repeated the type/runtime mismatch in newly-added code.
- **Fix:** Used `'file'` (a real `IconName` member) for the new nav item instead, with an inline comment noting the pre-existing `'file-text'` mismatch elsewhere.
- **Files modified:** `backend/src/modules/auth-org/routes.ts`
- **Verification:** `npx tsc --noEmit` clean on both backend and frontend
- **Committed in:** `1b4fda8` (Task 3 commit)

**2. [Rule 1 - Bug] Playwright spec's `GET /api/v1/admin/roles` call 403'd for the test identity**
- **Found during:** Task 3 (writing the Playwright spec's fixture-seeding step)
- **Issue:** The test originally seeded a Role-type recipient group by first calling `GET /api/v1/admin/roles` to resolve `incident_commander`'s role id — but that endpoint requires `admin:view`, which `incident_commander` deliberately does not hold (02-01's seed decision, same gap CommandRoleModal/TaskList/CreateTask all document for their own Combobox sourcing).
- **Fix:** Switched the fixture to a Jurisdiction-type group sourced from `GET /api/v1/jurisdictions` (`incidents:view`-gated, which `incident_commander` does hold).
- **Files modified:** `frontend/app/e2e/notifications-compose.spec.ts`
- **Verification:** All 8 Playwright tests pass against the real compose stack
- **Committed in:** `1b4fda8` (Task 3 commit — fixed before the commit landed)

**3. [Rule 1 - Bug] `getByLabel('Message')` matched two elements (Progress's accessible name also contains "Message")**
- **Found during:** Task 3 (writing the Playwright spec's Step 2 interactions)
- **Issue:** `Progress`'s `aria-label` is derived from its `label` prop ("Step 2 of 4: Message"), which also satisfies a substring `getByLabel('Message', {exact:false})` match alongside the actual message `<textarea>`, causing a Playwright strict-mode violation.
- **Fix:** Switched the three affected locators to `page.getByRole('textbox', { name: 'Message' })`, which only matches the textarea.
- **Files modified:** `frontend/app/e2e/notifications-compose.spec.ts`
- **Verification:** All 8 Playwright tests pass
- **Committed in:** `1b4fda8` (Task 3 commit — fixed before the commit landed)

---

**Total deviations:** 3 auto-fixed (1 blocking icon-type mismatch, 2 test-only bugs)
**Impact on plan:** All three were necessary for correctness; none represent scope creep. None touched production behavior beyond the single-line icon-name substitution.

## Issues Encountered
None beyond the three auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All four Notifications screens are routable, reachable from the shell's "Coordinate" SideNav group, and fully functional against the real backend
- `GET /api/v1/me/nav-config`'s new `permissions` field is available for any future screen needing the same proactive client-side permission-gating pattern
- `parseCoordinatesToPolygon()` is exported and ready for any future screen needing the same Geography-selection fallback
- 04-06 (same wave, parallel) independently appends its own `/reports/*` routes and "Improve" nav group to the SAME `main.tsx`/`routes.ts` files — no conflict observed during this plan's execution since 04-06 had not yet touched either file at commit time; both plans follow the identical append-not-overwrite convention
- Full backend test suite (13 files, 67 tests), `tsc --noEmit` (backend + frontend), and all three workspace builds (backend/design-system/app) are green with zero regressions

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Known Stubs

- 04-01's `POST /api/v1/ai-drafts` deterministic stub (no live Intelligence Layer gateway) — inherited, not introduced by this plan. **Cosmetic, not blocking**: already documented in 04-01-SUMMARY.md as a Phase-6 scope boundary; this plan's "Draft with AI" button correctly surfaces whatever the stub returns.
- Geography-type recipient groups' `member_count`/compose-time recipient resolution still resolve to nothing (04-01's documented Phase-6/F16 gap) — this plan's UI honestly reflects that (`member_count` renders `—`, a geotargeted audience's live estimate reads "~ (geotarget, exact count available after send)" rather than inventing a number). **Cosmetic, not blocking**.
- Recipient-group/message-template "editing" via the Modal creates a new row rather than mutating the original (04-01's API has no PATCH/edit endpoint for either resource). **Cosmetic, not blocking**: documented inline in both files as a Phase-4 API-surface limitation, not a frontend oversight; the list always reflects the newest row a user intended as "the edit."

None of the above defeat this plan's objective — the 4-step compose flow, the mandatory audience/review/AI-governance/approval gates, and per-recipient delivery tracking are all fully functional and proven end-to-end by the Playwright suite.

## Self-Check: PASSED

- All 7 claimed files (5 created, 2 modified) verified present on disk via `[ -f ]`.
- All 3 task commits (`1940ba4`, `e12e160`, `1b4fda8`) verified present via `git log --oneline --all`.
- Build check: `tsc --noEmit` on both `backend` and `frontend/app` → exit 0 (clean) at every task boundary.
- Full workspace builds: `npm run build -w backend` → exit 0; `npm run build -w frontend/design-system` → exit 0 (dist/bundle.js 67.19 kB); `npm run build -w frontend/app` → exit 0 (dist/assets/index.js 446.90 kB).
- Full backend test suite: 13 files, 67 tests, all passing — zero regressions from this plan's `routes.ts` extension.
- `notifications-compose.spec.ts`: all 8 steps pass against the real compose stack (`docker compose up -d db nats opa keycloak` + backend dev server + frontend dev server).
- `## Known Stubs` section above: 3 entries, all classified cosmetic (inherited or explicitly documented API-surface limitations), none blocking.
