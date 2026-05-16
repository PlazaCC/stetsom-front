import type {
  AboutBase,
  AboutValue,
  CompanyStat,
  FAQItem,
  HeroBannerSlide,
  SiteAboutPayload,
  SiteHomePayload,
  SocialFeedSection,
  TimelineEvent,
} from '@/lib/api/contracts'

const FIGMA_SITE_ASSETS = {
  // Hero carousel — Figma tem 1 slide design; todos compartilham o mesmo background
  homeHeroPrimaryDesktop: '/figma-assets/raw/fill_5JQEZY_e95c6db4.png',
  homeHeroPrimaryMobile: '/figma-assets/raw/fill_8T5TD1_7ad629bc.png',
  homeHeroSecondaryDesktop: '/figma-assets/raw/fill_5JQEZY_e95c6db4.png',
  homeHeroSecondaryMobile: '/figma-assets/raw/fill_5JQEZY_e95c6db4.png',
  homeHeroTertiaryDesktop: '/figma-assets/raw/fill_5JQEZY_e95c6db4.png',
  homeHeroTertiaryMobile: '/figma-assets/raw/fill_5JQEZY_e95c6db4.png',
  homeHistoryImage: '/figma-assets/raw/home-history.png',
  // Social feed — imageRefs confirmados via MCP: post 1/4/5 compartilham, 2 e 3 únicos
  socialOne: '/figma-assets/raw/social-a.png',
  socialTwo: '/figma-assets/raw/fill_VC6PCG_79e9d64e.png',
  socialThree: '/figma-assets/raw/social-b.png',
  socialFour: '/figma-assets/raw/social-a.png',
  socialFive: '/figma-assets/raw/social-a.png',
  aboutHero: '/figma-assets/raw/fill_TZ5X2T_f271b766.png',
  aboutQuality: '/figma-assets/raw/fill_C4OUE1_1e666beb.png',
  aboutJobs: '/figma-assets/raw/fill_RHRVZZ_ffc7fd09.png',
  // Timeline — anos confirmados via MCP node 1071:11522
  timeline1989: '/figma-assets/raw/fill_YKBFZV_e95c6db4.png',
  timeline1999: '/figma-assets/raw/fill_4ZTOB5_bf27a878.png',
  timeline2002: '/figma-assets/raw/fill_DMAWF3_a4b5ab27.png',
  timeline2007: '/figma-assets/raw/fill_RA4PPD_8b0b4189.png',
  timeline2014: '/figma-assets/raw/fill_C4OUE1_1e666beb.png',
} as const

export const HOME_HERO_SLIDES: HeroBannerSlide[] = [
  {
    id: 'hero-1',
    desktopImage: FIGMA_SITE_ASSETS.homeHeroPrimaryDesktop,
    mobileImage: FIGMA_SITE_ASSETS.homeHeroPrimaryMobile,
    alt: 'Sinta o verdadeiro poder do grave',
    href: '/produtos',
    label: 'Stetsom Digital Bass',
    title: 'SINTA O VERDADEIRO\nPODER DO GRAVE',
  },
  {
    id: 'hero-2',
    desktopImage: FIGMA_SITE_ASSETS.homeHeroSecondaryDesktop,
    mobileImage: FIGMA_SITE_ASSETS.homeHeroSecondaryMobile,
    alt: 'História Stetsom',
    href: '/sobre',
    label: 'Desde 1989',
    title: 'NOSSA HISTÓRIA',
  },
  {
    id: 'hero-3',
    desktopImage: FIGMA_SITE_ASSETS.homeHeroTertiaryDesktop,
    mobileImage: FIGMA_SITE_ASSETS.homeHeroTertiaryMobile,
    alt: 'Comunidade Stetsom',
    href: '/suporte',
    label: 'Suporte Oficial',
    title: 'COMUNIDADE STETSOM',
  },
]

export const HOME_FEATURED_TABS = ['Todos', 'Amplificadores', 'Processadores', 'Subwoofers']

export const HOME_FEATURED_SECTION: SiteHomePayload['featured'] = {
  label: 'Novidades',
  title: 'CONHEÇA A\nPRATICIDADE',
  ctaLabel: 'Ver todos',
  ctaHref: '/produtos',
}

export const COMPANY_STATS: CompanyStat[] = [
  { value: '35+', label: 'Anos de Mercado' },
  { value: '200+', label: 'Produtos' },
  { value: '60+', label: 'Países de Exportação' },
  { value: '1M+', label: 'Unidades Vendidas' },
]

export const HOME_HISTORY_SECTION: SiteHomePayload['history'] = {
  label: 'Nossa História',
  title: 'CONSTRUINDO\nCOM PROPÓSITO',
  subtitle:
    'Há mais de 35 anos desenvolvemos tecnologia de amplificação que define o padrão de qualidade no mercado automotivo. Cada produto é projetado para quem leva o som a sério.',
  image: FIGMA_SITE_ASSETS.homeHistoryImage,
  imageAlt: 'Nossa história',
  ctaLabel: 'Conheça mais',
  ctaHref: '/sobre',
  stats: COMPANY_STATS,
}

export const HOME_FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Qual a diferença entre 1 Ohm e 2 Ohms de impedância?',
    a: 'A impedância afeta diretamente a carga sobre o amplificador. Impedâncias menores permitem maior potência, desde que o sistema seja compatível.',
  },
  {
    q: 'Como verificar a garantia do meu produto?',
    a: 'Acesse a central de garantia da Stetsom e informe o número de série para consultar o status atualizado.',
  },
  {
    q: 'Onde encontrar postos autorizados Stetsom?',
    a: 'Nossa rede tem mais de 500 distribuidores no Brasil. Use o localizador da Central de Ajuda para encontrar o mais próximo.',
  },
]

export const HOME_FAQ_SECTION: SiteHomePayload['faqSection'] = {
  label: 'Dúvidas',
  title: 'PERGUNTAS\nFREQUENTES',
  subtitle: 'Não encontrou o que procura? Entre em contato com nosso suporte.',
  ctaLabel: 'Falar com suporte',
  ctaHref: '/suporte',
}

export const SITE_SOCIAL_SECTION: SocialFeedSection = {
  handle: '@stetsombrasil',
  title: 'NOSSA FAMÍLIA',
  subtitle: 'Participe da comunidade de profissionais do som. Veja nossos últimos projetos, eventos e spoilers.',
  ctaLabel: 'Seguir no instagram',
  ctaHref: 'https://instagram.com/stetsombrasil',
  posts: [
    { id: 'social-1', image: FIGMA_SITE_ASSETS.socialOne, href: '#', opacity: 0.82 },
    { id: 'social-2', image: FIGMA_SITE_ASSETS.socialTwo, href: '#', opacity: 0.86 },
    { id: 'social-3', image: FIGMA_SITE_ASSETS.socialThree, href: '#', opacity: 0.9 },
    { id: 'social-4', image: FIGMA_SITE_ASSETS.socialFour, href: '#', opacity: 0.94 },
    { id: 'social-5', image: FIGMA_SITE_ASSETS.socialFive, href: '#', opacity: 0.98 },
  ],
}

export const ABOUT_VALUES: AboutValue[] = [
  {
    id: 'value-potencia',
    icon: 'zap',
    title: 'Potência',
    description:
      'Quando se fala em Stetsom, potência sem limite é nossa assinatura. Cada produto é projetado para entregar mais do que o esperado.',
  },
  {
    id: 'value-qualidade',
    icon: 'shield-check',
    title: 'Qualidade',
    description:
      'Desde 1989 fazemos o melhor para fazer sempre melhor. Componentes de alta eficiência, testes rigorosos e processos certificados.',
  },
  {
    id: 'value-inovacao',
    icon: 'rocket',
    title: 'Inovação',
    description:
      'Projetados para serem objetos de desejo, os produtos Stetsom ocupam lugar de destaque no cenário do som automotivo mundial.',
  },
]

export const ABOUT_BASES: AboutBase[] = [
  {
    id: 'base-excelencia',
    title: 'Excelência Técnica',
    description:
      'Cuidado extremo no design e fabricação de cada produto, com validação rigorosa de performance e durabilidade.',
  },
  {
    id: 'base-compromisso',
    title: 'Compromisso com o Cliente',
    description:
      'Cada cliente é único. Em um mercado competitivo, escutar e evoluir com o cliente é parte do nosso DNA.',
  },
  {
    id: 'base-inovacao',
    title: 'Inovação Contínua',
    description:
      'P&D constante para desenvolver soluções que surpreendem e sustentam nossa liderança em amplificação automotiva.',
  },
]

export const ABOUT_HERO_SECTION: SiteAboutPayload['hero'] = {
  label: 'Nossa história',
  title: 'SEMPRE\nPIONEIRA\nNA POTÊNCIA',
  image: FIGMA_SITE_ASSETS.aboutHero,
  imageAlt: 'Sobre a Stetsom',
}

export const ABOUT_TIMELINE: TimelineEvent[] = [
  {
    id: '1989',
    year: 1989,
    title: 'Fundação',
    shortTitle: 'COMEÇO DA STETSOM',
    description:
      'A Stetsom nasce com foco em amplificação automotiva e qualidade de engenharia, estabelecendo as bases de uma das maiores fabricantes do Brasil.',
    image: FIGMA_SITE_ASSETS.timeline1989,
  },
  {
    id: '1999',
    year: 1999,
    title: 'Linha Booster',
    shortTitle: 'LINHA BOOSTER',
    description:
      'A linha Booster fortalece a marca entre instaladores e profissionais de áudio em todo o Brasil, consolidando o nome Stetsom no mercado automotivo.',
    image: FIGMA_SITE_ASSETS.timeline1999,
  },
  {
    id: '2002',
    year: 2002,
    title: 'Antenas & Crossovers',
    shortTitle: 'ANTENAS & CROSSOVER',
    description:
      'Expansão do portfólio com antenas e crossovers de alta fidelidade. A Stetsom consolida sua posição como fabricante de soluções completas para áudio automotivo, não apenas amplificadores.',
    image: FIGMA_SITE_ASSETS.timeline2002,
  },
  {
    id: '2007',
    year: 2007,
    title: 'Melhor Amplificador do Mundo',
    shortTitle: 'MELHOR AMPLIFICADOR',
    description:
      'Reconhecida internacionalmente, a Stetsom conquista o título de melhor amplificador do mundo, consolidando sua presença global em dezenas de países.',
    image: FIGMA_SITE_ASSETS.timeline2007,
  },
  {
    id: '2014',
    year: 2014,
    title: 'Era Digital',
    shortTitle: 'ERA DIGITAL',
    description:
      'Nova fase digital com foco em experiência omnichannel para distribuidores e consumidores, expandindo o alcance da marca para novas plataformas e canais.',
    image: FIGMA_SITE_ASSETS.timeline2014,
  },
]

export const ABOUT_JOBS_CTA_SECTION: SiteAboutPayload['jobsCta'] = {
  label: 'Trabalhe Conosco',
  title: 'VENHA FAZER PARTE DA STETSOM',
  description:
    'Buscamos profissionais apaixonados que compartilham nossa visão de inovação e excelência. Se você está pronto para fazer parte de um time que cria produtos que transformam experiências de áudio, venha nos conhecer.',
  buttonLabel: 'Ver Vagas no LinkedIn',
  buttonHref: 'https://www.linkedin.com/company/stetsom/jobs/',
  image: FIGMA_SITE_ASSETS.aboutJobs,
  imageAlt: 'Trabalhe Conosco',
}

export const MILESTONE_PATTERN = ['POTÊNCIA', 'QUALIDADE', 'INOVAÇÃO', 'FEITO NO BRASIL', 'DESDE 1989']

export const ABOUT_QUALITY_SECTION: SiteAboutPayload['quality'] = {
  label: 'QUEM SOMOS',
  title: 'QUALIDADE\nINOVADORA',
  description:
    'A Stetsom nasceu da paixão pelo som automotivo de alta performance. Ao longo de mais de três décadas, construímos uma reputação sólida no Brasil e no mundo, desenvolvendo produtos que combinam potência real com tecnologia de ponta.\n\nNosso compromisso é com quem leva o som a sério — desde o instalador profissional até o entusiasta que busca a melhor experiência sonora dentro do carro.',
  image: FIGMA_SITE_ASSETS.aboutQuality,
  imageAlt: 'Qualidade Stetsom',
}

export const SITE_ABOUT_PAYLOAD_BASE: Omit<SiteAboutPayload, 'social'> = {
  hero: ABOUT_HERO_SECTION,
  stats: COMPANY_STATS,
  milestones: MILESTONE_PATTERN,
  quality: ABOUT_QUALITY_SECTION,
  values: ABOUT_VALUES,
  bases: ABOUT_BASES,
  timeline: ABOUT_TIMELINE,
  jobsCta: ABOUT_JOBS_CTA_SECTION,
}
