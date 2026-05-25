import { getCmsApiBaseUrl, toErrorResponse } from "@/lib/api/route-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

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
    const base = getCmsApiBaseUrl();

    if (token) {
      try {
        await fetch(`${base}/api/auth/logout`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
      } catch {
        // Best-effort upstream notification.
      }
    }

    const response = NextResponse.json({ ok: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
