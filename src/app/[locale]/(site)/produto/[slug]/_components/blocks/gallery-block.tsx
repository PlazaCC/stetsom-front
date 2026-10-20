"use client";

import { toBlockHeading, toGalleryBlockData } from "@/lib/utils/product";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { BlockArticle } from "./block-article";
import { BlockHeader } from "./block-header";
import type { BlockComponentProps } from "./types";
import { cn } from "@/lib/utils";

export function GalleryBlock({
  block,
  productName,
  rootProps,
  fullWidth,
}: BlockComponentProps) {
  const t = useTranslations("ProductDetail");
  const { images } = toGalleryBlockData(block.data);
  const { title, description } = toBlockHeading(block.data);

  if (!images.length) return null;

  return (
    <BlockArticle
      root={rootProps}
      baseClass="blockGallery"
      className={cn("space-y-4 py-8", fullWidth && "lg:px-42.5")}
    >
      <BlockHeader
        title={title}
        description={description}
        classPrefix="blockGallery"
      />
      <div className="blockGallery__grid grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={`${block.block_id}-${i}`}
            className="blockGallery__item relative aspect-square w-full overflow-hidden rounded-xl bg-brand-dark"
          >
            <Image
              src={src}
              alt={`${productName} ${t("blockGalleryAlt")} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="blockGallery__image object-cover"
            />
          </div>
        ))}
      </div>
    </BlockArticle>
  );
}
