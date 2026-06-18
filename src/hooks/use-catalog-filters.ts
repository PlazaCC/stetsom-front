"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function useCatalogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeCategory = searchParams.get("category") || "todos";
  const activeLine = searchParams.get("line") || "todas";
  const search = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const showDiscontinued = searchParams.get("discontinued") !== "0";
  const showExport = searchParams.get("export") === "1";

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
        // A line belongs to a category — changing the category invalidates it.
        p.delete("line");
        p.delete("page"); // reset pagination when the filter changes
      });
    },
    [pushParams],
  );

  const setActiveLine = useCallback(
    (slug: string) => {
      pushParams((p) => {
        if (slug === "todas") p.delete("line");
        else p.set("line", slug);
        p.delete("page"); // reset pagination when the filter changes
      });
    },
    [pushParams],
  );

  const setSort = useCallback(
    (value: string) => {
      pushParams((p) => {
        if (value === "relevance") p.delete("sort");
        else p.set("sort", value);
        p.delete("page"); // reset pagination when the order changes
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

  const setShowDiscontinued = useCallback(
    (value: boolean) => {
      pushParams((p) => {
        if (!value) p.set("discontinued", "0");
        else p.delete("discontinued");
      });
    },
    [pushParams],
  );

  const setShowExport = useCallback(
    (value: boolean) => {
      pushParams((p) => {
        if (value) p.set("export", "1");
        else p.delete("export");
      });
    },
    [pushParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    activeCategory,
    activeLine,
    search,
    sort,
    page,
    sidebarOpen,
    showDiscontinued,
    showExport,
    setActiveCategory,
    setActiveLine,
    setSearch,
    setSort,
    setPage,
    setSidebarOpen,
    setShowDiscontinued,
    setShowExport,
    clearFilters,
  };
}
