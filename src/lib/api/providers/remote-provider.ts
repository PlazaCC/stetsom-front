import type {
  AdminDashboardPayload,
  AdminPageDetailPayload,
  AdminPagesPayload,
  AdminUser,
  AdminUsersPayload,
  AuditPayload,
  AuthPayload,
  Banner,
  BannersPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsConfig,
  CmsProductDetailPayload,
  CmsProductMutationResult,
  CmsProductsPayload,
  CmsProductsQuery,
  ContactMessagesPayload,
  CreateAdminUserInput,
  CreateBannerInput,
  CreateCmsProductInput,
  LibraryAssetType,
  LibraryPayload,
  LoginCredentials,
  PageId,
  PageSection,
  PaginatedResponse,
  ProductCardItem,
  ProductDetailPayload,
  SiteAboutPayload,
  SiteHomePayload,
  Subcategory,
  SupportPayload,
  UpdateAdminUserInput,
  UpdateCmsProductInput,
} from "@/lib/api/contracts";
import type { CmsProvider } from "@/lib/api/provider-contract";
import { buildSearchParams } from "@/lib/api/query-utils";
import { HttpError } from "@/lib/api/route-utils";
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
    throw new HttpError(response.status, "UPSTREAM_ERROR", body);
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
    // ── Public ──────────────────────────────────────────────────────────

    async getCatalogPagePayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<CatalogPagePayload>(base, `/api/pages/catalog${suffix}`);
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
      return fetchJson<PaginatedResponse<ProductCardItem>>(
        base,
        `/api/products${suffix}`,
      );
    },

    async getCatalogProductDetail(slug: string, locale?: string) {
      const suffix = buildSearchParams({ locale });
      try {
        return await fetchJson<ProductDetailPayload>(
          base,
          `/api/products/${slug}${suffix}`,
        );
      } catch (err) {
        if (err instanceof HttpError && err.status === 404) return null;
        throw err;
      }
    },

    async getCatalogCategories(locale?: string) {
      const suffix = buildSearchParams({ locale });
      const payload = await fetchJson<CategoryWithSubcategories[]>(
        base,
        `/api/categories${suffix}`,
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
      const suffix = buildSearchParams({ locale });
      const payload = await fetchJson<CategoryWithSubcategories[]>(
        base,
        `/api/categories${suffix}`,
      );
      return payload.flatMap((c) => c.subcategories);
    },

    async getSiteHomePayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<SiteHomePayload>(base, `/api/pages/home${suffix}`);
    },

    async getSiteAboutPayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<SiteAboutPayload>(base, `/api/pages/about${suffix}`);
    },

    async getSupportPayload(locale?: string) {
      const suffix = buildSearchParams({ locale });
      return fetchJson<SupportPayload>(base, `/api/pages/support${suffix}`);
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
      // Logout is stateless — token expiry is the real security boundary.
      // Notify the backend best-effort; do not let a network failure block logout.
      try {
        const authHeaders = await getAuthHeaders();
        await fetchJson<{ success: boolean }>(base, "/api/auth/logout", {
          method: "DELETE",
          headers: authHeaders,
        });
      } catch {
        // Intentional: upstream failures must not prevent cookie clearing.
      }
    },

    async refreshToken(token: string): Promise<AuthPayload> {
      return fetchJson<AuthPayload>(base, "/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token }),
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
      try {
        return await fetchJson<CmsProductDetailPayload>(
          base,
          `/api/products/admin/${id}`,
          { headers: authHeaders },
        );
      } catch (err) {
        if (err instanceof HttpError && err.status === 404) return null;
        throw err;
      }
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

    // ── Products (Write) ──────────────────────────────────────────────────────
    // Nota: o back-end (stetsom-api) registra os endpoints de escrita em:
    //   POST   /api/products/         → criar produto
    //   PATCH  /api/products/:id      → atualizar produto
    //   DELETE /api/products/:id      → excluir produto
    // (não em /api/products/admin — esse prefixo só existe nas rotas de leitura CMS)

    async createCmsProduct(
      input: CreateCmsProductInput,
    ): Promise<CmsProductMutationResult> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<CmsProductMutationResult>(base, "/api/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify(input),
      });
    },

    async updateCmsProduct(
      id: string,
      input: UpdateCmsProductInput,
    ): Promise<CmsProductMutationResult> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<CmsProductMutationResult>(base, `/api/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authHeaders ?? {}),
        },
        body: JSON.stringify(input),
      });
    },

    async deleteCmsProduct(id: string): Promise<void> {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${base}/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders ?? {},
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.text();
        throw new HttpError(res.status, "UPSTREAM_ERROR", body);
      }
    },

    // ── Banners (Write) ───────────────────────────────────────────────────────

    async createBanner(input: CreateBannerInput): Promise<Banner> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<Banner>(base, "/api/banners/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify(input),
      });
    },

    async updateBanner(
      id: string,
      input: Partial<CreateBannerInput>,
    ): Promise<Banner> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<Banner>(base, `/api/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify(input),
      });
    },

    async deleteBanner(id: string): Promise<void> {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`${base}/api/banners/${id}`, {
        method: "DELETE",
        headers: authHeaders ?? {},
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.text();
        throw new HttpError(res.status, "UPSTREAM_ERROR", body);
      }
    },

    // ── Messages ──────────────────────────────────────────────────────────────

    async markMessageRead(id: string, isRead: boolean): Promise<void> {
      const authHeaders = await getAuthHeaders();
      await fetchJson(base, `/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify({ is_read: isRead }),
      });
    },

    // ── Config (Write) ────────────────────────────────────────────────────────

    async updateCmsConfig(input: Partial<CmsConfig>): Promise<CmsConfig> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<CmsConfig>(base, "/api/config/", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(authHeaders ?? {}) },
        body: JSON.stringify(input),
      });
    },

    // ── Pages (Institutional) ─────────────────────────────────────────────────

    async getAdminPages(): Promise<AdminPagesPayload> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AdminPagesPayload>(base, "/api/pages/admin", {
        headers: authHeaders,
      });
    },

    async getAdminPageSections(
      pageId: PageId,
    ): Promise<AdminPageDetailPayload> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<AdminPageDetailPayload>(
        base,
        `/api/pages/admin/${pageId}`,
        {
          headers: authHeaders,
        },
      );
    },

    async updatePageSection(
      sectionId: string,
      data: Record<string, unknown>,
    ): Promise<PageSection> {
      const authHeaders = await getAuthHeaders();
      return fetchJson<PageSection>(
        base,
        `/api/pages/admin/sections/${sectionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(authHeaders ?? {}),
          },
          body: JSON.stringify({ data }),
        },
      );
    },
  };
}
