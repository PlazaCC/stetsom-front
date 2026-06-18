import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import Image from "next/image";

type SupportHeroData = {
  image: string;
  badge?: string;
  label?: string;
  title: string;
  subtitle?: string;
  watermarkText?: string;
  description?: string;
};

interface SupportHeroProps {
  hero: SupportHeroData;
}

export function SupportHero({ hero }: Readonly<SupportHeroProps>) {
  return (
    <section className="bg-radial-dark relative flex h-84 w-full items-center overflow-hidden">
      {/* <Image
        src={hero.image}
        alt="Hero Support"
        fill
        className="object-cover object-center opacity-35"
        sizes="100vw"
        priority
      /> */}
      <div className="bg-gradient-fade-black absolute inset-0" />
      <span className="pointer-events-none absolute -right-16 -bottom-16 flex items-center justify-center text-center font-sans-condensed text-display-2xl leading-none font-black text-watermark-text uppercase opacity-[0.08] select-none sm:text-[150px] lg:text-[263px]">
        {hero.watermarkText}
      </span>
      <div className="absolute top-0 left-0 h-full w-3.5 bg-bar-accent" />
      <Container className="relative z-10">
        <SectionLabel label={hero.label ?? ""} />
        <h1 className="mt-1 font-sans-condensed text-5xl leading-none font-black text-white uppercase lg:text-[90px] lg:leading-18.5">
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
