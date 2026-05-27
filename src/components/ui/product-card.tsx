import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  category: string;
  variations?: string[];
  img?: string;
  href?: string;
  className?: string;
}

export function ProductCard({
  name,
  category,
  variations = [],
  img,
  href = "/produtos",
  className,
}: ProductCardProps) {
  const hasVariations = variations.length > 0;

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col gap-3 rounded-[10px] bg-off-white p-4",
        className,
      )}
    >
      <div className="flex h-34.25 items-center justify-center rounded-[8px] bg-muted p-2.5">
        {img ? (
          <Image
            src={img}
            alt={name}
            width={160}
            height={130}
            className="h-25.25 w-35 object-contain"
          />
        ) : (
          <div className="h-25.25 w-35 rounded-[6px] bg-card" />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-sans text-base leading-5 text-muted-foreground">
          {category}
        </span>
        <span className="font-sans text-lg font-bold leading-5 text-foreground">
          {name}
        </span>
      </div>
      {hasVariations ? (
        <div className="flex flex-wrap gap-1.5">
          {variations.map((variation) => (
            <span
              key={variation}
              className="rounded-[8px] bg-variation-badge px-1.5 py-1 font-sans text-sm font-semibold leading-5 text-muted-foreground"
            >
              {variation}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
