import type { Category, CmsProductRow, Product, ProductCardItem, ProductStatus } from '@/lib/api/contracts'

export function createCategoryLookup(categories: Category[]): Map<string, Category> {
  return new Map(categories.map((category) => [category.id, category]))
}

function toPowerSpec(product: Product): string {
  const power = product.specifications.power_rms

  if (typeof power === 'string' || typeof power === 'number') {
    return String(power)
  }

  return 'Especificacao em breve'
}

function badgeByStatus(status: ProductStatus): string | null {
  if (status === 'DISCONTINUED') {
    return 'Descontinuado'
  }

  return null
}

export function toProductCardItem(product: Product, categories: Map<string, Category>): ProductCardItem {
  const category = categories.get(product.category_id)

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: category?.name ?? 'Produto',
    spec: toPowerSpec(product),
    badge: badgeByStatus(product.status),
    img: product.thumbnail_url,
    href: `/produtos/${product.slug}`,
    status: product.status,
  }
}

export function toCmsProductRow(product: Product, categories: Map<string, Category>): CmsProductRow {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: categories.get(product.category_id)?.name ?? 'Categoria',
    status: product.status,
    updated_at: product.updated_at,
  }
}
