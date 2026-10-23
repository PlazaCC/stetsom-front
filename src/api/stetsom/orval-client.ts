/**
 * Orval custom mutator (CLIENT side — React Query hooks).
 *
 * Routes every request through the generic Next.js BFF passthrough
 * (/api/bff/<path>) so the HttpOnly admin_token cookie is injected
 * server-side and never exposed to the browser.
 *
 *   /api/products        → /api/bff/products
 *   /api/banners/:id     → /api/bff/banners/:id
 *
 * For Server Components / Server Actions use the generated functions under
 * "@/api/stetsom/server/**" (stetsomServer target → serverOrvalClient, direct
 * call, no proxy).
 */
import type { AxiosError, AxiosRequestConfig } from "axios";
import Axios from "axios";
import {
  notifySessionExpired,
  refreshSession,
} from "@/lib/api/session-refresh";

const proxyAxios = Axios.create({ headers: { Accept: "application/json" } });

/** /api/<path> → /api/bff/<path> */
function toBffPath(apiPath: string): string {
  const normalized = apiPath.replace(/^\/api\//, "").replace(/^\//, "");
  return `/api/bff/${normalized}`;
}

export class OrvalApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "OrvalApiError";
  }
}

/** Maps an Axios error (or any thrown value) to a typed OrvalApiError. */
export function toApiError(err: unknown): OrvalApiError {
  const e = err as AxiosError<{
    error?: {
      code?: string;
      message?: string;
      fields?: Record<string, string>;
    };
  }>;
  return new OrvalApiError(
    e.response?.status ?? 0,
    e.response?.data?.error?.code ?? "UNKNOWN",
    e.response?.data?.error?.message ?? e.message ?? "Request failed",
    e.response?.data?.error?.fields ?? {},
  );
}

function isUnauthorized(err: unknown): boolean {
  return Axios.isAxiosError(err) && err.response?.status === 401;
}

/** On 401 the access token has usually just expired: renew it and retry once. */
async function requestWithSessionRefresh<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  try {
    const { data } = await proxyAxios(config);
    return data as T;
  } catch (err) {
    if (!isUnauthorized(err)) throw err;
    if (!(await refreshSession())) {
      notifySessionExpired();
      throw err;
    }
    try {
      const { data } = await proxyAxios(config);
      return data as T;
    } catch (retryErr) {
      if (isUnauthorized(retryErr)) notifySessionExpired();
      throw retryErr;
    }
  }
}

export const orvalClient = <T>(config: AxiosRequestConfig): Promise<T> =>
  requestWithSessionRefresh<T>({
    ...config,
    url: toBffPath(config.url ?? ""),
  }).catch((err) => Promise.reject(toApiError(err)));
