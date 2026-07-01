"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

import type { BlockComponentProps } from "./types";

export function HtmlBlock({ block, rootProps }: BlockComponentProps) {
  const rawHtml = block.data.html as string;
  const safeHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
  });

  return (
    <article
      id={rootProps.id}
      data-block-scope={rootProps["data-block-scope"]}
      data-editor-target={rootProps["data-editor-target"]}
      className={cn("blockHtml", rootProps.className)}
      style={rootProps.style}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
