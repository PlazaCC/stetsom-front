import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminUi = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminUi || isAdminApi) {
    const isLoginPage = pathname === "/admin/login";
    if (!isLoginPage) {
      const token = request.cookies.get("admin_token");
      if (!token) {
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
