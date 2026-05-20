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

function toPowerSpec(product: Product): string {
  const power = product.specifications.power_rms;

  if (typeof power === "string" || typeof power === "number") {
    return String(power);
  }

  return "Especificacao em breve";
}

function badgeByStatus(status: ProductStatus): string | null {
  if (status === "DISCONTINUED") {
    return "Descontinuado";
  }

  return null;
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
    spec: toPowerSpec(product),
    badge:
      product.badge !== undefined
        ? product.badge
        : badgeByStatus(product.status),
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
