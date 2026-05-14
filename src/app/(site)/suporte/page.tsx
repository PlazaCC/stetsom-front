import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSupportPayload } from '@/lib/api/server'
import { ArrowUpRight, FileText, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Image from 'next/image'
import { ContactForm } from './_components/contact-form'

const CARD_ICONS = {
  'central-ajuda': FileText,
  garantia: MapPin,
  manuais: MessageCircle,
} as const

const AUTHORIZED_POSTS = [
  { id: 'sp-1', type: 'Distribuidor', name: 'Stetsom São Paulo', address: 'Rua Augusta, 1200 — São Paulo, SP', phone: '(11) 3000-0000' },
  { id: 'rj-1', type: 'Distribuidor', name: 'Stetsom Rio de Janeiro', address: 'Av. Brasil, 500 — Rio de Janeiro, RJ', phone: '(21) 3000-0000' },
  { id: 'mg-1', type: 'Distribuidor', name: 'Stetsom Belo Horizonte', address: 'Av. Amazonas, 300 — Belo Horizonte, MG', phone: '(31) 3000-0000' },
  { id: 'rs-1', type: 'Distribuidor', name: 'Stetsom Porto Alegre', address: 'Av. Ipiranga, 800 — Porto Alegre, RS', phone: '(51) 3000-0000' },
] as const

const CONTACT_DETAILS = [
  { id: 'address', icon: MapPin, label: 'Endereço', value: 'Av. Industrial Stetsom, 100 — São Paulo, SP 09850-000' },
  { id: 'email', icon: Mail, label: 'E-mail', value: 'suporte@stetsom.com.br' },
  { id: 'phone', icon: Phone, label: 'Telefone', value: '+55 (11) 3000-0000' },
] as const

export default async function SuportePage() {
  const supportPayload = await getSupportPayload()

  return (
    <div>
      {/* 1. HERO BANNER - com gradiente dark + watermark "SOS" + barra vermelha */}
      <section className='relative w-full h-84 bg-brand-dark overflow-hidden flex items-center'>
        <Image
          src={supportPayload.hero.image}
          alt='Hero Support'
          fill
          className='object-cover opacity-35 object-center'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40' />
        <span className='absolute inset-0 font-sans-condensed font-black uppercase text-center flex items-center justify-center text-[80px] sm:text-[150px] lg:text-[263px] text-watermark-text opacity-[0.08] pointer-events-none select-none leading-none'>
          {supportPayload.hero.watermarkText}
        </span>
        <div className='absolute left-0 top-0 w-3.5 h-full bg-bar-accent' />
        <Container className='z-10 relative'>
          <SectionLabel label={supportPayload.hero.label} />
          <h1 className='font-sans-condensed font-black text-5xl lg:text-[90px] lg:leading-18.5 leading-none uppercase text-white mt-1'>
            {supportPayload.hero.title.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
          <p className='text-base text-text-subtle-dark mt-4 max-w-120 lg:ml-auto'>{supportPayload.hero.description}</p>
        </Container>
      </section>

      {/* 2. SUPPORT CARDS - 3 cards com barra vermelha vertical */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {supportPayload.cards.map((card) => {
              const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS] ?? FileText

              return (
                <div key={card.id} className='bg-card border border-border p-4 flex min-h-52 flex-col'>
                  <Icon size={20} className='mb-5 text-brand' />
                  <h3 className='font-sans-condensed font-black text-section-title uppercase text-brand-dark mb-3'>
                    {card.title}
                  </h3>
                  <p className='text-base text-text-subtle leading-relaxed flex-1'>{card.description}</p>
                  <div className='mt-6 flex items-center justify-end'>
                    <ArrowUpRight size={18} className='text-brand' />
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* 3. DOCUMENTATION SECTION - com tabs/categorias */}
      <section className='w-full bg-card py-12'>
        <Container>
          <SectionLabel label={supportPayload.documentation.label} title={supportPayload.documentation.title} />
          <div className='mt-8'>
            <div className='flex gap-4 mb-8 overflow-x-auto pb-4 border-b border-border'>
              {supportPayload.documentation.categories.map((cat) => (
                <button
                  key={cat.id}
                  className='font-sans text-base font-medium text-muted-foreground whitespace-nowrap hover:text-brand transition-colors'>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {supportPayload.documentation.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className='block p-4 border border-zinc-200 rounded hover:border-brand hover:bg-off-white transition-colors'>
                  <h4 className='font-sans text-base font-medium text-foreground'>{link.title}</h4>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. POSTOS AUTORIZADOS - lista de locais + mapa */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <SectionLabel label='Rede Autorizada' title='POSTOS AUTORIZADOS' />
          <div className='mt-8 flex flex-col lg:flex-row lg:gap-6 lg:items-start'>
            <div className='flex flex-col gap-4 lg:w-86 shrink-0'>
              {AUTHORIZED_POSTS.map((post) => (
                <div key={post.id} className='border-b border-zinc-200 pb-4 last:border-0'>
                  <p className='font-sans text-2xs uppercase tracking-wider text-brand mb-1'>{post.type}</p>
                  <h4 className='font-sans-condensed font-black text-section-title uppercase text-brand-dark mb-1'>{post.name}</h4>
                  <p className='text-sm text-text-subtle'>{post.address}</p>
                  <p className='text-sm text-text-subtle mt-0.5'>{post.phone}</p>
                </div>
              ))}
            </div>
            <div className='relative mt-8 lg:mt-0 lg:flex-1 h-85 lg:h-114.25 rounded-[16px] overflow-hidden bg-muted'>
              <Image
                src='/figma-assets/raw/fill_SXY62B_51d05531.png'
                alt='Mapa postos autorizados Stetsom'
                fill
                className='object-cover'
                sizes='(max-width: 1024px) 100vw, 732px'
              />
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CONTATO - 2 colunas: info + formulário */}
      <section className='w-full bg-card py-12'>
        <Container>
          <div className='flex flex-col lg:flex-row lg:gap-16 lg:items-start'>
            <div className='flex flex-col gap-6 lg:w-90 shrink-0'>
              <SectionLabel label={supportPayload.contact.label} title={supportPayload.contact.title} />
              <p className='text-base text-text-subtle leading-relaxed'>{supportPayload.contact.description}</p>
              <div className='flex flex-col gap-5'>
                {CONTACT_DETAILS.map((detail) => {
                  const Icon = detail.icon
                  return (
                    <div key={detail.id} className='flex items-start gap-3'>
                      <Icon size={18} className='text-brand mt-0.5 shrink-0' />
                      <div>
                        <p className='text-sm font-medium text-brand-dark font-sans'>{detail.label}</p>
                        <p className='text-sm text-text-subtle font-sans'>{detail.value}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className='flex-1 mt-8 lg:mt-0'>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* 6. FAQ ACCORDION SECTION - accordion com items + botão "Falar com suporte" */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <SectionLabel label={supportPayload.faq.label} title={supportPayload.faq.title} />
          <div className='max-w-175 mt-8'>
            <Accordion className='space-y-3'>
              {supportPayload.faq.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className='border border-zinc-200 rounded px-6 py-4'>
                  <AccordionTrigger className='hover:no-underline py-0 font-sans-condensed font-black text-base uppercase text-foreground hover:text-brand'>
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className='text-base text-text-subtle pt-4'>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant='default' className='mt-8 bg-surface-elevated text-white hover:bg-brand-dark'>
              {supportPayload.faq.supportButtonLabel}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
