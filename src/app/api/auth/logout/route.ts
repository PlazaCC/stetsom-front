import { clearAuthCookies } from "@/lib/api/auth-cookies";
import { getCmsApiBaseUrl, toErrorResponse } from "@/lib/api/route-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
        // Best-effort upstream notification; do not block cookie clearing.
      }
    }

    const response = NextResponse.json({ ok: true });
    clearAuthCookies(response);
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}
