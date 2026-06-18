import type { PartnerLocation } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { getTranslations } from "next-intl/server";
import { ServiceCentersExplorer } from "./service-centers-explorer";

interface SupportServiceCentersProps {
  serviceCenters: PartnerLocation[];
}

export async function SupportServiceCenters({
  serviceCenters,
}: Readonly<SupportServiceCentersProps>) {
  const t = await getTranslations("Support.serviceCenters");

  return (
    <section className="w-full bg-white py-12">
      <Container>
        <SectionLabel label={t("label")} title={t("title")} />
        <p className="mt-2 text-sm text-text-subtle">{t("description")}</p>
        <ServiceCentersExplorer serviceCenters={serviceCenters ?? []} />
      </Container>
    </section>
  );
}
