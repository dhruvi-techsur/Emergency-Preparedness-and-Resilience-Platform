---
phase: 6
status: clean
blockers: 0
warnings: 0
files_reviewed: 5
files_reviewed_list:
  - backend/scripts/seed.ts
  - frontend/app/src/pages/dashboard/EocDashboard.tsx
  - frontend/app/e2e/persona-dashboards.spec.ts
  - frontend/app/src/app-shell/AppShell.tsx
  - frontend/app/e2e/signal-triage.spec.ts
reviewed_at: 2026-11-19T23:59:00Z
iteration: 1
---

# Phase 6 Code Review

**Scope note:** This iteration supersedes the prior `06-REVIEW.md` (which reviewed the original 10-plan wave, pre-`62aa761`). This review covers ONLY the gap-closure wave executed under `--gaps-only` (commits `62aa761..HEAD`: plans 06-11, 06-12, 06-13), per the task's explicit scope.

## BLOCKERs

None.

## WARNINGs

None.

## Findings detail (all candidates refuted)

### Candidate: seed.ts's 6 new hazard_feed_events rows might collide with an existing grid cell and under-produce signals
- **File:** backend/scripts/seed.ts:2351-2410
- **Check performed:** Simulated the exact `(type, ST_SnapToGrid(geometry, 0.5))` grouping key `clusterHazardFeedEvents()` (backend/src/modules/ai-assist/signal-clustering.ts:67) uses, against all 13 fixture rows in `hazardFeedEventDefs` (7 pre-existing + 6 new). Result: each of the 6 new rows (Tornado Watch/-96.80,32.78; Heat Advisory/-112.07,33.45; Volcanic Activity Advisory/-121.76,46.85; Red Flag Warning/-119.42,36.73; Dense Fog Advisory/-72.68,41.76; Landslide Advisory/-122.68,45.52) lands in its own unique `(type, grid-cell)` bucket, distinct from every other row (old and new). Confirmed: produces exactly 6 new isolated Medium-confidence signals on a drained-queue reseed, as claimed by 06-11-SUMMARY.md.
- **Verdict:** Not a defect.

### Candidate: `hazard_feed_events.severity` CHECK constraint might reject new values ('Watch' used repeatedly)
- **File:** backend/migrations/1700000000011_persona-ai-signal-schema.js:66
- **Check performed:** `severity VARCHAR(50)` — no CHECK constraint on this column (only `confidence` and `status`-style columns elsewhere have CHECKs). 'Watch'/'Elevated' are free-text, already used by pre-existing rows in the same array.
- **Verdict:** Not a defect.

### Candidate: EocDashboard.tsx doc-comment/hint removal might not match the real backend response
- **File:** frontend/app/src/pages/dashboard/EocDashboard.tsx:17-57, 113-126
- **Check performed:** Read backend/src/modules/incident-ops/dashboard.ts directly. `open_tasks` and `pending_resource_requests` are genuine `COUNT(*)` SQL queries scoped by jurisdiction; `notifications_pending_ack` is a hardcoded `0` with an inline comment explaining the schema has no per-recipient `user_id` column. The frontend's corrected doc comment and the hint removal on the first two tiles (keeping the hint on only the third) exactly matches this backend reality.
- **Verdict:** Not a defect — fix is correct and the claim is accurate.

### Candidate: AppShell's new `.ep` class might duplicate a reset already applied elsewhere, or might not be the real activator
- **File:** frontend/app/src/app-shell/AppShell.tsx:201
- **Check performed:** Grepped the whole frontend tree for `.ep` (bare class, not `.ep-*`) — the only CSS rule matching is `frontend/design-system/tokens/tokens.css:352-354` (`.ep, .ep * { box-sizing: border-box; }`), loaded globally via `main.tsx`'s `import '@epmp/design-system/tokens/tokens.css'`. Before this change, no app-code element anywhere in `frontend/app/src` carried the bare `.ep` class (confirmed via grep across all page components) — `index.html`'s `#root` div also doesn't carry it. AppShell is the single top-level wrapper rendered for every routed page (`main.tsx`'s `<Route path="/*" element={<AppShell />}>`), so this is the correct, sole, non-duplicated activation point.
- **Verdict:** Not a defect — fix is correctly scoped and genuinely new.

### Candidate: new signal-triage.spec.ts test 2b's geometry assertions might be tautological or rely on an untested selector
- **File:** frontend/app/e2e/signal-triage.spec.ts:105-138
- **Check performed:** Read `SignalTriageQueue.tsx`'s Dismiss Modal markup (Modal + TextField with `label="Reason"` `multiline`) and `Modal.tsx`/`Modal.css`/`TextField.css`. The `TextField`'s textarea is `width: 100%` with its own `border`+`padding`, nested inside `.ep-modal`'s own `padding: var(--space-6)` — exactly the box-sizing-dependent composition the gap's diagnosis describes. The assertion (`reasonBox.x + reasonBox.width <= modalBox.x + modalBox.width + 1`) is a real geometry check, not tautological; it would fail under `content-box` sizing (padding/border added on top of the 100%-width basis, causing overflow) and passes under `border-box`. Test 2b additionally cancels via the `Cancel` button rather than confirming, correctly preserving the shared fixture pool for tests 3-5 in the same `.serial` block — verified this doesn't consume a `New`-status signal.
- **Verdict:** Not a defect — real regression coverage, correctly scoped.

## Cross-file seams checked

- `c-gap` SignInCallback.tsx:65 / auth-org/routes.ts:72 — **Confirmed OK, no new finding.** Verified via `git log --all -- frontend/app/src/pages/SignInCallback.tsx`: the file's last commit predates `62aa761` entirely (last touched in Phase 1); zero commits in this gap-closure wave (`62aa761..HEAD`) touch it. The prior review's refutation (scanner mislabeled a real `POST`/`POST` pair as `GET`) stands unchanged — carried forward, not re-derived.
- `c-adv` api-client.ts:121 dynamic path `/api/v1/field-reports/${fieldReportId}/photos` — **Confirmed informational only.** Backend route exists at `backend/src/modules/incident-ops/field-reports.ts:316` (`POST /api/v1/field-reports/:id/photos`). This file is also unchanged in this gap-closure wave (not in the `62aa761..HEAD` diff stat). No action needed.
- `EocDashboard.tsx` Stat tiles ↔ `dashboard.ts` `GET /api/v1/dashboard/summary` response shape — OK, verified field-for-field (active_incidents/open_tasks/pending_resource_requests/notifications_pending_ack all match, hint placement matches real-vs-structural-zero split).
- `persona-dashboards.spec.ts`'s new hint-string assertions ↔ `EocDashboard.tsx`'s actual rendered strings — OK, exact string match confirmed (`'Tasks module ships in a later phase'`, `'Resource requests module ships in a later phase'` both absent; `'Per-recipient acknowledgment ships in a later phase'` present).
- `signal-triage.spec.ts`'s new bounding-box assertions ↔ `SignalTriageQueue.tsx`'s Modal+TextField DOM structure ↔ `AppShell.tsx`'s new `.ep` class ↔ `tokens.css`'s box-sizing reset — OK, full chain traced and confirmed consistent (see Findings detail above).
- `seed.ts`'s 6 new `hazardFeedEventDefs` rows ↔ `hazard_feed_events` table's `UNIQUE(feed_id, external_event_id)` constraint ↔ `clusterHazardFeedEvents()`'s grid-snap grouping query — OK, no natural-key collision with existing rows, no accidental re-clustering into an existing group (verified by simulation).
- `seed.ts`'s new rows' `severity` values (`'Elevated'`/`'Watch'`) ↔ `hazard_feed_events.severity` column — OK, column has no CHECK constraint restricting these values.
</content>
