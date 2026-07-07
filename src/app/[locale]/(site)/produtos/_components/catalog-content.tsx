"use client";

import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { CatalogHero } from "./catalog-hero";
import { CatalogCategoryBar } from "./catalog-category-bar";
import { CatalogMobileActions } from "./catalog-mobile-actions";
import { CatalogMobileFilter } from "./catalog-mobile-filter";
import { CatalogProductsList } from "./catalog-products-list";
import { CatalogSidebar } from "./catalog-sidebar";

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

export function CatalogContent({ categories, catalog }: CatalogContentProps) {
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

  return (
    <div>
      <CatalogHero totalProducts={catalog.total} />

      <CatalogCategoryBar
        categories={categoryOptions}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <section className="bg-white pt-6 pb-12">
        <Container>
          <div className="flex gap-9">
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

            <div className="min-w-0 flex-1">
              <CatalogMobileActions
                search={searchInput}
                onSearchChange={setSearchInput}
                onToggleFilters={() => setSidebarOpen((value) => !value)}
              />

              {sidebarOpen && (
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
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
