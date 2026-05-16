import { buttonVariants } from '@/components/ui/button'
import { SectionLabel } from '@/components/ui/section-label'
import type { SiteHomePayload } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface OurHistoryProps {
  section: SiteHomePayload['history']
}

export function OurHistory({ section }: Readonly<OurHistoryProps>) {
  return (
    <section className='bg-brand-dark'>
      {/* Mobile: image on top, content below */}
      <div className='lg:hidden'>
        <div className='relative aspect-16/11 w-full overflow-hidden'>
          <Image src={section.image} alt={section.imageAlt} fill className='object-cover' sizes='100vw' />
        </div>
        <div className='px-5 py-10 sm:px-8 sm:py-12'>
          <SectionLabel label={section.label} title={section.title} subtitle={section.subtitle} dark />
          <div className='mt-8 grid grid-cols-2 border border-white/20'>
            {section.stats.map((stat) => (
              <div key={stat.label} className='border border-white/20 px-4 py-4'>
                <p className='font-sans-condensed text-display-sm font-black leading-none text-white'>
                  {stat.value.endsWith('+') ? (
                    <>{stat.value.slice(0, -1)}<span className='text-brand'>+</span></>
                  ) : (
                    stat.value
                  )}
                </p>
                <p className='mt-1 font-sans text-xs font-medium uppercase text-text-subtle-dark'>{stat.label}</p>
              </div>
            ))}
          </div>
          <Link href={section.ctaHref} className={cn(buttonVariants({ variant: 'brand', size: 'sm' }), 'mt-8')}>
            {section.ctaLabel} <ArrowRight className='size-4' strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Desktop: image flush-left (no left padding), content padded right */}
      <div className='hidden lg:flex lg:min-h-132'>
        <div className='relative w-182.75 shrink-0 self-stretch overflow-hidden'>
          <Image src={section.image} alt={section.imageAlt} fill className='object-cover' sizes='731px' />
        </div>
        <div className='flex flex-1 items-center py-16 pl-22.75 pr-42.5'>
          <div className='w-full max-w-122'>
            <SectionLabel label={section.label} title={section.title} subtitle={section.subtitle} dark />
            <div className='mt-8 grid grid-cols-2 border border-white/20'>
              {section.stats.map((stat) => (
                <div key={stat.label} className='border border-white/20 px-4 py-4'>
                  <p className='font-sans-condensed text-display-sm font-black leading-none text-white'>
                    {stat.value.endsWith('+') ? (
                      <>{stat.value.slice(0, -1)}<span className='text-brand'>+</span></>
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className='mt-1 font-sans text-xs font-medium uppercase text-text-subtle-dark'>{stat.label}</p>
                </div>
              ))}
            </div>
            <Link href={section.ctaHref} className={cn(buttonVariants({ variant: 'brand', size: 'sm' }), 'mt-8')}>
              {section.ctaLabel} <ArrowRight className='size-4' strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
