# PRD — EPMP (Emergency Preparedness & Management Platform)

**Document type:** Product Requirements Document
**Project acronym:** EPMP
**Status:** Draft v1 — MVP operational foundation
**Last updated:** 2026-11-14

**Source material:** `project_specs/ref_docs/TechSur_EPMP_Product_Definition.pdf.md` (product vision, personas, business context, MVP feature set, external interfaces, architecture direction), `project_specs/ref_docs/EPMP-llm-build-guide.md` (UI build contract), `project_specs/ref_docs/EPMP-Design-System.pdf.md` (40-component design system, tokens, patterns), `.planning/PROJECT.md` (scope decisions). Downstream documents (`FRD-EPMP.md`, `TechArch-EPMP.md`, `UserStories-EPMP.md`) elaborate the requirements, architecture, and stories introduced here.

**Evidence boundary:** The source product definition is an explicitly proposed design derived from a 12-page executive summary, not a completed or shipped product. Competitive comparisons, market sizing, and some KPI framing in the source are vendor-reported or unverified and are treated here as directional context, not committed requirements. This PRD commits only to the MVP feature set defined in `.planning/PROJECT.md`.

---

## 1. Executive Summary

EPMP is an open, AI-enabled Emergency Preparedness & Management Platform that gives government agencies and critical-infrastructure operators one connected operating picture spanning readiness, live incident coordination, and after-action learning. This MVP builds the incident-centric operational foundation — Incident/ICS activation, a common operating picture, plans and playbooks, tasks and resource requests, notifications, mobile field reporting, reporting/learning, and security/administration — as a web and mobile application built exclusively from the EPMP Design System, with governed interoperability to the EOC, GIS, alerting, and identity systems agencies already run.

EPMP serves two commercial postures with the same MVP: a complete emergency-management workspace for agencies without an established platform, and an interoperability/readiness layer for agencies retaining incumbent systems such as WebEOC, Veoci, or Everbridge.

## 2. Problem Statement

Emergency management organizations coordinate response across fragmented applications, agencies, command structures, facilities, and jurisdictions, and today's tooling landscape leaves each of these coordination points manual, slow, or impossible to evidence after the fact.

- **Scattered plans and readiness records** make it difficult for an agency to substantiate its own preparedness — plans, SOPs, and approvals live in disconnected documents and drives with no versioning discipline or linkage to the response tasks that will actually execute them.
- **Disconnected event and hazard feeds** slow incident validation: there is no shared, time-stamped operating picture combining live incidents, maps, weather/hazard layers, and facility/resource positions, so situational awareness is incomplete when it matters most.
- **Manual tasking and resource coordination** means requests, assignments, and assets are tracked in spreadsheets, phone calls, and radio traffic, making it easy for a task or resource request to be lost, duplicated, or left unacknowledged.
- **Multiple, disconnected communication channels** create delays and uncertainty about whether a notification was delivered or acknowledged, undermining accountability during time-critical alerting.
- **Distributed jurisdictions** lack a shared, authorized picture — partner agencies either see too little (no shared awareness) or too much (no access control), because there is no controlled, federated way to exchange incident data across organizational boundaries.
- **Reports assembled after the fact** mean lessons from an incident or exercise rarely make it back into updated plans, corrective actions, or training — the preparedness loop never closes.

Agencies need a system that treats preparedness, live coordination, and after-action learning as one continuous, evidenced lifecycle rather than three disconnected sets of tools and spreadsheets — without forcing them to abandon the specialized GIS, alerting, CAD, and EOC systems they already depend on.

## 3. Product Vision

**Vision statement:** Deliver an open, enterprise-grade emergency management platform that empowers government agencies and partners to anticipate, manage, and recover from crises collaboratively — integrating plans, people, geography, and resources into one trustworthy operating picture, and turning authorized data into actionable, human-approved insight.

**Mission:** Enable agencies to be Prepared, Aware, and Resilient — across one connected lifecycle: Prepare → Monitor → Activate → Coordinate → Recover → Improve.

**Strategic goals for this MVP:**

- Give an agency a single, shared, trustworthy operating picture spanning readiness, live incident coordination, and after-action learning — without requiring replacement of specialized GIS, CAD, or alerting systems already in place.
- Make incident activation, role assignment, tasking, and resource requests faster and more accountable than manual/phone/spreadsheet coordination, with every action captured in an auditable timeline.
- Make communications accountable: every notification has a defined audience, a tracked delivery status, and a tracked acknowledgment.
- Close the preparedness loop: every incident or exercise produces an after-action report and evidence trail that can inform updated plans.
- Build interoperability-first from day one: record authority, trusted provenance, controlled federation, and graceful degraded-mode failure are structural properties of the platform, not later add-ons.
- Introduce AI strictly as a governed assistance layer — signal triage and AI-assisted ICS form drafting in this MVP — with every AI output routed through human review (`AIDraft` + `Provenance`) and never auto-issued as a public warning, evacuation instruction, or binding resource decision.
- Build every screen exclusively from the EPMP Design System (40 components, token-based, light/dark/contrast themes) so the product is calm, legible, and accessible under operational stress from day one.

**Target users and personas** (role-specific views are an explicit MVP feature — see F18):

| Persona | Critical job | Primary MVP view |
|---|---|---|
| State EOC director / emergency manager | Direct multi-jurisdiction preparedness and incident coordination | Readiness portfolio, priorities, active operations dashboard |
| County/city EMA coordinator | Monitor local conditions, activate teams, manage day-to-day readiness | Plans, quick activation, notifications, maps |
| Incident commander / public safety leader | Set incident objectives and command field response | ICS roles, tasks, resources, operating picture |
| Planning / situation analyst | Maintain plans, consolidate field data, produce reports | Plan authoring, SITREPs, ICS forms, AAR |
| Logistics / resource coordinator | Validate, request, assign, and track personnel/equipment | Resource requests, availability views |
| Field responder | Receive tasks, submit geolocated observations | Mobile and offline reports, status updates |
| Public affairs / communications | Draft and distribute approved alerts, check acknowledgments | Message templates, approval and distribution |
| IT / SecOps administrator | Protect data, configure access, integrate systems, monitor availability | IAM, integration health, audit, operations |
| Agency executive / funder | Oversee readiness, costs, risks, and mission impact | Executive dashboard and performance evidence |

These nine roles are the business-level vision taxonomy from the source product definition. For design, journey-mapping, and user-story purposes, `PERSONAS-EPMP.md` consolidates them into five working personas (PER-01 through PER-05) grouped by shared workflow pattern, device context, and ICS organizational position — see that document's Consolidation Note for the full role-to-persona mapping. Every downstream document (`JTBD-EPMP.md`, `JOURNEYS-EPMP.md`, `UserStories-EPMP.md`, `STORY-MAP-EPMP.md`) uses the five-persona model exclusively; no role above is dropped, each is folded into exactly one of the five.

Economic buyers are typically emergency management directors, public safety/homeland security leadership, agency CIOs, and program/budget owners; daily users are EOC staff, planners, incident leaders, field responders, resource coordinators, and communications personnel. Procurement ownership requires agency-specific validation and is out of scope for this PRD.

## 4. Technical Architecture

The MVP follows the source-proposed logical architecture, validated in detail during TechArch generation. Layers run bottom-up from data to experience, with cross-cutting identity, privacy, security, observability, resilience, and data-governance concerns applying to every layer.

| Layer | MVP responsibility | Representative technology direction |
|---|---|---|
| Experience | Web EOC dashboard, incident workspace, executive views, field mobile (installable web app) | React/Vue UI built exclusively from `window.EPMP` design-system components; responsive, offline-capable |
| Application | Plans/readiness, incidents/ICS, tasks/resources, reporting/AAR domain services | Modular domain services behind versioned REST APIs |
| Intelligence | Signal triage/clustering, AI-assisted ICS form drafting, human approval/audit | Model-neutral AI gateway; retrieval scoped to approved sources; `AIDraft` + `Provenance` enforced at the API boundary |
| Data | Operational records, geospatial data, documents, search, event/audit history | PostgreSQL + PostGIS; document store; search index; append-only audit/event log |
| Exchange | Published REST APIs, event bus, open adapters, federation/policy | OpenAPI/REST/JSON; OAuth2/OIDC/SAML2; webhooks with idempotent retry; policy engine (e.g., OPA) for federation |
| External | EOC COTS, GIS, weather/hazard feeds, notification providers, IPAWS/CAP, CAD, HR/IAM, asset/facility, SharePoint | Approved adapters and read feeds per system family; record authority defined per integration |

**Offline/degraded-mode data path:** Field-mobile and EOC clients maintain a local cache (e.g., SQLite on mobile), queue writes while disconnected, and reconcile on reconnect; conflicts always surface to a named person via `SyncStatus` rather than silently resolving.

**Stack hypotheses to validate in TechArch:** Kubernetes/containers for service deployment; Keycloak or enterprise IdP federation for IAM; Kafka or NATS for the event bus; PostgreSQL/PostGIS for operational and geospatial data; API gateway with OpenAPI contracts, SDKs, and adapters for integrations.

## 5. Feature Requirements

Features are grouped into Platform Core, Operational Modules, AI Assistance, External Integrations, and Experience/Role Views. Every capability surface implied by the requirements — user-facing UI, programmatic API, background/async processing, data, and third-party integrations — is represented by its own feature below; nothing is assumed or silently folded into another feature.

### Platform Core

#### F0: Web & Mobile Application Shell (EPMP Design System UI)
**Description:** The user-facing web and mobile application shell that every persona uses to operate EPMP — the single required UI surface for the entire platform, built exclusively from the EPMP Design System's 40 components and design tokens across light, dark, and contrast themes. This is the thing a human actually sees and operates; it is a first-class feature in its own right, not an assumed byproduct of the backend APIs.

**Capabilities:**
- App shell with `SideNav` (lifecycle-ordered: Prepare, Monitor, Activate, Coordinate, Recover, Improve), header strip with global search, `SyncStatus`, alerts, and user `Avatar`; collapses to a bottom bar of 4 destinations on mobile breakpoints.
- Page patterns implemented per the design system: dashboard (EOC/executive), incident workspace, lists/tables, forms, field-mobile, operating-picture (map), analytics/reporting, notifications/alerts, interoperability/integration-health.
- Consistent loading (`Skeleton`), empty (`EmptyState`), and error (`Alert` with retry) states on every list, table, and panel.
- Full theme support: light (default), dark (low-light operations centers), and contrast (Section 508 high-contrast, 7:1 text).
- Installable, mobile-first web application for field use (see F6) built from the same component set — no native iOS/Android app in this MVP (see Out of Scope).

**Priority:** P0 (Critical — MVP requirement; no other feature is usable without this surface)

#### F8: Security & Administration
**Description:** The identity, access, audit, and operational-monitoring foundation required for secure multi-role use from day one, as named explicitly in the MVP operational foundation.

**Capabilities:**
- Single sign-on (SSO) via SAML2/OIDC against an agency's identity provider.
- Granular, role- and incident-scoped permissions (RBAC) covering every persona in Section 3.
- Full audit logging of security-relevant actions (login, permission change, record access, AI-draft approval) retained as an append-only evidence trail.
- Encryption at rest and in transit for all operational data.
- Operational/availability monitoring and alerting for platform health.
- Admin console (built from the same design system) for user, role, and integration management — an explicit UI surface, not an API-only capability.

**Priority:** P0 (Critical — MVP requirement)

#### F10: Platform API, Integration Gateway & Event Bus
**Description:** The programmatic contract and background-processing backbone that lets EPMP publish its own data, accept approved external data, and process work asynchronously (notification delivery, sync reconciliation, feed ingestion) without blocking interactive use. This is the system's public/partner-facing API surface, distinct from the UI in F0.

**Capabilities:**
- Versioned OpenAPI/REST/JSON contracts for incident, resource, readiness, reporting, and administration functions.
- OAuth2/OIDC/SAML2-based delegated authorization for API and federation access.
- Webhook/event-bus publication of incident and status changes with durable delivery, idempotent consumers, and retry policies.
- Background job processing for notification fan-out, feed ingestion, offline-sync reconciliation, and report generation.
- Record-authority registry: a documented definition of which system (EPMP or an external system) creates, updates, and reconciles each record type.
- Provenance enforcement at the API boundary: every ingested or AI-derived fact carries source, timestamp, version, and confidence; unverified feeds are never silently promoted to operational fact.
- Policy-enforced, revocable cross-jurisdiction data federation.

**Priority:** P0 (Critical — MVP requirement; underlies every integration and async capability below)

### Operational Modules (MVP feature set per TechSur product definition, Section 04)

#### F1: Incident / ICS
**Description:** Incident intake, classification, command-role assignment, activity timeline, checklists, and ICS forms — the core activation and command workflow of the platform.

**Capabilities:**
- Incident intake and classification (type, severity, jurisdiction) with a severity `Badge` (Critical/Elevated/Watch/Normal).
- Command role assignment (Incident Commander and supporting ICS roles) with named-person accountability.
- Append-only activity `Timeline` capturing every status change, decision, and communication with actor and source.
- ICS checklists and structured ICS forms, including AI-assisted drafting from reviewed notes (see F9), always human-approved before becoming official.
- Activation-level change requires a `Modal` confirmation stating the operational consequence.
- Incident workspace page pattern: `PageHeader` with incident name and severity, Tabs for Timeline/Tasks/Resources/Reports, pinned command-roles and map-thumbnail panel.

**Priority:** P0 (Critical — MVP requirement; the MVP demonstration scenario starts here)

#### F2: Common Operating Picture
**Description:** Live incident dashboards, maps, weather/hazard layers, and facility/resource positions, giving every role a shared, time-stamped view of the current situation.

**Capabilities:**
- Operating-picture map view (`MapCanvas` + `MapControls`, `LayerPanel`, `MapLegend`, `MapPopup`) showing incidents, facilities, and resource positions with status-coded markers (shape + tone).
- Live EOC and executive dashboards (`Stat` tiles, `Card`-based layout) summarizing active incidents, task status, and resource-request status.
- Weather/hazard overlay layers sourced from approved external feeds (see F12), each layer showing its source and data age via `LayerPanel`; unverified feeds are off by default and visibly flagged.
- Status bar on every map/dashboard view showing data age and base-layer source (e.g., "As of 08:42 ET · Base layer: agency GIS").
- Degraded/offline mode: a schematic base map renders when GIS tiles are unavailable, clearly labeled "Schematic base map, offline."

**Priority:** P0 (Critical — MVP requirement)

#### F3: Plans & Playbooks
**Description:** A plan repository with SOPs, versioning, and approvals, with the ability to link response tasks directly to the plans that call for them — closing the gap between written readiness and executed response.

**Capabilities:**
- Plan/SOP repository with version history and an approval workflow (draft → review → approved).
- Linkage from a plan or SOP section to the operational tasks it generates during an incident (see F4).
- Document import/sync from existing SharePoint/document systems where agencies already store EOPs/SOPs/annexes (see F17).
- Reading view respects `reading-max` (720px) line length for plan/SOP text per the design system's content rules.

**Priority:** P0 (Critical — MVP requirement)

#### F4: Tasks & Resource Requests
**Description:** Create, assign, approve, track, and close operational tasks and initial resource requests — the MVP's manual-coordination replacement. Advanced logistics (inventory, workforce scheduling, mutual aid, fulfillment tracing) is explicitly deferred (see Out of Scope).

**Capabilities:**
- Task lifecycle: create, assign (to a person or role), approve, track status, close — each with an owner and due period.
- Basic resource request lifecycle: create, approve, assign, track, and close a request for personnel or equipment, linked to the originating incident or task.
- List/table views (`Table` inside `Card`) with search, filter, and bulk actions; loading/empty/error states on every list.
- Resource-request status visible on the common operating picture (F2) and in reporting (F7).

**Priority:** P0 (Critical — MVP requirement)

#### F5: Notifications Integration
**Description:** Recipient groups, message templates, geotargeting, provider integration, and delivery/acknowledgment tracking — making communications accountable rather than best-effort.

**Capabilities:**
- Recipient-group management (by role, jurisdiction, or geography) and reusable message templates.
- Geotargeted audience selection using the common operating picture's map components.
- Compose flow following the design system's required order: audience → message (with `AIDraft`-assisted drafting, never auto-sent) → review (read-only preview, channels, approver) → approve and send.
- Delivery and acknowledgment tracking view: a `Table` of recipients with status `Badge`s and acknowledgment `Progress`.
- Named-person approval is required before any external send; AI can draft a message but never dispatch it.
- Integration with external notification providers and public-alerting standards is delivered by F14; this feature owns the internal notification domain model and UI.

**Priority:** P0 (Critical — MVP requirement)

#### F6: Mobile Field Operations
**Description:** Mobile updates, structured forms, and geolocated observations for field responders, with offline caching and later reconciliation so field-to-EOC reporting stays reliable regardless of connectivity.

**Capabilities:**
- Mobile-optimized, installable web application (same design system, `size="lg"` 44px touch targets, single-column `body-lg` layout, bottom action bar with one primary action).
- Structured field forms and free-text observations, including one-tap photo and location capture with visible confirmation.
- Offline-first operation: every edit remains possible while offline; queued submissions show "Queued" via `SyncStatus`, pinned at the top of every mobile screen.
- Reconciliation on reconnect: queued field data syncs to the EOC, appends a `Timeline` entry noting the sync, and surfaces any conflicts to a named person rather than silently overwriting.
- No hover-only interactions or gesture-only affordances; every action has a visible button equivalent.

**Priority:** P0 (Critical — MVP requirement)

#### F7: Reporting & Learning
**Description:** ICS output, operational summaries, initial after-action reports (AARs), and evidence/audit logs — closing the preparedness loop by turning incident activity into traceable, reusable learning. Full continuity/recovery measurement and exercise-evidence tracking are deferred (see Out of Scope).

**Capabilities:**
- Generate ICS-standard output documents and operational summaries/SITREPs from incident data, with `AIDraft`-assisted drafting (human-approved) available for narrative sections.
- Initial after-action report (AAR) generation: timeline export, decisions log, resource-request history, and a structured findings/corrective-action list.
- Evidence and audit log views: append-only, exportable, time-stamped records suitable for demonstrating preparedness and accountability.
- Analytics/reporting page pattern: `Stat` row plus `Card`-based charts (trend, comparison, part-to-whole) each with a title, subtitle (unit/period/source), and a hidden data-table alternative.

**Priority:** P0 (Critical — MVP requirement)

### AI Assistance (Phase 1 only — governed, human-reviewed)

#### F9: AI-Assisted Drafting & Signal Triage
**Description:** The Phase-1 AI use cases named in the source roadmap: signal triage/clustering on approved risk feeds, and AI-assisted drafting of structured incident information and ICS forms from reviewed notes. Every output is a draft, never an auto-issued fact or action. Phase 2/3 AI capabilities (conversational assistant, predictive hazard/impact models, resource-matching recommendations, autonomous agent workflows) are explicitly out of scope for this MVP (see Out of Scope).

**Capabilities:**
- Signal triage and clustering across approved weather/hazard feeds (F12) to surface candidate events for human validation — never auto-promoted to an active incident.
- AI-assisted drafting of ICS form fields and incident narrative text from reviewed notes, delivered exclusively through the `AIDraft` component with `Provenance` source chips.
- Named-person approval required before any AI-drafted content becomes part of an official record; approval is recorded in the incident `Timeline` with reviewer and time.
- Low-confidence or missing-source drafts say so in the draft body rather than being hidden or silently upgraded.
- Absolute prohibition, enforced in the UI and API: no AI-generated content may be automatically issued as a public warning, evacuation instruction, or binding resource deployment decision.

**Priority:** P1 (High — MVP-committed AI scope per source roadmap Phase 1, but not required for the core incident-activation demonstration path)

### External Integrations (approved adapters / read feeds at MVP-appropriate depth — not full bidirectional sync of every system)

#### F11: GIS & Geospatial Integration
**Description:** Read integration with the agency's own GIS so the common operating picture renders real base maps, boundaries, and facility layers styled to the EPMP map tokens, rather than EPMP building a parallel GIS system of record.

**Capabilities:**
- Read integration with Esri, OSM-derived, or agency GIS base layers and feature services (OGC services/GeoJSON/Esri REST).
- EPMP-authored data (incidents, resources, hazard overlays) published as authorized layers/services back to the agency's GIS where permitted, never replacing the agency's own GIS as system of record.
- Base-map styling to the `map-*` design tokens so EPMP data is the most prominent layer.
- Graceful failure: if the GIS feed is unavailable, the operating picture falls back to the schematic offline base map (F2) rather than failing the page.

**Priority:** P0 (Critical — MVP requirement; the common operating picture depends on this)

#### F12: Weather & Hazard Feed Ingestion
**Description:** Read-only ingestion of NOAA/NWS/USGS and similar hazard data feeds as common-operating-picture overlay layers, with full provenance preserved. The curated, correlated risk-intelligence module (alerting/correlation beyond basic layers) is explicitly deferred (see Out of Scope).

**Capabilities:**
- Scoped, read-only ingestion of forecasts, warnings, events, and hazard locations with confidence metadata from approved sources (NOAA/NWS/USGS).
- Every ingested hazard fact carries source, timestamp, and confidence via `Provenance`; unverified feeds remain visibly unverified until a person validates them.
- Feeds surface as toggleable layers in `LayerPanel` on the operating picture (F2), off by default when unverified.
- Feed ingestion runs as a background job (F10) with retry/backoff on feed outage.

**Priority:** P1 (High — enriches the operating picture; MVP can demonstrate core incident workflow without every hazard feed live on day one)

#### F13: EOC COTS Interoperability
**Description:** Governed interoperability with incumbent EOC platforms (WebEOC, Veoci, DisasterLAN) so agencies that retain these systems can use EPMP as a coordination/readiness layer rather than a forced replacement, per the product's dual commercial posture.

**Capabilities:**
- Approved adapter integration exchanging incidents, boards, resource requests, status, and activity logs with incumbent EOC COTS systems, at MVP depth (defined record set, not every board/widget type).
- Explicit record-authority declaration per integrated system (which system is authoritative for which record type), visible in an integration-health `Table`.
- Conflict surfacing when the same record differs between EPMP and the external system: both values shown side by side with "Keep EPMP value" / "Keep [external] value" actions — never a silent overwrite.
- Integration-health view: system, last sync, direction, record authority, and `SyncStatus`, built from the design system's interoperability page pattern.

**Priority:** P1 (High — core to the interoperability commercial posture, not required for the standalone-workspace demonstration path)

#### F14: Notification Provider & Public-Alerting Integration
**Description:** Outbound integration with external notification providers (Everbridge, AtHoc, and similar channels) and the FEMA IPAWS/OASIS CAP ecosystem for approval-controlled public warning distribution, extending the internal notification domain (F5) to real delivery channels.

**Capabilities:**
- Provider-integration adapter(s) for sending approved messages through Everbridge/AtHoc-class channels, with delivery-status and acknowledgment callbacks fed back into F5's delivery view.
- OASIS CAP-formatted alert representation for any message routed through IPAWS or CAP-compatible public-warning channels, subject to the agency's own authority and access rights.
- Every external send remains approval-controlled by a named person; `AIDraft` may fill message content but the send action itself is always a deliberate human action (never automatic, never AI-triggered).
- Graceful failure: provider outages queue messages for retry and surface delivery failures in the UI rather than silently dropping them.

**Priority:** P1 (High — required to fulfill the Notifications Integration module end-to-end, but MVP can ship with a single approved provider integration rather than every named vendor)

#### F15: CAD / 911 Integration
**Description:** Read integration with CAD/911 and public-safety dispatch systems to bring approved incident and dispatch status into EPMP's incident record, without EPMP becoming a dispatch system of record.

**Capabilities:**
- Vendor-authorized, read-oriented event/API integration surfacing dispatch status against an EPMP incident.
- Record authority for dispatch data remains with the CAD/911 system; EPMP references and displays it with provenance, never edits it.
- Integration-health visibility consistent with F13's pattern (last sync, direction, authority, `SyncStatus`).

**Priority:** P2 (Medium — valuable for public-safety-led incidents; not required for the core MVP demonstration path and depends heavily on agency-specific vendor access)

#### F16: HR / IAM & Identity Integration
**Description:** Identity, organization, role, qualification, and contact-record integration with an agency's HR/IAM systems — the external-identity half of Security & Administration (F8), recognizing that HR is often the authoritative source for personnel data.

**Capabilities:**
- SSO/SAML2/OIDC integration with the agency's identity provider for authentication (shared with F8).
- Read sync of personnel roster, role, qualification, and contact data from HR/IAM systems, with HR treated as authoritative for personnel records where agencies designate it so.
- Role and qualification data flows into resource-request matching (F4) and command-role assignment (F1) as reference data, not an independently maintained EPMP personnel system of record.

**Priority:** P0 for SSO/authentication (shared critical path with F8); P1 for roster/qualification sync

#### F17: Asset, Facility & Document System Integration
**Description:** Read integration with asset/facility/ERP systems for site status, and permission-aware import/link/sync with document systems (SharePoint and similar) for plans, SOPs, annexes, and evidence — supporting F2 (facility positions) and F3 (plan repository) without EPMP duplicating these systems of record. Full asset/inventory/maintenance management is explicitly deferred to the Advanced Logistics expansion phase.

**Capabilities:**
- Read-only facility/asset status and location feed into the common operating picture (F2) as facility markers with provenance.
- Permission-aware import, link, or sync of EOPs/SOPs/annexes/evidence documents from SharePoint or equivalent systems into the plan repository (F3), preserving the source system's access permissions.
- No write-back of inventory, maintenance, or cost data in this MVP — those capabilities are explicitly out of scope (see below).

**Priority:** P2 (Medium — supports but does not block the core MVP demonstration path)

### Experience / Role Views

#### F18: Persona & Role-Specific Dashboards
**Description:** Tailored views and default navigation for each of the nine personas named in the product definition, ensuring each role sees the information and primary actions relevant to their job without being buried in capabilities meant for other roles.

**Capabilities:**
- Role-scoped default dashboard/landing view for each persona in Section 3 (EOC director, EMA coordinator, incident commander, planning/situation analyst, logistics/resource coordinator, field responder, public affairs/communications, IT/SecOps admin, agency executive).
- Role-based navigation and action visibility driven by the RBAC model in F8 — a user sees only the `SideNav` groups and primary actions their role permits.
- Executive-briefing view using `display`-scale numbers for 1–3 headline KPIs with no other decoration, per the design system's dashboard pattern.
- Consistent terminology and status vocabulary (e.g., "Active," "Monitoring," "Closed") across every role's view of the same underlying record.

**Priority:** P0 (Critical — MVP requirement named explicitly in `.planning/PROJECT.md`)

## 6. Non-Functional Requirements

- **Design-system exclusivity (hard constraint):** Every screen must be built exclusively from the EPMP Design System's 40 `window.EPMP` components and design tokens (`tokens.json`/`tokens.css`) — no raw hex colors, no arbitrary pixel values, no custom components unless something is genuinely missing from the set, in which case the gap is surfaced and proposed rather than improvised.
- **Theming:** Full functional and visual parity across light (default), dark (operations-center), and contrast (Section 508 high-contrast, 7:1 text) themes on every screen, including maps and charts.
- **Accessibility:** WCAG 2.2 AA minimum (7:1 text contrast in the contrast theme) and Section 508 compliance on every screen; one `h1` per page with ordered headings; full keyboard operability with a visible 2px focus ring on every interactive element; status always shown as icon + word + color, never color alone; 44px minimum touch targets (`size="lg"`) on field-mobile controls. Conformance is demonstrated by testing, never asserted as a certification EPMP does not hold.
- **AI governance (hard constraint):** All AI-generated content (drafts, summaries, recommendations) flows exclusively through the `AIDraft` component with `Provenance` sources and requires named-person approval before becoming part of an operational record. No AI output may be auto-issued as a public warning, evacuation instruction, or binding resource decision, in the UI or at the API layer.
- **Offline / degraded operation:** Field-mobile and EOC views must tolerate degraded connectivity — local caching, queued writes, reconciliation on reconnect, and conflicts always surfaced to a named person via `SyncStatus`, never silently auto-resolved.
- **No FedRAMP claims (hard constraint):** The product must never represent itself as FedRAMP-authorized in any UI copy, documentation, or marketing text, even while targeting FedRAMP-compatible architectural patterns.
- **Interoperability-first:** EPMP integrates with, rather than replaces, specialized GIS, CAD, alerting, and infrastructure systems already in use by target agencies; "record authority" is explicitly defined and visible per external system family.
- **Four non-negotiable integration behaviors:** record authority (explicit per record type), trusted provenance (source/version/timestamp/confidence preserved; unverified feeds never silently promoted to fact), controlled federation (policy-enforced, revocable cross-jurisdiction access), and graceful failure (queue/retry/reconcile, operate in degraded/offline mode).
- **Standards support at the interface layer:** OpenAPI/REST/JSON, OAuth2/OIDC/SAML2, webhooks/event bus with idempotent retries, OASIS CAP (alerts), OASIS EDXL (resource messaging), NIEM data models, OGC/GeoJSON/Esri REST (geospatial); STIX/TAXII and FHIR only if a specific regulated use case requires them.
- **Security baseline:** SSO, granular RBAC, append-only audit logging, encryption at rest and in transit, and operational/availability monitoring across the platform from the first release.
- **Data portability:** Open data exports, documented schemas, and portable deployment artifacts so agencies retain control of their own data and are not locked into EPMP's hosting.
- **Evidence integrity:** Competitive, market-sizing, and vendor-comparison claims from source material are context only and must never appear in product UI or copy as verified facts.

## 7. Success Metrics

Per the source document's own measurement discipline, no numerical baselines or targets are asserted here — each KPI requires a documented definition, baseline, target, owner, and review cadence established with a design-partner agency before being treated as a commitment. AI activity counts alone are never treated as a business outcome; decision quality, time saved, and error rates are evaluated instead.

| Expected outcome | Illustrative KPI | Evidence source |
|---|---|---|
| Faster incident activation | Median time from validated event to active command structure | Incident timeline / activation log (F1) |
| Shared situational awareness | Time to first verified situation report; percentage of operating-picture data currently up to date | COP and integration event logs (F2, F11, F12) |
| Communication effectiveness | Notification delivery and acknowledgment time/rate | Notification-provider receipts (F5, F14) |
| Accountable task completion | Percentage of priority tasks completed within the agreed operational period | Task assignments/approvals (F4) |
| Resource responsiveness | Time to approve and fulfill a resource request | Request and fulfillment records (F4) |
| Stronger preparedness | Count of current plans, tested procedures, and open readiness gaps | Plans and evidence records (F3) |
| Improvement after incidents | Corrective-action closure rate; recurrence of findings | AAR / improvement tracker (F7) |
| Reduced administrative effort | Time to produce ICS documentation and a final report | Report timestamps / staff evaluation (F7, F9) |
| Accessible, calm adoption | Zero unresolved WCAG 2.2 AA / Section 508 findings per release; design-system component-reuse rate (target: 100% of screens built only from `window.EPMP`) | Accessibility audit; design-system conformance check (F0) |

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Source product definition is a proposed design with unverified vendor/market claims | Requirements built on unvalidated assumptions | Treat competitive/market claims as context only (already reflected in Evidence Boundary); validate with a real design-partner agency before further investment |
| Incumbent EOC systems (WebEOC, Veoci, DisasterLAN) may not expose documented, stable APIs | F13 interoperability slips or ships with reduced depth | Scope F13 to an MVP-appropriate record set via approved adapters; declare record authority explicitly; treat full bidirectional sync as a later-phase goal |
| AI drafting features are misused or trusted beyond their governance model | Erosion of trust; potential for unreviewed content to influence a decision | Hard-enforce `AIDraft` + `Provenance` + named-person approval at both UI and API layers (F9); block any code path that could auto-issue AI content |
| Design-system exclusivity rule is not consistently enforced across many screens/personas | Visual and accessibility drift; WCAG failures | Self-check checklist from the LLM build guide run against every screen before merge; flag any missing component/token rather than improvising |
| Offline/degraded-mode conflict handling is underestimated in complexity | Data loss or silent overwrite in the field | Design conflict resolution as always-human-reviewed (`SyncStatus` conflict state) from the start; test field-mobile reconciliation explicitly in FRD/TechArch |
| FedRAMP-compatible posture is mistaken for FedRAMP authorization in product copy | Legal/compliance exposure; loss of buyer trust | Hard constraint enforced in NFRs and content guidelines; explicit review step for any public-facing copy mentioning compliance posture |
| Long government procurement cycles and high ATO expectations slow adoption feedback | MVP validation takes longer than typical SaaS cycles | Select one design-partner archetype (state EOC, large county EMA, or federal continuity program) early per source recommendation; scope MVP demonstration narrowly around that partner's real workflow |
| Cross-jurisdiction data sharing is a frequent compliance/trust blocker in this domain | Agencies refuse to federate data, limiting platform value | Controlled federation is a structural NFR (policy-enforced, revocable) rather than an afterthought; default to narrow, explicit sharing grants |

## 9. Feature Index

| ID | Feature | Category | Priority |
|---|---|---|---|
| F0 | Web & Mobile Application Shell (EPMP Design System UI) | Platform Core | P0 |
| F1 | Incident / ICS | Operational Module | P0 |
| F2 | Common Operating Picture | Operational Module | P0 |
| F3 | Plans & Playbooks | Operational Module | P0 |
| F4 | Tasks & Resource Requests | Operational Module | P0 |
| F5 | Notifications Integration | Operational Module | P0 |
| F6 | Mobile Field Operations | Operational Module | P0 |
| F7 | Reporting & Learning | Operational Module | P0 |
| F8 | Security & Administration | Platform Core | P0 |
| F9 | AI-Assisted Drafting & Signal Triage | AI Assistance (Phase 1) | P1 |
| F10 | Platform API, Integration Gateway & Event Bus | Platform Core | P0 |
| F11 | GIS & Geospatial Integration | External Integration | P0 |
| F12 | Weather & Hazard Feed Ingestion | External Integration | P1 |
| F13 | EOC COTS Interoperability | External Integration | P1 |
| F14 | Notification Provider & Public-Alerting Integration | External Integration | P1 |
| F15 | CAD / 911 Integration | External Integration | P2 |
| F16 | HR / IAM & Identity Integration | External Integration | P0 (SSO) / P1 (roster sync) |
| F17 | Asset, Facility & Document System Integration | External Integration | P2 |
| F18 | Persona & Role-Specific Dashboards | Experience / Role Views | P0 |

**Priority summary:** 12 features at P0 (critical MVP path: application shell, all eight named operational modules, security/admin, platform API/event bus, GIS integration, persona views), 4 at P1 (AI assistance, hazard-feed ingestion, EOC COTS interoperability, notification-provider/public-alerting integration), 2 at P2 (CAD/911, asset/facility/document integration). F16 carries a split priority: SSO/authentication is on the P0 critical path (shared with F8); roster/qualification sync is P1.

## 10. Out of Scope

Each exclusion below is explicit and reasoned, mirroring and extending `.planning/PROJECT.md`'s Out of Scope section. Nothing here is a silent omission — each item was considered against the MVP scope boundary and deliberately deferred or excluded.

- **Advanced logistics** (inventory management, workforce scheduling, mutual aid, supplies and fulfillment tracing) — deferred to post-MVP expansion; MVP ships only the *basic* resource-request lifecycle in F4 per the source document.
- **Risk intelligence module** (curated hazard feeds with correlation/alerting beyond the basic weather/hazard overlay layers in F2/F12) — expansion phase, not MVP.
- **Exercises & simulation** (scenarios, injects, evaluations, training evidence, hazard models for training) — expansion phase; no exercise-management UI or data model in this MVP.
- **Continuous monitoring** (sensor, CCTV, cyber-intelligence, and selected health-data feeds beyond the approved weather/hazard and GIS/CAD integrations in F11/F12/F15) — expansion phase.
- **Continuity & recovery module** (essential-functions tracking, restoration plans, damage/impact assessments, service-recovery measurement) beyond the basic AAR in F7 — expansion phase.
- **Advanced AI & analytics beyond Phase 1** — specifically excluded from this MVP: the conversational knowledge assistant, incident-summary/SITREP auto-generation beyond drafting, predictive hazard/impact models and resource-requirement forecasts, AI-recommended response role/resource matches, specialized autonomous agent workflows for AAR/communications, and role-adaptive recurring-lessons analytics. Only signal triage/clustering and AI-assisted ICS form drafting (F9) are in MVP scope, both human-reviewed via `AIDraft`.
- **Any auto-issued AI-generated public warning, evacuation instruction, or binding resource decision** — explicitly forbidden in this and all future phases; all AI output must go through human approval (`AIDraft` + `Provenance`).
- **FedRAMP authorization claims** anywhere in product UI or copy — the product may target FedRAMP-compatible architectural patterns but must never claim an authorization it does not hold.
- **Building parallel systems of record** for specialized alerting, GIS, CAD, or infrastructure systems — EPMP coordinates and integrates with these (F11, F13, F14, F15, F17) rather than replacing them; each integration is explicitly scoped to approved adapters/read feeds, not full bidirectional synchronization of every record and field a given system holds.
- **Native iOS/Android app-store builds** — Mobile Field Operations (F6) ships in this MVP as a responsive, installable web application built from the same EPMP Design System; a compiled native app is a separate, later decision and is not required to satisfy the mobile field-operations requirement.
- **Full partner-portal UX / cross-agency collaboration workspace** beyond role-scoped, federation-policy-governed views — the federation policy engine and controlled data exchange (F10 NFR) are in MVP scope; a dedicated partner-portal experience distinct from the core app shell is not.
- **Full bidirectional, field-complete sync** with any named external system family (EOC COTS, CAD, asset/ERP, HR/IAM, SharePoint) — each integration (F13, F15, F16, F17) targets an MVP-appropriate, explicitly declared subset of records via approved adapters or read feeds, not comprehensive two-way synchronization of every field.
- **Dollar-figure market sizing, TAM/SAM/SOM modeling, pricing, or procurement-route decisions** — these are commercial/business questions explicitly separated from engineering and product-build scope; nothing in this PRD commits to a pricing or edition structure.
- **Commercial edition packaging** (e.g., "Preparedness & Readiness," "Emergency Operations," "Resilience & Continuity," "Intelligence & Interoperability" editions referenced in the source) — these are market-organization hypotheses, not a committed SKU structure for this MVP build.

---
*This PRD is the foundation for `FRD-EPMP.md` (detailed functional requirements), `TechArch-EPMP.md` (technical architecture decisions), and `UserStories-EPMP.md` (persona-level user stories). Feature IDs (F0–F18) defined here are carried through unchanged in downstream documents.*
