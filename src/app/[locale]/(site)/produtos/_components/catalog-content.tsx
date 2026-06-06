"use client";

import { useGetApiCategories, useGetApiProducts } from "@/api/stetsom";
import type { PublicCategory } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { cn } from "@/lib/utils";
import { ArrowLeftRight, Search, SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo } from "react";
import { CatalogMobileFilter } from "./catalog-mobile-filter";
import { CatalogSidebar } from "./catalog-sidebar";

interface CategoryOption {
  name: string;
  slug: string;
}

const CATEGORY_IMAGE_BY_ID: Record<string, string> = {
  "cat-amplificadores": "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
  "cat-processadores": "/figma-assets/raw/fill_THI4RN_1e666beb.png",
  "cat-crossovers": "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
  "cat-controles": "/figma-assets/raw/fill_THI4RN_1e666beb.png",
  "cat-fontes-carregadores": "/figma-assets/raw/fill_THI4RN_1e666beb.png",
  "cat-mesas-de-som": "/figma-assets/raw/product-c.png",
  "cat-acessorios": "/figma-assets/raw/product-c.png",
  "cat-subwoofers": "/figma-assets/raw/product-c.png",
};

const DEFAULT_HERO_IMAGE = "/figma-assets/raw/fill_CGM3WO_6a0a1876.png";

function toCategoryOptions(
  categories: CategoryOption[],
  allLabel: string,
): CategoryOption[] {
  return [{ name: allLabel, slug: "todos" }, ...categories];
}

function buildSlugImageMap(
  categories: CategoryOption[],
): Record<string, string> {
  const map: Record<string, string> = {};
  for (const cat of categories) {
    if (CATEGORY_IMAGE_BY_ID[cat.slug]) {
      map[cat.slug] = CATEGORY_IMAGE_BY_ID[cat.slug];
    }
  }
  return map;
}

export function CatalogContent() {
  const t = useTranslations("Catalog");
  const locale = useLocale();
  const apiLocale = toApiLocale(locale);

  const {
    activeCategory,
    search,
    sidebarOpen,
    setActiveCategory,
    setSearch,
    setSidebarOpen,
    clearFilters,
  } = useCatalogFilters();

  const categoriesQuery = useGetApiCategories({ locale: apiLocale });
  const rawCategories: PublicCategory[] = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );

  const categories: CategoryOption[] = useMemo(
    () =>
      rawCategories.map((c: PublicCategory) => ({
        name: c.name,
        slug: c.slug,
      })),
    [rawCategories],
  );

  const categoryOptions = useMemo(
    () => toCategoryOptions(categories, t("allCategories")),
    [categories, t],
  );
  const categoryImageBySlug = useMemo(
    () => buildSlugImageMap(categories),
    [categories],
  );

  const activeCategorySlug =
    activeCategory === "todos" ? undefined : activeCategory;

  const productsQuery = useGetApiProducts({
    q: search || undefined,
    category: activeCategorySlug,
    status: "PUBLISHED",
    page: 1,
    pageSize: 24,
    locale: apiLocale,
  });

  const productCards = useMemo(
    () => productsQuery.data?.items ?? [],
    [productsQuery.data?.items],
  );
  const typeFilterOptions = useMemo(
    () => categoryOptions.filter((c) => c.slug !== "todos"),
    [categoryOptions],
  );

  // Product lines from the active category (or all categories)
  const productLines = useMemo<string[]>(() => {
    const activeRaw = activeCategorySlug
      ? rawCategories.find((c: PublicCategory) => c.slug === activeCategorySlug)
      : null;
    const source = activeRaw ? [activeRaw] : rawCategories;
    return source.flatMap((c: PublicCategory) => c.lines.map((l) => l.name));
  }, [rawCategories, activeCategorySlug]);

  const isLoading = categoriesQuery.isLoading || productsQuery.isLoading;
  const totalProducts = productsQuery.data?.total ?? 0;

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-dark h-72 lg:h-84">
        <div className="absolute inset-0 bg-radial-dark" />
        <Image
          src={DEFAULT_HERO_IMAGE}
          alt={t("heroImageAlt")}
          fill
          className="object-cover opacity-45"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-fade-black" />
        <Container className="relative z-10 pt-8 md:pt-16 lg:pt-25.75">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-brand shrink-0" />
            <span className="font-sans-condensed font-medium text-xs md:text-base uppercase text-brand">
              {t("heroLabel")}
            </span>
          </div>
          <h1 className="font-sans-condensed font-black text-5xl md:text-6xl lg:text-[90px] leading-tight md:leading-16 lg:leading-18.5 uppercase text-white">
            {t("heroTitle")
              .split("\n")
              .map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
          </h1>
          <span className="text-xs md:text-base text-text-subtle-dark mt-2 block">
            <strong className="font-sans-condensed font-black text-xl text-white">
              {totalProducts}
            </strong>{" "}
            {t("products", { count: totalProducts })}
          </span>
        </Container>
        <div className="absolute right-0 bottom-0 font-sans-condensed font-black text-display-2xl sm:text-[150px] lg:text-[263px] text-watermark-text leading-none pointer-events-none select-none opacity-[0.08]">
          PRO
        </div>
        <div className="absolute left-0 top-0 w-3.5 h-full bg-bar-accent" />
      </section>

      <section className="bg-white border-b border-border py-8">
        <Container>
          <p className="mb-5 font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground">
            {t("categories")}
          </p>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
            {categoryOptions.map((cat) => {
              const imageSrc = categoryImageBySlug[cat.slug];
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded p-2 text-center transition-colors",
                    isActive ? "bg-brand/10" : "hover:bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "flex aspect-square w-full items-center justify-center overflow-hidden rounded",
                      isActive ? "bg-brand/10" : "bg-muted",
                    )}
                  >
                    {imageSrc ? (
                      <Image
                        src={imageSrc}
                        alt=""
                        width={48}
                        height={48}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span className="font-sans-condensed text-xs font-black uppercase text-muted-foreground">
                        {cat.name.slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "font-sans text-2xs font-medium leading-tight",
                      isActive ? "text-brand" : "text-muted-foreground",
                    )}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-white pt-6 pb-12">
        <Container>
          <div className="flex gap-9">
            <CatalogSidebar
              search={search}
              onSearchChange={setSearch}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onClear={clearFilters}
              typeFilterOptions={typeFilterOptions}
              productLines={productLines}
            />

            <div className="flex-1 min-w-0">
              <div className="flex gap-3 mb-4 lg:hidden">
                <div className="flex-1 border border-border flex items-center h-10 px-3 gap-2">
                  <Search size={14} className="text-icon-muted shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="border-none outline-none text-sm flex-1 text-brand-dark bg-transparent"
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="border border-border flex items-center gap-2 px-3 h-10 text-sm text-muted-foreground"
                >
                  <SlidersHorizontal size={14} />
                  {t("filters")}
                </button>
                <button
                  type="button"
                  className="border border-border flex items-center gap-2 px-3 h-10 text-sm text-muted-foreground"
                >
                  <ArrowLeftRight size={14} />
                  {t("compare")}
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

              {isLoading ? (
                <div className="text-center py-16 text-muted-foreground text-base">
                  {t("loading")}
                </div>
              ) : productCards.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8">
                  {productCards.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      category={product.category}
                      img={product.thumbnail_url ?? undefined}
                      href={product.href}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground text-base">
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
