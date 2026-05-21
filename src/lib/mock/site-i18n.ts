import type {
  AboutBase,
  AboutValue,
  CompanyStat,
  FAQItem,
  FeaturedTab,
  HeroBannerSlide,
  SiteAboutPayload,
  SiteHomePayload,
  SocialFeedSection,
  TimelineEvent,
} from '@/lib/api/contracts';
import {
  ABOUT_HERO_SECTION,
  ABOUT_JOBS_CTA_SECTION,
  ABOUT_QUALITY_SECTION,
  ABOUT_TIMELINE,
  COMPANY_STATS,
  HOME_FAQ_ITEMS,
  HOME_FAQ_SECTION,
  HOME_FEATURED_SECTION,
  HOME_FEATURED_TABS,
  HOME_HERO_SLIDES,
  HOME_HISTORY_SECTION,
  MILESTONE_PATTERN,
  SITE_SOCIAL_SECTION,
  ABOUT_VALUES,
  ABOUT_BASES,
} from './site';

// ─── English ──────────────────────────────────────────────────────────────────

const HOME_HERO_SLIDES_EN: HeroBannerSlide[] = [
  {
    ...HOME_HERO_SLIDES[0],
    alt: 'Feel the true power of bass',
    label: 'Stetsom Digital Bass',
    title: 'FEEL THE TRUE\nPOWER OF BASS',
  },
  {
    ...HOME_HERO_SLIDES[1],
    alt: 'Stetsom History',
    label: 'Since 1989',
    title: 'OUR HISTORY',
  },
  {
    ...HOME_HERO_SLIDES[2],
    alt: 'Stetsom Community',
    label: 'Official Support',
    title: 'STETSOM COMMUNITY',
  },
];

const HOME_FEATURED_TABS_EN: FeaturedTab[] = [
  { id: 'tab-all', label: 'All' },
  {
    id: 'tab-amplificadores',
    label: 'Amplifiers',
    categorySlug: 'amplificadores',
  },
  {
    id: 'tab-processadores',
    label: 'Processors',
    categorySlug: 'processadores',
  },
  { id: 'tab-subwoofers', label: 'Subwoofers', categorySlug: 'subwoofers' },
];

const HOME_FEATURED_SECTION_EN: SiteHomePayload['featured'] = {
  label: 'New arrivals',
  title: 'DISCOVER THE\nPRACTICALITY',
  ctaLabel: 'See all',
  ctaHref: HOME_FEATURED_SECTION.ctaHref,
};

const COMPANY_STATS_EN: CompanyStat[] = [
  { value: '35+', label: 'Years in Business' },
  { value: '200+', label: 'Products' },
  { value: '60+', label: 'Export Countries' },
  { value: '1M+', label: 'Units Sold' },
];

const HOME_HISTORY_SECTION_EN: SiteHomePayload['history'] = {
  label: 'Our History',
  title: 'BUILDING\nWITH PURPOSE',
  subtitle:
    'For over 35 years we have been developing amplification technology that sets the quality standard in the automotive market. Every product is designed for those who take sound seriously.',
  image: HOME_HISTORY_SECTION.image,
  imageAlt: 'Our history',
  ctaLabel: 'Learn more',
  ctaHref: HOME_HISTORY_SECTION.ctaHref,
  stats: COMPANY_STATS_EN,
};

const HOME_FAQ_ITEMS_EN: FAQItem[] = [
  {
    id: 'home-faq-impedancia',
    q: 'What is the difference between 1 Ohm and 2 Ohms impedance?',
    a: 'Impedance directly affects the load on the amplifier. Lower impedances allow higher power output, as long as the system is compatible.',
  },
  {
    id: 'home-faq-garantia',
    q: 'How do I check my product warranty?',
    a: "Access Stetsom's warranty center and enter the serial number to check the current status.",
  },
  {
    id: 'home-faq-postos',
    q: 'Where can I find authorized Stetsom service centers?',
    a: 'Our network has over 500 distributors in Brazil. Use the locator in the Help Center to find the nearest one.',
  },
];

const HOME_FAQ_SECTION_EN: SiteHomePayload['faqSection'] = {
  label: 'FAQ',
  title: 'FREQUENTLY\nASKED QUESTIONS',
  subtitle: "Didn't find what you're looking for? Contact our support team.",
  ctaLabel: 'Talk to support',
  ctaHref: HOME_FAQ_SECTION.ctaHref,
};

const SITE_SOCIAL_SECTION_EN: SocialFeedSection = {
  ...SITE_SOCIAL_SECTION,
  title: 'SOCIAL MEDIA',
  subtitle: 'Join the community of audio professionals.',
  ctaLabel: 'Follow on Instagram',
  posts: [
    {
      ...SITE_SOCIAL_SECTION.posts[0],
      caption: 'Premium install with the Stetsom Digital Bass line.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[1],
      caption: 'Finished build with power and flawless fit.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[2],
      caption: 'Extreme bass setup for car audio competitions.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[3],
      caption: 'Event highlights with the Stetsom community.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[4],
      caption: 'Sneak peek of the new line with aggressive design.',
    },
  ],
};

// About EN
const ABOUT_HERO_SECTION_EN: SiteAboutPayload['hero'] = {
  ...ABOUT_HERO_SECTION,
  label: 'Our history',
  title: 'ALWAYS\nPIONEERING\nPOWER',
  imageAlt: 'About Stetsom',
};

const ABOUT_QUALITY_SECTION_EN: SiteAboutPayload['quality'] = {
  ...ABOUT_QUALITY_SECTION,
  label: 'WHO WE ARE',
  title: 'INNOVATIVE\nQUALITY',
  description:
    'Stetsom was born from a passion for high-performance automotive audio. Over more than three decades, we built a solid reputation in Brazil and around the world, developing products that combine real power with cutting-edge technology.\n\nOur commitment is to those who take sound seriously — from the professional installer to the enthusiast seeking the best in-car audio experience.',
  imageAlt: 'Stetsom Quality',
};

const ABOUT_VALUES_EN: AboutValue[] = [
  {
    id: 'value-potencia',
    icon: 'zap',
    title: 'Power',
    description:
      'When it comes to Stetsom, unlimited power is our signature. Every product is designed to deliver more than expected.',
  },
  {
    id: 'value-qualidade',
    icon: 'shield-check',
    title: 'Quality',
    description:
      'Since 1989 we do our best to always do better. High-efficiency components, rigorous testing and certified processes.',
  },
  {
    id: 'value-inovacao',
    icon: 'rocket',
    title: 'Innovation',
    description:
      'Designed to be objects of desire, Stetsom products hold a prominent place in the global automotive audio scene.',
  },
];

const ABOUT_BASES_EN: AboutBase[] = [
  {
    id: 'base-excelencia',
    title: 'Technical Excellence',
    description:
      'Extreme care in the design and manufacture of each product, with rigorous performance and durability validation.',
  },
  {
    id: 'base-compromisso',
    title: 'Customer Commitment',
    description:
      'Every customer is unique. In a competitive market, listening and evolving with the customer is part of our DNA.',
  },
  {
    id: 'base-inovacao',
    title: 'Continuous Innovation',
    description:
      'Constant R&D to develop solutions that surprise and sustain our leadership in automotive amplification.',
  },
];

const ABOUT_TIMELINE_EN: TimelineEvent[] = [
  {
    ...ABOUT_TIMELINE[0],
    title: 'Foundation',
    shortTitle: 'STETSOM BEGINS',
    description:
      "Stetsom is born with a focus on automotive amplification and engineering quality, laying the foundations of one of Brazil's largest manufacturers.",
  },
  {
    ...ABOUT_TIMELINE[1],
    title: 'Booster Line',
    shortTitle: 'BOOSTER LINE',
    description:
      'The Booster line strengthens the brand among installers and audio professionals across Brazil, consolidating the Stetsom name in the automotive market.',
  },
  {
    ...ABOUT_TIMELINE[2],
    title: 'Antennas & Crossovers',
    shortTitle: 'ANTENNAS & CROSSOVER',
    description:
      'Portfolio expansion with high-fidelity antennas and crossovers. Stetsom consolidates its position as a manufacturer of complete automotive audio solutions, not just amplifiers.',
  },
  {
    ...ABOUT_TIMELINE[3],
    title: "World's Best Amplifier",
    shortTitle: 'BEST AMPLIFIER',
    description:
      "Internationally recognized, Stetsom wins the title of the world's best amplifier, consolidating its global presence in dozens of countries.",
  },
  {
    ...ABOUT_TIMELINE[4],
    title: 'Digital Era',
    shortTitle: 'DIGITAL ERA',
    description:
      "New digital phase focused on omnichannel experience for distributors and consumers, expanding the brand's reach to new platforms and channels.",
  },
];

const ABOUT_JOBS_CTA_EN: SiteAboutPayload['jobsCta'] = {
  ...ABOUT_JOBS_CTA_SECTION,
  label: 'Work With Us',
  title: 'COME BE PART OF STETSOM',
  description:
    'We are looking for passionate professionals who share our vision of innovation and excellence. If you are ready to be part of a team that creates products that transform audio experiences, come meet us.',
  buttonLabel: 'View Jobs on LinkedIn',
  imageAlt: 'Work With Us',
};

const MILESTONE_PATTERN_EN = [
  'POWER',
  'QUALITY',
  'INNOVATION',
  'MADE IN BRAZIL',
  'SINCE 1989',
];

const COMPANY_STATS_EN_ABOUT: CompanyStat[] = COMPANY_STATS_EN;

// ─── Spanish ──────────────────────────────────────────────────────────────────

const HOME_HERO_SLIDES_ES: HeroBannerSlide[] = [
  {
    ...HOME_HERO_SLIDES[0],
    alt: 'Siente el verdadero poder del bajo',
    label: 'Stetsom Digital Bass',
    title: 'SIENTE EL VERDADERO\nPODER DEL BAJO',
  },
  {
    ...HOME_HERO_SLIDES[1],
    alt: 'Historia Stetsom',
    label: 'Desde 1989',
    title: 'NUESTRA HISTORIA',
  },
  {
    ...HOME_HERO_SLIDES[2],
    alt: 'Comunidad Stetsom',
    label: 'Soporte Oficial',
    title: 'COMUNIDAD STETSOM',
  },
];

const HOME_FEATURED_TABS_ES: FeaturedTab[] = [
  { id: 'tab-all', label: 'Todos' },
  {
    id: 'tab-amplificadores',
    label: 'Amplificadores',
    categorySlug: 'amplificadores',
  },
  {
    id: 'tab-processadores',
    label: 'Procesadores',
    categorySlug: 'processadores',
  },
  { id: 'tab-subwoofers', label: 'Subwoofers', categorySlug: 'subwoofers' },
];

const HOME_FEATURED_SECTION_ES: SiteHomePayload['featured'] = {
  label: 'Novedades',
  title: 'DESCUBRE LA\nPRACTICIDAD',
  ctaLabel: 'Ver todos',
  ctaHref: HOME_FEATURED_SECTION.ctaHref,
};

const COMPANY_STATS_ES: CompanyStat[] = [
  { value: '35+', label: 'Años de mercado' },
  { value: '200+', label: 'Productos' },
  { value: '60+', label: 'Países de exportación' },
  { value: '1M+', label: 'Unidades vendidas' },
];

const HOME_HISTORY_SECTION_ES: SiteHomePayload['history'] = {
  label: 'Nuestra Historia',
  title: 'CONSTRUYENDO\nCON PROPÓSITO',
  subtitle:
    'Durante más de 35 años hemos desarrollado tecnología de amplificación que define el estándar de calidad en el mercado automotivo. Cada producto está diseñado para quienes se toman el sonido en serio.',
  image: HOME_HISTORY_SECTION.image,
  imageAlt: 'Nuestra historia',
  ctaLabel: 'Conocer más',
  ctaHref: HOME_HISTORY_SECTION.ctaHref,
  stats: COMPANY_STATS_ES,
};

const HOME_FAQ_ITEMS_ES: FAQItem[] = [
  {
    id: 'home-faq-impedancia',
    q: '¿Cuál es la diferencia entre 1 Ohm y 2 Ohms de impedancia?',
    a: 'La impedancia afecta directamente la carga sobre el amplificador. Impedancias menores permiten mayor potencia, siempre que el sistema sea compatible.',
  },
  {
    id: 'home-faq-garantia',
    q: '¿Cómo verifico la garantía de mi producto?',
    a: 'Acceda al centro de garantía de Stetsom e ingrese el número de serie para consultar el estado actualizado.',
  },
  {
    id: 'home-faq-postos',
    q: '¿Dónde encontrar centros autorizados Stetsom?',
    a: 'Nuestra red tiene más de 500 distribuidores en Brasil. Use el localizador en la Central de Ayuda para encontrar el más cercano.',
  },
];

const HOME_FAQ_SECTION_ES: SiteHomePayload['faqSection'] = {
  label: 'Preguntas',
  title: 'PREGUNTAS\nFRECUENTES',
  subtitle:
    '¿No encontró lo que busca? Póngase en contacto con nuestro soporte.',
  ctaLabel: 'Hablar con soporte',
  ctaHref: HOME_FAQ_SECTION.ctaHref,
};

const SITE_SOCIAL_SECTION_ES: SocialFeedSection = {
  ...SITE_SOCIAL_SECTION,
  title: 'REDES SOCIALES',
  subtitle: 'Únase a la comunidad de profesionales del audio.',
  ctaLabel: 'Seguir en Instagram',
  posts: [
    {
      ...SITE_SOCIAL_SECTION.posts[0],
      caption: 'Instalacion premium con la linea Stetsom Digital Bass.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[1],
      caption: 'Proyecto finalizado con potencia y acabado impecable.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[2],
      caption:
        'Setup de graves extremos para competencias de audio automotivo.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[3],
      caption: 'Momentos del evento con la comunidad Stetsom.',
    },
    {
      ...SITE_SOCIAL_SECTION.posts[4],
      caption: 'Adelanto de la nueva linea con diseno agresivo.',
    },
  ],
};

// About ES
const ABOUT_HERO_SECTION_ES: SiteAboutPayload['hero'] = {
  ...ABOUT_HERO_SECTION,
  label: 'Nuestra historia',
  title: 'SIEMPRE\nPIONERA\nEN POTENCIA',
  imageAlt: 'Sobre Stetsom',
};

const ABOUT_QUALITY_SECTION_ES: SiteAboutPayload['quality'] = {
  ...ABOUT_QUALITY_SECTION,
  label: 'QUIÉNES SOMOS',
  title: 'CALIDAD\nINNOVADORA',
  description:
    'Stetsom nació de la pasión por el audio automotivo de alto rendimiento. A lo largo de más de tres décadas, construimos una sólida reputación en Brasil y en el mundo, desarrollando productos que combinan potencia real con tecnología de punta.\n\nNuestro compromiso es con quienes se toman el sonido en serio — desde el instalador profesional hasta el entusiasta que busca la mejor experiencia de audio dentro del automóvil.',
  imageAlt: 'Calidad Stetsom',
};

const ABOUT_VALUES_ES: AboutValue[] = [
  {
    id: 'value-potencia',
    icon: 'zap',
    title: 'Potencia',
    description:
      'Cuando se habla de Stetsom, la potencia sin límite es nuestra firma. Cada producto está diseñado para entregar más de lo esperado.',
  },
  {
    id: 'value-qualidade',
    icon: 'shield-check',
    title: 'Calidad',
    description:
      'Desde 1989 hacemos lo mejor para siempre mejorar. Componentes de alta eficiencia, pruebas rigurosas y procesos certificados.',
  },
  {
    id: 'value-inovacao',
    icon: 'rocket',
    title: 'Innovación',
    description:
      'Diseñados para ser objetos de deseo, los productos Stetsom ocupan un lugar destacado en la escena del audio automotivo mundial.',
  },
];

const ABOUT_BASES_ES: AboutBase[] = [
  {
    id: 'base-excelencia',
    title: 'Excelencia Técnica',
    description:
      'Cuidado extremo en el diseño y fabricación de cada producto, con validación rigurosa de rendimiento y durabilidad.',
  },
  {
    id: 'base-compromisso',
    title: 'Compromiso con el Cliente',
    description:
      'Cada cliente es único. En un mercado competitivo, escuchar y evolucionar con el cliente es parte de nuestro ADN.',
  },
  {
    id: 'base-inovacao',
    title: 'Innovación Continua',
    description:
      'I+D constante para desarrollar soluciones que sorprenden y sostienen nuestro liderazgo en amplificación automotiva.',
  },
];

const ABOUT_TIMELINE_ES: TimelineEvent[] = [
  {
    ...ABOUT_TIMELINE[0],
    title: 'Fundación',
    shortTitle: 'COMIENZO DE STETSOM',
    description:
      'Stetsom nace con foco en amplificación automotiva y calidad de ingeniería, estableciendo las bases de uno de los mayores fabricantes de Brasil.',
  },
  {
    ...ABOUT_TIMELINE[1],
    title: 'Línea Booster',
    shortTitle: 'LÍNEA BOOSTER',
    description:
      'La línea Booster fortalece la marca entre instaladores y profesionales de audio en todo Brasil, consolidando el nombre Stetsom en el mercado automotivo.',
  },
  {
    ...ABOUT_TIMELINE[2],
    title: 'Antenas y Crossovers',
    shortTitle: 'ANTENAS Y CROSSOVER',
    description:
      'Expansión del portafolio con antenas y crossovers de alta fidelidad. Stetsom consolida su posición como fabricante de soluciones completas para audio automotivo.',
  },
  {
    ...ABOUT_TIMELINE[3],
    title: 'Mejor Amplificador del Mundo',
    shortTitle: 'MEJOR AMPLIFICADOR',
    description:
      'Reconocida internacionalmente, Stetsom conquista el título de mejor amplificador del mundo, consolidando su presencia global en decenas de países.',
  },
  {
    ...ABOUT_TIMELINE[4],
    title: 'Era Digital',
    shortTitle: 'ERA DIGITAL',
    description:
      'Nueva fase digital con foco en experiencia omnicanal para distribuidores y consumidores, expandiendo el alcance de la marca a nuevas plataformas y canales.',
  },
];

const ABOUT_JOBS_CTA_ES: SiteAboutPayload['jobsCta'] = {
  ...ABOUT_JOBS_CTA_SECTION,
  label: 'Trabaje con Nosotros',
  title: 'VEN A SER PARTE DE STETSOM',
  description:
    'Buscamos profesionales apasionados que compartan nuestra visión de innovación y excelencia. Si está listo para ser parte de un equipo que crea productos que transforman experiencias de audio, venga a conocernos.',
  buttonLabel: 'Ver vacantes en LinkedIn',
  imageAlt: 'Trabaje con Nosotros',
};

const MILESTONE_PATTERN_ES = [
  'POTENCIA',
  'CALIDAD',
  'INNOVACIÓN',
  'HECHO EN BRASIL',
  'DESDE 1989',
];

// ─── Locale selectors ─────────────────────────────────────────────────────────

type LocaleContentMap<T> = { 'pt-BR': T; en: T; es: T };

function selectLocale<T>(
  map: LocaleContentMap<T>,
  locale: string | undefined,
): T {
  if (locale === 'en') return map.en;
  if (locale === 'es') return map.es;
  return map['pt-BR'];
}

export function getHomeHeroSlides(locale?: string): HeroBannerSlide[] {
  return selectLocale(
    {
      'pt-BR': HOME_HERO_SLIDES,
      en: HOME_HERO_SLIDES_EN,
      es: HOME_HERO_SLIDES_ES,
    },
    locale,
  );
}

export function getHomeFeaturedTabs(locale?: string): FeaturedTab[] {
  return selectLocale(
    {
      'pt-BR': HOME_FEATURED_TABS,
      en: HOME_FEATURED_TABS_EN,
      es: HOME_FEATURED_TABS_ES,
    },
    locale,
  );
}

export function getHomeFeaturedSection(
  locale?: string,
): SiteHomePayload['featured'] {
  return selectLocale(
    {
      'pt-BR': HOME_FEATURED_SECTION,
      en: HOME_FEATURED_SECTION_EN,
      es: HOME_FEATURED_SECTION_ES,
    },
    locale,
  );
}

export function getHomeHistorySection(
  locale?: string,
): SiteHomePayload['history'] {
  return selectLocale(
    {
      'pt-BR': HOME_HISTORY_SECTION,
      en: HOME_HISTORY_SECTION_EN,
      es: HOME_HISTORY_SECTION_ES,
    },
    locale,
  );
}

export function getHomeFaqItems(locale?: string): FAQItem[] {
  return selectLocale(
    { 'pt-BR': HOME_FAQ_ITEMS, en: HOME_FAQ_ITEMS_EN, es: HOME_FAQ_ITEMS_ES },
    locale,
  );
}

export function getHomeFaqSection(
  locale?: string,
): SiteHomePayload['faqSection'] {
  return selectLocale(
    {
      'pt-BR': HOME_FAQ_SECTION,
      en: HOME_FAQ_SECTION_EN,
      es: HOME_FAQ_SECTION_ES,
    },
    locale,
  );
}

export function getSocialSection(locale?: string): SocialFeedSection {
  return selectLocale(
    {
      'pt-BR': SITE_SOCIAL_SECTION,
      en: SITE_SOCIAL_SECTION_EN,
      es: SITE_SOCIAL_SECTION_ES,
    },
    locale,
  );
}

export function getAboutHeroSection(locale?: string): SiteAboutPayload['hero'] {
  return selectLocale(
    {
      'pt-BR': ABOUT_HERO_SECTION,
      en: ABOUT_HERO_SECTION_EN,
      es: ABOUT_HERO_SECTION_ES,
    },
    locale,
  );
}

export function getAboutQualitySection(
  locale?: string,
): SiteAboutPayload['quality'] {
  return selectLocale(
    {
      'pt-BR': ABOUT_QUALITY_SECTION,
      en: ABOUT_QUALITY_SECTION_EN,
      es: ABOUT_QUALITY_SECTION_ES,
    },
    locale,
  );
}

export function getAboutValues(locale?: string): AboutValue[] {
  return selectLocale(
    { 'pt-BR': ABOUT_VALUES, en: ABOUT_VALUES_EN, es: ABOUT_VALUES_ES },
    locale,
  );
}

export function getAboutBases(locale?: string): AboutBase[] {
  return selectLocale(
    { 'pt-BR': ABOUT_BASES, en: ABOUT_BASES_EN, es: ABOUT_BASES_ES },
    locale,
  );
}

export function getAboutTimeline(locale?: string): TimelineEvent[] {
  return selectLocale(
    { 'pt-BR': ABOUT_TIMELINE, en: ABOUT_TIMELINE_EN, es: ABOUT_TIMELINE_ES },
    locale,
  );
}

export function getAboutJobsCta(locale?: string): SiteAboutPayload['jobsCta'] {
  return selectLocale(
    {
      'pt-BR': ABOUT_JOBS_CTA_SECTION,
      en: ABOUT_JOBS_CTA_EN,
      es: ABOUT_JOBS_CTA_ES,
    },
    locale,
  );
}

export function getMilestonePattern(locale?: string): string[] {
  return selectLocale(
    {
      'pt-BR': MILESTONE_PATTERN,
      en: MILESTONE_PATTERN_EN,
      es: MILESTONE_PATTERN_ES,
    },
    locale,
  );
}

export function getCompanyStats(locale?: string): CompanyStat[] {
  return selectLocale(
    {
      'pt-BR': COMPANY_STATS,
      en: COMPANY_STATS_EN_ABOUT,
      es: COMPANY_STATS_ES,
    },
    locale,
  );
}
