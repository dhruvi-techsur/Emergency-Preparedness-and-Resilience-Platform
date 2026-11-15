## Epic 18: Persona & Role-Specific Dashboards (F18)

Tailored default views and navigation for each of the five consolidated personas, driven by RBAC.

### US-18.1: Land on a role-relevant dashboard immediately after sign-in
**As a** Maria Alvarez / EOC Director, **I want to** land on a readiness-and-activation dashboard scoped to my jurisdiction the moment I sign in, **so that** I never have to navigate to find my starting point.

**Acceptance Criteria:**
- [ ] On sign-in, F18 resolves role (and facet, for PER-05) and routes to the correct default landing view with the correct `SideNav`/bottom-bar configuration
- [ ] Every role maps to exactly one default landing view and nav configuration — a role with no mapping falls back to a generic dashboard with an explicit "contact your administrator" note, never a blank page (200 fallback ROLE_VIEW_UNMAPPED)
- [ ] Primary actions surfaced on the landing view match the role's top tasks (e.g., Maria sees "Create incident," "Activate EOC," "Review plan approvals")
- [ ] Status vocabulary (severity, task status, resource-request status) renders identically across every role's view of the same underlying record

**Priority:** P0 | **Feature Ref:** F18

---

### US-18.2: Operate a field-mobile landing experience with exactly 4 destinations
**As a** Diego Reyes / Field Responder, **I want to** land on a mobile field-home screen with bottom-bar navigation limited to the 4 actions I actually need, **so that** I'm never navigating a desktop-oriented interface on my phone in the field.

**Acceptance Criteria:**
- [ ] Default landing view is Field Home (F6), mobile breakpoint, bottom-bar only (Tasks, Report, Map, Profile)
- [ ] Mobile bottom-bar destinations never exceed 4, regardless of role
- [ ] No desktop `SideNav` variant is offered to this role by default
- [ ] "Report observation" remains the single primary action in the bottom action bar

**Priority:** P0 | **Feature Ref:** F18

---

### US-18.3: Switch between admin and executive facets without ambiguity
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** explicitly toggle between my Admin Console view and my Executive-briefing view, **so that** the system never guesses which facet I need and I always know which hat I'm wearing.

**Acceptance Criteria:**
- [ ] A facet toggle at the top of the landing view switches between Admin Console (default: Platform Monitoring) and Executive-briefing dashboard — never auto-selected by the system
- [ ] Executive-briefing view shows `display`-scale numbers for 1–3 headline KPIs only, each with definition/period/source in caption, with no charts or decoration
- [ ] A facet toggle attempted without both-facet permission is denied (403 FACET_ACCESS_DENIED)
- [ ] "View full reporting" links from the executive facet to F7's Analytics Dashboard for drill-down
- [ ] Unavailable executive KPI data shows a clear retry message (503 KPI_DATA_UNAVAILABLE) rather than a blank tile

**Priority:** P0 | **Feature Ref:** F18
