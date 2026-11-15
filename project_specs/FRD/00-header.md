# FRD — EPMP (Emergency Preparedness & Management Platform)

**Document type:** Functional Requirements Document
**Project acronym:** EPMP
**Status:** Draft v1 — elaborates `PRD-EPMP.md` features F0–F18
**Last updated:** 2026-11-14

**Source material:** `project_specs/PRD-EPMP.md` (committed MVP feature set, NFRs, out-of-scope), `project_specs/PERSONAS-EPMP.md` (5 consolidated personas: PER-01 EOC Director/EMA Coordinator, PER-02 Incident Commander/PIO, PER-03 Planning & Logistics Section Chief, PER-04 Field Responder, PER-05 IT/SecOps Admin & Executive Sponsor), `project_specs/ref_docs/TechSur_EPMP_Product_Definition.pdf.md` (business context, external interfaces), `project_specs/ref_docs/EPMP-Design-System.pdf.md` (40-component design system, tokens, page patterns), `project_specs/ref_docs/EPMP-llm-build-guide.md` (build contract), `.planning/PROJECT.md` (scope decisions).

**Evidence boundary:** This FRD commits only to the MVP scope defined in the PRD. Any capability named in the TechSur source but deferred in the PRD's Out of Scope section (advanced logistics, risk intelligence, exercises/simulation, continuous monitoring, continuity/recovery beyond basic AAR, Phase 2/3 AI) is explicitly NOT specified here.

---

## Scope Statement

This FRD specifies exact inputs, outputs, validation rules, process steps, and error states for every PRD feature (F0–F18), so that developers can implement each feature without re-deriving intent from the PRD or source documents. It also consolidates the data model (schema), the REST API surface, the cross-feature error catalog, and the external integration contracts into dedicated cross-feature chunks. UI requirements are specified as concrete screens, components (from the EPMP Design System's `window.EPMP` set), states (loading/empty/error/offline), and navigation — not as an afterthought to the API.

## Conventions

- **Feature IDs** (`F0`–`F18`) are carried unchanged from the PRD and are never renumbered.
- **Component names** in backticks (e.g., `Table`, `AIDraft`, `SyncStatus`) refer to the EPMP Design System's `window.EPMP` component library — see the design-system reference for full prop contracts. Every screen in this FRD is built exclusively from this set; if a screen needs something the set doesn't have, that gap is called out explicitly rather than silently improvised.
- **Design tokens** (e.g., `--space-4`, `brand`, `danger-solid`) refer to `tokens.json`/`tokens.css`. No raw hex values or arbitrary pixel sizes are permitted in any implementation of this FRD.
- **Status vocabulary** is fixed and reused across every feature: incidents (`Critical`/`Elevated`/`Watch`/`Normal` severity; `Monitoring`/`Partial`/`Full` activation), tasks (`Open`/`In progress`/`Awaiting approval`/`Done`/`Overdue`), resource requests (`Draft`/`Awaiting approval`/`Approved`/`Fulfilled`/`Declined`), plans (`Draft`/`Review`/`Approved`), sync (`online`/`syncing`/`offline`/`conflict`). Every status renders as icon + word + color (`Badge`), never color alone.
- **API conventions:** all endpoints are versioned (`/api/v1/...`), JSON request/response, OAuth2/OIDC bearer tokens, idempotency keys required on all mutating webhook-triggered calls. Full request/response schemas live in `Y1a`–`Y1d`; per-feature chunks reference them rather than repeating them.
- **Schema conventions:** PostgreSQL + PostGIS. All tables carry `id UUID PK`, `created_at`, `updated_at`, `created_by`/`updated_by` (FK to `users`) unless noted. Append-only tables (`incident_timeline`, `audit_log`) never update or delete rows — corrections are new rows. Full DDL lives in `Y0a`–`Y0d`; per-feature chunks list only the tables they own or read.
- **Cross-references:** `see F03 §Process step 4` means "read the Process section of the F03 chunk, step 4."
- **AI governance marker:** any field, draft, or output produced by F9 is tagged `[AIDraft]` in this document to flag that it must render through the `AIDraft` + `Provenance` components and requires named-person approval before becoming part of an official record. No code path may bypass this.

## Shared Terminology (cross-feature)

- **EOC:** Emergency Operations Center.
- **ICS:** Incident Command System. Roles: Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public Information.
- **COP:** Common Operating Picture — referred to as "operating picture" in UI copy (see F2).
- **SITREP:** Situation report.
- **AAR:** After-Action Report.
- **Activation:** Moving an EOC or incident to Monitoring, Partial, or Full.
- **Operational period:** The planning cycle for an incident (e.g., "Operational Period 2").
- **Record authority:** The explicit, documented declaration of which system (EPMP or a named external system) creates, updates, and reconciles a given record type. Every external integration feature (F11, F13, F14, F15, F16, F17) must declare this per record type it touches.
- **Provenance:** Source, timestamp, version, and confidence attached to every ingested or AI-derived fact. Rendered via the `Provenance` component. Unverified facts are never silently promoted to operational fact.
- **SyncStatus states:** `online`, `syncing`, `offline` (with queued count), `conflict`. Conflicts always surface to a named person — never silently auto-resolved.
- **Tenant / Jurisdiction:** The organizational/geographic scoping unit for RBAC and data federation. An agency may contain multiple jurisdictions (state, county, city); federation grants (F10 NFR) permit explicit, revocable cross-jurisdiction visibility.
- **Named-person approval:** Any action requiring this must record the approving user's identity and timestamp in an append-only audit trail (`incident_timeline` or `audit_log`), never a system/service account.

## Master Table of Contents

**Platform Core**
- [F0: Web & Mobile Application Shell](./F00-application-shell.md)
- [F8: Security & Administration](./F08-security-administration.md)
- [F10: Platform API, Integration Gateway & Event Bus](./F10-platform-api-gateway.md)

**Operational Modules**
- [F1: Incident / ICS](./F01-incident-ics.md)
- [F2: Common Operating Picture](./F02-common-operating-picture.md)
- [F3: Plans & Playbooks](./F03-plans-playbooks.md)
- [F4: Tasks & Resource Requests](./F04-tasks-resource-requests.md)
- [F5: Notifications Integration](./F05-notifications-integration.md)
- [F6: Mobile Field Operations](./F06-mobile-field-operations.md)
- [F7: Reporting & Learning](./F07-reporting-learning.md)

**AI Assistance**
- [F9: AI-Assisted Drafting & Signal Triage](./F09-ai-assisted-drafting.md)

**External Integrations**
- [F11: GIS & Geospatial Integration](./F11-gis-geospatial-integration.md)
- [F12: Weather & Hazard Feed Ingestion](./F12-weather-hazard-feed-ingestion.md)
- [F13: EOC COTS Interoperability](./F13-eoc-cots-interoperability.md)
- [F14: Notification Provider & Public-Alerting Integration](./F14-notification-provider-integration.md)
- [F15: CAD / 911 Integration](./F15-cad-911-integration.md)
- [F16: HR / IAM & Identity Integration](./F16-hr-iam-identity-integration.md)
- [F17: Asset, Facility & Document System Integration](./F17-asset-facility-document-integration.md)

**Experience / Role Views**
- [F18: Persona & Role-Specific Dashboards](./F18-persona-role-dashboards.md)

**Cross-Feature Chunks**
- Database Schema: [Y0a Auth/Org](./Y0a-schema-auth-org.md) · [Y0b Incident/Ops](./Y0b-schema-incident-ops.md) · [Y0c Comms/Reporting](./Y0c-schema-comms-reporting.md) · [Y0d Integration/Geo](./Y0d-schema-integration-geo.md)
- API Endpoints: [Y1a Auth/Admin](./Y1a-api-auth-admin.md) · [Y1b Incident/Ops](./Y1b-api-incident-ops.md) · [Y1c Comms/Reporting](./Y1c-api-comms-reporting.md) · [Y1d Integrations](./Y1d-api-integrations.md)
- [Y2: Error Catalog](./Y2-errors.md)
- [Y3: Integration Points](./Y3-integrations.md)

---
*This FRD is the functional foundation for `TechArch-EPMP.md` and `UserStories-EPMP.md`. Feature IDs F0–F18 are carried through unchanged.*
