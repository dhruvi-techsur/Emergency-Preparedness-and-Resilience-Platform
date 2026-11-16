import * as React from 'react';
import { Icon } from '../foundations/Icon';
import './Stat.css';

/**
 * EPMP Design System — Stat (DATA)
 *
 * A single KPI: overline label, 32px value, optional delta with arrow icon
 * and a word of context. `trend` is semantic meaning, not raw direction —
 * the caller decides what counts as good (a falling response time is
 * `good`, not `down`). `hint` shows a definition, baseline and period
 * nearby, satisfying the "show a definition, baseline and period" rule.
 *
 * No chart inside the tile: structurally, there is no `children` prop
 * accepting arbitrary content — only the typed fields below.
 */

export type StatTrend = 'good' | 'bad' | 'flat';

export interface StatProps {
  label: string;
  value: string | number;
  /** String beginning + or -, e.g. "+12%", "-4 min". */
  delta?: string;
  /** Semantic meaning: caller decides what counts as good. */
  trend?: StatTrend;
  /** Definition, baseline and period text, rendered in `caption`. */
  hint?: string;
}

const TREND_ICON: Record<StatTrend, 'arrow-up' | 'arrow-down' | 'minus'> = {
  good: 'arrow-up',
  bad: 'arrow-down',
  flat: 'minus',
};

export function Stat({ label, value, delta, trend, hint }: StatProps) {
  return (
    <div className="ep-stat">
      <p className="ep-stat__label overline">{label}</p>
      <p className="ep-stat__value">{value}</p>
      {delta ? (
        <p className={`ep-stat__delta ep-stat__delta--${trend ?? 'flat'}`}>
          {trend ? <Icon name={TREND_ICON[trend]} size="sm" /> : null}
          <span>{delta}</span>
        </p>
      ) : null}
      {hint ? <p className="ep-stat__hint caption">{hint}</p> : null}
    </div>
  );
}
