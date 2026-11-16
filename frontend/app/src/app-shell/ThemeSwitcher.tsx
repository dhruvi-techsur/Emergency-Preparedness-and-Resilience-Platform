import * as React from 'react';
import { Select, Toast, type SelectOption } from '@epmp/design-system';
import { useAuth } from '../auth/auth-context';
import { apiPatch } from '../lib/api-client';

type Theme = 'light' | 'dark' | 'contrast';

const THEME_OPTIONS: SelectOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'contrast', label: 'Contrast' },
];

/**
 * F0 §S0.2: "applies instantly via data-theme without reload" + "does not
 * block continued use" on save failure. Both of those are ordering
 * guarantees, not just behavioral descriptions:
 *
 * 1. data-theme is set on document.documentElement the INSTANT the user
 *    picks a value — before the PATCH request is even issued, so there is
 *    no network round-trip the visual change waits on.
 * 2. The PATCH fires in the background. On failure, an Alert-toned Toast
 *    with the FRD's exact THEME_SAVE_FAILED message appears, but the
 *    already-applied theme is never reverted — the user keeps using the
 *    theme they picked even though persistence failed.
 */
export function ThemeSwitcher(): JSX.Element {
  const { user, setThemePreference } = useAuth();
  const [saveError, setSaveError] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Theme;

    // (1) Instant, synchronous, no network wait.
    document.documentElement.dataset.theme = next;
    setThemePreference(next);
    setSaveError(false);

    // (2) Background persistence — failure does not revert the visual theme.
    apiPatch('/api/v1/me/preferences', { theme_preference: next }).catch(() => {
      setSaveError(true);
    });
  };

  return (
    <div className="ep-theme-switcher">
      <Select
        label="Theme"
        options={THEME_OPTIONS}
        value={user.theme_preference}
        onChange={handleChange}
      />
      {saveError ? (
        <Toast tone="danger" onDismiss={() => setSaveError(false)}>
          Couldn&apos;t save your theme preference. It will reset next time you sign in. Retry.
        </Toast>
      ) : null}
    </div>
  );
}
