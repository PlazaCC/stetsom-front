/**
 * Exchanges a refresh token for a new access token at stetsom-api. Used by the
 * proxy to renew an expired admin session on navigation, before it would
 * otherwise bounce the user to the login page.
 *
 * Returns null when the API rejects the refresh token or cannot be reached.
 */
export async function refreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  const base = process.env.CMS_API_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;

  try {
    const upstream = await fetch(`${base}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!upstream.ok) return null;

    const { accessToken } = (await upstream.json()) as {
      accessToken?: string;
    };
    return accessToken ?? null;
  } catch {
    return null;
  }
}
