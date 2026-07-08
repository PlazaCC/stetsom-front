"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useCompareContext } from "./compare-provider";
import { CompareColumn } from "./compare-column";
import { Skeleton } from "@/components/ui/skeleton";
import { getApiProductsSlug } from "@/api/stetsom/endpoints/products-public/products-public";
import type { LocaleInput, ProductCardItem } from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";

interface CompareExpandedProps {
  /** Map of slug → ProductCardItem for lookup */
  catalogMap: Map<string, ProductCardItem>;
}

/** Fetches full product details for a slug using the public API. */
function useProductDetail(slug: string, locale: LocaleInput) {
  return useQuery({
    queryKey: ["compare-product", slug],
    queryFn: ({ signal }) => getApiProductsSlug(slug, { locale }, signal),
    enabled: !!slug,
  });
}

function CompareColumnSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-border bg-white p-4">
      <Skeleton className="mb-3 h-48 w-full rounded-md sm:h-56" />
      <Skeleton className="mb-2 h-3 w-20" />
      <Skeleton className="mb-3 h-5 w-40" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="mb-2 h-3 w-3/4" />
      <Skeleton className="mt-4 h-20 w-full" />
    </div>
  );
}

export function CompareExpanded({ catalogMap }: CompareExpandedProps) {
  const t = useTranslations("Catalog");
  const locale = useLocale();
  const apiLocale = toApiLocale(locale);
  const { selectedSlugs, exitCompareMode, removeProduct } = useCompareContext();

  const [slugA, slugB] = selectedSlugs;

  const resultA = useProductDetail(slugA, apiLocale);
  const resultB = useProductDetail(slugB, apiLocale);

  const isLoading = resultA.isLoading || resultB.isLoading;
  const isError = resultA.isError || resultB.isError;

  const dataA = resultA.data;
  const dataB = resultB.data;

  // Build product objects from API response or fall back to card data
  const productA = dataA?.product
    ? {
        slug: slugA,
        name: dataA.product.name,
        description: dataA.product.description,
        category: dataA.category?.name ?? catalogMap.get(slugA)?.category ?? "",
        images: dataA.product.images ?? [],
        variants: dataA.product.variants ?? [],
      }
    : null;

  const productB = dataB?.product
    ? {
        slug: slugB,
        name: dataB.product.name,
        description: dataB.product.description,
        category: dataB.category?.name ?? catalogMap.get(slugB)?.category ?? "",
        images: dataB.product.images ?? [],
        variants: dataB.product.variants ?? [],
      }
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8">
      <div className="mx-4 w-full max-w-5xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between rounded-t-lg bg-white px-6 py-4 shadow-sm">
          <span className="font-sans-condensed text-sm font-black text-brand-dark uppercase">
            {t("compare")}
          </span>
          <button
            type="button"
            onClick={exitCompareMode}
            className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand-dark"
          >
            <X size={16} />
            {t("compareClose")}
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col gap-4 md:flex-row md:gap-4">
            <CompareColumnSkeleton />
            <CompareColumnSkeleton />
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-white p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("compareLoadError")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:flex-row md:gap-4">
            {productA && (
              <CompareColumn
                product={productA}
                onReplace={() => removeProduct(slugA)}
              />
            )}
            {productB && (
              <CompareColumn
                product={productB}
                onReplace={() => removeProduct(slugB)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
