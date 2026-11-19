import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Skeleton } from '@epmp/design-system';
import { signIn } from './oidc-config';
import { getSessionToken, clearSessionToken } from './session-storage';
import { AuthContext, type EpmpUser } from './auth-context';
import { RoleUnresolved } from '../pages/RoleUnresolved';
import { apiGet } from '../lib/api-client';

/** Matches backend/src/modules/auth-org/landing-config.ts's success-path
 * response shape. The `error_code: 'ROLE_VIEW_UNMAPPED'` fallback case
 * (also a 200, never a 404/500 — see that file's own doc comment) is
 * handled by checking for the optional `error_code` field below rather
 * than a separate type, since both shapes share the same `default_route`
 * field and TypeScript can narrow on the extra property's presence. */
interface LandingConfigResponse {
  default_route: string;
  error_code?: 'ROLE_VIEW_UNMAPPED';
}

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
  // Reads route changes via react-router's own location subscription
  // (BrowserRouter wraps RouteGuard in main.tsx), NOT window.location
  // directly — a raw window.location.pathname read is captured once per
  // render and never changes when SignInCallback calls navigate('/'),
  // which is client-side (history.pushState, no full page reload). That
  // bug left RouteGuard permanently believing it was still on
  // /auth/callback after a successful sign-in, bypassing session
  // resolution forever and rendering a blank page.
  const location = useLocation();
  const navigate = useNavigate();
  const isCallbackRoute = location.pathname === CALLBACK_PATH;
  const [state, setState] = React.useState<GuardState>({ status: 'pending' });
  // Declared unconditionally (Rules of Hooks) even though it's only ever
  // read/used once state.status === 'resolved' — initialized from the
  // same default ('light', overwritten the instant state resolves) so no
  // conditional hook call happens below.
  const [themePreference, setThemePreferenceState] = React.useState<
    EpmpUser['theme_preference']
  >('light');

  React.useLayoutEffect(() => {
    if (state.status === 'resolved') {
      setThemePreferenceState(state.user.theme_preference);
      // Apply the persisted preference to the document root the instant
      // it's known — this is the actual "flash of wrong theme" guard for
      // the steady-state (reload) case: main.tsx can only ever set the
      // pre-JS 'light' default synchronously, since the real preference
      // isn't known until this async GET /api/v1/me resolves. A
      // useLayoutEffect (not useEffect) still fires before the browser
      // paints the current commit, so this is applied as early as
      // possible given that constraint — before AppShell's first visible
      // frame — rather than being a pure no-op that leaves the pre-JS
      // default in place forever on every reload (the bug this fixes:
      // ThemeSwitcher applies data-theme on CHANGE, but nothing ever
      // applied the already-resolved preference on initial/reload load).
      document.documentElement.dataset.theme = state.user.theme_preference;
    }
    // Only re-sync when a freshly resolved user arrives, not on every
    // local theme_preference change (which ThemeSwitcher drives directly
    // via setThemePreference from context).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status === 'resolved' ? state.user.id : null]);

  // F18 (06-06) — redirect a bare post-sign-in '/' to the resolved role's
  // own default landing route, via GET /api/v1/me/landing-config (06-02).
  //
  // This redirect lives HERE, not in AppShell, because RouteGuard is the
  // ONLY place that already distinguishes "freshly resolved" from
  // "already resolved and navigating around normally" via its own
  // `state.status` transitions (pending -> resolved happens exactly once
  // per session). AppShell has no equivalent one-time-ness guard — it
  // re-renders on every route change — so placing this fetch-and-redirect
  // there would re-fire on every navigation back to a route that happens
  // to render AppShell, which risks a redirect loop the instant a user
  // tries to navigate anywhere else after landing.
  //
  // `hasRedirectedRef` is a ref (not state), the SAME one-time-guard
  // technique SignInCallback.tsx's own `hasStartedRef` uses (see that
  // file's doc comment) to survive React.StrictMode's synthetic
  // mount->cleanup->mount double-invoke without re-running a non-
  // idempotent side effect (a second navigate() mid-flight, here, rather
  // than SignInCallback's non-reusable OAuth code).
  const hasRedirectedRef = React.useRef(false);
  // Tracks the CURRENT pathname on every render (unlike the `location`
  // closed over by the effect below, which is a snapshot from whenever the
  // effect itself last ran) — read at the moment the async landing-config
  // fetch resolves, so a user who clicks a SideNav link WHILE that fetch is
  // still in flight doesn't get yanked back to '/''s default_route the
  // instant it resolves. Without this second check, the redirect would
  // correctly skip firing when it starts (if the user had already
  // navigated away before the effect even ran), but would still blindly
  // `navigate()` on fetch resolution even if the user navigated away in
  // the interim — a real race, not a hypothetical one, since this fetch
  // is a network round-trip and a client-side Link click is near-instant.
  const currentPathnameRef = React.useRef(location.pathname);
  currentPathnameRef.current = location.pathname;

  React.useEffect(() => {
    if (state.status !== 'resolved') return;
    if (hasRedirectedRef.current) return;
    // Only ever redirect away from the bare '/' landing — not any other
    // path the user may have already navigated to (including a deep link
    // restored by SignInCallback's own returnPath handling). This is what
    // makes the redirect a ONE-TIME "where do I land" decision rather than
    // something that fights the user's own subsequent navigation: once
    // this effect has run once for this resolved session (whether it
    // redirected or not — see below), it never runs again.
    hasRedirectedRef.current = true;
    if (location.pathname !== '/') return;

    let cancelled = false;
    async function redirectToLanding() {
      try {
        const config = await apiGet<LandingConfigResponse>('/api/v1/me/landing-config');
        if (cancelled) return;
        // Re-check the LIVE pathname (not the stale `location` this effect
        // closed over) — see currentPathnameRef's own doc comment above.
        // If the user already clicked a SideNav link to a real destination
        // while this fetch was in flight, that navigation wins; this
        // redirect's whole purpose is "where do I land first", not
        // "override wherever the user is now".
        if (currentPathnameRef.current !== '/') return;
        // ROLE_VIEW_UNMAPPED (the FRD's documented "role with no mapped
        // default view" case) or a fetch failure: do NOT redirect, leave
        // the user on '/' — AppShell's Outlet with no matched child route
        // renders an empty area, an acceptable degraded state per the
        // FRD's own documented edge case, not a new failure mode this
        // redirect introduces.
        if (config.error_code === 'ROLE_VIEW_UNMAPPED') return;
        navigate(config.default_route, { replace: true });
      } catch {
        // Fetch failure — same "leave the user on '/'" fallback as above.
      }
    }

    void redirectToLanding();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

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
    // Re-run when isCallbackRoute flips false→true→false (navigating off
    // /auth/callback after SignInCallback's own exchange completes) so the
    // very next render after that navigation resolves the session, instead
    // of staying in whatever state this effect last produced before the
    // callback route's bypass took over.
  }, [isCallbackRoute]);

  React.useEffect(() => {
    if (state.status === 'unauthenticated') {
      // Forward the exact path+query the user was trying to reach before
      // the redirect (04-08 gap closure) — signIn() threads this through
      // oidc-client-ts's own `state` param, and SignInCallback.tsx reads
      // it back on the far side of the round-trip to navigate there
      // instead of unconditionally landing on `/`.
      void signIn(location.pathname + location.search);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
