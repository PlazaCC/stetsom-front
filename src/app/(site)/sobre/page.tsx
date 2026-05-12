import Image from "next/image";
import SectionLabel from "@/components/ui/section-label";
import RedBanner from "../_components/red-banner";
import QualidadeInovadora from "../_components/qualidade-inovadora";
import TimelineRefactored from "../_components/timeline-refactored";
import NossasBases from "../_components/nossas-bases";
import CTATrabalheConosco from "../_components/cta-trabalhe-conosco";

export default function SobrePage() {
  return (
    <div>
      {/* 1. HERO */}
      <section className="relative bg-[rgb(9,9,11)] h-[400px] overflow-hidden flex items-center">
        <Image
          src="/about-bg.png"
          alt=""
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="relative z-10 px-8 lg:px-[170px] max-w-[1440px] mx-auto w-full">
          <SectionLabel label="Quem Somos" />
          <h1 className="font-sans-condensed font-black text-[72px] leading-none uppercase text-white mt-1">
            SOBRE A
            <br />
            STETSOM
          </h1>
        </div>
      </section>

      {/* 2. RED BANNER - Milestones Carousel */}
      {/* <RedBanner /> */}

      {/* 3. QUALIDADE INOVADORA - 2 Cols */}
      <QualidadeInovadora />

      {/* 4. TIMELINE REFACTORED - Con Sidebar */}
      <TimelineRefactored />

      {/* 5. NOSSAS BASES - 3 Cards */}
      <NossasBases />

      {/* 6. NOSSA FAMÍLIA / MÍDIAS SOCIAIS */}
      <section className="bg-off-white py-16">
        <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-px bg-brand shrink-0" />
              <span className="font-sans-condensed font-medium text-base uppercase text-brand">
                @stetsombrasil
              </span>
              <div className="w-6 h-px bg-brand shrink-0" />
            </div>
            <h2 className="font-sans-condensed font-black text-[48px] leading-none uppercase text-brand-dark">
              NOSSA FAMÍLIA
            </h2>
            <p className="text-base text-[rgb(102,102,102)] mt-4">
              Participe da comunidade de profissionais do áudio.
            </p>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-[250px] h-[250px] shrink-0 rounded-sm bg-cover bg-center"
                style={{
                  backgroundImage: "url('/brand-image.png')",
                  opacity: 0.8 + i * 0.04,
                }}
              />
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="font-sans-condensed font-medium text-base text-brand cursor-pointer hover:text-brand/80 transition-colors">
              Seguir no instagram ›
            </span>
          </div>
        </div>
      </section>

      {/* 7. CTA - Trabalhe Conosco */}
      <CTATrabalheConosco />
    </div>
  );
}
