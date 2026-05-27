import type {
  Category,
  CmsProductRow,
  Locale,
  Product,
  ProductCardItem,
  ProductStatus,
  Subcategory,
} from "@/lib/api/contracts";

export function createCategoryLookup(
  categories: Category[],
): Map<string, Category> {
  return new Map(categories.map((category) => [category.id, category]));
}

function badgeByStatus(status: ProductStatus): string | null {
  if (status === "DISCONTINUED") {
    return "Descontinuado";
  }

  return null;
}

function toVariationBadges(product: Product): string[] {
  const labels = [...product.variations]
    .sort((a, b) => a.order - b.order)
    .map((variation) => variation.label)
    .filter(Boolean);

  if (labels.length > 0) {
    return labels;
  }

  const fallbackBadge =
    product.badge !== undefined ? product.badge : badgeByStatus(product.status);

  return fallbackBadge ? [fallbackBadge] : [];
}

export function toProductCardItem(
  product: Product,
  categories: Map<string, Category>,
): ProductCardItem {
  const category = categories.get(product.category_id);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: category?.name ?? "Produto",
    variations: toVariationBadges(product),
    img: product.thumbnail_url,
    href: `/produtos/${product.slug}`,
    status: product.status,
  };
}

export function createSubcategoryLookup(
  subcategories: Subcategory[],
): Map<string, Subcategory> {
  return new Map(subcategories.map((s) => [s.id, s]));
}

export function toCmsProductRow(
  product: Product,
  categories: Map<string, Category>,
  subcategories?: Map<string, Subcategory>,
): CmsProductRow {
  const markets = product.markets as Locale[] | undefined;
  const languages: Locale[] =
    markets && markets.length > 0 ? markets : ["pt-BR"];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    thumbnail_url: product.thumbnail_url,
    category: categories.get(product.category_id)?.name ?? "Categoria",
    subcategory: product.subcategory_id
      ? subcategories?.get(product.subcategory_id)?.name
      : undefined,
    languages,
    status: product.status,
    is_published: product.status === "ACTIVE",
    updated_at: product.updated_at,
  };
}
