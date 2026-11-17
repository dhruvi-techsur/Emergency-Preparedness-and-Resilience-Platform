import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Badge,
  Button,
  EmptyState,
  Modal,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet, ApiRequestError } from '../../lib/api-client';
import './PlanDetail.css';

type PlanType = 'EOP' | 'SOP' | 'Annex';
type PlanStatus = 'Draft' | 'Review' | 'Approved';
type ReviewAction = 'approve' | 'request_changes';

interface PlanSection {
  id: string;
  heading: string;
  body: string;
  sort_order: number;
  linked_task_templates: string[];
}

interface PlanVersionHistoryEntry {
  version_number: number;
  reviewed_by?: string;
  review_action?: ReviewAction;
  reviewed_at?: string;
}

interface PlanDetailResponse {
  id: string;
  name: string;
  type: PlanType;
  status: PlanStatus;
  jurisdiction_id: string;
  version: number;
  owner: { id: string; name: string };
  sections: PlanSection[];
  version_history: PlanVersionHistoryEntry[];
}

/** Exact FRD tone mapping for plan status (same mapping PlanRepository.tsx
 * uses) — rendered via Badge, never a raw colored span. */
const STATUS_TONE: Record<PlanStatus, BadgeTone> = {
  Draft: 'neutral',
  Review: 'warning',
  Approved: 'success',
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sectionAnchorId(sectionId: string): string {
  return `ep-plan-section-${sectionId}`;
}

/**
 * F3 S3.2 — Plan Detail / Reading View. Routed `/plans/{id}`.
 *
 * The content area is constrained to `reading-max` (720px) per F0/F3's
 * explicit requirement — see PlanDetail.css. Version history is strictly
 * read-only: "View this version" opens a modal that can never edit a past
 * version.
 *
 * Phase 3 scope note: TechArch's literal `PlanDetail.version_history` shape
 * only carries `{version_number, reviewed_by, review_action, reviewed_at}`
 * with NO `content_snapshot` embedded in this response (confirmed directly
 * against backend/src/modules/plans/plans.ts's `fetchVersionHistory()`).
 * "View this version" therefore renders a simple summary modal stating who
 * reviewed that version and when, rather than the full historical section
 * text — extending the response shape to embed `content_snapshot` would be
 * a reasonable future enhancement, but is out of this plan's scope to add
 * unprompted since it isn't in the provided interface.
 */
export function PlanDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = React.useState(true);
  const [viewingVersion, setViewingVersion] = React.useState<PlanVersionHistoryEntry | null>(null);

  const planQuery = useQuery({
    queryKey: ['plan', id],
    queryFn: () => apiGet<PlanDetailResponse>(`/api/v1/plans/${id}`),
    enabled: Boolean(id),
  });

  if (planQuery.isError) {
    const message =
      planQuery.error instanceof ApiRequestError
        ? planQuery.error.body.message
        : 'Could not load this plan.';
    return (
      <div className="ep-plan-detail">
        <EmptyState
          title="Plan not found"
          action={
            <Button variant="primary" onClick={() => navigate('/plans')}>
              Back to plans
            </Button>
          }
        >
          {message}
        </EmptyState>
      </div>
    );
  }

  if (planQuery.isLoading || !planQuery.data) {
    return <div className="ep-plan-detail" aria-busy="true" />;
  }

  const plan = planQuery.data;
  const sortedSections = [...plan.sections].sort((a, b) => a.sort_order - b.sort_order);
  const sortedHistory = [...plan.version_history].sort((a, b) => b.version_number - a.version_number);

  return (
    <div className="ep-plan-detail">
      <PageHeader
        title={plan.name}
        status={<Badge tone={STATUS_TONE[plan.status]}>{plan.status}</Badge>}
        subtitle={`v${plan.version}`}
        actions={[
          ...(plan.status === 'Draft'
            ? [
                <Button
                  key="edit"
                  variant="secondary"
                  onClick={() => navigate(`/plans/${plan.id}/edit`)}
                >
                  Edit
                </Button>,
              ]
            : []),
          // Deferred to v2 per REQUIREMENTS.md's F17 scope boundary (same
          // deliberate "render disabled, don't omit" treatment
          // PlanRepository.tsx's "Import plan" action documents).
          <Button
            key="import-version"
            variant="secondary"
            disabled
            title="Live document re-sync (F17) ships in v2"
          >
            Import new version
          </Button>,
        ]}
      />

      <div className="ep-plan-detail__layout">
        <div className="ep-plan-detail__sidebar">
          <Card title="Sections">
            <ul className="ep-plan-detail__jump-links">
              {sortedSections.map((section) => (
                <li key={section.id}>
                  <a href={`#${sectionAnchorId(section.id)}`}>{section.heading}</a>
                  <p className="caption">
                    {section.linked_task_templates.length} linked task
                    {section.linked_task_templates.length === 1 ? '' : 's'}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card
            title="Version history"
            actions={
              <Button variant="ghost" size="sm" onClick={() => setHistoryOpen((o) => !o)}>
                {historyOpen ? 'Collapse' : 'Expand'}
              </Button>
            }
          >
            {historyOpen ? (
              sortedHistory.length > 0 ? (
                <ul className="ep-plan-detail__version-history">
                  {sortedHistory.map((entry) => (
                    <li key={entry.version_number} className="ep-plan-detail__version-row">
                      <div>
                        <p>v{entry.version_number}</p>
                        {entry.review_action ? (
                          <Badge tone={entry.review_action === 'approve' ? 'success' : 'warning'}>
                            {entry.review_action === 'approve' ? 'Approved' : 'Changes requested'}
                          </Badge>
                        ) : (
                          <span className="caption">Pending review</span>
                        )}
                        {entry.reviewed_at ? (
                          <p className="caption">{formatDateTime(entry.reviewed_at)}</p>
                        ) : null}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingVersion(entry)}
                      >
                        View this version
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="caption">No submitted versions yet.</p>
              )
            ) : null}
          </Card>
        </div>

        <div className="ep-plan-detail__content">
          {sortedSections.length === 0 ? (
            <EmptyState title="This plan has no sections yet">
              {plan.status === 'Draft'
                ? 'Edit this plan to add at least one section.'
                : 'No content has been authored for this plan.'}
            </EmptyState>
          ) : (
            sortedSections.map((section) => (
              <section key={section.id} id={sectionAnchorId(section.id)}>
                <h2>{section.heading}</h2>
                <p className="body-lg">{section.body}</p>
              </section>
            ))
          )}
        </div>
      </div>

      <Modal
        open={viewingVersion !== null}
        title={viewingVersion ? `Version ${viewingVersion.version_number}` : ''}
        onClose={() => setViewingVersion(null)}
        footer={
          <Button variant="secondary" onClick={() => setViewingVersion(null)}>
            Close
          </Button>
        }
      >
        {viewingVersion ? (
          <p>
            Version {viewingVersion.version_number} content snapshot —{' '}
            {viewingVersion.review_action
              ? `${viewingVersion.review_action === 'approve' ? 'Approved' : 'Changes requested'}`
              : 'Pending review'}
            {viewingVersion.reviewed_at ? ` on ${formatDateTime(viewingVersion.reviewed_at)}` : ''}.
          </p>
        ) : null}
      </Modal>
    </div>
  );
}
