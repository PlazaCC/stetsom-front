import type {
  AdminUser,
  AuthPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  CmsProductsQuery,
  CreateAdminUserInput,
  LibraryAssetType,
  Locale,
  LoginCredentials,
  PaginatedResponse,
  Product,
  ProductDetailPayload,
  ProductStatus,
  SiteAboutPayload,
  SiteHomePayload,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";
import {
  createCategoryLookup,
  createSubcategoryLookup,
  toCmsProductRow,
  toProductCardItem,
} from "@/lib/api/mappers";
import type { CmsProvider } from "@/lib/api/provider-contract";
import { HttpError } from "@/lib/api/route-utils";
import {
  ADMIN_DASHBOARD_PAYLOAD,
  buildCmsProductDetail,
} from "@/lib/mock/admin-cms";
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCT_FILES,
  CATALOG_PRODUCTS,
  FEATURED_PRODUCT_SLUGS,
  getCatalogPagePayloadForLocale,
  SPOTLIGHT_PRODUCT_SLUG,
} from "@/lib/mock/catalog";
import {
  getCatalogBlocksForLocale,
  getCatalogCategoriesForLocale,
  getCatalogProductsForLocale,
  getCatalogSubcategoriesForLocale,
} from "@/lib/mock/catalog-i18n";
import { MOCK_CMS_AUDIT_LOG } from "@/lib/mock/cms-audit";
import { MOCK_CMS_BANNERS } from "@/lib/mock/cms-banners";
import { MOCK_CMS_CONFIG } from "@/lib/mock/cms-config";
import { MOCK_CMS_LIBRARY_ASSETS } from "@/lib/mock/cms-library";
import { MOCK_CMS_MESSAGES } from "@/lib/mock/cms-messages";
import { MOCK_ADMIN_USERS, MOCK_AUTH_PASSWORD } from "@/lib/mock/cms-users";
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
      const categories = getCatalogCategoriesForLocale(locale);
      const categoryLookup = createCategoryLookup(categories);
      const cards = filtered.map((product) =>
        toProductCardItem(product, categoryLookup),
      );

      return paginate(cards, page, pageSize);
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

    async getCatalogSubcategories(locale?: string) {
      return getCatalogSubcategoriesForLocale(locale).sort(
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
      const subcatLookup = createSubcategoryLookup(
        getCatalogSubcategoriesForLocale(),
      );
      const items = filtered.map((product) =>
        toCmsProductRow(product, categoryLookup, subcatLookup),
      );

      const paginated = paginate(items, page, pageSize);

      // Admin CMS strings are not part of the public i18n system — admin has no locale routing.
      return {
        title: "CMS de Produtos",
        subtitle: "Gerencie status, catalogo e atualizacoes do portfolio.",
        ...paginated,
      };
    },

    async login(credentials: LoginCredentials) {
      const user = MOCK_ADMIN_USERS.find((u) => u.email === credentials.email);

      // MOCK ONLY: plaintext comparison — backend will use bcrypt.compare()
      if (!user || credentials.password !== MOCK_AUTH_PASSWORD) {
        throw new HttpError(
          401,
          "INVALID_CREDENTIALS",
          "Email ou senha incorretos.",
        );
      }

      // MOCK ONLY: unsigned, non-URL-safe base64 token.
      // Uses standard base64 (may contain +/=/), not base64url.
      // proxy.ts validates only the 3-part structure (split(".").length === 3),
      // so this works in mock but do not attempt to decode parts as base64url.
      // Backend will use jose with HMAC-SHA256 and proper base64url encoding.
      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" }),
      ).toString("base64");
      const payload = Buffer.from(
        JSON.stringify({
          sub: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 8 * 3600000,
        }),
      ).toString("base64");
      const token = `${header}.${payload}.mock-signature`;
      const refreshToken = `${header}.${payload}.mock-refresh-signature`;

      return {
        accessToken: token,
        refreshToken,
      };
    },

    async logout() {
      // No-op for mock — cookie is cleared by the API route
    },

    async refreshToken(token: string): Promise<AuthPayload> {
      const decoded = JSON.parse(
        Buffer.from(token.split(".")[1]!, "base64").toString(),
      ) as { sub: string; email: string; role: string; exp: number };

      const user = MOCK_ADMIN_USERS.find((u) => u.id === decoded.sub);
      if (!user) {
        throw new HttpError(
          401,
          "INVALID_TOKEN",
          "Token inválido ou expirado.",
        );
      }

      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" }),
      ).toString("base64");
      const payload = Buffer.from(
        JSON.stringify({
          sub: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 8 * 3600000,
        }),
      ).toString("base64");
      const newAccessToken = `${header}.${payload}.mock-signature`;

      return { accessToken: newAccessToken, refreshToken: token };
    },

    async getAdminUsers() {
      return {
        items: [...MOCK_ADMIN_USERS],
        total: MOCK_ADMIN_USERS.length,
      };
    },

    async createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
      const now = new Date().toISOString();
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        name: input.name,
        email: input.email,
        role: input.role,
        is_active: true,
        created_at: now,
        updated_at: now,
      };

      MOCK_ADMIN_USERS.push(newUser);
      return newUser;
    },

    async updateAdminUser(
      id: string,
      input: UpdateAdminUserInput,
    ): Promise<AdminUser> {
      const index = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);

      if (index === -1) {
        throw new HttpError(
          404,
          "USER_NOT_FOUND",
          `Usuário ${id} não encontrado.`,
        );
      }

      const updated: AdminUser = {
        ...MOCK_ADMIN_USERS[index],
        ...(input.name !== undefined && { name: input.name }),
        ...(input.role !== undefined && { role: input.role }),
        ...(input.is_active !== undefined && { is_active: input.is_active }),
        updated_at: new Date().toISOString(),
      };

      MOCK_ADMIN_USERS[index] = updated;
      return updated;
    },

    async getCmsProductDetail(id: string) {
      return buildCmsProductDetail(id);
    },

    async getBanners() {
      return {
        items: [...MOCK_CMS_BANNERS],
        total: MOCK_CMS_BANNERS.length,
      };
    },

    async getLibraryAssets(params?: { type?: LibraryAssetType }) {
      const items = !params?.type
        ? [...MOCK_CMS_LIBRARY_ASSETS]
        : MOCK_CMS_LIBRARY_ASSETS.filter((a) => a.type === params.type);

      return {
        items,
        total: items.length,
      };
    },

    async getContactMessages() {
      return {
        items: [...MOCK_CMS_MESSAGES],
        total: MOCK_CMS_MESSAGES.length,
      };
    },

    async getAuditLog() {
      return {
        items: [...MOCK_CMS_AUDIT_LOG],
        total: MOCK_CMS_AUDIT_LOG.length,
      };
    },

    async getCmsConfig() {
      return { ...MOCK_CMS_CONFIG };
    },
  };
}
