import { type BreadcrumbItem, Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { getCmsProvider } from "@/lib/api/provider";
import { formatSpecKey } from "@/lib/utils/product";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "./_components/product-detail-content";
import { StickySectionNav } from "./_components/sticky-section-nav";
type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ variation?: string }>;
};

function toImageList(data: Record<string, unknown>): string[] {
  const images = data.images;

  if (!Array.isArray(images)) {
    return [];
  }

  return images.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
}

export default async function ProdutoDetalhePage(props: ProductPageProps) {
  const { slug, locale } = await props.params;
  const { variation } = await props.searchParams;
  const [payload, t] = await Promise.all([
    getCmsProvider().getCatalogProductDetail(slug, locale),
    getTranslations("ProductDetail"),
  ]);

  if (!payload) {
    notFound();
  }

  const { product, category, blocks, files, relatedProducts } = payload;
  const galleryImagesFromBlocks = blocks.flatMap((block) =>
    block.type === "IMAGE" ? toImageList(block.data) : [],
  );
  const galleryImages = (
    galleryImagesFromBlocks.length
      ? galleryImagesFromBlocks
      : [product.thumbnail_url]
  ).slice(0, 4);
  const manualFile = files.find((file) => file.type === "MANUAL");
  const sortedVariations = [...product.variations].sort(
    (a, b) => a.order - b.order,
  );
  const activeVariation =
    sortedVariations.find((item) => item.id === variation) ??
    sortedVariations[0]!;
  const activeSpecs = [...(activeVariation?.specs ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const highlights = activeSpecs
    .filter((spec) => product.highlight_attributes.includes(spec.attribute))
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

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
      {/* PRODUCT PREVIEW — image left + info right */}
      <section className="bg-card py-6 lg:py-8">
        <Container>
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 flex flex-col lg:flex-row lg:gap-12 lg:items-start">
            {/* Left: main image */}
            <div className="flex flex-col gap-4 lg:w-111.75 shrink-0">
              <div className="relative w-full aspect-[4/3] lg:h-89.5 border border-border rounded-2xl overflow-hidden bg-card flex items-center justify-center">
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 447px"
                  className="object-contain p-6"
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className="relative h-19 w-19 shrink-0 overflow-hidden rounded border border-border bg-card"
                  >
                    <Image
                      src={image}
                      alt={t("thumbnail", {
                        name: product.name,
                        index: index + 1,
                      })}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {files.length > 0 && (
                <p className="text-2xs font-sans uppercase text-muted-foreground tracking-wide">
                  {t("filesAvailable", { count: files.length })}
                </p>
              )}
            </div>

            {/* Right: product info */}
            <div className="flex-1 mt-6 lg:mt-0 lg:max-w-119">
              <p className="font-sans-condensed text-2xs font-black uppercase text-brand">
                {category.name}
              </p>
              <h1 className="mt-2 font-sans-condensed text-4xl lg:text-display-sm font-black uppercase leading-none text-brand-dark">
                {product.name}
              </h1>
              <p className="mt-4 text-sm lg:text-base text-text-subtle">
                {product.description}
              </p>

              {/* Spec tags */}
              <ul className="mt-4 flex flex-wrap gap-2">
                {activeSpecs.map((spec) => (
                  <li
                    key={spec.id}
                    className="rounded-lg border border-muted px-3 py-1 text-xs uppercase text-brand-dark"
                  >
                    {formatSpecKey(spec.attribute)}: {spec.value}
                  </li>
                ))}
              </ul>

              {sortedVariations.length > 1 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("variations")}
                  </span>
                  {sortedVariations.map((item) => (
                    <Link
                      key={item.id}
                      href={`/produtos/${product.slug}?variation=${encodeURIComponent(item.id)}`}
                      className={
                        item.id === activeVariation.id
                          ? "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
                          : "rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-muted-foreground"
                      }
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4">
                {highlights.map((spec) => (
                  <div key={spec.id}>
                    <p className="font-sans-condensed text-3xl font-black uppercase leading-none text-brand">
                      {spec.value}
                    </p>
                    <p className="text-2xs font-sans uppercase tracking-wide text-text-subtle">
                      {formatSpecKey(spec.attribute)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {manualFile && (
                  <Link
                    href={manualFile.file_url}
                    className="inline-flex h-10 items-center rounded-sm bg-brand px-5 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-white transition-colors hover:bg-brand/90"
                  >
                    {t("manual")}
                  </Link>
                )}
                <button
                  type="button"
                  className="inline-flex h-10 items-center rounded-sm border border-border bg-card px-5 font-sans text-button-md font-semibold uppercase tracking-[0.8px] text-brand-dark"
                >
                  {t("downloadPhotos")}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <StickySectionNav />
      <ProductDetailContent
        productName={product.name}
        thumbnailUrl={product.thumbnail_url}
        specs={activeSpecs}
        blocks={blocks}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
