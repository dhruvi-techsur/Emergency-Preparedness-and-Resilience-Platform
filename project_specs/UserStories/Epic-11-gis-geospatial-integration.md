## Epic 11: GIS & Geospatial Integration (F11)

Read integration with the agency's own GIS so the operating picture renders real base maps and facility layers without EPMP becoming a parallel GIS system of record.

### US-11.1: Render the operating picture on our agency's real GIS base map
**As a** James Okafor / Incident Commander, **I want to** see EPMP's incident and resource markers rendered on top of our agency's own GIS base layers (not a generic map), **so that** the operating picture reflects the boundaries and geography my team already trusts.

**Acceptance Criteria:**
- [ ] Base-layer feature services (Esri, OSM-derived, or agency GIS) are read via the approved adapter and normalized to a common GeoJSON representation with `source` and `as_of` provenance
- [ ] Base-layer styling uses only `map-*` design tokens so EPMP's own markers remain the most prominent layer
- [ ] A response missing `source` or `as_of` is treated as a feed failure (triggers degraded fallback), never silently passed through
- [ ] Feed health (last successful fetch, error count) is visible in F8's Integration Health view, with the agency's GIS declared authoritative for base-layer/boundary/facility-location data

**Priority:** P0 | **Feature Ref:** F11

---

### US-11.2: Publish EPMP-authored layers back to the agency GIS where permitted
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** publish EPMP's incident, resource, and hazard-overlay layers back to our agency's GIS as an authorized service where we've granted write permission, **so that** other agency GIS consumers benefit from EPMP's data without EPMP becoming a second system of record.

**Acceptance Criteria:**
- [ ] Publish requests are restricted to the defined layer set (incidents, resource positions, hazard overlays); a request targeting an undeclared layer type is rejected (400 GIS_PUBLISH_LAYER_NOT_ALLOWED)
- [ ] Publishing to an agency that hasn't granted write permission is denied with a clear message (403 GIS_PUBLISH_DENIED)
- [ ] Publish availability is visible per agency in the integration configuration

**Priority:** P0 | **Feature Ref:** F11
