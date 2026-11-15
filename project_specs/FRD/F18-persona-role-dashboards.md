## F18: Persona & Role-Specific Dashboards

**Description:** Tailored views and default navigation for each of the five consolidated personas (PER-01 through PER-05, see `PERSONAS-EPMP.md`, mapping to the nine named roles in the PRD), ensuring each role sees the information and primary actions relevant to their job without being buried in capabilities meant for other roles. This feature is the RBAC-driven presentation layer that determines what every other feature's screens actually show a given user.

**Terminology:**
- **Default landing view:** The screen a user sees immediately after sign-in, role-dependent.
- **Role-scoped navigation:** The subset of `SideNav` groups/items (or bottom-bar destinations on mobile) visible to a given role, per F8's RBAC model.
- **Executive briefing:** The `display`-scale, decoration-free KPI view used for the executive facet of PER-05.

### Sub-features
- Role-scoped default dashboard/landing view for each persona.
- Role-based navigation and action visibility driven by F8's RBAC model.
- Executive-briefing view using `display`-scale numbers for 1–3 headline KPIs.
- Consistent terminology and status vocabulary across every role's view of the same underlying record.

### Screens

**S18.1 — PER-01 Landing (EOC Director / EMA Coordinator)**
- Default view: Dashboard page pattern (F2 S2.2) scoped to the user's full jurisdiction responsibility. `SideNav`: Prepare (Plans), Monitor (Operating Picture, Readiness), Activate (Incidents), Coordinate (Notifications), Improve (Reports). Primary actions surfaced: "Create incident," "Activate EOC," "Review plan approvals."

**S18.2 — PER-02 Landing (Incident Commander / PIO)**
- Default view: Incident Workspace (F1 S1.3) for the currently active/most-recent incident, or Incident List (F1 S1.1) if none is active. `SideNav`: Activate (Incidents), Coordinate (Tasks, Resources, Notifications), Monitor (Operating Picture). Primary actions: "New task," "Create resource request," "Compose notification."

**S18.3 — PER-03 Landing (Planning & Logistics Section Chief)**
- Default view: a combined "My work" dashboard: open tasks/resource requests assigned to the user's section, plus plans pending review. `SideNav`: Prepare (Plans), Coordinate (Tasks, Resources), Improve (Reports). Primary actions: "Generate SITREP," "Review resource requests," "Review plan."

**S18.4 — PER-04 Landing (Field Responder)**
- Default view: Field Home (F6 S6.1), mobile breakpoint, bottom-bar navigation only (Tasks, Report, Map, Profile — exactly 4 destinations). No desktop `SideNav` variant is offered to this role by default (field responders primarily operate the field-mobile surface), though the role may access desktop views at reduced scope if agency policy permits.

**S18.5 — PER-05 Landing (IT/SecOps Admin & Executive Sponsor)**
- Two sub-facets, same login, switchable via a toggle at the top of the landing view (not two separate accounts):
  - **Admin facet default:** F8 Admin Console shell (S8.1), landing on Platform Monitoring (S8.7).
  - **Executive facet default:** Executive-briefing dashboard: `display`-scale numbers for 1–3 headline KPIs only (e.g., readiness posture, open corrective actions, incident outcomes this period), each showing definition/period/source in `caption`, no other decoration, no charts beyond the headline numbers. "View full reporting" secondary link to F7 S7.5 Analytics Dashboard for drill-down.
- `SideNav` for admin facet: Users, Roles & Permissions, Audit Log, Integration Health, Platform Monitoring. `SideNav` for executive facet: Executive Dashboard, Reports (read-only F7 access).

### Process
1. On sign-in, F8 resolves the user's role (and, for PER-05, which facet(s) they hold) and F18 determines the default landing view and `SideNav`/bottom-bar configuration accordingly.
2. Every `SideNav` group and page-level primary action is filtered through the RBAC permission set from F8 — a user never sees a nav item or action their role doesn't permit, rather than seeing it disabled/grayed out.
3. For PER-05's dual facet, the user explicitly toggles between Admin and Executive views; the system does not guess which facet is intended, and each facet's `SideNav`/landing view is fully distinct.
4. Status vocabulary (incident severity/activation, task status, resource-request status) renders identically across every role's view of the same record — F18 does not introduce role-specific terminology variants; the underlying Badge/status components are shared across F1–F7's screens regardless of which persona's landing view surfaced them.
5. Mobile breakpoint behavior (bottom bar, 4 destinations) applies per-role: the 4 destinations shown differ by role (e.g., PER-04 sees Tasks/Report/Map/Profile; PER-02 on mobile might see Incidents/Tasks/Resources/Profile), always capped at exactly 4 per the design system's SideNav-to-bottom-bar collapse rule.

### Inputs
- `role_id` / `facet` (from F8 session resolution, required): determines landing view and nav configuration.
- `jurisdiction_scope` (from F8 RBAC, required): determines which records populate the landing dashboard.

### Outputs
- Role-scoped default landing view on sign-in.
- Role-scoped `SideNav` groups / bottom-bar destinations (exactly 4 on mobile).
- Executive-briefing KPI view for PER-05's executive facet.

### Validation
- Every role must map to exactly one default landing view and one `SideNav`/bottom-bar configuration — no role may be left with an undefined default (falls back to a generic dashboard with an explicit note to contact an admin, never a blank page).
- Mobile bottom-bar destinations must never exceed 4, regardless of role.
- The executive-briefing view must never show more than 3 headline numbers, and never show a chart or decorative element beyond the `display`-scale numbers and their definition/period/source captions.
- PER-05's facet toggle must be an explicit user action — the system must never auto-select a facet on the user's behalf.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Role with no mapped default view | 200 (fallback) | ROLE_VIEW_UNMAPPED | "Your role doesn't have a default view configured yet. Contact your administrator." |
| Executive KPI data unavailable | 503 | KPI_DATA_UNAVAILABLE | "Headline figures are temporarily unavailable. Retry." |
| Facet toggle attempted without both-facet permission | 403 | FACET_ACCESS_DENIED | "You don't have access to the [facet] view." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §Persona Views for `GET /api/v1/me/landing-config`, `GET /api/v1/me/nav-config`.

### Schema Surface (this feature)
Reads `users.role_id`, `roles` (F8) to resolve landing/nav configuration — see `Y0a-schema-auth-org.md` §Security & Administration. No feature-owned tables beyond a `role_landing_config` reference table — see `Y0a-schema-auth-org.md` §Persona Views.
