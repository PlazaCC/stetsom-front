import { buttonVariants } from '@/components/ui/button'
import Footer from '@/components/ui/footer'
import Header from '@/components/ui/header'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className='relative flex min-h-149 flex-col items-center justify-center overflow-hidden bg-off-white px-5 py-12 lg:px-42.5'>
        <span
          aria-hidden
          className='absolute pointer-events-none select-none font-sans-condensed text-[200px] leading-none font-black uppercase text-[#878787] opacity-[0.08] lg:text-[300px]'>
          404
        </span>

        <div className='relative z-10 flex max-w-175 flex-col items-center gap-6 text-center'>
          <div className='flex flex-col items-center gap-6'>
            <h1 className='font-sans-condensed text-[50px] leading-tight font-black uppercase text-brand-dark'>
              PÁGINA NÃO ENCONTRADA
            </h1>
            <p className='font-sans text-xl font-medium text-text-subtle-dark'>
              Parece que a página que você tentou acessar não existe
            </p>
            <Link href='/' className={cn(buttonVariants({ variant: 'brand', size: 'md' }))}>
              Voltar para Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
