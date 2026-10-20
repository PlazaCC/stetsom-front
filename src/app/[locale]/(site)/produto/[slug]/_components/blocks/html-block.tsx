"use client";

import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { useSyncExternalStore } from "react";

import type { BlockComponentProps } from "./types";

const subscribe = () => () => {};

/**
 * DOMPurify needs a DOM, so on the server `sanitize` does not exist. The block
 * renders empty during SSR and hydration, then fills in on the client.
 */
function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function HtmlBlock({ block, rootProps }: BlockComponentProps) {
  const isClient = useIsClient();
  // The CMS saves the markup as `content`; `html` is the name this block used
  // to read, kept as a fallback.
  const rawHtml = block.data.content ?? block.data.html;
  if (typeof rawHtml !== "string" || !rawHtml.trim()) return null;

  const safeHtml = isClient
    ? DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } })
    : "";

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
