## F0: Web & Mobile Application Shell (EPMP Design System UI)

**Description:** The single required UI surface for the entire platform — the app shell, navigation, page-pattern library, and theming system that every persona uses to operate EPMP. Built exclusively from the EPMP Design System's 40 `window.EPMP` components and design tokens across light, dark, and contrast themes. This feature is the thing a human actually sees and operates; no other feature (F1–F18) is usable without it, and no other feature may introduce a screen, component, or visual treatment that bypasses this shell.

**Terminology:**
- **App shell:** The persistent chrome (SideNav, header strip, content area) that wraps every page.
- **Page pattern:** A named, reusable page layout (dashboard, incident workspace, list/table, form, field-mobile, operating-picture, analytics/reporting, notifications/alerts, interoperability/integration-health) defined in the design system and reused by feature-specific screens.
- **Theme:** One of `light` (default), `dark` (operations-center low-light), or `contrast` (Section 508 high-contrast, 7:1 text). Set via `data-theme` on the app root.
- **Breakpoint:** `bp-sm` 640px, `bp-md` 768px, `bp-lg` 1024px, `bp-xl` 1280px.

### Sub-features
- App shell: `SideNav` + header strip + content area, responsive collapse to bottom bar under `bp-md`.
- Page-pattern library: dashboard, incident workspace, lists/tables, forms, field-mobile, operating-picture, analytics/reporting, notifications/alerts, interoperability/integration-health.
- Global states: loading (`Skeleton`), empty (`EmptyState`), error (`Alert` + retry) on every list/table/panel across the platform.
- Three-theme support with full functional/visual parity including maps and charts.
- Installable, mobile-first web application (field use; see F6) — no native app store build in this MVP.
- Global header utilities: global search, `SyncStatus`, alerts `IconButton`, user `Avatar`.
- Admin console shell (detailed screens owned by F8, but the console itself is built from this shell).

### Screens

**S0.1 — App Shell (persistent chrome, all pages)**
- `SideNav` (240px, 64px collapsed under `bp-md`): grouped items following lifecycle order Prepare → Monitor → Activate → Coordinate → Recover → Improve; 6–9 top-level items; current page highlighted `brand-subtle`; brand mark (gold square + "EPMP" in `h4`) at top.
- Header strip (56px, `bg`, bottom `border`): left — `Breadcrumbs`; center — global search `Combobox`; right — `SyncStatus`, alerts `IconButton`, user `Avatar` (opens profile/logout menu).
- Under `bp-md`: `SideNav` collapses to a bottom bar of exactly 4 destinations (role-dependent — see F18); header keeps `SyncStatus` and incident name only.
- Skip-to-content link is the first focusable element on every page.

**S0.2 — Theme Switcher (in user/profile menu, reachable from every page)**
- `Select` or `Switch` group offering `light` / `dark` / `contrast`; persists per-user; applies instantly via `data-theme` without reload.

**S0.3 — Global Empty/Error/Loading Reference States**
- Not a standalone screen but a mandatory pattern instance validated on every list, table, and panel platform-wide: `Skeleton` sized to final layout (loads >300ms), `EmptyState` (title + 1 sentence + ≤1 action, differentiated for first-use vs. filtered-out vs. error), `Alert` (danger, with Retry, keeps last-known data visible labeled with its age).

**S0.4 — Component Gap Escalation (internal/admin-facing)**
- When a screen needs a treatment the 40-component set does not support, the gap is logged (not improvised) via an internal "Design system gap" flag visible to F8 admins, with the proposed addition described. No ad hoc component or raw style may ship.

### Process
1. On load, the shell resolves the user's session (F8/F16 SSO), determines role (F8 RBAC), and renders the role-scoped `SideNav` groups and bottom-bar destinations (F18).
2. The shell applies the user's persisted theme preference (default `light`) via `data-theme` before first paint to avoid flash of incorrect theme.
3. Every route renders inside the shell's content area using exactly one of the nine page patterns; the page pattern used is declared in the page's implementation metadata for design-system conformance checking.
4. Every list/table/panel component mounts in a `loading` state first, replaces all `Skeleton` blocks atomically on data arrival (no partial replace, to avoid layout shift), and falls back to `EmptyState` or `Alert` per the data/error outcome.
5. `SyncStatus` in the header polls/subscribes to connectivity and sync-queue state (shared with F6, F10) and updates in real time; state changes never require a page reload.
6. Responsive behavior: below `bp-md`, the shell swaps `SideNav` for a bottom bar; below `bp-sm`, `Table` instances convert to card/label-value layouts (feature-specific tables defined in F1–F18 inherit this automatically).

### Inputs
- `theme_preference` (enum: `light`|`dark`|`contrast`, optional, default `light`): persisted per user.
- `session_token` (JWT, required): resolved by F8; determines role-scoped nav.
- `global_search_query` (string, optional): free text searched across incidents, plans, tasks, resources per the user's RBAC scope.
- `viewport_width` (px, runtime): determines breakpoint-driven layout.

### Outputs
- Rendered shell with role-scoped `SideNav`/bottom bar, applied theme, and the invoked page pattern.
- Global search results list (grouped by record type) with loading/empty/error states.
- Theme persisted to user preference store (F8 `users` table).

### Validation
- Every page must have exactly one `h1` (enforced via the `PageHeader` component contract) and ordered headings beneath it (no skipped levels).
- Every interactive element must have a visible 2px `focus-ring` on focus; no element may suppress focus styling.
- No raw hex colors, arbitrary pixel values, or custom components may ship; any screen failing this check is non-conformant and blocked pre-merge.
- Status must render as icon + word + color on every instance (`Badge`, `Alert`, `SyncStatus`); color-alone status indicators fail validation.
- Touch targets must be ≥44px (`size="lg"`) on any field-mobile breakpoint (<`bp-md` when `SyncStatus` indicates field-mobile context, or when F6 routes are active).
- Theme switch must produce no loss of contrast compliance (4.5:1 body text / 7:1 in `contrast`) across any screen.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Session expired on shell load | 401 | SESSION_EXPIRED | "Your session has ended. Sign in again to continue." |
| Global search backend unavailable | 503 | SEARCH_UNAVAILABLE | "Search is temporarily unavailable. Retry." |
| Theme preference save failed | 500 | THEME_SAVE_FAILED | "Couldn't save your theme preference. It will reset next time you sign in. Retry." |
| Role resolution failed (no role mapped) | 403 | ROLE_UNRESOLVED | "Your account isn't assigned a role yet. Contact your administrator." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §Session/Theme for `GET /api/v1/me`, `PATCH /api/v1/me/preferences`. Global search: see `Y1b-api-incident-ops.md` §Search for `GET /api/v1/search`.

### Schema Surface (this feature)
Uses `users.theme_preference`, `users.role_id` — see `Y0a-schema-auth-org.md` §Users. No feature-specific tables; the shell is presentation-layer only and reads reference data owned by F8/F18.
