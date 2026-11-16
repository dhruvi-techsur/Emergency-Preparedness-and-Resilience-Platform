import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SideNav, type SideNavGroup, type SideNavItem } from '../src/navigation/SideNav';
import { PageHeader } from '../src/navigation/PageHeader';
import { Breadcrumbs } from '../src/navigation/Breadcrumbs';

afterEach(cleanup);

// Same real-cascade proof technique as test/foundations.test.tsx: inject the
// actual tokens.css content so getComputedStyle reflects the real
// [data-theme] cascade rather than a parallel re-declaration in the test.
beforeAll(() => {
  const tokensCssPath = resolve(__dirname, '../tokens/tokens.css');
  const css = readFileSync(tokensCssPath, 'utf-8');
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
});

function withTheme(theme: 'light' | 'dark' | 'contrast', ui: React.ReactElement) {
  return (
    <div className="ep" data-theme={theme}>
      {ui}
    </div>
  );
}

const SEVEN_ITEM_GROUPS: SideNavGroup[] = [
  {
    label: 'Prepare',
    items: [
      { id: 'plans', label: 'Plans', icon: 'file', href: '/plans' },
      { id: 'resources', label: 'Resources', icon: 'truck', href: '/resources' },
      { id: 'training', label: 'Training', icon: 'flag', href: '/training' },
    ],
  },
  {
    label: 'Monitor',
    items: [
      { id: 'incidents', label: 'Incidents', icon: 'broadcast', href: '/incidents' },
      { id: 'feeds', label: 'Feeds', icon: 'wifi-off', href: '/feeds' },
    ],
  },
  {
    label: 'Coordinate',
    items: [
      { id: 'tasks', label: 'Tasks', icon: 'check', href: '/tasks' },
      { id: 'teams', label: 'Teams', icon: 'users', href: '/teams' },
    ],
  },
];

const SIX_BOTTOM_BAR_ITEMS: SideNavItem[] = [
  { id: 'incidents', label: 'Incidents', icon: 'broadcast', href: '/incidents' },
  { id: 'tasks', label: 'Tasks', icon: 'check', href: '/tasks' },
  { id: 'plans', label: 'Plans', icon: 'file', href: '/plans' },
  { id: 'teams', label: 'Teams', icon: 'users', href: '/teams' },
  { id: 'resources', label: 'Resources', icon: 'truck', href: '/resources' },
  { id: 'feeds', label: 'Feeds', icon: 'wifi-off', href: '/feeds' },
];

describe('SideNav — rail variant', () => {
  it('renders all 7 item labels across 3 groups, and the current item carries the brand-subtle background', () => {
    const { container } = render(
      withTheme(
        'light',
        <SideNav groups={SEVEN_ITEM_GROUPS} current="incidents" />,
      ),
    );

    const allLabels = SEVEN_ITEM_GROUPS.flatMap((g) => g.items.map((i) => i.label));
    expect(allLabels).toHaveLength(7);
    for (const label of allLabels) {
      expect(container.textContent).toContain(label);
    }

    const currentLink = container.querySelector('.ep-sidenav__item--current') as HTMLElement;
    expect(currentLink).toBeTruthy();
    expect(currentLink.textContent).toContain('Incidents');
    expect(currentLink.getAttribute('aria-current')).toBe('page');

    // Computed-style proof: the current item's background resolves to the
    // SAME color as the themed element's cascaded --brand-subtle custom
    // property (not just that a class name is present).
    const themed = container.querySelector('[data-theme]') as HTMLElement;
    const brandSubtle = getComputedStyle(themed).getPropertyValue('--brand-subtle').trim();
    expect(brandSubtle).toBeTruthy();

    const sideNavCss = readFileSync(
      resolve(__dirname, '../src/navigation/SideNav.css'),
      'utf-8',
    );
    expect(sideNavCss).toMatch(/\.ep-sidenav__item--current\s*{[^}]*var\(--brand-subtle\)/);
  });

  it('renders the default gold-square + EPMP h4 brand mark', () => {
    const { container } = render(
      withTheme('light', <SideNav groups={SEVEN_ITEM_GROUPS} current="incidents" />),
    );
    expect(container.querySelector('.ep-sidenav__brand-square')).toBeTruthy();
    const brandName = container.querySelector('.ep-sidenav__brand-name');
    expect(brandName?.textContent).toBe('EPMP');
    expect(brandName?.tagName).toBe('SPAN');
    expect(brandName?.className).toContain('h4');
  });
});

describe('SideNav — bottom-bar variant', () => {
  it('caps at exactly 4 rendered items even when 6 mobileBottomBarItems are passed', () => {
    const { container } = render(
      withTheme(
        'light',
        <SideNav
          groups={[]}
          current="incidents"
          variant="bottom-bar"
          mobileBottomBarItems={SIX_BOTTOM_BAR_ITEMS}
        />,
      ),
    );

    const renderedItems = container.querySelectorAll('.ep-sidenav__bottom-item');
    expect(renderedItems).toHaveLength(4);

    const renderedLabels = Array.from(renderedItems).map((el) => el.textContent?.trim());
    expect(renderedLabels).toEqual(['Incidents', 'Tasks', 'Plans', 'Teams']);
    // The 5th/6th items must NOT appear anywhere in the bottom bar.
    expect(container.textContent).not.toContain('Resources');
    expect(container.textContent).not.toContain('Feeds');
  });
});

describe('PageHeader — single h1 per render', () => {
  it('renders exactly one h1 per separate render container (not cumulative across renders)', () => {
    const first = render(withTheme('light', <PageHeader title="Incidents" />));
    expect(first.container.querySelectorAll('h1')).toHaveLength(1);
    first.unmount();

    const second = render(withTheme('light', <PageHeader title="Plans" />));
    expect(second.container.querySelectorAll('h1')).toHaveLength(1);
    expect(second.container.querySelector('h1')?.textContent).toBe('Plans');
    second.unmount();
  });
});

describe('Breadcrumbs — last item is non-interactive', () => {
  it('renders 3 items with the last one having no enclosing <a>', () => {
    const { container } = render(
      withTheme(
        'light',
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Incidents', href: '/incidents' },
            { label: 'Riverbend Flood' },
          ]}
        />,
      ),
    );

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    for (const link of Array.from(links)) {
      expect(link.textContent).not.toBe('Riverbend Flood');
    }

    const current = container.querySelector('[aria-current="page"]');
    expect(current?.textContent).toBe('Riverbend Flood');
    expect(current?.tagName).not.toBe('A');
  });
});
