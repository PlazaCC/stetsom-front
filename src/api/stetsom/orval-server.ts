/**
 * Server-side Orval client — for use in RSC and Server Actions only.
 *
 * Reads the admin_token HttpOnly cookie via next/headers and calls
 * stetsom-api directly (no BFF proxy). Import this ONLY in server files;
 * importing in client components will throw because next/headers is
 * not available in the browser.
 *
 * Usage in a Server Component:
 *   import { serverOrvalClient } from "@/api/stetsom/orval-server";
 *   const data = await serverOrvalClient<Product[]>({ method: "GET", url: "/api/products" });
 */
import type { AxiosRequestConfig } from "axios";
import Axios from "axios";
import { cookies } from "next/headers";
import { toApiError } from "./orval-client";

const directAxios = Axios.create({
  // Same env var the BFF and orval.config use — single source of truth.
  baseURL: process.env.CMS_API_BASE_URL ?? "http://localhost:3333",
  headers: { Accept: "application/json" },
});

export async function serverOrvalClient<T>(
  config: AxiosRequestConfig,
): Promise<T> {
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
    throw toApiError(err);
  }
}
