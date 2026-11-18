import * as React from 'react';
import './LineChart.css';

/**
 * EPMP Design System — LineChart (DATA VISUALIZATION)
 *
 * Trends over time, up to 6 series. Each series is distinguished by BOTH
 * color (`--viz-1`..`--viz-6`) AND a distinct marker shape — never color
 * alone, per the spec's explicit "never rely on hue alone: keep the marker
 * shapes" rule. `thresholds` render as horizontal dashed reference lines
 * with a text label — never a color band. Hover is not implemented (no
 * pointer dependency); instead, Left/Right arrow keys (when the `<svg>` is
 * focused) move a "current index" readout rendered as visible `<text>`, not
 * a native browser tooltip, so the exact-value readout works identically
 * with keyboard-only navigation. A legend lists each series' name and its
 * LATEST value. A visually-hidden `<table>` repeats the exact same data for
 * screen readers.
 *
 * The spec names exactly 5 marker shapes (circle, square, triangle, diamond,
 * cross) for "up to 6 series" — Claude's discretion resolves the 6th series
 * as a ring (outlined circle with a contrasting center dot), visually
 * distinct from series-1's plain filled circle even in grayscale/print.
 */

export interface LineChartSeries {
  name: string;
  values: (number | null)[];
  dashed?: boolean;
}

export interface LineChartThreshold {
  value: number;
  label: string;
}

export interface LineChartProps {
  /** Accessible name — what the chart shows. Required. */
  label: string;
  /** Max 6 series — a caller contract, documented here (not runtime-enforced). */
  series: LineChartSeries[];
  xLabels: string[];
  title?: string;
  subtitle?: string;
  format?: (v: number) => string;
  yMin?: number;
  yMax?: number;
  height?: number;
  thresholds?: LineChartThreshold[];
  xName?: string;
}

const WIDTH = 600;
const PADDING = { top: 16, right: 16, bottom: 32, left: 48 };

function vizColor(index: number): string {
  return `var(--viz-${(index % 6) + 1})`;
}

function defaultFormat(v: number): string {
  return String(Math.round(v * 100) / 100);
}

/** Renders the per-series marker shape at (cx, cy). Shape chosen by series
 * index: circle, square, triangle, diamond, cross, then (6th+) a ring with a
 * contrasting center dot — see module doc comment for the 6th-series rationale. */
function Marker({
  shapeIndex,
  cx,
  cy,
  color,
}: {
  shapeIndex: number;
  cx: number;
  cy: number;
  color: string;
}) {
  switch (shapeIndex % 6) {
    case 0:
      return <circle cx={cx} cy={cy} r={3} fill={color} />;
    case 1:
      return <rect x={cx - 3} y={cy - 3} width={6} height={6} fill={color} />;
    case 2:
      return <polygon points={`${cx},${cy - 4} ${cx - 4},${cy + 3} ${cx + 4},${cy + 3}`} fill={color} />;
    case 3:
      return (
        <polygon
          points={`${cx},${cy - 4} ${cx + 4},${cy} ${cx},${cy + 4} ${cx - 4},${cy}`}
          fill={color}
        />
      );
    case 4:
      return (
        <path
          d={`M ${cx - 3} ${cy - 3} L ${cx + 3} ${cy + 3} M ${cx - 3} ${cy + 3} L ${cx + 3} ${cy - 3}`}
          stroke={color}
          strokeWidth={1.5}
        />
      );
    default:
      // 6th series fallback: ring + contrasting center dot.
      return (
        <>
          <circle cx={cx} cy={cy} r={4} fill="none" stroke={color} strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={1.3} fill={color} />
        </>
      );
  }
}

export function LineChart({
  label,
  series,
  xLabels,
  title,
  subtitle,
  format = defaultFormat,
  yMin,
  yMax,
  height = 240,
  thresholds = [],
  xName,
}: LineChartProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null);

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;

  const allValues = series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const thresholdValues = thresholds.map((t) => t.value);
  const domainMax = yMax ?? Math.max(1, ...allValues, ...thresholdValues);
  const domainMin = yMin ?? 0;
  const span = domainMax - domainMin || 1;

  const n = xLabels.length;
  const xForIndex = (i: number) => (n <= 1 ? PADDING.left + plotWidth / 2 : PADDING.left + (i / (n - 1)) * plotWidth);
  const yForValue = (v: number) => PADDING.top + plotHeight - ((v - domainMin) / span) * plotHeight;

  function handleKeyDown(event: React.KeyboardEvent<SVGSVGElement>) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setCurrentIndex((prev) => Math.max(0, (prev ?? 0) - 1));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      setCurrentIndex((prev) => Math.min(n - 1, (prev ?? -1) + 1));
    }
  }

  function latestValue(values: (number | null)[]): number | null {
    for (let i = values.length - 1; i >= 0; i -= 1) {
      if (values[i] !== null) return values[i] as number;
    }
    return null;
  }

  /** Splits a values array into contiguous non-null runs, so a polyline never
   * draws a straight line across a null gap. */
  function runsFor(values: (number | null)[]): Array<Array<{ i: number; v: number }>> {
    const runs: Array<Array<{ i: number; v: number }>> = [];
    let current: Array<{ i: number; v: number }> = [];
    values.forEach((v, i) => {
      if (v === null) {
        if (current.length) runs.push(current);
        current = [];
      } else {
        current.push({ i, v });
      }
    });
    if (current.length) runs.push(current);
    return runs;
  }

  return (
    <div className="ep-linechart">
      {title ? <p className="ep-linechart__title">{title}</p> : null}
      {subtitle ? <p className="ep-linechart__subtitle caption">{subtitle}</p> : null}
      <svg
        ref={svgRef}
        className="ep-linechart__svg"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {/* Y axis baseline */}
        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={height - PADDING.bottom}
          className="ep-linechart__axis"
        />
        <line
          x1={PADDING.left}
          y1={height - PADDING.bottom}
          x2={WIDTH - PADDING.right}
          y2={height - PADDING.bottom}
          className="ep-linechart__axis"
        />

        {/* Threshold reference lines — dashed lines with a text label, never a color band. */}
        {thresholds.map((t) => (
          <g key={t.label}>
            <line
              x1={PADDING.left}
              y1={yForValue(t.value)}
              x2={WIDTH - PADDING.right}
              y2={yForValue(t.value)}
              className="ep-linechart__threshold"
            />
            <text
              x={WIDTH - PADDING.right}
              y={yForValue(t.value) - 4}
              textAnchor="end"
              className="ep-linechart__threshold-label"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Series lines + markers */}
        {series.map((s, si) => {
          const color = vizColor(si);
          return (
            <g key={s.name}>
              {runsFor(s.values).map((run, ri) => (
                <polyline
                  key={ri}
                  points={run.map(({ i, v }) => `${xForIndex(i)},${yForValue(v)}`).join(' ')}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeDasharray={s.dashed ? '5 4' : undefined}
                />
              ))}
              {s.values.map((v, i) =>
                v === null ? null : (
                  <Marker key={i} shapeIndex={si} cx={xForIndex(i)} cy={yForValue(v)} color={color} />
                ),
              )}
            </g>
          );
        })}

        {/* X axis labels */}
        {xLabels.map((xl, i) => (
          <text
            key={xl + i}
            x={xForIndex(i)}
            y={height - PADDING.bottom + 16}
            textAnchor="middle"
            className="ep-linechart__x-label"
          >
            {xl}
          </text>
        ))}

        {/* Keyboard readout — visible <text>, not a native browser tooltip. */}
        {currentIndex !== null && (
          <g>
            <line
              x1={xForIndex(currentIndex)}
              y1={PADDING.top}
              x2={xForIndex(currentIndex)}
              y2={height - PADDING.bottom}
              className="ep-linechart__guide"
            />
            <text
              x={xForIndex(currentIndex)}
              y={PADDING.top - 4}
              textAnchor="middle"
              className="ep-linechart__readout-title"
            >
              {xLabels[currentIndex]}
            </text>
            {series.map((s, si) => {
              const v = s.values[currentIndex];
              return (
                <text
                  key={s.name}
                  x={xForIndex(currentIndex)}
                  y={PADDING.top + 10 + si * 12}
                  textAnchor="middle"
                  className="ep-linechart__readout"
                  fill={vizColor(si)}
                >
                  {s.name}: {v === null ? '—' : format(v)}
                </text>
              );
            })}
          </g>
        )}
      </svg>

      <ul className="ep-linechart__legend">
        {series.map((s, si) => {
          const latest = latestValue(s.values);
          return (
            <li key={s.name} className="ep-linechart__legend-item">
              <svg className="ep-linechart__legend-swatch" width={12} height={12} viewBox="0 0 12 12" aria-hidden="true">
                <Marker shapeIndex={si} cx={6} cy={6} color={vizColor(si)} />
              </svg>
              <span>{s.name}</span>
              <strong>{latest === null ? '—' : format(latest)}</strong>
            </li>
          );
        })}
      </ul>

      {/* Hidden data table — same ep-visually-hidden pattern MapCanvas.tsx uses,
       * repeating the EXACT same data for screen readers. */}
      <table className="ep-visually-hidden">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{xName ?? ''}</th>
            {xLabels.map((xl, i) => (
              <th scope="col" key={xl + i}>
                {xl}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              {s.values.map((v, i) => (
                <td key={i}>{v === null ? '' : format(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
