"use client";

import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
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
            <motion.div
              key={base.id ?? index}
              className="box-border h-50 w-[350px] border-brand bg-white p-3 pt-0"
              initial={{
                borderBottomWidth: 0,
                borderBottomColor: "transparent",
              }}
              whileHover={{
                borderBottomWidth: 4,
                borderBottomColor: "rgb(232,19,42)",
              }}
              transition={{ type: "tween", duration: 0.1 }}
            >
              <div className="relative my-1 mb-2 h-10 w-11">
                <span className="absolute inline-block scale-x-110 scale-y-130 text-[36px] font-black text-muted">
                  0{base.id ?? index + 1}
                </span>
              </div>
              <h3 className="mb-1 font-sans-condensed text-3xl font-bold text-brand-dark uppercase">
                {base.title}
              </h3>
              <p className="text-base text-text-subtle">{base.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
