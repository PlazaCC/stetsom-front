import { serverOrvalClient } from "@/api/stetsom/orval-server";
import type {
  GetApiProductsSlug200,
  ProductBlock,
  ProductImage,
  ProductFile,
} from "@/api/stetsom/model";
import { type BreadcrumbItem, Breadcrumb } from "@/components/ui/breadcrumb";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
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

  const highlights = activeAttrs
    .filter((attr) => product.highlight_attributes.includes(attr.attribute_id))
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
      <section className="bg-card py-6 lg:py-8">
        <Container>
          <Breadcrumb items={breadcrumbItems} />

          <div className="mt-6 flex flex-col lg:flex-row lg:gap-12 lg:items-start">
            <div className="flex flex-col gap-4 lg:w-111.75 shrink-0">
              <div className="relative w-full aspect-[4/3] lg:h-89.5 border border-border rounded-2xl overflow-hidden bg-card flex items-center justify-center">
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
                <p className="text-2xs font-sans uppercase text-muted-foreground tracking-wide">
                  {t("filesAvailable", { count: files.length })}
                </p>
              )}
            </div>

            <div className="flex-1 mt-6 lg:mt-0 lg:max-w-119">
              <p className="font-sans-condensed text-2xs font-black uppercase text-brand">
                {category.name}
              </p>
              <h1 className="mt-2 font-sans-condensed text-4xl lg:text-display-sm font-black uppercase leading-none text-brand-dark">
                {product.name}
              </h1>
              {product.description && (
                <p className="mt-4 text-sm lg:text-base text-text-subtle">
                  {product.description}
                </p>
              )}

              {activeAttrs.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {activeAttrs.map((attr) => (
                    <li
                      key={attr.attribute_id}
                      className="rounded-lg border border-muted px-3 py-1 text-xs uppercase text-brand-dark"
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
                    <Link
                      key={item.variant_id}
                      href={`/produtos/${slug}?variation=${encodeURIComponent(item.variant_id)}`}
                      className={
                        item.variant_id === activeVariant?.variant_id
                          ? "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground"
                          : "rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-muted-foreground"
                      }
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}

              {highlights.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4">
                  {highlights.map((attr) => (
                    <div key={attr.attribute_id}>
                      <p className="font-sans-condensed text-3xl font-black uppercase leading-none text-brand">
                        {attr.value}
                      </p>
                      <p className="text-2xs font-sans uppercase tracking-wide text-text-subtle">
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
                    className="inline-flex h-10 items-center rounded-sm bg-brand px-5 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-white transition-colors hover:bg-brand/90"
                  >
                    {t("manual")}
                  </a>
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
        thumbnailUrl={thumbnailUrl}
        attrs={activeAttrs}
        blocks={blocks}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
