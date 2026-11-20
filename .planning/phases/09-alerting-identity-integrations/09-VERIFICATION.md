---
phase: 09-alerting-identity-integrations
verified: 2026-11-20T20:32:00Z
status: passed
score: 5/5 must-haves verified
---

# Phase 9: Alerting & Identity Integrations Verification Report

**Phase Goal:** Communications staff can route approved notifications through a deterministic Everbridge/AtHoc-class provider stub (with CAP-formatted public-alert representation) under the exact same named-person-approval rule F5 already enforces, and personnel roster/qualification data syncs read-only from a deterministic HR/IAM adapter stub into resource-request matching and command-role assignment — so no public alert and no roster-sourced assignment can ever happen without a human decision, and no stub provider outage silently drops a message.

**Verified:** 2026-11-20T20:32:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Gate Evidence (cited, not re-run)

Per `09-GATE.md` frontmatter: `gate_status: passed`, `review_blockers_open: 0`, `boot_smoke: pass`, `browser_suite: pass`, both waves' `build: pass` / `tests: pass`. `verify gate-evidence 9 --raw` → `pass`. Wave 2's single transient 2-test flake (`field-reports.test.ts`, sync-conflict resolution — unrelated pre-existing file, zero Phase-9 commits touch it) was re-run clean (24/24 files, 171/171 tests) per the gate's own documented fix-attempts note; not a Phase-9 regression. `09-REVIEW.md`: `status: clean`, 0 blockers, 0 warnings, 19 files reviewed with explicit cross-file seam checks covering every key link named below. These are cited as evidence per the verifier's instruction not to re-run gates that already passed.

## Goal Achievement

### Observable Truths

| # | Truth (from ROADMAP Success Criteria) | Status | Evidence |
|---|---|---|---|
| 1 | Approved F5 notification routes through the provider stub; delivery/ack callbacks feed F5's existing delivery-tracking table; direct API bypass without matching approver is rejected (not just UI-hidden) | ✓ VERIFIED | `notification-provider-adapter.ts`'s `sendViaProvider()` rejects missing `approved_by`/`approved_at` as its FIRST statement (lines 190-193), independent of the HTTP route's own `requirePermission('notifications','approve')` preHandler — proven by adapter test #1 (direct function call, no route involved) asserting `SEND_REQUIRES_APPROVAL`. The separate HTTP route `POST /api/v1/integrations/notification-providers/send` is ALSO gated on `notifications:approve` (routes.ts:421), so even the route-level "bypass" surface is doubly blocked. Callback route matches by `external_message_id`+recipient and writes to F5's pre-existing `notification_delivery_status` table (adapter test #8: callback flips recipient to `Acknowledged`). `notifications.ts`'s own `/send` route requires `notifications:approve`, commits `approved_by`/`approved_at` first, then additively calls `sendViaProvider` with those exact values (lines 408-559). |
| 2 | IPAWS/CAP-channel send is representable in OASIS CAP-formatted structure, distinct from a normal send | ✓ VERIFIED | `buildCapEnvelope()` (lines 137-177) produces CAP 1.2 XML with identifier/sender/sent/status/scope/category/event/urgency/severity/certainty/area — adapter test #3 asserts all fields present in the generated XML. `cap_alert_records` table (migration 1700000000017) persists the XML only for IPAWS sends; adapter tests #4/#5 prove a non-IPAWS (SMS) send writes ZERO `cap_alert_records` rows, and an IPAWS send missing CAP fields is rejected 422 BEFORE any dispatch, writing zero rows. Frontend: `DeliveryTracking.tsx` renders a distinct `<Badge tone="warning">Public alert (CAP)</Badge>` only when `is_cap_send` is true (sourced additively off the existing delivery-status response); Playwright tests #2/#3 (`notification-provider-cap-delivery.spec.ts`) prove the Badge appears for IPAWS and is absent for plain SMS. |
| 3 | Provider-stub outage: queued message retried; failure surfaced visibly in delivery-tracking UI, never silently dropped/shown as successfully sent | ✓ VERIFIED | `sendViaProvider` on unrecognized-channel/forced-outage returns `{dispatch_status:'queued_for_retry'}` (never a throw, never `'sent'`) and logs a `'failed'` dispatch row (lines 235-247) — adapter test #6 confirms this exact return shape and that `integration_health` flips Everbridge `offline`. `runNotificationRetrySweep()` bumps `retry_count` on each sweep tick and, past the 4th failure, writes `'Failed'` + a non-empty `failure_reason` to F5's EXISTING `notification_delivery_status` table (never a new table) — adapter test #7 proves this end-to-end via the real delivery-status route. Frontend Playwright test #5 drives this through a dedicated test-injection route (`GET /api/v1/_test/notification-retry-sweep`) and asserts the Delivery Tracking UI shows `Failed` with a visible failure reason, never `Queued` forever or falsely `Sent`. |
| 4 | Personnel roster list (name/role/qualification/contact) sourced read-only from HR/IAM stub, each entry showing source/as-of via `Provenance`, HR declared authoritative in integration-health view | ✓ VERIFIED | `PersonnelRoster.tsx` renders Name/Role/Qualifications/Contact/Match/Source columns sourced exclusively from `GET /api/v1/integrations/hris/personnel`; the Source column renders `<Provenance source={row.source} time={...as_of...} />` (line 81). Page text explicitly states "HR/IAM is the authoritative system for personnel records" linking to Record Authority Registry. Backend: `record_authority_registry` row `{record_type:'personnel_roster', authoritative_system:'HRIS'}` (seeded since Phase 1, `notes='Reference data only'` added this phase, confirmed idempotent in 09-04 SUMMARY). `integration_health`'s `'HRIS'` row is hardcoded `record_authority='HRIS'` (never `'EPMP'`) in `recordHrisHealth()`. Playwright test #1 (`personnel-roster-reference-data.spec.ts`) proves SideNav reachability + matched/unmatched rows with Provenance rendering. |
| 5 | Roster data populates as selectable reference options in Command Role Assignment (F1) / Resource Request matching (F4); role/qualification can only change by resyncing (never direct in-EPMP edit); unmatched record shows no matched user, never force-matched | ✓ VERIFIED | `CommandRoleModal.tsx` runs a second `useQuery` against the roster endpoint, merging qualification hints into the existing FK-constrained personnel Combobox by `matched_user_id` (lines 82-109) — enrichment only, never changing the options source. `ResourceRequestDetail.tsx` adds an additive "Or pick from roster" Combobox (lines 128-134, 430-444) populating the same `assignedToInput` state as the existing free-text field. No-direct-edit is enforced STRUCTURALLY: zero PATCH/PUT/DELETE route exists anywhere in `backend/src` for `personnel_roster` (confirmed via direct grep returning nothing outside the test file's own negative-assertion string; HRIS adapter test #6 runs this exact structural grep as a regression-proof assertion) and `PersonnelRoster.tsx` has zero onClick/button/form. Unmatched handling: `runHrisRosterSync()`'s email-match is a separate, explicit SQL statement from the HR-column UPSERT (lines 189-235) — unmatched records simply leave `matched_user_id` NULL, never force-matched; `PersonnelRoster.tsx` renders a literal `<Badge tone="neutral">No matched user</Badge>` for these rows. Playwright tests #3/#4 (`personnel-roster-reference-data.spec.ts`) prove the live qualification hint and the roster quick-pick populating Assigned-to end-to-end. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|---|---|---|---|
| `backend/migrations/1700000000017_notification-provider-schema.js` (renumbered from plan's 1700000000012 due to documented cross-plan slot collision) | `notification_provider_config`/`notification_dispatch_log`/`cap_alert_records` tables | ✓ VERIFIED | All 3 `CREATE TABLE` statements confirmed present, columns match `sendViaProvider`'s/`buildCapEnvelope`'s actual INSERT statements exactly. |
| `backend/src/modules/integration-gateway/notification-provider-adapter.ts` | `sendViaProvider`, `buildCapEnvelope`, `runNotificationRetrySweep`, `notificationProviderRoutes`, `startNotificationRetryScheduler` | ✓ VERIFIED | 561 lines, all 5 exports present and substantive (not stubs); adapter-level approval re-check is literally the first executable statement. |
| `backend/src/modules/integration-gateway/notification-provider-adapter.test.ts` | Integration tests proving approval bypass rejection, CAP completeness, outage/retry, callback matching | ✓ VERIFIED | 10 real-Postgres+OPA integration tests, read in full; each directly proves the corresponding must-have truth (not mocked). |
| `backend/src/modules/comms-reporting/notifications.ts` (modified) | `/send` route additively dispatches through `sendViaProvider` per channel, AFTER existing approval commit | ✓ VERIFIED | Confirmed at lines 408-563: approval gate → transaction commit → per-channel `sendViaProvider` call, each wrapped in its own try/catch (fault isolation). |
| `backend/src/modules/integration-gateway/hris-roster-adapter.ts` | `fetchHrisPersonnel`, `runHrisRosterSync`, `hrisRosterRoutes`, `startHrisRosterSyncScheduler` | ✓ VERIFIED | 358 lines, all 4 exports present; email-only matching is a structurally separate UPDATE from the roster UPSERT; zero write to `users` table confirmed via grep. |
| `backend/src/modules/integration-gateway/hris-roster-adapter.test.ts` | 8 integration tests including a structural "no write route" regression proof | ✓ VERIFIED | Read in full (not re-pasted here for brevity); test #6 runs the exact same structural grep this report ran independently, confirming zero PATCH/PUT/DELETE route for `personnel_roster`. |
| `frontend/app/src/pages/admin/PersonnelRoster.tsx` + `.css` | Read-only roster admin screen: Table + Provenance + Badge, zero edit affordance | ✓ VERIFIED | 129 lines; zero onClick/button/form; renders Provenance per row; HR-authoritative note with link to Record Authority Registry. |
| `frontend/app/src/pages/notifications/ComposeNotification.tsx` (modified) | 6 CAP fields conditionally rendered Step 2, gate Step 2→3, read-only CAP summary Step 3 | ✓ VERIFIED | All 6 OASIS CAP enumerations (Urgency/Severity/Certainty literal values) present; gate blocks Continue until filled when IPAWS selected. |
| `frontend/app/src/pages/notifications/DeliveryTracking.tsx` (modified) | `is_cap_send`-gated distinct Badge | ✓ VERIFIED | `isCapSend` read from response, Badge rendered conditionally, never shown identically to a plain send. |
| `frontend/app/src/pages/incidents/CommandRoleModal.tsx` (modified) | Roster qualification hint enrichment, additive to existing Combobox | ✓ VERIFIED | Second `useQuery` against roster endpoint, merged by `matched_user_id`, enrichment-only (confirmed: underlying options source unchanged). |
| `frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx` (modified) | Roster quick-pick Combobox, additive above free-text field | ✓ VERIFIED | New Combobox populates same `assignedToInput` state as existing TextField; both matched and unmatched roster rows offered (unmatched is still assignable work, per plan's own rationale). |
| `frontend/app/e2e/notification-provider-cap-delivery.spec.ts` | 5 Playwright tests proving CAP gate, Badge, forced-outage Failed state, integration-health visibility | ✓ VERIFIED | 309 lines read; 5 named tests map directly to truths #1-#3 above; GATE.md confirms `browser_suite: pass`. |
| `frontend/app/e2e/personnel-roster-reference-data.spec.ts` | 4 Playwright tests proving SideNav reachability, Provenance rendering, no-edit structural guarantee, F1/F4 reference-data wiring | ✓ VERIFIED | 188 lines; 4 named tests map directly to truths #4-#5 above; GATE.md confirms `browser_suite: pass`. |

### Key Link Verification

| From | To | Via | Status | Details |
|---|---|---|---|---|
| `notifications.ts`'s `/send` route | `notification-provider-adapter.ts`'s `sendViaProvider()` | `import { sendViaProvider }`, called per-channel after approval transaction commits | ✓ WIRED | Confirmed at notifications.ts:7 (import) and :537 (call site), with `approved_by`/`approved_at` passed from the just-committed session values. |
| `notification-provider-adapter.ts` | F5's existing `notification_delivery_status` table | `UPDATE notification_delivery_status SET status='Failed', failure_reason=...` | ✓ WIRED | Confirmed lines 339-345 (retry sweep) — never a new table. |
| `notification-provider-adapter.ts` | `integration_health` table | `ON CONFLICT (system_name) DO UPDATE` upsert, `record_authority` names the real provider | ✓ WIRED | Confirmed lines 113-125; `record_authority` is `$1` (provider name), never `'EPMP'`. |
| `hris-roster-adapter.ts`'s `runHrisRosterSync` | `personnel_roster` table (Phase 1) | `ON CONFLICT (external_person_id, source) DO UPDATE` for HR columns; separate `UPDATE ... matched_user_id` for email match | ✓ WIRED | Confirmed lines 189-235 — two genuinely separate statements, matched_user_id never set by the HR-column UPSERT. |
| `CommandRoleModal.tsx` | `GET /api/v1/integrations/hris/personnel` | second `useQuery`, merged by `matched_user_id` | ✓ WIRED | Confirmed lines 82-109. |
| `ResourceRequestDetail.tsx` | `GET /api/v1/integrations/hris/personnel` | `useQuery` + additive Combobox quick-pick populating `assignedToInput` | ✓ WIRED | Confirmed lines 128-134, 430-444. |
| `PersonnelRoster.tsx` | `GET /api/v1/integrations/hris/personnel` | `useQuery` | ✓ WIRED | Confirmed line 90. |
| `DeliveryTracking.tsx` | `GET /api/v1/notifications/:id/delivery-status`'s new `is_cap_send` field | additive response field, read with `?? false` guard | ✓ WIRED | Confirmed line 88 of DeliveryTracking.tsx; backend route additively returns the field (notifications.ts, confirmed via REVIEW.md cross-file-seam check #52). |
| `main.tsx` / `ADMIN_NAV_ITEMS` (auth-org/routes.ts) | `PersonnelRoster.tsx` | route registration + SideNav entry | ✓ WIRED | Confirmed by REVIEW.md cross-file-seam check #58 (href/route/component all align). |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|---|---|---|
| F14 (Phase 9) | ✓ SATISFIED | Backend (09-01) + frontend (09-03) both shipped and tested; all 3 F14-mapped success criteria verified above. |
| F16-roster (Phase 9) | ✓ SATISFIED | Backend (09-02) + frontend (09-04) both shipped and tested; both F16-roster-mapped success criteria verified above. |

### Anti-Patterns Found

None. Scanned all 13 key files (migration, both adapters, both adapter test files excluded from the TODO/FIXME grep per their own self-collision precedent, both modified backend route files, all 6 modified/created frontend files) for `TODO|FIXME|XXX|HACK|not.?implemented|coming soon` — zero matches. Independently confirms each SUMMARY's own "Known Stubs: None found" claim.

### Human Verification Required

None. All 5 truths are verified either via direct code inspection (structural guarantees: no write route, adapter-level approval re-check ordering, separate email-match statement) or via passing integration/Playwright tests already run and recorded in the phase's gates (`09-GATE.md`: `boot_smoke: pass`, `browser_suite: pass`, 0 open review blockers). No gate check was skipped for this phase — `gate-evidence 9 --raw` returns `pass` cleanly, with no `not_run` entries to hand off.

### Gaps Summary

No gaps. All 5 ROADMAP success criteria are verified true against the actual codebase (not just SUMMARY claims): the adapter-level approval re-check is structurally the first statement in `sendViaProvider`, independent of any HTTP-route-level gate, closing the direct-API-bypass threat by design, not merely by hiding the control in the UI. CAP formatting is built from a real OASIS CAP 1.2 XML builder and gated 422 before any dispatch. Outages return a distinct `queued_for_retry` status (never `'sent'`) and failures surface visibly in F5's existing delivery-status table via the retry-sweep job, proven end-to-end by both integration tests and a dedicated Playwright forced-outage test. The HRIS roster adapter enforces read-only-ness structurally (zero write route anywhere in the codebase, not just an unused one) and email-only matching as a provably separate SQL statement from the HR-column upsert, with unmatched records explicitly left unmatched rather than force-matched. Frontend consumers (Command Role Assignment, Resource Request Assign modal, new Personnel Roster admin screen) are all additive, non-destructive wiring on top of existing FK-constrained selectors. Code review found 0 blockers across 19 reviewed files with explicit cross-file seam checks covering every key link in this report; both build/test gates passed for both waves; boot smoke and the full browser suite both passed.

---

_Verified: 2026-11-20T20:32:00Z_
_Verifier: Claude (pivota_spec-verifier)_
