import { Container } from "@/components/ui/container";
import { Rocket, ShieldCheck, Zap } from "lucide-react";
import { QualityVideoHero } from "./quality-video-hero";

const ICONS = {
  zap: Zap,
  "shield-check": ShieldCheck,
  rocket: Rocket,
} as const;

type AboutValue = {
  id?: string;
  icon: string;
  title: string;
  description: string;
};

interface QualitySectionData {
  label?: string;
  title: string;
  description?: string;
  backgroundVideoUrl?: string;
  fullVideoUrl?: string;
  posterUrl?: string;
  posterAlt?: string;
  playLabel?: string;
}

interface QualitySectionProps {
  section: QualitySectionData;
  values: AboutValue[];
}

export function QualitySection({
  section,
  values,
}: Readonly<QualitySectionProps>) {
  return (
    <>
      <QualityVideoHero
        label={section.label}
        title={section.title}
        backgroundVideoUrl={section.backgroundVideoUrl}
        fullVideoUrl={section.fullVideoUrl}
        posterUrl={section.posterUrl}
        posterAlt={section.posterAlt}
        playLabel={section.playLabel}
      />

      {(section.description || values.length > 0) && (
        <section className="bg-white py-20">
          <Container>
            {section.description && (
              <p className="mx-auto max-w-3xl text-center text-lg text-balance text-text-subtle lg:text-xl">
                {section.description}
              </p>
            )}

            {values.length > 0 && (
              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {values.map((value, index) => (
                  <ValueCard key={value.id ?? index} value={value} />
                ))}
              </div>
            )}
          </Container>
        </section>
      )}
    </>
  );
}

function ValueCard({ value }: Readonly<{ value: AboutValue }>) {
  const Icon = ICONS[value.icon as keyof typeof ICONS] ?? Zap;

  return (
    <div className="flex flex-col items-center border-b-4 border-transparent bg-off-white px-6 py-10 text-center transition-colors duration-150 hover:border-brand">
      <div className="flex size-12 items-center justify-center rounded-md bg-white">
        <Icon className="size-6 text-brand" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-sans-condensed text-2xl font-black text-brand-dark uppercase">
        {value.title}
      </h3>
      <p className="mt-2 text-base text-text-subtle">{value.description}</p>
    </div>
  );
}
