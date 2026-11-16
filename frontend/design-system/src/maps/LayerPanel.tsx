import * as React from 'react';
import { Checkbox } from '../forms/Checkbox';
import { Provenance } from '../product-patterns/Provenance';
import './LayerPanel.css';

/**
 * EPMP Design System — LayerPanel (MAPS)
 *
 * A checklist of map layers that always shows each layer's source and data
 * age, plus an "Unverified" flag where relevant. It is how provenance
 * reaches the map: users see what each layer is, who supplies it and how
 * fresh it is before they trust it.
 *
 * `onToggle(id, checked)` fires immediately on click/keypress — there is no
 * separate "save" button and no `onSave` prop anywhere in this component's
 * API, structurally enforcing "toggling a layer is immediate, no save
 * step."
 *
 * **Ordering contract:** pass `layers` pre-ordered — incidents first,
 * reference layers last, per the spec's ordering rule. This component
 * renders in array order; it does not re-sort.
 */

export interface MapLayer {
  id: string;
  label: string;
  source: string;
  asOf?: string;
  verified?: boolean;
  count?: number;
  checked: boolean;
}

export interface LayerPanelProps {
  layers: MapLayer[];
  /** Fires immediately on toggle — no separate save step. */
  onToggle: (id: string, checked: boolean) => void;
  title?: string;
  onClose?: () => void;
}

export function LayerPanel({ layers, onToggle, title = 'Layers', onClose }: LayerPanelProps) {
  return (
    <div className="ep-layer-panel">
      <div className="ep-layer-panel__header">
        <h3 className="ep-layer-panel__title h4">{title}</h3>
        {onClose ? (
          <button
            type="button"
            className="ep-layer-panel__close"
            aria-label="Close layers panel"
            onClick={onClose}
          >
            ×
          </button>
        ) : null}
      </div>
      <ul className="ep-layer-panel__list">
        {layers.map((layer) => (
          <li key={layer.id} className="ep-layer-panel__item">
            <Checkbox
              label={
                <span className="ep-layer-panel__row">
                  <span className="ep-layer-panel__label">
                    {layer.label}
                    {typeof layer.count === 'number' ? ` (${layer.count})` : ''}
                  </span>
                  {layer.verified === false ? (
                    <Provenance source={layer.source} time={layer.asOf} verified={false} />
                  ) : (
                    <span className="caption ep-layer-panel__meta">
                      {layer.source} · {layer.asOf ? `As of ${layer.asOf}` : 'No data yet'}
                    </span>
                  )}
                </span>
              }
              checked={layer.checked}
              onChange={(event) => onToggle(layer.id, event.target.checked)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
