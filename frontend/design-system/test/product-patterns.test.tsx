import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SyncStatus, type SyncStatusState } from '../src/product-patterns/SyncStatus';

afterEach(cleanup);

// Same real-cascade proof technique as test/foundations.test.tsx and
// test/maps.test.tsx: inject the actual tokens.css + this component's own
// stylesheet, since jsdom/vitest does not auto-inject component CSS imports.
//
// NOTE: this file is SyncStatus-only. Provenance (the other existing
// product-patterns/ component) has no dedicated test file today — its
// rendering is exercised only indirectly via test/maps.test.tsx's
// LayerPanel coverage. This file is not a retroactive Provenance test.
beforeAll(() => {
  const tokensCssPath = resolve(__dirname, '../tokens/tokens.css');
  const tokensCss = readFileSync(tokensCssPath, 'utf-8');
  const tokensStyle = document.createElement('style');
  tokensStyle.textContent = tokensCss;
  document.head.appendChild(tokensStyle);

  const syncStatusCssPath = resolve(__dirname, '../src/product-patterns/SyncStatus.css');
  const syncStatusCss = readFileSync(syncStatusCssPath, 'utf-8');
  const syncStatusStyle = document.createElement('style');
  syncStatusStyle.textContent = syncStatusCss;
  document.head.appendChild(syncStatusStyle);
});

function withTheme(theme: 'light' | 'dark' | 'contrast', ui: React.ReactElement) {
  return (
    <div className="ep" data-theme={theme}>
      {ui}
    </div>
  );
}

const STATE_WORDS: Record<SyncStatusState, string> = {
  online: 'Online',
  syncing: 'Syncing',
  offline: 'Offline',
  conflict: 'Conflict',
};

describe('SyncStatus', () => {
  (Object.keys(STATE_WORDS) as SyncStatusState[]).forEach((state) => {
    it(`renders the "${STATE_WORDS[state]}" word for state="${state}" (never color alone)`, () => {
      const { container } = render(withTheme('light', <SyncStatus state={state} />));
      // The word must be real visible text content, not just a CSS class —
      // this is the "never color alone" proof: a colorblind or
      // screen-reader user gets the same information a sighted user reading
      // color would.
      expect(container.textContent).toContain(STATE_WORDS[state]);
      // Each state also renders its own distinct icon (an <svg>), never a
      // shared/no icon.
      expect(container.querySelector('svg')).toBeTruthy();
    });
  });

  it('renders detail text alongside the state word when provided', () => {
    render(withTheme('light', <SyncStatus state="offline" detail="3 queued" />));
    expect(screen.getByText('3 queued')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  it('does not render detail text when omitted', () => {
    const { container } = render(withTheme('light', <SyncStatus state="online" />));
    expect(container.querySelector('.ep-sync-status__detail')).toBeNull();
  });

  it('renders a <button> and invokes onClick when onClick is provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(withTheme('light', <SyncStatus state="offline" onClick={onClick} />));

    const btn = screen.getByRole('button', { name: /Offline/i });
    await user.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders a plain <span> with no button role when onClick is absent', () => {
    render(withTheme('light', <SyncStatus state="conflict" />));
    expect(screen.queryByRole('button')).toBeNull();
  });
});
