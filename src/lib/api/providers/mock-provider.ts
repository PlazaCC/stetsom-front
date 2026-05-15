import type {
  CatalogPagePayload,
  CatalogProductsQuery,
  CmsProductsQuery,
  PaginatedResponse,
  Product,
  ProductDetailPayload,
  ProductStatus,
  SiteAboutPayload,
  SiteHomePayload,
} from '@/lib/api/contracts'
import { createCategoryLookup, toCmsProductRow, toProductCardItem } from '@/lib/api/mappers'
import type { CmsProvider } from '@/lib/api/provider-contract'
import { ADMIN_DASHBOARD_PAYLOAD } from '@/lib/mock/admin-cms'
import {
  CATALOG_CATEGORIES,
  CATALOG_PAGE_PAYLOAD,
  CATALOG_PRODUCT_BLOCKS,
  CATALOG_PRODUCT_FILES,
  CATALOG_PRODUCTS,
  CATALOG_SUBCATEGORIES,
  FEATURED_PRODUCT_SLUGS,
  SPOTLIGHT_PRODUCT_SLUG,
} from '@/lib/mock/catalog'
import {
  HOME_BASES,
  HOME_FAQ_ITEMS,
  HOME_FAQ_SECTION,
  HOME_HERO_SLIDES,
  HOME_HISTORY_SECTION,
  HOME_FEATURED_SECTION,
  HOME_FEATURED_TABS,
  SITE_ABOUT_PAYLOAD_BASE,
  SITE_SOCIAL_SECTION,
} from '@/lib/mock/site'
import { SUPPORT_PAYLOAD } from '@/lib/mock/support'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 12

function clampPage(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PAGE
  }

  return value
}

function clampPageSize(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return DEFAULT_PAGE_SIZE
  }

  return Math.min(value, 100)
}

function normalizeSearch(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, totalPages)
  const offset = (currentPage - 1) * pageSize

  return {
    items: items.slice(offset, offset + pageSize),
    total,
    page: currentPage,
    pageSize,
    totalPages,
  }
}

function filterProducts(query: CatalogProductsQuery): Product[] {
  const q = normalizeSearch(query.q)
  const status = query.status
  const categoryQuery = normalizeSearch(query.category)

  return CATALOG_PRODUCTS.filter((product) => {
    const matchesSearch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.slug.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q)

    const category = CATALOG_CATEGORIES.find((item) => item.id === product.category_id)

    const matchesCategory =
      !categoryQuery || category?.slug.toLowerCase() === categoryQuery || category?.name.toLowerCase() === categoryQuery

    const matchesStatus = !status || status === 'ALL' || product.status === status

    return matchesSearch && matchesCategory && matchesStatus
  })
}

function filterCmsProducts(query: CmsProductsQuery): Product[] {
  const q = normalizeSearch(query.q)
  const status = query.status

  return CATALOG_PRODUCTS.filter((product) => {
    const matchesSearch = !q || product.name.toLowerCase().includes(q) || product.slug.toLowerCase().includes(q)

    const matchesStatus = !status || status === 'ALL' || product.status === status

    return matchesSearch && matchesStatus
  })
}

function getFeaturedProducts() {
  const categoryLookup = createCategoryLookup(CATALOG_CATEGORIES)

  return FEATURED_PRODUCT_SLUGS.map((slug) => CATALOG_PRODUCTS.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product))
    .map((product) => toProductCardItem(product, categoryLookup))
}

function getSpotlightProduct() {
  const categoryLookup = createCategoryLookup(CATALOG_CATEGORIES)
  const spotlight = CATALOG_PRODUCTS.find((product) => product.slug === SPOTLIGHT_PRODUCT_SLUG)

  if (spotlight) {
    return toProductCardItem(spotlight, categoryLookup)
  }

  return toProductCardItem(CATALOG_PRODUCTS[0], categoryLookup)
}

function getRelatedProducts(product: Product) {
  const categoryLookup = createCategoryLookup(CATALOG_CATEGORIES)
  const sameCategory = CATALOG_PRODUCTS.filter(
    (item) => item.id !== product.id && item.category_id === product.category_id && item.status === 'ACTIVE',
  )
  const fallback = CATALOG_PRODUCTS.filter((item) => item.id !== product.id && item.status === 'ACTIVE')
  const selectedProducts: Product[] = []
  const selectedIds = new Set<string>()

  for (const candidate of [...sameCategory, ...fallback]) {
    if (selectedIds.has(candidate.id)) {
      continue
    }

    selectedProducts.push(candidate)
    selectedIds.add(candidate.id)

    if (selectedProducts.length === 4) {
      break
    }
  }

  return selectedProducts.map((candidate) => toProductCardItem(candidate, categoryLookup))
}

function toProductDetailPayload(slug: string): ProductDetailPayload | null {
  const product = CATALOG_PRODUCTS.find((item) => item.slug === slug)

  if (!product) {
    return null
  }

  const category = CATALOG_CATEGORIES.find((item) => item.id === product.category_id)
  const subcategory = CATALOG_SUBCATEGORIES.find((item) => item.id === product.subcategory_id)

  if (!category) {
    return null
  }

  return {
    product,
    blocks: CATALOG_PRODUCT_BLOCKS.filter((item) => item.product_id === product.id).sort((a, b) => a.order - b.order),
    files: CATALOG_PRODUCT_FILES.filter((item) => item.product_id === product.id),
    category,
    subcategory,
    relatedProducts: getRelatedProducts(product),
  }
}

function productStatusCount(status: ProductStatus): number {
  return CATALOG_PRODUCTS.filter((item) => item.status === status).length
}

export function createMockCmsProvider(): CmsProvider {
  return {
    async getCatalogPagePayload(): Promise<CatalogPagePayload> {
      return CATALOG_PAGE_PAYLOAD
    },

    async getCatalogProducts(query) {
      const page = clampPage(query.page)
      const pageSize = clampPageSize(query.pageSize)
      const filtered = filterProducts(query)

      return paginate(filtered, page, pageSize)
    },

    async getCatalogProductDetail(slug) {
      return toProductDetailPayload(slug)
    },

    async getCatalogCategories() {
      return [...CATALOG_CATEGORIES].sort((a, b) => a.order - b.order)
    },

    async getSiteHomePayload(): Promise<SiteHomePayload> {
      return {
        hero: HOME_HERO_SLIDES,
        featuredProducts: getFeaturedProducts(),
        spotlightProduct: getSpotlightProduct(),
        featuredTabs: HOME_FEATURED_TABS,
        featured: HOME_FEATURED_SECTION,
        history: HOME_HISTORY_SECTION,
        bases: HOME_BASES,
        faq: HOME_FAQ_ITEMS,
        faqSection: HOME_FAQ_SECTION,
        social: SITE_SOCIAL_SECTION,
      }
    },

    async getSiteAboutPayload(): Promise<SiteAboutPayload> {
      return {
        ...SITE_ABOUT_PAYLOAD_BASE,
        social: SITE_SOCIAL_SECTION,
      }
    },

    async getSupportPayload() {
      return SUPPORT_PAYLOAD
    },

    async getAdminDashboardPayload() {
      const activeProducts = productStatusCount('ACTIVE')
      const discontinuedProducts = productStatusCount('DISCONTINUED')

      return {
        ...ADMIN_DASHBOARD_PAYLOAD,
        metrics: ADMIN_DASHBOARD_PAYLOAD.metrics.map((metric) => {
          if (metric.id === 'metric-active-products') {
            return { ...metric, value: String(activeProducts) }
          }

          if (metric.id === 'metric-discontinued-products') {
            return { ...metric, value: String(discontinuedProducts) }
          }

          return metric
        }),
      }
    },

    async getCmsProductsPayload(query) {
      const page = clampPage(query.page)
      const pageSize = clampPageSize(query.pageSize)
      const filtered = filterCmsProducts(query)
      const categoryLookup = createCategoryLookup(CATALOG_CATEGORIES)
      const items = filtered.map((product) => toCmsProductRow(product, categoryLookup))

      const paginated = paginate(items, page, pageSize)

      return {
        title: 'CMS de Produtos',
        subtitle: 'Gerencie status, catalogo e atualizacoes do portfolio.',
        ...paginated,
      }
    },
  }
}
