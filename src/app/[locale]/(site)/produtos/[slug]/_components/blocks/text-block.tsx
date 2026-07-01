"use client";

import { cn } from "@/lib/utils";
import { resolveTextAlignClass, toTextBlockData } from "@/lib/utils/product";
import { useTranslations } from "next-intl";

import { BlockArticle } from "./block-article";
import type { BlockComponentProps } from "./types";

export function TextBlock({
  block,
  fullWidth,
  rootProps,
}: BlockComponentProps) {
  const t = useTranslations("ProductDetail");
  const data = toTextBlockData(block.data);

  if (!data.content && !data.title) return null;

  return (
    <BlockArticle
      root={rootProps}
      baseClass="blockText"
      className={cn(
        resolveTextAlignClass(data.align),
        fullWidth && "py-4 md:py-8 lg:px-42.5",
      )}
    >
      {data.title && (
        <h2 className="blockText__title font-sans-condensed text-section-title font-black text-brand-dark uppercase">
          {data.title}
        </h2>
      )}
      <p className="blockText__paragraph mt-3 text-sm text-text-subtle md:text-base">
        {data.content}
      </p>
    </BlockArticle>
  );
}
