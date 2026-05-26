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

const IS_PRODUCTION = process.env.NODE_ENV === "production";

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
      response.cookies.set("admin_token", payload.accessToken, {
        httpOnly: true,
        secure: IS_PRODUCTION,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      });
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
    response.cookies.set("admin_token", accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
