import { RichText } from "@/components/editor/block-text/rich-text";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import Image from "next/image";
import { EditableSection } from "../../_components/editable-section";

interface AboutHeroSectionProps {
  editable?: boolean;
  section: {
    url?: string;
    imageAlt?: string;
    label?: string;
    title?: string;
    description?: string;
    foundedYear?: string;
    stats?: Array<{
      value: string;
      label: string;
    }>;
  };
}

export function AboutHeroSection({
  section,
  editable = false,
}: Readonly<AboutHeroSectionProps>) {
  return (
    <EditableSection target="section:hero" editable={editable}>
      <section className="relative hero-offset flex min-h-109.75 items-center overflow-hidden bg-brand-dark">
        {section.url && (
          <Image
            src={section.url}
            alt={section.imageAlt ?? "Stetsom"}
            fill
            className="object-cover opacity-35"
            sizes="100vw"
            priority
          />
        )}
        <div className="bg-gradient-dark-overlay absolute inset-0" />

        <Container className="relative z-10 flex min-h-109.75 flex-col justify-start md:flex-row md:items-end md:justify-between md:pb-6">
          <div className="grid lg:grid-cols-[1fr_428px] lg:items-end lg:gap-10">
            <div>
              <SectionLabel label={section.label ?? ""} />
              <RichText
                headingLevel={1}
                content={section.title}
                className="mt-1 font-sans-condensed text-5xl font-black text-white uppercase md:leading-18.5 lg:text-display-2xl"
              />
              <RichText
                className="mt-4 max-w-125 text-base text-text-subtle-dark"
                content={section.description}
              />
            </div>

            {section.stats?.length ? (
              <div className="relative pt-5">
                <span className="pointer-events-none absolute -right-8 -bottom-20 font-sans-condensed text-[130px] leading-none font-black text-white/10 lg:-top-24 lg:right-0 lg:bottom-0">
                  {section.foundedYear ?? "1989"}
                </span>
                <div className="grid grid-cols-2">
                  {section.stats.map((stat) => (
                    <div key={stat.label} className="px-4 py-4">
                      <p className="font-sans-condensed text-display-sm font-black text-white">
                        {stat.value.replace("+", "")}
                        <span className="text-brand">+</span>
                      </p>
                      <p className="mt-1 font-sans text-sm font-medium text-text-subtle-dark uppercase">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </section>
    </EditableSection>
  );
}
