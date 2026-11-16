import * as React from 'react';
import { Icon } from '../foundations/Icon';
import { IconButton } from '../actions/IconButton';
import './DatePicker.css';

/**
 * EPMP Design System — DatePicker (FORMS)
 *
 * Date entry by typing (YYYY-MM-DD) or from a keyboard-operable calendar
 * popover; `withTime` adds a 24-hour time field and returns
 * `YYYY-MM-DDTHH:mm`. Typing always works — the calendar is an aid, never
 * the only way in. Values are ISO strings. Never silently default a time
 * zone: when `withTime` is true and `zone` is absent, a visible hint says
 * so. Invalid/out-of-range input gets an error on blur stating what's
 * allowed.
 */

export type DatePickerSize = 'default' | 'lg';

export interface DatePickerProps {
  /** Always required. */
  label: React.ReactNode;
  /** ISO date (YYYY-MM-DD) or, with withTime, YYYY-MM-DDTHH:mm. */
  value?: string;
  defaultValue?: string;
  onChange?: (isoString: string) => void;
  /** Adds a 24-hour time field; returned/accepted format becomes YYYY-MM-DDTHH:mm. */
  withTime?: boolean;
  /** Shown in the hint text, e.g. "ET" — never silently defaulted. */
  zone?: string;
  /** ISO date bound (inclusive). */
  min?: string;
  /** ISO date bound (inclusive). */
  max?: string;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  size?: DatePickerSize;
  disabled?: boolean;
  id?: string;
  name?: string;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function toKey(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function parseKey(key: string): { y: number; m: number; d: number } | null {
  if (!DATE_RE.test(key)) return null;
  const [y, m, d] = key.split('-').map(Number);
  return { y, m, d };
}

function addDays(key: string, delta: number): string {
  const parsed = parseKey(key);
  if (!parsed) return key;
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return toKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

function addMonths(key: string, delta: number): string {
  const parsed = parseKey(key);
  if (!parsed) return key;
  const dt = new Date(Date.UTC(parsed.y, parsed.m - 1, 1));
  dt.setUTCMonth(dt.getUTCMonth() + delta);
  const daysInTargetMonth = new Date(
    Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const day = Math.min(parsed.d, daysInTargetMonth);
  return toKey(dt.getUTCFullYear(), dt.getUTCMonth() + 1, day);
}

function getTodayKey(): string {
  const now = new Date();
  return toKey(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

interface GridCell {
  key: string;
  inMonth: boolean;
}

function buildMonthGrid(viewYear: number, viewMonth: number): GridCell[] {
  const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth - 1, 1));
  const firstWeekday = firstOfMonth.getUTCDay();
  const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();
  const daysInPrevMonth = new Date(Date.UTC(viewYear, viewMonth - 1, 0)).getUTCDate();

  const cells: GridCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthDate = new Date(Date.UTC(viewYear, viewMonth - 2, d));
    cells.push({
      key: toKey(prevMonthDate.getUTCFullYear(), prevMonthDate.getUTCMonth() + 1, d),
      inMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ key: toKey(viewYear, viewMonth, d), inMonth: true });
  }

  while (cells.length < 42) {
    const lastCell = cells[cells.length - 1];
    cells.push({ key: addDays(lastCell.key, 1), inMonth: false });
  }

  return cells;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label,
    value,
    defaultValue,
    onChange,
    withTime = false,
    zone,
    min,
    max,
    hint,
    error,
    required = false,
    size = 'default',
    disabled = false,
    id: idProp,
    name,
  },
  forwardedRef,
) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const gridId = `${id}-grid`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const currentValue = isControlled ? (value ?? '') : internalValue;

  const splitValue = (full: string): { datePart: string; timePart: string } => {
    const [datePart, timePart] = full.split('T');
    return { datePart: datePart ?? '', timePart: timePart ?? '' };
  };

  const initialSplit = splitValue(currentValue);
  const [dateText, setDateText] = React.useState(initialSplit.datePart);
  const [timeText, setTimeText] = React.useState(initialSplit.timePart);
  const [internalError, setInternalError] = React.useState<string | undefined>(undefined);
  const [open, setOpen] = React.useState(false);

  const validDateKey = parseKey(dateText) ? dateText : null;
  const [viewKey, setViewKey] = React.useState(() => validDateKey ?? getTodayKey());
  const [focusedDayKey, setFocusedDayKey] = React.useState(() => validDateKey ?? getTodayKey());

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const cellRefs = React.useRef(new Map<string, HTMLButtonElement | null>());

  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [forwardedRef],
  );

  // Sync display text from external value changes while not actively open.
  React.useEffect(() => {
    if (!open) {
      const { datePart, timePart } = splitValue(currentValue);
      setDateText(datePart);
      setTimeText(timePart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  React.useEffect(() => {
    if (open) {
      const btn = cellRefs.current.get(focusedDayKey);
      btn?.focus();
    }
  }, [open, focusedDayKey, viewKey]);

  React.useEffect(() => {
    if (!open) return undefined;
    function handleDocMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleDocMouseDown);
    return () => document.removeEventListener('mousedown', handleDocMouseDown);
  }, [open]);

  const rangeError = (candidateDate: string): string | undefined => {
    if (min && candidateDate < min) {
      return `Enter a date on or after ${min}.`;
    }
    if (max && candidateDate > max) {
      return `Enter a date on or before ${max}.`;
    }
    return undefined;
  };

  const commit = (nextDatePart: string, nextTimePart: string) => {
    const combined = withTime && nextTimePart ? `${nextDatePart}T${nextTimePart}` : nextDatePart;
    if (!isControlled) {
      setInternalValue(combined);
    }
    onChange?.(combined);
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setDateText(next);
    setInternalError(undefined);
    if (DATE_RE.test(next)) {
      commit(next, timeText);
      setViewKey(next);
      setFocusedDayKey(next);
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setTimeText(next);
    if (DATE_RE.test(dateText) && (next === '' || TIME_RE.test(next))) {
      commit(dateText, next);
    }
  };

  const handleDateBlur = () => {
    if (dateText === '') {
      setInternalError(undefined);
      return;
    }
    if (!DATE_RE.test(dateText)) {
      setInternalError('Enter a date in YYYY-MM-DD format.');
      return;
    }
    const rangeMsg = rangeError(dateText);
    setInternalError(rangeMsg);
  };

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        const base = validDateKey ?? getTodayKey();
        setViewKey(base);
        setFocusedDayKey(base);
      }
      return next;
    });
  };

  const isDisabledKey = (key: string) => (min ? key < min : false) || (max ? key > max : false);

  const selectDay = (key: string) => {
    if (isDisabledKey(key)) return;
    setDateText(key);
    setInternalError(undefined);
    commit(key, timeText);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setFocusedDayKey((k) => {
          const next = addDays(k, 1);
          setViewKey(next);
          return next;
        });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setFocusedDayKey((k) => {
          const next = addDays(k, -1);
          setViewKey(next);
          return next;
        });
        break;
      case 'ArrowDown':
        e.preventDefault();
        setFocusedDayKey((k) => {
          const next = addDays(k, 7);
          setViewKey(next);
          return next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedDayKey((k) => {
          const next = addDays(k, -7);
          setViewKey(next);
          return next;
        });
        break;
      case 'PageDown':
        e.preventDefault();
        setFocusedDayKey((k) => {
          const next = addMonths(k, 1);
          setViewKey(next);
          return next;
        });
        break;
      case 'PageUp':
        e.preventDefault();
        setFocusedDayKey((k) => {
          const next = addMonths(k, -1);
          setViewKey(next);
          return next;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        selectDay(focusedDayKey);
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const viewParsed = parseKey(viewKey) ?? parseKey(getTodayKey())!;
  const grid = buildMonthGrid(viewParsed.y, viewParsed.m);
  const todayKey = getTodayKey();

  const displayedError = error ?? internalError;
  const zoneNote = zone ? `Time zone: ${zone}` : 'Time zone not set';
  const effectiveHint = withTime ? (hint ? `${hint} (${zoneNote})` : zoneNote) : hint;

  const describedBy =
    [displayedError ? errorId : null, !displayedError && effectiveHint ? hintId : null]
      .filter(Boolean)
      .join(' ') || undefined;

  const classes = [
    'ep-datepicker',
    `ep-datepicker--${size}`,
    displayedError ? 'ep-datepicker--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ep-datepicker-wrap" ref={wrapperRef}>
      <label htmlFor={id} className="ep-datepicker__label">
        {label}
        {required ? (
          <span className="ep-datepicker__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <div className="ep-datepicker__row">
        <div className="ep-datepicker__control">
          <input
            ref={setRefs}
            id={id}
            name={name}
            type="text"
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            className={classes}
            value={dateText}
            disabled={disabled}
            required={required}
            aria-invalid={displayedError ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={handleDateInputChange}
            onBlur={handleDateBlur}
          />
          <span className="ep-datepicker__calendar-btn">
            <IconButton
              icon="calendar"
              label="Open calendar"
              size={size === 'lg' ? 'lg' : 'default'}
              disabled={disabled}
              onClick={toggleOpen}
            />
          </span>
        </div>
        {withTime ? (
          <input
            type="time"
            className="ep-datepicker__time"
            aria-label="Time"
            value={timeText}
            disabled={disabled}
            onChange={handleTimeInputChange}
          />
        ) : null}
      </div>

      {open ? (
        <div className="ep-datepicker__popover" role="dialog" aria-label="Choose date">
          <div className="ep-datepicker__popover-header">
            <IconButton
              icon="chevron-left"
              label="Previous month"
              size="sm"
              onClick={() => {
                const next = addMonths(viewKey, -1);
                setViewKey(next);
                setFocusedDayKey(next);
              }}
            />
            <span className="ep-datepicker__month-label">
              {MONTH_NAMES[viewParsed.m - 1]} {viewParsed.y}
            </span>
            <IconButton
              icon="chevron-right"
              label="Next month"
              size="sm"
              onClick={() => {
                const next = addMonths(viewKey, 1);
                setViewKey(next);
                setFocusedDayKey(next);
              }}
            />
          </div>
          <div
            className="ep-datepicker__grid"
            id={gridId}
            role="grid"
            onKeyDown={handleGridKeyDown}
          >
            {grid.map((cell) => {
              const cellDisabled = isDisabledKey(cell.key);
              const isSelected = cell.key === dateText;
              const isToday = cell.key === todayKey;
              const isFocusTarget = cell.key === focusedDayKey;
              return (
                <button
                  key={cell.key}
                  type="button"
                  ref={(node) => {
                    cellRefs.current.set(cell.key, node);
                  }}
                  role="gridcell"
                  tabIndex={cellDisabled ? -1 : isFocusTarget ? 0 : -1}
                  disabled={cellDisabled}
                  aria-selected={isSelected}
                  className={[
                    'ep-datepicker__day',
                    cell.inMonth ? '' : 'ep-datepicker__day--outside',
                    isToday ? 'ep-datepicker__day--today' : '',
                    isSelected ? 'ep-datepicker__day--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => selectDay(cell.key)}
                >
                  {Number(cell.key.slice(8, 10))}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {displayedError ? (
        <p className="ep-datepicker__error" id={errorId}>
          <Icon name="alert" size="sm" />
          <span>{displayedError}</span>
        </p>
      ) : effectiveHint ? (
        <p className="ep-datepicker__hint" id={hintId}>
          {effectiveHint}
        </p>
      ) : null}
    </div>
  );
});
