import Image from "next/image";
import Link from "next/link";

const COLS = [
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "/sobre" },
      { label: "Produtos", href: "/produtos" },
      { label: "Suporte", href: "/suporte" },
      { label: "Garantia", href: "/garantia" },
    ],
  },
  {
    title: "Produtos",
    links: [
      { label: "Todos", href: "/produtos" },
      { label: "Amplificadores", href: "/produtos" },
      { label: "Processadores", href: "/produtos" },
      { label: "Acessórios", href: "/produtos" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "/suporte" },
      { label: "Garantia", href: "/garantia" },
      { label: "Manuais", href: "/suporte" },
      { label: "Contato", href: "/suporte" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidade", href: "/privacidade" },
      { label: "Termos de uso", href: "/termos" },
      { label: "Cookies", href: "/privacidade" },
      { label: "", href: "/" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    icon: (
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
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 5.924c-.63.28-1.307.47-2.017.556a3.52 3.52 0 0 0 1.547-1.944 7.017 7.017 0 0 1-2.23.852A3.506 3.506 0 0 0 12.07 8.5c0 .275.03.543.09.799A9.966 9.966 0 0 1 3.11 4.87a3.504 3.504 0 0 0 1.084 4.68 3.47 3.47 0 0 1-1.588-.438v.044a3.506 3.506 0 0 0 2.81 3.437 3.6 3.6 0 0 1-.923.123c-.225 0-.444-.02-.657-.062a3.51 3.51 0 0 0 3.274 2.433A7.03 7.03 0 0 1 2 18.407 9.93 9.93 0 0 0 7.29 20c6.513 0 10.075-5.395 10.075-10.075 0-.153-.004-.305-.01-.456A7.2 7.2 0 0 0 22 5.924z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
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
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 3h2.5a4.5 4.5 0 0 1 0 9H16v6.5A4.5 4.5 0 0 1 11.5 23 4.5 4.5 0 0 1 7 18.5V9h2v9.5A2.5 2.5 0 0 0 11.5 21 2.5 2.5 0 0 0 14 18.5V12h4.5a2.5 2.5 0 0 0 0-5H16V3z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[rgb(17,17,17)] pt-12 pb-6">
      <div className="px-8 lg:px-24 max-w-[1440px] mx-auto">
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8">
            <div className="max-w-[253px] shrink-0">
              <Image
                src="/brand-image.png"
                alt="Stetsom"
                width={160}
                height={49}
                className="mb-4 object-contain"
              />
              <p className="text-sm leading-5 text-[rgb(133,133,133)]">
                Potência sem limite desde 1989. Fabricamos os melhores
                amplificadores automotivos do Brasil.
              </p>

              <div className="mt-4 flex items-center gap-3">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded border border-[rgb(44,44,44)] flex items-center justify-center text-[rgb(133,133,133)] hover:text-white transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="w-full">
              <div className="block lg:hidden border-t border-[rgb(44,44,44)] my-6" />

              <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-4">
                {COLS.map(({ title, links }) => (
                  <div key={title} className="flex flex-col gap-3">
                    <span className="font-sans-condensed font-bold text-sm uppercase text-white mb-1">
                      {title}
                    </span>
                    {links.map(({ label, href }) => (
                      <Link
                        key={label || href}
                        href={href}
                        className="text-sm text-[rgb(133,133,133)] hover:text-white transition-colors"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgb(44,44,44)] pt-5 flex flex-col-reverse items-center gap-2 md:flex-row md:justify-between">
          <span className="text-[13px] text-[rgb(86,86,86)]">
            © 2024 Stetsom. Todos os direitos reservados.
          </span>
          <span className="text-[13px] text-[rgb(86,86,86)]">
            @stetsombrasil
          </span>
        </div>
      </div>
    </footer>
  );
}
