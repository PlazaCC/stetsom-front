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
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Declarative description of a single editable field inside a page block.
 * The renderer (`section-form-renderer.tsx`) interprets these specs and reuses
 * the shared `crud/*` primitives. Keys map 1:1 to the block `data` shape
 * defined in `src/lib/page-blocks.ts` (the SSOT consumed by the public site).
 */
export type FieldSpec =
  | { kind: "i18n"; key: string; label: string; multiline?: boolean }
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
  | { kind: "group"; key: string; label: string; fields: FieldSpec[] };

export interface SectionDef {
  /** Persisted `section_id` — must match what the public page reads. */
  section_id: string;
  /** Persisted block type (model enum). */
  type: PageBlockType;
  label: string;
  description?: string;
  icon: LucideIcon;
  /**
   * `auto` blocks have part of their content filled by the backend/external
   * API (featured products, Instagram feed). Only the text/CTA fields below are
   * editable here; `autoNote` explains what is managed automatically.
   */
  kind: "editable" | "auto";
  autoNote?: string;
  fields: FieldSpec[];
}

const ICON_OPTIONS = [
  { value: "zap", label: "Raio (Potência)" },
  { value: "shield-check", label: "Escudo (Qualidade)" },
  { value: "rocket", label: "Foguete (Inovação)" },
];

const FILE_TYPE_OPTIONS = [
  { value: "PDF", label: "PDF" },
  { value: "MANUAL", label: "Manual" },
  { value: "CATALOG", label: "Catálogo" },
  { value: "CERTIFICATE", label: "Certificado" },
  { value: "OTHER", label: "Outro" },
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

/**
 * Fixed catalog of sections per institutional page. The admin can edit, reorder
 * and show/hide these — adding unknown sections (that the public site cannot
 * render) is intentionally not allowed. Order here is the canonical default for
 * sections not yet present on a page.
 */
export const PAGE_SECTIONS: Record<string, SectionDef[]> = {
  home: [
    {
      section_id: "featured",
      type: "CARDS",
      label: "Produtos em destaque",
      icon: Sparkles,
      kind: "auto",
      autoNote:
        "Os produtos e o destaque são preenchidos automaticamente a partir dos produtos marcados como destaque no catálogo. Aqui você edita apenas os textos e o botão.",
      fields: [
        { kind: "i18n", key: "label", label: "Rótulo" },
        { kind: "i18n", key: "title", label: "Título" },
        { kind: "i18n", key: "spotlightTitle", label: "Título do destaque" },
        { kind: "i18n", key: "ctaLabel", label: "Texto do botão" },
        {
          kind: "text",
          key: "ctaHref",
          label: "Link do botão",
          inputType: "url",
          placeholder: "/produtos",
        },
        {
          kind: "list",
          key: "tabs",
          label: "Abas de categoria",
          addLabel: "Adicionar aba",
          itemTitleKey: "label",
          itemFields: [
            { kind: "i18n", key: "label", label: "Rótulo da aba" },
            {
              kind: "text",
              key: "categorySlug",
              label: "Slug da categoria",
              placeholder: "amplificadores",
            },
          ],
        },
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
          ],
        },
        {
          kind: "list",
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
      label: "Qualidade",
      icon: LayoutTemplate,
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
      ],
    },
    {
      section_id: "values",
      type: "CARDS",
      label: "Valores e bases",
      icon: List,
      kind: "editable",
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
            { kind: "i18n", key: "subtitle", label: "Subtítulo" },
            {
              kind: "i18n",
              key: "supportButtonLabel",
              label: "Texto do botão de suporte",
            },
          ],
        },
        {
          kind: "list",
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

export function getPageSections(pageId: string): SectionDef[] {
  return PAGE_SECTIONS[pageId] ?? [];
}

export function findSectionDef(
  pageId: string,
  sectionId: string,
): SectionDef | undefined {
  return getPageSections(pageId).find((s) => s.section_id === sectionId);
}
