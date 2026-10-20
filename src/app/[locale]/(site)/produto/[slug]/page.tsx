import { getApiProductsSlug } from "@/api/stetsom/server/products-public/products-public";
import { getApiProductsPreviewSlug } from "@/api/stetsom/server/products/products";
import type {
  GetApiProductsPreviewSlugParams,
  GetApiProductsSlugParams,
} from "@/api/stetsom/model";
import { API_LOCALES, toApiLocale, type ApiLocale } from "@/i18n/locale";
import { buildLocalizedAlternates } from "@/i18n/metadata";
import { getPathname } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { cache } from "react";
import { ProductDetailView } from "./_components/product-detail-view";
import { PreviewBanner } from "./_components/preview-banner";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<
    { preview?: string } & Record<string, string | string[] | undefined>
  >;
};

const getPublicProduct = cache(
  (slug: string, locale: GetApiProductsSlugParams["locale"]) =>
    getApiProductsSlug(slug, { locale }),
);

function plainText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

export async function generateMetadata(
  props: ProductPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const locale = await getLocale();
  const metadataLocale = toApiLocale(locale);
  const payload = await getPublicProduct(slug, metadataLocale).catch(
    () => null,
  );
  if (!payload) return {};
  const available = payload.product.available_locales.length
    ? payload.product.available_locales.filter(
        (candidate): candidate is ApiLocale =>
          API_LOCALES.includes(candidate as ApiLocale),
      )
    : API_LOCALES;
  return {
    title: payload.product.name,
    description: payload.product.description
      ? plainText(payload.product.description)
      : undefined,
    alternates: buildLocalizedAlternates(
      locale,
      () => ({
        pathname: "/produto/[slug]",
        params: { slug: payload.product.slug },
      }),
      available,
    ),
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const { preview } = searchParams;
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);
  const { isEnabled } = await draftMode();
  const isPreview = preview === "true" || isEnabled;
  const payload = await (
    isPreview
      ? getApiProductsPreviewSlug(slug, {
          locale: apiLocale,
        } satisfies GetApiProductsPreviewSlugParams)
      : getPublicProduct(
          slug,
          apiLocale satisfies GetApiProductsSlugParams["locale"],
        )
  ).catch(() => null);

  if (!payload) notFound();

  const { product, category, relatedProducts } = payload;
  if (product.slug !== slug) {
    permanentRedirect(
      getPathname({
        locale,
        href: { pathname: "/produto/[slug]", params: { slug: product.slug } },
      }),
    );
  }
  const line =
    category.lines.find((item) => item.line_id === product.line_id) ?? null;

  return (
    <>
      <PreviewBanner />
      <ProductDetailView data={{ product, category, relatedProducts, line }} />
    </>
  );
}
