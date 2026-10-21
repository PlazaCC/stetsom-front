import type { GetApiLibraryType, PageBlockType } from "@/api/stetsom/model";
import {
  Building2,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  LayoutTemplate,
  List,
  MapPin,
  Phone,
  Share2,
  type LucideIcon,
} from "lucide-react";

// Field spec interpreted by SectionFormRenderer; keys map 1:1 to block.data in page-blocks.ts.
export type FieldSpec =
  | {
      kind: "i18n";
      key: string;
      label: string;
      multiline?: boolean;
      inputType?: "text" | "url";
      placeholder?: string;
      /** Per-locale check run in the form and before saving. */
      validate?: "video-link";
    }
  | {
      kind: "text";
      key: string;
      label: string;
      inputType?: "text" | "url" | "tel" | "email";
      placeholder?: string;
    }
  | {
      kind: "select";
      key: string;
      label: string;
      options: { value: string; label: string }[];
    }
  | {
      kind: "asset";
      /** The URL field name persisted on data (e.g. `image_url`, `url`). */
      key: string;
      label: string;
      assetType?: GetApiLibraryType;
      /** Types the picker lists; defaults to `assetType`. */
      listTypes?: GetApiLibraryType[];
      variant?: "image" | "file";
      accept?: string;
    }
  | {
      kind: "list";
      key: string;
      label: string;
      addLabel: string;
      itemFields: FieldSpec[];
      /** Field key used as the row title preview. */
      itemTitleKey?: string;
    }
  | {
      kind: "stringList";
      key: string;
      label: string;
      addLabel: string;
      placeholder?: string;
    }
  | { kind: "group"; key: string; label: string; fields: FieldSpec[] }
  | { kind: "featured-tabs"; key: string; label: string }
  | {
      kind: "faq-items";
      key: string;
      label: string;
      addLabel: string;
      itemFields: FieldSpec[];
      itemTitleKey?: string;
    };

export interface SectionDef {
  /** Persisted `section_id` — must match what the public page reads. */
  section_id: string;
  /** Persisted block type (model enum). */
  type: PageBlockType;
  label: string;
  description?: string;
  icon: LucideIcon;
  // "auto" = content filled by backend/API; only text/CTA fields here are editable.
  kind: "editable" | "auto";
  autoNote?: string;
  fields: FieldSpec[];
  /**
   * Splits one stored block into several editor tabs, for content the site
   * shows in different places. Each view edits only its `fieldKeys`; the
   * block is still saved whole.
   */
  views?: SectionView[];
}

export interface SectionView {
  /** Tab id is `${section_id}:${id}` — also the preview's editor target. */
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  fieldKeys: string[];
}

/** One tab of the page editor: a whole section, or one view of it. */
export interface SectionNavEntry {
  id: string;
  section_id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  fields: FieldSpec[];
  def: SectionDef;
}

const ICON_OPTIONS = [
  { value: "zap", label: "Raio (Potência)" },
  { value: "shield-check", label: "Escudo (Qualidade)" },
  { value: "rocket", label: "Foguete (Inovação)" },
];

const VIDEO_ACCEPT = "video/mp4,video/webm";

const FILE_TYPE_OPTIONS = [
  { value: "PDF", label: "PDF" },
  { value: "MANUAL", label: "Manual" },
  { value: "CATALOG", label: "Catálogo" },
  { value: "CERTIFICATE", label: "Certificado" },
];

const socialFields: FieldSpec[] = [
  {
    kind: "text",
    key: "handle",
    label: "Perfil (@handle)",
    placeholder: "@stetsombrasil",
  },
  { kind: "i18n", key: "title", label: "Título" },
  { kind: "i18n", key: "subtitle", label: "Subtítulo", multiline: true },
  { kind: "i18n", key: "ctaLabel", label: "Texto do botão" },
  {
    kind: "text",
    key: "ctaHref",
    label: "Link do botão",
    inputType: "url",
    placeholder: "https://instagram.com/...",
  },
];

// Fixed catalog per page — only known sections (renderable by the public site) are listed.
export const PAGE_SECTIONS: Record<string, SectionDef[]> = {
  home: [
    {
      section_id: "featured",
      type: "TEXT",
      label: "Destaques",
      description:
        "Configure as categorias e os produtos publicados exibidos na Home.",
      icon: List,
      kind: "editable",
      fields: [
        { kind: "featured-tabs", key: "tabs", label: "Abas por categoria" },
      ],
    },
    {
      section_id: "history",
      type: "IMAGE",
      label: "Nossa história",
      icon: LayoutTemplate,
      kind: "editable",
      fields: [
        { kind: "asset", key: "image_url", label: "Imagem", variant: "image" },
        { kind: "text", key: "imageAlt", label: "Texto alternativo da imagem" },
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        { kind: "i18n", key: "subtitle", label: "Subtítulo", multiline: true },
        { kind: "i18n", key: "ctaLabel", label: "Texto do botão" },
        {
          kind: "text",
          key: "ctaHref",
          label: "Link do botão",
          inputType: "url",
          placeholder: "/sobre",
        },
      ],
    },
    {
      section_id: "faq",
      type: "FAQ",
      label: "Perguntas frequentes",
      icon: HelpCircle,
      kind: "editable",
      fields: [
        {
          kind: "group",
          key: "section",
          label: "Cabeçalho da seção",
          fields: [
            { kind: "i18n", key: "label", label: "Rótulo" },
            { kind: "i18n", key: "title", label: "Título" },
            {
              kind: "i18n",
              key: "subtitle",
              label: "Subtítulo",
              multiline: true,
            },
            { kind: "i18n", key: "ctaLabel", label: "Texto do botão" },
            {
              kind: "text",
              key: "ctaHref",
              label: "Link do botão",
              inputType: "url",
              placeholder: "/suporte",
            },
            {
              kind: "text",
              key: "maxItems",
              label: "Máximo de itens visíveis",
              inputType: "text",
              placeholder: "3",
            },
          ],
        },
        {
          kind: "faq-items",
          key: "items",
          label: "Perguntas",
          addLabel: "Adicionar pergunta",
          itemTitleKey: "q",
          itemFields: [
            { kind: "i18n", key: "q", label: "Pergunta" },
            { kind: "i18n", key: "a", label: "Resposta", multiline: true },
          ],
        },
      ],
    },
    {
      section_id: "social",
      type: "GALLERY",
      label: "Mídias sociais",
      icon: Share2,
      kind: "auto",
      autoNote:
        "As publicações são puxadas automaticamente do Instagram. Aqui você edita apenas os textos e o link do perfil.",
      fields: socialFields,
    },
  ],
  about: [
    {
      section_id: "hero",
      type: "IMAGE",
      label: "Destaque (hero)",
      icon: ImageIcon,
      kind: "editable",
      fields: [
        {
          kind: "asset",
          key: "url",
          label: "Imagem de fundo",
          variant: "image",
        },
        { kind: "text", key: "imageAlt", label: "Texto alternativo da imagem" },
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        {
          kind: "text",
          key: "foundedYear",
          label: "Ano de fundação",
          placeholder: "1989",
        },
        {
          kind: "list",
          key: "stats",
          label: "Indicadores",
          addLabel: "Adicionar indicador",
          itemTitleKey: "value",
          itemFields: [
            {
              kind: "text",
              key: "value",
              label: "Valor",
              placeholder: "35+",
            },
            { kind: "i18n", key: "label", label: "Rótulo" },
          ],
        },
        {
          kind: "stringList",
          key: "milestones",
          label: "Palavras-chave (marquee)",
          addLabel: "Adicionar palavra",
          placeholder: "POTÊNCIA",
        },
      ],
    },
    {
      section_id: "quality",
      type: "IMAGE",
      label: "Quem somos",
      description:
        "Vídeo de fundo com título e botão Play (abre o vídeo num modal — arquivo, ou link YouTube/Vimeo por idioma); abaixo, texto centralizado e os cards de valores (editados na aba “Valores”, logo ao lado).",
      icon: LayoutTemplate,
      kind: "editable",
      fields: [
        {
          kind: "asset",
          key: "video_url",
          label: "Vídeo de fundo (loop, sem som)",
          variant: "file",
          assetType: "VIDEO",
          accept: VIDEO_ACCEPT,
        },
        {
          kind: "asset",
          key: "fullVideo_url",
          label:
            "Vídeo do botão Play (opcional — usa o vídeo de fundo se vazio)",
          variant: "file",
          assetType: "VIDEO",
          accept: VIDEO_ACCEPT,
        },
        {
          kind: "i18n",
          key: "fullVideoLink",
          label:
            "Link do vídeo do botão Play por idioma — YouTube ou Vimeo (opcional; EN/ES vazios usam o PT; tem prioridade sobre o arquivo)",
          inputType: "url",
          placeholder: "https://www.youtube.com/watch?v=...",
          validate: "video-link",
        },
        {
          kind: "asset",
          key: "image_url",
          label: "Imagem de capa (exibida enquanto o vídeo carrega)",
          variant: "image",
        },
        { kind: "text", key: "imageAlt", label: "Texto alternativo da imagem" },
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        { kind: "i18n", key: "playLabel", label: "Texto do botão Play" },
        {
          kind: "i18n",
          key: "description",
          label: "Texto centralizado (abaixo do vídeo)",
          multiline: true,
        },
      ],
    },
    {
      section_id: "values",
      type: "CARDS",
      label: "Valores e bases",
      icon: List,
      kind: "editable",
      // On the site the value cards sit under "Quem somos" and the bases come
      // after the timeline, so each gets its own tab in that position.
      views: [
        {
          id: "items",
          label: "Valores",
          description:
            "Cards exibidos logo abaixo do texto de “Quem somos” (ex.: Potência, Qualidade, Inovação).",
          fieldKeys: ["items"],
        },
        {
          id: "bases",
          label: "Bases",
          description:
            "Fundamentos exibidos depois da linha do tempo (ex.: Excelência, Compromisso, Inovação contínua).",
          fieldKeys: ["bases"],
        },
      ],
      fields: [
        {
          kind: "list",
          key: "items",
          label: "Valores",
          addLabel: "Adicionar valor",
          itemTitleKey: "title",
          itemFields: [
            {
              kind: "select",
              key: "icon",
              label: "Ícone",
              options: ICON_OPTIONS,
            },
            { kind: "i18n", key: "title", label: "Título" },
            {
              kind: "i18n",
              key: "description",
              label: "Descrição",
              multiline: true,
            },
          ],
        },
        {
          kind: "list",
          key: "bases",
          label: "Bases (fundamentos)",
          addLabel: "Adicionar base",
          itemTitleKey: "title",
          itemFields: [
            { kind: "i18n", key: "title", label: "Título" },
            {
              kind: "i18n",
              key: "description",
              label: "Descrição",
              multiline: true,
            },
          ],
        },
      ],
    },
    {
      section_id: "timeline",
      type: "TIMELINE",
      label: "Linha do tempo",
      icon: LayoutTemplate,
      kind: "editable",
      fields: [
        {
          kind: "list",
          key: "events",
          label: "Marcos",
          addLabel: "Adicionar marco",
          itemTitleKey: "year",
          itemFields: [
            {
              kind: "text",
              key: "year",
              label: "Ano",
              placeholder: "1989",
            },
            { kind: "i18n", key: "title", label: "Título" },
            { kind: "i18n", key: "shortTitle", label: "Título curto" },
            {
              kind: "i18n",
              key: "description",
              label: "Descrição",
              multiline: true,
            },
            {
              kind: "asset",
              key: "image_url",
              label: "Imagem",
              variant: "image",
            },
            {
              kind: "text",
              key: "imageAlt",
              label: "Texto alternativo da imagem",
            },
          ],
        },
      ],
    },
    {
      section_id: "social",
      type: "GALLERY",
      label: "Mídias sociais",
      icon: Share2,
      kind: "auto",
      autoNote:
        "As publicações são puxadas automaticamente do Instagram. Aqui você edita apenas os textos e o link do perfil.",
      fields: socialFields,
    },
    {
      section_id: "jobs-cta",
      type: "IMAGE",
      label: "Trabalhe conosco",
      icon: Building2,
      kind: "editable",
      fields: [
        { kind: "asset", key: "image_url", label: "Imagem", variant: "image" },
        { kind: "text", key: "imageAlt", label: "Texto alternativo da imagem" },
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        {
          kind: "i18n",
          key: "description",
          label: "Descrição",
          multiline: true,
        },
        { kind: "i18n", key: "buttonLabel", label: "Texto do botão" },
        {
          kind: "text",
          key: "buttonHref",
          label: "Link do botão",
          inputType: "url",
          placeholder: "https://...",
        },
      ],
    },
  ],
  support: [
    {
      section_id: "hero",
      type: "IMAGE",
      label: "Destaque (hero)",
      icon: ImageIcon,
      kind: "editable",
      fields: [
        {
          kind: "asset",
          key: "image_url",
          label: "Imagem de fundo",
          variant: "image",
        },
        { kind: "text", key: "badge", label: "Selo (badge)" },
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        { kind: "i18n", key: "subtitle", label: "Subtítulo" },
        {
          kind: "i18n",
          key: "description",
          label: "Descrição",
          multiline: true,
        },
        {
          kind: "text",
          key: "watermarkText",
          label: "Marca d'água (texto de fundo)",
        },
      ],
    },
    {
      section_id: "cards",
      type: "CARDS",
      label: "Cards de atalho",
      icon: List,
      kind: "editable",
      fields: [
        {
          kind: "list",
          key: "items",
          label: "Cards",
          addLabel: "Adicionar card",
          itemTitleKey: "title",
          itemFields: [
            { kind: "i18n", key: "title", label: "Título" },
            {
              kind: "i18n",
              key: "description",
              label: "Descrição",
              multiline: true,
            },
          ],
        },
      ],
    },
    {
      section_id: "contact",
      type: "TEXT",
      label: "Contato",
      icon: Phone,
      kind: "editable",
      fields: [
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        {
          kind: "i18n",
          key: "description",
          label: "Descrição",
          multiline: true,
        },
        {
          kind: "text",
          key: "phone",
          label: "Telefone",
          inputType: "tel",
          placeholder: "+55 11 ...",
        },
        {
          kind: "text",
          key: "email",
          label: "E-mail",
          inputType: "email",
          placeholder: "contato@stetsom.com.br",
        },
        {
          kind: "text",
          key: "whatsapp",
          label: "WhatsApp",
          inputType: "tel",
          placeholder: "5511...",
        },
      ],
    },
    {
      section_id: "faq",
      type: "FAQ",
      label: "Perguntas frequentes",
      icon: HelpCircle,
      kind: "editable",
      fields: [
        {
          kind: "group",
          key: "section",
          label: "Cabeçalho da seção",
          fields: [
            { kind: "i18n", key: "label", label: "Rótulo" },
            { kind: "i18n", key: "title", label: "Título" },
            {
              kind: "i18n",
              key: "subtitle",
              label: "Subtítulo",
              multiline: true,
            },
          ],
        },
        {
          kind: "faq-items",
          key: "items",
          label: "Perguntas",
          addLabel: "Adicionar pergunta",
          itemTitleKey: "q",
          itemFields: [
            { kind: "i18n", key: "q", label: "Pergunta" },
            { kind: "i18n", key: "a", label: "Resposta", multiline: true },
          ],
        },
      ],
    },
    {
      section_id: "documentation",
      type: "TEXT",
      label: "Downloads e documentação",
      icon: FileText,
      kind: "editable",
      fields: [
        {
          kind: "list",
          key: "categories",
          label: "Categorias",
          addLabel: "Adicionar categoria",
          itemTitleKey: "slug",
          itemFields: [
            { kind: "i18n", key: "title", label: "Título" },
            { kind: "text", key: "label", label: "Rótulo" },
            {
              kind: "text",
              key: "slug",
              label: "Slug",
              placeholder: "manuais",
            },
          ],
        },
        {
          kind: "list",
          key: "files",
          label: "Arquivos",
          addLabel: "Adicionar arquivo",
          itemTitleKey: "name",
          itemFields: [
            { kind: "text", key: "name", label: "Nome" },
            {
              kind: "asset",
              key: "file_url",
              label: "Arquivo",
              variant: "file",
              assetType: "PDF",
              listTypes: ["MANUAL", "CATALOG", "CERTIFICATE", "PDF"],
              accept: "application/pdf",
            },
            {
              kind: "select",
              key: "type",
              label: "Tipo",
              options: FILE_TYPE_OPTIONS,
            },
            { kind: "text", key: "version", label: "Versão", placeholder: "1" },
            {
              kind: "text",
              key: "category_slug",
              label: "Slug da categoria",
              placeholder: "manuais",
            },
          ],
        },
      ],
    },
    {
      section_id: "service_centers",
      type: "IMAGE",
      label: "Postos autorizados (mapa)",
      icon: MapPin,
      kind: "editable",
      autoNote:
        "A lista de postos é puxada automaticamente da base de parceiros. Aqui você define apenas a imagem do mapa.",
      fields: [
        {
          kind: "asset",
          key: "mapImage",
          label: "Imagem do mapa",
          variant: "image",
        },
      ],
    },
  ],
};

/**
 * Tab order that mirrors the public page, for pages whose stored block order
 * drifted from it. Pages not listed keep the stored order.
 */
const PAGE_NAV_ORDER: Record<string, string[]> = {
  about: [
    "hero",
    "quality",
    "values:items",
    "timeline",
    "values:bases",
    "social",
    "jobs-cta",
  ],
};

export function getPageSections(pageId: string): SectionDef[] {
  return PAGE_SECTIONS[pageId] ?? [];
}

/** Editor tabs for the stored sections, one per view where a section has views. */
export function getSectionNavEntries(
  pageId: string,
  sectionIds: string[],
): SectionNavEntry[] {
  const entries = sectionIds.flatMap((sectionId): SectionNavEntry[] => {
    const def = findSectionDef(pageId, sectionId);
    if (!def) return [];
    if (!def.views?.length) {
      return [
        {
          id: def.section_id,
          section_id: def.section_id,
          label: def.label,
          description: def.description,
          icon: def.icon,
          fields: def.fields,
          def,
        },
      ];
    }
    return def.views.map((view) => ({
      id: `${def.section_id}:${view.id}`,
      section_id: def.section_id,
      label: view.label,
      description: view.description,
      icon: view.icon ?? def.icon,
      fields: def.fields.filter((f) => view.fieldKeys.includes(f.key)),
      def,
    }));
  });

  const order = PAGE_NAV_ORDER[pageId];
  if (!order) return entries;
  const rank = (id: string) => {
    const index = order.indexOf(id);
    return index === -1 ? order.length : index;
  };
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => rank(a.entry.id) - rank(b.entry.id) || a.index - b.index)
    .map(({ entry }) => entry);
}

/** The stored section a tab id belongs to (`values:bases` → `values`). */
export function sectionIdOfTarget(target: string): string {
  return target.split(":")[0];
}

/**
 * Normalizes a section id coming from the preview or a new block to a tab id:
 * a section with views opens on its first view.
 */
export function toNavTarget(pageId: string, target: string): string {
  if (target.includes(":")) return target;
  const view = findSectionDef(pageId, target)?.views?.[0];
  return view ? `${target}:${view.id}` : target;
}

export function findSectionDef(
  pageId: string,
  sectionId: string,
): SectionDef | undefined {
  return getPageSections(pageId).find((s) => s.section_id === sectionId);
}
