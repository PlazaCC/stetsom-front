"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";

export function useCatalogFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ category?: string; line?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathCategory = params.category ? String(params.category) : undefined;
  const pathLine = params.line ? String(params.line) : undefined;
  const activeCategory = pathCategory || "todos";
  const activeLine = pathLine || "todas";
  const search = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  // Desligado por padrão — só liga quando o usuário marca discontinued=1.
  const showDiscontinued = searchParams.get("discontinued") === "1";
  const showExport = searchParams.get("export") === "1";
  // "all" mostra todos os produtos de uma categoria (pulando a etapa de linhas).
  const showAll = pathname === "/produtos/[category]/produtos";

  const replaceTaxonomyPath = useCallback(
    (category?: string, line?: string, all = false) => {
      const p = new URLSearchParams(searchParams.toString());
      p.delete("page");
      const path = !category
        ? { pathname: "/produtos" as const }
        : line
          ? {
              pathname: "/produtos/[category]/[line]" as const,
              params: { category, line },
            }
          : all
            ? {
                pathname: "/produtos/[category]/produtos" as const,
                params: { category },
              }
            : {
                pathname: "/produtos/[category]" as const,
                params: { category },
              };
      router.replace(
        { ...path, query: Object.fromEntries(p.entries()) },
        { scroll: false },
      );
    },
    [router, searchParams],
  );

  const pushParams = useCallback(
    (updater: (p: URLSearchParams) => void) => {
      const p = new URLSearchParams(searchParams.toString());
      updater(p);
      const currentHref = pathLine
        ? {
            pathname: "/produtos/[category]/[line]" as const,
            params: { category: pathCategory ?? "", line: pathLine },
          }
        : pathCategory
          ? showAll
            ? {
                pathname: "/produtos/[category]/produtos" as const,
                params: { category: pathCategory },
              }
            : {
                pathname: "/produtos/[category]" as const,
                params: { category: pathCategory },
              }
          : { pathname: "/produtos" as const };
      router.replace(
        { ...currentHref, query: Object.fromEntries(p.entries()) },
        { scroll: false },
      );
    },
    [searchParams, router, pathCategory, pathLine, showAll],
  );

  const setActiveCategory = useCallback(
    (slug: string) => {
      replaceTaxonomyPath(slug === "todos" ? undefined : slug);
    },
    [replaceTaxonomyPath],
  );

  const setActiveLine = useCallback(
    (slug: string) => {
      replaceTaxonomyPath(
        activeCategory === "todos" ? undefined : activeCategory,
        slug === "todas" ? undefined : slug,
      );
    },
    [activeCategory, replaceTaxonomyPath],
  );

  const setShowAll = useCallback(
    (value: boolean) => {
      replaceTaxonomyPath(
        activeCategory === "todos" ? undefined : activeCategory,
        undefined,
        value,
      );
    },
    [activeCategory, replaceTaxonomyPath],
  );

  const setCategoryAll = useCallback(
    (category: string) => {
      replaceTaxonomyPath(
        category === "todos" ? undefined : category,
        undefined,
        true,
      );
    },
    [replaceTaxonomyPath],
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
        if (value) p.set("discontinued", "1");
        else p.delete("discontinued");
        p.delete("page"); // reset pagination when the filter changes
      });
    },
    [pushParams],
  );

  const setShowExport = useCallback(
    (value: boolean) => {
      pushParams((p) => {
        if (value) p.set("export", "1");
        else p.delete("export");
        p.delete("page"); // reset pagination when the filter changes
      });
    },
    [pushParams],
  );

  const clearFilters = useCallback(() => {
    router.replace({ pathname: "/produtos" }, { scroll: false });
  }, [router]);

  return {
    activeCategory,
    activeLine,
    search,
    sort,
    page,
    sidebarOpen,
    showDiscontinued,
    showExport,
    showAll,
    setActiveCategory,
    setActiveLine,
    setShowAll,
    setCategoryAll,
    setSearch,
    setSort,
    setPage,
    setSidebarOpen,
    setShowDiscontinued,
    setShowExport,
    clearFilters,
  };
}
