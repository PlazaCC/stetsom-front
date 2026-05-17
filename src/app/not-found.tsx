import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
// next/link is intentional here: this root not-found fires before the [locale] segment
// is resolved, so next-intl context is unavailable. Strings default to PT-BR as fallback.
import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang='pt-BR'>
      <body>
        <main className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-off-white px-5 py-12'>
          <svg
            aria-hidden
            className='absolute pointer-events-none select-none opacity-[0.08] text-watermark-text'
            width='626'
            height='301'
            viewBox='0 0 626 301'>
            <text
              x='50%'
              y='80%'
              dominantBaseline='middle'
              textAnchor='middle'
              className='font-sans-condensed font-black'
              fontSize='300'
              fill='currentColor'>
              404
            </text>
          </svg>
          <div className='relative z-10 flex max-w-175 flex-col items-center gap-6 text-center'>
            <h1 className='font-sans-condensed text-5xl leading-tight font-black uppercase text-brand-dark'>
              PÁGINA NÃO ENCONTRADA
            </h1>
            <p className='font-sans text-xl text-text-subtle-dark'>
              Parece que a página que você tentou acessar não existe
            </p>
            <Link href='/' className={cn(buttonVariants({ variant: 'brand', size: 'md' }))}>
              Voltar para Home
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
