import type {
  ProductBlock,
  ProductCardItem,
  PublicVariant,
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
  variants: PublicVariant[];
  blocks: ProductBlock[];
  relatedProducts?: ProductCardItem[];
}

type SpecRow = {
  attribute_id: string;
  attribute_name: string;
  order: number;
  values: Record<string, string>;
};

export async function ProductDetailContent({
  productName,
  thumbnailUrl,
  variants,
  blocks,
  relatedProducts,
}: ProductDetailContentProps) {
  const [t] = await Promise.all([getTranslations("ProductDetail")]);

  const sortedVariants = [...variants].sort((a, b) => a.order - b.order);

  // Build one row per unique attribute, with a value column per variant.
  const rowsById = new Map<string, SpecRow>();
  for (const variant of sortedVariants) {
    for (const attr of variant.attributes) {
      let row = rowsById.get(attr.attribute_id);
      if (!row) {
        row = {
          attribute_id: attr.attribute_id,
          attribute_name: attr.attribute_name ?? attr.attribute_id,
          order: attr.order,
          values: {},
        };
        rowsById.set(attr.attribute_id, row);
      }
      row.values[variant.variant_id] = attr.value;
    }
  }
  const sortedRows = [...rowsById.values()].sort((a, b) => a.order - b.order);
  const hasAttrs = sortedRows.length > 0;
  const showVariantColumns = sortedVariants.length > 1;

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

      <section id="specifications">
        <div className="flex flex-col gap-4 bg-off-white px-5 py-6 lg:px-42.5">
          <h2 className="font-sans-condensed text-display-sm font-black text-brand-dark uppercase">
            {t("techSpecifications")}
          </h2>
        </div>
        {hasAttrs ? (
          <div className="bg-white pb-9">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                {showVariantColumns && (
                  <thead>
                    <tr className="bg-off-white">
                      <th className="w-1/2 py-4 pr-8 pl-5 text-left font-sans-condensed text-2xs font-black tracking-widest text-muted-foreground uppercase lg:pl-42.5" />
                      {sortedVariants.map((variant, vi) => (
                        <th
                          key={variant.variant_id}
                          className={cn(
                            "px-4 py-4 text-left font-sans-condensed text-2xs font-black tracking-widest text-brand-dark uppercase",
                            vi === sortedVariants.length - 1 &&
                              "pr-5 lg:pr-42.5",
                          )}
                        >
                          {variant.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {sortedRows.map((row, i) => (
                    <tr
                      key={row.attribute_id}
                      className={i % 2 === 0 ? "bg-muted" : "bg-white"}
                    >
                      <td className="w-1/2 py-4.5 pr-8 pl-5 font-sans text-sm font-medium text-brand-dark capitalize lg:pl-42.5">
                        {row.attribute_name}
                      </td>
                      {sortedVariants.map((variant, vi) => (
                        <td
                          key={variant.variant_id}
                          className={cn(
                            "px-4 py-4.5 font-sans text-sm text-text-subtle",
                            vi === sortedVariants.length - 1 &&
                              "pr-5 lg:pr-42.5",
                          )}
                        >
                          {row.values[variant.variant_id] || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
