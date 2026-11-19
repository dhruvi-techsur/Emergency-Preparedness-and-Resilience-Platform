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

/**
 * For endpoints that return a binary/file body (e.g. CSV export) rather
 * than JSON. Every other apiGet/apiPost/apiPatch call site in this app
 * attaches the Bearer token via authHeaders() — a raw `window.location.href`
 * navigation to an authenticated route cannot carry that header at all, so
 * any download-triggering route must go through fetch like this one does.
 * Reuses the same 401 SESSION_EXPIRED handling apiGet gets for free.
 */
export async function apiGetBlob(path: string): Promise<Blob> {
  const res = await fetch(path, { headers: { ...authHeaders() } });
  if (res.status === 401) {
    clearSessionToken();
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
  return res.blob();
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

/**
 * Multipart photo upload — a small, intentional API surface addition
 * (05-03): apiPost's JSON-only signature doesn't support multipart/
 * FormData bodies, and Report Observation's photo capture needs exactly
 * one such call (`POST /api/v1/field-reports/{id}/photos`, 05-01). Uses
 * `fetch` directly with `FormData` so the browser sets its own
 * multipart boundary — never set Content-Type manually for FormData.
 */
export async function uploadFieldReportPhoto(fieldReportId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`/api/v1/field-reports/${fieldReportId}/photos`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });
  await handleResponse<void>(res);
}
