'use client'

import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import { useCatalogCategories, useCatalogPage, useCatalogProducts } from '@/hooks/use-catalog'
import { createCategoryLookup, toProductCardItem } from '@/lib/api/mappers'
import { Search, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'

const DEFAULT_CATALOG_HERO = {
  heroLabel: 'CATALOGO COMPLETO',
  heroTitle: 'NOSSOS\nPRODUTOS',
  heroImage: '/figma-assets/raw/fill_CGM3WO_6a0a1876.png',
  heroImageAlt: 'Catalogo Stetsom',
  heroWatermark: 'PRODU',
} as const

export default function ProdutosPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const catalogPageQuery = useCatalogPage()
  const categoriesQuery = useCatalogCategories()
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])
  const categoryLookup = useMemo(() => createCategoryLookup(categories), [categories])
  const categoryOptions = useMemo(() => ['Todos', ...categories.map((c) => c.name)], [categories])

  const activeCategorySlug = useMemo(() => {
    if (activeCategory === 'Todos') return undefined
    return categories.find((c) => c.name === activeCategory)?.slug
  }, [activeCategory, categories])

  const productsQuery = useCatalogProducts({
    q: search || undefined,
    category: activeCategorySlug,
    status: 'ALL',
    page: 1,
    pageSize: 24,
  })

  const productCards = useMemo(
    () => (productsQuery.data?.items ?? []).map((p) => toProductCardItem(p, categoryLookup)),
    [productsQuery.data?.items, categoryLookup],
  )

  const isLoading = categoriesQuery.isLoading || productsQuery.isLoading
  const totalProducts = productsQuery.data?.total ?? 0
  const hero = catalogPageQuery.data ?? DEFAULT_CATALOG_HERO

  return (
    <div>
      {/* HERO */}
      <section className='relative overflow-hidden bg-brand-dark h-50 md:h-70 lg:h-84'>
        <div
          className='absolute inset-0'
          style={{
            background: 'radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(28,24,24,1) 100%)',
          }}
        />
        <Image src={hero.heroImage} alt={hero.heroImageAlt} fill className='object-cover opacity-45' priority />
        <div
          className='absolute inset-0'
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)' }}
        />
        <Container className='relative z-10 pt-8 md:pt-16 lg:pt-25.75'>
          <div className='flex items-center gap-2 mb-1'>
            <div className='w-6 h-px bg-brand shrink-0' />
            <span className='font-sans-condensed font-medium text-xs md:text-base uppercase text-brand'>
              {hero.heroLabel}
            </span>
          </div>
          <h1 className='font-sans-condensed font-black text-[32px] md:text-5xl lg:text-[90px] leading-tight md:leading-16 lg:leading-[74px] uppercase text-white'>
            {hero.heroTitle.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
          <span className='text-xs md:text-base text-text-subtle-dark mt-2 block'>
            <strong className='font-sans-condensed font-black text-xl text-white'>{totalProducts}</strong>{' '}
            produtos
          </span>
        </Container>
        <div className='absolute right-0 bottom-0 font-sans-condensed font-black text-[72px] md:text-[120px] lg:text-[150px] text-white leading-none pointer-events-none select-none opacity-[0.08]'>
          {hero.heroWatermark}
        </div>
        <div className='absolute left-0 top-0 w-3.5 h-full bg-bar-accent' />
      </section>

      {/* CATEGORY TABS */}
      <div className='bg-white border-b border-zinc-200'>
        <Container>
          <div className='flex items-center gap-1 py-1 overflow-x-auto'>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans font-medium text-[18px] leading-5 px-2 py-2 whitespace-nowrap border-b-2 transition-colors ${
                  activeCategory === cat
                    ? 'border-brand text-brand-dark'
                    : 'border-transparent text-muted-foreground hover:text-brand-dark'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* CONTENT: sidebar + grid */}
      <section className='bg-white pt-6 pb-12'>
        <Container>
          <div className='flex gap-9'>
            {/* SIDEBAR — visible lg+ */}
            <aside className='hidden lg:flex flex-col gap-5 w-90 shrink-0'>
              {/* Search */}
              <div className='border border-zinc-300 flex items-center h-11 px-3.5 gap-2.5'>
                <Search size={16} className='text-zinc-500 shrink-0' />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder='Buscar produto...'
                  className='border-none outline-none text-[15px] flex-1 text-brand-dark bg-transparent'
                />
              </div>

              {/* Category filter */}
              <div>
                <p className='font-sans-condensed font-black text-xs uppercase text-brand-dark mb-3 tracking-wide'>
                  Categorias
                </p>
                <div className='flex flex-col gap-1'>
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left font-sans text-[15px] py-1.5 px-3 transition-colors border-l-2 ${
                        activeCategory === cat
                          ? 'border-brand text-brand-dark font-medium bg-off-white'
                          : 'border-transparent text-text-subtle hover:text-brand-dark hover:border-zinc-300'
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* PRODUCT GRID */}
            <div className='flex-1 min-w-0'>
              {/* Mobile search + filter bar */}
              <div className='flex gap-3 mb-4 lg:hidden'>
                <div className='flex-1 border border-zinc-300 flex items-center h-10 px-3 gap-2'>
                  <Search size={14} className='text-zinc-500 shrink-0' />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar produto...'
                    className='border-none outline-none text-sm flex-1 text-brand-dark bg-transparent'
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className='border border-zinc-300 flex items-center gap-2 px-3 h-10 text-sm text-muted-foreground'>
                  <SlidersHorizontal size={14} />
                  Filtros
                </button>
              </div>

              {/* Mobile sidebar drawer */}
              {sidebarOpen && (
                <div className='lg:hidden mb-4 border border-zinc-200 rounded p-4 bg-off-white'>
                  <p className='font-sans-condensed font-black text-xs uppercase text-brand-dark mb-3'>Categorias</p>
                  <div className='flex flex-wrap gap-2'>
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat)
                          setSidebarOpen(false)
                        }}
                        className={`font-sans text-sm px-3 py-1 border transition-colors ${
                          activeCategory === cat
                            ? 'bg-brand-dark text-white border-brand-dark'
                            : 'bg-white text-muted-foreground border-zinc-200 hover:border-zinc-400'
                        }`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className='text-center py-16 text-zinc-400 text-base'>Carregando produtos...</div>
              ) : productCards.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4'>
                  {productCards.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      category={product.category}
                      spec={product.spec}
                      badge={product.badge}
                      img={product.img}
                      href={product.href}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-center py-16 text-zinc-400 text-base'>Nenhum produto encontrado.</div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
