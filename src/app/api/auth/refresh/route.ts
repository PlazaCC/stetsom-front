import { rotateAccessTokenCookie } from "@/lib/api/auth-cookies";
import { getCmsProvider } from "@/lib/api/provider";
import {
  getCmsApiBaseUrl,
  isMockMode,
  readUpstreamError,
  toErrorResponse,
  unauthorizedResponse,
} from "@/lib/api/route-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("admin_refresh_token")?.value;

    if (!refreshToken) {
      return unauthorizedResponse("Refresh token ausente.");
    }

    if (isMockMode()) {
      const payload = await getCmsProvider().refreshToken(refreshToken);
      const response = NextResponse.json({ ok: true });
      rotateAccessTokenCookie(response, payload.accessToken);
      return response;
    }

    const base = getCmsApiBaseUrl();
    const upstream = await fetch(`${base}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const error = await readUpstreamError(
        upstream,
        upstream.status === 401 ? "UNAUTHORIZED" : "REFRESH_FAILED",
        "Sessão expirada.",
      );
      return NextResponse.json({ error }, { status: upstream.status });
    }

    const { accessToken } = (await upstream.json()) as { accessToken: string };
    const response = NextResponse.json({ ok: true });
    rotateAccessTokenCookie(response, accessToken);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
