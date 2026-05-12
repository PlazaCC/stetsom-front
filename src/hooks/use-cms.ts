'use client'

import { fetchCmsProducts } from '@/lib/api/client'
import type { CmsProductsQuery } from '@/lib/api/contracts'
import { useQuery } from '@tanstack/react-query'

export function useCmsProducts(query: CmsProductsQuery) {
  return useQuery({
    queryKey: ['cms', 'products', query.q ?? '', query.status ?? 'ALL', query.page ?? 1, query.pageSize ?? 12],
    queryFn: () => fetchCmsProducts(query),
  })
}
