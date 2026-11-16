import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MapCanvas, type MapMarker } from '../src/maps/MapCanvas';
import { MapPopup } from '../src/maps/MapPopup';
import { LayerPanel, type MapLayer } from '../src/maps/LayerPanel';
import { Provenance } from '../src/product-patterns/Provenance';
import { Badge } from '../src/feedback/Badge';

afterEach(cleanup);

// Same real-cascade proof technique as test/foundations.test.tsx: inject the
// actual tokens.css content, PLUS Provenance's own component stylesheet
// (vitest/jsdom does not auto-inject component CSS imports — proven by
// querying document.querySelectorAll('style') after a bare render, which
// returns zero), so getComputedStyle reflects the real cascade rather than
// a parallel re-declaration in the test.
beforeAll(() => {
  const tokensCssPath = resolve(__dirname, '../tokens/tokens.css');
  const tokensCss = readFileSync(tokensCssPath, 'utf-8');
  const tokensStyle = document.createElement('style');
  tokensStyle.textContent = tokensCss;
  document.head.appendChild(tokensStyle);

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

const TWO_MARKERS: MapMarker[] = [
  { id: 'm1', x: 20, y: 30, type: 'incident', tone: 'danger', label: 'Riverbend Flood', status: 'Active' },
  { id: 'm2', x: 60, y: 40, type: 'facility', tone: 'info', label: 'EOC', status: 'Operational' },
];

const THREE_MARKERS: MapMarker[] = [
  { id: 'a', x: 10, y: 10, type: 'incident', tone: 'danger', label: 'Fire', status: 'Active' },
  { id: 'b', x: 30, y: 30, type: 'facility', tone: 'info', label: 'Shelter A', status: 'Open' },
  { id: 'c', x: 50, y: 50, type: 'resource', tone: 'success', label: 'Engine 7', status: 'Available' },
];

describe('MapCanvas — offline mode preserves marker rendering', () => {
  it('renders the exact "Schematic base map, offline" text AND both markers\' aria-labels', () => {
    render(
      withTheme(
        'light',
        <MapCanvas height={300} offline markers={TWO_MARKERS} />,
      ),
    );

    expect(screen.getByText('Schematic base map, offline')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Riverbend Flood — Active' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'EOC — Operational' })).toBeInTheDocument();
  });
});

describe('MapCanvas — keyboard operability', () => {
  it('Tabs through markers in sequence and Enter on the second marker calls onSelect with its id', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      withTheme(
        'light',
        <MapCanvas height={300} markers={THREE_MARKERS} onSelect={onSelect} />,
      ),
    );

    const markerButtons = THREE_MARKERS.map((m) =>
      screen.getByRole('button', { name: `${m.label} — ${m.status}` }),
    );

    await user.tab();
    expect(document.activeElement).toBe(markerButtons[0]);

    await user.tab();
    expect(document.activeElement).toBe(markerButtons[1]);

    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('b');

    await user.tab();
    expect(document.activeElement).toBe(markerButtons[2]);
  });
});

describe('Provenance — structural unverified treatment', () => {
  it('verified={false} renders the word "Unverified", an alert svg icon, and a dashed computed border-style', () => {
    const { container } = render(
      withTheme('light', <Provenance source="WebEOC feed" time="08:14" verified={false} />),
    );

    expect(screen.getByText(/Unverified/)).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeTruthy();

    const chip = container.querySelector('.ep-provenance') as HTMLElement;
    expect(getComputedStyle(chip).borderStyle).toBe('dashed');
  });

  it('verified defaults to true — no dashed treatment, no "Unverified" word', () => {
    const { container } = render(withTheme('light', <Provenance source="Incident log" time="08:14" />));
    expect(screen.queryByText(/Unverified/)).not.toBeInTheDocument();
    const chip = container.querySelector('.ep-provenance') as HTMLElement;
    expect(getComputedStyle(chip).borderStyle).not.toBe('dashed');
  });
});

describe('LayerPanel — immediate toggle, no save step', () => {
  it('clicking an unchecked, unverified layer\'s Checkbox calls onToggle(id, true) synchronously', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const layers: MapLayer[] = [
      { id: 'l1', label: 'Shelter sites', source: 'WebEOC', asOf: '08:14', verified: false, checked: false },
    ];

    render(withTheme('light', <LayerPanel layers={layers} onToggle={onToggle} />));

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith('l1', true);

    // No save/confirm button rendered anywhere in this component.
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /confirm/i })).not.toBeInTheDocument();
  });
});

describe('MapPopup — status via the real Badge component', () => {
  it('renders the badge prop through Badge\'s characteristic icon+text pairing', () => {
    const { container } = render(
      withTheme(
        'light',
        <MapPopup
          title="Riverbend Flood"
          badge={<Badge tone="danger">Active</Badge>}
          onClose={() => {}}
        >
          <p>Fact one</p>
          <p>Fact two</p>
        </MapPopup>,
      ),
    );

    const badge = container.querySelector('.ep-badge') as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.querySelector('svg')).toBeTruthy();
    expect(badge.textContent).toContain('Active');
  });
});
