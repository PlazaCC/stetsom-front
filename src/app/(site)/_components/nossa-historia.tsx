import Container from "@/components/ui/container";
import SectionLabel from "@/components/ui/section-label";
import Image from "next/image";
import Link from "next/link";

const COMPANY_METRICS = [
  { value: "35+", label: "ANOS DE MERCADO" },
  { value: "200+", label: "PRODUTOS" },
  { value: "60+", label: "PAÍSES DE EXPORTAÇÃO" },
  { value: "1M+", label: "UNIDADES VENDIDAS" },
];

export default function NossaHistoria() {
  return (
    <section className="bg-brand-dark flex justify-center min-h-132">
      <Container className="flex w-full items-stretch">
        <div className="relative hidden lg:block shrink-0 flex-1">
          <Image
            src="/about-bg.png"
            alt="Nossa história"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12 lg:px-18 lg:py-0">
          <div className="max-w-122 w-full">
            <SectionLabel
              label="Nossa História"
              title={"CONSTRUINDO\nCOM PROPÓSITO"}
              subtitle="Há mais de 35 anos desenvolvemos tecnologia de amplificação que define o padrão de qualidade no mercado automotivo. Cada produto é projetado para quem leva o som a sério."
              dark
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 lg:mt-7">
              {COMPANY_METRICS.map((metric) => (
                <div key={metric.label} className="px-0 py-0">
                  <div className="flex items-start gap-1 leading-none">
                    <div className="font-sans-condensed font-black text-[48px] lg:text-[52px] text-white leading-none">
                      {metric.value.replace("+", "")}
                    </div>
                    <span className="font-sans-condensed font-black text-[48px] lg:text-[52px] text-brand leading-none">
                      +
                    </span>
                  </div>
                  <div className="font-medium text-[12px] lg:text-[13px] uppercase text-[rgb(184,184,184)] mt-0.5">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/sobre"
              className="inline-flex items-center justify-center h-9 px-6 bg-brand text-white font-sans-condensed font-bold text-sm uppercase tracking-wide hover:bg-brand/90 transition-colors mt-8"
            >
              Conheça mais →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
