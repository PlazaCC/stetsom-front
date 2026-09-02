"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu, Search, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Container } from "./container";
import { HeaderSearch } from "./header/header-search";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { WhatsAppIcon } from "./whatsapp-icon";

const SCROLL_THRESHOLD = 10;

/**
 * Beats of the mobile drawer, in ms. The drawer grows out from *behind* the
 * bar, so the two never move at once: the bar turns white, the drawer slides
 * down, the content fades in — overlapping just enough to stay quick (~350ms
 * end to end). Closing plays the same beats in reverse (~290ms).
 */
const COLOR_MS = 150;
const DRAWER_MS = 220;
const CONTENT_MS = 110;
const DRAWER_OPEN_DELAY = 100;
const CONTENT_OPEN_DELAY = 150;
const DRAWER_CLOSE_DELAY = 90;
const CONTENT_CLOSE_MS = 90;

function drawerTransition(open: boolean, reduceMotion: boolean | null) {
  if (reduceMotion) return { duration: 0 };
  return {
    duration: (open ? DRAWER_MS : DRAWER_MS - 20) / 1000,
    ease: [0.22, 1, 0.36, 1],
    delay: (open ? DRAWER_OPEN_DELAY : DRAWER_CLOSE_DELAY) / 1000,
  } as const;
}

function contentTransition(open: boolean, reduceMotion: boolean | null) {
  if (reduceMotion) return { duration: 0 };
  return {
    duration: (open ? CONTENT_MS : CONTENT_CLOSE_MS) / 1000,
    ease: "easeOut",
    delay: open ? CONTENT_OPEN_DELAY / 1000 : 0,
  } as const;
}

/** Bar stays white until the drawer is fully tucked back behind it. */
const WHITE_HOLD_MS = DRAWER_CLOSE_DELAY + DRAWER_MS;

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
  /** WhatsApp number (e.g. "+55 18 98133-5671") — drives the contact button
      in the mobile drawer. */
  whatsapp?: string;
}

export function Header({
  logoDark = "/logo-pt-br-white.svg",
  logoWhite = "/logo-pt-br-black.svg",
  whatsapp = "",
}: HeaderProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const panelOpen = mobileMenuOpen || mobileSearchOpen;

  // ── mobile drawer height ─────────────────────────────────────────────
  // The drawer animates to an exact pixel height (not "auto") so its box and
  // the content's translate can share one curve, keeping the content glued to
  // the edge sliding out from behind the bar. Re-measured on resize and
  // whenever the drawer's content swaps (menu ↔ search).
  const panelContentRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  // Keeps the bar white while the drawer slides back up behind it, so the
  // colour change is the last beat of the close, not the first.
  const [whiteHold, setWhiteHold] = useState(false);
  const whiteHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (whiteHoldTimer.current) clearTimeout(whiteHoldTimer.current);
    };
  }, []);

  function openPanel(which: "menu" | "search") {
    if (whiteHoldTimer.current) clearTimeout(whiteHoldTimer.current);
    setWhiteHold(true);
    setMobileMenuOpen(which === "menu");
    setMobileSearchOpen(which === "search");
  }

  function closePanels() {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    if (whiteHoldTimer.current) clearTimeout(whiteHoldTimer.current);
    whiteHoldTimer.current = setTimeout(
      () => setWhiteHold(false),
      WHITE_HOLD_MS,
    );
  }

  useEffect(() => {
    const el = panelContentRef.current;
    if (!el) return;

    const measure = () => setPanelHeight(el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── scroll tracking with motion ──────────────────────────────────────
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > SCROLL_THRESHOLD);
  });

  // ── lock body scroll + Escape while a mobile panel is open ───────────
  // The listener lives on `document` (not on a wrapper's onKeyDown) so Escape
  // still works after the focus moved outside the header — clicking the
  // backdrop, for instance.
  useEffect(() => {
    if (!panelOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      closePanels();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [panelOpen]);

  // ── close mobile menu on outside click ───────────────────────────────
  function handleBackdropClick() {
    closePanels();
  }

  // ── header appearance ────────────────────────────────────────────────
  // On mobile, when the hamburger menu or search is open the header turns
  // white to blend with the panel that grows out of it (desktop is unaffected
  // since both are hidden). On /produtos the header is always white (sticky
  // catalog bar context). Legal pages are plain content with no hero to sit
  // over, so they get the same treatment; they reserve the header height
  // themselves via `mt-header` (see legal/[slug]/page.tsx).
  const isProdutos = pathname.startsWith("/produtos/");
  const isLegal = pathname.startsWith("/legal/");
  const isWhite = isProdutos || isLegal || scrolled || panelOpen || whiteHold;
  // The drawer carries the shadow while it is out, so the bar doesn't draw a
  // seam across the middle of the open panel.
  const barShadow = isWhite && !whiteHold;
  const iconClass = isWhite ? "text-icon-muted" : "text-white";
  const langVariant = isWhite ? ("light" as const) : ("dark" as const);

  return (
    <>
      <motion.header
        className="fixed top-0 z-50 w-full"
        animate={{
          backgroundColor: isWhite
            ? "rgba(255, 255, 255, 1)"
            : "rgba(255, 255, 255, 0)",
          boxShadow: barShadow
            ? "0 1px 3px rgba(0, 0, 0, 0.1)"
            : "0 0px 0px rgba(0, 0, 0, 0)",
        }}
        transition={{ duration: COLOR_MS / 1000, ease: "easeInOut" }}
      >
        <Container className="flex h-header items-center justify-between">
          {/* Hamburger — only below the desktop breakpoint. */}
          <button
            aria-label={t("openMenu")}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-panel"
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center xl:hidden",
              iconClass,
            )}
            onClick={() => (mobileMenuOpen ? closePanels() : openPanel("menu"))}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo + nav share one element across both layouts: the logo is
              absolutely centered below `xl` and flows inline from `xl` up.
              `xl` (not `lg`) is the desktop breakpoint here because the
              Container's `px-42.5` gutters leave too little room for the full
              bar (logo + nav + search + language) at `lg` — it would overlap. */}
          <div className="flex items-center gap-20">
            <Link
              href="/"
              className="absolute left-1/2 shrink-0 -translate-x-1/2 xl:static xl:translate-x-0"
            >
              <Logo
                src={isWhite ? logoWhite : logoDark}
                width={239}
                height={48}
                priority
              />
            </Link>

            <nav className="hidden items-center gap-10 xl:flex">
              {NAV_LINKS.map(({ href, labelKey }) => (
                <DesktopNavLink key={href} href={href} isWhite={isWhite}>
                  {t(labelKey)}
                </DesktopNavLink>
              ))}
            </nav>
          </div>

          {/* Right: inline search + language on xl, search icon below. */}
          <div className="flex items-center gap-8">
            <div className="hidden xl:block">
              <HeaderSearch variant="desktop" isWhite={isWhite} />
            </div>
            <div className="hidden xl:block">
              <LanguageSwitcher variant={langVariant} />
            </div>
            <button
              aria-label={t("openSearch")}
              aria-expanded={mobileSearchOpen}
              aria-controls="mobile-panel"
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center xl:hidden",
                // Drawer already carries the search field — drop the duplicate
                // icon while the panel is open.
                panelOpen && "hidden",
                iconClass,
              )}
              onClick={() =>
                mobileSearchOpen ? closePanels() : openPanel("search")
              }
            >
              <Search size={22} />
            </button>
          </div>
        </Container>

        {/* Mobile drawer — sits directly under the bar and is clipped to it,
            so it reads as a white box sliding out from behind the header
            rather than a detached panel. Absolute (not in flow) keeps the
            header's own box at `h-header` and never shifts the page. */}
        <motion.div
          id="mobile-panel"
          role={panelOpen ? "dialog" : undefined}
          aria-modal={panelOpen || undefined}
          aria-label={mobileSearchOpen ? t("openSearch") : t("openMenu")}
          inert={!panelOpen}
          initial={false}
          animate={{
            height: panelOpen ? panelHeight : 0,
            boxShadow: panelOpen
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "0 0px 0px rgba(0, 0, 0, 0)",
          }}
          transition={drawerTransition(panelOpen, reduceMotion)}
          className="absolute top-full left-0 -z-10 w-full overflow-hidden xl:hidden"
        >
          <motion.div
            className="bg-white"
            initial={false}
            animate={{ y: panelOpen ? "0%" : "-100%" }}
            transition={drawerTransition(panelOpen, reduceMotion)}
          >
            <motion.div
              ref={panelContentRef}
              initial={false}
              animate={{ opacity: panelOpen ? 1 : 0 }}
              transition={contentTransition(panelOpen, reduceMotion)}
              className="max-h-[calc(100dvh-var(--header-height))] overflow-y-auto px-5 py-4"
            >
              {mobileSearchOpen ? (
                <HeaderSearch variant="mobile" onNavigate={closePanels} />
              ) : (
                <div className="flex flex-col">
                  {/* Search */}
                  <HeaderSearch variant="mobile" onNavigate={closePanels} />

                  <div className="my-3 border-t border-border" />

                  {/* Nav links */}
                  {NAV_LINKS.map(({ href, labelKey }) => (
                    <MobileNavLink key={href} href={href} onClick={closePanels}>
                      {t(labelKey)}
                    </MobileNavLink>
                  ))}

                  <div className="my-3 border-t border-border" />

                  {/* Language switcher + WhatsApp — same pill height as the
                      desktop bar, aligned left with the menu links above. */}
                  <div className="flex items-center justify-between gap-3 py-2">
                    <LanguageSwitcher variant="light" />
                    {whatsapp.trim() && (
                      <a
                        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 shrink-0 items-center justify-center gap-2 rounded-full bg-brand px-4 text-white transition-colors hover:bg-brand/90"
                      >
                        <WhatsAppIcon size={20} />
                        <span className="font-sans text-sm font-medium whitespace-nowrap">
                          {t("whatsapp")}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.header>

      {/* Backdrop */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-black/30 xl:hidden"
            onClick={handleBackdropClick}
          />
        )}
      </AnimatePresence>
    </>
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
        "border-b-2 font-sans text-lg transition-colors",
        isWhite
          ? active
            ? "border-brand font-semibold text-foreground"
            : "border-transparent font-normal text-muted-foreground hover:border-brand hover:text-brand"
          : active
            ? "border-brand font-semibold text-white"
            : "border-transparent font-normal text-white/80 hover:border-brand hover:text-white",
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
        "block py-3 font-sans-condensed text-lg capitalize transition-colors",
        active
          ? "font-semibold text-brand-dark"
          : "font-normal text-brand-dark hover:text-brand",
      )}
    >
      {children}
    </Link>
  );
}
