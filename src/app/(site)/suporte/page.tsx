import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getSupportPayload } from '@/lib/api/server'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Download, FileText, Mail, MapPin, Phone, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from './_components/contact-form'

const CARD_ICONS = {
  'manuais-downloads': Download,
  'postos-autorizados': MapPin,
  'fale-conosco': Mail,
} as const

const CONTACT_INFO_ICONS = {
  phone: Phone,
  email: Mail,
  whatsapp: Phone,
} as const

export default async function SuportePage() {
  const supportPayload = await getSupportPayload()
  const categories = supportPayload.documentationCategories ?? []
  const serviceCenters = supportPayload.serviceCenters ?? []

  return (
    <div>
      {/* 1. HERO BANNER */}
      <section className='relative flex h-84 w-full items-center overflow-hidden bg-radial-dark'>
        <Image
          src={supportPayload.hero.image}
          alt='Hero Support'
          fill
          className='object-cover object-center opacity-35'
          sizes='100vw'
          priority
        />
        <div
          className='absolute inset-0'
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)' }}
        />
        <span className='pointer-events-none absolute inset-0 flex items-center justify-center text-center font-sans-condensed text-display-2xl font-black uppercase leading-none text-watermark-text opacity-[0.08] select-none sm:text-[150px] lg:text-[263px]'>
          {supportPayload.hero.watermarkText}
        </span>
        <div className='absolute left-0 top-0 h-full w-3.5 bg-bar-accent' />
        <Container className='relative z-10'>
          <SectionLabel label={supportPayload.hero.label} />
          <h1 className='mt-1 font-sans-condensed text-5xl font-black uppercase leading-none text-white lg:text-[90px] lg:leading-18.5'>
            {supportPayload.hero.title.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
          <p className='mt-4 max-w-120 text-base text-text-subtle-dark lg:ml-auto'>{supportPayload.hero.description}</p>
        </Container>
      </section>

      {/* 2. SUPPORT CARDS — 3 cards: Manuais & Downloads / Postos Autorizados / Fale Conosco */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {supportPayload.cards.map((card, index) => {
              const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS] ?? FileText

              return (
                <div
                  key={card.id}
                  className={cn(
                    'flex min-h-52 flex-col border border-border bg-white p-4',
                    index === supportPayload.cards.length - 1 && 'border-b-brand',
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

      {/* 3. FALE CONOSCO — coluna de info + formulário */}
      <section className='w-full bg-white py-12'>
        <Container>
          <div className='flex flex-col lg:flex-row lg:items-start lg:gap-16'>
            <div className='flex shrink-0 flex-col gap-6 lg:w-90'>
              <SectionLabel label={supportPayload.contact.label} title={supportPayload.contact.title} />
              <p className='text-base leading-relaxed text-text-subtle'>{supportPayload.contact.description}</p>

              {supportPayload.contactInfo && (
                <div className='flex flex-col gap-3'>
                  {(
                    [
                      { key: 'phone', label: 'Telefone', value: supportPayload.contactInfo.phone },
                      { key: 'email', label: 'E-mail', value: supportPayload.contactInfo.email },
                      { key: 'whatsapp', label: 'WhatsApp', value: supportPayload.contactInfo.whatsapp },
                    ] as const
                  ).map(({ key, label, value }) => {
                    const Icon = CONTACT_INFO_ICONS[key]
                    return (
                      <div key={key} className='flex items-center gap-4 border border-border px-4 py-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center bg-brand/10'>
                          <Icon size={18} className='text-brand' />
                        </div>
                        <div>
                          <p className='font-sans text-xs font-medium uppercase tracking-wide text-text-subtle'>
                            {label}
                          </p>
                          <p className='font-sans text-sm font-semibold text-brand-dark'>{value}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className='mt-8 flex-1 lg:mt-0'>
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>

      {/* 4. POSTOS AUTORIZADOS — mapa + lista de assistências */}
      <section className='w-full bg-white py-12'>
        <Container>
          <SectionLabel label='Rede Autorizada' title='POSTOS AUTORIZADOS' />
          <p className='mt-2 text-sm text-text-subtle'>
            Informe seu CEP ou cidade para encontrarmos as assistências técnicas autorizadas Stetsom mais próximas de
            você.
          </p>
          <div className='mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8'>
            {/* Lista de postos */}
            <div className='flex flex-col gap-3 lg:w-86'>
              <div className='flex gap-2'>
                <div className='flex flex-1 h-10 items-center gap-2 border border-border bg-white px-3'>
                  <MapPin size={14} className='shrink-0 text-icon-muted' />
                  <input
                    type='text'
                    placeholder='Digite seu CEP ou cidade...'
                    className='flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted'
                  />
                </div>
                <button
                  type='button'
                  className='h-10 shrink-0 bg-brand px-4 font-sans text-2xs font-bold uppercase tracking-[0.6px] text-white transition-colors hover:bg-brand/90'>
                  Buscar
                </button>
              </div>
              <div className='flex flex-col gap-2'>
                {serviceCenters.map((posto) => (
                  <div key={posto.id} className='flex flex-col gap-0.5 border border-border bg-white px-4 py-3'>
                    <p className='font-sans text-sm font-semibold text-brand-dark'>{posto.name}</p>
                    <p className='font-sans text-xs text-text-subtle'>{posto.address}</p>
                    <div className='flex items-center gap-3'>
                      <p className='font-sans text-xs text-brand'>{posto.phone}</p>
                      {posto.phone2 && (
                        <p className='font-sans text-xs text-text-subtle'>{posto.phone2}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa placeholder */}
            <div className='relative flex-1 overflow-hidden rounded-2xl bg-muted lg:min-h-114.25'>
              <Image
                src={supportPayload.mapImage}
                alt='Mapa de postos autorizados'
                fill
                className='object-cover opacity-60'
                sizes='(max-width: 1024px) 100vw, 60vw'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='rounded-full bg-brand p-3 shadow-lg'>
                  <MapPin size={24} className='text-white' />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. DOWNLOAD DE MATERIAIS — sidebar de categorias + lista de arquivos */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <SectionLabel label='Materiais' title='DOWNLOAD DE MATERIAIS' />
          <div className='mt-8 flex flex-col gap-6 lg:flex-row lg:gap-8'>
            {/* Sidebar de categorias */}
            {categories.length > 0 && (
              <div className='flex shrink-0 flex-col gap-1 lg:w-64'>
                <div className='mb-2 flex h-10 items-center gap-2 border border-border bg-white px-3'>
                  <Search size={14} className='shrink-0 text-icon-muted' />
                  <input
                    type='text'
                    placeholder='Buscar por modelo...'
                    className='flex-1 border-none bg-transparent text-sm outline-none placeholder:text-icon-muted'
                  />
                </div>
                {categories.map((cat, index) => (
                  <button
                    key={cat}
                    className={cn(
                      'flex items-center px-4 py-2.5 text-left font-sans text-sm transition-colors',
                      index === 0
                        ? 'border-l-2 border-brand bg-white font-medium text-brand-dark'
                        : 'border-l-2 border-transparent text-text-subtle hover:border-border hover:text-brand-dark',
                    )}>
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Lista de arquivos */}
            <div className='flex flex-1 flex-col gap-3'>
              {supportPayload.documentationFiles.map((file) => (
                <div
                  key={file.id}
                  className='flex items-center justify-between border border-border bg-white px-5 py-4 transition-colors hover:border-brand'>
                  <div className='flex items-center gap-4'>
                    <FileText size={20} className='shrink-0 text-brand' />
                    <div>
                      <div className='flex items-center gap-2'>
                        <p className='font-sans text-sm font-medium text-foreground'>
                          {file.name ?? (
                            <>
                              {file.type === 'MANUAL' && 'Manual — '}
                              {file.type === 'CERTIFICATE' && 'Certificado — '}
                              {file.type === 'CATALOG' && 'Catálogo — '}
                              {file.type === 'IMAGE' && 'Imagem — '}
                              Documento v{file.version}
                            </>
                          )}
                        </p>
                        <span className='rounded bg-muted px-1.5 py-0.5 font-sans text-2xs font-bold uppercase tracking-wide text-muted-foreground'>
                          V{file.version}
                        </span>
                      </div>
                      <p className='font-sans text-xs text-text-subtle'>
                        {file.type === 'MANUAL' && 'Manual técnico'}
                        {file.type === 'CERTIFICATE' && 'Certificado de conformidade'}
                        {file.type === 'CATALOG' && 'Catálogo do produto'}
                        {file.type === 'IMAGE' && 'Imagem técnica'}
                        {file.fileSize && ` • PDF • ${file.fileSize}`}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={file.file_url}
                    className='inline-flex shrink-0 items-center gap-1.5 font-sans text-2xs font-bold uppercase tracking-[0.6px] text-brand transition-colors hover:text-brand/80'>
                    <Download size={14} />
                    Download
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 6. FAQ ACCORDION — perguntas frequentes + botão suporte */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <div className='flex flex-col lg:flex-row lg:gap-24'>
            <div className='shrink-0 lg:w-80'>
              <SectionLabel label={supportPayload.faq.label} title={supportPayload.faq.title} />
              <p className='mt-2 text-base leading-relaxed text-text-subtle'>
                Não encontrou o que procura? Entre em contato com nosso suporte.
              </p>
              <Button variant='default' className='mt-6 bg-surface-elevated text-white hover:bg-brand-dark'>
                {supportPayload.faq.supportButtonLabel}
              </Button>
            </div>
            <div className='mt-8 flex-1 lg:mt-0'>
              <Accordion className='space-y-3'>
                {supportPayload.faq.items.map((item, index) => (
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
    </div>
  )
}
