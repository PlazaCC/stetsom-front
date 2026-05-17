import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SupportPayload } from '@/lib/api/contracts'
import { getTranslations } from 'next-intl/server'

interface SupportFAQProps {
  faq: SupportPayload['faq']
}

export async function SupportFAQ({ faq }: Readonly<SupportFAQProps>) {
  const t = await getTranslations('Support.faq')

  return (
    <section className='w-full bg-off-white py-12'>
      <Container>
        <div className='flex flex-col lg:flex-row lg:gap-24'>
          <div className='shrink-0 lg:w-80'>
            <SectionLabel label={faq.label} title={faq.title} />
            <p className='mt-2 text-base leading-relaxed text-text-subtle'>
              {t('noAnswer')}
            </p>
            <Button variant='brand-dark' size='md' className='mt-6'>
              {faq.supportButtonLabel}
            </Button>
          </div>
          <div className='mt-8 flex-1 lg:mt-0'>
            <Accordion className='space-y-3'>
              {faq.items.map((item, index) => (
                <AccordionItem
                  key={item.q}
                  value={`item-${index}`}
                  className='rounded border border-border px-6 py-4'>
                  <AccordionTrigger className='py-0 font-sans-condensed text-base font-black uppercase text-foreground hover:text-brand hover:no-underline'>
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className='pt-4 text-base text-text-subtle'>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  )
}
