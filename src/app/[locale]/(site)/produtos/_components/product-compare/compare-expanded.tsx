"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeftRight, X } from "lucide-react";
import { useCompareContext } from "./compare-provider";
import { CompareColumn } from "./compare-column";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getApiProductsSlug } from "@/api/stetsom/endpoints/products-public/products-public";
import type {
  LocaleInput,
  ProductCardItem,
  ProductImage,
  PublicVariant,
  PublicVariantAttr,
} from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

interface CompareProductData {
  slug: string;
  name: string;
  description?: string | null;
  category: string;
  images: ProductImage[];
  variants: PublicVariant[];
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

/** Compact mobile: product header chip with image, name, variant selector. */
function MobileProductHeader({
  product,
  variantId,
  onVariantChange,
  onReplace,
}: {
  product: CompareProductData;
  variantId: string;
  onVariantChange: (id: string) => void;
  onReplace: () => void;
}) {
  const t = useTranslations("Catalog");
  const sorted = [...product.variants].sort((a, b) => a.order - b.order);
  const sortedImages = [...product.images]
    .filter((i) => i.image_url)
    .sort((a, b) => a.order - b.order);
  const thumb = sortedImages[0]?.image_url ?? null;

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded border border-border p-2">
      <Button
        variant="ghost"
        size="xs"
        onClick={onReplace}
        className="mb-1 h-auto self-start px-1.5 py-0.5 text-2xs"
        title={t("compareReplace")}
      >
        <ArrowLeftRight size={10} />
        <span className="hidden sm:inline">{t("compareReplace")}</span>
      </Button>
      <div className="flex items-center gap-2">
        {thumb ? (
          <Image
            src={thumb}
            alt={product.name}
            width={48}
            height={40}
            className="h-10 w-12 shrink-0 object-contain"
          />
        ) : (
          <div className="h-10 w-12 shrink-0 rounded bg-muted" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans-condensed text-xs leading-tight font-black text-brand-dark uppercase">
            {product.name}
          </p>
          <p className="font-sans text-2xs text-muted-foreground">
            {product.category}
          </p>
        </div>
      </div>
      {sorted.length > 1 && (
        <select
          value={variantId}
          onChange={(e) => onVariantChange(e.target.value)}
          className="mt-1 h-7 w-full appearance-none rounded-sm border border-border bg-card px-1.5 pr-5 text-2xs font-semibold text-brand-dark outline-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23999999' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 4px center",
            backgroundSize: "10px",
          }}
        >
          {sorted.map((v) => (
            <option key={v.variant_id} value={v.variant_id}>
              {v.name}
            </option>
          ))}
        </select>
      )}
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

  const productA: CompareProductData | null = dataA?.product
    ? {
        slug: slugA,
        name: dataA.product.name,
        description: dataA.product.description,
        category: dataA.category?.name ?? catalogMap.get(slugA)?.category ?? "",
        images: dataA.product.images ?? [],
        variants: dataA.product.variants ?? [],
      }
    : null;

  const productB: CompareProductData | null = dataB?.product
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
    <div className="max-h-[calc(100vh-2rem)] overflow-y-auto rounded-card bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <span className="font-sans-condensed text-xs font-black text-brand-dark uppercase sm:text-sm">
          {t("compare")}
        </span>
        <button
          type="button"
          onClick={exitCompareMode}
          className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand-dark sm:text-sm"
        >
          <X size={14} className="sm:hidden" />
          <X size={16} className="hidden sm:block" />
          {t("compareClose")}
        </button>
      </div>

      <div className="p-3 sm:p-4">
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
          <>
            {/* Desktop: two full CompareColumn components */}
            <div className="hidden flex-col gap-4 md:flex md:flex-row">
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

            {/* Mobile: compact side-by-side + unified specs table */}
            <UnifiedCompareMobile
              productA={productA}
              productB={productB}
              onReplaceA={() => removeProduct(slugA)}
              onReplaceB={() => removeProduct(slugB)}
              className="md:hidden"
            />
          </>
        )}
      </div>
    </div>
  );
}

/** Mobile unified comparison: stacked product headers + single specs table. */
function UnifiedCompareMobile({
  productA,
  productB,
  onReplaceA,
  onReplaceB,
  className,
}: {
  productA: CompareProductData | null;
  productB: CompareProductData | null;
  onReplaceA: () => void;
  onReplaceB: () => void;
  className?: string;
}) {
  const t = useTranslations("Catalog");

  const defaultA =
    productA?.variants?.sort((a, b) => a.order - b.order)[0]?.variant_id ?? "";
  const defaultB =
    productB?.variants?.sort((a, b) => a.order - b.order)[0]?.variant_id ?? "";

  const [variantA, setVariantA] = useState<string>(defaultA);
  const [variantB, setVariantB] = useState<string>(defaultB);

  const activeA = productA?.variants?.length
    ? (productA.variants
        .sort((a, b) => a.order - b.order)
        .find((v) => v.variant_id === variantA) ??
      productA.variants.sort((a, b) => a.order - b.order)[0])
    : null;

  const activeB = productB?.variants?.length
    ? (productB.variants
        .sort((a, b) => a.order - b.order)
        .find((v) => v.variant_id === variantB) ??
      productB.variants.sort((a, b) => a.order - b.order)[0])
    : null;

  // Unified attribute keys: collect all unique attribute names from BOTH products
  const allAttrKeys = (() => {
    const map = new Map<string, string | null>();
    const addVariant = (
      v: {
        attributes: PublicVariantAttr[];
      } | null,
    ) => {
      if (!v) return;
      for (const attr of v.attributes.sort((a, b) => a.order - b.order)) {
        if (!map.has(attr.attribute_id)) {
          map.set(attr.attribute_id, attr.attribute_name ?? null);
        }
      }
    };
    // Add from all variants of both products for completeness
    productA?.variants?.forEach(addVariant);
    productB?.variants?.forEach(addVariant);
    return Array.from(map.entries()).map(([id, name]) => ({
      attribute_id: id,
      attribute_name: name,
    }));
  })();

  if (!productA || !productB) return null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Side-by-side product headers */}
      <div className="flex gap-2">
        <MobileProductHeader
          product={productA}
          variantId={variantA}
          onVariantChange={setVariantA}
          onReplace={onReplaceA}
        />
        <MobileProductHeader
          product={productB}
          variantId={variantB}
          onVariantChange={setVariantB}
          onReplace={onReplaceB}
        />
      </div>

      {/* Unified specs table */}
      {allAttrKeys.length > 0 && (
        <div className="overflow-hidden rounded border border-border">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr] bg-brand-dark">
            <span className="px-2 py-1.5 font-sans text-2xs font-bold text-white uppercase">
              {t("compareVariant")}
            </span>
            <span className="truncate px-1 py-1.5 text-center font-sans text-2xs font-bold text-white uppercase">
              {activeA?.name ?? productA.name}
            </span>
            <span className="truncate px-1 py-1.5 text-center font-sans text-2xs font-bold text-white uppercase">
              {activeB?.name ?? productB.name}
            </span>
          </div>

          {/* Spec rows */}
          {allAttrKeys.map(({ attribute_id, attribute_name }, i) => {
            const valA = activeA?.attributes?.find(
              (a: PublicVariantAttr) => a.attribute_id === attribute_id,
            );
            const valB = activeB?.attributes?.find(
              (a: PublicVariantAttr) => a.attribute_id === attribute_id,
            );
            return (
              <div
                key={attribute_id}
                className={cn(
                  "grid grid-cols-[2fr_1fr_1fr]",
                  i % 2 === 0 ? "bg-muted/50" : "bg-white",
                )}
              >
                <span className="px-2 py-1.5 font-sans text-2xs font-medium wrap-break-word text-brand-dark capitalize">
                  {attribute_name ?? attribute_id}
                </span>
                <span className="px-1 py-1.5 text-center font-sans text-2xs text-text-subtle">
                  {valA?.value || "—"}
                </span>
                <span className="border-l border-border px-1 py-1.5 text-center font-sans text-2xs text-text-subtle">
                  {valB?.value || "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
