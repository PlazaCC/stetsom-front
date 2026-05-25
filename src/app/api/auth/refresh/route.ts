import { toErrorResponse } from "@/lib/api/route-utils";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CMS_API_BASE_URL =
  process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3333";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("admin_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Refresh token ausente." } },
        { status: 401 },
      );
    }

    const upstream = await fetch(`${CMS_API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const body = (await upstream.json()) as { error?: { message?: string } };
      return NextResponse.json(
        {
          error: {
            code: "REFRESH_FAILED",
            message: body.error?.message ?? "Sessão expirada.",
          },
        },
        { status: 401 },
      );
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
