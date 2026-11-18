import * as React from 'react';
import './DonutChart.css';

/**
 * EPMP Design System — DonutChart (DATA VISUALIZATION)
 *
 * Part-to-whole for 2 to 5 segments, with a center total, a list legend
 * showing every segment's value AND percentage as text, and a hidden data
 * table — only for parts that add to a meaningful whole, never for trends
 * or more than 5 segments. `segments.length > 5` is a caller contract
 * violation: it is logged loudly via `console.warn` in development, and
 * EVERY segment still renders — never silently truncated.
 */

export type DonutTone = 'success' | 'warning' | 'danger' | 'info';

export interface DonutSegment {
  label: string;
  value: number;
  tone?: DonutTone;
}

export interface DonutChartProps {
  label: string;
  /** 2-5, document inline as a caller contract — logs a console.warn in dev
   * if violated, never silently truncates. */
  segments: DonutSegment[];
  center?: { value: string | number; label: string };
  title?: string;
  subtitle?: string;
  format?: (v: number) => string;
  size?: number;
}

function vizColor(index: number): string {
  return `var(--viz-${(index % 6) + 1})`;
}

function toneColor(tone: DonutTone): string {
  return `var(--${tone}-solid)`;
}

function defaultFormat(v: number): string {
  return String(Math.round(v * 100) / 100);
}

export function DonutChart({
  label,
  segments,
  center,
  title,
  subtitle,
  format = defaultFormat,
  size = 160,
}: DonutChartProps) {
  React.useEffect(() => {
    if (segments.length > 5 && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        'DonutChart: segments.length exceeds the spec\'s 5-segment maximum; use BarChart for >5 categories',
      );
    }
    // Only re-warn if the segment count itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segments.length]);

  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = size / 2;
  const strokeWidth = radius * 0.32;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * innerRadius;
  const gapDeg = 2.5; // visible gap between segments — a gap, not an outline color difference.

  let cumulativeFraction = 0;
  const arcs = segments.map((seg, i) => {
    const fraction = seg.value / total;
    const color = seg.tone ? toneColor(seg.tone) : vizColor(i);
    const gapLength = (gapDeg / 360) * circumference;
    const arcLength = Math.max(0, fraction * circumference - gapLength);
    const offset = cumulativeFraction * circumference;
    cumulativeFraction += fraction;
    return { seg, color, arcLength, offset, fraction };
  });

  return (
    <div className="ep-donutchart">
      {title ? <p className="ep-donutchart__title">{title}</p> : null}
      {subtitle ? <p className="ep-donutchart__subtitle caption">{subtitle}</p> : null}

      <div className="ep-donutchart__body">
        <svg
          className="ep-donutchart__svg"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={label}
        >
          <g transform={`rotate(-90 ${radius} ${radius})`}>
            {arcs.map(({ seg, color, arcLength, offset }) => (
              <circle
                key={seg.label}
                cx={radius}
                cy={radius}
                r={innerRadius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            ))}
          </g>
          {center ? (
            <g>
              <text x={radius} y={radius - 4} textAnchor="middle" className="ep-donutchart__center-value">
                {center.value}
              </text>
              <text x={radius} y={radius + 14} textAnchor="middle" className="ep-donutchart__center-label">
                {center.label}
              </text>
            </g>
          ) : null}
        </svg>

        {/* Always-visible list legend — values and percentages always listed,
         * the ring alone is never the only carrier of information. */}
        <ul className="ep-donutchart__legend">
          {arcs.map(({ seg, color, fraction }) => (
            <li key={seg.label} className="ep-donutchart__legend-item">
              <span className="ep-donutchart__legend-swatch" style={{ background: color }} />
              <span className="ep-donutchart__legend-label">{seg.label}</span>
              <span className="ep-donutchart__legend-value">{format(seg.value)}</span>
              <span className="ep-donutchart__legend-pct">{Math.round(fraction * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Separate visually-hidden data table — same ep-visually-hidden pattern
       * LineChart/BarChart/MapCanvas use, repeating the data for the
       * screen-reader-table convention all three chart components share. */}
      <table className="ep-visually-hidden">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Segment</th>
            <th scope="col">Value</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {arcs.map(({ seg, fraction }) => (
            <tr key={seg.label}>
              <th scope="row">{seg.label}</th>
              <td>{format(seg.value)}</td>
              <td>{Math.round(fraction * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
