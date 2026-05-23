import type {
  AdminDashboardPayload,
  AdminUser,
  AdminUsersPayload,
  AuditPayload,
  AuthPayload,
  BannersPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsConfig,
  CmsProductDetailPayload,
  CmsProductsPayload,
  CmsProductsQuery,
  ContactMessagesPayload,
  CreateAdminUserInput,
  LibraryAssetType,
  LibraryPayload,
  LoginCredentials,
  PaginatedResponse,
  ProductCardItem,
  ProductDetailPayload,
  SiteAboutPayload,
  SiteHomePayload,
  Subcategory,
  SupportPayload,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";

export interface CmsProvider {
  getCatalogPagePayload(locale?: string): Promise<CatalogPagePayload>;
  getCatalogProducts(
    query: CatalogProductsQuery,
    locale?: string,
  ): Promise<PaginatedResponse<ProductCardItem>>;
  getCatalogProductDetail(
    slug: string,
    locale?: string,
  ): Promise<ProductDetailPayload | null>;
  getCatalogCategories(locale?: string): Promise<Category[]>;
  getCatalogSubcategories(locale?: string): Promise<Subcategory[]>;
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
  getBanners(): Promise<BannersPayload>;
  getLibraryAssets(params?: {
    type?: LibraryAssetType;
  }): Promise<LibraryPayload>;
  getContactMessages(): Promise<ContactMessagesPayload>;
  getAuditLog(): Promise<AuditPayload>;
  getCmsConfig(): Promise<CmsConfig>;
}
