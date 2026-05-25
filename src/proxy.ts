import { jwtVerify } from "jose";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET não está configurado.");
  }
  return new TextEncoder().encode(secret);
}

async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getJwtSecret());
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminUi = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminUi || isAdminApi) {
    const isLoginPage = pathname === "/admin/login";

    if (!isLoginPage) {
      const token = request.cookies.get("admin_token");
      const isValid = token ? await verifyAdminToken(token.value) : false;

      if (!isValid) {
        if (isAdminApi) {
          return NextResponse.json(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "Authentication required",
              },
            },
            { status: 401 },
          );
        }
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
    // Admin API routes — return 401 when no cookie
    "/api/admin/:path*",
  ],
};
