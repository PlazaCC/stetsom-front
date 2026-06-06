import type { PageBlockType } from "@/api/stetsom/model";
import {
  FileText,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Images,
  LayoutTemplate,
  List,
  MessageSquareQuote,
  Video,
  type LucideIcon,
} from "lucide-react";

export interface PageSectionTemplate {
  /** Semantic section_id persisted on the block. */
  section_id: string;
  /** Persisted block type (limited model enum). */
  type: PageBlockType;
  label: string;
  description: string;
  icon: LucideIcon;
  /**
   * Reference-only sections are managed elsewhere (own page or external API);
   * here they can only be ordered/toggled, not edited inline.
   */
  reference?: boolean;
}

/**
 * Pre-assembled sections available when composing an institutional page.
 * Section content is edited per-section; here the editor handles add / remove /
 * reorder. Banner and Social feed are reference blocks: banners have their own
 * management page and the social feed is pulled from the Instagram API.
 */
export const PAGE_SECTION_CATALOG: PageSectionTemplate[] = [
  {
    section_id: "hero",
    type: "IMAGE",
    label: "Hero",
    description: "Bloco de destaque no topo da página.",
    icon: ImageIcon,
  },
  {
    section_id: "text",
    type: "TEXT",
    label: "Texto",
    description: "Bloco de texto rico.",
    icon: FileText,
  },
  {
    section_id: "timeline",
    type: "TIMELINE",
    label: "Linha do tempo",
    description: "Marcos históricos em sequência.",
    icon: LayoutTemplate,
  },
  {
    section_id: "testimonials",
    type: "CARDS",
    label: "Depoimentos",
    description: "Citações de clientes em cards.",
    icon: MessageSquareQuote,
  },
  {
    section_id: "faq",
    type: "FAQ",
    label: "FAQ",
    description: "Perguntas frequentes em acordeão.",
    icon: HelpCircle,
  },
  {
    section_id: "values",
    type: "CARDS",
    label: "Valores / Bases",
    description: "Grade de cards institucionais.",
    icon: List,
  },
  {
    section_id: "gallery",
    type: "GALLERY",
    label: "Galeria",
    description: "Conjunto de imagens.",
    icon: Images,
  },
  {
    section_id: "video",
    type: "VIDEO",
    label: "Vídeo",
    description: "Vídeo incorporado.",
    icon: Video,
  },
  {
    section_id: "social-feed",
    type: "GALLERY",
    label: "Feed do Instagram",
    description: "Puxado automaticamente da API do Instagram.",
    icon: Globe,
    reference: true,
  },
];

export function findSectionTemplate(
  sectionId: string,
): PageSectionTemplate | undefined {
  return PAGE_SECTION_CATALOG.find((s) => s.section_id === sectionId);
}
