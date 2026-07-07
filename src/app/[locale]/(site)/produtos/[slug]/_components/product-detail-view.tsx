"use client";

import type {
  ProductBlock,
  ProductCardItem,
  ProductFile,
  ProductImage,
  PublicVariant,
} from "@/api/stetsom/model";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { BlockRenderer } from "./block-renderer";
import { StickySectionNav } from "./sticky-section-nav";

/** Locale-resolved, public-shaped product payload consumed by the detail view. */
export interface ProductDetailViewData {
  product: {
    name: string;
    description?: string | null;
    images: ProductImage[];
    variants: PublicVariant[];
    page_blocks: ProductBlock[];
    files: ProductFile[];
    highlight_attributes: string[];
  };
  category: { name: string; slug: string };
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
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  previewMode?: boolean;
}) {
  if (previewMode) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full", className)}
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
    />
  );
}

export function ProductDetailView({
  data,
  previewMode = false,
  editable = false,
}: ProductDetailViewProps) {
  const t = useTranslations("ProductDetail");
  const { product, category, relatedProducts } = data;

  /** Stamp a `data-editor-target` only in editor mode; inert otherwise. */
  const ed = (target: string) =>
    editable ? { "data-editor-target": target } : {};

  const sortedImages = [...product.images].sort((a, b) => a.order - b.order);
  const galleryImages = sortedImages
    .slice(0, 4)
    .map((img) => img.image_url)
    .filter(Boolean) as string[];
  const thumbnailUrl = sortedImages[0]?.image_url ?? null;

  const blocks = [...product.page_blocks].sort((a, b) => a.order - b.order);
  const files = product.files ?? [];
  const manualFile =
    files.find((f) => f.type === "MANUAL" && f.is_active) ??
    files.find((f) => f.type === "MANUAL");

  const sortedVariants = [...product.variants].sort(
    (a, b) => a.order - b.order,
  );
  const firstVariantAttrs = sortedVariants[0]
    ? [...sortedVariants[0].attributes].sort((a, b) => a.order - b.order)
    : [];
  const highlights = firstVariantAttrs
    .filter((attr) => product.highlight_attributes.includes(attr.attribute_id))
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
                className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card lg:h-120"
              >
                {thumbnailUrl && (
                  <DetailImage
                    src={thumbnailUrl}
                    alt={product.name}
                    priority
                    sizes="(max-width: 1024px) 100vw, 447px"
                    className="object-contain p-6"
                    previewMode={previewMode}
                  />
                )}
              </div>

              {galleryImages.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className="relative h-19 w-19 shrink-0 overflow-hidden rounded border border-border bg-card"
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
                {manualFile && manualFile.file_url && (
                  <a
                    href={manualFile.file_url}
                    className="inline-flex h-10 items-center rounded-sm bg-brand px-5 font-sans text-button-md font-bold tracking-[0.8px] text-white uppercase transition-colors hover:bg-brand/90"
                  >
                    {t("manual")}
                  </a>
                )}
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-sm border border-border bg-card px-5 font-sans text-button-md font-semibold tracking-[0.8px] text-brand-dark uppercase"
                >
                  {t("downloadPhotos")}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <StickySectionNav />

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

      <section {...ed("specs")} id="specifications" className="scroll-mt-38">
        <div className="border-b border-zinc-200 px-5 py-3 lg:px-42.5">
          <p className="font-sans-condensed text-xs font-black tracking-widest text-muted-foreground uppercase">
            {t("techData")}
          </p>
        </div>
        <div className="bg-off-white px-5 py-4 lg:px-42.5">
          <h2 className="font-sans-condensed text-display-sm leading-none font-black text-brand-dark uppercase">
            {t("techSpecifications")}
          </h2>
        </div>
        {allAttrKeys.length > 0 ? (
          <div className="bg-white pb-9">
            <div className="w-full overflow-x-auto">
              {sortedVariants.length > 1 && (
                <div
                  className="grid items-center gap-8 bg-brand-dark px-5 py-4.5 lg:px-42.5"
                  style={{
                    gridTemplateColumns: `1fr repeat(${sortedVariants.length}, minmax(120px, 1fr))`,
                  }}
                >
                  <span />
                  {sortedVariants.map((v) => (
                    <span
                      key={v.variant_id}
                      className="font-sans text-sm font-bold text-white uppercase"
                    >
                      {v.name}
                    </span>
                  ))}
                </div>
              )}
              {allAttrKeys.map(({ attribute_id, attribute_name }, i) => (
                <div
                  key={attribute_id}
                  className={cn(
                    "grid items-center gap-8 px-5 py-4.5 lg:px-42.5",
                    i % 2 === 0 ? "bg-muted" : "bg-white",
                  )}
                  style={{
                    gridTemplateColumns:
                      sortedVariants.length > 1
                        ? `1fr repeat(${sortedVariants.length}, minmax(120px, 1fr))`
                        : "1fr 1fr",
                  }}
                >
                  <span className="font-sans text-sm font-medium text-brand-dark capitalize">
                    {attribute_name ?? attribute_id}
                  </span>
                  {sortedVariants.map((v) => {
                    const attr = v.attributes.find(
                      (a) => a.attribute_id === attribute_id,
                    );
                    return (
                      <span
                        key={v.variant_id}
                        className="font-sans text-sm text-text-subtle"
                      >
                        {attr?.value || "—"}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white px-5 py-9 lg:px-42.5">
            <p className="font-sans text-sm text-text-subtle">{t("noSpecs")}</p>
          </div>
        )}
      </section>

      <section
        id="related"
        className="scroll-mt-38 bg-off-white py-10 md:py-12 lg:py-16"
      >
        <Container>
          <div className="border-b border-zinc-200 pb-3">
            <p className="font-sans-condensed text-xs font-black tracking-widest text-muted-foreground uppercase">
              {t("recommendations")}
            </p>
          </div>
          <h2 className="mt-4 font-sans-condensed text-display-sm leading-none font-black text-brand-dark uppercase">
            {t("related")}
          </h2>
          {relatedProducts && relatedProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {relatedProducts.slice(0, 6).map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  category={p.category}
                  variants={p.variants}
                  badge={p.is_discontinued ? "Discontinued" : undefined}
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
    </>
  );
}
