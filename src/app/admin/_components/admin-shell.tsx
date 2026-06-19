"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { useState, useEffect } from "react";
import { AdminShellHeader } from "./admin-shell-header";
import { AdminRouteMetaProvider } from "./admin-route-meta";
import { resolveRoute } from "@/lib/cms/resolve-route";
import { TooltipProvider } from "@/components/ui/tooltip";

function PanelLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();
  const route = resolveRoute(pathname);
  const showSidebar = route?.showSidebar !== false;

  // Fecha o drawer ao mudar de rota
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <TooltipProvider>
      <AdminRouteMetaProvider>
        <div className="flex h-screen overflow-hidden">
          {showSidebar && (
            <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />
          )}
          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminTopbar onMenuClick={() => setNavOpen(true)} />

            <main className="flex flex-1 flex-col overflow-hidden bg-background">
              <AdminShellHeader />
              {children}
            </main>
          </div>
        </div>
      </AdminRouteMetaProvider>
    </TooltipProvider>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return isLoginPage ? <>{children}</> : <PanelLayout>{children}</PanelLayout>;
}
