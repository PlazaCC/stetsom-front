'use client'

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import type { FAQItem } from '@/lib/api/contracts'
import { Accordion as AccordionPrimitive } from '@base-ui/react/accordion'

export default function FaqAccordion({ items }: { items: FAQItem[] }) {
  return (
    <Accordion>
      {items.map(({ q, a }, i) => (
        <AccordionItem key={i} value={String(i)} className='border-zinc-200'>
          <AccordionPrimitive.Header className='flex'>
            <AccordionPrimitive.Trigger className='group/faq flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left outline-none'>
              <span className='font-medium text-[15px] text-brand-dark'>{q}</span>
              <span className='shrink-0 text-lg leading-none text-brand group-aria-expanded/faq:hidden'>+</span>
              <span className='hidden shrink-0 text-lg leading-none text-brand group-aria-expanded/faq:inline'>−</span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent>
            <p className='text-sm leading-relaxed text-[rgb(102,102,102)]'>{a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
