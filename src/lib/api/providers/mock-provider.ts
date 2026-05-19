import type {
  CatalogPagePayload,
  CatalogProductsQuery,
  CmsProductsQuery,
  Locale,
  PaginatedResponse,
  Product,
  ProductDetailPayload,
  ProductStatus,
  SiteAboutPayload,
  SiteHomePayload,
} from "@/lib/api/contracts";
import {
  createCategoryLookup,
  toCmsProductRow,
  toProductCardItem,
} from "@/lib/api/mappers";
import type { CmsProvider } from "@/lib/api/provider-contract";
import { ADMIN_DASHBOARD_PAYLOAD } from "@/lib/mock/admin-cms";
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCT_FILES,
  CATALOG_PRODUCTS,
  FEATURED_PRODUCT_SLUGS,
  SPOTLIGHT_PRODUCT_SLUG,
  getCatalogPagePayloadForLocale,
} from "@/lib/mock/catalog";
import {
  getCatalogBlocksForLocale,
  getCatalogCategoriesForLocale,
  getCatalogProductsForLocale,
  getCatalogSubcategoriesForLocale,
} from "@/lib/mock/catalog-i18n";
import {
  getAboutBases,
  getAboutHeroSection,
  getAboutJobsCta,
  getAboutQualitySection,
  getAboutTimeline,
  getAboutValues,
  getCompanyStats,
  getHomeFaqItems,
  getHomeFaqSection,
  getHomeFeaturedSection,
  getHomeFeaturedTabs,
  getHomeHeroSlides,
  getHomeHistorySection,
  getMilestonePattern,
  getSocialSection,
} from "@/lib/mock/site-i18n";
import { getSupportPayloadForLocale } from "@/lib/mock/support-i18n";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;

function clampPage(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PAGE;
  }

  return value;
}

function clampPageSize(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(value, 100);
}

function normalizeSearch(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedResponse<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * pageSize;

  return {
    items: items.slice(offset, offset + pageSize),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  };
}

function isLocale(v: string): v is Locale {
  return v === "pt-BR" || v === "en" || v === "es";
}

function isVisibleInLocale(product: Product, locale?: string): boolean {
  if (!locale || !product.markets) return true;
  if (!isLocale(locale)) return true;
  return product.markets.includes(locale);
}

function filterProducts(
  products: Product[],
  query: CatalogProductsQuery,
  locale?: string,
): Product[] {
  const q = normalizeSearch(query.q);
  const status = query.status;
  const categoryQuery = normalizeSearch(query.category);

  return products.filter((product) => {
    const matchesLocale = isVisibleInLocale(product, locale);

    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.slug.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q);

    const category = CATALOG_CATEGORIES.find(
      (item) => item.id === product.category_id,
    );

    const matchesCategory =
      !categoryQuery || category?.slug.toLowerCase() === categoryQuery;

    const matchesStatus =
      !status || status === "ALL" || product.status === status;

    return matchesLocale && matchesSearch && matchesCategory && matchesStatus;
  });
}

function filterCmsProducts(query: CmsProductsQuery): Product[] {
  const q = normalizeSearch(query.q);
  const status = query.status;

  return CATALOG_PRODUCTS.filter((product) => {
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.slug.toLowerCase().includes(q);

    const matchesStatus =
      !status || status === "ALL" || product.status === status;

    return matchesSearch && matchesStatus;
  });
}

function getFeaturedProducts(locale?: string) {
  const products = getCatalogProductsForLocale(locale);
  const categories = getCatalogCategoriesForLocale(locale);
  const categoryLookup = createCategoryLookup(categories);

  return FEATURED_PRODUCT_SLUGS.map((slug) =>
    products.find((product) => product.slug === slug),
  )
    .filter((product): product is Product => Boolean(product))
    .map((product) => toProductCardItem(product, categoryLookup));
}

function getSpotlightProduct(locale?: string) {
  const products = getCatalogProductsForLocale(locale);
  const categories = getCatalogCategoriesForLocale(locale);
  const categoryLookup = createCategoryLookup(categories);
  const spotlight = products.find(
    (product) => product.slug === SPOTLIGHT_PRODUCT_SLUG,
  );

  if (spotlight) {
    return toProductCardItem(spotlight, categoryLookup);
  }

  return toProductCardItem(products[0], categoryLookup);
}

function getRelatedProducts(product: Product, locale?: string) {
  const products = getCatalogProductsForLocale(locale);
  const categories = getCatalogCategoriesForLocale(locale);
  const categoryLookup = createCategoryLookup(categories);
  const sameCategory = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category_id === product.category_id &&
      item.status === "ACTIVE",
  );
  const fallback = products.filter(
    (item) => item.id !== product.id && item.status === "ACTIVE",
  );
  const selectedProducts: Product[] = [];
  const selectedIds = new Set<string>();

  for (const candidate of [...sameCategory, ...fallback]) {
    if (selectedIds.has(candidate.id)) {
      continue;
    }

    selectedProducts.push(candidate);
    selectedIds.add(candidate.id);

    if (selectedProducts.length === 4) {
      break;
    }
  }

  return selectedProducts.map((candidate) =>
    toProductCardItem(candidate, categoryLookup),
  );
}

function toProductDetailPayload(
  slug: string,
  locale?: string,
): ProductDetailPayload | null {
  const products = getCatalogProductsForLocale(locale);
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return null;
  }

  const categories = getCatalogCategoriesForLocale(locale);
  const subcategories = getCatalogSubcategoriesForLocale(locale);
  const blocks = getCatalogBlocksForLocale(locale);

  const category = categories.find((item) => item.id === product.category_id);
  const subcategory = subcategories.find(
    (item) => item.id === product.subcategory_id,
  );

  if (!category) {
    return null;
  }

  return {
    product,
    blocks: blocks
      .filter((item) => item.product_id === product.id)
      .sort((a, b) => a.order - b.order),
    files: CATALOG_PRODUCT_FILES.filter(
      (item) => item.product_id === product.id,
    ),
    category,
    subcategory,
    relatedProducts: getRelatedProducts(product, locale),
  };
}

function productStatusCount(status: ProductStatus): number {
  return CATALOG_PRODUCTS.filter((item) => item.status === status).length;
}

export function createMockCmsProvider(): CmsProvider {
  return {
    async getCatalogPagePayload(locale?: string): Promise<CatalogPagePayload> {
      return getCatalogPagePayloadForLocale(locale);
    },

    async getCatalogProducts(query, locale) {
      const page = clampPage(query.page);
      const pageSize = clampPageSize(query.pageSize);
      const products = getCatalogProductsForLocale(locale);
      const filtered = filterProducts(products, query, locale);

      return paginate(filtered, page, pageSize);
    },

    async getCatalogProductDetail(slug, locale) {
      const payload = toProductDetailPayload(slug, locale);
      if (!payload) return null;
      if (!isVisibleInLocale(payload.product, locale)) return null;
      return payload;
    },

    async getCatalogCategories(locale?: string) {
      return getCatalogCategoriesForLocale(locale).sort(
        (a, b) => a.order - b.order,
      );
    },

    async getSiteHomePayload(locale?: string): Promise<SiteHomePayload> {
      return {
        hero: getHomeHeroSlides(locale),
        featuredProducts: getFeaturedProducts(locale),
        spotlightProduct: getSpotlightProduct(locale),
        featuredTabs: getHomeFeaturedTabs(locale),
        featured: getHomeFeaturedSection(locale),
        history: getHomeHistorySection(locale),
        faq: getHomeFaqItems(locale),
        faqSection: getHomeFaqSection(locale),
        social: getSocialSection(locale),
      };
    },

    async getSiteAboutPayload(locale?: string): Promise<SiteAboutPayload> {
      return {
        hero: getAboutHeroSection(locale),
        stats: getCompanyStats(locale),
        milestones: getMilestonePattern(locale),
        quality: getAboutQualitySection(locale),
        values: getAboutValues(locale),
        bases: getAboutBases(locale),
        timeline: getAboutTimeline(locale),
        jobsCta: getAboutJobsCta(locale),
        social: getSocialSection(locale),
      };
    },

    async getSupportPayload(locale?: string) {
      return getSupportPayloadForLocale(locale);
    },

    async getAdminDashboardPayload() {
      const activeProducts = productStatusCount("ACTIVE");
      const discontinuedProducts = productStatusCount("DISCONTINUED");

      return {
        ...ADMIN_DASHBOARD_PAYLOAD,
        metrics: ADMIN_DASHBOARD_PAYLOAD.metrics.map((metric) => {
          if (metric.id === "metric-active-products") {
            return { ...metric, value: String(activeProducts) };
          }

          if (metric.id === "metric-discontinued-products") {
            return { ...metric, value: String(discontinuedProducts) };
          }

          return metric;
        }),
      };
    },

    async getCmsProductsPayload(query) {
      const page = clampPage(query.page);
      const pageSize = clampPageSize(query.pageSize);
      const filtered = filterCmsProducts(query);
      const categoryLookup = createCategoryLookup(CATALOG_CATEGORIES);
      const items = filtered.map((product) =>
        toCmsProductRow(product, categoryLookup),
      );

      const paginated = paginate(items, page, pageSize);

      // Admin CMS strings are not part of the public i18n system — admin has no locale routing.
      return {
        title: "CMS de Produtos",
        subtitle: "Gerencie status, catalogo e atualizacoes do portfolio.",
        ...paginated,
      };
    },
  };
}
