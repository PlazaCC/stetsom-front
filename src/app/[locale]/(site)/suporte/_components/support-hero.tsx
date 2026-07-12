import { Container } from "@/components/ui/container";

type SupportHeroData = {
  image?: string;
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
    <section className="relative h-72 w-full overflow-hidden bg-brand-dark">
      <div className="bg-radial-dark absolute inset-0" />
      <div className="bg-gradient-fade-black absolute inset-0" />
      <Container className="relative z-10 flex h-full flex-col justify-center md:flex-row md:items-end md:justify-between md:pb-6">
        <div className="py-4">
          {hero.label && (
            <div className="mb-1 flex items-center gap-2">
              <div className="h-px w-6 shrink-0 bg-brand" />
              <span className="font-sans-condensed text-xs font-medium text-brand uppercase md:text-base">
                {hero.label}
              </span>
            </div>
          )}
          <h1 className="font-sans-condensed text-5xl font-black text-white uppercase md:min-w-127.5 md:text-[90px] md:leading-18.5">
            {hero.title.split("\n").map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
        </div>
        {hero.description && (
          <p className="max-w-120 text-base text-text-subtle-dark">
            {hero.description}
          </p>
        )}
      </Container>
      <span className="pointer-events-none absolute -right-18 -bottom-2 font-sans-condensed text-display-2xl leading-none font-black text-watermark-text uppercase opacity-[0.08] select-none md:-right-22 md:-bottom-16 md:text-[263px]">
        {hero.watermarkText}
      </span>
      <div className="absolute top-0 left-0 h-full w-3.5 lg:bg-brand" />
    </section>
  );
}
