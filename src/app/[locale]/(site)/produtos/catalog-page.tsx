import { getApiProducts } from "@/api/stetsom/server/products-public/products-public";
import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { toApiLocale } from "@/i18n/locale";
import { getLocale } from "next-intl/server";
import { permanentRedirect } from "next/navigation";
import { getPublicCatalogCategories } from "@/lib/catalog/public-categories";
import {
  localizedTaxonomySlug,
  resolveLocalizedTaxonomy,
} from "@/lib/catalog/taxonomy";
import { CatalogContent } from "./_components/catalog-content";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CatalogLineCardData } from "./_components/catalog-lines-grid";

const PAGE_SIZE = 24;

const EMPTY_CATALOG: ProductCatalogResponse = {
  items: [],
  total: 0,
  page: 1,
  pageSize: PAGE_SIZE,
  totalPages: 0,
};

type CatalogSearchParams = {
  q?: string;
  sort?: string;
  page?: string;
  discontinued?: string;
  export?: string;
};

export const getCatalogCategories = getPublicCatalogCategories;

function withCatalogSearchParams(
  pathname: string,
  searchParams: CatalogSearchParams,
) {
  const query = new URLSearchParams();
  for (const key of ["q", "sort", "page", "discontinued", "export"] as const) {
    const value = searchParams[key];
    if (value !== undefined) query.set(key, value);
  }
  const serialized = query.toString();
  return serialized ? `${pathname}?${serialized}` : pathname;
}

async function lineCardsFor(
  categories: PublicCategory[],
  categorySlug: string,
): Promise<{
  allProductsCoverUrl: string | null;
  lines: CatalogLineCardData[];
}> {
  const category = categories.find((item) => item.slug === categorySlug);
  if (!category) return { allProductsCoverUrl: null, lines: [] };

  return {
    allProductsCoverUrl: category.all_products_cover_url,
    lines: [...category.lines]
      .sort((a, b) => a.order - b.order)
      .map((line) => ({
        line_id: line.line_id,
        name: line.name,
        slug: line.slug,
        cover_url: line.cover_url,
      })),
  };
}

export async function renderCatalogPage({
  category,
  line,
  all = false,
  searchParams,
}: {
  category?: string;
  line?: string;
  all?: boolean;
  searchParams: CatalogSearchParams;
}) {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);
  const q = searchParams.q?.trim() || undefined;
  const sort = searchParams.sort === "newest" ? "newest" : undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);
  const include_discontinued = searchParams.discontinued === "1";
  const is_export = searchParams.export === "1" ? true : undefined;
  let categories: PublicCategory[];
  try {
    categories = await getCatalogCategories(apiLocale);
  } catch (error) {
    console.error("Failed to fetch public catalog categories", error);
    if (category) throw error;
    categories = [];
  }
  const resolvedTaxonomy = category
    ? resolveLocalizedTaxonomy(categories, category, line, locale as Locale)
    : null;
  const selectedCategory = resolvedTaxonomy?.category;
  const selectedLine = resolvedTaxonomy?.line;

  if (
    category &&
    selectedCategory &&
    (localizedTaxonomySlug(
      selectedCategory.localized_slugs,
      locale as Locale,
    ) !== category ||
      (line &&
        (!selectedLine ||
          localizedTaxonomySlug(
            selectedLine.localized_slugs,
            locale as Locale,
          ) !== line)))
  ) {
    const canonicalHref = selectedLine
      ? getPathname({
          locale,
          href: {
            pathname: "/produtos/[category]/[line]",
            params: {
              category: localizedTaxonomySlug(
                selectedCategory.localized_slugs,
                locale as Locale,
              ),
              line: localizedTaxonomySlug(
                selectedLine.localized_slugs,
                locale as Locale,
              ),
            },
          },
        })
      : getPathname({
          locale,
          href: all
            ? {
                pathname: "/produtos/[category]/produtos",
                params: {
                  category: localizedTaxonomySlug(
                    selectedCategory.localized_slugs,
                    locale as Locale,
                  ),
                },
              }
            : {
                pathname: "/produtos/[category]",
                params: {
                  category: localizedTaxonomySlug(
                    selectedCategory.localized_slugs,
                    locale as Locale,
                  ),
                },
              },
        });
    permanentRedirect(withCatalogSearchParams(canonicalHref, searchParams));
  }

  if (category && !selectedCategory) {
    return null;
  }

  if (category && line && !selectedLine) {
    return null;
  }

  // Uma busca ou um filtro ligado pula a etapa das linhas, para o resultado
  // não ficar escondido atrás dos cards.
  const hasRefinement =
    Boolean(q) ||
    searchParams.discontinued === "1" ||
    searchParams.export === "1";
  if (
    category &&
    !line &&
    !all &&
    !hasRefinement &&
    (selectedCategory?.lines.length ?? 0) > 0
  ) {
    return (
      <CatalogContent
        categories={categories}
        catalog={EMPTY_CATALOG}
        lineCards={await lineCardsFor(categories, category)}
      />
    );
  }

  const catalog = await getApiProducts({
    q,
    category,
    line,
    sort,
    include_discontinued,
    is_export,
    page,
    pageSize: PAGE_SIZE,
    locale: apiLocale,
  }).catch((error) => {
    console.error("Failed to fetch public catalog products", error);
    return {
      items: [],
      total: 0,
      page,
      pageSize: PAGE_SIZE,
      totalPages: 0,
    } satisfies ProductCatalogResponse;
  });

  return (
    <CatalogContent
      categories={categories}
      catalog={catalog}
      lineCards={null}
    />
  );
}

export type { CatalogSearchParams };
