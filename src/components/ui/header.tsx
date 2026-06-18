"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { Container } from "./container";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import type { PublicCategory } from "@/api/stetsom/model";

const DEFAULT_CATEGORY_IMAGE = "/figma-assets/raw/fill_THI4RN_1e666beb.png";

type CategoryKey =
  | "amplifiers"
  | "processors"
  | "crossovers"
  | "controls"
  | "powerSupplies"
  | "mixers"
  | "accessories";

/**
 * Curated presentation for known category slugs. The public contract exposes
 * neither category images nor menu descriptions (only `icon_library_id`), so
 * this design content stays curated and is matched by slug. Unknown categories
 * fall back to the default image and render the name only.
 */
const CATEGORY_PRESENTATION: Record<
  string,
  { image: string; key: CategoryKey }
> = {
  amplificadores: {
    image: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
    key: "amplifiers",
  },
  processadores: {
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
    key: "processors",
  },
  crossovers: { image: "/figma-assets/raw/product-c.png", key: "crossovers" },
  controles: {
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
    key: "controls",
  },
  "fontes-e-carregadores": {
    image: "/figma-assets/raw/fill_THI4RN_1e666beb.png",
    key: "powerSupplies",
  },
  "mesas-de-som": { image: "/figma-assets/raw/product-c.png", key: "mixers" },
  acessorios: {
    image: "/figma-assets/raw/fill_EPTO4T_3d86cd17.png",
    key: "accessories",
  },
};

type CategoryNavItem = {
  slug: string;
  label: string;
  href: string;
  image: string;
  description?: string;
};

interface HeaderProps {
  categories?: PublicCategory[];
}

export function Header({ categories }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useTranslations("Nav");

  const rawNavItems: CategoryNavItem[] =
    categories && categories.length
      ? [...categories]
          .sort((a, b) => a.order - b.order)
          .map((category) => {
            const presentation = CATEGORY_PRESENTATION[category.slug];
            return {
              slug: category.slug,
              label: category.name,
              href: `/produtos?category=${category.slug}`,
              image: presentation?.image ?? DEFAULT_CATEGORY_IMAGE,
              description: presentation
                ? t(`categoryMenu.${presentation.key}.description`)
                : undefined,
            };
          })
      : Object.entries(CATEGORY_PRESENTATION).map(([slug, presentation]) => ({
          slug,
          label: t(`categoryMenu.${presentation.key}.label`),
          href: `/produtos?category=${slug}`,
          image: presentation.image,
          description: t(`categoryMenu.${presentation.key}.description`),
        }));

  // The public categories endpoint can return the same slug more than once;
  // dedupe so nav keys stay unique and menu entries are not duplicated.
  const navItems = rawNavItems.filter(
    (item, index, all) =>
      all.findIndex((other) => other.slug === item.slug) === index,
  );

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
          <div className="hidden items-center gap-logo-nav md:flex">
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
                      {navItems.map((cat) => (
                        <ListItem
                          key={cat.slug}
                          title={cat.label}
                          href={cat.href}
                          image={cat.image}
                        >
                          {cat.description ?? ""}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<MenuLink href="/sobre" label={t("about")} />}
                  />
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    render={<MenuLink href="/suporte" label={t("support")} />}
                  />
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile header: hamburger | logo | search */}
          <div className="flex w-full items-center justify-between md:hidden">
            {searchOpen ? (
              <MobileSearchBar onClose={() => setSearchOpen(false)} />
            ) : (
              <>
                <div className="flex w-10 items-center justify-start">
                  <button
                    aria-label={t("openMenu")}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-menu"
                    className="inline-flex h-10 w-10 items-center justify-center text-icon-muted"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Menu size={22} />
                  </button>
                </div>

                <Link href="/" className="shrink-0">
                  <Logo width={120} height={28} />
                </Link>

                <div className="flex w-10 items-center justify-end">
                  <button
                    aria-label={t("search")}
                    className="inline-flex h-10 w-10 items-center justify-center text-icon-muted"
                    onClick={() => setSearchOpen(true)}
                  >
                    <Search size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right side (desktop) — language selector */}
          <div className="hidden items-center md:flex">
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
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: CategoryNavItem[];
}

function MobileDrawer({ open, onClose, navItems }: MobileDrawerProps) {
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
        "fixed top-0 left-0 z-[60] flex h-full w-4/5 max-w-xs flex-col bg-brand-dark transition-transform duration-300 md:hidden",
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
          className="inline-flex h-10 w-10 items-center justify-center text-text-subtle-dark transition-colors hover:text-white"
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
            className="flex w-full items-center justify-between py-4 font-sans-condensed text-xl font-black text-white uppercase transition-colors hover:text-brand"
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
              {navItems.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.href}
                  onClick={onClose}
                  className="py-2.5 font-sans text-sm text-text-subtle-dark transition-colors hover:text-white"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sobre nós e Suporte */}
        {[
          { href: "/sobre", label: t("about") },
          { href: "/suporte", label: t("support") },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
              "border-b border-white/10 py-4 font-sans-condensed text-xl font-black uppercase transition-colors",
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
        className="inline-flex h-10 w-10 items-center justify-center text-icon-muted"
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
        "mx-4 border-b-2 font-sans text-lg font-normal transition-colors",
        active
          ? "border-brand text-brand"
          : "border-transparent text-muted-foreground hover:border-brand hover:text-brand",
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
                className="size-16 shrink-0 rounded-sm bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
              />
              <div className="flex flex-1 flex-col gap-1 text-sm">
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
