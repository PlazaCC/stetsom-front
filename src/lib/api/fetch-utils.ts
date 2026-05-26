/**
 * Client-side fetch utility for BFF proxy routes.
 * Throws `ApiError` on non-2xx responses, preserving `status` and `code`
 * so callers can branch on error type (e.g. 401 vs 422).
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function proxyFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const code: string = body?.error?.code ?? "UNKNOWN";
    const message: string =
      body?.error?.message ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, code, message);
  }

  return res.json() as Promise<T>;
}
