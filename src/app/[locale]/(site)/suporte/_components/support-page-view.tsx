"use client";

import type {
  FaqItem,
  PageBlock,
  PartnerLocation,
  PublicDepartmentItem,
} from "@/api/stetsom/model";
import {
  getPageBlock,
  type FaqBlockData,
  type SupportCardsBlockData,
  type SupportContactBlockData,
  type SupportDocBlockData,
  type SupportHeroBlockData,
  type SupportServiceCentersBlockData,
} from "@/lib/page-blocks";
import { EditableSection } from "../../_components/editable-section";
import { FaqSection } from "../../_components/faq-section";
import { SupportCards } from "./support-cards";
import { SupportContact } from "./support-contact";
import { SupportDocumentation } from "./support-documentation";
import { SupportHero } from "./support-hero";
import { SupportServiceCenters } from "./support-service-centers";

export interface SupportPageViewData {
  blocks: PageBlock[];
  serviceCenters: PartnerLocation[];
  departments: PublicDepartmentItem[];
  faqItems: FaqItem[];
}

interface SupportPageViewProps {
  data: SupportPageViewData;
  /** CMS live-preview mode: stamps `data-editor-target` on each section. */
  editable?: boolean;
}

export function SupportPageView({
  data,
  editable = false,
}: Readonly<SupportPageViewProps>) {
  const { blocks, serviceCenters, departments, faqItems } = data;

  const heroData = getPageBlock<SupportHeroBlockData>(blocks, "hero");
  const cardsData = getPageBlock<SupportCardsBlockData>(blocks, "cards");
  const contactData = getPageBlock<SupportContactBlockData>(blocks, "contact");
  const docData = getPageBlock<SupportDocBlockData>(blocks, "documentation");
  const faqData = getPageBlock<FaqBlockData>(blocks, "faq");
  const mapData = getPageBlock<SupportServiceCentersBlockData>(
    blocks,
    "service_centers",
  );

  return (
    <div>
      {!heroData.hidden && (
        <EditableSection target="section:hero" editable={editable}>
          <SupportHero
            hero={{
              image:
                heroData.image_url ??
                "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
              badge: heroData.badge,
              label: heroData.label,
              title: heroData.title ?? "Suporte Stetsom",
              subtitle: heroData.subtitle,
              description: heroData.description,
              watermarkText: heroData.watermarkText,
            }}
          />
        </EditableSection>
      )}
      {!cardsData.hidden && cardsData.items?.length ? (
        <EditableSection target="section:cards" editable={editable}>
          <SupportCards cards={cardsData.items} />
        </EditableSection>
      ) : null}
      {!contactData.hidden && (
        <EditableSection target="section:contact" editable={editable}>
          <SupportContact
            contact={{
              label: contactData.label,
              title: contactData.title,
              description: contactData.description,
            }}
            contactInfo={{
              phone: contactData.phone,
              email: contactData.email,
              whatsapp: contactData.whatsapp,
            }}
            departments={departments}
          />
        </EditableSection>
      )}
      {!mapData.hidden && (
        <EditableSection target="section:service_centers" editable={editable}>
          <SupportServiceCenters serviceCenters={serviceCenters} />
        </EditableSection>
      )}
      {!docData.hidden &&
      (docData.categories?.length || docData.files?.length) ? (
        <EditableSection target="section:documentation" editable={editable}>
          <SupportDocumentation
            categories={docData.categories ?? []}
            files={docData.files ?? []}
          />
        </EditableSection>
      ) : null}
      {!faqData.hidden && faqItems.length ? (
        <EditableSection target="section:faq" editable={editable}>
          <FaqSection
            items={faqItems}
            section={{
              label: faqData.section?.label ?? "",
              title: faqData.section?.title ?? "",
              subtitle: faqData.section?.subtitle,
              ctaHref: faqData.section?.ctaHref,
              ctaLabel: faqData.section?.ctaLabel,
            }}
          />
        </EditableSection>
      ) : null}
    </div>
  );
}
