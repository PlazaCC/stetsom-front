import type {
  DocumentationCategory,
  FAQItem,
  ProductFile,
  ServiceCenter,
  SupportPayload,
} from '@/lib/api/contracts';

const NOW = "2026-05-12T00:00:00.000Z";

const SUPPORT_DOCUMENTATION_FILES: ProductFile[] = [
  {
    id: "doc-manual-stx2448bt",
    product_id: "library",
    file_url: "#",
    type: "MANUAL",
    name: "Manual STX2448BT",
    fileSize: "1.8 MB",
    version: 2,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "doc-manual-sr4000",
    product_id: "library",
    file_url: "#",
    type: "MANUAL",
    name: "Manual SR4000",
    fileSize: "2.1 MB",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "doc-manual-st4000eq",
    product_id: "library",
    file_url: "#",
    type: "MANUAL",
    name: "Manual ST 4000EQ 4 Canais",
    fileSize: "3.4 MB",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "doc-catalogo-2024",
    product_id: "library",
    file_url: "#",
    type: "CATALOG",
    name: "Catálogo Stetsom 2024",
    fileSize: "12.5 MB",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "doc-certificado-fcc",
    product_id: "library",
    file_url: "#",
    type: "CERTIFICATE",
    name: "Certificado FCC — Amplificadores",
    fileSize: "0.4 MB",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "doc-logo-stetsom",
    product_id: "library",
    file_url: "#",
    type: "IMAGE",
    name: "Logo Stetsom (PNG + SVG)",
    fileSize: "0.8 MB",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const SUPPORT_SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: 'posto-1',
    name: 'Centro Técnico Santo Ângelo',
    address: 'Av. Brasil, 1200 — Santo Ângelo, RS',
    phone: '(55) 3312-0000',
    phone2: '(55) 9 9123-0000',
  },
  {
    id: 'posto-2',
    name: 'Stetsom Service São Paulo',
    address: 'Rua Voluntários da Pátria, 847 — Santana, SP',
    phone: '(11) 3991-0000',
    phone2: '(11) 9 9234-0000',
  },
  {
    id: 'posto-3',
    name: 'Audio Center Curitiba',
    address: 'Av. Sete de Setembro, 3770 — Batel, PR',
    phone: '(41) 3252-0000',
    phone2: '(41) 9 9345-0000',
  },
  {
    id: 'posto-4',
    name: 'RioSom Técnica',
    address: 'Rua Visconde de Inhaúma, 58 — Centro, RJ',
    phone: '(21) 2220-0000',
    phone2: '(21) 9 9456-0000',
  },
];

export const SUPPORT_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'sup-faq-instalacao',
    q: 'Como instalar meu amplificador?',
    a: 'Siga o manual incluso no produto e, para melhor resultado, procure um instalador autorizado Stetsom.',
  },
  {
    id: 'sup-faq-impedancia',
    q: 'Qual a diferença entre 1 Ohm e 2 Ohms?',
    a: 'Impedâncias menores permitem maior potência de saída, desde que o sistema esteja dimensionado para essa carga.',
  },
  {
    id: 'sup-faq-garantia',
    q: 'Como verificar a garantia?',
    a: 'Na central de garantia da Stetsom, informe o número de série para consultar cobertura e status.',
  },
  {
    id: 'sup-faq-distribuidores',
    q: 'Onde encontrar distribuidores autorizados?',
    a: 'Temos mais de 500 distribuidores no Brasil. Use o localizador na própria central de suporte.',
  },
  {
    id: 'sup-faq-processador',
    q: 'Qual a diferença entre amplificador e processador?',
    a: 'Amplificadores amplificam sinais de áudio. Processadores trabalham na pré-amplificação e controle de frequência.',
  },
  {
    id: 'sup-faq-fonte',
    q: 'Posso usar fonte diferente da recomendada?',
    a: 'Recomendamos usar fontes Stetsom de especificações iguais. Outras marcas podem danificar o equipamento.',
  },
];

export const SUPPORT_PAYLOAD: SupportPayload = {
  hero: {
    label: 'Central de ajuda',
    title: 'COMO PODEMOS\nTE AJUDAR',
    description:
      'Nossa equipe técnica está pronta para ajudar você a tirar o máximo dos seus produtos Stetsom.',
    image: '/figma-assets/raw/fill_CGM3WO_6a0a1876.png',
    watermarkText: 'SOS',
  },
  mapImage: '/figma-assets/raw/fill_SXY62B_51d05531.png',
  cards: [
    {
      id: 'manuais-downloads',
      title: 'Manuais & Downloads',
      description:
        'Acesse manuais técnicos, catálogos, fotos de produto, logos e wallpapers oficiais da Stetsom.',
      cta: 'Acessar',
    },
    {
      id: 'postos-autorizados',
      title: 'Postos Autorizados',
      description:
        'Encontre a assistência técnica autorizada mais próxima de você por CEP ou cidade.',
      cta: 'Localizar',
    },
    {
      id: 'fale-conosco',
      title: 'Fale Conosco',
      description:
        'Entre em contato com nossa equipe de suporte técnico para esclarecer dúvidas e resolver problemas.',
      cta: 'Contato',
    },
  ],
  documentationFiles: SUPPORT_DOCUMENTATION_FILES,
  documentationCategories: [
    { id: "MANUAL", label: "Manuais" },
    { id: "CATALOG", label: "Catálogos" },
    { id: "CERTIFICATE", label: "Certificados" },
    { id: "IMAGE", label: "Fotos e logos" },
  ] satisfies DocumentationCategory[],
  contact: {
    label: 'Contato',
    title: 'Fale Conosco',
    description:
      'Preencha o formulário abaixo e nossa equipe responderá em breve.',
  },
  contactInfo: {
    phone: '(18) 3300-0000',
    email: 'suporte@stetsom.com.br',
    whatsapp: '(18) 3300-0000',
  },
  serviceCenters: SUPPORT_SERVICE_CENTERS,
  faq: {
    label: 'DÚVIDAS',
    title: 'PERGUNTAS FREQUENTES',
    items: SUPPORT_FAQ_ITEMS,
    supportButtonLabel: 'Falar com suporte',
  },
};
