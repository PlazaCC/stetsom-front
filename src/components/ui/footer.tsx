import Image from "next/image"
import Link from "next/link"

const COLS = [
  {
    title: "Produtos",
    links: [
      { label: "Amplificadores", href: "/produtos" },
      { label: "Módulos", href: "/produtos" },
      { label: "Subwoofers", href: "/produtos" },
      { label: "Acessórios", href: "/produtos" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "/sobre" },
      { label: "Suporte", href: "/suporte" },
      { label: "Garantia", href: "/garantia" },
      { label: "Distribuidores", href: "/suporte" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de Ajuda", href: "/suporte" },
      { label: "Política de Privacidade", href: "/privacidade" },
      { label: "Termos de Uso", href: "/termos" },
      { label: "Contato", href: "/suporte" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-[rgb(17,17,17)] pt-12 pb-6">
      <div className="px-8 lg:px-24 max-w-[1440px] mx-auto">
        <div className="flex justify-between mb-10 gap-12">
          <div className="max-w-[253px] shrink-0">
            <Image
              src="/brand-image.png"
              alt="Stetsom"
              width={160}
              height={49}
              className="mb-4 object-contain"
            />
            <p className="text-sm leading-5 text-[rgb(133,133,133)]">
              Potência sem limite desde 1989. Fabricamos os melhores amplificadores
              automotivos do Brasil.
            </p>
          </div>
          {COLS.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="font-sans-condensed font-bold text-sm uppercase text-white mb-1">
                {title}
              </span>
              {links.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm text-[rgb(133,133,133)] hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-[rgb(44,44,44)] pt-5 flex justify-between items-center">
          <span className="text-[13px] text-[rgb(86,86,86)]">
            © 2024 Stetsom. Todos os direitos reservados.
          </span>
          <span className="text-[13px] text-[rgb(86,86,86)]">@stetsombrasil</span>
        </div>
      </div>
    </footer>
  )
}
