import * as React from 'react';
import { Icon } from '../foundations/Icon';
import { IconButton } from '../actions/IconButton';
import { Skeleton } from '../feedback/Skeleton';
import './Combobox.css';

/**
 * EPMP Design System — Combobox (FORMS)
 *
 * Searchable single-select dropdown using the ARIA combobox + listbox
 * pattern. Type to filter, Up/Down to move, Enter to choose, Escape to
 * close. Value is always the option's `value`; free text is never a value
 * (for free text plus suggestions, use TextField instead). Use where a
 * plain Select would hold more than ~15 options, or users know the name
 * they're looking for.
 */

export type ComboboxSize = 'default' | 'lg';

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Always required. The placeholder states what to type — never replaces this. */
  label: React.ReactNode;
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: ComboboxOption | null) => void;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  /** Renders an `x` clear affordance when a value is selected. */
  clearable?: boolean;
  /** States what to type, e.g. "Search jurisdictions" — never substitutes for `label`. */
  placeholder?: string;
  size?: ComboboxSize;
  /** When provided, typing calls this instead of local client-side filtering; caller passes pre-filtered `options` back. */
  onSearch?: (query: string) => void;
  /** Shows Skeleton-style option-row placeholders in the listbox while true. */
  loading?: boolean;
  /** Shown when there are no matching options. Says what to do next. */
  emptyText?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    options,
    value,
    defaultValue,
    onChange,
    hint,
    error,
    required = false,
    clearable = false,
    placeholder,
    size = 'default',
    onSearch,
    loading = false,
    emptyText = 'No matches. Try a different search.',
    disabled = false,
    name,
    id: idProp,
  },
  forwardedRef,
) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const listboxId = `${id}-listbox`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const currentValue = isControlled ? (value ?? '') : internalValue;
  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === currentValue) ?? null,
    [options, currentValue],
  );

  const [query, setQuery] = React.useState(selectedOption?.label ?? '');
  const [open, setOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [forwardedRef],
  );

  // Sync the displayed text with the selected option whenever the resolved
  // value changes externally and the user isn't actively typing a query.
  React.useEffect(() => {
    if (!open) {
      setQuery(selectedOption?.label ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  const filteredOptions = React.useMemo(() => {
    if (onSearch) return options;
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, onSearch]);

  const commitValue = (option: ComboboxOption | null) => {
    const nextValue = option ? option.value : '';
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onChange?.(nextValue, option);
    setQuery(option?.label ?? '');
  };

  const firstEnabledIndex = (list: ComboboxOption[]) => list.findIndex((o) => !o.disabled);

  const openDropdown = () => {
    if (disabled) return;
    setOpen(true);
    setHighlightedIndex((prev) => (prev >= 0 ? prev : firstEnabledIndex(filteredOptions)));
  };

  const closeDropdown = (revert: boolean) => {
    setOpen(false);
    setHighlightedIndex(-1);
    if (revert) {
      setQuery(selectedOption?.label ?? '');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    setOpen(true);
    onSearch?.(next);
    setHighlightedIndex(0);
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (filteredOptions.length === 0) return;
    setHighlightedIndex((prev) => {
      const start = prev < 0 ? (direction === 1 ? -1 : 0) : prev;
      let next = start;
      for (let step = 0; step < filteredOptions.length; step++) {
        next = (next + direction + filteredOptions.length) % filteredOptions.length;
        if (!filteredOptions[next]?.disabled) return next;
      }
      return prev;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        openDropdown();
      } else {
        moveHighlight(1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        openDropdown();
      } else {
        moveHighlight(-1);
      }
    } else if (e.key === 'Enter') {
      if (open && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        e.preventDefault();
        const opt = filteredOptions[highlightedIndex];
        if (!opt.disabled) {
          commitValue(opt);
          closeDropdown(false);
        }
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault();
        closeDropdown(true);
      }
    }
  };

  const handleOptionClick = (opt: ComboboxOption) => {
    if (opt.disabled) return;
    commitValue(opt);
    closeDropdown(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    commitValue(null);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // Delayed so a mousedown on an option (which also blurs the input via
    // onMouseDown preventDefault below) is processed before we revert text.
    window.setTimeout(() => {
      closeDropdown(true);
    }, 100);
  };

  const activeOptionId =
    open && highlightedIndex >= 0 && filteredOptions[highlightedIndex]
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  const describedBy =
    [error ? errorId : null, !error && hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  const classes = ['ep-combobox', `ep-combobox--${size}`, error ? 'ep-combobox--error' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ep-combobox-wrap">
      <label htmlFor={id} className="ep-combobox__label">
        {label}
        {required ? (
          <span className="ep-combobox__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <div className="ep-combobox__control">
        <input
          ref={setRefs}
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={activeOptionId}
          aria-autocomplete="list"
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          autoComplete="off"
          className={classes}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
        {clearable && currentValue ? (
          <span className="ep-combobox__clear">
            <IconButton
              icon="x"
              label="Clear selection"
              size="sm"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClear}
            />
          </span>
        ) : null}
        <span className="ep-combobox__chevron" aria-hidden="true">
          <Icon name="chevron-down" size="sm" />
        </span>
        {open ? (
          <ul className="ep-combobox__listbox" id={listboxId} role="listbox">
            {loading ? (
              <>
                <li className="ep-combobox__option-skeleton">
                  <Skeleton w="100%" h={16} />
                </li>
                <li className="ep-combobox__option-skeleton">
                  <Skeleton w="100%" h={16} />
                </li>
                <li className="ep-combobox__option-skeleton">
                  <Skeleton w="100%" h={16} />
                </li>
              </>
            ) : filteredOptions.length === 0 ? (
              <li className="ep-combobox__empty">{emptyText}</li>
            ) : (
              filteredOptions.map((opt, index) => (
                <li
                  key={opt.value}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={opt.value === currentValue}
                  aria-disabled={opt.disabled || undefined}
                  className={[
                    'ep-combobox__option',
                    index === highlightedIndex ? 'ep-combobox__option--highlighted' : '',
                    opt.disabled ? 'ep-combobox__option--disabled' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleOptionClick(opt)}
                >
                  <span className="ep-combobox__option-label">{opt.label}</span>
                  {opt.hint ? <span className="ep-combobox__option-hint">{opt.hint}</span> : null}
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      {error ? (
        <p className="ep-combobox__error" id={errorId}>
          <Icon name="alert" size="sm" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="ep-combobox__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
