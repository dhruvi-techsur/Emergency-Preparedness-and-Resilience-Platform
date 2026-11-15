## F11: GIS & Geospatial Integration

**Description:** Read integration with the agency's own GIS so the common operating picture (F2) renders real base maps, boundaries, and facility layers styled to the EPMP map tokens, rather than EPMP building a parallel GIS system of record. Publishes EPMP-authored layers back to the agency's GIS where permitted.

**Terminology:**
- **Base layer:** The agency's own GIS tile/vector layer (Esri, OSM-derived, agency GIS) rendered underneath EPMP's own markers.
- **Feature service:** An OGC-service/GeoJSON/Esri-REST endpoint exposing geospatial features (boundaries, facilities) consumable by EPMP.
- **Published layer:** An EPMP-authored layer (incidents, resource positions, hazard overlays) exposed back to the agency's GIS as an authorized read service.

### Sub-features
- Read integration with Esri, OSM-derived, or agency GIS base layers and feature services.
- EPMP-authored data published as authorized layers/services back to the agency's GIS where permitted.
- Base-map styling to `map-*` design tokens.
- Graceful failure to the schematic offline base map (F2) when the GIS feed is unavailable.

### Approved Adapter Pattern
This integration uses a single approved adapter contract regardless of the underlying GIS vendor (Esri ArcGIS, agency-hosted OSM/MapLibre, or similar): the adapter normalizes vendor-specific feature-service responses into a common internal GeoJSON-based representation before anything reaches the F2 rendering layer. Vendor-specific adapter implementations are out of scope for this FRD (TechArch concern); this document specifies only the adapter's external contract.

**Adapter request/response contract (MVP depth):**
- **Request:** `GET /adapter/gis/features?layer={layer_id}&bbox={minx,miny,maxx,maxy}` — the adapter translates this into the vendor's native query (e.g., Esri REST `query` operation or an OGC `GetFeature` request).
- **Response (normalized):** `{ layer_id, source, as_of, features: [GeoJSON Feature] }` — every response carries `source` and `as_of` regardless of vendor, satisfying provenance enforcement (F10).
- **Publish request:** `POST /adapter/gis/publish` with `{ layer_id, features: [GeoJSON Feature], visibility: "agency-internal"|"public" }` — the adapter translates this into the vendor's feature-service write/update API where the agency has granted publish rights; this is explicitly scoped to the defined layer set (incidents, resource positions, hazard overlays), not a general-purpose GIS write API.

### Process
1. On operating-picture load (F2), the gateway (F10) requests the agency's configured base-layer feature services via the GIS adapter, scoped to the current map viewport (bounding box).
2. The adapter normalizes the vendor response into the common GeoJSON representation and attaches `source` and `as_of` provenance before returning it to F2 for rendering.
3. F2 styles the base layer using `map-*` tokens (muted land/water/park/road/boundary/label) so EPMP's own markers remain the most prominent layer on screen.
4. EPMP-authored data (incident markers, resource positions, hazard overlays validated by F12) is optionally published back to the agency's GIS as an authorized read-only service, via the adapter's publish contract, only for agencies that have granted this write permission.
5. If the GIS feed request times out or errors, F10 surfaces the failure to F2, which falls back to the schematic offline base map (per F2's Process step 2) rather than failing the operating-picture page.
6. Feed health (last successful fetch, error count) is surfaced in F8's Integration Health view (S8.6) with record authority declared as the agency's GIS being authoritative for base-layer/boundary/facility-location data, and EPMP being authoritative only for its own incident/resource/hazard-overlay layers.

### Inputs
- `layer_id` (string, required): which base or feature layer to request.
- `bbox` (4 floats, required): bounding box of the current map viewport.
- `publish_payload` (GeoJSON FeatureCollection, required for publish calls): EPMP-authored features to expose back to the agency's GIS.

### Outputs
- Normalized GeoJSON feature responses with `source`/`as_of` provenance, consumed by F2.
- Published layer availability status (for agencies with write permission granted).
- Integration-health status entry (F8 S8.6) for the GIS adapter.

### Validation
- Every normalized response must carry non-null `source` and `as_of`; a response missing either is treated as a feed failure (triggers the degraded-mode fallback), not silently passed through.
- Publish calls are restricted to the defined layer set (incidents, resource positions, hazard overlays) — the adapter must reject any publish payload targeting an undeclared layer type.
- Base-layer styling must use only `map-*` tokens; no raw color values may be applied to the GIS base layer at the EPMP rendering layer.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| GIS feature service timeout | 504 | GIS_FEED_TIMEOUT | (Surfaces to F2 as schematic-base fallback; no separate user-facing error beyond F2's degraded-mode banner.) |
| GIS feature service returns malformed/unprovenanced data | 502 | GIS_FEED_INVALID | "GIS layer '[layer]' returned invalid data and was skipped this refresh." |
| Publish attempted to undeclared layer | 400 | GIS_PUBLISH_LAYER_NOT_ALLOWED | "This layer isn't approved for publishing back to [agency] GIS." |
| Publish rejected by agency GIS (no write permission) | 403 | GIS_PUBLISH_DENIED | "[Agency] hasn't granted EPMP permission to publish this layer." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §GIS for `GET /api/v1/integrations/gis/features`, `POST /api/v1/integrations/gis/publish`, `GET /api/v1/integrations/gis/health`.

### Schema Surface (this feature)
Owns table `gis_feed_status` (health/record-authority metadata) — see `Y0d-schema-integration-geo.md` §GIS. Does not own geospatial feature data itself (read-through/cached only, not a system of record); feeds `hazard_layers`/`facilities` surfaces consumed by F2/F17.
