import { Container } from '@/components/ui/container'
import { SectionLabel } from '@/components/ui/section-label'
import { getCatalogProductDetail } from '@/lib/api/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProdutoDetalhePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const payload = await getCatalogProductDetail(slug)

  if (!payload) {
    notFound()
  }

  const { product, category, blocks, files } = payload

  return (
    <section className='bg-white py-12'>
      <Container>
        <div className='mb-10'>
          <SectionLabel label={category.name} title={product.name} />
          <p className='mt-4 max-w-190 text-base text-text-subtle'>{product.description}</p>
          <div className='mt-4 flex flex-wrap gap-3'>
            {Object.entries(product.specifications).map(([key, value]) => (
              <span
                key={key}
                className='rounded-full border border-zinc-200 px-3 py-1 text-xs uppercase text-brand-dark'>
                {key.replace(/_/g, ' ')}: {String(value)}
              </span>
            ))}
          </div>
        </div>

        <div className='grid gap-6 lg:grid-cols-2'>
          {blocks.map((block) => (
            <article key={block.id} className='rounded-md border border-zinc-200 p-5'>
              <p className='mb-2 text-xs uppercase text-brand'>{block.type}</p>
              <pre className='overflow-auto text-xs text-zinc-600'>{JSON.stringify(block.data, null, 2)}</pre>
            </article>
          ))}
        </div>

        <div className='mt-10 rounded-md border border-zinc-200 p-5'>
          <h2 className='font-sans-condensed text-2xl font-black uppercase text-brand-dark'>Arquivos</h2>
          <ul className='mt-4 grid gap-3'>
            {files.map((file) => (
              <li key={file.id} className='flex items-center justify-between gap-4'>
                <span className='text-sm text-zinc-600'>
                  {file.type} v{file.version}
                </span>
                <Link href={file.file_url} className='text-sm text-brand'>
                  Baixar
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
