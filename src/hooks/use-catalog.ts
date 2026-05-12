'use client'

import { fetchCatalogCategories, fetchCatalogPage, fetchCatalogProducts } from '@/lib/api/client'
import type { CatalogProductsQuery } from '@/lib/api/contracts'
import { useQuery } from '@tanstack/react-query'

export function useCatalogPage() {
  return useQuery({
    queryKey: ['catalog', 'page'],
    queryFn: fetchCatalogPage,
  })
}

export function useCatalogCategories() {
  return useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: fetchCatalogCategories,
  })
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
    ],
    queryFn: () => fetchCatalogProducts(query),
  })
}
