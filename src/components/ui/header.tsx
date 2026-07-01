"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useTranslations } from "next-intl";
import { FormEvent, useRef, useState } from "react";
import { Container } from "./container";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

const SCROLL_THRESHOLD = 10;

const NAV_LINKS = [
  { href: "/produtos", labelKey: "products" },
  { href: "/sobre", labelKey: "about" },
  { href: "/suporte", labelKey: "support" },
] as const;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("Nav");

  // ── scroll tracking with motion ──────────────────────────────────────
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD);
  });

  // ── keyboard ─────────────────────────────────────────────────────────
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setMobileMenuOpen(false);
    }
  }

  // ── close mobile menu on outside click ───────────────────────────────
  function handleBackdropClick() {
    setMobileMenuOpen(false);
  }

  // ── header appearance ────────────────────────────────────────────────
  // On mobile, when the hamburger menu is open the header turns white to blend
  // with the dropdown (desktop is unaffected since the menu is hidden).
  const isWhite = scrolled || mobileMenuOpen;
  const iconClass = isWhite ? "text-icon-muted" : "text-white";
  const langVariant = isWhite ? ("dark" as const) : ("light" as const);

  return (
    <div onKeyDown={handleKey}>
      <motion.header
        className="fixed top-0 z-50 h-16 w-full"
        animate={{
          backgroundColor: isWhite
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 255, 255, 0)",
          boxShadow: isWhite
            ? "0 1px 3px rgba(0, 0, 0, 0.1)"
            : "0 0px 0px rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Container className="flex h-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <Logo
                variant={isWhite ? "white" : "dark"}
                width={158}
                height={35}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map(({ href, labelKey }) => (
                <DesktopNavLink key={href} href={href} scrolled={scrolled}>
                  {t(labelKey)}
                </DesktopNavLink>
              ))}
            </nav>
          </div>

          {/* Desktop right: search + language */}
          <div className="hidden items-center gap-4 md:flex">
            <DesktopSearchBar scrolled={scrolled} />
            <LanguageSwitcher variant={langVariant} />
          </div>

          {/* Mobile: hamburger | logo | search icon */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              aria-label={t("openMenu")}
              aria-expanded={mobileMenuOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center",
                iconClass,
              )}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </Container>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-18 left-0 w-full bg-white shadow-md md:hidden"
          >
            <div className="flex flex-col px-5 py-4">
              {/* Search */}
              <MobileSearchInline onClose={() => setMobileMenuOpen(false)} />

              <div className="my-3 border-t border-border" />

              {/* Nav links */}
              {NAV_LINKS.map(({ href, labelKey }) => (
                <MobileNavLink
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t(labelKey)}
                </MobileNavLink>
              ))}

              <div className="my-3 border-t border-border" />

              {/* Language switcher */}
              <div className="py-2">
                <LanguageSwitcher variant="dark" />
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={handleBackdropClick}
        />
      )}
    </div>
  );
}

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────
// Restored original hover style: red text + red border-bottom on hover

function DesktopNavLink({
  href,
  children,
  scrolled,
}: {
  href: string;
  children: string;
  scrolled: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 font-sans text-lg font-normal transition-colors",
        scrolled
          ? active
            ? "border-brand text-brand"
            : "border-transparent text-muted-foreground hover:border-brand hover:text-brand"
          : active
            ? "border-brand text-white"
            : "border-transparent text-white/80 hover:border-brand hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}

// ─── Mobile Nav Link ──────────────────────────────────────────────────────────

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: string;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "py-3 font-sans-condensed text-lg font-black uppercase transition-colors",
        active ? "text-brand" : "text-brand-dark hover:text-brand",
      )}
    >
      {children}
    </Link>
  );
}

// ─── Desktop Search Bar ───────────────────────────────────────────────────────

function DesktopSearchBar({ scrolled }: { scrolled: boolean }) {
  const router = useRouter();
  const t = useTranslations("Header");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string).trim();
    if (q) router.push(`/produtos?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        name="q"
        type="search"
        placeholder={t("searchPlaceholder")}
        className={cn(
          "w-40 rounded-full border px-4 py-1.5 font-sans text-sm transition-all outline-none",
          "focus:w-56 focus:border-brand",
          scrolled
            ? "border-border bg-muted text-foreground placeholder:text-muted-foreground"
            : "border-white/30 bg-white/10 text-white placeholder:text-white/50",
        )}
      />
    </form>
  );
}

// ─── Mobile Search Inline ─────────────────────────────────────────────────────

function MobileSearchInline({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const t = useTranslations("Header");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string).trim();
    if (q) {
      router.push(`/produtos?q=${encodeURIComponent(q)}`);
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Search size={18} className="shrink-0 text-icon-muted" />
      <input
        name="q"
        type="search"
        placeholder={t("searchPlaceholder")}
        className="flex-1 bg-transparent py-2 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </form>
  );
}
