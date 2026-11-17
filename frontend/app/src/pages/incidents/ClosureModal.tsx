import * as React from 'react';
import { Modal, Button, Alert } from '@epmp/design-system';
import { apiPost, ApiRequestError } from '../../lib/api-client';

export interface ClosureModalProps {
  incidentId: string;
  incidentName: string;
  open: boolean;
  onClose: () => void;
  /** Called after a successful closure — parent refetches incident + timeline. */
  onClosed: () => void;
}

/**
 * F1 Process step 7 — Incident Closure confirmation Modal ("a user with
 * appropriate role sets status to Closed via a Modal confirmation stating
 * the consequence").
 *
 * Same division of responsibility as ActivationModal: the confirmation
 * gate is enforced server-side by closure.ts (the actual business-rule
 * boundary, reusing ACTIVATION_CONFIRMATION_REQUIRED as EPMP's general
 * destructive-action-confirmation error code) — this Modal's `danger` tier
 * and consequence wording are the UX-level half of that contract.
 */
export function ClosureModal({
  incidentId,
  incidentName,
  open,
  onClose,
  onClosed,
}: ClosureModalProps): JSX.Element {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setError(null);
    }
  }, [open]);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await apiPost(`/api/v1/incidents/${incidentId}/closure`, { confirmed: true });
      onClosed();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Could not close this incident. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      danger
      title={`Close ${incidentName}?`}
      onClose={onClose}
      width={480}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Keep open
          </Button>
          <Button variant="danger" onClick={() => void handleConfirm()} loading={submitting}>
            Close incident
          </Button>
        </>
      }
    >
      <p>
        This closes all open tasks to Overdue unless completed, and the incident moves out of active
        operating-picture monitoring. Command role assignments remain on record.
      </p>

      {error ? (
        <Alert tone="danger" title="Could not close incident">
          {error}
        </Alert>
      ) : null}
    </Modal>
  );
}
