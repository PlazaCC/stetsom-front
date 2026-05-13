import Footer from '@/components/ui/footer'
import Header from '@/components/ui/header'
import Link from 'next/link'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[596px] flex-col items-center justify-center bg-off-white relative overflow-hidden px-8 py-12 lg:px-42.5">
        <span
          aria-hidden
          className="font-sans-condensed font-black uppercase absolute select-none pointer-events-none text-[200px] lg:text-[300px] leading-none text-[#878787] opacity-[0.08]"
        >
          404
        </span>

        <div className="relative z-10 flex flex-col items-center gap-12 text-center max-w-175">
          <div className="flex flex-col items-center gap-6">
            <h1 className="font-sans-condensed font-black uppercase text-[50px] leading-tight text-[#111111]">
              PÁGINA NÃO ENCONTRADA
            </h1>
            <p className="font-sans text-xl font-medium text-text-subtle-dark">
              Parece que a página que você tentou acessar não existe
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex h-11.25 items-center gap-2 rounded-[4px] bg-brand px-8 font-sans text-button-md font-bold uppercase tracking-[0.8px] text-zinc-50 transition-colors hover:bg-brand/90"
          >
            Voltar para a Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
