/**
 * Single source of truth for where the EPMP session token lives in the
 * browser: `sessionStorage`, never `localStorage` (01-10-PLAN.md threat
 * register T-01-21 — cleared on tab close, limiting the persistence window
 * of a token exposed to an XSS payload elsewhere in the app).
 *
 * Both `SignInCallback` (writer, after the SSO callback exchange) and
 * `api-client`/`RouteGuard`/`auth-context` (readers, on every authenticated
 * request) go through this module rather than touching `sessionStorage`
 * directly, so the storage key and mechanism are declared in exactly one
 * place.
 */
const SESSION_TOKEN_KEY = 'epmp_session_token';

export function getSessionToken(): string | null {
  return window.sessionStorage.getItem(SESSION_TOKEN_KEY);
}

export function setSessionToken(token: string): void {
  window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
}

export function clearSessionToken(): void {
  window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
}
