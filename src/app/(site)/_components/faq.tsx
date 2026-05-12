import { buttonVariants } from '@/components/ui/button'
import Container from '@/components/ui/container'
import SectionLabel from '@/components/ui/section-label'
import type { FAQItem, SiteHomePayload } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import FaqAccordion from './faq-accordion'

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
            <Link
              href={section.ctaHref}
              className={cn(buttonVariants({ variant: 'brand-dark', size: 'figma-sm' }), 'mt-7')}>
              {section.ctaLabel}
              <ArrowRight className='size-4' strokeWidth={2.5} />
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
