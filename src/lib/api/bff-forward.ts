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

/** Upstream response headers forwarded to the BFF client (observability + rate-limiting). */
const FORWARDED_RESPONSE_HEADERS = [
  "x-request-id",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
] as const;

/**
 * Forwards a BFF request to the upstream API.
 *
 * - Rejects path traversal (`..` / `.`) in sub-segments
 * - Appends sub-segments (`resource[1..]`) to `basePath`
 * - Preserves original search params
 * - Injects `Authorization: Bearer <token>` when provided
 * - Pipes body unchanged for non-GET requests
 * - Forwards selected upstream response headers for observability
 */
export async function forwardRequest(
  request: NextRequest,
  basePath: string,
  resource: string[],
  token?: string,
): Promise<NextResponse> {
  const subSegments = resource.slice(1);

  if (subSegments.some((s) => s === ".." || s === ".")) {
    return NextResponse.json(
      {
        error: { code: "BAD_REQUEST", message: "Caminho de recurso inválido." },
      },
      { status: 400 },
    );
  }

  const subPath = subSegments.join("/");
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

  const responseHeaders: Record<string, string> = {};
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders[name] = value;
  }

  return NextResponse.json(data, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
