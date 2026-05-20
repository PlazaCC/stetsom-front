import type {
  CatalogProductsQuery,
  CmsProductsQuery,
  ProductStatus,
} from "@/lib/api/contracts";
import { getCmsProvider } from "@/lib/api/provider";
import { getLocale } from "next-intl/server";

function normalizePage(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return 1;
  }

  return value;
}

function normalizePageSize(value: number | undefined): number {
  if (!value || Number.isNaN(value) || value < 1) {
    return 12;
  }

  return Math.min(value, 100);
}

function normalizeStatus(
  value: ProductStatus | "ALL" | undefined,
): ProductStatus | "ALL" | undefined {
  if (!value) {
    return undefined;
  }

  if (value === "ACTIVE" || value === "DISCONTINUED" || value === "ALL") {
    return value;
  }

  return undefined;
}

async function tryGetLocale(): Promise<string | undefined> {
  try {
    return await getLocale();
  } catch {
    return undefined;
  }
}

export async function getCatalogProducts(
  query: CatalogProductsQuery,
  locale?: string,
) {
  return getCmsProvider().getCatalogProducts(
    {
      ...query,
      status: normalizeStatus(query.status),
      page: normalizePage(query.page),
      pageSize: normalizePageSize(query.pageSize),
    },
    locale,
  );
}

export async function getCatalogPagePayload(locale?: string) {
  return getCmsProvider().getCatalogPagePayload(locale);
}

export async function getCatalogProductDetail(slug: string) {
  const locale = await tryGetLocale();
  return getCmsProvider().getCatalogProductDetail(slug, locale);
}

export async function getCatalogCategories(locale?: string) {
  return getCmsProvider().getCatalogCategories(locale);
}

export async function getSiteHomePayload() {
  const locale = await tryGetLocale();
  return getCmsProvider().getSiteHomePayload(locale);
}

export async function getSiteAboutPayload() {
  const locale = await tryGetLocale();
  return getCmsProvider().getSiteAboutPayload(locale);
}

export async function getSupportPayload() {
  const locale = await tryGetLocale();
  return getCmsProvider().getSupportPayload(locale);
}

export async function getAdminDashboardPayload() {
  return getCmsProvider().getAdminDashboardPayload();
}

export async function getCmsProductsPayload(query: CmsProductsQuery) {
  return getCmsProvider().getCmsProductsPayload({
    ...query,
    status: normalizeStatus(query.status),
    page: normalizePage(query.page),
    pageSize: normalizePageSize(query.pageSize),
  });
}

export async function getAdminUsersPayload() {
  return getCmsProvider().getAdminUsers();
}
