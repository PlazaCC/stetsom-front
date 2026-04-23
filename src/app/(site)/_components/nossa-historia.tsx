import Container from "@/components/ui/container";
import SectionLabel from "@/components/ui/section-label";
import { Link } from "lucide-react";
import Image from "next/image";

export default function NossaHistoria() {
  return (
    <section className="bg-brand-dark flex justify-center h-[528px]">
      <Container className="flex">
        <div className="relative hidden lg:block shrink-0 flex-1">
          <Image
            src="/about-bg.png"
            alt="Nossa história"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-8 lg:px-[72px]">
          <div className="max-w-[448px] w-full">
            <SectionLabel
              label="Nossa História"
              title={"CONSTRUINDO\nCOM PROPÓSITO"}
              subtitle="Há mais de 35 anos desenvolvemos tecnologia de amplificação que define o padrão de qualidade no mercado automotivo. Cada produto é projetado para quem leva o som a sério."
              dark
            />

            <Link
              href="/sobre"
              className="inline-flex items-center justify-center h-9 px-6 bg-brand text-white font-sans-condensed font-bold text-sm uppercase tracking-wide hover:bg-brand/90 transition-colors"
            >
              Conheça mais →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}