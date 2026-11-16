import * as React from 'react';
import { Card } from '../layout/Card';
import './MapLegend.css';

/**
 * EPMP Design System — MapLegend (MAPS)
 *
 * Explains the symbols on the map: marker glyphs (shape plus tone), hazard
 * areas, and lines. Always visible in the operating picture, collapsible
 * on mobile.
 *
 * **Caller contract:** pass only the glyphs currently drawn on the paired
 * `MapCanvas` — this component does not know what's actually rendered, so
 * a stale/over-inclusive `items` array is the caller's bug to avoid, per
 * the spec's "list only what is currently visible" rule.
 */

export type MapLegendItemKind = 'marker' | 'area' | 'line' | 'boundary';

export interface MapLegendItem {
  kind: MapLegendItemKind;
  /** For kind="marker": 'incident' | 'facility' | 'resource' | 'shelter'. */
  type?: string;
  tone?: string;
  dashed?: boolean;
  label: string;
}

export interface MapLegendProps {
  items: MapLegendItem[];
  title?: string;
}

function toneVar(tone?: string): string {
  return tone ? `var(--${tone}-solid, var(--brand))` : 'var(--brand)';
}

function Glyph({ item }: { item: MapLegendItem }) {
  if (item.kind === 'marker') {
    const shapeClass =
      item.type === 'incident'
        ? 'ep-map-legend__glyph--diamond'
        : item.type === 'facility'
          ? 'ep-map-legend__glyph--square'
          : item.type === 'resource'
            ? 'ep-map-legend__glyph--triangle'
            : 'ep-map-legend__glyph--circle';
    return (
      <span
        className={`ep-map-legend__glyph ${shapeClass}`}
        style={{ background: toneVar(item.tone) }}
        aria-hidden="true"
      />
    );
  }
  if (item.kind === 'area') {
    return (
      <span
        className="ep-map-legend__glyph ep-map-legend__glyph--area"
        style={{ background: toneVar(item.tone) }}
        aria-hidden="true"
      />
    );
  }
  if (item.kind === 'line') {
    return (
      <span
        className={[
          'ep-map-legend__glyph',
          'ep-map-legend__glyph--line',
          item.dashed ? 'ep-map-legend__glyph--dashed' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
    );
  }
  // boundary
  return (
    <span
      className="ep-map-legend__glyph ep-map-legend__glyph--boundary"
      aria-hidden="true"
    />
  );
}

export function MapLegend({ items, title }: MapLegendProps) {
  return (
    <Card padded={false} title={title}>
      <ul className="ep-map-legend__list">
        {items.map((item, i) => (
          <li key={i} className="ep-map-legend__item">
            <Glyph item={item} />
            <span className="caption">{item.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
