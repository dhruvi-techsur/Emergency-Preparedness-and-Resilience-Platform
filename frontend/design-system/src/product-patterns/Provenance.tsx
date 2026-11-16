import * as React from 'react';
import { Icon } from '../foundations/Icon';
import './Provenance.css';

/**
 * EPMP Design System — Provenance (PRODUCT PATTERNS)
 *
 * A chip that shows where a fact came from: source, time, verification,
 * optional confidence. Attach to every ingested or AI-derived fact.
 *
 * `verified` defaults to `true` — only an EXPLICIT `false` triggers the
 * unverified treatment (an `undefined`/omitted prop is verified-by-default
 * per the spec, never unverified-by-default). When `verified === false`,
 * the component renders a structurally different branch: a dashed outline,
 * an announced `Icon name="alert"`, AND the literal word "Unverified" —
 * all three together, never just a color change. This is the mechanism
 * satisfying "never turn an unverified feed into a plain operational
 * fact": a caller cannot accidentally make unverified data look verified
 * by omitting a prop, since the two branches render entirely different
 * markup.
 */

export interface ProvenanceProps {
  /** Required. */
  source: string;
  time?: string;
  /** Default true. Only explicit false renders the Unverified treatment. */
  verified?: boolean;
  /** Short text, e.g. "High confidence". */
  confidence?: string;
}

export function Provenance({ source, time, verified = true, confidence }: ProvenanceProps) {
  if (verified === false) {
    return (
      <span className="ep-provenance ep-provenance--unverified">
        <Icon name="alert" size="sm" label="Unverified" />
        <span className="caption ep-provenance__text">
          {source}
          {time ? ` · ${time}` : ''}
          {confidence ? ` · ${confidence}` : ''} · Unverified
        </span>
      </span>
    );
  }

  return (
    <span className="ep-provenance">
      <span className="caption ep-provenance__text">
        {source}
        {time ? ` · ${time}` : ''}
        {confidence ? ` · ${confidence}` : ''}
      </span>
    </span>
  );
}
