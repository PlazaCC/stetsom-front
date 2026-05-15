'use client'

import type { ProductBlock } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { resolveTextAlignClass, toImageBlockData, toTextBlockData } from '@/lib/utils/product'
import DOMPurify from 'dompurify'
import Image from 'next/image'

interface BlockRendererProps {
  block: ProductBlock
  productName: string
  fallbackImage: string
}

export function BlockRenderer({ block, productName, fallbackImage }: BlockRendererProps) {
  if (block.type === 'TEXT') {
    const data = toTextBlockData(block.data)
    return (
      <article className='rounded-xl border border-border bg-card p-6 md:p-8'>
        <h2 className='font-sans-condensed text-section-title font-black uppercase text-brand-dark'>
          {data.title ?? 'Detalhes do produto'}
        </h2>
        <p
          className={cn(
            'mt-3 text-sm leading-relaxed text-text-subtle md:text-base',
            resolveTextAlignClass(data.align),
          )}>
          {data.content ?? 'Descrição indisponível para este bloco.'}
        </p>
      </article>
    )
  }

  if (block.type === 'IMAGE') {
    const data = toImageBlockData(block.data)
    const images = data.images?.length ? data.images : [fallbackImage]
    return (
      <article className='space-y-3'>
        {images.map((src, i) => (
          <div
            key={`${block.id}-${i}`}
            className='relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-brand-dark'>
            <Image
              src={src}
              alt={`${productName} visual ${i + 1}`}
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

  if (block.type === 'VIDEO') {
    const title = typeof block.data.title === 'string' ? block.data.title : `${productName} em destaque`
    const description =
      typeof block.data.description === 'string'
        ? block.data.description
        : 'Veja a demonstração completa com foco em potência, estabilidade e performance real em uso automotivo.'
    const videoUrl = typeof block.data.video_url === 'string' ? block.data.video_url : undefined
    return (
      <article className='rounded-xl border border-border bg-card p-6 md:p-8'>
        <p className='font-sans-condensed text-xs font-bold uppercase tracking-wider text-brand'>Video</p>
        <h3 className='mt-2 font-sans-condensed text-section-title font-black uppercase text-brand-dark'>{title}</h3>
        <p className='mt-3 text-sm leading-relaxed text-text-subtle'>{description}</p>
        {videoUrl ? (
          <a
            href={videoUrl}
            target='_blank'
            rel='noreferrer'
            className='mt-5 inline-flex rounded-lg bg-brand px-4 py-2 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-white'>
            Assistir demonstração
          </a>
        ) : null}
      </article>
    )
  }

  if (block.type === 'HTML') {
    const rawHtml = typeof block.data.html === 'string' ? block.data.html : '<p>Conteúdo técnico indisponível.</p>'
    const safeHtml = DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true } })
    return (
      <article className='rounded-xl border border-border bg-card p-6 md:p-8'>
        <p className='font-sans-condensed text-xs font-bold uppercase tracking-wider text-brand'>Detalhes técnicos</p>
        <div
          className='mt-3 text-sm leading-relaxed text-text-subtle [&_strong]:font-semibold [&_strong]:text-brand-dark'
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      </article>
    )
  }

  if (block.type === 'MODEL3D') {
    const modelUrl = typeof block.data.file_url === 'string' ? block.data.file_url : null
    return (
      <article className='rounded-xl border border-border bg-card p-6 md:p-8'>
        <p className='font-sans-condensed text-xs font-bold uppercase tracking-wider text-brand'>Modelo 3D</p>
        <h3 className='mt-2 font-sans-condensed text-section-title font-black uppercase text-brand-dark'>
          Visualização interativa
        </h3>
        <p className='mt-3 text-sm leading-relaxed text-text-subtle'>
          Explore o produto em perspectiva completa para conferir conectores, acabamento e dimensões reais.
        </p>
        {modelUrl ? (
          <a
            href={modelUrl}
            target='_blank'
            rel='noreferrer'
            className='mt-5 inline-flex rounded-[4px] border border-border bg-white px-4 py-2 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-brand-dark'>
            Abrir modelo
          </a>
        ) : null}
      </article>
    )
  }

  return null
}
