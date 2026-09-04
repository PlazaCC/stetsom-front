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

  return (
    <Link
      href={product.href}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-2xl bg-card shadow-md transition-all duration-300 hover:border-brand hover:shadow-lg",
        className,
      )}
    >
      {/* Image — full-bleed inside the card */}
      <div
        className={cn(
          "relative w-full",
          isSpotlight
            ? "aspect-square lg:aspect-10/9"
            : "aspect-square lg:aspect-auto lg:min-h-0 lg:flex-1",
        )}
      >
        {product.thumbnail_url ? (
          <Image
            src={product.thumbnail_url}
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

        <div className="absolute inset-0 flex items-center justify-center bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white px-4 py-2 font-sans text-xs font-semibold tracking-wide text-brand-dark uppercase shadow-sm">
            {t("learnMore")}
          </span>
        </div>
      </div>

      {/* Product name — standardized, inside the card */}
      <div className="px-4 py-3 text-center lg:px-5">
        <div
          className={cn(
            "truncate font-sans-condensed leading-tight font-black tracking-wide text-brand-dark uppercase",
            isSpotlight ? "text-lg lg:text-xl" : "text-sm lg:text-base",
          )}
        >
          {product.name}
        </div>
      </div>
    </Link>
  );
}
