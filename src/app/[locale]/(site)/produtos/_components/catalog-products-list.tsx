"use client";

import type { ProductCatalogResponse } from "@/api/stetsom/model";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ui/product-card";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { PackageSearch, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCompareContext } from "./product-compare/compare-provider";

interface CatalogProductsListProps {
  products: ProductCatalogResponse["items"];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isCatalogEmpty?: boolean;
  isLoading?: boolean;
  placeholderCount?: number;
}

export function CatalogProductsList({
  products,
  currentPage,
  totalPages,
  onPageChange,
  isCatalogEmpty = false,
  isLoading = false,
  placeholderCount = 8,
}: CatalogProductsListProps) {
  const t = useTranslations("Catalog");
  const compare = useCompareContext();
  const {
    mode,
    selectedSlugs,
    selectedCategory,
    selectProduct,
    isProductSelected,
    resolvingFirst,
    firstLoadError,
  } = compare;

  const isSelecting = mode === "selecting";

  if (!isLoading && products.length === 0) {
    return (
      <PublicEmptyState
        icon={isCatalogEmpty ? PackageSearch : SearchX}
        title={isCatalogEmpty ? t("emptyCatalogTitle") : t("emptyResultsTitle")}
        description={
          isCatalogEmpty
            ? t("emptyCatalogDescription")
            : t("emptyResultsDescription")
        }
        className="min-h-96 lg:min-h-150"
      />
    );
  }

  return (
    <>
      <div
        aria-busy={isLoading}
        aria-label={isLoading ? t("loading") : undefined}
        role={isLoading ? "status" : undefined}
      >
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: placeholderCount }, (_, index) => (
                <div
                  key={index}
                  aria-hidden="true"
                  className="flex flex-col overflow-hidden rounded-lg border border-border bg-white"
                >
                  <div className="flex h-40.5 items-center justify-center p-4">
                    <Skeleton className="h-28 w-3/4" />
                  </div>
                  <div className="flex flex-col gap-2 border-t border-border bg-card p-3">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-12 rounded-lg" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  category={product.category}
                  variants={product.variants}
                  badge={
                    product.is_discontinued ? t("discontinued") : undefined
                  }
                  badgeTone="discontinued"
                  img={product.thumbnail_url ?? undefined}
                  href={{
                    pathname: "/produto/[slug]",
                    params: { slug: product.slug },
                  }}
                  variantDirection="column"
                  compareMode={isSelecting}
                  isCompareSelected={isProductSelected(product.slug)}
                  compareDisabled={
                    (resolvingFirst ||
                      firstLoadError ||
                      selectedSlugs.length >= 2) &&
                    !isProductSelected(product.slug)
                  }
                  compareBlocked={
                    isSelecting &&
                    selectedCategory !== null &&
                    selectedCategory !== product.category &&
                    !isProductSelected(product.slug)
                  }
                  onCompareToggle={() => selectProduct(product)}
                  compareLabel={t("compareBadge")}
                  compareSelectedLabel={t("compareBadgeSelected")}
                  compareBlockedLabel={t("compareBlockedBadge")}
                />
              ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              type="button"
              disabled={isLoading || currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              {t("paginationPrevious")}
            </button>
            <span className="font-sans text-sm text-muted-foreground">
              {t("paginationInfo", {
                page: currentPage,
                total: totalPages,
              })}
            </span>
            <button
              type="button"
              disabled={isLoading || currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
            >
              {t("paginationNext")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
