import type {
  AdminDashboardPayload,
  AdminUser,
  AdminUsersPayload,
  AuditPayload,
  BannersPayload,
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  CmsConfig,
  CmsProductsPayload,
  CmsProductsQuery,
  ContactMessagesPayload,
  CreateAdminUserInput,
  LibraryAssetType,
  LibraryPayload,
  LoginCredentials,
  PaginatedResponse,
  ProductCardItem,
  Subcategory,
  UpdateAdminUserInput,
} from "@/lib/api/contracts";
import { INTERNAL_API_ENDPOINTS } from "@/lib/api/endpoints";
import { buildSearchParams } from "@/lib/api/query-utils";

type ApiErrorPayload = {
  error?: {
    message?: string;
  };
};

type LoginAdminResponse = {
  ok: true;
};

function isProtectedAdminPath(path: string): boolean {
  return path.startsWith("/api/admin/") || path.startsWith("/api/cms/");
}

async function readErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      const data = (await response.json()) as ApiErrorPayload;
      if (data.error?.message) {
        return data.error.message;
      }
    } catch {
      return fallback;
    }

    return fallback;
  }

  const text = await response.text().catch(() => "");
  return text.trim() || fallback;
}

async function refreshAdminSession(): Promise<boolean> {
  try {
    const response = await fetch(INTERNAL_API_ENDPOINTS.authRefresh, {
      method: "POST",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function requestWithAuthRetry(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const requestInit: RequestInit = {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  };

  const response = await fetch(path, requestInit);

  if (response.status !== 401 || !isProtectedAdminPath(path)) {
    return response;
  }

  const refreshed = await refreshAdminSession();
  if (!refreshed) {
    return response;
  }

  return fetch(path, requestInit);
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await requestWithAuthRetry(path, init);

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      `Request failed with status ${response.status}`,
    );
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function fetchCatalogCategories(locale?: string) {
  const suffix = buildSearchParams({ locale });
  return fetchJson<Category[]>(
    `${INTERNAL_API_ENDPOINTS.catalogCategories}${suffix}`,
  );
}

export async function fetchCatalogSubcategories(locale?: string) {
  const suffix = buildSearchParams({ locale });
  return fetchJson<Subcategory[]>(
    `${INTERNAL_API_ENDPOINTS.catalogSubcategories}${suffix}`,
  );
}

export async function fetchCatalogPage(locale?: string) {
  const suffix = buildSearchParams({ locale });
  return fetchJson<CatalogPagePayload>(
    `${INTERNAL_API_ENDPOINTS.catalogPage}${suffix}`,
  );
}

export async function fetchCatalogProducts(query: CatalogProductsQuery) {
  const suffix = buildSearchParams({
    q: query.q,
    category: query.category,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
    locale: query.locale,
  });

  return fetchJson<PaginatedResponse<ProductCardItem>>(
    `${INTERNAL_API_ENDPOINTS.catalogProducts}${suffix}`,
  );
}

export async function fetchCmsProducts(query: CmsProductsQuery) {
  const suffix = buildSearchParams({
    q: query.q,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  });

  return fetchJson<CmsProductsPayload>(
    `${INTERNAL_API_ENDPOINTS.cmsProducts}${suffix}`,
  );
}

export async function fetchAdminDashboard() {
  return fetchJson<AdminDashboardPayload>(
    INTERNAL_API_ENDPOINTS.adminDashboard,
  );
}

export async function fetchAdminUsers() {
  return fetchJson<AdminUsersPayload>(INTERNAL_API_ENDPOINTS.adminUsers);
}

export async function loginAdmin(credentials: LoginCredentials) {
  const response = await fetch(INTERNAL_API_ENDPOINTS.authLogin, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const message = await readErrorMessage(response, "Falha ao autenticar.");
    throw new Error(message);
  }

  return (await response.json()) as LoginAdminResponse;
}

export async function logoutAdmin() {
  const response = await fetch(INTERNAL_API_ENDPOINTS.authLogout, {
    method: "POST",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      "Falha ao encerrar sessão.",
    );
    throw new Error(message);
  }
}

export async function createAdminUser(input: CreateAdminUserInput) {
  return fetchJson<AdminUser>(INTERNAL_API_ENDPOINTS.adminUsers, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function updateAdminUser(id: string, input: UpdateAdminUserInput) {
  return fetchJson<AdminUser>(`${INTERNAL_API_ENDPOINTS.adminUsers}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function fetchAdminBanners() {
  return fetchJson<BannersPayload>(INTERNAL_API_ENDPOINTS.adminBanners);
}

export async function fetchAdminLibrary(type?: LibraryAssetType) {
  const suffix = type ? `?type=${encodeURIComponent(type)}` : "";
  return fetchJson<LibraryPayload>(
    `${INTERNAL_API_ENDPOINTS.adminLibrary}${suffix}`,
  );
}

export async function fetchAdminMessages() {
  return fetchJson<ContactMessagesPayload>(
    INTERNAL_API_ENDPOINTS.adminMessages,
  );
}

export async function fetchAdminAuditLog() {
  return fetchJson<AuditPayload>(INTERNAL_API_ENDPOINTS.adminAudit);
}

export async function fetchAdminConfig() {
  return fetchJson<CmsConfig>(INTERNAL_API_ENDPOINTS.adminConfig);
}
