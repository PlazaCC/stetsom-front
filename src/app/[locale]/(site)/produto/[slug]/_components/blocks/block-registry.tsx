import type { ProductBlockType } from "@/api/stetsom/model";
import type { ComponentType } from "react";

import { GalleryBlock } from "./gallery-block";
import { HtmlBlock } from "./html-block";
import { ImageBlock } from "./image-block";
import { Model3DBlock } from "./model3d-block";
import { TextBlock } from "./text-block";
import type { BlockComponentProps } from "./types";
import { VideoBlock } from "./video-block";

/** Maps each ProductBlock `type` to its renderer component. */
export const BLOCK_COMPONENTS: Record<
  ProductBlockType,
  ComponentType<BlockComponentProps>
> = {
  TEXT: TextBlock,
  IMAGE: ImageBlock,
  VIDEO: VideoBlock,
  HTML: HtmlBlock,
  MODEL3D: Model3DBlock,
  GALLERY: GalleryBlock,
};
