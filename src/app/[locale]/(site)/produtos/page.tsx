import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { CatalogContent } from './_components/catalog-content'

export default async function ProdutosPage() {
  const t = await getTranslations('Catalog')

  return (
    <Suspense fallback={<div className='text-center py-16 text-muted-foreground text-base'>{t('loading')}</div>}>
      <CatalogContent />
    </Suspense>
  )
}
