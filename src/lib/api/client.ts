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

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchCatalogCategories(locale?: string) {
  const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  return fetchJson<Category[]>(
    `${INTERNAL_API_ENDPOINTS.catalogCategories}${suffix}`,
  );
}

export async function fetchCatalogSubcategories(locale?: string) {
  const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  return fetchJson<Subcategory[]>(
    `${INTERNAL_API_ENDPOINTS.catalogSubcategories}${suffix}`,
  );
}

export async function fetchCatalogPage(locale?: string) {
  const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: { message?: string } };
    throw new Error(data.error?.message ?? "Falha ao autenticar.");
  }

  return (await response.json()) as AuthPayload;
}

export async function logoutAdmin() {
  await fetch(INTERNAL_API_ENDPOINTS.authLogout, { method: "POST" });
}

export async function createAdminUser(input: CreateAdminUserInput) {
  const response = await fetch(INTERNAL_API_ENDPOINTS.adminUsers, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: { message?: string } };
    throw new Error(data.error?.message ?? "Falha ao criar usuário.");
  }

  return (await response.json()) as AdminUser;
}

export async function updateAdminUser(id: string, input: UpdateAdminUserInput) {
  const response = await fetch(`${INTERNAL_API_ENDPOINTS.adminUsers}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: { message?: string } };
    throw new Error(data.error?.message ?? "Falha ao atualizar usuário.");
  }

  return (await response.json()) as AdminUser;
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
