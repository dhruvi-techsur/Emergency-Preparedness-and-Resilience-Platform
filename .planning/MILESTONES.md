# Milestones

## v1.0 MVP (Shipped: 2026-11-20)

**Phases completed:** 6 phases, 61 plans (2026-11-16 → 2026-11-20)

**Delivered:** The incident-centric MVP operational foundation — a deployable, SSO/RBAC-secured platform shell with a full incident command workflow, shared operating picture, plans/tasks/resource-request lifecycle, approval-gated notifications and after-action reporting, offline-first mobile field operations, persona-scoped dashboards for all 5 consolidated personas, and governed AI-assisted drafting/signal triage.

**Key accomplishments:**

- **Phase 1 — Platform Foundation & Deployable Shell:** SAML2/OIDC SSO into a role-scoped, themeable app shell (light/dark/contrast); granular RBAC with an append-only audit log; versioned OpenAPI REST surface with OAuth2 bearer auth, event bus + webhook delivery; containerized, non-root, Postgres-backed deployable service (`/healthz`, `pivota-deploy.yaml`).
- **Phase 2 — Incident Command & Operating Picture:** Incident intake/classification/activation with command-role assignment and an append-only Timeline; GIS-backed operating picture with status-coded markers and a mandatory schematic-fallback degraded mode that never fails to render.
- **Phase 3 — Plans, Tasks & Resource Requests:** Versioned plan/SOP repository with Draft→Review→Approved (no self-approval) and one-click plan-section→task materialization; full task and resource-request lifecycles wired into the incident workspace and operating picture.
- **Phase 4 — Notifications & Reporting/Learning:** 4-step approval-gated notification compose flow with geotargeted audience selection and delivery/acknowledgment tracking; ICS/SITREP and AAR generation directly from incident data; evidence/audit log and analytics dashboard.
- **Phase 5 — Mobile Field Operations:** Installable, offline-first mobile web app with photo/location capture, IndexedDB-backed queued submissions, automatic reconnect sync, and named-person conflict resolution.
- **Phase 6 — Persona Dashboards & AI Assistance:** Role-scoped default dashboards for all 5 consolidated personas with RBAC-driven nav/action visibility; governed AI-assisted ICS-form/narrative drafting via `AIDraft`+`Provenance` with mandatory named-person approval enforced at the API; hazard-feed signal triage queue that never auto-promotes to an incident.

**Shipped requirements:** F0, F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F16-SSO, F18, DEPLOY-01 (15 of 15 v1 requirements, 100% coverage)

**Deferred to v2.0:** F12, F13, F14, F15, F16-roster, F17 (external integrations — weather/hazard feeds, CAD/911, EOC COTS interoperability, public alerting, HR/IAM roster sync, asset/facility/document systems)

---
