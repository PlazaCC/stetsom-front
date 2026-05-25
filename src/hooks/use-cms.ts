"use client";

import type { CmsProductsPayload, CmsProductsQuery } from "@/lib/api/contracts";
import { proxyFetch } from "@/lib/api/fetch-utils";
import { buildSearchParams } from "@/lib/api/query-utils";
import { useQuery } from "@tanstack/react-query";

export function useCmsProducts(query: CmsProductsQuery) {
  const path = `/api/proxy/admin/products${buildSearchParams({
    q: query.q,
    status: query.status,
    page: query.page,
    pageSize: query.pageSize,
  })}`;

  return useQuery({
    queryKey: [
      "cms",
      "products",
      query.q ?? "",
      query.status ?? "ALL",
      query.page ?? 1,
      query.pageSize ?? 12,
    ],
    queryFn: () => proxyFetch<CmsProductsPayload>(path),
  });
}
