import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSiteAboutPayload } from '@/lib/api/server'
import Image from 'next/image'
import CTATrabalheConosco from '../_components/cta-trabalhe-conosco'
import GaleriaDark from '../_components/galeria-dark'
import NossaFabrica from '../_components/nossa-fabrica'
import NossasBases from '../_components/nossas-bases'
import QualidadeInovadora from '../_components/qualidade-inovadora'
import RedBanner from '../_components/red-banner'
import MidiasSociais from '../_components/social-medias'
import TimelineRefactored from '../_components/timeline-refactored'

const ABOUT_HERO_STATS = [
  { value: '35+', label: 'ANOS DE MERCADO' },
  { value: '200+', label: 'PRODUTOS' },
  { value: '60+', label: 'PAÍSES DE EXPORTAÇÃO' },
  { value: '1M+', label: 'UNIDADES VENDIDAS' },
] as const

export default async function SobrePage() {
  const aboutPayload = await getSiteAboutPayload()

  return (
    <div>
      {/* 1. HERO */}
      <section className='relative bg-brand-dark h-109.75 overflow-hidden flex items-center'>
        <Image
          src={aboutPayload.hero.image}
          alt={aboutPayload.hero.imageAlt}
          fill
          className='object-cover opacity-35'
          priority
        />
        <div className='absolute inset-0 bg-gradient-dark-overlay' />
        <Container className='z-10'>
          <div className='grid gap-10 lg:grid-cols-[1fr_428px] lg:items-end'>
            <div>
              <SectionLabel label={aboutPayload.hero.label} />
              <h1 className='font-sans-condensed font-black text-5xl leading-none uppercase text-white mt-1 lg:text-display-2xl'>
                {aboutPayload.hero.title.split('\n').map((line, lineIdx, allLines) => {
                  if (lineIdx === allLines.length - 1) {
                    const words = line.split(' ')
                    const lastWord = words.pop()
                    return (
                      <span key={line} className='block'>
                        {words.length > 0 ? `${words.join(' ')} ` : ''}
                        <span className='text-brand'>{lastWord}</span>
                      </span>
                    )
                  }
                  return (
                    <span key={line} className='block'>
                      {line}
                    </span>
                  )
                })}
              </h1>
              <p className='mt-4 max-w-125 text-base leading-relaxed text-text-subtle-dark'>
                Desde 1989, a Stetsom define o padrão de qualidade em amplificação automotiva brasileira com tecnologia,
                inovação e paixão pelo som.
              </p>
            </div>

            <div className='relative border-t border-white/20 pt-5'>
              <span className='pointer-events-none absolute right-0 top-[-96px] font-sans-condensed text-[112px] font-black leading-none text-white/10'>
                1989
              </span>
              <div className='grid grid-cols-2 border border-white/20'>
                {ABOUT_HERO_STATS.map((stat) => (
                  <div key={stat.label} className='border border-white/20 px-4 py-4'>
                    <p className='font-sans-condensed text-display-sm font-black leading-none text-white'>
                      {stat.value.replace('+', '')}<span className='text-brand'>+</span>
                    </p>
                    <p className='mt-1 text-sm font-sans font-medium uppercase text-text-subtle-dark'>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. RED BANNER - Milestones Carousel */}
      <RedBanner milestones={aboutPayload.milestones} />

      {/* 3. QUALIDADE INOVADORA - 2 Cols */}
      <QualidadeInovadora values={aboutPayload.values} section={aboutPayload.quality} />

      {/* 4. TIMELINE REFACTORED - Con Sidebar */}
      <TimelineRefactored events={aboutPayload.timeline} />

      {/* 5. GALERIA DARK - Qualidade */}
      <GaleriaDark />

      {/* 6. NOSSAS BASES - 3 Cards */}
      <NossasBases bases={aboutPayload.bases} />

      {/* 7. NOSSA FAMÍLIA / MÍDIAS SOCIAIS */}
      <MidiasSociais section={aboutPayload.social} />

      {/* 8. NOSSA FÁBRICA / LOCALIZAÇÃO */}
      <NossaFabrica />

      {/* 9. CTA - Trabalhe Conosco (conteúdo extra, não mapeado no Figma) */}
      <CTATrabalheConosco section={aboutPayload.jobsCta} />
    </div>
  )
}
