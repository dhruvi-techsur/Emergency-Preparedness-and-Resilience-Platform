import * as React from 'react';
import { Icon, type IconName } from '../foundations/Icon';
import './SideNav.css';

/**
 * EPMP Design System — SideNav (NAVIGATION)
 *
 * The app shell's primary navigation. 240px wide (`var(--nav-width)`),
 * `bg-subtle` rail, brand mark at top, items grouped by the lifecycle labels
 * the caller provides (Prepare, Monitor, Activate, Coordinate, Recover,
 * Improve). 6-9 top-level items, one level only.
 *
 * **Role-scoping is structural, not visual.** The caller supplies only the
 * `groups`/`items` the current role is permitted — this component never
 * disables or grays out an item the role can't use; an item the role
 * doesn't permit is simply absent from the `groups` array passed in.
 *
 * **Current item emphasis** is a filled `brand-subtle` background on the
 * whole row with `brand-text` text — never a colored side border (the
 * anti-pattern this spec explicitly calls out).
 *
 * **Collapsed state is an explicit boolean prop**, not something this
 * component infers from `window` width — keeps the library free of
 * `window` access (portable to SSR/tests). The consuming app (01-10) is
 * responsible for driving `collapsed` from its own viewport detection
 * (below `bp-md`) or a manual toggle.
 *
 * **Bottom-bar fallback:** under `bp-md`, the app renders this component
 * with `variant="bottom-bar"` instead of toggling `collapsed` — a fixed
 * horizontal bar of exactly the first 4 `mobileBottomBarItems`, structurally
 * capped even if more are passed (matches the `role_landing_config
 * .mobile_bottom_bar_items` DB constraint of max 4). This component does
 * not pick the variant itself; the consuming app decides based on its own
 * viewport width.
 *
 * Collapsed rail items have no `Tooltip` component yet in this phase, so
 * the native `title` attribute is used as an interim accessible fallback.
 * TODO: replace with `Tooltip` once it is built later in the design system.
 */

export interface SideNavItem {
  id: string;
  label: string;
  icon: IconName;
  href: string;
}

export interface SideNavGroup {
  /** Stable, machine-readable group identifier (e.g. 'field', 'admin') —
   * distinct from `label` (the human-readable display text, which can
   * change wording without breaking a consumer that selects a group by
   * `id`). Optional for backward compatibility with any caller not yet
   * supplying one; falls back to `label` if absent. */
  id?: string;
  label?: string;
  items: SideNavItem[];
}

export interface SideNavProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  /** Required. Caller supplies only the groups/items the current role may see. */
  groups: SideNavGroup[];
  /** The active item id. */
  current: string;
  /** Overrides the default gold-square + "EPMP" h4 brand mark. */
  brand?: React.ReactNode;
  /**
   * Explicit collapsed state — 64px icon-only rail. The app shell drives
   * this from its own resize/viewport logic; this component never reads
   * `window` itself.
   */
  collapsed?: boolean;
  /** 'rail' (default, desktop/tablet) or 'bottom-bar' (field mobile). */
  variant?: 'rail' | 'bottom-bar';
  /**
   * Field-mobile bottom-bar destinations. Only the first 4 are ever
   * rendered when `variant="bottom-bar"`, regardless of array length —
   * matches the DB-level max-4 constraint structurally, not just by
   * convention.
   */
  mobileBottomBarItems?: SideNavItem[];
}

const DEFAULT_BRAND = (
  <div className="ep-sidenav__brand-mark">
    <span className="ep-sidenav__brand-square" aria-hidden="true" />
    <span className="ep-sidenav__brand-name h4">EPMP</span>
  </div>
);

export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(function SideNav(
  {
    groups,
    current,
    brand,
    collapsed = false,
    variant = 'rail',
    mobileBottomBarItems = [],
    className,
    ...rest
  },
  ref,
) {
  if (variant === 'bottom-bar') {
    const barItems = mobileBottomBarItems.slice(0, 4);
    const classes = ['ep-sidenav', 'ep-sidenav--bottom-bar', className ?? '']
      .filter(Boolean)
      .join(' ');
    return (
      <nav ref={ref} aria-label="Primary" className={classes} {...rest}>
        <ul className="ep-sidenav__bottom-list">
          {barItems.map((item) => {
            const isCurrent = item.id === current;
            return (
              <li key={item.id} className="ep-sidenav__bottom-item-wrap">
                <a
                  href={item.href}
                  className={[
                    'ep-sidenav__bottom-item',
                    isCurrent ? 'ep-sidenav__bottom-item--current' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  <Icon name={item.icon} size="default" aria-hidden="true" />
                  <span className="ep-sidenav__bottom-label">{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  const classes = [
    'ep-sidenav',
    'ep-sidenav--rail',
    collapsed ? 'ep-sidenav--collapsed' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav ref={ref} aria-label="Primary" className={classes} {...rest}>
      <div className="ep-sidenav__brand">{brand ?? DEFAULT_BRAND}</div>
      {groups.map((group, groupIndex) => (
        <div
          className="ep-sidenav__group"
          key={group.label ?? `group-${groupIndex}`}
        >
          {group.label && !collapsed ? (
            <div className="ep-sidenav__group-label overline">{group.label}</div>
          ) : null}
          <ul className="ep-sidenav__list">
            {group.items.map((item) => {
              const isCurrent = item.id === current;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={[
                      'ep-sidenav__item',
                      isCurrent ? 'ep-sidenav__item--current' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-current={isCurrent ? 'page' : undefined}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon name={item.icon} size="default" aria-hidden="true" />
                    {!collapsed ? (
                      <span className="ep-sidenav__item-label">{item.label}</span>
                    ) : (
                      <span className="ep-sidenav__visually-hidden">{item.label}</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
});
