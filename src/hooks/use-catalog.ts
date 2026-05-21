'use client';

import {
  fetchCatalogCategories,
  fetchCatalogPage,
  fetchCatalogProducts,
  fetchCatalogSubcategories,
} from "@/lib/api/client";
import type { CatalogProductsQuery } from "@/lib/api/contracts";
import { useQuery } from "@tanstack/react-query";

export function useCatalogPage(locale?: string) {
  return useQuery({
    queryKey: ['catalog', 'page', locale ?? ''],
    queryFn: () => fetchCatalogPage(locale),
  });
}

export function useCatalogCategories(locale?: string) {
  return useQuery({
    queryKey: ['catalog', 'categories', locale ?? ''],
    queryFn: () => fetchCatalogCategories(locale),
  });
}

export function useCatalogSubcategories(locale?: string) {
  return useQuery({
    queryKey: ["catalog", "subcategories", locale ?? ""],
    queryFn: () => fetchCatalogSubcategories(locale),
  });
}

export function useCatalogProducts(query: CatalogProductsQuery) {
  return useQuery({
    queryKey: [
      'catalog',
      'products',
      query.q ?? '',
      query.category ?? '',
      query.status ?? 'ALL',
      query.page ?? 1,
      query.pageSize ?? 12,
      query.locale ?? '',
    ],
    queryFn: () => fetchCatalogProducts(query),
  });
}
