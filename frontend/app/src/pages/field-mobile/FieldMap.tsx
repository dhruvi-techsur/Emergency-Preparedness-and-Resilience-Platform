import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapCanvas, Button, type MapMarker } from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';
import { subscribeToQueue, type QueueSnapshot } from '../../lib/offline-queue';
import { FieldMobileShell } from '../../lib/field-mobile-shell';
import './FieldMap.css';

/** Shape of each entry in GET /api/v1/operating-picture/markers's
 * `markers` array (02-07/03-09's backend/src/modules/incident-ops/
 * operating-picture.ts) -- reused AS-IS per this plan's explicit
 * "lightweight operating picture" framing, no backend change. */
interface ApiMarker {
  id: string;
  type: 'incident' | 'facility' | 'resource' | 'shelter';
  tone: string;
  label: string;
  status: string;
  location: { lat: number; lng: number };
}

interface MarkersResponse {
  markers: ApiMarker[];
  status_bar: { as_of: string; base_layer_source: string };
}

/** Wide CONUS-ish default bbox, used only when there are zero markers to
 * derive a bbox from -- same fallback OperatingPicture.tsx (02-07) uses
 * for its own empty-map case. */
const DEFAULT_BBOX: [number, number, number, number] = [-125, 24, -66, 50];

function computeBbox(
  locations: Array<{ lat: number; lng: number }>,
): [number, number, number, number] {
  if (locations.length === 0) {
    return DEFAULT_BBOX;
  }
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const loc of locations) {
    minLat = Math.min(minLat, loc.lat);
    maxLat = Math.max(maxLat, loc.lat);
    minLng = Math.min(minLng, loc.lng);
    maxLng = Math.max(maxLng, loc.lng);
  }
  const latPad = Math.max((maxLat - minLat) * 0.15, 0.5);
  const lngPad = Math.max((maxLng - minLng) * 0.15, 0.5);
  return [minLng - lngPad, minLat - latPad, maxLng + lngPad, maxLat + latPad];
}

/** Identical linear lat/lng -> MapCanvas x/y (0-100 percent) projection to
 * OperatingPicture.tsx's (02-07) own `projectToPercent` -- duplicated
 * inline rather than imported across page modules, matching that file's
 * own documented precedent for this exact function. */
function projectToPercent(
  lat: number,
  lng: number,
  bbox: [number, number, number, number],
): { x: number; y: number } {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  const lngSpan = maxLng - minLng;
  const latSpan = maxLat - minLat;
  const x = lngSpan === 0 ? 50 : ((lng - minLng) / lngSpan) * 100;
  const y = latSpan === 0 ? 50 : ((maxLat - lat) / latSpan) * 100;
  return { x, y };
}

/**
 * Reactive connectivity hook, local to this screen. `MapCanvas`'s
 * `offline` prop needs to flip live as the browser's own connectivity
 * changes, not just read once on mount — this subscribes directly to the
 * SAME native `online`/`offline` window events `offline-queue.ts` already
 * listens to (rather than piggybacking on `getQueueSnapshot()`'s derived
 * `state`, which can read `'conflict'` instead of `'offline'` when both
 * conditions hold simultaneously — not the right source for "is the
 * device actually offline right now").
 */
function useOnlineStatus(): boolean {
  const [online, setOnline] = React.useState(() => navigator.onLine);
  React.useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);
  return online;
}

function formatAsOf(): string {
  return new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/**
 * F6 S6.6 — Field Map, "a lightweight operating-picture view" per the
 * mockup. Routed `/field/map`. Merges Phase 2/3's real operating-picture
 * markers (incidents/resources) with the offline-queue's own PENDING,
 * location-tagged field reports — a responder sees both confirmed
 * situational-awareness markers AND their own not-yet-synced observations
 * on the same map, visually distinguished (dashed outline, see
 * FieldMap.css). `offline` affects ONLY the base-layer rendering
 * (MapCanvas's own documented contract) — markers always render
 * identically regardless of connectivity.
 */
export function FieldMap(): JSX.Element {
  const navigate = useNavigate();
  const isOffline = useOnlineStatus();
  const [snapshot, setSnapshot] = React.useState<QueueSnapshot | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToQueue(setSnapshot);
    return unsubscribe;
  }, []);

  const { data } = useQuery({
    queryKey: ['operating-picture-markers-field'],
    queryFn: () => apiGet<MarkersResponse>('/api/v1/operating-picture/markers'),
    refetchInterval: 30_000,
  });

  const apiMarkers = data?.markers ?? [];

  // Pending field_reports with a location set — mapped to a synthetic
  // marker. The design system's `MapMarkerType` union (incident/facility/
  // resource/shelter) has no dedicated "field report" entry, and
  // extending that SHARED type is out of this plan's scope since 02-07/
  // 03-09 and any other map consumer depend on it unchanged. `'resource'`
  // is the closest existing type to an unconfirmed field observation —
  // the dashed-outline styling below (not a new marker type) is what
  // actually distinguishes it visually.
  const pendingLocationMarkers = (snapshot?.items ?? []).filter(
    (item) => item.queue_status === 'pending' && item.location,
  );

  const allLocations = [
    ...apiMarkers.map((m) => m.location),
    ...pendingLocationMarkers.map((item) => item.location!),
  ];
  const bbox = computeBbox(allLocations);

  const canvasMarkers: MapMarker[] = [
    ...apiMarkers.map((marker) => {
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
    // `status: 'Pending sync'` is deliberately distinct from every real
    // operating-picture status string — MapCanvas renders no per-marker
    // id/data-attribute to target directly (its DOM node's only
    // identifying attribute is `aria-label`, built from `label`/
    // `status`), so FieldMap.css's dashed-outline rule below selects on
    // this exact aria-label substring rather than a marker id.
    ...pendingLocationMarkers.map((item) => {
      const { x, y } = projectToPercent(item.location!.lat, item.location!.lng, bbox);
      return {
        id: `queued-${item.client_report_id}`,
        x,
        y,
        type: 'resource' as const,
        tone: 'warning',
        label: item.observation_type || 'Field observation',
        status: 'Pending sync',
      };
    }),
  ];

  return (
    <FieldMobileShell>
      <div className="ep-field-map">
        <MapCanvas
          height="calc(100vh - 160px)"
          markers={canvasMarkers}
          offline={isOffline}
          status={`As of ${formatAsOf()}`}
          label="Field map"
        />
      </div>

      <div className="ep-field-map__action-bar">
        <Button
          variant="primary"
          size="lg"
          icon="send"
          block
          onClick={() => navigate('/field/report')}
        >
          Report observation
        </Button>
      </div>
    </FieldMobileShell>
  );
}
