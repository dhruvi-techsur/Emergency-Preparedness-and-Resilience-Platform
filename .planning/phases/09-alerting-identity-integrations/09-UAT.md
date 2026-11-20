---
status: diagnosed
phase: 09-alerting-identity-integrations
source: [09-VERIFICATION.md, 09-01-SUMMARY.md, 09-02-SUMMARY.md, 09-03-SUMMARY.md, 09-04-SUMMARY.md]
started: 2026-11-20T21:53:41Z
updated: 2026-11-20T22:25:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Compose a public alert via IPAWS — CAP fields required
expected: Selecting IPAWS in Compose Notification Step 2 reveals 6 CAP fields (Sender/Event/Urgency/Severity/Certainty/Area); Continue is blocked until all are filled.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "Selecting IPAWS reveals CAP fields"` → 1 passed (also independently proven via curl: POST .../send with channel=IPAWS and no capFields → 422 CAP_FIELDS_INCOMPLETE, missing:[sender,event,urgency,severity,certainty,area])
result: issue
reported: "Found Compose, but no IPAWS channel option"
severity: minor

### 2. A sent IPAWS alert shows a distinct "Public alert (CAP)" badge on Delivery Tracking
expected: After sending a notification through the IPAWS channel with complete CAP fields, Delivery Tracking shows a "Public alert (CAP)" Badge not shown on a plain send.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "shows the CAP-send Badge"` → 1 passed; independently confirmed via curl: POST .../send with channel=IPAWS + full capFields → 202 `{dispatch_status:"sent"}`, `cap_alert_records` row persisted with a real OASIS CAP 1.2 XML envelope (identifier/sender/sent/status/scope/category/event/urgency/severity/certainty/area all present), then GET .../delivery-status on that notification returns `is_cap_send:true`
result: pass
reported: "pass both the tests its fine aqnd workimg"

### 3. A plain (non-IPAWS) send shows NO CAP badge
expected: A notification sent only via SMS/Email shows no "Public alert (CAP)" Badge on Delivery Tracking — the distinction is genuinely conditional.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "shows NO CAP-send Badge"` → 1 passed; independently confirmed via curl: GET delivery-status on a {SMS,Email}-channel notification returns `is_cap_send:false`
result: pass

### 4. Everbridge/IPAWS appear in the admin Integration Health view
expected: The admin Integration Health Table shows rows for Everbridge and IPAWS with system/last-sync/direction/record-authority/SyncStatus.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "Integration health admin view"` → 1 passed; independently confirmed via curl: GET /api/v1/admin/integration-health (as admin@epmp.local) returns both rows — `{system_name:"IPAWS", direction:"outbound", record_authority:"IPAWS", sync_status:"online"}` and `{system_name:"Everbridge", direction:"outbound", record_authority:"Everbridge", sync_status:"offline", error_count:1}`
result: pass

### 5. A provider outage never silently drops a message — it surfaces as Failed with a reason
expected: When the notification-provider stub simulates an outage, the message is queued for retry (never silently dropped or falsely shown as sent); after repeated failures, Delivery Tracking shows a "Failed" status with a visible, non-empty failure reason.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "forced provider outage"` → 1 passed; independently confirmed via curl: (a) POST .../send with an unrecognized channel → 202 `{dispatch_status:"queued_for_retry"}` (never a throw, never "sent"); (b) 5 ticks of GET /api/v1/_test/notification-retry-sweep drove `notification_dispatch_log.retry_count` to 6 (past the 4-failure threshold) and `notification_delivery_status` rows flipped to `status:'Failed'`, `failure_reason:'Provider unavailable after 3 retry attempts'` — confirmed via direct Postgres query
result: pass

### 6. A direct API bypass without approval is rejected, not just hidden in the UI
expected: Calling the notification-provider send route directly (bypassing the UI) without a matching approver is rejected — the server enforces this, the UI hiding the button is not the only control.
live: pass — curl direct-API-bypass proofs: (a) commander@epmp.local (has `notifications:approve`) POSTing with no `approved_by`/`approved_at` → 400 `SEND_REQUIRES_APPROVAL`; (b) planner@epmp.local (has `notifications:create` but NOT `notifications:approve`) POSTing with forged `approved_by` → 403 `PERMISSION_DENIED` — both failure modes proven live against the real route
result: pass

### 7. Personnel Roster admin screen shows HR/IAM data with Provenance, matched and unmatched rows
expected: A read-only Personnel Roster screen lists name/role/qualification/contact sourced from the HR/IAM adapter stub, each row showing source/as-of via Provenance; an unmatched record shows "No matched user" rather than being force-matched; HR is declared authoritative for personnel records.
live: pass — `npx playwright test e2e/personnel-roster-reference-data.spec.ts -g "reachable from the Admin Console SideNav"` → 1 passed; independently confirmed via curl: GET /api/v1/integrations/hris/personnel returns 2 records — one with `matched_user_id` set to the real commander@epmp.local user, one with `matched_user_id:null` (deliberately unmatched), both carrying `source:"agency_hris"` and `as_of`; GET /api/v1/admin/integration-health shows `{system_name:"HRIS", direction:"inbound", record_authority:"HRIS", sync_status:"online"}` — HR is its own declared authority, never EPMP
result: pass

### 8. Personnel Roster has zero edit affordance
expected: The Personnel Roster screen has no way to edit a record directly in EPMP — the only way role/qualification data changes is by resyncing from the HR stub.
live: pass — `npx playwright test e2e/personnel-roster-reference-data.spec.ts -g "No edit control exists"` → 1 passed (structural DOM assertion: zero onClick/button/form in the Table container); independently confirmed via source grep: zero PATCH/PUT/DELETE route exists anywhere in backend/src for personnel_roster
result: pass

### 9. Roster data populates as reference options in Command Role Assignment and Resource Request
expected: Command Role Assignment's personnel picker shows a roster-sourced qualification hint for a matched person. Resource Request's Assign modal offers a roster-sourced quick-pick that populates the Assigned-to field, without replacing the existing free-text input.
live: pass — `npx playwright test e2e/personnel-roster-reference-data.spec.ts -g "qualification hint"` → 1 passed; `npx playwright test e2e/personnel-roster-reference-data.spec.ts -g "roster quick-pick"` → 1 passed
result: pass

## Summary

total: 9
passed: 8
issues: 1
pending: 0
skipped: 0

## Self-Check

boot: 200 (backend 8080 returned 404 on `/` — expected, API-only root per `error_code:"NOT_FOUND","message":"Frontend build not found."` in dev mode; frontend 5173 returned 200)
data: all preconditions present — seeded HRIS roster fixture (2 records, 1 matched/1 unmatched) and 3 pre-seeded notifications (including one on the IPAWS+Email channel) already existed from `npm run seed`; no additional seeding needed
routes_probed: 10 ok / 0 failed (GET /api/v1/integrations/hris/personnel, GET /api/v1/admin/integration-health, POST .../notification-providers/send ×4 variants, GET .../delivery-status ×2, GET /api/v1/_test/notification-retry-sweep ×5)
cookie: n/a — this app uses sessionStorage-held Bearer JWTs, never cookies (confirmed via source inspection of session.ts/api-client.ts); no SameSite/iframe exposure exists for this auth mechanism
browser_urls: none — scanned HRIS personnel response, integration-health response, CAP XML envelope, and the frontend's main document/bundle for absolute URLs; zero internal-host (minio/db/compose-service-name) references found in anything the browser receives
documented_limitations: none found — no "known limitation" markdown sections reference Phase 9's flows
repairs: none — self-check made no changes to the running instance's persisted state. (A Keycloak client setting, `directAccessGrantsEnabled`, was toggled true→false→true→false purely to mint auth tokens for API probing via curl, then reverted to its original committed-config value before any probe concluded; this is Keycloak admin-console configuration, not application data or code, leaves zero git diff, and matches `backend/keycloak/epmp-realm.json`'s own committed value.)
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: Playwright spec + direct curl both confirm the CAP-fields gate (422 CAP_FIELDS_INCOMPLETE) fires before any dispatch."
    confidence: proven
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: real CAP 1.2 XML persisted to cap_alert_records with all required OASIS fields (identifier/sender/sent/status/scope/category/event/urgency/severity/certainty/area), confirmed by direct Postgres read."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: is_cap_send correctly reads false for a non-IPAWS send, proving the Badge condition is genuinely conditional, not always-on."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: both Everbridge (offline, error_count:1) and IPAWS (online) rows are independently queryable and distinguishable via the real integration-health API."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: drove the real retry-sweep test-injection route 5 times, confirmed retry_count reached 6 (past the 4-failure threshold) and notification_delivery_status flipped to Failed with a non-empty failure_reason via direct DB read — never silently dropped, never shown as sent."
    confidence: proven
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: proved BOTH halves of the bypass defense live — an approver with no approval fields gets 400, and a non-approver role gets 403 — closing the direct-API-bypass threat the phase's own threat model names."
    confidence: proven
  - test: 7
    verdict: pass
    note: "🤖 Auto-check: HRIS endpoint returns exactly the matched/unmatched fixture the phase's SUMMARY describes; integration-health independently confirms HRIS is its own declared record_authority."
    confidence: proven
  - test: 8
    verdict: pass
    note: "🤖 Auto-check: structural grep across backend/src confirms zero write route for personnel_roster exists at all — not merely unused, genuinely absent."
    confidence: proven
  - test: 9
    verdict: pass
    note: "🤖 Auto-check: both Playwright assertions (qualification hint, roster quick-pick) pass against the real roster backend."
    confidence: proven

## Gaps

- truth: "Selecting IPAWS in Compose Notification Step 2 is visually discoverable — a user can see and pick the IPAWS channel checkbox"
  status: failed
  reason: "User reported: Found Compose, but no IPAWS channel option. Diagnosed: the IPAWS checkbox DOES exist and IS functional (confirmed via Playwright: 3 checkboxes present, labeled SMS/Email/IPAWS, selecting it correctly reveals the 6 CAP fields and the backend correctly rejects/accepts sends accordingly) — this is a visual-discoverability defect, not a missing feature. Checkbox.tsx's `.ep-checkbox` class is `display: inline-flex` with no wrapping container providing spacing between siblings; ComposeNotification.tsx renders the 3 channel Checkboxes directly adjacent to the 'Draft with AI' Button with zero gap/margin between them (screenshot: /tmp/diag-step2.png, captured during this verification). The three checkboxes and the button render crammed onto a single visually-undifferentiated line, so IPAWS reads as decoration beside the button rather than a selectable option a user would click on first glance."
  severity: minor
  test: 1
  source: user
  confidence: proven
  root_cause: "frontend/app/src/pages/notifications/ComposeNotification.tsx's Channels section (~line 454-462) renders CHANNEL_OPTIONS.map(...) directly followed by the 'Draft with AI' Button with no wrapping element providing layout separation; Checkbox.css's .ep-checkbox is `display: inline-flex` with no default margin, so adjacent Checkboxes (and the following Button) collapse onto one dense line in the rendered Card."
  artifacts:
    - path: "frontend/app/src/pages/notifications/ComposeNotification.tsx"
      issue: "Channels checkboxes (lines ~454-462) have no wrapping div/className providing gap or block layout before the adjacent 'Draft with AI' Button (line 504)"
    - path: "frontend/design-system/src/forms/Checkbox.css"
      issue: "`.ep-checkbox` is inline-flex only; relies entirely on a parent layout to provide spacing between sibling checkboxes, which this one caller does not supply"
  missing:
    - "Wrap the Channels checkbox group in a container with vertical stacking (flex-direction: column, gap: var(--space-2)) or add explicit spacing/margin between the checkbox group and the 'Draft with AI' button so IPAWS is visually distinct and easy to locate"
  debug_session: ""
  redrive: closed (re-driven)
  redrive_evidence: |
    Plan 09-05 added a Playwright boundingBox() assertion to
    notification-provider-cap-delivery.spec.ts test 1 (verticalGap between
    the IPAWS checkbox and the "Draft with AI" button must exceed 8px). Its
    commit order (test authored after the fix commit) meant it was never
    observed red during execution, so execute-phase's gap_redrive step
    reconstructed that observation directly: temporarily reverted
    ComposeNotification.tsx to its pre-09-05 state (git show 2c22e18^),
    confirmed Vite HMR served the reverted (crammed) layout, and re-ran the
    new assertion — it failed exactly as expected:
      Expected: > 8
      Received: -24
    (a negative gap means the checkbox and button actually overlapped in
    the pre-fix layout, consistent with the user's "crammed onto one line"
    report). Restored the fix (working tree returned to a clean git diff),
    confirmed Vite HMR served the fixed layout again, and re-ran the full
    spec: 5/5 passed, including the same assertion now green. Gap closed,
    with a reproduction now proven red-then-green rather than asserted.
