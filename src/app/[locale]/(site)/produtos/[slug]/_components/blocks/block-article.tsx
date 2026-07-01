import { cn } from "@/lib/utils";

import type { BlockRootProps } from "./types";

interface BlockArticleProps extends React.ComponentPropsWithoutRef<"article"> {
  /** Identity + background props built by the BlockRenderer. */
  root: BlockRootProps;
  /** BEM base class for the block (e.g. `blockText`). */
  baseClass: string;
}

/**
 * Root `<article>` shared by every block. Always carries the resolved `id` and
 * `data-block-scope` so author CSS can target the block instance, plus the BEM
 * base class and any background styling.
 */
export function BlockArticle({
  root,
  baseClass,
  className,
  children,
  ...rest
}: BlockArticleProps) {
  return (
    <article
      id={root.id}
      data-block-scope={root["data-block-scope"]}
      data-editor-target={root["data-editor-target"]}
      className={cn(baseClass, root.className, className)}
      style={root.style}
      {...rest}
    >
      {children}
    </article>
  );
}
