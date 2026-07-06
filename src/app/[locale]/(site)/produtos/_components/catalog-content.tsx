"use client";

import type {
  ProductCatalogResponse,
  PublicCategory,
} from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { Search, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { CatalogCategoryBar } from "./catalog-category-bar";
import { CatalogMobileFilter } from "./catalog-mobile-filter";
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
  const totalProducts = catalog.total;

  return (
    <div>
      <section className="relative h-72 overflow-hidden bg-brand-dark lg:h-84">
        <div className="bg-radial-dark absolute inset-0" />
        {/* <Image
          src={DEFAULT_HERO_IMAGE}
          alt={t("heroImageAlt")}
          fill
          className="object-cover opacity-45"
          sizes="100vw"
          priority
        /> */}
        <div className="bg-gradient-fade-black absolute inset-0" />
        <Container className="relative z-10 pt-8 md:pt-16 lg:pt-25.75">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-px w-6 shrink-0 bg-brand" />
            <span className="font-sans-condensed text-xs font-medium text-brand uppercase md:text-base">
              {t("heroLabel")}
            </span>
          </div>
          <h1 className="font-sans-condensed text-5xl leading-tight font-black text-white uppercase md:text-6xl md:leading-16 lg:text-[90px] lg:leading-18.5">
            {t("heroTitle")
              .split("\n")
              .map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
          </h1>
          <span className="mt-2 block text-xs text-text-subtle-dark md:text-base">
            {t("products", { count: totalProducts })}
          </span>
        </Container>
        <div className="pointer-events-none absolute -right-16 -bottom-16 font-sans-condensed text-display-2xl leading-none font-black text-watermark-text opacity-[0.08] select-none sm:text-[150px] lg:text-[263px]">
          PRODUTOS
        </div>
        <div className="absolute top-0 left-0 h-full w-3.5 bg-brand" />
      </section>

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
              <div className="mb-4 flex gap-3 lg:hidden">
                <div className="flex h-10 flex-1 items-center gap-2 border border-border px-3">
                  <Search size={14} className="shrink-0 text-icon-muted" />
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="flex-1 border-none bg-transparent text-sm text-brand-dark outline-none"
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="flex h-10 items-center gap-2 border border-border px-3 text-sm text-muted-foreground"
                >
                  <SlidersHorizontal size={14} />
                  {t("filters")}
                </button>
              </div>

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

              {productCards.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
                    {productCards.map((product) => (
                      <ProductCard
                        key={product.id}
                        name={product.name}
                        category={product.category}
                        variants={product.variants}
                        img={product.thumbnail_url ?? undefined}
                        href={product.href}
                        variantDirection="column"
                      />
                    ))}
                  </div>

                  {catalog.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
                      >
                        {t("paginationPrevious")}
                      </button>
                      <span className="font-sans text-sm text-muted-foreground">
                        {t("paginationInfo", {
                          page,
                          total: catalog.totalPages,
                        })}
                      </span>
                      <button
                        type="button"
                        disabled={page >= catalog.totalPages}
                        onClick={() => setPage(page + 1)}
                        className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
                      >
                        {t("paginationNext")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 text-center text-base text-muted-foreground">
                  {t("noProducts")}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
