import { describe, it, expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Progress } from '../src/feedback/Progress';
import { LineChart } from '../src/data/LineChart';
import { BarChart } from '../src/data/BarChart';
import { DonutChart } from '../src/data/DonutChart';

afterEach(cleanup);

// Same real-cascade token-injection pattern test/maps.test.tsx already
// established: inject tokens.css plus each new component's own .css file
// via readFileSync, so getComputedStyle reflects the real cascade.
beforeAll(() => {
  const tokensCssPath = resolve(__dirname, '../tokens/tokens.css');
  const tokensCss = readFileSync(tokensCssPath, 'utf-8');
  const tokensStyle = document.createElement('style');
  tokensStyle.textContent = tokensCss;
  document.head.appendChild(tokensStyle);

  const cssFiles = [
    '../src/feedback/Progress.css',
    '../src/data/LineChart.css',
    '../src/data/BarChart.css',
    '../src/data/DonutChart.css',
  ];
  cssFiles.forEach((rel) => {
    const cssPath = resolve(__dirname, rel);
    const css = readFileSync(cssPath, 'utf-8');
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  });
});

function withTheme(theme: 'light' | 'dark' | 'contrast', ui: React.ReactElement) {
  return (
    <div className="ep" data-theme={theme}>
      {ui}
    </div>
  );
}

describe('Progress — numeric value is text-visible, not just width-encoded', () => {
  it('value=68 renders role=progressbar aria-valuenow="68" AND the label text "68% acknowledged, 412 of 606"', () => {
    const { container } = render(
      withTheme('light', <Progress value={68} label="68% acknowledged, 412 of 606" />),
    );

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '68');

    expect(screen.getByText('68% acknowledged, 412 of 606')).toBeInTheDocument();

    // The numeric percentage must also be present as DOM text, not merely
    // conveyed via inline style="width:68%" on the fill element.
    const fill = container.querySelector('.ep-progress__fill') as HTMLElement;
    expect(fill.style.width).toBe('68%');
    expect(container.textContent).toMatch(/68%/);
  });
});

describe('LineChart — visual chart AND hidden data table carry identical data', () => {
  const series = [
    { name: 'Open incidents', values: [3, 5, 4] },
    { name: 'Closed incidents', values: [1, 2, 6] },
  ];
  const xLabels = ['Mon', 'Tue', 'Wed'];

  it('renders both an <svg role=img> chart element and a <table> with matching series names/values as text', () => {
    const { container } = render(
      withTheme('light', <LineChart label="Incident trend" series={series} xLabels={xLabels} />),
    );

    const svg = container.querySelector('svg.ep-linechart__svg');
    expect(svg).toBeTruthy();
    expect(svg).toHaveAttribute('role', 'img');

    const table = container.querySelector('table.ep-visually-hidden') as HTMLElement;
    expect(table).toBeTruthy();

    const tableScope = within(table);
    expect(tableScope.getByText('Open incidents')).toBeInTheDocument();
    expect(tableScope.getByText('Closed incidents')).toBeInTheDocument();

    // Querying hidden-table cell content directly, not just checking presence.
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    const firstRowCells = Array.from(rows[0].querySelectorAll('td')).map((td) => td.textContent);
    expect(firstRowCells).toEqual(['3', '5', '4']);
    const secondRowCells = Array.from(rows[1].querySelectorAll('td')).map((td) => td.textContent);
    expect(secondRowCells).toEqual(['1', '2', '6']);
  });
});

describe('BarChart — printed value text appears in the DOM', () => {
  it('renders the printed value text for at least one bar, not just an axis tick', () => {
    const { container } = render(
      withTheme(
        'light',
        <BarChart
          label="Requests by category"
          categories={['Medical', 'Shelter', 'Fuel']}
          series={[{ name: 'Requests', values: [12, 7, 3] }]}
        />,
      ),
    );

    const valueTexts = Array.from(container.querySelectorAll('.ep-barchart__value')).map(
      (el) => el.textContent,
    );
    expect(valueTexts).toContain('12');
    expect(valueTexts).toContain('7');
    expect(valueTexts).toContain('3');
  });
});

describe('DonutChart — 5-segment contract: no warning, full list legend', () => {
  it('exactly 5 segments: no console.warn, and the list legend shows every label + a percentage string', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const segments = [
      { label: 'Medical', value: 40 },
      { label: 'Shelter', value: 25 },
      { label: 'Fuel', value: 15 },
      { label: 'Water', value: 10 },
      { label: 'Power', value: 10 },
    ];

    const { container } = render(
      withTheme('light', <DonutChart label="Resource mix" segments={segments} />),
    );

    expect(warnSpy).not.toHaveBeenCalled();

    const legendItems = container.querySelectorAll('.ep-donutchart__legend-item');
    expect(legendItems.length).toBe(5);

    const legendLabels = Array.from(container.querySelectorAll('.ep-donutchart__legend-label')).map(
      (el) => el.textContent,
    );
    segments.forEach((seg) => {
      expect(legendLabels).toContain(seg.label);
    });

    const pctTexts = Array.from(container.querySelectorAll('.ep-donutchart__legend-pct')).map(
      (el) => el.textContent ?? '',
    );
    expect(pctTexts.length).toBe(5);
    pctTexts.forEach((text) => {
      expect(text).toMatch(/\d+%/);
    });

    warnSpy.mockRestore();
  });
});

describe('DonutChart — beyond 5 segments: loud warning, all segments still render', () => {
  it('6 segments: console.warn IS called once mentioning "5-segment maximum", and all 6 segments render (not truncated)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const segments = [
      { label: 'A', value: 10 },
      { label: 'B', value: 10 },
      { label: 'C', value: 10 },
      { label: 'D', value: 10 },
      { label: 'E', value: 10 },
      { label: 'F', value: 10 },
    ];

    const { container } = render(
      withTheme('light', <DonutChart label="Overflow test" segments={segments} />),
    );

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toMatch(/5-segment maximum/);

    const legendItems = container.querySelectorAll('.ep-donutchart__legend-item');
    expect(legendItems.length).toBe(6);

    const legendLabels = Array.from(container.querySelectorAll('.ep-donutchart__legend-label')).map(
      (el) => el.textContent,
    );
    segments.forEach((seg) => {
      expect(legendLabels).toContain(seg.label);
    });

    warnSpy.mockRestore();
  });
});
