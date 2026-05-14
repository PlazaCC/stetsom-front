'use client'

interface CatalogMobileFilterProps {
  categoryOptions: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CatalogMobileFilter({ categoryOptions, activeCategory, onCategoryChange }: CatalogMobileFilterProps) {
  return (
    <div className='lg:hidden mb-4 border border-zinc-200 rounded p-4 bg-off-white'>
      <p className='font-sans-condensed font-black text-xs uppercase text-brand-dark mb-3'>Categorias</p>
      <div className='flex flex-wrap gap-2'>
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
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
  )
}
