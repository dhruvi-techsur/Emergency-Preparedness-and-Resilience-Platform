import * as React from 'react';
import './Progress.css';

/**
 * EPMP Design System — Progress (FEEDBACK)
 *
 * An 8px pill-shaped determinate progress bar. Used for step indicators
 * (Compose Notification, AAR Generator wizard) and measured percentages
 * (Delivery & Acknowledgment Tracking's ack-percentage bar).
 *
 * **Always shows the number when the bar is a measure, not decoration** —
 * this is why `showValue` defaults `true` rather than `false`. Bar width
 * alone is never the sole carrier of the value; the percentage is always
 * also rendered as visible text.
 */

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger';

export interface ProgressProps {
  /** 0 to 100. Required. */
  value: number;
  /** e.g. "Step 1 of 4: Audience" or "68% acknowledged, 412 of 606". */
  label?: React.ReactNode;
  /** When true, prints the numeric percentage beside the bar — ALWAYS true
   * when the bar represents a measure (not decoration), per the spec's
   * "always show the number when the bar is a measure" rule. Default true. */
  showValue?: boolean;
  tone?: ProgressTone;
}

function toneVar(tone: ProgressTone): string {
  // Same tone-to-CSS-var helper pattern MapCanvas.tsx already established.
  return `var(--${tone}-solid, var(--brand))`;
}

export function Progress({ value, label, showValue = true, tone = 'brand' }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  // Accessible name: derived from `label` if it's a plain string, else a
  // generic fallback — documented here as the accessible-name resolution.
  const accessibleName = typeof label === 'string' ? label : 'Progress';

  return (
    <div className="ep-progress">
      {(label || showValue) && (
        <div className="ep-progress__header">
          {label ? <span className="ep-progress__label">{label}</span> : null}
          {showValue ? <span className="ep-progress__value">{clamped}%</span> : null}
        </div>
      )}
      <div
        className="ep-progress__track"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleName}
      >
        <div
          className="ep-progress__fill"
          style={{ width: `${clamped}%`, background: toneVar(tone) }}
        />
      </div>
    </div>
  );
}
