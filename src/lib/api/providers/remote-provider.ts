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
import type { CmsProvider } from "@/lib/api/provider-contract";
import { buildSearchParams } from "@/lib/api/query-utils";
import { cookies } from "next/headers";

const DEFAULT_REMOTE_BASE = "http://localhost:3333";

type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};

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

async function getAuthHeaders(): Promise<HeadersInit | undefined> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return undefined;
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  } catch {
    return undefined;
  }
}

export function createRemoteCmsProvider(): CmsProvider {
  const remoteBaseUrl =
    process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_REMOTE_BASE;

  return {
    async getCatalogPagePayload(locale?: string) {
      void locale;
      return fetchJson<CatalogPagePayload>(remoteBaseUrl, "/api/site/catalog");
    },

    async getCatalogProducts(query: CatalogProductsQuery, locale?: string) {
      const suffix = buildSearchParams({
        q: query.q,
        category: query.category,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      });

      void locale;

      return fetchJson<PaginatedResponse<ProductCardItem>>(
        remoteBaseUrl,
        `/api/products${suffix}`,
      );
    },

    async getCatalogProductDetail(slug: string, locale?: string) {
      void locale;
      return fetchJson<ProductDetailPayload>(
        remoteBaseUrl,
        `/api/products/${slug}`,
      );
    },

    async getCatalogCategories(locale?: string) {
      void locale;

      const payload = await fetchJson<CategoryWithSubcategories[]>(
        remoteBaseUrl,
        "/api/categories",
      );

      return payload.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        order: category.order,
        created_at: category.created_at,
        updated_at: category.updated_at,
      }));
    },

    async getCatalogSubcategories(locale?: string) {
      void locale;

      const payload = await fetchJson<CategoryWithSubcategories[]>(
        remoteBaseUrl,
        "/api/categories",
      );

      return payload.flatMap((category) => category.subcategories);
    },

    async getSiteHomePayload(locale?: string) {
      void locale;
      return fetchJson<SiteHomePayload>(remoteBaseUrl, "/api/site/home");
    },

    async getSiteAboutPayload(locale?: string) {
      void locale;
      return fetchJson<SiteAboutPayload>(remoteBaseUrl, "/api/site/about");
    },

    async getSupportPayload(locale?: string) {
      void locale;
      return fetchJson<SupportPayload>(remoteBaseUrl, "/api/site/support");
    },

    async getAdminDashboardPayload() {
      const authHeaders = await getAuthHeaders();

      return fetchJson<AdminDashboardPayload>(
        remoteBaseUrl,
        "/api/cms/dashboard",
        {
          headers: authHeaders,
        },
      );
    },

    async getCmsProductsPayload(query: CmsProductsQuery) {
      const authHeaders = await getAuthHeaders();
      const suffix = buildSearchParams({
        q: query.q,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      });

      return fetchJson<CmsProductsPayload>(
        remoteBaseUrl,
        `/api/products/admin${suffix}`,
        {
          headers: authHeaders,
        },
      );
    },

    async login(credentials: LoginCredentials) {
      return fetchJson<AuthPayload>(remoteBaseUrl, "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    },

    async logout() {
      await fetchJson<void>(remoteBaseUrl, "/api/auth/logout", {
        method: "DELETE",
      });
    },

    async getAdminUsers() {
      const authHeaders = await getAuthHeaders();

      return fetchJson<AdminUsersPayload>(remoteBaseUrl, "/api/cms/users", {
        headers: authHeaders,
      });
    },

    async createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
      const authHeaders = await getAuthHeaders();

      return fetchJson<AdminUser>(remoteBaseUrl, "/api/cms/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeaders ?? {}),
        },
        body: JSON.stringify(input),
      });
    },

    async updateAdminUser(
      id: string,
      input: UpdateAdminUserInput,
    ): Promise<AdminUser> {
      const authHeaders = await getAuthHeaders();

      return fetchJson<AdminUser>(remoteBaseUrl, `/api/cms/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authHeaders ?? {}),
        },
        body: JSON.stringify(input),
      });
    },

    async getCmsProductDetail(id: string) {
      const authHeaders = await getAuthHeaders();

      return fetchJson<CmsProductDetailPayload>(
        remoteBaseUrl,
        `/api/products/admin/${id}`,
        {
          headers: authHeaders,
        },
      );
    },

    async getBanners() {
      const authHeaders = await getAuthHeaders();

      return fetchJson<BannersPayload>(remoteBaseUrl, "/api/cms/banners", {
        headers: authHeaders,
      });
    },

    async getLibraryAssets(params?: { type?: LibraryAssetType }) {
      const authHeaders = await getAuthHeaders();
      const suffix = buildSearchParams({ type: params?.type });

      return fetchJson<LibraryPayload>(
        remoteBaseUrl,
        `/api/cms/library${suffix}`,
        {
          headers: authHeaders,
        },
      );
    },

    async getContactMessages() {
      const authHeaders = await getAuthHeaders();

      return fetchJson<ContactMessagesPayload>(
        remoteBaseUrl,
        "/api/cms/messages",
        {
          headers: authHeaders,
        },
      );
    },

    async getAuditLog() {
      const authHeaders = await getAuthHeaders();

      return fetchJson<AuditPayload>(remoteBaseUrl, "/api/cms/audit", {
        headers: authHeaders,
      });
    },

    async getCmsConfig() {
      const authHeaders = await getAuthHeaders();

      return fetchJson<CmsConfig>(remoteBaseUrl, "/api/cms/config", {
        headers: authHeaders,
      });
    },
  };
}
