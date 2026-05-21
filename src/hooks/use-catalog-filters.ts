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
      });
    },
    [pushParams],
  );

  const setSearch = useCallback(
    (q: string) => {
      pushParams((p) => {
        if (q) p.set("q", q);
        else p.delete("q");
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
    sidebarOpen,
    setActiveCategory,
    setSearch,
    setSidebarOpen,
    clearFilters,
  };
}
