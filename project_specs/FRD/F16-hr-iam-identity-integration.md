## F16: HR / IAM & Identity Integration

**Description:** Identity, organization, role, qualification, and contact-record integration with an agency's HR/IAM systems — the external-identity half of Security & Administration (F8), recognizing that HR is often the authoritative source for personnel data. SSO/authentication is on the P0 critical path (shared with F8); roster/qualification sync is P1.

**Terminology:**
- **Personnel roster:** The read-synced list of agency personnel with role, qualification, and contact data, sourced from HR/IAM.
- **Qualification:** A credential or certification (e.g., ICS-100 certified) relevant to resource-request matching and command-role assignment eligibility.

### Sub-features
- SSO/SAML2/OIDC integration with the agency's identity provider for authentication (shared with F8).
- Read sync of personnel roster, role, qualification, and contact data, with HR treated as authoritative where designated.
- Role/qualification data flows into resource-request matching (F4) and command-role assignment (F1) as reference data.

### Approved Adapter Pattern
SSO/authentication uses the standard SAML2/OIDC protocol integration (specified in F8 S8.4; not re-specified here to avoid duplication). Roster/qualification sync uses one normalized adapter contract per HR/IAM system family (e.g., Workday, PeopleSoft, or agency-specific HRIS), read-only.

**Roster sync adapter contract (MVP depth):**
- **Poll request:** scheduled background job calls `GET {adapter}/personnel?since={timestamp}`.
- **Normalized response:** `{ person_id (external), name, email, role_titles: [...], qualifications: [...], contact_info, jurisdiction, source, as_of }`.
- Matching to an existing EPMP user record (if any) occurs by email address; unmatched records are retained as reference-only personnel (not full platform users) until/unless provisioned a login via SSO.

### Process
1. Authentication: handled via F8's SSO integration (SAML2/OIDC); this feature does not duplicate that flow, but consumes the same IdP connection for any identity-mapping needs specific to roster data.
2. A scheduled background job (F10) polls the configured HR/IAM system for personnel records modified since the last successful sync, via the roster adapter.
3. Normalized personnel records are matched to existing EPMP users by email; matched records update the user's role/qualification/contact reference data (never overwriting EPMP-specific settings like theme preference or RBAC role assignment, which remain EPMP-owned per F8).
4. Unmatched personnel records are retained as reference-only entries, available for selection in F1's command-role assignment (S1.4) and F4's resource-request owner/assignment fields, even if that person has never logged into EPMP.
5. Where an agency designates HR as authoritative for personnel records (per F10's record-authority registry), any conflicting local edit to qualification/contact data is flagged as a conflict rather than silently overwritten by the next sync — consistent with F13's conflict-handling pattern.
6. Feed health (last sync, record counts, errors) is surfaced in F8's Integration Health view.

### Inputs
- Roster sync config: `hris_vendor` (string, required), `endpoint_url`, `auth_credentials` (required).
- Personnel record (post-normalization): `external_person_id`, `name`, `email`, `role_titles`, `qualifications`, `contact_info`, `jurisdiction`, `source`, `as_of`.

### Outputs
- Personnel reference records consumable by F1 (command-role assignment) and F4 (resource-request owner/assignment).
- Matched/unmatched sync status surfaced in F8 Integration Health.

### Validation
- Roster sync must never overwrite EPMP-owned fields (RBAC role assignment, theme preference, audit history) — it updates only HR-sourced reference fields (name, email, qualifications, contact info, organizational role title).
- A conflicting local edit to an HR-authoritative field must be flagged, not silently overwritten on next sync, consistent with the platform's conflict-handling NFR.
- Unmatched personnel records must never be silently discarded — they remain available as reference-only entries.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| HRIS feed unreachable | 503 | HRIS_FEED_UNREACHABLE | (Logged to integration health; last-synced roster data remains available, labeled with its age.) |
| Conflicting local edit to HR-authoritative field | 200 (flagged) | HR_FIELD_CONFLICT | "[Field] was updated locally but [HRIS] is authoritative for this field. Review before the next sync." |
| Roster record missing required fields | 422 | HRIS_RECORD_INCOMPLETE | "[N] personnel records from [HRIS] were missing required fields and skipped this sync." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §SSO (shared with F8) and `Y1d-api-integrations.md` §HR/IAM for `GET /api/v1/integrations/hris/personnel`, `GET /api/v1/integrations/hris/health`.

### Schema Surface (this feature)
Owns table `personnel_roster` — see `Y0a-schema-auth-org.md` §HR/IAM Integration. Read by F1 (command-role assignment) and F4 (resource-request assignment) as reference data; does not replace `users` (F8), which remains the platform's own identity/RBAC table.
