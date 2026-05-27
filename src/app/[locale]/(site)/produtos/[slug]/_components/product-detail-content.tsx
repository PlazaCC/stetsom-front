import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import type {
  ProductBlock,
  ProductCardItem,
  ProductSpec,
} from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import { formatSpecKey } from "@/lib/utils/product";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { BlockRenderer } from "./block-renderer";

interface ProductDetailContentProps {
  productName: string;
  thumbnailUrl: string;
  specs: ProductSpec[];
  blocks: ProductBlock[];
  relatedProducts?: ProductCardItem[];
}

export async function ProductDetailContent({
  productName,
  thumbnailUrl,
  specs,
  blocks,
  relatedProducts,
}: ProductDetailContentProps) {
  const t = await getTranslations("ProductDetail");
  const sortedSpecs = [...specs].sort((a, b) => a.order - b.order);
  const hasSpecs = sortedSpecs.length > 0;

  return (
    <>
      <section id="overview" className="scroll-mt-38">
        <section className="relative isolate overflow-hidden bg-black">
          <div className="absolute inset-0 bg-product-hero" />
          <div className="absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-black/70 to-transparent" />
          <Container className="relative z-10 py-8 md:py-10 lg:py-14">
            <div className="mx-auto max-w-220">
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
        </section>

        {blocks.length > 0 && (
          <section className="bg-white py-10 md:py-12 lg:py-14">
            <Container className="space-y-6 md:space-y-8">
              {blocks.map((block) => (
                <BlockRenderer
                  key={block.id}
                  block={block}
                  productName={productName}
                  fallbackImage={thumbnailUrl}
                />
              ))}
            </Container>
          </section>
        )}
      </section>

      <section id="specifications" className="scroll-mt-38">
        <div className="border-b border-zinc-200 px-5 py-3 lg:px-42.5">
          <p className="font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground">
            {t("techData")}
          </p>
        </div>
        <div className="bg-off-white px-5 py-4 lg:px-42.5">
          <h2 className="font-sans-condensed text-display-sm font-black uppercase leading-none text-brand-dark">
            {t("techSpecifications")}
          </h2>
        </div>
        {hasSpecs ? (
          <div className="bg-white pb-9">
            <div className="w-full overflow-x-auto">
              {sortedSpecs.map((spec, i) => (
                <div
                  key={spec.id}
                  className={cn(
                    "flex items-center gap-8 px-5 py-4.5 lg:px-42.5",
                    i % 2 === 0 ? "bg-muted" : "bg-white",
                  )}
                >
                  <span className="w-1/2 shrink-0 font-sans text-sm font-medium capitalize text-brand-dark">
                    {formatSpecKey(spec.attribute)}
                  </span>
                  <span className="font-sans text-sm text-text-subtle">
                    {spec.value || "—"}
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
            <p className="font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground">
              {t("recommendations")}
            </p>
          </div>
          <h2 className="mt-4 font-sans-condensed text-display-sm font-black uppercase leading-none text-brand-dark">
            {t("related")}
          </h2>
          {relatedProducts && relatedProducts.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {relatedProducts.slice(0, 6).map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  category={p.category}
                  spec={p.spec}
                  badge={p.badge}
                  img={p.img}
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
