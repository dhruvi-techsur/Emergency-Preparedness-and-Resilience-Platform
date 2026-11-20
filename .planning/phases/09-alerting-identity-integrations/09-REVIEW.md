---
phase: 9
status: clean
blockers: 0
warnings: 0
files_reviewed: 2
files_reviewed_list:
  - frontend/app/src/pages/notifications/ComposeNotification.tsx
  - frontend/app/e2e/notification-provider-cap-delivery.spec.ts
reviewed_at: 2026-11-20T23:30:00Z
iteration: 1
---

# Phase 9 Code Review

**Scope note:** This is a `--gaps-only` re-review covering only plan 09-05's three commits (`2c22e18`, `1e362ed`, `1b165b3`), a UAT gap-closure fixing checkbox spacing on Compose Notification's Step 2. Plans 09-01 through 09-04 were already reviewed and shipped as `clean`; they are out of scope here and were not re-read.

## BLOCKERs

None found.

## WARNINGs

None found.

## Analysis

### `ComposeNotification.tsx` (2c22e18)

The Channels `CHANNEL_OPTIONS.map(...)` Checkbox list is now wrapped in a `<div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>`. Verified:

- `--space-2` (8px) and `--space-4` (16px) are real tokens defined in `frontend/design-system/tokens/tokens.css:279,281` — not invented values. Inline-style token references via `var(--token)` are an established pattern already used identically elsewhere in this same directory (`IntegrationHealth.tsx`/`RecordAuthority.tsx`/`SsoConfigForm.tsx`/`ApiClients.tsx`, confirmed by grep of the broader frontend codebase for the same `var(--space-N)` inline-style convention).
- `Checkbox.tsx`/`Checkbox.css` render each option as an `inline-flex` `<label>` with its own internal `gap: var(--space-2)` between box and text — the new wrapper's `flex-direction: column` + `gap` operates one level up, stacking the three `<label>` elements vertically without touching `.ep-checkbox`'s own internal layout. No CSS specificity collision; the wrapper is a plain unstyled div with inline styles only, no class name reused elsewhere.
- The wrapper's `marginBottom: var(--space-4)` sits between the checkbox group and whichever element renders next — either the conditional `CAP public-alert fields` `Card` (when IPAWS is checked) or directly the `Draft with AI` `Button` (when it isn't). Both of those elements are self-contained components (`Card`/`Button`) with their own no-margin box models, so the new wrapper's margin is the only vertical separator introduced — no double-margin or collapsed-margin interaction identified.
- No change to `toggleChannel`, `channels` state, the CAP-field gating `if` block (`handleContinueFromStep2`), or the Step 3 Review summary (`Array.from(channels).join(', ')`) — confirmed by diff: only the JSX wrapper changed, logic is byte-identical.
- `tsc --noEmit` run directly against the frontend project: exit clean, zero errors.

### `notification-provider-cap-delivery.spec.ts` (1e362ed)

New assertion block inserted into test 1, after Step 2 becomes visible and before IPAWS is checked:
- `getByLabel('IPAWS', { exact: true })` — verified the Channels `Checkbox` usage (line 464 in the modified file) has no `required` prop, so `Checkbox.tsx`'s label is the bare string `'IPAWS'` with no appended marker, making `exact: true` a correct match (the file's own existing tests already document why `exact:true` is wrong for the CAP fields below, which DO have `required` — this new assertion correctly uses `exact:true` only where that caveat doesn't apply).
- `getByRole('button', { name: 'Draft with AI' })` — only one such button exists on Step 2 in this component tree at the point this assertion runs (confirmed via read of the full file: no other `Draft with AI`-labeled control exists).
- The gap arithmetic (`draftWithAiButtonBox.y - (ipawsCheckboxBox.y + ipawsCheckboxBox.height)`) is the correct formula for vertical separation between two boxes where the second renders below the first — consistent with the new flex-column layout (IPAWS is the 3rd/last checkbox, Draft with AI renders after it).
- `playwright test --list` against this spec parses all 5 tests successfully, confirming no syntax/import break was introduced.
- The two other e2e specs that touch `ComposeNotification.tsx` (`notifications-compose.spec.ts`, `incident-to-evidence-trail.spec.ts`) do not interact with the Channels checkboxes at all (grepped for `Channel|IPAWS|SMS|Email` — no hits), so this layout change carries no regression risk to those suites.

### Contract-scan c-gap disposition (re-verified, not re-filed)

Re-confirmed independently (not taken on faith): `git show --name-only` across all three of plan 09-05's commits (`2c22e18`, `1e362ed`, `1b165b3`) contains neither `SignInCallback.tsx` nor `backend/src/modules/auth-org/routes.ts`; a direct `git diff --name-only` across the full Phase-9 commit range for those two specific paths returns empty. The c-gap `GET /api/v1/auth/sso/callback` flagged by the scanner is unchanged by this gap-closure plan and was already correctly dispositioned as a false positive (method-casing scanner artifact; both sides are POST) in the original 09-REVIEW.md. Per the scope note, it is not re-filed here.

## Cross-file seams checked

- `ComposeNotification.tsx`'s Channels checkbox wrapper styles ↔ `Checkbox.css`'s own internal `.ep-checkbox` layout — no specificity/class collision, wrapper is unstyled inline-only. OK.
- `ComposeNotification.tsx`'s Channels checkbox group ↔ its only two e2e consumers that exercise it (`notification-provider-cap-delivery.spec.ts` test 1 new assertion; `notifications-compose.spec.ts`/`incident-to-evidence-trail.spec.ts` do not touch Channels at all). OK.
- `var(--space-2)`/`var(--space-4)` references (new inline styles) ↔ `tokens.css` definitions (8px/16px respectively) — tokens exist, no invented/undefined CSS variable. OK.
- New Playwright `getByLabel('IPAWS', { exact: true })` assertion ↔ `Checkbox.tsx`'s label-rendering (no `required` marker appended for this field) — exact match is correct. OK.
- c-gap `GET /api/v1/auth/sso/callback` (SignInCallback.tsx / auth-org/routes.ts) — independently re-verified untouched by 09-05's three commits; already dispositioned false-positive in prior review, not re-filed. OK, no new finding.
