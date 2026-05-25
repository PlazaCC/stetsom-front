import { getCmsProvider } from "@/lib/api/provider";
import { getLocale } from "next-intl/server";
import { SupportCards } from "./_components/support-cards";
import { SupportContact } from "./_components/support-contact";
import { SupportDocumentation } from "./_components/support-documentation";
import { SupportFAQ } from "./_components/support-faq";
import { SupportHero } from "./_components/support-hero";
import { SupportServiceCenters } from "./_components/support-service-centers";

export default async function SuportePage() {
  const supportPayload = await getCmsProvider().getSupportPayload(
    await getLocale(),
  );
  const categories = supportPayload.documentationCategories ?? [];
  const serviceCenters = supportPayload.serviceCenters ?? [];

  return (
    <div>
      <SupportHero hero={supportPayload.hero} />
      <SupportCards cards={supportPayload.cards} />
      <SupportContact
        contact={supportPayload.contact}
        contactInfo={supportPayload.contactInfo}
      />
      <SupportServiceCenters
        serviceCenters={serviceCenters}
        mapImage={supportPayload.mapImage}
      />
      <SupportDocumentation
        categories={categories}
        files={supportPayload.documentationFiles}
      />
      <SupportFAQ faq={supportPayload.faq} />
    </div>
  );
}
