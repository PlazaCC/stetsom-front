import { Container } from "@/components/ui/container";
import { CTAButton } from "@/components/ui/cta-button";
import { PublicEmptyState } from "@/components/ui/public-empty-state";
import { SectionLabel } from "@/components/ui/section-label";
import type { FaqItem } from "@/lib/page-blocks";
import { MessageCircleQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { FaqAccordion } from "./faq-accordion";

interface FaqSectionProps {
  items: FaqItem[];
  section: {
    label: string;
    title: string;
    subtitle?: string;
    ctaLabel?: string;
    ctaHref?: string;
  };
}

export function FaqSection({ items, section }: Readonly<FaqSectionProps>) {
  const t = useTranslations("FaqSection");

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
            {section.ctaLabel && (
              <CTAButton
                href={section.ctaHref ?? "#"}
                label={section.ctaLabel}
                variant="brand-dark"
                size="sm"
                className="mt-5"
              />
            )}
          </div>
          <div className="pt-2">
            {items.length > 0 ? (
              <FaqAccordion items={items} />
            ) : (
              <PublicEmptyState
                icon={MessageCircleQuestion}
                title={t("emptyTitle")}
                description={t("emptyDescription")}
                className="min-h-80 bg-transparent"
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
