'use client'

import { BlockRenderer } from './block-renderer'
import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import type { ProductBlock, ProductCardItem, ProductSpecifications } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { formatSpecKey } from '@/lib/utils/product'
import Image from 'next/image'
import { useState } from 'react'

type Tab = 'overview' | 'specifications' | 'related'

interface ProductDetailTabsProps {
  productName: string
  thumbnailUrl: string
  specifications: ProductSpecifications
  blocks: ProductBlock[]
  relatedProducts: ProductCardItem[]
}

const PRODUCT_HERO_GRADIENT = {
  background: 'radial-gradient(circle at 50% 50%, rgb(238, 8, 0) 45%, rgb(0, 0, 0) 100%)',
} as const

const TAB_CONFIG = [
  ['overview', 'Visão geral'],
  ['specifications', 'Especificações'],
  ['related', 'Confira também'],
] as const satisfies readonly (readonly [Tab, string])[]

export default function ProductDetailTabs({
  productName,
  thumbnailUrl,
  specifications,
  blocks,
  relatedProducts,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const specEntries = Object.entries(specifications)
  const specificationsTable =
    specEntries.length > 0 ? (
      <section className='py-9'>
        <div className='w-full'>
          <div className='border-b border-zinc-200 bg-white px-5 py-3 lg:px-42.5'>
            <p className='font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground'>
              Especificações técnicas
            </p>
          </div>
          {specEntries.map(([key, value], i) => (
            <div
              key={key}
              className={cn('flex items-center gap-8 px-5 py-4.5 lg:px-42.5', i % 2 === 0 ? 'bg-muted' : 'bg-white')}>
              <span className='w-1/2 shrink-0 font-sans text-sm font-medium uppercase capitalize text-brand-dark'>
                {formatSpecKey(key)}
              </span>
              <span className='font-sans text-sm text-text-subtle'>{String(value)}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null

  return (
    <>
      {/* TAB BAR */}
      <div className='w-full border-t border-zinc-200 bg-white'>
        <div className='flex justify-center gap-5 px-5 py-4 lg:px-42.5'>
          {TAB_CONFIG.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'border-b-2 pb-1 font-sans text-base font-medium uppercase tracking-wide transition-colors',
                activeTab === id
                  ? 'border-brand-dark text-brand-dark'
                  : 'border-transparent text-muted-foreground hover:text-brand-dark',
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* RED GRADIENT HERO */}
          <section className='relative isolate overflow-hidden bg-black'>
            <div className='absolute inset-0' style={PRODUCT_HERO_GRADIENT} />
            <div className='absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-black/70 to-transparent' />
            <Container className='relative z-10 py-8 md:py-10 lg:py-14'>
              <div className='mx-auto max-w-220'>
                <div className='relative h-74.75 w-full sm:h-80 md:h-92 lg:h-100'>
                  <Image
                    src={thumbnailUrl}
                    alt={productName}
                    fill
                    priority
                    sizes='(max-width: 1024px) 100vw, 960px'
                    className='object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.35)]'
                  />
                </div>
                <div className='mt-5 text-center'>
                  <p className='font-sans-condensed text-4xl font-black uppercase leading-none text-white sm:text-5xl lg:text-display-lg'>
                    ALTA POTENCIA.
                    <span className='mt-1 block text-brand'>ALTA PERFORMANCE.</span>
                  </p>
                </div>
              </div>
            </Container>
          </section>

          {specificationsTable}

          {blocks.length > 0 && (
            <section className='bg-white py-10 md:py-12 lg:py-14'>
              <Container className='space-y-6 md:space-y-8'>
                {blocks.map((block) => (
                  <BlockRenderer key={block.id} block={block} productName={productName} fallbackImage={thumbnailUrl} />
                ))}
              </Container>
            </section>
          )}
        </>
      )}

      {activeTab === 'specifications' && specificationsTable}

      {activeTab === 'related' && (
        <section className='bg-off-white py-10 md:py-12 lg:py-16'>
          <Container>
            <h2 className='font-sans-condensed text-display-sm font-black uppercase leading-none text-brand-dark'>
              Confira também
            </h2>
            {relatedProducts.length > 0 ? (
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
                {relatedProducts.slice(0, 6).map((p) => (
                  <ProductCard
                    key={p.id}
                    name={p.name}
                    category={p.category}
                    spec={p.spec}
                    badge={p.badge}
                    img={p.img}
                    href={p.href}
                  />
                ))}
              </div>
            ) : (
              <p className='mt-6 text-base text-text-subtle'>Nenhum produto relacionado disponível.</p>
            )}
          </Container>
        </section>
      )}
    </>
  )
}
