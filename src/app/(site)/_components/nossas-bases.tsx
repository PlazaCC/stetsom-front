import SectionLabel from "@/components/ui/section-label";

export default function NossasBases() {
  const BASES = [
    {
      title: "Excelência Técnica",
      description:
        "Cuidado extremo no design e fabricação de cada produto. Cada amplificador Stetsom é testado rigorosamente para garantir performance e durabilidade.",
    },
    {
      title: "Compromisso com o Cliente",
      description:
        "Cada cliente é único, cada projeto é especial. Nós entendemos que em um mudo competitivo a voz do cliente define nosso futuro.",
    },
    {
      title: "Inovação Contínua",
      description:
        "P&D constante para desenvolver soluções que surpreendem. Investimos em tecnologia e talento para manter a liderança no mercado.",
    },
  ];

  return (
    <section className="bg-off-white py-20">
      <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
        <SectionLabel label="Como Trabalhamos" title="NOSSAS BASES" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
          {BASES.map((base) => (
            <div key={base.title}>
              <div className="w-12 h-1 bg-brand mb-6" />
              <h3 className="font-sans-condensed font-bold text-[22px] uppercase text-brand-dark mb-4">
                {base.title}
              </h3>
              <p className="text-base text-[rgb(102,102,102)] leading-[1.7]">
                {base.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
