import * as React from 'react';
import { Badge, type BadgeTone } from '../feedback/Badge';
import { Skeleton } from '../feedback/Skeleton';
import { EmptyState, type EmptyStateProps } from '../feedback/EmptyState';
import { Alert } from '../feedback/Alert';
import './Table.css';

/**
 * EPMP Design System — Table (DATA)
 *
 * Dense, scannable data. Sticky uppercase header on `bg-subtle`, 1px row
 * rules, hover row tint, `selectedKey` row on `brand-subtle`. Numbers
 * (align="right") use tabular figures.
 *
 * Table owns its own loading/empty/error presentation — per F0's "every
 * list/table/panel has loading/empty/error states" rule, every consumer
 * gets this for free via props rather than re-implementing it per screen.
 *
 * Status columns MUST render through `Table.StatusCell` (which delegates to
 * `Badge`), never a raw colored `<span>` — status is always icon + word +
 * color, never color alone.
 */

export interface TableColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right';
  width?: string;
  render?: (row: T) => React.ReactNode;
}

export interface TableErrorState {
  message: string;
  onRetry: () => void;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Screen-reader-only title for the table. Required — every table needs an
   * accessible name even when visually implied by a surrounding PageHeader. */
  caption: string;
  selectedKey?: string;
  onRowClick?: (row: T) => void;
  compact?: boolean;
  /** When true, ignores `rows` and renders 6 Skeleton rows sized to the
   * column layout. */
  loading?: boolean;
  /** Renders a danger Alert with the message and a Retry action above the
   * table, and still renders the last-known `rows` beneath it — "keep
   * last-known data visible, labeled with its age". */
  error?: TableErrorState;
  /** Rendered as caption text near the Alert when both `error` and `rows`
   * are present, to label the age of the last-known data. */
  asOfLabel?: string;
  /** Renders EmptyState in place of the table body when `rows.length === 0`
   * and not loading/error. Caller supplies distinct first-use vs.
   * filtered-out copy — Table doesn't guess which case it is. */
  empty?: Pick<EmptyStateProps, 'title' | 'children' | 'action'>;
}

const SKELETON_ROW_COUNT = 6;

function TableInner<T>(
  {
    columns,
    rows,
    rowKey,
    caption,
    selectedKey,
    onRowClick,
    compact = false,
    loading = false,
    error,
    asOfLabel,
    empty,
  }: TableProps<T>,
  ref: React.Ref<HTMLTableElement>,
) {
  const classes = ['ep-table', compact ? 'ep-table--compact' : ''].filter(Boolean).join(' ');
  const showEmpty = !loading && !error && rows.length === 0 && Boolean(empty);
  const showRows = !loading && (rows.length > 0 || !empty);

  return (
    <div className="ep-table-wrap">
      {error ? (
        <div className="ep-table__error">
          <Alert
            tone="danger"
            title={error.message}
            actions={
              <button type="button" className="ep-table__retry" onClick={error.onRetry}>
                Retry
              </button>
            }
          />
          {asOfLabel && rows.length > 0 ? (
            <p className="caption ep-table__as-of">{asOfLabel}</p>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <table ref={ref} className={classes}>
          <caption className="ep-table__caption">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width, textAlign: col.align === 'right' ? 'right' : 'left' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <Skeleton w="100%" h={16} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : showEmpty ? (
        <EmptyState
          title={empty!.title}
          children={empty!.children}
          action={empty!.action}
        />
      ) : showRows ? (
        <table ref={ref} className={classes}>
          <caption className="ep-table__caption">{caption}</caption>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  style={{ width: col.width, textAlign: col.align === 'right' ? 'right' : 'left' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const key = rowKey(row);
              const isSelected = key === selectedKey;
              const rowClasses = [
                'ep-table__row',
                isSelected ? 'ep-table__row--selected' : '',
                onRowClick ? 'ep-table__row--clickable' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <tr
                  key={key}
                  className={rowClasses}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={col.align === 'right' ? 'ep-table__cell--num' : undefined}
                      style={{ textAlign: col.align === 'right' ? 'right' : 'left' }}
                    >
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

type TableComponentType = (<T>(
  props: TableProps<T> & { ref?: React.Ref<HTMLTableElement> },
) => React.ReactElement | null) & { StatusCell: typeof StatusCell };

export const Table = React.forwardRef(TableInner) as unknown as TableComponentType;

/**
 * Table.StatusCell — the ONLY sanctioned way to render a status value inside
 * a column's `render` function. Delegates to `Badge` so status is always
 * icon + word + color, never a raw colored `<span>`.
 *
 * Any column displaying a status MUST use `Table.StatusCell` in its
 * `render`, never return a raw colored element directly.
 */
export interface StatusCellProps {
  tone?: BadgeTone;
  children: React.ReactNode;
}

function StatusCell({ tone, children }: StatusCellProps) {
  return <Badge tone={tone}>{children}</Badge>;
}

Table.StatusCell = StatusCell;
