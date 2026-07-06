import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import Image from "next/image";

type JobsCtaSection = {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  buttonText: string;
  buttonHref: string;
};

interface CareersCTAProps {
  section: JobsCtaSection;
}

export function CareersCTA({ section }: Readonly<CareersCTAProps>) {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Texto Esquerda */}
          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className="mt-6 mb-8 text-base text-text-subtle">
              {section.description}
            </p>

            <CTAButton
              href={section.buttonHref}
              label={section.buttonText}
              variant="brand"
              size="md"
              external
            />
          </div>

          {/* Imagem Direita */}
          <div className="relative flex aspect-square w-full items-center justify-center rounded-sm bg-muted">
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
