/**
 * Generic BFF passthrough for the Orval-generated client.
 *
 * Forwards any /api/bff/<path> request to the upstream stetsom-api at
 * /api/<path>, injecting the admin_token HttpOnly cookie as a Bearer header.
 * This keeps the JWT off the browser while letting the generated React Query
 * hooks call a single, future-proof endpoint (no per-resource route maps).
 *
 * Auth flows (login / refresh / logout) are NOT handled here — they use the
 * dedicated /api/auth/* routes that manage the HttpOnly cookies.
 */
import { getCmsApiBaseUrl, toErrorResponse } from "@/lib/api/route-utils";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Response headers worth forwarding back to the browser.
const FORWARDED_HEADERS = [
  "x-request-id",
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
] as const;

async function handle(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> {
  try {
    const { path } = await ctx.params;

    // Reject path traversal
    if (path.some((seg) => seg === ".." || seg === ".")) {
      return NextResponse.json(
        { error: { code: "BAD_REQUEST", message: "Invalid path." } },
        { status: 400 },
      );
    }

    const base = getCmsApiBaseUrl();
    const search = request.nextUrl.search;
    const upstreamUrl = `${base}/api/${path.join("/")}${search}`;

    const token = (await cookies()).get("admin_token")?.value;

    const headers: Record<string, string> = { Accept: "application/json" };
    const contentType = request.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;
    if (token) headers.Authorization = `Bearer ${token}`;

    const hasBody = !["GET", "HEAD"].includes(request.method);
    const body = hasBody ? await request.text() : undefined;

    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const resContentType = upstream.headers.get("content-type") ?? "";
    const isJson = resContentType.includes("application/json");

    // Preserve the upstream body shape: JSON stays JSON, anything else is
    // passed through verbatim (never re-encode text as a JSON string).
    const response = isJson
      ? NextResponse.json(await upstream.json().catch(() => null), {
          status: upstream.status,
        })
      : new NextResponse(await upstream.text(), {
          status: upstream.status,
          headers: resContentType
            ? { "Content-Type": resContentType }
            : undefined,
        });

    for (const h of FORWARDED_HEADERS) {
      const v = upstream.headers.get(h);
      if (v) response.headers.set(h, v);
    }
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;
