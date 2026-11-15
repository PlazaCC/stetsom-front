import type {
  FaqItem,
  GetApiPagesSlug200,
  GetApiPartnerLocations200Item,
  PublicDepartmentItem,
} from "@/api/stetsom/model";
import {
  GetApiDownloadsCategory,
  type GetApiDownloadsCategory as GetApiDownloadsCategoryValue,
} from "@/api/stetsom/model/getApiDownloadsCategory";
import { getApiFaqs } from "@/api/stetsom/server/faq-public/faq-public";
import { getApiConfigPublic } from "@/api/stetsom/server/config-public/config-public";
import {
  getApiDownloads,
  getApiDownloadsCategories,
} from "@/api/stetsom/server/downloads-public/downloads-public";
import { getApiContactDepartments } from "@/api/stetsom/server/contact/contact";
import { getApiLegalPagesPublic } from "@/api/stetsom/server/legal-pages-public/legal-pages-public";
import { getApiPagesSlug } from "@/api/stetsom/server/pages-public/pages-public";
import { getApiPartnerLocations } from "@/api/stetsom/server/partner-locations-public/partner-locations-public";
import { toApiLocale } from "@/i18n/locale";
import { getLocale } from "next-intl/server";
import { SupportPageView } from "./_components/support-page-view";

const DOWNLOAD_PAGE_SIZE = 20;

type SupportSearchParams = {
  page?: string;
  category?: string;
  q?: string;
};

export default async function SuportePage({
  searchParams,
}: {
  searchParams: Promise<SupportSearchParams>;
}) {
  const locale = await getLocale();
  const apiLocale = toApiLocale(locale);
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const category = Object.values(GetApiDownloadsCategory).includes(
    params.category as GetApiDownloadsCategoryValue,
  )
    ? (params.category as GetApiDownloadsCategoryValue)
    : undefined;
  const query = params.q?.trim() || undefined;

  const [
    pageRes,
    serviceCenters,
    departments,
    faqItems,
    legalPages,
    config,
    downloadCategories,
    downloads,
  ] = await Promise.all([
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
    getApiPartnerLocations().catch(() => [] as GetApiPartnerLocations200Item[]),
    getApiContactDepartments().catch(() => [] as PublicDepartmentItem[]),
    getApiFaqs({ locale: apiLocale }).catch(() => [] as FaqItem[]),
    getApiLegalPagesPublic({ locale: apiLocale }).catch(() => []),
    getApiConfigPublic({ locale: apiLocale }).catch(() => undefined),
    getApiDownloadsCategories({ locale: apiLocale }).catch(() => ({
      items: [],
    })),
    getApiDownloads({
      locale: apiLocale,
      page,
      pageSize: DOWNLOAD_PAGE_SIZE,
      category,
      q: query,
    }).catch(() => ({
      items: [],
      total: 0,
      page,
      pageSize: DOWNLOAD_PAGE_SIZE,
      totalPages: 0,
    })),
  ]);

  return (
    <SupportPageView
      data={{
        blocks: pageRes.blocks ?? [],
        serviceCenters,
        departments,
        faqItems,
        downloadCategories: downloadCategories.items,
        downloads: downloads.items,
        downloadsPage: downloads.page,
        downloadsTotal: downloads.total,
        downloadsTotalPages: downloads.totalPages,
        downloadsCategory: category,
        downloadsQuery: query ?? "",
        warrantyHref: config?.warranty_float.href,
        privacyPolicySlug: legalPages.find(
          (page) => page.semantic_key === "PRIVACY_POLICY",
        )?.slug,
      }}
    />
  );
}
