import { verifyAdminToken } from "@/lib/api/verify-admin-token";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";

    if (!isLoginPage) {
      const token = request.cookies.get("admin_token");
      const isValid =
        process.env.USE_MOCK_DATA === "1"
          ? Boolean(token?.value)
          : token
            ? await verifyAdminToken(token.value)
            : false;

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
