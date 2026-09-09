"use client";

import type {
  ProductBlock,
  ProductCardItem,
  ProductFile,
  ProductImage,
  PublicVariant,
} from "@/api/stetsom/model";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductCard } from "@/components/ui/product-card";
import { cn } from "@/lib/utils";
import { ChevronDown, GitCompareArrows, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { BlockRenderer } from "./block-renderer";
import { ProductLightbox } from "./product-lightbox";
import { SpecsTable } from "./specs-table";
import { StickySectionNav } from "./sticky-section-nav";

/** Locale-resolved, public-shaped product payload consumed by the detail view. */
export interface ProductDetailViewData {
  product: {
    slug: string;
    name: string;
    description?: string | null;
    images: ProductImage[];
    variants: PublicVariant[];
    page_blocks: ProductBlock[];
    files: ProductFile[];
    highlight_attributes: string[];
    app_store_url?: string | null;
    play_store_url?: string | null;
  };
  category: { name: string; slug: string };
  /** Product's line within the category, resolved server-side for the breadcrumb. */
  line?: { name: string; slug: string } | null;
  relatedProducts: ProductCardItem[];
}

interface ProductDetailViewProps {
  data: ProductDetailViewData;
  /** Render with plain `<img>` (blob-safe) and drop navigation chrome. */
  previewMode?: boolean;
  /**
   * CMS editor mode: stamp `data-editor-target` on editable regions so the
   * product editor can select them. Inert (and absent) on the public site.
   */
  editable?: boolean;
}

/** `next/image` does not accept `blob:` sources, so the live preview falls back to `<img>`. */
function DetailImage({
  src,
  alt,
  className,
  sizes,
  priority,
  previewMode,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  previewMode?: boolean;
  style?: React.CSSProperties;
}) {
  if (previewMode) {
    return (
      // arbitrary remote hosts aren't valid for next/image in the live preview.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
        style={style}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={style}
    />
  );
}

/**
 * Main gallery image with a hover-to-zoom effect: while the pointer is over
 * the frame the image scales up and its transform-origin tracks the cursor, so
 * moving the mouse pans across the magnified image within the square. Falls
 * back to a static image on touch (no hover) and when `disabled` (editor mode).
 */
function ZoomableImage({
  src,
  alt,
  sizes,
  previewMode,
  disabled,
  onOpen,
}: {
  src: string;
  alt: string;
  sizes?: string;
  previewMode?: boolean;
  disabled?: boolean;
  /** Opens the fullscreen viewer when the image is clicked. */
  onOpen?: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  if (disabled) {
    return (
      <DetailImage
        src={src}
        alt={alt}
        priority
        sizes={sizes}
        className="object-contain p-6"
        previewMode={previewMode}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 cursor-zoom-in"
      onClick={onOpen}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMove}
    >
      <DetailImage
        src={src}
        alt={alt}
        priority
        sizes={sizes}
        className="object-contain p-6 transition-transform duration-100 ease-out"
        style={{
          transformOrigin: origin,
          transform: zoomed ? "scale(2.2)" : "scale(1)",
        }}
        previewMode={previewMode}
      />
    </div>
  );
}

export function ProductDetailView({
  data,
  previewMode = false,
  editable = false,
}: ProductDetailViewProps) {
  const t = useTranslations("ProductDetail");
  const { product, category, relatedProducts, line = null } = data;

  /** Stamp a `data-editor-target` only in editor mode; inert otherwise. */
  const ed = (target: string) =>
    editable ? { "data-editor-target": target } : {};

  const sortedImages = [...product.images].sort((a, b) => a.order - b.order);
  const galleryImages = sortedImages
    .map((img) => img.image_url)
    .filter(Boolean) as string[];
  const thumbnailUrl = sortedImages[0]?.image_url ?? null;

  // The gallery is keyed by index rather than resetting via an effect — an
  // out-of-range index (e.g. the editor removes images) just falls back to 0.
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = activeIndex < galleryImages.length ? activeIndex : 0;
  const activeImage = galleryImages[safeIndex] ?? thumbnailUrl;

  // Wrap-around navigation used by the mobile photo marker (swipe).
  const goToIndex = (index: number) => {
    if (galleryImages.length === 0) return;
    setActiveIndex(
      ((index % galleryImages.length) + galleryImages.length) %
        galleryImages.length,
    );
  };

  // Fullscreen viewer state — `null` means closed; `lightboxIndex` tracks the
  // image shown in the overlay while `activeIndex` keeps the main gallery in
  // sync (both stay aligned via `handleLightboxIndexChange`).
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const openLightbox = (index: number) => {
    if (galleryImages.length === 0) return;
    setLightboxIndex(
      ((index % galleryImages.length) + galleryImages.length) %
        galleryImages.length,
    );
  };
  const closeLightbox = () => setLightboxIndex(null);
  const handleLightboxIndexChange = (index: number) => {
    setLightboxIndex(index);
    setActiveIndex(index);
  };
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || galleryImages.length < 2) {
      touchStartX.current = null;
      return;
    }
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goToIndex(safeIndex + 1);
    else goToIndex(safeIndex - 1);
  };

  const blocks = [...product.page_blocks].sort((a, b) => a.order - b.order);
  const files = product.files ?? [];
  const manualFile =
    files.find((f) => f.type === "MANUAL" && f.is_active) ??
    files.find((f) => f.type === "MANUAL");
  const imagePackFile =
    files.find((f) => f.type === "IMAGE_PACK" && f.is_active) ??
    files.find((f) => f.type === "IMAGE_PACK");
  const certificateFiles = files.filter(
    (file) => file.type === "CERTIFICATE" && file.is_active && file.file_url,
  );

  // App-store links are per-product and optional; a missing/blank link hides
  // its menu item, and the whole button hides when neither is set.
  const appStoreUrl = product.app_store_url?.trim() || null;
  const playStoreUrl = product.play_store_url?.trim() || null;
  const hasAppLinks = Boolean(appStoreUrl || playStoreUrl);

  const sortedVariants = [...product.variants].sort(
    (a, b) => a.order - b.order,
  );
  const firstVariantAttrs = sortedVariants[0]
    ? [...sortedVariants[0].attributes].sort((a, b) => a.order - b.order)
    : [];
  // An attribute may be listed more than once to build a matrix cell. The
  // highlight strip is a single headline figure per attribute, so it keeps only
  // the first occurrence — repeating one would also duplicate its React key.
  const highlights = firstVariantAttrs
    .filter(
      (attr, i, list) =>
        product.highlight_attributes.includes(attr.attribute_id) &&
        list.findIndex((a) => a.attribute_id === attr.attribute_id) === i,
    )
    .slice(0, 3);
  const allAttrKeys = sortedVariants.reduce<
    { attribute_id: string; attribute_name?: string | null }[]
  >((acc, variant) => {
    const sorted = [...variant.attributes].sort((a, b) => a.order - b.order);
    for (const attr of sorted) {
      if (!acc.some((a) => a.attribute_id === attr.attribute_id)) {
        acc.push({
          attribute_id: attr.attribute_id,
          attribute_name: attr.attribute_name,
        });
      }
    }
    return acc;
  }, []);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: t("breadcrumbHome"), href: "/" },
    { label: t("breadcrumbProducts"), href: "/produtos" },
    {
      label: category.name,
      href: `/produtos?category=${encodeURIComponent(category.slug)}`,
    },
    ...(line
      ? [
          {
            label: line.name,
            href: `/produtos?category=${encodeURIComponent(category.slug)}&line=${encodeURIComponent(line.slug)}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <section className="bg-card py-6 lg:py-24">
        <Container>
          {!previewMode && <Breadcrumb items={breadcrumbItems} />}

          <div
            className={cn(
              "flex flex-col lg:flex-row lg:items-start lg:gap-12",
              !previewMode && "mt-6",
            )}
          >
            <div className="flex shrink-0 flex-col gap-4 lg:w-111.75">
              <div
                {...ed("images")}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="relative flex h-80 w-full touch-pan-y items-center justify-center overflow-hidden rounded-2xl border border-border bg-card sm:h-100 lg:h-120"
              >
                {activeImage && (
                  <ZoomableImage
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    sizes="(max-width: 1024px) 100vw, 447px"
                    previewMode={previewMode}
                    disabled={editable}
                    onOpen={() => openLightbox(safeIndex)}
                  />
                )}

                {galleryImages.length > 1 && (
                  <div
                    aria-live="polite"
                    aria-label={t("photoCounter", {
                      current: safeIndex + 1,
                      total: galleryImages.length,
                    })}
                    className="absolute top-3 right-3 z-10 rounded bg-neutral-900/70 px-2.5 py-1 font-sans text-xs font-semibold text-white lg:hidden"
                  >
                    {safeIndex + 1}/{galleryImages.length}
                  </div>
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="hidden items-center gap-3 overflow-x-auto pb-1 lg:flex">
                  {galleryImages.slice(0, 4).map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-pressed={index === safeIndex}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "relative h-19 w-19 shrink-0 overflow-hidden rounded bg-card",
                        index === safeIndex
                          ? "border-2 border-primary"
                          : "border border-border",
                      )}
                    >
                      <DetailImage
                        src={image}
                        alt={t("thumbnail", {
                          name: product.name,
                          index: index + 1,
                        })}
                        sizes="72px"
                        className="object-cover"
                        previewMode={previewMode}
                      />
                    </button>
                  ))}
                </div>
              )}

              {files.length > 0 && (
                <p className="font-sans text-2xs tracking-wide text-muted-foreground uppercase">
                  {t("filesAvailable", { count: files.length })}
                </p>
              )}
            </div>

            <div className="mt-6 flex-1 lg:mt-0 lg:max-w-119">
              <p
                {...ed("category")}
                className="font-sans-condensed text-2xs font-black text-brand uppercase"
              >
                {category.name}
              </p>
              <h1
                {...ed("title")}
                className="mt-2 font-sans-condensed text-4xl leading-none font-black text-brand-dark uppercase lg:text-display-sm"
              >
                {product.name}
              </h1>
              {product.description && (
                <p
                  {...ed("description")}
                  className="mt-4 text-sm text-text-subtle lg:text-base"
                >
                  {product.description}
                </p>
              )}

              {sortedVariants.length > 1 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("variations")}
                  </span>
                  {sortedVariants.map((item) => (
                    <span
                      key={item.variant_id}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              )}

              {highlights.length > 0 && (
                <div
                  {...ed("highlights")}
                  className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4"
                >
                  {highlights.map((attr) => (
                    <div key={attr.attribute_id}>
                      <p className="font-sans-condensed text-3xl leading-none font-black text-brand uppercase">
                        {attr.value}
                      </p>
                      <p className="font-sans text-2xs tracking-wide text-text-subtle uppercase">
                        {attr.attribute_name ?? attr.attribute_id}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div {...ed("files")} className="mt-5 flex flex-wrap gap-3">
                {manualFile?.file_url && (
                  <a
                    href={manualFile.file_url}
                    target="_blank"
                    className="inline-flex h-10 items-center rounded-sm bg-brand px-5 font-sans text-button-md font-bold tracking-[0.8px] text-white uppercase transition-colors hover:bg-brand/90"
                  >
                    {t("manual")}
                  </a>
                )}
                {imagePackFile?.file_url && (
                  <a
                    href={imagePackFile.file_url}
                    download
                    className="inline-flex h-10 items-center rounded-sm border border-border bg-card px-5 font-sans text-button-md font-semibold tracking-[0.8px] text-brand-dark uppercase transition-colors hover:bg-muted"
                  >
                    {t("downloadPhotos")}
                  </a>
                )}
                {certificateFiles.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-card px-5 font-sans text-button-md font-semibold tracking-[0.8px] text-brand-dark uppercase"
                        >
                          {t("certificates")}
                          <ChevronDown size={16} />
                        </button>
                      }
                    />
                    <DropdownMenuContent
                      align="start"
                      className="w-auto min-w-64"
                    >
                      {certificateFiles.map((certificate) => (
                        <DropdownMenuItem
                          key={certificate.file_id}
                          render={
                            <a
                              href={certificate.file_url ?? undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={
                                certificate.filename ?? certificate.file_id
                              }
                            />
                          }
                        >
                          {certificate.filename ?? certificate.file_id}
                          {certificate.version
                            ? ` — V${certificate.version}`
                            : ""}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                {hasAppLinks && (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          type="button"
                          className="inline-flex h-10 items-center gap-2 rounded-sm border border-border bg-card px-5 font-sans text-button-md font-semibold tracking-[0.8px] text-brand-dark uppercase"
                        >
                          <Smartphone size={16} />
                          {t("downloadApp")}
                          <ChevronDown size={16} />
                        </button>
                      }
                    />
                    <DropdownMenuContent
                      align="start"
                      className="w-auto min-w-48"
                    >
                      {appStoreUrl && (
                        <DropdownMenuItem
                          render={
                            <a
                              href={appStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("downloadIos")}
                            </a>
                          }
                        >
                          {t("downloadIos")}
                        </DropdownMenuItem>
                      )}
                      {playStoreUrl && (
                        <DropdownMenuItem
                          render={
                            <a
                              href={playStoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t("downloadAndroid")}
                            </a>
                          }
                        >
                          {t("downloadAndroid")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <StickySectionNav previewMode={previewMode} />

      {blocks.length > 0 &&
        blocks.map((block) => (
          <BlockRenderer
            key={block.block_id}
            block={block}
            productName={product.name}
            fallbackImage={thumbnailUrl ?? ""}
            editable={editable}
          />
        ))}

      <section
        {...ed("specs")}
        id="specifications"
        className="scroll-mt-section-scroll"
      >
        {allAttrKeys.length > 0 ? (
          <SpecsTable variants={sortedVariants} attributeKeys={allAttrKeys} />
        ) : (
          <div className="bg-white px-5 py-9 lg:px-42.5">
            <p className="font-sans text-sm text-text-subtle">{t("noSpecs")}</p>
          </div>
        )}
      </section>

      <section
        id="related"
        className="scroll-mt-section-scroll bg-off-white py-10 md:py-12 lg:py-16"
      >
        <Container>
          <div className="flex items-center justify-between">
            <h2 className="mt-4 font-sans-condensed text-display-sm leading-none font-black text-brand-dark uppercase">
              {t("related")}
            </h2>
            <Link
              href={`/produtos?category=${encodeURIComponent(category.slug)}${line ? `&line=${encodeURIComponent(line.slug)}` : ""}&first_comparation_product_slug=${product.slug}`}
            >
              <Button variant="brand-outline" size="md">
                <GitCompareArrows size={18} />
                {t("compare")}
              </Button>
            </Link>
          </div>
          {relatedProducts && relatedProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {relatedProducts.slice(0, 6).map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  category={p.category}
                  variants={p.variants}
                  badge={p.is_discontinued ? t("discontinued") : undefined}
                  badgeTone="discontinued"
                  img={p.thumbnail_url ?? undefined}
                  href={p.href}
                  variantDirection="column"
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-base text-text-subtle">{t("noRelated")}</p>
          )}
        </Container>
      </section>

      {lightboxIndex !== null && !editable && (
        <ProductLightbox
          images={galleryImages}
          index={lightboxIndex}
          alt={product.name}
          previewMode={previewMode}
          onIndexChange={handleLightboxIndexChange}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
