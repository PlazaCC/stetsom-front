"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { useState, useEffect } from "react";

function PanelLayout({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o drawer ao mudar de rota
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar onMenuClick={() => setNavOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-background px-4 py-4 lg:px-11.75 lg:py-7.25">
          {children}
        </main>
      </div>
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return isLoginPage ? <>{children}</> : <PanelLayout>{children}</PanelLayout>;
}
