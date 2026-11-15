## Epic 12: Weather & Hazard Feed Ingestion (F12)

Read-only ingestion of NOAA/NWS/USGS hazard data as operating-picture overlay layers, with full provenance preserved.

### US-12.1: See hazard feed data as a toggleable, provenance-labeled layer
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** see NOAA/NWS/USGS hazard events ingested as overlay layers with clear source and confidence, **so that** I can factor current hazard conditions into planning without mistaking an unverified feed for confirmed fact.

**Acceptance Criteria:**
- [ ] Ingested hazard events carry `source`, `issued_at`, and `confidence`; an event missing any of these is rejected, not persisted as a usable layer
- [ ] New hazard layers are persisted `verified: false` by default and appear off-by-default, dashed "Unverified" in `LayerPanel`
- [ ] Expired events (`expires_at` in the past) are visually distinguished or removed from the active layer list, never shown as current without an age indicator

**Priority:** P1 | **Feature Ref:** F12

---

### US-12.2: Verify a hazard layer as a deliberate human action
**As a** Maria Alvarez / EOC Director, **I want to** explicitly mark a hazard layer as verified after reviewing it against other evidence, **so that** my team can rely on it with confidence while unverified data stays visibly flagged.

**Acceptance Criteria:**
- [ ] `verified` can only be set `true` by an explicit, named-person action — no automated promotion under any configuration
- [ ] Marking verified removes the dashed "Unverified" treatment from the layer
- [ ] Verification attempted by a non-named/service account is blocked (403 VERIFICATION_REQUIRES_NAMED_USER)
- [ ] A feed outage retries with exponential backoff and is logged to Integration Health; the operating picture continues rendering last-known data labeled with its age rather than blocking

**Priority:** P1 | **Feature Ref:** F12
