"use client";

import { RichText } from "@/components/editor/block-text/rich-text";

import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

type AboutBase = {
  id?: string;
  icon: string;
  title: string;
  description: string;
};

interface OurFoundationsProps {
  bases: AboutBase[];
  label?: string;
  title?: string;
  className?: string;
}

export function OurFoundations({
  bases,
  label,
  title,
  className,
}: Readonly<OurFoundationsProps>) {
  return (
    <section className={cn("bg-off-white py-12", className)}>
      <Container>
        <SectionLabel rich label={label ?? ""} title={title} />

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
              <RichText
                headingLevel={3}
                className="mb-1 font-sans-condensed text-3xl font-bold text-balance text-brand-dark uppercase"
                content={base.title}
              />
              <RichText
                className="text-base text-text-subtle"
                content={base.description}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
