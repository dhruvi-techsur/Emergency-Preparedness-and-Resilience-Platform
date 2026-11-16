# Security Report — Phase 1: Platform Foundation & Deployable Shell

**Mode:** verify (re-audit)
**Audited:** 2026-11-16 (refresh of same-day prior audit)
**Verdict:** SECURED
**Confirmed HIGH/CRITICAL:** 0

## Summary

This is a re-audit of the same Phase 1 implementation already covered by the prior `01-SECURITY.md` (verdict SECURED, 0 confirmed HIGH/CRITICAL, 30/30 threat-register entries T-01-01 through T-01-30 traced to working code). Independent verification via `git diff 2e8c65c..HEAD --name-only` confirms only three planning documents changed since that audit: `.planning/ROADMAP.md` (adds 01-14/01-15 to the phase's plan list) and the two new gap-closure plans `01-14-PLAN.md`/`01-15-PLAN.md` themselves. **Zero implementation files changed** — no `.ts`/`.tsx`/`.json` (outside `.planning/`), `.css`, `Dockerfile`, or migration file is touched by this diff. The working tree is otherwise clean (the only untracked path is this audit run's own log directory, not implementation drift).

The two new plans (01-14, 01-15) each carry their own `<threat_model>` register (T-01-24 re-numbered/reused information-disclosure re dev banner, T-01-25 tampering re token edit, T-01-26 information disclosure re test spec) describing code that **does not exist yet**. This audit independently confirmed, via direct inspection rather than trusting the plan text, that none of the three concrete artifacts these plans promise have been built: `README.md` has no `## Development` section, root `package.json`'s `dev` script contains no `5173` banner and is byte-identical to its pre-01-14 form, `frontend/app/e2e/contrast-audit.spec.ts` does not exist, and `tokens.json`/`tokens.css`'s `ink-disabled` values are unchanged from the exact pre-fix values 01-15's Task 1 was written to correct (light `#8794a0` / dark `#5d7284`, both still measuring below the 4.5:1 WCAG AA floor per the plan's own sRGB-luminance pre-verification). No `01-14-SUMMARY.md` or `01-15-SUMMARY.md` exists. **These plans are unexecuted.** Auditing their threat-model entries as mitigated/safe would be auditing stated intent, not shipped code — exactly the failure mode this agent exists to avoid — so they are recorded below as pending future audit, not as SAFE or OPEN findings.

Because the actual, running implementation is byte-for-byte unchanged from the prior audit's input, that audit's verdict stands without re-derivation: all 30 original threat-register entries remain mitigated/accepted/transferred as previously verified, the one pre-existing accepted gap (T-01-20, webhook fetch timeout) remains open by design, and no new HIGH/CRITICAL issue exists in the shipped code. **Ship — no change to the previously-shipped security posture.**

## Attack surface audited

| Area | STRIDE | Verdict | Evidence (file:line) |
|------|--------|---------|----------------------|
| Diff scope: implementation files changed since prior audit | — | SAFE (none changed) | `git diff 2e8c65c..HEAD --name-only` → `.planning/ROADMAP.md`, `.planning/phases/.../01-14-PLAN.md`, `.planning/phases/.../01-15-PLAN.md` only; `git diff 2e8c65c..HEAD --name-only \| grep -v '^\.planning/'` returns empty (exit 1, no matches). |
| `audit_log` UPDATE/DELETE (T-01-01) | Tampering | SAFE (unchanged, re-confirmed by diff-absence) | `backend/migrations/1700000000000_auth-org-schema.js:265-273` — not in the changed-file set; prior finding stands. |
| Keycloak dev realm test credential (T-01-02) | Info disclosure | SAFE (accepted, unchanged) | `backend/keycloak/epmp-realm.json` — not in the changed-file set; prior finding stands. |
| OPA policy default (T-01-03) | Elevation of privilege | SAFE (unchanged) | `backend/opa/policy.rego` — not in the changed-file set; prior finding stands. |
| SSO ID token verification (T-01-05) | Spoofing | SAFE (unchanged) | `backend/src/modules/auth-org/sso.ts` — not in the changed-file set; prior finding stands. |
| RBAC fail-closed on OPA outage (T-01-06) | Elevation of privilege | SAFE (unchanged) | `backend/src/modules/auth-org/opa-client.ts`, `rbac.ts` — not in the changed-file set; prior finding stands. |
| Audit single-writer (T-01-07) | Tampering | SAFE (unchanged) | `backend/src/modules/auth-org/audit.ts` — not in the changed-file set; prior finding stands. |
| Suspended-user immediate invalidation (T-01-08) | Elevation of privilege | SAFE (unchanged) | `backend/src/modules/auth-org/rbac.ts:53-60` — not in the changed-file set; prior finding stands. |
| Admin role-permission self-escalation (T-01-12) | Elevation of privilege | SAFE (unchanged) | `backend/src/modules/auth-org/admin-roles.ts:58` — not in the changed-file set; prior finding stands. |
| SSO-config forged "tested" claim (T-01-13) | Tampering | SAFE (unchanged) | `backend/src/modules/auth-org/admin-sso-config.ts:159-174` — not in the changed-file set; prior finding stands. |
| Admin mutation audit coverage (T-01-14) | Repudiation | SAFE (unchanged) | Admin route handlers — not in the changed-file set; prior finding stands. |
| API client secret one-time plaintext (T-01-15) | Info disclosure | SAFE (unchanged) | `backend/src/modules/integration-gateway/api-clients.ts:63-91` — not in the changed-file set; prior finding stands. |
| Federation grant empty-scope (T-01-16) | Elevation of privilege | SAFE (unchanged) | `backend/src/modules/integration-gateway/federation-grants.ts:49-54` — not in the changed-file set; prior finding stands. |
| Federation-grant OPA sync timing (T-01-17) | Tampering | SAFE (unchanged) | `federation-grants.ts:71,90` — not in the changed-file set; prior finding stands. |
| Webhook delivery dedup (T-01-18) | Tampering | SAFE (unchanged) | `webhook-delivery-worker.ts:125-144` — not in the changed-file set; prior finding stands. |
| Webhook subscriber secret hashing (T-01-19) | Info disclosure | SAFE (unchanged) | `webhook-subscriptions.ts:21-26,58` — not in the changed-file set; prior finding stands. |
| Webhook outbound fetch timeout (T-01-20) | Denial of service | ACCEPTED GAP (unchanged) | `webhook-delivery-worker.ts:147-156` — not in the changed-file set; carried forward, see Accepted risks. |
| Session token storage location (T-01-21) | Info disclosure | SAFE (unchanged) | `frontend/app/src/auth/session-storage.ts:14-23` — not in the changed-file set; prior finding stands. |
| OIDC PKCE (T-01-22) | Spoofing | SAFE (unchanged) | `frontend/app/src/auth/oidc-config.ts:23-31` — not in the changed-file set; prior finding stands. |
| Dev Vite proxy auth (T-01-23) | Info disclosure | SAFE (accepted, unchanged) | Dev-only config — not in the changed-file set; prior finding stands. |
| Admin UI confirm-modal vs. real authz boundary | Elevation of privilege | SAFE (unchanged) | `admin-roles.ts:58` — not in the changed-file set; prior finding stands. |
| Suspend/reactivate confirm UX | Tampering | SAFE (unchanged) | `UserDetail.tsx` — not in the changed-file set; prior finding stands. |
| One-time API-client secret, client-side | Info disclosure | SAFE (unchanged) | `ApiClients.tsx:72-73,102-126` — not in the changed-file set; prior finding stands. |
| SSO-config client-gate vs. server re-verification | Tampering | SAFE (unchanged) | Re-confirmed via `admin-sso-config.ts` evidence, unchanged. |
| `/healthz` unauthenticated info leak | Info disclosure | SAFE (unchanged) | `backend/src/modules/platform/healthz.ts:13-15` — not in the changed-file set; prior finding stands. |
| Boot resilience when DB unset | Denial of service | SAFE (unchanged) | `backend/src/db/migrate-runner.ts:29-33`, `Dockerfile:57` — not in the changed-file set; prior finding stands. |
| Seed migration scope | Elevation of privilege | SAFE (unchanged) | `backend/migrations/1700000000001_seed-roles.js:19-37` — not in the changed-file set; prior finding stands. |
| Audit-log immutability, API-layer defense-in-depth | Tampering | SAFE (unchanged) | `backend/src/modules/auth-org/admin-audit.ts:111-124` — not in the changed-file set; prior finding stands. |
| Admin route authz coverage (cross-cutting) | Elevation of privilege | SAFE (unchanged) | All 9 admin route files — not in the changed-file set; prior finding stands. |
| Shell/exec injection sinks | Tampering | SAFE (re-confirmed) | `grep -rn "child_process\|execSync\|spawn("` across `backend/src` still returns zero matches (independently re-run this pass). |
| XSS via raw HTML injection | Tampering | SAFE (unchanged) | `dangerouslySetInnerHTML` — not in the changed-file set; prior finding stands. |
| Path traversal in static serving | Info disclosure | SAFE (unchanged) | `backend/src/static.ts:27-53` — not in the changed-file set; prior finding stands. |
| Container non-root / layer secrets | Info disclosure / EoP | SAFE (unchanged) | `Dockerfile:49,55` — not in the changed-file set; prior finding stands. |
| Dev-stack committed secrets | Info disclosure | SAFE (unchanged) | `.env.example`, `docker-compose.yml` — not in the changed-file set; prior finding stands. |
| Modal focus-trap DoS | Denial of service | SAFE (unchanged) | `Modal.tsx:58-63` — not in the changed-file set; prior finding stands. |
| `package.json` `dev` script banner (01-14's T-01-24, this pass's own ID) | Info disclosure | NOT YET IMPLEMENTED | `package.json:11` — independently confirmed the `dev` script is still `docker compose up -d db nats opa keycloak && npm run build -w frontend/design-system && concurrently ...` with no `echo` banner and no `5173` substring; 01-14's threat-model entry describes a change that has not been made. Re-audit required after 01-14 executes. |
| `README.md` `## Development` section (part of 01-14) | Info disclosure | NOT YET IMPLEMENTED | `grep -n "## Development" README.md` returns no match (exit 1); the port-split documentation 01-14 promises does not exist yet. Re-audit required after 01-14 executes. |
| `tokens.json`/`tokens.css` `--ink-disabled` fix (01-15 Task 1, T-01-25) | Tampering | NOT YET IMPLEMENTED | `tokens.json:13` light theme still `#8794a0`, `tokens.json:92` dark theme still `#5d7284` — identical to the plan's own pre-fix measurements (3.10:1 and 3.63:1, both below the 4.5:1 AA floor the plan's `<verify>` block checks for). `tokens.css:30,122` match. The fix 01-15 Task 1 describes has not been applied. Re-audit required after 01-15 executes. |
| `frontend/app/e2e/contrast-audit.spec.ts` (01-15 Task 2, T-01-26) | Info disclosure | NOT YET IMPLEMENTED | File does not exist (`ls` → "No such file or directory"). The test-only code 01-15's T-01-26 threat-model entry describes does not exist to audit. Re-audit required after 01-15 executes. |

## Confirmed findings

None. Zero implementation files changed since the prior SECURED-verdict audit; all 30 previously-verified threat-register entries remain mitigated/accepted/transferred exactly as before, re-confirmed by diff-absence (the cited files are provably untouched) rather than re-derived from scratch. No new HIGH/CRITICAL issue was found in the actually-shipped code during this pass.

The three new threat-register entries introduced by 01-14 (T-01-24) and 01-15 (T-01-25, T-01-26) are **not evaluated as SAFE or OPEN** in this report because the code they describe does not exist in this working tree. Marking them SAFE would certify unbuilt code; marking them OPEN would misrepresent a documentation-only diff as having shipped a vulnerability. They are tracked as "pending — re-audit after execution" in the attack-surface table above.

## Resolved findings

> No findings from the prior audit were *fixed* between that audit and this one — the implementation didn't change at all. There is nothing to move into this section this pass; the prior audit's own `## Resolved findings` entry (01-REVIEW.md gate context) remains accurate and is not duplicated here since none of the code it describes changed either. See `git diff 2e8c65c..HEAD` for proof no `record-authority.ts`/`RecordAuthority.tsx` file is in this diff.

## Accepted risks

| ID | Risk | Why accepted | Owner |
|----|------|--------------|-------|
| T-01-20 | Webhook delivery worker's outbound `fetch()` to an admin-registered `callback_url` has no request timeout — a slow/malicious subscriber endpoint could stall delivery processing. | Unchanged from prior audit. Explicitly documented as a known Phase 1 gap in `01-09-PLAN.md`'s threat register; `callback_url` is only ever admin-registered (not attacker-reachable without existing `admin,create` permission), bounding the practical severity. Flagged for a hardening pass (`AbortController`-based ~10s timeout) before production webhook traffic scales. | Integration-gateway module owner, pre-GA hardening backlog |
| T-01-02 | Keycloak realm-import ships a fixed dev test-user password (`devpass123`). | Unchanged from prior audit. Confirmed reachable only inside the local docker-compose network; never a production credential. | Dev-stack owner |
| T-01-23 | Dev-mode Vite proxy (`/api` → `localhost:8080`) has no auth layer beyond the backend's own `requirePermission` checks. | Unchanged from prior audit. Dev-server-only configuration; irrelevant to the production deploy path. | Frontend dev-tooling owner |
| T-01-24 (01-14, pending) | `package.json`'s planned `dev` script banner will print only already-public `localhost` port numbers — no secret. | Plan-declared disposition is `accept`; cannot be independently verified against shipped code yet since the banner doesn't exist. Carried forward as the plan's own stated position, not as this audit's independent finding. Re-verify once 01-14 executes. | 01-14 plan owner, re-audit after execution |
| T-01-25 (01-15, pending) | Planned `--ink-disabled` token edit is scoped to exactly two color values and verified computationally per the plan. | Plan-declared disposition is `mitigate`; cannot be independently verified against shipped code yet since the token file is still at its pre-fix values. Carried forward as the plan's own stated position, not as this audit's independent finding. Re-verify once 01-15 executes. | 01-15 plan owner, re-audit after execution |
| T-01-26 (01-15, pending) | Planned `contrast-audit.spec.ts` reuses the existing dev-fixture sign-in helper, introduces no new credential, and is excluded from the production Docker build. | Plan-declared disposition is `accept`; cannot be independently verified against shipped code yet since the file doesn't exist. Carried forward as the plan's own stated position, not as this audit's independent finding. Re-verify once 01-15 executes. | 01-15 plan owner, re-audit after execution |

## Audit trail

- Diff scoped via: `git diff 2e8c65c..HEAD --stat` and `--name-only` (independently re-run, not taken on the audit brief's word) — confirms exactly 3 files changed (`.planning/ROADMAP.md`, `01-14-PLAN.md`, `01-15-PLAN.md`), 0 implementation files. `git diff 2e8c65c..HEAD --name-only | grep -v '^\.planning/'` returns empty, confirming no non-planning file is in scope. `git status --porcelain` shows only this audit run's own untracked log directory (`.planning/phases/.../logs/attempt-3/`), not implementation drift.
- Register: prior audit's register (verify mode, T-01-01–T-01-30 across the original 13 plans) loaded and re-confirmed by diff-absence rather than re-derived. 01-14's and 01-15's own `<threat_model>` blocks (T-01-24 new numbering clash with the prior audit's own T-01-24 note — both tracked distinctly above by plan-of-origin) loaded but explicitly NOT verified against code, since independent checks (below) proved the code doesn't exist.
- Independent pre-audit checks performed directly (not accepted from the brief): (1) `grep -n "## Development" README.md` → no match; (2) `grep -n "5173\|\"dev\"" package.json` → dev script unchanged, no 5173; (3) `ls frontend/app/e2e/contrast-audit.spec.ts` → does not exist; (4) `grep -n "ink-disabled" frontend/design-system/tokens/tokens.json` and `tokens.css` → light `#8794a0` / dark `#5d7284`, identical to the plan's own cited pre-fix failing values; (5) `ls` for `01-14-SUMMARY.md`/`01-15-SUMMARY.md` → neither exists. All five independently reproduced the audit brief's predicted state; none contradicted it.
- Refutation: 0 new HIGH/CRITICAL candidates found in shipped code (none exists to find, since 0 implementation files changed). 30 pre-existing threat-register entries re-confirmed safe by diff-absence. 3 new threat-register entries (T-01-24/25/26 per 01-14/01-15) explicitly withheld from a SAFE/OPEN verdict because the code they describe is unbuilt — recorded as pending future audit, consistent with the instruction not to audit a plan's stated intent as if it were shipped.
