"use client";

import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { useLocale, useTranslations } from "next-intl";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getApiProducts } from "@/api/stetsom/endpoints/products-public/products-public";
import { toApiLocale } from "@/i18n/locale";
import { useRef } from "react";
import { useEffect, useMemo, useState } from "react";
import { CatalogHero } from "./catalog-hero";
import {
  CatalogLinesGrid,
  type CatalogLineCardData,
} from "./catalog-lines-grid";
import { CatalogCategoryBar } from "./catalog-category-bar";
import { CatalogDesktopActions } from "./catalog-desktop-actions";
import { CatalogMobileActions } from "./catalog-mobile-actions";
import { CatalogMobileFilterSheet } from "./catalog-mobile-filter-sheet";
import { CatalogProductsList } from "./catalog-products-list";
import { CatalogSidebar } from "./catalog-sidebar";
import { useCompareContext } from "./product-compare/compare-provider";
import { CompareModal } from "./product-compare/compare-modal";

interface CategoryOption {
  name: string;
  slug: string;
  iconUrl?: string | null;
}

const SEARCH_DEBOUNCE_MS = 400;

function toCategoryOptions(
  categories: CategoryOption[],
  allLabel: string,
): CategoryOption[] {
  return [{ name: allLabel, slug: "todos", iconUrl: null }, ...categories];
}

interface CatalogContentProps {
  categories: PublicCategory[];
  catalog: ProductCatalogResponse;
  /**
   * Line cards for the intermediate category step (a category chosen, no line
   * selected). When present the page renders the category's lines as cards
   * instead of a product grid; `null`/absent on the Novidades and line views.
   */
  lineCards?: {
    allProductsCoverUrl: string | null;
    lines: CatalogLineCardData[];
  } | null;
}

function CatalogContentInner({
  categories,
  catalog,
  lineCards = null,
}: CatalogContentProps) {
  const t = useTranslations("Catalog");
  const locale = toApiLocale(useLocale());

  const {
    activeCategory,
    activeLine,
    search,
    sort,
    page,
    showDiscontinued,
    showExport,
    showAll,
    setActiveCategory,
    setActiveLine,
    setShowAll,
    setSearch,
    setSort,
    setPage,
    setShowDiscontinued,
    setShowExport,
    clearFilters,
  } = useCatalogFilters();

  // Local input mirrors the URL `q`, debounced before pushing to the URL so a
  // server re-fetch does not fire on every keystroke. When the URL `q` changes
  // externally (clear filters, back navigation) we re-sync during render —
  // React's recommended pattern instead of setState-in-effect.
  const [searchInput, setSearchInput] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  const [isDesktop, setIsDesktop] = useState(false);

  // The desktop drawer and the mobile bottom sheet are both portaled `Sheet`s
  // bound to the same `sidebarOpen` state. Rendering both at once would open
  // two overlapping drawers, and CSS breakpoint classes can't toggle portaled
  // content — so the active drawer must be selected in JS. `min-width: 1024px`
  // mirrors Tailwind's `lg` breakpoint used by the action bars below.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktop(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    if (searchInput === search) return;
    const id = setTimeout(() => setSearch(searchInput), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [searchInput, search, setSearch]);

  const categoryItems: CategoryOption[] = useMemo(
    () =>
      categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        iconUrl: c.icon_url,
      })),
    [categories],
  );

  const categoryOptions = useMemo(
    () => toCategoryOptions(categoryItems, t("allCategories")),
    [categoryItems, t],
  );

  const typeFilterOptions = useMemo(
    () => categoryOptions.filter((c) => c.slug !== "todos"),
    [categoryOptions],
  );

  const activeCategorySlug =
    activeCategory === "todos" ? undefined : activeCategory;

  // Product lines from the active category (or all categories), as {name, slug}
  // so the sidebar can drive the `line` filter (slug) while showing the label.
  const productLines = useMemo<CategoryOption[]>(() => {
    const activeRaw = activeCategorySlug
      ? categories.find((c) => c.slug === activeCategorySlug)
      : null;
    const source = activeRaw ? [activeRaw] : categories;
    return source.flatMap((c) =>
      [...c.lines]
        .sort((a, b) => a.order - b.order)
        .map((l) => ({ name: l.name, slug: l.slug })),
    );
  }, [categories, activeCategorySlug]);

  const { mode, selectedSlugs, selectedItems, sidebarOpen, setSidebarOpen } =
    useCompareContext();
  const prioritySlug = selectedSlugs[0];
  const previousPriority = useRef(prioritySlug);
  useEffect(() => {
    if (prioritySlug && prioritySlug !== previousPriority.current && page !== 1)
      setPage(1);
    previousPriority.current = prioritySlug;
  }, [prioritySlug, page, setPage]);
  const compareParams = {
    locale,
    q: search || undefined,
    category: activeCategorySlug,
    line: activeLine === "todas" ? undefined : activeLine,
    sort: sort === "newest" ? ("newest" as const) : ("relevance" as const),
    page,
    pageSize: 24,
    include_discontinued: showDiscontinued,
    is_export: showExport || undefined,
    priority_product: prioritySlug,
  };
  const comparisonCatalog = useQuery({
    queryKey: ["compare-catalog", compareParams],
    queryFn: ({ signal }) => getApiProducts(compareParams, signal),
    enabled: mode !== "idle",
    placeholderData: keepPreviousData,
  });
  const displayedCatalog =
    mode === "idle" ? catalog : (comparisonCatalog.data ?? catalog);
  const productCards = displayedCatalog?.items ?? [];
  const hasActiveFilters =
    activeCategory !== "todos" ||
    activeLine !== "todas" ||
    Boolean(search) ||
    showDiscontinued ||
    showExport;
  const isCatalogEmpty = displayedCatalog?.total === 0 && !hasActiveFilters;
  // Etapa intermediária da taxonomia: categoria escolhida sem linha selecionada
  // mostra as linhas da categoria em cards (em vez do grid de produtos). Com
  // busca ou filtros ligados, vai direto aos produtos — mesma regra da página.
  const isLineCardsView =
    mode === "idle" &&
    lineCards !== null &&
    activeCategory !== "todos" &&
    activeLine === "todas" &&
    !showAll &&
    !search &&
    !showDiscontinued &&
    !showExport;

  const catalogMap = useMemo(
    () => new Map(selectedItems.map((item) => [item.slug, item])),
    [selectedItems],
  );

  const changeSidebarOpen = (open: boolean) => {
    setSidebarOpen(open);
    if (!open) {
      requestAnimationFrame(() => {
        const triggers = document.querySelectorAll<HTMLButtonElement>(
          "[data-catalog-filter-trigger]",
        );
        Array.from(triggers)
          .find((trigger) => trigger.getClientRects().length > 0)
          ?.focus();
      });
    }
  };

  return (
    <div>
      <CatalogHero
        totalProducts={displayedCatalog.total}
        totalLines={isLineCardsView ? lineCards?.lines.length : undefined}
      />

      <CatalogCategoryBar
        categories={categoryOptions}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        // Category navigation must remain available even when the
        // product query is empty or temporarily fails. The category
        // endpoint is the source of truth for this control.
        disabled={categories.length === 0}
      />

      <section className="bg-white pt-6 pb-12">
        <Container>
          {/* Filters stay available on the line step too, so the search can be
              refined at every level of the taxonomy. */}
          <div className="flex gap-9">
            {isDesktop && (
              <CatalogSidebar
                open={sidebarOpen}
                onOpenChange={changeSidebarOpen}
                search={searchInput}
                onSearchChange={setSearchInput}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                activeLine={activeLine}
                onLineChange={setActiveLine}
                sort={sort}
                onSortChange={setSort}
                onClear={clearFilters}
                typeFilterOptions={typeFilterOptions}
                productLines={productLines}
                showDiscontinued={showDiscontinued}
                onShowDiscontinuedChange={setShowDiscontinued}
                showExport={showExport}
                onShowExportChange={setShowExport}
              />
            )}

            <div className="min-w-0 flex-1">
              {
                <CatalogDesktopActions
                  onToggleFilters={() => setSidebarOpen(true)}
                />
              }

              {
                <CatalogMobileActions
                  onToggleFilters={() => setSidebarOpen(true)}
                />
              }

              {!isDesktop && (
                <CatalogMobileFilterSheet
                  open={sidebarOpen}
                  onOpenChange={changeSidebarOpen}
                  search={searchInput}
                  onSearchChange={setSearchInput}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  activeLine={activeLine}
                  onLineChange={setActiveLine}
                  sort={sort}
                  onSortChange={setSort}
                  onClear={clearFilters}
                  typeFilterOptions={typeFilterOptions}
                  productLines={productLines}
                  showDiscontinued={showDiscontinued}
                  onShowDiscontinuedChange={setShowDiscontinued}
                  showExport={showExport}
                  onShowExportChange={setShowExport}
                />
              )}

              {mode !== "idle" &&
              comparisonCatalog.isError &&
              !comparisonCatalog.isFetching ? (
                <p role="alert" className="py-12 text-center">
                  {t("compareLoadError")}{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={() => comparisonCatalog.refetch()}
                  >
                    {t("compareRetry")}
                  </button>
                </p>
              ) : isLineCardsView ? (
                <CatalogLinesGrid
                  lines={lineCards?.lines ?? []}
                  allProductsCoverUrl={lineCards?.allProductsCoverUrl ?? null}
                  onSelectLine={setActiveLine}
                  onSelectAll={() => setShowAll(true)}
                />
              ) : (
                <CatalogProductsList
                  isLoading={mode !== "idle" && comparisonCatalog.isFetching}
                  placeholderCount={productCards.length || 8}
                  products={productCards}
                  currentPage={page}
                  totalPages={displayedCatalog?.totalPages ?? 0}
                  onPageChange={setPage}
                  isCatalogEmpty={isCatalogEmpty}
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Compare modal overlay */}
      <CompareModal catalogMap={catalogMap} />
    </div>
  );
}

export function CatalogContent({
  categories,
  catalog,
  lineCards = null,
}: CatalogContentProps) {
  return (
    <CatalogContentInner
      categories={categories}
      catalog={catalog}
      lineCards={lineCards}
    />
  );
}
