import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSupportPayload } from '@/lib/api/server'
import { ArrowUpRight, Download, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { CARD_ICONS, CONTACT_DETAILS } from './_components/data'
import { ContactForm } from './_components/contact-form'

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
            sizes='100vw'
            priority
          />
        <div className='absolute inset-0 bg-linear-to-br from-black/40 via-transparent to-black/40' />
        <span className='absolute inset-0 font-sans-condensed font-black uppercase text-center flex items-center justify-center text-display-2xl sm:text-[150px] lg:text-[263px] text-watermark-text opacity-[0.08] pointer-events-none select-none leading-none'>
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

      {/* 3. DOWNLOAD DE MATERIAIS - lista de arquivos com ProductFile schema */}
      <section className='w-full bg-white py-12'>
        <Container>
          <SectionLabel label='Materiais' title='DOWNLOAD DE MATERIAIS' />
          <div className='mt-8 flex flex-col gap-3'>
            {supportPayload.documentationFiles.map((file) => (
              <div
                key={file.id}
                className='flex items-center justify-between border border-border rounded px-5 py-4 hover:border-brand transition-colors'>
                <div className='flex items-center gap-4'>
                  <FileText size={20} className='text-brand shrink-0' />
                  <div>
                    <p className='font-sans text-sm font-medium text-foreground'>
                      {file.type === 'MANUAL' && 'Manual — '}
                      {file.type === 'CERTIFICATE' && 'Certificado — '}
                      {file.type === 'CATALOG' && 'Catálogo — '}
                      {file.type === 'IMAGE' && 'Imagem — '}
                      Documento v{file.version}
                    </p>
                    <p className='font-sans text-xs text-text-subtle'>
                      {file.type === 'MANUAL' && 'Manual técnico'}
                      {file.type === 'CERTIFICATE' && 'Certificado de conformidade'}
                      {file.type === 'CATALOG' && 'Catálogo do produto'}
                      {file.type === 'IMAGE' && 'Imagem técnica'}
                    </p>
                  </div>
                </div>
                <Link
                  href={file.file_url}
                  className='inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm bg-brand px-4 font-sans text-2xs font-bold uppercase tracking-[0.6px] text-white transition-colors hover:bg-brand/90'>
                  <Download size={14} />
                  Download
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. FAQ ACCORDION SECTION - accordion com items + botão "Falar com suporte" */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <SectionLabel label={supportPayload.faq.label} title={supportPayload.faq.title} />
          <div className='max-w-175 mt-8'>
            <Accordion className='space-y-3'>
              {supportPayload.faq.items.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className='border border-border rounded px-6 py-4'>
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

      {/* 5. CONTATO - 2 colunas: info + formulário */}
      <section className='w-full bg-white py-12'>
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
    </div>
  )
}
