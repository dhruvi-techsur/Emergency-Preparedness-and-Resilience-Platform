---
phase: 9
status: clean
blockers: 0
warnings: 0
files_reviewed: 19
files_reviewed_list:
  - backend/migrations/1700000000017_notification-provider-schema.js
  - backend/scripts/seed.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/comms-reporting/notifications.ts
  - backend/src/modules/integration-gateway/hris-roster-adapter.test.ts
  - backend/src/modules/integration-gateway/hris-roster-adapter.ts
  - backend/src/modules/integration-gateway/notification-provider-adapter.test.ts
  - backend/src/modules/integration-gateway/notification-provider-adapter.ts
  - backend/src/modules/integration-gateway/routes.ts
  - backend/src/server.ts
  - frontend/app/e2e/notification-provider-cap-delivery.spec.ts
  - frontend/app/e2e/personnel-roster-reference-data.spec.ts
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/admin/PersonnelRoster.css
  - frontend/app/src/pages/admin/PersonnelRoster.tsx
  - frontend/app/src/pages/incidents/CommandRoleModal.tsx
  - frontend/app/src/pages/notifications/ComposeNotification.tsx
  - frontend/app/src/pages/notifications/DeliveryTracking.tsx
  - frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx
reviewed_at: 2026-11-20T00:00:00Z
iteration: 1
---

# Phase 9 Code Review

## BLOCKERs

None found.

## WARNINGs

None found.

## Cross-file seams checked

- `POST /api/v1/auth/sso/callback` (backend/src/modules/auth-org/routes.ts:81, pre-existing Phase 1 route, untouched by Phase 9 diff) ↔ `SignInCallback.tsx:65` `fetch(..., { method: 'POST' })` — scanner's `c-gap` line mislabeled the method as GET; both sides are POST and match exactly. Confirmed via diff: `auth-org/routes.ts`'s only Phase-9 change is the unrelated `ADMIN_NAV_ITEMS` personnel-roster entry. Verified-false-positive, not carried forward.
- `GET /api/v1/field-reports/${fieldReportId}/photos` (c-adv, dynamic path) — advisory only, not in Phase 9's scope (file untouched by this phase's diff). No finding.
- `notificationProviderRoutes`/`hrisRosterRoutes` registration (integration-gateway/routes.ts) ↔ exports in `notification-provider-adapter.ts`/`hris-roster-adapter.ts` — names and signatures match exactly. OK.
- `startNotificationRetryScheduler`/`startHrisRosterSyncScheduler` (server.ts) ↔ adapter exports — both wrapped in the same graceful-degradation try/catch pattern as every prior scheduler. OK.
- `sendViaProvider()` (notification-provider-adapter.ts) ↔ its one caller in `notifications.ts`'s `/send` route — `ProviderSendRequest` shape matches the call site's object literal exactly (notification_id/channel/recipients/message/approved_by/approved_at/capFields). OK.
- `POST /api/v1/notifications/compose` and `/send` request bodies' `capFields` field, sent by `ComposeNotification.tsx` ↔ backend's declared `Body` types for both routes — neither route type declares nor destructures `capFields` from `req.body`; the backend route handler passes its own hardcoded placeholder object to `sendViaProvider` regardless of what the frontend sends. This is explicitly documented as intentional forward-compatible plumbing in both 09-01's and 09-03's SUMMARY.md (confirmed via grep that no `req.body.capFields` read exists) and does not cause any runtime error (extra JSON body fields are silently ignored by Fastify's body parsing here) — not a defect, by design and verified harmless.
- `GET /api/v1/integrations/hris/personnel` (hris-roster-adapter.ts) ↔ three independent frontend callers (`PersonnelRoster.tsx`, `CommandRoleModal.tsx`, `ResourceRequestDetail.tsx`) — all three request/response shapes (`PersonnelRosterRow`/`RosterRow` subsets) are consistent subsets of the same backend `PersonnelRosterRow` shape. OK.
- `GET /api/v1/integrations/notification-providers/health` ↔ `IntegrationHealth.tsx` — confirmed (per 09-03 SUMMARY and direct inspection) that this screen requires zero code change since it has no hardcoded `system_name` allowlist; the new Everbridge/IPAWS rows render through the existing generic table. OK.
- `GET /api/v1/_test/notification-retry-sweep` (notification-provider-adapter.ts) ↔ `notification-provider-cap-delivery.spec.ts`'s Playwright caller — route path, permission gate (`notifications:view`), and response shape (`{ swept: number }`) all match. OK.
- `is_cap_send` additive field on `GET /api/v1/notifications/:id/delivery-status` (notifications.ts) ↔ `DeliveryTracking.tsx`'s `DeliveryStatusResponse.is_cap_send?: boolean` — optional field, correctly guarded with `?? false` on the frontend. OK.
- `personnel_roster` schema (Phase 1 migration, columns: external_person_id/matched_user_id/name/email/role_titles/qualifications/contact_info/jurisdiction_id/source/as_of, UNIQUE(external_person_id, source)) ↔ `hris-roster-adapter.ts`'s INSERT/UPSERT column list and `ON CONFLICT (external_person_id, source)` clause — matches exactly, including the pre-existing UNIQUE constraint. OK.
- `integration_health.system_name UNIQUE` (Phase 1 schema) ↔ both adapters' `ON CONFLICT (system_name)` upserts (`recordProviderHealth`, `recordHrisHealth`) — constraint exists, upserts are valid. OK.
- `background_jobs.job_type CHECK (... 'notification_fanout' ... 'report_generation' ...)` (Phase 1 schema) ↔ both adapters' job_type literals — both values pre-exist in the original CHECK constraint list; no migration ALTER needed, and neither adapter collides with any other adapter's claimed job_type (confirmed via the adapters' own structural tests 8/10 asserting sole-claimant status). OK.
- Migration `1700000000017_notification-provider-schema.js` numbering ↔ the full `backend/migrations/` directory listing — no collision; slots 0-17 are all distinct and sequential. OK.
- `Combobox` component contract (`frontend/design-system/src/forms/Combobox.tsx`: committed-value-from-list only, `onChange(value, option)`) ↔ its two new Phase-9 call sites (`CommandRoleModal.tsx`'s person-selector, `ResourceRequestDetail.tsx`'s roster quick-pick) — both correctly treat Combobox as value-only and route free-text entry through the separate, pre-existing `TextField`/FK-constrained selector rather than relying on Combobox for arbitrary text. OK.
- `ADMIN_NAV_ITEMS` new `personnel-roster` entry (`auth-org/routes.ts`) ↔ `main.tsx`'s new `admin/personnel-roster` route ↔ `PersonnelRoster.tsx` component — href, route path, and component all align. The `icon: 'file'` choice is pre-existing-pattern-consistent (several sibling entries already use icons outside `Icon.tsx`'s real `ICON_NAMES` set; this entry at least uses a genuinely valid one) — cosmetic, explicitly out of this phase's scope per its own documented note, not a functional defect.
- RBAC reachability: `hrisRosterRoutes`'s personnel route (`incidents:view`) is held by `incident_commander`/`eoc_director`/`planning_logistics_chief`/`field_responder`/`secops_admin` (confirmed in seed.ts) — all three frontend consumers (Command Role Assignment, Resource Request Assign, Personnel Roster admin screen) are reachable by the roles that actually use them. OK.
- `backend/src/modules/comms-reporting/notifications.ts`'s new per-channel `sendViaProvider` dispatch loop ↔ `notification_recipients`/`notification_dispatch_log` schema — one dispatch-log row per distinct channel (not per recipient), consistent with the adapter's own documented aggregate-per-channel contract; no duplicate-dispatch or recipient-loss risk identified.
- `tsc --noEmit` run clean on both `backend/` and `frontend/app/` against the full Phase 9 diff — zero type errors.

No defects found in scope. All claimed "Known Stubs" sections in 09-01/09-02/09-03/09-04 SUMMARY.md files were independently verified: each named stub (CAP-field placeholder handoff, since-param no-op, provider-call simulation) is genuinely documented, non-blocking, and matches its own FRD/plan's explicit MVP-stub scope.
