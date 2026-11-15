## Epic 17: Asset, Facility & Document System Integration (F17)

Read integration with asset/facility/ERP systems for site status, and permission-aware document import/link/sync for plans and evidence.

### US-17.1: See facility status and location on the operating picture
**As a** James Okafor / Incident Commander, **I want to** see facility markers with current status and location sourced from our asset/facility system, **so that** I know what's operational without a separate facilities lookup.

**Acceptance Criteria:**
- [ ] Facility status/location is read via the approved adapter and normalized with `source` and `as_of` provenance before rendering as a facility marker (square shape, status-toned) on F2's operating picture
- [ ] No inventory, maintenance, or cost fields are ever requested, stored, or displayed, even if present in the vendor response — discarded at the adapter boundary
- [ ] A facility feed outage shows last-known facility positions on the map, labeled with their age (503 FACILITY_FEED_UNREACHABLE)

**Priority:** P2 | **Feature Ref:** F17

---

### US-17.2: Import or link a document without exceeding my own SharePoint permissions
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** browse, import, or live-link a document from our SharePoint library into the plan repository using my own delegated permissions, **so that** I never see or import something I couldn't already access in the source system.

**Acceptance Criteria:**
- [ ] Browse/import/link operations always execute under the requesting user's own delegated permissions, never a shared service account with broader access
- [ ] A "Link live" document's permission state is re-validated at minimum before each render in F3's reading view; a revoked permission immediately restricts visibility (403 LINK_PERMISSION_REVOKED)
- [ ] A source-side content change on a "Link live" document is flagged to a named person for review, never silently applied (200 flagged LINKED_DOCUMENT_CHANGED)
- [ ] Attempting to import a document the user lacks source-system access to is denied (403 IMPORT_PERMISSION_DENIED)

**Priority:** P2 | **Feature Ref:** F17
