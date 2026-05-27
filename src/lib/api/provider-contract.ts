import type {
  AdminDashboardPayload,
  AdminPageDetailPayload,
  AdminPagesPayload,
  AdminUser,
  AdminUsersPayload,
  AuditPayload,
  AuthPayload,
  BannerWithUploads,
  BannersPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsConfig,
  CmsProductDetailPayload,
  CmsProductsPayload,
  CmsProductsQuery,
  ContactFormInput,
  ContactMessagesPayload,
  CreateAdminUserInput,
  CreateBannerInput,
  CreateCmsProductInput,
  LibraryAssetType,
  LibraryPayload,
  LoginCredentials,
  PageId,
  PageSectionWithUploads,
  PaginatedResponse,
  ProductCardItem,
  ProductDetailPayload,
  ProductWithUpload,
  SiteAboutPayload,
  SiteHomePayload,
  Subcategory,
  SupportPayload,
  UpdateAdminUserInput,
  UpdateCmsProductInput,
  UpdatePageSectionInput,
} from "@/lib/api/contracts";

export interface CmsProvider {
  // ── Public / Catalog ────────────────────────────────────────────────────────
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
  submitContact(input: ContactFormInput): Promise<void>;

  // ── Auth ─────────────────────────────────────────────────────────────────────
  login(credentials: LoginCredentials): Promise<AuthPayload>;
  refreshToken(token: string): Promise<AuthPayload>;
  logout(): Promise<void>;

  // ── Dashboard ────────────────────────────────────────────────────────────────
  getAdminDashboardPayload(): Promise<AdminDashboardPayload>;

  // ── Products (Read) ──────────────────────────────────────────────────────────
  getCmsProductsPayload(query: CmsProductsQuery): Promise<CmsProductsPayload>;
  getCmsProductDetail(id: string): Promise<CmsProductDetailPayload | null>;

  // ── Products (Write) ─────────────────────────────────────────────────────────
  createCmsProduct(input: CreateCmsProductInput): Promise<ProductWithUpload>;
  updateCmsProduct(
    id: string,
    input: UpdateCmsProductInput,
  ): Promise<ProductWithUpload>;
  deleteCmsProduct(id: string): Promise<void>;

  // ── Users ────────────────────────────────────────────────────────────────────
  getAdminUsers(): Promise<AdminUsersPayload>;
  createAdminUser(input: CreateAdminUserInput): Promise<AdminUser>;
  updateAdminUser(id: string, input: UpdateAdminUserInput): Promise<AdminUser>;

  // ── Banners ──────────────────────────────────────────────────────────────────
  getBanners(): Promise<BannersPayload>;
  createBanner(input: CreateBannerInput): Promise<BannerWithUploads>;
  updateBanner(
    id: string,
    input: Partial<CreateBannerInput>,
  ): Promise<BannerWithUploads>;
  deleteBanner(id: string): Promise<void>;

  // ── Library ──────────────────────────────────────────────────────────────────
  getLibraryAssets(params?: {
    type?: LibraryAssetType;
  }): Promise<LibraryPayload>;

  // ── Messages ─────────────────────────────────────────────────────────────────
  getContactMessages(): Promise<ContactMessagesPayload>;
  markMessageRead(id: string, isRead: boolean): Promise<void>;

  // ── Audit ────────────────────────────────────────────────────────────────────
  getAuditLog(): Promise<AuditPayload>;

  // ── Config ───────────────────────────────────────────────────────────────────
  getCmsConfig(): Promise<CmsConfig>;
  updateCmsConfig(input: Partial<CmsConfig>): Promise<CmsConfig>;

  // ── Pages (Institutional) ────────────────────────────────────────────────────
  getAdminPages(): Promise<AdminPagesPayload>;
  getAdminPageSections(pageId: PageId): Promise<AdminPageDetailPayload>;
  updatePageSection(
    sectionId: string,
    input: UpdatePageSectionInput,
  ): Promise<PageSectionWithUploads>;
}
