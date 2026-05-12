import type { FAQItem, SupportPayload } from '@/lib/api/contracts'

export const SUPPORT_FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Como instalar meu amplificador?',
    a: 'Siga o manual incluso no produto e, para melhor resultado, procure um instalador autorizado Stetsom.',
  },
  {
    q: 'Qual a diferenca entre 1 Ohm e 2 Ohms?',
    a: 'Impedancias menores permitem maior potencia de saida, desde que o sistema esteja dimensionado para essa carga.',
  },
  {
    q: 'Como verificar a garantia?',
    a: 'Na central de garantia da Stetsom, informe o numero de serie para consultar cobertura e status.',
  },
  {
    q: 'Onde encontrar distribuidores autorizados?',
    a: 'Temos mais de 500 distribuidores no Brasil. Use o localizador na propria central de suporte.',
  },
]

export const SUPPORT_PAYLOAD: SupportPayload = {
  heroLabel: 'Estamos aqui',
  heroTitle: 'CENTRAL DE AJUDA',
  heroDescription: 'Encontre suporte tecnico, distribuidores autorizados e tire suas duvidas sobre nossos produtos.',
  cards: [
    {
      id: 'support-technical',
      title: 'Suporte Tecnico',
      description: 'Entre em contato com nossa equipe tecnica especializada.',
      cta: 'Abrir Ticket',
    },
    {
      id: 'support-warranty',
      title: 'Garantia',
      description: 'Consulte o status da garantia do seu produto Stetsom.',
      cta: 'Consultar Garantia',
    },
    {
      id: 'support-distributor',
      title: 'Distribuidores',
      description: 'Encontre um distribuidor autorizado proximo de voce.',
      cta: 'Ver Distribuidores',
    },
  ],
  faqLabel: 'Duvidas',
  faqTitle: 'PERGUNTAS\nFREQUENTES',
  faq: SUPPORT_FAQ_ITEMS,
  distributorLabel: 'Distribuidores',
  distributorTitle: 'ENCONTRE UM PONTO DE VENDA',
  distributorSubtitle: 'Rede de distribuicao em todo o Brasil e mais de 60 paises.',
  distributorMapLabel: 'Mapa de Distribuidores',
}
