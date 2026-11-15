# User Story Map
## EPMP (Emergency Preparedness & Management Platform)

| Field | Value |
|-------|-------|
| **Product Name** | EPMP (Emergency Preparedness & Management Platform) |
| **Date** | 2026-11-14 |
| **Related Personas** | PERSONAS-EPMP.md |
| **Related Journeys** | JOURNEYS-EPMP.md |
| **Related JTBD** | JTBD-EPMP.md |
| **Related User Stories** | UserStories-EPMP.md |
| **Related PRD** | PRD-EPMP.md |

---

## Overview

This story map organizes EPMP's 62 user stories (Epics 0–18, feature refs F0–F18) along the product's own operational lifecycle — **Prepare → Monitor → Activate → Coordinate → Recover → Improve** — the same six stages used in the F0 `SideNav` and the PRD mission statement. Each lifecycle stage is a lane; every lane table lists the activity, the persona performing it, the epic/feature, the mapped story (or stories), a derived Natural Acceptance Criterion (NaC), and the release increment the story ships in.

**NaC (Natural Acceptance Criteria) concept:** NaC bridges a JTBD outcome to a testable criterion by applying that outcome to a specific journey-stage context. For example, JTBD-01.1 ("minimize time to a trustworthy readiness picture") applied to the Monitor-stage "scan dashboard" activity becomes the NaC "readiness/incident/resource data for all jurisdictions renders in under 5 seconds with a visible timestamp and source." NaC are never invented — every NaC below is pulled from the JTBD-EPMP.md NaC Preview table and anchored to the journey stage and story where that outcome is actually exercised. The full source → stage → criterion → story chain is recorded in the **NaC Derivation Table**.

**Releases:** Release assignment follows the PRD's own priority tiers exactly — **R1 = all 48 P0 stories** (MVP operational foundation), **R2 = all 11 P1 stories** (AI assistance, hazard-feed ingestion, EOC COTS interoperability, notification-provider/public-alerting integration, HR/IAM roster sync), **R3 = all 3 P2 stories** (CAD/911, asset/facility/document integration). This mapping confirms R1 alone lets all five personas (PER-01 through PER-05) complete at least one journey end-to-end — see Release Planning and Coverage Analysis below.

---
