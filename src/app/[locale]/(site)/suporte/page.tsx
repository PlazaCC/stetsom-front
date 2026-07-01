import type { GetApiPagesSlug200, PartnerLocation } from "@/api/stetsom/model";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { getApiPartnerLocations } from "@/api/stetsom/server/partner-locations-public/partner-locations-public";
import { toApiLocale } from "@/lib/api/i18n-utils";
import {
  getPageBlock,
  type SupportCardsBlockData,
  type SupportContactBlockData,
  type SupportDocBlockData,
  type SupportFaqBlockData,
  type SupportHeroBlockData,
  type SupportServiceCentersBlockData,
} from "@/lib/page-blocks";
import { getLocale } from "next-intl/server";
import { SupportCards } from "./_components/support-cards";
import { SupportContact } from "./_components/support-contact";
import { SupportDocumentation } from "./_components/support-documentation";
import { SupportFAQ } from "./_components/support-faq";
import { SupportHero } from "./_components/support-hero";
import { SupportServiceCenters } from "./_components/support-service-centers";

export default async function SuportePage() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [pageRes, serviceCenters] = await Promise.all([
    getApiPagesSlug("support", { locale: apiLocale }).catch(
      () =>
        ({
          id: "",
          slug: "support",
          title: "",
          blocks: [],
          updated_at: "",
        }) satisfies GetApiPagesSlug200,
    ),
    getApiPartnerLocations().catch(() => [] as PartnerLocation[]),
  ]);

  const blocks = pageRes.blocks ?? [];
  const heroData = getPageBlock<SupportHeroBlockData>(blocks, "hero");
  const cardsData = getPageBlock<SupportCardsBlockData>(blocks, "cards");
  const contactData = getPageBlock<SupportContactBlockData>(blocks, "contact");
  const docData = getPageBlock<SupportDocBlockData>(blocks, "documentation");
  const faqData = getPageBlock<SupportFaqBlockData>(blocks, "faq");
  const mapData = getPageBlock<SupportServiceCentersBlockData>(
    blocks,
    "service_centers",
  );

  return (
    <div>
      {!heroData.hidden && (
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
      )}
      {!cardsData.hidden && cardsData.items?.length ? (
        <SupportCards cards={cardsData.items} />
      ) : null}
      {!contactData.hidden && (
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
        />
      )}
      {!mapData.hidden && (
        <SupportServiceCenters serviceCenters={serviceCenters} />
      )}
      {!docData.hidden &&
      (docData.categories?.length || docData.files?.length) ? (
        <SupportDocumentation
          categories={docData.categories ?? []}
          files={docData.files ?? []}
        />
      ) : null}
      {!faqData.hidden && (
        <SupportFAQ
          faq={{
            label: faqData.section?.label,
            title: faqData.section?.title,
            supportButtonLabel: faqData.section?.supportButtonLabel,
            items: faqData.items ?? [],
          }}
        />
      )}
    </div>
  );
}
