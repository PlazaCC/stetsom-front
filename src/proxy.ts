import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!pathname.startsWith("/admin/login")) {
      const token = request.cookies.get("admin_token");
      if (!token) {
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
    // Admin routes — auth guard (locale middleware skipped via early return above)
    "/admin/:path*",
  ],
};
