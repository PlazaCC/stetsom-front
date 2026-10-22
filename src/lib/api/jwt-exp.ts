/**
 * The `exp` claim of a JWT, in seconds since the epoch, or null when the
 * token is not a readable JWT. The signature is not checked: use it only to
 * time cookies and warnings, never to trust the token.
 */
export function readJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}
