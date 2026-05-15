'use client'

import { ChevronDown, Search } from 'lucide-react'

interface CatalogSidebarProps {
  search: string
  onSearchChange: (value: string) => void
  activeCategory: string
  onCategoryChange: (category: string) => void
  onClear: () => void
  typeFilterOptions: string[]
}

export function CatalogSidebar({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  onClear,
  typeFilterOptions,
}: CatalogSidebarProps) {
  return (
    <aside className='hidden lg:flex flex-col gap-5 w-90 shrink-0'>
      <div className='flex items-center justify-between'>
        <h2 className='font-sans font-bold text-lg text-foreground'>Filtros</h2>
        <button type='button' onClick={onClear} className='font-sans text-sm font-light text-brand underline underline-offset-2'>
          Limpar tudo
        </button>
      </div>

      <div className='pb-1'>
        <p className='font-sans font-medium text-base text-muted-foreground'>
          Ordenar por
        </p>
        <button
          type='button'
          className='mt-3 flex h-11 w-full items-center justify-between rounded border border-border bg-card px-3.5 text-base text-muted-foreground'>
          <span>Mais relevantes</span>
          <ChevronDown size={14} className='text-muted-foreground' />
        </button>
      </div>

      <div className='border-t border-border pt-5'>
        <div className='flex items-center justify-between'>
          <span className='font-sans font-bold text-lg text-foreground'>Opções</span>
          <ChevronDown size={16} className='text-muted-foreground' />
        </div>
        <div className='mt-3 space-y-3'>
          <label className='flex items-center gap-3 text-base text-muted-foreground'>
            <input type='checkbox' className='size-4 rounded border-border accent-brand' defaultChecked />
            Exibir fora de linha
          </label>
          <label className='flex items-center gap-3 text-base text-muted-foreground'>
            <input type='checkbox' className='size-4 rounded border-border accent-brand' />
            Produtos de exportação
          </label>
        </div>
      </div>

      <div className='border-t border-border pt-5'>
        <div className='flex items-center justify-between'>
          <span className='font-sans font-bold text-lg text-foreground'>Buscar</span>
        </div>
        <div className='border border-border bg-card flex items-center h-11 px-3.5 gap-2.5 mt-3'>
          <Search size={16} className='text-muted-foreground shrink-0' />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder='Buscar produto...'
            className='border-none outline-none text-sm flex-1 text-brand-dark bg-transparent'
          />
        </div>
      </div>

      <div className='border-t border-border pt-5'>
        <div className='flex items-center justify-between'>
          <span className='font-sans font-bold text-lg text-foreground'>Tipo de produto</span>
          <ChevronDown size={16} className='text-muted-foreground' />
        </div>
        <div className='mt-3 flex flex-col gap-2'>
          {typeFilterOptions.map((cat) => (
            <label key={cat} className='flex items-center gap-3 text-base text-muted-foreground'>
              <input
                type='checkbox'
                checked={activeCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className='size-4 rounded border-border accent-brand'
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className='border-t border-border pt-5'>
        <div className='flex items-center justify-between'>
          <span className='font-sans font-bold text-lg text-foreground'>Linhas</span>
          <ChevronDown size={16} className='text-muted-foreground' />
        </div>
        <div className='mt-3 space-y-2 text-base text-muted-foreground'>
          <label className='flex items-center gap-3'>
            <input type='checkbox' className='size-4 rounded border-border accent-brand' defaultChecked />
            Vulcan
          </label>
          <label className='flex items-center gap-3'>
            <input type='checkbox' className='size-4 rounded border-border accent-brand' />
            Combat Line
          </label>
          <label className='flex items-center gap-3'>
            <input type='checkbox' className='size-4 rounded border-border accent-brand' />
            Digital Bass
          </label>
        </div>
      </div>
    </aside>
  )
}
