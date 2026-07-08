import type { PartnerLocation } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { useTranslations } from "next-intl";
import { ServiceCentersExplorer } from "./service-centers-explorer";

interface SupportServiceCentersProps {
  serviceCenters: PartnerLocation[];
}

export function SupportServiceCenters({
  serviceCenters,
}: Readonly<SupportServiceCentersProps>) {
  const t = useTranslations("Support.serviceCenters");

  return (
    <section
      id="service-centers"
      className="w-full scroll-mt-24 bg-white py-12"
    >
      <Container>
        <SectionLabel label={t("label")} title={t("title")} />
        <p className="mt-2 text-sm text-text-subtle">{t("description")}</p>
        <ServiceCentersExplorer serviceCenters={serviceCenters ?? []} />
      </Container>
    </section>
  );
}
