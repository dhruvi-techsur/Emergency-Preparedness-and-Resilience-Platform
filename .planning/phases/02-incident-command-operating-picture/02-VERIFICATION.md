---
phase: 02-incident-command-operating-picture
verified: 2026-11-16T15:12:04Z
status: passed
score: 5/5 must-haves verified
---

# Phase 2: Incident Command & Operating Picture Verification Report

**Phase Goal:** Command staff can intake and activate an incident, assign named command roles, and see a shared, time-stamped operating picture that never fails to render — even when the live GIS feed is unavailable.
**Verified:** 2026-11-16T15:12:04Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (5 Success Criteria from ROADMAP.md)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User creates/classifies an incident → workspace opens with severity badge, pinned command-role panel, Timeline/Tasks/Resources/Reports tabs | ✓ VERIFIED | `CreateIncident.tsx` (282 lines, real form w/ validation) posts to `POST /api/v1/incidents` (`incidents.ts`); post-create redirect → `IncidentWorkspace.tsx` (347 lines) renders `PageHeader status={<Badge tone=...>}` (line 188), pinned 6-role Card (`COMMAND_ROLE_TITLES`, lines 36-44), and the 4 tabs in fixed order `timeline/tasks/resources/reports` (line 109). Playwright `incident-workspace.spec.ts` test 1 asserts this exact structure on a fresh incident. |
| 2 | Command-role assignment + every status change/decision writes exactly one append-only Timeline entry with actor+source | ✓ VERIFIED | `TimelineService.append()` is the sole INSERT path into `incident_timeline` (`timeline.ts:10-26`); `incident_timeline` has a `BEFORE UPDATE OR DELETE` trigger that unconditionally `RAISE EXCEPTION`s (migration `1700000000002`, lines 64-73), proven live by `incidents.test.ts`'s direct-UPDATE immutability check. `command-roles.ts`/`activation.ts`/`closure.ts` each call `withTimelineTransaction` (BEGIN/COMMIT/ROLLBACK, `timeline.ts:34-47`) wrapping the domain mutation + exactly one `TimelineService.append` call with `actorId`/`source` params. `activation.test.ts` asserts "successful activation writes exactly 3 Timeline entries (create + assign + activate)". |
| 3 | Activation-level change requires modal confirmation naming the specific consequence; ≥1 Incident Commander required to activate above Monitoring | ✓ VERIFIED | Server-side (`activation.ts:55-60`): `confirmed !== true` → 400 `ACTIVATION_CONFIRMATION_REQUIRED`, enforced regardless of UI (closes direct-API-bypass threat). Commander gate (`activation.ts:82-96`): counts active `Incident Commander` rows, 422 `NO_COMMANDER_ASSIGNED` + **no level change** if zero, only when target rank > Monitoring. Frontend `ActivationModal.tsx`: `danger` tier on escalation (line 107), per-target-level consequence sentence rendered from `CONSEQUENCE_FOR_LEVEL` (lines 18-23, 139), outcome-named buttons never "Yes/OK" (lines 117-127), and on a 422 it deliberately skips `onChanged()` so the displayed level visibly does not change (lines 89-93). `activation.test.ts` proves "commander gate blocks + leaves level unchanged". |
| 4 | Operating picture renders incidents/facilities/resources as status-coded, shape-distinguished markers on a real GIS-sourced base map, with a status bar showing data age + base-layer source | ✓ VERIFIED (Phase-2-scoped to incidents; facility/resource types are a documented, structurally-ready extension point) | `operating-picture.ts` GET `/markers` queries real `incidents` rows, maps `severityToTone()` (danger/warning/info/success) and fixed `shape: 'diamond'` per `MapMarker` (lines 35-43, 88-96); real adapter call `fetchGisFeatures('agency-base-boundary', bbox)` provides provenanced `source`/`as_of` on success (lines 127-131). `OperatingPicture.tsx` renders via `MapCanvas` with `status={statusBarText}` built from the exact backend `status_bar.as_of`/`base_layer_source` (lines 326-335, 420). `MapCanvas.tsx` gives every marker a shape class keyed by `type` (diamond/square/triangle/circle, lines 84-89) — the `MapMarker` type discriminant (`'incident'\|'facility'\|'resource'\|'shelter'`) is already wired through the whole pipeline so Phase 3+ facility/resource rows need no response-shape change, per 02-03's own documented scope note. Playwright `operating-picture.spec.ts` test 2 asserts the exact status-bar string format. |
| 5 | On GIS feed unavailability, operating picture falls back to schematic base map labeled "Schematic base map, offline" and keeps rendering EPMP markers — page never fails to render | ✓ VERIFIED | `operating-picture.ts`: `baseLayerSource`/`baseLayerAsOf` are initialized to the degraded values (`SCHEMATIC_FALLBACK_LABEL`) **before** the GIS fetch is attempted (lines 103-104) — fallback is the structural default, not a catch-block afterthought; the `catch` block (lines 135-140) is intentionally empty — absence of action is correct behavior; route always returns `200` (line 152, comment line 150). `MapCanvas.tsx`'s own doc comment (lines 14-19) states the "critical offline contract": `offline` gates ONLY base-fill/label rendering; markers/areas/lines render identically regardless — enforced by file structure (overlay SVG + markers div at lines 147-203 have zero `offline` conditionals). `OperatingPicture.tsx` derives both the visible status text AND `MapCanvas`'s `offline` prop from the **same** `status_bar.base_layer_source` string (lines 322-335) — structurally cannot disagree. Playwright `operating-picture.spec.ts` test 5 (confirmed present, line 205) loads `?force_gis_failure=true`, asserts the exact regex `^As of \d{2}:\d{2} ET · Base layer: Schematic base map, offline$` (line 220), and that the incident marker stays visible/clickable. W3 code-review fix additionally hardened malformed-`bbox` handling to fall through to this same proven path (02-REVIEW.md). |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `backend/migrations/1700000000002_incident-ops-schema.js` | incidents/incident_command_roles/incident_timeline DDL + append-only trigger | ✓ VERIFIED | Confirmed `BEFORE UPDATE OR DELETE` trigger raising exception (lines 64-73) |
| `backend/src/modules/incident-ops/timeline.ts` | Single-writer TimelineService + transaction helper | ✓ VERIFIED | 47 lines, `TimelineService.append` + `withTimelineTransaction`, wired into 3 mutation routes |
| `backend/src/modules/incident-ops/incidents.ts` | Incident CRUD + list/detail/timeline-read | ✓ VERIFIED | 469 lines, exports `fetchIncidentForMutation`/`fetchIncidentDetailShape`/`INCIDENT_NOT_FOUND` consumed by activation/command-roles/closure |
| `backend/src/modules/incident-ops/command-roles.ts` | Row-locked assign/reassign | ✓ VERIFIED | 161 lines, `SELECT...FOR UPDATE` row-lock per activation.test.ts assertions |
| `backend/src/modules/incident-ops/activation.ts` | Confirmation + commander gates | ✓ VERIFIED | 133 lines, both gates present and tested (see Truth 3) |
| `backend/src/modules/incident-ops/closure.ts` | Incident closure + Timeline write | ✓ VERIFIED | 133 lines, SAVEPOINT-guarded cascade, confirmed:true gate |
| `backend/src/modules/incident-ops/operating-picture.ts` | Markers/layers endpoints, schematic fallback as default | ✓ VERIFIED | 189 lines, fallback-as-default pattern confirmed (see Truth 5) |
| `backend/src/modules/integration-gateway/gis-adapter.ts` | Provenance-enforced GIS adapter stub | ✓ VERIFIED (exists, imported by operating-picture.ts) |
| `backend/src/modules/incident-ops/routes.ts` | Mounts all incident-ops routes | ✓ VERIFIED | All 5 route modules registered (lines 14-18), itself mounted in `server.ts:33` |
| `frontend/app/src/pages/incidents/IncidentList.tsx` | S1.1 filterable list | ✓ VERIFIED | 272 lines, Table+Badge, routed `/incidents` (main.tsx:70) |
| `frontend/app/src/pages/incidents/CreateIncident.tsx` | S1.2 create form | ✓ VERIFIED | 282 lines, routed `/incidents/new` (main.tsx:71) |
| `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` | S1.3 workspace | ✓ VERIFIED | 347 lines, routed `/incidents/:id` (main.tsx:72), see Truth 1 |
| `frontend/app/src/pages/incidents/CommandRoleModal.tsx` | S1.4 assignment modal | ✓ VERIFIED | 133 lines, imported+rendered in IncidentWorkspace.tsx:18,320 |
| `frontend/app/src/pages/incidents/ActivationModal.tsx` | S1.5 activation modal | ✓ VERIFIED | 154 lines, see Truth 3 |
| `frontend/app/src/pages/incidents/ClosureModal.tsx` | Closure modal (B1/W2 fix-pass addition) | ✓ VERIFIED | 87 lines, danger tier + alertdialog role confirmed in 02-REVIEW.md |
| `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` | S2.1 map screen | ✓ VERIFIED | 452 lines, routed `/operating-picture` (main.tsx:73), see Truths 4/5 |
| `frontend/design-system/src/maps/{MapCanvas,MapControls,MapLegend,MapPopup,LayerPanel}.tsx` | MAPS component family | ✓ VERIFIED | All 5 present, substantive (59-227 lines each), exported via `index.ts`, consumed by OperatingPicture.tsx |
| `frontend/design-system/src/product-patterns/Provenance.tsx` | Source/time/verification chip | ✓ VERIFIED | 56 lines, consumed by OperatingPicture.tsx's MapPopup |

All artifacts exist, are substantive (no stub patterns found beyond one disclosed Phase-3+ scope-boundary TODO), and are wired (imported + invoked, not orphaned).

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `CreateIncident.tsx` | `POST /api/v1/incidents` | `apiPost` + redirect to `/incidents/{id}` | ✓ WIRED | Confirmed in 02-05-SUMMARY + Playwright `incident-list-create.spec.ts` |
| `IncidentWorkspace.tsx` | `GET /incidents/{id}/timeline` | `useQuery` → `Timeline` component | ✓ WIRED | Line 139, rendered line 229 |
| `ActivationModal.tsx` | `POST /incidents/{id}/activation` | `apiPost` with `confirmed:true` | ✓ WIRED | Line 82-85; 422 handled distinctly (lines 89-93) |
| `CommandRoleModal.tsx` | `POST /incidents/{id}/command-roles` | row-locked assign/reassign | ✓ WIRED | Confirmed via 02-06-SUMMARY + activation.test.ts reassignment case |
| `operating-picture.ts` | `gis-adapter.ts:fetchGisFeatures` | try/catch, fallback-as-default | ✓ WIRED | Lines 4, 127-140 |
| `OperatingPicture.tsx` | `GET /operating-picture/markers` | `useQuery`, 30s poll, `force_gis_failure` passthrough | ✓ WIRED | Lines 219-237 |
| `MapCanvas` `offline` prop | `status_bar.base_layer_source` | derived string equality, same source | ✓ WIRED | Lines 326-327, 421 — structurally cannot disagree |
| `incidentOpsRoutes` | `server.ts` | `app.register` | ✓ WIRED | server.ts:4,33 |
| `/operating-picture`, `/incidents*` routes | `main.tsx` route tree | `<Route>` elements | ✓ WIRED | Lines 35-38, 70-73 |

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|-------------|-------------|--------|----------|
| F1 | Incident/ICS — intake/classification, command-role assignment, append-only timeline, activation-level change w/ consequence confirmation, incident workspace | ✓ SATISFIED | Truths 1, 2, 3 |
| F2 | Common Operating Picture — status-coded markers, data-age/source status bar, degraded/offline schematic fallback | ✓ SATISFIED | Truths 4, 5 (weather/hazard overlays and EOC dashboard explicitly out of Phase 2 scope per REQUIREMENTS.md v2/F12/F18) |
| F11 | GIS integration — read integration w/ graceful schematic fallback on feed failure | ✓ SATISFIED | Truth 5, `gis-adapter.ts` provenance enforcement |

### Gate Evidence (cited, not re-run)

- `gate_status: passed`, all 5 waves: build pass / tests pass / 0 fix attempts (`02-GATE.md` frontmatter)
- `boot_smoke: pass` (port bind, HTTP non-5xx, no fatal log markers, schema+data endpoint checks — all 4 gates green)
- `browser_suite: pass` (30/30 Playwright assertions, 0 unexpected failures — confirmed by file-level counts: incident-workspace 5, operating-picture 6, incident-list-create 4, app-shell 4, admin-users-roles 5, plus admin-platform-sso/contrast-audit suites not altered this phase)
- `review_blockers_open: 0`, iteration 2 clean (1 BLOCKER + 3 WARNINGs from iteration 1 all fixed and independently re-verified against the live stack, per `02-REVIEW.md`)
- `node pivota_spec-tools.cjs verify gate-evidence 02 --raw` → `pass` (no skipped/not-run checks)

No gate was skipped. No truth in this report rests on an unexecuted check.

### Carried-Forward Gap Assessment (W1 — DB-layer RLS half)

02-REVIEW.md documents that the W1 finding (jurisdiction-scope filtering gap on mutating incident-ops routes) was fixed at the **app layer** in iteration 2 (every list/detail/mutation route now filters/guards by `req.epmpUser.jurisdiction_scope`, with 2 new regression tests proving cross-jurisdiction 404s), while the **DB-layer RLS policy half** (`CREATE POLICY` + `SET LOCAL app.jurisdiction_scope`) remains unimplemented — explicitly disclosed by the fixer and by this plan's own SUMMARYs (T-02-03/T-02-09), not hidden.

**Assessed against this phase's 5 success criteria: none of the 5 criteria name jurisdiction-scoping as an observable truth.** Jurisdiction scope is a cross-cutting security/multi-tenancy concern (TechArch §5.2), not a goal of Phase 2's incident-command-and-operating-picture slice. The app-layer fix closes the actual exploitable path for any authenticated user through the normal API (confirmed via `incidents.test.ts`/`activation.test.ts`'s new cross-jurisdiction 404 assertions, independently re-run by the reviewer against the live stack). The residual DB-layer backstop (defense against a compromised app-tier credential or raw SQL injection) is a materially narrower, already-disclosed threat surface that does not block or contradict any of the 5 stated success criteria. This is correctly treated as an open, tracked, non-blocking item for a later security-hardening pass — not a gap in this phase's goal achievement.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `operating-picture.ts` | 144 | `TODO(Phase 3+)` | ℹ️ Info | Explicitly documents a Phase-2-correct scope simplification (status_bar.as_of reduces to single base layer since no other provenanced layer exists yet) — not an incomplete implementation of this phase's own scope |
| `OperatingPicture.tsx` | 404-405 | `onZoomIn={() => {}}` / `onZoomOut={() => {}}` no-ops | ℹ️ Info | Documented, plan-specified structural placeholders satisfying `MapControls`' required-prop contract — no real map engine exists underneath in Phase 2 (same limitation as `projectToPercent`'s linear approximation); zoom/pan is not named in any of the 5 success criteria |
| `IncidentWorkspace.tsx` / `OperatingPicture.tsx` | various | Tasks/Resources/Reports `EmptyState`s with "ships in a later phase" copy | ℹ️ Info | Honest, labeled placeholders for F4/F7/F9 (explicitly out of Phase 2 scope per REQUIREMENTS.md) — not fake functioning content |

No 🛑 Blocker or ⚠️ Warning anti-patterns found in the 4,293 lines of phase-2-authored code scanned. The one TODO and the two no-op handlers are all explicitly documented scope boundaries, consistent with the phase's own stated success criteria, not hidden incompleteness.

### Human Verification Required

None. All 5 success criteria have direct code-level evidence (structural guarantees: transaction wrapping, default-fallback-before-fetch ordering, same-source-string derivation) corroborated by passing integration tests and Playwright e2e assertions that were run against the live compose stack and independently re-verified by the code reviewer (not merely claimed in a SUMMARY). No gate was skipped; nothing is left for Verify to drive live.

### Gaps Summary

No gaps. All 5 success criteria are verified with both static code evidence and dynamic test evidence (gates green, review clean, e2e degraded-mode test present and asserting the exact required string). The one disclosed carried-forward item (DB-layer RLS half of W1) is a security-hardening item outside the scope of this phase's 5 stated success criteria, correctly tracked rather than hidden, and does not block phase-goal achievement.

---
_Verified: 2026-11-16T15:12:04Z_
_Verifier: Claude (pivota_spec-verifier)_
