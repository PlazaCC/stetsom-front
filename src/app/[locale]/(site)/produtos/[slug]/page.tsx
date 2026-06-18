import { serverOrvalClient } from "@/api/stetsom/orval-server";
import type { GetApiProductsSlug200 } from "@/api/stetsom/model";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ProductDetailView } from "./_components/product-detail-view";
import { PreviewBanner } from "./_components/preview-banner";

type ProdutoDetalhePageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ variation?: string; preview?: string }>;
};

export default async function ProdutoDetalhePage(
  props: ProdutoDetalhePageProps,
) {
  const { slug } = await props.params;
  const { variation, preview } = await props.searchParams;
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);
  const { isEnabled } = await draftMode();
  const isPreview = preview === "true" || isEnabled;

  const payload = await serverOrvalClient<GetApiProductsSlug200>({
    method: "GET",
    url: `/api/products/${slug}`,
    params: { locale: apiLocale, ...(isPreview && { preview: "true" }) },
  }).catch(() => null);

  if (!payload) notFound();

  const { product, category, relatedProducts } = payload;

  return (
    <>
      <PreviewBanner />
      <ProductDetailView
        data={{ product, category, relatedProducts }}
        initialVariantId={variation}
        slug={slug}
      />
    </>
  );
}
