import type { AuthPayload } from "@/lib/api/contracts";
import type { NextResponse } from "next/server";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 8; // 8 h
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 d

/** Sets both HttpOnly auth cookies on a response after a successful login. */
export function setAuthCookies(response: NextResponse, payload: AuthPayload) {
  response.cookies.set("admin_token", payload.accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set("admin_refresh_token", payload.refreshToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/api/auth/refresh", // scoped: only sent to the refresh endpoint
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

/** Rotates only the access token cookie after a successful token refresh. */
export function rotateAccessTokenCookie(
  response: NextResponse,
  accessToken: string,
) {
  response.cookies.set("admin_token", accessToken, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax",
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
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
    path: "/api/auth/refresh",
    maxAge: 0,
  });
}
