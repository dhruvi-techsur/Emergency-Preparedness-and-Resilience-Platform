import * as React from 'react';
import { IconButton } from '../actions/IconButton';
import './Toast.css';

/**
 * EPMP Design System — Toast (FEEDBACK/OVERLAYS)
 *
 * Transient confirmation after an action. Inverse surface
 * (var(--bg-inverse)/var(--ink-inverse)). Auto-dismisses after 6000ms unless
 * tone="danger" (persists until manually dismissed) — implemented via an
 * internal timer, not a prop the caller must remember to set.
 */

export type ToastTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const AUTO_DISMISS_MS = 6000;

export interface ToastProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** One sentence, past tense: "Alert sent to 412 recipients." */
  children: React.ReactNode;
  tone?: ToastTone;
  title?: React.ReactNode;
  /** A ghost Button, usually "Undo". */
  action?: React.ReactNode;
  onDismiss?: () => void;
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { children, tone, title, action, onDismiss, className, ...rest },
  ref,
) {
  React.useEffect(() => {
    if (tone === 'danger' || !onDismiss) return undefined;
    const id = window.setTimeout(() => {
      onDismiss();
    }, AUTO_DISMISS_MS);
    return () => window.clearTimeout(id);
    // Re-arm only if the dismiss handler identity or tone changes.
  }, [tone, onDismiss]);

  const classes = ['ep-toast', className ?? ''].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} role="status" {...rest}>
      <div className="ep-toast__body">
        {title ? <p className="ep-toast__title">{title}</p> : null}
        <div className="ep-toast__content">{children}</div>
      </div>
      {action ? <span className="ep-toast__action">{action}</span> : null}
      {onDismiss ? (
        <span className="ep-toast__dismiss">
          <IconButton icon="x" label="Dismiss" size="sm" onClick={onDismiss} />
        </span>
      ) : null}
    </div>
  );
});
