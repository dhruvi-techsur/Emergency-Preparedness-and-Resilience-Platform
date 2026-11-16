import * as React from 'react';
import './Skeleton.css';

/**
 * EPMP Design System — Skeleton (FEEDBACK)
 *
 * Placeholder block shown while content loads. Matches the final layout's
 * size; pulses gently using var(--duration-slow)/var(--ease-standard),
 * suppressed entirely under prefers-reduced-motion. Background is always
 * var(--bg-sunken).
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS length (e.g. "100%", "24px") or a token-scale number (px). */
  w: number | string;
  /** CSS length or a token-scale number (px). */
  h: number | string;
  /** When true, renders a circle (border-radius var(--radius-full)). */
  circle?: boolean;
}

function toCssLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { w, h, circle = false, className, style, ...rest },
  ref,
) {
  const classes = ['ep-skeleton', circle ? 'ep-skeleton--circle' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      style={{ width: toCssLength(w), height: toCssLength(h), ...style }}
      aria-hidden="true"
      {...rest}
    />
  );
});
