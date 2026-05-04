import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import SectionLabel from "@/components/ui/section-label";

export default function CTATrabalheConosco() {
  return (
    <section className="bg-white py-20">
      <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Texto Esquerda */}
          <div>
            <SectionLabel
              label="Trabalhe Conosco"
              title="VENHA FAZER PARTE DA STETSOM"
            />

            <p className="text-base text-[rgb(102,102,102)] mt-6 leading-[1.7] mb-8">
              Buscamos profissionais apaixonados que compartilham nossa visão de
              inovação e excelência. Se você está pronto para fazer parte de um
              time que cria produtos que transformam experiências de áudio,
              venha nos conhecer.
            </p>

            <a
              href="https://www.linkedin.com/company/stetsom/jobs/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-brand hover:bg-brand/90 text-white font-sans-condensed uppercase font-bold inline-flex items-center gap-2">
                Ver Vagas no LinkedIn
                <ExternalLink size={18} />
              </Button>
            </a>
          </div>

          {/* Imagem Direita */}
          <div className="relative w-full aspect-square bg-[rgb(240,240,240)] rounded-sm flex items-center justify-center">
            <Image
              src="/about-jobs.png"
              alt="Trabalhe Conosco"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
