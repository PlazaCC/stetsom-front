import { config, type AppRouteStaticData, type RouteTab } from "./config";

const ROUTE_PATTERNS = Object.keys(config);

function segmentsOf(path: string): string[] {
  return path.split("/").filter(Boolean);
}

function isDynamicSegment(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

/** Number of dynamic segments — used to prefer the most specific match. */
function paramCount(pattern: string): number {
  return segmentsOf(pattern).filter(isDynamicSegment).length;
}

/**
 * A pattern matches a pathname when they have the same number of segments and
 * every static segment is equal. Dynamic segments (`[id]`) match anything.
 */
function patternMatches(pattern: string, pathname: string): boolean {
  const patternSegs = segmentsOf(pattern);
  const pathSegs = segmentsOf(pathname);
  if (patternSegs.length !== pathSegs.length) return false;
  return patternSegs.every(
    (seg, i) => isDynamicSegment(seg) || seg === pathSegs[i],
  );
}

/**
 * Resolve the static data for a live pathname. Exact keys win; otherwise the
 * matching dynamic pattern with the fewest params is chosen (most specific).
 */
export function resolveRoute(pathname: string): AppRouteStaticData | undefined {
  const exact = config[pathname];
  if (exact) return exact;

  const matches = ROUTE_PATTERNS.filter((pattern) =>
    patternMatches(pattern, pathname),
  );
  if (matches.length === 0) return undefined;

  matches.sort((a, b) => paramCount(a) - paramCount(b));
  return config[matches[0]];
}

export type Breadcrumb = {
  label: string;
  href: string;
  isCurrent: boolean;
};

/**
 * Derive the breadcrumb trail from the URL hierarchy. Each cumulative prefix of
 * the pathname is resolved against the config; segments without an entry or
 * flagged `hideInBreadcrumb` are skipped.
 *
 * `overrides` maps a live href to a runtime label (e.g. a fetched product name)
 * that takes precedence over the static config label for that segment.
 */
export function buildBreadcrumb(
  pathname: string,
  overrides: Record<string, string> = {},
): Breadcrumb[] {
  const segments = segmentsOf(pathname);
  const crumbs: Breadcrumb[] = [];
  let href = "";

  for (const segment of segments) {
    href += `/${segment}`;
    const data = resolveRoute(href);
    if (!data || data.hideInBreadcrumb) continue;
    crumbs.push({
      label: overrides[href] ?? data.breadcrumbLabel ?? data.label,
      href,
      isCurrent: href === pathname,
    });
  }

  return crumbs;
}

/**
 * Resolve the tab bar for a pathname by walking up the hierarchy until a route
 * declares `tabs`. Lets descendant routes (e.g. `/admin/produtos/novo`) inherit
 * their area's tabs without redeclaring them.
 */
export function resolveTabs(pathname: string): RouteTab[] | undefined {
  const segments = segmentsOf(pathname);
  for (let depth = segments.length; depth >= 1; depth--) {
    const href = `/${segments.slice(0, depth).join("/")}`;
    const data = resolveRoute(href);
    if (data?.tabs) return data.tabs;
  }
  return undefined;
}
