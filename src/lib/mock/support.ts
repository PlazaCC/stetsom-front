import type { FAQItem, ProductFile, SupportPayload } from '@/lib/api/contracts'

const NOW = new Date().toISOString()

const SUPPORT_DOCUMENTATION_FILES: ProductFile[] = [
  {
    id: 'doc-manual-sr4000',
    product_id: 'support',
    file_url: '#',
    type: 'MANUAL',
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'doc-guia-instalacao',
    product_id: 'support',
    file_url: '#',
    type: 'MANUAL',
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'doc-diagrama-sr2000',
    product_id: 'support',
    file_url: '#',
    type: 'MANUAL',
    version: 2,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: 'doc-certificado-fcc',
    product_id: 'support',
    file_url: '#',
    type: 'CERTIFICATE',
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
]

export const SUPPORT_FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Como instalar meu amplificador?',
    a: 'Siga o manual incluso no produto e, para melhor resultado, procure um instalador autorizado Stetsom.',
  },
  {
    q: 'Qual a diferença entre 1 Ohm e 2 Ohms?',
    a: 'Impedâncias menores permitem maior potência de saída, desde que o sistema esteja dimensionado para essa carga.',
  },
  {
    q: 'Como verificar a garantia?',
    a: 'Na central de garantia da Stetsom, informe o número de série para consultar cobertura e status.',
  },
  {
    q: 'Onde encontrar distribuidores autorizados?',
    a: 'Temos mais de 500 distribuidores no Brasil. Use o localizador na própria central de suporte.',
  },
  {
    q: 'Qual a diferença entre amplificador e processador?',
    a: 'Amplificadores amplificam sinais de áudio. Processadores trabalham na pré-amplificação e controle de frequência.',
  },
  {
    q: 'Posso usar fonte diferente da recomendada?',
    a: 'Recomendamos usar fontes Stetsom de especificações iguais. Outras marcas podem danificar o equipamento.',
  },
]

export const SUPPORT_PAYLOAD: SupportPayload = {
  hero: {
    label: 'Central de ajuda',
    title: 'COMO PODEMOS\nTE AJUDAR',
    description: 'Nossa equipe técnica está pronta para ajudar você a tirar o máximo dos seus produtos Stetsom.',
    image: '/figma-assets/raw/fill_CGM3WO_6a0a1876.png',
    watermarkText: 'SOS',
  },
  cards: [
    {
      id: 'central-ajuda',
      title: 'Central de Ajuda',
      description: 'Acesso rápido a documentação técnica, guias de instalação e tutoriais em vídeo.',
      cta: 'Explorar',
    },
    {
      id: 'garantia',
      title: 'Garantia',
      description: 'Consulte o status da garantia do seu produto informando o número de série.',
      cta: 'Consultar',
    },
    {
      id: 'manuais',
      title: 'Manuais',
      description: 'Downloads de manuais técnicos, esquemas elétricos e documentação completa.',
      cta: 'Baixar',
    },
  ],
  documentationFiles: SUPPORT_DOCUMENTATION_FILES,
  faqSearch: {
    label: 'FAQ',
    title: 'Perguntas Frequentes',
    placeholder: 'Busque sua dúvida...',
    categories: [
      { id: 'todos', name: 'Todos' },
      { id: 'instalacao', name: 'Instalação' },
      { id: 'tecnico', name: 'Técnico' },
      { id: 'garantia', name: 'Garantia' },
    ],
  },
  contact: {
    label: 'Contato',
    title: 'Fale Conosco',
    description: 'Preencha o formulário abaixo e nossa equipe responderá em breve.',
  },
  faq: {
    label: 'DÚVIDAS',
    title: 'PERGUNTAS FREQUENTES',
    items: SUPPORT_FAQ_ITEMS,
    supportButtonLabel: 'Falar com suporte',
  },
}
