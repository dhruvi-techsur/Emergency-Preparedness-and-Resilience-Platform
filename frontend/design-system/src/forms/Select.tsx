import * as React from 'react';
import { Icon } from '../foundations/Icon';
import './Select.css';

/**
 * EPMP Design System — Select (FORMS)
 *
 * Native `<select>` styled to match TextField's chrome. Per Chapter 11:
 * "Use native behavior on purpose: it is accessible and works on every
 * field device." Use for 5-15 mutually exclusive options.
 */

export type SelectSize = 'default' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'size' | 'required' | 'children'
  > {
  /** Always required. */
  label: React.ReactNode;
  options: SelectOption[];
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  size?: SelectSize;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, hint, error, required = false, size = 'default', className, id: idProp, ...rest },
  ref,
) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [error ? errorId : null, !error && hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  const classes = [
    'ep-select',
    `ep-select--${size}`,
    error ? 'ep-select--error' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="ep-select-wrap">
      <label htmlFor={id} className="ep-select__label">
        {label}
        {required ? (
          <span className="ep-select__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <div className="ep-select__control">
        <select
          ref={ref}
          id={id}
          className={classes}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="ep-select__chevron" aria-hidden="true">
          <Icon name="chevron-down" size="sm" />
        </span>
      </div>
      {error ? (
        <p className="ep-select__error" id={errorId}>
          <Icon name="alert" size="sm" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="ep-select__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
