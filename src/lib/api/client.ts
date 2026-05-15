import type {
  AdminDashboardPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsProductsPayload,
  CmsProductsQuery,
  PaginatedResponse,
  Product,
} from '@/lib/api/contracts'
import { INTERNAL_API_ENDPOINTS } from '@/lib/api/endpoints'
import { buildSearchParams } from '@/lib/api/query-utils'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

export async function fetchCatalogCategories() {
  return fetchJson<Category[]>(INTERNAL_API_ENDPOINTS.catalogCategories)
}

export async function fetchCatalogPage() {
  return fetchJson<CatalogPagePayload>(INTERNAL_API_ENDPOINTS.catalogPage)
}

export async function fetchCatalogProducts(query: CatalogProductsQuery) {
  const suffix = buildSearchParams({
    q: query.q,
    category: query.category,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  })

  return fetchJson<PaginatedResponse<Product>>(`${INTERNAL_API_ENDPOINTS.catalogProducts}${suffix}`)
}

export async function fetchCmsProducts(query: CmsProductsQuery) {
  const suffix = buildSearchParams({
    q: query.q,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  })

  return fetchJson<CmsProductsPayload>(`${INTERNAL_API_ENDPOINTS.cmsProducts}${suffix}`)
}

export async function fetchAdminDashboard() {
  return fetchJson<AdminDashboardPayload>(INTERNAL_API_ENDPOINTS.adminDashboard)
}
