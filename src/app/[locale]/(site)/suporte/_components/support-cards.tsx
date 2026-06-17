import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Download,
  FileText,
  Mail,
  MapPin,
  type LucideIcon,
} from "lucide-react";

type SupportCard = {
  title: string;
  description: string;
};

const ICON_BY_TITLE: Record<string, LucideIcon> = {
  manuais: Download,
  download: Download,
  posto: MapPin,
  autorizados: MapPin,
  fale: Mail,
  contato: Mail,
};

interface SupportCardsProps {
  cards: SupportCard[];
}

function pickIcon(title: string): LucideIcon {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(ICON_BY_TITLE)) {
    if (lower.includes(key)) return icon;
  }
  return FileText;
}

export function SupportCards({ cards }: Readonly<SupportCardsProps>) {
  return (
    <section className="w-full bg-off-white py-12">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {cards.map((card, index) => {
            const Icon = pickIcon(card.title);

            return (
              <div
                key={index}
                className={cn(
                  "flex min-h-52 flex-col border border-border bg-white p-4",
                  index === cards.length - 1 && "border-b-brand",
                )}
              >
                <Icon size={20} className="mb-5 text-brand" />
                <h3 className="mb-3 font-sans-condensed text-section-title font-black text-brand-dark uppercase">
                  {card.title}
                </h3>
                <p className="flex-1 text-base text-text-subtle">
                  {card.description}
                </p>
                <div className="mt-6 flex items-center justify-end">
                  <ArrowUpRight size={18} className="text-brand" />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
