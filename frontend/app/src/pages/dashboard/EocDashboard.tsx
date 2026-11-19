import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Stat,
  EmptyState,
  Skeleton,
  Alert,
  Button,
} from '@epmp/design-system';
import { apiGet, ApiRequestError } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';
import './EocDashboard.css';

/** Matches backend/src/modules/incident-ops/dashboard.ts's exact response
 * shape (GET /api/v1/dashboard/summary) — 06-01's own doc comment there is
 * the authority on which of these 4 fields are real queries vs. documented
 * structural zeros in this phase's schema. */
interface DashboardSummary {
  active_incidents: number;
  open_tasks: number;
  pending_resource_requests: number;
  notifications_pending_ack: number;
}

interface JurisdictionsResponse {
  items: { id: string; name: string }[];
}

/**
 * F18 S18.1 — PER-01 (eoc_director)'s EOC Dashboard. Routed `/dashboard`,
 * reached the moment this persona signs in via RouteGuard's
 * landing-config-driven redirect (Task 2 of this plan).
 *
 * Only 1 of the 4 Stat tiles (`active_incidents`) reads a value this phase's
 * schema can genuinely answer with a jurisdiction-scoped query — the other
 * 3 are documented, honest structural zeros per dashboard.ts's own inline
 * comments (Phase 3/4 tables exist but their business meaning for THIS
 * exact metric doesn't, or — for `notifications_pending_ack` — the schema
 * has no per-recipient user_id column at all). Each zero-valued tile's
 * `hint` states that plainly rather than letting a bare "0" look like
 * either a bug or "nothing is happening" — directly satisfying F0's
 * "every data point states its source/limitation" rule rather than hiding
 * the gap behind a confident-looking number.
 */
export function EocDashboard(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  const jurisdictionsQuery = useQuery({
    queryKey: ['jurisdictions'],
    queryFn: () => apiGet<JurisdictionsResponse>('/api/v1/jurisdictions'),
  });

  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => apiGet<DashboardSummary>('/api/v1/dashboard/summary'),
  });

  // The user's own jurisdiction_scope may hold several ids (a future
  // multi-jurisdiction grant) — the subtitle only ever names the FIRST one,
  // same "resolve one representative name" simplification 01-11's
  // UserDetail.tsx already established for a per-user jurisdiction display,
  // rather than inventing a new "primary jurisdiction" concept this schema
  // doesn't have.
  const firstScopeId = user.jurisdiction_scope[0];
  const jurisdictionName = jurisdictionsQuery.data?.items.find(
    (j) => j.id === firstScopeId,
  )?.name;

  const summary = summaryQuery.data;

  return (
    <div className="ep-eoc-dashboard">
      <PageHeader
        title="Dashboard"
        subtitle={jurisdictionName ? `${jurisdictionName} \u00b7 EOC Director` : 'EOC Director'}
      />

      {summaryQuery.isLoading ? (
        <div className="ep-eoc-dashboard__stat-row">
          <Skeleton w="100%" h={104} />
          <Skeleton w="100%" h={104} />
          <Skeleton w="100%" h={104} />
          <Skeleton w="100%" h={104} />
        </div>
      ) : summaryQuery.isError ? (
        <Alert
          tone="danger"
          title="Could not load dashboard summary"
          actions={
            <Button variant="secondary" onClick={() => summaryQuery.refetch()}>
              Retry
            </Button>
          }
        >
          {summaryQuery.error instanceof ApiRequestError
            ? summaryQuery.error.body.message
            : 'The dashboard summary request timed out or failed. Try again.'}
        </Alert>
      ) : (
        <div className="ep-eoc-dashboard__stat-row">
          <Stat label="Active incidents" value={summary?.active_incidents ?? 0} />
          <Stat
            label="Open tasks"
            value={summary?.open_tasks ?? 0}
            hint="Tasks module ships in a later phase"
          />
          <Stat
            label="Pending resource requests"
            value={summary?.pending_resource_requests ?? 0}
            hint="Resource requests module ships in a later phase"
          />
          <Stat
            label="Notifications pending ack"
            value={summary?.notifications_pending_ack ?? 0}
            hint="Per-recipient acknowledgment ships in a later phase"
          />
        </div>
      )}

      <div className="ep-eoc-dashboard__cards">
        {summaryQuery.isLoading ? (
          <>
            <Skeleton w="100%" h={160} />
            <Skeleton w="100%" h={160} />
          </>
        ) : (
          <>
            {/* Map-thumbnail placeholder — the SAME documented Phase-2
                simplification IncidentWorkspace.tsx's own "Map" Card already
                established (no live map-engine license/tile-server
                credential exists in this sandbox): a link out to F2's full
                operating picture rather than a live mini-map embedded here. */}
            <Card title="Operating picture">
              <p className="caption">
                The full common operating picture for your jurisdiction is available separately.
              </p>
              <Button variant="ghost" onClick={() => navigate('/operating-picture')}>
                Open operating picture
              </Button>
            </Card>

            {/* No cross-incident Timeline-aggregation endpoint exists yet —
                Phase 2's Timeline (data/Timeline.tsx) is per-incident only
                (incident-ops/incidents.ts's GET .../timeline). Building a
                new aggregation endpoint spanning every incident this user's
                jurisdiction can see is explicitly out of this plan's
                2-3-task budget; this EmptyState documents that gap honestly
                rather than faking a feed. */}
            <Card title="Recent activity">
              <EmptyState title="Activity feed ships in a later phase">
                A cross-incident activity feed isn't built yet. Open an incident's own Timeline
                tab for its activity.
              </EmptyState>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
