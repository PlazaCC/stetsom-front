"use client";

import { NAV_LINKS } from "@/lib/mock/navigation";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "./logo";
import { useRouter } from "@/i18n/navigation";
import { Container } from "./container";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import { FormEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./language-switcher";

const CATEGORY_NAV_ITEMS = [
  {
    key: "amplifiers",
    href: "/produtos?category=amplificadores",
    image: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
  },
  {
    key: "processors",
    href: "/produtos?category=processadores",
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
  },
  {
    key: "crossovers",
    href: "/produtos?category=crossovers",
    image: "/figma-assets/raw/product-c.png",
  },
  {
    key: "controls",
    href: "/produtos?category=controles",
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
  },
  {
    key: "powerSupplies",
    href: "/produtos?category=fontes-e-carregadores",
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
  },
  {
    key: "mixers",
    href: "/produtos?category=mesas-de-som",
    image: "/figma-assets/raw/product-c.png",
  },
  {
    key: "accessories",
    href: "/produtos?category=acessorios",
    image: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
  },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("Nav");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 h-22 w-full border-b border-border bg-white">
        <Container className="flex h-full items-center justify-between">
          {/* Desktop header */}
          <div className="hidden md:flex items-center gap-logo-nav">
            <Link href="/">
              <Logo width={158} height={35} priority />
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    nativeButton={false}
                    render={
                      <div>
                        <MenuLink href="/produtos" label={t("products")} />
                      </div>
                    }
                  />
                  <NavigationMenuContent>
                    <ul className="grid w-100 gap-2 md:w-125 md:grid-cols-2 lg:w-150">
                      {CATEGORY_NAV_ITEMS.map((cat) => (
                        <ListItem
                          key={cat.key}
                          title={t(`categoryMenu.${cat.key}.label`)}
                          href={cat.href}
                          image={cat.image}
                        >
                          {t(`categoryMenu.${cat.key}.description`)}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <MenuLink href={NAV_LINKS[1].href} label={t("about")} />
                    }
                  />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={
                      <MenuLink href={NAV_LINKS[2].href} label={t("support")} />
                    }
                  />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile header: hamburger | logo | search */}
          <div className="flex items-center justify-between w-full md:hidden">
            {searchOpen ? (
              <MobileSearchBar onClose={() => setSearchOpen(false)} />
            ) : (
              <>
                <div className="w-10 flex items-center justify-start">
                  <button
                    aria-label={t("openMenu")}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                    className="inline-flex items-center justify-center w-10 h-10 text-icon-muted"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu size={22} />
                  </button>
                </div>

                <Link href="/" className="shrink-0">
                  <Logo width={120} height={28} />
                </Link>

                <div className="w-10 flex items-center justify-end">
                  <button
                    aria-label={t("search")}
                    className="inline-flex items-center justify-center w-10 h-10 text-icon-muted"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right side (desktop) — language selector */}
          <div className="hidden md:flex items-center">
            <LanguageSwitcher variant="light" />
          </div>
        </Container>
      </header>

      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 md:hidden",
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <nav
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label={t("navAriaLabel")}
      className={cn(
        "fixed left-0 top-0 z-[60] flex h-full w-4/5 max-w-xs flex-col bg-brand-dark transition-transform duration-300 md:hidden",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <Link href="/" onClick={onClose}>
          <Logo variant="dark" width={120} height={28} />
        </Link>
        <button
          aria-label={t("closeMenu")}
          className="inline-flex items-center justify-center w-10 h-10 text-text-subtle-dark transition-colors hover:text-white"
          onClick={onClose}
        >
          <X size={22} />
        </button>
      </div>

      {/* Nav links */}
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-6">
        {/* Produtos com accordion de categorias */}
        <div className="border-b border-white/10">
          <button
            onClick={() => setCategoriesOpen((o) => !o)}
            className="flex w-full items-center justify-between py-4 font-sans-condensed font-black uppercase text-xl text-white transition-colors hover:text-brand"
          >
            {t("products")}
            <ChevronDown
              size={18}
              className={cn(
                "text-text-subtle-dark transition-transform duration-200",
                categoriesOpen && "rotate-180",
              )}
            />
          </button>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              categoriesOpen ? "max-h-96" : "max-h-0",
            )}
          >
            <div className="flex flex-col pb-4 pl-4">
              {CATEGORY_NAV_ITEMS.map((cat) => (
                <Link
                  key={cat.key}
                  href={cat.href}
                  onClick={onClose}
                  className="py-2.5 font-sans text-sm text-text-subtle-dark transition-colors hover:text-white"
                >
                  {t(`categoryMenu.${cat.key}.label`)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sobre nós e Suporte */}
        {[
          { href: NAV_LINKS[1].href, label: t("about") },
          { href: NAV_LINKS[2].href, label: t("support") },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "border-b border-white/10 py-4 font-sans-condensed font-black uppercase text-xl transition-colors",
              pathname === link.href || pathname.startsWith(link.href + "/")
                ? "text-brand"
                : "text-white hover:text-brand",
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Drawer footer — language selector */}
      <div className="border-t border-white/10 px-5 py-5">
        <LanguageSwitcher variant="dark" />
      </div>
    </nav>
  );
}

// ─── Mobile Search Bar ────────────────────────────────────────────────────────

function MobileSearchBar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const t = useTranslations("Header");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string).trim();
    if (q) router.push(`/produtos?q=${encodeURIComponent(q)}`);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <input
        name="q"
        type="search"
        autoFocus
        placeholder={t("searchPlaceholder")}
        className="flex-1 border-b border-border bg-transparent py-1 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="button"
        aria-label={t("closeSearch")}
        className="inline-flex items-center justify-center w-10 h-10 text-icon-muted"
        onClick={onClose}
      >
        <X size={20} />
      </button>
    </form>
  );
}

// ─── Desktop Sub-components ───────────────────────────────────────────────────

function MenuLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className={cn(
        "font-sans font-normal text-lg border-b-2 transition-colors mx-4",
        active
          ? "text-brand border-brand"
          : "text-muted-foreground border-transparent hover:text-brand hover:border-brand",
      )}
    >
      {label}
    </Link>
  );
}

function ListItem({
  title,
  children,
  href,
  image,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; image: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink
        render={
          <Link href={href}>
            <div className="flex gap-3">
              <div
                className="size-16 rounded-sm shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
              />
              <div className="flex flex-col gap-1 text-sm flex-1">
                <div className="leading-none font-medium">{title}</div>
                <div className="line-clamp-2 text-muted-foreground">
                  {children}
                </div>
              </div>
            </div>
          </Link>
        }
      />
    </li>
  );
}
