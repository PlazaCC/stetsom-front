import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSupportPayload } from '@/lib/api/server'
import FaqAccordion from '../_components/faq-accordion'

export default async function SuportePage() {
  const supportPayload = await getSupportPayload()

  return (
    <div>
      {/* HERO */}
      <section className='bg-brand-dark py-20'>
        <Container>
          <SectionLabel label={supportPayload.heroLabel} />
          <h1 className='font-sans-condensed font-black text-6xl leading-none uppercase text-white mt-1'>
            {supportPayload.heroTitle}
          </h1>
          <p className='text-base text-text-subtle-dark mt-4 max-w-120'>{supportPayload.heroDescription}</p>
        </Container>
      </section>

      {/* CARDS */}
      <section className='bg-white py-15'>
        <Container>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-15'>
            {supportPayload.cards.map((card) => (
              <div key={card.id} className='border border-zinc-200 p-7 flex flex-col'>
                <div className='w-8 h-0.75 bg-brand mb-4' />
                <div className='font-sans-condensed font-bold text-section-title uppercase text-brand-dark mb-2.5'>
                  {card.title}
                </div>
                <p className='text-sm text-text-subtle leading-relaxed flex-1'>{card.description}</p>
                <button className='mt-5 self-start h-9 px-5 bg-brand text-white font-sans-condensed font-bold text-button-md uppercase hover:bg-brand/90 transition-colors'>
                  {card.cta}
                </button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <SectionLabel label={supportPayload.faqLabel} title={supportPayload.faqTitle} />
          <div className='max-w-175 mt-7'>
            <FaqAccordion items={supportPayload.faq} />
          </div>
        </Container>
      </section>

      {/* MAPA */}
      <section className='bg-off-white py-12'>
        <Container>
          <SectionLabel
            label={supportPayload.distributorLabel}
            title={supportPayload.distributorTitle}
            subtitle={supportPayload.distributorSubtitle}
          />
          <div className='mt-7 bg-zinc-200 h-75 rounded flex items-center justify-center'>
            <span className='font-sans-condensed font-medium text-base text-zinc-400 uppercase'>
              {supportPayload.distributorMapLabel}
            </span>
          </div>
        </Container>
      </section>
    </div>
  )
}
