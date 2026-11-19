import * as React from 'react';
import { PageHeader, Card, EmptyState, Button } from '@epmp/design-system';
import './MyWorkDashboard.css';

/**
 * F18 S18.3 — PER-03 (planning_logistics_chief)'s "My work" dashboard.
 * Routed `/my-work`, reached the moment this persona signs in via
 * RouteGuard's landing-config-driven redirect (Task 2 of this plan).
 *
 * The FRD describes this as a combined view: open tasks/resource requests
 * assigned to the user's section, plus plans pending review. Phase 3's
 * `tasks`/`resource_requests`/`plans` tables genuinely exist in this
 * codebase (confirmed via STATE.md and dashboard.ts's own real queries
 * against them), but no backend endpoint shapes a "my section's pending
 * work across all three" aggregate — each of those 3 features already has
 * its own dedicated list screen (TaskList/ResourceRequestList/
 * PlanRepository) that does real jurisdiction/owner-scoped filtering.
 * Building a brand-new aggregate endpoint spanning all three tables is
 * explicitly out of this plan's 2-3-task budget (it belongs to whichever
 * future plan actually owns a "my work" aggregation concern end to end) —
 * this page is honest about that gap via 3 EmptyState cards rather than
 * faking a filtered list from data it was never asked to fetch. This
 * matches F0's established "EmptyState first, real data only once a real
 * endpoint exists" convention (same convention IncidentWorkspace.tsx's own
 * now-superseded Phase-2 Tasks/Resources-tab placeholders followed before
 * 03-08 replaced them with real endpoints).
 *
 * The 3 named primary actions below are each wired to a documented no-op
 * placeholder — the SAME pattern IncidentWorkspace.tsx already established
 * in Phase 2 for "Generate SITREP"/"New task" before those were later wired
 * to real routes (04-07/03-08 respectively). A future plan that builds the
 * real aggregate/review flows is the natural place to replace these no-ops.
 */
export function MyWorkDashboard(): JSX.Element {
  // Documented no-op placeholders (see file header) — matching
  // IncidentWorkspace.tsx's own prior "Generate SITREP"/"New task" no-op
  // precedent before those actions had real destinations wired.
  const noop = () => {};

  return (
    <div className="ep-my-work-dashboard">
      <PageHeader
        title="My work"
        actions={[
          <Button key="sitrep" variant="secondary" onClick={noop}>
            Generate SITREP
          </Button>,
          <Button key="resource-requests" variant="secondary" onClick={noop}>
            Review resource requests
          </Button>,
          <Button key="plan" variant="secondary" onClick={noop}>
            Review plan
          </Button>,
        ]}
      />

      <div className="ep-my-work-dashboard__cards">
        <Card title="Tasks assigned to you">
          <EmptyState title="Tasks assigned to you ship in a later phase (F3/F4)." />
        </Card>
        <Card title="Resource requests pending your review">
          <EmptyState title="Resource requests pending your review ship in a later phase (F3/F4)." />
        </Card>
        <Card title="Plans pending review">
          <EmptyState title="Plans pending review ship in a later phase (F3/F4)." />
        </Card>
      </div>
    </div>
  );
}
