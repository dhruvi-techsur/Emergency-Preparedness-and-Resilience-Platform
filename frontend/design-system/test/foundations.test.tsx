import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Icon } from '../src/foundations/Icon';
import { Button } from '../src/actions/Button';
import { IconButton } from '../src/actions/IconButton';

afterEach(cleanup);

// Renders children inside a themed wrapper (mirrors how a consuming app sets
// data-theme on the document/app root per the EPMP-llm-build-guide.md
// loading contract). tokens.css itself is not imported into jsdom here —
// component-level smoke tests below only assert structural/semantic output;
// the cross-theme computed-style assertions (Task 3) inject the real token
// values inline since jsdom does not load external stylesheets.
function withTheme(theme: 'light' | 'dark' | 'contrast', ui: React.ReactElement) {
  return <div data-theme={theme}>{ui}</div>;
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
    render(
      withTheme(
        'light',
        <Button onClick={() => (clicked = true)}>Activate EOC</Button>,
      ),
    );
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
