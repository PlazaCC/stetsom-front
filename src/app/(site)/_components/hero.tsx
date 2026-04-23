import Container from "@/components/ui/container";
import SectionLabel from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="relative w-full h-[700px] overflow-hidden bg-[rgb(9,9,11)]">
      <Image
        className="absolute inset-0 object-cover opacity-60"
        src="/produtos-hero.png"
        alt="Stetsom"
        fill
        priority
      />

      <Container className="relative mx-auto flex-col flex justify-center h-full ">
        <SectionLabel label="Catálogo 2024" />

        <h1 className="font-sans-condensed font-black text-[90px] leading-none uppercase text-white mt-2">
          SEMPRE
          <br />
          PRIMEIRA
          <br />
          NA POTÊNCIA
        </h1>
        <p className="text-lg text-[rgb(184,184,184)] mt-5 max-w-[480px] leading-relaxed">
          Tecnologia de amplificação que define o padrão de qualidade no mercado
          automotivo.
        </p>
        <div className="flex gap-3 mt-8">
          <Link
            href="/produtos"
            className="inline-flex items-center justify-center h-12 px-8 bg-brand text-white font-sans-condensed font-bold text-base uppercase tracking-wide hover:bg-brand/90 transition-colors"
          >
            Ver Produtos
          </Link>
          <Link
            href="/sobre"
            className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-white border border-white/40 font-sans-condensed font-bold text-base uppercase hover:border-white/70 transition-colors"
          >
            Nossa História
          </Link>
        </div>
      </Container>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-3.5 rounded-full",
              i === 2 ? "w-7 bg-white/90" : "w-3.5 bg-white/35",
            )}
          />
        ))}
      </div>
    </div>
  );
}
