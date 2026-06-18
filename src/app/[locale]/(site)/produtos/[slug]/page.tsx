import { serverOrvalClient } from "@/api/stetsom/orval-server";
import type {
  GetApiProductsSlug200,
  ProductBlock,
  ProductImage,
  ProductFile,
} from "@/api/stetsom/model";
import { type BreadcrumbItem, Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductDetailContent } from "./_components/product-detail-content";
import { StickySectionNav } from "./_components/sticky-section-nav";

type ProdutoDetalhePageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ variation?: string }>;
};

export default async function ProdutoDetalhePage(
  props: ProdutoDetalhePageProps,
) {
  const { slug } = await props.params;
  const { variation } = await props.searchParams;
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [payload, t] = await Promise.all([
    serverOrvalClient<GetApiProductsSlug200>({
      method: "GET",
      url: `/api/products/${slug}`,
      params: { locale: apiLocale },
    }).catch(() => null),
    getTranslations("ProductDetail"),
  ]);

  if (!payload) notFound();

  const { product, category, relatedProducts } = payload;
  const blocks: ProductBlock[] = product.page_blocks ?? [];
  const images: ProductImage[] = product.images ?? [];
  const files: ProductFile[] = product.files ?? [];

  const galleryImages = images
    .sort((a, b) => a.order - b.order)
    .slice(0, 4)
    .map((img) => img.image_url)
    .filter(Boolean) as string[];

  const thumbnailUrl = images[0]?.image_url ?? null;

  const manualFile =
    files.find((f) => f.type === "MANUAL" && f.is_active) ??
    files.find((f) => f.type === "MANUAL");
  const sortedVariants = [...(product.variants ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const activeVariant = variation
    ? (sortedVariants.find((v) => v.variant_id === variation) ??
      sortedVariants[0])
    : sortedVariants[0];
  const activeAttrs = activeVariant
    ? [...activeVariant.attributes].sort((a, b) => a.order - b.order)
    : [];

  const highlightedAttrs = activeAttrs.filter((attr) =>
    product.highlight_attributes.includes(attr.attribute_id),
  );
  const highlights = highlightedAttrs.slice(0, 3);

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
      <section className="bg-card py-6 lg:py-8">
        <Container>
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:gap-12">
            <div className="flex shrink-0 flex-col gap-4 lg:w-111.75">
              <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-card lg:h-89.5">
                {thumbnailUrl && (
                  <Image
                    src={thumbnailUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 447px"
                    className="object-contain p-6"
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
              )}

              {files.length > 0 && (
                <p className="font-sans text-2xs tracking-wide text-muted-foreground uppercase">
                  {t("filesAvailable", { count: files.length })}
                </p>
              )}
            </div>

            <div className="mt-6 flex-1 lg:mt-0 lg:max-w-119">
              <p className="font-sans-condensed text-2xs font-black text-brand uppercase">
                {category.name}
              </p>
              <h1 className="mt-2 font-sans-condensed text-4xl leading-none font-black text-brand-dark uppercase lg:text-display-sm">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-4 text-sm text-text-subtle lg:text-base">
                  {product.description}
                </p>
              )}

              {highlightedAttrs.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {highlightedAttrs.map((attr) => (
                    <li
                      key={attr.attribute_id}
                      className="rounded-lg border border-muted px-3 py-1 text-xs text-brand-dark uppercase"
                    >
                      {attr.attribute_name ?? attr.attribute_id}: {attr.value}
                    </li>
                  ))}
                </ul>
              )}

              {sortedVariants.length > 1 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t("variations")}
                  </span>
                  {sortedVariants.map((item) => (
                    <span
                      key={item.variant_id}
                      className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              )}

              {highlights.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4">
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

              <div className="mt-5 flex flex-wrap gap-3">
                {manualFile && (
                  <a
                    href={manualFile.file_url ?? "#"}
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
      <ProductDetailContent
        productName={product.name}
        thumbnailUrl={thumbnailUrl}
        variants={sortedVariants}
        blocks={blocks}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
