import type { ProductBlock } from "@/api/stetsom/model";
import type { CSSProperties } from "react";

/** Identity, scope and background props applied to a block's root `<article>`. */
export interface BlockRootProps {
  id: string;
  "data-block-scope": string;
  /** Background utility classes computed from the block style. */
  className?: string;
  style?: CSSProperties;
}

export interface BlockComponentProps {
  block: ProductBlock;
  productName: string;
  fallbackImage: string;
  /** True when the block breaks out of the page container (edge to edge). */
  fullWidth?: boolean;
  rootProps: BlockRootProps;
}
