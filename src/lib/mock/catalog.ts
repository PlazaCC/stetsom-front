import type {
  CatalogPagePayload,
  Category,
  Product,
  ProductBlock,
  ProductFile,
  ProductSpec,
  ProductVariation,
  Subcategory,
} from "@/lib/api/contracts";

const NOW = "2026-05-12T00:00:00.000Z";
const AUTHOR = "mock-system";

const CATALOG_ASSETS = {
  hero: "/figma-assets/raw/fill_CGM3WO_6a0a1876.png",
  // Thumbnails confirmados via MCP no product grid (node 1071:12265) — 3 imageRefs reais
  thumbnailPrimary: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png", // imageRef 3d86cd17 (card A)
  thumbnailSecondary: "/figma-assets/raw/fill_THI4RN_1e666beb.png", // imageRef 1e666beb (card B)
  thumbnailTertiary: "/figma-assets/raw/product-c.png", // imageRef 29578a53 (card C)
  detailPrimary: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
  detailSecondary: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
} as const;

export const CATALOG_PAGE_PAYLOAD: CatalogPagePayload = {
  heroLabel: "CATÁLOGO COMPLETO",
  heroTitle: "NOSSO\nPRODUTOS",
  heroImage: CATALOG_ASSETS.hero,
  heroImageAlt: "Catálogo Stetsom",
  heroWatermark: "PRO",
};

const CATALOG_PAGE_PAYLOAD_EN: CatalogPagePayload = {
  heroLabel: "FULL CATALOG",
  heroTitle: "OUR\nPRODUCTS",
  heroImage: CATALOG_ASSETS.hero,
  heroImageAlt: "Stetsom Catalog",
  heroWatermark: "PRO",
};

const CATALOG_PAGE_PAYLOAD_ES: CatalogPagePayload = {
  heroLabel: "CATÁLOGO COMPLETO",
  heroTitle: "NUESTROS\nPRODUCTOS",
  heroImage: CATALOG_ASSETS.hero,
  heroImageAlt: "Catálogo Stetsom",
  heroWatermark: "PRO",
};

export function getCatalogPagePayloadForLocale(
  locale?: string,
): CatalogPagePayload {
  if (locale === "en") return CATALOG_PAGE_PAYLOAD_EN;
  if (locale === "es") return CATALOG_PAGE_PAYLOAD_ES;
  return CATALOG_PAGE_PAYLOAD;
}

export const CATALOG_CATEGORIES: Category[] = [
  {
    id: "cat-amplificadores",
    name: "Amplificadores",
    slug: "amplificadores",
    order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-processadores",
    name: "Processadores",
    slug: "processadores",
    order: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-crossovers",
    name: "Crossovers",
    slug: "crossovers",
    order: 3,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-controles",
    name: "Controles",
    slug: "controles",
    order: 4,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-fontes-carregadores",
    name: "Fontes e carregadores",
    slug: "fontes-e-carregadores",
    order: 5,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-mesas-de-som",
    name: "Mesas de som",
    slug: "mesas-de-som",
    order: 6,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-acessorios",
    name: "Acessórios",
    slug: "acessorios",
    order: 7,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "cat-subwoofers",
    name: "Subwoofers",
    slug: "subwoofers",
    order: 8,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const CATALOG_SUBCATEGORIES: Subcategory[] = [
  {
    id: "sub-full-range",
    category_id: "cat-amplificadores",
    name: "Full Range",
    slug: "full-range",
    order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "sub-mono",
    category_id: "cat-amplificadores",
    name: "Mono",
    slug: "mono",
    order: 2,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "sub-dsp",
    category_id: "cat-processadores",
    name: "DSP",
    slug: "dsp",
    order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "sub-12-pol",
    category_id: "cat-subwoofers",
    name: "12 Polegadas",
    slug: "12-polegadas",
    order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "sub-automotiva",
    category_id: "cat-fontes-carregadores",
    name: "Fonte Automotiva",
    slug: "fonte-automotiva",
    order: 1,
    created_at: NOW,
    updated_at: NOW,
  },
];

type LegacySpecValue =
  | string
  | number
  | boolean
  | { ohm1: string; ohm2: string };
type LegacySpecifications = Record<string, LegacySpecValue>;
type LegacyProduct = Omit<Product, "variations" | "highlight_attributes"> & {
  specifications: LegacySpecifications;
};

const DEFAULT_HIGHLIGHT_PRIORITY = [
  "rms_power",
  "max_power",
  "channels",
  "impedance",
  "sample_rate",
  "outputs",
  "output_current",
  "output_voltage",
] as const;

function toVariationLabels(
  specifications: LegacySpecifications,
  preferredLabels?: string[],
): string[] {
  if (preferredLabels && preferredLabels.length > 0) {
    return preferredLabels;
  }

  const hasMultiColumn = Object.values(specifications).some(
    (value) => typeof value === "object" && value !== null && "ohm1" in value,
  );

  return hasMultiColumn ? ["Variação 1", "Variação 2"] : ["Padrão"];
}

function toVariationSpecs(
  specifications: LegacySpecifications,
  variationIndex: number,
): ProductSpec[] {
  return Object.entries(specifications).map(([attribute, value], index) => ({
    id: `spec-${variationIndex + 1}-${attribute}-${index + 1}`,
    attribute,
    value:
      typeof value === "object" && value !== null && "ohm1" in value
        ? variationIndex === 0
          ? value.ohm1
          : value.ohm2
        : String(value),
    order: index + 1,
  }));
}

function resolveHighlightAttributes(specs: ProductSpec[]): string[] {
  const highlighted = new Set<string>();

  for (const key of DEFAULT_HIGHLIGHT_PRIORITY) {
    const match = specs.find((spec) => spec.attribute === key);
    if (match) {
      highlighted.add(match.attribute);
    }

    if (highlighted.size >= 3) {
      break;
    }
  }

  for (const spec of specs) {
    if (highlighted.size >= 3) {
      break;
    }
    highlighted.add(spec.attribute);
  }

  return Array.from(highlighted);
}

const PRODUCT_VARIATION_LABELS: Record<string, string[]> = {
  "prod-st-4000eq-4c": ["2 Ohms", "4 Ohms"],
};

const LEGACY_CATALOG_PRODUCTS: LegacyProduct[] = [
  {
    id: "prod-st-4000eq-4c",
    name: "ST-4000EQ 4 CANAIS",
    slug: "st-4000eq-4-canais",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-full-range",
    status: "ACTIVE",
    badge: "LANÇAMENTO",
    launch_date: "2025-12-01T00:00:00.000Z",
    description:
      "Amplificador 4 canais com alta eficiência para sistemas automotivos de média e alta potência.",
    specifications: {
      channels: "4",
      operating_class: "Class D",
      frequency_response: "20 Hz – 20 kHz",
      input_gain: { ohm1: "0 to 6V", ohm2: "0 to 6V" },
      rms_power: { ohm1: "4x 1000W RMS", ohm2: "4x 600W RMS" },
      max_power: { ohm1: "4x 1400W", ohm2: "4x 900W" },
      graphic_eq: "8 bands",
      master_level: "Yes",
      routing: "Stereo / Mono",
      limiter: "Yes",
      operating_voltage: "12 – 14.4V",
      fuses: "2x 50A",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    video_url: "https://www.youtube.com/watch?v=stetsom-demo-4000",
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-st-2000eq-mono",
    name: "ST-2000EQ MONO",
    slug: "st-2000eq-mono",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-mono",
    status: "ACTIVE",
    launch_date: "2025-10-12T00:00:00.000Z",
    description:
      "Módulo mono para graves com resposta estável e alto rendimento.",
    specifications: {
      rms_power: "1x 2000W RMS",
      impedance: "1 Ohm",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-st-800-4-compact",
    name: "ST-800.4 COMPACT",
    slug: "st-800-4-compact",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-full-range",
    status: "ACTIVE",
    launch_date: "2025-05-20T00:00:00.000Z",
    description:
      "Compacto, eficiente e ideal para projetos que priorizam espaço interno.",
    specifications: {
      rms_power: "4x 200W RMS",
      impedance: "2 Ohms",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailSecondary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-st-1200-1d-bass",
    name: "ST-1200.1D BASS",
    slug: "st-1200-1d-bass",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-mono",
    status: "ACTIVE",
    launch_date: "2024-11-06T00:00:00.000Z",
    description:
      "Projeto focado em graves com resposta rápida e controle térmico aprimorado.",
    specifications: {
      rms_power: "1x 1200W RMS",
      impedance: "2 Ohms",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailSecondary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-stx-96-pro",
    name: "STX-96 PRO",
    slug: "stx-96-pro",
    category_id: "cat-processadores",
    subcategory_id: "sub-dsp",
    status: "ACTIVE",
    launch_date: "2025-08-21T00:00:00.000Z",
    description:
      "Processador digital com presets avançados e equalização em tempo real.",
    badge: "LANÇAMENTO",
    specifications: {
      sample_rate: "96kHz",
      inputs: "6",
      outputs: "8",
      frequency_response: "20Hz–20kHz",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailTertiary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-volcano-12k",
    name: "VOLCANO 12K",
    slug: "volcano-12k",
    category_id: "cat-subwoofers",
    subcategory_id: "sub-12-pol",
    status: "ACTIVE",
    launch_date: "2025-03-15T00:00:00.000Z",
    description:
      "Subwoofer de alta excursão para projetos SPL com grande deslocamento de ar.",
    badge: "DESTAQUE",
    specifications: {
      rms_power: "3000W RMS",
      diameter: '12"',
      impedance: "Dual 2 Ohms",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailSecondary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-sf-120a",
    name: "FONTE SF 120A",
    slug: "fonte-sf-120a",
    category_id: "cat-fontes-carregadores",
    subcategory_id: "sub-automotiva",
    status: "ACTIVE",
    launch_date: "2024-06-10T00:00:00.000Z",
    description:
      "Fonte chaveada para sistemas automotivos de alta demanda contínua.",
    badge: "DESTAQUE",
    markets: ["pt-BR"],
    specifications: {
      rms_power: "120A / 13.8V",
      output_current: "120A",
      output_voltage: "13.8V",
      protection: "Yes",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-st-350-4-mini",
    name: "ST-350.4 MINI",
    slug: "st-350-4-mini",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-full-range",
    status: "DISCONTINUED",
    launch_date: "2023-02-18T00:00:00.000Z",
    description:
      "Modelo compacto legado, mantido para histórico e suporte documental.",
    specifications: {
      rms_power: "4x 87W RMS",
      impedance: "4 Ohms",
      operating_class: "Class AB",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailTertiary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-ex-3000eq-bass",
    name: "EX-3000EQ BASS",
    slug: "ex-3000eq-bass",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-mono",
    status: "ACTIVE",
    launch_date: "2025-01-24T00:00:00.000Z",
    description:
      "Módulo mono de alta corrente para projetos SPL com subwoofers de grande deslocamento.",
    specifications: {
      rms_power: "1x 3000W RMS",
      impedance: "1 Ohm",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    badge: "DESTAQUE",
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-ir-400-4",
    name: "IR-400.4",
    slug: "ir-400-4",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-full-range",
    status: "ACTIVE",
    launch_date: "2024-08-12T00:00:00.000Z",
    description:
      "Amplificador full-range para sistemas compactos com excelente controle de médio e agudo.",
    markets: ["en", "es"],
    specifications: {
      rms_power: "4x 100W RMS",
      impedance: "2 Ohms",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailSecondary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-bravo-1600-1",
    name: "BRAVO 1600.1",
    slug: "bravo-1600-1",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-mono",
    status: "ACTIVE",
    launch_date: "2025-02-18T00:00:00.000Z",
    description:
      "Projetado para graves encorpados com estabilidade térmica para uso contínuo.",
    markets: ["pt-BR", "en"],
    specifications: {
      rms_power: "1x 1600W RMS",
      impedance: "2 Ohms",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailTertiary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-cl-2500-digital",
    name: "CL-2500 DIGITAL",
    slug: "cl-2500-digital",
    category_id: "cat-amplificadores",
    subcategory_id: "sub-full-range",
    status: "ACTIVE",
    launch_date: "2024-10-30T00:00:00.000Z",
    description:
      "Linha CL com DSP de ajuste fino para alta fidelidade em sistemas multivia.",
    specifications: {
      rms_power: "4x 625W RMS",
      impedance: "2 Ohms",
      operating_class: "Class D",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-stx-2448bt",
    name: "STX 2448BT",
    slug: "stx-2448bt",
    category_id: "cat-processadores",
    subcategory_id: "sub-dsp",
    status: "ACTIVE",
    launch_date: "2025-04-11T00:00:00.000Z",
    description:
      "Processador digital com conectividade Bluetooth e interface de ajuste em tempo real.",
    specifications: {
      sample_rate: "48kHz",
      inputs: "4",
      outputs: "8",
      connectivity: "Bluetooth 5.0",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailTertiary,
    badge: "LANÇAMENTO",
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-stx-3248-pro",
    name: "STX 3248 PRO",
    slug: "stx-3248-pro",
    category_id: "cat-processadores",
    subcategory_id: "sub-dsp",
    status: "ACTIVE",
    launch_date: "2024-09-03T00:00:00.000Z",
    description:
      "Processador para projetos profissionais com alinhamento de tempo e crossover avançado.",
    specifications: {
      sample_rate: "96kHz",
      inputs: "8",
      outputs: "12",
      frequency_response: "20Hz–22kHz",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailSecondary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-vulcan-15k",
    name: "VULCAN 15K",
    slug: "vulcan-15k",
    category_id: "cat-subwoofers",
    subcategory_id: "sub-12-pol",
    status: "ACTIVE",
    launch_date: "2025-01-08T00:00:00.000Z",
    description:
      "Subwoofer de alto desempenho para competições, com bobina reforçada e resposta rápida.",
    specifications: {
      rms_power: "3500W RMS",
      diameter: '12"',
      impedance: "Dual 1 Ohm",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    badge: "DESTAQUE",
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-sf-200a-pro",
    name: "FONTE SF 200A PRO",
    slug: "fonte-sf-200a-pro",
    category_id: "cat-fontes-carregadores",
    subcategory_id: "sub-automotiva",
    status: "ACTIVE",
    launch_date: "2025-03-02T00:00:00.000Z",
    description:
      "Fonte automotiva para sistemas de alta potência com proteção completa contra sobrecarga.",
    specifications: {
      rms_power: "200A / 13.8V",
      output_current: "200A",
      output_voltage: "13.8V",
      protection: "Yes",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailSecondary,
    badge: "LANÇAMENTO",
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-rca-pro-series",
    name: "RCA PRO SERIES",
    slug: "rca-pro-series",
    category_id: "cat-acessorios",
    status: "ACTIVE",
    launch_date: "2024-07-01T00:00:00.000Z",
    description:
      "Cabos RCA blindados para reduzir ruído e preservar dinâmica em sistemas de alta fidelidade.",
    specifications: {
      length: "5m",
      connectors: "Gold-plated",
      shielding: "Dual",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailTertiary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
  {
    id: "prod-kit-anl-200a",
    name: "KIT ANL 200A",
    slug: "kit-anl-200a",
    category_id: "cat-acessorios",
    status: "ACTIVE",
    launch_date: "2024-05-17T00:00:00.000Z",
    description:
      "Kit de fusível ANL e porta-fusível para instalações seguras de alta corrente.",
    specifications: {
      max_current: "200A",
      material: "Copper alloy",
      application: "Car audio",
    },
    thumbnail_url: CATALOG_ASSETS.thumbnailPrimary,
    created_at: NOW,
    updated_at: NOW,
    created_by: AUTHOR,
  },
];

export const CATALOG_PRODUCTS: Product[] = LEGACY_CATALOG_PRODUCTS.map(
  ({ specifications, ...product }) => {
    const variationLabels = toVariationLabels(
      specifications,
      PRODUCT_VARIATION_LABELS[product.id],
    );
    const variations: ProductVariation[] = variationLabels.map(
      (label, index) => ({
        id: `variation-${product.id}-${index + 1}`,
        label,
        order: index + 1,
        specs: toVariationSpecs(specifications, index),
      }),
    );

    const highlightAttributes = resolveHighlightAttributes(
      variations[0]?.specs ?? [],
    );

    return {
      ...product,
      variations,
      highlight_attributes: highlightAttributes,
    };
  },
);

export const CATALOG_PRODUCT_BLOCKS: ProductBlock[] = [
  {
    id: "blk-4000eq-image",
    product_id: "prod-st-4000eq-4c",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailPrimary, CATALOG_ASSETS.detailSecondary],
      caption: "Design robusto para alta entrega de potência.",
      layout: "grid",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-4000eq-text",
    product_id: "prod-st-4000eq-4c",
    type: "TEXT",
    order: 2,
    data: {
      title: "Performance sem limite",
      content:
        "Projetado para instalações exigentes, o ST-4000EQ entrega estabilidade e controle térmico.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-4000eq-video",
    product_id: "prod-st-4000eq-4c",
    type: "VIDEO",
    order: 3,
    data: {
      video_url: "https://www.youtube.com/watch?v=stetsom-demo-4000",
      title: "ST-4000EQ 4 Canais em ação",
      description: "Demonstração do módulo 4 canais com 4x1000W RMS.",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-2000eq-image",
    product_id: "prod-st-2000eq-mono",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailPrimary],
      caption: "Módulo mono para graves.",
      layout: "single",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-8004-text",
    product_id: "prod-st-800-4-compact",
    type: "TEXT",
    order: 1,
    data: {
      title: "Compacto e inteligente",
      content: "Excelente para projetos de upgrade sem sacrificar espaço.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-1200-video",
    product_id: "prod-st-1200-1d-bass",
    type: "VIDEO",
    order: 1,
    data: {
      video_url: "https://www.youtube.com/watch?v=stetsom-demo-1200",
      title: "Setup de graves com ST-1200.1D",
      description: "Exemplo de instalação com foco em SPL.",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-stx-html",
    product_id: "prod-stx-96-pro",
    type: "HTML",
    order: 1,
    data: {
      html: "<div><strong>DSP 96kHz</strong> com presets customizáveis.</div>",
      css_class: "prose",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-volcano-image",
    product_id: "prod-volcano-12k",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailSecondary],
      caption: "Subwoofer de alto deslocamento.",
      layout: "single",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-fonte-text",
    product_id: "prod-sf-120a",
    type: "TEXT",
    order: 1,
    data: {
      title: "Energia estável",
      content: "Fonte chaveada para sistemas de alta demanda contínua.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-350-mini-text",
    product_id: "prod-st-350-4-mini",
    type: "TEXT",
    order: 1,
    data: {
      title: "Modelo legado",
      content: "Produto descontinuado, disponível para referência técnica.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-ex3000-image",
    product_id: "prod-ex-3000eq-bass",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailPrimary],
      caption: "Módulo mono de alta corrente para projetos SPL.",
      layout: "single",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-ir400-image",
    product_id: "prod-ir-400-4",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailSecondary],
      caption: "Full-range compacto para controle de médio e agudo.",
      layout: "single",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-bravo-text",
    product_id: "prod-bravo-1600-1",
    type: "TEXT",
    order: 1,
    data: {
      title: "Graves encorpados",
      content:
        "Projetado para uso contínuo com estabilidade térmica e controle preciso de frequência.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-cl2500-image",
    product_id: "prod-cl-2500-digital",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailPrimary],
      caption: "Linha CL com DSP de ajuste fino para alta fidelidade.",
      layout: "single",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-stx2448-text",
    product_id: "prod-stx-2448bt",
    type: "TEXT",
    order: 1,
    data: {
      title: "Conectividade sem fio",
      content:
        "Interface Bluetooth para ajuste em tempo real diretamente do smartphone.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-stx3248-html",
    product_id: "prod-stx-3248-pro",
    type: "HTML",
    order: 1,
    data: {
      html: "<div><strong>DSP 96kHz</strong> com alinhamento de tempo, crossover avançado e 8 entradas / 12 saídas configuráveis.</div>",
      css_class: "prose",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-vulcan15-image",
    product_id: "prod-vulcan-15k",
    type: "IMAGE",
    order: 1,
    data: {
      images: [CATALOG_ASSETS.detailPrimary],
      caption: "Subwoofer de alto desempenho para competições.",
      layout: "single",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-sf200-text",
    product_id: "prod-sf-200a-pro",
    type: "TEXT",
    order: 1,
    data: {
      title: "Alta corrente",
      content:
        "Fonte automotiva com 200A contínuos e proteção completa contra sobrecarga e curto-circuito.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-rca-text",
    product_id: "prod-rca-pro-series",
    type: "TEXT",
    order: 1,
    data: {
      title: "Sinal limpo",
      content:
        "Blindagem dupla que elimina ruído e preserva a dinâmica original do sistema de áudio.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "blk-anl-text",
    product_id: "prod-kit-anl-200a",
    type: "TEXT",
    order: 1,
    data: {
      title: "Proteção essencial",
      content:
        "Kit fusível ANL 200A com porta-fusível em liga de cobre para instalações seguras de alta corrente.",
      align: "left",
    },
    created_by: AUTHOR,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const CATALOG_PRODUCT_FILES: ProductFile[] = [
  {
    id: "file-4000eq-manual-v1",
    product_id: "prod-st-4000eq-4c",
    file_url: "/docs/manual-st-4000eq.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-4000eq-catalog-v1",
    product_id: "prod-st-4000eq-4c",
    file_url: "/docs/catalogo-st-4000eq.pdf",
    type: "CATALOG",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-2000eq-manual-v1",
    product_id: "prod-st-2000eq-mono",
    file_url: "/docs/manual-st-2000eq.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-8004-manual-v1",
    product_id: "prod-st-800-4-compact",
    file_url: "/docs/manual-st-8004.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-1200-manual-v1",
    product_id: "prod-st-1200-1d-bass",
    file_url: "/docs/manual-st-1200.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-stx-manual-v1",
    product_id: "prod-stx-96-pro",
    file_url: "/docs/manual-stx-96-pro.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-volcano-manual-v1",
    product_id: "prod-volcano-12k",
    file_url: "/docs/manual-volcano-12k.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-fonte-manual-v1",
    product_id: "prod-sf-120a",
    file_url: "/docs/manual-fonte-sf120.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-350-manual-v1",
    product_id: "prod-st-350-4-mini",
    file_url: "/docs/manual-st-350-mini.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-ex3000-manual-v1",
    product_id: "prod-ex-3000eq-bass",
    file_url: "/docs/manual-ex-3000eq-bass.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-ir400-manual-v1",
    product_id: "prod-ir-400-4",
    file_url: "/docs/manual-ir-400-4.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-bravo-manual-v1",
    product_id: "prod-bravo-1600-1",
    file_url: "/docs/manual-bravo-1600-1.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-cl2500-manual-v1",
    product_id: "prod-cl-2500-digital",
    file_url: "/docs/manual-cl-2500-digital.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-stx2448-manual-v1",
    product_id: "prod-stx-2448bt",
    file_url: "/docs/manual-stx-2448bt.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-stx3248-manual-v1",
    product_id: "prod-stx-3248-pro",
    file_url: "/docs/manual-stx-3248-pro.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-vulcan15-manual-v1",
    product_id: "prod-vulcan-15k",
    file_url: "/docs/manual-vulcan-15k.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
  {
    id: "file-sf200-manual-v1",
    product_id: "prod-sf-200a-pro",
    file_url: "/docs/manual-fonte-sf200-pro.pdf",
    type: "MANUAL",
    version: 1,
    is_active: true,
    created_at: NOW,
    updated_at: NOW,
  },
];

export const FEATURED_PRODUCT_SLUGS = [
  "st-2000eq-mono",
  "st-800-4-compact",
  "st-1200-1d-bass",
  "stx-96-pro",
] as const;

export const PRODUCT_LINES = ["Vulcan", "Combat Line", "Digital Bass"] as const;

export const SPOTLIGHT_PRODUCT_SLUG = "st-4000eq-4-canais";
