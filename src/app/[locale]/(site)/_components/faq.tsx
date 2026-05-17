import { Container } from '@/components/ui/container'
import { CTAButton } from '@/components/ui/cta-button'
import { SectionLabel } from '@/components/ui/section-label'
import type { FAQItem, SiteHomePayload } from '@/lib/api/contracts'
import { FaqAccordion } from './faq-accordion'

interface FaqProps {
  items: FAQItem[]
  section: SiteHomePayload['faqSection']
}

export function Faq({ items, section }: Readonly<FaqProps>) {
  return (
    <section className='bg-off-white py-12 justify-center flex'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20'>
          <div>
            <SectionLabel label={section.label} title={section.title} subtitle={section.subtitle} />
            <CTAButton href={section.ctaHref} label={section.ctaLabel} variant='brand-dark' size='sm' className='mt-7' />
          </div>
          <div className='pt-2'>
            <FaqAccordion items={items} />
          </div>
        </div>
      </Container>
    </section>
  )
}
