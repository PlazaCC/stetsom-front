import { getCmsApiBaseUrl } from "@/lib/api/route-utils";
import { type NextRequest, NextResponse } from "next/server";

/** Admin resource segment → upstream API path */
export const ADMIN_ROUTE_MAP: Record<string, string> = {
  dashboard: "/api/dashboard/",
  users: "/api/users/",
  banners: "/api/banners/",
  library: "/api/library/",
  messages: "/api/messages/",
  audit: "/api/audit/",
  config: "/api/config/",
  products: "/api/products/admin",
};

/** Catalog resource segment → upstream API path */
export const CATALOG_ROUTE_MAP: Record<string, string> = {
  page: "/api/site/catalog",
  products: "/api/products/",
  categories: "/api/categories/",
};

/**
 * Forwards a BFF request to the upstream API.
 *
 * - Appends sub-segments (`resource[1..]`) to `basePath`
 * - Preserves original search params
 * - Injects `Authorization: Bearer <token>` when provided
 * - Pipes body unchanged for non-GET requests
 */
export async function forwardRequest(
  request: NextRequest,
  basePath: string,
  resource: string[],
  token?: string,
): Promise<NextResponse> {
  const subPath = resource.slice(1).join("/");
  const upstreamPath = subPath
    ? `${basePath.replace(/\/$/, "")}/${subPath}`
    : basePath;

  const upstreamUrl = new URL(upstreamPath, getCmsApiBaseUrl());
  upstreamUrl.search = request.nextUrl.search;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (request.method !== "GET") headers["Content-Type"] = "application/json";

  const upstream = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers,
    body: request.method !== "GET" ? await request.text() : undefined,
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({
    error: { code: "UPSTREAM_ERROR", message: "Invalid upstream response." },
  }));

  return NextResponse.json(data, { status: upstream.status });
}
