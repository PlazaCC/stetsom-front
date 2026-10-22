"use client";

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
        fullWidth && "py-4 md:py-8 lg:px-42.5",
      )}
    >
      {data.title && (
        <h2 className="blockText__title font-sans-condensed text-section-title font-black text-brand-dark uppercase">
          {data.title}
        </h2>
      )}
      {data.content && isRichTextContent(data.content) ? (
        // Rich text from the block editor, sanitized by the API on save and
        // again in the public payload. Plain text from before stays below.
        <div
          className={cn(
            "blockText__paragraph mt-3 text-sm text-text-subtle md:text-base",
            BLOCK_TEXT_PROSE,
          )}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      ) : (
        <p className="blockText__paragraph mt-3 text-sm whitespace-pre-line text-text-subtle md:text-base">
          {data.content}
        </p>
      )}
    </BlockArticle>
  );
}
