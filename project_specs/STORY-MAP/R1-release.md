## Release Planning

### Release R1: MVP Operational Foundation

**Theme:** The full incident-centric operational lifecycle — application shell, Incident/ICS activation and command, common operating picture, plans, tasks/resource requests, notifications, mobile field operations, reporting/learning, security/administration, platform API/event bus, and GIS integration — every P0 story per the PRD priority tier. This is the release where all five personas complete at least one end-to-end journey.

**Stories (48):** US-0.1, US-0.2, US-0.3, US-0.4, US-1.1, US-1.2, US-1.3, US-1.4, US-1.5, US-1.6, US-2.1, US-2.2, US-2.3, US-2.4, US-3.1, US-3.2, US-3.3, US-3.4, US-4.1, US-4.2, US-4.3, US-4.4, US-5.1, US-5.2, US-5.3, US-6.1, US-6.2, US-6.3, US-6.4, US-7.1, US-7.2, US-7.3, US-7.4, US-8.1, US-8.2, US-8.3, US-8.4, US-8.5, US-10.1, US-10.2, US-10.3, US-10.4, US-11.1, US-11.2, US-16.3, US-18.1, US-18.2, US-18.3

**Personas Served:** PER-01, PER-02, PER-03, PER-04, PER-05 (all five)

**JTBD Addressed:** JTBD-01.1, JTBD-01.2, JTBD-01.3, JTBD-01.4, JTBD-02.1, JTBD-02.2, JTBD-02.3, JTBD-02.4, JTBD-03.1, JTBD-03.2, JTBD-04.1, JTBD-04.2, JTBD-04.3, JTBD-05.1, JTBD-05.2 (JTBD-03.3, JTBD-03.4, JTBD-05.3, JTBD-05.4 partially addressed in R1 via US-3.2/US-7.2/US-7.3/US-7.4/US-18.3, fully closed once R2's AI/interoperability stories land)

**End-to-end journeys completable in R1:**
- **PER-01** — JRN-01.1 (start-of-shift readiness check) and JRN-01.2 (storm activation + command handoff, minus the F12 hazard-overlay confidence flagging which lands in R2): US-18.1, US-2.4, US-2.1/US-2.2/US-2.3, US-3.1, US-7.3 → US-1.1, US-1.2, US-5.2/US-5.3, US-10.2
- **PER-02** — JRN-02.1 (full incident lifecycle) and JRN-02.2 (public message approval/tracking): US-1.2 → US-1.4 → US-4.1 → US-2.1 → US-1.3 → US-5.2 → US-5.3 → US-1.6 (AI-narrative review step, US-9.2, is an enhancement layered on in R2 — the core lifecycle completes without it)
- **PER-03** — JRN-03.1 (resource-request lifecycle + daily SITREP): US-4.3 → US-4.4 → US-7.1 (AI-assisted drafting via US-9.2 is R2; manual SITREP drafting from auto-pulled data in US-7.1 is R1-complete on its own)
- **PER-04** — JRN-04.1 (offline field reporting + reconnect sync): US-18.2 → US-6.1 → US-6.2 → US-6.1 (status update) → US-6.3 → US-6.4
- **PER-05** — JRN-05.1 (admin facet: integration conflict + audit) using F8's native conflict-surfacing pattern (US-8.4) plus JRN-05.2 (executive facet: KPI review): US-8.4 → US-8.3 → US-8.2; US-18.3 → US-7.4 → US-7.3 (full EOC-COTS-specific conflict view, US-13.2, lands in R2 — R1 ships the equivalent integration-health/conflict pattern generically via F8/F10)

**Acceptance Gate:**
- [ ] All NaC for the 48 R1 stories pass
- [ ] PER-01 through PER-05 can each complete at least one journey end-to-end using only R1 stories
- [ ] No P0 story is deferred past R1

---
