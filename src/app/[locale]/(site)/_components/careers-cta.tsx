import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import type { SiteAboutPayload } from "@/lib/api/contracts";
import Image from "next/image";

interface CareersCTAProps {
  section: SiteAboutPayload["jobsCta"];
}

export function CareersCTA({ section }: Readonly<CareersCTAProps>) {
  return (
    <section className="bg-white py-20">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto Esquerda */}
          <div>
            <SectionLabel label={section.label} title={section.title} />

            <p className="text-base text-text-subtle mt-6 leading-[1.7] mb-8">
              {section.description}
            </p>

            <CTAButton
              href={section.buttonHref}
              label={section.buttonLabel}
              variant="brand"
              size="md"
              external
            />
          </div>

          {/* Imagem Direita */}
          <div className="relative aspect-square w-full rounded-sm bg-muted flex items-center justify-center">
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
