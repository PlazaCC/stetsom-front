import Link from "next/link"
import SectionLabel from "@/components/ui/section-label"
import FaqAccordion from "../_components/faq-accordion"

const FAQ_ITEMS = [
  {
    q: "Como instalar meu amplificador?",
    a: "Siga o manual de instalação incluso no produto. Para instalações profissionais, recomendamos um instalador autorizado Stetsom.",
  },
  {
    q: "Qual a diferença entre 1 Ohm e 2 Ohms?",
    a: "A impedância afeta diretamente a carga sobre o amplificador. Impedâncias menores permitem maior potência de saída, exigindo equipamentos adequados.",
  },
  {
    q: "Como verificar a garantia?",
    a: "Acesse garantia.stetsom.com.br e informe o número de série do produto.",
  },
  {
    q: "Onde encontrar postos autorizados?",
    a: "Temos mais de 500 distribuidores autorizados em todo o Brasil. Use o localizador abaixo.",
  },
]

export default function SuportePage() {
  return (
    <div>
      {/* HERO */}
      <section className="bg-brand-dark px-8 lg:px-[170px] py-20 max-w-[1440px] mx-auto">
        <SectionLabel label="Estamos aqui" />
        <h1 className="font-sans-condensed font-black text-[60px] leading-none uppercase text-white mt-1">
          CENTRAL
          <br />
          DE AJUDA
        </h1>
        <p className="text-base text-[rgb(184,184,184)] mt-4 max-w-[480px]">
          Encontre suporte técnico, distribuidores autorizados e tire suas dúvidas sobre
          nossos produtos.
        </p>
      </section>

      {/* CARDS */}
      <section className="bg-white py-15 px-8 lg:px-[170px] max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-15">
          {[
            ["Suporte Técnico", "Entre em contato com nossa equipe técnica especializada.", "Abrir Ticket"],
            ["Garantia", "Consulte o status da garantia do seu produto Stetsom.", "Consultar Garantia"],
            ["Distribuidores", "Encontre um distribuidor autorizado próximo de você.", "Ver Distribuidores"],
          ].map(([t, d, cta]) => (
            <div key={t} className="border border-zinc-200 p-7 flex flex-col">
              <div className="w-8 h-[3px] bg-brand mb-4" />
              <div className="font-sans-condensed font-bold text-[22px] uppercase text-brand-dark mb-2.5">
                {t}
              </div>
              <p className="text-sm text-[rgb(102,102,102)] leading-relaxed flex-1">{d}</p>
              <button className="mt-5 self-start h-9 px-5 bg-brand text-white font-sans-condensed font-bold text-[13px] uppercase hover:bg-brand/90 transition-colors">
                {cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <SectionLabel label="Dúvidas" title={"PERGUNTAS\nFREQUENTES"} />
        <div className="max-w-[700px] mt-7">
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* MAPA */}
      <section className="bg-off-white py-12 px-8 lg:px-[170px]">
        <div className="max-w-[1440px] mx-auto">
          <SectionLabel
            label="Distribuidores"
            title="ENCONTRE UM PONTO DE VENDA"
            subtitle="Rede de distribuição em todo o Brasil e mais de 60 países."
          />
          <div className="mt-7 bg-zinc-200 h-[300px] rounded flex items-center justify-center">
            <span className="font-sans-condensed font-medium text-base text-zinc-400 uppercase">
              Mapa de Distribuidores
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
