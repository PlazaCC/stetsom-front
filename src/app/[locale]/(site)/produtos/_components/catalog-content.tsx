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
import { CatalogCategoryBar } from "./catalog-category-bar";
import { CatalogMobileActions } from "./catalog-mobile-actions";
import { CatalogMobileFilter } from "./catalog-mobile-filter";
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
}

function CatalogContentInner({ categories, catalog }: CatalogContentProps) {
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
    setActiveCategory,
    setActiveLine,
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
    !showDiscontinued ||
    showExport;
  const isCatalogEmpty = catalog.total === 0 && !hasActiveFilters;

  // Build a slug → ProductCardItem lookup map for the compare modal
  const catalogMap = useMemo(() => {
    const map = new Map<string, (typeof productCards)[number]>();
    for (const p of productCards) {
      map.set(p.slug, p);
    }
    return map;
  }, [productCards]);

  // Compare context
  const { mode, selectedSlugs } = useCompareContext();
  const prevSelectedRef = useRef<string[]>([]);

  // When first product is selected in compare mode, auto-filter by its category
  useEffect(() => {
    if (mode !== "selecting") return;
    const prev = prevSelectedRef.current;
    const curr = selectedSlugs;

    // A product was added (first one)
    if (curr.length === 1 && prev.length === 0) {
      const product = catalogMap.get(curr[0]);
      if (product) {
        // Find the category slug from the categories list by name
        const catSlug = categories.find(
          (c) => c.name === product.category,
        )?.slug;
        if (catSlug && catSlug !== activeCategory) {
          setActiveCategory(catSlug);
        }
      }
    }

    // All products removed — reset category
    if (curr.length === 0 && prev.length > 0) {
      if (activeCategory !== "todos") {
        setActiveCategory("todos");
      }
    }

    prevSelectedRef.current = curr;
  }, [
    selectedSlugs,
    mode,
    catalogMap,
    categories,
    activeCategory,
    setActiveCategory,
  ]);

  return (
    <div>
      <CatalogHero totalProducts={catalog.total} />

      <CatalogCategoryBar
        categories={categoryOptions}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        disabled={isCatalogEmpty}
      />

      <section className="bg-white pt-6 pb-12">
        <Container>
          <div className="flex gap-9">
            {!isCatalogEmpty && (
              <CatalogSidebar
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
                <CatalogMobileActions
                  onToggleFilters={() => setSidebarOpen((value) => !value)}
                />
              )}

              {sidebarOpen && !isCatalogEmpty && (
                <CatalogMobileFilter
                  categoryOptions={categoryOptions}
                  activeCategory={activeCategory}
                  onCategoryChange={(slug) => {
                    setActiveCategory(slug);
                    setSidebarOpen(false);
                  }}
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
        </Container>
      </section>

      {/* Compare modal overlay */}
      <CompareModal catalogMap={catalogMap} />
    </div>
  );
}

export function CatalogContent({ categories, catalog }: CatalogContentProps) {
  return (
    <CompareProvider>
      <CatalogContentInner categories={categories} catalog={catalog} />
    </CompareProvider>
  );
}
