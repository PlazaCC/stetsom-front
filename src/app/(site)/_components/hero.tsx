import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Legacy hero kept for fallback while HeroCarousel is being rolled out.
export default function Hero() {
  return (
    <div className="relative w-full h-130 sm:h-155 lg:h-175 overflow-hidden bg-[rgb(9,9,11)]">
      <Image
        className="absolute inset-0 object-cover opacity-60"
        src="/produtos-hero.png"
        alt="Stetsom"
        fill
        priority
      />

      <Container className="relative mx-auto flex h-full flex-col justify-center py-16 sm:py-0">
        <SectionLabel label="Catálogo 2024" />

        <h1 className="mt-2 font-sans-condensed font-black text-[48px] leading-[0.92] uppercase text-white sm:text-[64px] lg:text-[90px]">
          SEMPRE
          <br />
          PRIMEIRA
          <br />
          NA POTÊNCIA
        </h1>
        <p className="mt-4 max-w-70 text-sm leading-relaxed text-[rgb(184,184,184)] sm:max-w-95 sm:text-base lg:mt-5 lg:max-w-120 lg:text-lg">
          Tecnologia de amplificação que define o padrão de qualidade no mercado
          automotivo.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-8">
          <Link
            href="/produtos"
            className="inline-flex h-11 items-center justify-center bg-brand px-6 text-sm font-sans-condensed font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand/90 sm:h-12 sm:px-8 sm:text-base"
          >
            Ver Produtos
          </Link>
          <Link
            href="/sobre"
            className="inline-flex h-11 items-center justify-center border border-white/40 bg-transparent px-6 text-sm font-sans-condensed font-bold uppercase text-white transition-colors hover:border-white/70 sm:h-12 sm:px-8 sm:text-base"
          >
            Nossa História
          </Link>
        </div>
      </Container>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-7">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-2.5 rounded-full sm:h-3.5",
              i === 2 ? "w-6 bg-white/90 sm:w-7" : "w-2.5 bg-white/35 sm:w-3.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}
