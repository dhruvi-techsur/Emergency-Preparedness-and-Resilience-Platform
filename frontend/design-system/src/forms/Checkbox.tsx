import * as React from 'react';
import { Icon } from '../foundations/Icon';
import './Checkbox.css';

/**
 * EPMP Design System — Checkbox (FORMS)
 *
 * Independent yes/no choice, or one of several selectable options. The
 * label IS the clickable hit area (box + text both live inside a single
 * `<label>`), phrased as the true state ("Send acknowledgment receipts").
 * 16px box by default, 24px with `size="lg"` for touch. Brand fill with a
 * check glyph when on. The native input is visually hidden but functional
 * and keyboard-focusable; the custom box shows the focus ring.
 */

export type CheckboxSize = 'default' | 'lg';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /** Always required — the label is the clickable area. */
  label: React.ReactNode;
  size?: CheckboxSize;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, size = 'default', disabled, className, ...rest },
  ref,
) {
  const classes = ['ep-checkbox', `ep-checkbox--${size}`, disabled ? 'ep-checkbox--disabled' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <span className="ep-checkbox__input-wrap">
        <input ref={ref} type="checkbox" className="ep-checkbox__input" disabled={disabled} {...rest} />
        <span className="ep-checkbox__box">
          <Icon name="check" size="sm" className="ep-checkbox__check" />
        </span>
      </span>
      <span className="ep-checkbox__label">{label}</span>
    </label>
  );
});
