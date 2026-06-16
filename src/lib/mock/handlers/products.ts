interface CategoryItem {
  name: string;
  slug: string;
  lines?: Array<{ name: string; slug: string }>;
}

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  line: string | null;
  status: string;
}

interface ProductResponse {
  items: ProductItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function buildSlugNameMap(categories: CategoryItem[]): {
  catSlugToName: Record<string, string>;
  lineSlugToName: Record<string, string>;
} {
  const catSlugToName: Record<string, string> = {};
  const lineSlugToName: Record<string, string> = {};
  for (const c of categories) {
    catSlugToName[c.slug] = c.name;
    for (const l of c.lines ?? []) {
      lineSlugToName[l.slug] = l.name;
    }
  }
  return { catSlugToName, lineSlugToName };
}

/**
 * Server-side mock handler for GET /api/products.
 * Mirrors the upstream behavior: slug-based filtering, query search, sort, pagination.
 */
export function productsHandler(
  data: unknown,
  params: URLSearchParams,
  store: (key: string) => unknown,
): ProductResponse {
  const raw = data as ProductResponse;
  const items = raw.items;

  const categories = (store("categories") ?? []) as CategoryItem[];
  const { catSlugToName, lineSlugToName } = buildSlugNameMap(categories);

  const categorySlug = params.get("category");
  const lineSlug = params.get("line");
  const q = params.get("q")?.trim().toLowerCase();
  const sort = params.get("sort") ?? "relevance";
  const status = params.get("status");
  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number(params.get("pageSize")) || 24),
  );

  // Resolve slug filters to locale-resolved display names
  const categoryName = categorySlug ? catSlugToName[categorySlug] : undefined;
  const lineName = lineSlug ? lineSlugToName[lineSlug] : undefined;

  let filtered = items;

  if (categoryName) {
    filtered = filtered.filter((p) => p.category === categoryName);
  }

  if (lineName) {
    filtered = filtered.filter((p) => p.line === lineName);
  }

  if (status && status !== "ALL" && status !== "PUBLISHED") {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (q) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)),
    );
  }

  // Sort: newest uses creation time inferred from MongoDB ObjectId (first 8 hex chars = timestamp)
  if (sort === "newest") {
    filtered = [...filtered].sort((a, b) => b.id.localeCompare(a.id));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    items: paged,
    total,
    page,
    pageSize,
    totalPages,
  };
}
