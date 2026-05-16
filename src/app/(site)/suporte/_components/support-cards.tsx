import { Container } from '@/components/ui/container'
import type { SupportPayload } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Download, FileText, Mail, MapPin } from 'lucide-react'

const CARD_ICONS = {
  'manuais-downloads': Download,
  'postos-autorizados': MapPin,
  'fale-conosco': Mail,
} as const

interface SupportCardsProps {
  cards: SupportPayload['cards']
}

export function SupportCards({ cards }: Readonly<SupportCardsProps>) {
  return (
    <section className='w-full bg-off-white py-12'>
      <Container>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {cards.map((card, index) => {
            const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS] ?? FileText

            return (
              <div
                key={card.id}
                className={cn(
                  'flex min-h-52 flex-col border border-border bg-white p-4',
                  index === cards.length - 1 && 'border-b-brand',
                )}>
                <Icon size={20} className='mb-5 text-brand' />
                <h3 className='mb-3 font-sans-condensed text-section-title font-black uppercase text-brand-dark'>
                  {card.title}
                </h3>
                <p className='flex-1 text-base leading-relaxed text-text-subtle'>{card.description}</p>
                <div className='mt-6 flex items-center justify-end'>
                  <ArrowUpRight size={18} className='text-brand' />
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
