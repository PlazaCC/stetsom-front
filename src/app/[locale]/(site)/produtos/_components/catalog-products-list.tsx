"use client";

import type { ProductCatalogResponse } from "@/api/stetsom/model";
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
}

export function CatalogProductsList({
  products,
  currentPage,
  totalPages,
  onPageChange,
  isCatalogEmpty = false,
}: CatalogProductsListProps) {
  const t = useTranslations("Catalog");
  const compare = useCompareContext();
  const { mode, selectedSlugs, selectProduct, isProductSelected } = compare;

  const isSelecting = mode === "selecting";

  if (products.length === 0) {
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
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            category={product.category}
            variants={product.variants}
            img={product.thumbnail_url ?? undefined}
            href={product.href}
            variantDirection="column"
            compareMode={isSelecting}
            isCompareSelected={isProductSelected(product.slug)}
            compareDisabled={
              selectedSlugs.length >= 2 && !isProductSelected(product.slug)
            }
            onCompareToggle={() => selectProduct(product.slug)}
            compareLabel={t("compareBadge")}
            compareSelectedLabel={t("compareBadgeSelected")}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={currentPage <= 1}
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
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-10 border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-brand disabled:opacity-40 disabled:hover:text-muted-foreground"
          >
            {t("paginationNext")}
          </button>
        </div>
      )}
    </>
  );
}
