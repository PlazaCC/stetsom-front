/**
 * POST /api/auth/logout (internal BFF route)
 *
 * Chama diretamente o backend Fastify para registrar o logout no audit log,
 * depois limpa os cookies. Falha silenciosa se o backend estiver fora do ar.
 */
import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CMS_API_BASE_URL =
  process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3333";

function clearAuthCookies(response: NextResponse) {
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("admin_refresh_token", "", {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 0,
  });
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    // Notifica a API real (audit log) — best-effort, não bloqueia o logout local
    if (token) {
      try {
        await fetch(`${CMS_API_BASE_URL}/api/auth/logout`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
      } catch {
        // backend fora do ar: logout local acontece de qualquer forma
      }
    }

    const response = NextResponse.json({ ok: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
