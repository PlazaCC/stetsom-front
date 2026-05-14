export const NAV_LINKS = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Sobre nós', href: '/sobre' },
  { label: 'Suporte', href: '/suporte' },
] as const

export const PRODUCT_MENU_CATEGORIES = [
  {
    label: 'Amplificadores',
    image: '/figma-assets/raw/fill_3MZVXN_813a9a32.png',
    href: '/produtos?category=amplificadores',
    description: 'Amplificadores de alta potencia para sistemas automotivos.',
  },
  {
    label: 'Processadores',
    image: '/figma-assets/raw/fill_6OC3H9_7136cc16.png',
    href: '/produtos?category=processadores',
    description: 'Processadores de alta performance para aplicacoes automotivas.',
  },
  {
    label: 'Subwoofers',
    image: '/figma-assets/raw/fill_3FJG3P_64a33e19.png',
    href: '/produtos?category=subwoofers',
    description: 'Subwoofers com foco em SPL e resposta de graves.',
  },
  {
    label: 'Acessorios',
    image: '/figma-assets/raw/fill_EPTO4T_3d86cd17.png',
    href: '/produtos?category=acessorios',
    description: 'Acessorios para personalizacao e desempenho do sistema.',
  },
  {
    label: 'Fontes',
    image: '/figma-assets/raw/fill_THI4RN_1e666beb.png',
    href: '/produtos?category=fontes',
    description: 'Fontes de alimentacao estaveis para projetos exigentes.',
  },
] as const

export const FOOTER_COLUMNS = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Nossa história', href: '/sobre' },
      { label: 'Fábrica', href: '/sobre' },
      { label: 'Contato', href: '/suporte' },
    ],
  },
  {
    title: 'Produtos',
    links: [
      { label: 'Todos', href: '/produtos' },
      { label: 'Amplificadores', href: '/produtos?category=amplificadores' },
      { label: 'Processadores', href: '/produtos?category=processadores' },
      { label: 'Fontes', href: '/produtos?category=fontes' },
      { label: 'Controladores', href: '/produtos?category=controladores' },
      { label: 'Acessórios', href: '/produtos?category=acessorios' },
    ],
  },
  {
    title: 'Suporte',
    links: [
      { label: 'Central de ajuda', href: '/suporte' },
      { label: 'Garantia', href: '/suporte' },
      { label: 'Manuais', href: '/suporte' },
      { label: 'Postos autorizados', href: '/suporte' },
      { label: 'Contato', href: '/suporte' },
    ],
  },
] as const

export const FOOTER_SOCIALS = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'TikTok', href: '#' },
] as const
