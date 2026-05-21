import type {
  Category,
  Product,
  ProductBlock,
  Subcategory,
} from "@/lib/api/contracts";
import {
  CATALOG_CATEGORIES,
  CATALOG_PRODUCT_BLOCKS,
  CATALOG_PRODUCTS,
  CATALOG_SUBCATEGORIES,
} from "./catalog";

type LocaleMap = { "pt-BR": string; en: string; es: string };

function pick(map: LocaleMap, locale?: string): string {
  if (locale === "en") return map.en;
  if (locale === "es") return map.es;
  return map["pt-BR"];
}

// ─── Category names ───────────────────────────────────────────────────────────

const CATEGORY_NAMES: Record<string, LocaleMap> = {
  "cat-amplificadores": {
    "pt-BR": "Amplificadores",
    en: "Amplifiers",
    es: "Amplificadores",
  },
  "cat-processadores": {
    "pt-BR": "Processadores",
    en: "Processors",
    es: "Procesadores",
  },
  "cat-crossovers": {
    "pt-BR": "Crossovers",
    en: "Crossovers",
    es: "Crossovers",
  },
  "cat-controles": { "pt-BR": "Controles", en: "Controllers", es: "Controles" },
  "cat-fontes-carregadores": {
    "pt-BR": "Fontes e carregadores",
    en: "Power Supplies",
    es: "Fuentes y cargadores",
  },
  "cat-mesas-de-som": {
    "pt-BR": "Mesas de som",
    en: "Mixers",
    es: "Mesas de sonido",
  },
  "cat-acessorios": {
    "pt-BR": "Acessórios",
    en: "Accessories",
    es: "Accesorios",
  },
  "cat-subwoofers": {
    "pt-BR": "Subwoofers",
    en: "Subwoofers",
    es: "Subwoofers",
  },
};

const SUBCATEGORY_NAMES: Record<string, LocaleMap> = {
  "sub-full-range": {
    "pt-BR": "Full Range",
    en: "Full Range",
    es: "Full Range",
  },
  "sub-mono": { "pt-BR": "Mono", en: "Mono", es: "Mono" },
  "sub-dsp": { "pt-BR": "DSP", en: "DSP", es: "DSP" },
  "sub-12-pol": { "pt-BR": "12 Polegadas", en: "12 Inches", es: "12 Pulgadas" },
  "sub-automotiva": {
    "pt-BR": "Fonte Automotiva",
    en: "Automotive Power Supply",
    es: "Fuente Automotiva",
  },
};

export function getCatalogCategoriesForLocale(locale?: string): Category[] {
  return CATALOG_CATEGORIES.map((cat) => ({
    ...cat,
    name: CATEGORY_NAMES[cat.id]
      ? pick(CATEGORY_NAMES[cat.id], locale)
      : cat.name,
  }));
}

export function getCatalogSubcategoriesForLocale(
  locale?: string,
): Subcategory[] {
  return CATALOG_SUBCATEGORIES.map((sub) => ({
    ...sub,
    name: SUBCATEGORY_NAMES[sub.id]
      ? pick(SUBCATEGORY_NAMES[sub.id], locale)
      : sub.name,
  }));
}

// ─── Product badges ───────────────────────────────────────────────────────────

const BADGE_MAP: Record<string, LocaleMap> = {
  LANÇAMENTO: { "pt-BR": "LANÇAMENTO", en: "NEW", es: "LANZAMIENTO" },
  DESTAQUE: { "pt-BR": "DESTAQUE", en: "FEATURED", es: "DESTACADO" },
};

// ─── Product descriptions ─────────────────────────────────────────────────────

const PRODUCT_DESCRIPTIONS: Record<string, LocaleMap> = {
  "prod-st-4000eq-4c": {
    "pt-BR":
      "Amplificador 4 canais com alta eficiência para sistemas automotivos de média e alta potência.",
    en: "4-channel amplifier with high efficiency for mid- and high-power automotive audio systems.",
    es: "Amplificador de 4 canales de alta eficiencia para sistemas de audio automotivo de media y alta potencia.",
  },
  "prod-st-2000eq-mono": {
    "pt-BR": "Módulo mono para graves com resposta estável e alto rendimento.",
    en: "Mono module for bass with stable response and high efficiency.",
    es: "Módulo mono para graves con respuesta estable y alto rendimiento.",
  },
  "prod-st-800-4-compact": {
    "pt-BR":
      "Compacto, eficiente e ideal para projetos que priorizam espaço interno.",
    en: "Compact, efficient and ideal for projects that prioritize internal space.",
    es: "Compacto, eficiente e ideal para proyectos que priorizan el espacio interno.",
  },
  "prod-st-1200-1d-bass": {
    "pt-BR":
      "Projeto focado em graves com resposta rápida e controle térmico aprimorado.",
    en: "Bass-focused design with fast response and enhanced thermal control.",
    es: "Diseño enfocado en graves con respuesta rápida y control térmico mejorado.",
  },
  "prod-stx-96-pro": {
    "pt-BR":
      "Processador digital com presets avançados e equalização em tempo real.",
    en: "Digital processor with advanced presets and real-time equalization.",
    es: "Procesador digital con presets avanzados y ecualización en tiempo real.",
  },
  "prod-volcano-12k": {
    "pt-BR":
      "Subwoofer de alta excursão para projetos SPL com grande deslocamento de ar.",
    en: "High-excursion subwoofer for SPL builds with large air displacement.",
    es: "Subwoofer de alta excursión para proyectos SPL con gran desplazamiento de aire.",
  },
  "prod-sf-120a": {
    "pt-BR":
      "Fonte chaveada para sistemas automotivos de alta demanda contínua.",
    en: "Switched power supply for high-demand continuous automotive systems.",
    es: "Fuente conmutada para sistemas automotivos de alta demanda continua.",
  },
  "prod-st-350-4-mini": {
    "pt-BR":
      "Modelo compacto legado, mantido para histórico e suporte documental.",
    en: "Legacy compact model, kept for historical reference and documentation support.",
    es: "Modelo compacto legado, conservado como referencia histórica y soporte documental.",
  },
  "prod-ex-3000eq-bass": {
    "pt-BR":
      "Módulo mono de alta corrente para projetos SPL com subwoofers de grande deslocamento.",
    en: "High-current mono module for SPL builds with large-excursion subwoofers.",
    es: "Módulo mono de alta corriente para proyectos SPL con subwoofers de gran desplazamiento.",
  },
  "prod-ir-400-4": {
    "pt-BR":
      "Amplificador full-range para sistemas compactos com excelente controle de médio e agudo.",
    en: "Full-range amplifier for compact systems with excellent midrange and treble control.",
    es: "Amplificador full-range para sistemas compactos con excelente control de medios y agudos.",
  },
  "prod-bravo-1600-1": {
    "pt-BR":
      "Projetado para graves encorpados com estabilidade térmica para uso contínuo.",
    en: "Designed for rich bass response with thermal stability for continuous use.",
    es: "Diseñado para graves pronunciados con estabilidad térmica para uso continuo.",
  },
  "prod-cl-2500-digital": {
    "pt-BR":
      "Linha CL com DSP de ajuste fino para alta fidelidade em sistemas multivia.",
    en: "CL line with fine-tuned DSP for high fidelity in multi-way systems.",
    es: "Línea CL con DSP de ajuste fino para alta fidelidad en sistemas multivia.",
  },
  "prod-stx-2448bt": {
    "pt-BR":
      "Processador digital com conectividade Bluetooth e interface de ajuste em tempo real.",
    en: "Digital processor with Bluetooth connectivity and real-time adjustment interface.",
    es: "Procesador digital con conectividad Bluetooth e interfaz de ajuste en tiempo real.",
  },
  "prod-stx-3248-pro": {
    "pt-BR":
      "Processador para projetos profissionais com alinhamento de tempo e crossover avançado.",
    en: "Processor for professional builds with time alignment and advanced crossover.",
    es: "Procesador para proyectos profesionales con alineación de tiempo y crossover avanzado.",
  },
  "prod-vulcan-15k": {
    "pt-BR":
      "Subwoofer de alto desempenho para competições, com bobina reforçada e resposta rápida.",
    en: "High-performance subwoofer for competitions, with reinforced coil and fast response.",
    es: "Subwoofer de alto rendimiento para competiciones, con bobina reforzada y respuesta rápida.",
  },
  "prod-sf-200a-pro": {
    "pt-BR":
      "Fonte automotiva para sistemas de alta potência com proteção completa contra sobrecarga.",
    en: "Automotive power supply for high-power systems with full overload protection.",
    es: "Fuente de alimentación automotiva para sistemas de alta potencia con protección completa contra sobrecarga.",
  },
  "prod-rca-pro-series": {
    "pt-BR":
      "Cabos RCA blindados para reduzir ruído e preservar dinâmica em sistemas de alta fidelidade.",
    en: "Shielded RCA cables to reduce noise and preserve dynamics in high-fidelity systems.",
    es: "Cables RCA blindados para reducir el ruido y preservar la dinámica en sistemas de alta fidelidad.",
  },
  "prod-kit-anl-200a": {
    "pt-BR":
      "Kit de fusível ANL e porta-fusível para instalações seguras de alta corrente.",
    en: "ANL fuse and fuse holder kit for safe high-current installations.",
    es: "Kit de fusible ANL y portafusible para instalaciones seguras de alta corriente.",
  },
};

export function getCatalogProductsForLocale(locale?: string): Product[] {
  return CATALOG_PRODUCTS.map((product) => {
    const descMap = PRODUCT_DESCRIPTIONS[product.id];
    const badgeMap = product.badge ? BADGE_MAP[product.badge] : undefined;
    return {
      ...product,
      description: descMap ? pick(descMap, locale) : product.description,
      badge: badgeMap ? pick(badgeMap, locale) : product.badge,
    };
  });
}

// ─── Block content ────────────────────────────────────────────────────────────

type BlockContentMap = {
  caption?: LocaleMap;
  title?: LocaleMap;
  content?: LocaleMap;
  description?: LocaleMap;
  html?: LocaleMap;
};

const BLOCK_CONTENT: Record<string, BlockContentMap> = {
  "blk-4000eq-image": {
    caption: {
      "pt-BR": "Design robusto para alta entrega de potência.",
      en: "Robust design for high power delivery.",
      es: "Diseño robusto para alta entrega de potencia.",
    },
  },
  "blk-4000eq-text": {
    title: {
      "pt-BR": "Performance sem limite",
      en: "Unlimited Performance",
      es: "Rendimiento sin límites",
    },
    content: {
      "pt-BR":
        "Projetado para instalações exigentes, o ST-4000EQ entrega estabilidade e controle térmico.",
      en: "Designed for demanding installations, the ST-4000EQ delivers stability and thermal control.",
      es: "Diseñado para instalaciones exigentes, el ST-4000EQ ofrece estabilidad y control térmico.",
    },
  },
  "blk-4000eq-video": {
    title: {
      "pt-BR": "ST-4000EQ 4 Canais em ação",
      en: "ST-4000EQ 4 Channels in action",
      es: "ST-4000EQ 4 Canales en acción",
    },
    description: {
      "pt-BR": "Demonstração do módulo 4 canais com 4x1000W RMS.",
      en: "Demonstration of the 4-channel module with 4×1000W RMS.",
      es: "Demostración del módulo de 4 canales con 4×1000W RMS.",
    },
  },
  "blk-2000eq-image": {
    caption: {
      "pt-BR": "Módulo mono para graves.",
      en: "Mono module for bass.",
      es: "Módulo mono para graves.",
    },
  },
  "blk-8004-text": {
    title: {
      "pt-BR": "Compacto e inteligente",
      en: "Compact and smart",
      es: "Compacto e inteligente",
    },
    content: {
      "pt-BR": "Excelente para projetos de upgrade sem sacrificar espaço.",
      en: "Excellent for upgrade projects without sacrificing space.",
      es: "Excelente para proyectos de actualización sin sacrificar espacio.",
    },
  },
  "blk-1200-video": {
    title: {
      "pt-BR": "Setup de graves com ST-1200.1D",
      en: "Bass setup with ST-1200.1D",
      es: "Setup de graves con ST-1200.1D",
    },
    description: {
      "pt-BR": "Exemplo de instalação com foco em SPL.",
      en: "Installation example focused on SPL.",
      es: "Ejemplo de instalación con enfoque en SPL.",
    },
  },
  "blk-stx-html": {
    html: {
      "pt-BR":
        "<div><strong>DSP 96kHz</strong> com presets customizáveis.</div>",
      en: "<div><strong>DSP 96kHz</strong> with customizable presets.</div>",
      es: "<div><strong>DSP 96kHz</strong> con presets personalizables.</div>",
    },
  },
  "blk-volcano-image": {
    caption: {
      "pt-BR": "Subwoofer de alto deslocamento.",
      en: "High-displacement subwoofer.",
      es: "Subwoofer de alto desplazamiento.",
    },
  },
  "blk-fonte-text": {
    title: {
      "pt-BR": "Energia estável",
      en: "Stable power",
      es: "Energía estable",
    },
    content: {
      "pt-BR": "Fonte chaveada para sistemas de alta demanda contínua.",
      en: "Switched power supply for high continuous demand systems.",
      es: "Fuente conmutada para sistemas de alta demanda continua.",
    },
  },
  "blk-350-mini-text": {
    title: {
      "pt-BR": "Modelo legado",
      en: "Legacy model",
      es: "Modelo legado",
    },
    content: {
      "pt-BR": "Produto descontinuado, disponível para referência técnica.",
      en: "Discontinued product, available for technical reference.",
      es: "Producto descontinuado, disponible para referencia técnica.",
    },
  },
  "blk-ex3000-image": {
    caption: {
      "pt-BR": "Módulo mono de alta corrente para projetos SPL.",
      en: "High-current mono module for SPL builds.",
      es: "Módulo mono de alta corriente para proyectos SPL.",
    },
  },
  "blk-ir400-image": {
    caption: {
      "pt-BR": "Full-range compacto para controle de médio e agudo.",
      en: "Compact full-range for midrange and treble control.",
      es: "Full-range compacto para control de medios y agudos.",
    },
  },
  "blk-bravo-text": {
    title: {
      "pt-BR": "Graves encorpados",
      en: "Rich bass",
      es: "Graves pronunciados",
    },
    content: {
      "pt-BR":
        "Projetado para uso contínuo com estabilidade térmica e controle preciso de frequência.",
      en: "Designed for continuous use with thermal stability and precise frequency control.",
      es: "Diseñado para uso continuo con estabilidad térmica y control preciso de frecuencia.",
    },
  },
  "blk-cl2500-image": {
    caption: {
      "pt-BR": "Linha CL com DSP de ajuste fino para alta fidelidade.",
      en: "CL line with fine-tuned DSP for high fidelity.",
      es: "Línea CL con DSP de ajuste fino para alta fidelidad.",
    },
  },
  "blk-stx2448-text": {
    title: {
      "pt-BR": "Conectividade sem fio",
      en: "Wireless connectivity",
      es: "Conectividad inalámbrica",
    },
    content: {
      "pt-BR":
        "Interface Bluetooth para ajuste em tempo real diretamente do smartphone.",
      en: "Bluetooth interface for real-time adjustment directly from your smartphone.",
      es: "Interfaz Bluetooth para ajuste en tiempo real directamente desde el smartphone.",
    },
  },
  "blk-stx3248-html": {
    html: {
      "pt-BR":
        "<div><strong>DSP 96kHz</strong> com alinhamento de tempo, crossover avançado e 8 entradas / 12 saídas configuráveis.</div>",
      en: "<div><strong>DSP 96kHz</strong> with time alignment, advanced crossover and 8 inputs / 12 configurable outputs.</div>",
      es: "<div><strong>DSP 96kHz</strong> con alineación de tiempo, crossover avanzado y 8 entradas / 12 salidas configurables.</div>",
    },
  },
  "blk-vulcan15-image": {
    caption: {
      "pt-BR": "Subwoofer de alto desempenho para competições.",
      en: "High-performance subwoofer for competitions.",
      es: "Subwoofer de alto rendimiento para competiciones.",
    },
  },
  "blk-sf200-text": {
    title: {
      "pt-BR": "Alta corrente",
      en: "High current",
      es: "Alta corriente",
    },
    content: {
      "pt-BR":
        "Fonte automotiva com 200A contínuos e proteção completa contra sobrecarga e curto-circuito.",
      en: "Automotive power supply with 200A continuous and full protection against overload and short circuit.",
      es: "Fuente automotiva con 200A continuos y protección completa contra sobrecarga y cortocircuito.",
    },
  },
  "blk-rca-text": {
    title: { "pt-BR": "Sinal limpo", en: "Clean signal", es: "Señal limpia" },
    content: {
      "pt-BR":
        "Blindagem dupla que elimina ruído e preserva a dinâmica original do sistema de áudio.",
      en: "Double shielding that eliminates noise and preserves the original dynamics of the audio system.",
      es: "Blindaje doble que elimina el ruido y preserva la dinámica original del sistema de audio.",
    },
  },
  "blk-anl-text": {
    title: {
      "pt-BR": "Proteção essencial",
      en: "Essential protection",
      es: "Protección esencial",
    },
    content: {
      "pt-BR":
        "Kit fusível ANL 200A com porta-fusível em liga de cobre para instalações seguras de alta corrente.",
      en: "ANL 200A fuse kit with copper alloy fuse holder for safe high-current installations.",
      es: "Kit fusible ANL 200A con portafusible de aleación de cobre para instalaciones seguras de alta corriente.",
    },
  },
};

export function getCatalogBlocksForLocale(locale?: string): ProductBlock[] {
  return CATALOG_PRODUCT_BLOCKS.map((block) => {
    const map = BLOCK_CONTENT[block.id];
    if (!map) return block;

    if (block.type === "IMAGE") {
      return {
        ...block,
        data: {
          ...block.data,
          ...(map.caption ? { caption: pick(map.caption, locale) } : {}),
        },
      };
    }
    if (block.type === "TEXT") {
      return {
        ...block,
        data: {
          ...block.data,
          ...(map.title ? { title: pick(map.title, locale) } : {}),
          ...(map.content ? { content: pick(map.content, locale) } : {}),
        },
      };
    }
    if (block.type === "VIDEO") {
      return {
        ...block,
        data: {
          ...block.data,
          ...(map.title ? { title: pick(map.title, locale) } : {}),
          ...(map.description
            ? { description: pick(map.description, locale) }
            : {}),
        },
      };
    }
    if (block.type === "HTML") {
      return {
        ...block,
        data: {
          ...block.data,
          ...(map.html ? { html: pick(map.html, locale) } : {}),
        },
      };
    }
    return block;
  });
}
