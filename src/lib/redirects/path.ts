/**
 * Normalization + reserved-prefix rules for legacy manual redirect paths.
 *
 * MUST stay identical to the backend `stetsom-api/src/lib/redirect-path.ts` so
 * that a path stored via the CMS matches the incoming request path in the site
 * middleware deterministically.
 */

/** Route prefixes owned by the site — redirects must never shadow these. */
export const RESERVED_REDIRECT_PREFIXES = [
  "/produtos",
  "/sobre",
  "/suporte",
  "/legal",
  "/admin",
  "/api",
  "/en",
  "/es",
] as const;

/**
 * Canonical form of a redirect path:
 * - trims, ensures a single leading slash
 * - lowercases the pathname (query is left untouched — values are case-sensitive)
 * - drops a trailing slash (except the root)
 */
export function normalizeRedirectPath(input: string): string {
  let raw = input.trim();

  const queryIndex = raw.indexOf("?");
  let query = "";
  if (queryIndex >= 0) {
    query = raw.slice(queryIndex);
    raw = raw.slice(0, queryIndex);
  }

  if (!raw.startsWith("/")) raw = `/${raw}`;
  raw = raw.toLowerCase();
  if (raw.length > 1) raw = raw.replace(/\/+$/, "");

  return raw + query;
}

/** Whether a (normalized) path falls under a reserved site route prefix. */
export function isReservedRedirectPath(path: string): boolean {
  const pathname = path.split("?")[0] ?? path;
  return RESERVED_REDIRECT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
