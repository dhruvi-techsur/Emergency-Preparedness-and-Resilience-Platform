import * as React from 'react';
import './MapCanvas.css';

/**
 * EPMP Design System — MapCanvas (MAPS)
 *
 * The map surface and its overlay language. In production, put the
 * agency's own GIS base layer (Esri, OSM-derived, MapLibre) under it and
 * style that base with the `map-*` tokens; `MapCanvas` then draws EPMP data
 * on top and provides the control, legend, popup and status-bar slots. With
 * no tiles (`offline`/degraded mode) it renders a schematic base so the
 * operating picture stays usable, and says so.
 *
 * **Critical offline contract:** `offline` affects ONLY the base-layer
 * rendering (the hatched fill + "Schematic base map, offline" label).
 * `markers`/`areas`/`lines` from props always render identically regardless
 * of `offline`'s value — this is the literal mechanism satisfying "the page
 * never fails to render." Never gate marker/area/line rendering on
 * `offline` — only the base fill/label branch may read that prop.
 *
 * Markers differ by SHAPE (incident diamond, facility square, resource
 * triangle, shelter circle) and tone by status, all outlined in `ink` for
 * 3:1 contrast against any base; selection adds a `focus-ring` halo. Every
 * marker is keyboard focusable (Tab + Enter/Space calls `onSelect`) and is
 * also listed in a visually-hidden (not `display:none`) text list, giving
 * screen-reader users the same information set as the visual map.
 */

export type MapMarkerType = 'incident' | 'facility' | 'resource' | 'shelter';

export interface MapMarker {
  id: string;
  /** 0-100, percent of canvas width/height — map your projection to these
   * or replace with your engine's overlay (see `basemap={false}`). */
  x: number;
  y: number;
  type: MapMarkerType;
  /** Status color token family, e.g. 'danger' | 'warning' | 'success' | 'info' | 'brand'. */
  tone: string;
  label: string;
  status: string;
}

export interface MapArea {
  id: string;
  /** Polygon points as "x,y" percent pairs, e.g. ["10,10","20,15","15,25"]. */
  points: string[];
  tone: string;
  label: string;
}

export interface MapLine {
  id: string;
  points: string[];
  kind: string;
  dashed?: boolean;
}

export interface MapCanvasProps {
  /** Required. Canvas height (px or any CSS length). */
  height: number | string;
  markers?: MapMarker[];
  areas?: MapArea[];
  lines?: MapLine[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  popup?: React.ReactNode;
  /** Rendered in the bottom status bar, e.g. "As of 08:14". */
  status?: string;
  attribution?: string;
  /** When true, renders a visibly schematic/hatched base instead of a real
   * tile/vector base, with a "Schematic base map, offline" label. Markers
   * still render identically. */
  offline?: boolean;
  label?: string;
  /** Default true. False renders a transparent background for overlaying a
   * real map engine underneath. */
  basemap?: boolean;
}

const SHAPE_CLASS_FOR_TYPE: Record<MapMarkerType, string> = {
  incident: 'ep-map-marker--diamond',
  facility: 'ep-map-marker--square',
  resource: 'ep-map-marker--triangle',
  shelter: 'ep-map-marker--circle',
};

function toneVar(tone: string): string {
  // Status color token family — matching var(--danger-solid) etc.
  return `var(--${tone}-solid, var(--brand))`;
}

export function MapCanvas({
  height,
  markers = [],
  areas = [],
  lines = [],
  selectedId,
  onSelect,
  topLeft,
  topRight,
  bottomLeft,
  popup,
  status,
  attribution,
  offline = false,
  label,
  basemap = true,
}: MapCanvasProps) {
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  function handleMarkerKeyDown(event: React.KeyboardEvent, id: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(id);
    }
  }

  const offlineBadge = offline ? (
    <div className="ep-map-canvas__offline-badge">Schematic base map, offline</div>
  ) : null;

  return (
    <div
      className={[
        'ep-map-canvas',
        basemap ? 'ep-map-canvas--basemap' : 'ep-map-canvas--transparent',
        offline ? 'ep-map-canvas--offline' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ height: heightValue }}
      role="group"
      aria-label={label ?? 'Map'}
    >
      {/* Top-left slot: caller's content, or (if unoccupied) the offline badge. */}
      <div className="ep-map-canvas__slot ep-map-canvas__slot--top-left">
        {topLeft ?? offlineBadge}
        {topLeft && offline ? offlineBadge : null}
      </div>
      <div className="ep-map-canvas__slot ep-map-canvas__slot--top-right">{topRight}</div>
      <div className="ep-map-canvas__slot ep-map-canvas__slot--bottom-left">{bottomLeft}</div>

      {/* Overlay layer — always renders regardless of `offline`. */}
      <svg className="ep-map-canvas__overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
        {areas.map((area) => (
          <polygon
            key={area.id}
            points={area.points.join(' ')}
            className="ep-map-area"
            style={{
              fill: toneVar(area.tone),
              fillOpacity: 'var(--opacity-hazard)',
              stroke: toneVar(area.tone),
            }}
          >
            <title>{area.label}</title>
          </polygon>
        ))}
        {lines.map((line) => (
          <polyline
            key={line.id}
            points={line.points.join(' ')}
            className="ep-map-line"
            style={{
              stroke: 'var(--ink)',
              strokeDasharray: line.dashed ? '4 3' : undefined,
            }}
          >
            <title>{line.kind}</title>
          </polyline>
        ))}
      </svg>

      {/* Visual markers — always render regardless of `offline`. */}
      <div className="ep-map-canvas__markers">
        {markers.map((marker) => (
          <div
            key={marker.id}
            className={[
              'ep-map-marker',
              SHAPE_CLASS_FOR_TYPE[marker.type],
              marker.id === selectedId ? 'ep-map-marker--selected' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              background: toneVar(marker.tone),
            }}
            tabIndex={0}
            role="button"
            aria-label={`${marker.label} — ${marker.status}`}
            aria-pressed={marker.id === selectedId || undefined}
            onClick={() => onSelect?.(marker.id)}
            onKeyDown={(event) => handleMarkerKeyDown(event, marker.id)}
          />
        ))}
      </div>

      {/* Screen-reader text list — same info set as the visual markers,
       * kept in the accessibility tree (clip:rect, never display:none). */}
      <ul className="ep-visually-hidden">
        {markers.map((marker) => (
          <li key={marker.id}>
            {marker.label} — {marker.status}
          </li>
        ))}
      </ul>

      {popup ? <div className="ep-map-canvas__popup-slot">{popup}</div> : null}

      {(status || attribution) && (
        <div className="ep-map-canvas__status-bar">
          {status ? <span className="ep-map-canvas__status">{status}</span> : null}
          {attribution ? (
            <span className="ep-map-canvas__attribution">{attribution}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}
