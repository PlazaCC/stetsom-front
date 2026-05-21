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
  Subcategory,
  SupportPayload,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";
import type { CmsProvider } from "@/lib/api/provider-contract";
import { buildSearchParams } from "@/lib/api/query-utils";

const DEFAULT_REMOTE_BASE = "http://localhost:3333";

async function fetchJson<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Remote provider request failed (${response.status}): ${body}`,
    );
  }

  return (await response.json()) as T;
}

export function createRemoteCmsProvider(): CmsProvider {
  const remoteBaseUrl =
    process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_REMOTE_BASE;

  return {
    async getCatalogPagePayload(locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<CatalogPagePayload>(
        remoteBaseUrl,
        `/catalog/page${suffix}`,
      );
    },

    async getCatalogProducts(query: CatalogProductsQuery, locale?: string) {
      const suffix = buildSearchParams({
        q: query.q,
        category: query.category,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
        locale,
      });

      return fetchJson<PaginatedResponse<Product>>(
        remoteBaseUrl,
        `/catalog/products${suffix}`,
      );
    },

    async getCatalogProductDetail(slug: string, locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<ProductDetailPayload>(
        remoteBaseUrl,
        `/catalog/products/${slug}${suffix}`,
      );
    },

    async getCatalogCategories(locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<Category[]>(
        remoteBaseUrl,
        `/catalog/categories${suffix}`,
      );
    },

    async getCatalogSubcategories(locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<Subcategory[]>(
        remoteBaseUrl,
        `/catalog/subcategories${suffix}`,
      );
    },

    async getSiteHomePayload(locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<SiteHomePayload>(remoteBaseUrl, `/site/home${suffix}`);
    },

    async getSiteAboutPayload(locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<SiteAboutPayload>(remoteBaseUrl, `/site/about${suffix}`);
    },

    async getSupportPayload(locale?: string) {
      const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
      return fetchJson<SupportPayload>(remoteBaseUrl, `/support${suffix}`);
    },

    async getAdminDashboardPayload() {
      return fetchJson<AdminDashboardPayload>(
        remoteBaseUrl,
        "/admin/dashboard",
      );
    },

    async getCmsProductsPayload(query: CmsProductsQuery) {
      const suffix = buildSearchParams({
        q: query.q,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      });

      return fetchJson<CmsProductsPayload>(
        remoteBaseUrl,
        `/cms/products${suffix}`,
      );
    },

    async login(credentials: LoginCredentials) {
      return fetchJson<AuthPayload>(remoteBaseUrl, "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    },

    async logout() {
      await fetchJson<void>(remoteBaseUrl, "/auth/logout", {
        method: "DELETE",
      });
    },

    async getAdminUsers() {
      return fetchJson<AdminUsersPayload>(remoteBaseUrl, "/admin/users");
    },

    async createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
      return fetchJson<AdminUser>(remoteBaseUrl, "/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    },

    async updateAdminUser(
      id: string,
      input: UpdateAdminUserInput,
    ): Promise<AdminUser> {
      return fetchJson<AdminUser>(remoteBaseUrl, `/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
    },

    async getCmsProductDetail(id: string) {
      return fetchJson<CmsProductDetailPayload>(
        remoteBaseUrl,
        `/cms/products/${id}`,
      );
    },

    async getBanners() {
      return fetchJson<Banner[]>(remoteBaseUrl, "/cms/banners");
    },

    async getLibraryAssets(params?: { type?: LibraryAssetType }) {
      const suffix = params?.type
        ? `?type=${encodeURIComponent(params.type)}`
        : "";
      return fetchJson<LibraryAsset[]>(remoteBaseUrl, `/cms/library${suffix}`);
    },

    async getContactMessages() {
      return fetchJson<ContactMessage[]>(remoteBaseUrl, "/cms/messages");
    },

    async getAuditLog() {
      return fetchJson<AuditEntry[]>(remoteBaseUrl, "/cms/audit");
    },

    async getCmsConfig() {
      return fetchJson<CmsConfig>(remoteBaseUrl, "/cms/config");
    },
  };
}
