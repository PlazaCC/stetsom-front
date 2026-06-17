import type {
  ProductBlock,
  ProductCardItem,
  PublicVariantAttr,
} from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { BlockRenderer } from "./block-renderer";

interface ProductDetailContentProps {
  productName: string;
  thumbnailUrl?: string | null;
  attrs: PublicVariantAttr[];
  blocks: ProductBlock[];
  relatedProducts?: ProductCardItem[];
}

export async function ProductDetailContent({
  productName,
  thumbnailUrl,
  attrs,
  blocks,
  relatedProducts,
}: ProductDetailContentProps) {
  const [t] = await Promise.all([getTranslations("ProductDetail")]);
  const sortedAttrs = [...attrs].sort((a, b) => a.order - b.order);
  const hasAttrs = sortedAttrs.length > 0;

  return (
    <>
      {/* <section id="overview" className="scroll-mt-38"> */}
      {/* <section className="relative isolate overflow-hidden bg-black">
          <div className="absolute inset-0 bg-product-hero" />
          <div className="absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-black/70 to-transparent" />
          <Container className="relative z-10 py-8 md:py-10 lg:py-14">
            <div className="mx-auto max-w-220">
              {thumbnailUrl && (
                <div className="relative h-74.75 w-full sm:h-80 md:h-92 lg:h-100">
                  <Image
                    src={thumbnailUrl}
                    alt={productName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 960px"
                    className="object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.35)]"
                  />
                </div>
              )}
              <div className="mt-5 text-center">
                <p className="font-sans-condensed text-4xl font-black uppercase text-white sm:text-5xl lg:text-display-lg">
                  {t("heroTagline1")}
                  <span className="mt-1 block text-brand">
                    {t("heroTagline2")}
                  </span>
                </p>
              </div>
            </div>
          </Container>
        </section> */}

      {blocks.length > 0 &&
        blocks.map((block) => (
          <BlockRenderer
            key={block.block_id}
            block={block}
            productName={productName}
            fallbackImage={thumbnailUrl ?? ""}
          />
        ))}

      <section id="specifications" className="scroll-mt-38">
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
        {hasAttrs ? (
          <div className="bg-white pb-9">
            <div className="w-full overflow-x-auto">
              {sortedAttrs.map((attr, i) => (
                <div
                  key={attr.attribute_id}
                  className={cn(
                    "flex items-center gap-8 px-5 py-4.5 lg:px-42.5",
                    i % 2 === 0 ? "bg-muted" : "bg-white",
                  )}
                >
                  <span className="w-1/2 shrink-0 font-sans text-sm font-medium text-brand-dark capitalize">
                    {attr.attribute_name ?? attr.attribute_id}
                  </span>
                  <span className="font-sans text-sm text-text-subtle">
                    {attr.value || "—"}
                  </span>
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
                  badge={p.is_discontinued ? "Discontinued" : undefined}
                  img={p.thumbnail_url ?? undefined}
                  href={p.href}
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
