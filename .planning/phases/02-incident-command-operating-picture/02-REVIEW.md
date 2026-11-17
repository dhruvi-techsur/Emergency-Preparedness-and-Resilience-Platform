---
phase: 2
status: clean
blockers: 0
warnings: 0
files_reviewed: 4
files_reviewed_list:
  - backend/keycloak/epmp-realm.json
  - docker-compose.yml
  - frontend/app/src/auth/oidc-config.ts
  - frontend/app/vite.config.ts
reviewed_at: 2026-11-17T00:00:00Z
iteration: 1
---

# Phase 2 Code Review

Scope: wave 6 gap-closure plan 02-08 (commits `1f01363`, `adb185d`, `bdf36db` on branch `phase-2`). Confirmed via `git diff --name-only 6ad6625..bdf36db` that exactly these 4 files changed in this wave; no other source file is in scope for this review.

## BLOCKERs

None.

## WARNINGs

None.

## Investigation notes

**`frontend/app/src/auth/oidc-config.ts`** — `KEYCLOAK_AUTHORITY` changed from the hardcoded `http://localhost:8081/realms/epmp` to `` `${window.location.origin}/realms/epmp` ``, now symmetric with the file's pre-existing `redirect_uri` line. No other change in the file. `npx tsc --noEmit` (full project, includes this file per `--listFiles`) passes with exit 0.

**`frontend/app/vite.config.ts`** — Read both commits (`1f01363`'s initial `xfwd: true` and `adb185d`'s replacement). The final state uses a `configure()` hook (`forwardHeaders`) instead of `xfwd: true`, setting `x-forwarded-proto`/`x-forwarded-host` verbatim from the incoming request when present, falling back to `http`/`req.headers.host` otherwise. Traced this against `oidc-config.ts` (authority navigation target) and `docker-compose.yml` (`KC_PROXY_HEADERS=xforwarded` on the receiving end) — the header names and casing used (`x-forwarded-proto`, `x-forwarded-host`, lowercase, matching Node's header normalization) are the pair Keycloak's `xforwarded` proxy mode consumes. Checked for route collisions between the new `/realms`, `/resources`, `/js` proxy prefixes and the SPA's own React Router routes (`main.tsx`) — no overlap (`/auth/callback`, `admin/*`, `incidents*`, `operating-picture` don't collide). `tsc --noEmit` confirms the `ProxyOptions['configure']` typing is satisfied.

**`docker-compose.yml`** — Only the `keycloak` service's `environment` block gained two keys (`KC_PROXY_HEADERS: xforwarded`, `KC_HOSTNAME_STRICT: "false"`). Verified `docker compose config` parses the file without error and the keys land correctly in the resolved config. No other service touched.

**`backend/keycloak/epmp-realm.json`** — Only `clients[0].redirectUris` changed, from two literal sandbox-internal origins to `["/auth/callback", "/auth/callback/*"]`. Re-ran the plan's own Python verification snippet against the file on disk — passes. Checked `frontend/app/e2e/helpers/sign-in.ts` (existing Playwright helper, NOT modified by this wave) — its own callback assertion (`!url.pathname.startsWith('/auth/callback')`) uses relative path matching, so it is unaffected by whichever absolute origin Keycloak now resolves the redirect against; no regression risk identified. `webOrigins: ["*"]`, `groups`, `users`, protocol mappers all byte-identical to the pre-wave version (diffed against `6ad6625`).

**Backend ID-token validation (`backend/src/modules/auth-org/sso.ts`)** — not in this wave's file list, but traced as a seam since the plan explicitly claims it required no change. Confirmed: `jwtVerify(idToken, jwks)` is called with no `issuer`/`audience` options (so `iss` claim isn't checked), and the JWKS fetch URL is built from `process.env.KEYCLOAK_ISSUER` (server-side, still internal `http://localhost:8081/realms/epmp` per `.env`), untouched by this wave's browser-facing changes. The plan's claim that no backend change was needed holds up under direct inspection.

**SUMMARY.md claims vs. evidence** — The summary's central claim (plan's own `xfwd: true` would have corrupted the forwarded port, fixed via an explicit `configure()` hook) is directly reflected in the diff between `1f01363` and `adb185d` — not just asserted in prose. No "Known Stubs" section content to escalate (summary states none found, and a scan of the 4 changed files for TODO/FIXME/placeholder markers confirms this).

## Contract scan disposition

`c-gap: api frontend/app/src/pages/SignInCallback.tsx:58 GET /api/v1/auth/sso/callback — no matching backend route declaration`

Investigated independently, not taken on faith:
- Read `SignInCallback.tsx:58` directly: `fetch('/api/v1/auth/sso/callback', { method: 'POST', ... })` — the scanner's `GET` label is wrong; this is a POST call.
- Read `backend/src/modules/auth-org/routes.ts:71` directly: `app.post<{ Body: { id_token: string } }>('/api/v1/auth/sso/callback', ...)` — a matching POST route exists.
- `git log --follow --oneline -- frontend/app/src/pages/SignInCallback.tsx` shows exactly one commit (`6ad6625`, the original Phase 2 execution) — this file was NOT touched by this wave's 02-08 plan (which modified only the 4 files listed in frontmatter above).

**Disposition: confirmed scanner false positive (method mislabeled) on a file outside this wave's scope.** Not a blocker or warning against 02-08's work — flagged here by name per instructions so it is not silently dropped, but it does not belong to this review's change set and the route/call-site pairing is in fact correctly matched (POST↔POST).

## Cross-file seams checked

- `oidc-config.ts` `KEYCLOAK_AUTHORITY` → `signinRedirect()` navigation target → Vite's `/realms` proxy entry: OK, origin-relative and routed same-origin.
- Vite's `forwardHeaders` configure hook (sets `x-forwarded-proto`/`x-forwarded-host`) → `docker-compose.yml` `KC_PROXY_HEADERS=xforwarded`: OK, header names/casing match what Keycloak's `xforwarded` proxy-header mode consumes.
- `docker-compose.yml` `KC_HOSTNAME_STRICT=false` → `epmp-realm.json` relative `redirectUris`: OK, Keycloak resolves its own per-request origin and validates the relative pattern against it (plan documents this was empirically confirmed; file-level change matches plan's described shape exactly).
- `epmp-realm.json` relative `redirectUris` → `frontend/app/e2e/helpers/sign-in.ts` (existing, unmodified) callback-path assertions: OK, assertions are relative-path-based (`url.pathname.startsWith`), unaffected by absolute-origin changes.
- `oidc-config.ts` authority change → backend `sso.ts` JWKS/issuer validation: OK, backend uses its own internal `KEYCLOAK_ISSUER` env var unaffected by browser-facing origin changes; `jwtVerify` performs no `iss` claim check today, confirmed by direct read, so no backend change was required and none was made.
- `SignInCallback.tsx` POST `/api/v1/auth/sso/callback` ↔ `routes.ts` POST `/api/v1/auth/sso/callback`: OK (see contract scan disposition above) — out of this wave's file scope, flagged as scanner false positive, not a wave defect.
