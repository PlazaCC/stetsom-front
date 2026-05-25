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
  const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  return useQuery({
    queryKey: ["catalog", "page", locale ?? ""],
    queryFn: () =>
      proxyFetch<CatalogPagePayload>(`/api/proxy/catalog/page${suffix}`),
  });
}

export function useCatalogCategories(locale?: string) {
  const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  return useQuery({
    queryKey: ["catalog", "categories", locale ?? ""],
    queryFn: () =>
      proxyFetch<Category[]>(`/api/proxy/catalog/categories${suffix}`),
  });
}

export function useCatalogSubcategories(locale?: string) {
  const suffix = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  return useQuery({
    queryKey: ["catalog", "subcategories", locale ?? ""],
    queryFn: () =>
      proxyFetch<Subcategory[]>(`/api/proxy/catalog/subcategories${suffix}`),
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
