import * as React from 'react';
import { IconButton } from '../actions/IconButton';
import './MapControls.css';

/**
 * EPMP Design System — MapControls (MAPS)
 *
 * A vertical stack of icon buttons for zoom, location, layers and full
 * screen, in one `border-strong`-bordered group — meant to be placed in
 * `MapCanvas`'s `topRight` slot by the consumer.
 *
 * Pass only the handlers you support; buttons without a handler are not
 * shown (zoom is always shown, per the spec). This is structural: the
 * component never renders `onLocate`/`onLayers`/`onFullscreen`'s button
 * unless the corresponding handler prop is a function.
 */

export interface MapControlsProps {
  /** Required — always shown. */
  onZoomIn: () => void;
  /** Required — always shown. */
  onZoomOut: () => void;
  onLocate?: () => void;
  /** Toggles the LayerPanel; required alongside layersOpen to show the button. */
  onLayers?: () => void;
  layersOpen?: boolean;
  onFullscreen?: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onLayers,
  layersOpen = false,
  onFullscreen,
}: MapControlsProps) {
  return (
    <div className="ep-map-controls" role="group" aria-label="Map controls">
      <IconButton icon="plus" label="Zoom in" size="default" onClick={onZoomIn} />
      <IconButton icon="minus" label="Zoom out" size="default" onClick={onZoomOut} />
      {onLocate ? (
        <IconButton icon="crosshair" label="My location" size="default" onClick={onLocate} />
      ) : null}
      {onLayers ? (
        <IconButton
          icon="layers"
          label="Layers"
          size="default"
          aria-pressed={layersOpen}
          onClick={onLayers}
        />
      ) : null}
      {onFullscreen ? (
        <IconButton icon="maximize" label="Full screen" size="default" onClick={onFullscreen} />
      ) : null}
    </div>
  );
}
