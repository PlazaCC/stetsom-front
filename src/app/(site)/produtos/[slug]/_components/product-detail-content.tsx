import { BlockRenderer } from './block-renderer'
import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import type { ProductBlock, ProductCardItem, ProductSpecifications, SpecMultiColumnValue } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { formatSpecKey } from '@/lib/utils/product'
import Image from 'next/image'

function isMultiColumn(v: unknown): v is SpecMultiColumnValue {
  return typeof v === 'object' && v !== null && 'ohm1' in v
}

interface ProductDetailContentProps {
  productName: string
  thumbnailUrl: string
  specifications: ProductSpecifications
  blocks: ProductBlock[]
  relatedProducts: ProductCardItem[]
}

export function ProductDetailContent({
  productName,
  thumbnailUrl,
  specifications,
  blocks,
  relatedProducts,
}: ProductDetailContentProps) {
  const specEntries = Object.entries(specifications)
  const hasSpecs = specEntries.length > 0

  return (
    <>
      <section id='overview' className='scroll-mt-38'>
        <section className='relative isolate overflow-hidden bg-black'>
          <div className='absolute inset-0 bg-product-hero' />
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

        {blocks.length > 0 && (
          <section className='bg-white py-10 md:py-12 lg:py-14'>
            <Container className='space-y-6 md:space-y-8'>
              {blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} productName={productName} fallbackImage={thumbnailUrl} />
              ))}
            </Container>
          </section>
        )}
      </section>

      <section id='specifications' className='scroll-mt-38'>
        <div className='border-b border-zinc-200 px-5 py-3 lg:px-42.5'>
          <p className='font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground'>
            Dados técnicos
          </p>
        </div>
        <div className='bg-off-white px-5 py-4 lg:px-42.5'>
          <h2 className='font-sans-condensed text-display-sm font-black uppercase leading-none text-brand-dark'>
            Especificações técnicas
          </h2>
        </div>
        {hasSpecs ? (
          <div className='bg-white pb-9'>
            <div className='w-full overflow-x-auto'>
              {specEntries.some(([, v]) => isMultiColumn(v)) && (
                <div className='flex items-center gap-8 border-b border-zinc-200 bg-white px-5 py-3 lg:px-42.5'>
                  <span className='w-1/2 shrink-0' />
                  <div className='flex flex-1 gap-4'>
                    <span className='flex-1 font-sans-condensed text-xs font-black uppercase tracking-widest text-brand'>
                      1 Ohm
                    </span>
                    <span className='flex-1 font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground'>
                      2 Ohms
                    </span>
                  </div>
                </div>
              )}
              {specEntries.map(([key, value], i) => (
                <div
                  key={key}
                  className={cn(
                    'flex items-center gap-8 px-5 py-4.5 lg:px-42.5',
                    i % 2 === 0 ? 'bg-muted' : 'bg-white',
                  )}>
                  <span className='w-1/2 shrink-0 font-sans text-sm font-medium capitalize text-brand-dark'>
                    {formatSpecKey(key)}
                  </span>
                  {isMultiColumn(value) ? (
                    <div className='flex flex-1 gap-4'>
                      <span className='flex-1 font-sans text-sm font-semibold text-brand-dark'>{value.ohm1}</span>
                      <span className='flex-1 font-sans text-sm text-text-subtle'>{value.ohm2}</span>
                    </div>
                  ) : (
                    <span className='font-sans text-sm text-text-subtle'>{String(value)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='bg-white px-5 py-9 lg:px-42.5'>
            <p className='font-sans text-sm text-text-subtle'>Nenhuma especificação disponível.</p>
          </div>
        )}
      </section>

      <section id='related' className='scroll-mt-38 bg-off-white py-10 md:py-12 lg:py-16'>
        <Container>
          <div className='border-b border-zinc-200 pb-3'>
            <p className='font-sans-condensed text-xs font-black uppercase tracking-widest text-muted-foreground'>
              Recomendações
            </p>
          </div>
          <h2 className='mt-4 font-sans-condensed text-display-sm font-black uppercase leading-none text-brand-dark'>
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
    </>
  )
}
