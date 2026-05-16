import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { FAQItem, SiteHomePayload } from '@/lib/api/contracts'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { FaqAccordion } from './faq-accordion'

interface FaqProps {
  items: FAQItem[]
  section: SiteHomePayload['faqSection']
}

export default function Faq({ items, section }: Readonly<FaqProps>) {
  return (
    <section className='bg-off-white py-12 justify-center flex'>
      <Container>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20'>
          <div>
            <SectionLabel label={section.label} title={section.title} subtitle={section.subtitle} />
            <Link href={section.ctaHref}>
              <Button variant='brand-dark' size='sm' className='mt-7 flex items-center gap-2'>
                {section.ctaLabel}
                <ArrowRight className='size-4' strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
          <div className='pt-2'>
            <FaqAccordion items={items} />
          </div>
        </div>
      </Container>
    </section>
  )
}
