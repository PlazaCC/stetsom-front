"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function useCatalogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "todos";
  const search = searchParams.get("q") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      updater(p);
      const qs = p.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const setActiveCategory = useCallback(
    (slug: string) => {
      pushParams((p) => {
        if (slug === "todos") p.delete("category");
        else p.set("category", slug);
        p.delete("page"); // reset pagination when the filter changes
      });
    },
    [pushParams],
  );

  const setSearch = useCallback(
    (q: string) => {
      pushParams((p) => {
        if (q) p.set("q", q);
        else p.delete("q");
        p.delete("page"); // reset pagination when the query changes
      });
    },
    [pushParams],
  );

  const setPage = useCallback(
    (n: number) => {
      pushParams((p) => {
        if (n <= 1) p.delete("page");
        else p.set("page", String(n));
      });
    },
    [pushParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    activeCategory,
    search,
    page,
    sidebarOpen,
    setActiveCategory,
    setSearch,
    setPage,
    setSidebarOpen,
    clearFilters,
  };
}
