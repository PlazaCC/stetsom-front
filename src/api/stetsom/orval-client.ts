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
 * For Server Components / Server Actions use `serverOrvalClient`
 * from "@/api/stetsom/orval-server" (direct call, no proxy).
 */
import type { AxiosError, AxiosRequestConfig } from "axios";
import Axios from "axios";

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
  ) {
    super(message);
    this.name = "OrvalApiError";
  }
}

/** Maps an Axios error (or any thrown value) to a typed OrvalApiError. */
export function toApiError(err: unknown): OrvalApiError {
  const e = err as AxiosError<{ error?: { code?: string; message?: string } }>;
  return new OrvalApiError(
    e.response?.status ?? 0,
    e.response?.data?.error?.code ?? "UNKNOWN",
    e.response?.data?.error?.message ?? e.message ?? "Request failed",
  );
}

export const orvalClient = <T>(config: AxiosRequestConfig): Promise<T> =>
  proxyAxios({ ...config, url: toBffPath(config.url ?? "") })
    .then(({ data }) => data as T)
    .catch((err) => Promise.reject(toApiError(err)));
