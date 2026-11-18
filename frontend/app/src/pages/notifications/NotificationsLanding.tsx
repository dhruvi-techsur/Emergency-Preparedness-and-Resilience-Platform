import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button } from '@epmp/design-system';

/**
 * F5 — Notifications landing page. Routed `/notifications`.
 *
 * The UX mockup's Navigation Map (`project_specs/UX-Mockup-EPMP.md:63`)
 * documents TWO independent reach-paths to Compose Notification —
 * "Notifications landing primary action" OR "Incident Workspace 'Compose
 * notification'" — as an OR-requirement, meaning both must exist. 04-07
 * wired only the Incident Workspace half (its PageHeader action, scoped to
 * that one incident via `?incident=<id>`). This page is the other half: a
 * user with NO open incident in front of them reaches Compose here, with
 * no incident context at all.
 *
 * Also hosts plain in-page links to the two existing Notifications
 * sub-screens (Groups, Templates) — both remain independently reachable
 * (Templates also keeps its own direct SideNav sub-item; Groups is now
 * reached from here, per backend/src/modules/auth-org/routes.ts's
 * repointed nav-config entry).
 */
export function NotificationsLanding(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="ep-notifications-landing">
      <PageHeader
        title="Notifications"
        actions={[
          <Button key="compose" variant="primary" onClick={() => navigate('/notifications/compose')}>
            Compose notification
          </Button>,
        ]}
      />

      <Card title="Manage notifications">
        <Button variant="ghost" onClick={() => navigate('/notifications/groups')}>
          Notification groups
        </Button>
        <Button variant="ghost" onClick={() => navigate('/notifications/templates')}>
          Message templates
        </Button>
      </Card>
    </div>
  );
}
