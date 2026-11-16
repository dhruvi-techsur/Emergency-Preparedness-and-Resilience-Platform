import * as React from 'react';
import './Timeline.css';

/**
 * EPMP Design System — Timeline (DATA)
 *
 * Chronological activity log for an incident: monospaced time, a status
 * dot, title, meta line. Structurally append-only from the consumer's
 * side — this component has no affordance anywhere in its props for
 * altering or discarding a past entry, making it impossible to wire a
 * history-mutating callback into this component even by accident.
 * "Never edit history; add a correcting entry" is the spec's rule — the
 * component can't be misused to violate it.
 *
 * AI-sourced entries MUST say so in `meta` (e.g. "via AIDraft, approved by
 * J. Okafor") — Phase 1 has no AI-origin content flowing into this
 * component yet; that wiring is Phase 6's.
 */

export type TimelineTone = 'brand' | 'success' | 'warning' | 'danger';

export interface TimelineItem {
  /** 24-hour time in the incident's time zone. */
  time: string;
  title: string;
  /** Muted text line. AI-sourced entries must say so here. */
  meta?: string;
  tone?: TimelineTone;
  children?: React.ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="ep-timeline">
      {items.map((item, i) => (
        <li key={i} className="ep-timeline__item">
          <span className="ep-timeline__time data">{item.time}</span>
          <span
            className={`ep-timeline__dot ep-timeline__dot--${item.tone ?? 'brand'}`}
            aria-hidden="true"
          />
          <div className="ep-timeline__body">
            <p className="ep-timeline__title">{item.title}</p>
            {item.meta ? <p className="ep-timeline__meta caption">{item.meta}</p> : null}
            {item.children ? <div className="ep-timeline__content">{item.children}</div> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
