'use client'

import { Container } from '@/components/ui/container'
import ProductCard from '@/components/ui/product-card'
import { useCatalogCategories, useCatalogPage, useCatalogProducts } from '@/hooks/use-catalog'
import { useCatalogFilters } from '@/hooks/use-catalog-filters'
import { createCategoryLookup, toProductCardItem } from '@/lib/api/mappers'
import type { Category } from '@/lib/api/contracts'
import { cn } from '@/lib/utils'
import { CatalogMobileFilter } from './catalog-mobile-filter'
import { CatalogSidebar } from './catalog-sidebar'
import { ArrowLeftRight, Search, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useMemo } from 'react'

interface CategoryOption {
  name: string
  slug: string
}

const CATEGORY_IMAGE_BY_NAME: Record<string, string> = {
  Amplificadores: '/figma-assets/raw/fill_CGM3WO_6a0a1876.png',
  Processadores: '/figma-assets/raw/fill_EPTO4T_3d86cd17.png',
  Subwoofers: '/figma-assets/raw/fill_3MZVXN_813a9a32.png',
  Crossovers: '/figma-assets/raw/fill_6OC3H9_7136cc16.png',
  Fontes: '/figma-assets/raw/fill_3FJG3P_64a33e19.png',
  Controles: '/figma-assets/raw/fill_THI4RN_1e666beb.png',
  Acessórios: '/figma-assets/raw/fill_YKBFZV_e95c6db4.png',
}

const DEFAULT_CATALOG_HERO = {
  heroLabel: 'CATALOGO COMPLETO',
  heroTitle: 'NOSSOS\nPRODUTOS',
  heroImage: '/figma-assets/raw/fill_CGM3WO_6a0a1876.png',
  heroImageAlt: 'Catalogo Stetsom',
  heroWatermark: 'PRODU',
} as const

function toCategoryOptions(categories: Category[]): CategoryOption[] {
  return [
    { name: 'Todos', slug: 'todos' },
    ...categories.map((c) => ({ name: c.name, slug: c.slug })),
  ]
}

function buildSlugImageMap(categories: Category[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const cat of categories) {
    if (CATEGORY_IMAGE_BY_NAME[cat.name]) {
      map[cat.slug] = CATEGORY_IMAGE_BY_NAME[cat.name]
    }
  }
  return map
}

export default function CatalogContent() {
  const {
    activeCategory,
    search,
    sidebarOpen,
    setActiveCategory,
    setSearch,
    setSidebarOpen,
    clearFilters,
  } = useCatalogFilters()

  const catalogPageQuery = useCatalogPage()
  const categoriesQuery = useCatalogCategories()
  const categories = useMemo(() => categoriesQuery.data ?? [], [categoriesQuery.data])

  const categoryOptions = useMemo(() => toCategoryOptions(categories), [categories])
  const categoryImageBySlug = useMemo(() => buildSlugImageMap(categories), [categories])
  const categoryLookup = useMemo(() => createCategoryLookup(categories), [categories])

  const activeCategorySlug = activeCategory === 'todos' ? undefined : activeCategory

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
  const typeFilterOptions = useMemo(() => categoryOptions.filter((c) => c.slug !== 'todos'), [categoryOptions])

  const isLoading = categoriesQuery.isLoading || productsQuery.isLoading
  const totalProducts = productsQuery.data?.total ?? 0
  const hero = catalogPageQuery.data ?? DEFAULT_CATALOG_HERO

  return (
    <div>
      <section className='relative overflow-hidden bg-brand-dark h-72 lg:h-84'>
        <div
          className='absolute inset-0'
          style={{
            background: 'radial-gradient(circle at 99% 114%, rgba(27,26,44,1) 0%, rgba(28,24,24,1) 100%)',
          }}
        />
        <Image src={hero.heroImage} alt={hero.heroImageAlt} fill className='object-cover opacity-45' sizes='100vw' priority />
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
          <h1 className='font-sans-condensed font-black text-5xl md:text-6xl lg:text-[90px] leading-tight md:leading-16 lg:leading-18.5 uppercase text-white'>
            {hero.heroTitle.split('\n').map((line) => (
              <span key={line} className='block'>
                {line}
              </span>
            ))}
          </h1>
          <span className='text-xs md:text-base text-text-subtle-dark mt-2 block'>
            <strong className='font-sans-condensed font-black text-xl text-white'>{totalProducts}</strong> produtos
          </span>
        </Container>
        <div className='absolute right-0 bottom-0 font-sans-condensed font-black text-display-2xl sm:text-[150px] lg:text-[263px] text-watermark-text leading-none pointer-events-none select-none opacity-[0.08]'>
          {hero.heroWatermark}
        </div>
        <div className='absolute left-0 top-0 w-3.5 h-full bg-bar-accent' />
      </section>

      <div className='bg-white border-b border-border'>
        <Container>
          <div className='flex items-center gap-3 py-1 overflow-x-auto'>
            {categoryOptions.map((cat) => {
              const imageSrc = categoryImageBySlug[cat.slug]
              const isActive = activeCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    'flex items-center gap-2 font-sans font-medium text-base leading-5 px-3 py-2 whitespace-nowrap border-b-2 transition-colors shrink-0',
                    isActive ? 'border-brand text-brand-dark' : 'border-transparent text-muted-foreground hover:text-brand-dark',
                  )}>
                  {imageSrc && (
                    <div
                      className={cn(
                        'rounded overflow-hidden shrink-0 flex items-center justify-center',
                        isActive ? 'w-10 h-10 bg-brand/10' : 'w-7 h-7 bg-muted',
                      )}>
                      <Image
                        src={imageSrc}
                        alt=''
                        width={isActive ? 24 : 20}
                        height={isActive ? 24 : 20}
                        className='object-contain'
                      />
                    </div>
                  )}
                  {cat.name}
                </button>
              )
            })}
          </div>
        </Container>
      </div>

      <section className='bg-white pt-6 pb-12'>
        <Container>
          <div className='flex gap-9'>
            <CatalogSidebar
              search={search}
              onSearchChange={setSearch}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              onClear={clearFilters}
              typeFilterOptions={typeFilterOptions}
            />

            <div className='flex-1 min-w-0'>
              <div className='flex gap-3 mb-4 lg:hidden'>
                <div className='flex-1 border border-border flex items-center h-10 px-3 gap-2'>
                  <Search size={14} className='text-icon-muted shrink-0' />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Buscar produto...'
                    className='border-none outline-none text-sm flex-1 text-brand-dark bg-transparent'
                  />
                </div>
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className='border border-border flex items-center gap-2 px-3 h-10 text-sm text-muted-foreground'>
                  <SlidersHorizontal size={14} />
                  Filtros
                </button>
                <button
                  type='button'
                  className='border border-border flex items-center gap-2 px-3 h-10 text-sm text-muted-foreground'>
                  <ArrowLeftRight size={14} />
                  Comparar
                </button>
              </div>

              {sidebarOpen && (
                <CatalogMobileFilter
                  categoryOptions={categoryOptions}
                  activeCategory={activeCategory}
                  onCategoryChange={(slug) => {
                    setActiveCategory(slug)
                    setSidebarOpen(false)
                  }}
                />
              )}

              {isLoading ? (
                <div className='text-center py-16 text-muted-foreground text-base'>Carregando produtos...</div>
              ) : productCards.length > 0 ? (
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 md:gap-8'>
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
                <div className='text-center py-16 text-muted-foreground text-base'>Nenhum produto encontrado.</div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
