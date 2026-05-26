import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

const IS_MOCK =
  !process.env.CMS_API_BASE_URL && process.env.CMS_FORCE_BFF !== "1";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET não está configurado.");
  }
  return new TextEncoder().encode(secret);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  if (IS_MOCK) {
    const parts = token.split(".");
    return parts.length === 3 && parts[0].length > 0 && parts[1].length > 0;
  }

  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (!isLoginPage) {
      const token = request.cookies.get("admin_token");
      const isValid = token ? await verifyAdminToken(token.value) : false;

      if (!isValid) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }

    return NextResponse.next();
  }

  return handleLocale(request);
}

export const config = {
  matcher: [
    // Site routes — locale middleware
    "/((?!_next|_vercel|api|admin|figma-assets|favicon\\.ico|.*\\..*).*)",
    // Admin UI routes — redirect to login when no cookie
    "/admin/:path*",
  ],
};
