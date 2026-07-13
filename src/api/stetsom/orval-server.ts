/**
 * Server-side Orval mutator — for RSC and Server Actions only.
 *
 * Reads the admin_token HttpOnly cookie via next/headers and calls
 * stetsom-api directly (no BFF proxy). This is the mutator for the
 * `stetsomServer` Orval target: the generated functions under ./server/**
 * call serverOrvalClient. Import the generated functions (not this directly)
 * from server files ONLY — next/headers is unavailable in the browser.
 *
 * Usage in a Server Component:
 *   import { getApiProducts } from "@/api/stetsom/server/products-public/products-public";
 *   const catalog = await getApiProducts({ page: 1, pageSize: 20, locale: "pt" });
 */
import type { AxiosRequestConfig } from "axios";
import Axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { handleMockRequest } from "@/lib/mock/handlers";
import { OrvalApiError, toApiError } from "./orval-client";

const directAxios = Axios.create({
  // Same env var the BFF and orval.config use — single source of truth.
  baseURL: process.env.CMS_API_BASE_URL ?? "http://localhost:3333",
  headers: { Accept: "application/json" },
});

export async function serverOrvalClient<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  if (process.env.USE_MOCK_DATA === "1") {
    const method = (config.method ?? "GET").toUpperCase();
    const segments = (config.url ?? "")
      .replace(/^\/api\//, "")
      .split("/")
      .filter(Boolean);
    if (method === "GET") {
      const sp = new URLSearchParams();
      if (config.params) {
        for (const [k, v] of Object.entries(config.params)) {
          if (v != null && v !== "") sp.set(k, String(v));
        }
      }
      const mock = handleMockRequest(segments, sp);
      if (mock !== null) return mock as T;
      throw new OrvalApiError(
        404,
        "MOCK_NOT_FOUND",
        `No mock data for: ${segments.join("/")}. Run pnpm mock:dump.`,
      );
    }
    return {} as T;
  }

  const token = (await cookies()).get("admin_token")?.value;
  try {
    const { data } = await directAxios({
      ...config,
      headers: {
        ...config.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return data as T;
  } catch (err: unknown) {
    const apiError = toApiError(err);
    if (apiError.status === 0 || apiError.status >= 500) {
      Sentry.logger.error("Upstream API request failed", {
        error_code: apiError.code,
        http_method: config.method ?? "GET",
        http_status_code: apiError.status,
        request_path: config.url ?? "unknown",
      });
    }
    throw apiError;
  }
}
