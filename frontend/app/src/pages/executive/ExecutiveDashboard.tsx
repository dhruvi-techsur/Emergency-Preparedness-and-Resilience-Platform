import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Button, Skeleton, Alert } from '@epmp/design-system';
import { apiGet, ApiRequestError } from '../../lib/api-client';
import './ExecutiveDashboard.css';

/** Matches backend/src/modules/incident-ops/dashboard.ts's response shape
 * (GET /api/v1/dashboard/summary) — the same endpoint EocDashboard.tsx
 * (06-06) already reads. */
interface DashboardSummary {
  active_incidents: number;
  open_tasks: number;
  pending_resource_requests: number;
  notifications_pending_ack: number;
}

/** Matches incidents.ts's GET /api/v1/incidents list response shape — only
 * `total` is read here (a real server-side COUNT, not a paginated-subset
 * length), never `items`. */
interface IncidentsListResponse {
  total: number;
}

/**
 * F18 S18.5 / Screen-01 — PER-05's executive-briefing dashboard. Routed
 * `/executive`, reached only via AppShell's explicit FacetToggle (Task 2
 * of this plan) — never a sign-in default (S18.5's admin facet,
 * `/admin/platform-monitoring`, stays the default per 06-02's seed).
 *
 * No real KPI-definition/baseline/owner/cadence config exists yet (F7's
 * analytics module's `kpis` config is Phase 4 scope, AnalyticsDashboard.tsx
 * reads it from a backend table this screen does NOT reuse — the mockup's
 * own 3-KPI example names different metrics than F7's configured set).
 * This screen hardcodes exactly 3 KPI definitions client-side, matching
 * the mockup's own example, each backed by a REAL computed value where
 * this phase's schema can genuinely answer it, and an honest "Not yet
 * available" placeholder where it can't — never an invented number.
 *
 * **Hard structural cap**: `KPIS` below is a LITERAL 3-entry array, not a
 * `.map()` over a dynamically-sized data source — this makes "never show
 * more than 3 headline numbers" true by construction for this plan's
 * scope, not just a runtime check. If a future phase's real KPI-config
 * source ever returns more than 3 configured KPIs, slice to `.slice(0,3)`
 * explicitly at that future data-fetching boundary before rendering —
 * out of this plan's scope since no such dynamic source exists yet.
 *
 * Layout uses ONLY `PageHeader` + raw `.display`/`.caption` typography
 * classes (the SAME token classes every other page already uses via the
 * design system's typography CSS) — NOT `Card` (the mockup's own text:
 * "No charts, no Card grid, no additional panels") and NOT `Stat` (Stat's
 * `.ep-stat__value` is hardcoded to 32px per its own CSS, the `h1`/`32px`
 * scale — NOT the 40px `display` scale this screen specifically needs
 * per the mockup's own accessibility note: "This is the only screen in
 * EPMP using `display` type scale"). No component in the design system
 * wraps a bare `display`-scale number + caption pair, so raw typography
 * classes applied directly are the correct choice here, not a gap.
 */
export function ExecutiveDashboard(): JSX.Element {
  const navigate = useNavigate();

  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => apiGet<DashboardSummary>('/api/v1/dashboard/summary'),
  });

  const closedIncidentsQuery = useQuery({
    queryKey: ['incidents-closed-total'],
    queryFn: () => apiGet<IncidentsListResponse>('/api/v1/incidents?status=Closed&page_size=1'),
  });

  const isLoading = summaryQuery.isLoading || closedIncidentsQuery.isLoading;
  const isError = summaryQuery.isError || closedIncidentsQuery.isError;

  const activeIncidents = summaryQuery.data?.active_incidents ?? 0;
  const closedIncidents = closedIncidentsQuery.data?.total ?? 0;

  // Deliberately simple proxy metric — NOT F7's real analytics/kpis
  // endpoint (Phase 4, this screen's own scope boundary documented above).
  // 100% minus a scaled active-incident count, floored at 0%. Swapping in
  // a real readiness-posture KPI source later is a drop-in data-fetching
  // change at this one line, not a layout change — the display/caption
  // rendering below never needs to know where the number came from.
  const readinessPct = Math.max(0, 100 - activeIncidents * 10);

  const KPIS = [
    {
      label: 'Readiness posture',
      value: `${readinessPct}%`,
      hint: 'Definition: 100% minus a scaled count of active incidents · Period: current · Source: EPMP incidents (proxy metric — not F7\u2019s configured KPI set, which ships in a later phase)',
    },
    {
      label: 'Incident outcomes',
      value: `${closedIncidents} closed`,
      hint: 'Definition: total incidents closed \u00b7 Period: all time (no date-range filter exists on this endpoint yet) \u00b7 Source: EPMP incidents',
    },
    {
      label: 'Corrective-action closure rate',
      value: 'Not yet available',
      hint: 'Definition: % of AAR corrective actions closed \u00b7 Period: current \u00b7 Source: F7 AAR findings (ships in a later phase)',
    },
  ];

  return (
    <div className="ep-executive-dashboard">
      <PageHeader title="Executive dashboard" subtitle="Operational readiness briefing" />

      {isLoading ? (
        <div className="ep-executive-dashboard__kpi-row">
          <Skeleton w="100%" h={96} />
          <Skeleton w="100%" h={96} />
          <Skeleton w="100%" h={96} />
        </div>
      ) : isError ? (
        <Alert
          tone="danger"
          title="Could not load headline figures"
          actions={
            <Button
              variant="secondary"
              onClick={() => {
                void summaryQuery.refetch();
                void closedIncidentsQuery.refetch();
              }}
            >
              Retry
            </Button>
          }
        >
          {summaryQuery.error instanceof ApiRequestError
            ? summaryQuery.error.body.message
            : 'Headline figures are temporarily unavailable. Retry.'}
        </Alert>
      ) : (
        <div className="ep-executive-dashboard__kpi-row">
          {KPIS.map((kpi) => (
            <div className="ep-executive-dashboard__kpi" key={kpi.label}>
              <p className="overline">{kpi.label}</p>
              <p className="display">{kpi.value}</p>
              <p className="caption">{kpi.hint}</p>
            </div>
          ))}
        </div>
      )}

      <div className="ep-executive-dashboard__footer">
        {/* Phase 4's analytics dashboard DOES exist (reports/analytics
            route, AnalyticsDashboard.tsx) — this link is real and
            correctly placed per the mockup. */}
        <Button variant="ghost" onClick={() => navigate('/reports/analytics')}>
          View full reporting
        </Button>
      </div>
    </div>
  );
}
