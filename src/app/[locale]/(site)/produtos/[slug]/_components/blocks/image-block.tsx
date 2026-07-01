"use client";

import { toBlockHeading, toImageBlockData } from "@/lib/utils/product";

import { BlockArticle } from "./block-article";
import { BlockHeader } from "./block-header";
import type { BlockComponentProps } from "./types";

export function ImageBlock({
  block,
  productName,
  fallbackImage,
  rootProps,
}: BlockComponentProps) {
  const data = toImageBlockData(block.data);
  const { title, description } = toBlockHeading(block.data);
  const images = data.images?.length ? data.images : [fallbackImage];

  return (
    <BlockArticle root={rootProps} baseClass="blockImage" className="space-y-3">
      <BlockHeader
        title={title}
        description={description}
        classPrefix="blockImage"
        className="mb-1"
      />
      {images.map((src, i) => (
        <div
          key={`${block.block_id}-${i}`}
          className="blockImage__item relative w-full"
        >
          <img
            src={src}
            alt={`${productName} visual ${i + 1}`}
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="blockImage__image h-auto w-full"
          />
        </div>
      ))}
      {data.caption && (
        <p className="blockImage__caption text-sm text-text-subtle">
          {data.caption}
        </p>
      )}
    </BlockArticle>
  );
}
