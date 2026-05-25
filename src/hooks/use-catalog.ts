"use client";

import type {
  CatalogPagePayload,
  CatalogProductsQuery,
  Category,
  PaginatedResponse,
  ProductCardItem,
  Subcategory,
} from "@/lib/api/contracts";
import { useQuery } from "@tanstack/react-query";

async function proxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

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

function buildParams(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function useCatalogProducts(query: CatalogProductsQuery) {
  const path = `/api/proxy/catalog/products${buildParams({
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
