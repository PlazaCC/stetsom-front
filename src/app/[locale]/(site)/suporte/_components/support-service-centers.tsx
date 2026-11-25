import type { GetApiPartnerLocations200Item } from "@/api/stetsom/model";
import { RichText } from "@/components/editor/block-text/rich-text";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { ServiceCentersExplorer } from "./service-centers-explorer";
import { useTranslations } from "next-intl";

interface SupportServiceCentersProps {
  serviceCenters: GetApiPartnerLocations200Item[];
  header?: { label?: string; title?: string; description?: string };
}

export function SupportServiceCenters({
  serviceCenters,
  header,
}: Readonly<SupportServiceCentersProps>) {
  const t = useTranslations("Support.serviceCenters");

  return (
    <section
      id="service-centers"
      className="w-full scroll-mt-header bg-white py-12"
    >
      <Container>
        <SectionLabel
          rich
          label={header?.label || t("label")}
          title={header?.title || t("title")}
        />
        <RichText
          className="mt-2 text-sm text-text-subtle"
          content={header?.description || t("description")}
        />
        <ServiceCentersExplorer serviceCenters={serviceCenters ?? []} />
      </Container>
    </section>
  );
}
