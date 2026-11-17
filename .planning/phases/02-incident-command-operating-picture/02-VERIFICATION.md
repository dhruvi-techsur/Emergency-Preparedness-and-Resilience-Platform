---
phase: 02-incident-command-operating-picture
verified: 2026-11-17T11:29:47Z
status: passed
score: 5/5 must-haves verified
re_verification:
  previous_status: passed
  previous_score: 5/5
  gaps_closed:
    - "UAT ref 2 (blocker, root cause): hardcoded sandbox-internal KEYCLOAK_AUTHORITY made login unreachable through Pivota's preview proxy — fixed by making the OIDC authority, Vite dev-proxy, Keycloak forwarded-header trust, and the realm's redirect-URI allow-list all origin-relative/forwarded-header-aware (02-08-PLAN.md, commits 1f01363 + adb185d)"
    - "UAT ref 1 (same root cause, folded per one-cause/one-gap rule): create/classify incident blocked because no signed-in state was reachable through the preview path"
    - "UAT ref 3 (same root cause): activation-level escalation blocked for the same login reason"
    - "UAT ref 4 (same root cause): operating-picture marker data blocked for the same login reason (page shell itself was always reachable)"
    - "UAT ref 5 (same root cause): GIS-outage schematic fallback's authenticated markers call blocked for the same login reason"
  gaps_remaining: []
  regressions: []
---

# Phase 2: Incident Command & Operating Picture Verification Report

**Phase Goal:** Command staff can intake and activate an incident, assign named command roles, and see a shared, time-stamped operating picture that never fails to render — even when the live GIS feed is unavailable.
**Verified:** 2026-11-17T11:29:47Z
**Status:** passed
**Re-verification:** Yes — after gap closure (02-08, --gaps-only execution)

## Context

This run verifies ONLY the gap-closure plan 02-08, which closes UAT gap ref 2 (blocker: Keycloak OIDC login unreachable through Pivota's preview proxy) and, per 02-UAT.md's one-cause/one-gap rule, also closes UAT refs 1, 3, 4, 5 — all traced to the identical login root cause. Plans 02-01 through 02-07 were already verified `passed` in the prior round (02-VERIFICATION.md dated 2026-11-16T15:12:04Z, reproduced in full below for traceability) and are carried forward unchanged; only the login/SSO gap and its downstream UAT blockage are re-examined here with fresh evidence.

## Goal Achievement

### Observable Truths (5 Success Criteria from ROADMAP.md)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User creates/classifies an incident → workspace opens with severity badge, pinned command-role panel, Timeline/Tasks/Resources/Reports tabs | ✓ VERIFIED | Backend mechanics unchanged and previously proven live (prior UAT round: 201/200/200, exactly 1 Timeline entry). The ONLY blocker this round (UAT ref 1) was reaching a signed-in state through the preview path — now fixed (see Login Fix Verification below) and confirmed via the gate's "Gap Redrive" re-reproduction. Playwright `incident-workspace.spec.ts` test 1 (part of the 30/30 `browser_suite: pass`) exercises this through direct-sandbox `signInThroughKeycloak()`, unaffected/unregressed by this fix. |
| 2 | Command-role assignment + every status change/decision writes exactly one append-only Timeline entry with actor+source | ✓ VERIFIED | Unchanged from prior round (`TimelineService.append`, append-only DB trigger, `withTimelineTransaction` wrapping). 02-08 touched zero files in this subsystem (`files_modified`: oidc-config.ts, vite.config.ts, docker-compose.yml, epmp-realm.json only — confirmed via `git diff --name-only 6ad6625..bdf36db`, 02-REVIEW.md line 18). No regression risk. |
| 3 | Activation-level change requires modal confirmation naming the specific consequence; ≥1 Incident Commander required to activate above Monitoring | ✓ VERIFIED | Unchanged from prior round (`activation.ts`'s confirmation + commander gates). UAT ref 3's only blocker was the same login gap (preconditions were correctly seeded — `psql` confirmed Incident Commander already assigned to "UAT-ESCALATE-READY Default Agency Wildfire" — the data layer was never broken). Login fix closes the path to drive this flow live. |
| 4 | Operating picture renders incidents as status-coded, shape-distinguished markers on a real GIS-sourced base map, with a status bar showing data age + base-layer source | ✓ VERIFIED | Unchanged from prior round (`operating-picture.ts`/`OperatingPicture.tsx`). UAT ref 4 found the route itself always reachable without sign-in (200 through both direct and preview-proxy paths) — only the authenticated `/markers` data call was blocked by the login gap, now fixed. |
| 5 | On GIS feed unavailability, operating picture falls back to schematic base map labeled "Schematic base map, offline" and keeps rendering EPMP markers — page never fails to render | ✓ VERIFIED | Unchanged from prior round (fallback-as-default pattern in `operating-picture.ts`, `MapCanvas.tsx`'s offline contract). UAT ref 5's only blocker was the same authenticated-markers-call login gap, now fixed. Playwright `operating-picture.spec.ts` test 5 (part of the 30/30 passing browser suite) already asserts the exact fallback string through direct-sandbox sign-in. |

**Score:** 5/5 truths verified

### Login/SSO Fix Verification (02-08, this round's actual scope)

| Must-have (from 02-08-PLAN.md) | Status | Evidence |
|---|---|---|
| OIDC authority browser-derived, not hardcoded | ✓ VERIFIED | `frontend/app/src/auth/oidc-config.ts:20` → `` const KEYCLOAK_AUTHORITY = `${window.location.origin}/realms/epmp`; `` confirmed by direct read (static check, this session); zero `localhost:8081` occurrences remain in the file |
| Vite dev-proxy forwards Keycloak's browser-facing paths with correct forwarded headers | ✓ VERIFIED | `vite.config.ts` has `/realms`, `/resources`, `/js` proxy entries (lines 61-63) using an explicit `forwardHeaders` `configure()` hook (not the buggy `xfwd:true` — see Deviations in 02-08-SUMMARY.md) setting `x-forwarded-proto`/`x-forwarded-host` — confirmed by direct read |
| Keycloak trusts forwarded headers | ✓ VERIFIED | `docker-compose.yml:45-46` → `KC_PROXY_HEADERS: xforwarded`, `KC_HOSTNAME_STRICT: "false"` — confirmed by direct read |
| Realm redirect-URI allow-list is host-relative | ✓ VERIFIED | `backend/keycloak/epmp-realm.json:12` → `"redirectUris": ["/auth/callback", "/auth/callback/*"]` — confirmed by direct read |
| Existing direct-sandbox Playwright SSO suite unregressed | ✓ VERIFIED | Cited from gate: `browser_suite: pass`, 30/30, 0 unexpected, including `app-shell.spec.ts`'s direct-sandbox SSO regression suite (02-GATE.md frontmatter + Gap Redrive step 6) |
| Full end-to-end login through the SAME reproduction path the original UAT gap used | ✓ VERIFIED | Cited from 02-GATE.md's "Gap Redrive" section (lines 1276-1296): re-driven through port-7777 preview-proxy path with forged `X-Forwarded-Proto`/`X-Forwarded-Host: pivota-preview-probe.example.com` headers — discovery doc now reflects the simulated preview origin (was: SPA's own index.html), full PKCE auth request accepted (was: would have been rejected), full username/password login completes with redirect to `https://pivota-preview-probe.example.com/auth/callback` (was: unreachable) — all 5 steps PASS |

All 4 fix artifacts independently confirmed present and substantively correct via direct file reads in this verification session (not taken on faith from SUMMARY claims): `oidc-config.ts`, `vite.config.ts`, `docker-compose.yml`, `epmp-realm.json` all contain the exact code described. Both task commits (`1f01363`, `adb185d`) confirmed present via `git log`.

### Gate Evidence (cited, not re-run)

- `gate_status: passed` — all 6 waves (including wave 6 = 02-08): build pass / tests pass / 0 fix attempts (02-GATE.md frontmatter)
- `boot_smoke: pass`
- `browser_suite: pass` — 30/30, 0 unexpected, including `app-shell.spec.ts`'s direct-sandbox SSO regression suite
- `review_blockers_open: 0` — 02-REVIEW.md status: clean, 0 BLOCKERs, 0 WARNINGs, scope confirmed as exactly the 4 files 02-08 modified (`git diff --name-only 6ad6625..bdf36db`)
- `node pivota_spec-tools.cjs verify gate-evidence 02 --raw` → `pass` (re-run in this session — no skipped/not-run checks)
- "## Gap Redrive" section in 02-GATE.md (lines 1276-1296) documents the SAME reproduction recorded in 02-UAT.md re-run against the post-fix code, now passing end-to-end (6/6 steps PASS)

No gate was skipped. No truth in this report rests on an unexecuted check.

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| F1 | Incident/ICS — intake/classification, command-role assignment, append-only timeline, activation-level change w/ consequence confirmation, incident workspace | ✓ SATISFIED | Truths 1, 2, 3 (unchanged mechanics; login path to reach them now fixed) |
| F2 | Common Operating Picture — status-coded markers, data-age/source status bar, degraded/offline schematic fallback | ✓ SATISFIED | Truths 4, 5 |
| F11 | GIS integration — read integration w/ graceful schematic fallback on feed failure | ✓ SATISFIED | Truth 5 |
| F16-SSO | HR/IAM SSO/Authentication | ✓ SATISFIED (this round's fix) | Login/SSO Fix Verification table above |
| F8 | Security & Administration (SSO auth surface) | ✓ SATISFIED (this round's fix) | Same as F16-SSO |

### Anti-Patterns Found

Scanned the 4 files modified by 02-08 for TODO/FIXME/placeholder/stub patterns: none found (confirmed independently in this session via direct read, consistent with 02-REVIEW.md's and 02-08-SUMMARY.md's own scans).

No 🛑 Blocker or ⚠️ Warning anti-patterns found.

### Human Verification Required

None. The login gap's closure is proven by a scripted reproduction through the actual port-7777 proxy infrastructure with forged forwarded headers simulating a real external preview tester — not merely inferred from the already-passing direct-sandbox Playwright suite (which structurally cannot test this class of bug, since Playwright's `baseURL` is direct-sandbox `localhost:5173`). All 4 fix artifacts were independently read and confirmed in this session, not taken from SUMMARY claims alone. All 5 of the phase's original success criteria have both static code evidence (unchanged from the prior round, confirmed not to have been touched by this wave's 4-file diff) and dynamic test evidence (gates green, review clean, 30/30 browser suite including the SSO regression suite). No gate was skipped; nothing is left for Verify to drive live.

### Gaps Summary

No gaps. The one previously-open blocker (UAT refs 1-5, all traced to the single hardcoded-OIDC-authority root cause) has been closed by 02-08 and independently re-verified in this session: all 4 fix files were read directly and found to contain the exact claimed code (not merely asserted in a SUMMARY), both fix commits exist in git history, the code reviewer found 0 BLOCKERs/WARNINGs against the exact 4-file diff scope, and the gate's "Gap Redrive" section documents the SAME reproduction the original UAT gap used now passing end-to-end against the post-fix code (discovery doc reflects the simulated preview origin, full PKCE auth accepted, full login completes, redirect lands on the preview origin's own callback — not localhost:8081). The existing direct-sandbox Playwright SSO suite was independently confirmed unregressed (30/30, 0 unexpected). All 5 of the phase's original success criteria (now unblocked for login-dependent verification) retain their prior round's full evidence, since this wave touched none of their underlying files.

---
_Verified: 2026-11-17T11:29:47Z_
_Verifier: Claude (pivota_spec-verifier)_
