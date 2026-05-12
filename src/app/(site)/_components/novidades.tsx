import Container from "@/components/ui/container";
import ProductCard from "@/components/ui/product-card";
import SectionLabel from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
    <section className="flex w-full justify-center bg-white py-12">
      <Container>
        {/* Header: title + tabs/cta */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop: title box left, badges box right aligned to bottom */}
          <div className="hidden lg:flex items-stretch justify-between gap-6">
            <div className="max-w-[320px]">
              <SectionLabel
                label="Novidades"
                title={"CONHEÇA A\nPRATICIDADE"}
                className=""
              />
            </div>

            <div className="flex-1 flex items-end justify-end">
              <div className="inline-flex items-center gap-3 overflow-x-auto pb-1 pr-1 sm:gap-4 lg:pr-0 bg-[rgb(244,244,245)] rounded-[8px] px-2 py-1">
                {["Todos", "Amplificadores", "Processadores", "Subwoofers"].map(
                  (t, i) => (
                    <div
                      key={t}
                      className={cn(
                        "shrink-0 px-3 py-1.5 transition-colors text-[14px] leading-5 font-sans text-center",
                        i === 0
                          ? "rounded-[6px] bg-white text-[#09090B] shadow-sm"
                          : "rounded-[6px] bg-transparent text-[rgb(113,113,122)]",
                      )}
                    >
                      {t}
                    </div>
                  ),
                )}
              </div>

              <Link
                href="/produtos"
                className="ml-4 inline-flex items-center gap-2 px-2 text-sm font-sans-condensed font-medium text-brand"
              >
                <span>Ver todos</span>
                <ArrowRight className="size-4 inline-block" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Mobile: stack title then badges */}
          <div className="lg:hidden flex flex-col gap-4">
            <SectionLabel
              label="Novidades"
              title={"CONHEÇA A\nPRATICIDADE"}
              className="max-w-[320px]"
            />

            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-3 overflow-x-auto pb-1 pr-1 sm:gap-4 lg:pr-0 bg-[rgb(244,244,245)] rounded-[8px] px-2 py-1">
                {["Todos", "Amplificadores", "Processadores", "Subwoofers"].map(
                  (t, i) => (
                    <div
                      key={t}
                      className={cn(
                        "shrink-0 px-3 py-1.5 transition-colors text-[14px] leading-5 font-sans text-center",
                        i === 0
                          ? "rounded-[6px] bg-white text-[#09090B] shadow-sm"
                          : "rounded-[6px] bg-transparent text-[rgb(113,113,122)]",
                      )}
                    >
                      {t}
                    </div>
                  ),
                )}
              </div>

              <Link
                href="/produtos"
                className="ml-2 inline-flex items-center gap-2 px-2 text-sm font-sans-condensed font-medium text-brand"
              >
                <span>Ver todos</span>
                <ArrowRight className="size-4 inline-block" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[447px_1fr]">
          <Link
            href="/produtos/1"
            className="relative flex h-80 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-[rgb(248,248,248)] transition-colors hover:border-brand sm:h-95 lg:h-111.75"
          >
            <Image
              src="/product-image.png"
              alt="ST-4000EQ 4 CANAIS"
              width={300}
              height={300}
              className="max-h-55 max-w-[75%] object-contain shadow-[0_8px_24px_rgba(0,0,0,0.15)] sm:max-h-65 lg:max-h-75"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/65 to-transparent px-4 pb-4 pt-12 sm:px-5">
              <div className="font-sans-condensed text-[12px] font-medium uppercase text-brand">
                Amplificador
              </div>
              <div className="font-sans-condensed text-[18px] font-bold uppercase leading-tight text-white sm:text-xl">
                ST-4000EQ 4 CANAIS
              </div>
            </div>
          </Link>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            {FEATURED_PRODUCTS.map((p) => (
              <ProductCard key={p.id} {...p} href={`/produtos/${p.id}`} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
