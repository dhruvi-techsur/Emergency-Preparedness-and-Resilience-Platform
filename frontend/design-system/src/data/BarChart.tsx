import * as React from 'react';
import './BarChart.css';

/**
 * EPMP Design System — BarChart (DATA VISUALIZATION)
 *
 * Compare quantities across categories: vertical or horizontal, grouped or
 * stacked. Bars are 2px-rounded; the VALUE is printed on/beside each bar —
 * never axis-only readout, per the spec's "print the values; do not make
 * people read them off the axis" rule. `patterns` applies an SVG pattern
 * fill (stripe/dot/hatch, cycling per series) UNDERNEATH the solid color
 * fill, so series survive print and grayscale. A hidden data table (same
 * `ep-visually-hidden` pattern as LineChart/DonutChart) repeats categories ×
 * series values for screen readers.
 */

export interface BarChartSeries {
  name: string;
  values: number[];
}

export interface BarChartProps {
  label: string;
  categories: string[];
  series: BarChartSeries[];
  title?: string;
  subtitle?: string;
  stacked?: boolean;
  horizontal?: boolean;
  patterns?: boolean;
  format?: (v: number) => string;
  yMax?: number;
  height?: number;
  labelWidth?: number;
  xName?: string;
}

const WIDTH = 600;
const PADDING = { top: 16, right: 16, bottom: 32, left: 48 };
const PATTERN_KINDS = ['stripe', 'dot', 'hatch'] as const;

function vizColor(index: number): string {
  return `var(--viz-${(index % 6) + 1})`;
}

function defaultFormat(v: number): string {
  return String(Math.round(v * 100) / 100);
}

function PatternDefs({ count }: { count: number }) {
  return (
    <defs>
      {Array.from({ length: count }).map((_, i) => {
        const kind = PATTERN_KINDS[i % PATTERN_KINDS.length];
        const id = `ep-barchart-pattern-${kind}-${i}`;
        if (kind === 'stripe') {
          return (
            <pattern key={id} id={id} width={6} height={6} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width={6} height={6} fill="transparent" />
              <line x1={0} y1={0} x2={0} y2={6} stroke="var(--ink-inverse)" strokeWidth={2} opacity={0.35} />
            </pattern>
          );
        }
        if (kind === 'dot') {
          return (
            <pattern key={id} id={id} width={6} height={6} patternUnits="userSpaceOnUse">
              <rect width={6} height={6} fill="transparent" />
              <circle cx={3} cy={3} r={1.2} fill="var(--ink-inverse)" opacity={0.45} />
            </pattern>
          );
        }
        return (
          <pattern key={id} id={id} width={6} height={6} patternTransform="rotate(-45)" patternUnits="userSpaceOnUse">
            <rect width={6} height={6} fill="transparent" />
            <line x1={0} y1={0} x2={0} y2={6} stroke="var(--ink-inverse)" strokeWidth={1.2} opacity={0.4} />
            <line x1={0} y1={6} x2={6} y2={0} stroke="var(--ink-inverse)" strokeWidth={1.2} opacity={0.4} />
          </pattern>
        );
      })}
    </defs>
  );
}

function patternIdFor(index: number): string {
  const kind = PATTERN_KINDS[index % PATTERN_KINDS.length];
  return `ep-barchart-pattern-${kind}-${index}`;
}

export function BarChart({
  label,
  categories,
  series,
  title,
  subtitle,
  stacked = false,
  horizontal = false,
  patterns = false,
  format = defaultFormat,
  yMax,
  height = 280,
  labelWidth = 80,
  xName,
}: BarChartProps) {
  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = height - PADDING.top - PADDING.bottom;

  const stackedTotals = categories.map((_, ci) => series.reduce((sum, s) => sum + (s.values[ci] ?? 0), 0));
  const maxSeriesValue = Math.max(1, ...series.flatMap((s) => s.values));
  const domainMax = yMax ?? (stacked ? Math.max(1, ...stackedTotals) : maxSeriesValue);

  const categoryBand = (horizontal ? plotHeight : plotWidth) / Math.max(1, categories.length);
  const groupGap = categoryBand * 0.2;
  const barSlot = (categoryBand - groupGap) / Math.max(1, stacked ? 1 : series.length);
  const barThickness = Math.max(2, barSlot * 0.7);

  return (
    <div className="ep-barchart">
      {title ? <p className="ep-barchart__title">{title}</p> : null}
      {subtitle ? <p className="ep-barchart__subtitle caption">{subtitle}</p> : null}
      <svg
        className="ep-barchart__svg"
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={label}
      >
        {patterns ? <PatternDefs count={series.length} /> : null}

        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={horizontal ? PADDING.left : WIDTH - PADDING.right}
          y2={horizontal ? height - PADDING.bottom : height - PADDING.bottom}
          className="ep-barchart__axis"
        />
        <line
          x1={PADDING.left}
          y1={height - PADDING.bottom}
          x2={WIDTH - PADDING.right}
          y2={height - PADDING.bottom}
          className="ep-barchart__axis"
        />

        {categories.map((cat, ci) => {
          const bandStart = ci * categoryBand + groupGap / 2;

          if (stacked) {
            let cumulative = 0;
            return (
              <g key={cat}>
                {series.map((s, si) => {
                  const v = s.values[ci] ?? 0;
                  const lengthPx = (v / domainMax) * (horizontal ? plotWidth : plotHeight);
                  const fill = patterns ? `url(#${patternIdFor(si)})` : undefined;
                  const color = vizColor(si);
                  let rect;
                  if (horizontal) {
                    const y = PADDING.top + bandStart;
                    const x = PADDING.left + cumulative;
                    rect = (
                      <g key={s.name}>
                        <rect x={x} y={y} width={lengthPx} height={barThickness} fill={color} rx={2} />
                        {patterns ? <rect x={x} y={y} width={lengthPx} height={barThickness} fill={fill} rx={2} /> : null}
                        {v > 0 && (
                          <text x={x + lengthPx + 4} y={y + barThickness / 2 + 3} className="ep-barchart__value">
                            {format(v)}
                          </text>
                        )}
                      </g>
                    );
                  } else {
                    const barHeight = lengthPx;
                    const y = height - PADDING.bottom - cumulative - barHeight;
                    const x = PADDING.left + bandStart;
                    rect = (
                      <g key={s.name}>
                        <rect x={x} y={y} width={barThickness} height={barHeight} fill={color} rx={2} />
                        {patterns ? <rect x={x} y={y} width={barThickness} height={barHeight} fill={fill} rx={2} /> : null}
                        {v > 0 && (
                          <text x={x + barThickness / 2} y={y - 4} textAnchor="middle" className="ep-barchart__value">
                            {format(v)}
                          </text>
                        )}
                      </g>
                    );
                  }
                  cumulative += lengthPx;
                  return rect;
                })}
                <text
                  x={horizontal ? PADDING.left - 4 : PADDING.left + bandStart + barThickness / 2}
                  y={horizontal ? PADDING.top + bandStart + barThickness / 2 + 3 : height - PADDING.bottom + 16}
                  textAnchor={horizontal ? 'end' : 'middle'}
                  className="ep-barchart__category-label"
                >
                  {cat}
                </text>
              </g>
            );
          }

          return (
            <g key={cat}>
              {series.map((s, si) => {
                const v = s.values[ci] ?? 0;
                const lengthPx = (v / domainMax) * (horizontal ? plotWidth : plotHeight);
                const color = vizColor(si);
                const fill = patterns ? `url(#${patternIdFor(si)})` : undefined;
                if (horizontal) {
                  const y = PADDING.top + bandStart + si * barSlot;
                  const x = PADDING.left;
                  return (
                    <g key={s.name}>
                      <rect x={x} y={y} width={lengthPx} height={barThickness} fill={color} rx={2} />
                      {patterns ? <rect x={x} y={y} width={lengthPx} height={barThickness} fill={fill} rx={2} /> : null}
                      <text x={x + lengthPx + 4} y={y + barThickness / 2 + 3} className="ep-barchart__value">
                        {format(v)}
                      </text>
                    </g>
                  );
                }
                const barHeight = lengthPx;
                const x = PADDING.left + bandStart + si * barSlot;
                const y = height - PADDING.bottom - barHeight;
                return (
                  <g key={s.name}>
                    <rect x={x} y={y} width={barThickness} height={barHeight} fill={color} rx={2} />
                    {patterns ? <rect x={x} y={y} width={barThickness} height={barHeight} fill={fill} rx={2} /> : null}
                    <text x={x + barThickness / 2} y={y - 4} textAnchor="middle" className="ep-barchart__value">
                      {format(v)}
                    </text>
                  </g>
                );
              })}
              <text
                x={horizontal ? PADDING.left - 4 : PADDING.left + bandStart + (barSlot * series.length) / 2}
                y={horizontal ? PADDING.top + bandStart + (barSlot * series.length) / 2 + 3 : height - PADDING.bottom + 16}
                textAnchor={horizontal ? 'end' : 'middle'}
                className="ep-barchart__category-label"
              >
                {cat}
              </text>
            </g>
          );
        })}
      </svg>

      {series.length > 1 && (
        <ul className="ep-barchart__legend">
          {series.map((s, si) => (
            <li key={s.name} className="ep-barchart__legend-item">
              <span className="ep-barchart__legend-swatch" style={{ background: vizColor(si) }} />
              <span>{s.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Hidden data table — same ep-visually-hidden pattern as LineChart/DonutChart. */}
      <table className="ep-visually-hidden">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{xName ?? ''}</th>
            {categories.map((cat) => (
              <th scope="col" key={cat}>
                {cat}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.name}>
              <th scope="row">{s.name}</th>
              {s.values.map((v, i) => (
                <td key={i}>{format(v)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
