import type {
  AdminDashboardPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsProductsPayload,
  CmsProductsQuery,
  PaginatedResponse,
  Product,
  ProductDetailPayload,
  SiteAboutPayload,
  SiteHomePayload,
  SupportPayload,
} from '@/lib/api/contracts'
import type { CmsProvider } from '@/lib/api/provider-contract'

const DEFAULT_REMOTE_BASE = 'http://localhost:3333'

function buildSearchParams(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return
    }

    search.set(key, String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

async function fetchJson<T>(baseUrl: string, path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Remote provider request failed (${response.status}): ${body}`)
  }

  return (await response.json()) as T
}

export function createRemoteCmsProvider(): CmsProvider {
  const remoteBaseUrl = process.env.CMS_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_REMOTE_BASE

  return {
    async getCatalogPagePayload() {
      return fetchJson<CatalogPagePayload>(remoteBaseUrl, '/catalog/page')
    },

    async getCatalogProducts(query: CatalogProductsQuery) {
      const suffix = buildSearchParams({
        q: query.q,
        category: query.category,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      })

      return fetchJson<PaginatedResponse<Product>>(remoteBaseUrl, `/catalog/products${suffix}`)
    },

    async getCatalogProductDetail(slug: string) {
      return fetchJson<ProductDetailPayload>(remoteBaseUrl, `/catalog/products/${slug}`)
    },

    async getCatalogCategories() {
      return fetchJson<Category[]>(remoteBaseUrl, '/catalog/categories')
    },

    async getSiteHomePayload() {
      return fetchJson<SiteHomePayload>(remoteBaseUrl, '/site/home')
    },

    async getSiteAboutPayload() {
      return fetchJson<SiteAboutPayload>(remoteBaseUrl, '/site/about')
    },

    async getSupportPayload() {
      return fetchJson<SupportPayload>(remoteBaseUrl, '/support')
    },

    async getAdminDashboardPayload() {
      return fetchJson<AdminDashboardPayload>(remoteBaseUrl, '/admin/dashboard')
    },

    async getCmsProductsPayload(query: CmsProductsQuery) {
      const suffix = buildSearchParams({
        q: query.q,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      })

      return fetchJson<CmsProductsPayload>(remoteBaseUrl, `/cms/products${suffix}`)
    },
  }
}
