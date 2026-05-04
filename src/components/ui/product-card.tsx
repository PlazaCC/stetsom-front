import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  category: string;
  spec?: string | null;
  badge?: string | null;
  img?: string;
  href?: string;
}

export default function ProductCard({
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
      className="group flex flex-col bg-white border border-zinc-200 hover:border-brand rounded-lg overflow-hidden transition-colors"
    >
      <div className="bg-[rgb(248,248,248)] h-32 md:h-36 lg:h-40 flex items-center justify-center p-4">
        {img ? (
          <Image
            src={img}
            alt={name}
            width={160}
            height={130}
            className="object-contain max-h-[130px] shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          />
        ) : (
          <div className="w-24 h-20 bg-zinc-200 rounded" />
        )}
      </div>
      <div className="p-3">
        <div className="font-sans-condensed font-medium text-[11px] uppercase text-brand mb-1">
          {category}
        </div>
        <div className="font-sans-condensed font-bold text-base uppercase text-brand-dark leading-tight">
          {name}
        </div>
        {spec && <div className="text-xs text-zinc-400 mt-1.5">{spec}</div>}
      </div>
      <div className="border-t border-zinc-100 px-3.5 py-2 flex justify-between items-center mt-auto">
        {badge && (
          <span className="bg-brand text-white font-sans-condensed font-bold text-[11px] uppercase px-2 py-0.5">
            {badge}
          </span>
        )}
        <span className="font-sans-condensed text-[13px] text-brand font-medium ml-auto">
          Ver mais ›
        </span>
      </div>
    </Link>
  );
}
