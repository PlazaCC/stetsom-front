"use client";

import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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

export function OurFoundations({
  bases,
  className,
}: Readonly<OurFoundationsProps>) {
  const t = useTranslations("About");

  return (
    <section className={cn("bg-off-white py-12", className)}>
      <Container>
        <SectionLabel
          label={t("foundationsLabel")}
          title={t("foundationsTitle")}
        />

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          {bases.map((base, index) => (
            <div
              key={base.id ?? index}
              className="box-border min-h-50 w-full border-b-4 border-transparent bg-white p-3 pt-0 transition-colors duration-100 hover:border-brand md:w-87.5"
            >
              <div className="relative my-1 mb-2 h-10 w-11">
                <span className="absolute inline-block scale-x-110 scale-y-130 text-[36px] font-black text-muted">
                  0{base.id ?? index + 1}
                </span>
              </div>
              <h3 className="mb-1 font-sans-condensed text-3xl font-bold text-balance text-brand-dark uppercase">
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
