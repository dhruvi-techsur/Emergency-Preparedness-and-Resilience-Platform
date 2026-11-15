## PER-01: Maria Alvarez

### JRN-01.1: Start-of-Shift Readiness & Activity Check

**Persona:** PER-01 (Maria Alvarez)
**Scenario:** Maria arrives at the EOC at the start of her shift and needs to know, across every jurisdiction she's responsible for, what's active, what's at risk, and whether any plans or approvals are overdue — before she briefs leadership or decides where to focus her limited attention for the day.
**Related Jobs:** JTBD-01.1, JTBD-01.3

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| Arrive | Logs into the EOC director dashboard from her desk workstation | Login / SSO, role-specific dashboard (F0, F18) | "Let's see what happened overnight before the 8am call." | Alert, mildly anxious | Yesterday she had to call three county liaisons to get this picture | Dashboard loads pre-filtered to her jurisdictions with last-login delta highlighted |
| Orient | Scans the readiness portfolio and active-incidents panel across all jurisdictions | EOC director dashboard (F2, F18) | "Is everything time-stamped? I need to know how current this is." | Focused, slightly skeptical | Historically has no way to confirm data freshness or source | Visible "as of HH:MM · source" label on every tile (per NFR) |
| Prioritize | Filters by jurisdiction and severity to spot anything Elevated or Critical | Common operating picture map/dashboard (F2) | "Which county needs me first?" | Determined | Without status-coded markers, severity triage took phone calls | Status-coded severity badges let her triage visually in seconds |
| Verify Plans | Checks whether any plan/SOP approvals are overdue before her leadership briefing | Plan & Playbook repository (F3) | "Did that mutual-aid annex ever get approved?" | Mildly frustrated at first, then reassured | Previously had to dig through shared drives with no version history | Approval-state badge (draft/review/approved) visible directly on the dashboard widget |
| Brief | Exports a one-page readiness/activity summary to bring to the leadership call | Reporting export (F7, F18) | "I need this in front of me in one sitting, no last-minute assembly." | Confident, relieved | Previously built this summary by hand every morning | One-click readiness summary export with timestamp and source per line |

#### Key Moments
- **Decision Point:** Prioritize stage — Maria decides which jurisdiction gets her attention first; a wrong read here cascades into a late activation decision later in the day.
- **Risk of Abandonment:** Orient stage — if the dashboard doesn't clearly show data freshness, Maria reverts to calling liaisons directly, abandoning the tool for her actual decision-making.
- **Delight Opportunity:** Brief stage — a one-click, already-current readiness summary replaces what used to be 20+ minutes of manual assembly before every leadership call.

#### Success Outcome
Maria states her full jurisdiction's current readiness status — current plans, open gaps, active incidents — in under 5 minutes, satisfying JTBD-01.1's success measure, and produces a leadership-ready summary without reconstructing anything from external documents (JTBD-01.3).

#### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | F0, F18 |
| Orient | F2, F18 |
| Prioritize | F2 |
| Verify Plans | F3 |
| Brief | F7, F18 |

---
