import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Check, Lock } from "lucide-react";
import type { ComponentProps } from "react";

type ProductCardHref = ComponentProps<typeof Link>["href"];

/** Status tag pinned to the top of a product (e.g. NOVO, DESCONTINUADO). */
export const productStatusBadgeVariants = cva(
  "rounded-sm px-2 py-0.5 font-sans-condensed text-2xs leading-tight font-black text-white uppercase",
  {
    variants: {
      tone: {
        new: "bg-brand",
        discontinued: "bg-brand-dark",
      },
    },
    defaultVariants: { tone: "new" },
  },
);

interface ProductCardProps {
  name: string;
  category: string;
  variants?: string[];
  badge?: string | null;
  /** Visual tone of the status badge. "new" is the brand red, "discontinued" a neutral dark. */
  badgeTone?: "new" | "discontinued";
  img?: string;
  href?: ProductCardHref;
  variantDirection?: "row" | "column";
  /** When true, the entire card becomes a compare toggle instead of navigating. */
  compareMode?: boolean;
  isCompareSelected?: boolean;
  compareDisabled?: boolean;
  compareBlocked?: boolean;
  onCompareToggle?: () => void;
  compareLabel?: string;
  compareSelectedLabel?: string;
  compareBlockedLabel?: string;
}

export function ProductCard({
  name,
  category,
  variants,
  badge,
  badgeTone = "new",
  img,
  href = { pathname: "/produtos" },
  variantDirection = "row",
  compareMode = false,
  isCompareSelected = false,
  compareDisabled = false,
  compareBlocked = false,
  onCompareToggle,
  compareLabel = "Comparar",
  compareSelectedLabel = "Selecionado",
  compareBlockedLabel = "Outra categoria",
}: ProductCardProps) {
  const uniqueVariants = variants ? Array.from(new Set(variants)) : [];

  const cardContent = (
    <>
      {/* Image area */}
      <div className="relative flex flex-1 items-center justify-center p-4">
        {img ? (
          <div className="relative h-32.5 w-full">
            <Image
              src={img}
              alt={name}
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>
        ) : (
          <div className="h-20 w-24 rounded bg-muted" />
        )}

        {/* Status badge (e.g. NOVO, DESCONTINUADO) */}
        {badge && !compareMode && (
          <span
            className={cn(
              productStatusBadgeVariants({ tone: badgeTone }),
              "absolute top-2 left-2",
            )}
          >
            {badge}
          </span>
        )}

        {/* Compare badge overlay */}
        {compareMode && (
          <span
            className={cn(
              "absolute top-2 right-2 flex items-center gap-1 rounded-sm px-2 py-0.5 font-sans-condensed text-2xs leading-tight font-semibold uppercase transition-colors",
              isCompareSelected
                ? "bg-brand-dark text-white"
                : compareBlocked
                  ? "bg-muted text-muted-foreground"
                  : compareDisabled
                    ? "cursor-not-allowed bg-muted text-muted-foreground"
                    : "bg-brand text-brand-dark",
            )}
          >
            {isCompareSelected && <Check size={10} />}
            {compareBlocked && <Lock size={10} />}
            {isCompareSelected
              ? compareSelectedLabel
              : compareBlocked
                ? compareBlockedLabel
                : compareLabel}
          </span>
        )}
      </div>

      {/* Bottom info area */}
      <div
        className={cn(
          "flex justify-between border-t border-border bg-card p-3",
          variantDirection === "column" && "flex-col gap-2",
        )}
      >
        <div>
          <div className="font-sans-condensed text-2xs font-black text-brand uppercase">
            {category}
          </div>
          <div className="font-sans-condensed text-base leading-tight font-black text-brand-dark uppercase">
            {name}
          </div>
        </div>
        {uniqueVariants.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {uniqueVariants.map((v) => (
              <span
                key={v}
                className="rounded-lg border border-border bg-muted px-1.5 py-0.5 text-2xs font-bold text-text-subtle"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (compareMode) {
    return (
      <button
        type="button"
        onClick={onCompareToggle}
        disabled={compareDisabled}
        className={cn(
          "flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border bg-white text-left transition-all",
          isCompareSelected
            ? "border-brand-dark ring-1 ring-brand-dark"
            : compareBlocked
              ? "border-border opacity-60"
              : "border-border hover:border-brand hover:shadow-md",
          compareDisabled && "cursor-not-allowed opacity-60",
        )}
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-brand hover:shadow-md"
    >
      {cardContent}
    </Link>
  );
}
