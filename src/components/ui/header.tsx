"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Container } from "./container";
import { HeaderSearch } from "./header/header-search";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

const SCROLL_THRESHOLD = 10;

const NAV_LINKS = [
  { href: "/produtos", labelKey: "products" },
  { href: "/sobre", labelKey: "about" },
  { href: "/suporte", labelKey: "support" },
] as const;

interface HeaderProps {
  // Resolved by SiteLayout from GET /api/config/public. Defaults cover the
  // case where the admin hasn't uploaded a CMS logo for this locale yet.
  logoDark?: string;
  logoWhite?: string;
}

export function Header({
  logoDark = "/logo.png",
  logoWhite = "/logo-white.png",
}: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Nav");
  const pathname = usePathname();

  // ── scroll tracking with motion ──────────────────────────────────────
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD);
  });

  // ── keyboard ─────────────────────────────────────────────────────────
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setMobileMenuOpen(false);
      setMobileSearchOpen(false);
    }
  }

  // ── close mobile menu on outside click ───────────────────────────────
  function handleBackdropClick() {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }

  // ── header appearance ────────────────────────────────────────────────
  // On mobile, when the hamburger menu or search is open the header turns
  // white to blend with the dropdown (desktop is unaffected since both are
  // hidden). On /produtos the header is always white (sticky catalog bar
  // context).
  const isProdutos = pathname.startsWith("/produtos/");
  const isWhite = isProdutos || scrolled || mobileMenuOpen || mobileSearchOpen;
  const iconClass = isWhite ? "text-icon-muted" : "text-white";
  const langVariant = isWhite ? ("light" as const) : ("dark" as const);

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
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Container className="flex h-full items-center justify-between">
          {/* Desktop: logo + nav (left) */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="shrink-0">
              <Logo
                src={isWhite ? logoWhite : logoDark}
                width={158}
                height={35}
                priority
              />
            </Link>

            <nav className="flex items-center gap-8">
              {NAV_LINKS.map(({ href, labelKey }) => (
                <DesktopNavLink key={href} href={href} isWhite={isWhite}>
                  {t(labelKey)}
                </DesktopNavLink>
              ))}
            </nav>
          </div>

          {/* Desktop right: search + language */}
          <div className="hidden items-center gap-4 md:flex">
            <HeaderSearch variant="desktop" isWhite={isWhite} />
            <LanguageSwitcher variant={langVariant} />
          </div>

          {/* Mobile: hamburger | logo (centered) | search icon */}
          <div className="relative flex w-full items-center justify-between md:hidden">
            <button
              aria-label={t("openMenu")}
              aria-expanded={mobileMenuOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center",
                iconClass,
              )}
              onClick={() => {
                setMobileMenuOpen((o) => !o);
                setMobileSearchOpen(false);
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Logo src={isWhite ? logoWhite : logoDark} priority />
            </Link>

            <button
              aria-label={t("openSearch")}
              aria-expanded={mobileSearchOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center",
                iconClass,
              )}
              onClick={() => {
                setMobileSearchOpen((o) => !o);
                setMobileMenuOpen(false);
              }}
            >
              <Search size={22} />
            </button>
          </div>
        </Container>

        {/* Mobile dedicated search dropdown */}
        {mobileSearchOpen && (
          <MobileDropdownPanel>
            <div className="px-5 py-4">
              <HeaderSearch
                variant="mobile"
                onNavigate={() => setMobileSearchOpen(false)}
              />
            </div>
          </MobileDropdownPanel>
        )}

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <MobileDropdownPanel>
            <div className="flex flex-col px-5 py-4">
              {/* Search */}
              <HeaderSearch
                variant="mobile"
                onNavigate={() => setMobileMenuOpen(false)}
              />

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
              <div className="flex justify-end py-2">
                <LanguageSwitcher variant="dark" />
              </div>
            </div>
          </MobileDropdownPanel>
        )}
      </motion.header>

      {/* Backdrop */}
      {(mobileMenuOpen || mobileSearchOpen) && (
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

// ─── Mobile Dropdown Panel ────────────────────────────────────────────────────

function MobileDropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden"
    >
      {children}
    </motion.div>
  );
}

// ─── Desktop Nav Link ─────────────────────────────────────────────────────────

function DesktopNavLink({
  href,
  children,
  isWhite,
}: {
  href: string;
  children: string;
  isWhite: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "border-b-2 font-sans text-lg font-normal transition-colors",
        isWhite
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
