"use client";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import {
  Cpu,
  LayoutDashboard,
  type LucideIcon,
  Star,
  Volume2,
  Waves,
} from "lucide-react";
import Image from "next/image";

interface CategoryOption {
  name: string;
  slug: string;
  iconUrl?: string | null;
}

type CategoryIcon =
  | { kind: "lucide"; Icon: LucideIcon; size: number }
  | { kind: "image"; src: string; width: number; height: number };

const TODOS_ICON: CategoryIcon = { kind: "lucide", Icon: Star, size: 32 };

const DEFAULT_CATEGORY_ICON: CategoryIcon = {
  kind: "lucide",
  Icon: LayoutDashboard,
  size: 67,
};

const STATIC_CATEGORY_ICONS: Record<string, CategoryIcon> = {
  amplificadores: { kind: "lucide", Icon: Volume2, size: 67 },
  processadores: { kind: "lucide", Icon: Cpu, size: 67 },
  crossovers: { kind: "lucide", Icon: Waves, size: 67 },
};

function resolveCategoryIcon(cat: CategoryOption): CategoryIcon {
  if (cat.slug === "todos") return TODOS_ICON;
  if (cat.iconUrl)
    return { kind: "image", src: cat.iconUrl, width: 96, height: 68 };
  return STATIC_CATEGORY_ICONS[cat.slug] ?? DEFAULT_CATEGORY_ICON;
}

interface CatalogCategoryBarProps {
  categories: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  disabled?: boolean;
}

export function CatalogCategoryBar({
  categories,
  activeCategory,
  onCategoryChange,
  disabled = false,
}: CatalogCategoryBarProps) {
  return (
    <section className="border-b border-border bg-white py-4 lg:py-6">
      <Container className="scrollbar-none overflow-x-auto">
        <div className="flex w-max gap-3 lg:gap-5">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.slug;
            const icon = resolveCategoryIcon(cat);
            const stateTextClass = isActive
              ? "text-brand"
              : cn("text-brand-dark", !disabled && "group-hover:text-brand");
            return (
              <button
                key={cat.slug}
                type="button"
                disabled={disabled}
                onClick={() => onCategoryChange(cat.slug)}
                className={cn(
                  "group flex size-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border px-1.5 py-2 text-center transition-colors lg:size-26 lg:gap-3 lg:px-2 lg:py-3",
                  isActive
                    ? "border-brand bg-brand/10"
                    : "border-border hover:border-brand hover:bg-brand/10",
                  disabled &&
                    "cursor-default opacity-60 hover:border-border hover:bg-transparent",
                )}
              >
                <span className="flex h-11 w-full items-center justify-center lg:h-20">
                  {icon.kind === "lucide" ? (
                    <icon.Icon
                      size={isActive ? 24 : 22}
                      className={cn("shrink-0 lg:size-10", stateTextClass)}
                    />
                  ) : (
                    <Image
                      src={icon.src}
                      alt=""
                      width={icon.width}
                      height={icon.height}
                      className="h-auto max-h-11 w-auto max-w-full object-contain lg:max-h-18 lg:w-auto"
                    />
                  )}
                </span>
                <span
                  className={cn(
                    "font-sans text-2xs leading-tight font-medium whitespace-nowrap lg:text-sm",
                    stateTextClass,
                  )}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
