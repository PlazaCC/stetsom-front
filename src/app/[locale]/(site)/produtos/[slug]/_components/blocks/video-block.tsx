"use client";

import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import { getYouTubeEmbedUrl } from "@/lib/utils/product";
import { useTranslations } from "next-intl";

import { BlockArticle } from "./block-article";
import type { BlockComponentProps } from "./types";
import { cn } from "@/lib/utils";

export function VideoBlock({
  block,
  productName,
  rootProps,
  fullWidth,
}: BlockComponentProps) {
  const t = useTranslations("ProductDetail");
  const title =
    (block.data.title as string | undefined) ??
    t("blockVideoFeatured", { productName });
  const description =
    (block.data.description as string | undefined) ??
    t("blockVideoDefaultDescription");
  const videoUrl =
    (block.data.url as string | undefined) ??
    (block.data.video_url as string | undefined);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl) return null;

  return (
    <BlockArticle
      root={rootProps}
      baseClass="blockVideo"
      className={cn("p-6 md:p-8", fullWidth && "lg:px-42.5")}
    >
      {title && (
        <h3 className="blockVideo__title mt-2 font-sans-condensed text-section-title font-black text-brand-dark uppercase">
          {title}
        </h3>
      )}
      {description && (
        <p className="blockVideo__description mt-3 text-sm text-text-subtle">
          {description}
        </p>
      )}
      {embedUrl && videoUrl ? (
        <YouTubeEmbed
          url={videoUrl}
          title={title}
          className="blockVideo__embed mt-5"
        />
      ) : videoUrl ? (
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="blockVideo__link mt-5 inline-flex rounded-lg bg-brand px-4 py-2 font-sans text-button-md font-bold tracking-[0.8px] text-white uppercase"
        >
          {t("blockVideoWatch")}
        </a>
      ) : null}
    </BlockArticle>
  );
}
