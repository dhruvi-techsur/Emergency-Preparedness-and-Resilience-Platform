import * as React from 'react';
import { Icon, type IconName } from '../foundations/Icon';
import './Badge.css';

/**
 * EPMP Design System — Badge (FEEDBACK)
 *
 * Compact status or category label. Success/warning/danger/info include an
 * icon automatically so meaning never relies on color alone — this is F0's
 * "status always icon + word + color" hard rule enforced structurally:
 * `children` (the word) is a required prop, and every non-neutral/brand tone
 * renders an icon by default.
 */

export type BadgeTone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger';

const DEFAULT_ICON_FOR_TONE: Partial<Record<BadgeTone, IconName>> = {
  success: 'check',
  warning: 'alert',
  danger: 'danger',
  info: 'info',
};

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  tone?: BadgeTone;
  /** Short text (1-3 words). Required — Badge never renders icon/color alone. */
  children: React.ReactNode;
  /**
   * Overrides the tone's default icon. Pass `false` to suppress entirely
   * (neutral/brand have no default icon to begin with).
   */
  icon?: IconName | false;
  /** Reserved for danger/warning needing top priority: switches ground from *-subtle to *-solid with on-* text. */
  solid?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', children, icon, solid = false, className, ...rest },
  ref,
) {
  const resolvedIcon = icon === false ? undefined : (icon ?? DEFAULT_ICON_FOR_TONE[tone]);
  const classes = [
    'ep-badge',
    `ep-badge--${tone}`,
    solid ? 'ep-badge--solid' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} className={classes} {...rest}>
      {resolvedIcon ? <Icon name={resolvedIcon} size="sm" /> : null}
      <span>{children}</span>
    </span>
  );
});
