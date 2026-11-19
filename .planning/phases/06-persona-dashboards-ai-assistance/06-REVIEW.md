---
phase: 6
status: clean
blockers: 0
warnings: 0
files_reviewed: 46
files_reviewed_list:
  - backend/migrations/1700000000011_persona-ai-signal-schema.js
  - backend/scripts/seed.ts
  - backend/src/modules/ai-assist/ai-drafts.test.ts
  - backend/src/modules/ai-assist/ai-drafts.ts
  - backend/src/modules/ai-assist/governance.ts
  - backend/src/modules/ai-assist/routes.ts
  - backend/src/modules/ai-assist/signal-clustering.ts
  - backend/src/modules/ai-assist/signals.test.ts
  - backend/src/modules/ai-assist/signals.ts
  - backend/src/modules/auth-org/landing-config.test.ts
  - backend/src/modules/auth-org/landing-config.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/comms-reporting/notifications.test.ts
  - backend/src/modules/comms-reporting/notifications.ts
  - backend/src/modules/incident-ops/dashboard.ts
  - backend/src/modules/incident-ops/ics-forms.test.ts
  - backend/src/modules/incident-ops/ics-forms.ts
  - backend/src/modules/incident-ops/routes.ts
  - backend/src/server.ts
  - frontend/app/e2e/field-mobile-bottom-nav.spec.ts
  - frontend/app/e2e/ics-form-aidraft.spec.ts
  - frontend/app/e2e/persona-dashboards-integration.spec.ts
  - frontend/app/e2e/persona-dashboards-per04-per05.spec.ts
  - frontend/app/e2e/persona-dashboards.spec.ts
  - frontend/app/e2e/signal-triage.spec.ts
  - frontend/app/src/app-shell/AppShell.tsx
  - frontend/app/src/app-shell/FacetToggle.tsx
  - frontend/app/src/auth/RouteGuard.tsx
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/dashboard/EocDashboard.css
  - frontend/app/src/pages/dashboard/EocDashboard.tsx
  - frontend/app/src/pages/dashboard/MyWorkDashboard.css
  - frontend/app/src/pages/dashboard/MyWorkDashboard.tsx
  - frontend/app/src/pages/executive/ExecutiveDashboard.css
  - frontend/app/src/pages/executive/ExecutiveDashboard.tsx
  - frontend/app/src/pages/incidents/CreateIncident.tsx
  - frontend/app/src/pages/incidents/IcsFormEditor.css
  - frontend/app/src/pages/incidents/IcsFormEditor.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
  - frontend/app/src/pages/signals/SignalDetail.tsx
  - frontend/app/src/pages/signals/SignalTriage.css
  - frontend/app/src/pages/signals/SignalTriageQueue.tsx
  - frontend/design-system/src/index.ts
  - frontend/design-system/src/product-patterns/AIDraft.css
  - frontend/design-system/src/product-patterns/AIDraft.tsx
  - frontend/design-system/test/product-patterns.test.tsx
reviewed_at: 2026-11-19T15:10:00Z
iteration: 1
---

# Phase 6 Code Review

## BLOCKERs

None found.

## WARNINGs

None found.

## Cross-file seams checked

- `c-gap api frontend/app/src/pages/SignInCallback.tsx:65 GET /api/v1/auth/sso/callback` — **Refuted, confirmed false positive.** Read both files directly: `SignInCallback.tsx:65` is `fetch('/api/v1/auth/sso/callback', { method: 'POST', ... })` and `backend/src/modules/auth-org/routes.ts:72` declares `app.post<...>('/api/v1/auth/sso/callback', ...)`. Real method is POST on both sides; the scanner mislabeled the call site as GET. This file was last functionally touched in Phase 1 — zero Phase 6 plan modifies it. No finding recorded.
- `c-adv api frontend/app/src/lib/api-client.ts:121 GET /api/v1/field-reports/${fieldReportId}/photos` — Confirmed `api-client.ts` has zero diff in the Phase 6 commit range (`git diff <phase-start>^ HEAD -- frontend/app/src/lib/api-client.ts` produces no output). Pre-existing code from Phase 5, out of this phase's review scope. No finding recorded.
- `governance.ts` (ai-assist) → `comms-reporting/notifications.ts`'s `assertAiOriginApproved`/`AiOriginNotApprovedError` — re-export only, confirmed byte-identical single source of truth; both `ics-forms.ts` and `notifications.ts`'s own `/send` route call the same function. OK.
- `ics_forms`/`ai_drafts`/`signals`/`signal_source_events`/`hazard_feed_*` DDL — migration `1700000000011` correctly renumbered (collision with 05-01's `1700000000010_field-operations-schema.js` avoided) and correctly skips re-creating `ai_drafts` (already created by `1700000000008_notifications-schema.js`, confirmed byte-identical DDL). `ics_forms.ai_draft_id` FK resolves against the pre-existing table. OK.
- `ics-forms.ts` approve route → `requirePermission('incidents','approve')` → `seed.ts`'s `incidentsFullAccessRoles` grant (`['view','create','edit','approve']` for `incident_commander`/`eoc_director`) — confirmed grant present; `planning_logistics_chief`/`field_responder` remain view-only, verified both by seed.ts inspection and `ics-forms.test.ts`'s explicit 403 case. OK.
- `ai-drafts.ts` routes (relocated from `notifications.ts`) → `server.ts`'s `aiAssistRoutes` registration → `seed.ts`'s new `ai_assist` feature-permission (`incident_commander`/`eoc_director`/`planning_logistics_chief`) — old inline routes fully removed from `notifications.ts` (no `FST_ERR_DUPLICATE_ROUTE` risk), `notifications.test.ts` updated in lockstep (200 not 201, new `ai_assist` test-local grant). OK.
- `IcsFormEditor.tsx` → `POST /api/v1/ai-drafts` (`approver_id`) and `POST /api/v1/incidents/{id}/ics-forms/{formId}/approve` (`approved_by`) — field names match each backend route's own `Body` type exactly (not swapped). OK.
- `SignalTriageQueue.tsx`/`SignalDetail.tsx` → `POST /api/v1/signals/{id}/promote` response shape (`prefill.{name_suggestion,type_suggestion,severity_suggestion,source_signal_id}`) → `CreateIncident.tsx`'s router-state consumption — field names match; `CreateIncident.tsx`'s `resolveTypeSuggestion()` correctly guards against `signal-clustering.ts`'s free-text hazard-type vocabulary (e.g. "Hurricane Watch") not being a member of the `incidents.type` CHECK-constraint enum, falling back to `'Other'`. OK.
- `signals.ts`'s `GET /api/v1/signals` response (`source_feeds`, `source_events`) → `SignalTriageQueue.tsx` and `SignalDetail.tsx` consumption — both interfaces match the backend's actual additive fields. OK.
- `landing-config.ts` (`GET /api/v1/me/landing-config`) → `RouteGuard.tsx`'s redirect logic and `AppShell.tsx`'s `mobile_bottom_bar_items` consumption — response shape (`default_route`, `nav_groups`, `mobile_bottom_bar_items`, optional `error_code: 'ROLE_VIEW_UNMAPPED'`) matches both consumers' local interfaces exactly; `requirePermission('platform','view')` resolves for every seeded role (seed.ts grants `platform:view` to all 5 personas). OK.
- `routes.ts`'s `hasAiAssist`-gated "Signals" nav item → `seed.ts`'s `aiAssistRoles` (`incident_commander`/`eoc_director`/`planning_logistics_chief`) — matches; verified end-to-end in `persona-dashboards.spec.ts` test 3 and `persona-dashboards-integration.spec.ts` test 3.
- `AIDraft.tsx` (design system) → `IcsFormEditor.tsx` embedding — `onApprove`'s single callback is the only path draft text can reach the narrative field; confirmed no `onChange`/`onDraftTextUpdate` prop exists that could bypass this. Matches `ics-form-aidraft.spec.ts`'s e2e assertions.
- `dashboard.ts`'s `DashboardSummary` shape → `EocDashboard.tsx` and `ExecutiveDashboard.tsx` consumption — both frontend interfaces match the backend's 4-field response exactly; `tasks`/`resource_requests` schema columns referenced in the SQL (`status`, `incident_id`) confirmed to exist via Phase 3's migration.
- `main.tsx` route registration order (06-06 → 06-07 → 06-08 → 06-09) — confirmed each plan's routes append strictly after the prior plan's, no overwrites; `IncidentWorkspace.tsx`'s "Open ICS-201 form" button navigates to `/incidents/{id}/forms/new`, which resolves against the registered `/incidents/:incidentId/forms/:formId` route (`formId` param literally `"new"`, consistent with the component's own "no existing form found → create on first explicit save" hydration logic).
- TypeScript: `cd backend && npx tsc --noEmit` → exit 0; `cd frontend/app && npx tsc --noEmit` → exit 0. No type drift across the module boundary.

All cross-phase collision stories (ai_drafts table ownership, assertAiOriginApproved guard ownership, migration-number renumbering, ai-drafts route relocation) were independently verified against the actual committed artifacts, not merely taken on the PLAN/SUMMARY's word — each checks out.
