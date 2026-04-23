import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import SectionLabel from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const FEATURED_PRODUCTS = [
  {
    id: 2,
    name: "ST-2000EQ MONO",
    category: "Módulo",
    spec: "1x 2000W RMS",
    badge: null,
    img: "/product-image.png",
  },
  {
    id: 3,
    name: "ST-800.4 COMPACT",
    category: "Amplificador",
    spec: "4x 200W RMS",
    badge: "Oferta",
    img: "/product-image-2.png",
  },
  {
    id: 4,
    name: "ST-1200.1D BASS",
    category: "Módulo",
    spec: "1x 1200W RMS",
    badge: null,
    img: "/product-image-2.png",
  },
  {
    id: 5,
    name: "ST-600.4 ULTRA",
    category: "Amplificador",
    spec: "4x 150W RMS",
    badge: null,
    img: "/product-image.png",
  },
];

export default function Novidades() {
  return (
    <section className="bg-white py-12 flex justify-center w-full">
      <Container>
        <div className="flex justify-between items-end mb-8">
          <SectionLabel label="Novidades" title={"CONHEÇA A\nPRATICIDADE"} />
          <div className="flex gap-4 items-center">
            <div className="bg-zinc-100 rounded-lg p-1 flex gap-0.5">
              {["Todos", "Amplif.", "Módulos", "Subw."].map((t, i) => (
                <div
                  key={t}
                  className={cn(
                    "px-3.5 py-1.5 rounded-md text-[13px] font-semibold cursor-pointer",
                    i === 0
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-400",
                  )}
                >
                  {t}
                </div>
              ))}
            </div>
            <Link
              href="/produtos"
              className="font-sans-condensed font-medium text-base text-brand"
            >
              Ver todos ›
            </Link>
          </div>
        </div>
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: "447px 1fr" }}
        >
          <Link
            href="/produtos/1"
            className="relative bg-[rgb(248,248,248)] rounded-lg border border-zinc-200 hover:border-brand h-[447px] flex items-center justify-center overflow-hidden transition-colors"
          >
            <Image
              src="/product-image.png"
              alt="ST-4000EQ 4 CANAIS"
              width={300}
              height={300}
              className="object-contain max-w-[75%] max-h-[300px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-12">
              <div className="font-sans-condensed font-medium text-[12px] uppercase text-brand">
                Amplificador
              </div>
              <div className="font-sans-condensed font-bold text-xl uppercase text-white">
                ST-4000EQ 4 CANAIS
              </div>
            </div>
          </Link>
          <div className="grid grid-cols-2 grid-rows-2 gap-5">
            {FEATURED_PRODUCTS.map((p) => (
              <ProductCard key={p.id} {...p} href={`/produtos/${p.id}`} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
