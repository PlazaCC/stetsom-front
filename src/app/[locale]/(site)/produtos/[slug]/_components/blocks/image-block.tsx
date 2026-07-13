"use client";

/* eslint-disable @next/next/no-img-element -- CMS blocks can reference dynamic hosts that next/image does not allow. */

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
  const hasHeading = Boolean(title || description);

  if (data.layout === "side") {
    return (
      <BlockArticle root={rootProps} baseClass="blockImage">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          {/* Imagem: 50% no desktop */}
          <div className="flex w-full flex-col gap-3 lg:w-1/2">
            {images.map((src, i) => (
              <div
                key={`${block.block_id}-${i}`}
                className="blockImage__item relative w-full"
              >
                <img
                  src={src}
                  alt={`${productName} visual ${i + 1}`}
                  className="blockImage__image h-auto w-full"
                />
              </div>
            ))}
          </div>
          {/* Conteúdo ao lado — só renderiza (e só ganha padding) com conteúdo */}
          {hasHeading && (
            <div className="blockImage__content w-full px-4 lg:w-1/2 lg:px-10">
              <BlockHeader
                title={title}
                description={description}
                classPrefix="blockImage"
              />
            </div>
          )}
        </div>
        {data.caption && (
          <p className="blockImage__caption mt-3 text-sm text-text-subtle">
            {data.caption}
          </p>
        )}
      </BlockArticle>
    );
  }

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
