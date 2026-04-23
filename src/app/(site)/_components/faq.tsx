import Container from "@/components/ui/container";
import SectionLabel from "@/components/ui/section-label";
import Link from "next/link";
import FaqAccordion from "./faq-accordion";

const FAQ_ITEMS = [
  {
    q: "Qual a diferença entre 1 Ohm e 2 Ohms de impedância?",
    a: "A impedância afeta diretamente a carga sobre o amplificador. Impedâncias menores (1 Ohm) permitem maior potência de saída, porém exigem equipamentos preparados para suportar essa carga.",
  },
  {
    q: "Como verificar a garantia do meu produto?",
    a: "Acesse nossa central de garantia em garantia.stetsom.com.br e informe o número de série do produto para consultar o status da garantia.",
  },
  {
    q: "Onde encontrar postos autorizados Stetsom?",
    a: "Temos uma rede de mais de 500 distribuidores autorizados em todo o Brasil. Use nosso localizador na página de Suporte.",
  },
];

export default function Faq() {
  return (
    <section className="bg-off-white py-12 justify-center flex">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <SectionLabel
              label="Dúvidas"
              title={"PERGUNTAS\nFREQUENTES"}
              subtitle="Não encontrou o que procura? Entre em contato com nosso suporte."
            />
            <Link
              href="/suporte"
              className="mt-7 inline-flex items-center justify-center h-9 px-6 bg-[rgb(31,31,31)] text-white font-sans-condensed font-bold text-sm uppercase hover:bg-zinc-800 transition-colors"
            >
              Falar com suporte →
            </Link>
          </div>
          <div className="pt-2">
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </div>
      </Container>
    </section>
  );
}
