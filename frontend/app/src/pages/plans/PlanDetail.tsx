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
  Alert,
  type BadgeTone,
} from '@epmp/design-system';
import { useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch, ApiRequestError } from '../../lib/api-client';
import { ReviewPlanModal } from './ReviewPlanModal';
import { LinkTasksModal } from './LinkTasksModal';
import { MaterializeTasksModal } from './MaterializeTasksModal';
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

// F17's final hard requirement (Plan 08-06): a "Link live" document whose
// simulated source has changed is flagged here, never silently applied to
// the plan's own content — see this file's document_links Alert rendering
// below. permission_status reflects plans.ts's own per-request
// revalidateDocumentLinkPermission() re-check, not a cached value.
interface PlanDocumentLink {
  id: string;
  external_document_id: string;
  source_system: string;
  mode: 'import_copy' | 'link_live';
  permission_status: 'valid' | 'revoked';
  content_status: 'current' | 'changed';
  content_flagged_at?: string;
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
  document_links: PlanDocumentLink[];
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
  const queryClient = useQueryClient();
  const [historyOpen, setHistoryOpen] = React.useState(true);
  const [viewingVersion, setViewingVersion] = React.useState<PlanVersionHistoryEntry | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = React.useState(false);
  const [linkModalSectionId, setLinkModalSectionId] = React.useState<string | null>(null);
  const [materializeModalOpen, setMaterializeModalOpen] = React.useState(false);
  const [acknowledgingLinkId, setAcknowledgingLinkId] = React.useState<string | null>(null);

  const planQuery = useQuery({
    queryKey: ['plan', id],
    queryFn: () => apiGet<PlanDetailResponse>(`/api/v1/plans/${id}`),
    enabled: Boolean(id),
  });

  async function handleAcknowledge(linkId: string) {
    setAcknowledgingLinkId(linkId);
    try {
      await apiPatch(`/api/v1/plans/${id}/document-links/${linkId}/acknowledge`, {});
      await queryClient.invalidateQueries({ queryKey: ['plan', id] });
    } finally {
      setAcknowledgingLinkId(null);
    }
  }

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
  // 03-10 gap closure (uat:1): a plan with zero linked task templates, or
  // a plan not yet Approved, must never show the materialize control —
  // clicking it would 404/409 against materialize.ts's own gates.
  const hasEligibleSections = sortedSections.some((s) => s.linked_task_templates.length > 0);

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
          // The frontend renders this button whenever the plan is in
          // Review status — it does NOT independently check "does this
          // user hold review permission" beyond that. The actual
          // authorization boundary is 03-03's server-side
          // requirePermission('plans','review') on POST .../review; a
          // user without that permission who somehow reaches this button
          // still gets a 403 from the real gate, matching 02-06's
          // documented pattern for ActivationModal's analogous threat
          // (see this plan's own threat_model, T-03-11).
          ...(plan.status === 'Review'
            ? [
                <Button key="review" variant="primary" onClick={() => setReviewModalOpen(true)}>
                  Review plan
                </Button>,
              ]
            : []),
          // 03-10 gap closure (uat:1): the ONLY new entry point for
          // POST /api/v1/plans/{id}/materialize-tasks — a plan-level
          // action, not per-section (per-section "Link tasks" above is a
          // separate concern: authoring the template, not materializing
          // it). Gated identically to materialize.ts's own server-side
          // checks so this button never appears where clicking it would
          // 404/409.
          ...(plan.status === 'Approved' && hasEligibleSections
            ? [
                <Button
                  key="materialize"
                  variant="primary"
                  onClick={() => setMaterializeModalOpen(true)}
                >
                  Materialize tasks
                </Button>,
              ]
            : []),
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
                  {/* 03-08 fix (Rule 2 - Missing Critical): PlanEditor.tsx
                      already wires LinkTasksModal, but ONLY the Draft
                      editing flow had an entry point to it — the Reading
                      View (this component) had none at all, even though
                      link-tasks is explicitly status-unrestricted
                      (plans.ts's own documented decision: task templates
                      are section metadata, not plan content, so linking
                      works on an Approved plan too). Without this button,
                      a planning user could never link a task template to
                      an ALREADY-APPROVED plan's section without
                      re-opening the Draft editor, which this plan's own
                      materialize-to-real-incident flow requires. */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLinkModalSectionId(section.id)}
                  >
                    Link tasks
                  </Button>
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
          {/* 08-06 (F17 final hard requirement): neither of these Alerts
              blocks rendering of the plan's own sections/content below
              them — both are purely additive notices, matching this
              codebase's "the page never fails to render" resilience
              convention applied to a document-link concern instead of a
              feed-outage concern. The flagged state is produced ONLY by
              the backend's background sync detection (document-adapter.ts's
              runDocumentLinkSync) — this component never alters plan
              content as a side effect of rendering or acknowledging it. */}
          {plan.document_links
            .filter((link) => link.content_status === 'changed')
            .map((link) => (
              <Alert
                key={`content-${link.id}`}
                tone="warning"
                title="Source changed, review"
                actions={
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={acknowledgingLinkId === link.id}
                    onClick={() => void handleAcknowledge(link.id)}
                  >
                    Mark reviewed
                  </Button>
                }
              >
                This document changed in {link.source_system}. Review before relying on the
                current EPMP copy.
              </Alert>
            ))}
          {plan.document_links
            .filter((link) => link.permission_status === 'revoked')
            .map((link) => (
              <Alert key={`permission-${link.id}`} tone="danger" title="Access removed">
                Access to this linked document was removed in {link.source_system}. It's no
                longer visible here.
              </Alert>
            ))}

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

      <ReviewPlanModal
        planId={plan.id}
        planName={plan.name}
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onReviewed={() => void queryClient.invalidateQueries({ queryKey: ['plan', id] })}
      />

      {/* 03-08 fix (Rule 2 - Missing Critical): this Reading View's own
          Link Tasks entry point (see the Sections Card button above) —
          reuses LinkTasksModal exactly as PlanEditor.tsx does. Linking
          works regardless of plan.status (Draft/Review/Approved) per
          plans.ts's link-tasks endpoint's own documented, deliberate
          status-unrestricted design. onLinked refetches the real plan
          detail (this view has no local section state to optimistically
          patch, unlike PlanEditor's in-progress draft), so the newly
          linked template's real id is reflected immediately. */}
      {linkModalSectionId ? (
        <LinkTasksModal
          planId={plan.id}
          sectionId={linkModalSectionId}
          sectionHeading={
            sortedSections.find((s) => s.id === linkModalSectionId)?.heading ?? 'this section'
          }
          existingTemplates={[]}
          open={linkModalSectionId !== null}
          onClose={() => setLinkModalSectionId(null)}
          onLinked={() => void queryClient.invalidateQueries({ queryKey: ['plan', id] })}
        />
      ) : null}

      {/* 03-10 gap closure (uat:1): materializing a task does not change
          the PLAN's own detail response (no section/template count
          changes), only the target incident's task list, which this
          component doesn't render — so no onLinked-style refetch callback
          is needed here, unlike LinkTasksModal above. */}
      <MaterializeTasksModal
        planId={plan.id}
        sections={sortedSections}
        open={materializeModalOpen}
        onClose={() => setMaterializeModalOpen(false)}
      />
    </div>
  );
}
