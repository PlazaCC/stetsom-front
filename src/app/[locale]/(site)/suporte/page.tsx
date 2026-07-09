import type {
  FaqItem,
  GetApiPagesSlug200,
  PartnerLocation,
  PublicDepartmentItem,
} from "@/api/stetsom/model";
import { getApiFaqs } from "@/api/stetsom/server/faq-public/faq-public";
import { getApiContactDepartments } from "@/api/stetsom/server/contact/contact";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { getApiPartnerLocations } from "@/api/stetsom/server/partner-locations-public/partner-locations-public";
import { toApiLocale } from "@/lib/api/i18n-utils";
import { getLocale } from "next-intl/server";
import { SupportPageView } from "./_components/support-page-view";

export default async function SuportePage() {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);

  const [pageRes, serviceCenters, departments, faqItems] = await Promise.all([
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
    getApiContactDepartments().catch(() => [] as PublicDepartmentItem[]),
    getApiFaqs({ locale: apiLocale }).catch(() => [] as FaqItem[]),
  ]);

  return (
    <SupportPageView
      data={{
        blocks: pageRes.blocks ?? [],
        serviceCenters,
        departments,
        faqItems,
      }}
    />
  );
}
