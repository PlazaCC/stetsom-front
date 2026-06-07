import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

type AboutBase = {
  id?: string;
  icon: string;
  title: string;
  description: string;
};

interface OurFoundationsProps {
  bases: AboutBase[];
  className?: string;
}

export async function OurFoundations({
  bases,
  className,
}: Readonly<OurFoundationsProps>) {
  const t = await getTranslations("About");

  return (
    <section className={cn("bg-white py-12", className)}>
      <Container>
        <SectionLabel
          label={t("foundationsLabel")}
          title={t("foundationsTitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {bases.map((base, index) => (
            <div key={base.id ?? index}>
              <div className="w-12 h-1 bg-brand mb-6" />
              <h3 className="font-sans-condensed font-black text-section-title uppercase text-brand-dark mb-4">
                {base.title}
              </h3>
              <p className="text-base text-text-subtle">{base.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
