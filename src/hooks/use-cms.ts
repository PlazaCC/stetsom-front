"use client";

import type { CmsProductsPayload, CmsProductsQuery } from "@/lib/api/contracts";
import { useQuery } from "@tanstack/react-query";

async function proxyFetch<T>(path: string): Promise<T> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
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

export function useCmsProducts(query: CmsProductsQuery) {
  const path = `/api/proxy/admin/products${buildParams({
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
