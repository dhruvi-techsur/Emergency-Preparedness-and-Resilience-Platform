import * as React from 'react';
import { Skeleton } from '@epmp/design-system';
import { signIn } from './oidc-config';
import { getSessionToken, clearSessionToken } from './session-storage';
import { AuthContext, type EpmpUser } from './auth-context';
import { RoleUnresolved } from '../pages/RoleUnresolved';

type GuardState =
  | { status: 'pending' }
  | { status: 'unauthenticated' }
  | { status: 'role-unresolved' }
  | { status: 'resolved'; user: EpmpUser };

/**
 * Resolves the user's session BEFORE first paint of any protected route
 * (F00-application-shell.md §Process 1) by calling GET /api/v1/me on mount:
 *
 * - while pending: renders a full-page Skeleton loading state, nothing else
 * - 401 (no/expired session): redirects to Keycloak sign-in
 * - 403 ROLE_UNRESOLVED: renders RoleUnresolved instead of a blank screen
 * - 200: provides the resolved user via AuthContext to children (AppShell
 *   and everything inside it)
 *
 * This file does not yet use api-client.ts's apiGet wrapper (that's built
 * in Task 2) — it calls fetch directly with the same Authorization header
 * contract api-client will centralize later.
 */
/**
 * `/auth/callback` is rendered as a direct child of RouteGuard per the
 * plan's route tree (main.tsx), but RouteGuard's own session-resolution
 * effect must NOT run there: it would race SignInCallback's own id_token
 * exchange (no session_token exists in storage yet during that window),
 * see a 401/no-token, and redirect to signIn() mid-callback. Skipping
 * resolution on this one path and rendering children straight through
 * lets SignInCallback own its own lifecycle end-to-end.
 */
const CALLBACK_PATH = '/auth/callback';

export function RouteGuard({ children }: { children: React.ReactNode }): JSX.Element {
  const isCallbackRoute = window.location.pathname === CALLBACK_PATH;
  const [state, setState] = React.useState<GuardState>({ status: 'pending' });
  // Declared unconditionally (Rules of Hooks) even though it's only ever
  // read/used once state.status === 'resolved' — initialized from the
  // same default ('light', overwritten the instant state resolves) so no
  // conditional hook call happens below.
  const [themePreference, setThemePreferenceState] = React.useState<
    EpmpUser['theme_preference']
  >('light');

  React.useEffect(() => {
    if (state.status === 'resolved') {
      setThemePreferenceState(state.user.theme_preference);
    }
    // Only re-sync when a freshly resolved user arrives, not on every
    // local theme_preference change (which ThemeSwitcher drives directly
    // via setThemePreference from context).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status === 'resolved' ? state.user.id : null]);

  React.useEffect(() => {
    if (isCallbackRoute) return undefined;
    let cancelled = false;

    async function resolveSession() {
      const token = getSessionToken();
      if (!token) {
        if (!cancelled) setState({ status: 'unauthenticated' });
        return;
      }

      try {
        const res = await fetch('/api/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          clearSessionToken();
          if (!cancelled) setState({ status: 'unauthenticated' });
          return;
        }
        if (res.status === 403) {
          if (!cancelled) setState({ status: 'role-unresolved' });
          return;
        }
        if (!res.ok) {
          throw new Error(`GET /api/v1/me failed with ${res.status}`);
        }

        const user = (await res.json()) as EpmpUser;
        if (!cancelled) setState({ status: 'resolved', user });
      } catch {
        if (!cancelled) setState({ status: 'unauthenticated' });
      }
    }

    void resolveSession();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (state.status === 'unauthenticated') {
      void signIn();
    }
  }, [state.status]);

  // On /auth/callback, render `children` (the <Routes> tree, which matches
  // SignInCallback for this exact path) straight through — RouteGuard's own
  // gating never applies here; see the CALLBACK_PATH comment above. Without
  // this, RouteGuard's 'pending' state (never resolved, since the effect
  // above is a no-op on this path) would render its own Skeleton forever
  // and <Routes> — and therefore SignInCallback itself — would never mount.
  if (isCallbackRoute) {
    return <>{children}</>;
  }

  if (state.status === 'pending' || state.status === 'unauthenticated') {
    return (
      <div className="ep-route-guard-loading" aria-busy="true">
        <Skeleton w="100%" h={56} />
        <Skeleton w="100%" h={400} />
      </div>
    );
  }

  if (state.status === 'role-unresolved') {
    return <RoleUnresolved />;
  }

  return (
    <AuthContext.Provider
      value={{
        user: { ...state.user, theme_preference: themePreference },
        setThemePreference: setThemePreferenceState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
