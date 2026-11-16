import { describe, it, expect, afterEach, beforeAll } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TextField } from '../src/forms/TextField';
import { Select } from '../src/forms/Select';
import { Checkbox } from '../src/forms/Checkbox';
import { Switch } from '../src/forms/Switch';
import { Combobox } from '../src/forms/Combobox';
import { DatePicker } from '../src/forms/DatePicker';

afterEach(cleanup);

// Same real-cascade proof pattern as test/foundations.test.tsx: inject the
// actual tokens.css content so getComputedStyle reflects the real cascade.
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

describe('TextField', () => {
  it('renders the error text and sets aria-invalid when error is passed', () => {
    render(withTheme('light', <TextField label="Incident name" error="Enter a value" />));
    expect(screen.getByText('Enter a value')).toBeInTheDocument();
    const input = screen.getByLabelText('Incident name');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('associates the label via htmlFor, not placeholder alone', () => {
    render(withTheme('light', <TextField label="Facility name" placeholder="e.g. Station 4" />));
    expect(screen.getByLabelText('Facility name')).toBeInTheDocument();
  });
});

describe('Checkbox', () => {
  it('toggles checked state when the label text (not just the box) is clicked', async () => {
    const user = userEvent.setup();
    let checked = false;
    function Harness() {
      const [value, setValue] = React.useState(false);
      checked = value;
      return (
        <Checkbox
          label="Enable X"
          checked={value}
          onChange={(e) => setValue(e.target.checked)}
        />
      );
    }
    render(withTheme('light', <Harness />));
    const labelText = screen.getByText('Enable X');
    await user.click(labelText);
    expect(screen.getByLabelText('Enable X')).toBeChecked();
    void checked;
  });
});

describe('Combobox', () => {
  const options = [
    { value: 'eoc', label: 'Emergency Operations Center' },
    { value: 'fire-1', label: 'Fire Station 1' },
    { value: 'fire-2', label: 'Fire Station 2' },
    { value: 'police-hq', label: 'Police Headquarters' },
    { value: 'shelter-a', label: 'Shelter A' },
  ];

  it('selects the matched option via type-to-filter + ArrowDown + Enter', async () => {
    const user = userEvent.setup();
    let selectedValue: string | null = null;
    function Harness() {
      return (
        <Combobox
          label="Facility"
          options={options}
          onChange={(value) => {
            selectedValue = value;
          }}
        />
      );
    }
    render(withTheme('light', <Harness />));
    const input = screen.getByLabelText('Facility');
    await user.click(input);
    await user.type(input, 'Shelter');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(selectedValue).toBe('shelter-a');
  });
});

describe('DatePicker', () => {
  it('shows a range error mentioning the allowed bound for an out-of-range typed date', async () => {
    const user = userEvent.setup();
    render(withTheme('light', <DatePicker label="Start date" min="2026-01-01" />));
    const input = screen.getByLabelText('Start date');
    await user.type(input, '2025-06-15');
    await user.tab();
    expect(screen.getByText(/2026-01-01/)).toBeInTheDocument();
  });
});

describe('Full form keyboard operability', () => {
  it('tabs through TextField, Select, Checkbox, and Switch, each receiving visible focus in sequence', async () => {
    const user = userEvent.setup();
    render(
      withTheme(
        'light',
        <form>
          <TextField label="Name" />
          <Select label="Priority" options={[{ value: 'low', label: 'Low' }, { value: 'high', label: 'High' }]} />
          <Checkbox label="Acknowledge" />
          <Switch label="Dark theme" />
        </form>,
      ),
    );

    const nameInput = screen.getByLabelText('Name');
    const prioritySelect = screen.getByLabelText('Priority');
    const checkbox = screen.getByLabelText('Acknowledge');
    const toggle = screen.getByLabelText('Dark theme');

    await user.tab();
    expect(document.activeElement).toBe(nameInput);

    await user.tab();
    expect(document.activeElement).toBe(prioritySelect);

    await user.tab();
    expect(document.activeElement).toBe(checkbox);

    await user.tab();
    expect(document.activeElement).toBe(toggle);
  });
});
