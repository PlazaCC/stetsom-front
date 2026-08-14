import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";

interface ProductCardProps {
  name: string;
  category: string;
  variants?: string[];
  badge?: string | null;
  /** Visual tone of the status badge. "new" is the brand red, "discontinued" a neutral dark. */
  badgeTone?: "new" | "discontinued";
  img?: string;
  href?: string;
  variantDirection?: "row" | "column";
  /** When true, the entire card becomes a compare toggle instead of navigating. */
  compareMode?: boolean;
  isCompareSelected?: boolean;
  compareDisabled?: boolean;
  onCompareToggle?: () => void;
  compareLabel?: string;
  compareSelectedLabel?: string;
}

export function ProductCard({
  name,
  category,
  variants,
  badge,
  badgeTone = "new",
  img,
  href = "/produtos",
  variantDirection = "row",
  compareMode = false,
  isCompareSelected = false,
  compareDisabled = false,
  onCompareToggle,
  compareLabel = "Comparar",
  compareSelectedLabel = "Selecionado",
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
              "absolute top-2 left-2 rounded-sm px-2 py-0.5 font-sans-condensed text-2xs leading-tight font-black text-white uppercase",
              badgeTone === "discontinued" ? "bg-brand-dark" : "bg-brand",
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
                : compareDisabled
                  ? "cursor-not-allowed bg-muted text-muted-foreground"
                  : "bg-brand text-brand-dark",
            )}
          >
            {isCompareSelected && <Check size={10} />}
            {isCompareSelected ? compareSelectedLabel : compareLabel}
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
