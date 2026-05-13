import { type BreadcrumbItem, Breadcrumb } from '@/components/ui/breadcrumb'
import { Container } from '@/components/ui/container'
import { getCatalogProductDetail } from '@/lib/api/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ProductDetailTabs from './_components/product-detail-tabs'

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
      {/* PRODUCT PREVIEW — image left + info right */}
      <section className='bg-card py-6 lg:py-8'>
        <Container>
          <Breadcrumb items={breadcrumbItems} />

          <div className='mt-6 flex flex-col lg:flex-row lg:gap-12 lg:items-start'>
            {/* Left: main image */}
            <div className='flex flex-col gap-4 lg:w-[447px] shrink-0'>
              <div className='relative w-full aspect-[4/3] lg:h-[358px] border border-zinc-200 rounded-[20px] overflow-hidden bg-white flex items-center justify-center'>
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  priority
                  sizes='(max-width: 1024px) 100vw, 447px'
                  className='object-contain p-6'
                />
              </div>
              {/* Files count badge */}
              {files.length > 0 && (
                <p className='text-2xs font-sans uppercase text-muted-foreground tracking-wide'>
                  {files.length} arquivo{files.length > 1 ? 's' : ''} disponível{files.length > 1 ? 'is' : ''}
                </p>
              )}
            </div>

            {/* Right: product info */}
            <div className='flex-1 mt-6 lg:mt-0 lg:max-w-[476px]'>
              <p className='font-sans-condensed text-2xs font-medium uppercase text-brand'>{category.name}</p>
              <h1 className='mt-2 font-sans-condensed text-4xl lg:text-display-sm font-black uppercase leading-none text-brand-dark'>
                {product.name}
              </h1>
              <p className='mt-4 text-sm lg:text-base leading-relaxed text-text-subtle'>{product.description}</p>

              {/* Spec tags */}
              <ul className='mt-4 flex flex-wrap gap-2'>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li
                    key={key}
                    className='rounded-full border border-zinc-300 px-3 py-1 text-xs uppercase text-brand-dark'>
                    {key.replace(/_/g, ' ')}: {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* TABS: Especificações / Confira também */}
      <ProductDetailTabs
        productName={product.name}
        thumbnailUrl={product.thumbnail_url}
        specifications={product.specifications}
        blocks={blocks}
        relatedProducts={relatedProducts}
      />
    </div>
  )
}
