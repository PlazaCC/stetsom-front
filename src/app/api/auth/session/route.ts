import { readJwtExp } from "@/lib/api/jwt-exp";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * When the admin session ends for good. The access token renews silently, but
 * the refresh token does not rotate, so the session lasts until its `exp`;
 * the admin uses this to warn before that. Null when there is no refresh
 * token or it cannot be read (mock mode included).
 */
export async function GET() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("admin_refresh_token")?.value;
  const exp = refreshToken ? readJwtExp(refreshToken) : null;

  return NextResponse.json(
    { refreshExpiresAt: exp ? new Date(exp * 1000).toISOString() : null },
    { headers: { "Cache-Control": "no-store" } },
  );
}
