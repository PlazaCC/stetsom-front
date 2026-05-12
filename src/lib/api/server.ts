import type { CatalogProductsQuery, CmsProductsQuery, ProductStatus } from '@/lib/api/contracts'
import { getCmsProvider } from '@/lib/api/provider'

function normalizePage(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return 1
  }

  return value
}

function normalizePageSize(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return 12
  }

  return Math.min(value, 100)
}

function normalizeStatus(value: ProductStatus | 'ALL' | undefined): ProductStatus | 'ALL' | undefined {
  if (!value) {
    return undefined
  }

  if (value === 'ACTIVE' || value === 'DISCONTINUED' || value === 'ALL') {
    return value
  }

  return undefined
}

export async function getCatalogProducts(query: CatalogProductsQuery) {
  return getCmsProvider().getCatalogProducts({
    ...query,
    status: normalizeStatus(query.status),
    page: normalizePage(query.page),
    pageSize: normalizePageSize(query.pageSize),
  })
}

export async function getCatalogPagePayload() {
  return getCmsProvider().getCatalogPagePayload()
}

export async function getCatalogProductDetail(slug: string) {
  return getCmsProvider().getCatalogProductDetail(slug)
}

export async function getCatalogCategories() {
  return getCmsProvider().getCatalogCategories()
}

export async function getSiteHomePayload() {
  return getCmsProvider().getSiteHomePayload()
}

export async function getSiteAboutPayload() {
  return getCmsProvider().getSiteAboutPayload()
}

export async function getSupportPayload() {
  return getCmsProvider().getSupportPayload()
}

export async function getAdminDashboardPayload() {
  return getCmsProvider().getAdminDashboardPayload()
}

export async function getCmsProductsPayload(query: CmsProductsQuery) {
  return getCmsProvider().getCmsProductsPayload({
    ...query,
    status: normalizeStatus(query.status),
    page: normalizePage(query.page),
    pageSize: normalizePageSize(query.pageSize),
  })
}
