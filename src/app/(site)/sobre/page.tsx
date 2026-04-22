import Image from "next/image"
import SectionLabel from "@/components/ui/section-label"

export default function SobrePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative bg-[rgb(9,9,11)] h-[400px] overflow-hidden flex items-center">
        <Image
          src="/about-bg.png"
          alt=""
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="relative z-10 px-8 lg:px-[170px] max-w-[1440px] mx-auto w-full">
          <SectionLabel label="Quem Somos" />
          <h1 className="font-sans-condensed font-black text-[72px] leading-none uppercase text-white mt-1">
            SOBRE A
            <br />
            STETSOM
          </h1>
        </div>
      </section>

      {/* MISSÃO */}
      <section className="bg-white py-[72px]">
        <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <SectionLabel
              label="Nossa Missão"
              title={"TECNOLOGIA\nQUE TRANSFORMA"}
            />
            <p className="text-base text-[rgb(102,102,102)] mt-5 leading-[1.7]">
              Há mais de 35 anos, a Stetsom desenvolve tecnologia de amplificação que define
              o padrão de qualidade no mercado automotivo brasileiro e internacional.
            </p>
            <p className="text-base text-[rgb(102,102,102)] mt-4 leading-[1.7]">
              Cada produto é projetado para quem leva o som a sério — desde o entusiasta
              até o instalador profissional.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              ["35+", "ANOS DE MERCADO"],
              ["200+", "PRODUTOS"],
              ["60+", "PAÍSES"],
              ["1M+", "UNIDADES VENDIDAS"],
            ].map(([n, l]) => (
              <div key={l} className="bg-brand-dark px-6 py-7">
                <div className="font-sans-condensed font-bold text-[48px] leading-none text-white">
                  {n}
                </div>
                <div className="font-medium text-[13px] uppercase text-[rgb(184,184,184)] mt-1.5">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-off-white py-16">
        <div className="px-8 lg:px-[170px] max-w-[1440px] mx-auto">
          <SectionLabel label="Nossos Valores" title="QUALIDADE SEM COMPROMISSO" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              [
                "Inovação",
                "Investimos continuamente em P&D para desenvolver produtos que superam as expectativas do mercado.",
              ],
              [
                "Qualidade",
                "Cada produto passa por rigoroso controle de qualidade antes de chegar ao cliente.",
              ],
              [
                "Desempenho",
                "Engenharia focada em extrair o máximo de potência e fidelidade sonora.",
              ],
            ].map(([t, d]) => (
              <div key={t}>
                <div className="w-10 h-[3px] bg-brand mb-4" />
                <div className="font-sans-condensed font-bold text-[22px] uppercase text-brand-dark mb-2.5">
                  {t}
                </div>
                <p className="text-[15px] text-[rgb(102,102,102)] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
