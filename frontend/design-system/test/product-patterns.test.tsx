import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SyncStatus, type SyncStatusState } from '../src/product-patterns/SyncStatus';
import { AIDraft } from '../src/product-patterns/AIDraft';

afterEach(cleanup);

// Same real-cascade proof technique as test/foundations.test.tsx and
// test/maps.test.tsx: inject the actual tokens.css + this component's own
// stylesheet, since jsdom/vitest does not auto-inject component CSS imports.
//
// NOTE: this file originally covered SyncStatus only; AIDraft's own test
// group (below) was added in 06-05, injecting its own + Provenance's CSS
// alongside the existing SyncStatus stylesheet injection.
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

  const aiDraftCssPath = resolve(__dirname, '../src/product-patterns/AIDraft.css');
  const aiDraftCss = readFileSync(aiDraftCssPath, 'utf-8');
  const aiDraftStyle = document.createElement('style');
  aiDraftStyle.textContent = aiDraftCss;
  document.head.appendChild(aiDraftStyle);

  const provenanceCssPath = resolve(__dirname, '../src/product-patterns/Provenance.css');
  const provenanceCss = readFileSync(provenanceCssPath, 'utf-8');
  const provenanceStyle = document.createElement('style');
  provenanceStyle.textContent = provenanceCss;
  document.head.appendChild(provenanceStyle);
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

describe('AIDraft', () => {
  it('renders the persistent "Not issued" badge and one Provenance chip per source', () => {
    render(
      withTheme(
        'light',
        <AIDraft
          draftText="Flooding has affected 3 shelters"
          sources={[{ source: 'Incident Timeline', time: '08:30', confidence: 'High' }]}
          onApprove={vi.fn()}
          onEdit={vi.fn()}
          onDiscard={vi.fn()}
        />,
      ),
    );

    expect(screen.getByText('Not issued')).toBeInTheDocument();
    const { container } = render(
      withTheme(
        'light',
        <AIDraft
          draftText="Flooding has affected 3 shelters"
          sources={[{ source: 'Incident Timeline', time: '08:30', confidence: 'High' }]}
          onApprove={vi.fn()}
          onEdit={vi.fn()}
          onDiscard={vi.fn()}
        />,
      ),
    );
    const chips = container.querySelectorAll('.ep-provenance');
    expect(chips).toHaveLength(1);
    expect(chips[0].textContent).toContain('Incident Timeline');
  });

  it('renders zero Provenance chips and the no-source statement when sources is empty (never fabricates a chip)', () => {
    const { container } = render(
      withTheme(
        'light',
        <AIDraft
          draftText="No source available for this draft. Review carefully before using it."
          sources={[]}
          onApprove={vi.fn()}
          onEdit={vi.fn()}
          onDiscard={vi.fn()}
        />,
      ),
    );

    expect(screen.getByText(/No source available/)).toBeInTheDocument();
    expect(container.querySelectorAll('.ep-provenance')).toHaveLength(0);
  });

  it('calls onApprove with the exact draftText in non-editing mode', async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    render(
      withTheme(
        'light',
        <AIDraft
          draftText="Flooding has affected 3 shelters"
          sources={[]}
          onApprove={onApprove}
          onEdit={vi.fn()}
          onDiscard={vi.fn()}
        />,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'Approve' }));

    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onApprove).toHaveBeenCalledWith('Flooding has affected 3 shelters');
  });

  it('calls onApprove with the editingValue (not the original draftText) when editing=true', async () => {
    const user = userEvent.setup();
    const onApprove = vi.fn();
    render(
      withTheme(
        'light',
        <AIDraft
          draftText="Original draft text"
          sources={[]}
          onApprove={onApprove}
          onEdit={vi.fn()}
          onDiscard={vi.fn()}
          editing
          editingValue="Edited text"
        />,
      ),
    );

    await user.click(screen.getByRole('button', { name: 'Approve' }));

    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onApprove).toHaveBeenCalledWith('Edited text');
  });

  it('renders exactly 3 footer buttons — Discard, Edit, Approve — in that DOM order', () => {
    render(
      withTheme(
        'light',
        <AIDraft
          draftText="Some draft text"
          sources={[]}
          onApprove={vi.fn()}
          onEdit={vi.fn()}
          onDiscard={vi.fn()}
        />,
      ),
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons.map((b) => b.textContent)).toEqual(['Discard', 'Edit', 'Approve']);
  });
});
