import * as React from 'react';
import { Icon } from '../foundations/Icon';
import './TextField.css';

/**
 * EPMP Design System — TextField (FORMS)
 *
 * Labelled text input or textarea (`multiline`). Label above, helper text
 * and error below, 36px tall (`size="lg"` 44px for field-mobile). Per
 * Chapter 11: "Label every field; a placeholder is an example, never a
 * label." Errors are written as what to do, shown on blur/submit.
 */

export type TextFieldSize = 'default' | 'lg';

export interface TextFieldBaseProps {
  /** Always required — a placeholder is never a substitute for this. */
  label: React.ReactNode;
  /** Helper text shown below the field when there is no error. */
  hint?: React.ReactNode;
  /** Rendered below the field with an alert icon; sets aria-invalid. */
  error?: string;
  /** Renders a required marker and sets the native `required` attribute. */
  required?: boolean;
  /** Renders a `<textarea>` instead of `<input>`. */
  multiline?: boolean;
  size?: TextFieldSize;
}

export type TextFieldProps = TextFieldBaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'required'> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'required'>;

export const TextField = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(function TextField(
  {
    label,
    hint,
    error,
    required = false,
    multiline = false,
    size = 'default',
    className,
    id: idProp,
    rows,
    ...rest
  },
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
    'ep-textfield',
    `ep-textfield--${size}`,
    error ? 'ep-textfield--error' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  const sharedProps = {
    id,
    className: classes,
    required,
    'aria-invalid': error ? ('true' as const) : undefined,
    'aria-describedby': describedBy,
    ...rest,
  };

  return (
    <div className="ep-textfield-wrap">
      <label htmlFor={id} className="ep-textfield__label">
        {label}
        {required ? (
          <span className="ep-textfield__required" aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows ?? 3}
          {...(sharedProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          {...(sharedProps as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p className="ep-textfield__error" id={errorId}>
          <Icon name="alert" size="sm" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="ep-textfield__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
