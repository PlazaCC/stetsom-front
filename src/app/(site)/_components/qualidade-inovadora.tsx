import Image from "next/image";
import SectionLabel from "@/components/ui/section-label";
import { Rocket, ShieldCheck, Zap } from "lucide-react";

export default function QualidadeInovadora() {
  const VALORES = [
    {
      icon: Zap,
      title: "Potência",
      description:
        'Quando se fala em STETSOM, logo associamos ao Slogan da marca: "Potência sem limites".',
    },
    {
      icon: ShieldCheck,
      title: "Qualidade",
      description:
        "Desde 1989 fazemos o melhor para fazer sempre! Esse é o nosso lema.",
    },
    {
      icon: Rocket,
      title: "Inovação",
      description:
        "Projetados para serem objetos de desejo, os produtos STETSOM ocupam lugar de destaque.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="px-8 lg:px-42.5 max-w-360 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Imagem Esquerda */}
          <div className="relative w-full aspect-square bg-[rgb(240,240,240)] rounded-sm flex items-center justify-center">
            <Image
              src="/about-quality.png"
              alt="Qualidade"
              fill
              className="object-cover"
            />
          </div>

          {/* Texto + Cards Direita */}
          <div>
            <SectionLabel label="Sobre Nós" title="QUALIDADE INOVADORA" />

            <p className="text-base text-[rgb(102,102,102)] mt-6 leading-[1.7]">
              A inovação recorre da nossa sede pois sem um diferencial o mercado
              não existe. O longo de três décadas, construímos uma reputação
              sólida de Brasil e no mundo, desenvolvimento de produtos que
              conquistam audiências profissionais.
            </p>

            {/* 3 Value Cards */}
            <div className="grid grid-cols-1 gap-6 mt-10">
              {VALORES.map((valor) => (
                <div key={valor.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full  flex items-center justify-center text-white font-bold shrink-0">
                    <valor.icon
                      className="w-4 h-4 text-brand"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="font-sans-condensed font-bold text-base uppercase text-brand-dark mb-2">
                      {valor.title}
                    </h3>
                    <p className="text-sm text-[rgb(102,102,102)] leading-relaxed">
                      {valor.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
