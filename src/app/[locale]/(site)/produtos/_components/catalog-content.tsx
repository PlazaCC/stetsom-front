"use client";

import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
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
import {
  CompareProvider,
  useCompareContext,
} from "./product-compare/compare-provider";
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

  const {
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

  const productCards = catalog.items;
  const hasActiveFilters =
    activeCategory !== "todos" ||
    activeLine !== "todas" ||
    Boolean(search) ||
    showDiscontinued ||
    showExport;
  const isCatalogEmpty = catalog.total === 0 && !hasActiveFilters;
  // Etapa intermediária da taxonomia: categoria escolhida sem linha selecionada
  // mostra as linhas da categoria em cards (em vez do grid de produtos).
  const isLineCardsView =
    lineCards !== null &&
    activeCategory !== "todos" &&
    activeLine === "todas" &&
    !showAll;

  // Build a slug → ProductCardItem lookup map for the compare modal
  const catalogMap = useMemo(() => {
    const map = new Map<string, (typeof productCards)[number]>();
    for (const p of productCards) {
      map.set(p.slug, p);
    }
    return map;
  }, [productCards]);

  // Compare context
  const { mode, selectedSlugs, selectedCategory, setSelectedCategory } =
    useCompareContext();
  const prevSelectedRef = useRef<string[]>([]);

  // Anchor the comparison's category and, when the first product is selected,
  // jump to its category/line view so the grid stays visible and only shows
  // comparable (same-category) products.
  useEffect(() => {
    const prev = prevSelectedRef.current;

    if (mode === "selecting") {
      const product =
        selectedSlugs.length === 1
          ? catalogMap.get(selectedSlugs[0])
          : undefined;

      // Anchor the category (covers the deep-link case and products missing
      // from the current page's map).
      if (selectedSlugs.length === 1 && !selectedCategory) {
        if (product) {
          setSelectedCategory(product.category);
        } else if (activeCategory !== "todos") {
          const match = categories.find((c) => c.slug === activeCategory);
          if (match) setSelectedCategory(match.name);
        }
      }

      // First product just added → navigate to its category (all products) so
      // the grid only shows same-category products.
      if (selectedSlugs.length === 1 && prev.length === 0 && product) {
        const cat = categories.find((c) => c.name === product.category);
        if (cat && (cat.slug !== activeCategory || !showAll)) {
          setCategoryAll(cat.slug);
        }
      }
    }

    prevSelectedRef.current = selectedSlugs;
  }, [
    selectedSlugs,
    mode,
    selectedCategory,
    catalogMap,
    categories,
    activeCategory,
    showAll,
    setSelectedCategory,
    setCategoryAll,
  ]);

  return (
    <div>
      <CatalogHero
        totalProducts={catalog.total}
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
          {isLineCardsView ? (
            <CatalogLinesGrid
              lines={lineCards?.lines ?? []}
              allProductsCoverUrl={lineCards?.allProductsCoverUrl ?? null}
              onSelectLine={setActiveLine}
              onSelectAll={() => setShowAll(true)}
            />
          ) : (
            <div className="flex gap-9">
              {!isCatalogEmpty && isDesktop && (
                <CatalogSidebar
                  open={sidebarOpen}
                  onOpenChange={setSidebarOpen}
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
                {!isCatalogEmpty && (
                  <CatalogDesktopActions
                    onToggleFilters={() => setSidebarOpen(true)}
                  />
                )}

                {!isCatalogEmpty && (
                  <CatalogMobileActions
                    onToggleFilters={() => setSidebarOpen(true)}
                  />
                )}

                {!isCatalogEmpty && !isDesktop && (
                  <CatalogMobileFilterSheet
                    open={sidebarOpen}
                    onOpenChange={setSidebarOpen}
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

                <CatalogProductsList
                  products={productCards}
                  currentPage={page}
                  totalPages={catalog.totalPages}
                  onPageChange={setPage}
                  isCatalogEmpty={isCatalogEmpty}
                />
              </div>
            </div>
          )}
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
    <CompareProvider>
      <CatalogContentInner
        categories={categories}
        catalog={catalog}
        lineCards={lineCards}
      />
    </CompareProvider>
  );
}
