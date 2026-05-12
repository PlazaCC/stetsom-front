'use client'

import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import { useCatalogCategories, useCatalogPage, useCatalogProducts } from '@/hooks/use-catalog'
import { createCategoryLookup, toProductCardItem } from '@/lib/api/mappers'
import { Search } from 'lucide-react'
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

  const catalogPageQuery = useCatalogPage()
  const categoriesQuery = useCatalogCategories()
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])
  const categoryLookup = useMemo(() => createCategoryLookup(categories), [categories])
  const categoryOptions = useMemo(() => ['Todos', ...categories.map((category) => category.name)], [categories])

  const activeCategorySlug = useMemo(() => {
    if (activeCategory === 'Todos') {
      return undefined
    }

    return categories.find((category) => category.name === activeCategory)?.slug
  }, [activeCategory, categories])

  const productsQuery = useCatalogProducts({
    q: search || undefined,
    category: activeCategorySlug,
    status: 'ALL',
    page: 1,
    pageSize: 24,
  })

  const productCards = useMemo(() => {
    return (productsQuery.data?.items ?? []).map((product) => toProductCardItem(product, categoryLookup))
  }, [productsQuery.data?.items, categoryLookup])

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
          <h1 className='font-sans-condensed font-black text-[32px] md:text-5xl lg:text-6xl leading-tight md:leading-16 uppercase text-white'>
            {hero.heroTitle.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
          <span className='text-xs md:text-base text-text-subtle-dark mt-2 block'>{totalProducts} produtos</span>
        </Container>
        <div className='absolute right-0 bottom-0 font-sans-condensed font-black text-[72px] md:text-[120px] lg:text-[150px] text-white leading-none pointer-events-none select-none opacity-[0.08]'>
          {hero.heroWatermark}
        </div>
      </section>

      {/* FILTROS */}
      <div className='bg-white border-b border-zinc-200'>
        <Container className='py-3 md:py-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4'>
          <div className='w-full md:flex-1 border border-zinc-500 flex items-center h-9 md:h-11 px-3 md:px-3.5 gap-2.5 md:max-w-100'>
            <Search size={16} className='text-zinc-500 shrink-0' />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Buscar produto...'
              className='border-none outline-none text-sm md:text-[15px] flex-1 text-brand-dark bg-transparent'
            />
          </div>
          <div className='flex gap-2 overflow-x-auto pb-2 md:pb-0 md:flex-wrap md:gap-1 md:shrink-0'>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-sans-condensed font-medium text-xs md:text-sm uppercase px-2 md:px-4 py-1 md:py-1.5 border transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-transparent text-zinc-500 border-zinc-200 hover:border-zinc-400'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* GRID */}
      <section className='bg-white pt-6 md:pt-8 lg:pt-10 pb-10 md:pb-12 lg:pb-15'>
        <Container>
          {isLoading ? (
            <div className='text-center py-16 text-zinc-400 text-base'>Carregando produtos...</div>
          ) : productCards.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5'>
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
        </Container>
      </section>
    </div>
  )
}
