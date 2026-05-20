export type Locale = "pt-BR" | "en" | "es";

export type ISODateString = string;

export type ProductStatus = "ACTIVE" | "DISCONTINUED";

export type ProductFileType =
  | "MANUAL"
  | "CATALOG"
  | "CERTIFICATE"
  | "IMAGE"
  | "OTHER";

export type SpecSimpleValue = string | number | boolean;
export type SpecMultiColumnValue = { ohm1: string; ohm2: string };
export type ProductSpecifications = Record<
  string,
  SpecSimpleValue | SpecMultiColumnValue
>;

export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
  created_at: ISODateString;
  updated_at: ISODateString;
};

export type Subcategory = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  order: number;
  created_at: ISODateString;
  updated_at: ISODateString;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  subcategory_id?: string;
  status: ProductStatus;
  launch_date: ISODateString;
  description: string;
  specifications: ProductSpecifications;
  thumbnail_url: string;
  video_url?: string;
  badge?: string | null;
  markets?: Locale[];
  created_at: ISODateString;
  updated_at: ISODateString;
  created_by: string;
};

export type ImageBlockData = {
  images: string[];
  caption?: string;
  layout?: "default" | "grid" | "carousel" | "single";
};

export type TextBlockData = {
  title?: string;
  content: string;
  align?: "left" | "center" | "right";
};

export type VideoBlockData = {
  video_url: string;
  title?: string;
  description?: string;
};

export type HtmlBlockData = {
  html: string;
  css_class?: string;
};

export type Model3dBlockData = {
  file_url: string;
  background?: string;
  scale?: number;
};

type ProductBlockBase = {
  id: string;
  product_id: string;
  order: number;
  created_by: string;
  created_at: ISODateString;
  updated_at: ISODateString;
};

export type ProductBlock =
  | (ProductBlockBase & { type: "IMAGE"; data: ImageBlockData })
  | (ProductBlockBase & { type: "TEXT"; data: TextBlockData })
  | (ProductBlockBase & { type: "VIDEO"; data: VideoBlockData })
  | (ProductBlockBase & { type: "HTML"; data: HtmlBlockData })
  | (ProductBlockBase & { type: "MODEL3D"; data: Model3dBlockData });

export type ProductFile = {
  id: string;
  product_id: string;
  file_url: string;
  type: ProductFileType;
  version: number;
  is_active: boolean;
  name?: string;
  fileSize?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
};

export type ProductDetailPayload = {
  product: Product;
  blocks: ProductBlock[];
  files: ProductFile[];
  category: Category;
  subcategory?: Subcategory;
  relatedProducts: ProductCardItem[];
};

export type ProductCardItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  spec: string;
  badge?: string | null;
  img: string;
  href: string;
  status: ProductStatus;
};

export type CatalogPagePayload = {
  heroLabel: string;
  heroTitle: string;
  heroImage: string;
  heroImageAlt: string;
  heroWatermark: string;
};

export type HeroBannerSlide = {
  id: string;
  desktopImage: string;
  mobileImage?: string;
  alt?: string;
  href?: string;
  label?: string;
  title?: string;
};

export type FAQItem = {
  id: string;
  q: string;
  a: string;
};

export type FeaturedTab = {
  id: string;
  label: string;
  categorySlug?: string;
};

export type SocialMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";

export type SocialMediaPost = {
  id: string;
  caption: string;
  media_type: SocialMediaType;
  media_url: string;
  permalink: string;
  timestamp: ISODateString;
  username: string;
  opacity?: number;
};

export type SocialFeedSection = {
  handle: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  posts: SocialMediaPost[];
};

export type TimelineEvent = {
  id: string;
  year: number;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
};

export type AboutValue = {
  id: string;
  icon: "zap" | "shield-check" | "rocket";
  title: string;
  description: string;
};

export type AboutBase = {
  id: string;
  title: string;
  description: string;
};

export type CompanyStat = {
  value: string;
  label: string;
};

export type SiteHomePayload = {
  hero: HeroBannerSlide[];
  featuredProducts: ProductCardItem[];
  spotlightProduct: ProductCardItem;
  featuredTabs: FeaturedTab[];
  featured: {
    label: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
  };
  history: {
    label: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
    stats: CompanyStat[];
  };
  faq: FAQItem[];
  faqSection: {
    label: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  social: SocialFeedSection;
};

export type SiteAboutPayload = {
  hero: {
    label: string;
    title: string;
    image: string;
    imageAlt: string;
  };
  stats: CompanyStat[];
  milestones: string[];
  quality: {
    label: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  values: AboutValue[];
  bases: AboutBase[];
  timeline: TimelineEvent[];
  jobsCta: {
    label: string;
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
    image: string;
    imageAlt: string;
  };
  social: SocialFeedSection;
};

export type SupportCard = {
  id: string;
  title: string;
  description: string;
  cta: string;
};

export type SupportContactInfo = {
  phone: string;
  email: string;
  whatsapp: string;
};

export type ServiceCenter = {
  id: string;
  name: string;
  address: string;
  phone: string;
  phone2?: string;
};

export type DocumentationCategory = {
  id: string;
  label: string;
};

export type SupportPayload = {
  hero: {
    label: string;
    title: string;
    description: string;
    image: string;
    watermarkText: string;
  };
  cards: SupportCard[];
  documentationFiles: ProductFile[];
  documentationCategories?: DocumentationCategory[];
  contact: {
    label: string;
    title: string;
    description: string;
  };
  contactInfo?: SupportContactInfo;
  serviceCenters?: ServiceCenter[];
  faq: {
    label: string;
    title: string;
    items: FAQItem[];
    supportButtonLabel: string;
  };
  mapImage: string;
};

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  variation?: string;
};

export type AdminActivity = {
  id: string;
  title: string;
  description: string;
  timestamp: ISODateString;
};

export type AdminDashboardPayload = {
  title: string;
  subtitle: string;
  metrics: DashboardMetric[];
  recentActivities: AdminActivity[];
};

export type CmsProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: ProductStatus;
  updated_at: ISODateString;
};

export type CmsProductsPayload = {
  title: string;
  subtitle: string;
  items: CmsProductRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type CatalogProductsQuery = {
  q?: string;
  category?: string;
  status?: ProductStatus | "ALL";
  page?: number;
  pageSize?: number;
  locale?: string;
};

export type CmsProductsQuery = {
  q?: string;
  status?: ProductStatus | "ALL";
  page?: number;
  pageSize?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
  };
};

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
  last_login?: ISODateString;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthPayload = {
  token: string;
  user: Pick<AdminUser, "id" | "name" | "email" | "role">;
  expires_at: ISODateString;
};

export type AdminUsersPayload = {
  items: AdminUser[];
  total: number;
};

export type CreateAdminUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UpdateAdminUserInput = {
  name?: string;
  role?: UserRole;
  is_active?: boolean;
};
