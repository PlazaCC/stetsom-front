import { getCmsApiBaseUrl, readUpstreamError } from "@/lib/api/route-utils";
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

  // Preserve incoming Content-Type when present (critical for multipart/binary)
  const incomingContentType = request.headers.get("content-type");
  if (incomingContentType) headers["Content-Type"] = incomingContentType;

  // Build body respecting content-type. If Content-Type is absent, preserve raw bytes
  // and fall back to text only when necessary.
  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    if (incomingContentType?.includes("application/json")) {
      body = await request.text();
    } else {
      try {
        body = await request.arrayBuffer();
      } catch {
        body = await request.text().catch(() => undefined);
      }

      if (body instanceof ArrayBuffer && body.byteLength === 0) {
        body = await request.text().catch(() => undefined);
      }
    }
  }

  const upstream = await fetch(upstreamUrl.toString(), {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseHeaders: Record<string, string> = {};
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders[name] = value;
  }

  // Handle no-content responses explicitly
  if (upstream.status === 204 || upstream.status === 205) {
    return new NextResponse(null, {
      status: upstream.status,
      headers: responseHeaders,
    });
  }

  const upstreamContentType = upstream.headers.get("content-type") ?? "";

  // Successful JSON responses
  if (upstream.ok && upstreamContentType.includes("application/json")) {
    const data = await upstream.json().catch(() => ({
      error: { code: "UPSTREAM_ERROR", message: "Invalid upstream response." },
    }));

    return NextResponse.json(data, {
      status: upstream.status,
      headers: responseHeaders,
    });
  }

  // Successful non-JSON responses: stream body through
  if (upstream.ok) {
    const headersWithType = { ...responseHeaders } as Record<string, string>;
    if (upstreamContentType)
      headersWithType["content-type"] = upstreamContentType;
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: headersWithType,
    });
  }

  // Error responses: read upstream error payload when possible
  const err = await readUpstreamError(
    upstream,
    "UPSTREAM_ERROR",
    "Upstream returned error",
  );
  const payload = { error: { code: err.code, message: err.message } };
  return NextResponse.json(payload, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
