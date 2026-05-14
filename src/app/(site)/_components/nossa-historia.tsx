import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SiteHomePayload } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HISTORY_STATS = [
  { value: '35+', label: 'Anos de Mercado' },
  { value: '200+', label: 'Produtos' },
  { value: '60+', label: 'Países' },
  { value: '1M+', label: 'Unidades Vendidas' },
] as const

interface NossaHistoriaProps {
  section: SiteHomePayload['history']
}

export default function NossaHistoria({ section }: Readonly<NossaHistoriaProps>) {
  return (
    <section className='flex justify-center bg-brand-dark py-0 lg:min-h-132'>
      <Container className='flex w-full flex-col items-stretch lg:flex-row lg:items-center lg:gap-22.75'>
        <div className='relative aspect-16/11 w-full shrink-0 overflow-hidden lg:hidden'>
          <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
        </div>

        <div className='relative hidden flex-1 shrink-0 overflow-hidden lg:block'>
          <Image src={section.image} alt={section.imageAlt} fill className='object-cover' />
        </div>

        <div className='flex flex-1 items-center justify-center px-6 py-10 sm:px-8 sm:py-12 lg:px-0 lg:py-0'>
          <div className='w-full max-w-122'>
            <SectionLabel label={section.label} title={section.title} subtitle={section.subtitle} dark />

            <div className='mt-8 grid grid-cols-2 border border-white/20'>
              {HISTORY_STATS.map((stat) => (
                <div key={stat.label} className='border border-white/20 px-4 py-4'>
                  <p className='font-sans-condensed text-3xl font-black leading-none text-white'>
                    {stat.value.endsWith('+') ? (
                      <>{stat.value.slice(0, -1)}<span className='text-brand'>+</span></>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className='mt-1 text-xs font-sans font-medium uppercase text-text-subtle-dark'>{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href={section.ctaHref} className={cn(buttonVariants({ variant: 'brand', size: 'sm' }), 'mt-8')}>
              {section.ctaLabel}
              <ArrowRight className='size-4' strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
