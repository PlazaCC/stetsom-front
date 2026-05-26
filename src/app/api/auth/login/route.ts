import type { AuthPayload, LoginCredentials } from "@/lib/api/contracts";
import { setAuthCookies } from "@/lib/api/auth-cookies";
import { getCmsProvider } from "@/lib/api/provider";
import {
  getCmsApiBaseUrl,
  isMockMode,
  readUpstreamError,
  toErrorResponse,
} from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginCredentials;

    if (isMockMode()) {
      const payload = await getCmsProvider().login(body);
      const response = NextResponse.json({ ok: true });
      setAuthCookies(response, payload);
      return response;
    }

    const base = getCmsApiBaseUrl();
    const upstream = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const isUnauthorized = upstream.status === 401;
      const error = await readUpstreamError(
        upstream,
        isUnauthorized ? "UNAUTHORIZED" : "AUTH_UPSTREAM_ERROR",
        isUnauthorized ? "Credenciais inválidas." : "Falha ao autenticar.",
      );
      return NextResponse.json({ error }, { status: upstream.status });
    }

    const payload = (await upstream.json()) as AuthPayload;
    const response = NextResponse.json({ ok: true });
    setAuthCookies(response, payload);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
