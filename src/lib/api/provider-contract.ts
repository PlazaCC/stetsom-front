import type {
  AdminDashboardPayload,
  AdminUser,
  AdminUsersPayload,
  AuditEntry,
  AuthPayload,
  Banner,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsConfig,
  CmsProductDetailPayload,
  CmsProductsPayload,
  CmsProductsQuery,
  ContactMessage,
  CreateAdminUserInput,
  LibraryAsset,
  LibraryAssetType,
  LoginCredentials,
  PaginatedResponse,
  Product,
  ProductDetailPayload,
  SiteAboutPayload,
  SiteHomePayload,
  SupportPayload,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";

export interface CmsProvider {
  getCatalogPagePayload(locale?: string): Promise<CatalogPagePayload>;
  getCatalogProducts(
    query: CatalogProductsQuery,
    locale?: string,
  ): Promise<PaginatedResponse<Product>>;
  getCatalogProductDetail(
    slug: string,
    locale?: string,
  ): Promise<ProductDetailPayload | null>;
  getCatalogCategories(locale?: string): Promise<Category[]>;
  getSiteHomePayload(locale?: string): Promise<SiteHomePayload>;
  getSiteAboutPayload(locale?: string): Promise<SiteAboutPayload>;
  getSupportPayload(locale?: string): Promise<SupportPayload>;
  getAdminDashboardPayload(): Promise<AdminDashboardPayload>;
  getCmsProductsPayload(query: CmsProductsQuery): Promise<CmsProductsPayload>;
  login(credentials: LoginCredentials): Promise<AuthPayload>;
  logout(): Promise<void>;
  getAdminUsers(): Promise<AdminUsersPayload>;
  createAdminUser(input: CreateAdminUserInput): Promise<AdminUser>;
  updateAdminUser(id: string, input: UpdateAdminUserInput): Promise<AdminUser>;
  getCmsProductDetail(id: string): Promise<CmsProductDetailPayload | null>;
  getBanners(): Promise<Banner[]>;
  getLibraryAssets(params?: {
    type?: LibraryAssetType;
  }): Promise<LibraryAsset[]>;
  getContactMessages(): Promise<ContactMessage[]>;
  getAuditLog(): Promise<AuditEntry[]>;
  getCmsConfig(): Promise<CmsConfig>;
}
