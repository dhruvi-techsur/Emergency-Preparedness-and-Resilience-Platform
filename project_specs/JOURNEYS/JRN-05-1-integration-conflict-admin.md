## PER-05: Dana Whitfield

### JRN-05.1: Resolving an EOC-COTS Integration Conflict (Admin Facet)

**Persona:** PER-05 (Dana Whitfield, IT/SecOps administrator facet)
**Scenario:** During the storm activation, EPMP and the agency's incumbent WebEOC instance both record a status update for the same shelter facility, and the values disagree. Dana needs to see this as a clear, explainable conflict rather than a confusing data mismatch, resolve it without a silent overwrite, and confirm the relevant actions are captured in the audit trail for a later security review.
**Related Jobs:** JTBD-05.1, JTBD-05.2

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Notice Alert | Sees an integration-health alert flag a record conflict between EPMP and WebEOC | Admin console, integration-health view (F13) | "Is this a real conflict or just a timing lag between two systems?" | Alert, slightly wary | Previously, conflicts surfaced as confusing mismatches with no explanation of cause | Integration-health table shows system, last sync, direction, and record authority at a glance |
| Investigate | Opens the conflicting record and sees both values side by side with their respective sources | Integration-health detail, conflict view (F13) | "Which system is actually supposed to own this record type?" | Methodical | No prior tooling showed both values together — Dana had to query each system separately | Side-by-side values with an explicit record-authority declaration per system |
| Resolve | Chooses "Keep EPMP value" based on the declared record authority for facility status | Conflict view, keep-value action (F13) | "This decision needs to be deliberate and on the record, not a guess." | Confident | Silent overwrites in the past meant no one could say which value "won" or why | Explicit "keep this value" action — never a silent overwrite |
| Verify Audit Entry | Checks the audit log to confirm the conflict and resolution were captured with Dana's identity and timestamp | Admin console, audit log (F8) | "If a security reviewer asks about this next month, I need this to already be there." | Reassured | Historically had to manually document conflict resolutions outside the system | Append-only audit log automatically captures the resolution with actor and timestamp |
| Review RBAC Scope | While in the admin console, reviews which roles currently have access to the shelter facility's incident data | Admin console, RBAC/role management (F8) | "Is anyone who shouldn't still have access to this incident?" | Vigilant | RBAC reviews used to be a manual, ad hoc spreadsheet exercise | Granular, incident-scoped permissions are visible and editable in one console view |

#### Key Moments
- **Decision Point:** Resolve stage — Dana's choice of which value to keep becomes the record of truth; this must never be reversible by accident.
- **Risk of Abandonment:** Investigate stage — if record authority isn't explicit and visible, Dana has to escalate to a vendor support call, breaking the self-service resolution model.
- **Delight Opportunity:** Verify Audit Entry stage — confirming the resolution is already fully documented, with zero extra effort, turns a compliance chore into a non-event.

#### Success Outcome
Every external system has an explicit, visible record-authority declaration with no silent overwrites (JTBD-05.1), and every security-relevant action — including this conflict resolution — is captured in the append-only audit trail with zero gaps (JTBD-05.2).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Notice Alert | F13 |
| Investigate | F13 |
| Resolve | F13, F10 |
| Verify Audit Entry | F8 |
| Review RBAC Scope | F8 |

---
