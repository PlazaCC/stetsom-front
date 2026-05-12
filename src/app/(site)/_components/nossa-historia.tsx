import { buttonVariants } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import type { SiteHomePayload } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

            <Link href={section.ctaHref} className={cn(buttonVariants({ variant: 'brand', size: 'figma-sm' }), 'mt-8')}>
              {section.ctaLabel}
              <ArrowRight className='size-4' strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
