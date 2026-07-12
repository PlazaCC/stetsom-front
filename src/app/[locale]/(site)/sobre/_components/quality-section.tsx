import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Rocket, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

const ICONS = {
  zap: Zap,
  "shield-check": ShieldCheck,
  rocket: Rocket,
} as const;

type AboutValue = {
  id: string;
  icon: keyof typeof ICONS;
  title: string;
  description: string;
};

interface QualitySectionData {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface QualitySectionProps {
  section: QualitySectionData;
  values: AboutValue[];
  foundingLabel?: string;
  foundingYear?: string;
}

export function QualitySection({
  section,
  values,
  foundingLabel,
  foundingYear,
}: Readonly<QualitySectionProps>) {
  return (
    <section className="bg-off-white py-20">
      <Container>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-muted">
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              className="object-cover"
            />
            <div className="absolute right-0 bottom-0 flex flex-col gap-2">
              <div className="flex flex-col items-center justify-center bg-brand px-2 pb-1">
                <span className="font-sans-condensed text-6xl leading-none font-black text-white uppercase">
                  {foundingYear ?? "1989"}
                </span>
                <span className="font-sans-condensed text-xs tracking-widest text-white uppercase drop-shadow-md">
                  {foundingLabel}
                </span>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className="mt-6 text-base text-text-subtle">
              {section.description}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6">
              {values.map((value, index) => {
                const Icon = ICONS[value.icon];

                return (
                  <div key={value.id ?? index} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted font-bold">
                      <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="mb-1 font-sans-condensed text-lg font-black text-brand-dark uppercase">
                        {value.title}
                      </h3>
                      <p className="text-base text-text-subtle">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
