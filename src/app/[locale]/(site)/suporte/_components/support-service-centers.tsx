import type { GetApiPartnerLocations200Item } from "@/api/stetsom/model";
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
          label={header?.label || t("label")}
          title={header?.title || t("title")}
        />
        <p className="mt-2 text-sm text-text-subtle">
          {header?.description || t("description")}
        </p>
        <ServiceCentersExplorer serviceCenters={serviceCenters ?? []} />
      </Container>
    </section>
  );
}
