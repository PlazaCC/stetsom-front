"use client";

import type { ProductBlock } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { scopeBlockCss, toBlockStyle } from "@/lib/utils/product";

import { BLOCK_COMPONENTS } from "./blocks/block-registry";
import type { BlockRootProps } from "./blocks/types";

interface BlockRendererProps {
  block: ProductBlock;
  productName: string;
  fallbackImage: string;
}

export function BlockRenderer({
  block,
  productName,
  fallbackImage,
}: BlockRendererProps) {
  const BlockComponent = BLOCK_COMPONENTS[block.type];
  if (!BlockComponent) return null;

  const style = toBlockStyle(block.data);
  // The auto id (block_id) is always present; custom_id overrides it.
  const scope = style.customId || block.block_id;
  const hasBackground = Boolean(
    style.backgroundColor || style.backgroundImageUrl,
  );
  const scopedCss = scopeBlockCss(style.customCss, scope);

  const rootProps: BlockRootProps = {
    id: scope,
    "data-block-scope": scope,
    className: cn(style.backgroundImageUrl && "bg-cover bg-center"),
    style: hasBackground
      ? {
          backgroundColor: style.backgroundColor,
          backgroundImage: style.backgroundImageUrl
            ? `url(${style.backgroundImageUrl})`
            : undefined,
        }
      : undefined,
  };

  const blockEl = (
    <BlockComponent
      block={block}
      productName={productName}
      fallbackImage={fallbackImage}
      fullWidth={style.fullWidth}
      rootProps={rootProps}
    />
  );

  return (
    <>
      {scopedCss && <style dangerouslySetInnerHTML={{ __html: scopedCss }} />}
      {/* full-width breaks out of the page gutter; otherwise stay in container */}
      {style.fullWidth ? blockEl : <Container>{blockEl}</Container>}
    </>
  );
}
