"use client";

import type { ProductBlock } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import {
  resolveTextAlignClass,
  toImageBlockData,
  toTextBlockData,
} from "@/lib/utils/product";
import DOMPurify from "dompurify";
import Image from "next/image";
import { useTranslations } from "next-intl";

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
            key={`${block.id}-${i}`}
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
    const title = block.data.title ?? t("blockVideoFeatured", { productName });
    const description =
      block.data.description ?? t("blockVideoDefaultDescription");
    const videoUrl = block.data.video_url;
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
    const rawHtml = block.data.html;
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
    const modelUrl = block.data.file_url;
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

  return null;
}
