import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts';

/**
 * OIDC client configuration — authorization-code + PKCE flow against
 * Keycloak's `epmp` realm (backend/keycloak/epmp-realm.json registers the
 * `epmp-app` public client with `pkce.code.challenge.method: S256`).
 *
 * oidc-client-ts enables PKCE by default for a public client (no
 * client_secret), so no extra config is needed to turn it on — this is the
 * standard mitigation for authorization-code interception/replay against a
 * client that cannot keep a secret (see 01-10-PLAN.md's threat register,
 * T-01-22).
 *
 * userStore uses sessionStorage (not the oidc-client-ts default of
 * localStorage) so the OIDC library's own internal state (PKCE code
 * verifier, nonce, the transient User object immediately after redirect)
 * shares the same reduced XSS-persistence window as the app's own session
 * token (see SignInCallback.tsx).
 */
const KEYCLOAK_AUTHORITY = `${window.location.origin}/realms/epmp`;
const KEYCLOAK_CLIENT_ID = 'epmp-app';

export const userManager = new UserManager({
  authority: KEYCLOAK_AUTHORITY,
  client_id: KEYCLOAK_CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth/callback`,
  response_type: 'code',
  scope: 'openid profile email',
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  automaticSilentRenew: false,
});

/** Redirects the browser to Keycloak's login page. */
export function signIn(): Promise<void> {
  return userManager.signinRedirect();
}

/** Clears local OIDC state and redirects to Keycloak's end-session endpoint. */
export function signOut(): Promise<void> {
  return userManager.signoutRedirect();
}

export type { User as OidcUser };
