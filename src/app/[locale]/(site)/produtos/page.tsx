import { Suspense } from 'react'
import { CatalogContent } from './_components/catalog-content'

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className='text-center py-16 text-muted-foreground text-base'>Carregando...</div>}>
      <CatalogContent />
    </Suspense>
  )
}
