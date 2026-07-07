import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import Image from "next/image";

const FACTORY_IMAGE = "/figma-assets/raw/fill_OJJ5Q1_b3596ec5.png";
const MAP_IMAGE = "/figma-assets/raw/fill_KULSWW_74ec6dcf.png";

type JobsCtaSection = {
  image?: string;
  imageAlt?: string;
  label?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
};

interface OurFactoryProps {
  jobsCta?: JobsCtaSection;
}

export function OurFactory({ jobsCta }: OurFactoryProps) {
  return (
    <section className="relative overflow-hidden bg-brand-dark">
      <Image
        src={jobsCta?.image ?? FACTORY_IMAGE}
        alt={jobsCta?.imageAlt ?? "Fábrica Stetsom"}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="bg-radial-dark-alt absolute inset-0" />
      <Container className="relative z-10 py-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            {jobsCta && (
              <>
                <SectionLabel
                  label={jobsCta.label ?? ""}
                  title={jobsCta.title ?? ""}
                  dark
                />
                <p className="mt-6 mb-8 text-base text-text-subtle-dark">
                  {jobsCta.description}
                </p>
                <CTAButton
                  href={jobsCta.buttonHref ?? "#"}
                  label={jobsCta.buttonText ?? ""}
                  variant="brand"
                  size="md"
                  external
                />
              </>
            )}
          </div>
          <div className="relative h-72 overflow-hidden rounded-sm bg-surface-elevated lg:h-96">
            <Image
              src={MAP_IMAGE}
              alt="Localização Stetsom"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
