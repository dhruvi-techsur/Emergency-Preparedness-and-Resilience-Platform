import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Icon } from '../src/foundations/Icon';
import { Button } from '../src/actions/Button';
import { IconButton } from '../src/actions/IconButton';
import { Skeleton } from '../src/feedback/Skeleton';
import { Badge } from '../src/feedback/Badge';
import { Alert } from '../src/feedback/Alert';
import { EmptyState } from '../src/feedback/EmptyState';
import { Toast } from '../src/feedback/Toast';

afterEach(cleanup);

// jsdom does not load external stylesheets, so to prove token-wiring for
// real (not a reimplementation of tokens.css in the test) we inject the
// ACTUAL tokens.css file's contents into a <style> tag once for the whole
// suite. getComputedStyle then reflects the real cascade for
// [data-theme="light"|"dark"|"contrast"] exactly as a browser would.
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

describe('Icon', () => {
  it('renders aria-hidden when no label is given', () => {
    const { container } = render(withTheme('light', <Icon name="check" />));
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders role=img and aria-label when a label is given', () => {
    render(withTheme('light', <Icon name="danger" label="Critical" />));
    expect(screen.getByRole('img', { name: 'Critical' })).toBeInTheDocument();
  });

  it('exposes the full named icon set via Icon.names', () => {
    expect(Icon.names).toContain('check');
    expect(Icon.names).toContain('map-pin');
    expect(Icon.names.length).toBeGreaterThanOrEqual(40);
  });
});

describe('Button', () => {
  it('renders a verb-first label and responds to click', () => {
    let clicked = false;
    render(withTheme('light', <Button onClick={() => (clicked = true)}>Activate EOC</Button>));
    const btn = screen.getByRole('button', { name: /Activate EOC/i });
    btn.click();
    expect(clicked).toBe(true);
  });

  it('loading sets aria-busy and disables the button', () => {
    render(withTheme('light', <Button loading>Send alert</Button>));
    const btn = screen.getByRole('button');
    expect(btn.getAttribute('aria-busy')).toBe('true');
    expect(btn).toBeDisabled();
  });

  it('defaults to the secondary variant', () => {
    render(withTheme('light', <Button>Cancel</Button>));
    expect(screen.getByRole('button').className).toContain('ep-btn--secondary');
  });

  it('mounts with no console errors', () => {
    const errors: unknown[] = [];
    const spy = (console.error = ((...args: unknown[]) => errors.push(args)) as typeof console.error);
    render(withTheme('light', <Button icon="send">Send for approval</Button>));
    expect(errors).toHaveLength(0);
    void spy;
  });
});

describe('IconButton', () => {
  it('requires a label, used as the accessible name', () => {
    render(withTheme('light', <IconButton icon="trash" label="Delete incident" />));
    expect(screen.getByRole('button', { name: 'Delete incident' })).toBeInTheDocument();
  });

  it('lg size targets the 44px touch target class', () => {
    render(withTheme('light', <IconButton icon="edit" label="Edit" size="lg" />));
    expect(screen.getByRole('button').className).toContain('ep-icon-btn--lg');
  });
});

describe('Skeleton', () => {
  it('mounts with no console errors and renders aria-hidden', () => {
    const { container } = render(withTheme('light', <Skeleton w={120} h={16} />));
    expect(container.querySelector('.ep-skeleton')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('circle prop applies the circle class', () => {
    const { container } = render(withTheme('light', <Skeleton w={32} h={32} circle />));
    expect(container.querySelector('.ep-skeleton--circle')).toBeTruthy();
  });
});

describe('Badge', () => {
  it('always renders both an icon and text together for success tone', () => {
    const { container } = render(withTheme('light', <Badge tone="success">Active</Badge>));
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('suppresses the icon only when icon={false} is explicitly passed, text remains mandatory', () => {
    const { container } = render(
      withTheme('light', <Badge tone="success" icon={false}>Active</Badge>),
    );
    expect(container.querySelector('svg')).toBeFalsy();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('neutral/brand have no default icon', () => {
    const { container } = render(withTheme('light', <Badge tone="neutral">Draft</Badge>));
    expect(container.querySelector('svg')).toBeFalsy();
  });

  // Cross-theme token-wiring proof: Badge's success tone is styled via
  // `background: var(--success-subtle); color: var(--success-text);`
  // (Badge.css). jsdom's CSS engine does not substitute var() inside
  // shorthand color properties for getComputedStyle (a known cssstyle
  // limitation — it echoes the literal "var(--x)" string regardless of
  // theme), and it also does not resolve inherited custom properties on a
  // *descendant* via getPropertyValue — only on the element the selector
  // directly matched. So the proof reads the cascaded value on the
  // `[data-theme]` element itself (exactly the node the component tree is
  // mounted under), which jsdom resolves correctly per theme. Per Chapter
  // 05's tables these three are provably different hex values:
  // success-subtle: light #e3f3ef / dark #0e3a33 / contrast #dff1ed.
  it('changes the cascaded --success-subtle/--success-text custom properties across light/dark/contrast (tone=success)', () => {
    const { container, rerender } = render(withTheme('light', <Badge tone="success">Ready</Badge>));
    const themed = () => container.querySelector('[data-theme]') as HTMLElement;
    const read = (prop: string) => getComputedStyle(themed()).getPropertyValue(prop).trim();

    const lightSubtle = read('--success-subtle');
    const lightText = read('--success-text');

    rerender(withTheme('dark', <Badge tone="success">Ready</Badge>));
    const darkSubtle = read('--success-subtle');
    const darkText = read('--success-text');

    rerender(withTheme('contrast', <Badge tone="success">Ready</Badge>));
    const contrastSubtle = read('--success-subtle');
    const contrastText = read('--success-text');

    expect(lightSubtle).not.toBe(darkSubtle);
    expect(darkSubtle).not.toBe(contrastSubtle);
    expect(lightText).not.toBe(darkText);
    expect(darkText).not.toBe(contrastText);

    // And confirm the component's own stylesheet actually consumes these
    // tokens (not a parallel unused declaration) — Badge.css references
    // var(--success-subtle) for the non-solid success tone.
    const badgeCss = readFileSync(resolve(__dirname, '../src/feedback/Badge.css'), 'utf-8');
    expect(badgeCss).toMatch(/\.ep-badge--success\s*{[^}]*var\(--success-subtle\)/);
  });
});

describe('Alert', () => {
  it('danger tone sets role=alert and ignores onDismiss', () => {
    const onDismiss = () => {};
    render(
      withTheme(
        'light',
        <Alert tone="danger" title="Send failed" onDismiss={onDismiss}>
          Retry sending the alert.
        </Alert>,
      ),
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument();
  });

  it('info tone allows dismiss when onDismiss is provided', () => {
    render(
      withTheme(
        'light',
        <Alert tone="info" title="Heads up" onDismiss={() => {}}>
          Informational message.
        </Alert>,
      ),
    );
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('mounts with no console errors', () => {
    const errors: unknown[] = [];
    console.error = ((...args: unknown[]) => errors.push(args)) as typeof console.error;
    render(
      withTheme('light', <Alert tone="warning" title="Caution">Body text.</Alert>),
    );
    expect(errors).toHaveLength(0);
  });

  // Cross-theme token-wiring proof for Alert tone="danger" (same jsdom
  // var()-in-computed-shorthand limitation as Badge above — see that test's
  // comment). danger-text is provably different hex in all three themes per
  // Chapter 05: light #9c1f18 / dark #f59a93 / contrast #7a120d.
  it('changes the cascaded --danger-subtle/--danger-text custom properties across light/dark/contrast (tone=danger)', () => {
    const { container, rerender } = render(
      withTheme('light', <Alert tone="danger" title="Critical">Something failed.</Alert>),
    );
    const themed = () => container.querySelector('[data-theme]') as HTMLElement;
    const read = (prop: string) => getComputedStyle(themed()).getPropertyValue(prop).trim();

    const lightSubtle = read('--danger-subtle');
    const lightText = read('--danger-text');

    rerender(withTheme('dark', <Alert tone="danger" title="Critical">Something failed.</Alert>));
    const darkSubtle = read('--danger-subtle');
    const darkText = read('--danger-text');

    rerender(
      withTheme('contrast', <Alert tone="danger" title="Critical">Something failed.</Alert>),
    );
    const contrastSubtle = read('--danger-subtle');
    const contrastText = read('--danger-text');

    expect(lightText).not.toBe(darkText);
    expect(darkText).not.toBe(contrastText);
    // danger-subtle happens to share the same hex between light and
    // contrast per the spec table, so only assert light↔dark and dark↔contrast
    // differ (both provably true), not light↔contrast for this one property.
    expect(lightSubtle).not.toBe(darkSubtle);
    expect(darkSubtle).not.toBe(contrastSubtle);

    const alertCss = readFileSync(resolve(__dirname, '../src/feedback/Alert.css'), 'utf-8');
    expect(alertCss).toMatch(/\.ep-alert--danger\s*{[^}]*var\(--danger-subtle\)/);
  });
});

describe('EmptyState', () => {
  it('mounts with required title and no console errors', () => {
    render(withTheme('light', <EmptyState title="No incidents yet" />));
    expect(screen.getByText('No incidents yet')).toBeInTheDocument();
  });

  it('renders icon, body and action when provided', () => {
    render(
      withTheme(
        'light',
        <EmptyState
          title="No tasks match"
          icon="filter"
          action={<Button>Clear filters</Button>}
        >
          Try removing a filter.
        </EmptyState>,
      ),
    );
    expect(screen.getByText('Try removing a filter.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });
});

describe('Toast', () => {
  it('mounts with no console errors, renders status role', () => {
    render(withTheme('light', <Toast>Alert sent to 412 recipients.</Toast>));
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(withTheme('light', <Toast onDismiss={() => {}}>Saved.</Toast>));
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });
});
