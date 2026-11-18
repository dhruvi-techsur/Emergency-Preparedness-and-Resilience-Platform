---
phase: 4
status: issues_found
blockers: 1
warnings: 2
files_reviewed: 34
files_reviewed_list:
  - backend/migrations/1700000000008_notifications-schema.js
  - backend/migrations/1700000000009_reporting-schema.js
  - backend/scripts/seed.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/comms-reporting/analytics.ts
  - backend/src/modules/comms-reporting/evidence-log.ts
  - backend/src/modules/comms-reporting/notifications.test.ts
  - backend/src/modules/comms-reporting/notifications.ts
  - backend/src/modules/comms-reporting/reporting.test.ts
  - backend/src/modules/comms-reporting/reporting.ts
  - backend/src/modules/comms-reporting/routes.ts
  - backend/src/server.ts
  - frontend/app/e2e/incident-to-evidence-trail.spec.ts
  - frontend/app/e2e/notifications-compose.spec.ts
  - frontend/app/e2e/reporting.spec.ts
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.css
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
  - frontend/app/src/pages/notifications/ComposeNotification.tsx
  - frontend/app/src/pages/notifications/DeliveryTracking.tsx
  - frontend/app/src/pages/notifications/MessageTemplates.tsx
  - frontend/app/src/pages/notifications/RecipientGroups.tsx
  - frontend/app/src/pages/reporting/AarGenerator.tsx
  - frontend/app/src/pages/reporting/AnalyticsDashboard.tsx
  - frontend/app/src/pages/reporting/EvidenceLogView.tsx
  - frontend/app/src/pages/reporting/SitrepGenerator.tsx
  - frontend/design-system/src/data/BarChart.css
  - frontend/design-system/src/data/BarChart.tsx
  - frontend/design-system/src/data/DonutChart.css
  - frontend/design-system/src/data/DonutChart.tsx
  - frontend/design-system/src/data/LineChart.css
  - frontend/design-system/src/data/LineChart.tsx
  - frontend/design-system/src/feedback/Progress.css
  - frontend/design-system/src/feedback/Progress.tsx
  - frontend/design-system/src/index.ts
  - frontend/design-system/test/data-viz.test.tsx
reviewed_at: 2026-11-18T07:43:00Z
iteration: 1
---

# Phase 4 Code Review

## BLOCKERs

### B1: Evidence Log "Export as CSV" button is non-functional — it sends no auth credential at all
- **File:** `frontend/app/src/pages/reporting/EvidenceLogView.tsx:193-201`
- **Category:** bug
- **Evidence:** The export button is wired as:
  ```tsx
  <Button
    key="export-csv"
    variant="secondary"
    onClick={() => {
      window.location.href = `/api/v1/evidence-log/export?format=csv&${queryParams}`;
    }}
  >
    Export as CSV
  </Button>
  ```
  This app's ENTIRE auth model is Bearer-token-in-`sessionStorage` — confirmed by reading `frontend/app/src/lib/api-client.ts` (`authHeaders()` reads `getSessionToken()` and sets `Authorization: Bearer ...` on every `fetch`), `frontend/app/src/auth/session-storage.ts` (token lives in `sessionStorage` only), and `backend/src/modules/auth-org/rbac.ts`'s `requirePermission()` (`const auth = req.headers.authorization; if (!auth?.startsWith('Bearer ')) return reply.code(401)...`). There is no cookie-based session anywhere in the backend (grepped `backend/src/` for `cookie` — zero matches; `sso.ts`'s callback returns `session_token` in the JSON body, never sets a `Set-Cookie` header).
  A raw `window.location.href = ...` browser navigation is a plain top-level GET with no custom headers — it cannot carry the `Authorization: Bearer <token>` header the backend's `requirePermission('reporting','view')` preHandler on `GET /api/v1/evidence-log/export` requires. Every click of this button will hit the browser navigating to a URL that 401s with `SESSION_EXPIRED`, and since `api-client.ts`'s 401-handling convention doesn't even apply here (this bypasses `api-client.ts` entirely), the user just sees the backend's raw 401 JSON body rendered as a page, or (worse, depending on browser handling of the no-cors top-level navigation) a blank/error page — never a CSV download.
  This is doubly confirmed by both 04-02-SUMMARY.md and 04-06-SUMMARY.md explicitly claiming "CSV export is fully functional" and "satisfies the FRD's 'exportable' requirement" — a claim this review falsifies by tracing the actual auth mechanism the button's own click handler must go through.
- **Fix direction:** Use `fetch` with the `Authorization` header (same `authHeaders()` helper `api-client.ts` already exports) to retrieve the CSV as a blob, then trigger the download via `URL.createObjectURL` + a synthetic `<a download>` click — the exact pattern `AarGenerator.tsx`'s own `handleExportTimeline` already uses in this same phase's diff for its JSON timeline export. Alternatively, have the backend accept a short-lived signed query-param token for this one GET route, but the blob-download approach requires no backend change.

## WARNINGs

### W1: AAR regenerate-with-findings re-inserts findings without ever clearing prior rows, so repeated save/finalize attempts can silently duplicate finding rows
- **File:** `backend/src/modules/comms-reporting/reporting.ts:438-451`
- **Evidence:** `POST /api/v1/incidents/:id/aar`'s findings-insert loop is:
  ```ts
  for (const finding of findingsList) {
    await query(
      `INSERT INTO aar_findings (aar_id, finding_text, category, corrective_action, owner_id, due_date)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [...],
    );
  }
  ```
  This route is documented (reporting.ts:376-381, the migration file's own header comment, and 04-02-PLAN.md) as safe to re-POST against an existing Draft AAR ("a re-POST against an existing Draft AAR upserts timeline_export/decisions_log/resource_history in place... rather than erroring"). The `aars` row itself genuinely upserts via `ON CONFLICT (incident_id) DO UPDATE`, but `aar_findings` has no corresponding `ON CONFLICT`/`DELETE ... WHERE aar_id = $1` step before the insert loop — every re-POST with a non-empty `findings` array appends a fresh full set of rows rather than replacing the prior set. `AarGenerator.tsx`'s `handleFinalize()` calls exactly this re-POST route (`apiPost(...'/aar', {findings: ...})`) immediately before every finalize attempt (reporting.ts:227-272 in `AarGenerator.tsx`) — a user who sees a validation error (e.g. `CORRECTIVE_ACTION_UNOWNED` from a race, or who retries after a transient network failure) and clicks "Finalize AAR" again will duplicate every already-submitted finding row, since `validateFindingsOwnership` on reporting.ts's finalize PATCH re-fetches from the CURRENT `aar_findings` table (line 489's `fetchAarFindings(aarId)`) and that re-fetch will now return 2× the client's own `findings` array. The 04-02 test suite (`reporting.test.ts`) only ever calls this POST once per test, never exercising the re-POST-with-findings path that 04-07's own cross-phase AAR flow and `AarGenerator.tsx`'s finalize button exercise in normal operation, so this gap was never caught by the phase's own test coverage.
- **Fix direction:** Before the findings insert loop (or as part of the same `ON CONFLICT` upsert transaction), `DELETE FROM aar_findings WHERE aar_id = $1` when the AAR row already existed pre-upsert (i.e. whenever this is a re-POST against a Draft AAR, not the first-ever POST) — or switch the whole findings write to a single transaction that deletes-then-reinserts unconditionally, matching the "refreshing the snapshot" semantics the route's own doc comment already promises for the rest of the AAR's fields.

### W2: Evidence Log's `action_type` filter dropdown offers values that don't match the exact strings several backend modules actually write to `audit_log.action`
- **File:** `frontend/app/src/pages/reporting/EvidenceLogView.tsx:50-56`
- **Evidence:** `ACTION_TYPE_OPTIONS` includes `{ value: 'user_edit', label: 'User edited' }`, but `backend/src/modules/auth-org/admin-users.ts:195` computes the actual action string conditionally: `const action = statusChanged ? (status === 'Suspended' ? 'user_suspend' : 'user_reactivate') : 'user_edit';` — so a status-changing edit (the more common admin action, per the FRD's suspend/reactivate flows) never writes `'user_edit'` at all; it writes `'user_suspend'` or `'user_reactivate'`, neither of which appears in this dropdown. A caller selecting "User edited" from this filter will silently miss every suspend/reactivate audit row, with no indication the filter is incomplete. This is a real UX gap (not a backend bug — `action_type` is correctly passed through as free text and the backend's own filter logic is correct), but it means this specific filter option under-delivers what its label promises.
- **Fix direction:** Either add `user_suspend`/`user_reactivate` as their own dropdown options, or document in the hint text that `action_type` passes through as free text and the dropdown is a non-exhaustive starter set (which the code comment at line 43-49 already partially claims, but the claim doesn't match this specific mismatch since `user_edit` IS listed and silently excludes more rows than it should given its label).

## Cross-file seams checked

- `GET /api/v1/auth/sso/callback` c-gap (contract-scan): **pre-existing, not a Phase 4 defect.** Verified via `git log -p` that neither `backend/src/modules/auth-org/routes.ts`'s `/api/v1/auth/sso/callback` route nor `frontend/app/src/pages/SignInCallback.tsx`'s call site were touched by any Phase 4 commit (7eff3fc..b2667a5) — both predate this phase. Both sides use `POST`, matching exactly (`routes.ts:71`'s `app.post<{Body:{id_token:string}}>('/api/v1/auth/sso/callback', ...)` and `SignInCallback.tsx:58`'s `fetch('/api/v1/auth/sso/callback', {method: 'POST', ...})`); the scanner's "GET" label is a mislabel. Recorded here per instructions, not suppressed.
- `reporting.ts` → `notifications.ts` (`assertAiOriginApproved`/`AiOriginNotApprovedError` import): OK — exported at `notifications.ts:27,29` and imported/used correctly in `reporting.ts:7,343,348,478,483`.
- `comms-reporting/routes.ts` → `server.ts` (`app.register(commsReportingRoutes)`): OK — single registration, confirmed in `server.ts` diff.
- `notifications.ts`/`reporting.ts`/`evidence-log.ts`/`analytics.ts` → `auth-org/rbac.ts` (`requirePermission`): OK — all route preHandlers correctly scope `feature`/`action` pairs matching `seed.ts`'s granted role_permissions (`notifications`, `reporting`).
- `seed.ts`'s notifications/reporting grants → `notifications.test.ts`/`reporting.test.ts`'s 04-04 end-to-end assertions: OK — role names (`incident_commander`, `eoc_director`, `planning_logistics_chief`, `field_responder`) and granted action sets match exactly what the tests assert (approve-only-for-commander, no-approve-for-eoc_director, view-only-for-field_responder).
- `main.tsx` route additions (`/notifications/*`, `/incidents/:id/sitreps/new`, `/incidents/:id/aar/new`, `/reports/*`) → page component exports: OK — every route element imports and matches its corresponding `export function X()` in the target page file.
- `IncidentWorkspace.tsx`'s `useIncidentReports` → `evidence-log.ts`'s `GET /api/v1/evidence-log?action_type=aar_finalized` + `AuditService.record('aar_finalized', 'aar', aarId, {incident_id})`: OK — the `detail.incident_id` field the frontend filters on is exactly what `reporting.ts:513`'s `AuditService.record` call writes, and `evidence-log.ts`'s audit_log-half SELECT includes `detail` unmodified.
- `analytics.ts`'s 3 KPI SQL queries → underlying table/column names (`incidents.jurisdiction_id`, `resource_requests.fulfilled_at`, `aar_findings.closure_status`/`created_at`): OK — all columns exist exactly as referenced, confirmed against `1700000000002_incident-ops-schema.js`, `1700000000004_plans-tasks-resources-schema.js`, and this phase's own `1700000000009_reporting-schema.js`.
- `AnalyticsDashboard.tsx` → `analytics.ts`'s KPI response shape (`KpiResult` sans `target`): OK — frontend's `KpiResult` interface never declares a `target` field, structurally enforcing the "never invented target" rule the backend already enforces by omission.
- `design-system/src/index.ts` exports (`Progress`, `LineChart`, `BarChart`, `DonutChart` + their prop types) → consumer imports in `ComposeNotification.tsx`/`AarGenerator.tsx`/`DeliveryTracking.tsx`/`AnalyticsDashboard.tsx`: OK — all named imports resolve to real exports with matching prop shapes (`series`/`categories`/`segments`/`value`/`label` etc. all match each component's actual `Props` interface).
- `evidence-log.ts`'s dual-SELECT UNION column alignment (`audit_log` half vs `incident_timeline` half): OK — both halves select the identical 8 columns in the identical order/aliasing (`id, actor_id, actor_name, action, record_type, record_id, occurred_at, detail, source_table`).
- `notifications.ts`'s `POST /compose` → `POST /:id/send` → `GET /:id/delivery-status` request/response shapes vs `ComposeNotification.tsx`/`DeliveryTracking.tsx` consumption: OK — field names (`approved_by.id`/`approved_by.name`, `sent_at`, `recipients[].status`/`.channel`/`.failure_reason`, `ack_percentage`) match on both sides.
- `seed.ts` role names (`incident_commander`, `eoc_director`, `planning_logistics_chief`, `field_responder`, `secops_admin`) → every Playwright spec's identity assumptions (`incident-to-evidence-trail.spec.ts`, `notifications-compose.spec.ts`, `reporting.spec.ts`): OK — all role/permission assumptions documented in spec comments match the actual seed grants read directly from `seed.ts`.
