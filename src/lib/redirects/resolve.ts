import type { RedirectEntry } from "@/api/stetsom/model";
import { isReservedRedirectPath, normalizeRedirectPath } from "./path";

/**
 * Resolves legacy QR-code paths to the current S3 URL of a manual, for the site
 * middleware to issue 301s. The redirect map comes from the PUBLIC
 * `GET /api/redirects` endpoint and is cached in-module with a TTL so we don't
 * hit the API on every request. Any fetch failure degrades gracefully to "no
 * redirect" so the site never breaks.
 */

const TTL_MS = 5 * 60 * 1000;
const LOCALE_PREFIX = /^\/(?:en|es)(?=\/|$)/;

let cache: { map: Map<string, string>; at: number } | null = null;

async function getRedirectMap(): Promise<Map<string, string>> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.map;

  const base = process.env.CMS_API_BASE_URL;
  if (!base) return cache?.map ?? new Map();

  try {
    const fetchRes = await fetch(`${base}/api/redirects`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!fetchRes.ok) return cache?.map ?? new Map();
    const raw = (await fetchRes.json()) as unknown[];
    const entries = raw.filter(
      (e): e is RedirectEntry =>
        typeof e === "object" &&
        e !== null &&
        "path" in e &&
        "target_url" in e &&
        typeof (e as Record<string, unknown>).path === "string" &&
        typeof (e as Record<string, unknown>).target_url === "string",
    );
    const map = new Map<string, string>();
    for (const entry of entries) {
      map.set(normalizeRedirectPath(entry.path), entry.target_url);
    }
    cache = { map, at: now };
    return map;
  } catch {
    // Keep a stale map if we have one; otherwise treat as empty.
    return cache?.map ?? new Map();
  }
}

/**
 * Returns the target S3 URL for an incoming request path, or `null` when no
 * redirect is registered. Locale-agnostic (an `/en`/`/es` prefix is stripped);
 * tries an exact `pathname+query` match first, then `pathname` alone.
 */
export async function resolveRedirect(
  pathname: string,
  search: string,
): Promise<string | null> {
  const stripped = pathname.replace(LOCALE_PREFIX, "") || "/";
  if (isReservedRedirectPath(stripped)) return null;

  const map = await getRedirectMap();
  if (map.size === 0) return null;

  const withQuery = search
    ? map.get(normalizeRedirectPath(stripped + search))
    : undefined;
  return withQuery ?? map.get(normalizeRedirectPath(stripped)) ?? null;
}
