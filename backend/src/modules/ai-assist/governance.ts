// Shared AI-governance guard module, per TechArch 01-components.md §2.4
// rule 3 ("the AI governance guard is a shared middleware, not duplicated
// logic... runs the same assertAiOriginApproved(payload) check from a
// shared library, regardless of which module owns the endpoint").
//
// **Named cross-phase collision — already resolved, not hypothetical.**
// This plan's own PLAN.md documented that Phase 4's 04-01 independently
// defines the identical guard (`assertAiOriginApproved` /
// `AiOriginNotApprovedError`) inside
// `backend/src/modules/comms-reporting/notifications.ts`, and instructed
// whichever phase executes SECOND against a live database to detect the
// already-exported guard (by module path) and import/re-export it rather
// than redefining it. Phase 4 has already executed (confirmed directly:
// notifications.ts already exports both symbols, used by 04-02's
// reporting.ts). This module is therefore a thin re-export, not a second
// implementation — there is exactly ONE enforcement point for
// `assertAiOriginApproved` in this codebase, reachable from either import
// path (`ai-assist/governance.js` for this phase's new ics-forms.ts
// consumer, `comms-reporting/notifications.js` for 04-01/04-02's existing
// consumers).
export { assertAiOriginApproved, AiOriginNotApprovedError } from '../comms-reporting/notifications.js';
