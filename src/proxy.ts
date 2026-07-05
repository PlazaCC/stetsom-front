import { verifyAdminToken } from "@/lib/api/verify-admin-token";
import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { resolveRedirect } from "./lib/redirects/resolve";

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

  // Legacy QR-code paths → 301 to the manual's current S3 URL. Runs before the
  // locale middleware; only exact registered paths redirect, everything else
  // falls through untouched.
  const target = await resolveRedirect(pathname, request.nextUrl.search);
  if (target) return NextResponse.redirect(target, 301);

  return handleLocale(request);
}

export const config = {
  matcher: [
    // Site routes — locale middleware + legacy redirect lookup.
    // Excludes infra paths and real static assets, but NOT `.pdf` (legacy QR
    // paths may end in `.pdf`), so those still reach the redirect resolver.
    "/((?!_next|_vercel|api|admin|figma-assets|favicon\\.ico|.*\\.(?:js|css|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|txt|xml|json|map)$).*)",
    // Admin UI routes — redirect to login when no cookie
    "/admin/:path*",
  ],
};
