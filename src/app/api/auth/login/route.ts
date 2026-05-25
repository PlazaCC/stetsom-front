/**
 * POST /api/auth/login (internal BFF route)
 *
 * Chama diretamente o backend Fastify (CMS_API_BASE_URL).
 * Não passa pelo CmsProvider para evitar acoplamento com o cache do provider.
 */
import type { AuthPayload, LoginCredentials } from "@/lib/api/contracts";
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CMS_API_BASE_URL =
  process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3333";

type UpstreamErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

async function readUpstreamAuthError(
  response: Response,
): Promise<{ code: string; message: string }> {
  const isUnauthorized = response.status === 401;
  const defaultCode = isUnauthorized ? "UNAUTHORIZED" : "AUTH_UPSTREAM_ERROR";
  const defaultMessage = isUnauthorized
    ? "Credenciais inválidas."
    : "Falha ao autenticar no servidor.";

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as UpstreamErrorPayload;
      return {
        code: data.error?.code ?? defaultCode,
        message: data.error?.message ?? defaultMessage,
      };
    } catch {
      return { code: defaultCode, message: defaultMessage };
    }
  }

  const text = await response.text().catch(() => "");
  return {
    code: defaultCode,
    message: text.trim() || defaultMessage,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginCredentials;

    const upstream = await fetch(`${CMS_API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const errorPayload = await readUpstreamAuthError(upstream);
      return NextResponse.json(
        { error: errorPayload },
        { status: upstream.status },
      );
    }

    const payload = (await upstream.json()) as AuthPayload;

    const response = NextResponse.json({ ok: true });

    // Access token — httpOnly, 8h, disponível em todas as rotas
    response.cookies.set("admin_token", payload.accessToken, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    // Refresh token — httpOnly, 7d, restrito à rota de refresh
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
