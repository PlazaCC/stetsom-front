import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  category: string;
  variants?: string[];
  badge?: string | null;
  img?: string;
  href?: string;
  variantDirection?: "row" | "column";
}

export function ProductCard({
  name,
  category,
  variants,
  badge,
  img,
  href = "/produtos",
  variantDirection = "row",
}: ProductCardProps) {
  const uniqueVariants = variants ? Array.from(new Set(variants)) : [];

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-brand hover:shadow-md"
    >
      <div className="flex flex-1 items-center justify-center p-4">
        {img ? (
          <Image
            src={img}
            alt={name}
            width={160}
            height={130}
            className="max-h-32.5 object-contain"
          />
        ) : (
          <div className="h-20 w-24 rounded bg-muted" />
        )}
      </div>

      <div
        className={cn(
          "flex justify-between border-t border-border bg-card p-3",
          variantDirection === "column" && "flex-col gap-2",
        )}
      >
        <div className="font-sans-condensed text-base leading-tight font-black text-brand-dark uppercase">
          {name}
        </div>
        {uniqueVariants.length > 0 && (
          <div className={"flex flex-wrap gap-1"}>
            {uniqueVariants.map((v) => (
              <span
                key={v}
                className="rounded-[4px] border border-border bg-muted px-1.5 py-0.5 text-2xs font-bold text-text-subtle"
              >
                {v}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
