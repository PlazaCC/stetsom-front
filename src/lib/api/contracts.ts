export type ISODateString = string

export type ProductStatus = 'ACTIVE' | 'DISCONTINUED'

export type ProductBlockType = 'IMAGE' | 'VIDEO' | 'HTML' | 'MODEL3D' | 'TEXT'

export type ProductFileType = 'MANUAL' | 'CATALOG' | 'CERTIFICATE' | 'IMAGE' | 'OTHER'

export type ProductSpecifications = Record<string, string | number | boolean>

export type Category = {
  id: string
  name: string
  slug: string
  order: number
  created_at: ISODateString
  updated_at: ISODateString
}

export type Subcategory = {
  id: string
  category_id: string
  name: string
  slug: string
  order: number
  created_at: ISODateString
  updated_at: ISODateString
}

export type Product = {
  id: string
  name: string
  slug: string
  category_id: string
  subcategory_id?: string
  status: ProductStatus
  launch_date: ISODateString
  description: string
  specifications: ProductSpecifications
  thumbnail_url: string
  video_url?: string
  badge?: string | null
  created_at: ISODateString
  updated_at: ISODateString
  created_by: string
}

export type ProductBlock = {
  id: string
  product_id: string
  type: ProductBlockType
  order: number
  data: Record<string, unknown>
  created_by: string
  created_at: ISODateString
  updated_at: ISODateString
}

export type ProductFile = {
  id: string
  product_id: string
  file_url: string
  type: ProductFileType
  version: number
  is_active: boolean
  created_at: ISODateString
  updated_at: ISODateString
}

export type ProductDetailPayload = {
  product: Product
  blocks: ProductBlock[]
  files: ProductFile[]
  category: Category
  subcategory?: Subcategory
  relatedProducts: ProductCardItem[]
}

export type ProductCardItem = {
  id: string
  slug: string
  name: string
  category: string
  spec: string
  badge?: string | null
  img: string
  href: string
  status: ProductStatus
}

export type CatalogPagePayload = {
  heroLabel: string
  heroTitle: string
  heroImage: string
  heroImageAlt: string
  heroWatermark: string
}

export type HeroBannerSlide = {
  id: string
  desktopImage: string
  mobileImage?: string
  alt?: string
  href?: string
  label?: string
  title?: string
}

export type FAQItem = {
  q: string
  a: string
}

export type SocialMediaPost = {
  id: string
  image: string
  href: string
  alt?: string
  opacity?: number
}

export type SocialFeedSection = {
  handle: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  posts: SocialMediaPost[]
}

export type TimelineEvent = {
  id: string
  year: number
  title: string
  shortTitle: string
  description: string
  image: string
}

export type AboutValue = {
  id: string
  icon: 'zap' | 'shield-check' | 'rocket'
  title: string
  description: string
}

export type AboutBase = {
  id: string
  title: string
  description: string
}

export type SiteHomePayload = {
  hero: HeroBannerSlide[]
  featuredProducts: ProductCardItem[]
  spotlightProduct: ProductCardItem
  novidadesTabs: string[]
  novidades: {
    label: string
    title: string
    ctaLabel: string
    ctaHref: string
  }
  history: {
    label: string
    title: string
    subtitle: string
    image: string
    imageAlt: string
    ctaLabel: string
    ctaHref: string
  }
  bases: AboutBase[]
  faq: FAQItem[]
  faqSection: {
    label: string
    title: string
    subtitle: string
    ctaLabel: string
    ctaHref: string
  }
  social: SocialFeedSection
}

export type SiteAboutPayload = {
  hero: {
    label: string
    title: string
    image: string
    imageAlt: string
  }
  milestones: string[]
  quality: {
    label: string
    title: string
    description: string
    image: string
    imageAlt: string
  }
  values: AboutValue[]
  bases: AboutBase[]
  timeline: TimelineEvent[]
  jobsCta: {
    label: string
    title: string
    description: string
    buttonLabel: string
    buttonHref: string
    image: string
    imageAlt: string
  }
  social: SocialFeedSection
}

export type SupportCard = {
  id: string
  title: string
  description: string
  cta: string
}

export type SupportDocumentationCategory = {
  id: string
  name: string
}

export type SupportDocumentationLink = {
  id: string
  title: string
  href: string
  category: string
}

export type SupportPayload = {
  hero: {
    label: string
    title: string
    description: string
    image: string
    watermarkText: string
  }
  cards: SupportCard[]
  documentation: {
    label: string
    title: string
    categories: SupportDocumentationCategory[]
    links: SupportDocumentationLink[]
  }
  faqSearch: {
    label: string
    title: string
    placeholder: string
    categories: SupportDocumentationCategory[]
  }
  contact: {
    label: string
    title: string
    description: string
  }
  faq: {
    label: string
    title: string
    items: FAQItem[]
    supportButtonLabel: string
  }
}

export type DashboardMetric = {
  id: string
  label: string
  value: string
  variation?: string
}

export type AdminActivity = {
  id: string
  title: string
  description: string
  timestamp: ISODateString
}

export type AdminDashboardPayload = {
  title: string
  subtitle: string
  metrics: DashboardMetric[]
  recentActivities: AdminActivity[]
}

export type CmsProductRow = {
  id: string
  slug: string
  name: string
  category: string
  status: ProductStatus
  updated_at: ISODateString
}

export type CmsProductsPayload = {
  title: string
  subtitle: string
  items: CmsProductRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type CatalogProductsQuery = {
  q?: string
  category?: string
  status?: ProductStatus | 'ALL'
  page?: number
  pageSize?: number
}

export type CmsProductsQuery = {
  q?: string
  status?: ProductStatus | 'ALL'
  page?: number
  pageSize?: number
}

export type PaginatedResponse<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ApiErrorPayload = {
  error: {
    code: string
    message: string
  }
}
