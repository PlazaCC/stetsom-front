import type { PageSection, PageSectionType } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";
import {
  FileText,
  Globe,
  Grid3X3,
  HelpCircle,
  Image,
  LayoutTemplate,
  List,
  Mail,
  MapPin,
  BarChart2,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const TYPE_META: Record<
  PageSectionType,
  { label: string; icon: React.ElementType; color: string }
> = {
  HERO_CAROUSEL: {
    label: "Hero Carousel",
    icon: Image,
    color: "text-blue-500",
  },
  HERO_STATIC: { label: "Hero Estático", icon: Image, color: "text-blue-400" },
  CATALOG_HERO: {
    label: "Hero do Catálogo",
    icon: Image,
    color: "text-blue-400",
  },
  FAQ_ACCORDION: { label: "FAQ", icon: HelpCircle, color: "text-orange-500" },
  STATS_ROW: {
    label: "Números da Empresa",
    icon: BarChart2,
    color: "text-green-500",
  },
  MILESTONES_MARQUEE: {
    label: "Marcos (Marquee)",
    icon: Zap,
    color: "text-yellow-500",
  },
  SOCIAL_FEED: {
    label: "Feed do Instagram",
    icon: Globe,
    color: "text-pink-500",
  },
  VALUES_GRID: { label: "Valores", icon: List, color: "text-purple-500" },
  TIMELINE_VERTICAL: {
    label: "Linha do Tempo",
    icon: LayoutTemplate,
    color: "text-indigo-500",
  },
  SUPPORT_CARDS: {
    label: "Canais de Atendimento",
    icon: Users,
    color: "text-teal-500",
  },
  SERVICE_CENTERS: {
    label: "Postos Autorizados",
    icon: MapPin,
    color: "text-red-500",
  },
  CONTACT_FORM_CONFIG: {
    label: "Config. do Formulário",
    icon: Mail,
    color: "text-cyan-500",
  },
  DOWNLOAD_CATALOG: {
    label: "Downloads",
    icon: FileText,
    color: "text-gray-500",
  },
  FOUNDATIONS_GRID: {
    label: "Bases da Empresa",
    icon: Grid3X3,
    color: "text-emerald-500",
  },
  PRODUCT_GRID: {
    label: "Grid de Produtos",
    icon: Grid3X3,
    color: "text-brand",
  },
};

interface AdminSectionTemplateCardProps {
  section: PageSection;
  /** Href para a rota de edição desta seção */
  editHref: string;
}

export function AdminSectionTemplateCard({
  section,
  editHref,
}: AdminSectionTemplateCardProps) {
  const meta = TYPE_META[section.type] ?? {
    label: section.type,
    icon: LayoutTemplate,
    color: "text-muted-foreground",
  };
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[12px] border border-border bg-card px-4 py-3 transition-colors",
        section.is_editable ? "hover:bg-muted/30" : "opacity-60",
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md bg-muted",
          meta.color,
        )}
      >
        <Icon className="size-4" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {section.name}
        </p>
        <p className="text-xs text-muted-foreground">{meta.label}</p>
      </div>

      {/* Order badge */}
      <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
        #{section.order}
      </span>

      {/* Updated at */}
      {section.updated_at && (
        <span className="hidden shrink-0 text-xs text-muted-foreground sm:block">
          {new Date(section.updated_at).toLocaleDateString("pt-BR")}
        </span>
      )}

      {/* Action */}
      {section.is_editable ? (
        <Link
          href={editHref}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Editar
        </Link>
      ) : (
        <span className="shrink-0 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
          Estrutural
        </span>
      )}
    </div>
  );
}
