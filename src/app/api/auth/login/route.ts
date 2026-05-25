import type { AuthPayload, LoginCredentials } from "@/lib/api/contracts";
import {
  getCmsApiBaseUrl,
  readUpstreamError,
  toErrorResponse,
} from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginCredentials;
    const base = getCmsApiBaseUrl();

    const upstream = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const isUnauthorized = upstream.status === 401;
      const errorPayload = await readUpstreamError(
        upstream,
        isUnauthorized ? "UNAUTHORIZED" : "AUTH_UPSTREAM_ERROR",
        isUnauthorized ? "Credenciais inválidas." : "Falha ao autenticar.",
      );

      return NextResponse.json(
        { error: errorPayload },
        { status: upstream.status },
      );
    }

    const payload = (await upstream.json()) as AuthPayload;

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_token", payload.accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    response.cookies.set("admin_refresh_token", payload.refreshToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      path: "/api/auth/refresh",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
