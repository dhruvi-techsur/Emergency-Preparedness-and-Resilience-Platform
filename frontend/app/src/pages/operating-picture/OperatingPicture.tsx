import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Timeline,
  EmptyState,
  Badge,
  Button,
  MapCanvas,
  MapControls,
  MapLegend,
  MapPopup,
  LayerPanel,
  Provenance,
  type BadgeTone,
  type MapMarker as CanvasMapMarker,
  type MapLegendItem,
  type MapLayer,
  type TimelineItem,
} from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';
import './OperatingPicture.css';

type Severity = 'Critical' | 'Elevated' | 'Watch' | 'Normal';
type ActivationLevel = 'Monitoring' | 'Partial' | 'Full';

/** Shape of each entry in GET /api/v1/operating-picture/markers's `markers`
 * array (backend/src/modules/incident-ops/operating-picture.ts). Phase 2
 * only ever produced `type: 'incident'` rows; Phase 3 (03-09) adds
 * `type: 'resource'` rows for in-flight resource_requests (triangle shape,
 * inheriting their linked incident's location). This page reads `type`
 * (not the redundant `shape` field) to decide `MapCanvas`'s marker shape,
 * matching the design system's own type->shape mapping — no change needed
 * here since that mapping was always generic. */
interface ApiMarker {
  id: string;
  type: 'incident' | 'facility' | 'resource' | 'shelter';
  shape: 'diamond' | 'square' | 'triangle' | 'circle';
  tone: string;
  label: string;
  status: string;
  location: { lat: number; lng: number };
}

interface StatusBar {
  as_of: string;
  base_layer_source: string;
}

interface MarkersResponse {
  markers: ApiMarker[];
  status_bar: StatusBar;
}

interface ApiLayer {
  id: string;
  label: string;
  source: string;
  as_of: string;
  verified: boolean;
  count: number;
  checked: boolean;
}

interface LayersResponse {
  layers: ApiLayer[];
}

/**
 * Fields needed for the `MapPopup`'s 2-3 facts (activation level,
 * jurisdiction, opened date) and severity `Badge`. `GET
 * .../operating-picture/markers` intentionally returns a thin marker shape
 * (id/type/tone/label/status/location only — see that endpoint's own
 * `MapMarker` interface) since Phase 3+ facility/resource markers will
 * share the same thin shape. Rather than widen that endpoint's response
 * (which would mean every poll of the whole marker set carries data only
 * the currently-selected popup needs), this page fetches the fuller detail
 * for ONLY the selected incident via the existing `GET /api/v1/incidents/
 * {id}` (02-01), the same endpoint `IncidentWorkspace.tsx` already uses.
 */
interface SelectedIncidentDetail {
  id: string;
  name: string;
  severity: Severity;
  jurisdiction: { id: string; name: string };
  activation_level: ActivationLevel;
  opened_at: string;
}

interface TimelineEntry {
  id: string;
  occurred_at: string;
  title: string;
  meta?: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
  actor: { id: string; name: string } | null;
  source: string;
}

interface TimelineResponse {
  items: TimelineEntry[];
}

/** Shape of each entry in Plan 08-02's `GET
 * /api/v1/operating-picture/facilities` response (backend/src/modules/
 * integration-gateway/facility-adapter.ts's facilityRoutes). Unlike
 * `ApiMarker` above, this carries `source`/`as_of` directly on the marker
 * object — EACH facility has its OWN independent provenance (one row per
 * facility, synced at its own time), not a shared base-layer one the way
 * incidents/resources piggyback on `status_bar`. Intentionally has no
 * inventory/maintenance/cost field: F17's "never render such data" rule is
 * enforced structurally here — there is nothing on this interface for the
 * popup below to destructure even if it tried. */
interface ApiFacilityMarker {
  id: string;
  type: 'facility';
  shape: 'square';
  tone: string;
  label: string;
  status: string;
  location: { lat: number; lng: number };
  source: string;
  as_of: string;
}

interface FacilitiesResponse {
  markers: ApiFacilityMarker[];
}

/** Exact FRD tone mapping for incident severity (same mapping IncidentList/
 * IncidentWorkspace use) — rendered via Badge, never a raw colored span. */
const SEVERITY_TONE: Record<Severity, BadgeTone> = {
  Critical: 'danger',
  Elevated: 'warning',
  Watch: 'info',
  Normal: 'success',
};

/** Legend label per marker tone — inverse of operating-picture.ts's
 * severityToTone() mapping, since each severity maps 1:1 onto a distinct
 * tone in the incident marker set. */
const TONE_LEGEND_LABEL: Record<string, string> = {
  danger: 'Critical incident',
  warning: 'Elevated incident',
  info: 'Watch incident',
  success: 'Normal incident',
};

/** Same tone vocabulary 03-06's ResourceRequestList.tsx established for its
 * own status Badge (Draft/Awaiting approval/Approved are the only statuses
 * that can ever reach a marker — Fulfilled/Declined are excluded from
 * operating-picture.ts's query entirely, so they're omitted here).
 * Duplicated inline rather than imported across page modules — the small
 * mapping is cheaper to repeat than to colocate/export from a sibling
 * page's file. */
const RESOURCE_STATUS_TONE: Record<string, BadgeTone> = {
  Draft: 'neutral',
  'Awaiting approval': 'warning',
  Approved: 'info',
};

/** Facility markers carry a free-form `tone` string from the backend's own
 * `facilityStatusToTone()` (currently 'success' | 'warning', but this
 * guard is deliberately broader than that function's current return type
 * so a future backend tone addition doesn't need a matching frontend
 * change) — validated against `BadgeTone`'s real vocabulary before being
 * passed to `Badge`, falling back to 'neutral' for anything unrecognized. */
const VALID_BADGE_TONES: ReadonlySet<string> = new Set<BadgeTone>([
  'neutral',
  'brand',
  'info',
  'success',
  'warning',
  'danger',
]);

/** operating-picture.ts's resource-marker `label` field is always
 * `"${quantity} ${resource_type}"` (its own mapping comment documents this
 * exact format) — split it back into the popup's 2-3 individual facts
 * rather than refetching full resource-request detail for a popup that
 * already has everything it needs in the thin marker shape. */
function parseResourceMarkerLabel(label: string): { quantity: string; resourceType: string } {
  const [quantity, ...rest] = label.split(' ');
  return { quantity, resourceType: rest.join(' ') };
}

function formatTimeHHMM(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Lat/lng -> MapCanvas x/y (0-100 percent) linear projection. `MapCanvas`
 * (02-04) takes percent-based `x`/`y` by design — it documents this as the
 * abstraction a real map engine's own screen-coordinate output would
 * replace (see MapCanvas.tsx's file header, "Integrating a real map
 * engine"). No MapLibre/Leaflet/ArcGIS JS license or tile-server credential
 * exists in this sandbox, so Phase 2 ships this linear approximation
 * instead: a simple min/max bounding-box projection, not a true map
 * projection (no Mercator correction, no antimeridian handling). `bbox` is
 * `[minLng, minLat, maxLng, maxLat]` — the same order the backend's own
 * `fetchGisFeatures(layerId, bbox)` call uses.
 */
function projectToPercent(
  lat: number,
  lng: number,
  bbox: [number, number, number, number],
): { x: number; y: number } {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;
  const x = lngSpan === 0 ? 50 : ((lng - minLng) / lngSpan) * 100;
  // North is up: y=0 at maxLat, y=100 at minLat.
  const y = latSpan === 0 ? 50 : ((maxLat - lat) / latSpan) * 100;
  return { x, y };
}

/** Wide CONUS-ish default bbox, used only when there are zero markers to
 * derive a bbox from (an empty operating picture still needs a defined
 * viewport to render the (empty) overlay against). */
const DEFAULT_BBOX: [number, number, number, number] = [-125, 24, -66, 50];

function computeBbox(
  markers: Array<{ location: { lat: number; lng: number } }>,
): [number, number, number, number] {
  if (markers.length === 0) {
    return DEFAULT_BBOX;
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const marker of markers) {
    minLat = Math.min(minLat, marker.location.lat);
    maxLat = Math.max(maxLat, marker.location.lat);
    minLng = Math.min(minLng, marker.location.lng);
    maxLng = Math.max(maxLng, marker.location.lng);
  }
  // Small padding margin so a marker at the exact edge of the bbox isn't
  // rendered flush against MapCanvas's border.
  const latPad = Math.max((maxLat - minLat) * 0.15, 0.5);
  const lngPad = Math.max((maxLng - minLng) * 0.15, 0.5);
  return [minLng - lngPad, minLat - latPad, maxLng + lngPad, maxLat + latPad];
}

/**
 * F2 S2.1 — Operating Picture. Routed `/operating-picture`.
 *
 * Accepts an optional `?incident={id}` query param (per 02-06's
 * `IncidentWorkspace`'s "View on operating picture" deep-link) to
 * pre-select that marker's popup on load.
 *
 * Polls both endpoints every 30s rather than subscribing to a live event
 * feed — a documented Phase 2 simplification: F10's event bus exists
 * (Phase 1) but no `incident.activation_changed`-driven map-refresh
 * consumer is built in this phase. A later phase wiring that event into a
 * live refresh should replace this polling (see this plan's own
 * threat-model note T-02-14).
 */
export function OperatingPicture(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedId, setSelectedId] = React.useState<string | undefined>(
    () => searchParams.get('incident') ?? undefined,
  );
  const [layersOpen, setLayersOpen] = React.useState(false);
  const [layerVisibility, setLayerVisibility] = React.useState<Record<string, boolean>>({});
  // Caller-contract focus-return (MapPopup.tsx's documented contract, same
  // pattern Modal used in Phase 1): store the marker element that was
  // focused when the popup opened, restore focus to it on close.
  const lastFocusedMarkerRef = React.useRef<HTMLElement | null>(null);

  const markersQuery = useQuery({
    queryKey: ['operating-picture-markers'],
    queryFn: () => {
      // Test-only failure-injection pass-through: never surfaced in any
      // user-facing control. Threads 02-03's backend `force_gis_failure`
      // query param through to the markers request so this plan's own
      // Playwright test (and any future manual QA) can exercise the
      // degraded path via a normal page load — no server restart, no
      // mocking.
      const pageParams = new URLSearchParams(window.location.search);
      const forceFailure = pageParams.get('force_gis_failure');
      const url =
        forceFailure === 'true'
          ? '/api/v1/operating-picture/markers?force_gis_failure=true'
          : '/api/v1/operating-picture/markers';
      return apiGet<MarkersResponse>(url);
    },
    refetchInterval: 30_000,
  });

  const layersQuery = useQuery({
    queryKey: ['operating-picture-layers'],
    queryFn: () => apiGet<LayersResponse>('/api/v1/operating-picture/layers'),
    refetchInterval: 30_000,
  });

  // Phase 8 (08-04, F17): facility markers, same 30s poll cadence as the
  // above two queries. A separate endpoint (not merged into the backend's
  // existing markers response) per Plan 08-02's own file-ownership note —
  // this page merges the two client-side instead.
  const facilitiesQuery = useQuery({
    queryKey: ['operating-picture-facilities'],
    queryFn: () => apiGet<FacilitiesResponse>('/api/v1/operating-picture/facilities'),
    refetchInterval: 30_000,
  });

  const facilityMarkers = facilitiesQuery.data?.markers ?? [];

  // Which marker is currently selected, and its type — needed BEFORE the
  // detail queries below so they only fire for an incident-type selection.
  // A resource-type selection needs no extra fetch at all: its marker
  // object already carries everything the popup shows (label/status), per
  // Task 1's thin MapMarker shape — see popupNode below. A facility-type
  // selection is the same: its full marker object (including its own
  // source/as_of) is already in `facilityMarkers`, so it must ALSO be
  // excluded from the incident-detail queries below — selecting a facility
  // marker id was never an incident id, and firing that fetch would just
  // 404/error for no reason.
  const selectedMarker = markersQuery.data?.markers.find((m) => m.id === selectedId);
  const selectedIsResource = selectedMarker?.type === 'resource';
  const selectedIsFacility = facilityMarkers.some((f) => f.id === selectedId);

  const selectedIncidentQuery = useQuery({
    queryKey: ['incident', selectedId],
    queryFn: () => apiGet<SelectedIncidentDetail>(`/api/v1/incidents/${selectedId}`),
    enabled: Boolean(selectedId) && !selectedIsResource && !selectedIsFacility,
  });

  const selectedTimelineQuery = useQuery({
    queryKey: ['incident-timeline', selectedId],
    queryFn: () => apiGet<TimelineResponse>(`/api/v1/incidents/${selectedId}/timeline`),
    enabled: Boolean(selectedId) && !selectedIsResource && !selectedIsFacility,
  });

  // Phase 2 has exactly one real layer ("incidents") — default every
  // layer's visibility to its own `checked` value from the backend the
  // first time it's seen, without clobbering a visibility the user has
  // since toggled.
  React.useEffect(() => {
    if (!layersQuery.data) return;
    setLayerVisibility((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const layer of layersQuery.data.layers) {
        if (!(layer.id in next)) {
          next[layer.id] = layer.checked;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [layersQuery.data]);

  const apiMarkers = markersQuery.data?.markers ?? [];
  // Each marker type maps to its own layer id (02-03/this plan's backend
  // `GET .../layers` entries: 'incidents' for type:'incident', 02-03's
  // original layer; 'resource-requests' for type:'resource', this plan's
  // addition) — so toggling one layer off filters only its own marker
  // type, not the whole response. Phase 2's code toggled the entire
  // response on the single 'incidents' layer's visibility alone, which
  // would have incorrectly hidden resource markers too now that a second
  // layer/marker-type exists (Rule 1 fix: generalizing a type==='incident'
  // assumption Phase 2 had no resource markers to assume against).
  //
  // Hazard/weather layers (F12) are LayerPanel-only overlay rows with no
  // corresponding point marker — they never need an entry in this map.
  // (Phase 7, 07-03: the backend's `hazard-<feed>` layer entries only ever
  // appear in `layersForPanel` below, never as a `canvasMarkers` row, since
  // no marker's `type` is ever `'hazard'`.)
  // Phase 8 (08-04): 'facilities' is deliberately a layer id that doesn't
  // exist in `layersForPanel` yet — the fallback `layerVisibility[layerId]
  // ?? true` below means facility markers are visible-by-default with no
  // LayerPanel toggle, which is all this plan's success criteria require
  // (markers + Provenance + legend, not a toggle). A future LayerPanel
  // entry for facilities is a reasonable follow-up, not required here.
  const MARKER_TYPE_TO_LAYER_ID: Record<string, string> = {
    incident: 'incidents',
    resource: 'resource-requests',
    facility: 'facilities',
  };
  // Merge incidents+resources (apiMarkers) with facilities (facilityMarkers,
  // its own separate poll) into one combined set BEFORE the shared
  // visibility filter, so a future facility LayerPanel toggle would affect
  // only facility markers, not the whole response.
  const allMarkers: Array<ApiMarker | ApiFacilityMarker> = [...apiMarkers, ...facilityMarkers];
  const visibleMarkers = allMarkers.filter((marker) => {
    const layerId = MARKER_TYPE_TO_LAYER_ID[marker.type] ?? marker.type;
    return layerVisibility[layerId] ?? true;
  });

  const bbox = React.useMemo(() => computeBbox(visibleMarkers), [visibleMarkers]);

  const canvasMarkers: CanvasMapMarker[] = React.useMemo(
    () =>
      visibleMarkers.map((marker) => {
        const { x, y } = projectToPercent(marker.location.lat, marker.location.lng, bbox);
        return {
          id: marker.id,
          x,
          y,
          type: marker.type,
          tone: marker.tone,
          label: marker.label,
          status: marker.status,
        };
      }),
    [visibleMarkers, bbox],
  );

  // Phase 2's own comment here read "Phase 2 only ever shows
  // {kind:'marker', type:'incident',...}-style entries since facilities/
  // resources don't exist yet" — closed by this plan (03-09): resources now
  // DO exist, so a second entry is appended below whenever at least one
  // resource marker is present in the current response.
  const legendItems: MapLegendItem[] = React.useMemo(() => {
    const incidentTones = Array.from(
      new Set(canvasMarkers.filter((m) => m.type === 'incident').map((m) => m.tone)),
    );
    const items: MapLegendItem[] = incidentTones.map((tone) => ({
      kind: 'marker',
      type: 'incident',
      tone,
      label: TONE_LEGEND_LABEL[tone] ?? 'Incident',
    }));
    const hasResourceMarker = canvasMarkers.some((m) => m.type === 'resource');
    if (hasResourceMarker) {
      items.push({ kind: 'marker', type: 'resource', tone: 'warning', label: 'Resource request' });
    }
    // Phase 8 (08-04, F17): one representative Facility legend entry
    // (fixed 'brand' tone) whenever at least one facility marker is
    // present — matching 03-09's resource-marker precedent of one fixed
    // tone per TYPE in the legend, not one entry per status.
    const hasFacilityMarker = canvasMarkers.some((m) => m.type === 'facility');
    if (hasFacilityMarker) {
      items.push({ kind: 'marker', type: 'facility', tone: 'brand', label: 'Facility' });
    }
    return items;
  }, [canvasMarkers]);

  const layersForPanel: MapLayer[] = (layersQuery.data?.layers ?? []).map((layer) => ({
    id: layer.id,
    label: layer.label,
    source: layer.source,
    asOf: layer.as_of ? formatTimeHHMM(layer.as_of) : undefined,
    verified: layer.verified,
    count: layer.count,
    checked: layerVisibility[layer.id] ?? layer.checked,
  }));

  // The SAME backend status_bar.base_layer_source string drives BOTH the
  // visible status text AND MapCanvas's `offline` prop (derived, never
  // independently tracked) — they can never disagree per this plan's
  // must_haves truth.
  const baseLayerSource = markersQuery.data?.status_bar.base_layer_source;
  const isOffline = baseLayerSource === 'Schematic base map, offline';

  // Status bar must never be blank/stale-looking, even before the first
  // fetch resolves.
  const statusBarText = markersQuery.isLoading
    ? 'As of -- ET \u00b7 Base layer: Loading\u2026'
    : markersQuery.data
      ? `As of ${formatTimeHHMM(markersQuery.data.status_bar.as_of)} ET \u00b7 Base layer: ${markersQuery.data.status_bar.base_layer_source}`
      : 'As of -- ET \u00b7 Base layer: Unavailable';

  const handleSelect = (id: string) => {
    lastFocusedMarkerRef.current = document.activeElement as HTMLElement | null;
    setSelectedId(id);
  };

  const handleClosePopup = () => {
    setSelectedId(undefined);
    lastFocusedMarkerRef.current?.focus();
  };

  const handleLayerToggle = (id: string, checked: boolean) => {
    setLayerVisibility((prev) => ({ ...prev, [id]: checked }));
  };

  const timelineItems: TimelineItem[] = (selectedTimelineQuery.data?.items ?? []).map((entry) => ({
    time: formatTimeHHMM(entry.occurred_at),
    title: entry.title,
    meta: `${entry.actor?.name ?? 'System'} via ${entry.source}`,
    tone: entry.tone,
  }));

  const selectedIncident = selectedIncidentQuery.data;

  // Branches on marker.type per this plan's objective: a resource-type
  // selection renders its popup directly from the thin marker object
  // already in hand (no extra fetch — see selectedIsResource above),
  // mirroring the incident-marker popup's structure (title/badge/facts/
  // deep-link action) but with resource-specific facts and a deep-link to
  // ResourceRequestDetail (03-06) instead of the Incident Workspace.
  const popupNode = (() => {
    if (!selectedId) return null;

    if (selectedIsResource && selectedMarker) {
      const { quantity, resourceType } = parseResourceMarkerLabel(selectedMarker.label);
      const tone = RESOURCE_STATUS_TONE[selectedMarker.status] ?? 'neutral';
      return (
        <MapPopup
          title={selectedMarker.label}
          badge={<Badge tone={tone}>{selectedMarker.status}</Badge>}
          actions={[
            <Button
              key="open"
              variant="primary"
              onClick={() => navigate(`/resource-requests/${selectedId}`)}
            >
              Open request
            </Button>,
          ]}
          onClose={handleClosePopup}
        >
          <p>Resource type: {resourceType}</p>
          <p>Quantity: {quantity}</p>
          <p>Status: {selectedMarker.status}</p>
        </MapPopup>
      );
    }

    // Phase 8 (08-04, F17): a facility-type selection renders directly
    // from the thin facility marker object already in hand (same
    // no-extra-fetch pattern as the resource branch above) — ONLY
    // title/badge/provenance/one status fact, since `ApiFacilityMarker`
    // (declared above) has no inventory/maintenance/cost field to
    // reference in the first place. This is the structural enforcement of
    // F17's "no such field ever displayed" rule at the frontend layer,
    // mirroring how Plan 08-02's backend enforces it at the adapter layer.
    if (selectedIsFacility) {
      const facility = facilityMarkers.find((f) => f.id === selectedId);
      if (!facility) return null;
      const tone = VALID_BADGE_TONES.has(facility.tone) ? (facility.tone as BadgeTone) : 'neutral';
      return (
        <MapPopup
          title={facility.label}
          badge={<Badge tone={tone}>{facility.status}</Badge>}
          provenance={<Provenance source={facility.source} time={formatTimeHHMM(facility.as_of)} />}
          onClose={handleClosePopup}
        >
          <p>Status: {facility.status}</p>
        </MapPopup>
      );
    }

    if (!selectedIncident) return null;

    return (
      <MapPopup
        title={selectedIncident.name}
        badge={<Badge tone={SEVERITY_TONE[selectedIncident.severity]}>{selectedIncident.severity}</Badge>}
        provenance={
          baseLayerSource ? (
            <Provenance
              source={baseLayerSource}
              time={markersQuery.data ? formatTimeHHMM(markersQuery.data.status_bar.as_of) : undefined}
              verified={!isOffline}
            />
          ) : undefined
        }
        actions={[
          <Button key="open" variant="primary" onClick={() => navigate(`/incidents/${selectedId}`)}>
            Open incident
          </Button>,
        ]}
        onClose={handleClosePopup}
      >
        <p>Activation: {selectedIncident.activation_level}</p>
        <p>Jurisdiction: {selectedIncident.jurisdiction.name}</p>
        <p>Opened: {formatDate(selectedIncident.opened_at)}</p>
      </MapPopup>
    );
  })();

  return (
    <div className="ep-operating-picture">
      <PageHeader title="Operating picture" />

      <div className="ep-operating-picture__layout">
        <MapCanvas
          height={600}
          markers={canvasMarkers}
          selectedId={selectedId}
          onSelect={handleSelect}
          topRight={
            <div className="ep-operating-picture__top-right">
              <MapControls
                // Phase 2 has no real zoom/pan engine underneath to drive
                // (see projectToPercent's doc comment) — these are
                // structural placeholders satisfying MapControls' contract,
                // not functional zoom.
                onZoomIn={() => {}}
                onZoomOut={() => {}}
                onLayers={() => setLayersOpen((open) => !open)}
                layersOpen={layersOpen}
              />
              {layersOpen ? (
                <LayerPanel
                  layers={layersForPanel}
                  onToggle={handleLayerToggle}
                  onClose={() => setLayersOpen(false)}
                />
              ) : null}
            </div>
          }
          bottomLeft={legendItems.length > 0 ? <MapLegend items={legendItems} /> : undefined}
          popup={popupNode}
          status={statusBarText}
          offline={isOffline}
          label="Operating picture map"
        />

        <div className="ep-operating-picture__side">
          {selectedId ? (
            <>
              <Card title="Timeline">
                {selectedTimelineQuery.isLoading ? (
                  <EmptyState title="Loading timeline\u2026" />
                ) : timelineItems.length > 0 ? (
                  <Timeline items={timelineItems} />
                ) : (
                  <EmptyState title="No activity yet" />
                )}
              </Card>
              <Card title="Tasks">
                <EmptyState title="Tasks ship in a later phase">
                  Task tracking (F4) is built in Phase 3.
                </EmptyState>
              </Card>
            </>
          ) : (
            <EmptyState title="Select an incident">
              Click a marker to see its timeline here.
            </EmptyState>
          )}
        </div>
      </div>
    </div>
  );
}
