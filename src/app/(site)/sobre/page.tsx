import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSiteAboutPayload } from '@/lib/api/server'
import Image from 'next/image'
import CTATrabalheConosco from '../_components/cta-trabalhe-conosco'
import GaleriaDark from '../_components/galeria-dark'
import NossasBases from '../_components/nossas-bases'
import QualidadeInovadora from '../_components/qualidade-inovadora'
import RedBanner from '../_components/red-banner'
import MidiasSociais from '../_components/social-medias'
import TimelineRefactored from '../_components/timeline-refactored'

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
          <SectionLabel label={aboutPayload.hero.label} />
          <h1 className='font-sans-condensed font-black text-7xl leading-none uppercase text-white mt-1'>
            {aboutPayload.hero.title.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
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

      {/* 8. CTA - Trabalhe Conosco (conteúdo extra, não mapeado no Figma) */}
      <CTATrabalheConosco section={aboutPayload.jobsCta} />
    </div>
  )
}
