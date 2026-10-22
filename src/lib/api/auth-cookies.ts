import type { TokensResponse } from "@/api/stetsom/model";
import type { NextResponse } from "next/server";
import { readJwtExp } from "./jwt-exp";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_FALLBACK_MAX_AGE = 60 * 60 * 8; // 8 h, when exp is unreadable
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 d

// The refresh cookie used to be scoped to this path. It now lives on "/" so the
// proxy can renew the session on admin navigations; the old copy is expired.
const LEGACY_REFRESH_COOKIE_PATH = "/api/auth/refresh";

type CookieWriter = Pick<NextResponse, "cookies" | "headers">;

/** Seconds until the JWT's `exp`, so the cookie never outlives the token. */
function accessTokenMaxAge(accessToken: string): number {
  const exp = readJwtExp(accessToken);
  if (exp === null) return ACCESS_TOKEN_FALLBACK_MAX_AGE;
  return Math.max(0, exp - Math.floor(Date.now() / 1000));
}

/** Must run after every `response.cookies.set` call: those rewrite the
 *  Set-Cookie headers from their own map and would drop this raw one. */
function expireLegacyRefreshCookie(response: CookieWriter) {
  response.headers.append(
    "Set-Cookie",
    `admin_refresh_token=; Path=${LEGACY_REFRESH_COOKIE_PATH}; Max-Age=0; HttpOnly; SameSite=Lax${IS_PRODUCTION ? "; Secure" : ""}`,
  );
}

function setAccessTokenCookie(response: CookieWriter, accessToken: string) {
  response.cookies.set("admin_token", accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: accessTokenMaxAge(accessToken),
  });
}

/** Sets both HttpOnly auth cookies on a response after a successful login. */
export function setAuthCookies(
  response: NextResponse,
  payload: TokensResponse,
) {
  setAccessTokenCookie(response, payload.accessToken);

  response.cookies.set("admin_refresh_token", payload.refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  expireLegacyRefreshCookie(response);
}

/** Rotates only the access token cookie after a successful token refresh. */
export function rotateAccessTokenCookie(
  response: CookieWriter,
  accessToken: string,
) {
  setAccessTokenCookie(response, accessToken);
}

/** Clears both auth cookies (sets maxAge = 0) on logout. */
export function clearAuthCookies(response: NextResponse) {
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
    path: "/",
    maxAge: 0,
  });

  expireLegacyRefreshCookie(response);
}
