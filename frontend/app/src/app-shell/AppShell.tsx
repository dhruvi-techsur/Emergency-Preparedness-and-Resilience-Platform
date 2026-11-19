import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  SideNav,
  Breadcrumbs,
  Combobox,
  IconButton,
  Avatar,
  Button,
  type SideNavGroup,
  type BreadcrumbItem,
} from '@epmp/design-system';
import { useAuth } from '../auth/auth-context';
import { apiGet } from '../lib/api-client';
import { signOut } from '../auth/oidc-config';
import { clearSessionToken } from '../auth/session-storage';
import { ThemeSwitcher } from './ThemeSwitcher';
import './AppShell.css';

interface NavConfigResponse {
  nav_groups: SideNavGroup[];
}

/**
 * SideNav's `collapsed`/`variant` props are explicit booleans the component
 * never infers itself (frontend/design-system/src/navigation/SideNav.tsx
 * docstring) — the consuming app owns viewport detection. This is that
 * detection: a simple matchMedia listener against --bp-md (768px), the
 * same breakpoint value the design system's own CSS uses.
 */
function useIsBelowBpMd(): boolean {
  const [isBelow, setIsBelow] = React.useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  );

  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const listener = (e: MediaQueryListEvent) => setIsBelow(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return isBelow;
}

/**
 * Derives Breadcrumbs items from the current route path. Phase 1 has no
 * page-title registry, so each segment is title-cased from its URL slug —
 * sufficient for the admin-console-only routes this phase ships (e.g.
 * /admin/users -> "Admin" / "Users"). A future phase with a richer route
 * tree can replace this with a real route-metadata lookup without changing
 * AppShell's contract.
 */
function useBreadcrumbItems(): BreadcrumbItem[] {
  const location = useLocation();
  return React.useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return [{ label: 'Home' }];
    }
    let hrefAcc = '';
    return segments.map((seg, i) => {
      hrefAcc += `/${seg}`;
      const label = seg
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const isLast = i === segments.length - 1;
      return isLast ? { label } : { label, href: hrefAcc };
    });
  }, [location.pathname]);
}

export function AppShell(): JSX.Element {
  const { user } = useAuth();
  const location = useLocation();
  const isBelowBpMd = useIsBelowBpMd();
  const breadcrumbItems = useBreadcrumbItems();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  // Fetched once via react-query; re-fetched whenever the resolved user's
  // role changes (queryKey includes role.id), per the plan's "re-fetched
  // on role change" requirement.
  const { data: navConfig } = useQuery({
    queryKey: ['nav-config', user.role?.id],
    queryFn: () => apiGet<NavConfigResponse>('/api/v1/me/nav-config'),
  });

  const navGroups = navConfig?.nav_groups ?? [];
  const flatItems = navGroups.flatMap((g) => g.items);
  const currentItem = flatItems.find((item) => location.pathname.startsWith(item.href));

  // UAT gap ref 8 (05-UAT.md, blocker) fix: the mobile bottom-bar must show
  // the Field group's own 4 items specifically, not the first 4 items of
  // the WHOLE flattened nav_groups array. A field_responder holds broad
  // Phase 1-4 view-only grants (plans/incidents/tasks/resource_requests/
  // notifications/reporting), so those groups populate flatItems BEFORE the
  // Field group's own items ever appear — flatItems.slice(0,4) therefore
  // handed SideNav's bottom-bar variant the WRONG 4 items for this exact
  // real persona. Selecting by nav_groups[].id === 'field' (a stable,
  // machine-readable identifier the backend now emits per-group,
  // routes.ts) rather than guessing a position or matching on the
  // human-readable `label` closes this regardless of emission order or any
  // future group-label wording change.
  const fieldGroup = navGroups.find((g) => g.id === 'field');
  const mobileBottomBarItems = fieldGroup ? fieldGroup.items : flatItems;

  const handleSignOut = () => {
    clearSessionToken();
    void signOut();
  };

  return (
    <div className="ep-shell">
      {/* Skip-to-content MUST be the first focusable element on every page
          (F0 §S0.1) — it is the literal first child rendered here. */}
      <a href="#main-content" className="ep-shell__skip-link">
        Skip to content
      </a>

      {!isBelowBpMd ? (
        <SideNav
          className="ep-shell__nav ep-shell__nav--rail"
          groups={navGroups}
          current={currentItem?.id ?? ''}
        />
      ) : null}

      <div className="ep-shell__main-col">
        <header className="ep-shell__header">
          <div className="ep-shell__header-left">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <div className="ep-shell__header-center">
            {/*
              Global search is a deliberate Phase-1 no-op: GET /api/v1/search
              (F0's documented search endpoint) isn't built until a feature
              with search-indexable content exists, and nothing in Phase 1
              is searchable yet. A real, visibly-present-but-inert search
              box ships here rather than omitting the header region
              entirely or shipping something that looks functional but
              errors on every keystroke.
            */}
            <Combobox
              label="Search"
              placeholder="Search (coming soon)"
              options={[]}
              disabled
            />
          </div>

          <div className="ep-shell__header-right">
            {/*
              Alerts IconButton: also a deliberate Phase-1 no-op placeholder
              (badge-less) — no alerting feature exists yet in this phase.
            */}
            <IconButton icon="bell" label="Alerts (coming soon)" disabled />

            <button
              type="button"
              className="ep-shell__profile-trigger"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              aria-label={`${user.name} — profile menu`}
            >
              <Avatar name={user.name} />
            </button>

            {profileMenuOpen ? (
              <div className="ep-shell__profile-menu" role="menu">
                <ThemeSwitcher />
                <Button variant="secondary" onClick={handleSignOut}>
                  Sign out
                </Button>
              </div>
            ) : null}
          </div>
        </header>

        <main id="main-content" className="ep-shell__content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {isBelowBpMd ? (
        <SideNav
          className="ep-shell__nav ep-shell__nav--bottom-bar"
          variant="bottom-bar"
          groups={[]}
          mobileBottomBarItems={mobileBottomBarItems}
          current={currentItem?.id ?? ''}
        />
      ) : null}
    </div>
  );
}

