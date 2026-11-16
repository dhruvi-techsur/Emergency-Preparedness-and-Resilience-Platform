import * as React from 'react';
import './Switch.css';

/**
 * EPMP Design System — Switch (FORMS)
 *
 * An on/off setting that takes effect immediately. `role="switch"`,
 * 36x20px. Label states the setting itself ("Dark theme"), not the action
 * ("Turn on dark theme"). If the change needs a Save button or has
 * consequences, use Checkbox inside a form instead.
 */

export interface SwitchProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'role' | 'size'
  > {
  /** Always required — states the setting, not the action. */
  label: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked, disabled, className, onChange, ...rest },
  ref,
) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(Boolean(defaultChecked));
  const currentChecked = isControlled ? Boolean(checked) : internalChecked;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const classes = ['ep-switch', disabled ? 'ep-switch--disabled' : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <span className="ep-switch__track-wrap">
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          aria-checked={currentChecked}
          className="ep-switch__input"
          checked={isControlled ? checked : undefined}
          defaultChecked={isControlled ? undefined : defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
        <span className="ep-switch__track">
          <span className="ep-switch__thumb" />
        </span>
      </span>
      <span className="ep-switch__label">{label}</span>
    </label>
  );
});
