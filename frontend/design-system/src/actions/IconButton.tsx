import * as React from 'react';
import { Icon, type IconName, type IconSize } from '../foundations/Icon';
import type { ButtonSize } from './Button';
import './IconButton.css';

/**
 * EPMP Design System — IconButton (ACTIONS)
 *
 * A square, icon-only button for toolbars and dense rows. `label` is
 * required — it becomes the accessible name (aria-label) and the native
 * tooltip (title). `size="lg"` gives a 44px hit area for field-mobile per
 * the touch-target hard rule.
 *
 * Do not use for the primary action of a view; use Button with a label.
 */

const ICON_SIZE_FOR: Record<ButtonSize, IconSize> = {
  sm: 'sm',
  default: 'default',
  lg: 'default',
};

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  icon: IconName;
  /** Required — becomes aria-label and the native title/tooltip. */
  label: string;
  size?: ButtonSize;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, label, size = 'default', className, type = 'button', ...rest },
    ref,
  ) {
    const classes = ['ep-icon-btn', `ep-icon-btn--${size}`, className ?? '']
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        aria-label={label}
        title={label}
        {...rest}
      >
        <Icon name={icon} size={ICON_SIZE_FOR[size]} />
      </button>
    );
  },
);
