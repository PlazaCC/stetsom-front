"use client";

import type {
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  PaginatedResponse,
  ProductCardItem,
  Subcategory,
} from "@/lib/api/contracts";
import { proxyFetch } from "@/lib/api/fetch-utils";
import { buildSearchParams } from "@/lib/api/query-utils";
import { useQuery } from "@tanstack/react-query";

export function useCatalogPage(locale?: string) {
  const path = `/api/proxy/catalog/page${buildSearchParams({ locale })}`;
  return useQuery({
    queryKey: ["catalog", "page", locale ?? ""],
    queryFn: () => proxyFetch<CatalogPagePayload>(path),
  });
}

export function useCatalogCategories(locale?: string) {
  const path = `/api/proxy/catalog/categories${buildSearchParams({ locale })}`;
  return useQuery({
    queryKey: ["catalog", "categories", locale ?? ""],
    queryFn: () => proxyFetch<Category[]>(path),
  });
}

export function useCatalogSubcategories(locale?: string) {
  const path = `/api/proxy/catalog/subcategories${buildSearchParams({ locale })}`;
  return useQuery({
    queryKey: ["catalog", "subcategories", locale ?? ""],
    queryFn: () => proxyFetch<Subcategory[]>(path),
  });
}

export function useCatalogProducts(query: CatalogProductsQuery) {
  const path = `/api/proxy/catalog/products${buildSearchParams({
    q: query.q,
    category: query.category,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
    locale: query.locale,
  })}`;

  return useQuery({
    queryKey: [
      "catalog",
      "products",
      query.q ?? "",
      query.category ?? "",
      query.status ?? "ALL",
      query.page ?? 1,
      query.pageSize ?? 12,
      query.locale ?? "",
    ],
    queryFn: () => proxyFetch<PaginatedResponse<ProductCardItem>>(path),
  });
}
