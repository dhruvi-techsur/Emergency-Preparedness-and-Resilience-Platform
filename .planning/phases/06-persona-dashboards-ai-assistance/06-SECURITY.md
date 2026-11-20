# Security Report — Phase 06: Persona Dashboards & AI Assistance

**Mode:** verify (re-audit)
**Audited:** 2026-11-20
**Verdict:** SECURED
**Confirmed HIGH/CRITICAL:** 0

## Summary

This is the follow-up re-audit that closes the prior audit's (`3c678f5`) explicit
deferral: at that time 06-11/12/13 were plan-only (no SUMMARY.md existed for any
of the three), so T-06-22/23/24 could only be recorded as "plan-declared,
unverified" accepted risks. All three plans have since executed. Diff scoping
(`git diff 3c678f5..HEAD --stat -- backend frontend`) confirms exactly the 5 files
predicted: `backend/scripts/seed.ts`, `frontend/app/e2e/persona-dashboards.spec.ts`,
`frontend/app/e2e/signal-triage.spec.ts`, `frontend/app/src/app-shell/AppShell.tsx`,
`frontend/app/src/pages/dashboard/EocDashboard.tsx` (230 insertions, 18 deletions).
`git log 3c678f5..HEAD` shows a sixth commit beyond the three plans' own six task
commits — `a16ec70` ("gap-redrive — replenish signal fixture pool a third round")
— which only touches `seed.ts` again, folded into the same diff already scoped
above.

**T-06-22 (06-11, `seed.ts`) — CONFIRMED SAFE.** Read the full diff directly: it is
exactly two append-only blocks of `hazardFeedEventDefs` literal objects (6 rows
for 06-11's own task, 6 more rows for the `a16ec70` gap-redrive round), each with
a distinct, never-reused `external_event_id` (`UAT-SIGNAL-{SOURCE}-0{05..16}`),
inserted immediately before the array's closing `] as const;`. No new function,
no new route, no edit to the `findOrInsert`/direct-insert loop that consumes the
array, and — confirmed via `git diff 3c678f5..HEAD -- backend/src/modules/ai-assist/signal-clustering.ts`
and `...signals.ts` both returning 0 lines — zero change to `clusterHazardFeedEvents()`'s
own `WHERE NOT EXISTS` idempotency guard or to any production route. This script
is invoked only via `npm run seed`, never from an HTTP path; no client input
reaches it. The plan's own `accept` disposition holds exactly as declared.

**T-06-23 (06-12, `EocDashboard.tsx`) — CONFIRMED SAFE.** Read the full diff
directly: it removes the `hint="Tasks module ships in a later phase"` and
`hint="Resource requests module ships in a later phase"` props from two `Stat`
elements, and rewords the top-of-component doc comment. `value={summary?.open_tasks ?? 0}`
and `value={summary?.pending_resource_requests ?? 0}` are byte-identical before
and after — only the caption text changes, not which field is read or rendered.
Confirmed via `git diff 3c678f5..HEAD -- backend/src/modules/incident-ops/dashboard.ts`
returning 0 lines that the backend's jurisdiction-scoping (`req.epmpUser!.jurisdiction_scope`
join through `incidents.jurisdiction_id`) is completely untouched — the data
exposure and its scope are identical to what the prior audit already verified
under T-06-13 (carried forward, unaffected). The companion e2e diff
(`persona-dashboards.spec.ts`) only *adds* 3 new assertions (`toHaveCount(0)` on
the two stale strings, `toBeVisible()` on the one legitimate remaining hint) — it
strengthens the regression surface, does not weaken any existing assertion.

**T-06-24 (06-13, `AppShell.tsx`) — CONFIRMED SAFE.** Read the full diff directly:
exactly one line, `<div className="ep-shell">` → `<div className="ep ep-shell">`.
`.ep` is a static string literal in JSX with no interpolation, no prop, no
user-controllable input anywhere near it — `AppShell.tsx` renders its own
hardcoded root unconditionally for every signed-in user regardless of role.
Checked `tokens.css`'s own selector (`.ep, .ep * { box-sizing: border-box; }`,
confirmed at tokens.css:352-355) — this activates a layout-geometry reset only;
it has no effect on which data is fetched, which route handles a request, or
which permission gate applies, and introduces no new DOM attribute, no new
script-reachable surface, and no new resource-exhaustion vector (`box-sizing`
only changes how a fixed width/padding is arithmetically combined — it cannot be
driven into an unbounded loop, a large allocation, or a layout thrash sink by
any value under attacker control, since no attacker-controlled value feeds the
CSS rule at all). I/D-DoS-via-layout was deliberately considered per the task
instructions and refuted on the same ground: there is no untrusted input in the
loop. The companion e2e diff (`signal-triage.spec.ts`) only adds `boundingBox()`
geometry assertions and one new read-only test (`2b`, which explicitly clicks
Cancel rather than Confirm, so it doesn't consume a fixture row) — no weakened
assertion, no disabled auth check, no backdoor route.

**Both e2e spec diffs (signal-triage.spec.ts, persona-dashboards.spec.ts)** were
read in full and contain no test-only bypass of any kind: no route stub, no
`skip`/`.only` left in place, no auth short-circuit, no credential or token
echoed into a log/fixture. Every new line is either a `boundingBox()` geometry
assertion or a `toHaveCount(0)`/`toBeVisible()` text assertion — pure
regression-guard additions, strictly additive to test rigor.

**F-06-01 remains OPEN and unchanged.** `git diff 3c678f5..HEAD -- backend/src/modules/ai-assist/ai-drafts.ts`
returns 0 lines. Direct re-read confirms lines 121/127/141 are byte-identical to
the prior audit's citation: `requesting_user_id` is still destructured from
`req.body` and written via `requesting_user_id ?? req.epmpUser!.id` (session
identity is only a fallback for an *absent* value, not a check against a
*present-but-different* one). None of this round's three plans touches this
file. It is correctly re-filed under `## Confirmed findings` below, not moved to
Resolved, since nothing in this round fixed it.

**The remaining 17 of the original 21 declared threats** (T-06-02, 06, 08, 10,
12, 13 [transfer-confirmed via T-06-23 above], 14, 16-21, minus the 4 already
spot-checked in the prior audit round: T-06-01, T-06-03, T-06-04, T-06-09) carry
forward unchanged — none of their carrier files appear anywhere in this round's
5-file diff (`backend/src/modules/incident-ops/ics-forms.ts`,
`backend/src/modules/auth-org/landing-config.ts`, and every other file cited in
the original register's evidence column is absent from `git diff 3c678f5..HEAD
--stat`), so there is no implementation change capable of invalidating any of
those prior verdicts.

Ship recommendation: proceed. All three previously-deferred threats (T-06-22,
T-06-23, T-06-24) are now verified SAFE against the actual shipped code, matching
their own plans' self-declared dispositions exactly — no surprises, no gap
between plan prose and shipped diff. `threats_open` (count of CONFIRMED
HIGH/CRITICAL) is 0. F-06-01 stays filed as a documented, non-blocking LOW
finding, unchanged.

## Attack surface audited

| Area | STRIDE | Verdict | Evidence (file:line) |
|------|--------|---------|----------------------|
| Diff scope since prior audit | — | CONFIRMED | `git diff 3c678f5..HEAD --stat -- backend frontend` → exactly `backend/scripts/seed.ts`, `frontend/app/e2e/persona-dashboards.spec.ts`, `frontend/app/e2e/signal-triage.spec.ts`, `frontend/app/src/app-shell/AppShell.tsx`, `frontend/app/src/pages/dashboard/EocDashboard.tsx` (230 insertions, 18 deletions) |
| 06-11 `seed.ts` fixture extension (T-06-22) | T | **ACCEPT-CONFIRMED (SAFE)** | `backend/scripts/seed.ts` — full diff read: 2 append-only literal-object blocks (12 new rows total across 06-11's task + `a16ec70` gap-redrive), each distinct `external_event_id`, inserted before `] as const;`; `findOrInsert` loop and `clusterHazardFeedEvents()`'s `WHERE NOT EXISTS` guard both confirmed 0-diff via `git diff 3c678f5..HEAD -- backend/src/modules/ai-assist/signal-clustering.ts backend/src/modules/ai-assist/signals.ts`; script is `npm run seed`-only, never HTTP-reachable |
| 06-12 `EocDashboard.tsx` hint removal (T-06-23) | I | **ACCEPT-CONFIRMED (SAFE)** | `frontend/app/src/pages/dashboard/EocDashboard.tsx` — full diff read: `value={summary?.open_tasks ?? 0}` / `value={summary?.pending_resource_requests ?? 0}` byte-identical before/after, only `hint=` caption props and doc comment removed; `backend/src/modules/incident-ops/dashboard.ts` (jurisdiction-scope owner, T-06-13) confirmed 0-diff |
| 06-13 `AppShell.tsx` `.ep` class addition (T-06-24) | T (+ I/D layout considered) | **ACCEPT-CONFIRMED (SAFE)** | `frontend/app/src/app-shell/AppShell.tsx:201` — full 1-line diff read: `className="ep-shell"` → `"ep ep-shell"`, static literal, no interpolation; `tokens.css:352-355`'s `.ep, .ep * { box-sizing: border-box }` confirmed to be a pure layout-arithmetic rule with no attacker-controlled input anywhere in the chain — no new DoS/disclosure surface |
| `signal-triage.spec.ts` / `persona-dashboards.spec.ts` diffs | — | CONFIRMED NO TEST-DEBT | Both diffs read in full: only new `boundingBox()`/`toHaveCount`/`toBeVisible` assertions added; no `skip`/`.only`, no auth bypass, no stub route, no weakened existing assertion |
| `ai-drafts.ts` unchanged (F-06-01 carrier file) | I | CONFIRMED UNCHANGED | `git diff 3c678f5..HEAD -- backend/src/modules/ai-assist/ai-drafts.ts` → 0 lines; lines 121/127/141 re-read and match prior citation verbatim |
| Remaining 17 of 21 original declared threats | various | UNCHANGED — not re-derived | None of their carrier files (`ics-forms.ts`, `landing-config.ts`, `signal-clustering.ts`, etc.) appear in this round's 5-file diff; prior audit's direct file:line evidence stands |

## Confirmed findings
> Each survived adversarial refutation (input is user-controlled, no upstream guard, reachable).

### F-06-01: `POST /api/v1/ai-drafts` trusts a client-asserted `requesting_user_id` — Low
- **Status:** Unchanged from prior audit — not fixed. `backend/src/modules/ai-assist/ai-drafts.ts`
  has zero diff between the prior audit's commit (`3c678f5`) and current HEAD
  (`9a4eab1`); none of this round's three gap-closure plans touches this file.
- **Category:** authz_bypass (attribution spoofing, not privilege escalation)
- **Location:** `backend/src/modules/ai-assist/ai-drafts.ts:116-143` (body type at line 118-122, usage at line 127 and 141)
- **Description:** The route destructures `requesting_user_id` straight from `req.body` and writes it into `ai_drafts.requesting_user_id` (`requesting_user_id ?? req.epmpUser!.id` — the session identity is only a fallback for an *absent* value, not a check against a *present-but-different* one). Every other identity-bearing field this phase introduces (`approved_by` in `ics-forms.ts:154`, `approver_id` in `ai-drafts.ts:184`) is explicitly re-verified against `req.epmpUser!.id` and rejected with 403 on mismatch — this is the one field in the entire phase that breaks that otherwise-consistent pattern. The column backs an index (`idx_ai_drafts_unresolved`) intended to let a user find "their own" unresolved drafts, and is informational/attribution-only: it is never read back by any route to grant a permission, scope a query, or bypass an approval gate (confirmed via `grep -rn "requesting_user_id"` across `backend/src` and `frontend/app/src` — no downstream authorization or filtering consumer exists for this column anywhere in the shipped code).
- **Exploit:** Any caller holding `ai_assist:create` (PER-01/02/03) can submit `{"requesting_user_id": "<some-other-user's-uuid>"}` and have the resulting `ai_drafts` row misattributed to a different real user, polluting the audit trail's "who requested this draft" provenance without their involvement. This cannot be leveraged to approve/discard on someone else's behalf (those routes independently and correctly re-verify identity) and cannot escalate privilege, since `ai_drafts.requesting_user_id` gates no authorization decision anywhere in the codebase today.
- **Fix:** Drop the client-supplied `requesting_user_id` from the request body entirely and always set the column from `req.epmpUser!.id` server-side (mirroring the `approver_id`/`approved_by` re-verification pattern already established twice in this same phase). This is a one-line change (`requesting_user_id ?? req.epmpUser!.id` → `req.epmpUser!.id`) with no contract-shape impact, since the field is write-only input, never echoed in the response.

## Resolved findings

N/A — no prior finding closed this round. T-06-22/23/24 were never findings (they
were plan-declared `accept` dispositions pending shipped-code verification); they
move from "Accepted risks — deferred verification" (prior round) to
"ACCEPT-CONFIRMED" rows in the Attack surface table above, which is a
verification-status change, not a finding resolution. F-06-01 is unchanged and
correctly remains under "Confirmed findings" above.

## Accepted risks

| ID | Risk | Why accepted | Owner |
|----|------|--------------|-------|
| T-06-05 | `role_landing_config`'s seeded admin `nav_groups` reflect structural reference data, not a per-user permission check | The real authorization gate is `requirePermission` on every `/admin/*` route; nav content is presentation-only and cannot itself grant access | 06-02 plan author |
| T-06-07 | `ai-drafts.ts`'s deterministic stub echoes a truncated, prefixed copy of caller-supplied `context` into `draft_text` rather than calling an isolated, egress-restricted model service | No live Intelligence Layer container exists in this sandbox; confirmed no network egress call exists anywhere in `ai-assist/ai-drafts.ts` | 06-03 plan author |
| T-06-11 | `ST_SnapToGrid` at 0.5° granularity is a coarse spatial-clustering simplification standing in for a real algorithm (DBSCAN or similar) | No live NOAA/NWS/USGS feed exists in this sandbox to leak coordinate precision against | 06-04 plan author |
| T-06-15 | PER-05's Admin/Executive facet toggle is presentation-only and grants no new backend capability when switched | Both facets' underlying data is gated by the same `secops_admin`-session-level `requirePermission` checks regardless of which facet is selected client-side | 06-07 plan author |

## Audit trail
- Diff scoped via: `git diff 3c678f5..HEAD --stat -- backend frontend` → exactly 5 files (`backend/scripts/seed.ts`, `frontend/app/e2e/persona-dashboards.spec.ts`, `frontend/app/e2e/signal-triage.spec.ts`, `frontend/app/src/app-shell/AppShell.tsx`, `frontend/app/src/pages/dashboard/EocDashboard.tsx`; 230 insertions, 18 deletions), matching the task's independently-confirmed file list exactly. `git log 3c678f5..HEAD` additionally shows a 7th commit, `a16ec70` (gap-redrive, folded into `seed.ts`'s diff already scoped above), plus doc/chore commits touching only `.planning/` artifacts (not implementation).
- Register: 06-11/12/13's own `<threat_model>` blocks loaded directly from each PLAN.md (T-06-22, T-06-23, T-06-24 respectively — each with its own `accept` disposition and stated rationale). This is VERIFY mode for these 3: each declared mitigation/disposition was checked against the actual shipped diff, not accepted on the plan's prose alone. The remaining 21 original threats (T-06-01..T-06-21) plus F-06-01 carried forward from the prior audit (`3c678f5`) without re-derivation, since none of their carrier files appear in this round's diff.
- Refutation: all 3 VERIFY-mode candidates (T-06-22/23/24) were checked by reading each file's FULL diff directly (not trusting the plan's own say-so) and tracing the described "untouched" claims against their own `git diff` output: `signal-clustering.ts`/`signals.ts` (0 diff, confirms T-06-22's "no clustering/route change" claim), `dashboard.ts` (0 diff, confirms T-06-23's "no scope change" claim), and `tokens.css`'s `.ep` selector semantics read directly (confirms T-06-24's "pure layout, no new attack surface" claim, including a deliberate I/D-via-layout check per the task's own instruction — refuted since no attacker-controlled value reaches the box-sizing rule). All 3 survived verification and are recorded as ACCEPT-CONFIRMED, not fabricated SAFE. Both e2e spec diffs were read in full line-by-line and contain zero test-debt (no skip/.only, no auth bypass, no stub route). F-06-01 was re-confirmed open via direct 0-line diff and byte-for-byte re-read of lines 116-143. 0 new findings surfaced this round; 0 HIGH/CRITICAL confirmed.
