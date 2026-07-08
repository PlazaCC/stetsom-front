"use client";

import type {
  ProductImage,
  PublicVariant,
  PublicVariantAttr,
} from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import { ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

interface CompareColumnProduct {
  slug: string;
  name: string;
  description?: string | null;
  category: string;
  images: ProductImage[];
  variants: PublicVariant[];
}

interface CompareColumnProps {
  product: CompareColumnProduct;
  onReplace: () => void;
}

export function CompareColumn({ product, onReplace }: CompareColumnProps) {
  const t = useTranslations("Catalog");
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.variant_id ?? "",
  );

  const sortedVariants = [...product.variants].sort(
    (a, b) => a.order - b.order,
  );
  const activeVariant =
    sortedVariants.find((v) => v.variant_id === selectedVariantId) ??
    sortedVariants[0];

  const sortedImages = [...product.images]
    .filter((img) => img.image_url)
    .sort((a, b) => a.order - b.order);
  const mainImage = sortedImages[0]?.image_url ?? null;

  // Collect all unique attribute keys across all variants
  const allAttrKeys = sortedVariants.reduce<
    { attribute_id: string; attribute_name?: string | null }[]
  >((acc, v) => {
    const sorted = [...v.attributes].sort((a, b) => a.order - b.order);
    for (const attr of sorted) {
      if (!acc.some((a) => a.attribute_id === attr.attribute_id)) {
        acc.push({
          attribute_id: attr.attribute_id,
          attribute_name: attr.attribute_name,
        });
      }
    }
    return acc;
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-border bg-white">
      {/* Replace button */}
      <div className="relative flex items-center justify-end p-2">
        <button
          type="button"
          onClick={onReplace}
          className="absolute top-2 left-2 z-10 flex cursor-pointer items-center gap-1 rounded bg-white/90 px-2 py-1 text-2xs font-semibold text-muted-foreground shadow-xs transition-colors hover:text-brand-dark"
          title={t("compareReplace")}
        >
          <ArrowLeftRight size={12} />
          {t("compareReplace")}
        </button>
      </div>

      {/* Image */}
      <div className="flex items-center justify-center px-4 pb-2">
        <div className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-md bg-card sm:h-56">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              width={200}
              height={180}
              className="max-h-full max-w-full object-contain p-3"
            />
          ) : (
            <div className="h-32 w-32 rounded bg-muted" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 border-t border-border p-4">
        {/* Category */}
        <span className="font-sans-condensed text-2xs font-black text-brand uppercase">
          {product.category}
        </span>

        {/* Name */}
        <h3 className="font-sans-condensed text-lg leading-tight font-black text-brand-dark uppercase">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="line-clamp-3 text-xs leading-relaxed text-text-subtle">
            {product.description}
          </p>
        )}

        {/* Variant selector */}
        {sortedVariants.length > 1 && (
          <div className="mt-auto border-t border-border pt-3">
            <label className="mb-1 block font-sans text-2xs font-medium text-muted-foreground uppercase">
              {t("compareVariant")}
            </label>
            <select
              value={selectedVariantId}
              onChange={(e) => setSelectedVariantId(e.target.value)}
              className="h-9 w-full appearance-none rounded-sm border border-border bg-card px-2.5 pr-7 text-sm font-semibold text-brand-dark outline-none focus:border-brand"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
                backgroundSize: "12px",
              }}
            >
              {sortedVariants.map((v) => (
                <option key={v.variant_id} value={v.variant_id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Specs table */}
        {allAttrKeys.length > 0 && (
          <div className="border-t border-border pt-3">
            <div className="flex flex-col gap-1">
              {allAttrKeys.map(({ attribute_id, attribute_name }, i) => {
                const attr = activeVariant?.attributes?.find(
                  (a: PublicVariantAttr) => a.attribute_id === attribute_id,
                );
                return (
                  <div
                    key={attribute_id}
                    className={cn(
                      "flex items-baseline justify-between gap-2 rounded-sm px-2 py-1.5",
                      i % 2 === 0 ? "bg-muted/50" : "bg-transparent",
                    )}
                  >
                    <span className="font-sans text-2xs font-medium text-brand-dark capitalize">
                      {attribute_name ?? attribute_id}
                    </span>
                    <span className="text-right font-sans text-2xs text-text-subtle">
                      {attr?.value || "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
