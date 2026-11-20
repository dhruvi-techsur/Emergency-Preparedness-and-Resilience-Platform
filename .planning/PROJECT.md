# EPMP — Emergency Preparedness & Management Platform

## What This Is

EPMP is an open, AI-enabled Emergency Preparedness & Management Platform for government agencies (state, county/local, federal continuity offices) and critical-infrastructure operators. It covers the full emergency-management lifecycle — Prepare, Monitor, Activate, Coordinate, Recover, Improve — in one connected operating picture: plans and readiness, incident/ICS activation and command, tasks and resource requests, notifications, field mobile reporting, after-action reporting, and (as a governed layer) interoperability with incumbent systems agencies already run (WebEOC, Veoci, Everbridge, GIS, CAD, HR/IAM, etc.). It serves two commercial postures: a complete emergency-management workspace for agencies without an established platform, and an interoperability/readiness layer for agencies that want to keep their existing investments.

This project builds the MVP incident-centric operational foundation described in the attached TechSur product definition, using the attached EPMP Design System (40 components, token-based, 3 themes: light/dark/contrast) as the only UI build system.

## Core Value

Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.

## Requirements

### Validated

Shipped in v1.0 MVP (2026-11-20) — see `.planning/milestones/v1.0-REQUIREMENTS.md` and `.planning/milestones/v1.0-ROADMAP.md` for full detail:

- ✓ F0 — Web & Mobile Application Shell (EPMP Design System, 3 themes, loading/empty/error states) — v1.0
- ✓ F1 — Incident / ICS (intake, classification, command roles, activity timeline, activation levels) — v1.0
- ✓ F2 — Common Operating Picture (status-coded map markers, schematic degraded-mode fallback) — v1.0
- ✓ F3 — Plans & Playbooks (Draft→Review→Approved, plan-section→task materialization) — v1.0
- ✓ F4 — Tasks & Resource Requests (full lifecycle, list/table views) — v1.0
- ✓ F5 — Notifications Integration (4-step compose→send, delivery/ack tracking) — v1.0
- ✓ F6 — Mobile Field Operations (offline-first, queued submissions, conflict resolution) — v1.0
- ✓ F7 — Reporting & Learning (ICS/SITREP, AAR, evidence log, analytics dashboard) — v1.0
- ✓ F8 — Security & Administration (SSO, RBAC, append-only audit log, admin console) — v1.0
- ✓ F9 — AI-Assisted Drafting & Signal Triage (governed via `AIDraft`+`Provenance`, human approval enforced at API) — v1.0
- ✓ F10 — Platform API, Integration Gateway & Event Bus (OpenAPI/REST, OAuth2, webhooks, federation) — v1.0
- ✓ F11 — GIS & Geospatial Integration (read adapter, graceful schematic fallback) — v1.0
- ✓ F16-SSO — HR/IAM SSO/Authentication (SAML2/OIDC) — v1.0 (roster/qualification sync portion, F16-roster, deferred to v2.0)
- ✓ F18 — Persona & Role-Specific Dashboards (5 consolidated personas, RBAC-driven nav) — v1.0
- ✓ DEPLOY-01 — Deployability (Dockerized, non-root, Postgres-backed, `/healthz`) — v1.0

### Active

v2.0 External Integrations — the six integrations deferred from v1.0, each to be built as a deterministic, documented adapter stub (no live vendor credentials) following v1.0 Phase 2's GIS-adapter pattern:

- [ ] F12 — Weather & Hazard Feed Ingestion (NOAA/NWS/USGS read-only hazard overlay layers with provenance)
- [ ] F13 — EOC COTS Interoperability (WebEOC/Veoci/DisasterLAN adapter, record-authority declaration, conflict resolution UI)
- [ ] F14 — Notification Provider & Public-Alerting Integration (Everbridge/AtHoc outbound channels, IPAWS/OASIS CAP formatting)
- [ ] F15 — CAD / 911 Integration (read-only dispatch status display in incident workspace)
- [ ] F16-roster — HR/IAM roster/qualification sync (read sync of personnel roster/role/qualification data into F1/F4)
- [ ] F17 — Asset, Facility & Document System Integration (facility/asset status feed into F2, SharePoint-class document import into F3)

### Out of Scope

- Full advanced logistics (inventory, workforce scheduling, mutual aid, fulfillment tracing) — deferred to post-MVP expansion; MVP includes only *basic* resource requests per source document
- Risk intelligence module (curated hazard feeds, correlation/alerting beyond basic weather/hazard layers) — expansion phase, not MVP
- Exercises & simulation (scenarios, injects, evaluations, training evidence) — expansion phase
- Continuous monitoring (sensor/CCTV/cyber feeds) — expansion phase
- Continuity & recovery module (essential functions, restoration plans, damage/impact assessments) beyond basic AAR — expansion phase
- Advanced AI & analytics beyond v1.0's Phase 6 scope (prediction, conversational agents, autonomous agent workflows) — later AI roadmap phase; v1.0 shipped only signal triage/clustering and AI-assisted ICS form drafting, both human-reviewed via `AIDraft`
- Any auto-issued AI-generated public warnings, evacuation instructions, or binding resource decisions — explicitly forbidden; all AI output must go through human approval (`AIDraft` + `Provenance`)
- FedRAMP authorization claims anywhere in product UI/copy — the product may target FedRAMP-compatible patterns but must never claim authorization it does not have
- Building parallel systems of record for specialized alerting, GIS, CAD, or infrastructure systems — EPMP coordinates/integrates with these rather than replacing them (applies equally to v2.0's F13/F14/F15/F17 adapters: each is an approved, declared-scope read/write feed, not a full bidirectional sync)
- Native iOS/Android app-store builds — F6 ships as a responsive, installable web app; native app is a separate, later decision
- Full partner-portal UX / cross-agency collaboration workspace — the federation policy engine (F10 NFR) is in scope; a dedicated partner-portal experience is not
- Real vendor API credentials or live third-party accounts for any v2.0 integration — every v2.0 adapter is a deterministic, documented stub (same pattern as v1.0's GIS adapter), simulating success/timeout/degraded paths without a real NOAA/WebEOC/Everbridge/CAD/HR-IAM/document-system account
- Dollar-figure market sizing / procurement decisions — out of scope for product build; business/commercial questions, not engineering

## Context

**Source documents** (read as source material; full spec suite still generated separately in `project_specs/`):
- `project_specs/ref_docs/TechSur_EPMP_Product_Definition.pdf.md` — product vision, personas, business context, MVP feature set, external interfaces, architecture direction, AI roadmap, market segments (derived from a 12-page TechSur Executive Summary, Nov 2026). Explicitly a proposed design, not a completed product; several competitive and market claims are vendor-reported/unverified and require validation.
- `project_specs/EPMP-llm-build-guide.md` — the paste-ready LLM build contract: use only `window.EPMP` components and design tokens, one brand teal + one gold accent, status always icon+word+color, AI output only through `AIDraft`+`Provenance`, loading/empty/error states everywhere, WCAG 2.2 AA + Section 508, mobile-first with 44px touch targets, no FedRAMP claims.
- `project_specs/EPMP-Design-System.pdf.md` — full design system: 40 components, color/type/spacing/motion tokens across light/dark/contrast themes, page patterns (app shell, dashboard, incident workspace, lists/tables), data visualization and map component rules, accessibility and content-voice guidance.

**Domain:** Government/public-sector emergency management software. Buyers are typically emergency management directors, public safety/homeland security leadership, agency CIOs, and program/budget owners; daily users are EOC staff, planners, incident commanders, field responders, resource coordinators, and communications personnel. Long procurement cycles, high security/ATO expectations (especially federal), and incumbent systems (WebEOC, Veoci, Everbridge, Esri) are common in every target segment.

**Four non-negotiable integration behaviors** from the product definition: record authority (define which system owns each record type), trusted provenance (preserve source/version/timestamp/confidence; never silently promote unverified feeds to operational fact), controlled federation (policy-enforced, revocable cross-jurisdiction access), and graceful failure (queue/retry/reconcile, operate in degraded/offline mode).

**Standards to support at the interface layer:** OpenAPI/REST/JSON, OAuth2/OIDC/SAML2, webhooks/event bus with idempotent retries, OASIS CAP (alerts), OASIS EDXL (resource messaging), NIEM data models, OGC/GeoJSON/Esri REST (geospatial), optionally STIX/TAXII and FHIR where relevant.

**Suggested logical architecture** (source-proposed, to validate during TechArch generation): Experience layer (web/EOC dashboard, field mobile, executive briefings, partner portal) → Application layer (plans/readiness, incidents/ICS, tasks/resources, recovery/AAR) → Intelligence layer (analytics, knowledge retrieval, AI services, human approval/audit) → Data layer (PostgreSQL/PostGIS, documents, search, event/audit history) → Exchange layer (published REST APIs, event bus, open adapters, federation/policy) → External systems (EOC COTS, GIS, alerts, HR/assets, CAD, weather/sensors). Open-source-first stack hypotheses: React/Vue UI, Kubernetes/containers, PostgreSQL+PostGIS, Keycloak/OPA for IAM/authorization, Kafka/NATS for messaging, SQLite for offline field caching.

**Shipped codebase state (as of v1.0, 2026-11-20):** `backend/src/modules/` contains `auth-org`, `incident-ops`, `integration-gateway` (GIS adapter + event bus), `comms-reporting`, `ai-assist`, and `platform` (admin/API registry). `frontend/app` is a Vite SPA with OIDC auth, the full `@epmp/design-system` package (40 components across tokens/forms/data-viz/maps/AI/sync), persona-scoped dashboards, and a field-mobile route tree with an IndexedDB-backed offline queue + service worker. Postgres schema via `node-pg-migrate`, migrations `1700000000000`–`1700000000011` (auth-org, incident-ops, plans/tasks/resource-requests, notifications/reporting, field-operations, ai-assist/signals). Keycloak realm + OPA policy drive SSO/RBAC; NATS JetStream drives the event bus/webhook delivery. Deployed via root Dockerfile (non-root numeric USER) + `pivota-deploy.yaml` (port 8080, `/healthz`, Postgres). No real external-vendor credentials exist anywhere in the stack — the only external integration built so far (GIS, F11) is a deterministic adapter stub with a mandatory schematic-fallback path; this is the established pattern v2.0's six integrations will follow.

## Constraints

- **Design system**: Must build every screen using ONLY the EPMP Design System's 40 `window.EPMP` components and design tokens (`tokens.json`/`tokens.css`) — no raw hex colors, no arbitrary pixel values, no custom components unless something is genuinely missing from the set. See `project_specs/EPMP-llm-build-guide.md` for the exact build contract/prompt.
- **Accessibility**: WCAG 2.2 AA minimum across all three themes (light/dark/contrast — contrast theme requires 7:1 text contrast), Section 508 compliant, 44px minimum touch targets on field-mobile (`size="lg"` controls), full keyboard operability, one `h1` per page, status always shown as icon + word + color (never color alone).
- **AI governance**: All AI-generated content (drafts, summaries, recommendations) must flow through the `AIDraft` component with `Provenance` sources and require named-person approval before becoming operational. No AI output may be auto-issued as a public warning, evacuation instruction, or binding resource decision.
- **Offline/degraded operation**: Field-mobile and EOC views must tolerate degraded connectivity — local caching, queued writes, reconciliation on reconnect, conflicts surfaced to a human (`SyncStatus` component).
- **No FedRAMP claims**: The product must never represent itself as FedRAMP-authorized in any UI copy or marketing text, even while targeting FedRAMP-compatible patterns.
- **Interoperability-first**: EPMP should integrate with (not replace) specialized GIS, CAD, alerting, and infrastructure systems already in use by target agencies; respect "record authority" per external system family.
- **Evidence boundary**: Source documents are proposed/aspirational in places (vendor comparisons, market sizing, competitive claims) and explicitly flagged as not independently verified — treat competitive/market claims in the source docs as context, not committed requirements.

## Current Milestone: v2.0 External Integrations

**Goal:** Close out the six deferred external integrations (F12–F17) using the same deterministic, documented adapter-stub pattern established by Phase 2's GIS integration — no live vendor credentials, simulated success/timeout/degraded paths, mandatory graceful fallback, provenance enforced at every boundary.

**Target features:**
- F12 — Weather & Hazard Feed Ingestion (NOAA/NWS/USGS)
- F15 — CAD / 911 Integration (read-only dispatch status)
- F13 — EOC COTS Interoperability (WebEOC/Veoci/DisasterLAN)
- F17 — Asset, Facility & Document System Integration
- F14 — Notification Provider & Public-Alerting Integration (Everbridge/AtHoc/IPAWS)
- F16-roster — HR/IAM roster/qualification sync (completes F16 alongside v1's F16-SSO)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build to the MVP feature set in TechSur Product Definition Section 04 (Incident/ICS, COP, Plans, Tasks/Resources, Notifications, Mobile, Reporting, Security) | Source document explicitly scopes this as the incident-centric MVP; broader logistics, risk intelligence, exercises, and advanced AI are later phases | ✓ Good — shipped as 6 phases, 100% v1.0 coverage |
| Use the EPMP Design System (40 components, token-based) as the exclusive UI build system | User explicitly requires the provided design system be used; it was purpose-built for this product's personas (operators under stress, field conditions, multi-theme) | ✓ Good — all 40 components built, zero raw-hex/custom-component deviations reported across 61 plans |
| Treat project name as "EPMP" (Emergency Preparedness & Management Platform) per source docs, even though user's working title was "Emergency Preparedness and Resilience Platform" | Source documents consistently use EPMP as the product name/acronym throughout vision, design system and build guide; keeping one consistent name avoids drift across generated spec docs | ✓ Good — consistent throughout all spec docs and code |
| Defer advanced logistics, risk intelligence, exercises/simulation, continuous monitoring, and advanced AI/analytics to post-MVP expansion | Explicitly staged as "Expansion & packaging" (source Section 05) and later AI roadmap phases (Section 13), separate from the MVP feature set | ✓ Good — held firm through v1.0; still out of scope for v2.0 |
| Defer F12/F13/F14/F15/F16-roster/F17 (external integrations) to v2.0, scoping v1.0 to the standalone-workspace MVP | 2026-11-16 user decision: ship the incident-centric core first; integrations are commercially important but not required to demonstrate the MVP | ✓ Good — v1.0 shipped clean without them; now starting v2.0 to close this gap |
| v2.0's six integrations (F12–F17) each build as a deterministic, documented adapter stub — no live vendor credentials — following v1.0 Phase 2's GIS-adapter precedent (simulated success/timeout paths, mandatory graceful fallback, provenance enforced) | 2026-11-20 user decision: consistency with the only integration pattern already proven in this codebase; no real vendor access exists in this environment for NOAA/WebEOC/Everbridge/CAD/HR-IAM/document systems | — Pending |
| v2.0 phases grouped by domain pairing — (1) F12 weather feeds + F15 CAD/911 [read-only Operating-Picture/incident-workspace overlays], (2) F13 EOC COTS interop + F17 asset/facility/document [record-authority/sync-pattern integrations], (3) F14 public alerting + F16-roster [notification-domain/IAM-adjacent] — rather than one phase per feature or ingest-vs-outbound split | 2026-11-20 user decision: balances isolation (3 phases, not 1) against roadmap overhead (not 6 single-feature phases); each pairing shares a structural integration pattern | — Pending |
| v2.0 phase sequencing left to the roadmapper's technical-dependency judgment, no fixed business-priority order | 2026-11-20 user decision: no demo/sales-driven ordering constraint for this milestone | — Pending |
| Skipped fresh domain research before writing v2.0 REQUIREMENTS.md | 2026-11-20 user decision: F12–F17 are already scoped in the existing PRD-EPMP.md/FRD-EPMP.md spec suite; re-deriving from research would duplicate work | — Pending |

---
*Last updated: 2026-11-20 after completing v1.0 milestone and starting v2.0 External Integrations*
