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

const DEFAULT_BASE = "http://localhost:3333";

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
    throw new Error(`Remote API error (${response.status}): ${body}`);
  }

  return (await response.json()) as T;
}

async function getAuthHeaders(): Promise<HeadersInit | undefined> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  } catch {
    return undefined;
  }
}

export function createRemoteCmsProvider(): CmsProvider {
  const base = process.env.CMS_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE;

  return {
    // ── Público ─────────────────────────────────────────────────────────

    async getCatalogPagePayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<CatalogPagePayload>(base, `/api/site/catalog${suffix}`);
    },

    async getCatalogProducts(query: CatalogProductsQuery, locale?: string) {
      const suffix = buildSearchParams({
        q: query.q,
        category: query.category,
        status: query.status,
        page: query.page,
        pageSize: query.pageSize,
      });
      return fetchJson<PaginatedResponse<ProductCardItem>>(
        base,
        `/api/products${suffix}`,
      );
    },

    async getCatalogProductDetail(slug: string, locale?: string) {
      void locale;
      return fetchJson<ProductDetailPayload>(base, `/api/products/${slug}`);
    },

    async getCatalogCategories(locale?: string) {
      void locale;
      const payload = await fetchJson<CategoryWithSubcategories[]>(
        base,
        "/api/categories/",
      );
      return payload.map(
        ({ id, name, slug, order, created_at, updated_at }) => ({
          id,
          name,
          slug,
          order,
          created_at,
          updated_at,
        }),
      );
    },

    async getCatalogSubcategories(locale?: string) {
      void locale;
      const payload = await fetchJson<CategoryWithSubcategories[]>(
        base,
        "/api/categories/",
      );
      return payload.flatMap((c) => c.subcategories);
    },

    async getSiteHomePayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<SiteHomePayload>(base, `/api/site/home${suffix}`);
    },

    async getSiteAboutPayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<SiteAboutPayload>(base, `/api/site/about${suffix}`);
    },

    async getSupportPayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<SupportPayload>(base, `/api/site/support${suffix}`);
    },

    // ── Auth ─────────────────────────────────────────────────────────────

    async login(credentials: LoginCredentials) {
      return fetchJson<AuthPayload>(base, "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    },

    async logout() {
      const authHeaders = await getAuthHeaders();
      await fetchJson<{ success: boolean }>(base, "/api/auth/logout", {
        method: "DELETE",
        headers: authHeaders,
      });
    },

    // ── Admin ─────────────────────────────────────────────────────────────

    async getAdminDashboardPayload() {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AdminDashboardPayload>(base, "/api/dashboard/", {
        headers: authHeaders,
      });
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
        base,
        `/api/products/admin${suffix}`,
        { headers: authHeaders },
      );
    },

    async getCmsProductDetail(id: string) {
      const authHeaders = await getAuthHeaders();
      return fetchJson<CmsProductDetailPayload>(
        base,
        `/api/products/admin/${id}`,
        { headers: authHeaders },
      );
    },

    async getAdminUsers() {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AdminUsersPayload>(base, "/api/users/", {
        headers: authHeaders,
      });
    },

    async createAdminUser(input: CreateAdminUserInput): Promise<AdminUser> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AdminUser>(base, "/api/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify(input),
      });
    },

    async updateAdminUser(
      id: string,
      input: UpdateAdminUserInput,
    ): Promise<AdminUser> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AdminUser>(base, `/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify(input),
      });
    },

    async getBanners() {
      const authHeaders = await getAuthHeaders();
      return fetchJson<BannersPayload>(base, "/api/banners/", {
        headers: authHeaders,
      });
    },

    async getLibraryAssets(params?: { type?: LibraryAssetType }) {
      const authHeaders = await getAuthHeaders();
      const suffix = buildSearchParams({ type: params?.type });
      return fetchJson<LibraryPayload>(base, `/api/library${suffix}`, {
        headers: authHeaders,
      });
    },

    async getContactMessages() {
      const authHeaders = await getAuthHeaders();
      return fetchJson<ContactMessagesPayload>(base, "/api/messages/", {
        headers: authHeaders,
      });
    },

    async getAuditLog() {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AuditPayload>(base, "/api/audit/", {
        headers: authHeaders,
      });
    },

    async getCmsConfig() {
      const authHeaders = await getAuthHeaders();
      return fetchJson<CmsConfig>(base, "/api/config/", {
        headers: authHeaders,
      });
    },
  };
}
