import * as React from 'react';
import { Icon, type IconName } from '../foundations/Icon';
import './EmptyState.css';

/**
 * EPMP Design System — EmptyState (FEEDBACK)
 *
 * What a list, table or panel shows when there is nothing to show. State-
 * agnostic by design: distinguishing first-use vs. filtered-out vs. error is
 * the caller's responsibility via different title/children/action per case.
 * No illustrations.
 */

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Required. */
  title: React.ReactNode;
  /** Rendered in a 48px disc of var(--bg-sunken). */
  icon?: IconName;
  /** Explains why there's nothing here and what's next. */
  children?: React.ReactNode;
  /** A single Button — the obvious next step. */
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, icon, children, action, className, ...rest },
  ref,
) {
  const classes = ['ep-empty-state', className ?? ''].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} {...rest}>
      {icon ? (
        <span className="ep-empty-state__icon">
          <Icon name={icon} size="lg" aria-hidden="true" />
        </span>
      ) : null}
      <p className="ep-empty-state__title">{title}</p>
      {children ? <div className="ep-empty-state__body">{children}</div> : null}
      {action ? <div className="ep-empty-state__action">{action}</div> : null}
    </div>
  );
});
