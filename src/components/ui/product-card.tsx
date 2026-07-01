import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  category: string;
  spec?: string | null;
  badge?: string | null;
  img?: string;
  href?: string;
}

export function ProductCard({
  name,
  category,
  spec,
  badge,
  img,
  href = "/produtos",
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-brand hover:shadow-md"
    >
      <div className="flex h-full w-full items-center justify-center">
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

      <div className="absolute bottom-0 left-0 w-full">
        <div className="flex w-full justify-between p-3">
          <div className="font-sans-condensed text-base leading-tight font-black text-brand-dark uppercase">
            {name}
          </div>
          {spec && <div className="mt-1.5 text-xs text-icon-muted">{spec}</div>}
        </div>
      </div>
    </Link>
  );
}
