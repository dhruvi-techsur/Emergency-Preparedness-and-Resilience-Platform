import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Table } from '../src/data/Table';
import { Modal } from '../src/overlays/Modal';
import { Button } from '../src/actions/Button';

afterEach(cleanup);

function withTheme(theme: 'light' | 'dark' | 'contrast', ui: React.ReactElement) {
  return (
    <div className="ep" data-theme={theme}>
      {ui}
    </div>
  );
}

interface Row {
  id: string;
  name: string;
}

const COLUMNS = [
  { key: 'name', header: 'Name' },
];

describe('Table — loading/empty/error built-in states', () => {
  it('renders Skeleton rows and no row data when loading', () => {
    const { container } = render(
      withTheme(
        'light',
        <Table<Row>
          columns={COLUMNS}
          rows={[{ id: '1', name: 'Alpha' }]}
          rowKey={(r) => r.id}
          caption="Test table"
          loading
        />,
      ),
    );
    expect(container.querySelectorAll('.ep-skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
  });

  it('renders EmptyState title when rows is empty and empty prop is provided', () => {
    render(
      withTheme(
        'light',
        <Table<Row>
          columns={COLUMNS}
          rows={[]}
          rowKey={(r) => r.id}
          caption="Test table"
          empty={{ title: 'No incidents yet' }}
        />,
      ),
    );
    expect(screen.getByText('No incidents yet')).toBeInTheDocument();
  });

  it('shows both the Alert error message AND last-known row data simultaneously', () => {
    const onRetry = vi.fn();
    render(
      withTheme(
        'light',
        <Table<Row>
          columns={COLUMNS}
          rows={[{ id: '1', name: 'Bravo' }]}
          rowKey={(r) => r.id}
          caption="Test table"
          error={{ message: 'Failed', onRetry }}
        />,
      ),
    );
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Bravo')).toBeInTheDocument();
  });
});

describe('Modal — focus trap and focus return', () => {
  it('moves focus into the modal on open, traps Tab within it, and Escape calls onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      withTheme(
        'light',
        <Modal
          open
          title="Suspend this user?"
          onClose={onClose}
          footer={
            <>
              <Button variant="secondary">Keep access</Button>
              <Button variant="danger">Suspend access</Button>
            </>
          }
        >
          This will immediately revoke their session.
        </Modal>,
      ),
    );

    const dialog = screen.getByRole('dialog');
    // Focus moved into the modal: the first focusable element inside it
    // (the "Keep access" button) has focus, not something behind the scrim.
    expect(dialog.contains(document.activeElement)).toBe(true);

    // Tab forward through focusables repeatedly — focus must stay within
    // the modal's focusable set at every step.
    const focusablesInDialog = () =>
      within(dialog).getAllByRole('button');

    for (let i = 0; i < 6; i++) {
      await user.tab();
      const buttons = focusablesInDialog();
      expect(buttons.includes(document.activeElement as HTMLElement)).toBe(true);
    }

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('danger modal uses role=alertdialog', () => {
    render(
      withTheme(
        'light',
        <Modal open title="Suspend this user?" onClose={() => {}} danger>
          This will immediately revoke their session.
        </Modal>,
      ),
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('returns focus to the trigger element on close', async () => {
    const user = userEvent.setup();

    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <div className="ep" data-theme="light">
          <button type="button" onClick={() => setOpen(true)}>
            Open modal
          </button>
          <Modal open={open} title="Suspend this user?" onClose={() => setOpen(false)}>
            Body text.
          </Modal>
        </div>
      );
    }

    render(<Harness />);

    const trigger = screen.getByRole('button', { name: 'Open modal' });
    await user.click(trigger);

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
