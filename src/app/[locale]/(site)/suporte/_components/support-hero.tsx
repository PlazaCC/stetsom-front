import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import type { SupportPayload } from "@/lib/api/contracts";
import Image from "next/image";

interface SupportHeroProps {
  hero: SupportPayload["hero"];
}

export function SupportHero({ hero }: Readonly<SupportHeroProps>) {
  return (
    <section className="relative flex h-84 w-full items-center overflow-hidden bg-radial-dark">
      <Image
        src={hero.image}
        alt="Hero Support"
        fill
        className="object-cover object-center opacity-35"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-fade-black" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-center font-sans-condensed text-display-2xl font-black uppercase leading-none text-watermark-text opacity-[0.08] select-none sm:text-[150px] lg:text-[263px]">
        {hero.watermarkText}
      </span>
      <div className="absolute left-0 top-0 h-full w-3.5 bg-bar-accent" />
      <Container className="relative z-10">
        <SectionLabel label={hero.label} />
        <h1 className="mt-1 font-sans-condensed text-5xl font-black uppercase leading-none text-white lg:text-[90px] lg:leading-18.5">
          {hero.title.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-4 max-w-120 text-base text-text-subtle-dark lg:ml-auto">
          {hero.description}
        </p>
      </Container>
    </section>
  );
}
