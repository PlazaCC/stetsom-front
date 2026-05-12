'use client'

import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import { SectionLabel } from '@/components/ui/section-label'
import type { ProductCardItem, SiteHomePayload } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

interface NovidadesProps {
  featuredProducts: ProductCardItem[]
  spotlightProduct: ProductCardItem
  tabs: string[]
  section: SiteHomePayload['novidades']
}

export default function Novidades({ featuredProducts, spotlightProduct, tabs, section }: Readonly<NovidadesProps>) {
  const [activeTab, setActiveTab] = useState(tabs[0] ?? 'Todos')

  const filteredProducts = useMemo(() => {
    if (activeTab === 'Todos') {
      return featuredProducts
    }

    return featuredProducts.filter((product) => product.category === activeTab)
  }, [activeTab, featuredProducts])

  return (
    <section className='flex w-full justify-center bg-white py-12'>
      <Container>
        {/* Header: title + tabs/cta */}
        <div className='mb-6 sm:mb-8'>
          {/* Desktop: title box left, badges box right aligned to bottom */}
          <div className='hidden lg:flex items-stretch justify-between gap-6'>
            <div className='max-w-80'>
              <SectionLabel label={section.label} title={section.title} className='' />
            </div>

            <div className='flex-1 flex items-end justify-end'>
              <div className='inline-flex items-center gap-3 overflow-x-auto pb-1 pr-1 sm:gap-4 lg:pr-0 bg-zinc-100 rounded-[8px] px-2 py-1'>
                {tabs.map((tab) => (
                  <button
                    type='button'
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    aria-pressed={activeTab === tab}
                    className={cn(
                      'shrink-0 px-3 py-1.5 transition-colors text-sm leading-5 font-sans text-center rounded-[6px]',
                      activeTab === tab ? 'bg-white text-foreground shadow-sm' : 'bg-transparent text-zinc-500',
                    )}>
                    {tab}
                  </button>
                ))}
              </div>

              <Link
                href={section.ctaHref}
                className='ml-4 inline-flex items-center gap-2 px-2 text-sm font-sans-condensed font-medium text-brand'>
                <span>{section.ctaLabel}</span>
                <ArrowRight className='size-4 inline-block' strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Mobile: stack title then badges */}
          <div className='lg:hidden flex flex-col gap-4'>
            <SectionLabel label={section.label} title={section.title} className='max-w-80' />

            <div className='flex items-center justify-between'>
              <div className='inline-flex items-center gap-3 overflow-x-auto pb-1 pr-1 sm:gap-4 lg:pr-0 bg-zinc-100 rounded-[8px] px-2 py-1'>
                {tabs.map((tab) => (
                  <button
                    type='button'
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    aria-pressed={activeTab === tab}
                    className={cn(
                      'shrink-0 px-3 py-1.5 transition-colors text-sm leading-5 font-sans text-center rounded-[6px]',
                      activeTab === tab ? 'bg-white text-foreground shadow-sm' : 'bg-transparent text-zinc-500',
                    )}>
                    {tab}
                  </button>
                ))}
              </div>

              <Link
                href={section.ctaHref}
                className='ml-2 inline-flex items-center gap-2 px-2 text-sm font-sans-condensed font-medium text-brand'>
                <span>{section.ctaLabel}</span>
                <ArrowRight className='size-4 inline-block' strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>

        <div className='grid gap-5 lg:grid-cols-[447px_1fr]'>
          <Link
            href={spotlightProduct.href}
            className='relative flex h-80 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-card transition-colors hover:border-brand sm:h-95 lg:h-111.75'>
            <Image
              src={spotlightProduct.img}
              alt={spotlightProduct.name}
              width={300}
              height={300}
              className='max-h-55 max-w-[75%] object-contain shadow-[0_8px_24px_rgba(0,0,0,0.15)] sm:max-h-65 lg:max-h-75'
            />
            <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/65 to-transparent px-4 pb-4 pt-12 sm:px-5'>
              <div className='font-sans-condensed text-xs font-medium uppercase text-brand'>
                {spotlightProduct.category}
              </div>
              <div className='font-sans-condensed text-lg font-bold uppercase leading-tight text-white sm:text-xl'>
                {spotlightProduct.name}
              </div>
            </div>
          </Link>
          <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5'>
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} {...p} href={p.href} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
