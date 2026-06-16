"use client";

import type { ProductBlock } from "@/api/stetsom/model";
import { cn } from "@/lib/utils";
import {
  resolveTextAlignClass,
  toGalleryBlockData,
  toImageBlockData,
  toTextBlockData,
} from "@/lib/utils/product";
import DOMPurify from "dompurify";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
  const t = useTranslations("ProductDetail");

  if (block.type === "TEXT") {
    const data = toTextBlockData(block.data);
    return (
      <article className="rounded-xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-sans-condensed text-section-title font-black uppercase text-brand-dark">
          {data.title ?? t("blockTextDefaultTitle")}
        </h2>
        <p
          className={cn(
            "mt-3 text-sm text-text-subtle md:text-base",
            resolveTextAlignClass(data.align),
          )}
        >
          {data.content ?? t("blockTextUnavailable")}
        </p>
      </article>
    );
  }

  if (block.type === "IMAGE") {
    const data = toImageBlockData(block.data);
    const images = data.images?.length ? data.images : [fallbackImage];
    return (
      <article className="space-y-3">
        {images.map((src, i) => (
          <div
            key={`${block.block_id}-${i}`}
            className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-brand-dark"
          >
            <Image
              src={src}
              alt={`${productName} visual ${i + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
          </div>
        ))}
        {data.caption && (
          <p className="text-sm text-text-subtle">{data.caption}</p>
        )}
      </article>
    );
  }

  if (block.type === "VIDEO") {
    const title =
      (block.data.title as string | undefined) ??
      t("blockVideoFeatured", { productName });
    const description =
      (block.data.description as string | undefined) ??
      t("blockVideoDefaultDescription");
    const videoUrl = block.data.video_url as string | undefined;
    return (
      <article className="rounded-xl border border-border bg-card p-6 md:p-8">
        <p className="font-sans-condensed text-xs font-bold uppercase tracking-wider text-brand">
          {t("blockVideoLabel")}
        </p>
        <h3 className="mt-2 font-sans-condensed text-section-title font-black uppercase text-brand-dark">
          {title}
        </h3>
        <p className="mt-3 text-sm text-text-subtle">{description}</p>
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-lg bg-brand px-4 py-2 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-white"
          >
            {t("blockVideoWatch")}
          </a>
        ) : null}
      </article>
    );
  }

  if (block.type === "HTML") {
    const rawHtml = block.data.html as string;
    const safeHtml = DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
    });
    return (
      <article className="rounded-xl border border-border bg-card p-6 md:p-8">
        <p className="font-sans-condensed text-xs font-bold uppercase tracking-wider text-brand">
          {t("blockHtmlLabel")}
        </p>
        <div
          className="mt-3 text-sm text-text-subtle [&_strong]:font-semibold [&_strong]:text-brand-dark"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </article>
    );
  }

  if (block.type === "MODEL3D") {
    const modelUrl = block.data.file_url as string | undefined;
    return (
      <article className="rounded-xl border border-border bg-card p-6 md:p-8">
        <p className="font-sans-condensed text-xs font-bold uppercase tracking-wider text-brand">
          {t("blockModel3dLabel")}
        </p>
        <h3 className="mt-2 font-sans-condensed text-section-title font-black uppercase text-brand-dark">
          {t("blockModel3dTitle")}
        </h3>
        <p className="mt-3 text-sm text-text-subtle">
          {t("blockModel3dDescription")}
        </p>
        {modelUrl ? (
          <a
            href={modelUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-[4px] border border-border bg-white px-4 py-2 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-brand-dark"
          >
            {t("blockModel3dOpen")}
          </a>
        ) : null}
      </article>
    );
  }

  if (block.type === "GALLERY") {
    const { images } = toGalleryBlockData(block.data);
    if (!images.length) return null;
    return (
      <article className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={`${block.block_id}-${i}`}
            className="relative aspect-square w-full overflow-hidden rounded-xl bg-brand-dark"
          >
            <Image
              src={src}
              alt={`${productName} ${t("blockGalleryAlt")} ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </article>
    );
  }

  return null;
}
