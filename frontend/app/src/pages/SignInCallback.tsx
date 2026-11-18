import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { userManager } from '../auth/oidc-config';
import { setSessionToken } from '../auth/session-storage';
import { Skeleton } from '@epmp/design-system';

/**
 * Handles the OIDC authorization-code redirect back from Keycloak.
 *
 * 1. oidc-client-ts completes the code+PKCE exchange and gives us the
 *    validated `id_token`.
 * 2. That raw ID token is POSTed to the backend's own
 *    `/api/v1/auth/sso/callback` (backend/src/modules/auth-org/sso.ts),
 *    which re-validates it against Keycloak's JWKS, JIT-provisions/resolves
 *    the local user, and mints EPMP's own short-lived session JWT.
 * 3. The returned `session_token` is stored via session-storage.ts
 *    (sessionStorage, never localStorage — threat register T-01-21).
 * 4. Read `oidcUser.state` back — the path+query `RouteGuard.tsx`'s
 *    unauthenticated-branch effect forwarded into `signIn()` before the
 *    redirect (04-08 gap closure) — and `navigate()` there instead of the
 *    old unconditional `navigate('/')`. `state` is typed `unknown` by
 *    oidc-client-ts, so it's type-guarded to a non-empty string starting
 *    with `/` (and never `/auth/callback` itself, to avoid a pathological
 *    self-redirect loop) before ever reaching `navigate()`; anything else
 *    (including the common case of no return path at all) falls back to
 *    `/`, exactly as before.
 */
export function SignInCallback(): JSX.Element {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  // React.StrictMode (main.tsx) deliberately double-invokes effects in dev
  // (mount→cleanup→mount) to surface missing cleanup bugs. That's safe for
  // an idempotent effect, but signinRedirectCallback() is NOT idempotent:
  // the authorization `code` in the callback URL is single-use per the
  // OAuth spec, so the second invocation's exchange attempt gets Keycloak's
  // "Code not valid" rejection. A ref (not state) persists across both
  // invocations on the same component instance without triggering a
  // re-render, so it's the right guard for "run this exactly once even
  // under StrictMode's synthetic double-invoke".
  const hasStartedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // No `cancelled`/cleanup-guard flag here, deliberately: StrictMode's
    // synthetic unmount between the double-invoke would set it `true`
    // before this async work resolves — on the ONE invocation that
    // actually runs (hasStartedRef above already prevents the second
    // invocation's redundant/code-reuse network call) — silently
    // swallowing a legitimately successful sign-in by skipping navigate().
    // That was a real, observed bug (not a hypothetical worst-case):
    // POST /api/v1/auth/sso/callback returned 200 and session_token was
    // stored, but the user was left stuck on a blank /auth/callback page.
    // navigate() and setError() are both safe to call after a real (not
    // synthetic) unmount in React 18 — no warning, no-op if truly gone.
    async function completeSignIn() {
      try {
        const oidcUser = await userManager.signinRedirectCallback();
        const idToken = oidcUser.id_token;
        if (!idToken) {
          throw new Error('OIDC callback completed but no id_token was returned');
        }

        const res = await fetch('/api/v1/auth/sso/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_token: idToken }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message ?? 'Sign-in with your organization account failed.');
        }

        const { session_token } = (await res.json()) as { session_token: string };
        setSessionToken(session_token);

        const state = oidcUser.state;
        const returnPath =
          typeof state === 'string' && state.startsWith('/') && state !== '/auth/callback'
            ? state
            : '/';
        navigate(returnPath, { replace: true });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign-in failed.');
      }
    }

    void completeSignIn();
  }, [navigate]);

  if (error) {
    return (
      <div className="ep-signin-callback ep-signin-callback--error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="ep-signin-callback" aria-busy="true">
      <Skeleton w="100%" h={24} />
      <Skeleton w="60%" h={24} />
    </div>
  );
}
