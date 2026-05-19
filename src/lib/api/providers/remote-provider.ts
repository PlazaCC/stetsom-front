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
} from "@/lib/api/contracts";
import type { CmsProvider } from "@/lib/api/provider-contract";
import { buildSearchParams } from "@/lib/api/query-utils";

const DEFAULT_REMOTE_BASE = "http://localhost:3333";

async function fetchJson<T>(baseUrl: string, path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      Accept: "application/json",
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
  };
}
