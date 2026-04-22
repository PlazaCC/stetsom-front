import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import SectionLabel from "@/components/ui/section-label"
import ProductCard from "@/components/ui/product-card"
import FaqAccordion from "./_components/faq-accordion"

const FEATURED_PRODUCTS = [
  { id: 2, name: "ST-2000EQ MONO", category: "Módulo", spec: "1x 2000W RMS", badge: null, img: "/product-image.png" },
  { id: 3, name: "ST-800.4 COMPACT", category: "Amplificador", spec: "4x 200W RMS", badge: "Oferta", img: "/product-image-2.png" },
  { id: 4, name: "ST-1200.1D BASS", category: "Módulo", spec: "1x 1200W RMS", badge: null, img: "/product-image-2.png" },
  { id: 5, name: "ST-600.4 ULTRA", category: "Amplificador", spec: "4x 150W RMS", badge: null, img: "/product-image.png" },
]

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
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <div className="relative w-full h-[700px] overflow-hidden bg-[rgb(9,9,11)]">
        <Image
          src="/produtos-hero.png"
          alt="Stetsom"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-[170px]">
          <SectionLabel label="Catálogo 2024" className="mb-2" />
          <h1 className="font-sans-condensed font-black text-[90px] leading-none uppercase text-white mt-2">
            SEMPRE
            <br />
            PRIMEIRA
            <br />
            NA POTÊNCIA
          </h1>
          <p className="text-lg text-[rgb(184,184,184)] mt-5 max-w-[480px] leading-relaxed">
            Tecnologia de amplificação que define o padrão de qualidade no mercado automotivo.
          </p>
          <div className="flex gap-3 mt-8">
            <Link
              href="/produtos"
              className="inline-flex items-center justify-center h-12 px-8 bg-brand text-white font-sans-condensed font-bold text-base uppercase tracking-wide hover:bg-brand/90 transition-colors"
            >
              Ver Produtos
            </Link>
            <Link
              href="/sobre"
              className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-white border border-white/40 font-sans-condensed font-bold text-base uppercase hover:border-white/70 transition-colors"
            >
              Nossa História
            </Link>
          </div>
        </div>
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={cn(
                "h-3.5 rounded-full",
                i === 2 ? "w-7 bg-white/90" : "w-3.5 bg-white/35"
              )}
            />
          ))}
        </div>
      </div>

      {/* NOVIDADES */}
      <section className="bg-white py-12">
        <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-8">
            <SectionLabel label="Novidades" title={"CONHEÇA A\nPRATICIDADE"} />
            <div className="flex gap-4 items-center">
              <div className="bg-zinc-100 rounded-lg p-1 flex gap-0.5">
                {["Todos", "Amplif.", "Módulos", "Subw."].map((t, i) => (
                  <div
                    key={t}
                    className={cn(
                      "px-3.5 py-1.5 rounded-md text-[13px] font-semibold cursor-pointer",
                      i === 0 ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400"
                    )}
                  >
                    {t}
                  </div>
                ))}
              </div>
              <Link
                href="/produtos"
                className="font-sans-condensed font-medium text-base text-brand"
              >
                Ver todos ›
              </Link>
            </div>
          </div>
          <div className="grid gap-5" style={{ gridTemplateColumns: "447px 1fr" }}>
            <Link
              href="/produtos/1"
              className="relative bg-[rgb(248,248,248)] rounded-lg border border-zinc-200 hover:border-brand h-[447px] flex items-center justify-center overflow-hidden transition-colors"
            >
              <Image
                src="/product-image.png"
                alt="ST-4000EQ 4 CANAIS"
                width={300}
                height={300}
                className="object-contain max-w-[75%] max-h-[300px] shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-5 pb-4 pt-12">
                <div className="font-sans-condensed font-medium text-[12px] uppercase text-brand">
                  Amplificador
                </div>
                <div className="font-sans-condensed font-bold text-xl uppercase text-white">
                  ST-4000EQ 4 CANAIS
                </div>
              </div>
            </Link>
            <div className="grid grid-cols-2 grid-rows-2 gap-5">
              {FEATURED_PRODUCTS.map((p) => (
                <ProductCard key={p.id} {...p} href={`/produtos/${p.id}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NOSSA HISTÓRIA */}
      <section className="bg-brand-dark flex overflow-hidden" style={{ height: 528 }}>
        <div className="relative hidden lg:block shrink-0" style={{ width: 731 }}>
          <Image src="/about-bg.png" alt="Nossa história" fill className="object-cover" />
        </div>
        <div className="flex-1 flex items-center justify-center px-8 lg:px-[72px]">
          <div className="max-w-[448px] w-full">
            <SectionLabel
              label="Nossa História"
              title={"CONSTRUINDO\nCOM PROPÓSITO"}
              subtitle="Há mais de 35 anos desenvolvemos tecnologia de amplificação que define o padrão de qualidade no mercado automotivo. Cada produto é projetado para quem leva o som a sério."
              dark
            />
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 my-7">
              {[
                ["35+", "ANOS DE MERCADO"],
                ["200+", "PRODUTOS"],
                ["60+", "PAÍSES DE EXPORTAÇÃO"],
                ["1M+", "UNIDADES VENDIDAS"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-sans-condensed font-bold text-[40px] leading-none text-white">
                    {n}
                  </div>
                  <div className="font-medium text-[13px] uppercase text-[rgb(184,184,184)] mt-1">
                    {l}
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/sobre"
              className="inline-flex items-center justify-center h-9 px-6 bg-brand text-white font-sans-condensed font-bold text-sm uppercase tracking-wide hover:bg-brand/90 transition-colors"
            >
              Conheça mais →
            </Link>
          </div>
        </div>
      </section>

      {/* MÍDIAS SOCIAIS */}
      <section className="bg-white py-12">
        <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
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
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-off-white py-12">
        <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
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
        </div>
      </section>
    </div>
  )
}
