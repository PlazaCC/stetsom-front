import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  FileText,
  MapPin,
  MessageCircle,
  MessageCircleMore,
  type LucideIcon,
} from "lucide-react";

type SupportCard = {
  title: string;
  description: string;
};

const ICON_BY_KEYWORD: Record<string, LucideIcon> = {
  manuais: FileText,
  download: FileText,
  posto: MapPin,
  autorizados: MapPin,
  fale: MessageCircleMore,
  contato: MessageCircleMore,
};

const HREF_BY_KEYWORD: Record<string, string> = {
  manuais: "#",
  download: "#",
  posto: "#service-centers",
  autorizados: "#service-centers",
  fale: "#contact",
  contato: "#contact",
};

interface SupportCardsProps {
  cards: SupportCard[];
}

function pickIcon(title: string): LucideIcon {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_BY_KEYWORD)) {
    if (lower.includes(key)) return icon;
  }
  return FileText;
}

function pickHref(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, href] of Object.entries(HREF_BY_KEYWORD)) {
    if (lower.includes(key)) return href;
  }
  return "#";
}

export function SupportCards({ cards }: Readonly<SupportCardsProps>) {
  return (
    <section className="w-full bg-off-white py-16">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = pickIcon(card.title);
            const href = pickHref(card.title);

            return (
              <Link
                key={card.title}
                href={href}
                className={cn(
                  "group relative flex flex-col gap-1 border border-border bg-white p-4",
                  "transition-colors duration-200",
                  "hover:border-b-brand",
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-xs bg-muted">
                  <Icon strokeWidth={2} size={36} className="text-brand" />
                </div>
                <h3 className="font-sans-condensed text-3xl font-bold text-brand-dark uppercase">
                  {card.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-text-subtle">
                  {card.description}
                </p>
                <ArrowUpRight
                  size={32}
                  className="absolute right-1 bottom-1 text-text-subtle transition-colors duration-200 group-hover:text-brand"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
