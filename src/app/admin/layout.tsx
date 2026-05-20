import Link from "next/link";
import { Barlow, Barlow_Condensed, Geist_Mono } from "next/font/google";
import {
  LayoutDashboard,
  Package,
  Image,
  BookOpen,
  MessageSquare,
  Settings,
  History,
  Lock,
} from "lucide-react";
import QueryProvider from "@/components/query-provider";

const barlow = Barlow({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/biblioteca", label: "Biblioteca", icon: BookOpen },
  {
    href: "/admin/mensagens",
    label: "Central de Mensagens",
    icon: MessageSquare,
  },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/historico", label: "Histórico", icon: History },
  { href: "/admin/login", label: "Autenticação", icon: Lock },
] as const;

export default function AdminLayout({ children }: Readonly<AdminLayoutProps>) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${barlowCondensed.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <QueryProvider>
          <div className="flex min-h-screen">
            <aside className="w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground">
              <div className="px-4 py-5">
                <span className="font-sans-condensed text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Stetsom CMS
                </span>
              </div>
              <nav className="px-2 pb-4">
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </aside>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
