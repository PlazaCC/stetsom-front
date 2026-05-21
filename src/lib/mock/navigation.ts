export const NAV_LINKS = [
  { label: 'Produtos', href: '/produtos' },
  { label: 'Sobre nós', href: '/sobre' },
  { label: 'Suporte', href: '/suporte' },
] as const;

export const PRODUCT_MENU_CATEGORIES = [
  {
    label: 'Amplificadores',
    image: '/figma-assets/raw/fill_EPTO4T_3d86cd17.png',
    href: '/produtos?category=amplificadores',
    description: 'Amplificadores de alta potência para sistemas automotivos.',
  },
  {
    label: 'Processadores',
    image: '/figma-assets/raw/fill_THI4RN_1e666beb.png',
    href: '/produtos?category=processadores',
    description:
      'Processadores de alta performance para aplicações automotivas.',
  },
  {
    label: 'Crossovers',
    image: '/figma-assets/raw/product-c.png',
    href: '/produtos?category=crossovers',
    description: 'Crossovers para divisão de frequências em sistemas multivia.',
  },
  {
    label: 'Controles',
    image: '/figma-assets/raw/fill_THI4RN_1e666beb.png',
    href: '/produtos?category=controles',
    description: 'Controles remotos e periféricos para amplificadores Stetsom.',
  },
  {
    label: 'Fontes e carregadores',
    image: '/figma-assets/raw/fill_THI4RN_1e666beb.png',
    href: '/produtos?category=fontes-e-carregadores',
    description: 'Fontes e carregadores para sistemas automotivos exigentes.',
  },
  {
    label: 'Mesas de som',
    image: '/figma-assets/raw/product-c.png',
    href: '/produtos?category=mesas-de-som',
    description: 'Mesas de som e mixers para profissionais e entusiastas.',
  },
  {
    label: 'Acessórios',
    image: '/figma-assets/raw/fill_EPTO4T_3d86cd17.png',
    href: '/produtos?category=acessorios',
    description: 'Acessórios para personalização e desempenho do sistema.',
  },
  {
    label: "Subwoofers",
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
    href: "/produtos?category=subwoofers",
    description: "Subwoofers de alto desempenho para graves profundos.",
  },
] as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre nós', href: '/sobre' },
      { label: 'Produtos', href: '/produtos' },
      { label: 'Suporte', href: '/suporte' },
      { label: 'Garantia', href: '/suporte' },
    ],
  },
  {
    title: 'Produtos',
    links: [
      { label: 'Todos', href: '/produtos' },
      { label: 'Amplificadores', href: '/produtos?category=amplificadores' },
      { label: 'Processadores', href: '/produtos?category=processadores' },
      { label: 'Fontes', href: '/produtos?category=fontes-e-carregadores' },
      { label: 'Controles', href: '/produtos?category=controles' },
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
] as const;

export const FOOTER_SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/stetsom" },
  { label: "Facebook", href: "https://facebook.com/stetsom" },
  { label: "YouTube", href: "https://youtube.com/@stetsom" },
  { label: "TikTok", href: "https://tiktok.com/@stetsom" },
] as const;
