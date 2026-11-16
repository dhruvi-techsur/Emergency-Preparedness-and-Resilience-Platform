import { getSessionToken, clearSessionToken } from '../auth/session-storage';

/** Shape of every EPMP backend error response (error_code + human message). */
export interface ApiError {
  error_code: string;
  message: string;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiError,
  ) {
    super(body.message);
    this.name = 'ApiRequestError';
  }
}

/**
 * Centralizes 401 SESSION_EXPIRED handling in exactly one place: on any
 * request that comes back 401, clear the stored session token and send the
 * browser back to Keycloak sign-in. Every apiGet/apiPatch/apiPost call site
 * gets this for free rather than each needing its own 401 branch.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    clearSessionToken();
    // Full navigation (not react-router) — the session is gone, so the
    // entire app needs to re-resolve via RouteGuard from scratch on
    // Keycloak's redirect-back, same as RouteGuard's own unauthenticated path.
    window.location.href = '/';
    throw new ApiRequestError(401, {
      error_code: 'SESSION_EXPIRED',
      message: 'Your session has ended. Sign in again to continue.',
    });
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({
      error_code: 'UNKNOWN_ERROR',
      message: `Request failed with status ${res.status}`,
    }))) as ApiError;
    throw new ApiRequestError(res.status, body);
  }

  // 204 No Content has no body to parse.
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

function authHeaders(): HeadersInit {
  const token = getSessionToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { ...authHeaders() } });
  return handleResponse<T>(res);
}

export async function apiPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(path: string, body: object): Promise<T> {
  const res = await fetch(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
