import { type BreadcrumbItem, Breadcrumb } from '@/components/ui/breadcrumb'
import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import type { ProductBlock } from '@/lib/api/contracts'
import { getCatalogProductDetail } from '@/lib/api/server'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'

const PRODUCT_HERO_GRADIENT = {
  background: 'radial-gradient(circle at 50% 50%, rgb(238, 8, 0) 45%, rgb(0, 0, 0) 100%)',
} as const

const BLOCK_PLACEHOLDER_LABEL: Record<'VIDEO' | 'MODEL3D' | 'HTML', string> = {
  VIDEO: 'Video',
  MODEL3D: 'Modelo 3D',
  HTML: 'HTML customizado',
}

type TextBlockData = {
  title?: string
  content?: string
  align?: string
}

type ImageBlockData = {
  images?: string[]
  caption?: string
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && item.length > 0)
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
  if (align === 'center') {
    return 'text-center'
  }

  if (align === 'right') {
    return 'text-right'
  }

  return 'text-left'
}

function formatSpecificationKey(value: string) {
  return value.replace(/_/g, ' ')
}

function renderProductBlock(block: ProductBlock, productName: string, fallbackImage: string) {
  if (block.type === 'TEXT') {
    const data = toTextBlockData(block.data)
    const title = data.title ?? 'Detalhes do produto'
    const content = data.content ?? 'Descricao indisponivel para este bloco.'

    return (
      <article key={block.id} className='rounded-xl border border-zinc-200 bg-card p-6 md:p-8'>
        <h2 className='font-sans-condensed text-section-title font-black uppercase text-brand-dark'>{title}</h2>
        <p
          className={cn(
            'mt-3 text-sm leading-relaxed text-text-subtle md:text-base',
            resolveTextAlignClass(data.align),
          )}>
          {content}
        </p>
      </article>
    )
  }

  if (block.type === 'IMAGE') {
    const data = toImageBlockData(block.data)
    const images = data.images?.length ? data.images : [fallbackImage]

    return (
      <article key={block.id} className='space-y-3'>
        {images.map((source, index) => (
          <div
            key={`${block.id}-${source}-${index}`}
            className='relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-brand-dark'>
            <Image
              src={source}
              alt={`${productName} visual ${index + 1}`}
              fill
              sizes='(max-width: 1024px) 100vw, 1100px'
              className='object-cover'
            />
          </div>
        ))}
        {data.caption && <p className='text-sm text-text-subtle'>{data.caption}</p>}
      </article>
    )
  }

  return (
    <article key={block.id} className='rounded-xl border border-dashed border-zinc-300 bg-card p-5 md:p-6'>
      <p className='font-sans-condensed text-sm font-bold uppercase text-brand-dark'>
        {BLOCK_PLACEHOLDER_LABEL[block.type]}
      </p>
      <p className='mt-1 text-sm leading-relaxed text-text-subtle'>Conteudo em breve para este bloco.</p>
    </article>
  )
}

export default async function ProdutoDetalhePage(props: PageProps<'/produtos/[slug]'>) {
  const { slug } = await props.params
  const payload = await getCatalogProductDetail(slug)

  if (!payload) {
    notFound()
  }

  const { product, category, blocks, files, relatedProducts } = payload

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/produtos' },
    { label: category.name, href: `/produtos?category=${encodeURIComponent(category.slug)}` },
    { label: product.name },
  ]

  return (
    <div className='bg-white'>
      <section className='bg-card py-5 md:py-6 lg:py-8'>
        <Container>
          <Breadcrumb items={breadcrumbItems} />

          <div className='mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div className='max-w-190'>
              <p className='font-sans-condensed text-2xs font-medium uppercase text-brand'>{category.name}</p>
              <h1 className='mt-2 font-sans-condensed text-4xl font-black uppercase leading-none text-brand-dark md:text-display-sm'>
                {product.name}
              </h1>
              <p className='mt-3 text-sm leading-relaxed text-text-subtle md:text-base'>{product.description}</p>
            </div>

            <ul className='flex flex-wrap gap-2 md:gap-3 lg:max-w-140 lg:justify-end'>
              {Object.entries(product.specifications).map(([key, value]) => (
                <li
                  key={key}
                  className='rounded-full border border-zinc-300 px-3 py-1 text-xs uppercase text-brand-dark'>
                  {formatSpecificationKey(key)}: {String(value)}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className='relative isolate overflow-hidden bg-black'>
        <div className='absolute inset-0' style={PRODUCT_HERO_GRADIENT} />
        <div className='absolute inset-x-0 bottom-0 h-22 bg-gradient-to-t from-black/70 to-transparent' />

        <Container className='relative z-10 py-8 md:py-10 lg:py-14'>
          <div className='mx-auto max-w-220'>
            <div className='relative h-74.75 w-full sm:h-80 md:h-92 lg:h-100'>
              <Image
                src={product.thumbnail_url}
                alt={product.name}
                fill
                priority
                sizes='(max-width: 1024px) 100vw, 960px'
                className='object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.35)]'
              />
            </div>
          </div>
        </Container>
      </section>

      <section className='bg-white py-10 md:py-12 lg:py-14'>
        <Container className='space-y-6 md:space-y-8'>
          {blocks.map((block) => renderProductBlock(block, product.name, product.thumbnail_url))}

          <article className='rounded-xl border border-dashed border-zinc-300 bg-card p-5 md:p-6'>
            <h2 className='font-sans-condensed text-section-title font-black uppercase text-brand-dark'>Arquivos</h2>
            <p className='mt-1 text-sm text-text-subtle'>
              Downloads e materiais desta pagina serao disponibilizados em breve.
            </p>
            <p className='mt-1 text-xs uppercase text-muted-foreground'>{files.length} item(ns) catalogado(s)</p>
          </article>
        </Container>
      </section>

      <section className='bg-off-white py-10 md:py-12 lg:py-16'>
        <Container>
          <h2 className='font-sans-condensed text-display-sm font-black uppercase leading-none text-brand-dark'>
            Produtos relacionados
          </h2>
          <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5'>
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                name={relatedProduct.name}
                category={relatedProduct.category}
                spec={relatedProduct.spec}
                badge={relatedProduct.badge}
                img={relatedProduct.img}
                href={relatedProduct.href}
              />
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
