import SectionLabel from '@/components/ui/section-label'
import { getSupportPayload } from '@/lib/api/server'
import FaqAccordion from '../_components/faq-accordion'

export default async function SuportePage() {
  const supportPayload = await getSupportPayload()

  return (
    <div>
      {/* HERO */}
      <section className='bg-brand-dark px-8 lg:px-[170px] py-20 max-w-[1440px] mx-auto'>
        <SectionLabel label={supportPayload.heroLabel} />
        <h1 className='font-sans-condensed font-black text-[60px] leading-none uppercase text-white mt-1'>
          {supportPayload.heroTitle}
        </h1>
        <p className='text-base text-[rgb(184,184,184)] mt-4 max-w-[480px]'>{supportPayload.heroDescription}</p>
      </section>

      {/* CARDS */}
      <section className='bg-white py-15 px-8 lg:px-[170px] max-w-[1440px] mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-15'>
          {supportPayload.cards.map((card) => (
            <div key={card.id} className='border border-zinc-200 p-7 flex flex-col'>
              <div className='w-8 h-[3px] bg-brand mb-4' />
              <div className='font-sans-condensed font-bold text-[22px] uppercase text-brand-dark mb-2.5'>
                {card.title}
              </div>
              <p className='text-sm text-[rgb(102,102,102)] leading-relaxed flex-1'>{card.description}</p>
              <button className='mt-5 self-start h-9 px-5 bg-brand text-white font-sans-condensed font-bold text-[13px] uppercase hover:bg-brand/90 transition-colors'>
                {card.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <SectionLabel label={supportPayload.faqLabel} title={supportPayload.faqTitle} />
        <div className='max-w-[700px] mt-7'>
          <FaqAccordion items={supportPayload.faq} />
        </div>
      </section>

      {/* MAPA */}
      <section className='bg-off-white py-12 px-8 lg:px-[170px]'>
        <div className='max-w-[1440px] mx-auto'>
          <SectionLabel
            label={supportPayload.distributorLabel}
            title={supportPayload.distributorTitle}
            subtitle={supportPayload.distributorSubtitle}
          />
          <div className='mt-7 bg-zinc-200 h-[300px] rounded flex items-center justify-center'>
            <span className='font-sans-condensed font-medium text-base text-zinc-400 uppercase'>
              {supportPayload.distributorMapLabel}
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
