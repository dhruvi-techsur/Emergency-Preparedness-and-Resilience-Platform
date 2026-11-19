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
  type SideNavItem,
  type BreadcrumbItem,
} from '@epmp/design-system';
import { useAuth } from '../auth/auth-context';
import { apiGet } from '../lib/api-client';
import { signOut } from '../auth/oidc-config';
import { clearSessionToken } from '../auth/session-storage';
import { ThemeSwitcher } from './ThemeSwitcher';
import { FacetToggle } from './FacetToggle';
import './AppShell.css';

interface NavConfigResponse {
  nav_groups: SideNavGroup[];
}

/** Matches backend/src/modules/auth-org/landing-config.ts's success-path
 * response shape (06-02). AppShell only reads `mobile_bottom_bar_items`
 * from this — `default_landing_route` is RouteGuard's own concern
 * (06-06's redirect), not AppShell's. */
interface LandingConfigResponse {
  mobile_bottom_bar_items: SideNavItem[];
}

/**
 * S18.5's executive facet — a static, client-side 2-item SideNav
 * (Executive dashboard, Reports), distinct from the admin facet's
 * server-fetched `nav_groups`. This plan's own 06-02 role_landing_config
 * row for secops_admin deliberately carries ONLY the admin facet's
 * nav_groups (the schema's role_id UNIQUE constraint allows exactly one
 * row per role, with no second-facet field) — the executive facet's nav
 * is documented there as a static client-side array, not server-fetched.
 */
const EXECUTIVE_FACET_GROUPS: SideNavGroup[] = [
  {
    id: 'executive',
    label: 'Executive',
    items: [
      { id: 'executive-dashboard', label: 'Executive dashboard', icon: 'sliders', href: '/executive' },
      { id: 'executive-reports', label: 'Reports', icon: 'file', href: '/reports/analytics' },
    ],
  },
];

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

  // F18 S18.5 — PER-05's explicit Admin/Executive facet state. Initialized
  // fresh to 'admin' on EVERY mount, never from a persisted source
  // (localStorage/query param/anything else implicit) — a fresh page load
  // always re-renders AppShell from scratch, so this state can never carry
  // over from a prior session. This is what makes "the system must never
  // auto-select a facet on the user's behalf" (F18's own Validation rule)
  // true structurally, not just by convention: the ONLY way this value
  // ever becomes 'executive' is a real onChange call from FacetToggle's
  // underlying <select>, itself only ever fired by a user interaction.
  const [facet, setFacet] = React.useState<'admin' | 'executive'>('admin');
  const isSecopsAdmin = user.role?.persona_id === 'PER-05';
  // F18 S18.4 — PER-04 never sees the desktop SideNav rail, at ANY
  // viewport width, per the FRD's explicit "No desktop SideNav variant is
  // offered to this role by default... regardless of viewport" (not just
  // under the bp-md breakpoint, unlike every other role's purely
  // viewport-driven rail/bottom-bar split below). This is the ONE
  // role-specific override to AppShell's otherwise-viewport-only
  // rail/bottom-bar decision, justified directly by F18's own spec text.
  const forcedBottomBar = user.role?.persona_id === 'PER-04';

  // Fetched once via react-query; re-fetched whenever the resolved user's
  // role changes (queryKey includes role.id), per the plan's "re-fetched
  // on role change" requirement.
  const { data: navConfig } = useQuery({
    queryKey: ['nav-config', user.role?.id],
    queryFn: () => apiGet<NavConfigResponse>('/api/v1/me/nav-config'),
  });

  // F18 (06-02) — PER-04's own seeded mobile_bottom_bar_items row (4
  // bottom-bar destinations straight from role_landing_config), fetched
  // the SAME way nav-config already is above. nav-config's own handler
  // returns nav_groups (desktop-shaped) only, never a dedicated
  // bottom-bar array — landing-config is the real source for that shape.
  const { data: landingConfig } = useQuery({
    queryKey: ['landing-config', user.role?.id],
    queryFn: () => apiGet<LandingConfigResponse>('/api/v1/me/landing-config'),
  });

  const navGroups = navConfig?.nav_groups ?? [];
  const flatItems = navGroups.flatMap((g) => g.items);
  const currentItem = flatItems.find((item) => location.pathname.startsWith(item.href));

  // S18.5 — the executive facet renders its OWN distinct 2-item SideNav
  // (Executive dashboard, Reports) INSTEAD OF the fetched nav_groups, per
  // S18.5's own spec ("each facet's SideNav/landing view is fully
  // distinct") and 06-02's documented decision that the executive facet's
  // nav is a static client-side array, not server-fetched. This is an
  // ADDITIVE conditional branch — every other persona (and PER-05's own
  // admin facet) renders the existing navGroups-driven SideNav unchanged.
  const effectiveNavGroups =
    isSecopsAdmin && facet === 'executive' ? EXECUTIVE_FACET_GROUPS : navGroups;

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
  //
  // F18 (06-07): prefer landing-config's own mobile_bottom_bar_items
  // WHENEVER it is non-empty (PER-04's seeded 4-item row is the primary
  // intended consumer) — falling back to the pre-existing
  // fieldGroup/flatItems derivation for any role with an empty/absent
  // mobile_bottom_bar_items, preserving every other persona's current
  // behavior unchanged (PER-05's row is seeded `null`, so it always falls
  // through to the pre-existing branch — irrelevant anyway since PER-05
  // never renders the bottom-bar variant at all, having no
  // field_responder/mobile context).
  const fieldGroup = navGroups.find((g) => g.id === 'field');
  const landingBottomBarItems = landingConfig?.mobile_bottom_bar_items ?? [];
  const mobileBottomBarItems =
    landingBottomBarItems.length > 0
      ? landingBottomBarItems
      : fieldGroup
        ? fieldGroup.items
        : flatItems;

  const handleSignOut = () => {
    clearSessionToken();
    void signOut();
  };

  return (
    <div className="ep ep-shell">
      {/* Skip-to-content MUST be the first focusable element on every page
          (F0 §S0.1) — it is the literal first child rendered here. */}
      <a href="#main-content" className="ep-shell__skip-link">
        Skip to content
      </a>

      {/* F18 S18.4 — PER-04 forces the bottom-bar variant at EVERY
          viewport width (not just below bp-md), the one role-specific
          override to this otherwise-viewport-only rail/bottom-bar
          decision — see `forcedBottomBar`'s own doc comment above. */}
      {!isBelowBpMd && !forcedBottomBar ? (
        <SideNav
          className="ep-shell__nav ep-shell__nav--rail"
          groups={effectiveNavGroups}
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

            {/* F18 S18.5 — rendered ONLY for secops_admin (PER-05); every
                other role never sees this control at all, since no other
                persona has a second facet to switch to. */}
            {isSecopsAdmin ? <FacetToggle facet={facet} onChange={setFacet} /> : null}

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

      {isBelowBpMd || forcedBottomBar ? (
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

