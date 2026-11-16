import * as React from 'react';
import { Icon, type IconName, type IconSize } from '../foundations/Icon';
import './Button.css';

/**
 * EPMP Design System — Button (ACTIONS)
 *
 * The only element for actions that change something. Per Chapter 11:
 * variants primary (one per view region), secondary (default), ghost
 * (tertiary), danger (destructive, always behind a confirm). Sizes sm 28px,
 * default 36px, lg 44px (all field-mobile controls).
 *
 * All colors/radius/padding flow exclusively from var(--token) — never a
 * raw hex literal, an arbitrary px value, or an inline elevation shadow.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'default' | 'lg';

const ICON_SIZE_FOR: Record<ButtonSize, IconSize> = {
  sm: 'sm',
  default: 'default',
  lg: 'default',
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Verb-first label, sentence case ("Activate EOC", "Send for approval"). */
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label. */
  icon?: IconName;
  /** Icon rendered after the label. */
  iconRight?: IconName;
  /**
   * Keeps the label's width stable (via a fixed-width stacked wrapper),
   * shows a spinning `refresh` icon at the label's position, sets
   * aria-busy="true", and disables the button.
   */
  loading?: boolean;
  /** 100% width. */
  block?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'secondary',
    size = 'default',
    icon,
    iconRight,
    loading = false,
    block = false,
    disabled,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  const iconSize = ICON_SIZE_FOR[size];
  const isDisabled = disabled || loading;

  const classes = [
    'ep-btn',
    `ep-btn--${variant}`,
    `ep-btn--${size}`,
    block ? 'ep-btn--block' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon ? <Icon name={icon} size={iconSize} /> : null}
      <span>{children}</span>
      {iconRight ? <Icon name={iconRight} size={iconSize} /> : null}
    </>
  );

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span className="ep-btn__stack">
          <span className="ep-btn__content ep-btn__content--hidden">{content}</span>
          <span className="ep-btn__spinner">
            <span className="ep-btn__spin">
              <Icon name="refresh" size={iconSize} />
            </span>
          </span>
        </span>
      ) : (
        content
      )}
    </button>
  );
});
