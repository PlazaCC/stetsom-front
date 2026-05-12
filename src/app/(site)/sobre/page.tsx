import SectionLabel from '@/components/ui/section-label'
import { getSiteAboutPayload } from '@/lib/api/server'
import Image from 'next/image'
import CTATrabalheConosco from '../_components/cta-trabalhe-conosco'
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
      <section className='relative bg-[rgb(9,9,11)] h-[400px] overflow-hidden flex items-center'>
        <Image
          src={aboutPayload.hero.image}
          alt={aboutPayload.hero.imageAlt}
          fill
          className='object-cover opacity-35'
          priority
        />
        <div className='relative z-10 px-8 lg:px-[170px] max-w-[1440px] mx-auto w-full'>
          <SectionLabel label={aboutPayload.hero.label} />
          <h1 className='font-sans-condensed font-black text-[72px] leading-none uppercase text-white mt-1'>
            {aboutPayload.hero.title.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* 2. RED BANNER - Milestones Carousel */}
      <RedBanner milestones={aboutPayload.milestones} />

      {/* 3. QUALIDADE INOVADORA - 2 Cols */}
      <QualidadeInovadora values={aboutPayload.values} section={aboutPayload.quality} />

      {/* 4. TIMELINE REFACTORED - Con Sidebar */}
      <TimelineRefactored events={aboutPayload.timeline} />

      {/* 5. NOSSAS BASES - 3 Cards */}
      <NossasBases bases={aboutPayload.bases} />

      {/* 6. NOSSA FAMÍLIA / MÍDIAS SOCIAIS */}
      <MidiasSociais section={aboutPayload.social} />

      {/* 7. CTA - Trabalhe Conosco */}
      <CTATrabalheConosco section={aboutPayload.jobsCta} />
    </div>
  )
}
