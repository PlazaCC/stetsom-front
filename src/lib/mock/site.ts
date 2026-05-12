import type {
  AboutBase,
  AboutValue,
  FAQItem,
  HeroBannerSlide,
  SiteAboutPayload,
  SiteHomePayload,
  SocialFeedSection,
  TimelineEvent,
} from '@/lib/api/contracts'

const FIGMA_SITE_ASSETS = {
  homeHeroPrimaryDesktop: '/figma-assets/raw/fill_5JQEZY_e95c6db4.png',
  homeHeroPrimaryMobile: '/figma-assets/raw/fill_8T5TD1_7ad629bc.png',
  homeHeroSecondaryDesktop: '/figma-assets/raw/fill_XD4G8T_b3596ec5.png',
  homeHeroSecondaryMobile: '/figma-assets/raw/fill_3OI1TK_c5edb822.png',
  homeHeroTertiaryDesktop: '/figma-assets/raw/fill_OJJ5Q1_b3596ec5.png',
  homeHeroTertiaryMobile: '/figma-assets/raw/fill_DNYKPI_76d259b6.png',
  homeHistoryImage: '/figma-assets/raw/fill_VKSC1W_c8a0de37.png',
  socialOne: '/figma-assets/raw/fill_SXY62B_51d05531.png',
  socialTwo: '/figma-assets/raw/fill_VC6PCG_79e9d64e.png',
  socialThree: '/figma-assets/raw/fill_KULSWW_74ec6dcf.png',
  socialFour: '/figma-assets/raw/fill_DNYKPI_76d259b6.png',
  socialFive: '/figma-assets/raw/fill_3OI1TK_c5edb822.png',
  aboutHero: '/figma-assets/raw/fill_TZ5X2T_f271b766.png',
  aboutQuality: '/figma-assets/raw/fill_C4OUE1_1e666beb.png',
  aboutJobs: '/figma-assets/raw/fill_RHRVZZ_ffc7fd09.png',
  timeline1989: '/figma-assets/raw/fill_YKBFZV_e95c6db4.png',
  timeline1999: '/figma-assets/raw/fill_4ZTOB5_bf27a878.png',
  timeline2007: '/figma-assets/raw/fill_DMAWF3_a4b5ab27.png',
  timeline2014: '/figma-assets/raw/fill_RA4PPD_8b0b4189.png',
  timeline2026: '/figma-assets/raw/fill_C4OUE1_1e666beb.png',
} as const

export const HOME_HERO_SLIDES: HeroBannerSlide[] = [
  {
    id: 'hero-1',
    desktopImage: FIGMA_SITE_ASSETS.homeHeroPrimaryDesktop,
    mobileImage: FIGMA_SITE_ASSETS.homeHeroPrimaryMobile,
    alt: 'Catalogo Stetsom',
    href: '/produtos',
    label: 'Potencia Sem Limites',
    title: 'CATALOGO STETSOM',
  },
  {
    id: 'hero-2',
    desktopImage: FIGMA_SITE_ASSETS.homeHeroSecondaryDesktop,
    mobileImage: FIGMA_SITE_ASSETS.homeHeroSecondaryMobile,
    alt: 'Historia Stetsom',
    href: '/sobre',
    label: 'Desde 1989',
    title: 'NOSSA HISTORIA',
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

export const HOME_NOVIDADES_TABS = ['Todos', 'Amplificadores', 'Processadores', 'Subwoofers']

export const HOME_NOVIDADES_SECTION: SiteHomePayload['novidades'] = {
  label: 'Novidades',
  title: 'CONHECA A\nPRATICIDADE',
  ctaLabel: 'Ver todos',
  ctaHref: '/produtos',
}

export const HOME_HISTORY_SECTION: SiteHomePayload['history'] = {
  label: 'Nossa Historia',
  title: 'CONSTRUINDO\nCOM PROPOSITO',
  subtitle:
    'Ha mais de 35 anos desenvolvemos tecnologia de amplificacao que define o padrao de qualidade no mercado automotivo. Cada produto e projetado para quem leva o som a serio.',
  image: FIGMA_SITE_ASSETS.homeHistoryImage,
  imageAlt: 'Nossa historia',
  ctaLabel: 'Conheca mais',
  ctaHref: '/sobre',
}

export const HOME_FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Qual a diferenca entre 1 Ohm e 2 Ohms de impedancia?',
    a: 'A impedancia afeta diretamente a carga sobre o amplificador. Impedancias menores permitem maior potencia, desde que o sistema seja compativel.',
  },
  {
    q: 'Como verificar a garantia do meu produto?',
    a: 'Acesse a central de garantia da Stetsom e informe o numero de serie para consultar o status atualizado.',
  },
  {
    q: 'Onde encontrar postos autorizados Stetsom?',
    a: 'Nossa rede tem mais de 500 distribuidores no Brasil. Use o localizador da Central de Ajuda para encontrar o mais proximo.',
  },
]

export const HOME_FAQ_SECTION: SiteHomePayload['faqSection'] = {
  label: 'Duvidas',
  title: 'PERGUNTAS\nFREQUENTES',
  subtitle: 'Nao encontrou o que procura? Entre em contato com nosso suporte.',
  ctaLabel: 'Falar com suporte',
  ctaHref: '/suporte',
}

export const SITE_SOCIAL_SECTION: SocialFeedSection = {
  handle: '@stetsombrasil',
  title: 'MIDIAS SOCIAIS',
  subtitle: 'Participe da comunidade de profissionais do audio.',
  ctaLabel: 'Seguir no instagram',
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
    title: 'Potencia',
    description: 'Quando se fala em STETSOM, logo associamos ao slogan da marca: potencia sem limites.',
  },
  {
    id: 'value-qualidade',
    icon: 'shield-check',
    title: 'Qualidade',
    description: 'Desde 1989 fazemos o melhor para fazer sempre. Esse e o nosso lema.',
  },
  {
    id: 'value-inovacao',
    icon: 'rocket',
    title: 'Inovacao',
    description: 'Projetados para serem objetos de desejo, os produtos STETSOM ocupam lugar de destaque.',
  },
]

export const ABOUT_BASES: AboutBase[] = [
  {
    id: 'base-excelencia',
    title: 'Excelencia Tecnica',
    description:
      'Cuidado extremo no design e fabricacao de cada produto, com validacao rigorosa de performance e durabilidade.',
  },
  {
    id: 'base-compromisso',
    title: 'Compromisso com o Cliente',
    description:
      'Cada cliente e unico. Em um mercado competitivo, escutar e evoluir com o cliente e parte do nosso DNA.',
  },
  {
    id: 'base-inovacao',
    title: 'Inovacao Continua',
    description:
      'P&D constante para desenvolver solucoes que surpreendem e sustentam nossa lideranca em amplificacao automotiva.',
  },
]

export const ABOUT_HERO_SECTION: SiteAboutPayload['hero'] = {
  label: 'Quem Somos',
  title: 'SOBRE A\nSTETSOM',
  image: FIGMA_SITE_ASSETS.aboutHero,
  imageAlt: 'Sobre a Stetsom',
}

export const ABOUT_QUALITY_SECTION: SiteAboutPayload['quality'] = {
  label: 'Sobre Nos',
  title: 'QUALIDADE INOVADORA',
  description:
    'A inovacao recorre da nossa sede pois sem um diferencial o mercado nao existe. Ao longo de tres decadas, construimos uma reputacao solida no Brasil e no mundo.',
  image: FIGMA_SITE_ASSETS.aboutQuality,
  imageAlt: 'Qualidade inovadora',
}

export const ABOUT_TIMELINE: TimelineEvent[] = [
  {
    id: '1989',
    year: 1989,
    title: 'Fundacao',
    shortTitle: 'Inicio',
    description: 'A Stetsom nasce com foco em amplificacao automotiva e qualidade de engenharia.',
    image: FIGMA_SITE_ASSETS.timeline1989,
  },
  {
    id: '1999',
    year: 1999,
    title: 'Linha CL',
    shortTitle: 'Linha CL',
    description: 'A linha CL fortalece a marca entre instaladores e profissionais de audio em todo o Brasil.',
    image: FIGMA_SITE_ASSETS.timeline1999,
  },
  {
    id: '2007',
    year: 2007,
    title: 'Referencia de Mercado',
    shortTitle: 'Destaque',
    description: 'Consolidacao em potencia e confiabilidade, com produtos de grande impacto comercial.',
    image: FIGMA_SITE_ASSETS.timeline2007,
  },
  {
    id: '2014',
    year: 2014,
    title: 'Expansao Internacional',
    shortTitle: 'Exportacao',
    description: 'A operacao avanca para dezenas de paises, com padroes de qualidade e suporte tecnico.',
    image: FIGMA_SITE_ASSETS.timeline2014,
  },
  {
    id: '2026',
    year: 2026,
    title: 'Era Digital',
    shortTitle: 'CMS',
    description: 'Nova fase digital com foco em experiencia omnichannel para distribuidores e consumidores.',
    image: FIGMA_SITE_ASSETS.timeline2026,
  },
]

export const ABOUT_JOBS_CTA_SECTION: SiteAboutPayload['jobsCta'] = {
  label: 'Trabalhe Conosco',
  title: 'VENHA FAZER PARTE DA STETSOM',
  description:
    'Buscamos profissionais apaixonados que compartilham nossa visao de inovacao e excelencia. Se voce esta pronto para fazer parte de um time que cria produtos que transformam experiencias de audio, venha nos conhecer.',
  buttonLabel: 'Ver Vagas no LinkedIn',
  buttonHref: 'https://www.linkedin.com/company/stetsom/jobs/',
  image: FIGMA_SITE_ASSETS.aboutJobs,
  imageAlt: 'Trabalhe Conosco',
}

export const MILESTONE_PATTERN = ['POTENCIA', 'QUALIDADE', 'INOVACAO', 'FEITO NO BRASIL', 'DESDE 1989']

export const SITE_ABOUT_PAYLOAD_BASE: Omit<SiteAboutPayload, 'social'> = {
  hero: ABOUT_HERO_SECTION,
  milestones: MILESTONE_PATTERN,
  quality: ABOUT_QUALITY_SECTION,
  values: ABOUT_VALUES,
  bases: ABOUT_BASES,
  timeline: ABOUT_TIMELINE,
  jobsCta: ABOUT_JOBS_CTA_SECTION,
}
