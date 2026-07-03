import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Logo } from "./logo";

// Brand marks are kept as inline SVGs — Lucide's brand icons are deprecated.
const SOCIAL_ICONS: Record<SocialKey, React.ReactNode> = {
  instagram: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.975.045-1.504.207-1.857.344-.467.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.058 1.37-.058 4.04 0 2.67.01 2.987.058 4.04.045.976.207 1.505.344 1.858.181.466.399.8.748 1.15.35.35.683.566 1.15.747.353.138.882.3 1.857.345 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.345.466-.181.8-.398 1.15-.747.35-.35.566-.684.747-1.15.138-.353.3-.882.345-1.857.048-1.054.058-1.37.058-4.04 0-2.671-.01-2.987-.058-4.04-.045-.976-.207-1.505-.345-1.858a3.1 3.1 0 0 0-.747-1.15 3.09 3.09 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.203a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.802a3.198 3.198 0 1 0 0 6.396 3.198 3.198 0 0 0 0-6.396zm6.5-2.05a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"
        fill="currentColor"
      />
    </svg>
  ),
  facebook: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 12C22 6.477 17.523 2 12 2S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.887h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.773-1.63 1.562v1.875h2.773l-.443 2.887h-2.33v6.99C18.343 21.128 22 16.991 22 12z"
        fill="currentColor"
      />
    </svg>
  ),
  youtube: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M23.498 6.186a2.996 2.996 0 0 0-2.11-2.12C19.66 3.5 12 3.5 12 3.5s-7.66 0-9.387.565a2.997 2.997 0 0 0-2.11 2.12A31.28 31.28 0 0 0 0 12a31.28 31.28 0 0 0 .503 5.814 2.996 2.996 0 0 0 2.11 2.12C4.34 20.5 12 20.5 12 20.5s7.66 0 9.387-.565a2.996 2.996 0 0 0 2.11-2.12A31.28 31.28 0 0 0 24 12a31.28 31.28 0 0 0-.502-5.814zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"
        fill="currentColor"
      />
    </svg>
  ),
  linkedin: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.6v1.71h.05c.5-.95 1.72-1.95 3.55-1.95 3.8 0 4.5 2.5 4.5 5.75V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96V21h-4V9z"
        fill="currentColor"
      />
    </svg>
  ),
};

type SocialKey = "instagram" | "facebook" | "youtube" | "linkedin";

const SOCIAL_ORDER: { key: SocialKey; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "linkedin", label: "LinkedIn" },
];

interface FooterProps {
  // Resolved by SiteLayout from GET /api/config/public. Default covers the
  // case where the admin hasn't uploaded a CMS logo for this locale yet.
  logoDark?: string;
  // Social profile URLs from the CMS config. Only filled entries are rendered.
  socials?: Partial<Record<SocialKey, string | undefined>>;
}

export default async function Footer({
  logoDark = "/logo.png",
  socials,
}: FooterProps = {}) {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  const socialLinks = SOCIAL_ORDER.map(({ key, label }) => ({
    label,
    href: socials?.[key]?.trim(),
    icon: SOCIAL_ICONS[key],
  })).filter((s): s is { label: string; href: string; icon: React.ReactNode } =>
    Boolean(s.href),
  );

  const footerColumns = [
    {
      title: t("company"),
      links: [
        { label: t("about"), href: "/sobre" },
        { label: t("products"), href: "/produtos" },
        { label: t("support"), href: "/suporte" },
        { label: t("warranty"), href: "/suporte" },
      ],
    },
    {
      title: t("products"),
      links: [
        { label: t("allProducts"), href: "/produtos" },
        { label: t("amplifiers"), href: "/produtos?category=amplificadores" },
        { label: t("processors"), href: "/produtos?category=processadores" },
        { label: t("controllers"), href: "/produtos?category=controles" },
        { label: t("accessories"), href: "/produtos?category=acessorios" },
      ],
    },
    {
      title: t("support"),
      links: [
        { label: t("helpCenter"), href: "/suporte" },
        { label: t("warranty"), href: "/suporte" },
        { label: t("manuals"), href: "/suporte" },
        { label: t("authorizedCenters"), href: "/suporte" },
        { label: t("contact"), href: "/suporte" },
      ],
    },
  ];

  const copyrightLinks = [
    { label: t("privacyPolicy"), href: "#" },
    { label: t("termsOfUse"), href: "#" },
    { label: t("cookies"), href: "#" },
  ];

  return (
    <footer className="bg-footer">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-9 px-5 py-6 lg:px-42.5">
        <div className="flex flex-col gap-9 lg:flex-row lg:flex-wrap lg:justify-between">
          <div className="max-w-63.25">
            <Logo
              src={logoDark}
              width={160}
              height={49}
              className="object-contain"
            />
            <p className="mt-4 text-sm text-text-subtle-dark">
              {t("description")}
            </p>

            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded border border-white/10 text-text-subtle-dark transition-colors hover:text-white"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerColumns.map(({ title, links }) => (
            <div key={title} className="flex min-w-32 flex-col gap-3">
              <span className="mb-1 font-sans text-base font-medium text-white uppercase">
                {title}
              </span>
              {links.map(({ label, href }) => (
                <Link
                  key={label || href}
                  href={href}
                  className="text-base text-text-subtle-dark transition-colors hover:text-white hover:underline"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <span className="text-sm font-medium text-text-subtle-dark">
            {t("copyright", { year })}
          </span>

          <div className="flex flex-wrap items-center gap-y-1 text-sm font-medium text-text-subtle-dark">
            {copyrightLinks.map(({ label, href }, index) => (
              <div key={label} className="flex items-center">
                {index > 0 ? <span className="px-2">|</span> : null}
                <Link
                  href={href}
                  className="transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
