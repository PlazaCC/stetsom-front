'use client'

import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import { SectionLabel } from '@/components/ui/section-label'
import type { ProductCardItem, SiteHomePayload } from '@/lib/api/contracts'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { FeaturedTabStrip } from './featured-tab-strip'

interface FeaturedProductsProps {
  featuredProducts: ProductCardItem[]
  spotlightProduct: ProductCardItem
  tabs: string[]
  section: SiteHomePayload['featured']
}

export default function FeaturedProducts({ featuredProducts, spotlightProduct, tabs, section }: Readonly<FeaturedProductsProps>) {
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
          {/* Desktop: title box left, tabs+cta right aligned to bottom */}
          <div className='hidden lg:flex items-stretch justify-between gap-6'>
            <div className='max-w-80'>
              <SectionLabel label={section.label} title={section.title} className='' />
            </div>

            <div className='flex-1 flex items-end justify-end'>
              <FeaturedTabStrip
                tabs={tabs}
                activeTab={activeTab}
                onSelect={setActiveTab}
                ctaHref={section.ctaHref}
                ctaLabel={section.ctaLabel}
              />
            </div>
          </div>

          {/* Mobile: stack title then tabs+cta */}
          <div className='lg:hidden flex flex-col gap-4'>
            <SectionLabel label={section.label} title={section.title} className='max-w-80' />

            <div className='flex items-center justify-between'>
              <FeaturedTabStrip
                tabs={tabs}
                activeTab={activeTab}
                onSelect={setActiveTab}
                ctaHref={section.ctaHref}
                ctaLabel={section.ctaLabel}
              />
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
              <div className='font-sans-condensed text-xs font-black uppercase text-brand'>
                {spotlightProduct.category}
              </div>
              <div className='font-sans-condensed text-lg font-black uppercase leading-tight text-white sm:text-xl'>
                {spotlightProduct.name}
              </div>
            </div>
          </Link>
          <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5'>
            {filteredProducts.length === 0 ? (
              <p className='col-span-2 flex items-center justify-center py-12 text-sm text-muted-foreground'>
                Nenhum produto encontrado nesta categoria.
              </p>
            ) : (
              filteredProducts.map((p) => <ProductCard key={p.id} {...p} href={p.href} />)
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
