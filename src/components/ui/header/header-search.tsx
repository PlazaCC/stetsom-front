"use client";

import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { ProductCardItem } from "@/api/stetsom/model";
import { useSearchSuggestions } from "./use-search-suggestions";

const searchInputVariants = cva("font-sans text-sm outline-none", {
  variants: {
    variant: {
      desktop:
        "w-40 rounded-full border px-4 py-2 transition-all focus:w-56 focus:border-brand",
      mobile:
        "flex-1 bg-transparent py-2 text-foreground placeholder:text-muted-foreground",
    },
    isWhite: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "desktop",
      isWhite: true,
      className:
        "border-border bg-muted text-foreground placeholder:text-muted-foreground",
    },
    {
      variant: "desktop",
      isWhite: false,
      className:
        "border-white/30 bg-white/10 text-white placeholder:text-white/50",
    },
  ],
  defaultVariants: { variant: "mobile", isWhite: true },
});

interface HeaderSearchProps {
  variant: "desktop" | "mobile";
  /** Desktop only: header is on a light background (pill turns light). */
  isWhite?: boolean;
  /** Called after any navigation, so the parent can close mobile panels. */
  onNavigate?: () => void;
}

export function HeaderSearch({
  variant,
  isWhite = true,
  onNavigate,
}: HeaderSearchProps) {
  const router = useRouter();
  const t = useTranslations("Header");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { suggestions, remaining, isLoading, isActive } =
    useSearchSuggestions(query);

  const showDropdown = open && isActive;
  const hasMore = remaining > 0;

  // ── close on outside click ─────────────────────────────────────────────
  useEffect(() => {
    if (!showDropdown) return;
    function onPointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showDropdown]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
    onNavigate?.();
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (q) go(`/produtos?q=${encodeURIComponent(q)}`);
  }

  const isDesktop = variant === "desktop";

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={handleSubmit}
        className={cn("flex items-center", isDesktop ? "" : "gap-2")}
      >
        {!isDesktop && (
          <Search size={18} className="shrink-0 text-icon-muted" />
        )}
        <input
          name="q"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className={searchInputVariants({ variant, isWhite })}
        />
      </form>

      {showDropdown && (
        <div
          className={cn(
            "z-50 overflow-hidden rounded-lg border border-border bg-white py-1 shadow-lg",
            isDesktop
              ? "absolute top-full right-0 mt-2 w-72"
              : "absolute top-full left-0 mt-2 w-full",
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-icon-muted">
              <Loader2 size={14} className="animate-spin" />
              <span>{t("searching")}</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-3 py-3 text-xs text-icon-muted">
              {t("noResults")}
            </div>
          ) : (
            <>
              {suggestions.map((item) => (
                <SuggestionRow
                  key={item.id}
                  item={item}
                  onSelect={() => go(item.href)}
                />
              ))}
              {hasMore && (
                <button
                  type="button"
                  onClick={() =>
                    go(`/produtos?q=${encodeURIComponent(query.trim())}`)
                  }
                  className="flex w-full items-center justify-center border-t border-border px-3 py-2.5 font-sans-condensed text-xs font-black text-brand uppercase transition-colors hover:bg-muted"
                >
                  {t("viewMore", { count: remaining })}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Suggestion Row ───────────────────────────────────────────────────────────

function SuggestionRow({
  item,
  onSelect,
}: {
  item: ProductCardItem;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-muted"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.name}
            width={40}
            height={40}
            className="h-full w-full object-contain"
          />
        ) : (
          <Search size={14} className="text-icon-muted" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-sans-condensed text-sm font-black text-brand-dark uppercase">
          {item.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {item.sku ?? item.category}
        </span>
      </span>
    </button>
  );
}
