/**
 * Client-side session renewal for the admin.
 *
 * The access token is short-lived, so a 401 from the BFF or the upload routes
 * usually means "expired", not "logged out". Callers retry once after
 * `refreshSession()`; when the refresh token is gone too, the
 * `SESSION_EXPIRED_EVENT` lets the shell ask the user to sign in again
 * without leaving the page (and losing unsaved edits).
 */

export const SESSION_EXPIRED_EVENT = "admin:session-expired";

let inflight: Promise<boolean> | null = null;

/** Renews the access token cookie. Concurrent callers share one request. */
export function refreshSession(): Promise<boolean> {
  inflight ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function notifySessionExpired() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

/** `fetch` that renews the session and retries once on 401. The body must be
 *  re-sendable (string, Blob, FormData), never a consumed stream. */
export async function fetchWithSessionRefresh(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status !== 401) return res;

  if (!(await refreshSession())) {
    notifySessionExpired();
    return res;
  }

  const retry = await fetch(input, init);
  if (retry.status === 401) notifySessionExpired();
  return retry;
}
