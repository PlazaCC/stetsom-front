import { type BreadcrumbItem, Breadcrumb } from '@/components/ui/breadcrumb'
import { Container } from '@/components/ui/container'
import { getCatalogProductDetail } from '@/lib/api/server'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ProductDetailTabs from './_components/product-detail-tabs'

function toImageList(data: Record<string, unknown>): string[] {
  const images = data.images

  if (!Array.isArray(images)) {
    return []
  }

  return images.filter((item): item is string => typeof item === 'string' && item.length > 0)
}

export default async function ProdutoDetalhePage(props: PageProps<'/produtos/[slug]'>) {
  const { slug } = await props.params
  const payload = await getCatalogProductDetail(slug)

  if (!payload) {
    notFound()
  }

  const { product, category, blocks, files, relatedProducts } = payload
  const galleryImagesFromBlocks = blocks.flatMap((block) => (block.type === 'IMAGE' ? toImageList(block.data) : []))
  const galleryImages = (galleryImagesFromBlocks.length ? galleryImagesFromBlocks : [product.thumbnail_url]).slice(0, 4)
  const manualFile = files.find((file) => file.type === 'MANUAL')
  const powerMetric =
    String(product.specifications.power_rms ?? '')
      .replace(' RMS', '')
      .trim() || '800W'
  const channelsMatch = /^(\d+)x/i.exec(String(product.specifications.power_rms ?? ''))
  const channelsMetric = channelsMatch ? `${channelsMatch[1]} CH` : '4 CH'
  const impedanceMetric = String(product.specifications.impedance ?? '').trim() || '2-4 Ohms'

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', href: '/' },
    { label: 'Produtos', href: '/produtos' },
    { label: category.name, href: `/produtos?category=${encodeURIComponent(category.slug)}` },
    { label: product.name },
  ]

  return (
    <>
      {/* PRODUCT PREVIEW — image left + info right */}
      <section className='bg-[#F8F8F8] py-6 lg:py-8'>
        <Container>
          <Breadcrumb items={breadcrumbItems} />

          <div className='mt-6 flex flex-col lg:flex-row lg:gap-12 lg:items-start'>
            {/* Left: main image */}
            <div className='flex flex-col gap-4 lg:w-111.75 shrink-0'>
              <div className='relative w-full aspect-[4/3] lg:h-89.5 border border-zinc-200 rounded-[20px] overflow-hidden bg-card flex items-center justify-center'>
                <Image
                  src={product.thumbnail_url}
                  alt={product.name}
                  fill
                  priority
                  sizes='(max-width: 1024px) 100vw, 447px'
                  className='object-contain p-6'
                />
              </div>

              <div className='flex items-center gap-3 overflow-x-auto pb-1'>
                {galleryImages.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type='button'
                    className='relative h-19 w-19 shrink-0 overflow-hidden rounded border border-zinc-200 bg-card'>
                    <Image
                      src={image}
                      alt={`${product.name} miniatura ${index + 1}`}
                      fill
                      sizes='72px'
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>

              {/* Files count badge */}
              {files.length > 0 && (
                <p className='text-2xs font-sans uppercase text-muted-foreground tracking-wide'>
                  {files.length} arquivo{files.length > 1 ? 's' : ''} disponível{files.length > 1 ? 'is' : ''}
                </p>
              )}
            </div>

            {/* Right: product info */}
            <div className='flex-1 mt-6 lg:mt-0 lg:max-w-119'>
              <p className='font-sans-condensed text-2xs font-black uppercase text-brand'>{category.name}</p>
              <h1 className='mt-2 font-sans-condensed text-4xl lg:text-display-sm font-black uppercase leading-none text-brand-dark'>
                {product.name}
              </h1>
              <p className='mt-4 text-sm lg:text-base leading-relaxed text-text-subtle'>{product.description}</p>

              {/* Spec tags */}
              <ul className='mt-4 flex flex-wrap gap-2'>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li
                    key={key}
                    className='rounded-[12px] border border-muted px-3 py-1 text-xs uppercase text-brand-dark'>
                    {key.replace(/_/g, ' ')}: {String(value)}
                  </li>
                ))}
              </ul>

              <div className='mt-6 grid grid-cols-3 gap-4 border-y border-zinc-200 py-4'>
                <div>
                  <p className='font-sans-condensed text-3xl font-black uppercase leading-none text-brand'>
                    {powerMetric}
                  </p>
                  <p className='text-2xs font-sans uppercase tracking-wide text-text-subtle'>Potência RMS</p>
                </div>
                <div>
                  <p className='font-sans-condensed text-3xl font-black uppercase leading-none text-brand'>
                    {channelsMetric}
                  </p>
                  <p className='text-2xs font-sans uppercase tracking-wide text-text-subtle'>Canais</p>
                </div>
                <div>
                  <p className='font-sans-condensed text-3xl font-black uppercase leading-none text-brand'>
                    {impedanceMetric}
                  </p>
                  <p className='text-2xs font-sans uppercase tracking-wide text-text-subtle'>Impedância</p>
                </div>
              </div>

              <div className='mt-5 flex flex-wrap gap-3'>
                {manualFile && (
                  <Link
                    href={manualFile.file_url}
                    className='inline-flex h-10 items-center rounded-[4px] bg-brand px-5 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-white transition-colors hover:bg-brand/90'>
                    Acessar manual do produto
                  </Link>
                )}
                <button
                  type='button'
                  className='inline-flex h-10 items-center rounded-[4px] border border-zinc-200 bg-card px-5 font-sans text-button-md font-semibold uppercase tracking-[0.8px] text-brand-dark'>
                  Download de fotos
                </button>
              </div>
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
    </>
  )
}
