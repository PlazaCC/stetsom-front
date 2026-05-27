import type {
  AdminUser,
  AuthPayload,
  Banner,
  BannerWithUploads,
  CatalogPagePayload,
  CatalogProductsQuery,
  CmsProductsQuery,
  ContactFormInput,
  CreateAdminUserInput,
  CreateBannerInput,
  CreateCmsProductInput,
  HeroBannerSlide,
  LibraryAssetType,
  Locale,
  LoginCredentials,
  PageId,
  PageSection,
  PageSectionWithUploads,
  PaginatedResponse,
  Product,
  ProductDetailPayload,
  ProductStatus,
  ProductWithUpload,
  SiteAboutPayload,
  SiteHomePayload,
  SupportPayload,
  UpdateAdminUserInput,
  UpdateCmsProductInput,
  UpdatePageSectionInput,
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
  getHomeHistorySection,
  getMilestonePattern,
  getSocialSection,
} from "@/lib/mock/site-i18n";
import { getSupportPayloadForLocale } from "@/lib/mock/support-i18n";

// ── In-memory stores (reset on server restart) ────────────────────────────────
// These allow create/update/delete operations to work end-to-end in mock mode.

const _draftProducts = new Map<string, Product>();
const _mockBanners = [...([] as Banner[])]; // populated lazily from MOCK_CMS_BANNERS
let _mockBannersSeeded = false;
const _mockPageSections = new Map<string, PageSection>(); // keyed by section.id
let _mockCmsConfigDraft: Record<string, unknown> | null = null;
const _mockReadMessages = new Set<string>();

function isoNow(): string {
  return new Date().toISOString();
}

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

/**
 * Maps a Banner to the HeroBannerSlide shape expected by hero carousels.
 * Uses only banners visible for the given locale (ACTIVE status, locale match).
 */
function bannerToHeroSlide(banner: Banner): HeroBannerSlide {
  return {
    id: banner.id,
    desktopImage: banner.desktop_image_url,
    mobileImage: banner.mobile_image_url,
    alt: banner.alt,
    href: banner.link_url ?? banner.href,
    label: banner.label,
    title: banner.title,
  };
}

function getActiveBannersForLocale(
  banners: Banner[],
  locale?: string,
): Banner[] {
  return banners.filter(
    (b) => b.status === "ACTIVE" && (!locale || b.locale === locale),
  );
}

async function resolveSectionData(
  pageId: string,
): Promise<Record<string, Record<string, unknown>>> {
  const { MOCK_PAGE_SECTIONS_BY_PAGE } = await import("@/lib/mock/cms-pages");
  const sections = MOCK_PAGE_SECTIONS_BY_PAGE[pageId] ?? [];
  const resolved = sections.map((s) => _mockPageSections.get(s.id) ?? s);
  const result: Record<string, Record<string, unknown>> = {};
  for (const section of resolved) {
    const slug = section.id.split("~")[1] ?? section.id;
    result[slug] = section.data as Record<string, unknown>;
  }
  return result;
}

function overlay<T extends Record<string, unknown>>(
  base: T,
  overrides: Record<string, unknown>,
): T {
  const result = { ...base };
  for (const key of Object.keys(overrides)) {
    if (overrides[key] !== undefined) {
      (result as Record<string, unknown>)[key] = overrides[key];
    }
  }
  return result;
}

export function createMockCmsProvider(): CmsProvider {
  return {
    async getCatalogPagePayload(locale?: string): Promise<CatalogPagePayload> {
      const base = getCatalogPagePayloadForLocale(locale);
      const sectionData = await resolveSectionData("catalog");

      const heroData = sectionData["catalog-hero"];
      if (heroData) {
        const d = heroData as Record<string, unknown>;
        base.heroLabel = (d.label as string) ?? base.heroLabel;
        base.heroTitle = (d.title as string) ?? base.heroTitle;
        base.heroImage = (d.image as string) ?? base.heroImage;
        base.heroImageAlt = (d.imageAlt as string) ?? base.heroImageAlt;
        base.heroWatermark = (d.watermark as string) ?? base.heroWatermark;
      }

      return base;
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
      const sectionData = await resolveSectionData("home");
      const base: SiteHomePayload = {
        hero: getActiveBannersForLocale(MOCK_CMS_BANNERS, locale)
          .sort((a, b) => a.order - b.order)
          .map(bannerToHeroSlide),
        featuredProducts: getFeaturedProducts(locale),
        spotlightProduct: getSpotlightProduct(locale),
        featuredTabs: getHomeFeaturedTabs(locale),
        featured: getHomeFeaturedSection(locale),
        history: getHomeHistorySection(locale),
        faq: getHomeFaqItems(locale),
        faqSection: getHomeFaqSection(locale),
        social: getSocialSection(locale),
      };

      const pgData = sectionData["featured-products"];
      if (pgData) {
        base.featured = overlay(
          base.featured,
          pgData as Record<string, unknown>,
        );
      }

      const faqData = sectionData["faq"];
      if (faqData) {
        const d = faqData as Record<string, unknown>;
        if (Array.isArray(d.items)) {
          base.faq = d.items as SiteHomePayload["faq"];
        }
        base.faqSection = overlay(base.faqSection, d);
      }

      const socialData = sectionData["social-feed"];
      if (socialData) {
        base.social = overlay(
          base.social,
          socialData as Record<string, unknown>,
        );
      }

      return base;
    },

    async getSiteAboutPayload(locale?: string): Promise<SiteAboutPayload> {
      const sectionData = await resolveSectionData("about");
      const base: SiteAboutPayload = {
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

      const heroData = sectionData["hero"];
      if (heroData) {
        base.hero = overlay(base.hero, heroData);
      }

      const statsData = sectionData["stats"];
      if (statsData) {
        const d = statsData as Record<string, unknown>;
        if (Array.isArray(d.stats)) {
          base.stats = d.stats as SiteAboutPayload["stats"];
        }
      }

      const milestonesData = sectionData["milestones"];
      if (milestonesData) {
        const d = milestonesData as Record<string, unknown>;
        if (Array.isArray(d.items)) {
          base.milestones = d.items as string[];
        }
      }

      const valuesData = sectionData["values"];
      if (valuesData) {
        const d = valuesData as Record<string, unknown>;
        base.quality = overlay(base.quality, d);
        if (Array.isArray(d.values)) {
          base.values = d.values as SiteAboutPayload["values"];
        }
      }

      const timelineData = sectionData["timeline"];
      if (timelineData) {
        const d = timelineData as Record<string, unknown>;
        if (Array.isArray(d.events)) {
          base.timeline = d.events as SiteAboutPayload["timeline"];
        }
      }

      const foundationsData = sectionData["foundations"];
      if (foundationsData) {
        const d = foundationsData as Record<string, unknown>;
        if (Array.isArray(d.bases)) {
          base.bases = d.bases as SiteAboutPayload["bases"];
        }
      }

      return base;
    },

    async getSupportPayload(locale?: string) {
      const base = getSupportPayloadForLocale(locale);
      const sectionData = await resolveSectionData("support");

      const heroData = sectionData["hero"];
      if (heroData) {
        base.hero = overlay(base.hero, heroData as Record<string, unknown>);
      }

      const cardsData = sectionData["support-cards"];
      if (cardsData) {
        const d = cardsData as Record<string, unknown>;
        if (Array.isArray(d.cards)) {
          base.cards = d.cards as SupportPayload["cards"];
        }
      }

      const download = sectionData["download-catalog"];
      if (download) {
        const d = download as Record<string, unknown>;
        if (Array.isArray(d.categories)) {
          base.documentationCategories = (
            d.categories as { id: string; label: string }[]
          ).map((c) => ({ id: c.id, label: c.label }));
        }
      }

      const centers = sectionData["service-centers"];
      if (centers) {
        const d = centers as Record<string, unknown>;
        if (Array.isArray(d.centers)) {
          base.serviceCenters = d.centers as SupportPayload["serviceCenters"];
        }
      }

      const contactCfg = sectionData["contact-config"];
      if (contactCfg) {
        const d = contactCfg as Record<string, unknown>;
        base.contact = overlay(base.contact, d);
      }

      const faqData = sectionData["faq"];
      if (faqData) {
        const d = faqData as Record<string, unknown>;
        base.faq = overlay(
          base.faq as unknown as Record<string, unknown>,
          d,
        ) as unknown as SupportPayload["faq"];
        if (Array.isArray(d.items)) {
          base.faq.items = d.items as SupportPayload["faq"]["items"];
        }
      }

      return base;
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async submitContact(_input: ContactFormInput): Promise<void> {
      await new Promise((r) => setTimeout(r, 600));
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

      // MOCK ONLY: unsigned Base64URL JWT-like token (no signature verification).
      // Use base64url encoding so the mock refresh logic can decode payloads
      // the same way production tokens are handled.
      const header = Buffer.from(
        JSON.stringify({ alg: "HS256", typ: "JWT" }),
      ).toString("base64url");
      const payload = Buffer.from(
        JSON.stringify({
          sub: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 8 * 3600000,
        }),
      ).toString("base64url");
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
      // Mock tokens are plain Base64URL JWTs — validate structure before decode.
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new HttpError(401, "INVALID_TOKEN", "Token inválido.");
      }

      let decoded: { sub: string; email: string; role: string; exp: number };
      try {
        decoded = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf-8"),
        ) as { sub: string; email: string; role: string; exp: number };
      } catch {
        throw new HttpError(401, "INVALID_TOKEN", "Token inválido.");
      }

      // Reject expired tokens so mock behaviour matches production.
      if (typeof decoded.exp === "number" && decoded.exp < Date.now()) {
        throw new HttpError(401, "TOKEN_EXPIRED", "Token expirado.");
      }

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
      ).toString("base64url");
      const payload = Buffer.from(
        JSON.stringify({
          sub: user.id,
          email: user.email,
          role: user.role,
          exp: Date.now() + 8 * 3600_000,
        }),
      ).toString("base64url");
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
      if (!_mockBannersSeeded) {
        _mockBanners.push(...MOCK_CMS_BANNERS);
        _mockBannersSeeded = true;
      }
      return {
        items: [..._mockBanners],
        total: _mockBanners.length,
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
      if (_mockCmsConfigDraft) {
        return { ...MOCK_CMS_CONFIG, ..._mockCmsConfigDraft };
      }
      return { ...MOCK_CMS_CONFIG };
    },

    // ── Products (Write) ──────────────────────────────────────────────────────

    async createCmsProduct(
      input: CreateCmsProductInput,
    ): Promise<ProductWithUpload> {
      const id = `prod-draft-${Date.now()}`;
      const now = isoNow();
      const product: Product = {
        id,
        name: input.name,
        slug: input.slug,
        category_id: input.category_id,
        subcategory_id: input.subcategory_id,
        status: input.status,
        badge: input.badge ?? null,
        description: input.description,
        thumbnail_url: "/placeholder.png",
        video_url: input.video_url ?? undefined,
        launch_date: input.launch_date,
        variations: input.variations.map((v, i) => ({
          ...v,
          id: `var-${id}-${i}`,
        })),
        highlight_attributes: input.highlight_attributes,
        created_at: now,
        updated_at: now,
        created_by: "mock-user",
      };
      _draftProducts.set(id, product);
      const result = { id, slug: input.slug, status: input.status };
      return {
        ...result,
        uploads: {
          thumbnail: result.id
            ? { uploadUrl: "", method: "PUT", headers: {} }
            : undefined,
        },
      };
    },

    async updateCmsProduct(
      id: string,
      input: UpdateCmsProductInput,
    ): Promise<ProductWithUpload> {
      // Look in draft store first, then fall back to static catalog
      const existing =
        _draftProducts.get(id) ?? CATALOG_PRODUCTS.find((p) => p.id === id);
      if (!existing) {
        throw new HttpError(404, "NOT_FOUND", `Produto ${id} não encontrado.`);
      }
      const updated: Product = {
        ...existing,
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.category_id !== undefined && {
          category_id: input.category_id,
        }),
        ...(input.subcategory_id !== undefined && {
          subcategory_id: input.subcategory_id,
        }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.badge !== undefined && { badge: input.badge }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.thumbnail !== undefined && {
          thumbnail_url: "/placeholder.png",
        }),
        ...(input.video_url !== undefined && {
          video_url: input.video_url ?? undefined,
        }),
        ...(input.launch_date !== undefined && {
          launch_date: input.launch_date,
        }),
        ...(input.variations !== undefined && {
          variations: input.variations.map((v, i) => ({
            ...v,
            id: `var-${id}-${i}`,
          })),
        }),
        ...(input.highlight_attributes !== undefined && {
          highlight_attributes: input.highlight_attributes,
        }),
        updated_at: isoNow(),
      };
      _draftProducts.set(id, updated);
      return {
        id,
        slug: updated.slug,
        status: updated.status,
        uploads: { thumbnail: { uploadUrl: "", method: "PUT", headers: {} } },
      };
    },

    async deleteCmsProduct(id: string): Promise<void> {
      _draftProducts.delete(id);
      // For static catalog products in mock, deletion is a no-op (no persistent store)
    },

    // ── Banners (Write) ───────────────────────────────────────────────────────

    async createBanner(input: CreateBannerInput): Promise<BannerWithUploads> {
      if (!_mockBannersSeeded) {
        _mockBanners.push(...MOCK_CMS_BANNERS);
        _mockBannersSeeded = true;
      }
      const now = isoNow();
      const banner: Banner = {
        id: `banner-${Date.now()}`,
        name: input.name,
        desktop_image_url: "/placeholder-desktop.png",
        mobile_image_url: input.mobile_image
          ? "/placeholder-mobile.png"
          : undefined,
        alt: input.alt,
        href: input.href,
        label: input.label,
        title: input.title,
        link_url: input.link_url,
        status: input.status,
        locale: input.locale,
        display_from: input.display_from,
        display_until: input.display_until,
        order: input.order ?? _mockBanners.length + 1,
        product_id: input.product_id,
        created_at: now,
        updated_at: now,
        created_by: "mock-user",
      };
      _mockBanners.push(banner);
      return {
        banner,
        uploads: {
          desktop: { uploadUrl: "", method: "PUT", headers: {} },
          mobile: { uploadUrl: "", method: "PUT", headers: {} },
        },
      };
    },

    async updateBanner(
      id: string,
      input: Partial<CreateBannerInput>,
    ): Promise<BannerWithUploads> {
      if (!_mockBannersSeeded) {
        _mockBanners.push(...MOCK_CMS_BANNERS);
        _mockBannersSeeded = true;
      }
      const index = _mockBanners.findIndex((b) => b.id === id);
      if (index === -1) {
        throw new HttpError(404, "NOT_FOUND", `Banner ${id} não encontrado.`);
      }
      const updated: Banner = {
        ..._mockBanners[index],
        ...(input.name !== undefined && { name: input.name }),
        ...(input.product_id !== undefined && { product_id: input.product_id }),
        ...(input.alt !== undefined && { alt: input.alt }),
        ...(input.href !== undefined && { href: input.href }),
        ...(input.label !== undefined && { label: input.label }),
        ...(input.title !== undefined && { title: input.title }),
        ...(input.link_url !== undefined && { link_url: input.link_url }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.locale !== undefined && { locale: input.locale }),
        ...(input.display_from !== undefined && {
          display_from: input.display_from,
        }),
        ...(input.display_until !== undefined && {
          display_until: input.display_until,
        }),
        ...(input.order !== undefined && { order: input.order }),
        ...(input.desktop_image !== undefined && {
          desktop_image_url: "/placeholder-desktop.png",
        }),
        ...(input.mobile_image !== undefined
          ? { mobile_image_url: "/placeholder-mobile.png" }
          : {}),
        updated_at: isoNow(),
      };
      _mockBanners[index] = updated;
      return {
        banner: updated,
        uploads: {
          desktop: { uploadUrl: "", method: "PUT", headers: {} },
          mobile: { uploadUrl: "", method: "PUT", headers: {} },
        },
      };
    },

    async deleteBanner(id: string): Promise<void> {
      if (!_mockBannersSeeded) {
        _mockBanners.push(...MOCK_CMS_BANNERS);
        _mockBannersSeeded = true;
      }
      const index = _mockBanners.findIndex((b) => b.id === id);
      if (index === -1) return;
      _mockBanners.splice(index, 1);
    },

    // ── Messages ──────────────────────────────────────────────────────────────

    async markMessageRead(id: string, isRead: boolean): Promise<void> {
      if (isRead) {
        _mockReadMessages.add(id);
      } else {
        _mockReadMessages.delete(id);
      }
    },

    // ── Config (Write) ────────────────────────────────────────────────────────

    async updateCmsConfig(input) {
      _mockCmsConfigDraft = { ...(_mockCmsConfigDraft ?? {}), ...input };
      return {
        ...MOCK_CMS_CONFIG,
        ..._mockCmsConfigDraft,
        updated_at: isoNow(),
      };
    },

    // ── Pages (Institutional) ─────────────────────────────────────────────────

    async getAdminPages() {
      const { MOCK_ADMIN_PAGES } = await import("@/lib/mock/cms-pages");
      return MOCK_ADMIN_PAGES;
    },

    async getAdminPageSections(pageId: PageId) {
      const { MOCK_PAGE_SECTIONS_BY_PAGE } =
        await import("@/lib/mock/cms-pages");
      const sections = MOCK_PAGE_SECTIONS_BY_PAGE[pageId] ?? [];
      // Apply any in-memory edits
      const resolved = sections.map((s) => _mockPageSections.get(s.id) ?? s);
      return {
        page_id: pageId,
        label: {
          home: "Página Inicial",
          catalog: "Catálogo",
          about: "Sobre Nós",
          support: "Suporte",
        }[pageId],
        sections: resolved,
      };
    },

    async updatePageSection(
      sectionId: string,
      input: UpdatePageSectionInput,
    ): Promise<PageSectionWithUploads> {
      const { MOCK_ALL_PAGE_SECTIONS } = await import("@/lib/mock/cms-pages");
      const base =
        _mockPageSections.get(sectionId) ??
        MOCK_ALL_PAGE_SECTIONS.find((s) => s.id === sectionId);
      if (!base) {
        throw new HttpError(
          404,
          "NOT_FOUND",
          `Section ${sectionId} not found.`,
        );
      }
      if (!base.is_editable) {
        throw new HttpError(
          403,
          "FORBIDDEN",
          `Section "${base.name}" is structural and cannot be edited.`,
        );
      }
      const updated: PageSection = {
        ...base,
        data: input.data,
        updated_at: isoNow(),
      };
      _mockPageSections.set(sectionId, updated);
      return { section: updated };
    },
  };
}
