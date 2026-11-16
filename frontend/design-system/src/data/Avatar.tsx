import * as React from 'react';
import './Avatar.css';

/**
 * EPMP Design System — Avatar (DATA)
 *
 * Initials in a circle for a person. `name` is the sole accessible label
 * (`aria-label={name}`) and the sole source of the rendered initials —
 * this component structurally accepts no visual-likeness prop of any kind.
 * Per Chapter 11: initials only, never a picture or generated face. Pair
 * with the person's name and role in surrounding text; never show an Avatar
 * alone in a table.
 */

export type AvatarSize = 'default' | 'lg';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Required — used both to compute initials and as the accessible label. */
  name: string;
  /** default=32px, lg=44px. */
  size?: AvatarSize;
}

function initialsFor(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { name, size = 'default', className, ...rest },
  ref,
) {
  const classes = ['ep-avatar', `ep-avatar--${size}`, className ?? ''].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} role="img" aria-label={name} {...rest}>
      <span aria-hidden="true">{initialsFor(name)}</span>
    </div>
  );
});
