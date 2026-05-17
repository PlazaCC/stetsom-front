import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <main className='relative flex min-h-149 flex-col items-center justify-center overflow-hidden bg-off-white px-5 py-12 lg:px-42.5'>
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
        <div className='flex flex-col items-center gap-6'>
          <h1 className='font-sans-condensed text-5xl leading-tight font-black uppercase text-brand-dark'>
            {t('title')}
          </h1>
          <p className='font-sans text-xl text-text-subtle-dark'>{t('description')}</p>
          <Link href='/' className={cn(buttonVariants({ variant: 'brand', size: 'md' }))}>
            {t('backHome')}
          </Link>
        </div>
      </div>
    </main>
  )
}
