## Epic 8: Security & Administration (F8)

The identity, access, audit, and operational-monitoring foundation for secure multi-role use.

### US-8.1: Sign in via agency SSO
**As a** Maria Alvarez / EOC Director, **I want to** sign in using my agency's identity provider via SAML2/OIDC, **so that** I use the same trusted credentials my agency already manages, with no separate password to remember.

**Acceptance Criteria:**
- [ ] Sign-in authenticates via the configured IdP (SAML2 or OIDC) and resolves or provisions the local user record
- [ ] IdP groups/attributes map to an EPMP role per the configured mapping
- [ ] A failed SSO assertion/token validation shows a clear message (401 SSO_AUTH_FAILED) directing the user to contact an administrator if it continues
- [ ] A user with no mapped role sees a clear message (403 ROLE_UNRESOLVED) rather than a blank or broken screen
- [ ] Session persists across page refreshes without re-prompting for credentials

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.2: Configure granular, role- and jurisdiction-scoped permissions
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** configure RBAC roles and permissions down to the feature/action level and jurisdiction scope, **so that** every persona sees exactly the data and actions their job requires, nothing more.

**Acceptance Criteria:**
- [ ] Roles & Permissions screen shows a permission matrix (feature × action, e.g., "Incidents: create/view/edit/approve-activation") editable via checkbox groups
- [ ] Permission changes require confirmation and are logged with the before/after permission set, not just "permissions changed"
- [ ] A role cannot be deleted while any user is currently assigned to it (409 ROLE_IN_USE otherwise)
- [ ] Suspending a user's access immediately invalidates their active sessions (does not wait for token expiry)
- [ ] Every other feature's RBAC check (F0–F18) consumes this role/jurisdiction-scope resolution

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.3: Review an immutable, append-only audit trail
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** review every security-relevant action (login, permission change, record access, AI-draft approval) in an append-only audit log, **so that** I can investigate incidents and prove compliance without gaps.

**Acceptance Criteria:**
- [ ] Audit log view additionally filters by login events, permission changes, record-access events, and AI-draft approvals (shared pattern with F7 S7.4)
- [ ] Audit log entries are immutable and exempt from any delete/edit code path at the data layer, including for admins (403 AUDIT_LOG_IMMUTABLE if attempted)
- [ ] Log is read-only and exportable
- [ ] Every login, permission change, record access to a sensitive type, and AI-draft approval writes an entry with actor, timestamp, action, and affected record

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.4: Monitor platform availability and integration health
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** monitor platform uptime, active sessions, failed-login rate, and integration-error rate from one admin view, **so that** I can catch and respond to degraded conditions before users are significantly impacted.

**Acceptance Criteria:**
- [ ] Platform Monitoring shows a `Stat` row (uptime, active sessions, failed-login rate, integration-error rate) and trend `LineChart`s for availability over time
- [ ] A persistent `Alert` (danger) surfaces any current platform-health incident until resolved (200 alert PLATFORM_HEALTH_DEGRADED)
- [ ] Integration Health table shows System, Last sync, Direction, Record authority, and `SyncStatus` for each connected external system
- [ ] Conflict rows show "Keep EPMP value" / "Keep [external] value" actions inline, never a silent overwrite
- [ ] No screen in the admin console, including this one, claims FedRAMP authorization in any copy

**Priority:** P0 | **Feature Ref:** F8

---

### US-8.5: Configure SSO safely with a mandatory test step
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** configure and test an SSO connection before it goes live, **so that** I never lock out my agency's users with an untested identity-provider configuration.

**Acceptance Criteria:**
- [ ] SSO configuration form accepts IdP metadata (URL or XML), protocol (SAML2/OIDC), and attribute/group-to-role mapping
- [ ] "Test connection" must succeed before "Save configuration" can activate the config as live
- [ ] Invalid or unreachable IdP metadata shows a clear message (422 SSO_CONFIG_INVALID)
- [ ] Configuration changes are logged to the audit trail

**Priority:** P0 | **Feature Ref:** F8
