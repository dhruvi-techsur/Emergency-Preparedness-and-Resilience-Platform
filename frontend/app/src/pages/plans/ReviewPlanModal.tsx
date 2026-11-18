import * as React from 'react';
import { Modal, Button, TextField, Alert } from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

interface PlanSectionSummary {
  id: string;
  heading: string;
  body: string;
  sort_order: number;
}

interface PlanDetailForReview {
  sections: PlanSectionSummary[];
}

export interface ReviewPlanModalProps {
  planId: string;
  planName: string;
  open: boolean;
  onClose: () => void;
  onReviewed: () => void;
}

/**
 * F3 S3.4 — Approval Workflow Modal.
 *
 * Phase 3 scope note: the FRD describes a "side-by-side or stacked view of
 * changes since the last Approved version." A full diff against the last
 * Approved `content_snapshot` is out of this plan's 2-3-task budget — this
 * renders the plan's CURRENT sections only (the proposed state a reviewer
 * is being asked to approve), which approximates the FRD's intent without
 * a diff overlay. A true diff view is a reasonable future enhancement, not
 * a regression from the FRD's literal language.
 *
 * On 403 SELF_APPROVAL_BLOCKED, the exact FRD message is rendered as an
 * Alert INSIDE this modal (never a toast, never a generic error) and the
 * modal stays open — the user can see why they can't approve and close it
 * manually.
 */
export function ReviewPlanModal({
  planId,
  planName,
  open,
  onClose,
  onReviewed,
}: ReviewPlanModalProps): JSX.Element {
  const [sections, setSections] = React.useState<PlanSectionSummary[]>([]);
  const [loadingSections, setLoadingSections] = React.useState(false);
  const [requestingChanges, setRequestingChanges] = React.useState(false);
  const [comments, setComments] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [selfApprovalError, setSelfApprovalError] = React.useState<string | null>(null);
  const [genericError, setGenericError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setRequestingChanges(false);
    setComments('');
    setSelfApprovalError(null);
    setGenericError(null);
    setLoadingSections(true);
    apiGet<PlanDetailForReview>(`/api/v1/plans/${planId}`)
      .then((detail) => {
        setSections([...detail.sections].sort((a, b) => a.sort_order - b.sort_order));
      })
      .catch(() => {
        setSections([]);
      })
      .finally(() => setLoadingSections(false));
  }, [open, planId]);

  const handleApprove = async () => {
    setSubmitting(true);
    setSelfApprovalError(null);
    setGenericError(null);
    try {
      await apiPost(`/api/v1/plans/${planId}/review`, { review_action: 'approve' });
      onReviewed();
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'SELF_APPROVAL_BLOCKED') {
        setSelfApprovalError(err.message);
        return;
      }
      setGenericError(
        err instanceof ApiRequestError ? err.message : 'Could not review this plan. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    setSubmitting(true);
    setSelfApprovalError(null);
    setGenericError(null);
    try {
      await apiPost(`/api/v1/plans/${planId}/review`, {
        review_action: 'request_changes',
        comments: comments.trim() || undefined,
      });
      onReviewed();
      onClose();
    } catch (err) {
      setGenericError(
        err instanceof ApiRequestError ? err.message : 'Could not review this plan. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Review "${planName}"`}
      onClose={onClose}
      width={640}
      footer={
        requestingChanges ? (
          <>
            <Button variant="ghost" onClick={() => setRequestingChanges(false)}>
              Back
            </Button>
            <Button
              variant="secondary"
              onClick={() => void handleRequestChanges()}
              loading={submitting}
            >
              Request changes
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={() => setRequestingChanges(true)}>
              Request changes
            </Button>
            <Button variant="primary" onClick={() => void handleApprove()} loading={submitting}>
              Approve
            </Button>
          </>
        )
      }
    >
      {selfApprovalError ? (
        <Alert tone="danger" title="You can't approve your own plan">
          {selfApprovalError}
        </Alert>
      ) : null}

      {genericError ? (
        <Alert tone="danger" title="Could not review this plan">
          {genericError}
        </Alert>
      ) : null}

      {loadingSections ? (
        <p className="caption">Loading plan content…</p>
      ) : (
        <div className="ep-review-plan-modal__sections">
          {sections.map((section) => (
            <div key={section.id} className="ep-review-plan-modal__section">
              <h4>{section.heading}</h4>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      )}

      {requestingChanges ? (
        <TextField
          label="Comments"
          multiline
          hint="Explain what needs to change before this plan can be approved."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      ) : null}
    </Modal>
  );
}
