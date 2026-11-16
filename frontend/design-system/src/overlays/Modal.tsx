import * as React from 'react';
import './Modal.css';

/**
 * EPMP Design System — Modal (OVERLAYS)
 *
 * A focused task or confirmation that blocks the page. 480px max, 16px
 * radius, the only large shadow, scrim behind. Focus moves in, Escape
 * closes, focus returns to the trigger. `danger` switches to `alertdialog`.
 *
 * Title states the decision ("Suspend this user?"); body states the
 * consequence; `footer` buttons name the outcomes, primary last and
 * rightmost — same convention as `PageHeader.actions`. Never "Yes/No".
 *
 * `danger` modals' primary action must be an outcome-named
 * `Button variant="danger"` (e.g. "Suspend access"), never "Yes"/"OK" —
 * this is a caller contract documented here, not enforced by this
 * component (it doesn't inspect `footer`'s children).
 *
 * Caller contract: never render two Modals simultaneously open. The
 * library doesn't enforce a global singleton (that would require
 * module-level mutable state inappropriate for a component library) — but
 * stacking modals is an anti-pattern per the spec's anti-pattern list.
 */

export interface ModalProps {
  open: boolean;
  /** States the decision, e.g. "Suspend this user?" Required. */
  title: React.ReactNode;
  /** Body states the consequence. */
  children?: React.ReactNode;
  /** Buttons — convention: primary last and rightmost. */
  footer?: React.ReactNode;
  onClose: () => void;
  /** Max width. Defaults to 480px. */
  width?: number | string;
  /** Switches role from dialog to alertdialog for destructive confirmations. */
  danger?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, title, children, footer, onClose, width = 480, danger = false }: ModalProps) {
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement;

    const node = dialogRef.current;
    const focusables = node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : [];
    const target = focusables[0] ?? node;
    target?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const current = dialogRef.current;
        if (!current) return;
        const items = Array.from(current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
        if (items.length === 0) {
          e.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || !items.includes(active as HTMLElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last || !items.includes(active as HTMLElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) {
        trigger.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthValue = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className="ep-modal-scrim" role="presentation">
      <div
        ref={dialogRef}
        className="ep-modal"
        role={danger ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby="ep-modal-title"
        style={{ maxWidth: widthValue }}
        tabIndex={-1}
      >
        <h2 id="ep-modal-title" className="ep-modal__title h3">
          {title}
        </h2>
        {children ? <div className="ep-modal__body">{children}</div> : null}
        {footer ? <div className="ep-modal__footer">{footer}</div> : null}
      </div>
    </div>
  );
}
