import Container from "@/components/ui/container";
import SectionLabel from "@/components/ui/section-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// const COMPANY_METRICS = [
//   { value: "35+", label: "ANOS DE MERCADO" },
//   { value: "200+", label: "PRODUTOS" },
//   { value: "60+", label: "PAÍSES DE EXPORTAÇÃO" },
//   { value: "1M+", label: "UNIDADES VENDIDAS" },
// ];

export default function NossaHistoria() {
  return (
    <section className="flex justify-center bg-brand-dark py-0 lg:min-h-132">
      <Container className="flex w-full flex-col items-stretch lg:flex-row">
        <div className="relative aspect-16/11 w-full shrink-0 overflow-hidden lg:hidden">
          <Image
            src="/about-bg.png"
            alt="Placeholder da nossa história"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative hidden flex-1 shrink-0 overflow-hidden lg:block">
          <Image
            src="/about-bg.png"
            alt="Nossa história"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-8 sm:py-12 lg:px-18 lg:py-0">
          <div className="w-full max-w-122">
            <SectionLabel
              label="Nossa História"
              title={"CONSTRUINDO\nCOM PROPÓSITO"}
              subtitle="Há mais de 35 anos desenvolvemos tecnologia de amplificação que define o padrão de qualidade no mercado automotivo. Cada produto é projetado para quem leva o som a sério."
              dark
            />

            {/* <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 lg:mt-7">
              {COMPANY_METRICS.map((metric) => (
                <div key={metric.label} className="px-0 py-0">
                  <div className="flex items-start gap-1 leading-none">
                    <div className="font-sans-condensed text-[42px] font-black leading-none text-white lg:text-[52px]">
                      {metric.value.replace("+", "")}
                    </div>
                    <span className="font-sans-condensed text-[42px] font-black leading-none text-brand lg:text-[52px]">
                      +
                    </span>
                  </div>
                  <div className="mt-0.5 text-[12px] font-medium uppercase text-[rgb(184,184,184)] lg:text-[13px]">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div> */}

            <Link
              href="/sobre"
              className={cn(
                buttonVariants({ variant: "brand", size: "figma-sm" }),
                "mt-8",
              )}
            >
              Conheça mais
              <ArrowRight className="size-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
