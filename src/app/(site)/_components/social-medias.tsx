import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import SectionLabel from "@/components/ui/section-label";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MidiasSociais() {
  return (
    <section className="flex justify-center bg-white py-12">
      <Container>
        <div className="flex justify-between items-end mb-8">
          <SectionLabel
            label="@stetsombrasil"
            title="MÍDIAS SOCIAIS"
            subtitle="Participe da comunidade de profissionais do áudio."
          />
          <span className="font-sans-condensed font-medium text-base text-brand cursor-pointer hover:text-brand/80 transition-colors">
            Seguir no instagram ›
          </span>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-[250px] h-[250px] shrink-0 rounded-sm bg-cover bg-center"
              style={{
                backgroundImage: "url('/brand-image.png')",
                opacity: 0.8 + i * 0.04,
              }}
            />
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button size="icon" variant="ghost" className="cursor-pointer">
            <ChevronLeft />
          </Button>
          <Button size="icon" variant="ghost" className="cursor-pointer">
            <ChevronRight />
          </Button>
        </div>
      </Container>
    </section>
  );
}
