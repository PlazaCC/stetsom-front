"use client";

import type { PageSection } from "./section-form-types";
import { SectionFormHeroCarousel } from "./section-form-hero-carousel";
import { SectionFormHeroStatic } from "./section-form-hero-static";
import { SectionFormFaq } from "./section-form-faq";
import { SectionFormStats } from "./section-form-stats";
import { SectionFormMilestones } from "./section-form-milestones";
import { SectionFormSocialFeed } from "./section-form-social-feed";
import { SectionFormValues } from "./section-form-values";
import { SectionFormTimeline } from "./section-form-timeline";
import { SectionFormSupportCards } from "./section-form-support-cards";
import { SectionFormServiceCenters } from "./section-form-service-centers";
import { SectionFormContactConfig } from "./section-form-contact-config";
import { SectionFormFoundations } from "./section-form-foundations";
import { SectionFormProductGrid } from "./section-form-product-grid";
import { SectionFormDownloadCatalog } from "./section-form-download-catalog";
import { AlertTriangle } from "lucide-react";

interface SectionFormRendererProps {
  section: PageSection;
  onChange: (data: Record<string, unknown>) => void;
  onFileChange?: (fieldKey: string, file: File | null) => void;
}

export function SectionFormRenderer({
  section,
  onChange,
  onFileChange,
}: SectionFormRendererProps) {
  const props = { section, onChange, onFileChange };

  switch (section.type) {
    case "HERO_CAROUSEL":
      return <SectionFormHeroCarousel {...props} />;
    case "HERO_STATIC":
    case "CATALOG_HERO":
      return <SectionFormHeroStatic {...props} />;
    case "FAQ_ACCORDION":
      return <SectionFormFaq {...props} />;
    case "STATS_ROW":
      return <SectionFormStats {...props} />;
    case "MILESTONES_MARQUEE":
      return <SectionFormMilestones {...props} />;
    case "SOCIAL_FEED":
      return <SectionFormSocialFeed {...props} />;
    case "VALUES_GRID":
      return <SectionFormValues {...props} />;
    case "TIMELINE_VERTICAL":
      return <SectionFormTimeline {...props} />;
    case "SUPPORT_CARDS":
      return <SectionFormSupportCards {...props} />;
    case "SERVICE_CENTERS":
      return <SectionFormServiceCenters {...props} />;
    case "CONTACT_FORM_CONFIG":
      return <SectionFormContactConfig {...props} />;
    case "FOUNDATIONS_GRID":
      return <SectionFormFoundations {...props} />;
    case "PRODUCT_GRID":
      return <SectionFormProductGrid {...props} />;
    case "DOWNLOAD_CATALOG":
      return <SectionFormDownloadCatalog {...props} />;
    default:
      return (
        <div className="flex items-start gap-3 rounded-[12px] border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Tipo de seção não suportado: {section.type}
            </p>
            <p className="mt-0.5 text-xs text-amber-600">
              Este tipo de seção ainda não possui editor configurado.
            </p>
          </div>
        </div>
      );
  }
}
