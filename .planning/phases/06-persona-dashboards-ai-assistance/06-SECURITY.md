# Security Report — Phase 06: Persona Dashboards & AI Assistance

**Mode:** verify (re-audit)
**Audited:** 2026-11-19
**Verdict:** OPEN_THREATS
**Confirmed HIGH/CRITICAL:** 0

## Summary

This is a re-audit triggered by the creation of three new gap-closure PLAN.md files
(06-11, 06-12, 06-13) addressing UAT/gate failures from Phase 6's verification round.
Diff scoping (`git diff 62aa761..95e7e00 --name-only`) confirms **zero implementation
files changed** since the prior audit (commit `62aa761`, "feat(phase-6): execution
complete") — the only 4 files touched are `.planning/ROADMAP.md` plus the three new
PLAN.md documents themselves. `ls .planning/phases/06-persona-dashboards-ai-assistance/06-1{1,2,3}-SUMMARY.md`
confirms no SUMMARY.md exists for any of the three — **none of the three gap-closure
plans has been executed yet**. There is no new shipped code to audit this round.

Because the audited code is byte-identical to the prior audit's subject (`git diff
62aa761..95e7e00 -- backend/src/modules/ai-assist/ai-drafts.ts` returns 0 lines, and
spot-checks below confirm every other previously-cited guard is still present at the
same locations), the prior audit's 21 declared-threat verdicts and 1 self-discovered
finding (F-06-01) remain the current truth without needing re-derivation from scratch.
A 4-point spot-check (T-06-01's `approved_by` re-verification, T-06-03's `incidents:approve`
RBAC gate, T-06-04's role_id-scoped landing-config query, T-06-09's structural
no-incidents-insert guarantee in `signals.ts`) confirms each cited file:line still
holds the exact guard previously described — no accidental regression.

**F-06-01 remains OPEN and unchanged.** `backend/src/modules/ai-assist/ai-drafts.ts`
is unmodified (zero diff) — the client-trusted `requesting_user_id` body field at
lines 127/141 is exactly as it was at the prior audit. Nothing in this round fixed it.
It stays filed as a LOW-severity, non-blocking attribution-spoofing gap.

The three new plans (06-11/12/13) each carry their own `<threat_model>` block, declaring
T-06-22, T-06-23, and T-06-24 respectively. All three are self-disposed `accept` by
their own authors, and on inspection this is a reasonable self-assessment given what
each plan actually touches:
- **06-11** (T-06-22): pure `seed.ts` fixture-data extension (more `hazardFeedEventDefs`
  rows) to replenish a drained Playwright test pool. No request-reachable surface — the
  script is never invoked from an HTTP path, and no production route/schema is touched.
- **06-12** (T-06-23): removes/corrects static `hint=` caption strings and a doc comment
  on the EOC Dashboard's Stat tiles. Does not change which data is fetched or how it is
  scoped — `dashboard.ts`'s `jurisdiction_scope` enforcement (T-06-13, previously verified
  SAFE) is untouched.
- **06-13** (T-06-24): adds the `.ep` box-sizing CSS class to `AppShell.tsx`'s static root
  element. Purely cosmetic layout fix, no user-controllable input anywhere near the change.

However, **none of these three plans has been executed** — there is no shipped code to
verify these dispositions against yet. This audit explicitly declines to fabricate a
verified-SAFE verdict for code that does not exist. Verification of 06-11/12/13's actual
implementations is **deferred** until each plan executes and produces its own SUMMARY.md;
each should be re-audited at that time (or covered by the next full re-audit) against its
own shipped diff, not merely its plan prose.

Ship recommendation: proceed. `threats_open` (count of CONFIRMED HIGH/CRITICAL) remains 0.
F-06-01 stays filed as a documented, non-blocking LOW finding. 06-11/12/13 carry no
elevated-risk threat classes by design (no new request-reachable surface, no auth/authz
change, no injection sink) and are tracked as deferred-verification items, not findings.

## Attack surface audited

| Area | STRIDE | Verdict | Evidence (file:line) |
|------|--------|---------|----------------------|
| Diff scope since prior audit | — | CONFIRMED NO IMPL CHANGE | `git diff 62aa761..95e7e00 --name-only` → `.planning/ROADMAP.md`, `06-11/12/13-PLAN.md` only; zero `backend/`/`frontend/` files |
| `ai-drafts.ts` unchanged (F-06-01 carrier file) | I | CONFIRMED UNCHANGED | `git diff 62aa761..95e7e00 -- backend/src/modules/ai-assist/ai-drafts.ts` → 0 lines |
| ICS-form approve — `approved_by` spoofing (T-06-01) — spot-check | S | SAFE (regression-free) | `backend/src/modules/incident-ops/ics-forms.ts:154` — `if (!approved_by \|\| approved_by !== req.epmpUser!.id)`, confirmed present verbatim |
| ICS-form approve — `incidents:approve` RBAC gate (T-06-03) — spot-check | E | SAFE (regression-free) | `backend/src/modules/incident-ops/ics-forms.ts:141` — `requirePermission('incidents','approve')`, confirmed present |
| `GET /api/v1/me/landing-config` — role-scoped query (T-06-04) — spot-check | I | SAFE (regression-free) | `backend/src/modules/auth-org/landing-config.ts:58-59` — `WHERE role_id = $1`, `[req.epmpUser!.role_id]`, confirmed present |
| `signals.ts::promote` structurally cannot create an incident (T-06-09) — spot-check | E | SAFE (regression-free) | `grep -n "INSERT INTO incidents" backend/src/modules/ai-assist/signals.ts` → no match, confirmed still absent |
| Remaining 17 of 21 declared threats + 2 transfer-confirmed | various | UNCHANGED — not re-derived | No implementation diff exists to invalidate the prior audit's direct file:line evidence for these; see prior audit trail below |
| `POST /api/v1/ai-drafts` — `requesting_user_id` spoofing (F-06-01) | S | **FINDING (LOW) — STILL OPEN** | `backend/src/modules/ai-assist/ai-drafts.ts:127,141` — unchanged; client-supplied value trusted without re-verification against `req.epmpUser!.id` |
| 06-11 `seed.ts` fixture extension (T-06-22, plan-declared) | T | NOT YET SHIPPED — verification deferred | No SUMMARY.md exists for 06-11; plan's own disposition is `accept` (dev-fixture script, never HTTP-reachable) — reasonable on its face, unverified against shipped code |
| 06-12 `EocDashboard.tsx` hint-text correction (T-06-23, plan-declared) | I | NOT YET SHIPPED — verification deferred | No SUMMARY.md exists for 06-12; plan's own disposition is `accept` (caption-only change, no data/scope change) — reasonable on its face, unverified against shipped code |
| 06-13 `AppShell.tsx` `.ep` class addition (T-06-24, plan-declared) | T | NOT YET SHIPPED — verification deferred | No SUMMARY.md exists for 06-13; plan's own disposition is `accept` (static CSS class, no user input) — reasonable on its face, unverified against shipped code |

## Confirmed findings

### F-06-01: `POST /api/v1/ai-drafts` trusts a client-asserted `requesting_user_id` — Low
- **Status:** Unchanged from prior audit — not fixed. `backend/src/modules/ai-assist/ai-drafts.ts`
  has zero diff between the prior audit's commit (`62aa761`) and current HEAD (`95e7e00`);
  none of this round's three gap-closure plans touches this file.
- **Category:** authz_bypass (attribution spoofing, not privilege escalation)
- **Location:** `backend/src/modules/ai-assist/ai-drafts.ts:116-143` (body type at line 118-122, usage at line 127 and 141)
- **Description:** The route destructures `requesting_user_id` straight from `req.body` and writes it into `ai_drafts.requesting_user_id` (`requesting_user_id ?? req.epmpUser!.id` — the session identity is only a fallback for an *absent* value, not a check against a *present-but-different* one). Every other identity-bearing field this phase introduces (`approved_by` in `ics-forms.ts:154`, `approver_id` in `ai-drafts.ts:184`) is explicitly re-verified against `req.epmpUser!.id` and rejected with 403 on mismatch — this is the one field in the entire phase that breaks that otherwise-consistent pattern. The column backs an index (`idx_ai_drafts_unresolved`) intended to let a user find "their own" unresolved drafts, and is informational/attribution-only: it is never read back by any route to grant a permission, scope a query, or bypass an approval gate (confirmed via `grep -rn "requesting_user_id"` across `backend/src` and `frontend/app/src` — no downstream authorization or filtering consumer exists for this column anywhere in the shipped code).
- **Exploit:** Any caller holding `ai_assist:create` (PER-01/02/03) can submit `{"requesting_user_id": "<some-other-user's-uuid>"}` and have the resulting `ai_drafts` row misattributed to a different real user, polluting the audit trail's "who requested this draft" provenance without their involvement. This cannot be leveraged to approve/discard on someone else's behalf (those routes independently and correctly re-verify identity) and cannot escalate privilege, since `ai_drafts.requesting_user_id` gates no authorization decision anywhere in the codebase today.
- **Fix:** Drop the client-supplied `requesting_user_id` from the request body entirely and always set the column from `req.epmpUser!.id` server-side (mirroring the `approver_id`/`approved_by` re-verification pattern already established twice in this same phase). This is a one-line change (`requesting_user_id ?? req.epmpUser!.id` → `req.epmpUser!.id`) with no contract-shape impact, since the field is write-only input, never echoed in the response.

## Resolved findings

N/A — nothing newly resolved this round. F-06-01 is unchanged (no implementation diff
exists in this round's scope, confirmed via `git diff 62aa761..95e7e00 -- backend/src/modules/ai-assist/ai-drafts.ts`
returning 0 lines) and correctly remains under "Confirmed findings" above, not here.

## Accepted risks

| ID | Risk | Why accepted | Owner |
|----|------|--------------|-------|
| T-06-05 | `role_landing_config`'s seeded admin `nav_groups` reflect structural reference data, not a per-user permission check | The real authorization gate is `requirePermission` on every `/admin/*` route; nav content is presentation-only and cannot itself grant access | 06-02 plan author |
| T-06-07 | `ai-drafts.ts`'s deterministic stub echoes a truncated, prefixed copy of caller-supplied `context` into `draft_text` rather than calling an isolated, egress-restricted model service | No live Intelligence Layer container exists in this sandbox; confirmed no network egress call exists anywhere in `ai-assist/ai-drafts.ts` | 06-03 plan author |
| T-06-11 | `ST_SnapToGrid` at 0.5° granularity is a coarse spatial-clustering simplification standing in for a real algorithm (DBSCAN or similar) | No live NOAA/NWS/USGS feed exists in this sandbox to leak coordinate precision against | 06-04 plan author |
| T-06-15 | PER-05's Admin/Executive facet toggle is presentation-only and grants no new backend capability when switched | Both facets' underlying data is gated by the same `secops_admin`-session-level `requirePermission` checks regardless of which facet is selected client-side | 06-07 plan author |
| T-06-22 | 06-11's `seed.ts` fixture-data extension is unverified against shipped code (plan not yet executed) | Plan's own declared disposition (`accept`) is reasonable on its face — dev/CI-only script, never HTTP-reachable, no production route/schema touched — but no SUMMARY.md exists yet to confirm the as-shipped code matches this description; re-verify once 06-11 executes | 06-11 plan author; re-audit on execution |
| T-06-23 | 06-12's `EocDashboard.tsx` hint-text/doc-comment correction is unverified against shipped code (plan not yet executed) | Plan's own declared disposition (`accept`) is reasonable on its face — caption-only change, no data-fetch or jurisdiction-scope change — but no SUMMARY.md exists yet; re-verify once 06-12 executes | 06-12 plan author; re-audit on execution |
| T-06-24 | 06-13's `AppShell.tsx` `.ep` CSS-class addition is unverified against shipped code (plan not yet executed) | Plan's own declared disposition (`accept`) is reasonable on its face — static className literal, no user-controllable input nearby — but no SUMMARY.md exists yet; re-verify once 06-13 executes | 06-13 plan author; re-audit on execution |

## Audit trail
- Diff scoped via: `git diff 62aa761..95e7e00 --name-only` → exactly 4 files, all `.planning/`-only documentation (`ROADMAP.md`, `06-11-PLAN.md`, `06-12-PLAN.md`, `06-13-PLAN.md`); zero `backend/` or `frontend/` implementation files changed. Independently re-confirmed via `git diff 62aa761..95e7e00 -- backend/src/modules/ai-assist/ai-drafts.ts` (0 lines) and `ls .planning/phases/06-persona-dashboards-ai-assistance/06-1{1,2,3}-SUMMARY.md` (all three report "No such file or directory," confirming none of the three gap-closure plans has executed).
- Register: prior audit's register (21 declared threats T-06-01..T-06-21 loaded from all 10 original plan files' `<threat_model>` blocks, plus 1 self-discovered finding F-06-01) carried forward unchanged since no implementation diff exists to invalidate it. New register entries T-06-22/23/24 loaded from the three new plans' own `<threat_model>` blocks (06-11, 06-12, 06-13 respectively) and recorded as plan-declared-but-unverified, since no SUMMARY.md exists for any of the three.
- Refutation: this round's new candidates are the 3 plan-declared threats (T-06-22/23/24). Each was read directly from its PLAN.md and assessed for whether its declared `accept` disposition is plausible given the plan's own stated scope (file list, task actions, `<threat_model>` Trust Boundaries row) — all three plausibly introduce no new request-reachable surface, auth/authz change, or injection sink by design (06-11: fixture-script-only; 06-12: caption-text-only; 06-13: static-CSS-class-only). None could be verified against actual shipped code since none has executed — this is recorded as a deferred-verification accepted risk, not fabricated as SAFE. 4 of the prior audit's 21 SAFE verdicts (T-06-01, T-06-03, T-06-04, T-06-09) were spot-checked by direct grep/read against the cited file:line locations and confirmed unchanged byte-for-byte at the same lines, with zero regression. F-06-01 was re-confirmed open via direct diff (`ai-drafts.ts` has 0 lines of diff since the prior audit) and direct re-read of lines 116-143, matching the prior audit's description exactly.
