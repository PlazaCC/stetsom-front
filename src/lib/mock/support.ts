import type { FAQItem, SupportPayload } from '@/lib/api/contracts'

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
    label: 'Estamos aqui',
    title: 'SOS SUPORTE',
    description: 'Encontre respostas técnicas, consulte sua garantia e localize distribuidores autorizados.',
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
  documentation: {
    label: 'Documentação',
    title: 'Categorias',
    categories: [
      { id: 'manuais', name: 'Manuais' },
      { id: 'esquemas', name: 'Esquemas Elétricos' },
      { id: 'certificados', name: 'Certificados' },
    ],
    links: [
      { id: 'manual-1', title: 'Manual Amplificador SR4000', href: '#', category: 'manuais' },
      { id: 'manual-2', title: 'Guia de Instalação Rápida', href: '#', category: 'manuais' },
      { id: 'schema-1', title: 'Diagrama Elétrico SR2000', href: '#', category: 'esquemas' },
      { id: 'cert-1', title: 'Certificado FCC', href: '#', category: 'certificados' },
    ],
  },
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
    label: 'FAQ',
    title: 'RESPOSTAS ÀS DÚVIDAS',
    items: SUPPORT_FAQ_ITEMS,
    supportButtonLabel: 'Falar com suporte',
  },
}
