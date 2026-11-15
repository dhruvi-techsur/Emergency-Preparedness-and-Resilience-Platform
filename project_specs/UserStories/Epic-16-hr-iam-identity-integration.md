## Epic 16: HR / IAM & Identity Integration (F16)

Identity, organization, role, qualification, and contact-record integration with an agency's HR/IAM systems.

### US-16.1: See personnel roster and qualification data flow into role and resource assignment
**As a** James Okafor / Incident Commander, **I want to** search and assign personnel for command roles and resource requests using roster/qualification data synced from our HR/IAM system, **so that** I can assign the right qualified person without manually re-entering personnel data.

**Acceptance Criteria:**
- [ ] Personnel records from HR/IAM are matched to existing EPMP users by email; unmatched records are retained as reference-only entries available for selection, never silently discarded
- [ ] Role and qualification data populate F1's command-role assignment search (S1.4) and F4's resource-request owner/assignment fields as reference data
- [ ] Roster sync never overwrites EPMP-owned fields (RBAC role assignment, theme preference, audit history) — it only updates HR-sourced reference fields
- [ ] A roster record missing required fields is skipped and counted, not silently dropped without trace (422 HRIS_RECORD_INCOMPLETE)

**Priority:** P1 | **Feature Ref:** F16

---

### US-16.2: Flag conflicts when a locally edited field disagrees with HR as authority
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** see a flagged conflict rather than a silent overwrite when a locally edited field disagrees with an HR-authoritative field on the next sync, **so that** personnel data integrity is preserved without losing either side's information.

**Acceptance Criteria:**
- [ ] A conflicting local edit to an HR-authoritative field is flagged (200 flagged HR_FIELD_CONFLICT), not silently overwritten on next sync
- [ ] HRIS feed health (last sync, record counts, errors) is visible in F8's Integration Health view
- [ ] An unreachable HRIS feed shows last-synced roster data labeled with its age, logged for investigation (503 HRIS_FEED_UNREACHABLE)

**Priority:** P1 | **Feature Ref:** F16

---

### US-16.3: Sign in via the same SSO connection used for authentication
**As a** Maria Alvarez / EOC Director, **I want to** authenticate via the same SAML2/OIDC identity-provider connection my agency already uses for every system, **so that** I don't manage a separate EPMP-specific credential.

**Acceptance Criteria:**
- [ ] SSO authentication for F16 shares the same SAML2/OIDC integration configured in F8 (no duplicated login flow)
- [ ] Identity-mapping needs specific to roster data consume the same IdP connection without re-prompting the user
- [ ] This authentication path is on the P0 critical path shared with F8

**Priority:** P0 | **Feature Ref:** F16
