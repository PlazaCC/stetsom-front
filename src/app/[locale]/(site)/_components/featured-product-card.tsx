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
      className={cn("group flex w-full flex-col items-center gap-3", className)}
    >
      <div className="relative aspect-square w-full overflow-hidden">
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
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center bg-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-white px-4 py-2 font-sans text-xs font-semibold tracking-wide text-brand-dark uppercase shadow-sm">
            {t("learnMore")}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "w-full truncate text-center font-sans-condensed leading-tight font-black tracking-wide text-brand-dark uppercase",
          isSpotlight ? "text-xl lg:text-2xl" : "text-sm lg:text-base",
        )}
      >
        {product.name}
      </div>
    </Link>
  );
}
