"use client";

import { RichText } from "@/components/editor/block-text/rich-text";
import { cn } from "@/lib/utils";
import { BLOCK_TEXT_PROSE, isRichTextContent } from "@/lib/utils/block-text";
import { resolveTextAlignClass, toTextBlockData } from "@/lib/utils/product";

import { BlockArticle } from "./block-article";
import type { BlockComponentProps } from "./types";

export function TextBlock({
  block,
  fullWidth,
  rootProps,
}: BlockComponentProps) {
  const data = toTextBlockData(block.data);

  if (!data.content && !data.title) return null;

  return (
    <BlockArticle
      root={rootProps}
      baseClass="blockText"
      className={cn(
        resolveTextAlignClass(data.align),
        "py-4 md:py-8",
        fullWidth && "lg:px-42.5",
      )}
    >
      {data.title && (
        <h2 className="blockText__title font-sans-condensed text-section-title font-black text-brand-dark uppercase">
          {data.title}
        </h2>
      )}
      {data.content && (
        <RichText
          content={data.content}
          className={cn(
            "blockText__paragraph mt-3 text-sm text-text-subtle md:text-base",
            isRichTextContent(data.content) && BLOCK_TEXT_PROSE,
          )}
        />
      )}
    </BlockArticle>
  );
}
