'use client'

import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import type { ProductBlock, ProductCardItem, ProductSpecifications } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

type Tab = 'especificacoes' | 'confira'

interface ProductDetailTabsProps {
  productName: string
  thumbnailUrl: string
  specifications: ProductSpecifications
  blocks: ProductBlock[]
  relatedProducts: ProductCardItem[]
}

type TextBlockData = { title?: string; content?: string; align?: string }
type ImageBlockData = { images?: string[]; caption?: string }

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((i) => typeof i === 'string' && i.length > 0)
}

function toTextBlockData(data: Record<string, unknown>): TextBlockData {
  return {
    title: typeof data.title === 'string' ? data.title : undefined,
    content: typeof data.content === 'string' ? data.content : undefined,
    align: typeof data.align === 'string' ? data.align : undefined,
  }
}

function toImageBlockData(data: Record<string, unknown>): ImageBlockData {
  return {
    images: isStringArray(data.images) ? data.images : undefined,
    caption: typeof data.caption === 'string' ? data.caption : undefined,
  }
}

function resolveTextAlignClass(align: string | undefined) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

function formatSpecKey(key: string) {
  return key.replace(/_/g, ' ')
}

const BLOCK_PLACEHOLDER_LABEL: Record<'VIDEO' | 'MODEL3D' | 'HTML', string> = {
  VIDEO: 'Video',
  MODEL3D: 'Modelo 3D',
  HTML: 'HTML customizado',
}

function renderBlock(block: ProductBlock, productName: string, fallbackImage: string) {
  if (block.type === 'TEXT') {
    const data = toTextBlockData(block.data)
    return (
      <article key={block.id} className='rounded-xl border border-zinc-200 bg-card p-6 md:p-8'>
        <h2 className='font-sans-condensed text-section-title font-black uppercase text-brand-dark'>
          {data.title ?? 'Detalhes do produto'}
        </h2>
        <p className={cn('mt-3 text-sm leading-relaxed text-text-subtle md:text-base', resolveTextAlignClass(data.align))}>
          {data.content ?? 'Descrição indisponível para este bloco.'}
        </p>
      </article>
    )
  }

  if (block.type === 'IMAGE') {
    const data = toImageBlockData(block.data)
    const images = data.images?.length ? data.images : [fallbackImage]
    return (
      <article key={block.id} className='space-y-3'>
        {images.map((src, i) => (
          <div
            key={`${block.id}-${i}`}
            className='relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-brand-dark'>
            <Image src={src} alt={`${productName} visual ${i + 1}`} fill sizes='(max-width: 1024px) 100vw, 1100px' className='object-cover' />
          </div>
        ))}
        {data.caption && <p className='text-sm text-text-subtle'>{data.caption}</p>}
      </article>
    )
  }

  return (
    <article key={block.id} className='rounded-xl border border-dashed border-zinc-300 bg-card p-5 md:p-6'>
      <p className='font-sans-condensed text-sm font-bold uppercase text-brand-dark'>
        {BLOCK_PLACEHOLDER_LABEL[block.type as 'VIDEO' | 'MODEL3D' | 'HTML']}
      </p>
      <p className='mt-1 text-sm leading-relaxed text-text-subtle'>Conteúdo em breve para este bloco.</p>
    </article>
  )
}

const PRODUCT_HERO_GRADIENT = {
  background: 'radial-gradient(circle at 50% 50%, rgb(238, 8, 0) 45%, rgb(0, 0, 0) 100%)',
} as const

export default function ProductDetailTabs({
  productName,
  thumbnailUrl,
  specifications,
  blocks,
  relatedProducts,
}: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('especificacoes')

  const specEntries = Object.entries(specifications)

  return (
    <>
      {/* TAB BAR */}
      <div className='w-full border-t border-zinc-200 bg-white'>
        <div className='flex justify-center gap-5 px-42.5 py-4'>
          {([['especificacoes', 'Especificações'], ['confira', 'Confira também']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                'font-sans font-medium text-base uppercase tracking-wide transition-colors pb-1',
                activeTab === id
                  ? 'text-brand-dark border-b-2 border-brand-dark'
                  : 'text-muted-foreground hover:text-brand-dark border-b-2 border-transparent',
              )}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'especificacoes' && (
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
              </div>
            </Container>
          </section>

          {/* SPECIFICATIONS TABLE */}
          {specEntries.length > 0 && (
            <section className='py-9'>
              <div className='w-full'>
                <div className='bg-white border-b border-zinc-200 px-8 lg:px-42.5 py-3'>
                  <p className='font-sans-condensed font-black text-xs uppercase tracking-widest text-muted-foreground'>
                    Especificações técnicas
                  </p>
                </div>
                {specEntries.map(([key, value], i) => (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center px-8 lg:px-42.5 py-4.5 gap-8',
                      i % 2 === 0 ? 'bg-muted' : 'bg-white',
                    )}>
                    <span className='font-sans text-sm font-medium uppercase text-brand-dark w-1/2 shrink-0 capitalize'>
                      {formatSpecKey(key)}
                    </span>
                    <span className='font-sans text-sm text-text-subtle'>{String(value)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTENT BLOCKS */}
          {blocks.length > 0 && (
            <section className='bg-white py-10 md:py-12 lg:py-14'>
              <Container className='space-y-6 md:space-y-8'>
                {blocks.map((block) => renderBlock(block, productName, thumbnailUrl))}
              </Container>
            </section>
          )}
        </>
      )}

      {activeTab === 'confira' && (
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
