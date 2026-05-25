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
      const data = (await upstream.json()) as { error?: { message?: string } };
      return NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: data.error?.message ?? "Credenciais inválidas.",
          },
        },
        { status: 401 },
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
