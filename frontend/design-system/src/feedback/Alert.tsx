import * as React from 'react';
import { Icon, type IconName } from '../foundations/Icon';
import { IconButton } from '../actions/IconButton';
import './Alert.css';

/**
 * EPMP Design System — Alert (FEEDBACK)
 *
 * Inline message tied to the content around it. danger/warning use
 * role="alert" and persist until resolved — onDismiss is ignored for those
 * tones even if a caller passes it, matching "persist errors/warnings until
 * resolved; allow dismissing only info and success".
 */

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const ICON_FOR_TONE: Record<AlertTone, IconName> = {
  info: 'info',
  success: 'check',
  warning: 'alert',
  danger: 'danger',
  neutral: 'info',
};

const PERSISTENT_TONES: ReadonlySet<AlertTone> = new Set(['danger', 'warning']);

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  /** Short outcome. Required. */
  title: React.ReactNode;
  /** One or two sentences: what happened, what to do. */
  children?: React.ReactNode;
  /** Buttons, e.g. a Retry action. */
  actions?: React.ReactNode;
  /**
   * Only honored when tone is info/success. For danger/warning, dismissal is
   * ignored by design — those tones persist until resolved.
   */
  onDismiss?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = 'info', title, children, actions, onDismiss, className, ...rest },
  ref,
) {
  const isPersistent = PERSISTENT_TONES.has(tone);
  const canDismiss = Boolean(onDismiss) && !isPersistent;
  const classes = ['ep-alert', `ep-alert--${tone}`, className ?? ''].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      role={isPersistent ? 'alert' : undefined}
      {...rest}
    >
      <span className="ep-alert__icon">
        <Icon name={ICON_FOR_TONE[tone]} size="default" aria-hidden="true" />
      </span>
      <div className="ep-alert__body">
        <p className="ep-alert__title">{title}</p>
        {children ? <div className="ep-alert__content">{children}</div> : null}
        {actions ? <div className="ep-alert__actions">{actions}</div> : null}
      </div>
      {canDismiss ? (
        <span className="ep-alert__dismiss">
          <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} />
        </span>
      ) : null}
    </div>
  );
});
