import type { PartnerLocation } from "@/api/stetsom/model";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ServiceCenterList } from "./service-center-list";

const DEFAULT_MAP_IMAGE = "/figma-assets/raw/fill_KULSWW_74ec6dcf.png";

interface SupportServiceCentersProps {
  serviceCenters: PartnerLocation[];
  mapImage?: string;
}

export async function SupportServiceCenters({
  serviceCenters,
  mapImage,
}: Readonly<SupportServiceCentersProps>) {
  const t = await getTranslations("Support.serviceCenters");

  return (
    <section className="w-full bg-white py-12">
      <Container>
        <SectionLabel label={t("label")} title={t("title")} />
        <p className="mt-2 text-sm text-text-subtle">{t("description")}</p>
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8">
          <ServiceCenterList serviceCenters={serviceCenters ?? []} />

          <div className="relative flex-1 overflow-hidden rounded-2xl bg-muted lg:min-h-114.25">
            <Image
              src={mapImage ?? DEFAULT_MAP_IMAGE}
              alt={t("mapAlt")}
              fill
              className="object-cover opacity-60"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-brand p-3 shadow-lg">
                <MapPin size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
