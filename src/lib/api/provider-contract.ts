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

export interface CmsProvider {
  getCatalogPagePayload(): Promise<CatalogPagePayload>
  getCatalogProducts(query: CatalogProductsQuery): Promise<PaginatedResponse<Product>>
  getCatalogProductDetail(slug: string): Promise<ProductDetailPayload | null>
  getCatalogCategories(): Promise<Category[]>
  getSiteHomePayload(): Promise<SiteHomePayload>
  getSiteAboutPayload(): Promise<SiteAboutPayload>
  getSupportPayload(): Promise<SupportPayload>
  getAdminDashboardPayload(): Promise<AdminDashboardPayload>
  getCmsProductsPayload(query: CmsProductsQuery): Promise<CmsProductsPayload>
}
