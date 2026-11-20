import * as React from 'react';
import { Select } from '@epmp/design-system';

export interface FacetToggleProps {
  facet: 'admin' | 'executive';
  onChange: (facet: 'admin' | 'executive') => void;
}

/**
 * S18.5's explicit Admin/Executive facet switch, using the existing
 * `Select` component (not a custom control) — rendered ONLY in AppShell's
 * header for `secops_admin` (PER-05). Per F18's Validation rule
 * ("PER-05's facet toggle must be an explicit user action — the system
 * must never auto-select a facet on the user's behalf"), this component
 * holds NO internal default-selection logic of its own and NO effect
 * that fires on mount: `facet` is always the caller's own React state,
 * defaulting to `'admin'` on every fresh mount (AppShell's own `useState`
 * initializer, never read from localStorage/a query param/any other
 * implicit source), and only ever changes via this component's
 * `onChange`, which fires exclusively from a real user interaction with
 * the underlying `<select>` element.
 */
export function FacetToggle({ facet, onChange }: FacetToggleProps): JSX.Element {
  return (
    <Select
      label="Facet"
      options={[
        { value: 'admin', label: 'Admin' },
        { value: 'executive', label: 'Executive' },
      ]}
      value={facet}
      onChange={(e) => onChange(e.target.value as 'admin' | 'executive')}
    />
  );
}
