import * as React from 'react';
import { PageHeader, EmptyState } from '@epmp/design-system';
import './FieldHome.css';

/**
 * F18 S18.4 — PER-04 (field_responder)'s landing screen. Routed `/field`,
 * reached the moment this persona signs in via RouteGuard's
 * landing-config-driven redirect (06-02's GET /api/v1/me/landing-config,
 * seeded by 06-02's own role_landing_config row for field_responder:
 * `default_landing_route: '/field', nav_groups: []`).
 *
 * IMPORTANT — scope boundary, read before touching this file: Phase 5
 * (Mobile Field Operations, F6) is UNEXECUTED in this codebase (confirmed
 * via STATE.md: only unexecuted PLAN.md files exist for 05-01..05-06, zero
 * real `field_reports`/`FieldMobileShell`/offline-queue code has ever been
 * built). This page therefore does NOT attempt to build F6's real mobile
 * shell, structured observation forms, photo/location capture, or offline
 * sync queue — none of that exists yet, and faking it here would be
 * dishonest about what's actually implemented. This plan's job is
 * narrower and fully independent of F6's real content: prove F18's S18.4
 * role-scoped-landing contract — PER-04 lands on `/field`, sees
 * bottom-bar-only navigation with exactly 4 destinations, and NEVER sees
 * a desktop SideNav rail at any viewport width — regardless of whether
 * F6's real feature content exists yet.
 *
 * When Phase 5 eventually executes, its own plans replace this
 * EmptyState body with real content (task list, Report Observation
 * button, etc.) — the route (`/field`) and the no-SideNav-for-this-role
 * AppShell behavior established here (AppShell.tsx's `forcedBottomBar`
 * branch, this plan's Task 2) do not need to change.
 *
 * Division of responsibility: THIS component only renders a page body.
 * It cannot itself prevent AppShell from rendering a desktop SideNav rail
 * next to it — that enforcement is AppShell-level (Task 2's
 * `forcedBottomBar` override, keyed off `user.role?.persona_id ===
 * 'PER-04'`), not something a routed child page can control from inside
 * its own render tree.
 */
export function FieldHome(): JSX.Element {
  return (
    <div className="ep-field-home">
      <PageHeader title="Field home" />
      <EmptyState title="Field operations ship in a later phase">
        Structured observation forms, task updates, and offline sync (F6) are built in a
        dedicated mobile phase. This landing proves PER-04&apos;s role-scoped navigation &mdash;
        bottom bar only, no desktop SideNav &mdash; per F18 S18.4.
      </EmptyState>
    </div>
  );
}
