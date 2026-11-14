# EPMP — Emergency Preparedness & Management Platform

## What This Is

EPMP is an open, AI-enabled Emergency Preparedness & Management Platform for government agencies (state, county/local, federal continuity offices) and critical-infrastructure operators. It covers the full emergency-management lifecycle — Prepare, Monitor, Activate, Coordinate, Recover, Improve — in one connected operating picture: plans and readiness, incident/ICS activation and command, tasks and resource requests, notifications, field mobile reporting, after-action reporting, and (as a governed layer) interoperability with incumbent systems agencies already run (WebEOC, Veoci, Everbridge, GIS, CAD, HR/IAM, etc.). It serves two commercial postures: a complete emergency-management workspace for agencies without an established platform, and an interoperability/readiness layer for agencies that want to keep their existing investments.

This project builds the MVP incident-centric operational foundation described in the attached TechSur product definition, using the attached EPMP Design System (40 components, token-based, 3 themes: light/dark/contrast) as the only UI build system.

## Core Value

Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.

## Requirements

### Validated

(None yet — ship to validate)

### Active

MVP operational foundation (per TechSur product definition, Section 04 — these are the committed v1 feature areas; exact feature IDs and detailed functional requirements are elaborated in `project_specs/PRD-EPMP.md` and `project_specs/FRD-EPMP.md`):

- [ ] Incident / ICS — incident intake, classification, command role assignments, activity timeline, checklists, ICS forms
- [ ] Common operating picture — live incident dashboards, maps, weather/hazard layers, facility and resource positions
- [ ] Plans & playbooks — plan repository, SOPs, versioning, approvals; link response tasks to plans
- [ ] Tasks & basic resource requests — create/assign/approve/track/close operational tasks and initial resource requests
- [ ] Notifications integration — recipient groups, templates, geotargeting, provider integration, delivery/acknowledgment views
- [ ] Mobile field operations — mobile updates, forms, observations, initial offline caching with later reconciliation
- [ ] Reporting & learning — ICS output, operational summaries, initial after-action reports (AARs), evidence/audit logs
- [ ] Security & administration — SSO, granular role permissions, audit, encryption, operational monitoring
- [ ] Personas/role-specific views for: EOC director/emergency manager, EMA coordinator, incident commander, planning/situation analyst, logistics/resource coordinator, field responder, public affairs/communications, IT/SecOps admin, agency executive

### Out of Scope

- Full advanced logistics (inventory, workforce scheduling, mutual aid, fulfillment tracing) — deferred to post-MVP expansion; MVP includes only *basic* resource requests per source document
- Risk intelligence module (curated hazard feeds, correlation/alerting beyond basic weather/hazard layers) — expansion phase, not MVP
- Exercises & simulation (scenarios, injects, evaluations, training evidence) — expansion phase
- Continuous monitoring (sensor/CCTV/cyber feeds) — expansion phase
- Continuity & recovery module (essential functions, restoration plans, damage/impact assessments) beyond basic AAR — expansion phase
- Advanced AI & analytics (prediction, conversational agents beyond Phase-1 AI use cases) — later AI roadmap phase; MVP includes only signal triage/clustering and AI-assisted ICS form drafting, both human-reviewed via `AIDraft`
- Any auto-issued AI-generated public warnings, evacuation instructions, or binding resource decisions — explicitly forbidden; all AI output must go through human approval (`AIDraft` + `Provenance`)
- FedRAMP authorization claims anywhere in product UI/copy — the product may target FedRAMP-compatible patterns but must never claim authorization it does not have
- Building parallel systems of record for specialized alerting, GIS, CAD, or infrastructure systems — EPMP coordinates/integrates with these rather than replacing them
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

## Constraints

- **Design system**: Must build every screen using ONLY the EPMP Design System's 40 `window.EPMP` components and design tokens (`tokens.json`/`tokens.css`) — no raw hex colors, no arbitrary pixel values, no custom components unless something is genuinely missing from the set. See `project_specs/EPMP-llm-build-guide.md` for the exact build contract/prompt.
- **Accessibility**: WCAG 2.2 AA minimum across all three themes (light/dark/contrast — contrast theme requires 7:1 text contrast), Section 508 compliant, 44px minimum touch targets on field-mobile (`size="lg"` controls), full keyboard operability, one `h1` per page, status always shown as icon + word + color (never color alone).
- **AI governance**: All AI-generated content (drafts, summaries, recommendations) must flow through the `AIDraft` component with `Provenance` sources and require named-person approval before becoming operational. No AI output may be auto-issued as a public warning, evacuation instruction, or binding resource decision.
- **Offline/degraded operation**: Field-mobile and EOC views must tolerate degraded connectivity — local caching, queued writes, reconciliation on reconnect, conflicts surfaced to a human (`SyncStatus` component).
- **No FedRAMP claims**: The product must never represent itself as FedRAMP-authorized in any UI copy or marketing text, even while targeting FedRAMP-compatible patterns.
- **Interoperability-first**: EPMP should integrate with (not replace) specialized GIS, CAD, alerting, and infrastructure systems already in use by target agencies; respect "record authority" per external system family.
- **Evidence boundary**: Source documents are proposed/aspirational in places (vendor comparisons, market sizing, competitive claims) and explicitly flagged as not independently verified — treat competitive/market claims in the source docs as context, not committed requirements.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build to the MVP feature set in TechSur Product Definition Section 04 (Incident/ICS, COP, Plans, Tasks/Resources, Notifications, Mobile, Reporting, Security) | Source document explicitly scopes this as the incident-centric MVP; broader logistics, risk intelligence, exercises, and advanced AI are later phases | — Pending |
| Use the EPMP Design System (40 components, token-based) as the exclusive UI build system | User explicitly requires the provided design system be used; it was purpose-built for this product's personas (operators under stress, field conditions, multi-theme) | — Pending |
| Treat project name as "EPMP" (Emergency Preparedness & Management Platform) per source docs, even though user's working title was "Emergency Preparedness and Resilience Platform" | Source documents consistently use EPMP as the product name/acronym throughout vision, design system and build guide; keeping one consistent name avoids drift across generated spec docs | — Pending |
| Defer advanced logistics, risk intelligence, exercises/simulation, continuous monitoring, and advanced AI/analytics to post-MVP expansion | Explicitly staged as "Expansion & packaging" (source Section 05) and later AI roadmap phases (Section 13), separate from the MVP feature set | — Pending |

---
*Last updated: 2026-11-14 after initialization*
