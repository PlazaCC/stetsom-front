import type {
  DocumentationCategory,
  FAQItem,
  SupportCard,
  SupportPayload,
} from "@/lib/api/contracts";
import {
  SUPPORT_FAQ_ITEMS,
  SUPPORT_SERVICE_CENTERS,
  SUPPORT_PAYLOAD,
} from "./support";

// ─── English ──────────────────────────────────────────────────────────────────

const SUPPORT_HERO_EN: SupportPayload["hero"] = {
  ...SUPPORT_PAYLOAD.hero,
  label: "Help Center",
  title: "HOW CAN WE\nHELP YOU",
  description:
    "Our technical team is ready to help you get the most out of your Stetsom products.",
};

const SUPPORT_CARDS_EN: SupportCard[] = [
  {
    id: "manuais-downloads",
    title: "Manuals & Downloads",
    description:
      "Access technical manuals, catalogs, product photos, logos and official Stetsom wallpapers.",
    cta: "Access",
  },
  {
    id: "postos-autorizados",
    title: "Authorized Centers",
    description:
      "Find the nearest authorized service center by ZIP code or city.",
    cta: "Locate",
  },
  {
    id: "fale-conosco",
    title: "Contact Us",
    description:
      "Get in touch with our technical support team to clarify questions and resolve issues.",
    cta: "Contact",
  },
];

// IDs match DocFile['type'] values returned by the API (MANUAL/CATALOG/CERTIFICATE/IMAGE).
// Labels mirror getDocCategoryLabel() in src/domains/site/constants/doc-category-labels.ts.
const SUPPORT_DOC_CATEGORIES_EN: DocumentationCategory[] = [
  { id: "MANUAL", label: "Manuals" },
  { id: "CATALOG", label: "Product Catalogs" },
  { id: "CERTIFICATE", label: "Certificates" },
  { id: "IMAGE", label: "Photos & Logos" },
];

const SUPPORT_CONTACT_EN: SupportPayload["contact"] = {
  label: "Contact",
  title: "Contact Us",
  description: "Fill in the form below and our team will respond shortly.",
};

const SUPPORT_FAQ_ITEMS_EN: FAQItem[] = [
  {
    id: "sup-faq-instalacao",
    q: "How do I install my amplifier?",
    a: "Follow the manual included with the product and, for best results, look for an authorized Stetsom installer.",
  },
  {
    id: "sup-faq-impedancia",
    q: "What is the difference between 1 Ohm and 2 Ohms?",
    a: "Lower impedances allow higher power output, as long as the system is sized for that load.",
  },
  {
    id: "sup-faq-garantia",
    q: "How do I check the warranty?",
    a: "At Stetsom's warranty center, enter the serial number to check coverage and status.",
  },
  {
    id: "sup-faq-distribuidores",
    q: "Where can I find authorized distributors?",
    a: "We have over 500 distributors in Brazil. Use the locator in the support center itself.",
  },
  {
    id: "sup-faq-processador",
    q: "What is the difference between an amplifier and a processor?",
    a: "Amplifiers amplify audio signals. Processors work on pre-amplification and frequency control.",
  },
  {
    id: "sup-faq-fonte",
    q: "Can I use a different power supply than the recommended one?",
    a: "We recommend using Stetsom power supplies with equal specifications. Other brands may damage the equipment.",
  },
];

const SUPPORT_FAQ_EN: SupportPayload["faq"] = {
  label: "FAQ",
  title: "FREQUENTLY ASKED QUESTIONS",
  items: SUPPORT_FAQ_ITEMS_EN,
  supportButtonLabel: "Talk to support",
};

// ─── Spanish ──────────────────────────────────────────────────────────────────

const SUPPORT_HERO_ES: SupportPayload["hero"] = {
  ...SUPPORT_PAYLOAD.hero,
  label: "Centro de ayuda",
  title: "CÓMO PODEMOS\nAYUDARTE",
  description:
    "Nuestro equipo técnico está listo para ayudarte a sacar el máximo partido de tus productos Stetsom.",
};

const SUPPORT_CARDS_ES: SupportCard[] = [
  {
    id: "manuais-downloads",
    title: "Manuales y Descargas",
    description:
      "Accede a manuales técnicos, catálogos, fotos de productos, logos y wallpapers oficiales de Stetsom.",
    cta: "Acceder",
  },
  {
    id: "postos-autorizados",
    title: "Centros Autorizados",
    description:
      "Encuentra el centro de servicio técnico autorizado más cercano por código postal o ciudad.",
    cta: "Localizar",
  },
  {
    id: "fale-conosco",
    title: "Contáctanos",
    description:
      "Ponte en contacto con nuestro equipo de soporte técnico para aclarar dudas y resolver problemas.",
    cta: "Contacto",
  },
];

// IDs match DocFile['type'] values returned by the API (MANUAL/CATALOG/CERTIFICATE/IMAGE).
// Labels mirror getDocCategoryLabel() in src/domains/site/constants/doc-category-labels.ts.
const SUPPORT_DOC_CATEGORIES_ES: DocumentationCategory[] = [
  { id: "MANUAL", label: "Manuales" },
  { id: "CATALOG", label: "Catálogos de productos" },
  { id: "CERTIFICATE", label: "Certificados" },
  { id: "IMAGE", label: "Fotos y logos" },
];

const SUPPORT_CONTACT_ES: SupportPayload["contact"] = {
  label: "Contacto",
  title: "Contáctanos",
  description:
    "Complete el formulario a continuación y nuestro equipo responderá en breve.",
};

const SUPPORT_FAQ_ITEMS_ES: FAQItem[] = [
  {
    id: "sup-faq-instalacao",
    q: "¿Cómo instalo mi amplificador?",
    a: "Siga el manual incluido con el producto y, para obtener mejores resultados, busque un instalador autorizado Stetsom.",
  },
  {
    id: "sup-faq-impedancia",
    q: "¿Cuál es la diferencia entre 1 Ohm y 2 Ohms?",
    a: "Impedancias menores permiten mayor potencia de salida, siempre que el sistema esté dimensionado para esa carga.",
  },
  {
    id: "sup-faq-garantia",
    q: "¿Cómo verifico la garantía?",
    a: "En el centro de garantía de Stetsom, ingrese el número de serie para consultar cobertura y estado.",
  },
  {
    id: "sup-faq-distribuidores",
    q: "¿Dónde encontrar distribuidores autorizados?",
    a: "Tenemos más de 500 distribuidores en Brasil. Use el localizador en la central de soporte.",
  },
  {
    id: "sup-faq-processador",
    q: "¿Cuál es la diferencia entre amplificador y procesador?",
    a: "Los amplificadores amplían señales de audio. Los procesadores trabajan en la preamplificación y el control de frecuencia.",
  },
  {
    id: "sup-faq-fonte",
    q: "¿Puedo usar una fuente diferente a la recomendada?",
    a: "Recomendamos usar fuentes Stetsom de especificaciones iguales. Otras marcas pueden dañar el equipo.",
  },
];

const SUPPORT_FAQ_ES: SupportPayload["faq"] = {
  label: "Preguntas",
  title: "PREGUNTAS FRECUENTES",
  items: SUPPORT_FAQ_ITEMS_ES,
  supportButtonLabel: "Hablar con soporte",
};

// ─── Locale selector ──────────────────────────────────────────────────────────

type LocaleContentMap<T> = { "pt-BR": T; en: T; es: T };

function selectLocale<T>(
  map: LocaleContentMap<T>,
  locale: string | undefined,
): T {
  if (locale === "en") return map.en;
  if (locale === "es") return map.es;
  return map["pt-BR"];
}

export function getSupportPayloadForLocale(locale?: string): SupportPayload {
  return {
    ...SUPPORT_PAYLOAD,
    hero: selectLocale(
      {
        "pt-BR": SUPPORT_PAYLOAD.hero,
        en: SUPPORT_HERO_EN,
        es: SUPPORT_HERO_ES,
      },
      locale,
    ),
    cards: selectLocale(
      {
        "pt-BR": SUPPORT_PAYLOAD.cards,
        en: SUPPORT_CARDS_EN,
        es: SUPPORT_CARDS_ES,
      },
      locale,
    ),
    documentationCategories: selectLocale(
      {
        "pt-BR": SUPPORT_PAYLOAD.documentationCategories,
        en: SUPPORT_DOC_CATEGORIES_EN,
        es: SUPPORT_DOC_CATEGORIES_ES,
      },
      locale,
    ),
    contact: selectLocale(
      {
        "pt-BR": SUPPORT_PAYLOAD.contact,
        en: SUPPORT_CONTACT_EN,
        es: SUPPORT_CONTACT_ES,
      },
      locale,
    ),
    faq: selectLocale(
      {
        "pt-BR": {
          label: "DÚVIDAS",
          title: "PERGUNTAS FREQUENTES",
          items: SUPPORT_FAQ_ITEMS,
          supportButtonLabel: "Falar com suporte",
        },
        en: SUPPORT_FAQ_EN,
        es: SUPPORT_FAQ_ES,
      },
      locale,
    ),
    serviceCenters: SUPPORT_SERVICE_CENTERS,
  };
}
