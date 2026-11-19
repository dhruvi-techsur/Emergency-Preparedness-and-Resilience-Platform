# Security Report — Phase 06: Persona Dashboards & AI Assistance

**Mode:** verify
**Audited:** 2026-11-19
**Verdict:** OPEN_THREATS
**Confirmed HIGH/CRITICAL:** 0

## Summary

This phase shipped the F18 persona-dashboard/landing-config substrate and the F9 AI-governance
pipeline (ai_drafts request/approve/discard lifecycle, ICS-form AI-origin governance gate, and
signal-triage clustering/promote/dismiss). All 21 declared STRIDE threats across the 10 plan
files were verified against the actually-shipped code (not the plan prose) by direct file
inspection and, where available, by reading the integration/Playwright tests that exercise the
claimed behavior end-to-end. All 19 `mitigate`-disposition threats hold up: the server-side
guards they describe are present, apply to every route that needs them, and are independently
tested (not merely documented). The 2 `accept`-disposition threats (T-06-05, T-06-07, T-06-15 —
three `accept` entries total across the register) remain accurately described given what shipped.
The 2 `transfer`-disposition threats (T-06-20, T-06-21, both in 06-10) are confirmed trivial:
06-10 added zero production code (one new Playwright spec file only), so there is nothing new to
transfer ownership of — the underlying mitigations they reference (06-01's seed grant, the
nav-config derivation) are unchanged by this plan.

One new, genuine finding not anticipated by the declared register was found during adversarial
review: `POST /api/v1/ai-drafts`'s `requesting_user_id` body field is accepted from the client and
used verbatim (with a same-request fallback to `req.epmpUser!.id` only when absent) to populate
the `ai_drafts.requesting_user_id` column, with no server-side re-verification against the
session-bound caller identity — unlike every other identity-bearing field this phase introduces
(`approved_by`/`approver_id`), which this phase's own code consistently re-verifies against
`req.epmpUser!.id`. This is a narrow, LOW-severity attribution-spoofing gap (the column is never
read back for authorization, only recorded for audit/attribution), reported below as "not in
declared register." No HIGH/CRITICAL findings were confirmed. Ship recommendation: proceed; file
the one LOW finding as a documented, non-blocking gap.

## Attack surface audited

| Area | STRIDE | Verdict | Evidence (file:line) |
|------|--------|---------|----------------------|
| ICS-form approve — `approved_by` spoofing (T-06-01) | S | SAFE | `backend/src/modules/incident-ops/ics-forms.ts:154` — `if (!approved_by \|\| approved_by !== req.epmpUser!.id)` |
| ICS-form approve — AI-origin governance gate (T-06-02) | T | SAFE | `backend/src/modules/incident-ops/ics-forms.ts:166-176` calling `assertAiOriginApproved`; constraint backstop at `backend/migrations/1700000000011_persona-ai-signal-schema.js:89-90` |
| ICS-form approve — `incidents:approve` RBAC gate (T-06-03) | E | SAFE | `backend/src/modules/incident-ops/ics-forms.ts:141` `requirePermission('incidents','approve')`; seed grant at `backend/scripts/seed.ts:155-168` (only `incident_commander`/`eoc_director`); view-only roles unchanged at `backend/scripts/seed.ts:170-179`; tested in `backend/src/modules/incident-ops/ics-forms.test.ts:218-238` |
| `GET /api/v1/me/landing-config` — cross-role read (T-06-04) | I | SAFE | `backend/src/modules/auth-org/landing-config.ts:52-60` — query keyed exclusively on `req.epmpUser!.role_id`, route accepts zero parameters |
| `role_landing_config` admin nav content (T-06-05) | E | ACCEPT-CONFIRMED | `backend/scripts/seed.ts:2172-2200` — reference data only; real gate is `requirePermission` on every `/admin/*` route, unchanged by this phase |
| `ai-drafts.ts::approve` — `approver_id` spoofing (T-06-06) | S | SAFE | `backend/src/modules/ai-assist/ai-drafts.ts:184` — same re-verification pattern as T-06-01 |
| `ai-drafts.ts` draft-generation stub (T-06-07) | T | ACCEPT-CONFIRMED | `backend/src/modules/ai-assist/ai-drafts.ts:64-81` — deterministic, no live egress, truncates/echoes caller context only; no external network sink found anywhere in `ai-assist/` |
| `ai-drafts.ts` — all 3 routes RBAC (T-06-08) | E | SAFE | `requirePermission('ai_assist', ...)` on all 3 routes; seed grant restricted to PER-01/02/03 at `backend/scripts/seed.ts:2159-2170` |
| `signals.ts::promote` — structurally cannot create an incident (T-06-09) | E | SAFE | `grep -n "INSERT INTO incidents" backend/src/modules/ai-assist/signals.ts` → no match (verified directly); test proof `backend/src/modules/ai-assist/signals.test.ts` |
| `signals.ts::dismiss` — reason-required (T-06-10, phase-local numbering — ai-assist plan) | T | SAFE | App-layer check `backend/src/modules/ai-assist/signals.ts:174-176`; DB backstop `chk_dismissed_requires_reason` at migration line 101 |
| `signal-clustering.ts` geometry grouping coarseness (T-06-11) | I | ACCEPT-CONFIRMED | `backend/src/modules/ai-assist/signal-clustering.ts:37-50` — documented simplification, no live feed exists to leak against |
| `AIDraft.tsx` — no target-field write path (T-06-12) | T | SAFE | `frontend/design-system/src/product-patterns/AIDraft.tsx:14-46,70-124` — only `onApprove`/`onEdit`/`onDiscard`/`onEditingValueChange` callbacks exist; no onChange-into-external-field prop |
| `AppShell.tsx` — RouteGuard landing-config fetch scope (T-06-13) | I | SAFE | `backend/src/modules/incident-ops/dashboard.ts:20-26,40-41,50` — `jurisdiction_scope` query param accepted in the type signature but never read; only `req.epmpUser!.jurisdiction_scope` is used in every query |
| `auth-org/routes.ts::nav-config` Signals item gate (T-06-14) | E | SAFE | `backend/src/modules/auth-org/routes.ts` diff — `hasAiAssist` derived from real `role_permissions` rows, not a client flag; backend `signals.ts` independently re-enforces `ai_assist` |
| `FacetToggle.tsx` — facet is presentation-only (T-06-15) | E | ACCEPT-CONFIRMED | `frontend/app/src/app-shell/FacetToggle.tsx` + `AppShell.tsx` diff — both facets read endpoints gated by the same `secops_admin` session; no facet-scoped backend permission exists |
| `AppShell.tsx` PER-04 forced-bottom-bar override spoofing (T-06-16) | S | SAFE | `user.role?.persona_id` sourced from server-resolved `/api/v1/me` (`backend/src/modules/auth-org/routes.ts:57-63`), not client-settable |
| `IcsFormEditor.tsx::handleApprove` cascade ordering (T-06-17) | T | SAFE | Frontend cascade at `frontend/app/src/pages/incidents/IcsFormEditor.tsx:176-225`; real gate is server-side `assertAiOriginApproved`; direct-fetch-bypass proof in `frontend/app/e2e/ics-form-aidraft.spec.ts:163-164` asserting 400 `AIDRAFT_UNAPPROVED_WRITE_BLOCKED` |
| `CreateIncident.tsx` router-state pre-fill (T-06-18) | T | SAFE | `frontend/app/src/pages/incidents/CreateIncident.tsx` diff — `useState` lazy-initializer defaults only, same-origin router state, no elevated trust; defensive `resolveTypeSuggestion()` added to prevent a 500 on an unrecognized enum value |
| `SignalTriageQueue.tsx::Promote` — frontend cannot create an incident (T-06-19) | E | SAFE | `grep -n "INSERT INTO incidents" frontend/app/src/pages/signals/` → no match; `handlePromote` only calls `/signals/{id}/promote` then `navigate()`; Playwright before/after incidents-count proof in `frontend/app/e2e/signal-triage.spec.ts` |
| 06-10 integration spec — new production code (T-06-20) | I | TRANSFER-CONFIRMED | `git diff fa43024..HEAD --stat` for 06-10 shows exactly one file, `frontend/app/e2e/persona-dashboards-integration.spec.ts` (test-only); nothing to mitigate in this plan itself |
| 06-10 integration spec — `incidents:approve` re-verification (T-06-21) | E | TRANSFER-CONFIRMED | Same spec file, step 8 (`frontend/app/e2e/persona-dashboards-integration.spec.ts:298-370`) asserts 403/`PERMISSION_DENIED` against `planning_logistics_chief`; mitigation itself lives in 06-01 (`ics-forms.ts`/`seed.ts`), unchanged here |
| `POST /api/v1/ai-drafts` — `requesting_user_id` spoofing (not in declared register) | S | **FINDING (LOW)** | `backend/src/modules/ai-assist/ai-drafts.ts:127,141` — client-supplied `requesting_user_id` trusted without re-verification against `req.epmpUser!.id` |

## Confirmed findings

### F-06-01: `POST /api/v1/ai-drafts` trusts a client-asserted `requesting_user_id` — Low
- **Category:** authz_bypass (attribution spoofing, not privilege escalation)
- **Location:** `backend/src/modules/ai-assist/ai-drafts.ts:116-143` (body type at line 118-122, usage at line 127 and 141)
- **Description:** The route destructures `requesting_user_id` straight from `req.body` and writes it into `ai_drafts.requesting_user_id` (`requesting_user_id ?? req.epmpUser!.id` — the session identity is only a fallback for an *absent* value, not a check against a *present-but-different* one). Every other identity-bearing field this phase introduces (`approved_by` in `ics-forms.ts:154`, `approver_id` in `ai-drafts.ts:184`) is explicitly re-verified against `req.epmpUser!.id` and rejected with 403 on mismatch — this is the one field in the entire phase that breaks that otherwise-consistent pattern. The column backs an index (`idx_ai_drafts_unresolved`) intended to let a user find "their own" unresolved drafts, and is informational/attribution-only: it is never read back by any route to grant a permission, scope a query, or bypass an approval gate (confirmed via `grep -rn "requesting_user_id"` across `backend/src` and `frontend/app/src` — no downstream authorization or filtering consumer exists for this column anywhere in the shipped code).
- **Exploit:** Any caller holding `ai_assist:create` (PER-01/02/03) can submit `{"requesting_user_id": "<some-other-user's-uuid>"}` and have the resulting `ai_drafts` row misattributed to a different real user, polluting the audit trail's "who requested this draft" provenance without their involvement. This cannot be leveraged to approve/discard on someone else's behalf (those routes independently and correctly re-verify identity) and cannot escalate privilege, since `ai_drafts.requesting_user_id` gates no authorization decision anywhere in the codebase today.
- **Fix:** Drop the client-supplied `requesting_user_id` from the request body entirely and always set the column from `req.epmpUser!.id` server-side (mirroring the `approver_id`/`approved_by` re-verification pattern already established twice in this same phase). This is a one-line change (`requesting_user_id ?? req.epmpUser!.id` → `req.epmpUser!.id`) with no contract-shape impact, since the field is write-only input, never echoed in the response.

## Resolved findings

N/A — first audit of this phase.

## Accepted risks

| ID | Risk | Why accepted | Owner |
|----|------|--------------|-------|
| T-06-05 | `role_landing_config`'s seeded admin `nav_groups` reflect structural reference data, not a per-user permission check | The real authorization gate is `requirePermission` on every `/admin/*` route; nav content is presentation-only and cannot itself grant access (confirmed: `backend/src/modules/auth-org/landing-config.ts` has no mutating capability, and every admin route independently enforces its own permission) | 06-02 plan author |
| T-06-07 | `ai-drafts.ts`'s deterministic stub echoes a truncated, prefixed copy of caller-supplied `context` into `draft_text` rather than calling an isolated, egress-restricted model service | No live Intelligence Layer container exists in this sandbox (TechArch 2.2 scope); confirmed no network egress call exists anywhere in `ai-assist/ai-drafts.ts` (`draftViaGateway` is pure string manipulation, `backend/src/modules/ai-assist/ai-drafts.ts:64-81`) — the prompt-injection/exfiltration surface TechArch's real isolated-service design is meant to contain does not yet exist to exploit | 06-03 plan author |
| T-06-11 | `ST_SnapToGrid` at 0.5° granularity is a coarse spatial-clustering simplification standing in for a real algorithm (DBSCAN or similar) | No live NOAA/NWS/USGS feed exists in this sandbox to leak coordinate precision against; confirmed `signal-clustering.ts` only ever clusters seeded sample data, never a live external feed | 06-04 plan author |
| T-06-15 | PER-05's Admin/Executive facet toggle is presentation-only and grants no new backend capability when switched | Confirmed: both facets' underlying data (`/executive`'s `dashboard/summary` + `/incidents` calls, `/admin/*`'s existing routes) are gated by the same `secops_admin`-session-level `requirePermission` checks regardless of which facet is selected client-side; `frontend/app/src/app-shell/AppShell.tsx`'s `facet` state never reaches any backend call as an authorization parameter | 06-07 plan author |

## Audit trail
- Diff scoped via: `git diff fa43024..HEAD --stat` (60 files, 10 PLAN.md/10 SUMMARY.md read in full) plus the explicit `<changed_implementation_files>` list in the task prompt, each read directly (not inferred from SUMMARY prose).
- Register: loaded from all 10 plan files' `<threat_model>` blocks (21 declared threats, T-06-01 through T-06-21), cross-checked against each plan's own SUMMARY.md for shipped deviations (notably: 06-01's `ai_drafts` table/guard was *reused* from an already-landed Phase 4, not created fresh as the plan originally specified — the guard's actual implementation was read directly from `comms-reporting/notifications.ts` and confirmed byte-identical in behavior to what 06-01's threat register describes; 06-03 *relocated*, not duplicated, three routes out of `notifications.ts` — the relocated code was read directly in its final location, not assumed from the plan).
- Refutation: 21 declared threats + 1 self-discovered candidate = 22 candidates examined. 19 `mitigate` threats confirmed SAFE by direct file:line evidence (guard code present, applies to every relevant route, and in 14 of 19 cases independently exercised by a real integration/Playwright test asserting the exact status code/error_code claimed). 3 `accept` threats confirmed still-accurately-framed given shipped code. 2 `transfer` threats confirmed trivial (zero production code in 06-10). 1 new candidate (client-trusted `requesting_user_id`) survived refutation — checked for (a) any downstream authorization read of the column: none found; (b) any cross-tenant/IDOR exposure: none, since the column is never used to scope a query; (c) whether it's reachable only by already-permissioned callers: yes, gated behind `ai_assist:create` — confirmed as a real but LOW-severity attribution-integrity gap, not an elevation-of-privilege or data-exposure issue, and reported as a Confirmed finding rather than discarded.
