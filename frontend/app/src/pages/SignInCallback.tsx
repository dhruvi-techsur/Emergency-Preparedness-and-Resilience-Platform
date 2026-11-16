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
 * 4. Redirect to `/` (Phase 1 has no deep-link return-path tracking yet;
 *    the shell's own RouteGuard resolves the landing route from there).
 */
export function SignInCallback(): JSX.Element {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

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

        if (!cancelled) {
          navigate('/', { replace: true });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Sign-in failed.');
        }
      }
    }

    void completeSignIn();
    return () => {
      cancelled = true;
    };
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
