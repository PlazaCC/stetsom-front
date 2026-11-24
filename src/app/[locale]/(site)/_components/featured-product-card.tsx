import type { ProductCardItem } from "@/api/stetsom/model";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface FeaturedProductCardProps {
  product: ProductCardItem;
  variant: "spotlight" | "grid";
  className?: string;
}

export function FeaturedProductCard({
  product,
  variant,
  className,
}: Readonly<FeaturedProductCardProps>) {
  const t = useTranslations("Catalog");
  const isSpotlight = variant === "spotlight";
  // The dedicated highlight banner chosen in the CMS, falling back to the
  // catalog thumbnail when the product has no banner selected.
  const imageUrl = product.highlight_url ?? product.thumbnail_url;

  return (
    <Link
      href={{ pathname: "/produto/[slug]", params: { slug: product.slug } }}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-all duration-300 hover:border-brand hover:shadow-lg",
        className,
      )}
    >
      {/* Mini-banner — full-bleed inside the card */}
      <div
        className={cn(
          "relative w-full",
          isSpotlight
            ? "aspect-square lg:aspect-10/9"
            : "aspect-square lg:aspect-auto lg:min-h-0 lg:flex-1",
        )}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes={
              isSpotlight
                ? "(min-width: 1024px) 45vw, 90vw"
                : "(min-width: 1024px) 20vw, 45vw"
            }
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}

        {/*
          Mobile / touch (no hover): a persistent bottom scrim keeps the product
          name and the "Saiba mais" affordance visible without hovering.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 lg:hidden"
        >
          <span
            className={cn(
              "font-sans-condensed leading-tight font-black tracking-wide text-white uppercase",
              isSpotlight ? "text-lg" : "text-sm",
            )}
          >
            {product.name}
          </span>
          <span className="rounded-full bg-white px-3 py-1 font-sans text-2xs font-semibold tracking-wide text-brand-dark uppercase">
            {t("learnMore")}
          </span>
        </div>

        {/*
          Desktop: a dark, blurred overlay revealed on hover, carrying the
          product name and the "Saiba mais" button.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden flex-col items-center justify-center gap-3 bg-black/60 p-4 text-center opacity-0 backdrop-blur-sm transition-opacity duration-300 lg:flex lg:group-hover:opacity-100"
        >
          <span
            className={cn(
              "font-sans-condensed leading-tight font-black tracking-wide text-white uppercase",
              isSpotlight ? "text-xl" : "text-base",
            )}
          >
            {product.name}
          </span>
          <span className="rounded-full bg-white px-4 py-2 font-sans text-xs font-semibold tracking-wide text-brand-dark uppercase shadow-sm">
            {t("learnMore")}
          </span>
        </div>
      </div>
    </Link>
  );
}
