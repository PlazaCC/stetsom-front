import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { SectionLabel } from "@/components/ui/section-label";
import { FaqAccordion } from "./faq-accordion";

type FAQItem = { id: string; q: string; a: string };

type FaqSection = {
  label: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonHref?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

interface FaqProps {
  items: FAQItem[];
  section: FaqSection;
}

export function Faq({ items, section }: Readonly<FaqProps>) {
  return (
    <section className="flex justify-center bg-off-white py-12">
      <Container>
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          <div>
            <SectionLabel
              label={section.label}
              title={section.title}
              subtitle={section.subtitle}
            />
            <CTAButton
              href={section.ctaHref ?? "#"}
              label={section.ctaLabel ?? ""}
              variant="brand-dark"
              size="sm"
              className="mt-5"
            />
          </div>
          <div className="pt-2">
            <FaqAccordion items={items} />
          </div>
        </div>
      </Container>
    </section>
  );
}
