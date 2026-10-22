"use client";

import { LayoutGrid, Layers } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

/**
 * Card data for the intermediate "line" step of the catalog: a line within a
 * category, with the thumbnail of its most recently added product.
 */
export interface CatalogLineCardData {
  line_id: string;
  name: string;
  slug: string;
  cover_url: string | null;
}

interface CatalogLinesGridProps {
  lines: CatalogLineCardData[];
  allProductsCoverUrl: string | null;
  onSelectLine: (slug: string) => void;
  onSelectAll: () => void;
}

/**
 * Grid of line cards shown when a category is chosen but no line yet: each card
 * shows the line's name over the cover of its most recently added product.
 */
export function CatalogLinesGrid({
  lines,
  allProductsCoverUrl,
  onSelectLine,
  onSelectAll,
}: CatalogLinesGridProps) {
  const t = useTranslations("Catalog");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {/* "Ver todos os produtos" card — mesmo formato dos cards de linha. */}
      <button
        type="button"
        onClick={onSelectAll}
        className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-white transition-colors hover:border-brand"
      >
        <span className="relative block aspect-square w-full overflow-hidden bg-off-white">
          <span className="flex h-full w-full items-center justify-center">
            {allProductsCoverUrl ? (
              <Image
                src={allProductsCoverUrl}
                alt={t("allLines")}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-2"
              />
            ) : (
              <LayoutGrid
                size={48}
                strokeWidth={1}
                aria-hidden
                className="text-muted-foreground/30"
              />
            )}
          </span>
        </span>
        <span className="flex min-h-14 flex-col items-center justify-center px-4 py-3 text-center lg:px-5 lg:py-3.5">
          <span className="font-sans-condensed text-base leading-tight font-black text-brand-dark uppercase transition-colors group-hover:text-brand lg:text-lg">
            {t("allLines")}
          </span>
        </span>
      </button>

      {lines.map((line) => (
        <button
          key={line.line_id}
          type="button"
          onClick={() => onSelectLine(line.slug)}
          className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-white transition-colors hover:border-brand"
        >
          <span className="relative block aspect-square w-full overflow-hidden bg-off-white">
            {line.cover_url ? (
              <Image
                src={line.cover_url}
                alt={line.name}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-contain p-2"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <Layers
                  size={48}
                  strokeWidth={1}
                  aria-hidden
                  className="text-muted-foreground/30"
                />
              </span>
            )}
          </span>
          <span className="flex min-h-14 flex-col items-center justify-center px-4 py-3 text-center lg:px-5 lg:py-3.5">
            <span className="font-sans-condensed text-base leading-tight font-black text-brand-dark uppercase transition-colors group-hover:text-brand lg:text-lg">
              {line.name}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
