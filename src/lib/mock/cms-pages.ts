/** Mock data for the CMS Institutional Pages module. Each section mirrors the real public page layout. */
import type {
  AdminPageDetailPayload,
  AdminPagesPayload,
  PageSection,
} from "@/lib/api/contracts";

const NOW = "2026-05-19T00:00:00.000Z";

// ── Home ─────────────────────────────────────────────────────────────────────

const HOME_SECTIONS: PageSection[] = [
  {
    id: "home~hero-carousel",
    page_id: "home",
    name: "Hero Principal (Carousel)",
    type: "HERO_CAROUSEL",
    order: 1,
    is_editable: true,
    data: {
      slides: [
        {
          id: "hero-1",
          desktopImage: "/figma-assets/raw/fill_5JQEZY_e95c6db4.png",
          mobileImage: "/figma-assets/raw/fill_8T5TD1_7ad629bc.png",
          alt: "Sinta o verdadeiro poder do grave",
          href: "/produtos",
          label: "Stetsom Digital Bass",
          title: "SINTA O VERDADEIRO\nPODER DO GRAVE",
        },
        {
          id: "hero-2",
          desktopImage: "/figma-assets/raw/fill_5JQEZY_e95c6db4.png",
          mobileImage: "/figma-assets/raw/fill_5JQEZY_e95c6db4.png",
          alt: "História Stetsom",
          href: "/sobre",
          label: "Desde 1989",
          title: "NOSSA HISTÓRIA",
        },
        {
          id: "hero-3",
          desktopImage: "/figma-assets/raw/fill_5JQEZY_e95c6db4.png",
          mobileImage: "/figma-assets/raw/fill_5JQEZY_e95c6db4.png",
          alt: "Comunidade Stetsom",
          href: "/suporte",
          label: "Suporte Oficial",
          title: "COMUNIDADE STETSOM",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "home~featured-products",
    page_id: "home",
    name: "Produtos em Destaque",
    type: "PRODUCT_GRID",
    order: 2,
    is_editable: true,
    data: {
      label: "Novidades",
      title: "Nossos Produtos",
      ctaLabel: "Ver todos",
      ctaHref: "/produtos",
      tabs: [
        { id: "tab-all", label: "Todos" },
        {
          id: "tab-amplificadores",
          label: "Amplificadores",
          categorySlug: "amplificadores",
        },
        {
          id: "tab-processadores",
          label: "Processadores",
          categorySlug: "processadores",
        },
        {
          id: "tab-crossovers",
          label: "Crossovers",
          categorySlug: "crossovers",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "home~faq",
    page_id: "home",
    name: "FAQ",
    type: "FAQ_ACCORDION",
    order: 3,
    is_editable: true,
    data: {
      label: "Dúvidas frequentes",
      title: "Perguntas e Respostas",
      subtitle: "Tem dúvidas? A gente responde.",
      ctaLabel: "Falar com suporte",
      ctaHref: "/suporte",
      items: [
        {
          id: "faq-1",
          q: "Qual a potência real dos amplificadores Stetsom?",
          a: "A potência informada nos produtos Stetsom é sempre a potência RMS real, medida em laboratório. Nossos amplificadores são testados com carga nominal e em temperatura controlada.",
        },
        {
          id: "faq-2",
          q: "Como escolher o amplificador certo para minha aplicação?",
          a: "A escolha depende principalmente da impedância do seu subwoofer, da potência nominal necessária e da tensão do sistema (12V ou 14.4V). Entre em contato com nosso suporte para uma recomendação personalizada.",
        },
        {
          id: "faq-3",
          q: "Os produtos Stetsom têm garantia?",
          a: "Sim, todos os nossos produtos têm garantia de 1 ano contra defeitos de fabricação. A garantia é válida mediante apresentação da nota fiscal de compra.",
        },
        {
          id: "faq-4",
          q: "Onde posso encontrar postos de assistência técnica autorizados?",
          a: "Acesse a página de suporte e use nosso localizador de postos autorizados. Temos cobertura em todo o Brasil.",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "home~social-feed",
    page_id: "home",
    name: "Feed do Instagram",
    type: "SOCIAL_FEED",
    order: 4,
    is_editable: true,
    data: {
      handle: "@stetsom",
      title: "Siga a Stetsom",
      subtitle: "Fique por dentro das novidades e do mundo do som automotivo.",
      ctaLabel: "Ver perfil",
      ctaHref: "https://instagram.com/stetsom",
      postsCount: 5,
    },
    updated_at: NOW,
  },
];

// ── Catalog ────────────────────────────────────────────────────────────────────

const CATALOG_SECTIONS: PageSection[] = [
  {
    id: "catalog~catalog-hero",
    page_id: "catalog",
    name: "Hero do Catálogo",
    type: "CATALOG_HERO",
    order: 1,
    is_editable: true,
    data: {
      label: "Catálogo de Produtos",
      title: "NOSSO PORTFÓLIO",
      image: "/figma-assets/raw/fill_5JQEZY_e95c6db4.png",
      imageAlt: "Catálogo Stetsom",
      watermark: "CATÁLOGO",
    },
    updated_at: NOW,
  },
  {
    id: "catalog~product-grid",
    page_id: "catalog",
    name: "Configuração de Grid de Produtos",
    type: "PRODUCT_GRID",
    order: 2,
    is_editable: true,
    data: {
      label: "Nossos Produtos",
      title: "CATÁLOGO COMPLETO",
      columns: 3,
      showFilters: true,
    },
    updated_at: NOW,
  },
];

// ── About ──────────────────────────────────────────────────────────────────────

const ABOUT_SECTIONS: PageSection[] = [
  {
    id: "about~hero",
    page_id: "about",
    name: "Hero",
    type: "HERO_STATIC",
    order: 1,
    is_editable: true,
    data: {
      label: "Sobre a Stetsom",
      title: "REFERÊNCIA EM SOM AUTOMOTIVO",
      image: "/figma-assets/raw/fill_TZ5X2T_f271b766.png",
      imageAlt: "Sobre a Stetsom",
    },
    updated_at: NOW,
  },
  {
    id: "about~stats",
    page_id: "about",
    name: "Números da Empresa",
    type: "STATS_ROW",
    order: 2,
    is_editable: true,
    data: {
      stats: [
        { value: "35+", label: "Anos de história" },
        { value: "2M+", label: "Produtos vendidos" },
        { value: "50+", label: "Países atendidos" },
        { value: "500+", label: "Modelos no portfólio" },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "about~milestones",
    page_id: "about",
    name: "Marcos (Marquee)",
    type: "MILESTONES_MARQUEE",
    order: 3,
    is_editable: true,
    data: {
      items: [
        "FUNDADA EM 1989",
        "AMPLIFICADORES CLASSE D",
        "PROCESSADORES DIGITAIS",
        "QUALIDADE CERTIFICADA",
        "EXPORTAÇÃO GLOBAL",
        "INOVAÇÃO CONTÍNUA",
      ],
    },
    updated_at: NOW,
  },
  {
    id: "about~values",
    page_id: "about",
    name: "Valores da Empresa",
    type: "VALUES_GRID",
    order: 4,
    is_editable: true,
    data: {
      label: "Qualidade Inovadora",
      title: "O que nos move",
      description:
        "Desde 1989 construímos nossos produtos com rigor técnico, inovação constante e compromisso com a performance real.",
      image: "/figma-assets/raw/fill_C4OUE1_1e666beb.png",
      imageAlt: "Laboratório Stetsom",
      values: [
        {
          id: "val-innovation",
          icon: "zap",
          title: "Inovação",
          description: "Tecnologia de ponta desenvolvida internamente.",
        },
        {
          id: "val-quality",
          icon: "shield-check",
          title: "Qualidade",
          description: "Cada produto testado antes de sair da fábrica.",
        },
        {
          id: "val-performance",
          icon: "rocket",
          title: "Performance",
          description: "Potência real, medida e documentada.",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "about~timeline",
    page_id: "about",
    name: "Linha do Tempo",
    type: "TIMELINE_VERTICAL",
    order: 5,
    is_editable: true,
    data: {
      label: "Nossa História",
      title: "35 ANOS DE EVOLUÇÃO",
      events: [
        {
          id: "tl-1989",
          year: 1989,
          title: "Fundação da Stetsom",
          shortTitle: "Fundação",
          description:
            "A Stetsom é fundada em São Paulo com foco em amplificadores automotivos.",
          image: "/figma-assets/raw/fill_YKBFZV_e95c6db4.png",
        },
        {
          id: "tl-1999",
          year: 1999,
          title: "Expansão Nacional",
          shortTitle: "Expansão",
          description:
            "A marca atinge distribuição em todo o território nacional.",
          image: "/figma-assets/raw/fill_4ZTOB5_bf27a878.png",
        },
        {
          id: "tl-2002",
          year: 2002,
          title: "Exportação",
          shortTitle: "Exportação",
          description: "Início das exportações para América Latina e Europa.",
          image: "/figma-assets/raw/fill_DMAWF3_a4b5ab27.png",
        },
        {
          id: "tl-2007",
          year: 2007,
          title: "Classe D",
          shortTitle: "Classe D",
          description:
            "Lançamento da linha Classe D, revolucionando eficiência e potência.",
          image: "/figma-assets/raw/fill_RA4PPD_8b0b4189.png",
        },
        {
          id: "tl-2014",
          year: 2014,
          title: "Processadores Digitais",
          shortTitle: "Digital",
          description: "Entrada no mercado de processadores digitais de áudio.",
          image: "/figma-assets/raw/fill_C4OUE1_1e666beb.png",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "about~foundations",
    page_id: "about",
    name: "Bases da Empresa",
    type: "FOUNDATIONS_GRID",
    order: 6,
    is_editable: true,
    data: {
      bases: [
        {
          id: "base-mission",
          title: "Missão",
          description:
            "Oferecer produtos de áudio automotivo de alta performance com a melhor relação custo-benefício do mercado.",
        },
        {
          id: "base-vision",
          title: "Visão",
          description:
            "Ser a marca de som automotivo mais reconhecida e respeitada no Brasil e na América Latina.",
        },
        {
          id: "base-values",
          title: "Valores",
          description:
            "Inovação, qualidade, transparência, compromisso com o cliente e responsabilidade social.",
        },
      ],
    },
    updated_at: NOW,
  },
];

// ── Support ────────────────────────────────────────────────────────────────────

const SUPPORT_SECTIONS: PageSection[] = [
  {
    id: "support~hero",
    page_id: "support",
    name: "Hero",
    type: "HERO_STATIC",
    order: 1,
    is_editable: true,
    data: {
      label: "Central de Suporte",
      title: "COMO PODEMOS AJUDAR?",
      description:
        "Estamos aqui para garantir a melhor experiência com seus produtos Stetsom.",
      watermarkText: "SOS",
    },
    updated_at: NOW,
  },
  {
    id: "support~support-cards",
    page_id: "support",
    name: "Canais de Atendimento",
    type: "SUPPORT_CARDS",
    order: 2,
    is_editable: true,
    data: {
      cards: [
        {
          id: "card-whatsapp",
          title: "WhatsApp",
          description: "Atendimento rápido pelo WhatsApp em horário comercial.",
          cta: "Chamar no WhatsApp",
          href: "https://wa.me/551100000000",
          icon: "message-circle",
        },
        {
          id: "card-email",
          title: "E-mail",
          description: "Envie sua dúvida e responderemos em até 1 dia útil.",
          cta: "Enviar e-mail",
          href: "mailto:suporte@stetsom.com.br",
          icon: "mail",
        },
        {
          id: "card-store",
          title: "Loja Física",
          description:
            "Visite-nos em São Paulo de segunda a sexta, das 8h às 18h.",
          cta: "Ver endereço",
          href: "/suporte#mapa",
          icon: "map-pin",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "support~download-catalog",
    page_id: "support",
    name: "Downloads e Manuais",
    type: "DOWNLOAD_CATALOG",
    order: 4,
    is_editable: true,
    data: {
      label: "Materiais Técnicos",
      title: "Downloads",
      description:
        "Manuais, catálogos e certificados disponíveis para download.",
      categories: [
        { id: "cat-manuals", label: "Manuais" },
        { id: "cat-catalogs", label: "Catálogos" },
        { id: "cat-certs", label: "Certificados" },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "support~service-centers",
    page_id: "support",
    name: "Postos Autorizados",
    type: "SERVICE_CENTERS",
    order: 4,
    is_editable: true,
    data: {
      label: "Assistência Técnica",
      title: "Postos Autorizados",
      centers: [
        {
          id: "sc-sp-01",
          name: "Stetsom SP Centro",
          address: "R. Exemplo, 100 – Centro, São Paulo – SP",
          phone: "(11) 3000-0001",
        },
        {
          id: "sc-rj-01",
          name: "Stetsom RJ",
          address: "Av. Brasil, 500 – Centro, Rio de Janeiro – RJ",
          phone: "(21) 3000-0001",
        },
        {
          id: "sc-mg-01",
          name: "Stetsom BH",
          address: "R. dos Caetés, 200 – Centro, Belo Horizonte – MG",
          phone: "(31) 3000-0001",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "support~contact-config",
    page_id: "support",
    name: "Configuração do Formulário",
    type: "CONTACT_FORM_CONFIG",
    order: 6,
    is_editable: true,
    data: {
      label: "Fale Conosco",
      title: "Entre em contato",
      description: "Preencha o formulário e entraremos em contato em breve.",
      departments: [
        {
          id: "dept-support",
          label: "Suporte Técnico",
          email: "suporte@stetsom.com.br",
        },
        {
          id: "dept-commercial",
          label: "Comercial",
          email: "comercial@stetsom.com.br",
        },
        {
          id: "dept-warranty",
          label: "Garantia",
          email: "garantia@stetsom.com.br",
        },
      ],
    },
    updated_at: NOW,
  },
  {
    id: "support~faq",
    page_id: "support",
    name: "FAQ",
    type: "FAQ_ACCORDION",
    order: 5,
    is_editable: true,
    data: {
      label: "Dúvidas Frequentes",
      title: "Perguntas e Respostas",
      supportButtonLabel: "Falar com suporte",
      items: [
        {
          id: "sfaq-1",
          q: "Meu produto está com defeito. O que fazer?",
          a: "Entre em contato com nosso suporte pelo WhatsApp ou e-mail informando o número de série do produto e a nota fiscal de compra.",
        },
        {
          id: "sfaq-2",
          q: "Como acionar a garantia?",
          a: "A garantia é acionada via e-mail ou presencialmente em um posto autorizado, com apresentação da nota fiscal.",
        },
        {
          id: "sfaq-3",
          q: "Qual o prazo de reparo em garantia?",
          a: "O prazo é de até 30 dias corridos após a entrega do produto no posto autorizado.",
        },
        {
          id: "sfaq-4",
          q: "Onde baixar o manual do meu produto?",
          a: "Acesse a seção de downloads acima ou a página do produto no catálogo — lá você encontra o manual mais atualizado.",
        },
      ],
    },
    updated_at: NOW,
  },
];

// ── Exports ───────────────────────────────────────────────────────────────────

/** All sections from all pages (global index for id-based lookups). */
export const MOCK_ALL_PAGE_SECTIONS: PageSection[] = [
  ...HOME_SECTIONS,
  ...CATALOG_SECTIONS,
  ...ABOUT_SECTIONS,
  ...SUPPORT_SECTIONS,
];

/** Sections grouped by pageId for getAdminPageSections. */
export const MOCK_PAGE_SECTIONS_BY_PAGE: Record<string, PageSection[]> = {
  home: HOME_SECTIONS,
  catalog: CATALOG_SECTIONS,
  about: ABOUT_SECTIONS,
  support: SUPPORT_SECTIONS,
};

const PAGE_LABELS: Record<string, string> = {
  home: "Página Inicial",
  catalog: "Catálogo",
  about: "Sobre Nós",
  support: "Suporte",
};

/** Lista de páginas com data de última atualização */
function getLatestUpdatedAt(sections: PageSection[]): string {
  const validDates = sections
    .map((s) => s.updated_at)
    .filter((d): d is string => d !== null);
  if (validDates.length === 0) return NOW;
  return validDates.reduce((latest, d) =>
    new Date(d).getTime() > new Date(latest).getTime() ? d : latest,
  );
}

export const MOCK_ADMIN_PAGES: AdminPagesPayload = {
  pages: (["home", "catalog", "about", "support"] as const).map((id) => ({
    id,
    label: PAGE_LABELS[id],
    sections_count: (MOCK_PAGE_SECTIONS_BY_PAGE[id] ?? []).length,
    updated_at: getLatestUpdatedAt(MOCK_PAGE_SECTIONS_BY_PAGE[id] ?? []),
  })),
};

/** Payload detalhado de uma página para getAdminPageSections */
export function buildAdminPageDetailPayload(
  pageId: string,
): AdminPageDetailPayload {
  return {
    page_id: pageId as AdminPageDetailPayload["page_id"],
    label: PAGE_LABELS[pageId] ?? pageId,
    sections: MOCK_PAGE_SECTIONS_BY_PAGE[pageId] ?? [],
  };
}
