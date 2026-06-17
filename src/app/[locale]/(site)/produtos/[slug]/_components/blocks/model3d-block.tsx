"use client";

import { toModel3dBlockData } from "@/lib/utils/product";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import { BlockArticle } from "./block-article";
import type { BlockComponentProps } from "./types";

// three.js is client-only and heavy — load it lazily, never on the server.
const Model3DViewer = dynamic(
  () => import("@/components/ui/model-3d-viewer").then((m) => m.Model3DViewer),
  { ssr: false },
);

export function Model3DBlock({ block, rootProps }: BlockComponentProps) {
  const t = useTranslations("ProductDetail");
  const {
    url: modelUrl,
    backgroundColor,
    backgroundImage,
  } = toModel3dBlockData(block.data);

  if (!modelUrl) return null;

  return (
    <BlockArticle
      root={rootProps}
      baseClass="blockModel3d"
      className="aspect-video w-full"
    >
      <Model3DViewer
        url={modelUrl}
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage}
        loadingLabel={t("blockModel3dLoading")}
      />
    </BlockArticle>
  );
}
