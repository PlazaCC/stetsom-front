import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { getSupportPayload } from '@/lib/api/server'
import Image from 'next/image'
import { Search } from 'lucide-react'

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
        <span className='absolute inset-0 font-sans-condensed font-black uppercase text-center flex items-center justify-center text-[263px] text-watermark-text opacity-[0.08] pointer-events-none select-none leading-none'>
          {supportPayload.hero.watermarkText}
        </span>
        <div className='absolute left-0 top-0 w-3.5 h-84 bg-bar-accent' />
        <Container className='z-10 relative'>
          <SectionLabel label={supportPayload.hero.label} />
          <h1 className='font-sans-condensed font-black text-7xl leading-none uppercase text-white mt-1'>
            {supportPayload.hero.title}
          </h1>
          <p className='text-base text-text-subtle-dark mt-4 max-w-120'>{supportPayload.hero.description}</p>
        </Container>
      </section>

      {/* 2. SUPPORT CARDS - 3 cards com barra vermelha vertical */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {supportPayload.cards.map((card) => (
              <div key={card.id} className='bg-white border-l-4 border-brand p-8 flex flex-col'>
                <h3 className='font-sans-condensed font-black text-section-title uppercase text-brand-dark mb-3'>
                  {card.title}
                </h3>
                <p className='text-base text-text-subtle leading-relaxed flex-1 mb-6'>{card.description}</p>
                <Button className='self-start font-sans-condensed font-black text-button-md uppercase h-10 px-6'>
                  {card.cta}
                </Button>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. DOCUMENTATION SECTION - com tabs/categorias */}
      <section className='w-full bg-white py-12'>
        <Container>
          <SectionLabel label={supportPayload.documentation.label} title={supportPayload.documentation.title} />
          <div className='mt-8'>
            <div className='flex gap-4 mb-8 overflow-x-auto pb-4 border-b border-zinc-200'>
              {supportPayload.documentation.categories.map((cat) => (
                <button
                  key={cat.id}
                  className='font-sans text-base font-medium text-muted-foreground whitespace-nowrap hover:text-brand transition-colors'
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {supportPayload.documentation.links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className='block p-4 border border-zinc-200 rounded hover:border-brand hover:bg-off-white transition-colors'
                >
                  <h4 className='font-sans text-base font-medium text-foreground'>{link.title}</h4>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 4. FAQ SEARCH SECTION - input + tabs de categoria */}
      <section className='w-full bg-off-white py-12'>
        <Container>
          <SectionLabel label={supportPayload.faqSearch.label} title={supportPayload.faqSearch.title} />
          <div className='mt-8 max-w-120'>
            <div className='relative mb-8'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none' />
              <input
                type='text'
                placeholder={supportPayload.faqSearch.placeholder}
                className='w-full pl-12 pr-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
              />
            </div>
            <div className='flex gap-3 flex-wrap'>
              {supportPayload.faqSearch.categories.map((cat) => (
                <button
                  key={cat.id}
                  className='px-4 py-2 rounded text-sm font-medium bg-white border border-zinc-300 text-foreground hover:border-brand transition-colors'
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 5. CONTACT FORM SECTION - formulário com campos nome/email/mensagem */}
      <section className='w-full bg-white py-12'>
        <Container>
          <SectionLabel label={supportPayload.contact.label} title={supportPayload.contact.title} />
          <p className='text-base text-text-subtle mt-4 mb-8'>{supportPayload.contact.description}</p>
          <form className='max-w-120 space-y-6'>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-foreground mb-2'>
                Nome
              </label>
              <input
                type='text'
                id='name'
                name='name'
                className='w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
              />
            </div>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-foreground mb-2'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
              />
            </div>
            <div>
              <label htmlFor='message' className='block text-sm font-medium text-foreground mb-2'>
                Mensagem
              </label>
              <textarea
                id='message'
                name='message'
                rows={5}
                className='w-full px-4 py-3 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-brand'
              />
            </div>
            <Button className='font-sans-condensed font-black text-button-md uppercase h-10 px-8'>
              Enviar Mensagem
            </Button>
          </form>
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
            <Button variant='outline' className='mt-8 h-9 px-6 font-sans-condensed font-black text-button-md uppercase'>
              {supportPayload.faq.supportButtonLabel}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
