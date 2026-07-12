import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  MapPin,
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
    <section className="w-full bg-off-white py-8 lg:py-12">
      <Container className="flex justify-center">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = pickIcon(card.title);
            const href = pickHref(card.title);

            return (
              <Link
                key={card.title}
                href={href}
                className={cn(
                  "group relative flex max-w-83.75 flex-row items-center gap-4 border border-border bg-white p-2 md:flex-col md:items-start md:gap-1 lg:p-4",
                  "transition-colors duration-200",
                  "hover:border-b-brand",
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-xs bg-muted">
                  <Icon strokeWidth={1.5} size={36} className="text-brand" />
                </div>
                <div>
                  <h3 className="font-sans-condensed text-xl font-bold text-brand-dark uppercase lg:text-3xl">
                    {card.title}
                  </h3>
                  <p className="max-w-2xs flex-1 text-xs leading-tight text-text-subtle lg:text-sm lg:leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <ArrowUpRight
                  size={32}
                  className="absolute right-1 bottom-1 hidden text-text-subtle transition-colors duration-200 group-hover:text-brand md:block"
                />
                <ArrowRight
                  size={20}
                  strokeWidth={3}
                  className="text-[#666666] md:hidden"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
