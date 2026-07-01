import { getApiProductsSlug } from "@/api/stetsom/server/products-public/products-public";
import type { GetApiProductsSlugParams } from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ProductDetailView } from "./_components/product-detail-view";
import { PreviewBanner } from "./_components/preview-banner";

type ProdutoDetalhePageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

export default async function ProdutoDetalhePage(
  props: ProdutoDetalhePageProps,
) {
  const { slug } = await props.params;
  const { preview } = await props.searchParams;
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);
  const { isEnabled } = await draftMode();
  const isPreview = preview === "true" || isEnabled;

  const payload = await getApiProductsSlug(slug, {
    locale: apiLocale,
    ...(isPreview && { preview: "true" }),
  } as GetApiProductsSlugParams).catch(() => null);

  if (!payload) notFound();

  const { product, category, relatedProducts } = payload;

  return (
    <>
      <PreviewBanner />
      <ProductDetailView data={{ product, category, relatedProducts }} />
    </>
  );
}
