## Coverage Analysis

### Persona Coverage

| Persona | R1 | R2 | R3 |
|---------|----|----|-----|
| PER-01 | US-0.1, US-0.2, US-1.1, US-1.2, US-2.1, US-2.3, US-2.4, US-3.1, US-5.3, US-8.4, US-10.2, US-16.3, US-18.1 | US-9.1, US-12.2, US-13.1 | — |
| PER-02 | US-0.3, US-1.2, US-1.3, US-1.4, US-2.1, US-3.4, US-4.1, US-5.1, US-5.2, US-11.1 | US-9.2, US-14.1, US-14.2, US-16.1 | US-15.1, US-17.1 |
| PER-03 | US-1.5, US-2.2, US-3.2, US-3.3, US-4.3, US-4.4, US-7.1, US-10.3 | US-9.2, US-12.1 | US-17.2 |
| PER-04 | US-4.2, US-6.1, US-6.2, US-6.3, US-6.4, US-18.2 | — | — |
| PER-05 | US-0.2, US-0.4, US-7.3, US-7.4, US-8.1, US-8.2, US-8.3, US-8.4, US-8.5, US-10.1, US-10.4, US-11.2, US-18.3 | US-9.3, US-13.2, US-16.2 | — |

**Every persona (PER-01 through PER-05) has a non-empty R1 column**, confirming the MVP requirement that all five personas can complete at least one journey end-to-end in R1. PER-04 is entirely satisfied within R1 (no R2/R3 stories) because the Field Responder journey (JRN-04.1) is fully scoped within F6, which is 100% P0.

### JTBD Coverage

| JTBD ID | Release | Stories | NaC Count |
|---------|---------|---------|-----------|
| JTBD-01.1 | R1 | US-0.1, US-2.4, US-18.1 | 3 |
| JTBD-01.2 | R1 / R2 | US-1.1, US-1.3 (R1); US-9.1, US-12.1, US-12.2 (R2) | 5 |
| JTBD-01.3 | R1 / R3 | US-3.1, US-3.2, US-3.3, US-3.4 (R1); US-17.2 (R3) | 5 |
| JTBD-01.4 | R1 | US-10.2 | 1 |
| JTBD-02.1 | R1 | US-0.3, US-1.2, US-1.6 | 3 |
| JTBD-02.2 | R1 / R3 | US-2.1, US-2.2, US-2.3, US-1.4, US-11.1, US-10.3 (R1); US-15.1, US-17.1 (R3) | 8 |
| JTBD-02.3 | R1 | US-4.1, US-4.4 | 2 |
| JTBD-02.4 | R1 / R2 | US-5.2, US-5.3 (R1); US-9.3, US-14.1, US-14.2 (R2) | 5 |
| JTBD-03.1 | R1 | US-4.3, US-4.4 | 2 |
| JTBD-03.2 | R1 / R2 | US-1.5, US-7.1 (R1); US-9.2 (R2) | 3 |
| JTBD-03.3 | R1 | US-3.2 | 1 |
| JTBD-03.4 | R1 | US-7.2 | 1 |
| JTBD-04.1 | R1 | US-6.2 | 1 |
| JTBD-04.2 | R1 | US-6.3, US-6.4 | 2 |
| JTBD-04.3 | R1 | US-4.2, US-6.1, US-18.2 | 3 |
| JTBD-05.1 | R1 / R2 | US-8.4, US-10.1, US-10.4, US-11.2 (R1); US-13.1, US-13.2, US-16.2 (R2) | 7 |
| JTBD-05.2 | R1 | US-8.1, US-8.2, US-8.3, US-8.5, US-16.3, US-16.1 | 6 |
| JTBD-05.3 | R1 | US-7.3, US-7.4, US-18.3 | 3 |
| JTBD-05.4 | R1 | US-0.2, US-0.4 | 2 |

Every JTBD outcome in JTBD-EPMP.md has at least one derived NaC and at least one mapped story. No JTBD outcome is orphaned.

### Gap Analysis

- **No JTBD outcomes without stories.** All 19 JTBD IDs (JTBD-01.1 through JTBD-05.4) have at least one NaC derivation and mapped story — confirmed in the JTBD Coverage table above.
- **No personas without an R1 journey.** PER-01 through PER-05 each have a non-empty R1 column; the MVP end-to-end requirement is satisfied for all five.
- **No journey stages without feature coverage.** Every stage in every journey (JRN-01.1 through JRN-05.2) in JOURNEYS-EPMP.md maps to at least one feature/epic, and every epic (F0–F18 / Epic 0–18) has at least one story placed in a lifecycle lane.
- **No orphan stories.** All 62 stories in UserStories-EPMP.md (US-0.1 through US-18.3) appear exactly once in the Story Map Matrix. Verified by cross-referencing the Story Index in UserStories-EPMP.md §"Story Index" against the six lifecycle lanes.
- **Minor noted overlap, not a gap:** US-4.2 (task status lifecycle) appears in the Coordinate lane under PER-04 per its story statement ("As a Diego Reyes / Field Responder...") even though F4 is PER-02/PER-03-primary per the Feature-Persona Matrix; this is intentional — the same task-status mechanism is exercised by both PER-02 (creator) and PER-04 (updater), and JOURNEYS-EPMP.md's JRN-04.1:Update Status touchpoint explicitly cites F6+F4 together.
- **Partial-release JTBD notes (not gaps):** JTBD-01.2, JTBD-02.2, JTBD-02.4, JTBD-03.2, and JTBD-05.1 each have their *core* NaC satisfied in R1 and *additional* NaC added in R2/R3 as the AI, hazard-feed, interoperability, and CAD/facility capabilities mature — this reflects intentional incremental depth, not a missing R1 capability. Each of these JTBD's primary success measure (per JTBD-EPMP.md) is demonstrable using R1 stories alone.

---
