import * as React from 'react';
import './MapPopup.css';

/**
 * EPMP Design System — MapPopup (MAPS)
 *
 * A compact card for the selected map feature: name, status `Badge`, key
 * facts, `Provenance` of the data and one or two actions. Anchor it
 * bottom-center inside `MapCanvas` via the `popup` slot (or beside the
 * feature in your map engine).
 *
 * Status is always a `Badge` (icon + word), never color alone — pass the
 * `badge` prop a rendered `Badge` element.
 *
 * **Caller contract — focus return:** closing this popup MUST return focus
 * to the originating marker. This component does not know which marker
 * triggered it, so (same documented-caller-contract pattern `Modal` used
 * in Phase 1) the caller is responsible for storing/restoring
 * `document.activeElement` around the open/close cycle.
 *
 * **Shadow exception:** `MapPopup` floats above the map surface, so it
 * uses `shadow-lg` at rest — the one context besides `Modal` where a
 * shadow at rest is correct (`MapPopup` is not built on `Card`, which is
 * shadow-free by hard rule).
 */

export interface MapPopupProps {
  /** Required. */
  title: React.ReactNode;
  /** 2-3 facts. Required. */
  children: React.ReactNode;
  /** Status indicator — always a rendered `Badge` element, never color alone. */
  badge?: React.ReactNode;
  /** A rendered `Provenance` element. */
  provenance?: React.ReactNode;
  /** 1-2 Button elements. */
  actions?: React.ReactNode;
  /** Required. See the focus-return caller contract above. */
  onClose: () => void;
}

export function MapPopup({ title, children, badge, provenance, actions, onClose }: MapPopupProps) {
  return (
    <div className="ep-map-popup" role="dialog" aria-label={typeof title === 'string' ? title : undefined}>
      <div className="ep-map-popup__header">
        <div className="ep-map-popup__heading">
          <h3 className="ep-map-popup__title">{title}</h3>
          {badge ? <span className="ep-map-popup__badge">{badge}</span> : null}
        </div>
        <button
          type="button"
          className="ep-map-popup__close"
          aria-label="Close"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="ep-map-popup__facts">{children}</div>
      {provenance ? <div className="ep-map-popup__provenance">{provenance}</div> : null}
      {actions ? <div className="ep-map-popup__actions">{actions}</div> : null}
    </div>
  );
}
